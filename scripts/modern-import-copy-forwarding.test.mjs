import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {buildModernDealerInventoryCopy} from './lib/modern-dealer-inventory-copy.mjs';
import {execFileSync} from 'node:child_process';
import {repairImportDealerInventoryCatalog} from './lib/import-dealer-inventory-copy.mjs';
import {readTypeScriptCatalog} from './lib/catalog-literal.mjs';
import {vercelConfiguration} from './package-dealer.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const updater = fs.readFileSync(new URL('./dealer-updates/update-dealer-template.mjs', import.meta.url), 'utf8');
const between = (begin, end) => {
  const start = updater.indexOf(begin), stop = updater.indexOf(end, start);
  assert(start >= 0 && stop > start, 'Maintained function boundary required');
  return updater.slice(start, stop).replace(/^export /gm, '');
};
const source = between('export function assertReviewedModernCopy(', 'export function loadModernCopyReview(')
  + between('const HISTORICAL_IMPORT_QA_PROVENANCE =', '/** A reviewed dealer resolution');
const keys = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'];

function fixture(reviewed) {
  const profile = {slug:'dealer-test', business:{inventoryNotice:'Recorded source text'}, listings:[
    {slug:'own-car', title:'Toyota Prius', description:'Recorded source text', images:['https://example.invalid/stock.jpg']}
  ]};
  const rows = profile.listings.map(item => ({slug:item.slug, description:item.description, images:item.images.map(url => ({url,alt:item.title}))}));
  const value = {schemaVersion:1, kind:'cars-reviewed-modern-bilingual-copy-input', dealer:profile.slug,
    listingCount:1, sourceCommit:'a'.repeat(40), baselineTree:'b'.repeat(40), inputSha256:'c'.repeat(64),
    modernInputRowsSha256:sha256(JSON.stringify(rows)),
    reviewedGeneratorHelper:{path:'scripts/lib/modern-dealer-inventory-copy.mjs', sha256:'cbdbaa28dc07911cfe913b4e627671b6556fc25d3bfe59364e29c5ca5a29072b'},
    review:{reviewedBy:'Focused maintained integration fixture', displayCopyOnly:true, exactSourceDescriptionKeys:true,
      listingFactsUnchanged:true, imageUrlsUnchanged:true, imageAltsPreserved:true, interpolationTokensUnchanged:true},
    reviewedCopy:{'own-car':{sourceDescription:'Recorded source text', en:{description:'Reviewed English text',imageAlts:['Toyota Prius']},
      bg:{description:'Прегледан текст',imageAlts:['Toyota Prius']}}}};
  const calls = [], scratch = new Map(), before = JSON.stringify(profile);
  const dealerRoot = path.resolve('bounded-source-test'), pins = Object.fromEntries(keys.map(key => [key,{targetSource:{key}}]));
  const newBases = Object.fromEntries(keys.map(key => [key,new Map([['consumer.ts',Buffer.from('before')]])]));
  const splitPrefixedTrees = (files, names) => Object.fromEntries(names.map(key => [key,
    new Map([...files].filter(([name]) => name.startsWith(key+'/')).map(([name,bytes]) => [name.slice(key.length+1),bytes]))]));
  const context = vm.createContext({JSON,Error,Number,Buffer,Map,Set,path,sha256,buildModernDealerInventoryCopy,
    process:{env:{}}, fs:{realpathSync:value=>value, mkdtempSync:prefix=>prefix+scratch.size, rmSync:()=>{}},
    writeDirectoryTreeChanges:(root,_old,files)=>scratch.set(root,new Map(files)),
    readDirectoryTree:root=>scratch.get(root),
    applyRefreshAdapter:args=>{calls.push(args);scratch.get(args.candidate).set('consumer.ts',Buffer.from(args.key));},
    retainDealerVariantAssets:()=>{}, splitPrefixedTrees,
    addPrefixedTree:(files,key,part)=>{for(const [name,bytes] of part) files.set(key+'/'+name,bytes);},
    prepareAppDealer:async()=>({files:new Map([['consumer.ts',Buffer.from('app')]]),provenance:{fixture:true}}),
    applyExtendedRefreshAdapter:({files,key})=>{files.set(key+'/consumer.ts',Buffer.from(key));return {fixture:true};},
    renderPins:pin=>pin
  });
  vm.runInContext(source+'\nglobalThis.run = personalizePinnedTargetBases;',context);
  return {calls,profile,before,value,run:()=>context.run({pins,newBases,dealerRoot,manifest:{slug:profile.slug},profile,
    modernCopyReview:reviewed?{path:'reviewed.json',sha256:'d'.repeat(64),value}:null})};
}

test('actual maintained six-family preparation forwards the same reviewed map to Modern and Import',async()=>{
  const f=fixture(true),out=await f.run();
  assert.deepEqual(f.calls.map(x=>x.key),['auto-best','modern','import']);
  assert.equal(f.calls[0].reviewedModernCopy,undefined);
  assert.equal(f.calls[1].reviewedModernCopy,f.value.reviewedCopy);
  assert.equal(f.calls[2].reviewedModernCopy,f.value.reviewedCopy);
  assert.equal(JSON.stringify(f.profile),f.before);
  assert.equal(out.proof.modernCopyReview.sha256,'d'.repeat(64));
});

test('ordinary factual preparation keeps the copy override absent for every adapter',async()=>{
  const f=fixture(false),out=await f.run();
  assert(f.calls.every(x=>!Object.hasOwn(x,'reviewedModernCopy')));
  assert(!Object.hasOwn(out.proof,'modernCopyReview'));
  assert.equal(JSON.stringify(f.profile),f.before);
});

test('maintained Vercel envelope dispatches bare Mobile and App while preserving the other four mounts',()=>{
  for(const order of [['modern','import'],['import','modern']]) {
    const variants=keys.map((key,index)=>({key,base:index?'/'+'variant-'+(index+1):'',entry:index?'/variant-'+(index+1)+'/':'/'}));
    [variants[1].key,variants[2].key]=order;
    for(const variant of variants)if(variant.key==='modern')variant.entry=variant.base+'/cars';
    const out=vercelConfiguration({slug:'dealer-test',packaging:{version:'5'},variants},null);
    for(const [base,service] of [['/variant-5','mobile'],['/variant-4','app']]) {
      assert(!out.redirects.some(row=>row.source===base));
      assert.deepEqual(out.rewrites.find(row=>row.source===base),{source:base,destination:{service,path:base}});
      assert(out.rewrites.some(row=>row.source===base+'/(.*)'&&row.destination.service===service));
    }
    for(const base of ['/variant-2','/variant-3','/variant-6'])assert(out.redirects.some(row=>row.source===base));
    assert.equal(Object.keys(out.services).length,6);
  }
});

test('Bradford immutable eight-listing descriptions retain dates and the Mini bodywork caveat in both native companions',()=>{
  const stockBytes=execFileSync('git',['cat-file','blob','afefe4a692bcf99ce2ff24aaf0368d3c6d8c53f7'],{cwd:path.resolve(import.meta.dirname,'..'),env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'}});
  assert.equal(createHash('sha1').update('blob '+stockBytes.length+'\0').update(stockBytes).digest('hex'),'afefe4a692bcf99ce2ff24aaf0368d3c6d8c53f7');
  const stock=JSON.parse(stockBytes),before=JSON.stringify(stock);
  assert.equal(stock.kind,'dated-listing-snapshot');assert.equal(stock.observedAt,'2026-10-10');assert.equal(stock.records.length,8);
  const modernRows=stock.records.map(row=>({slug:row.slug,description:row.description,images:row.images.map(url=>({url,alt:row.title}))}));
  const copy=buildModernDealerInventoryCopy(modernRows);
  for(const row of modernRows){
    assert.equal(copy[row.slug].sourceDescription,row.description);
    assert.equal(copy[row.slug].en.description,row.description);
    assert.match(copy[row.slug].bg.description,/10 октомври 2026 г\./);
    assert.match(copy[row.slug].bg.description,/Илюстрация — не показва обявения автомобил/);
    assert.match(copy[row.slug].bg.description,/оригиналната обява, цената, състоянието и наличността/);
    assert.deepEqual(copy[row.slug].en.imageAlts,row.images.map(image=>image.alt));
    assert.deepEqual(copy[row.slug].bg.imageAlts,row.images.map(image=>image.alt));
    const bodywork=row.slug==='mini-hatchback-2014-20562332';
    assert.equal(/cosmetic imperfections/.test(copy[row.slug].en.description),bodywork);
    assert.equal(/козметични дефекти по каросерията/.test(copy[row.slug].bg.description),bodywork);
  }
  const source='export const inventoryCopy = { retained: {bg:"Запазен текст",en:"Retained text"} } as const;\nexport const inventorySourceKeys = {"retained":"retained"} as const;\n';
  const feed={listings:stock.records.map(row=>({id:row.id,shortDescription:row.description,color:'',features:row.features,sourceUrl:row.sourceUrl,price:row.price,images:row.images}))};
  const beforeFeed=JSON.stringify(feed),listingSlugs=stock.records.map(row=>row.slug);
  const imported=repairImportDealerInventoryCatalog({source,feed,listingSlugs}),catalog=readTypeScriptCatalog(imported.source,'inventoryCopy'),keys=readTypeScriptCatalog(imported.source,'inventorySourceKeys');
  assert.equal(imported.listingFactsUnchanged,true);assert.equal(imported.nativeApproval,false);assert.equal(imported.hostedApproval,false);
  assert.equal(imported.added.filter(row=>row.kind==='description').length,2);
  assert.deepEqual({...catalog.retained},{bg:'Запазен текст',en:'Retained text'});assert.equal(keys.retained,'retained');
  for(const row of modernRows)assert.deepEqual({...catalog[keys[row.description]]},{bg:copy[row.slug].bg.description,en:row.description});
  assert.equal(repairImportDealerInventoryCatalog({source:imported.source,feed,listingSlugs}).source,imported.source);
  assert.equal(JSON.stringify(feed),beforeFeed);assert.equal(JSON.stringify(stock),before);
});

test('Bradford companions keep refusing unreviewed dates, condition claims and arbitrary descriptions',()=>{
  const source='export const inventoryCopy = {} as const;\nexport const inventorySourceKeys = {} as const;\n';
  const stock=JSON.parse(execFileSync('git',['cat-file','blob','afefe4a692bcf99ce2ff24aaf0368d3c6d8c53f7'],{cwd:path.resolve(import.meta.dirname,'..'),env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'}})),row=stock.records[0];
  for(const description of [row.description.replace('10 October','11 October'),row.description+' Excellent condition.',row.description+' {stockCount}','Unknown inventory description']){
    const listing={slug:row.slug,description,images:[{url:row.images[0],alt:row.title}]},before=JSON.stringify(listing);
    assert.throws(()=>buildModernDealerInventoryCopy([listing]),/requires explicit reviewed EN\/BG copy/);
    const feed={listings:[{shortDescription:description,color:'',features:[]}]};
    assert.throws(()=>repairImportDealerInventoryCatalog({source,feed,listingSlugs:[row.slug]}),/missing description requires explicit reviewed EN\/BG copy/);
    assert.equal(JSON.stringify(listing),before);
  }
});

