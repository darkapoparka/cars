import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const ROOT=process.cwd(),TARGET='codex/vercel-batch-c-preview-20261013';
const assigned={
 'darkapoparka/excellent-cars':{slug:'excellent-cars',projectId:'prj_dhANzY6pxcqK1hO06ar9ZTk0k4eq',origin:'https://excellent-cars.vercel.app/',sourceTree:'ab19cab095c5f55cc5599dc08d1fb9e84e46ec70',rows:16},
 'darkapoparka/cars-f1rstmotors':{slug:'f1rst-motors',projectId:'prj_mavqUXCj6hSEg8EvBJW8G3XJlihm',origin:'https://cars-f1rstmotors.vercel.app/',sourceTree:'33ed5b354262e7a9ef3a68867cfa8d46c49dc453',rows:10},
 'darkapoparka/cars-priselci':{slug:'priselci',projectId:'prj_GwnlfPmyImlJuiocl77NWplzvTTb',origin:'https://cars-priselci.vercel.app/',rows:16}
};
const hash=b=>createHash('sha256').update(b).digest('hex');const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const encode=x=>JSON.stringify(x,null,2)+'\n';
const git=(args,options={})=>execFileSync('git',['-C',ROOT,...args],{encoding:'utf8',maxBuffer:64*1024**2,timeout:120000,...options}).trim();
const own=assigned[process.env.GITHUB_REPOSITORY];assert(own,'This controller only handles the three ready, assigned Cars-owned dealers');
const area=path.join(ROOT,'runtime/batch-c-private-package',own.slug),diagnostics=path.join(area,'diagnostics');fs.mkdirSync(diagnostics,{recursive:true});
const save=(name,value)=>fs.writeFileSync(path.join(diagnostics,name),encode(value));
async function main(){
 assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.env.GITHUB_EVENT_NAME,'push');assert.equal(process.env.GITHUB_REF,'refs/heads/codex/vercel-batch-c-control-20261013');
 assert.equal(process.env.GITHUB_WORKFLOW,'Batch C private qualified preview');assert.equal(git(['rev-parse','HEAD']),process.env.CARS_CONTROL_SHA);
 assert(/^[a-f0-9]{40}$/.test(process.env.PUBLISHING_BASELINE||''));assert.equal(process.env.TARGET_BRANCH,TARGET);
 const sourceCommit=git(['rev-parse','HEAD']),source=path.join(ROOT,'clients',own.slug),manifest=read(path.join(source,'dealer.json'));
 assert.equal(manifest.repository,process.env.GITHUB_REPOSITORY);assert.equal(manifest.slug,own.slug);assert.notEqual(manifest.sourceOwnership,'independent-repository');assert.equal(manifest.packaging.version,'5');assert.equal(manifest.shareIdentity.publicOrigin,own.origin);
 const sourceTree=git(['rev-parse','HEAD:clients/'+own.slug]);if(own.sourceTree)assert.equal(sourceTree,own.sourceTree,'Already integrated source changed; reconcile');
 const accepted=read('.github/vercel-batch-c/source-request.json').acceptedRelease,release=read(accepted.path);assert.equal(release.id,'cars-vercel-b1f0f560-20261013');assert.equal(hash(fs.readFileSync('templates.lock.json')),release.approvedParentLockSha256);
 for(const [key,pin]of Object.entries(release.templates)){assert.equal(manifest.templateSources[key].revision,release.sourceRevision);assert.equal(manifest.templateSources[key].digest,pin.digest);}
 const expectedMounts=['auto-best','modern','import','app','mobile','karento-best'];assert.deepEqual(manifest.variants.map(v=>v.key),expectedMounts);assert.deepEqual(manifest.variants.map(v=>v.base),['','/variant-2','/variant-3','/variant-4','/variant-5','/variant-6']);
 const {loadDealerProfile}=await import(pathToFileURL(path.join(ROOT,'scripts/lib/client-refresh-normalize.mjs')).href);const profile=loadDealerProfile(source,own.slug);assert.equal(profile.listings.length,own.rows,'Own inventory row count changed');
 const remote='https://github.com/'+manifest.repository+'.git';
 const head=branch=>git(['ls-remote','--heads',remote,'refs/heads/'+branch]).split(/\s+/)[0]||null;
 assert.equal(head('main'),process.env.PUBLISHING_BASELINE,'Existing private main lease changed');assert.equal(head(TARGET),null,'Preview branch already exists; reuse its package rather than overwrite it');
 const {packageDealer,committedDealerInputs}=await import(pathToFileURL(path.join(ROOT,'scripts/package-dealer.mjs')).href);
 const {exportDealer,pushExport}=await import(pathToFileURL(path.join(ROOT,'scripts/export-dealer.mjs')).href);
 const committed=await committedDealerInputs({root:ROOT,source,manifest,sourceCommit});
 const adoptionBytes=committed.files.get('localization/adoption.json'),adoption=JSON.parse(adoptionBytes);
 const request={schemaVersion:1,kind:'cars-vercel-qualified-preview-request',reviewed:true,provider:'vercel',production:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,dealer:own.slug,repository:manifest.repository,sourceCommit,projectId:own.projectId,publicOrigin:own.origin,targetBranch:TARGET,sourceAdoptionSha256:hash(adoptionBytes),nativeInputDigest:adoption.input.digest,nativeInputFiles:adoption.input.files};
 save('qualified-preview-request.json',request);save('source-binding.json',{repository:manifest.repository,sourceCommit,sourceTree,acceptedRelease:accepted,sourceAdoptionSha256:hash(adoptionBytes),nativeInput:adoption.input,ownInventoryRows:profile.listings.length,projectId:own.projectId,stableOrigin:own.origin,publishingBaseline:process.env.PUBLISHING_BASELINE,productionVerified:false});
 const result=await packageDealer({root:ROOT,source,destination:path.join(area,'package'),manifest,sourceCommit,canonicalFiles:committed.files,provider:'vercel',vercelQualification:request,assetPool:path.join(area,'asset-pool')});
 fs.copyFileSync(path.join(result.destination,'.cars-package.json'),path.join(diagnostics,'package.json'));
 for(const name of ['.cars-assets.json','.cars-vercel-assets.json','.cars-static-routing.json','.cars-six-variant-build.json','vercel.json'])if(fs.existsSync(path.join(result.destination,name)))fs.copyFileSync(path.join(result.destination,name),path.join(diagnostics,path.basename(name)));
 save('package-result.json',result);
 const proposal=exportDealer({root:ROOT,slug:own.slug,packageDir:result.destination,targetBranch:TARGET,preservePrefixes:['.github'],write:false});save('export-proposal.json',proposal);
 assert.equal(proposal.baseHead,process.env.PUBLISHING_BASELINE);assert.equal(proposal.targetHead,null);assert.equal(proposal.repository,manifest.repository);assert.equal(proposal.branch,TARGET);
 // Own authoritative files must also match the refreshed private source, not only Cars.
 for(const file of ['business-facts.json','stock.json','locale.json','FACTS-AND-INVENTORY.json']){
   const present=execFileSync('git',['-C',ROOT,'cat-file','-e',proposal.parent+':'+file],{stdio:'ignore',timeout:15000});
   const bytes=execFileSync('git',['-C',ROOT,'show',proposal.parent+':'+file],{maxBuffer:16*1024**2,timeout:15000});
   assert(committed.files.has(file)&&committed.files.get(file).equals(bytes),'Authoritative private '+file+' differs; reconcile, do not overwrite');
 }
 const previous=git(['show',proposal.parent+':.cars-publish.json']);assert(previous,'Existing private publishing provenance is required');
 if(proposal.unexpectedRemoteChanges.length){
  save('publication-held.json',{reason:'Unexpected private source changes need exact reviewed dispositions',paths:proposal.unexpectedRemoteChanges,privatePublished:false,productionVerified:false});
  const commit=git(['commit-tree',proposal.packagePayloadTree||proposal.tree],{input:'Retained qualified preview package, not a production publication\n'});const ref='refs/batch-c-package/'+own.slug;git(['update-ref',ref,commit]);git(['bundle','create',path.join(area,'qualified-package.bundle'),ref],{timeout:600000});
  throw Error('Private reconciliation required for '+proposal.unexpectedRemoteChanges.length+' paths; exact package retained without rebuilding');
 }
 const exported=exportDealer({root:ROOT,slug:own.slug,packageDir:result.destination,targetBranch:TARGET,preservePrefixes:['.github'],write:true});
 assert.equal(exported.branch,TARGET);assert.equal(exported.parent,proposal.parent);assert.equal(exported.candidateDigest,proposal.candidateDigest);
 const pushed=pushExport({root:ROOT,receiptFile:path.join(exported.proposalDirectory,'export.json')});assert.equal(pushed.repository,manifest.repository);assert.equal(pushed.branch,TARGET);
 save('private-preview-publication.json',{...pushed,sourceCommit,sourceTree,projectId:own.projectId,stableOrigin:own.origin,acceptedRelease:release.id,packageDigest:result.digest,productionApproved:false,productionVerified:false});
 console.log(encode({dealer:own.slug,privatePreviewCommit:pushed.commit,sourceCommit,productionVerified:false}));
}
main().catch(error=>{save('failure.json',{error:error.message,stack:error.stack,productionVerified:false});console.error(error.message);process.exitCode=1;});
