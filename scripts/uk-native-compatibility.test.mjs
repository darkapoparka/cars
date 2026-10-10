import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {UK_MODERN_CITY_PATHS, UK_IMPORT_PHONE_PATHS, UK_IMPORT_PHONE_INPUT_PATHS,
  repairModernUkCityKeys, repairImportUkOptionalPhone} from './lib/client-refresh-uk-native.mjs';

const root=path.resolve(import.meta.dirname,'..');
const env={...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'};
const modernPin='827d75b9a53666c6feb09f04e3f8e7f255e95a30';
const retained='643440c58ff7e11241f06c4e39a31d22633c50c9';
const asSlug='batley-as-motor-group';
const cache=new Map(), sha=b=>createHash('sha256').update(b).digest('hex');
const str=b=>Buffer.isBuffer(b)?b.toString('utf8'):b;
const git=args=>execFileSync('git',['-C',root,...args],{env,encoding:'utf8',timeout:10000,maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']}).trimEnd();
function at(commit,name) {
  const key=commit+':'+name;
  if(!cache.has(key)) {
    const blob=git(['rev-parse',key]);
    const retainedFile=path.join(root,'runtime/uk-native-compatibility-20261010/source-'+blob+'.txt');
    const bytes=fs.existsSync(retainedFile)?fs.readFileSync(retainedFile):
      execFileSync('git',['-C',root,'show',key],{env,timeout:10000,maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']});
    assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),blob,
      'actual source blob hash: '+key);
    cache.set(key,bytes.toString('utf8').replace(/\r\n/g,'\n'));
  }
  return cache.get(key);
}
const batch=JSON.parse(fs.readFileSync(path.join(root,'leads/uk-2026-10-10-build-manifest.json'),'utf8'));
const profiles=batch.dealers.map(d=>loadDealerProfile(path.join(root,d.brief),d.slug));
const asProfile=profiles.find(p=>p.slug===asSlug);
assert.ok(asProfile);
const beforeProfiles=JSON.stringify(profiles);
const familyMap=(slug,family,names,commit=retained)=>new Map(names.map(name=>
  [name,Buffer.from(at(commit,'clients/'+slug+'/'+family+'/'+name))]));
const originalImport=()=>familyMap(asSlug,'import',UK_IMPORT_PHONE_INPUT_PATHS);
const removeImports=source=>source.replace(/^import[\s\S]*?;\n/gm,'');
const jsUrl=source=>'data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source,{disableExperimentalWarning:true})).toString('base64');
const loadTs=source=>import(jsUrl(source));
const ts=createRequire(path.join(root,'templates/mobile/package.json'))('typescript');
const compiler=createRequire(path.join(root,'templates/import/package.json'))('svelte/compiler');
function parseTs(source,name) {
  const file=ts.createSourceFile(name,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  assert.deepEqual(file.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),[],name+' syntax');
}
const importFixed=originalImport(), importBefore=new Map([...importFixed].map(([name,b])=>[name,Buffer.from(b)]));
const changedImport=repairImportUkOptionalPhone(importFixed,asProfile);

test('all ten factual cities compile and execute in both actual Modern native localization maps',async()=>{
  let cases=0;
  for(const profile of profiles) {
    const city=profile.business.city;
    const files=new Map(UK_MODERN_CITY_PATHS.map(name=>[name,
      at(modernPin,'templates/modern/'+name).replaceAll('София',city).replaceAll('Sofia',city)]));
    const before=new Map(files);
    assert.deepEqual(repairModernUkCityKeys(files,profile),UK_MODERN_CITY_PATHS);
    for(const name of UK_MODERN_CITY_PATHS) {
      const source=str(files.get(name));
      assert.equal(source,before.get(name).replace('  '+city+': '+JSON.stringify(city)+',',
        '  '+JSON.stringify(city)+': '+JSON.stringify(city)+','));
      parseTs(source,name);
    }
    const copy=await loadTs(removeImports(str(files.get(UK_MODERN_CITY_PATHS[1]))));
    assert.equal(copy.getLocalizedMarketplaceCityName(city,'en'),city);
    assert.equal(copy.getLocalizedMarketplaceCityName(city,'bg'),city);
    const business=profile.business;
    const leadSite={city,country:business.country,district:{bg:business.region,en:business.region}};
    const truth=await loadTs('const leadSite='+JSON.stringify(leadSite)+';\n'+
      'const getLeadCopy=()=>('+JSON.stringify({city,country:business.country})+');\n'+
      removeImports(str(files.get(UK_MODERN_CITY_PATHS[0]))));
    assert.equal(truth.formatVehicleLocation({city},'en'),city);
    assert.equal(truth.formatVehicleLocation({city},'bg'),city);
    cases++;
  }
  assert.equal(cases,10);
  assert.equal(profiles.reduce((n,p)=>n+p.listings.length,0),71);
  assert.equal(JSON.stringify(profiles),beforeProfiles);
});

test('actual retained Modern source reproduces AS syntax failure and Broadbent undefined shorthand before repair',async()=>{
  const asFiles=familyMap(asSlug,'modern',UK_MODERN_CITY_PATHS);
  assert.throws(()=>stripTypeScriptTypes(str(asFiles.get(UK_MODERN_CITY_PATHS[0]))),/Unexpected|Expected/);
  assert.deepEqual(repairModernUkCityKeys(asFiles,asProfile),UK_MODERN_CITY_PATHS);
  assert.ok([...asFiles.values()].every(Buffer.isBuffer));
  const broad=profiles.find(p=>p.slug==='stockport-broadbent-car-and-servicing');
  const broadFiles=familyMap(broad.slug,'modern',UK_MODERN_CITY_PATHS);
  await assert.rejects(loadTs(removeImports(str(broadFiles.get(UK_MODERN_CITY_PATHS[1])))),/Bredbury is not defined/);
  repairModernUkCityKeys(broadFiles,broad);
  const fixed=await loadTs(removeImports(str(broadFiles.get(UK_MODERN_CITY_PATHS[1]))));
  assert.equal(fixed.getLocalizedMarketplaceCityName(broad.business.city,'bg'),broad.business.city);
});

test('Modern city repair rejects unexpected maps atomically and does not touch other markets',()=>{
  const files=familyMap(asSlug,'modern',UK_MODERN_CITY_PATHS);
  files.set(UK_MODERN_CITY_PATHS[1],Buffer.from(str(files.get(UK_MODERN_CITY_PATHS[1])).replace('const cityLabelsBg:','const otherCityLabels:')));
  const snapshot=[...files].map(([n,b])=>[n,Buffer.from(b)]);
  assert.throws(()=>repairModernUkCityKeys(files,asProfile),/boundary changed/);
  assert.deepEqual([...files],snapshot);
  assert.deepEqual(repairModernUkCityKeys(files,{...asProfile,business:{...asProfile.business,countryCode:'BG'}}),[]);
  assert.deepEqual([...files],snapshot);
});

async function actualImportSite(siteSource) {
  const cars=at(retained,'clients/'+asSlug+'/import/src/lib/config/cars-locale.ts');
  const dealer=removeImports(at(retained,'clients/'+asSlug+'/import/src/lib/config/dealer.ts'));
  return loadTs(cars+'\n'+dealer+'\n'+removeImports(siteSource));
}
test('actual AS Import module rejects its absent phone before repair and accepts the same factual contact afterward',async()=>{
  await assert.rejects(actualImportSite(str(importBefore.get('src/lib/config/site.ts'))),/valid telephone link/);
  const actual=await actualImportSite(str(importFixed.get('src/lib/config/site.ts')));
  assert.equal(actual.site.contact.phone,'');
  assert.equal(actual.site.contact.phoneHref,'');
  assert.equal(actual.site.contact.contactHref,asProfile.business.contactUrl||asProfile.business.inventoryUrl);
  assert.deepEqual(changedImport,[...UK_IMPORT_PHONE_PATHS]);
  assert.deepEqual(importFixed.get('src/lib/config/dealer.ts'),importBefore.get('src/lib/config/dealer.ts'));
  assert.ok([...importFixed.values()].every(Buffer.isBuffer));
  assert.equal(JSON.stringify(profiles),beforeProfiles);
  const source=str(importFixed.get('src/lib/content/contact-desktop.ts'));
  parseTs(source,'contact-desktop.ts');
  const channels=await loadTs('const daynightAssets={contactPhoneBanner:"phone",contactVisitBanner:"visit",contactMessageBanner:"message"};\n'+
    'const dealerCopy={en:{address:'+JSON.stringify(asProfile.business.address)+'},bg:{address:'+JSON.stringify(asProfile.business.address)+'}};\n'+removeImports(source));
  for(const locale of ['en','bg']) {
    const rows=channels.desktopContactChannels(actual.site,locale);
    assert.deepEqual(rows.map(r=>r.kind),['visit','message']);
    assert.equal(rows[0].href,actual.site.contact.mapHref);
    assert.equal(rows[1].href,actual.site.contact.messageHref);
    assert.equal(rows[1].text,channels.contactDesktopCopy[locale].message);
    const withPhone=structuredClone(actual.site);
    withPhone.contact.phone='01263 653055';withPhone.contact.phoneHref='tel:+441263653055';
    assert.deepEqual(channels.desktopContactChannels(withPhone,locale).map(r=>r.kind),['phone','visit','message']);
  }
});

test('all ten existing factual profiles satisfy the remaining actual Import schema without invented contacts',async()=>{
  const actual=await actualImportSite(str(importFixed.get('src/lib/config/site.ts')));
  let present=0,absent=0;
  for(const profile of profiles) {
    const b=profile.business,config=structuredClone(actual.site);
    config.identity.name=b.name;config.identity.displayName=b.name.toUpperCase();
    config.identity.origin='https://'+new URL(b.website||b.inventoryUrl).hostname;
    config.theme.accent=b.accent;
    config.contact={phone:b.phoneDisplay,phoneHref:b.phoneHref,
      messageHref:b.phoneE164?'viber://chat?number='+encodeURIComponent(b.phoneE164):(b.contactUrl||b.inventoryUrl),
      address:b.address,contactHref:b.email?'mailto:'+b.email:(b.contactUrl||b.inventoryUrl),appointment:b.hours,
      mapHref:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(b.address)};
    config.locale={...config.locale,default:'en',supported:['en','bg'],country:b.countryCode,currency:b.currency};
    const snapshot=JSON.stringify(config);
    assert.equal(actual.validateSiteConfig(config),config,profile.slug);
    assert.equal(JSON.stringify(config),snapshot);
    if(b.phoneHref)present++;else absent++;
  }
  assert.equal(present,3);assert.equal(absent,7);
  for(const contact of [
    {phone:'',phoneHref:'tel:+441263653055'},
    {phone:'01263 653055',phoneHref:''},
    {phone:'01263 653055',phoneHref:'javascript:alert(1)'},
    {phone:'   ',phoneHref:'tel:+441263653055'}
  ]) assert.throws(()=>actual.validateSiteConfig({...actual.site,contact:{...actual.site.contact,...contact}}),/published telephone/);
  for(const mutate of [
    c=>c.identity.origin='http://example.test',
    c=>c.theme.accent='red',
    c=>c.contact.messageHref='javascript:alert(1)',
    c=>c.contact.contactHref='https://user:pass@example.test',
    c=>c.locale.currency='XYZ'
  ]) {const config=structuredClone(actual.site);mutate(config);assert.throws(()=>actual.validateSiteConfig(config));}
  assert.equal(JSON.stringify(profiles),beforeProfiles);
});

test('every changed native Svelte consumer compiles for client/server and telephone actions are inside optional branches',()=>{
  let components=0,guards=0;
  const phone=/phoneHref|primaryPhoneHref|mobileShowroomPhoneHref|sidebar\.callHref|primaryPhoneLabel/;
  for(const name of changedImport.filter(n=>n.endsWith('.svelte'))) {
    const source=str(importFixed.get(name));
    for(const generate of ['client','server']) compiler.compile(source,{filename:name,generate,css:'external'});
    const ast=compiler.parse(source,{modern:true});
    function visit(node,parents=[]) {
      if(!node||typeof node!=='object')return;
      if(['RegularElement','Component'].includes(node.type)&&['a','Action','MobileMenuAction'].includes(node.name)) {
        const opening=source.slice(node.start,Math.min(node.end,source.indexOf('>',node.start)+1));
        const body=source.slice(node.start,node.end);
        const isPhone=(name.endsWith('/SiteFooter.svelte')?body:opening).match(phone);
        if(isPhone) {
          assert.ok(parents.some(p=>p.type==='IfBlock'&&phone.test(source.slice(p.test.start,p.test.end))),name+' telephone action has an actual optional condition');
          guards++;
        }
      }
      for(const [key,value]of Object.entries(node)) {
        if(['loc','metadata','parent','start','end'].includes(key))continue;
        if(Array.isArray(value))value.forEach(child=>visit(child,[...parents,node]));
        else if(value&&typeof value==='object')visit(value,[...parents,node]);
      }
    }
    visit(ast.fragment);
    components++;
  }
  assert.equal(components,23);
  assert.ok(guards>=25,'all reviewed actual phone actions are conditional');
});

test('Import repair is atomic under drift and preserves known-phone/other-market source exactly',()=>{
  const files=originalImport();
  files.set('src/lib/components/contact/ContactLocation.svelte',Buffer.from(str(files.get('src/lib/components/contact/ContactLocation.svelte')).replace('href={site.contact.phoneHref}','href={differentPhone}')));
  const snapshot=[...files].map(([name,b])=>[name,Buffer.from(b)]);
  assert.throws(()=>repairImportUkOptionalPhone(files,asProfile),/boundary changed/);
  assert.deepEqual([...files],snapshot);
  for(const profile of [profiles.find(p=>p.slug==='north-norfolk-car-sales'),
    {...asProfile,business:{...asProfile.business,countryCode:'BG'}}]) {
    assert.deepEqual(repairImportUkOptionalPhone(files,profile),[]);
    assert.deepEqual([...files],snapshot);
  }
  assert.throws(()=>repairImportUkOptionalPhone(importFixed,asProfile),/boundary changed/);
});

test('actual desktop contact return type remains unchanged after optional telephone filtering',()=>{
  const declarations=(source,predicate)=>{
    const ast=ts.createSourceFile('actual-dependency.ts',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
    return ast.statements.filter(s=>predicate(s,ast)).map(s=>s.getText(ast)).join('\n');
  };
  const dependencyPrefix=[
    at(retained,'clients/'+asSlug+'/import/src/lib/config/locale-contract.ts'),
    declarations(at(retained,'clients/'+asSlug+'/import/src/lib/locale/core.ts'),
      s=>ts.isTypeAliasDeclaration(s)&&s.name.text==='Locale'),
    declarations(str(importFixed.get('src/lib/config/site.ts')),
      s=>ts.isTypeAliasDeclaration(s)||ts.isInterfaceDeclaration(s)),
    declarations(str(importFixed.get('src/lib/config/dealer.ts')),
      (s,ast)=>ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>
        ['contactVisitBanner','daynightAssets'].includes(d.name.getText(ast)))),
    at(retained,'clients/'+asSlug+'/import/src/lib/config/dealer-copy.ts')
  ].join('\n')+'\n';
  const name='src/lib/content/contact-desktop.ts';
  const sources=new Map(['before','after'].map((key,i)=>[
    path.join(root,'runtime/uk-native-compatibility-20261010/contact-types-'+key+'.ts'),
    dependencyPrefix+removeImports(str((i?importFixed:importBefore).get(name)))
  ]));
  const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,
    moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,noEmit:true,skipLibCheck:true,types:[]};
  const host=ts.createCompilerHost(options);
  const nativeGetSourceFile=host.getSourceFile.bind(host);
  const nativeFileExists=host.fileExists.bind(host),nativeReadFile=host.readFile.bind(host);
  const virtual=name=>sources.get(path.resolve(name));
  host.getSourceFile=(name,languageVersion,onError,shouldCreateNewSourceFile)=>
    virtual(name)!==undefined?ts.createSourceFile(name,virtual(name),languageVersion,true):
      nativeGetSourceFile(name,languageVersion,onError,shouldCreateNewSourceFile);
  host.fileExists=name=>virtual(name)!==undefined||nativeFileExists(name);
  host.readFile=name=>virtual(name)??nativeReadFile(name);
  const program=ts.createProgram([...sources.keys()],options,host);
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')),[]);
  const checker=program.getTypeChecker();
  const inferred=[];
  for(const filename of sources.keys()) {
    const file=program.getSourceFile(filename);
    const fn=file.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text==='desktopContactChannels');
    assert.ok(fn&&!fn.type,'actual native function has no contextual return annotation');
    const result=checker.getReturnTypeOfSignature(checker.getSignatureFromDeclaration(fn));
    const row=checker.getIndexTypeOfType(result,ts.IndexKind.Number);
    const kind=checker.getPropertyOfType(row,'kind');
    inferred.push({
      returnType:checker.typeToString(result,fn,ts.TypeFormatFlags.NoTruncation),
      kindType:checker.typeToString(checker.getTypeOfSymbolAtLocation(kind,fn))
    });
  }
  assert.deepEqual(inferred[1],inferred[0],'all inferred channel field types remain identical');
  assert.equal(inferred[0].kindType,'string','native array already infers string before filtering');
});
