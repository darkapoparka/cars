import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { writeDerivedFile } from './lib/derived-assets.mjs';
import { installUpgrade, planThreeWayUpgrade, rollbackUpgrade } from './dealer-updates/three-way-upgrade.mjs';

const bytes=value=>Buffer.from(value),hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const tree=value=>new Map(Object.entries(value).map(([name,data])=>[name,bytes(data)]));
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pooled-installer-'));
  t.after(()=>{const actual=fs.realpathSync(root);assert.equal(path.dirname(actual).toLowerCase(),fs.realpathSync(os.tmpdir()).toLowerCase());assert.match(path.basename(actual),/^cars-pooled-installer-/);fs.rmSync(actual,{recursive:true,force:true});});
  return {root,pool:path.join(root,'immutable-pool')};
}
function install({root,pool},dealer,oldFiles,newFiles,options={}){
  const source=path.join(root,dealer),runDir=path.join(root,dealer+'-run');
  fs.mkdirSync(source,{recursive:true});fs.mkdirSync(runDir);
  for(const [name,data] of Object.entries(oldFiles)){const file=path.join(source,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);}
  const plan=planThreeWayUpgrade({oldBase:tree(oldFiles),newBase:tree(newFiles),dealer:tree(oldFiles)});
  return installUpgrade({source,plan,runDir,assetPool:pool,...options});
}

test('installer deduplicates only immutable binary bytes and records same-volume link reuse',t=>{
  const x=fixture(t),data='approved image bytes';
  const first=install(x,'first',{}, {'static/shared.webp':data,'src/custom.ts':'export const value = 1;\n'});
  const second=install(x,'second',{}, {'static/shared.webp':data,'src/custom.ts':'export const value = 1;\n'});
  const object=path.join(x.pool,hash(data)+'.webp'),one=path.join(first.source,'static/shared.webp'),two=path.join(second.source,'static/shared.webp');
  assert.equal(first.assetPoolStats.filesLinked,1);assert.equal(second.assetPoolStats.filesLinked,1);
  assert.equal(first.assetPoolStats.objectsWritten,1);assert.equal(second.assetPoolStats.objectsReused,1);
  assert.equal(fs.statSync(object).ino,fs.statSync(one).ino);assert.equal(fs.statSync(one).ino,fs.statSync(two).ino);
  assert.equal(fs.statSync(object).nlink,3);assert.equal(fs.statSync(object).mode&0o200,0);
  assert.deepEqual(fs.readdirSync(x.pool),[hash(data)+'.webp']);
  assert.notEqual(fs.statSync(path.join(first.source,'src/custom.ts')).ino,fs.statSync(path.join(second.source,'src/custom.ts')).ino);
});

test('upgrade and rollback replace a dealer alias without modifying another dealer or the immutable pool',t=>{
  const x=fixture(t),old='previous reviewed image',next='new reviewed image';
  const first=install(x,'first',{}, {'static/shared.webp':old}),second=install(x,'second',{}, {'static/shared.webp':old});
  const source=first.source,runDir=path.join(x.root,'refresh-run');fs.mkdirSync(runDir);
  const plan=planThreeWayUpgrade({oldBase:tree({'static/shared.webp':old}),newBase:tree({'static/shared.webp':next}),dealer:tree({'static/shared.webp':old})});
  const refreshed=installUpgrade({source,plan,runDir,assetPool:x.pool});
  assert.equal(fs.readFileSync(path.join(source,'static/shared.webp'),'utf8'),next);
  assert.equal(fs.readFileSync(path.join(second.source,'static/shared.webp'),'utf8'),old);
  assert.equal(fs.readFileSync(path.join(x.pool,hash(old)+'.webp'),'utf8'),old);
  assert.equal(fs.statSync(path.join(x.pool,hash(old)+'.webp')).mode&0o200,0);
  assert.equal(refreshed.assetPoolStats.filesLinked,1);
  rollbackUpgrade({source,receiptPath:path.join(runDir,'rollback.json')});
  assert.equal(fs.readFileSync(path.join(source,'static/shared.webp'),'utf8'),old);
  assert.equal(fs.readFileSync(path.join(second.source,'static/shared.webp'),'utf8'),old);
  assert.equal(fs.readFileSync(path.join(x.pool,hash(next)+'.webp'),'utf8'),next);
});

test('pool object corruption stops an install before the source name is replaced',t=>{
  const x=fixture(t),old='old bytes',next='target bytes';fs.mkdirSync(x.pool);
  fs.writeFileSync(path.join(x.pool,hash(next)+'.webp'),'corrupt bytes');
  assert.throws(()=>install(x,'dealer',{'static/logo.webp':old},{'static/logo.webp':next}),/pool content changed/);
  assert.equal(fs.readFileSync(path.join(x.root,'dealer/static/logo.webp'),'utf8'),old);
});

test('a failed pooled install restores its own writes and preserves an interleaved external edit',t=>{
  const x=fixture(t),old={'a.webp':'old a','z.ts':'old z'},next={'a.webp':'new a','z.ts':'new z'};
  assert.throws(()=>install(x,'dealer',old,next,{afterWrite:item=>{if(item.path==='a.webp')fs.writeFileSync(path.join(x.root,'dealer/z.ts'),'other writer');}}),/Source changed after review/);
  assert.equal(fs.readFileSync(path.join(x.root,'dealer/a.webp'),'utf8'),'old a');
  assert.equal(fs.readFileSync(path.join(x.root,'dealer/z.ts'),'utf8'),'other writer');
  assert.equal(fs.readFileSync(path.join(x.pool,hash('new a')+'.webp'),'utf8'),'new a');
});

test('binary staging retains the logical extension and a source-contained pool is rejected',t=>{
  const x=fixture(t),temp=path.join(x.root,'.photo.webp.cars-upgrade-temp.tmp');
  const result=writeDerivedFile(temp,bytes('image'),{assetPool:x.pool,assetPath:'photo.webp'});
  assert.equal(result.pooled,true);assert.deepEqual(fs.readdirSync(x.pool),[hash('image')+'.webp']);
  const source=path.join(x.root,'dealer'),runDir=path.join(x.root,'run');fs.mkdirSync(source);fs.mkdirSync(runDir);
  const plan=planThreeWayUpgrade({oldBase:new Map(),newBase:tree({'photo.webp':'image'}),dealer:new Map()});
  assert.throws(()=>installUpgrade({source,runDir,plan,assetPool:path.join(source,'pool')}),/outside the dealer source/);
});
