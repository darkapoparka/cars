import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {sha256} from './lib/workflow.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue,packDeploymentRequest,queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {packOwnershipTags} from './lib/dealer-pack-deployment.mjs';
import {PACK_RECEIPT_REGISTRY_FILES,readPackReceiptSource,packReceiptSourceReader,integratePackDeploymentReceipts} from './merge-dealer-pack-receipts.mjs';
import {registryViews,writeRegistryViews,validateRegistry} from './index-deployments.mjs';

const now='2026-10-19T20:00:00.000Z';
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const variants=keys.map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:index===1?'/variant-2/cars':index?'/variant-'+(index+1)+'/':'/'}));
const encode=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const fileRows=files=>[...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name,bytes])=>({path:name,sha256:sha256(bytes)}));
function git(root,args){const result=spawnSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:4*1024**2,timeout:10000});assert.equal(result.status,0,'fixture Git command must finish successfully');assert.equal(result.signal,null);return result.stdout;}
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-receipts-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'docs'),{recursive:true});fs.mkdirSync(path.join(root,'clients'),{recursive:true});
  git(root,['init','--quiet']);git(root,['config','user.name','Cars receipt test']);git(root,['config','user.email','receipt-test@example.invalid']);
  const registry={schemaVersion:2,updatedAt:'2026-10-18T00:00:00.000Z',aliases:{'preserved-alias':'protected-0'},historicalScope:{note:'Preserve every existing row'},dealers:Array.from({length:100},(_,index)=>({
    slug:'protected-'+index,id:'old-'+index,name:'Original dealer '+index,localPath:'clients/protected-'+index,localPresent:true,repository:'fixture/cars-protected-'+index,variants:[{key:'auto-best',entry:'/',state:'retained-evidence'}],
    delivery:{provider:'cloudflare',state:'live-verified',workerName:'cars-protected-'+index,url:'https://protected-'+index+'.webpreviews.site/',custom:{retained:index}},
    evidence:{browser:{state:'passed',report:'existing-evidence-'+index},ownerReview:{state:'unknown'}},deliveryHistory:[{kind:'untouched-old-history',index}]
  }))};
  fs.writeFileSync(path.join(root,PACK_RECEIPT_REGISTRY_FILES[0]),encode(registry));writeRegistryViews(root);
  fs.mkdirSync(path.join(root,'clients/protected-0'),{recursive:true});fs.writeFileSync(path.join(root,'clients/protected-0/dealer.json'),'malformed retained source must never be scanned');
  const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:now,authorizationSource:'Owner M2 explicitly authorizes preview deployment',reason:'Owner accepts the final occupied slot after live capacity checks',maximumNewDealers:400,zoneName:'webpreviews.site'};
  const queue=createPackDeploymentQueue({policy,baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:now,workerNames:registry.dealers.map(row=>row.delivery.workerName),routes:[],domains:[]},now,queueId:'11111111-1111-4111-8111-111111111111'});
  let versions=0;
  const commitPack=(slug,name)=>{
    const manifest={schemaVersion:1,slug,dealerId:'gb-birmingham-'+slug,repository:'darkapoparka/cars',defaultBranch:'main',sourceFormat:'dealer-pack',sourcePath:'dealers/'+slug,pack:{schemaVersion:2,benchmarkOnly:false},packaging:{version:'5'},variants,templateSources:Object.fromEntries(keys.map(key=>[key,{repository:'darkapoparka/cars',path:'templates/'+key,revision:'b'.repeat(40),digest:sha256(key)}]))};
    const files=new Map([['dealer.json',encode(manifest)],['business-facts.json',encode({business:{name,phone:'+441234567890'}})],['branding/logo-source.svg',Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><title>'+name+'</title></svg>')]]);
    for(const [relative,bytes] of files){const target=path.join(root,'dealers',slug,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
    git(root,['add','--','dealers/'+slug]);git(root,['commit','--quiet','-m','Fixture published pack '+slug+' '+name]);
    const sourceCommit=git(root,['rev-parse','HEAD']).trim(),sourceTree=git(root,['rev-parse',sourceCommit+':dealers/'+slug]).trim(),prefix='dealers/'+slug+'/';
    const rows=git(root,['ls-tree','-r','-z',sourceCommit,'--','dealers/'+slug]).split('\0').filter(Boolean).map(line=>{const [,mode,sha,name]=/^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(line);return {path:name.slice(prefix.length),mode,sha};});
    return {slug,manifest,sourceCommit,sourceProof:{verified:true,evidence:'authenticated-github-commit-and-exact-git-blob-bytes',repository:'darkapoparka/cars',commit:sourceCommit,path:'dealers/'+slug,sourceTree,sourceTreeSha256:queueDigest(rows),inputFiles:rows.length,observedAt:now,mainReachabilityClaimed:false},packDigest:sha256(JSON.stringify(fileRows(files)))};
  };
  const appendReceipt=(pack,{action='deploy',rollbackTo}={})=>{
    const request=packDeploymentRequest({slug:pack.slug,dealerId:pack.manifest.dealerId,batch:1,workerName:'cars-'+pack.slug,publicOrigin:'https://'+pack.slug+'.webpreviews.site',sourceCommit:pack.sourceCommit,packDigest:pack.packDigest,releaseId:'cars-six-'+sha256('release'),releaseDigest:sha256('release'),outputDigest:sha256(pack.packDigest+'output'),action,rollbackTo});
    versions++;const previous=queue.receipts[pack.slug]?.at(-1),receipt={schemaVersion:1,type:'cars-dealer-pack-deployment',status:'deployed',queueId:queue.queueId,accountId:queue.accountId,zoneId:queue.zoneId,requestId:request.id,
      ...Object.fromEntries(['slug','dealerId','batch','workerName','publicOrigin','sourceCommit','packDigest','releaseId','releaseDigest','outputDigest'].map(key=>[key,request[key]])),sourceProof:pack.sourceProof,workerId:sha256(pack.slug).slice(0,32),versionId:String(versions).padStart(8,'0')+'-2222-4222-8222-222222222222',routeId:sha256(pack.slug+'route').slice(0,32),ownershipTags:previous?.receipt.ownershipTags??packOwnershipTags(queue,request),hostedVerified:true,hosted:{sha256:sha256('hosted-'+versions),report:{language:'en'}},finishedAt:now};
    const envelope={receipt,sha256:queueDigest(receipt)};queue.order.push(request.id);queue.requests[request.id]={request,status:'deployed',events:[],receiptSha256:envelope.sha256};(queue.receipts[pack.slug]??=[]).push(envelope);validatePackQueue(queue);return envelope;
  };
  const read=packReceiptSourceReader({root}),snapshot=()=>PACK_RECEIPT_REGISTRY_FILES.map(relative=>fs.readFileSync(path.join(root,relative)));
  const integrate=options=>integratePackDeploymentReceipts({root,queue,queueAuthenticated:true,readPack:read,write:true,now,...options});
  return {root,registry,queue,commitPack,appendReceipt,read,snapshot,integrate};
}

test('proposal reads the published receipt commit after local research advances and writes no registry views',t=>{
  const f=fixture(t),published=f.commitPack('dealer-one','Published Dealer One');f.appendReceipt(published);f.commitPack('dealer-one','Later Research Name');
  fs.writeFileSync(path.join(f.root,'dealers/dealer-one/dealer.json'),'merge-conflicted current manifest');
  const before=f.snapshot(),out=path.join(f.root,'runtime/proposed-inventory.json'),result=f.integrate({write:false,queueAuthenticated:false,out});
  assert.deepEqual(f.snapshot(),before);assert.equal(result.report.mode,'proposal');assert.deepEqual(result.report.filesWritten,[]);assert.equal(result.report.providerWrites,0);assert.equal(result.report.branchWrites,0);
  const saved=JSON.parse(fs.readFileSync(out));assert.equal(saved.dealers.at(-1).name,'Published Dealer One');assert.equal(saved.dealers.at(-1).canonicalSourceCommit,published.sourceCommit);assert.deepEqual(saved.dealers.slice(0,100),f.registry.dealers);
  assert.equal(fs.readFileSync(path.join(f.root,'dealers/dealer-one/dealer.json'),'utf8'),'merge-conflicted current manifest');
});

test('source commit, published tree and physical input mismatch refuse integration before any file replacement',t=>{
  const f=fixture(t),pack=f.commitPack('dealer-one','Published Dealer One');f.appendReceipt(pack);const before=f.snapshot();
  for(const alter of [value=>{value.sourceCommit='f'.repeat(40);},value=>{value.sourceTree='e'.repeat(40);},value=>{value.files.set('business-facts.json',encode({business:{name:'Foreign substituted name'}}));}]){
    assert.throws(()=>f.integrate({readPack:(slug,context)=>{const source=f.read(slug,context);alter(source);return source;}}),/committed pack source|published Git blobs/);assert.deepEqual(f.snapshot(),before);
  }
  const receipt=structuredClone(f.queue.receipts['dealer-one'][0].receipt);receipt.sourceCommit='d'.repeat(40);assert.throws(()=>readPackReceiptSource({root:f.root,receipt}),/authenticated published pack source proof/);assert.deepEqual(f.snapshot(),before);
});

test('explicit integration preserves the original100 rows, supports shared pack repository and regenerates exact existing views',t=>{
  const f=fixture(t);f.appendReceipt(f.commitPack('dealer-one','Published Dealer One'));f.appendReceipt(f.commitPack('dealer-two','Published Dealer Two'));
  const oldRows=f.registry.dealers.map(row=>JSON.stringify(row)),oldProjects=registryViews(f.registry).index.projects,result=f.integrate();
  assert.equal(result.changes.length,2);assert.equal(result.unchangedExistingRows,100);assert.deepEqual(result.report.filesWritten,PACK_RECEIPT_REGISTRY_FILES);assert.equal(validateRegistry(result.registry),true);
  const saved=JSON.parse(fs.readFileSync(path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0])));assert.deepEqual(saved.dealers.slice(0,100).map(row=>JSON.stringify(row)),oldRows);
  const views=registryViews(saved);assert.equal(fs.readFileSync(path.join(f.root,'docs/DEPLOYMENTS.md'),'utf8'),views.deployments);assert.equal(fs.readFileSync(path.join(f.root,'clients/README.md'),'utf8'),views.clientGuide);assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root,'clients/index.json'))),views.index);assert.deepEqual(views.index.projects.slice(0,100),oldProjects);
  for(const row of saved.dealers.slice(100)){assert.ok(views.deployments.includes('/tree/'+row.canonicalSourceCommit+'/'+row.sourcePath+'/'));const project=views.index.projects.find(value=>value.slug===row.slug);assert.equal(project.sourceCommit,row.canonicalSourceCommit);assert.equal(project.sourcePath,row.sourcePath);}
  assert.equal(fs.readFileSync(path.join(f.root,'clients/protected-0/dealer.json'),'utf8'),'malformed retained source must never be scanned');
  const snapshots=f.snapshot(),again=f.integrate({now:'2026-10-20T00:00:00.000Z'});assert.deepEqual(again.changes,[]);assert.deepEqual(again.report.filesWritten,[]);assert.deepEqual(f.snapshot(),snapshots);
  const duplicate=structuredClone(saved);duplicate.dealers.push({...duplicate.dealers[0],slug:'other-legacy'});assert.throws(()=>validateRegistry(duplicate),/Repository reused/);
  const invalid=structuredClone(saved);invalid.dealers.at(-1).sourcePath='dealers/dealer-one';assert.throws(()=>validateRegistry(invalid),/exact published source/);
});

test('a later own deployment and rollback update only the owned pack while retaining the previous receipt and source history',t=>{
  const f=fixture(t),firstPack=f.commitPack('dealer-one','First Published Name'),first=f.appendReceipt(firstPack);f.integrate();
  const previous=JSON.parse(fs.readFileSync(path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0]))).dealers.at(-1),secondPack=f.commitPack('dealer-one','Second Published Name'),second=f.appendReceipt(secondPack),updated=f.integrate();
  const row=updated.registry.dealers.at(-1);assert.equal(updated.changes[0].action,'updated-own-pack');assert.equal(row.name,'Second Published Name');assert.equal(row.canonicalSourceCommit,secondPack.sourceCommit);assert.equal(row.delivery.workerId,previous.delivery.workerId);assert.equal(row.delivery.routeId,previous.delivery.routeId);assert.notEqual(row.delivery.versionId,previous.delivery.versionId);assert.deepEqual(row.deploymentHistory[0].previousDelivery,previous.delivery);assert.equal(row.deploymentHistory[0].previousReceiptSha256,first.sha256);assert.equal(row.deploymentHistory[0].previousSourceCommit,firstPack.sourceCommit);assert.deepEqual(updated.registry.dealers.slice(0,100),f.registry.dealers);
  const request=packDeploymentRequest({...f.queue.requests[second.receipt.requestId].request,action:'rollback',rollbackTo:first.sha256}),receipt={...first.receipt,status:'rolled-back',requestId:request.id,rollbackReceiptSha256:first.sha256,previousVersionId:second.receipt.versionId,previousReceiptSha256:second.sha256,finishedAt:'2026-10-19T20:05:00.000Z'},envelope={receipt,sha256:queueDigest(receipt)};
  f.queue.order.push(request.id);f.queue.requests[request.id]={request,status:'rolled-back',events:[],receiptSha256:envelope.sha256};f.queue.receipts['dealer-one'].push(envelope);
  const restored=f.integrate().registry.dealers.at(-1);assert.equal(restored.name,'First Published Name');assert.equal(restored.canonicalSourceCommit,firstPack.sourceCommit);assert.equal(restored.delivery.versionId,first.receipt.versionId);assert.equal(restored.deploymentHistory.length,2);
  const changed=JSON.parse(fs.readFileSync(path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0])));changed.dealers.at(-1).delivery.workerId='f'.repeat(32);fs.writeFileSync(path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0]),encode(changed));const before=f.snapshot();assert.throws(()=>f.integrate(),/unbound prior pack inventory row/);assert.deepEqual(f.snapshot(),before);
});

test('offline queue snapshots cannot authorize explicit integration',t=>{
  const f=fixture(t),before=f.snapshot();let reads=0;assert.throws(()=>f.integrate({queueAuthenticated:false,readPack:()=>{reads++;throw Error('must not be reached');}}),/authenticated durable queue/);assert.equal(reads,0);assert.deepEqual(f.snapshot(),before);
});

test('an unchanged legacy source-version mismatch is retained and reported without permitting a changed malformed row',t=>{
  const f=fixture(t),legacy=f.registry.dealers[0];Object.assign(legacy,{sourceOwnership:'independent-repository',localPath:null,checkoutPath:'clients/protected-0',canonicalSourceRepository:legacy.repository,packagingVersion:'3',variants});
  fs.writeFileSync(path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0]),encode(f.registry));assert.throws(()=>validateRegistry(f.registry),/Version 3 requires App/);
  f.appendReceipt(f.commitPack('dealer-one','Published Dealer One'));const result=f.integrate();assert.deepEqual(result.registry.dealers[0],legacy);assert.deepEqual(result.report.preservedSourceWarnings,[{slug:legacy.slug,reason:'Version 3 requires App as Design 4.',recordUnchanged:true}]);
  const changed=structuredClone(result.registry);changed.dealers[0].name='Changed old record';assert.throws(()=>validateRegistry(changed,null,{preserveSourceRecords:f.registry.dealers}),/Version 3 requires App/);
});

test('a simultaneous coordinator edit is preserved and receipt integration must retry',t=>{
  const f=fixture(t);f.appendReceipt(f.commitPack('dealer-one','Published Dealer One'));const before=f.snapshot(),file=path.join(f.root,PACK_RECEIPT_REGISTRY_FILES[0]);
  assert.throws(()=>f.integrate({readPack:(slug,context)=>{const source=f.read(slug,context),changed=JSON.parse(fs.readFileSync(file));changed.ownerNote='A concurrent owner edit';fs.writeFileSync(file,encode(changed));return source;}}),/changed during receipt verification/);
  assert.equal(JSON.parse(fs.readFileSync(file)).ownerNote,'A concurrent owner edit');assert.deepEqual(f.snapshot().slice(1),before.slice(1));assert.equal(JSON.parse(fs.readFileSync(file)).dealers.length,100);
});
