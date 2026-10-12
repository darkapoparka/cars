import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {sourceBaseline,verifySourcePatch} from '../../scripts/prepare-existing-fleet-source.mjs';
const env=process.env,root=process.cwd(),branch='codex/vercel-batch-b-20261013',slug='al-basma-motors';
const sourceRun='38312219851',sourceCommit='371020ca66630da0b360d881a4f338e414e21de5',artifactId=11775640622;
const artifactSha256='0e5544cfc841c01abb4a44221853e1c5160facb7cbb5c11440a7e7a9d056851c';
const area=path.join(root,'runtime/vercel-batch-b-intake'),out=path.join(area,'summary');fs.mkdirSync(out,{recursive:true});
const write=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2)+'\n');
const hash=b=>createHash('sha256').update(b).digest('hex');
function git(args,{input,raw=false,index}={}){const p=spawnSync('git',args,{cwd:root,input,encoding:raw?null:'utf8',maxBuffer:64*1024**2,timeout:180000,env:{...env,GIT_TERMINAL_PROMPT:'0',...(index?{GIT_INDEX_FILE:index}:{})}});assert(!p.error,p.error?.message);assert.equal(p.status,0,'Git '+args[0]+' failed: '+String(p.stderr).slice(0,3000));return raw?p.stdout:p.stdout.trim();}
try{
 assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(env.GITHUB_REF,'refs/heads/'+branch);assert.equal(git(['rev-parse','HEAD']),env.GITHUB_SHA);
 assert.equal(git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/)[0],env.GITHUB_SHA,'Own control branch lease changed');
 const metadata=JSON.parse(fs.readFileSync(path.join(area,'artifact-metadata.json')));assert.equal(metadata.id,artifactId);assert.equal(metadata.expired,false);assert.equal(metadata.workflow_run.head_sha,sourceCommit);assert.equal(metadata.workflow_run.id,Number(sourceRun));assert.equal(metadata.digest,'sha256:'+artifactSha256);
 const jobs=JSON.parse(fs.readFileSync(path.join(area,'source-jobs.json')));assert(jobs.jobs.some(j=>j.name==='prepare_source (al-basma-motors)'&&j.conclusion==='success'),'The retained Basma job did not succeed');
 const prefix=path.join(area,'retained/existing-fleet-source',sourceRun+'-1',slug,'output');
 const patchBytes=fs.readFileSync(path.join(prefix,'source-patch.json')),patch=JSON.parse(patchBytes);
 assert.equal(patch.dealer,slug);assert.equal(patch.baseCommit,sourceCommit);assert.equal(patch.sourceRevision,'b1f0f5609c7c249cfd0649c122849ff2cbb8dfde');
 assert.equal(git(['rev-parse',env.GITHUB_SHA+':clients/'+slug]),patch.baseTree,'Current own dealer source lease changed');
 const baseline=sourceBaseline(root,slug,sourceCommit),blobs=new Map();
 for(const file of fs.readdirSync(path.join(prefix,'blobs'))){assert(/^[a-f0-9]{64}\.json$/.test(file));const b=JSON.parse(fs.readFileSync(path.join(prefix,'blobs',file)));blobs.set(file.slice(0,-5),b);}
 const verified=verifySourcePatch({baseline,patch,blobs});
 const prep=JSON.parse(fs.readFileSync(path.join(prefix,'source-preparation-receipt.json')));
 assert.equal(prep.preparedTree,verified.tree);assert.equal(prep.patchDigest,hash(patchBytes));assert.equal(prep.authoritativeFactsUnchanged,true);assert.equal(prep.originalPlanArtifactsUnchanged,true);assert.equal(prep.canonicalSourceUnchanged,true);
 for(const name of ['input-admission.json','source-result.json']){const file=path.join(area,'retained/vercel-batch-b',slug,name);if(fs.existsSync(file))fs.copyFileSync(file,path.join(out,name));}
 for(const name of ['source-preparation-receipt.json','final-source-review.json','artifact-manifest.json'])if(fs.existsSync(path.join(prefix,name)))fs.copyFileSync(path.join(prefix,name),path.join(out,name));
 const index=path.join(area,'verified-source.index');assert(!fs.existsSync(index));git(['read-tree',env.GITHUB_SHA],{index});
 const entries=new Map(verified.entries.map(e=>[e.path,e]));const lines=[];
 for(const change of patch.changes){const name='clients/'+slug+'/'+change.path;if(change.afterBlob===null)lines.push('0 '+'0'.repeat(40)+'\t'+name);else{const bytes=verified.files.get(change.path),entry=entries.get(change.path);assert(bytes&&entry);const actual=git(['hash-object','-w','--stdin'],{input:bytes});assert.equal(actual,entry.blob);lines.push(entry.mode+' '+actual+'\t'+name);}}
 git(['update-index','--index-info'],{index,input:lines.join('\n')+'\n'});
 const sourceTree=git(['write-tree'],{index});assert.equal(git(['rev-parse',sourceTree+':clients/'+slug]),patch.preparedTree);
 const changed=git(['diff-tree','--no-commit-id','--name-only','-r',env.GITHUB_SHA,sourceTree]).split('\n').filter(Boolean);assert(changed.length>0&&changed.every(p=>p.startsWith('clients/'+slug+'/')),'Unexpected source publication scope');
 git(['config','user.name','Cars Vercel Batch B']);git(['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
 const commit=git(['commit-tree',sourceTree,'-p',env.GITHUB_SHA],{input:'Integrate verified retained Al Basma source proposal for Vercel Batch B\n\nSource run 38312219851; artifact 11775640622; accepted release cars-vercel-b1f0f560-20261013. Source-only; production acceptance pending.\n'});
 assert.equal(git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/)[0],env.GITHUB_SHA,'Own branch moved during verification; no push attempted');
 git(['push','origin',commit+':refs/heads/'+branch]);assert.equal(git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/)[0],commit);
 write('source-intake-receipt.json',{schemaVersion:1,batch:'B',dealer:slug,releaseId:'cars-vercel-b1f0f560-20261013',artifactId,artifactSha256,sourceRun:Number(sourceRun),originalSourceCommit:sourceCommit,controlParent:env.GITHUB_SHA,publishingSourceBranch:branch,publishedSourceCommit:commit,publishedClientTree:verified.tree,maintainedPatchVerified:true,authoritativeFactsUnchanged:true,pathsChanged:changed.length,privatePublishingChanged:false,productionVerified:false,createdAt:new Date().toISOString()});console.log(JSON.stringify({dealer:slug,publishedSourceCommit:commit,clientTree:verified.tree,productionVerified:false}));
}catch(e){write('failure.json',{dealer:slug,message:e.message,stack:e.stack,productionVerified:false});console.error(e.stack);process.exitCode=1;}
