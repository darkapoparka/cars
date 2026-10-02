import assert from 'node:assert/strict';
import test from 'node:test';
import { nativeBuildPlan } from './publishing/build-native-service.mjs';

test('native Vercel builds install complete service dependencies before compilation', () => {
  for (const key of ['auto-best', 'import', 'carwow']) {
    assert.deepEqual(nativeBuildPlan(key).steps[0], ['npm', 'ci', '--include=dev']);
  }
  const modern = nativeBuildPlan('modern');
  assert.deepEqual(modern.steps[0].slice(0, 5), [
    'npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '--'
  ]);
  assert.deepEqual(modern.steps[0].slice(5), ['pnpm', 'install', '--frozen-lockfile', '--prod=false']);
  assert.deepEqual(modern.steps[1].slice(5), ['pnpm', '--filter', '@repo/database', 'build']);
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runNativeBuild } from './publishing/build-native-service.mjs';
function installFixture(t, key) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-install-phase-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (name, data) => { const full = path.join(root, name); fs.mkdirSync(path.dirname(full), {recursive:true}); fs.writeFileSync(full, data); };
  const base = key === 'auto-best' ? '' : key === 'carwow' ? '/variant-3' : '/variant-2';
  put('dealer.json', JSON.stringify({packaging:{version:'3'},variants:[{key,base}]}));
  put(key+'/package.json', JSON.stringify({name:key}));
  put(key+(key==='modern'?'/pnpm-lock.yaml':'/package-lock.json'), 'locked dependencies');
  put(key+(key==='modern'?'/apps/web/node_modules/next/dist/bin/next':'/node_modules/vite/bin/vite.js'), 'compiler fixture');
  return {root,put};
}
for (const key of ['auto-best','modern','carwow','import']) test(`${key}: generated install/build phases perform one dependency installation`, t => {
  const {root}=installFixture(t,key), calls=[];
  const run=(...args)=>{calls.push(args);return {status:0};};
  runNativeBuild(key,{packageRoot:root,run,installOnly:true});
  assert.equal(calls.length,1);
  runNativeBuild(key,{packageRoot:root,run,dependenciesInstalled:true});
  assert.equal(calls.length,nativeBuildPlan(key).steps.length);
  const commands=calls.map(([command,args])=>[command,...args].join(' '));
  assert.equal(commands.filter(c=>/\b(?:ci|install)\b/.test(c)).length,1);
});

test('install proof rejects missing, changed and incomplete dependencies without running build', t => {
  const {root,put}=installFixture(t,'modern'); let calls=0;
  const run=()=>{calls++;return {status:0};};
  assert.throws(()=>runNativeBuild('modern',{packageRoot:root,run,dependenciesInstalled:true}),/verified install/);
  runNativeBuild('modern',{packageRoot:root,run,installOnly:true});
  put('modern/apps/web/package.json','{"dependencies":{"next":"updated"}}');
  assert.throws(()=>runNativeBuild('modern',{packageRoot:root,run,dependenciesInstalled:true}),/Dependencies changed/);
  assert.equal(calls,1);
  runNativeBuild('modern',{packageRoot:root,run,installOnly:true});
  fs.unlinkSync(path.join(root,'modern/apps/web/node_modules/next/dist/bin/next'));
  assert.throws(()=>runNativeBuild('modern',{packageRoot:root,run,dependenciesInstalled:true}),/compiler is missing/);
  assert.equal(calls,2);
});
test('failed reinstall cannot leave a valid earlier install receipt', t => {
  const {root}=installFixture(t,'carwow'), run=()=>({status:0});
  runNativeBuild('carwow',{packageRoot:root,run,installOnly:true});
  assert.throws(()=>runNativeBuild('carwow',{packageRoot:root,run:()=>({status:1}),installOnly:true}),/build failed/);
  assert.throws(()=>runNativeBuild('carwow',{packageRoot:root,run,dependenciesInstalled:true}),/verified install/);
});
test('generated install phases refuse canonical Cars source roots', t => {
  const {root,put}=installFixture(t,'auto-best'); put('templates.lock.json','{}');
  assert.throws(()=>runNativeBuild('auto-best',{packageRoot:root,run:()=>({status:0}),installOnly:true}),/canonical source/);
  assert.equal(fs.existsSync(path.join(root,'.cars-build-assets')),false);
});
