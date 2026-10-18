/** Reviewed new-dealer source orchestration. Reuses the maintained creator and
 * adapters; never publishes, installs dependencies, changes Git refs or deploys. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {validateNewSourceRaster} from './lib/source-input-raster.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,POLICY,git,json,sha256,inside,filesAt,gitFiles,resolveIdentity} from './lib/workflow.mjs';
import {assertMainCheckout,planNewClient,createNewClient,readNewClientQualification} from './new-client.mjs';
import {normalizeDealerLocale} from './lib/dealer-locale.mjs';
import {parseCatalogJson,assertNativeAdoption,assertNativeQualification,validateTemplateQualification,ADOPTION_FILE} from './lib/native-localization.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {applyRefreshAdapter} from './lib/client-refresh-adapters.mjs';
import {retainDealerVariantAssets,applyExtendedRefreshAdapter,sealExtendedVariant} from './lib/client-refresh-six.mjs';
import {prepareAppDealer,sealAppDealerSource} from './lib/app-dealer-adapter.mjs';
import {baseNativeManifest,assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';
import {adoptNativeSource,adoptNativeQualification} from './publishing/native-mounts.mjs';
import {applyLeadBranding,assertLeadBranding} from './publishing/lead-branding.mjs';
import {resolveShareIdentity,publicOrigin} from './publishing/dealer-share.mjs';
import {collectSource,packageRetainsPath} from './package-dealer.mjs';
import {regenerateDealerCatalogs} from './dealer-updates/update-dealer-template.mjs';
import {readPinnedTemplateTree} from './dealer-updates/pinned-template-source.mjs';
import {SOURCE_CAMPAIGN,readBrandingInputs,bindPreparedShareLogo,gitObjectId,gitTreeId,sourceQualificationFiles} from './prepare-existing-fleet-source.mjs';
import {QUALIFICATION_LOCK_PATH} from './build-existing-fleet-cloudflare.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';

export const NEW_SOURCE_KIND='cars-new-dealer-source-proposal';
export const NEW_SOURCE_REQUEST_KIND='cars-new-dealer-source-request';
export const NEW_SOURCE_INPUT_ROOT=SOURCE_CAMPAIGN+'/new-source';
export const NEW_SOURCE_FAMILIES=Object.freeze(['auto-best','modern','import','app','mobile','karento-best']);
const assert=(v,m)=>{if(!v)throw Error(m);};
const hex40=v=>/^[a-f0-9]{40}$/.test(v??''),hex64=v=>/^[a-f0-9]{64}$/.test(v??'');
const slug=v=>typeof v==='string'&&v.length<=64&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const safe=v=>typeof v==='string'&&!/[\\:\u0000-\u001f\u007f]/.test(v)&&!v.startsWith('/')&&v.split('/').every(p=>p&&p!=='.'&&p!=='..');
const encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const date=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
const norm=v=>String(v??'').toLowerCase().replace(/[^a-z0-9]/g,'');
const keys=(v,allowed,label)=>assert(v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k)),'Unknown or invalid '+label+' field');
const http=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
const readJson=bytes=>parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/^\uFEFF/,''));
const inputPin=(row,prefix)=>assert(row&&same(Object.keys(row).sort(),['path','sha256'])&&safe(row.path)&&row.path.startsWith(prefix+'/')&&hex64(row.sha256),'Bounded exact input pin required');
const sourceEqual=(a,b)=>['repository','revision','path','tree','digest'].every(k=>a?.[k]===b?.[k]);
function assertSixSources(sources){assert(same(Object.keys(sources??{}).sort(),[...NEW_SOURCE_FAMILIES].sort()),'All six exact source locators required');for(const key of NEW_SOURCE_FAMILIES){const s=sources[key];assert(s&&same(Object.keys(s).sort(),['digest','path','repository','revision','tree'])&&s.repository==='darkapoparka/cars'&&s.path==='templates/'+key&&hex40(s.revision)&&hex40(s.tree)&&hex64(s.digest),'Exact Cars template locator required: '+key);}}
const creatorMetadata=n=>NEW_SOURCE_FAMILIES.some(k=>n===k+'/AGENTS.md'||n===k+'/.template/source-manifest.json');
const qualificationMarkers=new Set(['.client/cloudflare-existing-source.json','.client/native-qualification-context.json',QUALIFICATION_LOCK_PATH]);
const proposalRetains=n=>packageRetainsPath(n)||creatorMetadata(n)||qualificationMarkers.has(n);
export {validateNewSourceRaster} from './lib/source-input-raster.mjs';

/** A physical regular file, including every ancestor. No links into runtime or
 * another dealer may satisfy a committed input path. */
function physicalInput(root,name,maxBytes){
 assert(safe(name),'Unsafe source input path');const base=fs.realpathSync(root),file=inside(base,name,{mustExist:true});let current=base;
 for(const component of name.split('/')){current=path.join(current,component);assert(!fs.lstatSync(current).isSymbolicLink(),'Source input contains a physical link');assert(fs.realpathSync(current)===current,'Source input contains a physical alias');}
 const stat=fs.lstatSync(file);assert(stat.isFile()&&stat.size>0&&stat.size<=maxBytes,'Source input is not a bounded regular file');
 const bytes=fs.readFileSync(file);assert(bytes.length===stat.size,'Source input size changed during reading');return {file,bytes};
}
export function readNewSourceInput(root,row,{maxBytes=2*1024**2,prefix=NEW_SOURCE_INPUT_ROOT}={}){
 inputPin(row,prefix);const input=physicalInput(root,row.path,maxBytes);assert(sha256(input.bytes)===row.sha256,'Source input bytes differ from the reviewed pin');return input;
}

export function readNewSourceQualification(root,request,dealer){
 if(request.qualification===undefined)return null;
 const q=request.qualification;keys(q,['candidateLock','contexts'],'new source qualification');inputPin(q.candidateLock,NEW_SOURCE_INPUT_ROOT);
 assert(q.contexts&&same(Object.keys(q.contexts).sort(),request.dealers.map(r=>r.slug).sort()),'Exactly one qualification context pin per new dealer required');
 inputPin(q.contexts[dealer],NEW_SOURCE_INPUT_ROOT+'/'+dealer);
 return readNewClientQualification(root,{candidateLock:q.candidateLock,qualification:q.contexts[dealer]},dealer);
}

export function validateNewSourceRequest(request,{registry,clientIndex,occupiedSlugs=[],lock,lockSha256,registrySha256,clientIndexSha256,root=ROOT}){
 keys(request,['schemaVersion','kind','mode','reviewed','reviewedAt','sourceRevision','approvedLockSha256','registrySha256','clientIndexSha256','dealers','qualification'],'new source request');
 assert(request.schemaVersion===1&&request.kind===NEW_SOURCE_REQUEST_KIND&&request.mode==='new-approved'&&request.reviewed===true&&date(request.reviewedAt)&&hex40(request.sourceRevision),'Explicit reviewed new-approved source request required');
 assert(hex64(request.approvedLockSha256)&&request.approvedLockSha256===lockSha256&&request.registrySha256===registrySha256&&request.clientIndexSha256===clientIndexSha256&&hex64(registrySha256)&&hex64(clientIndexSha256),'Reviewed lock/registry/client index bytes changed');
 assert(lock?.schemaVersion===1&&lock.exportPolicy===POLICY&&Array.isArray(registry?.dealers)&&Array.isArray(clientIndex?.projects),'Canonical lock and identity inventories required');
 assert(Array.isArray(request.dealers)&&request.dealers.length>0&&request.dealers.length<=25,'One to 25 distinct new dealers required');
 const identities=[...registry.dealers,...clientIndex.projects,...(clientIndex.campaignCandidatesWithoutFolders??[]),...occupiedSlugs.map(s=>({slug:s}))];
 const seen={slug:new Set(),dealerId:new Set(),repository:new Set(),workerName:new Set()};
 for(const row of request.dealers){
  keys(row,['slug','dealerId','repository','sourceOwnership','preset','workerName','publicOrigin','identityReview','sourceReleases','inputs','media','copyReview'],'new dealer');
  assert(slug(row.slug)&&typeof row.dealerId==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(row.dealerId)&&/^darkapoparka\/[a-z0-9][a-z0-9.-]{0,99}$/.test(row.repository??'')&&row.repository!=='darkapoparka/cars'&&row.sourceOwnership==='cars-canonical'&&['standard','import'].includes(row.preset),'Only absent Cars-owned canonical dealer identities are supported');
  assert(slug(row.workerName)&&row.publicOrigin==='https://'+row.workerName+'.darkapoparka1.workers.dev'&&publicOrigin(row.publicOrigin)===row.publicOrigin,'Exact proposed Worker/public origin required');
  for(const field of Object.keys(seen)){const value=field==='repository'?row[field].toLowerCase():norm(row[field]);assert(value&&!seen[field].has(value),'Duplicate new dealer '+field);seen[field].add(value);}
  const existing=identities.some(d=>[d.slug,...(d.aliases??[])].some(v=>norm(v)===norm(row.slug))||[d.id,d.dealerId,d.researchId,d.leadId].some(v=>v&&norm(v)===norm(row.dealerId))||d.repository?.toLowerCase()===row.repository.toLowerCase());
  assert(!existing&&!Object.keys(registry.aliases??{}).some(a=>norm(a)===norm(row.slug)),'Existing, branch, research or independent identity requires its own source mode');
  const prefix=NEW_SOURCE_INPUT_ROOT+'/'+row.slug;inputPin(row.identityReview,prefix);if(row.copyReview)inputPin(row.copyReview,prefix);
  assert(same(Object.keys(row.inputs??{}).sort(),['branding','facts','locale','stock']),'Exact facts/stock/locale/branding pins required');for(const pin of Object.values(row.inputs))inputPin(pin,prefix);
  assert(same(Object.keys(row.sourceReleases??{}).sort(),[...NEW_SOURCE_FAMILIES].sort()),'All six exact approved template sources required');
  const qualified=readNewSourceQualification(root,request,row.slug),selectedLock=qualified?.lock??lock;
  for(const key of NEW_SOURCE_FAMILIES){const selected=row.sourceReleases[key],release=selectedLock.templates?.[key];
   if(qualified){assert(qualified.context.sourceCommit===request.sourceRevision,'Qualification source revision differs from the request');validateTemplateQualification(key,release,qualified.context,{root});}
   assert(release?.status===(qualified?'qualification':'approved')&&release.exportPolicy===POLICY&&selected?.repository==='darkapoparka/cars'&&selected.path==='templates/'+key&&hex40(selected.revision)&&hex40(selected.tree)&&hex64(selected.digest)&&same(Object.keys(selected).sort(),['digest','path','repository','revision','tree']),'Latest reviewed approved Cars source required: '+key);
   assert(release.repository===selected.repository&&release.commit===selected.revision&&release.snapshotPath===selected.path&&release.digest===selected.digest&&sourceEqual(release.source,selected),'Requested source differs from the approved lock: '+key);
  }
  assert(Array.isArray(row.media)&&row.media.length>0&&row.media.length<=400,'Bounded pinned local stock media required');const destinations=new Set(),paths=new Set();let total=0;
  for(const image of row.media){keys(image,['path','sha256','bytes','destination'],'media');inputPin({path:image.path,sha256:image.sha256},prefix);
   assert(/^dealer-stock\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|webp|jpe?g)$/.test(image.destination??'')&&Number.isSafeInteger(image.bytes)&&image.bytes>0&&image.bytes<=25*1024**2&&!destinations.has(image.destination)&&!paths.has(image.path),'Duplicate, invalid or oversized stock media');destinations.add(image.destination);paths.add(image.path);total+=image.bytes;
  }assert(total<=256*1024**2,'Stock media exceeds the per-dealer 256 MiB source budget');
 }
 return request;
}

export function validateNewSourceCopyReview(review,dealer,stock){
 keys(review,['schemaVersion','kind','dealer','reviewed','reviewedAt','stockSha256','descriptions'],'new source display copy');
 assert(review.schemaVersion===1&&review.kind==='cars-new-source-reviewed-companion-copy'&&review.dealer===dealer.slug&&review.reviewed===true&&date(review.reviewedAt)&&review.stockSha256===dealer.inputs.stock.sha256,'Reviewed copy must bind the exact dealer stock input');
 assert(Array.isArray(review.descriptions)&&review.descriptions.length===stock.records.length&&review.descriptions.length>0,'Complete exact source description rows required');
 for(let i=0;i<stock.records.length;i++){const source=stock.records[i],row=review.descriptions[i];keys(row,['sourceId','sourceDescription','en','bg'],'display description');assert(row.sourceId===source.id&&row.sourceDescription===source.description&&['en','bg'].every(locale=>typeof row[locale]==='string'&&row[locale].trim()&&row[locale].length<=10000),'Reviewed description source or display copy differs');}
 return review;
}
export function newSourceReviewedCopy(profile,review){
 if(!review)return undefined;
 assert(profile.listings.length===review.descriptions.length,'Normalized listing count differs from reviewed copy');
 const out={};for(let i=0;i<profile.listings.length;i++){const listing=profile.listings[i],copy=review.descriptions[i];assert(listing.sourceId===copy.sourceId&&listing.description===copy.sourceDescription&&!Object.hasOwn(out,listing.slug),'Normalized description or listing identity changed');out[listing.slug]={sourceDescription:copy.sourceDescription,en:{description:copy.en,imageAlts:listing.images.map(()=>listing.title)},bg:{description:copy.bg,imageAlts:listing.images.map(()=>listing.title)}};}
 return out;
}

export function validateNewDealerFacts({dealer,facts,stock,locale,identityReview}){
 assert(identityReview?.schemaVersion===1&&identityReview.kind==='cars-new-dealer-identity-review'&&identityReview.reviewed===true&&date(identityReview.reviewedAt)&&identityReview.existingIdentityFound===false&&identityReview.sourceOwnership==='cars-canonical'&&identityReview.dealer===dealer.slug&&identityReview.dealerId===dealer.dealerId&&identityReview.repository===dealer.repository&&Array.isArray(identityReview.sources)&&identityReview.sources.length>0&&identityReview.sources.every(s=>http(s.url)&&date(s.observedAt)),'Explicit reviewed absence/ownership research required');
 assert(facts?.schemaVersion===1&&facts.slug===dealer.slug&&facts.dealerId===dealer.dealerId&&!Object.hasOwn(facts,'vehicles'),'Exact dealer facts required; stock must have one authoritative boundary');
 const business=facts.business;assert(business&&typeof business.name==='string'&&business.name.trim().length>0&&business.name.length<=180&&typeof business.city==='string'&&business.city.trim()&&typeof business.address==='string'&&business.address.trim()&&http(business.sourceUrl)&&date(business.observedAt),'Sourced dated business name/location required');
 assert(typeof business.inventoryNotice==='string'&&business.inventoryNotice.trim()&&typeof business.previewNotice==='string'&&business.previewNotice.trim()&&business.inventoryNotice.length<=500&&business.previewNotice.length<=500,'Explicit truthful inventory/preview disclosures required');
 assert(business.logo==='/dealer-brand/logo-on-light.png'&&business.logoLight==='/dealer-brand/logo-on-light.png'&&business.logoDark==='/dealer-brand/logo-on-dark.png','Facts must bind the exact reviewed raster surface aliases');
 const localization=normalizeDealerLocale(locale,dealer.dealerId);assert(localization.enabledLocales.length===2&&business.countryCode===localization.dealerCountry&&business.currency===localization.inventoryCurrency&&['km','mi'].includes(business.distanceUnit)&&typeof business.locale==='string'&&business.locale.startsWith(localization.defaultLocale+'-'),'Facts and explicit en/bg country/currency/locale differ');
 assert(stock?.schemaVersion===1&&stock.dealer===dealer.slug&&['dated-listing-snapshot','illustrative-not-dealer-stock'].includes(stock.kind)&&Array.isArray(stock.records)&&stock.records.length>0&&stock.records.length<=200,'Explicit dated or disclosed illustrative stock records required');
 const allowed=new Set(dealer.media.map(r=>'/'+r.destination)),used=new Set(),ids=new Set();
 for(const car of stock.records){assert(car&&typeof car.id==='string'&&car.id.trim()&&!ids.has(car.id)&&typeof car.title==='string'&&car.title.trim()&&typeof car.make==='string'&&car.make.trim()&&typeof car.model==='string'&&car.model.trim()&&Number.isInteger(car.year)&&car.year>=1900&&car.year<=2100&&car.currency===localization.inventoryCurrency,'Explicit stable vehicle identity, year and source currency required');ids.add(car.id);
  assert(!['production','date','priceEur','priceUsd','priceCurrency','amount','rawPriceText','sourcePrice','distanceUnit','thumbnail','photo','href','source','capturedAt','km'].some(k=>Object.hasOwn(car,k)),'Ambiguous alternate stock facts cannot override the reviewed canonical fields');
  assert(Array.isArray(car.images)&&car.images.length>0&&car.images.length<=20&&car.images.every(p=>allowed.has(p))&&!['image','gallery','photos'].some(k=>Object.hasOwn(car,k)),'Stock images must resolve exactly to the reviewed local media');for(const p of car.images)used.add(p);
  assert(date(car.observedAt)&&http(car.sourceUrl)&&typeof car.availability==='string'&&car.availability.trim(),'Vehicle source/date and truthful availability required');
  assert((car.priceOnRequest===true&&(car.price===undefined||car.price===null)&&(car.priceAmount===undefined||car.priceAmount===null))||(car.priceOnRequest!==true&&Number.isFinite(car.priceAmount)&&car.priceAmount>0&&car.price===undefined),'Explicit positive source price or price-on-request required');
  assert((car.mileageOnRequest===true&&car.mileage===undefined&&car.mileageValue===undefined&&car.mileageKm===undefined&&car.mileageMiles===undefined)||(car.mileageOnRequest!==true&&Number.isFinite(car.mileageValue)&&car.mileageValue>=0&&['km','mi'].includes(car.mileageUnit)&&!['mileage','mileageKm','mileageMiles','km'].some(k=>Object.hasOwn(car,k))),'Explicit source mileage/unit or unknown mileage required');
 }
 assert(used.size===allowed.size,'Every staged media asset must have a reviewed stock consumer');
 if(stock.kind==='illustrative-not-dealer-stock')assert(stock.dealerStock===false&&typeof stock.disclosure==='string'&&stock.disclosure.trim()&&business.inventoryNotice.includes(stock.disclosure),'Illustrative stock must explicitly disclose that it is not dealer stock');
 return {localization,inventoryKind:stock.kind,records:stock.records.length};
}

export function assertNewSourceCiContext({env,checkout,platform=process.platform}){
 assert(hex40(checkout?.head)&&hex40(checkout.remoteHead)&&(checkout.head===checkout.remoteHead||(env.GITHUB_ACTIONS==='true'&&checkout.eventCommit===checkout.head)),'Actual synchronized main or verified immutable event checkout is required');
 if(env.GITHUB_ACTIONS!=='true')return {commit:checkout.head,runId:'local-'+Date.now(),attempt:'1'};
 assert(platform==='linux'&&env.GITHUB_EVENT_NAME==='push'&&env.GITHUB_REPOSITORY==='darkapoparka/cars'&&env.GITHUB_REF==='refs/heads/main'&&hex40(env.GITHUB_SHA)&&checkout.head===env.GITHUB_SHA&&/^[1-9][0-9]{0,14}$/.test(env.GITHUB_RUN_ID??'')&&/^[1-9][0-9]{0,5}$/.test(env.GITHUB_RUN_ATTEMPT??''),'Source CI needs real canonical main at the unchanged event SHA');
 assert(!Object.entries(env).some(([key,value])=>value&&/^(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|TOKEN)$|^WRANGLER_(?:API_TOKEN|TOKEN)$/.test(key)),'Provider credentials cannot enter source preparation');
 return {commit:checkout.head,runId:env.GITHUB_RUN_ID,attempt:env.GITHUB_RUN_ATTEMPT};
}

export function validateNewSourceBranchAbsence({dealer,mainCommit,branches}){
 assert(slug(dealer)&&hex40(mainCommit)&&Array.isArray(branches)&&branches.length>0&&branches.length<=256,'Bounded authoritative Cars branch inventory required');const refs=new Set();let folders=0;
 for(const row of branches){assert(typeof row.ref==='string'&&/^refs\/heads\/[^\s\u0000-\u001f:]+$/.test(row.ref)&&hex40(row.commit)&&!refs.has(row.ref)&&Array.isArray(row.clients)&&row.clients.length<=4096,'Invalid or duplicate origin branch proof');refs.add(row.ref);folders+=row.clients.length;assert(row.clients.every(s=>typeof s==='string'&&safe(s)&&!s.includes('/'))&&row.clients.every(s=>norm(s)!==norm(dealer)),'Existing preserved branch dealer requires its own source mode');}
 assert(folders<=32768&&branches.some(r=>r.ref==='refs/heads/main'&&r.commit===mainCommit),'Current main branch lease differs');
 const absence='normalized-dealer-folder-absent-on-current-origin-branches';
 return {digest:sha256(JSON.stringify([...branches].sort((a,b)=>a.ref.localeCompare(b.ref)))),branches:branches.length,absence,leaseDigest:sha256(JSON.stringify({dealer:norm(dealer),mainCommit,absence}))};
}
function originBranchAbsence(root,dealer,eventCommit){
 const metadataEnv={GIT_NO_LAZY_FETCH:'1'},heads=git(root,['ls-remote','--heads','origin']).split('\n').filter(Boolean);assert(heads.length>0&&heads.length<=256,'Origin branch inventory exceeds bounded source review');
 const refs=new Set(),advertised=heads.map(line=>{const [commit,ref,...extra]=line.split(/\s+/);assert(!extra.length&&hex40(commit)&&typeof ref==='string'&&/^refs\/heads\/[^\s\u0000-\u001f:]+$/.test(ref)&&!refs.has(ref),'Exact unique origin branch head required');refs.add(ref);return {commit,ref};});
 const mainCommit=advertised.find(r=>r.ref==='refs/heads/main')?.commit;assert(hex40(mainCommit),'Current main branch lease differs');
 const metadataPresent=commit=>{
  if(git(root,['cat-file','-e',commit+'^{commit}'],{env:metadataEnv,allowFailure:true})===null)return false;
  const entry=git(root,['ls-tree',commit,'--','clients'],{env:metadataEnv,allowFailure:true});
  if(entry===null)return false;if(!entry)return true;
  assert(/^040000 tree [a-f0-9]{40}\tclients$/.test(entry),'Unreviewed branch clients source type');
  return git(root,['cat-file','-e',entry.split(/\s+/)[2]+'^{tree}'],{env:metadataEnv,allowFailure:true})!==null;
 };
 const missing=[...new Set(advertised.filter(r=>!metadataPresent(r.commit)).map(r=>r.commit))];
 if(missing.length){
  // Hydrate the exact advertised snapshot without updating branch refs, FETCH_HEAD,
  // the index or the worktree. blob:none retains only commit/tree metadata.
  git(root,['fetch','--no-tags','--no-auto-maintenance','--no-write-fetch-head','--no-recurse-submodules','--refmap=','--filter=blob:none','--refetch','origin',...missing],{env:metadataEnv});
 }
 assert(git(root,['merge-base',eventCommit,mainCommit])===eventCommit,'Immutable source event is no longer published on current main');
 const branches=advertised.map(({commit,ref})=>{assert(metadataPresent(commit),'Origin branch metadata hydration failed: '+ref+' '+commit);
  const clientEntry=git(root,['ls-tree',commit,'--','clients'],{env:metadataEnv}),clients=[];if(clientEntry){assert(/^040000 tree [a-f0-9]{40}\tclients$/.test(clientEntry),'Unreviewed branch clients source type');const names=git(root,['ls-tree','-z',commit+':clients'],{env:metadataEnv,encoding:null}).toString('utf8').split('\0').filter(Boolean);for(const row of names){const at=row.indexOf('\t'),name=row.slice(at+1),type=row.slice(0,at).split(' ')[1];assert(at>0&&['blob','tree','commit'].includes(type),'Invalid branch source entry');if(type!=='blob')clients.push(name);}}
  return {ref,commit,clients};});return {...validateNewSourceBranchAbsence({dealer,mainCommit,branches}),mainCommit,eventCommit};
}


/** Current identity checks are row-scoped. Unrelated admissions may change the
 * registry/index blobs; a collision with this dealer still fails closed. */
export function assertCurrentNewSourceIdentity(row, registry, clientIndex) {
 assert(row&&slug(row.slug)&&Array.isArray(registry?.dealers)&&Array.isArray(clientIndex?.projects),'Current identity inventories are required');
 const identities=[...registry.dealers,...clientIndex.projects,...(clientIndex.campaignCandidatesWithoutFolders??[])];
 const conflict=identities.some(d=>[d.slug,...(d.aliases??[])].some(v=>norm(v)===norm(row.slug))||
  [d.id,d.dealerId,d.researchId,d.leadId].some(v=>v&&norm(v)===norm(row.dealerId))||
  d.repository?.toLowerCase()===row.repository.toLowerCase()||
  [d.workerName,d.cloudflare?.workerName,d.cloudflare?.workerPrefix,d.hostingIdentity?.cloudflare?.workerName].some(v=>v&&v===row.workerName)||
  [d.publicOrigin,d.cloudflare?.publicOrigin,d.delivery?.url,d.delivery?.configuredPublicOrigin,d.hostingIdentity?.cloudflare?.publicOrigin].some(v=>v&&v.replace(/\/$/,'')===row.publicOrigin));
 assert(!conflict&&!Object.keys(registry.aliases??{}).some(a=>norm(a)===norm(row.slug)),'Current dealer identity/Worker collision requires its own source mode');
 return {dealer:row.slug,absence:'current-registry-and-index-identity-absent'};
}
/** Original request and facts stay bound to the event. Only the selected row's
 * committed inputs are compared with current main, never the whole main tree. */
export function newSourceCurrentLeasePaths(request, requestFile, row, brandingRows, qualified) {
 const paths=[requestFile,'templates.lock.json','catalog.json','workspace.json',
  ...Object.values(row.inputs).map(p=>p.path),row.identityReview.path,...(row.copyReview?[row.copyReview.path]:[]),
  ...row.media.map(p=>p.path),...brandingRows.map(p=>p.path)];
 if(request.qualification)paths.push(request.qualification.candidateLock.path,request.qualification.contexts[row.slug].path,qualified.context.sourceDeltaReview.reference);
 assert(paths.length<=450&&paths.every(safe),'Bounded current source input lease required');return [...new Set(paths)].sort();
}
export function assertCurrentNewSourceInputs({root,eventCommit,mainCommit,row,paths,readGit=git}) {
 assert(hex40(eventCommit)&&hex40(mainCommit)&&Array.isArray(paths)&&paths.length>0&&paths.length<=450&&paths.every(safe),'Exact immutable/current input lease required');
 const proof=[];
 for(const name of paths){const before=readGit(root,['rev-parse',eventCommit+':'+name]),current=readGit(root,['rev-parse',mainCommit+':'+name]);
  assert(hex40(before)&&before===current,'Current reviewed source input changed: '+name);proof.push([name,before]);}
 const load=(name,max)=>{const bytes=readGit(root,['cat-file','blob',mainCommit+':'+name],{encoding:null});assert(Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=max,'Bounded current identity bytes required');return {bytes,value:readJson(bytes)};};
 const registry=load('docs/DEPLOYMENT-INVENTORY.json',32*1024**2),index=load('clients/index.json',4*1024**2);
 const identity=assertCurrentNewSourceIdentity(row,registry.value,index.value);
 return {eventCommit,mainCommit,paths:proof.length,inputDigest:sha256(JSON.stringify(proof)),registrySha256:sha256(registry.bytes),clientIndexSha256:sha256(index.bytes),...identity};
}

/** Addition-only Git proposal: reuse immutable canonical blobs; retain each new
 * byte sequence once. Modes are inherited from the pinned Git source on Windows. */
export function createNewSourceProposal({dealer,baseCommit,baseRootTree,sourceReleases,files,modes=new Map(),reusableBlobs=new Map()}){
 assertSixSources(sourceReleases);
 assert(slug(dealer)&&hex40(baseCommit)&&hex40(baseRootTree)&&files instanceof Map&&files.size>0&&files.size<=100000,'Exact absent-dealer proposal baseline required');
 const entries=[],blobs=new Map(),reuse=new Map(),folded=new Set();
 for(const [name,value]of [...files].sort(([a],[b])=>a<b?-1:a>b?1:0)){assert(safe(name)&&Buffer.isBuffer(value)&&value.length<100*1024**2&&proposalRetains(name),'Unsafe or unretained new source file');assert(!folded.has(name.toLowerCase()),'Case-aliased source paths are forbidden');folded.add(name.toLowerCase());
  const mode=modes.get(name)??'100644';assert(['100644','100755'].includes(mode),'Source executable mode must be preserved');const blob=gitObjectId('blob',value),digest=sha256(value),existing=reusableBlobs.get(blob);
  const entry={path:name,mode,blob,sha256:digest,bytes:value.length};
  if(existing){assert(existing.repository==='darkapoparka/cars'&&hex40(existing.revision)&&safe(existing.path)&&existing.blob===blob&&existing.sha256===digest&&existing.bytes===value.length,'Canonical reusable Git blob bytes required');const sourceKey=existing.path.split('/')[1],pin=sourceReleases[sourceKey];assert(pin&&pin.revision===existing.revision&&existing.path.startsWith(pin.path+'/'),'Reusable blob is outside the approved six template sources');reuse.set(blob,{...existing});entry.storage={kind:'canonical-git-blob',blob};}
  else{const text=value.toString('utf8'),utf8=Buffer.from(text).equals(value);if(!blobs.has(digest))blobs.set(digest,{sha256:digest,blob,bytes:value.length,encoding:utf8?'utf8':'base64',content:utf8?text:value.toString('base64')});entry.storage={kind:'new-content',sha256:digest};}entries.push(entry);
 }
 const patch={schemaVersion:1,kind:NEW_SOURCE_KIND,mode:'new-approved',dealer,canonicalSourceRepository:'darkapoparka/cars',baseCommit,baseRootTree,absentPath:'clients/'+dealer,sourceReleases,preparedTree:gitTreeId(entries),entries,reusedGitBlobs:[...reuse.values()].sort((a,b)=>a.blob.localeCompare(b.blob)),uniqueBlobBytes:[...blobs.values()].reduce((n,b)=>n+b.bytes,0),reviewed:false,published:false,hostedApproval:false};
 verifyNewSourceProposal({patch,blobs,reusableBlobs});return {patch,blobs};
}
export function verifyNewSourceProposal({patch,blobs,reusableBlobs}){
 assertSixSources(patch?.sourceReleases);
 assert(patch?.schemaVersion===1&&patch.kind===NEW_SOURCE_KIND&&patch.mode==='new-approved'&&patch.canonicalSourceRepository==='darkapoparka/cars'&&slug(patch.dealer)&&patch.absentPath==='clients/'+patch.dealer&&hex40(patch.baseCommit)&&hex40(patch.baseRootTree)&&patch.reviewed===false&&patch.published===false&&patch.hostedApproval===false,'New source proposal cannot imply publication or approval');
 assert(blobs instanceof Map&&reusableBlobs instanceof Map&&Array.isArray(patch.entries)&&patch.entries.length>0&&Array.isArray(patch.reusedGitBlobs)&&same(Object.keys(patch.sourceReleases??{}).sort(),[...NEW_SOURCE_FAMILIES].sort()),'Complete proposal content/reference inventories required');
 const reused=new Map();for(const row of patch.reusedGitBlobs){const original=reusableBlobs.get(row.blob),pin=patch.sourceReleases[row.path?.split('/')[1]];assert(original&&pin&&row.repository==='darkapoparka/cars'&&row.repository===original.repository&&row.revision===original.revision&&row.path===original.path&&row.revision===pin.revision&&row.path.startsWith(pin.path+'/')&&row.sha256===original.sha256&&row.bytes===original.bytes&&hex64(row.sha256)&&Number.isSafeInteger(row.bytes)&&row.bytes>=0&&!reused.has(row.blob),'Reused canonical blob reference changed');reused.set(row.blob,row);}
 const used=new Set(),usedReuse=new Set(),folded=new Set();for(const row of patch.entries){assert(safe(row.path)&&proposalRetains(row.path)&&!folded.has(row.path.toLowerCase())&&['100644','100755'].includes(row.mode)&&hex40(row.blob)&&hex64(row.sha256)&&Number.isSafeInteger(row.bytes)&&row.bytes>=0&&row.bytes<100*1024**2,'Invalid new source entry/mode');folded.add(row.path.toLowerCase());
  if(row.storage?.kind==='canonical-git-blob'){const reuse=reused.get(row.storage.blob);assert(reuse&&row.storage.blob===row.blob&&reuse.sha256===row.sha256&&reuse.bytes===row.bytes,'Reused blob payload differs');usedReuse.add(row.blob);}
  else{assert(row.storage?.kind==='new-content'&&row.storage.sha256===row.sha256,'Unknown source storage');const blob=blobs.get(row.sha256);assert(blob&&['utf8','base64'].includes(blob.encoding)&&typeof blob.content==='string','Missing new source content');const bytes=Buffer.from(blob.content,blob.encoding==='utf8'?'utf8':'base64');assert((blob.encoding!=='base64'||bytes.toString('base64')===blob.content)&&bytes.length===row.bytes&&blob.bytes===row.bytes&&blob.sha256===row.sha256&&sha256(bytes)===row.sha256&&blob.blob===row.blob&&gitObjectId('blob',bytes)===row.blob,'New source bytes changed');used.add(row.sha256);}
 }
 const paths=new Set(patch.entries.map(r=>r.path));assert(['dealer.json','AGENTS.md','CLIENT.md','business-facts.json','stock.json','locale.json','localization/contract.json',ADOPTION_FILE,'.cars-branding.json','.cars-app.json','.cars-mobile.json','.cars-signature.json',...NEW_SOURCE_FAMILIES.flatMap(k=>[k+'/package.json',k+'/AGENTS.md',k+'/.template/source-manifest.json',k+'/.client/project.json'])].every(n=>paths.has(n)),'Six application source packages, maintained creator lineage and ordinary factual/branding/native seals must be retained');
 assert(used.size===blobs.size&&usedReuse.size===reused.size&&patch.uniqueBlobBytes===[...blobs.values()].reduce((n,b)=>n+b.bytes,0)&&patch.preparedTree===gitTreeId(patch.entries),'Source proposal inventory/tree differs');return patch;
}

function committed(root,name,bytes,head){assert(gitObjectId('blob',bytes)===git(root,['rev-parse',head+':'+name]),'Source input must be exact committed main bytes: '+name);}
const orchestrationPaths=['scripts/prepare-new-dealer-source.mjs','scripts/prepare-existing-fleet-source.mjs','scripts/lib/client-refresh-normalize.mjs','scripts/lib/client-refresh-adapters.mjs','scripts/lib/client-refresh-six.mjs','scripts/lib/app-dealer-adapter.mjs','scripts/publishing/native-mounts.mjs','scripts/publishing/lead-branding.mjs','scripts/publishing/logo-surface-bindings.mjs','scripts/publishing/dealer-share.mjs','scripts/dealer-updates/update-dealer-template.mjs','scripts/dealer-updates/pinned-template-source.mjs','scripts/package-dealer.mjs'];
function fileMap(directory){return new Map(filesAt(directory,{filter:n=>proposalRetains(n)||NEW_SOURCE_FAMILIES.some(k=>n===k+'/.template')}).map(n=>[n,fs.readFileSync(inside(directory,n,{mustExist:true}))]));}
function writeMap(directory,files,before=new Map()){for(const [name,bytes]of files){assert(safe(name),'Unsafe source output path');if(before.get(name)?.equals(bytes))continue;const file=inside(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}}
function writeNew(file,bytes){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});}

/** Production has no injected Git/platform/copier. CI must establish actual main
 * before invoking this API; this function never creates or switches a branch. */
export async function prepareNewDealerSource({root=ROOT,requestFile,dealer:requestedDealer,write=false,env=process.env,toolPackage=path.join(root,'runtime/source-preparation-tools/package.json')}={}){
 assert(typeof write==='boolean'&&slug(requestedDealer),'Explicit dealer and boolean write mode required');root=fs.realpathSync(root);
 assert(typeof requestFile==='string'&&safe(requestFile)&&requestFile.startsWith(NEW_SOURCE_INPUT_ROOT+'/')&&requestFile.endsWith('.json'),'Bounded committed new source request path required');
 const requestInput=physicalInput(root,requestFile,2*1024**2),request=readJson(requestInput.bytes);
 const rawLock=physicalInput(root,'templates.lock.json',4*1024**2).bytes,rawRegistry=physicalInput(root,'docs/DEPLOYMENT-INVENTORY.json',32*1024**2).bytes,rawIndex=physicalInput(root,'clients/index.json',4*1024**2).bytes,lock=readJson(rawLock),registry=readJson(rawRegistry),clientIndex=readJson(rawIndex);
 const occupiedSlugs=fs.readdirSync(inside(root,'clients',{mustExist:true}));validateNewSourceRequest(request,{registry,clientIndex,occupiedSlugs,lock,lockSha256:sha256(rawLock),registrySha256:sha256(rawRegistry),clientIndexSha256:sha256(rawIndex),root});
 const row=request.dealers.find(r=>r.slug===requestedDealer);assert(row,'Dealer is outside the exact reviewed request');
 const qualified=readNewSourceQualification(root,request,row.slug),selectedLock=qualified?.lock??lock,sourceQualification=qualified?{candidateLock:request.qualification.candidateLock,qualification:request.qualification.contexts[row.slug]}:null;assert(!resolveIdentity(root,row.slug,row.dealerId).exists,'Dealer identity is already occupied');
 const inputs=Object.fromEntries(Object.entries({...row.inputs,identityReview:row.identityReview,...(row.copyReview?{copyReview:row.copyReview}: {})}).map(([k,p])=>{const input=readNewSourceInput(root,p,{prefix:NEW_SOURCE_INPUT_ROOT+'/'+row.slug,maxBytes:k==='locale'?16384:2*1024**2});return [k,{...input,value:readJson(input.bytes)}];}));
 validateNewDealerFacts({dealer:row,facts:inputs.facts.value,stock:inputs.stock.value,locale:inputs.locale.value,identityReview:inputs.identityReview.value});
 const copyReview=inputs.copyReview?validateNewSourceCopyReview(inputs.copyReview.value,row,inputs.stock.value):null;
 const media=row.media.map(p=>{const input=readNewSourceInput(root,{path:p.path,sha256:p.sha256},{prefix:NEW_SOURCE_INPUT_ROOT+'/'+row.slug,maxBytes:25*1024**2});assert(input.bytes.length===p.bytes,'Media byte count differs');validateNewSourceRaster(input.bytes,p.destination);return {...p,...input};});
 const brandingRecord=inputs.branding.value,brandingRows=[brandingRecord.master,brandingRecord.mark,...Object.values(brandingRecord.surfaces??{})].filter(Boolean),brandingBytes=new Map();
 for(const p of brandingRows){const input=readNewSourceInput(root,{path:p.path,sha256:p.sha256},{prefix:NEW_SOURCE_INPUT_ROOT+'/'+row.slug,maxBytes:25*1024**2});assert(input.bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a','Reviewed logo must contain PNG bytes');brandingBytes.set(p.path,input.bytes);}
 const branding=readBrandingInputs(root,brandingRecord,row.slug),checkout=assertMainCheckout(root,{eventCommit:env.GITHUB_ACTIONS==='true'?env.GITHUB_SHA:null,env}),ci=assertNewSourceCiContext({env,checkout});
 const branchAbsence=originBranchAbsence(root,row.slug,checkout.head);
 const leasePaths=newSourceCurrentLeasePaths(request,requestFile,row,brandingRows,qualified);
 const currentInputLease=assertCurrentNewSourceInputs({root,eventCommit:checkout.head,mainCommit:branchAbsence.mainCommit,row,paths:leasePaths});
 assert(!git(root,['diff','--name-only','HEAD','--',...orchestrationPaths]),'Commit reviewed source orchestration inputs before dealer creation');
 assert(git(root,['merge-base','--is-ancestor',request.sourceRevision,checkout.head],{allowFailure:true})!==null,'Reviewed source revision must be published on canonical main');
 for(const [name,bytes]of [[requestFile,requestInput.bytes],['templates.lock.json',rawLock],['docs/DEPLOYMENT-INVENTORY.json',rawRegistry],['clients/index.json',rawIndex],...Object.entries({...row.inputs,identityReview:row.identityReview,...(row.copyReview?{copyReview:row.copyReview}: {})}).map(([k,p])=>[p.path,inputs[k].bytes]),...media.map(p=>[p.path,p.bytes]),...brandingBytes])committed(root,name,bytes,checkout.head);
 const plan=planNewClient({root,client:row.slug,dealerId:row.dealerId,repository:row.repository,preset:row.preset,designSet:'six',localeConfig:inputs.locale.value,eventCommit:checkout.eventCommit??null,...(sourceQualification?{sourceQualification}: {})});assert(plan.checkout.head===checkout.head&&NEW_SOURCE_FAMILIES.every(k=>sourceEqual(plan.manifest.templateSources[k],row.sourceReleases[k])),'Maintained creator source/checkout differs from reviewed request');
 const baseline={commit:checkout.head,rootTree:git(root,['rev-parse',checkout.head+'^{tree}'])};assert(!git(root,['ls-tree',checkout.head,'--','clients/'+row.slug]),'Canonical dealer source already exists at the publication baseline');
 const readOnly={schemaVersion:1,kind:NEW_SOURCE_KIND,mode:'new-approved',dealer:row.slug,repository:row.repository,canonicalSourceRepository:'darkapoparka/cars',baseCommit:baseline.commit,sourceRevision:request.sourceRevision,approvedLockSha256:request.approvedLockSha256,sourceReleases:row.sourceReleases,branchAbsence,currentInputLease,applications:6,write:false,published:false,hostedApproval:false,state:'reviewed-inputs-awaiting-source-creation',...(sourceQualification?{sourceQualification,qualificationOnly:true,nativeApproval:false,globalReleaseApproval:false}: {}),newerDevelopment:plan.plans.filter(p=>p.updateAvailable).map(p=>({key:p.template,developmentHead:p.developmentHead,developmentTree:p.developmentTree}))};
 if(!write)return readOnly;
 assert(path.resolve(toolPackage)===inside(root,'runtime/source-preparation-tools/package.json',{mustExist:true}),'Use the bounded maintained source raster toolchain');
 const area=inside(root,'runtime/new-dealer-source/'+ci.runId+'-'+ci.attempt+'/'+row.slug);assert(!fs.existsSync(area),'Source proposal attempt already exists; inspect retained output before retrying');
 const sourceRows=plan.plans.flatMap(p=>gitFiles(root,p.sourceRef.revision,{prefix:p.sourceRef.path}).map(f=>({...f,path:p.template+'/'+f.path,sourcePath:p.sourceRef.path+'/'+f.path,revision:p.sourceRef.revision}))),sourceBytes=plan.plans.reduce((n,p)=>n+Number(git(root,['ls-tree','-rl',p.sourceRef.revision+':'+p.sourceRef.path]).split('\n').filter(Boolean).reduce((sum,line)=>sum+Number(line.split('\t')[0].trim().split(/\s+/).at(-1)),0)),0),disk=fs.statfsSync(root),free=disk.bavail*disk.bsize;
 assert(Number.isSafeInteger(sourceBytes)&&sourceBytes>0&&free>sourceBytes*2+media.reduce((n,p)=>n+p.bytes.length*8,0)+1024**3,'Insufficient disk for one maintained source owner; no client created');
 const sharp=createRequire(toolPackage)('sharp');assert(sharp.versions.sharp==='0.35.5','Reviewed source raster toolchain differs');
 for(const bytes of [...media.map(p=>p.bytes),...brandingBytes.values()]){const meta=await sharp(bytes,{limitInputPixels:64*1024**2}).metadata();assert(Number.isSafeInteger(meta.width)&&Number.isSafeInteger(meta.height)&&meta.width>0&&meta.height>0&&meta.width<=16384&&meta.height<=16384,'Invalid or oversized source raster dimensions');}
 fs.mkdirSync(area,{recursive:true});let creation;
 try{
  creation=await createNewClient(plan);const directory=creation.clientRoot;
  const stage=[['business-facts.json',inputs.facts.bytes],['stock.json',inputs.stock.bytes],['locale.json',inputs.locale.bytes],...media.map(p=>[p.destination,p.bytes]),['dealer-brand/logo-on-light.png',branding.reviewedSurfaces.surfaces.onLight.png],['dealer-brand/logo-on-dark.png',branding.reviewedSurfaces.surfaces.onDark.png]];
  for(const [name,bytes]of stage)writeNew(inside(directory,name),bytes);
  const manifest=json(path.join(directory,'dealer.json'));manifest.extraAssets=['dealer-stock','dealer-brand','branding','assets'];manifest.cloudflare={workerPrefix:row.workerName};manifest.shareIdentity={name:inputs.facts.value.business.name,publicOrigin:row.publicOrigin,description:[inputs.facts.value.business.previewNotice,inputs.facts.value.business.inventoryNotice].join(' '),logo:{sourcePath:'dealer-brand/logo-on-light.png',sha256:sha256(branding.reviewedSurfaces.surfaces.onLight.png)}};
  fs.writeFileSync(path.join(directory,'dealer.json'),encode(manifest));const profile=loadDealerProfile(directory,row.slug);assert(profile.sourceCount===profile.listings.length&&profile.listings.length===inputs.stock.value.records.length&&profile.stockKind===inputs.stock.value.kind,'Maintained normalization dropped/changed authoritative stock');
  const reviewedCopy=newSourceReviewedCopy(profile,copyReview);
  const changes={};for(const {key}of manifest.variants.slice(0,3)){const assets=new Map();retainDealerVariantAssets(assets,key,profile,directory);writeMap(directory,assets);const candidate=inside(directory,key,{mustExist:true});changes[key]=applyRefreshAdapter({key,oldVariant:candidate,candidate,profile,...(['modern','import'].includes(key)&&reviewedCopy?{reviewedModernCopy:reviewedCopy}: {})});}
  let files=await collectSource(directory,{...manifest,extraAssets:manifest.extraAssets.filter(p=>!['branding','assets'].includes(p))}),before=new Map(files);const app=await prepareAppDealer(directory,manifest,{appFiles:new Map([...files].filter(([n])=>n.startsWith('app/')).map(([n,b])=>[n.slice(4),b]))});for(const [name,bytes]of app.files)files.set('app/'+name,bytes);
  const adaptations={};for(const key of ['mobile','karento-best'])adaptations[key]=applyExtendedRefreshAdapter({files,key,profile,client:directory});writeMap(directory,files,before);
  for(const {key}of manifest.variants){const name=path.join(directory,key,'.client/project.json'),metadata=json(name);fs.writeFileSync(name,encode({...metadata,state:'personalized-needs-build',readyToPublish:false,publicUrl:null,hosting:{provider:'cloudflare',status:'not-deployed'},qa:{desktop:false,mobile:false,identity:false,contactPath:false}}));}
  await regenerateDealerCatalogs(directory,root,manifest.variants.map(v=>v.key));files=await collectSource(directory,{...manifest,extraAssets:manifest.extraAssets.filter(p=>!['branding','assets'].includes(p))});before=new Map(files);
  const templates=new Map(),readTemplate=(locator,name,optional)=>{const key=locator.path.slice('templates/'.length),id=key+'@'+locator.revision;if(!templates.has(id))templates.set(id,readPinnedTemplateTree({key,repositoryPath:root,source:locator}).tree);const bytes=templates.get(id).get(name);if(!bytes&&optional)return null;assert(bytes,'Missing approved template palette input');return bytes.toString('utf8');};
  const brand=await applyLeadBranding(files,manifest,{...branding,sharp,readTemplate});bindPreparedShareLogo(files,manifest,brand);resolveShareIdentity(files,manifest);
  files=qualified?adoptNativeQualification(files,baseNativeManifest(manifest),selectedLock.templates,qualified.context,{root}):adoptNativeSource(files,baseNativeManifest(manifest),lock.templates,{root});sealAppDealerSource({files,manifest,provenance:app.provenance});for(const key of ['mobile','karento-best'])sealExtendedVariant({files,key,manifest,profile,adaptation:adaptations[key]});
  if(qualified)assertNativeQualification(files,baseNativeManifest(manifest),qualified.context,{root});else assertNativeAdoption(files,baseNativeManifest(manifest),{root});assertLeadBranding(files,manifest);assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);files.set('dealer.json',encode(manifest));
  if(qualified){const candidateSourceDigest=sha256(JSON.stringify([...files].filter(([name])=>!qualificationMarkers.has(name)).sort(([a],[b])=>a.localeCompare(b,'en')).map(([name,bytes])=>[name,sha256(bytes)])));for(const [name,bytes]of sourceQualificationFiles({manifest,qualificationBytes:qualified.qualificationBytes,qualificationLockBytes:qualified.candidateLockBytes,sourceRevision:request.sourceRevision,candidateSourceDigest,root}))files.set(name,bytes);}
  writeMap(directory,files,before);
  for(const [name,bytes]of stage.slice(0,3))assert(fs.readFileSync(path.join(directory,name)).equals(bytes),'Authoritative source facts changed during personalization');
  const stable=assertMainCheckout(root,{eventCommit:checkout.eventCommit??null,env});if(qualified){const current=readNewSourceQualification(root,request,row.slug);assert(current.candidateLockBytes.equals(qualified.candidateLockBytes)&&current.qualificationBytes.equals(qualified.qualificationBytes),'Qualification input changed during source creation');}assert(stable.head===baseline.commit&&sha256(fs.readFileSync(path.join(root,'templates.lock.json')))===request.approvedLockSha256,'Canonical main or approved lock changed; preserve candidate and review again');
  const finalBranchAbsence=originBranchAbsence(root,row.slug,stable.head);
  const finalInputLease=assertCurrentNewSourceInputs({root,eventCommit:stable.head,mainCommit:finalBranchAbsence.mainCommit,row,paths:leasePaths});
  assert(finalInputLease.inputDigest===currentInputLease.inputDigest,'Reviewed row input lease changed; preserve candidate');
  for(const [k,p]of Object.entries({...row.inputs,identityReview:row.identityReview,...(row.copyReview?{copyReview:row.copyReview}: {})}))assert(readNewSourceInput(root,p,{prefix:NEW_SOURCE_INPUT_ROOT+'/'+row.slug,maxBytes:k==='locale'?16384:2*1024**2}).bytes.equals(inputs[k].bytes),'Reviewed input changed during source creation');
  for(const p of [...media,...brandingRows])readNewSourceInput(root,{path:p.path,sha256:p.sha256},{prefix:NEW_SOURCE_INPUT_ROOT+'/'+row.slug,maxBytes:25*1024**2});
  const canonical=fileMap(directory),modes=new Map(sourceRows.map(r=>[r.path,r.mode]));for(const name of canonical.keys())if(!modes.has(name))modes.set(name,process.platform!=='win32'&&(fs.statSync(path.join(directory,name)).mode&0o111)?'100755':'100644');
  const originalBlobs=new Map(sourceRows.map(r=>[r.blob,r])),reusable=new Map();for(const bytes of canonical.values()){const blob=gitObjectId('blob',bytes),r=originalBlobs.get(blob);if(r&&!reusable.has(blob))reusable.set(blob,{repository:'darkapoparka/cars',revision:r.revision,path:r.sourcePath,blob,sha256:sha256(bytes),bytes:bytes.length});}const proposal=createNewSourceProposal({dealer:row.slug,baseCommit:baseline.commit,baseRootTree:baseline.rootTree,sourceReleases:row.sourceReleases,files:canonical,modes,reusableBlobs:reusable});
  const output=path.join(area,'output');writeNew(path.join(output,'source-patch.json'),encode(proposal.patch));for(const [digest,blob]of proposal.blobs)writeNew(path.join(output,'blobs',digest+'.json'),encode(blob));
  const receipt={...readOnly,finalBranchAbsence,finalInputLease,write:true,state:'personalized-source-proposal-needs-build-and-hosted-review',baseRootTree:baseline.rootTree,preparedTree:proposal.patch.preparedTree,request:{path:requestFile,sha256:sha256(requestInput.bytes)},inputs:row.inputs,identityReview:row.identityReview,creationReceiptSha256:sha256(fs.readFileSync(creation.receipt)),sourcePaths:proposal.patch.entries.length,reusedGitBlobs:proposal.patch.reusedGitBlobs.length,uniqueBlobBytes:proposal.patch.uniqueBlobBytes,patchSha256:sha256(encode(proposal.patch)),branding:brand,nativeAdoptionSha256:sha256(files.get(ADOPTION_FILE)),...(qualified?{nativeQualification:{contextFileSha256:sha256(qualified.qualificationBytes),qualificationLockSha256:sha256(qualified.candidateLockBytes),receiptSha256:sha256(files.get(ADOPTION_FILE)),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false}}: {}),personalizationChanges:changes,authoritativeFactsUnchanged:true,reviewed:false,published:false,buildApproval:false,hostedApproval:false,privatePublishingMirror:{repository:row.repository,state:'not-published-by-source-preparation'},createdAt:new Date().toISOString()};writeNew(path.join(output,'source-preparation-receipt.json'),encode(receipt));artifactInventory(output,{kind:NEW_SOURCE_KIND,dealer:row.slug,status:'passed'});return {dealer:row.slug,output,preparedTree:receipt.preparedTree,sourcePaths:receipt.sourcePaths,uniqueBlobBytes:receipt.uniqueBlobBytes,published:false,hostedApproval:false};
 }catch(error){writeNew(path.join(area,'failure.json'),encode({kind:NEW_SOURCE_KIND,dealer:row.slug,error:error.message,canonicalCandidate:creation?.clientRoot??null,retained:true,published:false,hostedApproval:false,failedAt:new Date().toISOString()}));throw error;}
}

if(isEntrypoint(import.meta.url)){
 try{const argv=process.argv.slice(2);if(same(argv,['--help']))console.log('Usage: node scripts/prepare-new-dealer-source.mjs --request docs/releases/cloudflare-existing25-20261011/new-source/REQUEST.json --dealer SLUG [--write]\nDefault read-only. Requires real synchronized canonical main, absent Cars identity and all six approved source/branding/fact pins. Outputs source proposal only; build/publication/hosting remain pending.');
 else{const options={};for(let i=0;i<argv.length;i++){const name=argv[i];assert(['--request','--dealer','--write'].includes(name)&&!Object.hasOwn(options,name),'Unknown or duplicate argument');if(name==='--write')options[name]=true;else{assert(argv[i+1]&&!argv[i+1].startsWith('--'),'Missing argument value');options[name]=argv[++i];}}console.log(JSON.stringify(await prepareNewDealerSource({requestFile:options['--request'],dealer:options['--dealer'],write:options['--write']===true}),null,2));}}
 catch(error){console.error(error.message);process.exitCode=1;}
}
