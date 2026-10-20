import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planDealerUpgrade } from './dealer-updates/three-way-upgrade.mjs';

test('dealer planning bounds large immutable input copies and isolates candidate bytes', () => {
 const parent=fs.realpathSync(os.tmpdir()),directory=fs.mkdtempSync(path.join(parent,'cars-plan-memory-'));
 const keys=['auto-best','modern','carwow'],oldRevision='1'.repeat(40),newRevision='2'.repeat(40),assetBytes=4*1024*1024;
 const variants=keys.map((key,i)=>({key,base:i===0?'/':'/variant-'+(i+1)}));
 const manifest={slug:'allocation-fixture',repository:'darkapoparka/cars-allocation-fixture',variants,templateRevisions:Object.fromEntries(keys.map(key=>[key,oldRevision])),templateSources:Object.fromEntries(keys.map(key=>[key,{repository:'darkapoparka/cars',revision:oldRevision,path:'templates/'+key}]))};
 const lock={templates:Object.fromEntries(keys.map(key=>[key,{status:'approved',source:{repository:'darkapoparka/cars',revision:newRevision,path:'templates/'+key,digest:'a'.repeat(64)}}]))};
 const oldAsset=Buffer.alloc(assetBytes,90),newAsset=Buffer.alloc(assetBytes,90),packageBytes=Buffer.from('{"name":"fixture","version":"1.0.0"}\n');
 const oldBases=Object.fromEntries(keys.map(key=>[key,new Map([['package.json',packageBytes]])])),newBases=Object.fromEntries(keys.map(key=>[key,new Map([['package.json',packageBytes]])]));
 oldBases['auto-best'].set('public/fixture.bin',oldAsset);newBases['auto-best'].set('public/fixture.bin',newAsset);
 try {
  fs.writeFileSync(path.join(directory,'dealer.json'),JSON.stringify(manifest));
  for(const key of keys){fs.mkdirSync(path.join(directory,key),{recursive:true});fs.writeFileSync(path.join(directory,key,'package.json'),packageBytes);}
  fs.mkdirSync(path.join(directory,'auto-best/public'));fs.writeFileSync(path.join(directory,'auto-best/public/fixture.bin'),oldAsset);
  const from=Buffer.from;let copiedLargeBytes=0,plan;
  Buffer.from=function(value,...args){if(Buffer.isBuffer(value)&&value.length===assetBytes)copiedLargeBytes+=value.length;return from(value,...args);};
  try{plan=planDealerUpgrade({dealerRoot:directory,lock,oldBases,newBases});}finally{Buffer.from=from;}
  assert.equal(plan.ready,true);assert.equal(plan.conflicts.length,0);
  // Eight buffers leave a safety margin for the selected-byte and comparison
  // defenses, while rejecting a second entire outer old/new clone pair.
  assert(copiedLargeBytes<=8*assetBytes,'Large source buffers were copied redundantly: '+copiedLargeBytes);
  const chosen=plan.candidate.get('auto-best/public/fixture.bin');assert(chosen.equals(oldAsset));
  chosen[0]=0;assert.equal(oldAsset[0],90);assert.equal(newAsset[0],90);assert.equal(fs.readFileSync(path.join(directory,'auto-best/public/fixture.bin'))[0],90);
  oldAsset[1]=0;newAsset[2]=0;assert.equal(chosen[1],90);assert.equal(chosen[2],90);
  const unsafe={...oldBases,'auto-best':new Map(oldBases['auto-best'])};unsafe['auto-best'].set('../outside.bin',Buffer.from('unsafe'));
  assert.throws(()=>planDealerUpgrade({dealerRoot:directory,lock,oldBases:unsafe,newBases}),/Unsafe upgrade path/);
 } finally {
  const exact=fs.realpathSync(directory),relative=path.relative(parent,exact);
  assert(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative)&&path.basename(exact).startsWith('cars-plan-memory-'));
  fs.rmSync(exact,{recursive:true,force:true});
 }
});
