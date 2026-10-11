import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import { pathToFileURL } from 'node:url';
import { APPLICATIONS, FAMILIES, HOSTED_QA_ACCOUNT, HOSTED_QA_ORIGIN, HOSTED_QA_PROFILE, TEMPLATE_REVISION,
  assertBoundary, guardHostedContext, parseHelperResults, readHostedProfile, requestDecision, sha256,
  validateHelperTarget, validateProviderAfter, validateRequest } from './lib/hosted-native-qa.mjs';
import { githubIdentity, helperPlan, preparePinnedQaSources, PINNED_QA_OVERRIDES, readCanonicalSourceBlobs, leaseSourceInput } from './verify-existing-fleet-hosted-native.mjs';

const h='a'.repeat(64),c='b'.repeat(40),id='242efab6-9a8b-4f48-af9a-848029e6cdaf';
const request=()=>({schemaVersion:1,type:'cars-existing-fleet-hosted-native-qa-request',client:'priselci',workerName:'cars-priselci',publicOrigin:HOSTED_QA_ORIGIN,accountId:HOSTED_QA_ACCOUNT,sourceCommit:c,sourceTree:c,inputDigest:h,
  sourceReleases:Object.fromEntries(APPLICATIONS.map(key=>[key,{repository:'darkapoparka/cars',revision:TEMPLATE_REVISION,path:'templates/'+key,tree:c,digest:h}])),artifactDigest:h,outputDigest:h,buildRunId:1,buildAttempt:1,artifactId:2,artifactArchiveDigest:h,versionId:id,deploymentId:id,
  proofs:Object.fromEntries(['artifactManifest','singleWorkerReceipt','deploymentReceipt','providerSnapshot'].map(name=>[name,{reference:'docs/releases/test/'+name+'.json',sha256:h}]))});
const pin={publicOrigin:HOSTED_QA_ORIGIN,mount:'/variant-3'};
test('only the reviewed dealer origin and immutable S1 source are accepted',()=>{
  assert.equal(validateRequest(request()).client,'priselci');
  for(const mutate of [r=>r.publicOrigin='https://other.invalid',r=>r.client='al-reef',r=>r.sourceReleases.modern.revision=c,r=>r.sourceCommit='main',r=>r.versionId='latest',r=>r.command='anything',r=>r.proofs.providerSnapshot=r.proofs.deploymentReceipt]){const r=request();mutate(r);assert.throws(()=>validateRequest(r));}
});
test('corrected dealer/build/version pins are allowed only as exact pins, never arbitrary origin or command',()=>{
  const r=request();r.sourceCommit='d'.repeat(40);r.sourceTree='e'.repeat(40);r.buildRunId=35;r.artifactId=57;r.versionId='aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  assert.equal(validateRequest(r).sourceCommit,r.sourceCommit);
  for(const key of ['inputDigest','artifactDigest','outputDigest','artifactArchiveDigest']){const bad=structuredClone(r);bad[key]='latest';assert.throws(()=>validateRequest(bad));}
});
test('request boundary permits only reads and the exact mounted preference POST',()=>{
  for(const method of ['GET','HEAD','OPTIONS'])assert.equal(requestDecision(method,'https://images.invalid/x',pin),'read');
  assert.equal(requestDecision('POST',HOSTED_QA_ORIGIN+'/variant-3/api/preferences',pin),'preference');
  for(const [method,url] of [['POST',HOSTED_QA_ORIGIN+'/api/preferences'],['POST',HOSTED_QA_ORIGIN+'/variant-3/api/preferences?x=1'],['POST','https://other.invalid/variant-3/api/preferences'],['POST',HOSTED_QA_ORIGIN+'/variant-3/api/inquiries'],['DELETE',HOSTED_QA_ORIGIN+'/variant-3/api/preferences'],['POST',HOSTED_QA_ORIGIN+'/variant-3/api/ai/search']])assert.equal(requestDecision(method,url,pin),'blocked-business-or-other-write');
  assert.equal(requestDecision('POST',HOSTED_QA_ORIGIN+'/variant-3/api/preferences',pin,{preferences:false}),'blocked-business-or-other-write');
  assert.equal(requestDecision('POST','https://maps.googleapis.com/maps/GetViewportInfo',pin),'blocked-third-party-read-rpc');
});
test('browser boundary aborts attempted dealer writes and retains failed evidence',async()=>{
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-guard-'));let handler;
  const context={route:async(_pattern,fn)=>{handler=fn;}};
  const blocked=await guardHostedContext(context,{...pin,output});let aborted=0,continued=0;
  await handler({request:()=>({method:()=> 'POST',url:()=>HOSTED_QA_ORIGIN+'/variant-3/api/inquiries'}),abort:()=>aborted++,continue:()=>continued++});
  assert.equal(aborted,1);assert.equal(continued,0);assert.throws(()=>assertBoundary(blocked));
  assert.equal(JSON.parse(fs.readFileSync(path.join(output,'network-boundary.jsonl'),'utf8')).decision,'blocked-business-or-other-write');
  // Compact retained diagnostic JSON is deliberately kept; no recursive cleanup.
});
test('runtime pin must be hashed, physical, reviewed and contain its output root',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-pin-')),file=path.join(root,'runtime-pin.json');
  const value={schemaVersion:1,type:'cars-hosted-native-qa-runtime-pin',profile:HOSTED_QA_PROFILE,client:'priselci',workerName:'cars-priselci',publicOrigin:HOSTED_QA_ORIGIN,sourceCommit:c,sourceTree:c,versionId:id,requestSha256:h,artifactDigest:h,outputDigest:h,outputRoot:root};
  const bytes=Buffer.from(JSON.stringify(value));fs.writeFileSync(file,bytes);
  const env={CARS_HOSTED_QA_PROFILE:HOSTED_QA_PROFILE,CARS_HOSTED_QA_PIN_FILE:file,CARS_HOSTED_QA_PIN_SHA256:sha256(bytes)},p=readHostedProfile('import',env);
  assert.equal(p.mount,'/variant-3');validateHelperTarget(p,HOSTED_QA_ORIGIN,'/variant-3',p.output);
  assert.throws(()=>validateHelperTarget(p,HOSTED_QA_ORIGIN,'',p.output));assert.throws(()=>validateHelperTarget(p,HOSTED_QA_ORIGIN,'/variant-3',root));
  assert.throws(()=>readHostedProfile('import',{...env,CARS_HOSTED_QA_PIN_SHA256:h}));assert.equal(readHostedProfile('import',{}),null);
});
test('ordinary exported template QA loads without a Cars root library; hosted opt-in requires it',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-standalone-'));
  const write=(name,text)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);return file;};
  const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
  const env={...process.env};for(const name of Object.keys(env))if(name.startsWith('CARS_HOSTED_QA_')||name.startsWith('LOCALE_QA_'))delete env[name];
  const execute=(file,cwd,extra={})=>spawnSync(process.execPath,[file],{cwd,env:{...env,...extra},encoding:'utf8',timeout:15000});
  const ab=write('auto-best/scripts/qa-locale-storage.mjs',read('templates/auto-best/scripts/qa-locale-storage.mjs'));
  write('auto-best/node_modules/playwright/package.json',JSON.stringify({type:'module',exports:'./index.mjs'}));
  write('auto-best/node_modules/playwright/index.mjs',"export const chromium={launch:async()=>{throw Error('standalone-browser-launch-reached')}};");
  const loadedAb=execute(ab,path.dirname(path.dirname(ab)),{DEALER_BASE_URL:'https://read-only.invalid',LOCALE_QA_OUT:path.join(root,'auto-best/output')});
  assert.notEqual(loadedAb.status,0);assert.match(loadedAb.stderr,/standalone-browser-launch-reached/);assert.doesNotMatch(loadedAb.stderr,/hosted-native-qa|ERR_MODULE_NOT_FOUND/);
  const modern=write('modern/apps/e2e/localization-harness.mjs',read('templates/modern/apps/e2e/localization-harness.mjs'));
  const modernRunner=write('modern/apps/e2e/default-import.mjs',"import {hostedProfile,origin,mount} from './localization-harness.mjs';console.log(JSON.stringify({hostedProfile,origin:origin.origin,mount}));");
  const loadedModern=execute(modernRunner,path.dirname(modern));assert.equal(loadedModern.status,0,loadedModern.stderr);assert.deepEqual(JSON.parse(loadedModern.stdout),{hostedProfile:null,origin:'http://127.0.0.1:6494',mount:''});
  const importSource=read('templates/import/tests/localization.e2e.ts')
    .replace(/^import feed .+;\r?\n/m,'const feed=[];\n').replace(/^import \{ site \} .+;\r?\n/m,'const site={};\n').replace(/^import \{ promptVersion \} .+;\r?\n/m,"const promptVersion='v1';\n");
  const im=write('import/tests/localization.e2e.mjs',stripTypeScriptTypes(importSource));
  write('import/node_modules/@playwright/test/package.json',JSON.stringify({type:'module',exports:'./index.mjs'}));
  write('import/node_modules/@playwright/test/index.mjs',"export const expect=()=>{};export function test(){globalThis.registeredTests=(globalThis.registeredTests??0)+1};test.beforeEach=()=>{};test.afterEach=()=>{};test.describe={configure:()=>{}};");
  const importRunner=write('import/tests/default-import.mjs',"await import('./localization.e2e.mjs');console.log(globalThis.registeredTests);");
  const loadedImport=execute(importRunner,path.dirname(im));assert.equal(loadedImport.status,0,loadedImport.stderr);assert(Number(loadedImport.stdout)>7,'Ordinary Playwright test registration must remain available');
  for(const [file,cwd]of [[ab,path.dirname(path.dirname(ab))],[modernRunner,path.dirname(modern)],[importRunner,path.dirname(im)]]){
    const enabled=execute(file,cwd,{CARS_HOSTED_QA_PROFILE:HOSTED_QA_PROFILE,DEALER_BASE_URL:'https://read-only.invalid'});assert.notEqual(enabled.status,0);assert.match(enabled.stderr,/hosted-native-qa\.mjs/);
  }
});
const storage=()=>({results:['en','bg'].flatMap(locale=>[320,390,1440].flatMap(width=>['storage-unavailable','cookies-and-storage-unavailable','no-javascript'].map(mode=>({name:`auto-best ${locale} ${width} ${mode}`,pass:true}))))});
test('missing or duplicate storage cases cannot be promoted to complete coverage',()=>{
  assert.equal(parseHelperResults('auto-best-storage',storage()).length,18);
  const missing=storage();missing.results.pop();assert.throws(()=>parseHelperResults('auto-best-storage',missing));
  const duplicate=storage();duplicate.results[0]=duplicate.results[1];assert.throws(()=>parseHelperResults('auto-best-storage',duplicate));
});
test('a recorded browser assertion failure stays failed',()=>{const r=storage();r.results[0].pass=false;assert.equal(parseHelperResults('auto-best-storage',r).filter(entry=>!entry.passed).length,1);});
const modern=()=>({results:['en','bg'].flatMap(locale=>[
  ...[320,390,1440].flatMap(width=>['client preference save, reload, manual reopen and keyboard','dismissal never accepts an unsaved locale or country','rapid close/reopen cancels stale save and clears busy state'].map(name=>({name,locale,width,ok:true}))),
  {name:'no-JS native preference form preserves the return route',locale,width:390,ok:true,details:{endpoint:'live preference POST/303; actual native form/navigation without JS',responses:[{status:303}]}},
  {name:'explicit URLs work with unavailable storage and rejected cookies',locale,width:320,ok:true}
])});
test('Modern mocked no-JS responses cannot count as live hosted form evidence',()=>{
  assert.equal(parseHelperResults('modern',modern()).length,22);
  const fake=modern();fake.results.find(r=>r.name.startsWith('no-JS')).details.endpoint='mocked 303; actual native form/navigation without JS';assert.throws(()=>parseHelperResults('modern',fake));
  const skipped=modern();skipped.results[0].skipped=true;assert.equal(parseHelperResults('modern',skipped)[0].passed,false);
});
const importReport=()=>({errors:[],suites:[{specs:[...[320,390,1440].map(width=>'preferences save dismiss reload and focus '+width),'stale save cannot navigate after close and reopen','no JavaScript preferences and contact are native forms','explicit URL works with blocked storage and conflicting preferences','language/country and cookies cannot leak between requests'].map(title=>({title,ok:true,tests:[{status:'expected',results:[{status:'passed',duration:2}]}]}))}]});
test('Import requires the exact seven tests, one project and no retries',()=>{
  assert.equal(parseHelperResults('import',importReport()).length,7);
  const retry=importReport();retry.suites[0].specs[0].tests[0].results.push({status:'passed'});assert.throws(()=>parseHelperResults('import',retry));
  const business=importReport();business.suites[0].specs[0].title='both import modes and sell wizard validate without business writes';assert.throws(()=>parseHelperResults('import',business));
  const skip=importReport();skip.suites[0].specs[0].tests[0].results[0].status='skipped';assert.equal(parseHelperResults('import',skip)[0].passed,false);
});
test('fixed helper plan has no source build, deployment, arbitrary command or historical Carwow selection',()=>{
  const plan=helperPlan('/repo','/proof','/node22','/node24');assert.equal(plan.length,4);assert.equal(plan[1].env.LOCALE_QA_DESIGNS,'auto-best');
  assert.equal(plan[3].env.PLAYWRIGHT_SKIP_WEBSERVER,'1');assert(plan[3].args.includes('--retries=0'));assert(plan[3].args.includes('--workers=1'));
  assert.equal(plan[0].env.LOCALE_QA_WIDTHS,'320,390,1440');
});
test('GitHub pins use GET-only approved metadata and reject a different compiled subtree',async()=>{
  const r=request(),seen=[];
  const makeFetch=(tree=c)=>async(url,options)=>{
    seen.push({url,method:options.method});let body;
    if(url.endsWith('actions/runs/1'))body={id:1,run_attempt:1,status:'completed',conclusion:'success',head_sha:c,path:'.github/workflows/existing-fleet-cloudflare.yml'};
    else if(url.endsWith('actions/artifacts/2'))body={id:2,expired:false,workflow_run:{id:1,head_sha:c},digest:'sha256:'+h};
    else if(url.endsWith('branches/main'))body={commit:{sha:c}};
    else if(url.includes('/compare/'))body={status:'identical',merge_base_commit:{sha:c}};
    else if(url.endsWith('git/commits/'+c))body={tree:{sha:'d'.repeat(40)}};
    else if(url.endsWith('git/trees/'+'d'.repeat(40)))body={tree:[{path:'clients',type:'tree',sha:'e'.repeat(40)}]};
    else body={tree:[{path:'priselci',type:'tree',sha:tree}]};
    return {ok:true,text:async()=>JSON.stringify(body)};
  };
  assert.equal((await githubIdentity(r,{fetchImpl:makeFetch(),token:'inert-fixture-token'})).compiledCommit,c);
  assert(seen.every(entry=>entry.method==='GET'&&entry.url.startsWith('https://api.github.com/repos/darkapoparka/cars/')));
  await assert.rejects(githubIdentity(r,{fetchImpl:makeFetch('f'.repeat(40)),token:'inert-fixture-token'}));
});
test('post-QA provider proof cannot be replaced by an old snapshot or a different version',()=>{
  const r=request(),old={evidence:'authenticated-cloudflare-connector',checkedAt:'2020-01-01T00:00:00Z'};
  assert.throws(()=>validateProviderAfter(r,old,old,'2026-10-11T00:00:00Z'));
  assert.throws(()=>validateProviderAfter(r,old,{...old,checkedAt:new Date().toISOString()},'not-a-time'));
  const finishedAt=new Date(Date.now()-1000).toISOString(),fresh={evidence:'authenticated-cloudflare-connector',checkedAt:new Date().toISOString(),accountId:HOSTED_QA_ACCOUNT,workerName:'cars-priselci',exists:true,workersDev:true,routes:[],domains:[],tailConsumers:[],schedules:[],bindings:[{type:'assets',name:'ASSETS'}],scriptCount:101,allowedScripts:100,versionId:id,versionTraffic:[{version_id:id,percentage:100}],deploymentId:id};
  assert.equal(validateProviderAfter(r,fresh,fresh,finishedAt),true);
  assert.throws(()=>validateProviderAfter(r,fresh,{...fresh,deploymentId:'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'},finishedAt));
  assert.throws(()=>validateProviderAfter(r,fresh,{...fresh,versionId:'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'},finishedAt));
});
test('workflow is manual and read-only, with exact dependency/runtime pins and no provider secrets',()=>{
  const text=fs.readFileSync(new URL('../.github/workflows/existing-fleet-hosted-native-qa.yml',import.meta.url),'utf8');
  assert(text.includes('workflow_dispatch:'));assert(!/^\s+(?:push|pull_request|workflow_run):/m.test(text));assert(text.includes('contents: read')&&text.includes('actions: read'));
  assert(!/secrets\.|CLOUDFLARE|wrangler|permissions:\s*write-all/i.test(text));
  for(const version of ['22.23.2','24.21.0','26.10.0','pnpm@11.4.0'])assert(text.includes(version));
  assert(text.includes('persist-credentials: false')&&text.includes('--frozen-lockfile')&&text.includes('npm ci --ignore-scripts'));
});


test('workflow runner browser cache uses supported step env contexts and the same install/run path',()=>{
  const text=fs.readFileSync(new URL('../.github/workflows/existing-fleet-hosted-native-qa.yml',import.meta.url),'utf8');
  // https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability
  const check=workflow=>{
    const nl=String.fromCharCode(10),envStart=workflow.indexOf(nl+'    env:'+nl),stepsStart=workflow.indexOf(nl+'    steps:'+nl);
    assert(envStart>=0&&stepsStart>envStart);
    const allowed=new Set(['github','needs','strategy','matrix','vars','secrets','inputs']);
    const jobEnv=workflow.slice(envStart,stepsStart),open=String.fromCharCode(36)+'{{';
    for(const expression of jobEnv.split(open).slice(1)){const context=expression.trimStart().split('.')[0];assert(allowed.has(context),'unsupported job env context: '+context);}
    const names=['Install lockfile-pinned Auto Best and Modern QA dependencies','Install lockfile-pinned Import QA dependencies','Verify exact deployment pins and collect existing native browser checks'];
    const steps=workflow.slice(stepsStart).split(nl+'      - ').slice(1),cache='          PLAYWRIGHT_BROWSERS_PATH: '+open+' runner.temp }}/cars-hosted-native-browsers';
    for(const name of names){const block=steps.find(step=>step.startsWith('name: '+name+nl));assert(block,'missing browser step: '+name);assert(block.includes(nl+'        env:'+nl)&&block.split(nl).includes(cache),'missing step cache: '+name);}
    assert.equal(workflow.split('PLAYWRIGHT_BROWSERS_PATH:').length-1,3);
  };
  check(text);
  assert.throws(()=>check(text.replace('      NEXT_TELEMETRY_DISABLED:', '      PLAYWRIGHT_BROWSERS_PATH: '+String.fromCharCode(36)+'{{ runner.temp }}/browser-cache'+String.fromCharCode(10)+'      NEXT_TELEMETRY_DISABLED:')),/unsupported job env context: runner/);
  assert.throws(()=>check(text.replace('          PLAYWRIGHT_BROWSERS_PATH:', '          REMOVED_BROWSER_CACHE:')),/missing step cache/);
});

test('immutable S1 restoration retains only four canonical QA overrides and leaves dealer source intact',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-qa-s1-')),head='a'.repeat(40),files=new Map();for(const name of PINNED_QA_OVERRIDES){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});const bytes=Buffer.from('canonical reviewed QA override '+name+'\n');fs.writeFileSync(file,bytes);files.set(name,bytes);}
 const architecture=path.join(root,'templates/auto-best/scripts/check-architecture.mjs'),client=path.join(root,'clients/priselci/stock.json');fs.writeFileSync(architecture,'current architecture drift');fs.mkdirSync(path.dirname(client),{recursive:true});fs.writeFileSync(client,'unchanged original dealer facts');
 const oid=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),env={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:'refs/heads/main',GITHUB_SHA:head,GITHUB_WORKFLOW_REF:'darkapoparka/cars/.github/workflows/existing-fleet-hosted-native-qa.yml@refs/heads/main'},gitRead=(_root,...args)=>args.join(' ')==='rev-parse HEAD'?head:args[0]==='remote'?'https://github.com/darkapoparka/cars.git':oid(files.get(args[1].slice(head.length+1)));let restores=0;
 const options={root,env,platform:'linux',version:'v26.10.0',gitRead,readBlobs:()=>new Map([...files.values()].map(bytes=>[oid(bytes),bytes])),restore:paths=>{restores++;assert.deepEqual(paths,['templates/auto-best','templates/modern','templates/import']);fs.writeFileSync(architecture,'exact immutable S1 architecture');for(const name of PINNED_QA_OVERRIDES)fs.writeFileSync(path.join(root,name),'raw S1 helper');},validateSources:()=>{assert.equal(fs.readFileSync(architecture,'utf8'),'exact immutable S1 architecture');for(const [name,bytes]of files)assert(fs.readFileSync(path.join(root,name)).equals(bytes));return {leases:[{path:'verified immutable input'}]};}};
 const result=preparePinnedQaSources(options);assert.equal(restores,1);assert.equal(result.overrides.length,4);assert.equal(result.templateRevision,TEMPLATE_REVISION);assert.equal(fs.readFileSync(client,'utf8'),'unchanged original dealer facts');assert.equal(result.clientSourceChanged,false);
 assert.throws(()=>preparePinnedQaSources({...options,env:{...env,GITHUB_EVENT_NAME:'push'}}));assert.equal(restores,1);
 fs.writeFileSync(path.join(root,PINNED_QA_OVERRIDES[0]),'unreviewed override');assert.throws(()=>preparePinnedQaSources(options),/differs from canonical/);assert.equal(restores,1);
});
test('workflow restores immutable S1 before dependency installation without changing browser cases or proof guards',()=>{
 const text=fs.readFileSync(new URL('../.github/workflows/existing-fleet-hosted-native-qa.yml',import.meta.url),'utf8');assert.equal(text.split('--prepare-source').length-1,1);assert(text.indexOf('--prepare-source')<text.indexOf('Install lockfile-pinned Auto Best and Modern'));assert(text.includes('--request "$QA_REQUEST" --sha256 "$QA_REQUEST_SHA256" --run'));
});


test('real immutable Git blobs retain raw OIDs while equivalent LF, CRLF and mixed text are leased',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-raw-blobs-'));
  const git=(args,input)=>{const result=spawnSync('git',args,{cwd:root,input,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},encoding:null});assert.equal(result.status,0,result.stderr.toString());return result.stdout;};
  git(['init','--bare','--quiet']);
  const lf=Buffer.from('export const count = 16;\nexport const mode = "dated-source";\n');
  const crlf=Buffer.from(lf.toString().replaceAll('\n','\r\n'));
  const mixed=Buffer.from('export const count = 16;\r\nexport const mode = "dated-source";\n');
  const raw=[lf,crlf,mixed],ids=raw.map(bytes=>git(['hash-object','-w','--stdin'],bytes).toString().trim());
  assert.equal(new Set(ids).size,3,'Real Git preserves raw newline identity');
  const originals=readCanonicalSourceBlobs(root,[...ids,ids[0]]);assert.equal(originals.size,3);
  for(let i=0;i<ids.length;i++) {
    assert(originals.get(ids[i]).equals(raw[i]),'Raw batch content must retain every newline and suffix');
    for(const physical of raw) {const lease=leaseSourceInput('fixture/source.mjs',physical,ids[i],originals.get(ids[i]));
      assert.equal(lease.blob,ids[i]);assert.equal(lease.canonicalSha256,sha256(raw[i]));assert.equal(lease.sha256,sha256(lf));}
    assert.throws(()=>leaseSourceInput('fixture/source.mjs',Buffer.from(lf.toString().replace('16','17')),ids[i],originals.get(ids[i])),/changed from S1/);
  }
  assert.throws(()=>readCanonicalSourceBlobs(root,['f'.repeat(40)]),/Missing or non-blob/);
  assert.throws(()=>leaseSourceInput('fixture/source.mjs',lf,ids[0],mixed),/Raw canonical source OID differs/);
});
test('binary inputs and malformed physical UTF-8 cannot hide changed source bytes',()=>{
  const raw=Buffer.from([255,13,10,0]),oid=createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex');
  const lease=leaseSourceInput('fixture/image.bin',raw,oid,raw);assert.equal(lease.sha256,sha256(raw));
  assert.throws(()=>leaseSourceInput('fixture/image.bin',Buffer.from([254,13,10,0]),oid,raw),/changed from S1/);
  const nul=Buffer.from([0,13,10,65]),nulOid=createHash('sha1').update('blob '+nul.length+'\0').update(nul).digest('hex');
  assert.equal(leaseSourceInput('fixture/image.bin',nul,nulOid,nul).consumedBytes,4);
  assert.throws(()=>leaseSourceInput('fixture/image.bin',Buffer.from([0,10,65]),nulOid,nul),/changed from S1/);
  const text=Buffer.from('canonical text\n'),textOid=createHash('sha1').update('blob '+text.length+'\0').update(text).digest('hex');
  assert.throws(()=>leaseSourceInput('fixture/source.mjs',Buffer.from([255,10]),textOid,text));
});
test('immutable source batches stay below the existing per-process byte limit',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-batched-blobs-'));
  const git=(args,input)=>{const result=spawnSync('git',args,{cwd:root,input,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},encoding:null});assert.equal(result.status,0,result.stderr.toString());return result.stdout;};
  git(['init','--bare','--quiet']);
  // Repetitive in-memory fixtures compress to small Git objects; no asset or source copies.
  const raw=[Buffer.alloc(9*1024**2,97),Buffer.alloc(9*1024**2,98)];
  const ids=raw.map(bytes=>git(['hash-object','-w','--stdin'],bytes).toString().trim());
  const originals=readCanonicalSourceBlobs(root,ids);for(let i=0;i<ids.length;i++)assert(originals.get(ids[i]).equals(raw[i]));
});
