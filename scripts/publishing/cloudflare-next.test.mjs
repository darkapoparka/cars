import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {applyCloudflareNext,freezeCloudflareNextDependencies,CLOUDFLARE_NEXT_PINS,cloudflareNextBuildHelper,resolveCloudflareNpmCli} from './cloudflare-next.mjs';

function fixture(keys=['modern','app','mobile']){
  const files=new Map();
  for(const key of keys){
    const root=key==='modern'?'modern/apps/web':key;
    files.set(root+'/package.json',Buffer.from(JSON.stringify({name:key,dependencies:{next:'16.3.8',react:key==='modern'?'19.2.4':'19.3.0','react-dom':key==='modern'?'19.2.4':'19.3.0'},scripts:{build:'next build'}})));
    files.set(root+'/app/page.tsx',Buffer.from("import {headers} from 'next/headers'; export default async function Page(){return (await headers()).get('x-cars-country')}"));
    if(key==='modern'){
      files.set('modern/pnpm-lock.yaml',Buffer.from("lockfileVersion: '9.0'\n"));
      files.set('modern/packages/internationalization/request.ts',Buffer.from('trustedCountry: process.env.VERCEL === "1"\n          ? request.headers.get("x-vercel-ip-country")\n          : null,'));
    }
    else{
      files.set(root+'/next.config.js',Buffer.from("module.exports = {basePath: '/variant-"+(key==='app'?'4':'5')+"', redirects: async()=>[]};"));
      files.set(root+'/babel.config.js',Buffer.from("module.exports = {plugins:[['@stylexjs/babel-plugin',{runtimeInjection:false,unstable_moduleResolution:{type:'commonJS'}}]]};"));
      files.set(root+'/postcss.config.js',Buffer.from("module.exports = {plugins:{'@stylexjs/postcss-plugin':{},autoprefixer:{}}};"));
      files.set(root+'/package-lock.json',Buffer.from('{"lockfileVersion":3}'));
    }
  }
  return {files,manifest:{slug:'broadbent-motors',variants:keys.map(key=>({key,base:key==='modern'?'/variant-2':key==='app'?'/variant-4':'/variant-5'}))}};
}
test('generated SSR overlay preserves application sources, source map and original locks',()=>{
  const {files,manifest}=fixture();const before=new Map(files),out=applyCloudflareNext(files,manifest);
  for(const [name,bytes]of before)assert.equal(files.get(name),bytes);
  for(const key of ['modern','app','mobile']){
    const root=key==='modern'?'modern/apps/web':key;
    assert.deepEqual(out.get(root+'/app/page.tsx'),files.get(root+'/app/page.tsx'));
    const pkg=JSON.parse(out.get(root+'/package.json'));
    assert.equal(pkg.dependencies.next,'16.3.8');assert.equal(pkg.dependencies.vinext,CLOUDFLARE_NEXT_PINS.vinext);
    assert.equal(pkg.scripts.build,'next build');assert.equal(pkg.scripts['build:cloudflare'],'vite build');
    const config=JSON.parse(out.get(root+'/wrangler.jsonc'));
    assert.equal(config.workers_dev,false);assert.equal(config.assets.run_worker_first,false);assert.equal(config.assets.not_found_handling,'none');
    assert.equal(config.main,'vinext/server/app-router-entry');assert.equal(config.vars.CARS_CLOUDFLARE_PROVIDER,'1');
  }
  assert.deepEqual(out.get('mobile/package-lock.json'),files.get('mobile/package-lock.json'));
  assert.match(out.get('mobile/vite.config.ts').toString(),/stylex\.vite/);
  assert.match(out.get('mobile/vite.config.ts').toString(),/childEnvironments: \['ssr'\]/);
  assert.match(out.get('mobile/next.config.mjs').toString(),/cars-next-source\.cjs/);
  const receipt=JSON.parse(out.get('.cars-cloudflare-next.json'));
  assert.equal(receipt.build,'unverified');assert.equal(receipt.hosted,'unverified');assert.equal(receipt.freeTier,'unverified');
  assert.equal(receipt.targets.find(t=>t.key==='modern').react,'19.2.6');
  assert.equal(receipt.adaptations.filter(t=>t.dependency==='react').length,1);
});
test('output is deterministic, explicit Worker prefix and Modern slot 3 are respected',()=>{
  const {files,manifest}=fixture();manifest.variants[0].base='/variant-3';
  const first=applyCloudflareNext(files,manifest,{workerPrefix:'cars-uk-pilot'}),second=applyCloudflareNext(files,manifest,{workerPrefix:'cars-uk-pilot'});
  assert.deepEqual(first,second);const config=JSON.parse(first.get('modern/apps/web/wrangler.jsonc'));
  assert.equal(config.name,'cars-uk-pilot-modern');assert.equal(config.vars.NEXT_PUBLIC_BASE_PATH,'/variant-3');
  assert.match(first.get('modern/packages/internationalization/request.ts').toString(),/CARS_CLOUDFLARE_PROVIDER === "1"\n          \? request\.headers\.get\("x-cars-country"\)/);
});
test('unsafe names, wrong mounts, duplicate targets and occupied generated files fail closed',()=>{
  const {files,manifest}=fixture();
  for(const workerPrefix of ['../../dealer','cars;whoami','', 'a'.repeat(55)])assert.throws(()=>applyCloudflareNext(files,manifest,{workerPrefix}),/prefix/);
  assert.throws(()=>applyCloudflareNext(files,{...manifest,variants:[{key:'mobile',base:'/'}]}),/mount/);
  assert.throws(()=>applyCloudflareNext(files,{...manifest,variants:[manifest.variants[0],manifest.variants[0]]}),/duplicate/);
  files.set('mobile/vite.config.ts',Buffer.from('owner config'));assert.throws(()=>applyCloudflareNext(files,manifest),/Occupied/);
});
test('unknown runtime or compiler/provider boundary never silently drops features',()=>{
  const {files,manifest}=fixture(['mobile']);files.set('mobile/package.json',Buffer.from('{"dependencies":{"next":"16.3.8","react":"18.3.1"}}'));
  assert.throws(()=>applyCloudflareNext(files,manifest),/incompatible/);
  const modern=fixture(['modern']);modern.files.set('modern/packages/internationalization/request.ts',Buffer.from('changed boundary'));
  assert.throws(()=>applyCloudflareNext(modern.files,modern.manifest),/trusted country boundary/);
  const mobile=fixture(['mobile']);mobile.files.set('mobile/babel.config.js',Buffer.from('module.exports = {}'));
  assert.throws(()=>applyCloudflareNext(mobile.files,mobile.manifest),/StyleX/);
});
test('generated build helper seals dependencies and has no deploy command',()=>{
  const helper=cloudflareNextBuildHelper();assert.match(helper,/dependency lock/);assert.match(helper,/bin\('vinext','vinext'\)/);
  assert.match(helper,/templates\.lock\.json/);assert.match(helper,/Use pinned Node 22/);
  assert.doesNotMatch(helper,/wrangler.*deploy|vinext-cloudflare.*deploy/);
});
test('qualified locks materialize before export, rejecting changed inputs or installed runtime pins',()=>{
  const {files,manifest}=fixture(['mobile']);const out=applyCloudflareNext(files,manifest);
  const receipt=JSON.parse(out.get('.cars-cloudflare-next.json')),target=receipt.targets[0],pkg=JSON.parse(out.get('mobile/package.json'));
  const hash=value=>createHash('sha256').update(value).digest('hex');
  const lockText=JSON.stringify({lockfileVersion:3,packages:{'':{dependencies:pkg.dependencies,devDependencies:pkg.devDependencies}}})+'\n';
  const installedPins=Object.fromEntries(['vinext','vite','@vitejs/plugin-rsc','@cloudflare/vite-plugin','wrangler','react','react-dom','react-server-dom-webpack','@stylexjs/unplugin','unplugin'].map(name=>[name,pkg.dependencies[name]??pkg.devDependencies[name]]));
  const lock={schemaVersion:1,adapter:receipt.adapter,key:'mobile',node:'v22.23.2',sourcePackageSha256:target.sourcePackageSha256,sourceLockSha256:target.sourceLockSha256,generatedPackageSha256:target.generatedPackageSha256,lockPath:target.lockPath,lockSha256:hash(lockText),lockText,installedPins};
  const frozen=freezeCloudflareNextDependencies(out,[lock]);
  assert.equal(JSON.parse(frozen.get('.cars-cloudflare-next.json')).dependencyLock,'frozen');assert.equal(frozen.get('mobile/package-lock.json').toString(),lockText);
  assert.deepEqual(applyCloudflareNext(files,manifest,{dependencyLocks:[lock]}),frozen);
  assert.throws(()=>freezeCloudflareNextDependencies(out,[]),/every selected/);
  assert.throws(()=>freezeCloudflareNextDependencies(out,[{...lock,generatedPackageSha256:'0'.repeat(64)}]),/input mismatch/);
  assert.throws(()=>freezeCloudflareNextDependencies(out,[{...lock,sourceLockSha256:'0'.repeat(64)}]),/input mismatch/);
  assert.throws(()=>freezeCloudflareNextDependencies(out,[{...lock,installedPins:{...installedPins,react:'19.2.4'}}]),/runtime pin mismatch/);
  const changed=new Map(out);changed.set('mobile/package.json',Buffer.from(out.get('mobile/package.json').toString().replace('16.3.8','16.3.9')));
  assert.throws(()=>freezeCloudflareNextDependencies(changed,[lock]),/input mismatch/);
});

test('npm resolver follows the pinned Node installation on Windows and Unix',()=>{
  for(const [paths,node,real,expected]of [
    [path.win32,'C:\\tools\\node\\node.exe','C:\\tools\\node\\node.exe','C:\\tools\\node\\node_modules\\npm\\bin\\npm-cli.js'],
    [path.posix,'/opt/hostedtoolcache/node/22.23.2/x64/bin/node','/opt/hostedtoolcache/node/22.23.2/x64/bin/node','/opt/hostedtoolcache/node/22.23.2/x64/lib/node_modules/npm/bin/npm-cli.js'],
    [path.posix,'/usr/local/bin/node','/opt/node-v22.23.2/bin/node','/opt/node-v22.23.2/lib/node_modules/npm/bin/npm-cli.js'],
  ]){
    const io={realpathSync:value=>{assert.equal(value,node);return real;},existsSync:value=>value===expected,statSync:()=>({isFile:()=>true})};
    assert.equal(resolveCloudflareNpmCli(node,io,paths),expected);
  }
});
test('npm resolver rejects missing or directory candidates without using an unrelated PATH npm',()=>{
  for(const exists of [false,true]){
    const checked=[],io={realpathSync:()=>'/opt/pinned/bin/node',existsSync:file=>{checked.push(file);return exists;},statSync:()=>({isFile:()=>false})};
    assert.throws(()=>resolveCloudflareNpmCli('/opt/pinned/bin/node',io,path.posix),/pinned Node installation/);
    assert.deepEqual(checked,['/opt/pinned/bin/node_modules/npm/bin/npm-cli.js','/opt/pinned/lib/node_modules/npm/bin/npm-cli.js']);
  }
  assert.match(cloudflareNextBuildHelper(),/const npmCli=resolveCloudflareNpmCli\(process\.execPath,fs,path\)/);
});
