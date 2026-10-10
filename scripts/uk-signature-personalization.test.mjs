import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { applyExtendedRefreshAdapter } from './lib/client-refresh-six.mjs';

const root=path.resolve(import.meta.dirname,'..');
const pin='cc130e432a41a3a60cc80bc2b3461c6416893b4a';
const prefix='templates/karento-best/';
const contact='karento-best/src/lib/components/contact/ContactLocationCard.svelte';
const desktop='karento-best/src/lib/components/contact/DesktopContactLocationCard.svelte';
const require=createRequire(path.join(root,'templates/karento-best/package.json'));
const compiler=require('svelte/compiler'),ts=require('typescript');
const batch=JSON.parse(fs.readFileSync(path.join(root,'leads/uk-2026-10-10-build-manifest.json'),'utf8'));
assert.equal(batch.sourceReleases['karento-best'].revision,pin);

// Read only the 2.3 MB approved source in memory. Never materialize a dealer or
// read the changing template checkout to decide which boundary this test covers.
function pinnedSource() {
  const names=execFileSync('git',['ls-tree','-r','--name-only',pin,'--',prefix+'src',prefix+'package.json'],
    {cwd:root,encoding:'utf8'}).trim().split('\n');
  const bytes=execFileSync('git',['cat-file','--batch'],{
    cwd:root,input:names.map(name=>pin+':'+name).join('\n')+'\n',maxBuffer:8*1024*1024
  });
  const files=new Map();let offset=0;
  for(const name of names) {
    const end=bytes.indexOf(10,offset),header=bytes.subarray(offset,end).toString();
    assert.match(header,/^[a-f0-9]{40} blob \d+$/);
    const length=Number(header.split(' ')[2]),start=end+1;
    files.set(name.replace(/^templates\//,''),Buffer.from(bytes.subarray(start,start+length)));
    offset=start+length+1;
  }
  assert.equal(offset,bytes.length);
  return files;
}
const approved=pinnedSource();
const inputText=approved.get(contact).toString('utf8');
const fields=['address','phone','email'];
const tightened=fields.reduce((source,field)=>source.replace(
  '{#if !phone.current || location.'+field+'}','{#if location.'+field+'}'),inputText);

function personalize(entry,profileOverride) {
  const client=path.join(root,entry.brief);
  const profile=profileOverride??loadDealerProfile(client,entry.slug);
  const before=JSON.stringify(profile),files=new Map(approved);
  const adaptation=applyExtendedRefreshAdapter({files,key:'karento-best',profile,client});
  assert.equal(JSON.stringify(profile),before,'adapter must not mutate factual input');
  return {files,profile,adaptation};
}
function dealerFrom(files) {
  const source=files.get('karento-best/src/lib/content.ts').toString('utf8');
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});
  const exports={};vm.runInNewContext(output.outputText,{exports});
  return exports.dealer;
}
function nodesOfType(node,type,out=[]) {
  if(!node||typeof node!=='object')return out;
  if(node.type===type)out.push(node);
  for(const value of Object.values(node)) {
    if(Array.isArray(value))for(const child of value)nodesOfType(child,type,out);
    else if(value&&typeof value==='object')nodesOfType(value,type,out);
  }
  return out;
}

test('all ten factual UK packs personalize the complete approved Signature source',()=>{
  assert.equal(batch.dealers.length,10);
  for(const entry of batch.dealers) {
    const {files,profile,adaptation}=personalize(entry);
    assert.equal(adaptation.nativeFacts,true,entry.slug);
    assert.equal(files.get(contact).toString('utf8'),tightened,entry.slug);
    assert.deepEqual(files.get(desktop),approved.get(desktop),'native desktop links and guards remain intact');
    const dealer=dealerFrom(files),location=dealer.locations[0];
    assert.equal(dealer.name,profile.business.name);
    assert.equal(dealer.contacts.email,profile.business.email);
    assert.equal(location.email,profile.business.email);
    assert.equal(location.emailHref,profile.business.email?'mailto:'+profile.business.email:'');
    assert.equal(location.phone,profile.business.phoneDisplay);
    assert.equal(location.phoneHref,profile.business.phoneHref);
    assert.equal(location.address,profile.business.address);
    assert.equal(dealer.copy['inventory.notice'],profile.business.inventoryNotice);
    const inventory=JSON.parse(files.get('karento-best/src/lib/data/dealer-vehicles.json'));
    assert.equal(inventory.length,profile.listings.length);
    for(const [index,item] of inventory.entries()) {
      assert.equal(item.id,profile.listings[index].id);
      assert.equal(item.priceAmount,profile.listings[index].priceAmount);
      assert.equal(item.currency,'GBP');
      assert.equal(item.mileageValue,profile.listings[index].mileageValue);
      assert.equal(item.mileageUnit,'mi');
      assert.match(item.description,/Illustration.*not the advertised vehicle/);
      for(const image of item.images)assert.ok(files.has('karento-best/static'+image),image);
    }
    // This includes the discovery adaptation, which the failed first run had
    // not reached when its contact boundary rejected the new approved source.
    assert.ok(adaptation.contentPaths.includes('karento-best/src/routes/2/discovery.ts'));
  }
  assert.equal(approved.get(contact).toString('utf8'),inputText);
});

test('approved phone and tablet contact branches omit unknown fields and retain published fields',()=>{
  const entry=batch.dealers.find(item=>item.slug==='stockport-broadbent-car-and-servicing');
  const full=personalize(entry),emptyProfile=structuredClone(full.profile);
  Object.assign(emptyProfile.business,{email:'',phoneE164:'',phoneHref:'',phoneDisplay:'',address:''});
  const missing=personalize(entry,emptyProfile),missingDealer=dealerFrom(missing.files);
  assert.equal(missingDealer.locations[0].emailHref,'');
  assert.equal(missingDealer.locations[0].phoneHref,'');
  assert.equal(missingDealer.locations[0].address,'');
  const source=missing.files.get(contact).toString('utf8');
  assert.equal(source,tightened);
  assert.doesNotThrow(()=>compiler.compile(source,{filename:contact,generate:'client'}));
  assert.doesNotThrow(()=>compiler.compile(source,{filename:contact,generate:'server'}));
  const ast=compiler.parse(source,{modern:true}),blocks=nodesOfType(ast,'IfBlock');
  for(const field of fields) {
    const candidates=blocks.filter(block=>source.slice(block.test.start,block.test.end)==='location.'+field);
    assert.equal(candidates.length,1,'one optional '+field+' boundary');
    const expression=source.slice(candidates[0].test.start,candidates[0].test.end);
    for(const isPhone of [true,false]) {
      assert.equal(Boolean(vm.runInNewContext(expression,{location:missingDealer.locations[0],phone:{current:isPhone}})),false);
      assert.equal(Boolean(vm.runInNewContext(expression,{location:dealerFrom(full.files).locations[0],phone:{current:isPhone}})),true);
    }
  }
});

test('duplicate or drifted approved native contact guards stay a hard failure',()=>{
  const entry=batch.dealers.find(item=>item.slug==='stockport-broadbent-car-and-servicing');
  const client=path.join(root,entry.brief),profile=loadDealerProfile(client,entry.slug);
  for(const changed of [
    inputText.replace('{#if !phone.current || location.email}','{#if !phone.current || location.email}{#if !phone.current || location.email}'),
    inputText.replace('{#if !phone.current || location.phone}','{#if !phone.current || location.phoneHref}'),
    inputText.replace('{#if !phone.current || location.email}','{#if true || location.email}')
  ]) {
    const files=new Map(approved);files.set(contact,Buffer.from(changed));
    assert.throws(()=>applyExtendedRefreshAdapter({files,key:'karento-best',profile,client}),/Reviewed dealer consumer changed: Signature optional (?:phone|email) native contact row/);
  }
});

function moduleFrom(source,imports={}) {
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.CommonJS}});
  const exports={};
  vm.runInNewContext(output.outputText,{exports,URL,URLSearchParams,require:name=>{
    if(!Object.hasOwn(imports,name))throw new Error('Unexpected runtime import: '+name);
    return imports[name];
  }});
  return exports;
}
function discoveryFrom(files) {
  const catalog=moduleFrom(files.get('karento-best/src/lib/data/mobile-catalog.ts').toString('utf8'));
  return moduleFrom(files.get('karento-best/src/routes/2/discovery.ts').toString('utf8'),{'#lib/data/mobile-catalog.ts':catalog});
}
function checkDiscoveryTypes(files) {
  const virtual=path.resolve(root,'runtime/signature-typecheck-virtual').replaceAll('\\','/');
  const mapped=new Map([...files].map(([name,bytes])=>[virtual+'/'+name,bytes.toString('utf8')]));
  const options={strict:true,noEmit:true,target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.ESNext,
    moduleResolution:ts.ModuleResolutionKind.Bundler,allowImportingTsExtensions:true,resolveJsonModule:true,
    skipLibCheck:true,types:[],paths:{'#lib/*':[virtual+'/karento-best/src/lib/*']}};
  const host=ts.createCompilerHost(options),originalRead=host.readFile,originalExists=host.fileExists,originalDir=host.directoryExists;
  const normalize=file=>path.resolve(file).replaceAll('\\','/');
  host.readFile=file=>mapped.get(normalize(file))??originalRead(file);
  host.fileExists=file=>mapped.has(normalize(file))||originalExists(file);
  host.directoryExists=directory=>[...mapped.keys()].some(name=>name.startsWith(normalize(directory)+'/'))||originalDir(directory);
  const target=virtual+'/karento-best/src/routes/2/discovery.ts';
  const program=ts.createProgram([target],options,host),source=program.getSourceFile(target);
  const errors=[...program.getSyntacticDiagnostics(source),...program.getSemanticDiagnostics(source)];
  assert.deepEqual(errors.map(error=>ts.flattenDiagnosticMessageText(error.messageText,' ')),[]);
}

test('approved discovery filters keep real GBP prices, years, body types and disclosures for every UK pack',()=>{
  for(const entry of batch.dealers) {
    const {files,profile}=personalize(entry),discovery=discoveryFrom(files);
    assert.equal(discovery.discoveryCars.length,profile.listings.length);
    for(const [index,car] of discovery.discoveryCars.entries()) {
      const listing=profile.listings[index];
      assert.equal(car.year,listing.year);
      assert.equal(car.priceAmount,listing.priceAmount);
      assert.equal(car.currency,'GBP');
      assert.equal(car.body,listing.bodyType||'');
      assert.equal(car.offer,false);
      assert.equal(car.exclusive,false);
    }
    for(const locale of ['en','bg'])for(const key of ['sample','sampleDetail'])
      assert.equal(discovery.discoveryText(locale,key),profile.business.inventoryNotice);
    assert.equal(discovery.discoveryText('en','maximumPrice'),'Maximum price (GBP)');
    assert.match(discovery.discoveryText('en','under10'),/\u00a3/);
    assert.doesNotMatch(files.get('karento-best/src/routes/2/discovery.ts').toString('utf8'),/\u20ac|illustrative sale prices|dealer\.stock\.notice/);
    assert.doesNotMatch(files.get('karento-best/src/routes/2/DiscoverySearch.svelte').toString('utf8'),/"EUR"/);
    const budget=profile.listings[Math.floor(profile.listings.length/2)].priceAmount;
    const filters={...discovery.emptyDiscoveryFilters,priceMax:String(budget)};
    assert.deepEqual([...discovery.searchCars('',filters)].map(car=>car.id),
      profile.listings.filter(car=>car.priceAmount<=budget).map(car=>car.id));
    assert.deepEqual([...discovery.collectionCars('cheapest')].map(car=>car.id),
      [...profile.listings].sort((a,b)=>a.priceAmount-b.priceAmount).map(car=>car.id));
    const year=profile.listings[0].year;
    assert.deepEqual([...discovery.searchCars('',{...discovery.emptyDiscoveryFilters,yearFrom:String(year),yearTo:String(year)})].map(car=>car.id),
      profile.listings.filter(car=>car.year===year).map(car=>car.id));
  }
  const {files}=personalize(batch.dealers.find(item=>item.slug==='stockport-broadbent-car-and-servicing'));
  checkDiscoveryTypes(files);
  for(const file of [contact,'karento-best/src/routes/2/DiscoveryHome.svelte','karento-best/src/routes/2/DiscoverySearch.svelte'])
    assert.doesNotThrow(()=>compiler.compile(files.get(file).toString('utf8'),{filename:file,generate:'client'}));
});

test('approved inline discovery rejects unavailable mandatory facts, mixed currencies and changed contracts',()=>{
  const entry=batch.dealers.find(item=>item.slug==='stockport-broadbent-car-and-servicing');
  const profile=loadDealerProfile(path.join(root,entry.brief),entry.slug);
  for(const patch of [{priceAmount:null},{year:null},{currency:'EUR'}]) {
    const changed=structuredClone(profile);Object.assign(changed.listings[0],patch);
    assert.throws(()=>personalize(entry,changed),/Signature inline discovery requires published numeric price\/year and one inventory currency/);
  }
  const files=new Map(approved),file='karento-best/src/routes/2/discovery.ts';
  files.set(file,Buffer.from(files.get(file).toString('utf8').replace('  year: number;','  year: string;')));
  assert.throws(()=>applyExtendedRefreshAdapter({files,key:'karento-best',profile,client:path.join(root,entry.brief)}),/Signature discovery requires a reviewed factual data and text boundary/);
});
