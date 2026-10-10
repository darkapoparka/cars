import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from './lib/workflow.mjs';
import {finalizeAutoBestLocales,AUTO_BEST_LOCALE_OUTPUTS,AUTO_BEST_LOCALE_GENERATORS} from './lib/uk-auto-best-locales.mjs';
const GIT=process.platform==='win32'?'L:/Toolchains/Git/2.54.0/cmd/git.exe':'git';
function blob(oid){const result=spawnSync(GIT,['cat-file','blob',oid],{cwd:ROOT,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},windowsHide:true,maxBuffer:65536});assert.equal(result.status,0,'Exact approved native locale generator must be available locally, without lazy fetching.');return result.stdout;}
const generators=new Map(Object.entries(AUTO_BEST_LOCALE_GENERATORS).map(([name,oid])=>['auto-best/'+name,blob(oid)]));
const bytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
function fixture(){
 return new Map([...generators,
  ['auto-best/localization/common.json',bytes({'inventory.mileage':{en:'Mileage, mi',bg:'Пробег, мили'}})],
  ['auto-best/localization/catalog.reviewed.json',bytes([{key:'mileage.max',source:'Maximum mileage (mi)',en:'Maximum mileage (mi)',bg:'Максимален пробег (мили)'}])],
  ['auto-best/localization/template.reviewed.json',bytes([{key:'nav.cars',source:'Cars',en:'Cars',bg:'Автомобили'}])],
  ['auto-best/localization/dealer.reviewed.json',bytes([{key:'dealer.city',source:'Bredbury, Stockport',en:'Bredbury, Stockport',bg:'Bredbury, Stockport'},{key:'dealer.address',source:'Oldmoor Road',en:'Oldmoor Road',bg:'Oldmoor Road'}])],
  ['auto-best/src/lib/locale/policy.ts',Buffer.from('export const reviewedPolicy = true;\n')],
  ['auto-best/src/lib/locale/catalog.ts',Buffer.from('// old generated Sofia/km template catalog\n')],
  ['auto-best/localization/generated-manifest.json',bytes({stale:true})],
  ['auto-best/src/lib/data/inventory.ts',Buffer.from('export const stock = [{ id: "actual-stock", price: 8990 }];\n')],
  ['modern/unchanged.bin',Buffer.from([0,1,2,3])]]);
}
test('native generator updates only derived locale files and includes exact dealer/miles copy',()=>{
 const files=fixture(),before=new Map(files),receipt=finalizeAutoBestLocales({files});
 assert.equal(receipt.nativeCheckPassed,true);assert.equal(receipt.authoritativeInputsUnchanged,true);
 assert.deepEqual(receipt.changedFiles.map(row=>row.path).sort(),[...AUTO_BEST_LOCALE_OUTPUTS].sort());
 for(const [name,original]of before)if(!AUTO_BEST_LOCALE_OUTPUTS.includes(name))assert.deepEqual(files.get(name),original);
 const text=files.get('auto-best/src/lib/locale/catalog.ts').toString();
 assert.match(text,/"dealer.city": "Bredbury, Stockport"/);assert.match(text,/"inventory.mileage": "Mileage, mi"/);assert.doesNotMatch(text,/Sofia/);
 const second=finalizeAutoBestLocales({files});assert.deepEqual(second.changedFiles,[]);assert.deepEqual(second.outputHashes,receipt.outputHashes);
});
test('missing or modified native generator refuses before source Map mutation',()=>{
 const files=fixture(),before=new Map(files);files.set('auto-best/scripts/build-locales.mjs',Buffer.from('throw Error("unreviewed");\n'));
 const bad=new Map(files);assert.throws(()=>finalizeAutoBestLocales({files}),/differs from the approved/);assert.deepEqual(files,bad);
 files.set('auto-best/scripts/build-locales.mjs',before.get('auto-best/scripts/build-locales.mjs'));files.delete('auto-best/localization/dealer.reviewed.json');
 assert.throws(()=>finalizeAutoBestLocales({files}),/Missing retained native locale input/);
});
test('native compiler rejects incomplete copy without replacing retained outputs',()=>{
 const files=fixture();files.set('auto-best/localization/dealer.reviewed.json',bytes([{key:'dealer.city',source:'Real city',en:'Real city',bg:''}]));
 const original=new Map(files);assert.throws(()=>finalizeAutoBestLocales({files}),/Incomplete translation/);assert.deepEqual(files,original);
});
test('finalization refuses a directory outside bounded Cars runtime',()=>{
 const files=fixture();assert.throws(()=>finalizeAutoBestLocales({files,runtimeRoot:ROOT}),/bounded directory/);
});
