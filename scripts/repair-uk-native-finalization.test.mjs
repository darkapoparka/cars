import test from 'node:test';
import assert from 'node:assert/strict';
import {REPAIR_SOURCES,REPAIR_ID,changedRows,assertRepairChanges,repairSource} from './repair-uk-native-finalization.mjs';
import {AUTO_BEST_LOCALE_OUTPUTS} from './lib/uk-auto-best-locales.mjs';
import {ADOPTION_FILE} from './lib/native-localization.mjs';
const row=path=>({path,before:'a'.repeat(64),after:'b'.repeat(64)});
const valid=()=>[...AUTO_BEST_LOCALE_OUTPUTS,ADOPTION_FILE].map(row);
test('repair is pinned to the three actually created sources and a new append-only history ID',()=>{
 assert.deepEqual(REPAIR_SOURCES,{
  'stockport-broadbent-car-and-servicing':'32522f6358a34d63ad63f02e2be3f47491fc0a71',
  'batley-as-motor-group':'643440c58ff7e11241f06c4e39a31d22633c50c9',
  'birmingham-square-one-motors':'1579e3067bd66677ce6a60b799ea16d6a5b0fe7f'
 });
 assert.equal(REPAIR_ID,'gb-native-finalization-v1');
});
test('only reviewed derived locale/native paths and the native seal may change',()=>{
 assert.doesNotThrow(()=>assertRepairChanges(valid()));
 assert.doesNotThrow(()=>assertRepairChanges(valid().filter(r=>r.path!==ADOPTION_FILE),{includeSeal:false}));
 for(const path of ['auto-best/src/lib/data/inventory.ts','dealer-stock/stock.json','modern/packages/marketplace/inventory.ts','app/data/inventory.ts','dealer.json','../outside']){
  assert.throws(()=>assertRepairChanges([...valid(),row(path)]),/beyond the reviewed/);
 }
 assert.throws(()=>assertRepairChanges(valid().slice(1)),/beyond the reviewed/);
 assert.throws(()=>assertRepairChanges([...valid(),valid()[0]]),/beyond the reviewed/);
 assert.throws(()=>assertRepairChanges(valid().map((r,i)=>i? r:{...r,after:null})),/beyond the reviewed/);
 assert.throws(()=>assertRepairChanges(valid().map((r,i)=>i? r:{...r,before:null})),/beyond the reviewed/);
});
test('complete source diff detects additions, removals and changed bytes',()=>{
 assert.deepEqual(changedRows([{path:'same',sha256:'1'},{path:'gone',sha256:'2'},{path:'edit',sha256:'3'}],
  [{path:'same',sha256:'1'},{path:'new',sha256:'4'},{path:'edit',sha256:'5'}]),
  [{path:'edit',before:'3',after:'5'},{path:'gone',before:'2',after:null},{path:'new',before:null,after:'4'}]);
});
test('local repair invocation stops at manual main-only Actions guard before source mutation',async()=>{
 const previous=process.env.GITHUB_ACTIONS;process.env.GITHUB_ACTIONS='false';
 try{await assert.rejects(repairSource(undefined,'stockport-broadbent-car-and-servicing'),/manual Cars main Linux workflow/);}
 finally{if(previous===undefined)delete process.env.GITHUB_ACTIONS;else process.env.GITHUB_ACTIONS=previous;}
});
