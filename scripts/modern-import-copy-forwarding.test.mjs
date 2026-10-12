import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {buildModernDealerInventoryCopy} from './lib/modern-dealer-inventory-copy.mjs';
import {vercelConfiguration} from './package-dealer.mjs';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const updater = fs.readFileSync(new URL('./dealer-updates/update-dealer-template.mjs', import.meta.url), 'utf8');
const between = (begin, end) => {
  const start = updater.indexOf(begin), stop = updater.indexOf(end, start);
  assert(start >= 0 && stop > start, 'Maintained function boundary required');
  return updater.slice(start, stop).replace(/^export /gm, '');
};
const source = between('export function assertReviewedModernCopy(', 'export function loadModernCopyReview(')
  + between('async function personalizePinnedTargetBases(', '/** A reviewed dealer resolution');
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

test('maintained Vercel envelope dispatches bare Mobile without changing the other five mounts',()=>{
  for(const order of [['modern','import'],['import','modern']]) {
    const variants=keys.map((key,index)=>({key,base:index?'/'+'variant-'+(index+1):'',entry:index?'/variant-'+(index+1)+'/':'/'}));
    [variants[1].key,variants[2].key]=order;
    for(const variant of variants)if(variant.key==='modern')variant.entry=variant.base+'/cars';
    const out=vercelConfiguration({slug:'dealer-test',packaging:{version:'5'},variants},null);
    assert(!out.redirects.some(row=>row.source==='/variant-5'));
    assert.deepEqual(out.rewrites.find(row=>row.source==='/variant-5'),{source:'/variant-5',destination:{service:'mobile',path:'/variant-5'}});
    assert(out.rewrites.some(row=>row.source==='/variant-5/(.*)'&&row.destination.service==='mobile'));
    for(const base of ['/variant-2','/variant-3','/variant-4','/variant-6'])assert(out.redirects.some(row=>row.source===base));
    assert.equal(Object.keys(out.services).length,6);
  }
});
