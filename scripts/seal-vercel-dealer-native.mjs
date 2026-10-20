import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {ROOT,git,inside} from './lib/workflow.mjs';
import {readVercelNativeProof,validateVercelNativeMapping} from './lib/vercel-native-mapping.mjs';
import {validateNativeRelease,assertNativeAdoption,nativeInputDigest} from './lib/native-localization.mjs';
import {adoptNativeSource} from './publishing/native-mounts.mjs';
import {baseNativeManifest} from './publishing/app-variant.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex'),encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n'),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const need=(v,m)=>{if(!v)throw Error('Vercel native source seal: '+m);};
async function committedInput(root,source,manifest,sourceCommit) {
 const {committedDealerInputs}=await import('./package-dealer.mjs');
 return (await committedDealerInputs({root,source,manifest,sourceCommit,prefix:'clients/'+manifest.slug})).canonicalFiles;
}
/** Emits reviewed bytes only; never installs source, writes an index, fetches or publishes. */
export async function freezeVercelDealerNativeSeal(request,{root=ROOT,outDirectory,readInputs=committedInput}={}) {
 need(request?.schemaVersion===1&&request.kind==='cars-vercel-dealer-native-seal-request'&&request.reviewed===true&&
   Number.isFinite(Date.parse(request.reviewedAt))&&request.nativeApproval===true&&request.hostedApproval===true&&request.globalReleaseApproval===false,
   'actual scoped native and hosted acceptance request is required');
 need(/^[a-z0-9][a-z0-9-]*$/.test(request.dealer||'')&&/^[a-f0-9]{40}$/.test(request.sourceCommit||'')&&/^[a-f0-9]{40}$/.test(request.sourceTree||'')&&
   /^[a-f0-9]{64}$/.test(request.approvedLockSha256||''),'exact dealer/source/global lock leases required');
 need(git(root,['rev-parse','HEAD'])===request.sourceCommit&&git(root,['rev-parse',request.sourceCommit+':clients/'+request.dealer])===request.sourceTree,'canonical source HEAD/tree lease differs');
 const source=inside(root,'clients/'+request.dealer,{mustExist:true});need(!fs.existsSync(path.join(source,'.git')),'independent source is excluded from Cars publication');
 const manifest=JSON.parse(fs.readFileSync(path.join(source,'dealer.json')));
 need(manifest.packaging?.version==='5'&&manifest.slug===request.dealer&&manifest.repository===request.repository&&
   manifest.shareIdentity?.publicOrigin===(request.canonicalPublicOrigin??request.publicOrigin),'canonical manifest/repository/public origin differs');
 need(request.canonicalPublicOrigin===undefined||request.canonicalPublicOrigin===manifest.shareIdentity.publicOrigin,'explicit stable dealer identity differs');
 const globalBefore=fs.readFileSync(path.join(root,'templates.lock.json'));need(hash(globalBefore)===request.approvedLockSha256,'global lock changed');
 const scoped=readVercelNativeProof(root,request.scopedReleases).value;
 need(scoped.schemaVersion===1&&scoped.kind==='cars-vercel-dealer-scoped-native-releases'&&scoped.scope==='existing-dealer'&&
   scoped.dealer===request.dealer&&scoped.repository===request.repository&&scoped.sourceCommit===request.sourceCommit&&scoped.sourceTree===request.sourceTree&&
   scoped.projectId===request.projectId&&(scoped.publicOrigin===undefined||scoped.publicOrigin===request.publicOrigin)&&scoped.globalReleaseApproval===false&&scoped.nativeApproval===true&&scoped.hostedApproval===true,
   'dealer-scoped source acceptance differs');
 const base=baseNativeManifest(manifest),keys=base.variants.map(v=>v.key),releases=scoped.templates;
 need(releases&&same(Object.keys(releases).sort(),[...keys].sort()),'exact maintained Auto Best/Modern/Import adoption release set required; mapping authenticates all six applications');
 const proofRefs=new Map(),pending=[request.scopedReleases],visited=new Set();let proofBytes=0;
 const queueRefs=value=>{if(!value||typeof value!=='object')return;if(!Array.isArray(value)&&typeof value.reference==='string'&&typeof value.sha256==='string'&&value.reference.endsWith('.json')){
   if(Object.keys(value).length===2)pending.push(value);
   else if(value.lease)pending.push({reference:value.reference,sha256:value.sha256});
  }for(const item of Object.values(value))queueRefs(item);};
 for(const key of keys){const review=validateNativeRelease(key,releases[key],{root}),accepted=validateVercelNativeMapping(key,releases[key],review,root,{nativeChecks:(await import('./lib/native-localization.mjs')).NATIVE_CHECKS});
   need(accepted.mapping.dealer===request.dealer&&accepted.mapping.repository===request.repository&&accepted.mapping.sourceCommit===request.sourceCommit&&
     accepted.mapping.sourceTree===request.sourceTree&&accepted.mapping.projectId===request.projectId&&accepted.mapping.publicOrigin===request.publicOrigin&&accepted.lease.approvedLockSha256===request.approvedLockSha256&&
     ['repository','revision','path','tree','digest'].every(k=>manifest.templateSources[key][k]===releases[key].source[k]),'actual acceptance/source scope differs');
 }
 const files=await readInputs(root,source,manifest,request.sourceCommit),adopted=adoptNativeSource(files,base,releases,{root});
 assertNativeAdoption(adopted,base,{root});need(same(nativeInputDigest(files,base),nativeInputDigest(adopted,base)),'canonical native input changed during sealing');
 const changed=[...new Set([...files.keys(),...adopted.keys()])].filter(name=>!files.get(name)?.equals(adopted.get(name)));
 need(changed.length===1&&changed[0]==='localization/adoption.json','seal may change only the native adoption receipt');
 need(hash(fs.readFileSync(path.join(root,'templates.lock.json')))===hash(globalBefore)&&git(root,['rev-parse','HEAD'])===request.sourceCommit,'source/global lock changed during sealing');
 while(pending.length){const ref=pending.shift(),id=ref.reference+'|'+ref.sha256;if(visited.has(id))continue;visited.add(id);
   need(ref.reference.startsWith('docs/releases/vercel-existing-refresh/'),'acceptance evidence must use the bounded Vercel release directory');
   const read=readVercelNativeProof(root,ref);need(!proofRefs.has(ref.reference)||proofRefs.get(ref.reference).reference.sha256===ref.sha256,'proof reference hash collision');
   proofRefs.set(ref.reference,read);proofBytes+=read.bytes.length;need(proofRefs.size<=160&&proofBytes<=16*1024**2,'acceptance proof closure exceeds bounded size');queueRefs(read.value);
 }
 const destination=path.resolve(outDirectory),runtime=inside(root,'runtime');need(destination.startsWith(runtime+path.sep)&&destination!==runtime&&!fs.existsSync(destination),'one fresh bounded runtime output required');
 fs.mkdirSync(destination,{recursive:true});const payload=path.join(destination,'payload'),rows=[];
 function freeze(name,bytes){const beforeBlob=git(root,['rev-parse',request.sourceCommit+':'+name],{allowFailure:true}),file=path.join(payload,name);
   need(!name.split('/').some(p=>p==='..'||p==='.'),'invalid payload name');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});
   rows.push({path:name,beforeBlob,payloadPath:file,sha256:hash(bytes),gitBlob:createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),bytes:bytes.length});
 }
 freeze('clients/'+request.dealer+'/localization/adoption.json',adopted.get('localization/adoption.json'));
 for(const [name,read]of proofRefs)freeze(name,read.bytes);
 const receipt={schemaVersion:1,kind:'cars-vercel-dealer-native-source-seal-proposal',dealer:request.dealer,repository:request.repository,sourceRef:request.sourceCommit,sourceTreeLease:request.sourceTree,
   requestSha256:hash(encode(request)),scopedReleases:request.scopedReleases,files:rows,globalApprovedLockSha256:request.approvedLockSha256,globalLockChanged:false,
   canonicalSourceEdited:false,gitIndexEdited:false,localFetch:false,published:false,providerWrites:0,nativeApproval:true,hostedApproval:true,globalReleaseApproval:false,
   ownerVisualApproval:false,sourceApprovalScope:'this exact dealer and reviewed preview mapping only; production alias acceptance remains pending',createdAt:new Date().toISOString()};
 fs.writeFileSync(path.join(destination,'publication-handoff.json'),encode(receipt),{flag:'wx'});return receipt;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{const args=process.argv.slice(2),values={};for(let i=0;i<args.length;i+=2){need(['--cars-root','--request','--request-sha256','--out'].includes(args[i])&&args[i+1],'fixed CLI arguments required');values[args[i].slice(2)]=args[i+1];}
  const bytes=fs.readFileSync(values.request);need(/^[a-f0-9]{64}$/.test(values['request-sha256']||'')&&bytes.length<=2*1024**2&&hash(bytes)===values['request-sha256'],'frozen request hash differs');
  const result=await freezeVercelDealerNativeSeal(JSON.parse(bytes),{root:values['cars-root']||ROOT,outDirectory:values.out});console.log(JSON.stringify({...result,files:result.files.length},null,2));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
