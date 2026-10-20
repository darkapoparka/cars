import test from 'node:test';
import assert from 'node:assert/strict';
import {planThreeWayUpgrade} from './dealer-updates/three-way-upgrade.mjs';

const tree=bytes=>new Map([['public/fixture.bin',bytes]]);
const sample=(name,plan,extra={})=>globalThis.__carsReadonlySample?.({name,plan,...extra});

test('read-only input maps keep only the selected large candidate copy and isolate both directions',()=>{
 const assetBytes=4*1024*1024,old=Buffer.alloc(assetBytes,77),fresh=Buffer.alloc(assetBytes,77),live=Buffer.alloc(assetBytes,77);
 const from=Buffer.from;let copiedLargeBytes=0,plan;
 Buffer.from=function(value,...args){if(Buffer.isBuffer(value)&&value.length===assetBytes)copiedLargeBytes+=value.length;return from(value,...args);};
 try{plan=planThreeWayUpgrade({oldBase:tree(old),newBase:tree(fresh),dealer:tree(live)});}finally{Buffer.from=from;}
 sample('large-public-map',plan,{assetBytes,copiedLargeBytes});
 assert.equal(plan.ready,true);assert.equal(plan.conflicts.length,0);assert.equal(plan.changes.length,0);
 assert.equal(copiedLargeBytes,assetBytes,'Only the owned selected candidate needs a large Buffer copy');
 const chosen=plan.candidate.get('public/fixture.bin');assert(chosen.equals(old));
 chosen[0]=0;for(const input of [old,fresh,live])assert.equal(input[0],77);
 old[1]=0;fresh[2]=0;live[3]=0;for(const index of [1,2,3])assert.equal(chosen[index],77);
 assert.throws(()=>planThreeWayUpgrade({oldBase:new Map([['../escape',old]]),newBase:tree(fresh),dealer:tree(live)}),/Unsafe upgrade path/);
});

test('read-only inputs retain binary decisions, manual output isolation, non-Buffer conversion and text normalization',()=>{
 const old=Buffer.from([0,1]),fresh=Buffer.from([0,2]),live=Buffer.from([0,3]),manual=Buffer.from([0,4]);
 const cases=[
  ['template-only',old,fresh,old,{},fresh],
  ['dealer-only',old,old,live,{},live],
  ['already-equal',old,fresh,fresh,{},fresh],
  ['resolved-template',old,fresh,live,{'public/fixture.bin':'template'},fresh],
  ['resolved-dealer',old,fresh,live,{'public/fixture.bin':'dealer'},live],
  ['resolved-manual',old,fresh,live,{'public/fixture.bin':manual},manual],
 ];
 for(const [name,a,b,c,resolutions,expected]of cases){
  const plan=planThreeWayUpgrade({oldBase:tree(a),newBase:tree(b),dealer:tree(c),resolutions});sample(name,plan);
  assert.equal(plan.ready,true);assert(plan.candidate.get('public/fixture.bin').equals(expected));
  plan.candidate.get('public/fixture.bin')[0]=9;for(const input of [a,b,c,expected])assert.equal(input[0],0);
 }
 const unresolved=planThreeWayUpgrade({oldBase:tree(old),newBase:tree(fresh),dealer:tree(live)});sample('unresolved-binary',unresolved);
 assert.equal(unresolved.ready,false);assert.equal(unresolved.conflicts.length,1);assert.equal(unresolved.candidate.size,0);
 const deleted=planThreeWayUpgrade({oldBase:tree(old),newBase:tree(fresh),dealer:new Map(),resolutions:{'public/fixture.bin':'dealer'}});sample('resolved-delete',deleted);assert.equal(deleted.ready,true);assert.equal(deleted.candidate.size,0);
 const typed=new Uint8Array([0,7]);const converted=planThreeWayUpgrade({oldBase:new Map([['value.bin',typed],['line.ts','hello\r\n']]),newBase:new Map([['value.bin',typed],['line.ts','hello\n']]),dealer:new Map([['value.bin',typed],['line.ts','hello\n']])});sample('typed-input-and-crlf',converted);
 assert.equal(converted.ready,true);assert.equal(converted.changes.length,0);assert.equal(converted.candidate.get('line.ts').toString(),'hello\n');
 converted.candidate.get('value.bin')[1]=8;assert.equal(typed[1],7);typed[0]=5;assert.equal(converted.candidate.get('value.bin')[0],0);
});
