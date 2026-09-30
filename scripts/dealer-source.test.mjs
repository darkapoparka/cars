import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { assertCarsOwnedDealer, assertIndependentCheckout, excludeIndependentTarget } from './lib/dealer-source.mjs';
import { indexDeployments, validateRegistry } from './index-deployments.mjs';
import { exportDealer } from './export-dealer.mjs';
import { planClientRefresh, refreshClient } from './refresh-client.mjs';
const git = (dir, args) => execFileSync('git', ['-C', dir, ...args], {encoding:'utf8', windowsHide:true}).trim();
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-source-map-'));
  t.after(() => fs.rmSync(root, {recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'clients'));
  fs.mkdirSync(path.join(root,'docs'));
  git(root,['init','--initial-branch=main']);
  const slug = 'example-cars', directory = path.join(root,'clients',slug);
  fs.mkdirSync(directory); git(directory,['init','--initial-branch=main']);
  git(directory,['remote','add','origin','https://github.com/fixture/cars-example.git']);
  const variants = [{key:'auto-best',base:'',entry:'/'},{key:'modern',base:'/variant-2',entry:'/variant-2/cars'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}];
  const record = {slug,name:'Example',sourceOwnership:'independent-repository',localPath:null,checkoutPath:directory,canonicalSourceRepository:'fixture/cars-example',repository:'fixture/cars-example',variants,delivery:{state:'unknown'},evidence:{}};
  const registry = {schemaVersion:2,aliases:{},dealers:[record]};
  fs.writeFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify(registry));
  fs.writeFileSync(path.join(directory,'dealer.json'),JSON.stringify({schemaVersion:1,slug,repository:record.repository,variants,packaging:{version:'2'},sourceOwnership:'independent-repository'}));
  return {root,slug,directory,record,registry};
}
test('independent Git checkout may share the visible clients folder without Cars ownership',t=>{
  const f=fixture(t); assert.doesNotThrow(()=>assertIndependentCheckout(f.root,f.record,f.directory));
  const result=indexDeployments(f.root); assert.equal(result.dealers[0].localPath,null);
  assert.equal(result.dealers[0].localPresent,true); assert.equal(validateRegistry(result,f.root),true);
});
test('a second directory for an independent dealer is rejected',t=>{
  const f=fixture(t); const other=path.join(f.root,'other'); fs.mkdirSync(other);
  assert.throws(()=>assertIndependentCheckout(f.root,f.record,other),/competing|mismatched/);
});
test('independent repository identity is verified',t=>{
  const f=fixture(t); git(f.directory,['remote','set-url','origin','https://github.com/fixture/wrong.git']);
  assert.throws(()=>assertIndependentCheckout(f.root,f.record,f.directory),/origin differs/);
});
test('unregistered nested repository cannot become Cars-owned by indexing',t=>{
  const f=fixture(t); fs.writeFileSync(path.join(f.root,'docs/DEPLOYMENT-INVENTORY.json'),JSON.stringify({...f.registry,dealers:[]}));
  assert.throws(()=>indexDeployments(f.root),/Register independent source/);
});
test('legacy export and refresh refuse independent sources before reading a payload',async t=>{
  const f=fixture(t); assert.throws(()=>assertCarsOwnedDealer(f.root,f.slug),/Independent dealer/);
  assert.throws(()=>exportDealer({root:f.root,slug:f.slug,packageDir:'missing'}),/Independent dealer/);
  await assert.rejects(planClientRefresh({root:f.root,slug:f.slug}),/Independent dealer/);
  await assert.rejects(refreshClient({root:f.root,slug:f.slug,write:true}),/Independent dealer/);
});
test('new independent checkout is excluded idempotently without staging anything',t=>{
  const f=fixture(t); const before=git(f.root,['diff','--cached']);
  excludeIndependentTarget(f.root,f.directory); excludeIndependentTarget(f.root,f.directory);
  const exclude=fs.readFileSync(path.join(f.root,'.git/info/exclude'),'utf8');
  assert.equal(exclude.split('\n').filter(x=>x==='/clients/example-cars/').length,1);
  assert.equal(git(f.root,['diff','--cached']),before);
  assert.ok(git(f.root,['check-ignore','clients/example-cars/dealer.json']));
});
test('existing Cars-owned source is never excluded or reassigned automatically',t=>{
  const f=fixture(t); const file=path.join(f.root,'clients','central','dealer.json');
  fs.mkdirSync(path.dirname(file)); fs.writeFileSync(file,'{}'); git(f.root,['add','clients/central/dealer.json']);
  assert.throws(()=>excludeIndependentTarget(f.root,path.dirname(file)),/Existing Cars-owned/);
});
test('normal dealer paths retain the Cars workflow',t=>{
  const f=fixture(t); assert.equal(assertCarsOwnedDealer(f.root,'navara-car'),path.join(f.root,'clients/navara-car'));
  assert.throws(()=>assertCarsOwnedDealer(f.root,'../outside'),/Invalid dealer slug/);
});

import { clientSourceGuide } from './lib/client-source-guide.mjs';
test('client guide lists public aliases but not research-only prospects',t=>{
  const f=fixture(t); f.record.delivery={url:'https://cars-example.vercel.app/',projectName:'cars-example'};
  f.registry.dealers.push({slug:'research-only',name:'Research',variants:[],delivery:{state:'unknown'}});
  const guide=clientSourceGuide(f.registry);
  assert.match(guide,/1 dealer public aliases/); assert.match(guide,/example-cars\//);
  assert.match(guide,/Own Git repository/); assert.doesNotMatch(guide,/Research —/);
});
test('client guide prefers dated provider repository identity without rewriting QA history',t=>{
  const f=fixture(t); f.record.delivery={url:'https://cars-example.vercel.app/',projectName:'cars-example',gitRepository:'fixture/old-publisher'};
  f.record.hostingObservation={repository:'fixture/current-publisher',commit:'a'.repeat(40),ref:'main',checkedAt:'2026-09-26'};
  const guide=clientSourceGuide(f.registry);
  assert.match(guide,/github.com\/fixture\/current-publisher/);
  assert.doesNotMatch(guide,/github.com\/fixture\/old-publisher/);
  assert.equal(f.record.delivery.gitRepository,'fixture/old-publisher');
});

import { validateManifest } from './lib/workflow.mjs';
test('legacy registered independent destinations outside clients retain their behavior',t=>{
  const f=fixture(t); const before=fs.readFileSync(path.join(f.root,'.git/info/exclude'),'utf8');
  assert.doesNotThrow(()=>excludeIndependentTarget(f.root,path.join(f.root,'independent','example-cars')));
  assert.equal(fs.readFileSync(path.join(f.root,'.git/info/exclude'),'utf8'),before);
});
test('existing hyphenated dealership repositories are valid, traversal is not',t=>{
  const f=fixture(t); const manifest={schemaVersion:1,slug:'exclusive-auto-varna',repository:'darkapoparka/cars-exclusive-auto-varna',defaultBranch:'main',variants:f.record.variants};
  assert.doesNotThrow(()=>validateManifest(manifest));
  assert.throws(()=>validateManifest({...manifest,repository:'darkapoparka/cars-../outside'}),/repository identity/);
});
