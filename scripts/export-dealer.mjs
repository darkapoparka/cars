import {assertF1rstSharedControlsSuccessor} from './lib/vercel-shared-controls-successor.mjs';
import {assertCloudflareNativeSourceExport} from './lib/cloudflare-native-source-qualification.mjs';
import { assertCarsOwnedDealer } from './lib/dealer-source.mjs';
import fs from 'node:fs';
import {assertVercelProductionWaveMember} from './lib/vercel-production-wave.mjs';
import path from 'node:path';
import {ROOT,args,json,writeJson,git,inside,filesAt,sha256,normalized,validateManifest} from './lib/workflow.mjs';

const requireVercelQualificationExport = (value, message) => { if (!value) throw new Error('Vercel pilot qualification: ' + message); };
/** One explicit owner-authorized production pilot retains all provisional flags.
 * The previously READY six-service deployment and reviewed exact two-leaf source
 * successor are distinct from the production build and hosted acceptance pending. */
/** A reviewed Auto Best-only successor reuses real six-service production proof.
 * The exact source/tree/input/lock/main leases are data from its sealed source
 * request; pending build and hosted flags are never replaced with acceptance. */
export function assertVercelReviewedAutoSuccessor(pilot, {meta, manifest} = {}) {
  const require=(value,message)=>requireVercelQualificationExport(value,'reviewed F1rst successor: '+message);
  const oid=value=>/^[a-f0-9]{40}$/.test(value||''),digest=value=>/^[a-f0-9]{64}$/.test(value||'');
  require(pilot?.schemaVersion===1&&pilot.kind==='cars-owner-authorized-f1rst-main-production-pilot','explicit owner production-pilot record required');
  require(pilot.dealer==='f1rst-motors'&&pilot.repository==='darkapoparka/cars-f1rstmotors'&&pilot.projectId==='prj_mavqUXCj6hSEg8EvBJW8G3XJlihm'&&pilot.publicOrigin==='https://cars-f1rstmotors.vercel.app','existing dealer identity changed');
  require(manifest?.slug===pilot.dealer&&manifest.repository===pilot.repository&&manifest.shareIdentity?.publicOrigin===pilot.publicOrigin,'package identity differs');
  require(oid(pilot.sourceCommit)&&meta.sourceCommit===pilot.sourceCommit&&oid(pilot.sourceTree)&&oid(pilot.privateMain)&&oid(pilot.templateSourceCommit),'exact immutable source and current MAIN leases required');
  require(meta.qualification.templateSourceCommit===pilot.templateSourceCommit&&digest(pilot.candidateLockSha256)&&meta.qualification.candidateLockSha256===pilot.candidateLockSha256,'qualified template/lock changed');
  const review=pilot.reviewedSuccessor;
  require(review?.scope==='owner-reviewed-auto-best-ui-source-successor'&&review.reviewed===true&&review.authoritativeFactsUnchanged===true&&review.allRasterAssetBytesUnchanged===true,'explicit reviewed UI-only source successor required');
  require(review.path==='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/f1rst-motors/source-preparation-successor-receipt.json'&&digest(review.sha256)&&review.preparedTree===pilot.sourceTree&&review.sourceRevision===pilot.templateSourceCommit,'source receipt tuple differs');
  require(oid(review.baseline?.commit)&&oid(review.baseline?.tree)&&digest(review.nativeInputDigest)&&meta.qualification.nativeInput?.digest===review.nativeInputDigest,'exact retained source/input seal required');
  require(Array.isArray(review.changedAutoLeaves)&&review.changedAutoLeaves.length>0&&review.changedAutoLeaves.length<=16&&new Set(review.changedAutoLeaves.map(r=>r.path)).size===review.changedAutoLeaves.length,'bounded exact source leaf delta required');
  for(const leaf of review.changedAutoLeaves)require(typeof leaf.path==='string'&&/^(?:src\/lib\/components\/[a-zA-Z0-9_./+-]+\.svelte|src\/lib\/styles\/[a-zA-Z0-9_./+-]+\.css|src\/lib\/locale\/catalog\.ts)$/.test(leaf.path)&&!leaf.path.split('/').some(p=>!p||p==='.'||p==='..')&&oid(leaf.beforeBlob)&&oid(leaf.afterBlob)&&leaf.beforeBlob!==leaf.afterBlob,'unreviewed or protected Auto source leaf');
  const unchanged={modern:['01eac7390fa6ba951d4b8d4c26159a9be150f6c8','30e1a99f857cc25e4d78c9459cfb4394a9f70c5b114196a5ca6325ff38823b4b'],import:['d841ddfe5bec918bf6b2c19fd6971fecd6b8e54d','c7d6c93214e859aa2747af8f5e068b6a0b8ca095d6328c807728a4d531d688f8'],app:['7f3d3ffa40546635377e6c5225194fe06fead291','df336def57349fedfc4c425a00c7434c251735b90abb4636d0926290aafa7ed1'],mobile:['792bfdd1d8eb22aabd90c7e3a0c0779a6c1c36f3','f5a3e541a7c648a4c2899ad3893e22a3806027a9f66d95fa4e8c74b2226635b6'],'karento-best':['8c5ac869c7fd15e19a80c660343fc64b20a2bad9','be17ef365e3272753df6e50826b139a45bfc32b8fef54ddcb86d977ad16280a9']};
  require(JSON.stringify(Object.keys(manifest.templateSources||{}).sort())===JSON.stringify(['auto-best',...Object.keys(unchanged)].sort()),'six selected source tuples required');
  for(const [key,s]of Object.entries(manifest.templateSources)){require(s.repository==='darkapoparka/cars'&&s.revision===pilot.templateSourceCommit&&s.path==='templates/'+key&&oid(s.tree)&&digest(s.digest),'invalid immutable template tuple');if(unchanged[key])require(s.tree===unchanged[key][0]&&s.digest===unchanged[key][1],'another template master changed');}
  require(review.autoBestSource?.tree===manifest.templateSources['auto-best'].tree&&review.autoBestSource?.digest===manifest.templateSources['auto-best'].digest,'reviewed Auto source differs');
  const marker=review.personalizationMarker;
  if(marker!==undefined)require(marker.path==='src/lib/data/company.ts'&&oid(marker.beforeBlob)&&oid(marker.afterBlob)&&marker.beforeBlob!==marker.afterBlob&&marker.insertedDeclaration==="export const companyServicesCopyOwner = 'dealer' as const;"&&marker.factualServiceFieldsUnchanged===true,'only the reviewed factual-copy owner marker may change');
  const prior=pilot.priorProduction;
  require(prior?.state==='READY'&&prior.target==='production'&&prior.gitBranch==='main'&&prior.projectId===pilot.projectId&&prior.publicOrigin===pilot.publicOrigin&&/^dpl_[A-Za-z0-9]+$/.test(prior.deploymentId||'')&&oid(prior.gitCommit)&&prior.gitCommit===pilot.privateMain&&digest(prior.receiptSha256)&&prior.serviceCount===6,'actual previous six-service MAIN production receipt required');
  require(prior.sourceCommit===review.baseline.commit&&prior.sourceTree===review.baseline.tree,'reviewed source baseline differs from prior production');
  for(const field of ['ownerAuthorizedMain','otherFiveTemplateTreesUnchanged','stockAndFactsUnchanged','productionBuildPending'])require(pilot[field]===true,'false production-pilot scope');require(pilot.hostedApproval===false,'hosted acceptance is pending');
}

/** Exact metadata-only continuation of the accepted F1rst production pilot.
 * Every personalized UI, stock, fact and raster byte and its native input digest
 * stays identical. Final source pins and real production build remain separate. */
export function assertVercelReviewedMetadataSuccessor(pilot,{meta,manifest}={}){
 const require=(value,message)=>requireVercelQualificationExport(value,'exact F1rst metadata successor: '+message),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const expected={"sourceTree":"2e898661a8176a4f497c53f65eb7461633c21d1e","templateSourceCommit":"bb173c33d7b640502ad2e4bf27546748c12858b8","candidateLockSha256":"04633129df9e75d6cd62deeac9125b279957789d75f57cdb0b243ef61bfc3e7e","privateMain":"3c886d1148f7f1e3896f04b4bc0f44ed38a497b8","reviewedSuccessor":{"path":"docs/releases/cloudflare-existing25-20261011/vercel-existing-source/f1rst-motors/source-preparation-successor-receipt.json","sha256":"1cd3e073c07b94bfee21981510766f9311eeaa42a43b406392490822fab619e6","preparedTree":"2e898661a8176a4f497c53f65eb7461633c21d1e","sourceRevision":"bb173c33d7b640502ad2e4bf27546748c12858b8","baseline":{"commit":"c4f75c2fd46afe0ea350d7544a9c840bd497b51b","tree":"d1a2f40bfc5eee2f75356463b390241f90e57806"},"nativeInputDigest":"dcad35257ad6a5a028d8ac7f4f24cf26005ba30c0b1aab001afba08aa391249c","changedMetadataPaths":[".cars-app.json",".cars-branding.json",".cars-mobile.json",".cars-signature.json",".client/cloudflare-existing-source.json",".client/native-qualification-context.json",".client/native-qualification-lock.json","dealer.json","localization/adoption.json"],"personalizationMarker":{"path":"src/lib/data/company.ts","blob":"4809bbcca9c3640aefdb19978f5eedb6fad3425e","unchanged":true,"factualServiceFieldsUnchanged":true},"masterTypeCorrection":{"path":"src/lib/data/company.ts","emittedJavaScriptIdentical":true,"evidenceSha256":"bed4734f7cf057788bdb6239bcac9b2de803bc030cbad6ede4439f0cd977c8ec"}},"priorProduction":{"deploymentId":"dpl_BAbdu2xK3LxEaGoq8pc162zD4vHg","gitCommit":"3c886d1148f7f1e3896f04b4bc0f44ed38a497b8","sourceCommit":"c4f75c2fd46afe0ea350d7544a9c840bd497b51b","sourceTree":"d1a2f40bfc5eee2f75356463b390241f90e57806","receiptSha256":"5b7478539ee83b13356793cc82450a56c4d3e220f04b5e9de7ef9f789554b797"}},sources={"auto-best":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/auto-best","tree":"78fa1a82eca14816449f9588283260840ee94f52","digest":"2fc9c3cfc9cf1976dbe30c08592776362e5bcc6b09e8b06620e57c4406df58a5"},"modern":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/modern","tree":"01eac7390fa6ba951d4b8d4c26159a9be150f6c8","digest":"30e1a99f857cc25e4d78c9459cfb4394a9f70c5b114196a5ca6325ff38823b4b"},"import":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/import","tree":"d841ddfe5bec918bf6b2c19fd6971fecd6b8e54d","digest":"c7d6c93214e859aa2747af8f5e068b6a0b8ca095d6328c807728a4d531d688f8"},"app":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/app","tree":"7f3d3ffa40546635377e6c5225194fe06fead291","digest":"df336def57349fedfc4c425a00c7434c251735b90abb4636d0926290aafa7ed1"},"mobile":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/mobile","tree":"792bfdd1d8eb22aabd90c7e3a0c0779a6c1c36f3","digest":"f5a3e541a7c648a4c2899ad3893e22a3806027a9f66d95fa4e8c74b2226635b6"},"karento-best":{"repository":"darkapoparka/cars","revision":"bb173c33d7b640502ad2e4bf27546748c12858b8","path":"templates/karento-best","tree":"8c5ac869c7fd15e19a80c660343fc64b20a2bad9","digest":"be17ef365e3272753df6e50826b139a45bfc32b8fef54ddcb86d977ad16280a9"}};
 require(pilot?.schemaVersion===1&&pilot.kind==='cars-owner-authorized-f1rst-main-production-pilot'&&pilot.dealer==='f1rst-motors'&&pilot.repository==='darkapoparka/cars-f1rstmotors'&&pilot.projectId==='prj_mavqUXCj6hSEg8EvBJW8G3XJlihm'&&pilot.publicOrigin==='https://cars-f1rstmotors.vercel.app','existing F1rst identity required');
 require(manifest?.slug===pilot.dealer&&manifest.repository===pilot.repository&&manifest.shareIdentity?.publicOrigin===pilot.publicOrigin,'package identity changed');
 require(/^[a-f0-9]{40}$/.test(pilot.sourceCommit||'')&&meta?.sourceCommit===pilot.sourceCommit,'exact committed source required');
 for(const key of ['sourceTree','templateSourceCommit','candidateLockSha256','privateMain'])require(pilot[key]===expected[key],'exact source/tree/lock/private MAIN lease changed');
 require(meta.qualification?.templateSourceCommit===expected.templateSourceCommit&&meta.qualification?.candidateLockSha256===expected.candidateLockSha256&&meta.qualification?.nativeInput?.digest===expected.reviewedSuccessor.nativeInputDigest,'actual native source/lock/input seal changed');
 require(same(Object.keys(manifest.templateSources||{}).sort(),Object.keys(sources).sort()),'six final source tuples required');for(const [key,s]of Object.entries(sources))for(const field of ['repository','revision','path','tree','digest'])require(manifest.templateSources[key][field]===s[field],'final source tuple changed');
 const review=pilot.reviewedSuccessor;require(review?.scope==='owner-reviewed-final-source-metadata-successor'&&review.reviewed===true&&review.metadataOnly===true&&review.allUiFilesByteIdentical===true&&review.authoritativeFactsUnchanged===true&&review.allRasterAssetBytesUnchanged===true,'reviewed byte-identical UI/facts/stock/raster successor required');
 for(const [key,value]of Object.entries(expected.reviewedSuccessor))require(same(review[key],value),'exact metadata receipt changed: '+key);
 require(Array.isArray(review.changedAutoLeaves)&&review.changedAutoLeaves.length===0,'no UI source change admitted');
 const prior=pilot.priorProduction;for(const [key,value]of Object.entries(expected.priorProduction))require(prior?.[key]===value,'actual accepted previous production changed');
 require(prior.state==='READY'&&prior.target==='production'&&prior.gitBranch==='main'&&prior.projectId===pilot.projectId&&prior.publicOrigin===pilot.publicOrigin&&prior.serviceCount===6&&prior.hostedVerified===true,'accepted prior six-service MAIN production required');
 for(const field of ['ownerAuthorizedMain','otherFiveTemplateTreesUnchanged','stockAndFactsUnchanged','productionBuildPending'])require(pilot[field]===true,'exact pending production scope changed');require(pilot.hostedApproval===false,'new production hosted acceptance remains pending');
}

export function assertVercelProductionPilot(pilot, {meta, manifest} = {}) {
  if(pilot?.kind==='cars-owner-authorized-f1rst-shared-controls-package-successor'){assertF1rstSharedControlsSuccessor(pilot,{meta,manifest});return;}
  if(pilot?.reviewedSuccessor?.scope==='owner-reviewed-final-source-metadata-successor'){assertVercelReviewedMetadataSuccessor(pilot,{meta,manifest});return;}
  if(pilot?.kind==='cars-owner-authorized-vercel-main-production-wave-member'){assertVercelProductionWaveMember(pilot,{meta,manifest});return;}
  if(pilot?.reviewedSuccessor?.scope==='owner-reviewed-auto-best-ui-source-successor'){assertVercelReviewedAutoSuccessor(pilot,{meta,manifest});return;}
  const match=(actual,expected)=>requireVercelQualificationExport(actual===expected,'exact F1rst MAIN production-pilot proof required');
  match(pilot?.schemaVersion,1);match(pilot?.kind,'cars-owner-authorized-f1rst-main-production-pilot');
  match(pilot.dealer,'f1rst-motors');match(pilot.repository,'darkapoparka/cars-f1rstmotors');
  match(pilot.projectId,'prj_mavqUXCj6hSEg8EvBJW8G3XJlihm');match(pilot.publicOrigin,'https://cars-f1rstmotors.vercel.app');
  match(manifest?.slug,pilot.dealer);match(manifest?.repository,pilot.repository);match(manifest?.shareIdentity?.publicOrigin,pilot.publicOrigin);
  match(pilot.sourceCommit,'a7044683f48187e2e095d1541177b746b41b15e5');match(meta?.sourceCommit,pilot.sourceCommit);
  match(pilot.sourceTree,'947f66ca0c9bc86c5b94eae1d0aed1e7b78d3cfd');match(pilot.templateSourceCommit,'7d4557f3074b32e3f57af28b89906754b73fb9cd');
  match(meta?.qualification?.templateSourceCommit,pilot.templateSourceCommit);match(meta?.qualification?.candidateLockSha256,'4ceb9b3085d3dae4c415229d134ef33905e352f499ae2e1126bd85e318d648d8');
  match(meta?.qualification?.nativeInput?.digest,'68cc34d7b99cc5356ee7494ff77ce27c47674c00d0369f93e02d572be73b9622');
  match(pilot.privateMain,'6e0184b856858fa4f9d0b158f64b4edef44f0e83');
  const prior=pilot.priorReady;match(prior?.deploymentId,'dpl_DMWq9arGWLk3wxSqzhSyzSvsu5pa');match(prior?.gitCommit,'bda8b54af9326f1e85d981431346fccc29b1d05e');
  match(prior?.sourceCommit,'3e7002fb71f38c3c99bc35e8ba8b9fb9730c8447');match(prior?.sourceTree,'4bf06e41365c440f74754a787063b4ff35c6f343');
  match(prior?.packageTree,'0fe7f8d8b3ba54c67ad45066ecd3f7814d4b50d5');match(prior?.serviceCount,6);match(prior?.receiptSha256,'4940ea6bada364d711ef8c78ab118a183f61b0c4de8c6541020289e1075cf95a');
  const successor=pilot.reviewedSuccessor;match(successor?.path,'docs/releases/cloudflare-existing25-20261011/vercel-existing-source/f1rst-motors/source-preparation-successor-receipt.json');
  match(successor?.sha256,'2536b02b81da5aa9e6f0f22dfef055f017542632d6a790ab2175dadaa6506772');match(successor?.preparedTree,pilot.sourceTree);match(successor?.nativeInputDigest,meta.qualification.nativeInput.digest);
  for(const field of ['ownerAuthorizedMain','otherFiveTemplateTreesUnchanged','stockAndFactsUnchanged','productionBuildPending'])match(pilot[field],true);match(pilot.hostedApproval,false);
}
/** Ordinary provisional export still requires its exact reviewed preview branch.
 * MAIN requires an explicit exact pilot or qualified bounded production wave. */
export function assertVercelQualificationExport(meta, {branch, manifest, productionPilot} = {}) {
  if(meta?.qualification?.kind==='cars-cloudflare-native-source-qualification')return assertCloudflareNativeSourceExport(meta,{branch,manifest,productionPilot});
  if (meta.qualification === undefined) {if(productionPilot!==undefined)throw new Error('Production pilot requires its actual provisional source envelope');return;}
  const proof = meta.qualification;
  requireVercelQualificationExport(proof.schemaVersion === 1 && proof.kind === 'cars-vercel-native-source-qualification' &&
    proof.provider === 'vercel' && meta.assetDelivery?.provider === 'vercel' &&
    proof.production === false && proof.nativeApproval === false && proof.hostedApproval === false &&
    proof.globalReleaseApproval === false && proof.sourceCommit === meta.sourceCommit &&
    proof.dealer === manifest?.slug && proof.repository === manifest?.repository &&
    proof.publicOrigin === manifest?.shareIdentity?.publicOrigin, 'provisional source envelope changed');
  if(productionPilot!==undefined){requireVercelQualificationExport(branch==='main','production pilot requires existing MAIN');assertVercelProductionPilot(productionPilot,{meta,manifest});return;}
  requireVercelQualificationExport(/^codex\/[a-z0-9][a-z0-9/-]*$/.test(branch || '') && !branch.includes('..') &&
    branch === proof.targetBranch, 'provisional source package requires its exact reviewed preview branch');
}

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
function remoteHead(root,url,branch,env) {
  const text=git(root,['ls-remote',url,'refs/heads/'+branch],{env});return text ? text.split(/\s/)[0] : null;
}
function treeFiles(root,commit) {
  if (!commit) return new Map();
  const raw=git(root,['ls-tree','-r','-z',commit],{encoding:null}).toString();
  return new Map(raw.split('\0').filter(Boolean).map(line=>{const[info,p]=line.split('\t');return[p,info.split(' ')[2]];}));
}
export function validatePreservePrefixes(prefixes=[]) {
  if (!Array.isArray(prefixes) || prefixes.length > 1 || prefixes.some(prefix=>prefix!=='.github')) throw new Error('Only the explicit .github publication envelope may be preserved.');
  return [...prefixes];
}
const inPreservedPrefix = (name,prefixes) => prefixes.some(prefix=>name===prefix||name.startsWith(prefix+'/'));
export function publicationEnvelope({root,parent,prefixes,packageTree}) {
  const selected=validatePreservePrefixes(prefixes);
  if (!selected.length) return null;
  const candidate=treeFiles(root,packageTree);
  if ([...candidate.keys()].some(name=>inPreservedPrefix(name,selected))) throw new Error('Preserved publication envelope overlaps the verified package.');
  const raw=git(root,['ls-tree','-r','-z',parent],{encoding:null}).toString('utf8');
  const files=raw.split('\0').filter(Boolean).map(line=>{const[info,name]=line.split('\t'),[mode,type,blob]=info.split(' ');return{path:name,mode,type,blob};}).filter(file=>inPreservedPrefix(file.path,selected));
  for(const file of files) if(!['100644','100755'].includes(file.mode)||file.type!=='blob'||!retainedPackagePath(file.path)||file.path.includes('\\')||file.path.includes(':')||file.path.split('/').some(part=>!part||part==='.'||part==='..')) throw new Error('Unsafe preserved publication path: '+file.path);
  const proof=files.map(({path,mode,blob})=>({path,mode,blob})).sort((a,b)=>a.path.localeCompare(b.path));
  return {schemaVersion:1,kind:'exact-remote-publication-envelope',parent,prefixes:selected,packageTree,files:proof,digest:sha256(JSON.stringify(proof))};
}
export function validateReview({review,remoteCommit,candidateDigest,changes}) {
  if (!review || review.remoteCommit!==remoteCommit || review.candidateDigest!==candidateDigest) throw new Error('Mirror reconciliation required: review the exact remote commit and candidate digest.');
  const dispositions = new Map((review.changes||[]).map(c=>[c.path,c]));
  for (const p of changes) {const d=dispositions.get(p);if(!d || !['canonical-source','packaging-layer','obsolete-generated-metadata'].includes(d.resolution) || !d.reason?.trim()) throw new Error('Missing reviewed disposition for '+p);}
}
// Receipts retain only these exact safe process settings, never arbitrary Git configuration.
const RETAINED_GIT_PROCESS_CONFIG = new Map([
  ['core.alternateRefsPrefixes','refs/heads/main'],
  ['maintenance.auto','false'],
  ['gc.auto','0'],
  ['fetch.writeCommitGraph','false'],
]);
function processGitConfigCount() {
  const value=process.env.GIT_CONFIG_COUNT ?? '0';
  if (!/^\d+$/.test(value) || Number(value)>4096) throw new Error('Invalid Git process configuration count.');
  return Number(value);
}
function retainedGitProcessConfig() {
  const selected=new Map();
  for(let index=0;index<processGitConfigCount();index++) {
    const key=process.env['GIT_CONFIG_KEY_'+index];
    if(RETAINED_GIT_PROCESS_CONFIG.has(key)) selected.set(key,process.env['GIT_CONFIG_VALUE_'+index]);
  }
  return Object.fromEntries([...selected].filter(([key,value])=>RETAINED_GIT_PROCESS_CONFIG.get(key)===value));
}
function restoredGitProcessEnvironment(receipt) {
  const alternates=receipt.gitObjectAlternates;
  if(alternates!==undefined&&(typeof alternates!=='string'||!alternates||alternates.length>32768||/[\r\n\0]/.test(alternates)))throw new Error('Invalid retained Git object-store context.');
  const env=alternates?{GIT_ALTERNATE_OBJECT_DIRECTORIES:[alternates,process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES].filter(Boolean).join(path.delimiter)}:{};
  const config=receipt.gitProcessConfig;
  if(config!==undefined) {
    if(!config || typeof config!=='object' || Array.isArray(config) ||
        Object.entries(config).some(([key,value])=>!RETAINED_GIT_PROCESS_CONFIG.has(key)||RETAINED_GIT_PROCESS_CONFIG.get(key)!==value)) {
      throw new Error('Invalid retained Git process configuration.');
    }
    const entries=Object.entries(config),count=processGitConfigCount();
    if(count+entries.length>4096)throw new Error('Invalid Git process configuration count.');
    entries.forEach(([key,value],index)=>{
      env['GIT_CONFIG_KEY_'+(count+index)]=key;
      env['GIT_CONFIG_VALUE_'+(count+index)]=value;
    });
    env.GIT_CONFIG_COUNT=String(count+entries.length);
  }
  return Object.keys(env).length?env:undefined;
}

export function exportDealer({root=ROOT,slug,packageDir,packageTree,reviewFile,write=false,targetBranch,preservePrefixes=[],productionPilot}) {
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
  assertVercelQualificationExport(packageMeta,{branch,manifest:packageManifest,productionPilot});
  const url='https://github.com/'+manifest.repository+'.git';
  const defaultBranch=manifest.defaultBranch||'main';
  const baseHead=remoteHead(root,url,defaultBranch),targetHead=remoteHead(root,url,branch);
  const parent=targetHead||baseHead;
  if(productionPilot!==undefined && (baseHead!==productionPilot.privateMain || targetHead!==productionPilot.privateMain))throw new Error('Production pilot private MAIN lease changed');
  if(!parent)throw new Error('Publishing repository must exist with a reviewed initial commit. Create its private empty initialization once, then retry.');
  git(root,['fetch','--no-tags',url,parent]);
  const area=inside(root,'runtime/dealer-exports/'+slug);fs.mkdirSync(area,{recursive:true});const run=fs.mkdtempSync(path.join(area,'proposal-'));
  const env={GIT_INDEX_FILE:path.join(run,'index')};
  const digest=treePackage ?? verifyPackage(directory),files=digest.files.map(f=>f.path);
  const g=(a,input)=>git(root,[...(directory?['--work-tree',directory]:[]),...a],{env,input});
  if (treePackage) g(['read-tree','--no-sparse-checkout',treePackage.tree]);
  else {g(['read-tree','--empty']);g(['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],files.join('\0')+'\0');}
  const payloadTree=g(['write-tree']);
  if (treePackage && payloadTree!==treePackage.tree) throw new Error('Verified package tree changed while preparing export.');
  const envelope=publicationEnvelope({root,parent,prefixes:preservePrefixes,packageTree:payloadTree});
  if(envelope?.files.length) g(['update-index','-z','--index-info'],envelope.files.map(file=>file.mode+' '+file.blob+'\t'+file.path+'\0').join(''));
  const tree=g(['write-tree']);
  const remote=treeFiles(root,parent),candidate=treeFiles(root,tree);
  // Tree identifiers are accepted by ls-tree, while commit ancestry is checked separately.
  const changes=[...new Set([...remote.keys(),...candidate.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==candidate.get(p)).sort();
  const priorText=git(root,['show',parent+':.cars-publish.json'],{allowFailure:true});
  let unexpected=[];
  if(priorText){const prior=JSON.parse(priorText);if(prior.repository!==manifest.repository)throw new Error('Remote publishing metadata has another repository identity.');const managed=new Map(prior.files.map(f=>[f.path,f.blob]));unexpected=[...new Set([...remote.keys(),...managed.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==managed.get(p)&&!inPreservedPrefix(p,envelope?.prefixes??[]));}
  const report={...(productionPilot?{productionPilot:structuredClone(productionPilot)}:{}),schemaVersion:1,slug,repository:manifest.repository,branch,defaultBranch,baseHead,targetHead,parent,sourceCommit:packageMeta.sourceCommit,candidateDigest:digest.digest,tree,changes,unexpectedRemoteChanges:unexpected,packageDirectory:directory,proposalDirectory:run,...(envelope?{publicationEnvelope:envelope,packagePayloadTree:payloadTree}:{}),...(treePackage?{packageTree:treePackage.tree,packageObject:packageTree,treeVerification:treePackage.io}:{}),...(packageMeta.assetDelivery?.provider === 'cloudflare' ? {provider:'cloudflare'} : {})};
  if(process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES)report.gitObjectAlternates=process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES;
  const gitProcessConfig=retainedGitProcessConfig();
  if(Object.keys(gitProcessConfig).length)report.gitProcessConfig=gitProcessConfig;
  writeJson(path.join(run,'proposal.json'),report);
  if(!write)return report;
  if(!priorText||unexpected.length)validateReview({review:reviewFile?json(reviewFile):null,remoteCommit:parent,candidateDigest:digest.digest,changes:priorText?unexpected:changes});
  const receipt={schemaVersion:1,repository:manifest.repository,sourceCommit:packageMeta.sourceCommit,packagingVersion:packageMeta.packagingVersion||'1',candidateDigest:digest.digest,...(envelope?{publicationEnvelope:envelope}:{}),files:[...candidate].map(([p,blob])=>({path:p,blob})).sort((a,b)=>a.path.localeCompare(b.path))};
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
  const env=restoredGitProcessEnvironment(r);
  assertCarsOwnedDealer(root, r.slug);
  const manifest=validateManifest(json(inside(root,'clients/'+r.slug+'/dealer.json',{mustExist:true})));
  if(manifest.repository!==r.repository)throw new Error('Receipt repository no longer matches canonical identity.');
  if(remoteHead(root,url,r.branch,env)!==r.targetHead || remoteHead(root,url,r.defaultBranch,env)!==r.baseHead)throw new Error('Remote advanced after review. Re-export; never force-push.');
  if(git(root,['rev-parse',r.commit+'^'],{env})!==r.parent)throw new Error('Export does not preserve reviewed remote ancestry.');
  git(root,['push',url,r.commit+':refs/heads/'+r.branch],{env});
  if(remoteHead(root,url,r.branch,env)!==r.commit)throw new Error('Push did not verify.');
  return{repository:r.repository,branch:r.branch,commit:r.commit,trigger:r.provider === 'cloudflare' ? 'Cloudflare source delivered; deploy and verify this exact package separately.' : 'Git-to-Vercel only; inspect the deployment for this exact commit.'};
}
async function main() {
  if(process.argv.includes('--help')){console.log('Usage: node scripts/export-dealer.mjs --client SLUG (--package PATH | --package-tree SHA) [--branch BRANCH] [--preserve-prefix .github] [--review JSON --write]\nnode scripts/export-dealer.mjs --push-receipt runtime/.../export.json\nDry run fetches and compares the actual remote. Write creates a scoped commit; push is explicit and never forced.');return;}
  const o=args(process.argv.slice(2),['client','package','package-tree','branch','review','push-receipt','preserve-prefix'],['write','dry-run']);
  const result=o['push-receipt']?pushExport({receiptFile:o['push-receipt']}):exportDealer({slug:o.client,packageDir:o.package,packageTree:o['package-tree'],reviewFile:o.review,write:!!o.write,targetBranch:o.branch,preservePrefixes:o['preserve-prefix']?[o['preserve-prefix']]:[]});
  console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});

