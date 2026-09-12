import fs from 'node:fs';
import path from 'node:path';
import {ROOT,args,json,writeJson,git,inside,filesAt,sha256,normalized,validateManifest} from './lib/workflow.mjs';

export function packageFiles(directory) {
  const omit = new Set(['.git','node_modules','.vercel','.agency-os','.auth','.codex','.claude','.agents','.openai','.template','.svelte-kit','.next','.turbo','.cache','.pnpm-store','build','dist','runtime','audits','artifacts','evidence','qa','qa-final','test-results','playwright-report']);
  return filesAt(directory,{filter:relative => !relative.split('/').some(p => omit.has(p) || p.startsWith('.env') || p.startsWith('.next-')) && !/\.(pem|key|pfx|log|pid|tsbuildinfo)$/i.test(relative) && !/(?:credentials|service-account|purchase-code|license-certificate)/i.test(path.basename(relative)) && relative !== '.cars-publish.json'});
}
export function packageDigest(directory) {
  const files = packageFiles(directory).map(p => ({path:p,sha256:sha256(normalized(fs.readFileSync(path.join(directory,p))))}));
  return {files,digest:sha256(JSON.stringify(files))};
}
export function verifyPackage(directory) {
  const meta=json(path.join(directory,'.cars-package.json'));
  const actual=packageDigest(directory);
  const payload=actual.files.filter(f=>f.path!=='.cars-package.json');
  if(JSON.stringify(payload)!==JSON.stringify(meta.payload)||sha256(JSON.stringify(payload))!==meta.payloadDigest)
    throw new Error('Package payload changed after generation. Fix canonical source or packaging, then regenerate.');
  return actual;
}
function remoteHead(root,url,branch) {
  const text=git(root,['ls-remote',url,'refs/heads/'+branch]);return text ? text.split(/\s/)[0] : null;
}
function treeFiles(root,commit) {
  if (!commit) return new Map();
  const raw=git(root,['ls-tree','-r','-z',commit],{encoding:null}).toString();
  return new Map(raw.split('\0').filter(Boolean).map(line=>{const[info,p]=line.split('\t');return[p,info.split(' ')[2]];}));
}
export function validateReview({review,remoteCommit,candidateDigest,changes}) {
  if (!review || review.remoteCommit!==remoteCommit || review.candidateDigest!==candidateDigest) throw new Error('Mirror reconciliation required: review the exact remote commit and candidate digest.');
  const dispositions = new Map((review.changes||[]).map(c=>[c.path,c]));
  for (const p of changes) {const d=dispositions.get(p);if(!d || !['canonical-source','packaging-layer','obsolete-generated-metadata'].includes(d.resolution) || !d.reason?.trim()) throw new Error('Missing reviewed disposition for '+p);}
}
export function exportDealer({root=ROOT,slug,packageDir,reviewFile,write=false,targetBranch}) {
  const client=inside(root,'clients/'+slug,{mustExist:true});
  const manifest=validateManifest(json(path.join(client,'dealer.json')));
  if(manifest.slug!==slug)throw new Error('Dealer manifest slug mismatch.');
  const directory=fs.realpathSync(packageDir),packageMeta=json(path.join(directory,'.cars-package.json'));
  if (json(path.join(directory,'dealer.json')).repository!==manifest.repository)throw new Error('Package repository differs from canonical manifest.');
  if (!/^[a-f0-9]{40}$/.test(packageMeta.sourceCommit||''))throw new Error('Package must record an immutable Cars source commit.');
  git(root,['cat-file','-e',packageMeta.sourceCommit+'^{commit}']);
  const branch=targetBranch||manifest.defaultBranch||'main';
  if(!/^[a-zA-Z0-9][a-zA-Z0-9/._-]*$/.test(branch)||branch.includes('..'))throw new Error('Invalid target branch.');
  const url='https://github.com/'+manifest.repository+'.git';
  const defaultBranch=manifest.defaultBranch||'main';
  const baseHead=remoteHead(root,url,defaultBranch),targetHead=remoteHead(root,url,branch);
  const parent=targetHead||baseHead;
  if(!parent)throw new Error('Publishing repository must exist with a reviewed initial commit. Create its private empty initialization once, then retry.');
  git(root,['fetch','--no-tags',url,parent]);
  const area=inside(root,'runtime/dealer-exports/'+slug);fs.mkdirSync(area,{recursive:true});const run=fs.mkdtempSync(path.join(area,'proposal-'));
  const env={GIT_INDEX_FILE:path.join(run,'index')};
  const digest=verifyPackage(directory),files=digest.files.map(f=>f.path);
  const g=(a,input)=>git(root,['--work-tree',directory,...a],{env,input});
  g(['read-tree','--empty']);g(['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],files.join('\0')+'\0');
  const tree=g(['write-tree']),remote=treeFiles(root,parent),candidate=treeFiles(root,tree);
  // Tree identifiers are accepted by ls-tree, while commit ancestry is checked separately.
  const changes=[...new Set([...remote.keys(),...candidate.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==candidate.get(p)).sort();
  const priorText=git(root,['show',parent+':.cars-publish.json'],{allowFailure:true});
  let unexpected=[];
  if(priorText){const prior=JSON.parse(priorText);if(prior.repository!==manifest.repository)throw new Error('Remote publishing metadata has another repository identity.');const managed=new Map(prior.files.map(f=>[f.path,f.blob]));unexpected=[...new Set([...remote.keys(),...managed.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==managed.get(p));}
  const report={schemaVersion:1,slug,repository:manifest.repository,branch,defaultBranch,baseHead,targetHead,parent,sourceCommit:packageMeta.sourceCommit,candidateDigest:digest.digest,tree,changes,unexpectedRemoteChanges:unexpected,packageDirectory:directory,proposalDirectory:run};
  writeJson(path.join(run,'proposal.json'),report);
  if(!write)return report;
  if(!priorText||unexpected.length)validateReview({review:reviewFile?json(reviewFile):null,remoteCommit:parent,candidateDigest:digest.digest,changes:priorText?unexpected:changes});
  const receipt={schemaVersion:1,repository:manifest.repository,sourceCommit:packageMeta.sourceCommit,packagingVersion:packageMeta.packagingVersion||'1',candidateDigest:digest.digest,files:[...candidate].map(([p,blob])=>({path:p,blob})).sort((a,b)=>a.path.localeCompare(b.path))};
  const blob=git(root,['hash-object','-w','--stdin'],{input:JSON.stringify(receipt,null,2)+'\n'});
  git(root,['update-index','--add','--cacheinfo','100644',blob,'.cars-publish.json'],{env});
  const finalTree=g(['write-tree']);
  const commit=git(root,['commit-tree',finalTree,'-p',parent],{input:'Publish '+slug+' from canonical Cars '+packageMeta.sourceCommit+'\n'});
  const ref='refs/dealer-exports/'+slug+'/'+commit;git(root,['update-ref',ref,commit]);
  const result={...report,tree:finalTree,commit,ref};
  writeJson(path.join(run,'export.json'),result);return result;
}
export function pushExport({root=ROOT,receiptFile}) {
  const r=json(receiptFile),url='https://github.com/'+r.repository+'.git';
  const manifest=validateManifest(json(inside(root,'clients/'+r.slug+'/dealer.json',{mustExist:true})));
  if(manifest.repository!==r.repository)throw new Error('Receipt repository no longer matches canonical identity.');
  if(remoteHead(root,url,r.branch)!==r.targetHead || remoteHead(root,url,r.defaultBranch)!==r.baseHead)throw new Error('Remote advanced after review. Re-export; never force-push.');
  if(git(root,['rev-parse',r.commit+'^'])!==r.parent)throw new Error('Export does not preserve reviewed remote ancestry.');
  git(root,['push',url,r.commit+':refs/heads/'+r.branch]);
  if(remoteHead(root,url,r.branch)!==r.commit)throw new Error('Push did not verify.');
  return{repository:r.repository,branch:r.branch,commit:r.commit,trigger:'Git-to-Vercel only; inspect the deployment for this exact commit.'};
}
async function main() {
  if(process.argv.includes('--help')){console.log('Usage: node scripts/export-dealer.mjs --client SLUG --package PATH [--branch BRANCH] [--review JSON --write]\nnode scripts/export-dealer.mjs --push-receipt runtime/.../export.json\nDry run fetches and compares the actual remote. Write creates a scoped commit; push is explicit and never forced.');return;}
  const o=args(process.argv.slice(2),['client','package','branch','review','push-receipt'],['write','dry-run']);
  const result=o['push-receipt']?pushExport({receiptFile:o['push-receipt']}):exportDealer({slug:o.client,packageDir:o.package,reviewFile:o.review,write:!!o.write,targetBranch:o.branch});
  console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});
