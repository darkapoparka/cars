/** Convert explicitly reviewed finite path decisions to the maintained updater's resolution document. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const sha=b=>createHash('sha256').update(b).digest('hex');const blob=b=>createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
export function attachReviewedResolutions({root,slug,request,report}){
 const name='docs/releases/vercel-existing-refresh/batch-a-20261013/reviewed-conflict-decisions.json';
 const file=path.join(root,name),bytes=fs.readFileSync(file),record=JSON.parse(bytes);
 const git=args=>execFileSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:4*1024*1024}).trim();
 assert.equal(blob(bytes),git(['rev-parse','HEAD:'+name]));assert.equal(record.schemaVersion,1);assert.equal(record.kind,'cars-vercel-batch-a-reviewed-source-conflict-decisions');assert.equal(record.sourceRevision,request.sourceRevision);assert.equal(record.nativeApproval,false);assert.equal(record.hostedApproval,false);
 const row=record.dealers[slug];if(!row)return null;
 assert.equal(process.env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(process.env.GITHUB_REF,'refs/heads/codex/vercel-batch-a-20261013');
 assert.equal(git(['rev-parse',`HEAD:clients/${slug}`]),row.baselineTree);assert.equal(git(['rev-parse',`${record.sourceCommit}:clients/${slug}`]),row.baselineTree);git(['merge-base','--is-ancestor',record.sourceCommit,'HEAD']);
 assert(Array.isArray(row.decisions)&&row.decisions.length>=1&&row.decisions.length<=30&&new Set(row.decisions).size===row.decisions.length);
 const decisions=row.decisions.map(i=>{assert(Number.isInteger(i)&&i>=0&&i<record.decisions.length);return record.decisions[i];});
 const resolutions={};for(const item of decisions){assert(/^(auto-best|import|modern|app|mobile|karento-best)\//.test(item.path)&&!item.path.split('/').some(p=>!p||p==='..'||p==='.')&&!item.path.includes('\\')&&item.action==='template'&&typeof item.reason==='string'&&item.reason.length>30);assert(!Object.hasOwn(resolutions,item.path));resolutions[item.path]={action:item.action,reason:item.reason};}
 const value={schemaVersion:1,kind:'cars-reviewed-dealer-preservation-resolutions',dealer:slug,sourceCommit:record.sourceCommit,sourceRevision:record.sourceRevision,baselineTree:row.baselineTree,originalRun:record.originalRun,originalReviewSha256:row.originalReviewSha256,originalArtifact:{id:row.artifactId,sha256:row.artifactSha256},reviewedBy:record.reviewedBy,reviewScope:record.scope,nativeApproval:false,hostedApproval:false,resolutions};
 const output=Buffer.from(JSON.stringify(value,null,2)+'\n'),relative=`docs/releases/cloudflare-existing25-20261011/vercel-batch-a/source-resolutions/${slug}.json`,target=path.join(root,relative);
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,output,{flag:'wx'});
 assert(!request.inputs[slug].resolutions);request.inputs[slug].resolutions={path:relative,sha256:sha(output)};
 fs.writeFileSync(path.join(report,'reviewed-resolutions.json'),output,{flag:'wx'});return {reference:name,sha256:sha(bytes),resolution:request.inputs[slug].resolutions,paths:decisions.length,baselineTree:row.baselineTree,ownListingCount:row.ownListingCount};
}
