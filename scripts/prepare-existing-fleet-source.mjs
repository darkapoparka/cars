/** CI source proposal only: one maintained preservation plan, reviewed branding,
 * qualified native seals, then a deduplicated patch for canonical review/publication.
 * Never installs the plan, changes a release lock, commits source or deploys.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {ROOT,git,json,sha256,inside,filesAt,fingerprint} from './lib/workflow.mjs';
import {readRepositoryTreeMap,readPinnedTemplateTree} from './dealer-updates/pinned-template-source.mjs';
import {packageRetainsPath,collectSource} from './package-dealer.mjs';
import {applyLeadBranding,assertLeadBranding,rebindDerivedProfileLogoContracts,captureBrandConsumers} from './publishing/lead-branding.mjs';
import {baseNativeManifest,assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';
import {ADOPTION_FILE,assertNativeQualification,sealNativeQualification,validateNativeQualificationContext,parseCatalogJson} from './lib/native-localization.mjs';
import {sealAppDealerSource} from './lib/app-dealer-adapter.mjs';
import {selectedDealer,existingFleetQualifiedSources,QUALIFICATION_LOCK_PATH} from './build-existing-fleet-cloudflare.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {validateRegisteredSourceRequest,readRegisteredInput,readRegisteredDealerAdoption,assertRegisteredMountOwnership,REGISTERED_ADOPTION_FILE,REGISTERED_PROFILE_FILE,REGISTERED_INPUT_ROOT} from './registered-dealer-adoption.mjs';

export const SOURCE_CAMPAIGN='docs/releases/cloudflare-existing25-20261011';
export const SOURCE_KIND='cars-existing-fleet-source-proposal';
const assert=(v,m)=>{if(!v)throw Error(m);};
const hex40=v=>/^[a-f0-9]{40}$/.test(v??''),hex64=v=>/^[a-f0-9]{64}$/.test(v??'');
const encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const writeNew=(file,bytes)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});};
const safeName=n=>typeof n==='string'&&n&&!n.includes('\\')&&!n.includes('\0')&&!n.startsWith('/')&&!/^[a-z]:/i.test(n)&&n.split('/').every(p=>p&&p!=='.'&&p!=='..');
const markers=new Set(['.client/cloudflare-existing-source.json','.client/native-qualification-context.json',QUALIFICATION_LOCK_PATH,REGISTERED_ADOPTION_FILE,REGISTERED_PROFILE_FILE]);
const managed=n=>safeName(n)&&(packageRetainsPath(n)||markers.has(n));
const factPaths=new Set(['business-facts.json','stock.json','locale.json','FACTS-AND-INVENTORY.json']);
const strictJson=bytes=>parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/^\uFEFF/,''));
export function sourceRequestMode(request){
 const mode=request?.mode===undefined?'existing-migration':request.mode;
 assert(['existing-migration','new-approved','registered-adoption'].includes(mode),'Unsupported source mode; branch/research and independent source require prior canonical adoption');return mode;
}
/** Only the envelope is new. The maintained creator owns the nested request,
 * identity/source validation and source creation; defer its import to avoid a cycle. */
export async function resolveSourceRequest(request,{root=ROOT,leads,registry}={}){
 const mode=sourceRequestMode(request);
 if(mode==='existing-migration'){validateSourceRequest(request,leads,registry);return {mode,dealers:request.dealers};}
 if(mode==='registered-adoption'){
  const inventory=registry??strictJson(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')));validateRegisteredSourceRequest(request,inventory);
  const receipts=request.dealers.map(dealer=>{const r=readRegisteredInput(root,request.inputs[dealer].adoption,dealer);assert(r.value.dealer===dealer&&r.value.kind==='cars-registered-dealer-source-adoption'&&r.value.reviewed===true,'Exact registered adoption receipt required');readRegisteredInput(root,r.value.personalization,dealer);return r.value;});
  return {mode,dealers:request.dealers,receipts};
 }
 assert(request?.schemaVersion===1&&same(Object.keys(request).sort(),['mode','newSourceRequest','schemaVersion']),'Exact new-approved source envelope required');
 const p=request.newSourceRequest;
 assert(p&&same(Object.keys(p).sort(),['path','sha256'])&&safeName(p.path)&&p.path.startsWith(SOURCE_CAMPAIGN+'/new-source/')&&p.path.endsWith('.json')&&hex64(p.sha256),'Exact bounded nested source request pin required');
 const {readNewSourceInput,validateNewSourceRequest}=await import('./prepare-new-dealer-source.mjs');
 const nested=strictJson(readNewSourceInput(root,p).bytes),lockBytes=fs.readFileSync(path.join(root,'templates.lock.json')),registryBytes=fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),indexBytes=fs.readFileSync(path.join(root,'clients/index.json'));
 const inventory=strictJson(registryBytes),index=strictJson(indexBytes),lock=strictJson(lockBytes),occupiedSlugs=git(root,['ls-tree','-z','--name-only','HEAD:clients'],{encoding:null}).toString('utf8').split('\0').filter(Boolean);
 validateNewSourceRequest(nested,{registry:inventory,clientIndex:index,occupiedSlugs,lock,lockSha256:sha256(lockBytes),registrySha256:sha256(registryBytes),clientIndexSha256:sha256(indexBytes)});
 return {mode,dealers:nested.dealers.map(r=>r.slug),requestFile:p.path,nested,lock};
}
export async function sourceMatrix(request,options={}){
 const resolved=await resolveSourceRequest(request,options);
 if(resolved.mode==='existing-migration')return {include:resolved.dealers.map(slug=>({slug}))};
 if(resolved.mode==='registered-adoption'){const matrix={include:resolved.dealers.map(slug=>{
  const receipt=resolved.receipts.find(r=>r.dealer===slug),paths=[...Object.values(request.inputs[slug]).map(p=>p.path),receipt.personalization.path,'clients/index.json','templates.lock.json'];
  assert(paths.every(p=>safeName(p)&&/^[a-zA-Z0-9._/-]+$/.test(p)),'Registered source sparse paths must be exact literals');const sourceInputs=[...new Set(paths)].sort().map(p=>'/'+p).join('\n');assert(Buffer.byteLength(sourceInputs)<=32768,'Registered input matrix exceeds its bound');return {slug,mode:resolved.mode,sourceInputs};
 })};assert(Buffer.byteLength(JSON.stringify(matrix))<=450*1024,'Registered source matrix exceeds the bounded CI output limit');return matrix;}
 const {readNewSourceInput}=await import('./prepare-new-dealer-source.mjs');
 const matrix={include:resolved.nested.dealers.map(row=>{
  const prefix=SOURCE_CAMPAIGN+'/new-source/'+row.slug,branding=strictJson(readNewSourceInput(options.root??ROOT,row.inputs.branding,{prefix}).bytes);
  const inputPaths=[resolved.requestFile,...Object.values(row.inputs).map(p=>p.path),row.identityReview.path,...row.media.map(p=>p.path)];
  for(const p of [branding.master,branding.mark,...Object.values(branding.surfaces??{})].filter(Boolean)){
   assert(safeName(p.path)&&p.path.startsWith(prefix+'/')&&hex64(p.sha256),'Exact bounded creator branding pin required');inputPaths.push(p.path);
  }
  assert(inputPaths.length<=430,'New source sparse input inventory exceeds its bound');
  const evidence=[];for(const key of Object.keys(row.sourceReleases)){
   const qa=resolved.lock.templates[key].qa;if(qa?.evidence){assert(safeName(qa.evidence)&&qa.evidence.startsWith('docs/releases/')&&qa.evidence.endsWith('.json'),'Bounded approved template evidence path required');evidence.push(qa.evidence);}
   const deployment=qa?.nativeLocalization?.deployment;for(const name of ['artifactManifest','singleWorkerReceipt','deploymentReceipt','hostedReceipt'])if(deployment?.[name]){const p=deployment[name];assert(safeName(p.reference)&&p.reference.startsWith('docs/releases/')&&p.reference.endsWith('.json')&&hex64(p.sha256),'Bounded approved native proof pin required');evidence.push(p.reference);}
  }
  const paths=[...new Set(['catalog.json','workspace.json','clients/index.json',...Object.keys(row.sourceReleases).map(k=>'templates/'+k+'/package.json'),...evidence,...inputPaths])].sort();
  assert(paths.every(p=>safeName(p)&&/^[a-zA-Z0-9._/-]+$/.test(p)),'Source sparse paths must be exact literals without pattern metacharacters');const sourceInputs=paths.map(p=>'/'+p).join('\n');
  assert(Buffer.byteLength(sourceInputs)<=32768,'Per-dealer sparse input list exceeds the matrix byte limit');return {slug:row.slug,mode:resolved.mode,sourceInputs};
 })};assert(Buffer.byteLength(JSON.stringify(matrix))<=450*1024,'New source matrix exceeds the bounded CI output limit');return matrix;
}
export function assertNewSourceBootstrap({root=ROOT,env=process.env,readGit=git,checkCi=sourceCiContext}={}){
 const ci=checkCi({root,env,readGit});
 assert(readGit(root,['branch','--show-current'])==='main'&&readGit(root,['rev-parse','--is-shallow-repository'])==='false','New source CI requires actual main and complete historical commit objects');
 const remote=readGit(root,['ls-remote','--exit-code','origin','refs/heads/main']).split(/\s+/)[0];
 assert(remote===ci.commit,'New source event SHA no longer equals synchronized origin main');return ci;
}
export async function prepareFleetSource(options={}){
 const root=options.root??ROOT,request=options.request??strictJson(fs.readFileSync(path.join(root,SOURCE_CAMPAIGN,'source-request.json')));
 if(['existing-migration','registered-adoption'].includes(sourceRequestMode(request)))return prepareExistingFleetSource({...options,request});
 const env=options.env??process.env,ci=assertNewSourceBootstrap({root,env});
 const envelopeBytes=fs.readFileSync(path.join(root,SOURCE_CAMPAIGN,'source-request.json'));
 assert(same(strictJson(envelopeBytes),request)&&gitObjectId('blob',envelopeBytes)===git(root,['rev-parse',ci.commit+':'+SOURCE_CAMPAIGN+'/source-request.json']),'Source dispatch envelope differs from committed event bytes');
 const resolved=await resolveSourceRequest(request,{root});assert(resolved.dealers.includes(options.slug),'Dealer is outside the bounded new source request');
 const {prepareNewDealerSource}=await import('./prepare-new-dealer-source.mjs');
 return prepareNewDealerSource({root,requestFile:resolved.requestFile,dealer:options.slug,write:true,env,toolPackage:options.toolPackage??path.join(root,'runtime/source-preparation-tools/package.json')});
}

export function gitObjectId(type,bytes){return createHash('sha1').update(type+' '+bytes.length+'\0').update(bytes).digest('hex');}
export function gitTreeId(entries){
 const root=new Map();
 for(const row of entries){assert(safeName(row.path)&&['100644','100755'].includes(row.mode)&&hex40(row.blob),'Unsafe Git tree entry');let level=root;const parts=row.path.split('/');
  for(const part of parts.slice(0,-1)){if(!level.has(part))level.set(part,new Map());assert(level.get(part) instanceof Map,'Git file/directory collision');level=level.get(part);}
  assert(!level.has(parts.at(-1)),'Duplicate Git tree entry');level.set(parts.at(-1),row);
 }
 const tree=level=>{const members=[...level].map(([name,value])=>value instanceof Map?{name,mode:'40000',blob:tree(value),sort:name+'/'}:{name,mode:value.mode,blob:value.blob,sort:name});
  members.sort((a,b)=>Buffer.compare(Buffer.from(a.sort),Buffer.from(b.sort)));return gitObjectId('tree',Buffer.concat(members.map(r=>Buffer.concat([Buffer.from(r.mode+' '+r.name+'\0'),Buffer.from(r.blob,'hex')]))));};
 return tree(root);
}
export function sourceBaseline(root,slug,commit){
 assert(hex40(commit)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),'Exact canonical baseline is required');
 const raw=git(root,['ls-tree','-rz',commit+':clients/'+slug],{encoding:null}),entries=raw.toString('utf8').split('\0').filter(Boolean).map(line=>{const at=line.indexOf('\t'),[mode,type,blob]=line.slice(0,at).split(' ');assert(type==='blob','Dealer Git tree contains a link/submodule');return {path:line.slice(at+1),mode,blob};});
 const tree=git(root,['rev-parse',commit+':clients/'+slug]);assert(gitTreeId(entries)===tree,'Raw canonical client Git tree differs');
 const files=readRepositoryTreeMap({repositoryPath:root,revision:commit,prefix:'clients/'+slug,filter:()=>true});
 for(const row of entries)assert(files.has(row.path)&&gitObjectId('blob',files.get(row.path))===row.blob,'Canonical blob bytes differ');
 return {commit,tree,entries,files};
}

export function assertPreparedMountOwnership(manifest,baseline,registeredAdoption){
 if(registeredAdoption)return assertRegisteredMountOwnership(manifest,baseline,registeredAdoption);
 const bytes=baseline.files.get('dealer.json');assert(bytes,'Immutable original dealer manifest is required');
 const original=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')),variants=planSixDesignSelection(original.variants).variants;
 assert(original.slug===manifest.slug&&original.repository===manifest.repository&&same(manifest.variants,variants),'Prepared mounts differ from immutable original dealer ownership');
 return {baseCommit:baseline.commit,baseTree:baseline.tree,manifestSha256:sha256(bytes),variants};
}
export function sourceQualificationFiles({manifest,qualificationBytes,qualificationLockBytes,sourceRevision,candidateSourceDigest,root=ROOT}){
 assert(Buffer.isBuffer(qualificationBytes)&&hex64(candidateSourceDigest),'Exact source qualification input bytes/digest are required');
 const context=validateNativeQualificationContext(JSON.parse(qualificationBytes.toString('utf8')),{dealer:manifest.slug});
 assert(sourceRevision===context.sourceCommit,'Source candidate differs from reviewed qualification context');
 existingFleetQualifiedSources(manifest,context,qualificationLockBytes,{root});
 const marker={schemaVersion:1,dealer:manifest.slug,kind:'personalized-source-candidate-not-an-approved-release',sourceRevision,candidateSourceDigest,qualificationContextPath:'.client/native-qualification-context.json',qualificationContextSha256:sha256(qualificationBytes),qualificationLockPath:QUALIFICATION_LOCK_PATH,qualificationLockSha256:sha256(qualificationLockBytes),sourceDeltaReview:context.sourceDeltaReview,nativeApproval:false,hostedApproval:false};
 return new Map([['.client/native-qualification-context.json',qualificationBytes],[QUALIFICATION_LOCK_PATH,qualificationLockBytes],['.client/cloudflare-existing-source.json',encode(marker)]]);
}

export function createSourcePatch({baseline,candidateFiles,dealer,sourceRevision,contextFileSha256}){
 assert(hex40(baseline.commit)&&hex40(sourceRevision)&&hex64(contextFileSha256)&&gitTreeId(baseline.entries)===baseline.tree,'Exact patch baseline/context is required');
 const original=new Map(baseline.entries.map(r=>[r.path,r])),final=new Map(original),changes=[],blobs=new Map();
 const names=[...new Set([...baseline.files.keys(),...candidateFiles.keys()])].filter(managed).sort();
 for(const name of names){const before=baseline.files.get(name),after=candidateFiles.get(name),entry=original.get(name);
  assert(!entry||gitObjectId('blob',before)===entry.blob,'Patch baseline bytes differ');
  if(before&&after&&before.equals(after))continue;
  assert(!factPaths.has(name),'Source preparation changed authoritative dealer facts: '+name);
  const mode=entry?.mode??'100644',beforeSha256=before?sha256(before):null,afterSha256=after?sha256(after):null;
  if(after){assert(after.length<100*1024**2,'Prepared source member exceeds GitHub file limit');const text=after.toString('utf8'),utf8=!after.includes(0)&&Buffer.from(text).equals(after);
   blobs.set(afterSha256,{schemaVersion:1,sha256:afterSha256,bytes:after.length,encoding:utf8?'utf8':'base64',data:utf8?text:after.toString('base64')});final.set(name,{path:name,mode,blob:gitObjectId('blob',after)});
  }else final.delete(name);
  changes.push({path:name,mode,beforeSha256,afterSha256,beforeBlob:entry?.blob??null,afterBlob:after?gitObjectId('blob',after):null,blob:after?'blobs/'+afterSha256+'.json':null});
 }
 const preparedTree=gitTreeId([...final.values()]),patch={schemaVersion:1,kind:SOURCE_KIND,dealer,canonicalRepository:'darkapoparka/cars',baseCommit:baseline.commit,baseTree:baseline.tree,sourceRevision,contextFileSha256,preparedTree,changes,
  blobCount:blobs.size,changedBytes:changes.reduce((s,r)=>s+(r.afterSha256?blobs.get(r.afterSha256).bytes:0),0),uniqueBlobBytes:[...blobs.values()].reduce((s,r)=>s+r.bytes,0),reviewed:false,published:false,nativeApproval:false,hostedApproval:false};
 return {patch,blobs};
}

export function verifySourcePatch({baseline,patch,blobs}){
 assert(patch?.schemaVersion===1&&patch.kind===SOURCE_KIND&&patch.baseCommit===baseline.commit&&patch.baseTree===baseline.tree&&hex40(patch.preparedTree)&&patch.reviewed===false&&patch.published===false&&patch.nativeApproval===false&&patch.hostedApproval===false,'Source proposal differs from canonical baseline');
 const files=new Map(baseline.files),entries=new Map(baseline.entries.map(r=>[r.path,r])),seen=new Set(),used=new Set();
 for(const change of patch.changes){assert(managed(change.path)&&!seen.has(change.path)&&['100644','100755'].includes(change.mode)&&!factPaths.has(change.path),'Unsafe or duplicate patch member');seen.add(change.path);
  const before=files.get(change.path),entry=entries.get(change.path);assert((before?sha256(before):null)===change.beforeSha256&&(entry?.blob??null)===change.beforeBlob&&(!entry||entry.mode===change.mode),'Patch conflicts with canonical source');
  if(change.afterSha256===null){assert(change.afterBlob===null&&change.blob===null,'Invalid deletion');files.delete(change.path);entries.delete(change.path);continue;}
  const blob=blobs.get(change.afterSha256);assert(hex64(change.afterSha256)&&blob?.schemaVersion===1&&blob.sha256===change.afterSha256&&['utf8','base64'].includes(blob.encoding)&&change.blob==='blobs/'+change.afterSha256+'.json','Missing exact patch blob');
  assert(typeof blob.data==='string'&&Number.isSafeInteger(blob.bytes)&&blob.bytes>=0&&blob.bytes<100*1024**2,'Patch blob bytes are invalid');
  const bytes=Buffer.from(blob.data,blob.encoding==='base64'?'base64':'utf8');assert((blob.encoding!=='base64'||bytes.toString('base64')===blob.data)&&bytes.length===blob.bytes&&sha256(bytes)===blob.sha256&&gitObjectId('blob',bytes)===change.afterBlob,'Patch blob bytes differ');
  files.set(change.path,bytes);entries.set(change.path,{path:change.path,mode:change.mode,blob:change.afterBlob});used.add(change.afterSha256);
 }
 assert(used.size===blobs.size&&patch.blobCount===blobs.size&&gitTreeId([...entries.values()])===patch.preparedTree,'Prepared Git tree or blob inventory differs');return {files,entries:[...entries.values()],tree:patch.preparedTree};
}

export function validateSourceRequest(request,leads,registry){
 assert(sourceRequestMode(request)==='existing-migration','New source requests require their maintained nested request validator');
 assert(request?.schemaVersion===1&&hex40(request.sourceRevision)&&hex64(request.approvedParentLockDigest)&&Array.isArray(request.dealers)&&request.dealers.length>0&&request.dealers.length<=25&&new Set(request.dealers).size===request.dealers.length,'Invalid bounded source request');
 assert(same(Object.keys(request.inputs??{}).sort(),[...request.dealers].sort()),'Exactly one input mapping per requested dealer is required');
 for(const slug of request.dealers){selectedDealer(slug,leads,registry);const record=registry.dealers.find(r=>r.slug===slug);assert(record.sourceOwnership!=='independent-repository'&&(!record.canonicalSourceRepository||record.canonicalSourceRepository==='darkapoparka/cars'),'Independent source preparation is excluded');
  for(const name of ['candidateLock','qualification','sourceDeltaReview','branding']){const row=request.inputs[slug][name];assert(row&&safeName(row.path)&&row.path.startsWith(SOURCE_CAMPAIGN+'/')&&hex64(row.sha256),'Exact bounded source input required: '+name);}
  const resolution=request.inputs[slug].resolutions;if(resolution)assert(safeName(resolution.path)&&resolution.path.startsWith(SOURCE_CAMPAIGN+'/')&&hex64(resolution.sha256),'Exact bounded resolutions required');
 }validateLogoContractResealRequest(request);return request;
}

/** A single reviewed pilot continuation; never an ordinary source refresh. */
export function validateLogoContractResealRequest(request){
 const value=request?.logoContractReseal;if(value===undefined)return null;
 assert(sourceRequestMode(request)==='existing-migration'&&same(request.dealers,['priselci'])&&request.sourceRevision==='b1f0f5609c7c249cfd0649c122849ff2cbb8dfde','Logo reseal requires the exact existing reviewed pilot');
 assert(value&&same(Object.keys(value).sort(),['kind','schemaVersion','sourceReceipt','sourceTree'])&&value.schemaVersion===1&&value.kind==='cars-existing-source-derived-logo-reseal'&&value.sourceTree==='9b5ad1a83b3442a4f1453169517195afb6fe5a4b','Exact original logo reseal tree required');
 const pin=value.sourceReceipt;assert(pin&&same(Object.keys(pin).sort(),['path','sha256'])&&safeName(pin.path)&&pin.path.startsWith(SOURCE_CAMPAIGN+'/pilot-logo-reseal/')&&pin.path.endsWith('.json')&&hex64(pin.sha256),'Hash-pinned original prepared source receipt required');
 return structuredClone(value);
}

const derivedLogoProfiles=['auto-best/src/lib/data/dealer-profile.json','import/src/lib/data/dealer-profile.json','modern/packages/marketplace-domain/testing/dealer-profile.json'];
export function bindLogoResealBrandingProof(branding,profileRows){
 assert(Array.isArray(branding.changes)&&same(profileRows.map(row=>row.path).sort(),[...derivedLogoProfiles].sort()),'Original branding ledger and exact profile transitions required');
 for(const row of profileRows){
  if(Object.hasOwn(branding.facts,row.path)){assert(branding.facts[row.path]===row.beforeSha256,'Original derived factual hash changed');branding.facts[row.path]=row.afterSha256;}
  const changes=branding.changes.filter(change=>change.path===row.path);assert(changes.length<=1,'Duplicate original profile branding transition');
  if(changes.length){assert(changes[0].after===row.beforeSha256,'Original profile branding ledger is stale');changes[0].after=row.afterSha256;}
  else branding.changes.push({path:row.path,before:row.beforeSha256,after:row.afterSha256});
 }
 branding.derivedProfileLogoBindings=profileRows;return branding;
}
export function assertLogoResealPreservation(before,after,profileRows){
 assert(before instanceof Map&&after instanceof Map&&same(profileRows.map(row=>row.path).sort(),[...derivedLogoProfiles].sort()),'Exact three derived logo consumers required');
 const envelopes=new Set(['.cars-branding.json','.cars-app.json',ADOPTION_FILE,'localization/contract.json','.client/cloudflare-existing-source.json']);
 assert(before.size===after.size&&[...before.keys()].every(name=>after.has(name)),'Logo reseal must retain the exact original file inventory');
 for(const [name,bytes]of before){
  if(envelopes.has(name))continue;
  if(!derivedLogoProfiles.includes(name)){assert(bytes.equals(after.get(name)),'Logo reseal changed unrelated source bytes: '+name);continue;}
  const original=strictJson(bytes),restored=strictJson(after.get(name));
  for(const field of ['logo','logoLight','logoDark'])restored.business[field]=original.business[field];
  for(const surface of ['onLight','onDark','onAccent'])for(const field of ['publicPath','sha256','bytes'])restored.logoContract.assets[surface][field]=original.logoContract.assets[surface][field];
  assert(same(restored,original),'Logo reseal changed non-logo profile facts: '+name);
  const row=profileRows.find(row=>row.path===name);assert(row.factualFieldsUnchanged===true&&row.beforeSha256===sha256(bytes)&&row.afterSha256===sha256(after.get(name)),'Exact derived profile transition proof required');
 }
 return {unchangedSourceFiles:[...before.keys()].filter(name=>!envelopes.has(name)&&!derivedLogoProfiles.includes(name)).length,profilePaths:[...derivedLogoProfiles],nonLogoFactsUnchanged:true,rastersAndComponentsByteIdentical:true};
}

/** All mutations stay in a pending map until every maintained seal validates. */
export function resealExistingProfileLogoContracts(input,{manifest,context,root=ROOT}){
 const published=new Map([...input].filter(([name])=>packageRetainsPath(name))),base=baseNativeManifest(manifest),priorNative=assertNativeQualification(published,base,context,{root});assertAppVariant(published,manifest);assertExtendedVariantSources(published,manifest);
 const files=new Map([...published].map(([name,bytes])=>[name,Buffer.from(bytes)])),branding=strictJson(files.get('.cars-branding.json'));
 const profileRows=rebindDerivedProfileLogoContracts(files,branding.publicBase,{originalFiles:published});
 assert(same(profileRows.map(row=>row.path).sort(),[...derivedLogoProfiles].sort()),'All three existing profile logo contracts are required');
 bindLogoResealBrandingProof(branding,profileRows);branding.consumerReferences=captureBrandConsumers(files,branding.publicBase);files.set('.cars-branding.json',encode(branding));
 assertLeadBranding(files,manifest);
 const app=strictJson(files.get('.cars-app.json'));assert(app.provenance?.profile===derivedLogoProfiles[0]&&app.provenance.profileSha256===sha256(input.get(derivedLogoProfiles[0])),'Original App profile provenance changed');
 sealAppDealerSource({files,manifest,provenance:{...app.provenance,profileSha256:sha256(files.get(derivedLogoProfiles[0]))}});
 const native=sealNativeQualification(files,base,priorNative.releases,context,{root});assert(same(native.catalogs,priorNative.catalogs)&&same(native.context,priorNative.context)&&same(native.releases,priorNative.releases),'Logo reseal changed reviewed catalogs, context or source pins');
 assertNativeQualification(files,base,context,{root});assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);assertLeadBranding(files,manifest);
 const pending=new Map([...input,...files]),preservation=assertLogoResealPreservation(input,pending,profileRows);
 return {files:pending,branding,native,profileRows,preservation,previousBrandingSha256:sha256(input.get('.cars-branding.json')),previousNativeSha256:sha256(input.get(ADOPTION_FILE))};
}

async function prepareExistingLogoContractReseal({slug,root,request,ci,baseline,qualified,lock,context,area,source,sourceBefore}){
 const value=validateLogoContractResealRequest(request),prior=pinnedInput(root,value.sourceReceipt).value;
 assert(baseline.tree===value.sourceTree&&prior.kind===SOURCE_KIND&&prior.dealer===slug&&prior.preparedTree===baseline.tree&&prior.sourceRevision===request.sourceRevision&&prior.approvedParentLockDigest===request.approvedParentLockDigest&&same(prior.inputs,request.inputs[slug]),'Original prepared pilot receipt or source bytes differ');
 assert(prior.canonicalSourceUnchanged===true&&prior.authoritativeFactsUnchanged===true&&prior.originalPlanArtifactsUnchanged===true&&prior.nativeApproval===false&&prior.hostedApproval===false&&prior.originalPlan&&hex64(prior.originalPlan.reviewSha256)&&hex64(prior.originalPlan.runSha256)&&hex64(prior.originalPlan.candidateDigest),'Exact original preservation review chain required');
 const factual=prior.factualRefresh;assert(factual?.dealer===slug&&factual.mode==='current-facts-from-pinned-six-targets'&&factual.stage==='preservation-merge-before-native-catalogs-and-branding'&&factual.consumerPaths?.length===588&&factual.consumerHashes?.length===588,'Original 588-consumer factual review required');
 const manifest=strictJson(baseline.files.get('dealer.json'));assert(same(factual.targetSources,manifest.templateSources),'Original factual six-source pins changed');
 const sourceMarker=strictJson(baseline.files.get('.client/cloudflare-existing-source.json'));assert(sourceMarker.sourceRevision===request.sourceRevision&&sourceMarker.candidateSourceDigest===prior.preparedCandidateDigest&&sourceMarker.qualificationContextSha256===sha256(qualified.bytes)&&sourceMarker.qualificationLockSha256===sha256(lock.bytes),'Original personalized-source envelope differs from its prepared receipt');
 const result=resealExistingProfileLogoContracts(baseline.files,{manifest,context,root});
 const candidateSourceDigest=sha256(JSON.stringify([...result.files].filter(([name])=>!markers.has(name)).sort(([a],[b])=>a.localeCompare(b,'en')).map(([name,bytes])=>[name,sha256(bytes)])));
 for(const [name,bytes]of sourceQualificationFiles({manifest,qualificationBytes:qualified.bytes,qualificationLockBytes:lock.bytes,sourceRevision:request.sourceRevision,candidateSourceDigest,root}))result.files.set(name,bytes);
 const preservation=assertLogoResealPreservation(baseline.files,result.files,result.profileRows),proposal=createSourcePatch({baseline,candidateFiles:result.files,dealer:slug,sourceRevision:request.sourceRevision,contextFileSha256:sha256(qualified.bytes)});verifySourcePatch({baseline,...proposal});
 assert(git(root,['rev-parse',ci.commit+':clients/'+slug])===baseline.tree&&fingerprint(source).digest===sourceBefore&&sha256(fs.readFileSync(path.join(root,'templates.lock.json')))===request.approvedParentLockDigest,'Canonical pilot source or approved lock changed');
 const output=path.join(area,'output');writeNew(path.join(output,'source-patch.json'),encode(proposal.patch));for(const [digest,blob]of proposal.blobs)writeNew(path.join(output,'blobs',digest+'.json'),encode(blob));
 const review={schemaVersion:1,kind:'cars-existing-source-derived-logo-reseal-review',dealer:slug,priorSourceReceipt:value.sourceReceipt,canonicalBaseline:{commit:baseline.commit,tree:baseline.tree},preparedTree:proposal.patch.preparedTree,profileRows:result.profileRows,preservation,originalPlan:prior.originalPlan,originalFactualRefresh:factual,catalogsUnchanged:true,appSourceBytesUnchanged:true,sourcePinsUnchanged:true,reviewed:false,nativeApproval:false,hostedApproval:false};
 writeNew(path.join(output,'final-source-review.json'),encode(review));
 const receipt={schemaVersion:1,kind:SOURCE_KIND,dealer:slug,repository:manifest.repository,canonicalSourceRepository:'darkapoparka/cars',canonicalBaseline:review.canonicalBaseline,preparedTree:proposal.patch.preparedTree,sourceRevision:request.sourceRevision,runId:ci.runId,attempt:ci.attempt,inputs:request.inputs[slug],sourceMode:'existing-migration',approvedParentLockDigest:request.approvedParentLockDigest,originalPlan:prior.originalPlan,factualRefresh:prior.factualRefresh,logoContractReseal:{...review,previousBrandingSha256:result.previousBrandingSha256,previousNativeSha256:result.previousNativeSha256},finalSourceReviewSha256:sha256(encode(review)),preparedCandidateDigest:candidateSourceDigest,patchDigest:sha256(encode(proposal.patch)),branding:result.branding,nativeQualification:{contextFileSha256:sha256(qualified.bytes),qualificationLockSha256:sha256(lock.bytes),contextDigest:result.native.contextDigest,receiptSha256:sha256(result.files.get(ADOPTION_FILE)),nativeInput:result.native.input,pendingNativeChecks:result.native.pendingNativeChecks},pathsChanged:proposal.patch.changes.length,uniqueBlobBytes:proposal.patch.uniqueBlobBytes,authoritativeFactsUnchanged:true,canonicalSourceUnchanged:true,originalPlanArtifactsUnchanged:true,reviewed:false,published:false,nativeApproval:false,hostedApproval:false,createdAt:new Date().toISOString()};
 writeNew(path.join(output,'source-preparation-receipt.json'),encode(receipt));artifactInventory(output,{kind:SOURCE_KIND,dealer:slug,status:'passed'});return {dealer:slug,output,preparedTree:receipt.preparedTree,pathsChanged:receipt.pathsChanged,uniqueBlobBytes:receipt.uniqueBlobBytes,reviewed:false,published:false};
}
export function sourceCiContext({root=ROOT,env=process.env,platform=process.platform,version=process.version,readGit=git}={}){
 assert(platform==='linux'&&version==='v26.10.0'&&env.GITHUB_ACTIONS==='true'&&env.GITHUB_EVENT_NAME==='push'&&env.GITHUB_REPOSITORY==='darkapoparka/cars'&&env.GITHUB_REF==='refs/heads/main'&&hex40(env.GITHUB_SHA)&&/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID??'')&&/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT??''),'Source preparation requires exact Cars main push CI');
 assert(readGit(root,['rev-parse','HEAD'])===env.GITHUB_SHA&&readGit(root,['remote','get-url','origin']).replace(/\.git$/,'')==='https://github.com/darkapoparka/cars','Source CI checkout differs');
 assert(!Object.keys(env).some(k=>/^(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|TOKEN)|^WRANGLER_(?:API_TOKEN|TOKEN)$/.test(k)&&env[k]),'No provider credentials may enter source preparation');return {commit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,attempt:env.GITHUB_RUN_ATTEMPT};
}
function pinnedInput(root,row){const file=inside(root,row.path,{mustExist:true}),bytes=fs.readFileSync(file);assert(sha256(bytes)===row.sha256,'Reviewed source input bytes changed: '+row.path);return {file,bytes,value:JSON.parse(bytes.toString('utf8'))};}
export function readBrandingInputs(root,record,slug){
 assert(record?.schemaVersion===1&&record.dealer===slug&&record.reviewed===true&&Number.isFinite(Date.parse(record.reviewedAt))&&record.generation?.tool==='image_gen'&&typeof record.generation.generationId==='string'&&record.generation.generationId.trim(),'Exact reviewed ImageGen branding input required');
 const png=row=>{assert(row&&safeName(row.path)&&hex64(row.sha256)&&(row.path.startsWith(SOURCE_CAMPAIGN+'/')||row.path.startsWith('clients/'+slug+'/branding/')),'Bounded hash-pinned dealer PNG required');const bytes=fs.readFileSync(inside(root,row.path,{mustExist:true}));assert(sha256(bytes)===row.sha256,'Reviewed branding PNG bytes differ');return bytes;};
 assert(same(Object.keys(record.surfaces??{}).sort(),['onAccent','onDark','onLight']),'Exactly three reviewed ImageGen surfaces required');
 const surfaces=Object.fromEntries(Object.entries(record.surfaces).map(([name,row])=>[name,{...row,png:png(row)}]));
 const master={png:png(record.master),sha256:record.master.sha256};if(record.mark){master.markPng=png(record.mark);master.markSha256=record.mark.sha256;}
 const originalSha=record.generation.sourceFileSha256??record.generation.sourceSha256;assert(hex64(originalSha)&&(!record.generation.sourceFileSha256||!record.generation.sourceSha256||record.generation.sourceFileSha256===record.generation.sourceSha256),'Original ImageGen source hash is required and must agree');
 return {master,generation:{...record.generation,sourceFileSha256:originalSha},reviewedSurfaces:{schemaVersion:1,reviewed:true,reviewedAt:record.reviewedAt,surfaces}};
}
export function bindPreparedShareLogo(files,manifest,contract){
 const logo=files.get('branding/logo-on-light.png'),icon=files.get('branding/app-icon.png');
 assert(manifest.shareIdentity&&logo&&icon&&contract.reviewedSurfaceVariants?.surfaces.onLight.sha256===sha256(logo),'Prepared share identity needs the exact reviewed on-light logo and derived icon');
 manifest.shareIdentity={...manifest.shareIdentity,logo:{...(manifest.shareIdentity.logo??{}),sourcePath:'branding/logo-on-light.png',sha256:sha256(logo),faviconSourcePath:'branding/app-icon.png',faviconSha256:sha256(icon)}};
 return manifest.shareIdentity.logo;
}
function candidateFiles(directory){return new Map(filesAt(directory,{filter:()=>true}).map(n=>[n,fs.readFileSync(inside(directory,n,{mustExist:true}))]));}
function writeCandidateChanges(directory,before,after,assetPool,replace){for(const [name,bytes]of after){if(before.get(name)?.equals(bytes))continue;const target=inside(directory,name);fs.mkdirSync(path.dirname(target),{recursive:true});replace(target,bytes,{assetPool,expectedPreviousSha256:before.has(name)?sha256(before.get(name)):null});}}

/** Source CI explicitly opts into current facts; ordinary updater plans stay unchanged. */
export function sourcePreparationPlanArgs({source,root,lockFile,qualificationFile,runDirectory,assetPool,resolutionsFile,registeredAdoptionPin}){
 const args=['plan','--dealer-root',source,'--cars-root',root,'--lock-file',lockFile,'--qualification',qualificationFile,'--run-dir',runDirectory,'--candidate-asset-pool',assetPool,'--design-set','six','--template-palette'];
 if(resolutionsFile)args.push('--resolutions-file',resolutionsFile);
 if(registeredAdoptionPin)args.push('--registered-adoption',registeredAdoptionPin.path,'--registered-adoption-sha256',registeredAdoptionPin.sha256);
 else args.push('--refresh-facts');
 return args;
}

/** Bind the original preservation review to the actual current profile and exact target pins. */
export function assertSourceFactualRefresh({metadata,review,manifest,profile}){
 const proof=metadata?.factualRefresh,keys=['auto-best','modern','import','app','mobile','karento-best'];
 assert(metadata?.selection?.refreshFacts===true&&proof?.schemaVersion===1&&proof.mode==='current-facts-from-pinned-six-targets'&&proof.stage==='preservation-merge-before-native-catalogs-and-branding'&&same(proof,review?.factualRefresh),'Original plan must prove the explicit factual target refresh and its original preparation stage');
 assert(proof.dealer===manifest.slug&&profile.slug===manifest.slug&&proof.profileSha256===sha256(JSON.stringify(profile)),'Factual refresh differs from the current authoritative profile');
 assert(same(Object.keys(proof.targetSources??{}).sort(),[...keys].sort())&&keys.every(key=>same(proof.targetSources[key],manifest.templateSources?.[key])),'Factual refresh differs from the exact six pinned template sources');
 assert(Array.isArray(proof.consumerPaths)&&proof.consumerPaths.length>0&&proof.consumerPaths.length<=4096&&same(proof.consumerPaths,[...new Set(proof.consumerPaths)].sort())&&proof.consumerPaths.every(name=>safeName(name)&&keys.includes(name.split('/')[0])),'Factual refresh requires bounded exact consumer paths');
 assert(Array.isArray(proof.consumerHashes)&&proof.consumerHashes.length===proof.consumerPaths.length&&proof.consumerHashes.every((row,index)=>row?.path===proof.consumerPaths[index]&&hex64(row.sha256)),'Factual refresh requires exact generated consumer byte hashes');
 assert(keys.every(key=>proof.consumerPaths.some(name=>name.startsWith(key+'/'))),'Factual refresh omitted a selected family');
 return structuredClone(proof);
}

export async function prepareExistingFleetSource({slug,root=ROOT,env=process.env,request=json(path.join(root,SOURCE_CAMPAIGN,'source-request.json')),leads=json(path.join(root,SOURCE_CAMPAIGN,'selection.json')).leads,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),
 toolPackage=path.join(root,'runtime/source-preparation-tools/package.json'),checkCi=sourceCiContext}={}){
 const ci=checkCi({root,env}),registered=sourceRequestMode(request)==='registered-adoption';
 if(registered)validateRegisteredSourceRequest(request,registry);else validateSourceRequest(request,leads,registry);
 assert(request.dealers.includes(slug),'Dealer is outside source request');
 assert(git(root,['merge-base','--is-ancestor',request.sourceRevision,ci.commit],{allowFailure:true})!==null,'Requested template source must be published on canonical main');
 assert(sha256(fs.readFileSync(path.join(root,'templates.lock.json')))===request.approvedParentLockDigest,'Approved parent lock changed');
 const input=request.inputs[slug],lock=pinnedInput(root,input.candidateLock),qualified=pinnedInput(root,input.qualification),delta=pinnedInput(root,input.sourceDeltaReview),branding=pinnedInput(root,input.branding),context=qualified.value;
 validateNativeQualificationContext(context,{dealer:slug});assert(context.sourceCommit===request.sourceRevision&&context.approvedLockSha256===request.approvedParentLockDigest&&context.candidateLockSha256===input.candidateLock.sha256&&context.sourceDeltaReview.reference===input.sourceDeltaReview.path&&context.sourceDeltaReview.sha256===input.sourceDeltaReview.sha256,'Source request and qualification context differ');
 const resolutions=input.resolutions?pinnedInput(root,input.resolutions):null,source=inside(root,'clients/'+slug,{mustExist:true});assert(!fs.existsSync(path.join(source,'.git')),'Independent dealer source excluded');
 const baseline=sourceBaseline(root,slug,ci.commit),registeredAdoption=registered?await readRegisteredDealerAdoption({root,pin:input.adoption,dealer:slug,baseline,registry}):null;
 const sourceBefore=fingerprint(source).digest,area=inside(root,'runtime/existing-fleet-source/'+ci.runId+'-'+ci.attempt+'/'+slug);assert(!fs.existsSync(area),'Source preparation attempt already exists');fs.mkdirSync(area,{recursive:true});
 if(request.logoContractReseal!==undefined)return prepareExistingLogoContractReseal({slug,root,request,ci,baseline,qualified,lock,context,area,source,sourceBefore});
 const {runUpdateDealerTemplate,finalizeDealerTemplateCandidate}=await import('./dealer-updates/update-dealer-template.mjs');const {replaceCandidateFile}=await import('./dealer-updates/three-way-upgrade.mjs');
 const runDirectory=path.join(area,'plan'),assetPool=path.join(area,'asset-pool'),args=sourcePreparationPlanArgs({source,root,lockFile:lock.file,qualificationFile:qualified.file,runDirectory,assetPool,resolutionsFile:resolutions?.file,registeredAdoptionPin:registeredAdoption?input.adoption:null});
 const planned=await runUpdateDealerTemplate(args);assert(planned.ready===true&&planned.candidateDirectory,'Unresolved preservation conflicts: review the original plan artifact');
 const originalReview=fs.readFileSync(planned.reviewPath),originalRun=fs.readFileSync(path.join(runDirectory,'run.json')),review=JSON.parse(originalReview),metadata=JSON.parse(originalRun),directory=planned.candidateDirectory,beforeBranding=candidateFiles(directory),files=new Map(beforeBranding),manifest=JSON.parse(files.get('dealer.json'));
 assert(manifest.slug===slug&&manifest.repository===(registeredAdoption?.identity.repository??registry.dealers.find(r=>r.slug===slug).repository),'Prepared dealer identity differs');
 const factualRefresh=registeredAdoption?null:assertSourceFactualRefresh({metadata,review,manifest,profile:loadDealerProfile(source,slug)});
 // Retain previous branding proof as baseline evidence; the new pack gets its own seal.
 const previousBrandingDigest=files.has('.cars-branding.json')?sha256(files.get('.cars-branding.json')):null;files.delete('.cars-branding.json');manifest.branding={...(manifest.branding??{}),required:true,surfaceBindingsVersion:1};
 const require=createRequire(toolPackage),sharp=require('sharp');assert(sharp.versions.sharp==='0.35.5','Source raster toolchain differs');
 const templates=new Map(),readTemplate=(locator,name,optional)=>{const key=locator.path.slice('templates/'.length),id=key+'@'+locator.revision;if(!templates.has(id))templates.set(id,readPinnedTemplateTree({key,repositoryPath:root,source:locator}).tree);const bytes=templates.get(id).get(name);if(!bytes&&optional)return null;assert(bytes,'Missing exact palette source '+key+'/'+name);return bytes.toString('utf8');};
 const brandContract=await applyLeadBranding(files,manifest,{...readBrandingInputs(root,branding.value,slug),sharp,readTemplate});bindPreparedShareLogo(files,manifest,brandContract);files.set('dealer.json',encode(manifest));writeCandidateChanges(directory,beforeBranding,files,assetPool,replaceCandidateFile);
 const finalPlan={...review,pins:planned.pins,manifest,candidate:files},finalized=await finalizeDealerTemplateCandidate({plan:finalPlan,candidateDirectory:directory,dealerRoot:source,lock:lock.value,carsRoot:root,qualification:context,candidateAssetPool:assetPool,refreshedAt:new Date().toISOString(),templatePalette:false,registeredAdoption});
 if(factualRefresh)assert(same(finalized.review.factualRefresh,factualRefresh),'Final source review lost the original factual refresh proof');
 const sealedFiles=await collectSource(directory,manifest),native=assertNativeQualification(sealedFiles,baseNativeManifest(manifest),context,{root});assertLeadBranding(sealedFiles,manifest);assertAppVariant(sealedFiles,manifest);assertExtendedVariantSources(sealedFiles,manifest);
 const mountOwnership=assertPreparedMountOwnership(manifest,baseline,registeredAdoption),qualificationFiles=sourceQualificationFiles({manifest,qualificationBytes:qualified.bytes,qualificationLockBytes:lock.bytes,sourceRevision:request.sourceRevision,candidateSourceDigest:fingerprint(directory).digest,root});
 for(const [name,bytes]of qualificationFiles){const file=path.join(directory,name);if(fs.existsSync(file))replaceCandidateFile(file,bytes,{assetPool,expectedPreviousSha256:sha256(fs.readFileSync(file))});else writeNew(file,bytes);}
 assert(sha256(fs.readFileSync(planned.reviewPath))===sha256(originalReview)&&sha256(fs.readFileSync(path.join(runDirectory,'run.json')))===sha256(originalRun),'Original updater review/run changed after source postprocessing');
 assert(fingerprint(source).digest===sourceBefore&&sha256(fs.readFileSync(path.join(root,'templates.lock.json')))===request.approvedParentLockDigest,'Canonical dealer source or approved lock changed');
 const proposal=createSourcePatch({baseline,candidateFiles:candidateFiles(directory),dealer:slug,sourceRevision:request.sourceRevision,contextFileSha256:sha256(qualified.bytes)});verifySourcePatch({baseline,...proposal});
 const output=path.join(area,'output');writeNew(path.join(output,'source-patch.json'),encode(proposal.patch));for(const [digest,blob]of proposal.blobs)writeNew(path.join(output,'blobs',digest+'.json'),encode(blob));
 writeNew(path.join(output,'original-updater-review.json'),originalReview);writeNew(path.join(output,'final-source-review.json'),encode(finalized.review));
 const receipt={schemaVersion:1,kind:SOURCE_KIND,dealer:slug,repository:manifest.repository,canonicalSourceRepository:'darkapoparka/cars',canonicalBaseline:{commit:baseline.commit,tree:baseline.tree},preparedTree:proposal.patch.preparedTree,sourceRevision:request.sourceRevision,runId:ci.runId,attempt:ci.attempt,
   inputs:input,sourceMode:registered?'registered-adoption':'existing-migration',factualRefresh,registeredAdoption:registeredAdoption?{receiptSha256:registeredAdoption.receiptSha256,personalizationSha256:registeredAdoption.personalizationSha256,baseline:registeredAdoption.baseline}:null,approvedParentLockDigest:request.approvedParentLockDigest,originalPlan:{reviewSha256:sha256(originalReview),runSha256:sha256(originalRun),candidateDigest:metadata.candidateDigest},mountOwnership,finalSourceReviewSha256:sha256(encode(finalized.review)),preparedCandidateDigest:fingerprint(directory).digest,patchDigest:sha256(encode(proposal.patch)),previousBrandingDigest,branding:brandContract,nativeQualification:{contextFileSha256:sha256(qualified.bytes),qualificationLockSha256:sha256(lock.bytes),contextDigest:native.contextDigest,receiptSha256:sha256(sealedFiles.get(ADOPTION_FILE)),nativeInput:native.input,pendingNativeChecks:native.pendingNativeChecks},
  pathsChanged:proposal.patch.changes.length,uniqueBlobBytes:proposal.patch.uniqueBlobBytes,authoritativeFactsUnchanged:true,canonicalSourceUnchanged:true,originalPlanArtifactsUnchanged:true,reviewed:false,published:false,nativeApproval:false,hostedApproval:false,privatePublishingMirror:{repository:manifest.repository,state:'not-published-by-source-preparation'},createdAt:new Date().toISOString()};
 writeNew(path.join(output,'source-preparation-receipt.json'),encode(receipt));artifactInventory(output,{kind:SOURCE_KIND,dealer:slug,status:'passed'});return {dealer:slug,output,preparedTree:receipt.preparedTree,pathsChanged:receipt.pathsChanged,uniqueBlobBytes:receipt.uniqueBlobBytes,reviewed:false,published:false};
}
// Finish module evaluation before dynamic creator imports: that creator imports
// the source proposal helpers from this module as its maintained shared seam.
async function runSourceCli(){const [command,slug]=process.argv.slice(2);if(command==='matrix'){const request=strictJson(fs.readFileSync(path.join(ROOT,SOURCE_CAMPAIGN,'source-request.json')));console.log('matrix='+JSON.stringify(await sourceMatrix(request,{root:ROOT,leads:json(path.join(ROOT,SOURCE_CAMPAIGN,'selection.json')).leads,registry:json(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'))})));}else{assert(command==='prepare'&&slug&&process.argv.length===4,'Use matrix | prepare SLUG (main source CI only)');console.log(JSON.stringify(await prepareFleetSource({slug}),null,2));}}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)runSourceCli().catch(error=>{console.error(error.message);process.exitCode=1;});
