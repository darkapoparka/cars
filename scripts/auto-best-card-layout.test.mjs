import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
let compiler;
try { compiler=createRequire(new URL('../templates/auto-best/package.json',import.meta.url))('svelte/compiler'); } catch(error) { if(error.code!=='MODULE_NOT_FOUND')throw error; }
import {applyAutoBestCardLayout,autoBestCardLayoutWorkerSource} from './publishing/auto-best-card-layout.mjs';
const manifest={slug:'fixture',variants:[{key:'auto-best'}]};
function fixture(){return new Map([
  ['auto-best/src/lib/components/vehicles/VehicleCard.svelte',fs.readFileSync(new URL('../templates/auto-best/src/lib/components/vehicles/VehicleCard.svelte',import.meta.url))],
  ['auto-best/src/routes/listing-detail-v1/[id]/detail.css',fs.readFileSync(new URL('../templates/auto-best/src/routes/listing-detail-v1/[id]/detail.css',import.meta.url))],
  ...['src/lib/styles/base.css','src/lib/components/listing/ListingFacetEditor.svelte','src/lib/components/home/VehicleQuickSearch.svelte'].map(name=>['auto-best/'+name,fs.readFileSync(new URL('../templates/auto-best/'+name,import.meta.url))]),
  ['dealer.json',Buffer.from('{"slug":"fixture"}')]
]);}
test('pinned dealer layout can be repaired without changing identity or other designs',()=>{
  const files=fixture(),identity=files.get('dealer.json');
  const receipt=applyAutoBestCardLayout(files,manifest);
  assert.ok(receipt.changes.length>=3);assert.equal(files.get('dealer.json'),identity);
  const once=files.get(receipt.changes[0].path);applyAutoBestCardLayout(files,manifest);
  assert.deepEqual(files.get(receipt.changes[0].path),once);
});
test('missing source refuses the repair atomically',()=>{
  const files=fixture();files.delete('auto-best/src/routes/listing-detail-v1/[id]/detail.css');
  const original=new Map(files);assert.throws(()=>applyAutoBestCardLayout(files,manifest));assert.deepEqual(files,original);
});
test('pinned card override survives Svelte scoping and compilation',{skip:!compiler},()=>{
  const files=fixture();applyAutoBestCardLayout(files,manifest);
  const source=files.get('auto-best/src/lib/components/vehicles/VehicleCard.svelte').toString();
  const result=compiler.compile(source,{filename:'VehicleCard.svelte',generate:'client'});
  assert.match(result.css.code,/html \.dn-vehicle-card\.dn-vehicle-card \.dn-vehicle-card__mobile-meta\s*\{\s*flex-wrap:\s*nowrap/);
  assert.ok(!result.warnings.some(w=>w.code==='css_unused_selector'&&w.message.includes('html .dn-vehicle-card')));
});
test('existing Worker repair leaves other variants, assets, errors and non-GET responses untouched',async()=>{
  const module=await import('data:text/javascript;base64,'+Buffer.from(autoBestCardLayoutWorkerSource()).toString('base64'));
  const response=new Response('original',{headers:{'content-type':'text/html'}});
  for(const path of ['/variant-2/en/cars','/variant-3/en','/variant-4','/variant-5/?lang=bg','/variant-6/vehicle']) assert.equal(module.withAutoBestCardLayout(new Request('https://example.com'+path),response),response);
  for(const other of [new Response('asset',{headers:{'content-type':'text/css'}}),new Response('error',{status:500})]) assert.equal(module.withAutoBestCardLayout(new Request('https://example.com/en'),other),other);
  assert.equal(module.withAutoBestCardLayout(new Request('https://example.com/en',{method:'POST'}),response),response);
});
