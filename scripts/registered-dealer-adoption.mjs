/** Read-only admission for an already registered, unmounted legacy dealer.
 * The maintained updater owns merging/materialization/native seals. This module
 * never creates an application, changes registry/provider state or approves source.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,git,sha256,inside,filesAt,validateManifest} from './lib/workflow.mjs';
import {createHash} from 'node:crypto';
import {validateRegisteredModernDisplayCopy} from './lib/registered-modern-display-copy.mjs';
import {normalizeDealerLocale} from './lib/dealer-locale.mjs';
import {refreshNormalizeInternals,originalListingIdRecorded,originalListingSourceRecorded,assertRegisteredDemoDisclosures,normalizeRegisteredListings,normalizeRegisteredBusiness} from './lib/client-refresh-normalize.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {parseCatalogJson} from './lib/native-localization.mjs';
import {validateRegisteredPublishedInputs} from './lib/registered-reviewed-public-inputs.mjs';

export const REGISTERED_ADOPTION_KIND='cars-registered-dealer-source-adoption';
export const REGISTERED_ADOPTION_FILE='.client/registered-source-adoption.json';
export const REGISTERED_PROFILE_FILE='.client/registered-personalization.json';
export const REGISTERED_INPUT_ROOT='docs/releases/cloudflare-existing25-20261011/registered-source';
export const REGISTERED_TRIO=Object.freeze([{key:'auto-best',base:'',entry:'/'},{key:'modern',base:'/variant-2',entry:'/variant-2/cars'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]);
const plans=new WeakMap();
const assert=(v,m)=>{if(!v)throw Error('Registered adoption: '+m);};
const hex40=v=>typeof v==='string'&&/^[a-f0-9]{40}$/.test(v),hex64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const slug=v=>typeof v==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const dated=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keys=(v,w,label)=>assert(v&&same(Object.keys(v).sort(),[...w].sort()),'exact '+label+' fields required');
const safe=n=>typeof n==='string'&&/^[a-zA-Z0-9._/-]+$/.test(n)&&!n.startsWith('/')&&n.split('/').every(p=>p&&p!=='.'&&p!=='..');
const norm=v=>String(v??'').toLowerCase().replace(/[^a-z0-9]/g,'');
const json=b=>parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(b).replace(/^\uFEFF/,''));
const sourceKeys=['auto-best','modern','carwow'];
const blob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const publicPath=p=>typeof p==='string'&&p.startsWith('/')&&safe(p.slice(1))&&!p.startsWith('//');
const url=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
export {originalListingIdRecorded};
export function registeredInputPin(pin,dealer){keys(pin,['path','sha256'],'input pin');assert(safe(pin.path)&&pin.path.startsWith(REGISTERED_INPUT_ROOT+'/'+dealer+'/')&&pin.path.endsWith('.json')&&hex64(pin.sha256),'bounded reviewed input pin required');return pin;}
export function readRegisteredInput(root,pin,dealer){registeredInputPin(pin,dealer);const file=inside(root,pin.path,{mustExist:true});assert(fs.lstatSync(file).isFile(),'input must be a regular file');const bytes=fs.readFileSync(file);assert(bytes.length<=2*1024**2&&sha256(bytes)===pin.sha256,'reviewed input bytes changed');return {file,bytes,value:json(bytes)};}

export function validateRegisteredSourceRequest(request,registry){
 keys(request,['schemaVersion','mode','sourceRevision','approvedParentLockDigest','dealers','inputs'],'source request');
 assert(request.schemaVersion===1&&request.mode==='registered-adoption'&&hex40(request.sourceRevision)&&hex64(request.approvedParentLockDigest),'explicit registered-adoption request required');
 assert(Array.isArray(request.dealers)&&request.dealers.length>0&&request.dealers.length<=25&&new Set(request.dealers).size===request.dealers.length,'bounded distinct registered dealers required');
 assert(same(Object.keys(request.inputs??{}).sort(),[...request.dealers].sort()),'exact input mapping required');
 for(const dealer of request.dealers){assert(slug(dealer),'canonical dealer slug required');const record=registry?.dealers?.find(r=>r.slug===dealer);
  assert(record&&record.sourceOwnership!=='independent-repository'&&(!record.canonicalSourceRepository||record.canonicalSourceRepository==='darkapoparka/cars')&&record.canonicalSourceRef==='main','existing Cars-owned canonical research/source identity required');
  const input=request.inputs[dealer],names=['adoption','candidateLock','qualification','sourceDeltaReview','branding'];keys(input,input?.resolutions?[...names,'resolutions']:names,'dealer input');
  registeredInputPin(input.adoption,dealer);
  for(const name of names.filter(n=>n!=='adoption').concat(input.resolutions?['resolutions']:[])){const p=input[name];keys(p,['path','sha256'],'source input');assert(safe(p.path)&&p.path.startsWith('docs/releases/cloudflare-existing25-20261011/')&&p.path.endsWith('.json')&&hex64(p.sha256),'bounded source input required');}
 }return request;
}

function originalBytes(baseline,pin){keys(pin,['path','sha256'],'original source proof');assert(safe(pin.path)&&hex64(pin.sha256),'safe original proof required');const bytes=baseline.files.get(pin.path);assert(Buffer.isBuffer(bytes)&&sha256(bytes)===pin.sha256,'original source proof bytes differ: '+pin.path);return bytes;}
function validateIdentity(identity,dealer,registry){
 keys(identity,['dealerId','repository','workerName','publicOrigin','sources'],'identity mapping');
 assert(slug(identity.dealerId)&&/^darkapoparka\/cars-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identity.repository??'')&&slug(identity.workerName)&&identity.publicOrigin==='https://'+identity.workerName+'.darkapoparka1.workers.dev','exact reviewed dealer/repository/Worker identity required');
 assert(Array.isArray(identity.sources)&&identity.sources.length>0&&identity.sources.length<=20&&identity.sources.every(s=>{keys(s,['url','observedAt'],'identity source');return url(s.url)&&dated(s.observedAt);}),'dated factual identity sources required');
 const record=registry.dealers.find(r=>r.slug===dealer);assert(record,'registered dealer missing');
 for(const r of registry.dealers){if(r===record){assert((!r.repository||r.repository===identity.repository)&&(!r.id||r.id===identity.dealerId)&&(!r.dealerId||r.dealerId===identity.dealerId)&&(!r.cloudflare?.workerName||r.cloudflare.workerName===identity.workerName),'retained registered identity differs');continue;}
  assert(![r.slug,...(r.aliases??[])].some(s=>norm(s)===norm(dealer))&&![r.id,r.dealerId,r.researchId,r.leadId].some(s=>s&&norm(s)===norm(identity.dealerId))&&r.repository?.toLowerCase()!==identity.repository.toLowerCase()&&r.cloudflare?.workerName!==identity.workerName,'identity collides with another registered dealer');
 }
 assert(!Object.keys(registry.aliases??{}).some(a=>norm(a)===norm(dealer)),'alias cannot be adopted as a duplicate');
}

const BRANDING_INPUT_ROOT='docs/releases/cloudflare-existing25-20261011/branding-inputs52';
function publishedBytes(root,commit,name,readGit){
 assert(hex40(commit)&&safe(name),'published source lease required');
 const entry=readGit(root,['ls-tree',commit,'--',name]);assert(/^100(?:644|755) blob [a-f0-9]{40}\t/.test(entry)&&entry.split('\t')[1]===name,'published regular source file required: '+name);
 const bytes=readGit(root,['show',commit+':'+name],{encoding:null});assert(Buffer.isBuffer(bytes)&&blob(bytes)===entry.split(' ')[2].split('\t')[0],'published source bytes differ: '+name);return bytes;
}
function publishedBranding(input,{root,readGit,baseline,dealer}){
 const p=input.publishedBranding;if(!p)return null;keys(p,['path','sha256','sourceCommit'],'published branding pin');
 assert(p.path===BRANDING_INPUT_ROOT+'/'+dealer+'/branding.json'&&hex64(p.sha256)&&hex40(p.sourceCommit)&&readGit(root,['merge-base','--is-ancestor',p.sourceCommit,baseline.commit],{allowFailure:true})!==null,'exact already-published dealer branding lease required');
 const bytes=publishedBytes(root,p.sourceCommit,p.path,readGit);assert(sha256(bytes)===p.sha256&&bytes.length<256*1024,'published branding bytes differ');const document=json(bytes);
 assert(document.schemaVersion===1&&document.dealer===dealer&&document.reviewed===true&&dated(document.reviewedAt)&&document.dealerApproval===false&&document.nativeApproval===false&&document.hostedApproval===false,'reviewed input-only branding required');
 const surfaces=new Map();for(const surface of ['onLight','onDark','onAccent']){const pin=document.surfaces?.[surface];assert(pin?.path===BRANDING_INPUT_ROOT+'/'+dealer+'/branding/'+surface+'.png'&&hex64(pin.sha256),'exact published raster surface pin required');const raster=publishedBytes(root,p.sourceCommit,pin.path,readGit);assert(sha256(raster)===pin.sha256&&raster.length<=8*1024**2,'published raster bytes differ');surfaces.set(surface,{...pin,bytes:raster});}
 return {document,surfaces};
}

/** Literal-only reading of the maintained Auto Best demo table; never evaluate source. */
export function demoCatalogRecords(catalog,bindings){
 const text=catalog.toString('utf8'),marker=/const inventoryRecords:[^=]+=/g.exec(text);assert(marker,'reviewed demo declaration required');
 const paths=Object.fromEntries([...bindings.toString('utf8').matchAll(/(stock\d+)\s*:\s*['"]([^'"]+)['"]/g)].map(m=>['leadSite.artwork.inventoryDemo.'+m[1],m[2]]));
 let at=marker.index+marker[0].length;const ws=()=>{while(/\s/.test(text[at]??'')&&at<text.length)at++;};
 const read=()=>{ws();const c=text[at];if(c==='['){at++;const rows=[];ws();while(text[at]!==']'){rows.push(read());ws();if(text[at]!==',')break;at++;ws();}assert(text[at++ ]===']','literal demo array required');return rows;}
  if(c==='{'){at++;const out={};ws();while(text[at]!=='}'){const name=/^[a-zA-Z][\w]*/.exec(text.slice(at));assert(name,'literal demo property required');at+=name[0].length;ws();assert(text[at++]===':'&&!Object.hasOwn(out,name[0]),'distinct literal demo properties required');out[name[0]]=read();ws();if(text[at]!==',')break;at++;ws();}assert(text[at++]==='}','literal demo object required');return out;}
  if(c==="'"||c==='"'){const quote=c;at++;let value='';while(at<text.length&&text[at]!==quote){const ch=text[at++];if(ch==='\\'){const escaped=text[at++];assert([quote,'\\'].includes(escaped),'unsupported demo escape');value+=escaped;}else value+=ch;}assert(text[at++]===quote,'terminated demo string required');return value;}
  const numeric=/^\d+(?:\.\d+)?/.exec(text.slice(at));if(numeric){at+=numeric[0].length;return Number(numeric[0]);}
  const ref=/^leadSite\.artwork\.inventoryDemo\.stock\d+/.exec(text.slice(at));assert(ref&&publicPath(paths[ref[0]]),'only reviewed demo image bindings required');at+=ref[0].length;return paths[ref[0]];
 };const rows=read();ws();assert(text[at]===';'&&Array.isArray(rows)&&rows.length<=50,'bounded literal demo table required');return rows;
}
function validateTemplateDemo(input,{root,readGit,baseline}){
 if(input.stock.mode!=='template-demo')return null;assertRegisteredDemoDisclosures(input);const proof=input.stock.templateDemo;keys(proof,['source','catalog','bindings'],'demo source proof');keys(proof.source,['repository','revision','path','tree','digest'],'demo source locator');
 const release=json(fs.readFileSync(inside(root,'templates.lock.json',{mustExist:true}))).templates?.['auto-best'];assert(release?.status==='approved'&&same(proof.source,release.source)&&proof.source.repository==='darkapoparka/cars'&&proof.source.path==='templates/auto-best'&&hex40(proof.source.revision)&&hex40(proof.source.tree)&&hex64(proof.source.digest),'exact approved Auto Best demo source required');
 assert(readGit(root,['merge-base','--is-ancestor',proof.source.revision,baseline.commit],{allowFailure:true})!==null&&readGit(root,['rev-parse',proof.source.revision+':'+proof.source.path])===proof.source.tree,'published immutable demo subtree required');
 const bytes={};for(const [label,name]of [['catalog','src/lib/data/inventory.ts'],['bindings','src/lib/config/lead-site.ts']]){const p=proof[label];keys(p,['path','bytes','sha256','gitBlob'],'demo file proof');assert(p.path===name&&hex64(p.sha256)&&hex40(p.gitBlob)&&Number.isInteger(p.bytes)&&p.bytes>0&&p.bytes<=256*1024,'exact bounded demo source proof required');bytes[label]=publishedBytes(root,proof.source.revision,proof.source.path+'/'+name,readGit);assert(bytes[label].length===p.bytes&&sha256(bytes[label])===p.sha256&&blob(bytes[label])===p.gitBlob,'immutable demo catalog/binding bytes differ');}
 const rows=demoCatalogRecords(bytes.catalog,bytes.bindings),media=new Map();
 for(const row of input.stock.listings){const source=rows.find(r=>String(r.id)===row.sourceRecord.sourceId);assert(source,'demo source ID absent');const expected={...source,id:'template-demo-auto-best-'+source.id,sourceUrl:'',year:source.yearNumber,currency:'EUR',priceAmount:source.priceEur,images:[source.image],availability:'illustrative-not-dealer-stock',verification:'sample',sourceRecord:{sourceId:String(source.id),catalogPath:proof.catalog.path,catalogSha256:proof.catalog.sha256}};assert(same(row,expected),'demo listing changed from the reviewed template catalog');media.set(source.image,'static'+source.image);}
 return {source:proof.source,media};
}

/** Validate derived facts against retained evidence; no original fact is replaced. */
export function validateRegisteredPersonalization(input,{dealer,identity,baseline,root=ROOT,readGit=git}){
 keys(input,['schemaVersion','kind','dealer','reviewed','reviewedAt','facts','stock','locale','sourceEvidence','media',...(input.publishedBranding?['publishedBranding']:[]),...(input.publishedInputs?['publishedInputs']:[]),...(input.modernDisplayCopy?['modernDisplayCopy']:[])],'derived inputs');
 assert(input.schemaVersion===1&&input.kind==='cars-registered-dealer-derived-inputs'&&input.dealer===dealer&&input.reviewed===true&&dated(input.reviewedAt),'reviewed derived input required');
 assert(Array.isArray(input.sourceEvidence)&&input.sourceEvidence.length>0&&input.sourceEvidence.length<=50,'preserved factual evidence required');
 for(const p of input.sourceEvidence){assert(!p.path?.startsWith('auto-best/')&&!p.path?.startsWith('modern/'),'proof must survive the upgraded families unchanged');originalBytes(baseline,p);}
 const locale=normalizeDealerLocale(input.locale,identity.dealerId),facts=input.facts,b=facts?.business??facts;
 assert(b&&typeof b.name==='string'&&b.name.trim()&&b.countryCode===locale.dealerCountry&&b.currency===locale.inventoryCurrency,'explicit truthful business/country/currency required');
 assert(Array.isArray(input.stock?.listings)&&input.stock.listings.length>0&&input.stock.listings.length<=400&&typeof input.stock.kind==='string'&&input.stock.kind.trim(),'disclosed bounded stock input required');
 if(input.publishedInputs){assert(hex40(input.publishedInputs.sourceCommit)&&readGit(root,['merge-base','--is-ancestor',input.publishedInputs.sourceCommit,baseline.commit],{allowFailure:true})!==null,'published reviewed inputs must be immutable ancestors of canonical main');const originalFacts=json(originalBytes(baseline,input.sourceEvidence.find(p=>p.path==='business-facts.json')));return {locale,...validateRegisteredPublishedInputs(input,{dealer,identity,originalFacts,readBytes:(pin,local,max)=>publishedBytes(root,input.publishedInputs.sourceCommit,pin.path,readGit)})};}
 assert(input.stock.mode===undefined||['retained-dealer-source','template-demo'].includes(input.stock.mode),'unsupported registered stock mode');if(input.stock.mode)assert(input.stock.previewOnly===true&&input.stock.actualDealerAvailability===false&&input.stock.disclosure===b.inventoryNotice,'explicit stock mode/disclosure required');
 const branding=publishedBranding(input,{root,readGit,baseline,dealer}),demo=validateTemplateDemo(input,{root,readGit,baseline});
 assert(Array.isArray(input.media)&&input.media.length>0&&input.media.length<=1500,'retained media byte evidence required');const media=new Map(),assetBytes=new Map();let total=0;
 for(const item of input.media){assert(publicPath(item.publicPath)&&hex64(item.sha256)&&!media.has(item.publicPath),'safe distinct media proof required');let bytes;
  if(item.sourceKind==='published-branding-input'){keys(item,['publicPath','sourceKind','inputPath','sha256','surface'],'published raster proof');const surface=branding?.surfaces.get(item.surface);assert(surface&&item.publicPath==='/registered-branding/'+item.surface+'.png'&&item.inputPath===surface.path&&item.sha256===surface.sha256,'only exact selected published raster surface permitted');bytes=surface.bytes;}
  else if(item.sourceKind==='immutable-template-demo'){keys(item,['publicPath','sourceKind','templatePath','sha256','gitBlob','bytes'],'demo media proof');assert(demo?.media.get(item.publicPath)===item.templatePath&&hex40(item.gitBlob),'only immutable catalog-bound demo photos permitted');bytes=publishedBytes(root,demo.source.revision,demo.source.path+'/'+item.templatePath,readGit);assert(bytes.length===item.bytes&&blob(bytes)===item.gitBlob,'immutable demo photo bytes differ');}
  else {keys(item,['publicPath','sourcePath','sha256',...(item.sourceKind?['sourceKind']:[])],'media proof');assert(!item.sourceKind||item.sourceKind==='retained-client','unsupported media source');assert(safe(item.sourcePath),'safe retained media path required');bytes=baseline.files.get(item.sourcePath);}
  assert(Buffer.isBuffer(bytes)&&bytes.length<=8*1024**2&&sha256(bytes)===item.sha256,'retained/reviewed media bytes differ');total+=bytes.length;assert(total<=64*1024**2,'bounded reviewed media required');media.set(item.publicPath,item);assetBytes.set(item.publicPath,Buffer.from(bytes));
 }
 const ids=new Set();if(!demo)for(const item of input.stock.listings){assert(typeof item.id==='string'&&item.id.trim()&&!ids.has(item.id)&&url(item.sourceUrl),'distinct original listing ID and source URL required');ids.add(item.id);
  const proof=item.sourceRecord;keys(proof,['path','sha256','id'],'listing source proof');assert(proof.id===item.id,'original listing identity changed');const bytes=originalBytes(baseline,{path:proof.path,sha256:proof.sha256});assert(input.sourceEvidence.some(p=>p.path===proof.path&&p.sha256===proof.sha256)&&originalListingSourceRecorded(bytes,item.id,item.sourceUrl),'listing ID/source URL absent from preserved factual source');
  assert(Array.isArray(item.images)&&item.images.length>0&&item.images.every(p=>media.has(p)),'original local listing photo proof required');
 }
 assert([b.logo,b.logoDark??b.logo].every(p=>media.has(p)&&/\.(png|webp)$/i.test(p??'')),'retained raster logo proof required');
 for(const item of input.stock.listings)assert(item.images.every(p=>media.has(p)),'catalog/original local photo proof required');
 return {locale,media,assetBytes};
}

/** Pure planner. baseline is authenticated by sourceBaseline in the reader below. */
export function planRegisteredClientAdoption({receipt,receiptBytes,personalization,personalizationBytes,baseline,registry,dealerRoot,root=ROOT,readGit=git}){
 keys(receipt,['schemaVersion','kind','dealer','reviewed','reviewedAt','canonicalSourceRepository','baseline','identity','layout','variants','applications','templateSources','provenance','personalization','nativeApproval','hostedApproval','globalReleaseApproval',...(receipt.templateRefresh?['templateRefresh']:[])],'adoption receipt');
 const dealer=receipt.dealer;assert(slug(dealer)&&receipt.schemaVersion===1&&receipt.kind===REGISTERED_ADOPTION_KIND&&receipt.reviewed===true&&dated(receipt.reviewedAt)&&receipt.canonicalSourceRepository==='darkapoparka/cars','exact reviewed Cars receipt required');
 assert(receipt.nativeApproval===false&&receipt.hostedApproval===false&&receipt.globalReleaseApproval===false,'adoption cannot imply approval');
 keys(receipt.baseline,['commit','tree'],'canonical lease');assert(hex40(receipt.baseline.commit)&&hex40(receipt.baseline.tree)&&receipt.baseline.tree===baseline.tree&&baseline.files instanceof Map&&!baseline.files.has('dealer.json'),'unchanged manifest-less canonical destination required');
 const record=registry?.dealers?.find(r=>r.slug===dealer);assert(record&&record.canonicalSourceRef==='main'&&record.sourceOwnership!=='independent-repository'&&(!record.canonicalSourceRepository||record.canonicalSourceRepository==='darkapoparka/cars'),'registered Cars-owned source required');
 const source=inside(root,'clients/'+dealer,{mustExist:true});assert(fs.realpathSync(source)===fs.realpathSync(dealerRoot)&&!fs.existsSync(path.join(source,'.git'))&&!fs.existsSync(path.join(source,'dealer.json')),'canonical source cannot be independent or already manifested');
 assert(!baseline.files.has(REGISTERED_ADOPTION_FILE)&&!baseline.files.has(REGISTERED_PROFILE_FILE),'adoption metadata destination is occupied');
 assert(hex40(baseline.commit)&&readGit(root,['rev-parse','HEAD'])===baseline.commit&&readGit(root,['remote','get-url','origin']).replace(/\.git$/,'')==='https://github.com/darkapoparka/cars','current canonical Cars checkout required');
 assert(readGit(root,['merge-base','--is-ancestor',receipt.baseline.commit,baseline.commit],{allowFailure:true})!==null&&readGit(root,['rev-parse',baseline.commit+':clients/'+dealer])===baseline.tree,'published canonical destination lease differs');
 const raw=readGit(root,['ls-tree','-rz',baseline.commit+':clients/'+dealer],{encoding:null});assert(Buffer.isBuffer(raw),'exact raw canonical entry inventory required');
 const entries=raw.toString('utf8').split('\0').filter(Boolean).map(line=>{const at=line.indexOf('\t'),[mode,type,object]=line.slice(0,at).split(' ');assert(type==='blob'&&['100644','100755'].includes(mode),'links/submodules are excluded');return{path:line.slice(at+1),mode,blob:object};});
 assert(same(entries,[...baseline.entries])&&same(entries.map(e=>e.path).sort(),[...baseline.files.keys()].sort())&&same(filesAt(source,{filter:()=>true}).sort(),[...baseline.files.keys()].sort()),'complete canonical destination inventory differs');
 for(const entry of entries)assert(blob(baseline.files.get(entry.path))===entry.blob,'canonical baseline blob bytes differ');
 for(const [name,bytes]of baseline.files){const file=inside(source,name,{mustExist:true});assert(fs.lstatSync(file).isFile()&&fs.readFileSync(file).equals(bytes),'canonical source bytes changed: '+name);}
 validateIdentity(receipt.identity,dealer,registry);assert(same(receipt.variants,REGISTERED_TRIO),'explicit initial Modern slot2 trio required');
 keys(receipt.layout,['kind','reviewed','proofs'],'layout');assert(receipt.layout.kind==='raw-unmounted-applications'&&receipt.layout.reviewed===true&&Array.isArray(receipt.layout.proofs)&&receipt.layout.proofs.length>=3&&receipt.layout.proofs.length<=20,'reviewed raw-unmounted source layout required');
 for(const p of receipt.layout.proofs)originalBytes(baseline,p);
 for(const key of sourceKeys)assert(receipt.layout.proofs.some(p=>p.path.startsWith(key+'/')&&/config\.[cm]?[jt]s$/.test(p.path)),'each original application needs its mount configuration proof');
 for(const field of ['applications','templateSources','provenance'])keys(receipt[field],sourceKeys,field);
 for(const key of sourceKeys){assert(hex40(receipt.applications[key])&&readGit(root,['rev-parse',baseline.commit+':clients/'+dealer+'/'+key])===receipt.applications[key]&&baseline.files.has(key+'/package.json'),'original application tree differs');
  const locator=receipt.templateSources[key];if(locator===null){assert(receipt.templateRefresh?.unversionedBaseline===true&&receipt.templateRefresh.reviewed===true,'Unversioned source needs an explicit pinned-template replacement');const p=receipt.provenance[key];keys(p,['metadata','copyReceipt'],'historical raw source provenance');assert(p.metadata.path===key+'/.client/project.json'&&p.copyReceipt.path===key+'/.template/source-manifest.json','exact historical raw metadata paths required');const metadata=json(originalBytes(baseline,p.metadata));assert(metadata.client===dealer&&metadata.templateKey===key&&!metadata.sourceCommit&&!metadata.sourceTree,'historical unversioned source identity differs');const captured=json(originalBytes(baseline,p.copyReceipt));assert(!captured.sourceCommit&&!captured.sourceTree,'Known historical template source cannot be discarded as unknown');continue;}keys(locator,['repository','revision','path','tree'],'old source locator');assert(locator.repository==='darkapoparka/cars'&&locator.path==='templates/'+key&&hex40(locator.revision)&&hex40(locator.tree)&&readGit(root,['rev-parse',locator.revision+':'+locator.path])===locator.tree,'exact published previous Cars source required');
  const p=receipt.provenance[key];keys(p,p?.copyReceipt?['metadata','copyReceipt']:['metadata'],'source provenance');assert(p.metadata.path===key+'/.client/project.json','original metadata path differs');const metadata=json(originalBytes(baseline,p.metadata));assert(metadata.client===dealer&&(!metadata.templateKey||metadata.templateKey===key),'original client metadata identity differs');
  assert(!baseline.files.has(key+'/.template/source-manifest.json')||p.copyReceipt,'retained template copy receipt cannot be omitted');
  let copied=null;if(p.copyReceipt){assert(p.copyReceipt.path===key+'/.template/source-manifest.json','original copy receipt path differs');copied=json(originalBytes(baseline,p.copyReceipt));assert(copied.git?.dirtyStatusRecorded!==true&&!copied.git?.status?.trim(),'dirty copied template base is unsupported');assert(copied.sourceCommit===locator.revision&&copied.sourceTree===locator.tree,'copy receipt does not prove the exact previous source');}
  const revision=metadata.sourceCommit??copied?.sourceCommit,tree=metadata.sourceTree??copied?.sourceTree;
  assert(revision===locator.revision&&tree===locator.tree&&(!copied?.sourceRepository||copied.sourceRepository===locator.repository)&&(!copied?.sourcePath||copied.sourcePath===locator.path),'original source provenance does not prove the requested base');
 }
 registeredInputPin(receipt.personalization,dealer);assert(Buffer.isBuffer(personalizationBytes)&&sha256(personalizationBytes)===receipt.personalization.sha256&&same(json(personalizationBytes),personalization),'derived input bytes differ');
 const {locale,media,assetBytes,materializedFiles=new Map()}=validateRegisteredPersonalization(personalization,{dealer,identity:receipt.identity,baseline,root,readGit});
 assert(Buffer.isBuffer(receiptBytes)&&same(json(receiptBytes),receipt),'exact raw adoption receipt bytes required');
 const rawFacts=personalization.facts,business=normalizeRegisteredBusiness(source,dealer,personalization),listings=normalizeRegisteredListings(personalization,business);assert(listings.length===personalization.stock.listings.length&&listings.every((r,i)=>r.id===personalization.stock.listings[i].id&&r.title&&r.image),'normalization must retain original listing identities and images');
 const assets=Object.fromEntries(['onLight','onDark','onAccent'].map(name=>{const p=name==='onLight'?business.logo:name==='onDark'?business.logoDark||business.logo:business.logo;return[name,{publicPath:p,sha256:media.get(p)?.sha256}];}));
 const manifest=validateManifest({schemaVersion:1,slug:dealer,dealerId:receipt.identity.dealerId,repository:receipt.identity.repository,defaultBranch:'main',variants:structuredClone(REGISTERED_TRIO),extraAssets:[],packaging:{version:'1'},templateRevisions:Object.fromEntries(sourceKeys.filter(k=>receipt.templateSources[k]).map(k=>[k,receipt.templateSources[k].revision])),templateSources:structuredClone(Object.fromEntries(Object.entries(receipt.templateSources).filter(([,v])=>v))),localization:structuredClone(locale)});
 const profile={schemaVersion:1,slug:dealer,business,listings,rawFacts,sourceCount:listings.length,stockKind:personalization.stock.kind,logoContract:{assets}};
 if(personalization.modernDisplayCopy)profile.reviewedModernCopy=validateRegisteredModernDisplayCopy(personalization.modernDisplayCopy,profile);
 for(const name of materializedFiles.keys())assert(!baseline.files.has(name),'reviewed input materialization destination is occupied');
 const plan={dealer,manifest,profile,identity:structuredClone(receipt.identity),receipt:structuredClone(receipt),receiptSha256:sha256(receiptBytes),personalizationSha256:sha256(personalizationBytes),baseline:{commit:baseline.commit,tree:baseline.tree},files:new Map([[REGISTERED_ADOPTION_FILE,receiptBytes],[REGISTERED_PROFILE_FILE,personalizationBytes],...materializedFiles]),write:false,published:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
 plans.set(plan,{root,source,assetBytes,outputFiles:new Map([...plan.files].map(([name,bytes])=>[name,sha256(bytes)])),demoLockSha256:personalization.stock.mode==='template-demo'?sha256(fs.readFileSync(path.join(root,'templates.lock.json'))):null,manifest:JSON.stringify(manifest),profile:JSON.stringify(profile),identity:JSON.stringify(plan.identity),receipt:JSON.stringify(plan.receipt),receiptSha256:plan.receiptSha256,profileSha256:plan.personalizationSha256,lease:JSON.stringify(plan.baseline),files:new Map([...baseline.files].map(([name,bytes])=>[name,sha256(bytes)]))});return plan;
}

/** One immutable asset-only input view for existing adapters, bounded to the owner's run. */
export function materializeRegisteredAssetView(plan,{runDirectory,candidateDirectory}={}){
 assertRegisteredAdoptionPlan(plan);const proof=plans.get(plan),run=fs.realpathSync(runDirectory),runtime=fs.realpathSync(path.join(proof.root,'runtime'));
 assert(run!==runtime&&run.startsWith(runtime+path.sep)&&!run.startsWith(proof.source+path.sep),'asset view must remain inside a distinct Cars runtime run');
 const directory=path.join(run,'registered-input-assets');assert(!fs.existsSync(directory),'registered asset view destination is occupied');
 if(candidateDirectory){const candidate=path.resolve(candidateDirectory);assert(candidate!==directory&&!candidate.startsWith(directory+path.sep)&&!directory.startsWith(candidate+path.sep),'asset view cannot overlap candidate source');}
 fs.mkdirSync(directory);for(const key of ['auto-best','modern','import'])fs.mkdirSync(path.join(directory,key));
 for(const [publicName,bytes]of proof.assetBytes){const name=publicName.slice(1),file=inside(directory,name);assert(plan.profile.logoContract?.assets&&sha256(bytes)===JSON.parse(plan.files.get(REGISTERED_PROFILE_FILE)).media.find(p=>p.publicPath===publicName)?.sha256,'private reviewed asset bytes differ');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});}
 const light=plan.profile.logoContract.assets.onLight,filePins=new Map([...proof.assetBytes].map(([name,bytes])=>[name.slice(1),sha256(bytes)]));let legacyAlias=null;
 if(/\.png$/i.test(light.publicPath)){
  const lightBytes=proof.assetBytes.get(light.publicPath);assert(lightBytes&&sha256(lightBytes)===light.sha256,'legacy logo alias requires the sealed onLight PNG');
  const alias='branding/logo-on-light.png',aliasFile=inside(directory,alias),sourceFile=inside(directory,light.publicPath.slice(1),{mustExist:true});
  if(fs.existsSync(aliasFile))assert(fs.lstatSync(aliasFile).isFile()&&sha256(fs.readFileSync(aliasFile))===light.sha256,'legacy logo alias destination has different bytes');
  else{fs.mkdirSync(path.dirname(aliasFile),{recursive:true});fs.linkSync(sourceFile,aliasFile);}
  filePins.set(alias,light.sha256);legacyAlias={path:alias,sha256:light.sha256,sourcePublicPath:light.publicPath};
 }
 proof.assetView={directory,files:filePins,legacyAlias};return directory;
}

export function assertRegisteredAssetView(plan,directory){
 assertRegisteredAdoptionPlan(plan);const view=plans.get(plan).assetView;assert(view&&fs.realpathSync(directory)===view.directory,'authenticated registered asset view required');
 const light=plan.profile.logoContract.assets.onLight;if(/\.png$/i.test(light.publicPath))assert(view.legacyAlias?.path==='branding/logo-on-light.png'&&view.legacyAlias.sha256===light.sha256&&view.legacyAlias.sourcePublicPath===light.publicPath&&view.files.get(view.legacyAlias.path)===light.sha256,'legacy logo alias proof changed');else assert(view.legacyAlias===null,'WebP source must not acquire a derived PNG alias');
 assert(same(filesAt(directory,{filter:()=>true}).sort(),[...view.files.keys()].sort()),'registered asset view inventory changed');for(const [name,digest]of view.files){const file=inside(directory,name,{mustExist:true});assert(fs.lstatSync(file).isFile()&&sha256(fs.readFileSync(file))===digest,'registered asset view bytes changed');}return directory;
}

export function assertRegisteredCandidateDirectory(plan,directory){
 assertRegisteredAdoptionPlan(plan);const proof=plans.get(plan),candidate=fs.realpathSync(directory),runtime=fs.realpathSync(path.join(proof.root,'runtime')),view=proof.assetView?.directory;
 assert(candidate!==runtime&&candidate.startsWith(runtime+path.sep)&&candidate!==proof.source&&!candidate.startsWith(proof.source+path.sep)&&(!view||(candidate!==view&&!candidate.startsWith(view+path.sep)&&!view.startsWith(candidate+path.sep))),'registered personalization requires a distinct runtime candidate');return candidate;
}

export function assertRegisteredAdoptionPlan(plan,{dealerRoot,manifest=plan?.manifest}={}){
 const proof=plans.get(plan);assert(proof&&proof.manifest===JSON.stringify(manifest)&&proof.profile===JSON.stringify(plan.profile)&&proof.identity===JSON.stringify(plan.identity)&&proof.receipt===JSON.stringify(plan.receipt)&&proof.lease===JSON.stringify(plan.baseline)&&plan.write===false&&plan.published===false&&plan.nativeApproval===false&&plan.hostedApproval===false&&plan.globalReleaseApproval===false&&plan.files instanceof Map&&plan.files.size===proof.outputFiles.size&&[...plan.files].every(([name,bytes])=>Buffer.isBuffer(bytes)&&proof.outputFiles.get(name)===sha256(bytes))&&Buffer.isBuffer(plan.files.get(REGISTERED_ADOPTION_FILE))&&Buffer.isBuffer(plan.files.get(REGISTERED_PROFILE_FILE))&&proof.receiptSha256===plan.receiptSha256&&proof.profileSha256===plan.personalizationSha256&&proof.receiptSha256===sha256(plan.files.get(REGISTERED_ADOPTION_FILE))&&proof.profileSha256===sha256(plan.files.get(REGISTERED_PROFILE_FILE))&&fs.realpathSync(dealerRoot??proof.source)===proof.source,'a validated unmodified in-memory adoption plan is required');
 assert(!proof.demoLockSha256||sha256(fs.readFileSync(path.join(proof.root,'templates.lock.json')))===proof.demoLockSha256,'approved demo catalog lease changed');
 assert(!fs.existsSync(path.join(proof.source,'dealer.json'))&&!fs.existsSync(path.join(proof.source,'.git')),'original manifest-less destination changed');
 assert(same(filesAt(proof.source,{filter:()=>true}).sort(),[...proof.files.keys()].sort()),'original destination inventory changed');
 for(const [name,digest]of proof.files){const file=inside(proof.source,name,{mustExist:true});assert(fs.lstatSync(file).isFile()&&sha256(fs.readFileSync(file))===digest,'original destination lease changed');}return plan;
}

export async function readRegisteredDealerAdoption({root=ROOT,pin,dealer,baseline,registry,readGit=git}={}){
 const input=readRegisteredInput(root,pin,dealer);assert(input.value.dealer===dealer,'receipt belongs to another dealer');
 const current=baseline??(await import('./prepare-existing-fleet-source.mjs')).sourceBaseline(root,dealer,readGit(root,['rev-parse','HEAD']));
 const inventory=registry??json(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'))),derived=readRegisteredInput(root,input.value.personalization,dealer);
 const plan=planRegisteredClientAdoption({receipt:input.value,receiptBytes:input.bytes,personalization:derived.value,personalizationBytes:derived.bytes,baseline:current,registry:inventory,dealerRoot:inside(root,'clients/'+dealer,{mustExist:true}),root,readGit});plan.inputPin={...pin};return plan;
}

export function registeredAdoptionTarget(plan,pins){assertRegisteredAdoptionPlan(plan,{dealerRoot:plans.get(plan)?.source});const next=structuredClone(plan.manifest);next.variants=planSixDesignSelection(next.variants).variants;next.packaging={version:'5'};next.language=next.localization.defaultLocale;next.branding={schemaVersion:1,required:true,policy:'template-default',contract:'.cars-branding.json',surfaceBindingsVersion:1};
 next.templateRevisions=Object.fromEntries(next.variants.map(({key})=>[key,pins[key]?.to]));next.templateSources=Object.fromEntries(next.variants.map(({key})=>[key,pins[key]?.targetSource]));assert(next.variants.every(({key})=>pins[key]?.targetSource),'all six reviewed target pins required');
 // Only the share-identity rasters are materialized at the candidate root; stock media is retained inside each variant.
 const assetRoots=new Set([plan.profile.business.logo,plan.profile.business.logoDark||plan.profile.business.logo].map(name=>name.slice(1).split('/')[0]));
 next.extraAssets=[...assetRoots].sort();next.shareIdentity={name:plan.profile.business.name,description:plan.profile.business.previewNotice,publicOrigin:plan.identity.publicOrigin,logo:{sourcePath:plan.profile.logoContract.assets.onLight.publicPath.slice(1),sha256:plan.profile.logoContract.assets.onLight.sha256}};
 next.registeredSourceAdoption={receipt:{path:REGISTERED_ADOPTION_FILE,sha256:plan.receiptSha256},personalization:{path:REGISTERED_PROFILE_FILE,sha256:plan.personalizationSha256}};return validateManifest(next);
}

export function assertRegisteredMountOwnership(manifest,baseline,plan){assertRegisteredAdoptionPlan(plan,{dealerRoot:plans.get(plan)?.source});assert(!baseline.files.has('dealer.json')&&baseline.commit===plan.baseline.commit&&baseline.tree===plan.baseline.tree&&manifest.slug===plan.dealer&&manifest.repository===plan.identity.repository&&same(manifest.variants,planSixDesignSelection(plan.manifest.variants).variants),'prepared mounts differ from reviewed registered adoption');return {baseCommit:baseline.commit,baseTree:baseline.tree,adoptionReceiptSha256:plan.receiptSha256,initialSelection:true,previousPublicRoutes:false,variants:manifest.variants};}

