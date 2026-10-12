/** Batch-owned orchestration: byte-exact attached inputs and the maintained source preparer. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {prepareExistingFleetSource} from '../prepare-existing-fleet-source.mjs';
const ROOT=process.cwd(), BRANCH='refs/heads/codex/vercel-batch-a-20261013';
const OWNED=['isauto-varna','perfect-auto-varna','outletcars-varna','automarket-varna','avangard-auto','legend-auto'];
const PREFIX='docs/releases/vercel-existing-refresh/batch-a-20261013';
const LOCK='ecdfaf9599fbcbeadebc24de3b9aa1c7615a9a49e29d338e5e9a23427d405e26';
const ARCHIVE='f9172b5c0990f8e6cf9c8a9c358a205c1a3f6692708c62bcf2328b76fd9b68db';
const hash=b=>createHash('sha256').update(b).digest('hex');
const encode=v=>JSON.stringify(v,null,2)+'\n';
const read=n=>fs.readFileSync(path.join(ROOT,n));
const git=(args)=>execFileSync('git',['-C',ROOT,...args],{encoding:'utf8',maxBuffer:4*1024*1024}).trim();
const slug=process.argv[2];assert(OWNED.includes(slug));
const report=path.join(ROOT,'runtime/vercel-batch-a-report',slug);fs.mkdirSync(report,{recursive:true});
const status={schemaVersion:1,dealer:slug,stage:'preflight',productionUpdated:0,templateRelease:'cars-vercel-b1f0f560-20261013',sourceRevision:'b1f0f5609c7c249cfd0649c122849ff2cbb8dfde'};
const save=()=>fs.writeFileSync(path.join(report,'status.json'),encode(status));
// The owner explicitly replaced the all-25/main writer with three isolated batches.
// Preserve the maintained CI constraints, replacing only the authorized branch scope.
// Real provider environment values are checked, never fabricated or rewritten.
function batchContext({root,env}){
 assert.equal(root,ROOT);assert.equal(process.platform,'linux');assert.equal(process.version,'v26.10.0');
 assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_EVENT_NAME,'push');assert.equal(env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(env.GITHUB_REF,BRANCH);
 assert(/^[a-f0-9]{40}$/.test(env.GITHUB_SHA));assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID));assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT));
 assert.equal(git(['rev-parse','HEAD']),env.GITHUB_SHA);assert.equal(git(['remote','get-url','origin']).replace(/\.git$/,''),'https://github.com/darkapoparka/cars');
 assert(!Object.keys(env).some(k=>/^(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|TOKEN)|^WRANGLER_(?:API_TOKEN|TOKEN)$/.test(k)&&env[k]));
 assert.equal(hash(read('templates.lock.json')),LOCK);git(['merge-base','--is-ancestor','5a5280c2bda62708768850c50cff54ef2bfcdad5',env.GITHUB_SHA]);
 return {commit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,attempt:env.GITHUB_RUN_ATTEMPT};
}
try{
 const ci=batchContext({root:ROOT,env:process.env});status.controlCommit=ci.commit;status.baselineTree=git(['rev-parse',`${ci.commit}:clients/${slug}`]);save();
 const archive=Buffer.concat([0,1,2].map(i=>read(`${PREFIX}/reviewed-source-inputs.${i}.xz.part`)));assert.equal(archive.length,15280);assert.equal(hash(archive),ARCHIVE);
 const tmp=path.join(report,'source-inputs.tar.xz');fs.writeFileSync(tmp,archive);
 execFileSync('python3',['-c',`import sys,tarfile,pathlib,hashlib\np=pathlib.Path(sys.argv[2]); z=tarfile.open(sys.argv[1],'r:xz'); rows=z.getmembers(); assert len(rows)==14 and sum(r.size for r in rows)<1024*1024\nfor r in rows:\n q=pathlib.PurePosixPath(r.name); assert r.isfile() and not q.is_absolute() and '..' not in q.parts and r.name.startswith('docs/releases/')\n d=z.extractfile(r).read(); f=p/r.name\n if f.exists(): assert f.read_bytes()==d\n else: f.parent.mkdir(parents=True,exist_ok=True); f.write_bytes(d)`,tmp,ROOT]);
 const inventory=JSON.parse(read(`${PREFIX}/source-input-inventory.json`));
 for(const row of inventory.files){const b=read(row.path);assert.equal(b.length,row.bytes);assert.equal(hash(b),row.sha256);}
 const request=JSON.parse(read(`${PREFIX}/source-request.json`));assert.deepEqual([...request.dealers].sort(),[...OWNED].sort());assert.equal(request.sourceRevision,status.sourceRevision);assert.equal(request.approvedParentLockDigest,LOCK);
 const result=await prepareExistingFleetSource({root:ROOT,slug,request,toolPackage:path.join(ROOT,'runtime/source-preparation-tools/package.json'),checkCi:batchContext});
 status.stage='maintained-source-proposal-produced';status.result=result;save();console.log(encode(status));
}catch(error){status.stage='blocked';status.error={name:error.name,message:error.message,stack:String(error.stack).split('\n').slice(0,8)};save();console.error(encode(status));process.exitCode=1;}
