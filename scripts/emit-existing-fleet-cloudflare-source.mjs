/** Emit the maintained native source package beside a verified singleton.
 * Uses the native preparer and qualified locks; no provider or remote ref writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {ROOT,git,inside,normalized,sha256,writeJson} from './lib/workflow.mjs';
import {prepareExistingFleetSourcePackage} from './build-existing-fleet-cloudflare.mjs';
import {nativeInputDirectories,verifyFleetSingletonDirectory} from './assemble-existing-fleet-single-worker.mjs';
import {componentRepairRow,componentAssemblyRow} from './lib/fleet-component-repairs.mjs';
import {validateFileInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {packageFiles,verifyPackage} from './export-dealer.mjs';
import {writePackageObjectPack} from './lib/git-object-transport.mjs';
import {createCloudflareNativeSourceQualification,assertCloudflareNativeSourceExport} from './lib/cloudflare-native-source-qualification.mjs';

const KEYS=['auto-best','modern','import','app','mobile','karento-best','router'];
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const same=(a,b)=>assert.deepEqual(a,b);
export function qualifiedFleetLocks(inputs){
 const svelte={},next=[];
 for(const key of KEYS.filter(k=>k!=='router')){
  const directory=inputs[key],inventory=validateFileInventory(read(path.join(directory,'artifact-manifest.json')));
  const relative=['modern','app','mobile'].includes(key)?'receipts/.cars-next-'+key+'-frozen-lock.json':'receipts/.cars-cloudflare-svelte-locks.json';
  const seal=inventory.files.find(row=>row.path===relative),bytes=fs.readFileSync(path.join(directory,relative));
  assert(seal&&seal.bytes===bytes.length&&seal.sha256===sha256(bytes),'Native dependency receipt changed: '+key);
  const value=JSON.parse(bytes);
  if(['modern','app','mobile'].includes(key)){assert.equal(value.key,key);next.push(value);}
  else{assert(value[key]&&value[key].schemaVersion===1,'Native Svelte lock absent: '+key);svelte[key]=value[key];}
 }
 same(Object.keys(svelte).sort(),['auto-best','import','karento-best'].sort());
 same(next.map(row=>row.key).sort(),['modern','app','mobile'].sort());
 return {svelte,next};
}
/** Seal the native preparer's source using the ordinary package receipt format. */
export function sealNativeSourcePackage(packageRoot,{manifest,sourceCommit,qualification}){
 const provider=read(path.join(packageRoot,'.cars-cloudflare.json'));
 assert(provider.provider==='cloudflare'&&provider.acceptance?.dependencyLocksFrozen===true,'All six native dependency locks must be frozen');
 const file=path.join(packageRoot,'.cars-package.json');assert(!fs.existsSync(file),'Native source package already sealed');
 const payload=packageFiles(packageRoot).sort().map(name=>({path:name,sha256:sha256(normalized(fs.readFileSync(path.join(packageRoot,name))))}));
 const assetDelivery={provider:'cloudflare',projectMode:'single-worker',designCount:6,applicationCount:6,workerCount:1,assets:'single-worker-owned'};
 const meta={schemaVersion:1,manifest,sourceCommit,packagingVersion:manifest.packaging.version,assetDelivery,payloadDigest:sha256(JSON.stringify(payload)),payload,qualification,canonicalComposition:qualification?.canonicalComposition};
 assertCloudflareNativeSourceExport(meta,{branch:'main',manifest});writeJson(file,meta);
 return verifyPackage(packageRoot);
}
export async function emitFleetCloudflareSource({slug,inputRoot,singletonRoot,destination,root=ROOT,env=process.env}={}){
 assert(env.GITHUB_REPOSITORY==='darkapoparka/cars'&&env.GITHUB_REF==='refs/heads/main'&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||''),'Exact Cars MAIN CI source required');
 const sourceCommit=env.GITHUB_SHA,request=read(path.join(root,'docs/releases/cloudflare-existing25-20261011/build-request.json'));
 assert(request.dealers.includes(slug)&&KEYS.every(key=>request.targets.includes(key)),'Dealer outside native request');
 const sealed=verifyFleetSingletonDirectory(singletonRoot),receipt=sealed.receipt;
 assert(receipt.dealer===slug&&receipt.sourceCommit===sourceCommit&&String(receipt.runId)===env.GITHUB_RUN_ID&&String(receipt.attempt)===env.GITHUB_RUN_ATTEMPT,'Singleton differs from current native source run');
 const repair=componentRepairRow(request,slug),retained=componentAssemblyRow(request,slug);
 const inputs=nativeInputDirectories(inputRoot,slug,env.GITHUB_RUN_ID,env.GITHUB_RUN_ATTEMPT,repair,retained);
 const dependencyLocks=qualifiedFleetLocks(inputs);
 const runtime=inside(root,'runtime',{mustExist:true}),area=inside(runtime,path.relative(runtime,path.resolve(destination)));
 assert(!fs.existsSync(area),'Preserve existing source transport attempt');fs.mkdirSync(path.join(area,'receipts'),{recursive:true});
 const prepared=await prepareExistingFleetSourcePackage(slug,'router',sourceCommit,area,request,{fullSource:true,dependencyLocks});
 const {packageRoot,manifest,provenance}=prepared;
 assert(provenance.sourceTree===receipt.sourceTree&&provenance.inputDigest===receipt.inputDigest,'Source package input differs from compiled singleton');
 same(provenance.sourceReleases,receipt.sourceReleases);assert.equal(manifest.repository,sealed.delivery.repository);
 const qualification=createCloudflareNativeSourceQualification({receiptBytes:fs.readFileSync(path.join(singletonRoot,'single-worker-receipt.json')),deliveryBytes:fs.readFileSync(path.join(singletonRoot,'delivery-receipt.json')),artifactDigest:sealed.inventory.digest,manifest});
 const verified=sealNativeSourcePackage(packageRoot,{manifest,sourceCommit,qualification});
 const index=path.join(area,'source.index'),gitEnv={GIT_INDEX_FILE:index};
 git(root,['read-tree','--empty'],{env:gitEnv});
 git(root,['--work-tree',packageRoot,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{env:gitEnv,input:packageFiles(packageRoot).join('\0')+'\0'});
 const packageTree=git(root,['write-tree'],{env:gitEnv});
 const packageCommit=git(root,['-c','user.name=Cars release','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit-tree',packageTree,'-p',sourceCommit],{input:'Transport qualified Cloudflare source for '+slug+'\n'});
 const artifact=path.join(area,'artifact');fs.mkdirSync(artifact);
 const objectTransport=writePackageObjectPack({root,sourceCommit,sourcePaths:['clients/'+slug,'scripts'],packageTree,packageCommit,destination:path.join(artifact,'package.objects.pack')});
 const result={schemaVersion:1,kind:'cars-existing-cloudflare-source-package',slug,repository:manifest.repository,sourceOwnership:'cars-canonical',targetBranch:'main',sourceCommit,sourceTree:receipt.sourceTree,inputDigest:receipt.inputDigest,sourceReleases:receipt.sourceReleases,packageTree,packageCommit,packageDigest:verified.digest,objectTransport,workerName:receipt.workerName,publicOrigin:receipt.publicOrigin,canonicalComposition:receipt.canonicalComposition,runId:receipt.runId,attempt:receipt.attempt,singletonOutputDigest:receipt.outputDigest,singletonArtifactDigest:sealed.inventory.digest,compiled:true,published:false,hostedApproval:false};
 writeJson(path.join(artifact,'package.json'),result);return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{assert.equal(process.argv.length,6,'Usage: SLUG INPUT_ROOT SINGLETON_ROOT DESTINATION');const [slug,inputRoot,singletonRoot,destination]=process.argv.slice(2);const result=await emitFleetCloudflareSource({slug,inputRoot:path.resolve(inputRoot),singletonRoot:path.resolve(singletonRoot),destination:path.resolve(destination)});console.log(JSON.stringify({slug,sourceCommit:result.sourceCommit,sourceTree:result.sourceTree,packageTree:result.packageTree,packageDigest:result.packageDigest,packBytes:result.objectTransport.packBytes,published:false}));}
 catch(error){console.error(error.stack??error.message);process.exitCode=1;}
}
