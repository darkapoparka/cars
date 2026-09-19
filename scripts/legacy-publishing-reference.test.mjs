import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateManifest} from './lib/workflow.mjs';
import {validateIndexedManifest,indexDeployments,validateRegistry} from './index-deployments.mjs';
const manifest={schemaVersion:1,slug:'isauto-varna',repository:'darkapoparka/cars',defaultBranch:'publish/isauto-varna',variants:[{key:'auto-best',entry:'/',base:''},{key:'modern',entry:'/variant-2/cars',base:'/variant-2'},{key:'carwow',entry:'/variant-3/',base:'/variant-3'}],packaging:{version:'1'}};
const record={slug:manifest.slug,localPath:'clients/isauto-varna',canonicalSourceRef:'main',repository:manifest.repository,variants:manifest.variants,delivery:{gitIntegration:'unlinked-cli'},publishingException:{canonicalSourceRepository:'darkapoparka/cars',canonicalSourceRef:'main',legacyManifestRepository:'darkapoparka/cars',legacyManifestRef:'publish/isauto-varna'}};

test('normal publishing still rejects the integration repository as a publishing mirror',()=>{
 assert.throws(()=>validateManifest(manifest),/exact owner\/repository/);
 assert.equal(validateIndexedManifest(manifest,record),manifest);
 assert.throws(()=>validateManifest(manifest),/exact owner\/repository/);
});
test('legacy inventory exception must match the explicit source and unlinked provider record',()=>{
 assert.throws(()=>validateIndexedManifest(manifest,{}),/exact owner\/repository/);
 const linked=structuredClone(record);linked.delivery.gitIntegration='linked';
 assert.throws(()=>validateIndexedManifest(manifest,linked),/exact owner\/repository/);
 const wrong=structuredClone(record);wrong.publishingException.legacyManifestRef='publish/another';
 assert.throws(()=>validateIndexedManifest(manifest,wrong),/exact owner\/repository/);
 assert.throws(()=>validateManifest({...manifest,defaultBranch:'main'},{allowLegacyPublishingReference:true}),/exact owner\/repository/);
});
test('inventory scan and validation retain a declared legacy record without enabling publishing',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-legacy-index-test-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.mkdirSync(path.join(root,'docs'),{recursive:true});
 const dealer=path.join(root,record.localPath);fs.mkdirSync(dealer,{recursive:true});
 fs.writeFileSync(path.join(dealer,'dealer.json'),JSON.stringify(manifest));
 fs.writeFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify({schemaVersion:2,aliases:{},dealers:[record]}));
 const indexed=indexDeployments(root);assert.equal(validateRegistry(indexed,root),true);
 assert.equal(indexed.dealers[0].delivery.gitIntegration,'unlinked-cli');
 assert.deepEqual(indexed.dealers[0].publishingException,record.publishingException);
 assert.throws(()=>validateManifest(manifest),/exact owner\/repository/);
});
