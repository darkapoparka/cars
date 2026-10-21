import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {artifactInventory,verifyArtifactDirectory,verifyInventoryBytes} from './lib/uk-cloudflare-artifacts.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(t,count=4) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-artifact-inventory-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const directory=path.join(root,'bundle');fs.mkdirSync(path.join(directory,'public'),{recursive:true});
  for(let index=0;index<count;index++)fs.writeFileSync(path.join(directory,'public','member-'+index+'.bin'),Buffer.from([index%256,0,255,index%253]));
  const manifest=artifactInventory(directory,{kind:'bounded-test-envelope',status:'passed'});
  return {root,directory,manifest};
}
function writeManifest(directory,manifest,{reseal=false}={}) {
  if(reseal){manifest.digest=sha(JSON.stringify(manifest.files));manifest.bytes=manifest.files.reduce((sum,row)=>sum+row.bytes,0);}
  fs.writeFileSync(path.join(directory,'artifact-manifest.json'),JSON.stringify(manifest)+'\n');
}

test('directory verification checks every physical member and serializes the full inventory once',t=>{
  const f=fixture(t,128),stringify=JSON.stringify,read=fs.readFileSync,reads=new Map();let inventorySerializations=0;
  let observed;
  try {
    JSON.stringify=function(value,...args){
      if(Array.isArray(value)&&value.length===f.manifest.files.length&&value.every(row=>row&&typeof row.path==='string'&&typeof row.sha256==='string'&&Number.isSafeInteger(row.bytes)))inventorySerializations++;
      return stringify.call(this,value,...args);
    };
    fs.readFileSync=function(file,...args){
      if(typeof file==='string'&&file.startsWith(f.directory+path.sep)&&!file.endsWith(path.sep+'artifact-manifest.json'))reads.set(file,(reads.get(file)??0)+1);
      return read.call(this,file,...args);
    };
    observed=verifyArtifactDirectory(f.directory);
  } finally {JSON.stringify=stringify;fs.readFileSync=read;}
  assert.deepEqual(observed,f.manifest);
  assert.equal(inventorySerializations,1,'full inventory authentication must not repeat for each physical file');
  assert.equal(reads.size,f.manifest.files.length);assert([...reads.values()].every(count=>count===1));
});

test('changed physical bytes fail for both same-length corruption and length changes',async t=>{
  for(const mode of ['same-length','longer'])await t.test(mode,t=>{
    const f=fixture(t),file=path.join(f.directory,f.manifest.files[0].path);
    if(mode==='same-length')fs.writeFileSync(file,Buffer.from([99,0,255,0]));else fs.appendFileSync(file,'changed');
    assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact receipt bytes differ/);
  });
});

test('corrupt inventory digest, byte accounting and malformed member metadata remain rejected',async t=>{
  const mutations={digest:m=>m.digest='0'.repeat(64),bytes:m=>m.bytes++,hash:m=>m.files[0].sha256='invalid',length:m=>m.files[0].bytes=-1,schema:m=>m.schemaVersion=2};
  for(const [mode,mutate]of Object.entries(mutations))await t.test(mode,t=>{
    const f=fixture(t);mutate(f.manifest);writeManifest(f.directory,f.manifest);
    assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact file inventory is malformed or changed/);
  });
});

test('rehashed duplicate, traversal and absolute entries cannot be admitted by the private lookup',async t=>{
  for(const mode of ['duplicate','traversal','absolute','backslash','empty'])await t.test(mode,t=>{
    const f=fixture(t);
    if(mode==='duplicate')f.manifest.files.push({...f.manifest.files[0]});
    else f.manifest.files[0].path={traversal:'../outside.bin',absolute:'/outside.bin',backslash:'public\\outside.bin',empty:''}[mode];
    writeManifest(f.directory,f.manifest,{reseal:true});
    assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact file inventory is malformed or changed/);
  });
});

test('missing and undeclared physical files and rehashed path-set substitutions are rejected',async t=>{
  for(const mode of ['missing-file','extra-file','omitted-entry','nonexistent-entry'])await t.test(mode,t=>{
    const f=fixture(t);
    if(mode==='missing-file')fs.unlinkSync(path.join(f.directory,f.manifest.files[0].path));
    else if(mode==='extra-file')fs.writeFileSync(path.join(f.directory,'undeclared.bin'),'extra');
    else {if(mode==='omitted-entry')f.manifest.files.pop();else f.manifest.files[0].path='public/nonexistent.bin';writeManifest(f.directory,f.manifest,{reseal:true});}
    assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact contains missing or undeclared files/);
  });
});

test('a physical directory link remains forbidden before any artifact bytes are trusted',t=>{
  const f=fixture(t),outside=path.join(f.root,'outside');fs.mkdirSync(outside);fs.writeFileSync(path.join(outside,'member.bin'),'outside');
  fs.symlinkSync(outside,path.join(f.directory,'linked'),process.platform==='win32'?'junction':'dir');
  assert.throws(()=>verifyArtifactDirectory(f.directory),/Retained link requires review/);
});

test('each directory call reauthenticates disk inventory and bytes without retaining a prior lookup',t=>{
  const f=fixture(t),first=verifyArtifactDirectory(f.directory);
  first.files[0].sha256='0'.repeat(64);
  assert.deepEqual(verifyArtifactDirectory(f.directory),f.manifest,'a returned object cannot seed a later validation cache');
  fs.writeFileSync(path.join(f.directory,f.manifest.files[0].path),Buffer.from([99,0,255,0]));
  assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact receipt bytes differ/);
  f.manifest.files[0].sha256=sha(Buffer.from([99,0,255,0]));writeManifest(f.directory,f.manifest,{reseal:true});
  assert.deepEqual(verifyArtifactDirectory(f.directory),f.manifest,'a later correctly resealed directory is verified independently');
  f.manifest.digest='0'.repeat(64);writeManifest(f.directory,f.manifest);
  assert.throws(()=>verifyArtifactDirectory(f.directory),/Artifact file inventory is malformed or changed/);
});

test('standalone byte verification still validates the entire supplied inventory on every call',t=>{
  const f=fixture(t),row=f.manifest.files[0],bytes=fs.readFileSync(path.join(f.directory,row.path));
  assert.doesNotThrow(()=>verifyInventoryBytes(f.manifest,row.path,bytes));
  f.manifest.files[1].sha256='0'.repeat(64);
  assert.throws(()=>verifyInventoryBytes(f.manifest,row.path,bytes),/Artifact file inventory is malformed or changed/);
  writeManifest(f.directory,f.manifest,{reseal:true});
  assert.doesNotThrow(()=>verifyInventoryBytes(f.manifest,row.path,bytes));
  f.manifest.files.push({...row});writeManifest(f.directory,f.manifest,{reseal:true});
  assert.throws(()=>verifyInventoryBytes(f.manifest,row.path,bytes),/Artifact file inventory is malformed or changed/);
});
