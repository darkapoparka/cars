import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {cloudflarePackProvider,packAssetHash,packAssetManifest,packModuleUploadPlan,packModuleUpload,readPackUploadFile,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,packDeploymentRequest} from './lib/dealer-pack-queue.mjs';
import {createPackConnectorRpc,listPackConnectorRequests} from './dealer-pack-connector-bridge.mjs';
import {verifyPublishedPackSource,inspectPackDeploymentBatch} from './deploy-dealer-packs.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const clock='2026-10-19T21:00:00.000Z';
const request=packDeploymentRequest({slug:'dealer-one',dealerId:'gb-london-dealer-one',batch:1,workerName:'cars-dealer-one',publicOrigin:'https://dealer-one.webpreviews.site',packDigest:hash('pack'),releaseId:'cars-six-'+hash('release'),releaseDigest:hash('release'),outputDigest:hash('output'),sourceCommit:'a'.repeat(40)});
const ok=(result,extra={})=>({status:200,success:true,result,...extra});
function temporary(t){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-provider-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return directory;}
function bundle(t){
  const directory=temporary(t),files=[];
  const values={'server/worker.mjs':'export default {fetch(){return new Response("test")}}','server/router.js':'export const value=1','server/native.wasm':Buffer.from([0,97,115,109,1,0,0,0]),'public/index.html':'identical','public/style.css':'identical','public/_headers':'/*\n  x-preview: true\n','public/_redirects':'/old / 302\n','public/image.svg':'<svg xmlns="http://www.w3.org/2000/svg"/>'};
  for(const [name,value] of Object.entries(values)){const bytes=Buffer.from(value),file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);files.push({path:name,bytes:bytes.length,sha256:hash(bytes)});}
  return {directory,files,outputDigest:request.outputDigest,config:{name:request.workerName,main:'server/worker.mjs',compatibility_date:'2026-09-25',compatibility_flags:['nodejs_compat'],assets:{binding:'ASSETS',run_worker_first:false,html_handling:'none',not_found_handling:'none'}}};
}

test('asset and module payloads preserve sealed bytes, MIME and native routing metadata',t=>{
  const candidate=bundle(t),assets=packAssetManifest(candidate);
  assert.notEqual(assets.manifest['/index.html'].hash,assets.manifest['/style.css'].hash);
  assert.equal(assets.manifest['/_headers'],undefined);assert.equal(assets.manifest['/_redirects'],undefined);
  const body=packModuleUpload(candidate,{request,assets:{completionToken:'test-only-completion-token'}});
  const plan=packModuleUploadPlan(candidate,{request,assets:{completionToken:'test-only-completion-token'}});
  assert.deepEqual(body,{...plan,modules:plan.modules.map(({file,...module})=>({...module,content_base64:fs.readFileSync(path.join(candidate.directory,file.path)).toString('base64')}))});
  assert.equal(body.main_module,'server/worker.mjs');assert.deepEqual(body.bindings,[{type:'assets',name:'ASSETS'}]);assert.equal(body.assets.config.run_worker_first,false);assert.equal(body.assets.config.html_handling,'none');
  assert.equal(body.modules.find(row=>row.name==='server/native.wasm').content_type,'application/wasm');assert.equal(body.modules.find(row=>row.name==='_headers').content_type,'text/plain');
  for(const row of body.modules){const source=candidate.files.find(file=>file.path===row.name||file.path==='public/'+row.name);assert.equal(hash(Buffer.from(row.content_base64,'base64')),source.sha256);}
});
test('asset hashes match retained Wrangler4.149.0 golden values and preserve exact extensions',()=>{
  assert.equal(packAssetHash(Buffer.from('identical'),'index.html'),'de00984b532586084e5ed86f8bad77d9');
  assert.equal(packAssetHash(Buffer.from('identical'),'style.css'),'4ba17ce368d289d29fcef8058b76f0aa');
  assert.equal(packAssetHash(Buffer.alloc(0),'empty.txt'),'f9bc91770fa5e997cbd47fba833629fc');
  assert.equal(packAssetHash(Buffer.from('identical'),'first/file.html'),packAssetHash(Buffer.from('identical'),'another/file.html'));
  assert.notEqual(packAssetHash(Buffer.from('identical'),'file.HTML'),packAssetHash(Buffer.from('identical'),'file.html'));
});
test('modified assets and symlinked ancestor escapes fail before upload',t=>{
  const candidate=bundle(t),row=candidate.files.find(file=>file.path==='public/image.svg');fs.appendFileSync(path.join(candidate.directory,row.path),'changed');assert.throws(()=>packAssetManifest(candidate),/sealed inventory/);
  const outside=temporary(t),bytes=Buffer.from('private-outside-file');fs.writeFileSync(path.join(outside,'private.txt'),bytes);fs.symlinkSync(outside,path.join(candidate.directory,'public/escape'),'dir');
  assert.throws(()=>readPackUploadFile(candidate,{path:'public/escape/private.txt',bytes:bytes.length,sha256:hash(bytes)}),/symlinked ancestor/);assert.throws(()=>readPackUploadFile(candidate,{path:'public/../../escape',bytes:1,sha256:hash('x')}),/Unsafe upload/);
});
test('modern paginated inventory includes never-deployed reservations and refuses a changing total',async()=>{
  const workers=Array.from({length:201},(_,i)=>({id:i.toString(16).padStart(32,'0'),name:i===200?request.workerName:'cars-protected-'+i,tags:[],deployed_on:null,subdomain:{enabled:false,previews_enabled:false}})),calls=[];
  const api=async operation=>{calls.push(operation);if(operation.path.endsWith('/workers/workers'))return ok(workers.slice((operation.query.page-1)*100,operation.query.page*100),{result_info:{total_count:201,total_pages:3}});if(operation.path.endsWith('/workers/routes')||operation.path.endsWith('/workers/domains'))return ok([]);if(operation.path.endsWith(workers[200].id))return ok(workers[200]);throw Error('Unexpected endpoint');};
  const provider=cloudflarePackProvider({api,now:()=>clock}),snapshot=await provider.snapshot({request,challenge:{requestId:'challenge',stage:'test',notBefore:clock}});
  assert.equal(snapshot.scriptCount,201);assert.equal(snapshot.target.undeployed,true);assert.equal(snapshot.target.versionId,null);assert.deepEqual(calls.filter(row=>row.path.endsWith('/workers/workers')).map(row=>row.query.page),[1,2,3]);assert.equal(calls.some(row=>row.path.endsWith('/deployments')),false);
  const drifting=cloudflarePackProvider({api:async operation=>{const response=await api(operation);if(operation.path.endsWith('/workers/workers')&&operation.query.page===2)response.result_info.total_count=202;return response;},now:()=>clock});
  await assert.rejects(()=>drifting.snapshot({request,challenge:{requestId:'new',stage:'test',notBefore:clock}}),/changed while paginating/);
});
test('create-only conflict reports a known failure and exposes no name-upsert request',async()=>{
  const calls=[],provider=cloudflarePackProvider({api:async operation=>{calls.push(operation);return {status:409,success:false,result:null};}});
  await assert.rejects(()=>provider.createWorker({request,ownershipTags:['cars-pack-v1']}),error=>error.providerOutcomeKnown===true&&/conflict/.test(error.message));assert.equal(calls.length,1);assert.equal(calls[0].method,'POST');assert.equal(calls[0].path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers');assert.equal(calls[0].body.name,request.workerName);assert.equal(calls[0].body.subdomain.enabled,false);
});
test('static uploads use only session JWT, enforce requested hashes, and require completion',async t=>{
  const candidate=bundle(t),assets=packAssetManifest(candidate),keys=[...assets.byHash.keys()],session='test-ephemeral-session-token',completion='test-ephemeral-completion-token',uploads=[];let writes=0;
  const provider=cloudflarePackProvider({api:async operation=>{assert.equal(operation.path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/scripts/'+request.workerName+'/assets-upload-session');assert.deepEqual(operation.body.manifest,assets.manifest);return ok({jwt:session,buckets:[keys]});},assetFetch:async(url,options)=>{uploads.push({url,options});assert.equal(options.headers.Authorization,'Bearer '+session);for(const [key,value] of options.body.entries()){assert.ok(keys.includes(key));assert.equal(value.type,assets.byHash.get(key).mime);assert.equal(hash(Buffer.from(await value.text(),'base64')),assets.byHash.get(key).row.sha256);}return {status:201,json:async()=>({success:true,result:{jwt:completion}})};}});
  const result=await provider.prepareAssets({candidate,request,beforeWrite:async()=>{writes++;}});assert.equal(result.completionToken,completion);assert.equal(result.uploadedFiles,keys.length);assert.equal(uploads.length,1);assert.equal(writes,2);
  const corrupt=cloudflarePackProvider({api:async()=>ok({jwt:session,buckets:[['f'.repeat(32)]]}),assetFetch:async()=>assert.fail('No unknown asset can upload')});await assert.rejects(()=>corrupt.prepareAssets({candidate,request,beforeWrite:async()=>{}}),/unknown or duplicate/);
});
test('version uploads address immutable Worker IDs and preserve measured startup',async t=>{
  const candidate=bundle(t),workerId='b'.repeat(32),versionId='11111111-1111-4111-8111-111111111111',calls=[],provider=cloudflarePackProvider({api:async operation=>{calls.push(operation);return ok({id:versionId,startup_time_ms:23});}});
  const uploaded=await provider.upload({candidate,request,workerId,assets:{completionToken:'test-only-completion-token'},ownershipTags:['cars-pack-v1']});assert.equal(uploaded.workerId,workerId);assert.equal(uploaded.versionId,versionId);assert.equal(uploaded.startupTimeMs,23);assert.equal(calls[0].method,'POST');assert.equal(calls[0].path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers/'+workerId+'/versions');assert.deepEqual(calls[0].query,{deploy:false});await assert.rejects(()=>provider.upload({candidate,request,workerId:request.workerName,assets:{}}),/immutable Worker ID/);
});
test('token adapter confines API paths and does not return authentication headers',async()=>{
  const token='test-account-token-never-log',calls=[],transport=tokenCloudflareTransport({token,fetchImpl:async(url,options)=>{calls.push({url:String(url),options});return {status:200,json:async()=>({success:true,result:[]})};}});
  const response=await transport({method:'GET',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers',query:{page:2}});assert.equal(calls[0].options.headers.Authorization,'Bearer '+token);assert.match(calls[0].url,/page=2/);assert.equal(JSON.stringify(response).includes(token),false);await assert.rejects(()=>transport({method:'POST',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/billing/profile',body:{}}),/scope/);await assert.rejects(()=>transport({method:'DELETE',path:'/zones/foreign/workers/routes'}),/scope/);assert.equal(calls.length,1);
});
test('published source proof binds every retained input and rejects uncommitted bytes',async t=>{
  const root=temporary(t),slug=request.slug,directory=path.join(root,'dealers',slug);fs.mkdirSync(directory,{recursive:true});const original=Buffer.from('{"name":"Exact Dealer"}\n');fs.writeFileSync(path.join(directory,'business-facts.json'),original);
  const git=args=>{const result=spawnSync('git',['-C',root,...args],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);return result.stdout.trim();};git(['init','-q']);git(['add','dealers']);git(['-c','user.name=Pack test','-c','user.email=pack-test@example.invalid','commit','-qm','fixture']);const sourceCommit=git(['rev-parse','HEAD']),tree=git(['rev-parse','HEAD^{tree}']);
  const sourceFiles=new Map([['business-facts.json',original]]),pack={sourceFiles,files:new Map([...sourceFiles,['branding/generated.png',Buffer.from('generated-not-committed')]])},readGithub=async operation=>{assert.equal(operation.path,'/repos/darkapoparka/cars/commits/'+sourceCommit);return {status:200,body:{sha:sourceCommit,commit:{tree:{sha:tree}}}};};
  const proof=await verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub});assert.equal(proof.verified,true);assert.equal(proof.inputFiles,1);assert.equal(proof.mainReachabilityClaimed,false);
  sourceFiles.set('business-facts.json',Buffer.from('tampered'));await assert.rejects(()=>verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub}),/published commit/);await assert.rejects(()=>verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub:async()=>({status:404,body:{}})}),/not published/);
});
test('one failing candidate is reported and independent candidates remain deployable',async()=>{
  const slugs=['dealer-one','bad-pack','dealer-three'],report=await inspectPackDeploymentBatch({slugs,bundleRoot:'/unused',inspect:async({slug})=>{if(slug==='bad-pack')throw Error('Malformed pack fixture');return {request:packDeploymentRequest({...request,slug,dealerId:'gb-london-'+slug,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site'})};}});
  assert.equal(report.success,false);assert.deepEqual(report.requests.map(row=>row.slug),['dealer-one','dealer-three']);assert.deepEqual(report.failures,[{slug:'bad-pack',reason:'Malformed pack fixture'}]);assert.equal(report.providerWrites,0);assert.equal(report.liveProviderVerified,false);
});
test('connector RPC keeps tokens out of notifications and cleans private exchange files',async t=>{
  const directory=temporary(t),notifications=[],secret='fixture-secret-asset-session',rpc=createPackConnectorRpc({directory,pollMs:2,timeoutMs:1000,notify:value=>{notifications.push(value);const requestFile=path.join(directory,'requests',value.id+'.json'),stored=JSON.parse(fs.readFileSync(requestFile,'utf8'));assert.equal(stored.operation.session.jwt,secret);assert.equal(fs.statSync(requestFile).mode&0o777,0o600);fs.writeFileSync(path.join(directory,'responses',value.id+'.json'),JSON.stringify({id:value.id,channel:value.channel,result:{completionToken:secret}}),{mode:0o600});}});
  const result=await rpc('cloudflare-assets',{session:{jwt:secret},request:{slug:request.slug},endpoint:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/assets/upload'});assert.equal(result.completionToken,secret);assert.equal(JSON.stringify(notifications).includes(secret),false);assert.deepEqual(listPackConnectorRequests(directory),[]);assert.deepEqual(fs.readdirSync(path.join(directory,'responses')),[]);
});
test('connector RPC rejects mismatched responses and timeouts without retaining secret files',async t=>{
  const directory=temporary(t),rpc=createPackConnectorRpc({directory,pollMs:1,timeoutMs:100,notify:value=>fs.writeFileSync(path.join(directory,'responses',value.id+'.json'),JSON.stringify({id:'wrong-request',channel:value.channel,result:{}}),{mode:0o600})});
  await assert.rejects(()=>rpc('github',{method:'GET',path:'/repos/darkapoparka/cars/contents/queue.json'}),/identity differs/);assert.deepEqual(listPackConnectorRequests(directory),[]);
  const blocked=createPackConnectorRpc({directory,pollMs:1,timeoutMs:5});await assert.rejects(()=>blocked('cloudflare',{method:'POST',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers'}),/retains its durable claim/);assert.deepEqual(listPackConnectorRequests(directory),[]);
});
