import { assertCarsOwnedDealer } from './lib/dealer-source.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,args,json,writeJson,git,inside,filesAt,sha256,normalized,validateManifest} from './lib/workflow.mjs';

const PACKAGE_OMITTED = new Set(['.git','node_modules','.vercel','.netlify','.wrangler','.open-next','.vinext','.cloudflare','.cars-cloudflare','.cars-build-assets','.agency-os','.auth','.codex','.claude','.agents','.openai','.template','.svelte-kit','.next','.turbo','.cache','.pnpm-store','build','dist','runtime','audits','artifacts','evidence','qa','qa-final','test-results','playwright-report','coverage']);
function retainedPackagePath(relative) {
  return !relative.split('/').some(p => PACKAGE_OMITTED.has(p) || (p.startsWith('.env') && !/^\.env\.(example|sample|template)$/.test(p)) || p.startsWith('.next-')) && !/\.(pem|key|pfx|p12|log|pid|tsbuildinfo)$/i.test(relative) && (!/(?:credentials|service-account|purchase-code|license-certificate)/i.test(path.basename(relative)) || /\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(relative)) && relative !== '.cars-publish.json' && relative !== '.cars-cloudflare-svelte-locks.json' && !/^\.cars-next-(?:modern|app|mobile)-(?:dependencies|frozen-lock)\.json$/.test(relative);
}
export function packageFiles(directory) {
  return filesAt(directory,{filter:retainedPackagePath});
}
export function packageDigest(directory) {
  const files = packageFiles(directory).map(p => ({path:p,sha256:sha256(normalized(fs.readFileSync(path.join(directory,p))))}));
  return {files,digest:sha256(JSON.stringify(files))};
}
function verifyPayload(meta, actual, provider) {
  if (meta.assetDelivery?.provider === 'cloudflare' &&
      (provider?.provider !== 'cloudflare' || provider.acceptance?.dependencyLocksFrozen !== true)) {
    throw new Error('Cloudflare dependency locks must be qualified and frozen before publishing');
  }
  const payload=actual.files.filter(f=>f.path!=='.cars-package.json');
  if(JSON.stringify(payload)!==JSON.stringify(meta.payload)||sha256(JSON.stringify(payload))!==meta.payloadDigest)
    throw new Error('Package payload changed after generation. Fix canonical source or packaging, then regenerate.');
  return actual;
}
export function verifyPackage(directory) {
  const meta=json(path.join(directory,'.cars-package.json'));
  const provider=meta.assetDelivery?.provider === 'cloudflare' ? json(path.join(directory,'.cars-cloudflare.json')) : undefined;
  return verifyPayload(meta,packageDigest(directory),provider);
}

/** Read only immutable, complete package trees. Never check out their asset bytes. */
export function verifyPackageTree({root=ROOT,packageTree}) {
  if (!/^[a-f0-9]{40}$/.test(packageTree ?? '')) throw new Error('Package tree input must be an immutable 40-character Git object.');
  const tree=git(root,['rev-parse','--verify',packageTree+'^{tree}']);
  const raw=git(root,['ls-tree','-r','-l','-z','--full-tree',tree],{encoding:null});
  const decoded=raw.toString('utf8');
  if (!Buffer.from(decoded).equals(raw)) throw new Error('Package tree contains a non-UTF-8 path.');
  const entries=decoded.split('\0').filter(Boolean).map(line=>{
    const separator=line.indexOf('\t'),header=line.slice(0,separator).trim().split(/\s+/);
    const [mode,type,blob,size]=header,name=line.slice(separator+1),bytes=Number(size);
    if (separator<0 || header.length!==4 || type!=='blob' || !['100644','100755'].includes(mode) ||
        !/^[a-f0-9]{40}$/.test(blob) || !Number.isSafeInteger(bytes) || bytes<0 || bytes>=100*1024**2) {
      throw new Error('Unsupported package tree mode, object or size: '+name);
    }
    if (!name || /[\\:\u0000-\u001f\u007f]/.test(name) || name.startsWith('/') ||
        name.split('/').some(part=>!part || part==='.' || part==='..') ||
        name.split('/').some((_part,index,parts)=>!retainedPackagePath(parts.slice(0,index+1).join('/')))) {
      throw new Error('Package tree contains an unsafe or excluded path: '+name);
    }
    return {path:name,mode,blob,bytes};
  }).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
  const documents=new Set(['.cars-package.json','dealer.json','.cars-cloudflare.json']);
  const retainedDocuments=new Map(),digests=new Map();
  const unique=[...new Map(entries.map(entry=>[entry.blob,entry])).values()];
  const documentBlobs=new Set(entries.filter(entry=>documents.has(entry.path)).map(entry=>entry.blob));
  const io={files:entries.length,uniqueBlobs:unique.length,bytesRead:0,batches:0,maxBatchBytes:0,
    batchTargetBytes:16*1024**2,maxSingleFileBytes:0,observedRssBytes:process.memoryUsage().rss};
  // Limit by bytes and count. One larger allowed file occupies its own batch;
  // repeated assets are hashed once, with no full-package Buffer or Map copy.
  for (let index=0;index<unique.length;) {
    const batch=[];let plannedBytes=0;
    while (index<unique.length && batch.length<256) {
      const entry=unique[index],cost=entry.bytes+128;
      if (batch.length && plannedBytes+cost>io.batchTargetBytes) break;
      batch.push(entry);plannedBytes+=cost;index++;
    }
    const output=git(root,['cat-file','--batch'],{input:batch.map(entry=>entry.blob).join('\n')+'\n',encoding:null});
    io.batches++;io.bytesRead+=batch.reduce((sum,entry)=>sum+entry.bytes,0);
    io.maxBatchBytes=Math.max(io.maxBatchBytes,output.length);
    let offset=0;
    for (const entry of batch) {
      const end=output.indexOf(10,offset),header=output.subarray(offset,end).toString('ascii').split(' ');
      const size=Number(header[2]),start=end+1,after=start+size;
      if (end<0 || header.length!==3 || header[0]!==entry.blob || header[1]!=='blob' ||
          size!==entry.bytes || after>=output.length || output[after]!==10) throw new Error('Git package blob changed or could not be read: '+entry.path);
      const bytes=output.subarray(start,after);
      digests.set(entry.blob,sha256(normalized(bytes)));
      if (documentBlobs.has(entry.blob)) retainedDocuments.set(entry.blob,Buffer.from(bytes));
      offset=after+1;io.maxSingleFileBytes=Math.max(io.maxSingleFileBytes,size);
    }
    if (offset!==output.length) throw new Error('Unexpected trailing Git package blob output.');
    io.observedRssBytes=Math.max(io.observedRssBytes,process.memoryUsage().rss);
  }
  const readDocument=name=>{
    const entry=entries.find(item=>item.path===name),bytes=entry && retainedDocuments.get(entry.blob);
    if (!bytes) throw new Error('Missing package tree receipt: '+name);
    return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));
  };
  const meta=readDocument('.cars-package.json'),manifest=readDocument('dealer.json');
  const files=entries.map(entry=>({path:entry.path,sha256:digests.get(entry.blob)}));
  const actual={files,digest:sha256(JSON.stringify(files))};
  verifyPayload(meta,actual,meta.assetDelivery?.provider==='cloudflare'?readDocument('.cars-cloudflare.json'):undefined);
  return {...actual,tree,meta,manifest,io};
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
export function exportDealer({root=ROOT,slug,packageDir,packageTree,reviewFile,write=false,targetBranch}) {
  assertCarsOwnedDealer(root, slug);
  const client=inside(root,'clients/'+slug,{mustExist:true});
  const manifest=validateManifest(json(path.join(client,'dealer.json')));
  if(manifest.slug!==slug)throw new Error('Dealer manifest slug mismatch.');
  if (Boolean(packageDir)===Boolean(packageTree)) throw new Error('Select exactly one package directory or immutable package tree.');
  const treePackage=packageTree?verifyPackageTree({root,packageTree}):null;
  const directory=treePackage?null:fs.realpathSync(packageDir);
  const packageMeta=treePackage?.meta ?? json(path.join(directory,'.cars-package.json'));
  const packageManifest=treePackage?.manifest ?? json(path.join(directory,'dealer.json'));
  if (packageManifest.repository!==manifest.repository)throw new Error('Package repository differs from canonical manifest.');
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
  const digest=treePackage ?? verifyPackage(directory),files=digest.files.map(f=>f.path);
  const g=(a,input)=>git(root,[...(directory?['--work-tree',directory]:[]),...a],{env,input});
  if (treePackage) g(['read-tree','--no-sparse-checkout',treePackage.tree]);
  else {g(['read-tree','--empty']);g(['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],files.join('\0')+'\0');}
  const tree=g(['write-tree']);
  if (treePackage && tree!==treePackage.tree) throw new Error('Verified package tree changed while preparing export.');
  const remote=treeFiles(root,parent),candidate=treeFiles(root,tree);
  // Tree identifiers are accepted by ls-tree, while commit ancestry is checked separately.
  const changes=[...new Set([...remote.keys(),...candidate.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==candidate.get(p)).sort();
  const priorText=git(root,['show',parent+':.cars-publish.json'],{allowFailure:true});
  let unexpected=[];
  if(priorText){const prior=JSON.parse(priorText);if(prior.repository!==manifest.repository)throw new Error('Remote publishing metadata has another repository identity.');const managed=new Map(prior.files.map(f=>[f.path,f.blob]));unexpected=[...new Set([...remote.keys(),...managed.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==managed.get(p));}
  const report={schemaVersion:1,slug,repository:manifest.repository,branch,defaultBranch,baseHead,targetHead,parent,sourceCommit:packageMeta.sourceCommit,candidateDigest:digest.digest,tree,changes,unexpectedRemoteChanges:unexpected,packageDirectory:directory,proposalDirectory:run,...(treePackage?{packageTree:treePackage.tree,packageObject:packageTree,treeVerification:treePackage.io}:{}),...(packageMeta.assetDelivery?.provider === 'cloudflare' ? {provider:'cloudflare'} : {})};
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
  assertCarsOwnedDealer(root, r.slug);
  const manifest=validateManifest(json(inside(root,'clients/'+r.slug+'/dealer.json',{mustExist:true})));
  if(manifest.repository!==r.repository)throw new Error('Receipt repository no longer matches canonical identity.');
  if(remoteHead(root,url,r.branch)!==r.targetHead || remoteHead(root,url,r.defaultBranch)!==r.baseHead)throw new Error('Remote advanced after review. Re-export; never force-push.');
  if(git(root,['rev-parse',r.commit+'^'])!==r.parent)throw new Error('Export does not preserve reviewed remote ancestry.');
  git(root,['push',url,r.commit+':refs/heads/'+r.branch]);
  if(remoteHead(root,url,r.branch)!==r.commit)throw new Error('Push did not verify.');
  return{repository:r.repository,branch:r.branch,commit:r.commit,trigger:r.provider === 'cloudflare' ? 'Cloudflare source delivered; deploy and verify this exact package separately.' : 'Git-to-Vercel only; inspect the deployment for this exact commit.'};
}
async function main() {
  if(process.argv.includes('--help')){console.log('Usage: node scripts/export-dealer.mjs --client SLUG (--package PATH | --package-tree SHA) [--branch BRANCH] [--review JSON --write]\nnode scripts/export-dealer.mjs --push-receipt runtime/.../export.json\nDry run fetches and compares the actual remote. Write creates a scoped commit; push is explicit and never forced.');return;}
  const o=args(process.argv.slice(2),['client','package','package-tree','branch','review','push-receipt'],['write','dry-run']);
  const result=o['push-receipt']?pushExport({receiptFile:o['push-receipt']}):exportDealer({slug:o.client,packageDir:o.package,packageTree:o['package-tree'],reviewFile:o.review,write:!!o.write,targetBranch:o.branch});
  console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});
