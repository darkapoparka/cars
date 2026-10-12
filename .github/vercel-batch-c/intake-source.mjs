/** Publish already-prepared Batch C sources to the Batch C control branch only. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Readable,Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {sourceBaseline,verifySourcePatch,assertPreparedMountOwnership} from '../../scripts/prepare-existing-fleet-source.mjs';
import {packageRetainsPath} from '../../scripts/package-dealer.mjs';
import {assertNativeQualification} from '../../scripts/lib/native-localization.mjs';
import {baseNativeManifest,assertAppVariant} from '../../scripts/publishing/app-variant.mjs';
import {assertExtendedVariantSources} from '../../scripts/publishing/six-variant.mjs';
import {assertLeadBranding} from '../../scripts/publishing/lead-branding.mjs';
const ROOT=process.cwd(),BRANCH='codex/vercel-batch-c-20261013';
const SOURCE='4b7a732affc73a811c20af0986d40cbdedf8ba13',RUN=38314984775;
const ALLOWED={
 'excellent-cars':{artifact:11776397706,sha256:'295e512f2c50df038b9de6d86e4a48d38292fe20024ad09320dbfc9df3e557d4',baseTree:'6011d35697dcb55e891f20e220ac49c4bf84a310',repo:'darkapoparka/excellent-cars'},
 'f1rst-motors':{artifact:11776562649,sha256:'9d9683da9fe160bdb54fb65693821fb2a1658d119d5c59d203e294026485e271',baseTree:'a8bb47ebc204c05545c43073ab16d7d5191a01be',repo:'darkapoparka/cars-f1rstmotors'}
};
const git=(args,opts={})=>execFileSync('git',['-C',ROOT,...args],{encoding:'utf8',timeout:120000,maxBuffer:64*1024**2,...opts}).trim();
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const encode=value=>JSON.stringify(value,null,2)+'\n';
const api=async suffix=>{const res=await fetch('https://api.github.com/repos/darkapoparka/cars/'+suffix,{headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json'},redirect:'error'});assert(res.ok,'GitHub API '+res.status+' '+suffix);return res.json();};
const assertScope=()=>{
 assert.equal(process.env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(process.env.GITHUB_REF,'refs/heads/'+BRANCH);
 assert.equal(process.env.GITHUB_EVENT_NAME,'push');assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.env.GITHUB_WORKFLOW,'Vercel Batch C retained source intake');
 assert.equal(git(['branch','--show-current']),BRANCH);assert.equal(git(['remote','get-url','origin']).replace(/\.git$/,''),'https://github.com/darkapoparka/cars');
 assert.equal(git(['diff','--cached','--name-only']),'','Pre-existing staged changes refused');assert(process.env.GH_TOKEN,'Repository-scoped Actions token is required');
};
async function intake(slug){
 assertScope();const expected=ALLOWED[slug];assert(expected);
 const diagnostics=path.join(ROOT,'runtime/batch-c-intake-receipts',slug);fs.mkdirSync(diagnostics,{recursive:true});
 const parent=git(['rev-parse','HEAD']);assert.equal(git(['ls-remote','origin','refs/heads/'+BRANCH]).split(/\s+/)[0],parent,'Batch C control lease changed');
 const request=read('.github/vercel-batch-c/source-request.json');assert.equal(request.acceptedRelease.id,'cars-vercel-b1f0f560-20261013');
 const release=read(request.acceptedRelease.path);assert.equal(release.sourceRevision,'b1f0f5609c7c249cfd0649c122849ff2cbb8dfde');assert.equal(sha(fs.readFileSync('templates.lock.json')),release.approvedParentLockSha256);
 const run=await api('actions/runs/'+RUN);assert.equal(run.head_sha,SOURCE);assert.equal(run.head_branch,BRANCH);assert.equal(run.conclusion,'success');
 const metadata=await api('actions/artifacts/'+expected.artifact);assert.equal(metadata.workflow_run.id,RUN);assert.equal(metadata.workflow_run.head_sha,SOURCE);assert.equal(metadata.expired,false);assert.equal(metadata.digest,'sha256:'+expected.sha256);assert.equal(metadata.name,'vercel-batch-c-source-'+slug+'-'+RUN+'-1');assert(metadata.size_in_bytes<1200*1024**2);
 const area=path.join(process.env.RUNNER_TEMP,'batch-c-intake-'+process.env.GITHUB_RUN_ID,slug);fs.mkdirSync(area,{recursive:true});const archive=path.join(area,'source.zip');
 const response=await fetch('https://api.github.com/repos/darkapoparka/cars/actions/artifacts/'+expected.artifact+'/zip',{headers:{Authorization:'Bearer '+process.env.GH_TOKEN},redirect:'follow'});assert(response.ok,'Artifact download '+response.status);
 const hash=createHash('sha256');let size=0;
 await pipeline(Readable.fromWeb(response.body),new Transform({transform(chunk,_,done){size+=chunk.length;if(size>1200*1024**2)return done(Error('Artifact size exceeded'));hash.update(chunk);done(null,chunk);}}),fs.createWriteStream(archive,{flags:'wx'}));assert.equal(size,metadata.size_in_bytes);assert.equal(hash.digest('hex'),expected.sha256);
 execFileSync('python3',['-c',`import zipfile,pathlib,stat,sys
z=zipfile.ZipFile(sys.argv[1]);dest=pathlib.Path(sys.argv[2]);total=0;seen=set();assert len(z.infolist())<20000
for i in z.infolist():
 p=pathlib.PurePosixPath(i.filename);total+=i.file_size
 assert not p.is_absolute() and '..' not in p.parts and '\\\\' not in i.filename and p.parts and total<3*1024**3
 assert not stat.S_ISLNK(i.external_attr>>16) and i.filename not in seen
 seen.add(i.filename)
z.extractall(dest)
`,archive,area],{timeout:120000});fs.unlinkSync(archive);
 const output=path.join(area,'existing-fleet-source',RUN+'-1',slug,'output');
 for(const name of ['source-preparation-receipt.json','final-source-review.json','batch-c-controller-receipt.json']){const file=path.join(output,name);if(fs.existsSync(file))fs.copyFileSync(file,path.join(diagnostics,name));}
 const receipt=read(path.join(output,'source-preparation-receipt.json')),patchBytes=fs.readFileSync(path.join(output,'source-patch.json')),patch=JSON.parse(patchBytes);
 assert.equal(receipt.dealer,slug);assert.equal(receipt.repository,expected.repo);assert.equal(receipt.runId,String(RUN));assert.equal(receipt.sourceRevision,release.sourceRevision);
 assert.equal(receipt.patchDigest,sha(patchBytes));assert.equal(patch.baseCommit,SOURCE);assert.equal(patch.baseTree,expected.baseTree);assert.equal(receipt.preparedTree,patch.preparedTree);assert.equal(receipt.authoritativeFactsUnchanged,true);assert.equal(receipt.nativeApproval,false);assert.equal(receipt.hostedApproval,false);
 assert.equal(git(['rev-parse','HEAD:clients/'+slug]),expected.baseTree,'Assigned client changed; reconcile instead of restoring');
 const baseline=sourceBaseline(ROOT,slug,SOURCE),blobs=new Map();assert.equal(baseline.tree,expected.baseTree);
 for(const file of fs.readdirSync(path.join(output,'blobs'))){assert(/^[a-f0-9]{64}\.json$/.test(file));const blob=read(path.join(output,'blobs',file));assert.equal(file,blob.sha256+'.json');blobs.set(blob.sha256,blob);}
 const verified=verifySourcePatch({baseline,patch,blobs});const manifest=JSON.parse(verified.files.get('dealer.json').toString('utf8'));
 assert.equal(manifest.repository,expected.repo);assert.equal(manifest.slug,slug);assert.notEqual(manifest.sourceOwnership,'independent-repository');assertPreparedMountOwnership(manifest,baseline);
 for(const [family,pin]of Object.entries(release.templates)){assert.equal(manifest.templateSources[family].revision,release.sourceRevision);assert.equal(manifest.templateSources[family].digest,pin.digest);}
 const context=JSON.parse(verified.files.get('.client/native-qualification-context.json').toString('utf8'));
 // Patch verification preserves the entire historical tree. Source seals use the
 // maintained packaging boundary, just as the original source preparation did.
 const sealedFiles=new Map([...verified.files].filter(([name])=>packageRetainsPath(name)));
 const excluded=[...verified.files.keys()].filter(name=>!packageRetainsPath(name));
 fs.writeFileSync(path.join(diagnostics,'seal-input-boundary.json'),encode({fullTree:verified.tree,retainedFiles:sealedFiles.size,excludedHistoricalPaths:excluded,filter:'scripts/package-dealer.mjs#packageRetainsPath'}));
 const native=assertNativeQualification(sealedFiles,baseNativeManifest(manifest),context,{root:ROOT});assertLeadBranding(sealedFiles,manifest);assertAppVariant(sealedFiles,manifest);assertExtendedVariantSources(sealedFiles,manifest);
 for(const name of ['business-facts.json','stock.json','locale.json','FACTS-AND-INVENTORY.json'])if(baseline.files.has(name))assert(verified.files.get(name)?.equals(baseline.files.get(name)),'Authoritative facts changed: '+name);
 const changed=patch.changes.map(x=>x.path);assert(!changed.some(n=>n.startsWith('.github/')||n==='.git'));
 for(const change of patch.changes){const target=path.join(ROOT,'clients',slug,change.path);assert(target.startsWith(path.join(ROOT,'clients',slug)+path.sep));if(change.afterBlob===null)fs.unlinkSync(target);else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,verified.files.get(change.path));fs.chmodSync(target,change.mode==='100755'?0o755:0o644);}}
 git(['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{input:changed.map(name=>'clients/'+slug+'/'+name).join('\0')+'\0'});
 const stage=git(['write-tree']);assert.equal(git(['rev-parse',stage+':clients/'+slug]),patch.preparedTree,'Installed source tree differs');
 const note={schemaVersion:1,batch:'C',dealer:slug,acceptedRelease:request.acceptedRelease,sourceRun:RUN,sourceControlCommit:SOURCE,sourceArtifact:{id:expected.artifact,sha256:expected.sha256},sourceBaselineTree:baseline.tree,preparedTree:verified.tree,patchSha256:sha(patchBytes),sourceReceiptSha256:sha(fs.readFileSync(path.join(output,'source-preparation-receipt.json'))),preservationReview:request.preservationReview,sourcePatchVerified:true,factualFilesPreserved:true,mountOwnershipVerified:true,brandingAppExtendedAndNativeSourceQualificationVerified:true,nativeInput:native.input,productionApproval:false,productionVerified:false,createdAt:new Date().toISOString()};
 const receiptPath='.github/vercel-batch-c/receipts/'+slug+'/source-integration.json';fs.mkdirSync(path.dirname(receiptPath),{recursive:true});fs.writeFileSync(receiptPath,encode(note));git(['add','--',receiptPath]);const scoped=git(['diff','--cached','--name-only']).split('\n');assert(scoped.every(p=>p.startsWith('clients/'+slug+'/')||p===receiptPath));
 assert.equal(git(['ls-remote','origin','refs/heads/'+BRANCH]).split(/\s+/)[0],parent,'Control lease changed before commit');git(['commit','-m','Integrate '+slug+' accepted six-template source in Batch C only']);const commit=git(['rev-parse','HEAD']);git(['push','origin','HEAD:refs/heads/'+BRANCH],{timeout:600000});assert.equal(git(['ls-remote','origin','refs/heads/'+BRANCH]).split(/\s+/)[0],commit);
 fs.writeFileSync(path.join(diagnostics,'published-source.json'),encode({...note,sourceCommit:commit,privatePublished:false}));console.log(encode({dealer:slug,sourceCommit:commit,sourceTree:verified.tree,privatePublished:false,productionVerified:false}));
}
const slug=process.argv[2];intake(slug).catch(error=>{const folder=path.join(ROOT,'runtime/batch-c-intake-receipts');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'failure-'+(ALLOWED[slug]?slug:'invalid')+'.json'),encode({error:error.message,stack:error.stack,privatePublished:false,productionVerified:false}));console.error(error.stack);process.exitCode=1;});
