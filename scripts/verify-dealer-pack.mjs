/** Read-only QA of a compact dealer pack and the existing six-application bundle. */
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {createRequire} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,filesAt,inside,json,sha256,writeJson} from './lib/workflow.mjs';
import {safeArtifactPath,validateFileInventory,verifyArtifactDirectory} from './lib/uk-cloudflare-artifacts.mjs';
import {assertSixDesignSelection,SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {canonicalPackJson,validatePackExecution,validatePackSourceReleases,validateDealerPackComposition,dealerPackCompositionDigest} from './lib/dealer-pack-artifacts.mjs';
import {previewJourney,previewDetail} from './verify-dealer-preview.mjs';
import {dismissAppWelcome} from './verify-priselci-public-browser.mjs';
import {dealerPackFabPolicy,fleetDesignFabHashes} from './lib/dealer-pack-switcher-logo.mjs';
import {refreshNormalizeInternals} from './lib/client-refresh-normalize.mjs';
import {assessLogoQualityDecision} from './lib/dealer-pack-logo-quality.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const receiptName='single-worker-receipt.json';
const candidateType='cars-dealer-pack-single-worker-provider-package';
const clean=value=>String(value??'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/&/g,' and ').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
const digits=value=>String(value??'').replace(/\D/g,'');
const business=facts=>facts?.business??facts??{};
const includesName=(text,name)=>clean(name).length>=3&&(' '+clean(text)+' ').includes(' '+clean(name)+' ');
const includesNameOutsideOwnName=(text,name,ownNames)=>{
  let value=' '+clean(text)+' ';
  for(const own of [...new Set(ownNames.map(clean).filter(Boolean))].sort((a,b)=>b.length-a.length))while(value.includes(' '+own+' '))value=value.replaceAll(' '+own+' ',' ');
  return clean(name).length>=3&&value.includes(' '+clean(name)+' ');
};
const visibleText=value=>String(value??'').replace(/\s+/g,' ').trim();
const completeIdentityContext=(text,context)=>context?.schemaVersion===1&&context.status==='complete'&&Array.isArray(context.segments)&&context.segments.length>0&&context.segments.length<=4096&&context.segments.every(row=>typeof row.text==='string'&&typeof row.owner==='string'&&['body','vehicle-fact','vehicle-title'].includes(row.channel))&&visibleText(context.segments.map(row=>row.text).join('\n'))===visibleText(text);
const nativeVehicleOwners=new Set(['modern','auto-best','import','import-site','signature','signature-mobile']);
function sourcedVehicleText(segment,stock){
  if(!nativeVehicleOwners.has(segment.vehicleOwner)||!Array.isArray(stock?.records)||stock.records.length>1000)return false;
  const titleChannel=segment.channel==='vehicle-title',linkChannel=['link-aria-label','link-title'].includes(segment.channel),photoChannel=segment.channel==='image-alt';
  if(!titleChannel&&!linkChannel&&!photoChannel)return false;
  let destination;try{destination=new URL(segment.vehicleHref);if(!['http:','https:'].includes(destination.protocol)||destination.origin!==segment.vehicleOrigin||destination.username||destination.password)return false;}catch{return false;}
  const value=visibleText(segment.text);
  return stock.records.some((row,index)=>{
    if(typeof row?.title!=='string'||!row.title.trim())return false;
    let listing;try{listing=refreshNormalizeInternals.normalizeListing(row,index,{});}catch{return false;}
    // Use the same record normalization as assembly and the actual native route
    // constructors: a matching title on an unrelated vehicle is not evidence.
    const suffix=segment.vehicleOwner==='modern'?'/listing/'+listing.slug:segment.vehicleOwner==='auto-best'?'/listing-detail-v1/'+(index+1):['import','import-site'].includes(segment.vehicleOwner)?'/inventory/'+encodeURIComponent(listing.sourceId):null;
    if(suffix?!destination.pathname.replace(/\/$/,'').endsWith(suffix):!(/\/vehicle\/?$/.test(destination.pathname)&&destination.searchParams.getAll('id').length===1&&destination.searchParams.get('id')===listing.id))return false;
    const full=visibleText(row.title),titles=new Set([full]);
    // These are the selected Modern getVehicleCardTitle/getMobileVehicleCardHeading
    // and Auto Best modelTitle transformations, not arbitrary substring matching.
    if(segment.vehicleOwner==='modern'||segment.vehicleOwner==='auto-best'){
      let display=full;
      if(segment.vehicleOwner==='modern'&&Number.isInteger(row.year)&&display.startsWith(row.year+' ')){display=display.slice(String(row.year).length+1);titles.add(display);}
      if(typeof row.make==='string'&&row.make.trim()&&display.startsWith(row.make.trim()+' '))titles.add(display.slice(row.make.trim().length+1));
    }
    if(titleChannel)return titles.has(value);
    if(linkChannel)return value===full||value==='View '+full;
    if(value!==full||!Array.isArray(row.images)||typeof segment.vehiclePhoto!=='string')return false;
    // Only a source-bound stock photograph may carry its exact vehicle title.
    // Ordinary images, dealer logos and metadata retain the strict name scan.
    let actual;try{actual=new URL(segment.vehiclePhoto);if(!['http:','https:'].includes(actual.protocol)||actual.origin!==segment.vehicleOrigin)return false;}catch{return false;}
    return row.images.some(image=>{if(typeof image!=='string'||!image.startsWith('/dealer-stock/'))return false;return actual.pathname===image||/^\/variant-[2-6]\//.test(actual.pathname)&&actual.pathname.slice('/variant-2'.length)===image;});
  });
}
const samePhone=(a,b)=>{a=digits(a);b=digits(b);return a.length>=7&&b.length>=7&&(a===b||a.length>=9&&b.length>=9&&a.slice(-9)===b.slice(-9));};
const textPhones=text=>[...String(text??'').matchAll(/(?<!\d)(?:\+|00)?\d[\d \t()./-]{5,}\d(?!\d)/g)].map(match=>match[0]).filter(value=>digits(value).length>=7&&digits(value).length<=15);
const noProviderEnv=env=>Object.fromEntries(Object.entries(env).filter(([key])=>!/^(?:GH_TOKEN|GITHUB_TOKEN|(?:CLOUDFLARE|CF)_(?:API|AUTH|TOKEN|ACCOUNT)|WRANGLER_(?:API_TOKEN|TOKEN))/.test(key)));

// Source: https://developers.cloudflare.com/workers/platform/limits/ (2026-10-19).
// The September 2026 change removed the compressed script limit. Gzip is diagnostic.
export const CLOUDFLARE_BUNDLE_LIMITS=Object.freeze({
  checkedAt:'2026-10-19',source:'https://developers.cloudflare.com/workers/platform/limits/',
  scriptBytes:64*1024**2,assetBytes:25*1024**2,assetFiles:Object.freeze({free:20000,paid:100000}),
});

export function assessBundleLimits(files,plan) {
  assert(Object.hasOwn(CLOUDFLARE_BUNDLE_LIMITS.assetFiles,plan),'Choose an explicit target plan: free or paid');
  assert(Array.isArray(files)&&files.length&&files.every(row=>safeArtifactPath(row.path)&&Number.isSafeInteger(row.bytes)&&row.bytes>=0),'Bundle sizes require a complete file inventory');
  const server=files.filter(row=>row.path.startsWith('server/')),assets=files.filter(row=>row.path.startsWith('public/'));
  assert(server.some(row=>row.path==='server/worker.mjs')&&assets.length,'Bundle must contain an actual Worker and assets');
  const serverBytes=server.reduce((sum,row)=>sum+row.bytes,0),largestAsset=assets.reduce((a,b)=>a.bytes>=b.bytes?a:b);
  const violations=[];
  if(serverBytes>CLOUDFLARE_BUNDLE_LIMITS.scriptBytes)violations.push('uncompressed-worker-size');
  if(assets.length>CLOUDFLARE_BUNDLE_LIMITS.assetFiles[plan])violations.push('static-asset-count');
  if(largestAsset.bytes>CLOUDFLARE_BUNDLE_LIMITS.assetBytes)violations.push('individual-static-asset-size');
  return {status:violations.length?'failed':'passed',targetPlan:plan,planVerified:false,source:CLOUDFLARE_BUNDLE_LIMITS.source,
    limits:{uncompressedWorkerBytes:CLOUDFLARE_BUNDLE_LIMITS.scriptBytes,staticAssetFiles:CLOUDFLARE_BUNDLE_LIMITS.assetFiles[plan],individualAssetBytes:CLOUDFLARE_BUNDLE_LIMITS.assetBytes},
    measured:{uncompressedWorkerBytes:serverBytes,staticAssetFiles:assets.length,largestAsset:{path:largestAsset.path,bytes:largestAsset.bytes}},
    remaining:{uncompressedWorkerBytes:CLOUDFLARE_BUNDLE_LIMITS.scriptBytes-serverBytes,staticAssetFiles:CLOUDFLARE_BUNDLE_LIMITS.assetFiles[plan]-assets.length},
    violations,note:'Static assets do not count toward the script-size limit. Selecting paid is a build target, not billing or subscription evidence.'};
}

/** Verify bytes independently of receipt booleans; extra files and links fail. */
export function inspectDealerPackBundle({bundleRoot,slug,packDigest,releaseDigest,sourceReleases,plan}) {
  assert(slugPattern.test(slug??''),'Exact dealer slug required');
  const directory=fs.realpathSync(bundleRoot),receipt=json(inside(directory,receiptName,{mustExist:true}));
  assert(receipt.schemaVersion===1&&receipt.type===candidateType&&receipt.dealer===slug,'Not this dealer pack candidate bundle');
  assert(hex64(receipt.packDigest)&&hex64(receipt.releaseDigest)&&(!packDigest||receipt.packDigest===packDigest)&&(!releaseDigest||receipt.releaseDigest===releaseDigest),'Bundle pack or release digest differs');
  assert(/^[a-f0-9]{40}$/.test(receipt.sourceCommit??'')&&hex64(receipt.sourceDigest),'Compiled source identity is missing');
  validatePackExecution(receipt.execution);
  validatePackSourceReleases(receipt.sourceReleases);
  if(receipt.packComposition!==undefined||receipt.packCompositionDigest!==undefined){
    validateDealerPackComposition(receipt.packComposition,{dealer:slug,identity:receipt,artifacts:receipt.artifacts??{}});
    assert(hex64(receipt.packCompositionDigest)&&dealerPackCompositionDigest(receipt.packComposition)===receipt.packCompositionDigest,'Bundle composition proof digest differs');
  }
  assert(sha256(canonicalPackJson(receipt.sourceReleases))===receipt.releaseDigest&&(!sourceReleases||canonicalPackJson(receipt.sourceReleases)===canonicalPackJson(sourceReleases)),'Bundle does not use the current six pinned template releases');
  assert(receipt.applicationCount===6&&receipt.workerCount===1&&JSON.stringify([...(receipt.composition?.inProcess??[])].sort())===JSON.stringify([...SIX_DESIGN_KEYS].sort())&&Array.isArray(receipt.composition?.serviceBindings)&&receipt.composition.serviceBindings.length===0,'Bundle does not contain six applications in one Worker');
  const inventory=validateFileInventory({schemaVersion:1,files:receipt.files,digest:receipt.outputDigest,bytes:receipt.files?.reduce((sum,row)=>sum+row.bytes,0)});
  const fileNames=new Set(inventory.files.map(row=>row.path));
  assert(fileNames.has('server/router.mjs')&&SIX_DESIGN_KEYS.every(key=>fileNames.has('server/'+key+'/'+(['modern','app','mobile'].includes(key)?'index.js':'index.mjs'))),'Compiled family or router module is missing');
  assert(inventory.files.every(row=>(row.path==='wrangler.json'||/^(?:server|public)\//.test(row.path))&&!/(?:^|\/)(?:\.env(?:\.|$)|\.dev\.vars(?:\.|$)|node_modules\/)/.test(row.path)),'Bundle includes source, private inputs or dependencies outside compiled outputs');
  const actual=filesAt(directory,{filter:()=>true}).filter(name=>name!==receiptName&&name!=='artifact-manifest.json');
  assert(JSON.stringify(actual)===JSON.stringify(inventory.files.map(row=>row.path).sort()),'Bundle contains missing or undeclared files');
  for(const row of inventory.files){
    const bytes=fs.readFileSync(inside(directory,row.path,{mustExist:true}));
    assert(bytes.length===row.bytes&&sha256(bytes)===row.sha256,'Bundle bytes changed: '+row.path);
  }
  // The maintained composer seals the successful dry-run with a separate
  // artifact envelope that also authenticates the singleton receipt itself.
  assert(fs.existsSync(path.join(directory,'artifact-manifest.json')),'Compiled bundle artifact envelope is missing');
  const envelope=verifyArtifactDirectory(directory);
  assert(envelope.kind===candidateType&&envelope.dealer===slug&&envelope.status==='passed','Compiled bundle artifact envelope identity differs');
  const config=json(inside(directory,'wrangler.json',{mustExist:true}));
  assert(config.name===receipt.workerName&&config.main==='server/worker.mjs'&&config.assets?.directory==='./public'&&config.assets.binding==='ASSETS','Bundle Worker/asset configuration differs');
  assert(config.no_bundle===true&&config.find_additional_modules===true&&config.assets.run_worker_first===false,'Candidate requires existing asset-first single-Worker packaging');
  const resourceKeys=['services','kv_namespaces','r2_buckets','d1_databases','durable_objects','queues','hyperdrive','dispatch_namespaces','mtls_certificates','ai','browser','unsafe','env','build','secrets_store_secrets'];
  assert(resourceKeys.every(key=>config[key]===undefined),'Candidate includes provider resources or build hooks outside one Worker and ASSETS');
  assert(config.routes===undefined&&config.route===undefined&&config.workers_dev===true&&config.preview_urls===false,'Candidate must be unexposed: no proposed route mutation in this milestone');
  const capacity=assessBundleLimits(inventory.files,plan);
  assert(receipt.serverBytes===capacity.measured.uncompressedWorkerBytes&&receipt.assetFiles===capacity.measured.staticAssetFiles,'Receipt sizes differ from measured file bytes');
  return {directory,receipt,config,inventory,envelope,capacity};
}

/** One bounded git process reads only registered public business-facts paths. */
export function loadFleetIdentities(root,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),{readGit=true}={}) {
  assert(Array.isArray(registry.dealers)&&registry.dealers.length<=2000,'Bounded dealer registry required');
  const records=registry.dealers.map(row=>({slug:row.slug,names:[row.name],phones:[],source:null,factsSource:null,publicSources:[]})),pending=[];
  const merge=(record,facts,source,isFacts=true)=>{
    const value=business(facts),contact=facts.public_business_contact??facts.publicBusinessContact??facts.businessContact??{};
    record.names.push(value.name,value.shortName);record.phones.push(value.phone,value.phoneDisplay,value.phoneHref,value.phoneE164,contact.phone);
    for(const item of Array.isArray(value.phones)?value.phones:[])record.phones.push(typeof item==='string'?item:item?.phone??item?.number??item?.value);
    record.source??=source;if(isFacts)record.factsSource=source;record.publicSources.push(source);
  };
  for(const [index,row] of registry.dealers.entries()){
    assert(slugPattern.test(row.slug??''),'Unsafe registry dealer slug');
    const relative=(row.localPath||'clients/'+row.slug)+'/business-facts.json';
    assert(safeArtifactPath(relative)&&/^(?:clients|dealers)\/[a-z0-9-]+\/business-facts\.json$/.test(relative),'Registry facts path escapes dealer metadata');
    const file=path.join(root,relative);
    if(fs.existsSync(file))merge(records[index],json(inside(root,relative,{mustExist:true})),relative);
    else pending.push({index,relative});
  }
  if(readGit&&pending.length&&fs.existsSync(path.join(root,'.git'))){
    const result=spawnSync('git',['-C',root,'cat-file','--batch'],{input:pending.map(row=>'HEAD:'+row.relative).join('\n')+'\n',encoding:null,maxBuffer:32*1024**2,timeout:180000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'},windowsHide:true});
    if(result.status===0){
      const bytes=result.stdout;let offset=0;
      for(const row of pending){
        const end=bytes.indexOf(10,offset);assert(end>=0,'Truncated public fact metadata response');
        const header=bytes.subarray(offset,end).toString('utf8');offset=end+1;
        if(header.endsWith(' missing'))continue;
        const match=header.match(/^[a-f0-9]{40,64} blob ([0-9]+)$/);assert(match,'Unexpected public fact metadata object');
        const length=Number(match[1]);assert(length<=1024**2&&offset+length<bytes.length,'Public fact metadata exceeds read bound');
        merge(records[row.index],JSON.parse(bytes.subarray(offset,offset+length).toString('utf8')),'HEAD:'+row.relative);offset+=length+1;
      }
    }
  }
  const leadsRoot=path.join(root,'leads');
  if(fs.existsSync(leadsRoot)){
    const names=filesAt(leadsRoot,{filter:(name,directory)=>directory||name.endsWith('.json')});assert(names.length<=2000,'Public lead metadata file bound exceeded');let total=0;
    for(const name of names){
      const file=inside(leadsRoot,name,{mustExist:true}),bytes=fs.readFileSync(file);total+=bytes.length;assert(bytes.length<=4*1024**2&&total<=32*1024**2,'Public lead metadata byte bound exceeded');
      const document=JSON.parse(bytes),rows=Array.isArray(document)?document:Array.isArray(document.leads)?document.leads:name.endsWith('/business-facts.json')?[document]:[];
      assert(rows.length<=2000,'Public lead metadata row bound exceeded');
      for(const row of rows){
        if(!row||typeof row!=='object')continue;
        const matches=registry.dealers.flatMap((dealer,index)=>[row.id,row.dealerId,row.leadId,row.slug].filter(Boolean).some(id=>[dealer.id,dealer.dealerId,dealer.researchId,dealer.slug].includes(id))||row.name&&clean(row.name)===clean(dealer.name)?[index]:[]);
        if(matches.length===1)merge(records[matches[0]],row,'leads/'+name,false);
      }
    }
  }
  // New packs are not yet registry entries. Include their public identities so
  // one new preview cannot accidentally carry another new dealer's data.
  const registered=records.slice(),packFactsDiagnostics=[],packSlugs=[];
  const packsRoot=path.join(root,'dealers');
  if(fs.existsSync(packsRoot)){
    const directories=fs.readdirSync(packsRoot,{withFileTypes:true}).filter(row=>row.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name));
    assert(directories.length<=2000,'Dealer-pack identity scan exceeds its bound');
    for(const directory of directories){
      if(!slugPattern.test(directory.name))continue;
      const relative='dealers/'+directory.name+'/business-facts.json',file=path.join(root,relative);
      if(!fs.existsSync(file))continue;
      try{
        const stat=fs.lstatSync(file);assert(stat.isFile()&&!stat.isSymbolicLink()&&stat.size<=1024**2,'Unsafe or oversized pack business facts');
        const facts=json(inside(root,relative,{mustExist:true})),value=business(facts);
        assert(value&&typeof value==='object'&&typeof value.name==='string'&&value.name.trim(),'Pack business facts have no business name');
        let record=records.find(row=>row.slug===directory.name);
        if(!record){record={slug:directory.name,names:[],phones:[],source:null,factsSource:null,publicSources:[]};records.push(record);}
        merge(record,facts,relative);packSlugs.push(directory.name);
      }catch(error){packFactsDiagnostics.push({slug:directory.name,path:relative,error:error.message});}
    }
  }
  for(const row of records){row.names=[...new Set(row.names.filter(value=>typeof value==='string'&&value.trim()))];row.phones=[...new Set(row.phones.filter(value=>digits(value).length>=7))];}
  return {records,coverage:{registryDealers:registered.length,totalIdentities:records.length,packDealers:packSlugs.length,packSlugs,packFactsDiagnostics,
    withName:registered.filter(row=>row.names.length).length,withBusinessFacts:registered.filter(row=>row.factsSource).length,withPublicIdentityEvidence:registered.filter(row=>row.source).length,withPhone:registered.filter(row=>row.phones.length).length,
    missingBusinessFacts:registered.filter(row=>!row.factsSource).map(row=>row.slug),missingPublicPhone:registered.filter(row=>!row.phones.length).map(row=>row.slug),
    note:'Registered and new-pack public business identities are scanned. Malformed neighboring facts are reported without stopping other packs; missing public phones are not invented.'}};
}

export function findForeignIdentity({text,phones=[],ownSlug,ownFacts,ownStock,fleet,identityContext,additionalText=[]}) {
  const own=business(ownFacts),ownNames=[own.name,own.shortName].filter(Boolean),hits=[];
  // Segmentation is evidence about semantic field boundaries, never permission
  // to omit stock text. Missing or incomplete coverage keeps the strict scan.
  const complete=completeIdentityContext(text,identityContext);
  const segments=[...(complete?identityContext.segments:[{channel:'body',owner:'whole observed text (strict fallback)',text:String(text??'')}]),...additionalText.filter(row=>row&&typeof row.text==='string'&&typeof row.channel==='string'&&typeof row.owner==='string')];
  const context=(segment,name)=>{
    const words=clean(name).split(' ').map(word=>word==='and'?'(?:and|&)':word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    const match=String(segment.text).match(new RegExp(words.join('[^\\p{L}\\p{N}]+'),'iu'));
    const start=Math.max(0,(match?.index??0)-60),end=Math.min(segment.text.length,start+240);
    return {channel:segment.channel,owner:segment.owner,matchedText:match?.[0]??name,text:segment.text.slice(start,end),...(end<segment.text.length||start?{truncated:true}:{})};
  };
  const visiblePhones=textPhones([text,...additionalText.map(row=>row?.text??'')].join('\n'));
  const observedPhones=[...phones,...visiblePhones];
  for(const record of fleet.records){
    if(record.slug===ownSlug)continue;
    for(const name of record.names)if(!ownNames.some(value=>clean(value)===clean(name))){const segment=segments.find(row=>includesNameOutsideOwnName(row.text,name,ownNames)&&!(complete&&sourcedVehicleText(row,ownStock)));if(segment)hits.push({dealer:record.slug,type:'name',value:name,context:context(segment,name)});}
    for(const phone of record.phones)if(!samePhone(phone,own.phone)&&observedPhones.some(value=>samePhone(value,phone)))hits.push({dealer:record.slug,type:'phone',value:phone});
  }
  return hits.filter((row,index)=>hits.findIndex(other=>other.dealer===row.dealer&&other.type===row.type&&other.value===row.value)===index);
}

const placeholders=/\blorem ipsum\b|\bdolor sit amet\b|\byour (?:dealership|dealer name|company name|business name|logo here)\b|\b(?:insert|replace with) (?:dealer|business|company|logo)\b|\bexample@(?:example|email)\./i;
const invalidMileage=/(?:^|[^\p{L}\p{N}_])(?:NaN|[+-]?Infinity)\s*(?:km|mi|км)(?![\p{L}\p{N}_])/u;
const demoDisclosure=/\b(?:demo|sample|illustrative)\b.{0,120}\b(?:stock|listings|inventory|vehicles|cars|dealer)\b|\b(?:stock|listings|inventory|vehicles|cars)\b.{0,120}\b(?:demo|sample|illustrative)\b|демонстрацион|примерни (?:автомобили|обяви)|илюстратив/iu;

export function dealerPackIdentityRequirements(label) {
  assert(['home','home-controls','inventory','detail','contact'].includes(label),'Unknown dealer identity journey');
  return {name:label.startsWith('home'),phone:label==='contact',logo:label.startsWith('home')};
}

/** Inspect observed DOM, not receipt claims or source-only success flags. */
export function assessPageSnapshot({snapshot,facts,stock,manifest,variant,fleet,demoStock=false,requireDisclosure=true,identityRequirements}) {
  const own=business(facts),findings=[];
  const requested=identityRequirements??{name:true,phone:true,logo:true};
  assert(requested&&Object.keys(requested).sort().join(',')==='logo,name,phone'&&Object.values(requested).every(value=>typeof value==='boolean'),'Identity requirements must explicitly name each factual check');
  const visiblePhones=Object.hasOwn(snapshot,'visiblePhones')?snapshot.visiblePhones:(snapshot.phones??[]);
  assert(Array.isArray(visiblePhones),'Visible phone observations must be explicit');
  const pageImages=(snapshot.images??[]).filter(image=>!['fab','switcher'].includes(image.consumer));
  const observed={name:[own.name,own.shortName].filter(Boolean).some(name=>includesName(snapshot.text,name)||pageImages.some(image=>image.visible&&image.loaded&&includesName(image.alt,name))),
    phone:Boolean(own.phone)&&[...visiblePhones,...textPhones(snapshot.text)].some(phone=>samePhone(phone,own.phone)),
    logo:pageImages.some(image=>image.visible&&image.loaded&&image.dealerLogo)};
  const required={...requested,phone:requested.phone&&Boolean(own.phone)};
  if(snapshot.status!==200||!snapshot.contentType?.includes('text/html')||String(snapshot.text??'').trim().length<80)findings.push('route-response');
  for(const key of ['name','phone','logo'])if(required[key]&&!observed[key])findings.push('dealer-'+key);
  if(snapshot.phones?.some(phone=>!own.phone||!samePhone(phone,own.phone)))findings.push('unexpected-business-phone');
  const fabMarks=snapshot.fabMarks??[];
  const fabPolicy=dealerPackFabPolicy(manifest),fleetMark=fabPolicy==='fleet-design-mark-v1';
  if(fabMarks.length!==1||!fabMarks[0].visible||!fabMarks[0].loaded||
    (fleetMark?fabMarks[0].sha256!==fleetDesignFabHashes()[variant.key]:!fabMarks[0].dealerFabLogo))findings.push(fleetMark?'fleet-design-fab-logo':'dealer-fab-logo');
  const choices=snapshot.designChoices??[],expected=manifest.variants;
  let actual;try{actual=new URL(snapshot.url);}catch{}
  const actualOwner=actual&&(expected.find(item=>item.base&&(actual.pathname===item.base||actual.pathname.startsWith(item.base+'/')))?.key??'auto-best');
  if(actualOwner!==variant.key)findings.push('design-route');
  if(choices.length!==6||choices.some((choice,index)=>choice.key!==expected[index]?.key))findings.push('six-design-fab');
  for(const [index,choice] of choices.entries()){
    let url;try{url=new URL(choice.href,snapshot.url);}catch{findings.push('fab-destination');continue;}
    const base=expected[index]?.base,owner=expected.find(item=>item.base&&(url.pathname===item.base||url.pathname.startsWith(item.base+'/')))?.key??'auto-best';
    if(url.origin!==new URL(snapshot.url).origin||owner!==expected[index]?.key||base===undefined)findings.push('fab-destination');
  }
  const admins=snapshot.adminLinks??[];
  if(admins.length!==1)findings.push('shared-admin-link');
  else{let url;try{url=new URL(admins[0].href,snapshot.url);}catch{}if(!url||url.origin!=='https://cars-admin-blue.vercel.app'||url.pathname!=='/'||url.username||url.password||admins[0].target!=='_blank'||!['noopener','noreferrer'].every(value=>admins[0].rel?.split(/\s+/).includes(value)))findings.push('shared-admin-link');}
  const additionalText=[{channel:'metadata',owner:'page title, descriptions and structured data',text:String(snapshot.metadata??'')},
    ...(snapshot.identityLinks??[]),...pageImages.filter(image=>image.visible&&image.alt).map(image=>({channel:'image-alt',owner:'img '+String(image.src).slice(0,100),text:image.alt,...(image.vehicleOwner&&!image.dealerLogo&&!image.dealerFabLogo?{vehicleOwner:image.vehicleOwner,vehiclePhoto:image.src,vehicleHref:image.vehicleHref,vehicleOrigin:image.vehicleOrigin}:{})}))];
  const leakText=completeIdentityContext(snapshot.text,snapshot.identityContext)?snapshot.text:[snapshot.text,snapshot.metadata].join('\n');
  const leaks=findForeignIdentity({text:leakText,identityContext:snapshot.identityContext,additionalText,phones:snapshot.phones,ownSlug:manifest.slug,ownFacts:facts,ownStock:stock,fleet});
  if(leaks.length)findings.push('foreign-dealer-identity');
  if(placeholders.test([snapshot.text,snapshot.metadata].join('\n')))findings.push('placeholder-copy');
  if(invalidMileage.test(snapshot.text??''))findings.push('invalid-mileage-value');
  if(demoStock&&requireDisclosure&&!demoDisclosure.test(snapshot.text))findings.push('demo-stock-disclosure');
  if((snapshot.errors??[]).length)findings.push('browser-runtime-error');
  if((snapshot.brokenImages??[]).length)findings.push('broken-image');
  if(snapshot.overflow>1)findings.push('horizontal-overflow');
  return {key:variant.key,status:findings.length?'failed':'passed',findings:[...new Set(findings)],leaks,
    identity:{policy:identityRequirements?'explicit-route':'strict',required,observed,phoneProvided:Boolean(own.phone)},
    phone:own.phone?(observed.phone?'observed':'not-observed'):'not-provided',demoStock,disclosureObserved:demoDisclosure.test(snapshot.text),title:snapshot.title,url:snapshot.url,httpStatus:snapshot.status};
}

/** Bind each design to its actual three home views and sourced contact journey. */
export function assessDealerPackDesignIdentity({routes,variant,facts}) {
  const homes=routes.filter(row=>row.key===variant.key&&row.label==='home'),contacts=routes.filter(row=>row.key===variant.key&&row.label==='contact'),findings=[];
  const sourcedPhone=Boolean(business(facts).phone);
  if([...homes,...contacts].some(row=>row.identity?.phoneProvided!==sourcedPhone))findings.push('sourced-phone-binding');
  for(const width of [320,390,1280]){
    const rows=homes.filter(row=>row.width===width);
    if(rows.length!==1||rows[0].status!=='passed'||!rows[0].identity?.required.name||!rows[0].identity?.required.logo||!rows[0].identity?.observed.name||!rows[0].identity?.observed.logo)findings.push('home-identity:'+width);
  }
  if(homes.length!==3)findings.push('home-observation-count');
  if(contacts.length!==1||contacts[0].status!=='passed'||sourcedPhone&&(!contacts[0].identity?.required.phone||!contacts[0].identity?.observed.phone))findings.push('contact-identity');
  const evidence=row=>({url:row.url,label:row.label,width:row.width,httpStatus:row.httpStatus,status:row.status,identity:row.identity});
  return {key:variant.key,status:findings.length?'failed':'passed',findings,phone:sourcedPhone?'required-on-contact-journey':'not-provided',homes:homes.map(evidence),contacts:contacts.map(evidence)};
}

function resolveDependency(root,name,override){
  const candidates=[process.env.CARS_QA_RESOLVE_FROM,override&&path.join(override,'package.json'),path.join(root,'runtime/dealer-pack-tools/package.json'),path.join(root,'runtime/varna-tools/package.json'),path.join(root,'templates/karento-best/package.json')].filter(Boolean);
  for(const file of candidates)try{return createRequire(path.resolve(file))(name);}catch(error){if(error.code!=='MODULE_NOT_FOUND'&&error.code!=='ERR_REQUIRE_ESM')throw error;}
  throw Error('Existing '+name+' required; use CARS_'+name.toUpperCase()+'_ROOT or runtime/dealer-pack-tools');
}

const rgb=value=>{assert(/^#[a-f0-9]{6}$/i.test(value??''),'A recorded six-digit surface background is required');return [1,3,5].map(offset=>parseInt(value.slice(offset,offset+2),16));};
const luminance=color=>color.map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};

/** Pixel checks detect empty, opaque, padded and weak assets. They do not OCR spelling. */
export async function inspectLogoPixels(bytes,{sharp,backgrounds,role='onLight',minimumNativeSize=64,smallSizes:requestedSizes=[32,48,64]}={}) {
  const metadata=await sharp(bytes,{limitInputPixels:25*1024**2}).metadata();
  assert(['png','webp'].includes(metadata.format)&&metadata.hasAlpha&&(!metadata.pages||metadata.pages===1),'Logo must be a single transparent PNG/WebP raster');
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let transparent=0,visible=0,left=info.width,top=info.height,right=-1,bottom=-1;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const alpha=data[(y*info.width+x)*info.channels+3];if(alpha===0)transparent++;
    if(alpha>32){visible++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  const bounds={left,top,width:right-left+1,height:bottom-top+1},findings=[];
  if(!visible||transparent/(info.width*info.height)<.05)findings.push('opaque-or-empty');
  const squareRole=['mark','markOnDark','favicon'].includes(role),xFit=bounds.width/info.width,yFit=bounds.height/info.height;
  // A square icon contains the natural mark without stretching letters. Its long
  // axis must fill the tile; balanced bands along the short axis are intentional.
  const cropPass=squareRole?Math.max(xFit,yFit)>=.70&&Math.min(xFit,yFit)>=.35&&Math.abs(left-(info.width-1-right))/info.width<=.08&&Math.abs(top-(info.height-1-bottom))/info.height<=.08
    :xFit>=.70&&yFit>=.60&&Math.max(left,info.width-1-right)/info.width<=.20&&Math.max(top,info.height-1-bottom)/info.height<=.20;
  if(!cropPass)findings.push('excessive-transparent-padding');
  // A horizontal wordmark squeezed into a square is not an independent compact icon.
  if(squareRole&&visible&&bounds.width/bounds.height>1.70||squareRole&&visible&&bounds.height/bounds.width>1.70)findings.push('compact-mark-wordmark-aspect');
  const visibleOccupancy=visible/(info.width*info.height);
  if(squareRole&&visibleOccupancy<.065)findings.push('compact-mark-low-visible-occupancy');
  if(Math.min(info.height,info.width)<minimumNativeSize)findings.push('insufficient-native-resolution');
  if(['mark','markOnDark','favicon'].includes(role)&&Math.abs(info.width/info.height-1)>.1)findings.push('square-mark-shape');
  assert(Array.isArray(backgrounds)&&backgrounds.length&&backgrounds.length<=20,'Recorded surface backgrounds are required: '+role);
  const surfaces=backgrounds.map(background=>{
    const base=rgb(background);let weight=0,good=0,weightedContrast=0;
    for(let i=0;i<data.length;i+=info.channels){const alpha=data[i+3]/255;if(alpha<.6)continue;const painted=[0,1,2].map(channel=>data[i+channel]*alpha+base[channel]*(1-alpha)),ratio=contrast(painted,base);weight+=alpha;weightedContrast+=ratio*alpha;if(ratio>=3)good+=alpha;}
    const value={background,readableInkFraction:weight?good/weight:0,meanContrast:weight?weightedContrast/weight:0};
    if(value.readableInkFraction<.70)findings.push('weak-contrast:'+background);return value;
  });
  const smallSizes=[];
  for(const size of requestedSizes){
    const resized=await sharp(bytes).resize({height:size,withoutEnlargement:true}).ensureAlpha().raw().toBuffer({resolveWithObject:true});let ink=0,strong=0;
    for(let i=3;i<resized.data.length;i+=resized.info.channels){if(resized.data[i]>32)ink++;if(resized.data[i]>=192)strong++;}
    const compactPixels=squareRole?size*size:resized.info.width*resized.info.height;
    const minInk=Math.max(20,Math.ceil(compactPixels*(squareRole?.065:.035)));
    const minStrong=Math.max(10,Math.ceil(compactPixels*(squareRole?.026:.015)));
    const value={height:size,width:resized.info.width,visiblePixels:ink,strongPixels:strong,
      minimumVisiblePixels:minInk,minimumStrongPixels:minStrong,status:ink>=minInk&&strong>=minStrong?'passed':'failed'};
    if(value.status==='failed')findings.push('small-size-'+size);smallSizes.push(value);
  }
  return {status:findings.length?'failed':'passed',role,width:info.width,height:info.height,transparentFraction:transparent/(info.width*info.height),visibleBounds:bounds,cropMode:squareRole?'square-contained-mark':'tight-natural-aspect',visibleOccupancy,surfaces,smallSizes,findings,
    spellingVerified:false,note:'32/48/64 px alpha, mark geometry, occupancy and contrast are technical checks; exact-name spelling and professional art direction require the separate visual review receipt.'};
}

/** Favicon PNG entries are inspected at their actual sizes; no ICO decoder or upscale. */
export function readFaviconPngs(bytes){
  assert(Buffer.isBuffer(bytes)&&bytes.length>=22&&bytes.length<=CLOUDFLARE_BUNDLE_LIMITS.assetBytes&&bytes.readUInt16LE(0)===0&&bytes.readUInt16LE(2)===1,'Invalid PNG favicon container');
  const count=bytes.readUInt16LE(4),header=6+count*16;
  assert(count>=1&&count<=8&&header<=bytes.length,'Invalid favicon image directory');
  const entries=[];let end=header;
  for(let index=0;index<count;index++){
    const at=6+index*16,width=bytes[at]||256,height=bytes[at+1]||256,length=bytes.readUInt32LE(at+8),offset=bytes.readUInt32LE(at+12);
    assert(width===height&&[16,24,32,48,64,128,256].includes(width)&&offset===end&&length>=8&&offset+length<=bytes.length&&!entries.some(row=>row.size===width),'Invalid or overlapping favicon image');
    const png=bytes.subarray(offset,offset+length);assert(png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Favicon entry is not PNG');
    entries.push({size:width,bytes:png});end=offset+length;
  }
  assert(end===bytes.length&&[32,48,64].every(size=>entries.some(row=>row.size===size)),'Favicon needs actual 32, 48 and 64 pixel entries');
  return entries;
}

export async function verifyPackLogoAssets({pack,sharp,bundleRoot}) {
  const contract=pack.branding??json(path.join(pack.directory,'branding/logo-contract.json'));
  assert(contract.schemaVersion===1&&contract.dealer===pack.manifest.slug,'Logo contract belongs to another dealer');
  const roles=['onLight','onDark','onAccent','master','mark','markOnDark','favicon'],results=[];
  const publicRoot=path.join(bundleRoot,'public'),publicFiles=filesAt(publicRoot,{filter:()=>true}),digests=new Map();
  const publicHash=name=>{if(!digests.has(name))digests.set(name,sha256(fs.readFileSync(inside(publicRoot,name,{mustExist:true}))));return digests.get(name);};
  for(const role of roles){
    const asset=contract.assets?.[role]??contract[role];
    const sourcePath=asset?.sourcePath??asset?.path,sourceSha256=asset?.sourceSha256??asset?.sha256;
    assert(asset&&safeArtifactPath(sourcePath)&&hex64(sourceSha256)&&hex64(asset.sha256),'Missing sourced logo role: '+role);
    const bytes=pack.files instanceof Map?pack.files.get(sourcePath):fs.readFileSync(inside(pack.directory,sourcePath,{mustExist:true}));assert(Buffer.isBuffer(bytes)&&sha256(bytes)===sourceSha256,'Logo bytes changed: '+role);
    const backgrounds=asset.backgrounds??contract.surfaceBackgrounds?.[role]??(['onLight','master','mark','favicon'].includes(role)?['#ffffff']:['onDark','markOnDark'].includes(role)?['#111113']:null);
    let result;
    if(role==='favicon'){
      const entries=readFaviconPngs(bytes),native=[];
      for(const {size,bytes:png} of entries){const metadata=await sharp(png).metadata();assert(metadata.width===size&&metadata.height===size,'Favicon dimensions differ from directory');if([32,48,64].includes(size))native.push(await inspectLogoPixels(png,{sharp,backgrounds,role,minimumNativeSize:size,smallSizes:[size]}));}
      result={role,status:native.every(row=>row.status==='passed')?'passed':'failed',findings:[...new Set(native.flatMap(row=>row.findings))],sizes:entries.map(row=>row.size),nativeChecks:native,spellingVerified:false};
    }else result=await inspectLogoPixels(bytes,{sharp,backgrounds,role});
    if(asset.publicPath){
      assert(/^\/(?:dealer-brand|branding)\//.test(asset.publicPath)&&safeArtifactPath(asset.publicPath.slice(1)),'Local public branding path required');
      const publicName=asset.publicPath.slice(1),basename=path.posix.basename(publicName);
      const copies=publicFiles.filter(name=>name===publicName||name.endsWith(asset.publicPath)||
        // The maintained branding adapter preserves the filename under an
        // immutable v2 directory, optionally below a mounted design. The
        // reviewed byte digest below remains the identity boundary.
        (path.posix.basename(name)===basename&&/(?:^|\/)(?:dealer-brand|branding)\/v[1-9][0-9]*-[a-f0-9]{16,64}\/[^/]+$/.test(name)));
      // The composer may share immutable assets between designs; hashes, not six copies, establish identity.
      result.integratedCopies=copies.filter(name=>publicHash(name)===asset.sha256);
      if(!result.integratedCopies.length)result.findings.push('missing-bundle-logo');
      const publicBytes=pack.files instanceof Map?pack.files.get(asset.publicPath.slice(1)):fs.readFileSync(inside(pack.directory,asset.publicPath.slice(1),{mustExist:true}));assert(Buffer.isBuffer(publicBytes)&&sha256(publicBytes)===asset.sha256,'Public logo bytes changed: '+role);
      result.publicQuality=await inspectLogoPixels(publicBytes,{sharp,backgrounds,role});if(result.publicQuality.status!=='passed')result.findings.push('public-logo-quality');
    }else if(['mark','markOnDark','favicon'].includes(role)){
      const supportedHashes=new Set([asset.sha256]);
      if(role!=='favicon')supportedHashes.add(sha256(await sharp(bytes).webp({lossless:true,effort:6}).toBuffer()));
      result.renderedSha256=[...supportedHashes];
      const copies=publicFiles.filter(name=>/(?:^|\/)(?:logo-mark|reviewed-mark|mark-on-|app-icon|favicon)[^/]*\.(?:png|webp|ico)$/.test(name)&&supportedHashes.has(publicHash(name)));
      result.integratedCopies=copies;if(!copies.length)result.findings.push('missing-bundle-logo');
    }else if(role!=='master')result.findings.push('missing-public-logo-path');
    result.status=result.findings.length?'failed':'passed';results.push({...result,sourcePath,sourceSha256,publicPath:asset.publicPath??null,sha256:asset.sha256});
  }
  const qualityDecision=assessLogoQualityDecision({pack,contract});
  if(qualityDecision.status==='passed'){
    try{
      const sheetBytes=pack.files instanceof Map?pack.files.get(qualityDecision.contactSheetPath):
        fs.readFileSync(inside(pack.directory,qualityDecision.contactSheetPath,{mustExist:true}));
      const decoder=sharp(sheetBytes,{limitInputPixels:32*1024**2}),sheet=await decoder.metadata();
      assert(sheet.format==='png'&&sheet.width>=640&&sheet.height>=480&&sheet.width<=6000&&sheet.height<=4000,'Invalid bounded visual contact sheet');
      await decoder.stats(); // Decode actual PNG pixels; an IHDR-only fake cannot satisfy review.
    }catch(error){qualityDecision.findings.push('logo-review-contact-sheet-not-decodable');qualityDecision.status='failed';qualityDecision.visualReviewPerformed=false;}
  }
  return {status:results.every(row=>row.status==='passed')&&qualityDecision.status==='passed'?'passed':'failed',
    technicalStatus:results.every(row=>row.status==='passed')?'passed':'failed',qualityDecision,
    identityStatus:contract.identityStatus??contract.status??contract.approvalStatus??null,creationMethod:contract.creationMethod??null,
    generationReferences:Object.fromEntries(Object.entries(contract.surfaces??{}).map(([role,row])=>[role,row.generation?.generationId??row.generation?.id??null])),visualReview:contract.visualReview??{status:'not-recorded'},roles:results};
}

function localPreviewOrigin(value){
  const url=new URL(value);
  assert(['http:','https:'].includes(url.protocol)&&['127.0.0.1','localhost','[::1]'].includes(url.hostname)&&url.pathname==='/'&&!url.search&&!url.hash&&!url.username&&!url.password,'QA requires a local preview origin without credentials or path');
  return url.origin;
}

async function unusedPort(){
  const socket=net.createServer();await new Promise((resolve,reject)=>{socket.once('error',reject);socket.listen(0,'127.0.0.1',resolve);});
  const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));return port;
}

/** Launch only a local workerd instance, with provider credentials removed. */
export async function startDealerPackPreview({root=ROOT,bundleRoot,wranglerRoot=process.env.CARS_WRANGLER_ROOT}={}) {
  let entry;
  for(const directory of [wranglerRoot,path.join(root,'runtime/dealer-pack-compiler-tools'),path.join(root,'runtime/dealer-pack-tools'),path.join(root,'runtime/varna-tools')].filter(Boolean))try{
    const manifest=createRequire(path.resolve(directory,'package.json')).resolve('wrangler/package.json'),pkg=json(manifest);
    assert(pkg.name==='wrangler'&&typeof pkg.bin?.wrangler==='string','Installed Wrangler has no declared CLI');
    entry=inside(path.dirname(manifest),pkg.bin.wrangler.replace(/^\.\//,''),{mustExist:true});break;
  }catch(error){if(error.code!=='MODULE_NOT_FOUND'&&error.code!=='ERR_PACKAGE_PATH_NOT_EXPORTED')throw error;}
  assert(entry,'Existing Wrangler installation required via CARS_WRANGLER_ROOT or runtime/dealer-pack-compiler-tools');
  const source=fs.realpathSync(bundleRoot),config=json(path.join(source,'wrangler.json'));
  const previewDirectory=fs.mkdtempSync(path.join(path.dirname(source),'.dealer-pack-preview-'));
  // Keep Wrangler's caches outside the sealed artifact; application and asset bytes stay in place.
  const previewConfig={...config,main:path.join(source,'server/worker.mjs'),base_dir:path.join(source,'server'),assets:{...config.assets,directory:path.join(source,'public')}};
  writeJson(path.join(previewDirectory,'wrangler.json'),previewConfig);
  const port=await unusedPort(),origin='http://127.0.0.1:'+port;
  const args=[entry,'dev','--local','--config',path.join(previewDirectory,'wrangler.json'),'--ip','127.0.0.1','--port',String(port),'--persist-to',path.join(previewDirectory,'state')];
  const child=spawn(process.execPath,args,{cwd:previewDirectory,env:{...noProviderEnv(process.env),WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_SANITIZE:'true',NO_COLOR:'1'},stdio:['ignore','pipe','pipe'],windowsHide:true});
  let log='',error;const append=bytes=>{log=(log+bytes.toString('utf8')).slice(-10000);};child.stdout.on('data',append);child.stderr.on('data',append);child.on('error',value=>{error=value;});
  const close=async()=>{
    if(child.exitCode===null&&!child.killed){child.kill('SIGTERM');await Promise.race([new Promise(resolve=>child.once('exit',resolve)),new Promise(resolve=>setTimeout(resolve,2000))]);if(child.exitCode===null)child.kill('SIGKILL');}
    fs.rmSync(previewDirectory,{recursive:true,force:true});
  };
  try{
    const deadline=Date.now()+60000;
    while(Date.now()<deadline){
      if(error||child.exitCode!==null)throw Error('Local Wrangler could not start: '+(error?.message??log.replace(/\x1b\[[0-9;]*m/g,'').slice(-1800)));
      try{await fetch(origin+'/favicon.ico',{signal:AbortSignal.timeout(1000)});return {origin,close,kind:'owned-local-wrangler',command:'wrangler dev --local --config <temporary config referencing sealed bundle> --ip 127.0.0.1'};}catch{}
      await new Promise(resolve=>setTimeout(resolve,200));
    }
    throw Error('Local Wrangler did not become ready within 60 seconds');
  }catch(error){await close();throw error;}
}

/** Follow the native first-visit dismissal controls without changing locale. */
export async function completeDealerPackWelcome(page,variant) {
  assert(SIX_DESIGN_KEYS.includes(variant.key),'Unknown native welcome design');
  const documentLocale=await page.locator('html').getAttribute('lang'),locale=/^(en|bg)(?:-|$)/.exec(documentLocale??'')?.[1];
  assert(locale,'Unsupported native document locale: '+documentLocale);
  const actions=[];
  if(['auto-best','modern','import'].includes(variant.key)){
    try{
      await page.locator('dialog[data-locale-dialog][data-locale-ready="true"]').waitFor({state:'attached',timeout:15000});
    }catch(error){
      // A closed, hydrated dialog is valid; absent/unhydrated markup is not.
      // Retain its actual state rather than losing hydration failures to a
      // generic journey timeout. This never dismisses or bypasses an unready UI.
      const state=await page.evaluate(()=>({url:location.href.slice(0,2048),documentLocale:document.documentElement.lang,readyState:document.readyState,
        dialogCount:document.querySelectorAll('dialog[data-locale-dialog]').length,
        dialogs:[...document.querySelectorAll('dialog[data-locale-dialog]')].slice(0,4).map(dialog=>({ready:dialog.getAttribute('data-locale-ready'),open:dialog.open,visible:dialog.checkVisibility()}))
      })).catch(observationError=>({observationError:observationError.message}));
      const failure={design:variant.key,...state};
      throw Object.assign(new Error('Native locale readiness failed: '+error.message+'; state='+JSON.stringify(failure),{cause:error}),{nativeWelcome:failure});
    }
    const dialog=page.locator('dialog[data-locale-dialog][open]');
    if(await dialog.isVisible()){
      const label=locale==='bg'?'Не сега':'Not now';
      await dialog.getByRole('button',{name:label,exact:true}).click({timeout:10000});
      await dialog.waitFor({state:'hidden',timeout:10000});
      actions.push({control:'native-locale-dialog',action:'dismiss',label});
    }
  }
  if(variant.key==='app'&&await dismissAppWelcome(page,locale))actions.push({control:'native-app-welcome',action:'dismiss',label:locale==='bg'?'Затвори приветствието':'Close welcome'});
  assert(!await page.locator('dialog[data-locale-dialog][open]').isVisible()&&!await page.locator('[data-welcome-sheet][role="dialog"]').isVisible(),'Native welcome still blocks the visitor journey');
  const after=await page.locator('html').getAttribute('lang');assert(after===documentLocale,'Welcome dismissal changed the document locale');
  return {status:'passed',documentLocale,locale,actions,localeChanged:false};
}

/** Screenshot visitation is bounded by the viewport and every ancestor scroll clip. */
export function readDealerPackViewportImages({requireComplete=false,visited}={}) {
  const elements=[...document.images].filter(image=>{
    const r=image.getBoundingClientRect(),clip={left:Math.max(0,r.left),right:Math.min(innerWidth,r.right),top:Math.max(0,r.top),bottom:Math.min(innerHeight,r.bottom)};
    if(r.width<=0||r.height<=0||clip.right<=clip.left||clip.bottom<=clip.top)return false;
    for(let node=image;node;node=node.parentElement??node.getRootNode?.().host){
      const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return false;
      if(node===image)continue;
      const clipX=/^(?:hidden|clip|auto|scroll)$/.test(style.overflowX),clipY=/^(?:hidden|clip|auto|scroll)$/.test(style.overflowY);
      if(!clipX&&!clipY)continue;
      const bounds=node.getBoundingClientRect();
      if(clipX){clip.left=Math.max(clip.left,bounds.left);clip.right=Math.min(clip.right,bounds.right);}
      if(clipY){clip.top=Math.max(clip.top,bounds.top);clip.bottom=Math.min(clip.bottom,bounds.bottom);}
      if(clip.right<=clip.left||clip.bottom<=clip.top)return false;
    }
    return true;
  }).filter(image=>image.currentSrc||image.src);
  if(visited)for(const image of elements)visited.add(image);
  const images=elements.map(image=>({src:image.currentSrc||image.src,complete:image.complete,loaded:image.complete&&image.naturalWidth>0}));
  return requireComplete?images.every(image=>image.complete):images;
}

/** Trigger native lazy loading with bounded visitor scrolling before a full-page capture. */
export async function prepareDealerPackScreenshot(page,{maxSteps=80,imageWaitMs=2500}={}) {
  assert(Number.isInteger(maxSteps)&&maxSteps>0&&maxSteps<=80&&Number.isInteger(imageWaitMs)&&imageWaitMs>0&&imageWaitMs<=5000,'Invalid screenshot preparation bound');
  await page.waitForFunction(()=>!document.fonts||document.fonts.status==='loaded',null,{timeout:5000});
  const geometry=()=>page.evaluate(()=>({top:scrollY,height:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),viewport:innerHeight,width:innerWidth}));
  // Keep exact DOM element identity in a private Playwright handle. Responsive
  // duplicates may share a URL without ever entering this visitor's viewport.
  const visited=await page.evaluateHandle(()=>new Set());
  try{
  let current=await geometry(),steps=0,imageWaitTimeouts=0,reachedBottom=false;
  await page.mouse.move(Math.max(1,Math.floor(current.width/2)),Math.max(1,Math.floor(current.viewport/2)));
  if(current.top>1){await page.mouse.wheel(0,-current.height-current.viewport);await page.waitForFunction(()=>scrollY<=1,null,{timeout:3000});}
  for(;steps<maxSteps;steps++){
    // A native wheel turn gives IntersectionObserver/lazy-loading a rendering
    // opportunity. Only images actually encountered in the viewport are awaited.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.evaluate(readDealerPackViewportImages,{visited});
    try{await page.waitForFunction(readDealerPackViewportImages,{requireComplete:true,visited},{timeout:imageWaitMs});}catch{imageWaitTimeouts++;}
    current=await geometry();
    if(current.top+current.viewport>=current.height-1){reachedBottom=true;break;}
    await page.mouse.wheel(0,Math.max(120,Math.floor(current.viewport*0.75)));
    await page.waitForFunction(previous=>scrollY>previous+1||scrollY+innerHeight>=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-1,current.top,{timeout:3000});
  }
  assert(reachedBottom,'Home screenshot exceeds the bounded visitor scroll');
  await page.mouse.wheel(0,-current.height-current.viewport);
  await page.waitForFunction(()=>scrollY<=1,null,{timeout:3000});
  const images=await page.evaluate(elements=>[...elements].map(image=>({src:image.currentSrc||image.src,complete:image.complete,loaded:image.complete&&image.naturalWidth>0})),visited);
  const pending=images.filter(image=>!image.complete),failed=images.filter(image=>image.complete&&!image.loaded);
  return {status:pending.length?'failed':'passed',scrollSteps:steps+1,fonts:'loaded',returnedToTop:true,imageWaitTimeouts,encounteredImages:images.length,loadedImages:images.filter(image=>image.loaded).length,
    pendingImages:pending.map(image=>imageSourceEvidence(image.src)),failedImages:failed.map(image=>imageSourceEvidence(image.src)),note:'Only encountered image elements were awaited; actual image errors remain separate from pending lazy loads.'};
  }finally{await visited.dispose();}
}

export function readDealerPackDom() {
    const roots=[document];for(let i=0;i<roots.length;i++)for(const element of roots[i].querySelectorAll('*'))if(element.shadowRoot)roots.push(element.shadowRoot);
    const all=selector=>roots.flatMap(root=>[...root.querySelectorAll(selector)]);
    const visible=element=>{const r=element.getBoundingClientRect();if(!element.getClientRects().length||r.width<=0||r.height<=0)return false;for(let node=element;node;node=node.parentElement??node.getRootNode?.().host){const style=getComputedStyle(node);if(style.visibility==='hidden'||style.display==='none'||style.opacity==='0')return false;}return true;};
    const vehicleContracts=[
      {kind:'modern',card:'article[data-slot="vehicle-card"]',title:'[data-slot="vehicle-card-title"]',photo:'[data-slot="vehicle-card-media"] img',link:'a[data-slot="vehicle-card-content"]'},
      {kind:'auto-best',card:'article.dn-vehicle-card',title:'.dn-vehicle-card__name',photo:'.dn-vehicle-card__image img',link:'a.dn-vehicle-card__link'},
      {kind:'auto-best',card:'a.dn-detail-related-card',title:'.dn-detail-related-card > span > strong',photo:'.dn-detail-related-card > img'},
      {kind:'import',card:'.card-box.card-box-style-1',title:'.card-box__title > a',photo:'.image img',facts:'.daynight-card-specs'},
      {kind:'import',card:'a.mobile-vehicle-card',title:'.mobile-vehicle-card__body > h2',photo:'.mobile-vehicle-card__image img',facts:'.mobile-vehicle-card__body > ul[aria-label]'},
      {kind:'import-site',card:'article.site-vehicle-card',title:'.site-vehicle-card__body > h2 > a',photo:'.site-vehicle-card__media img',facts:'.site-vehicle-card__metadata'},
      {kind:'signature',card:'.card-journey-small',title:'.card-info .card-title > a',photo:'.card-image img',facts:'.card-program'},
      {kind:'signature',card:'article.discovery-card',title:'.car-copy > h3',photo:'.car-photo img',facts:'.car-meta'},
      {kind:'signature-mobile',card:'article.mobile-vehicle-card',title:'.mobile-vehicle-title',photo:'.mobile-vehicle-photo img',facts:'.mobile-vehicle-facts'},
    ];
    const nativeVehicle=(element,role)=>{
      if(element.closest?.('header,footer,nav'))return null;
      for(const contract of vehicleContracts){
        const card=element.closest?.(contract.card);if(!card||contract.facts&&!card.querySelector(contract.facts))continue;
        const title=card.querySelector(contract.title);if(!title)continue;
        const link=title.closest('a')??(contract.link&&card.querySelector(contract.link));if(!link)continue;
        let href;try{href=new URL(link.getAttribute('href'),location.href);}catch{continue;}
        if(href.origin!==new URL(location.href).origin||!(/\/(?:listing|inventory|listing-detail-v1)\/[^/]+\/?$/.test(href.pathname)||/\/vehicle\/?$/.test(href.pathname)&&Boolean(href.searchParams.get('id'))))continue;
        if(role==='title'&&!element.matches(contract.title)||role==='photo'&&!element.matches(contract.photo))continue;
        if(role==='link'){let actual;try{actual=new URL(element.getAttribute('href'),location.href);}catch{continue;}if(actual.href!==href.href)continue;}
        if(role==='photo'){let src;try{src=new URL(element.currentSrc||element.src,location.href);}catch{continue;}if(src.origin!==href.origin)continue;}
        return {vehicleOwner:contract.kind,vehicleHref:href.href,vehicleOrigin:href.origin};
      }
      return null;
    };
    const images=all('img').map(element=>{const inSwitcher=element.getRootNode?.().host?.tagName==='DEALER-DESIGN-SWITCHER',bounds=element.getBoundingClientRect();return {src:element.currentSrc||element.src,alt:element.alt,visible:visible(element),complete:element.complete,loaded:element.complete&&element.naturalWidth>0,width:element.width,height:element.height,
      bounds:{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height},
      consumer:inSwitcher?(element.closest('button.fab')?'fab':'switcher'):'page',...nativeVehicle(element,'photo')};});
    const text=[document.body.innerText,...roots.slice(1).flatMap(root=>[...root.children].filter(visible).map(element=>element.innerText??''))].join('\n');
    const metadata=[document.title,...all('meta[name="description"],meta[property^="og:"]').map(element=>element.content),...all('script[type="application/ld+json"]').map(element=>element.textContent)].join('\n');
    const owner=element=>[element.tagName?.toLowerCase(),element.id?'#'+element.id:'',typeof element.className==='string'?'.'+element.className.trim().split(/\s+/).slice(0,3).join('.'):''].join('').slice(0,160);
    const identityLinks=all('a').filter(visible).flatMap(element=>['aria-label','title','href'].map(attribute=>({channel:'link-'+attribute,owner:owner(element),text:element.getAttribute(attribute)??'',...nativeVehicle(element,'link')})).filter(row=>row.text));
    let identityContext;
    try{
      const factSelector='[data-slot="vehicle-card-spec-pills"] > [data-slot="vehicle-card-spec"],[data-slot="showroom-vehicle-facts"] > li[data-fact],.dn-vehicle-card__specs > .dn-vehicle-card__spec,.dn-vehicle-card__mobile-meta > .dn-vehicle-card__fact,.mobile-vehicle-card ul[aria-label] > li,.site-vehicle-card__metadata > ul > li,.daynight-card-specs > li';
      const segments=[];let pending='';
      const flush=()=>{if(pending.trim())segments.push({channel:'body',owner:'body outside native vehicle-fact fields',text:pending});pending='';};
      const visit=node=>{
        if(node.nodeType===3){pending+=node.nodeValue??'';return;}
        if(node.nodeType!==1)return;
        if(['SCRIPT','STYLE','TEMPLATE','NOSCRIPT'].includes(node.tagName))return;
        const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden')return;
        // A closed native disclosure renders its first direct summary, not its hidden contents.
        if(node.tagName==='DETAILS'&&!node.open){const summary=[...node.children].find(child=>child.tagName==='SUMMARY');if(summary)visit(summary);return;}
        const vehicle=nativeVehicle(node,'title');
        if(vehicle){
          if(node.querySelector('header,footer,nav,h1,h2,h3')||node.querySelector('a')&&node.tagName!=='A')throw Error('Unexpected nested content in a native vehicle title');
          flush();segments.push({channel:'vehicle-title',owner:owner(node),text:node.innerText,...vehicle});return;
        }
        if(node.matches(factSelector)){
          if(node.querySelector(factSelector)||node.querySelector('a,header,footer,nav,h1,h2,h3'))throw Error('Unexpected nested content in a native vehicle fact');
          flush();segments.push({channel:'vehicle-fact',owner:owner(node),text:node.innerText});return;
        }
        const block=/^(?:block|flex|grid|list-item|table|table-row|table-cell|flow-root)$/.test(style.display);
        if(block||node.tagName==='BR')pending+='\n';
        for(const child of node.childNodes)visit(child);
        if(block)pending+='\n';
      };
      visit(document.body);flush();
      for(const shadow of roots.slice(1))for(const element of [...shadow.children].filter(visible)){visit(element);flush();}
      const normalize=value=>String(value??'').replace(/\s+/g,' ').trim();
      identityContext={schemaVersion:1,status:segments.length>0&&segments.length<=4096&&normalize(segments.map(row=>row.text).join('\n'))===normalize(text)?'complete':'incomplete',segments};
    }catch(error){identityContext={schemaVersion:1,status:'unavailable',reason:String(error.message).slice(0,180)};}
    return {url:location.href,title:document.title,text,metadata,images,identityContext,identityLinks,phones:[...new Set(all('a[href^="tel:"]').map(element=>element.getAttribute('href')))],
      visiblePhones:[...new Set(all('a[href^="tel:"]').filter(visible).map(element=>element.getAttribute('href')))],
      designChoices:all('a[data-design-key]:not([data-home-id])').map(element=>({key:element.getAttribute('data-design-key'),href:element.getAttribute('href')})),
      adminLinks:all('a[data-cars-admin]').map(element=>({href:element.getAttribute('href'),target:element.getAttribute('target'),rel:element.getAttribute('rel')})),
      brokenImages:images.filter(image=>image.visible&&image.complete&&!image.loaded&&image.src).map(image=>image.src),overflow:document.documentElement.scrollWidth-innerWidth};
}

/** Match actual rendered bytes; filenames or a valid logo elsewhere are insufficient. */
export async function observeDealerPackImages(images,{origin,logoHashes,fabLogoHashes,logoPaths,imageDigests=new Map(),fetchImage=fetch}) {
  for(const image of images){
    image.dealerLogo=false;image.dealerFabLogo=false;image.sha256=null;
    if(!image.visible||!image.loaded)continue;
    let digest=null;
    if(image.src.startsWith('data:')){
      const match=image.src.length<=Math.ceil(CLOUDFLARE_BUNDLE_LIMITS.assetBytes/3)*4+64&&/^data:image\/(?:png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image.src);
      if(match){const bytes=Buffer.from(match[1],'base64');if(bytes.length<=CLOUDFLARE_BUNDLE_LIMITS.assetBytes&&bytes.toString('base64').replace(/=+$/,'')===match[1].replace(/=+$/,''))digest=sha256(bytes);}
    }else{
      let target;try{target=new URL(image.src,origin);if(target.searchParams.has('url'))target=new URL(target.searchParams.get('url'),target);}catch{continue;}
      if(target.origin!==origin||!['http:','https:'].includes(target.protocol)||image.consumer!=='fab'&&!logoPaths.has(target.pathname))continue;
      if(!imageDigests.has(target.href)){
        try{const response=await fetchImage(target,{signal:AbortSignal.timeout(10000)});const bytes=Buffer.from(await response.arrayBuffer());imageDigests.set(target.href,response.ok&&bytes.length<=CLOUDFLARE_BUNDLE_LIMITS.assetBytes?sha256(bytes):null);}catch{imageDigests.set(target.href,null);}
      }
      digest=imageDigests.get(target.href);
    }
    image.sha256=digest;image.dealerLogo=logoHashes.has(digest);image.dealerFabLogo=image.consumer==='fab'&&fabLogoHashes.has(digest);
  }
  return images;
}

const imageSourceEvidence=src=>src.startsWith('data:')?src.slice(0,src.indexOf(',')+1)+'[omitted]':src;
const imageEvidence=image=>({src:imageSourceEvidence(image.src),alt:image.alt,consumer:image.consumer,visible:image.visible,loaded:image.loaded,width:image.width,height:image.height,bounds:image.bounds,sha256:image.sha256,dealerLogo:image.dealerLogo,dealerFabLogo:image.dealerFabLogo});

async function pageSnapshot(page,response,branding,imageDigests,errors){
  const value=await page.evaluate(readDealerPackDom);
  await observeDealerPackImages(value.images,{origin:new URL(value.url).origin,...branding,imageDigests});
  return {...value,fabMarks:value.images.filter(image=>image.consumer==='fab').map(imageEvidence),status:response?.status()??null,contentType:response?.headers()['content-type']??'',errors:[...errors]};
}

export function stockIsDemo(pack){
  const value=pack.stock?.inventoryMode??pack.stock?.mode??pack.stock?.kind??pack.manifest.inventory?.mode??pack.manifest.inventoryMode;
  return /demo|illustrative/i.test(String(value))||pack.stock?.demo===true||[...(pack.stock?.items??[]),...(pack.stock?.records??[])].some(row=>row.demo===true||/demo|illustrative/i.test(row.inventoryMode??row.kind??''));
}

export async function verifyDealerPack({root=ROOT,slug,bundleRoot,plan,previewUrl,reportPath,screenshotDir,sharp,chromium,pack,registry,fleet,startPreview=startDealerPackPreview}={}) {
  assert(slugPattern.test(slug??''),'Exact dealer slug required');
  assert(['free','paid'].includes(plan),'Choose an explicit target plan: free or paid');
  bundleRoot=path.resolve(bundleRoot??path.join(root,'runtime/dealer-packs',slug,'bundle'));
  reportPath=path.resolve(reportPath??path.join(path.dirname(bundleRoot),'qa-report.json'));
  screenshotDir=path.resolve(screenshotDir??path.join(path.dirname(bundleRoot),'screenshots'));
  const report={schemaVersion:1,type:'cars-dealer-pack-qa',slug,success:false,startedAt:new Date().toISOString(),checks:[],routes:[],proof:{screenshots:[]},providerWrites:0,hostedVerified:false,ownerAccepted:false};
  const check=(id,status,details)=>report.checks.push({id,status,details});let preview,browser;
  try{
    if(!pack){const {loadPreparedDealerPack}=await import('./prepare-dealer-pack-logo.mjs');pack=await loadPreparedDealerPack(root,slug);}
    assert(pack.manifest.slug===slug,'Pack belongs to another dealer');assertSixDesignSelection(pack.manifest.variants);
    const context=inspectDealerPackBundle({bundleRoot,slug,packDigest:pack.packDigest,releaseDigest:pack.releaseDigest??pack.manifest.releaseDigest,sourceReleases:pack.manifest.templateSources,plan});
    report.packDigest=context.receipt.packDigest;report.releaseDigest=context.receipt.releaseDigest;report.outputDigest=context.receipt.outputDigest;report.execution=context.receipt.execution;
    if(context.receipt.packCompositionDigest!==undefined)report.packCompositionDigest=context.receipt.packCompositionDigest;
    report.qualification={sourcePublicationVerified:false,hostedVerified:false,ownerAccepted:false,candidate:context.receipt.qualification??null,note:'Passing automated QA does not approve or publish a template release.'};
    report.capacity=context.capacity;check('bundle-integrity','passed',{files:context.inventory.files.length,outputDigest:report.outputDigest});check('cloudflare-limits',context.capacity.status,context.capacity);
    if(!fleet)fleet=loadFleetIdentities(root,registry);
    report.identityCoverage=fleet.coverage;check('fleet-contact-coverage',fleet.coverage.withName===fleet.coverage.registryDealers?'passed':'failed',{
      ...fleet.coverage,phoneCoverageComplete:fleet.coverage.withPhone===fleet.coverage.registryDealers,
      enforcement:'Every registry name and every retained public business phone are scanned. Every rendered tel: link must also match this pack’s sourced phone; missing historical phones remain an explicit coverage limit.'});
    sharp??=resolveDependency(root,'sharp',process.env.CARS_SHARP_ROOT);
    report.logoQuality=await verifyPackLogoAssets({pack,sharp,bundleRoot});check('logo-assets',report.logoQuality.status,report.logoQuality);
    if(!chromium)({chromium}=resolveDependency(root,'playwright',process.env.CARS_PLAYWRIGHT_ROOT));
    preview=previewUrl?{origin:localPreviewOrigin(previewUrl),kind:'caller-supplied-local-preview',close:async()=>{}}:await startPreview({root,bundleRoot});
    report.preview={origin:preview.origin,kind:preview.kind,command:preview.command??null};
    browser=await chromium.launch({headless:true});fs.mkdirSync(screenshotDir,{recursive:true});
    const demoStock=stockIsDemo(pack),imageDigests=new Map();
    const roleHashes=row=>[row.sha256,row.sourceSha256,...(row.renderedSha256??[])].filter(hex64);
    const logoHashes=new Set(report.logoQuality.roles.flatMap(roleHashes));
    const fabLogoHashes=new Set(dealerPackFabPolicy(pack.manifest)==='fleet-design-mark-v1'?Object.values(fleetDesignFabHashes()):report.logoQuality.roles.filter(row=>['onLight','mark'].includes(row.role)).flatMap(roleHashes));
    report.fabPolicy=dealerPackFabPolicy(pack.manifest);
    const logoPaths=new Set(context.inventory.files.filter(row=>row.path.startsWith('public/')&&logoHashes.has(row.sha256)).map(row=>'/'+row.path.slice('public/'.length)));
    const branding={logoHashes,fabLogoHashes,logoPaths};
    for(const variant of pack.manifest.variants){
      const page=await browser.newPage({viewport:{width:390,height:900}}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      // No enquiry, analytics POST, provider mutation or other form submission can leave QA.
      await page.route('**/*',route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
      const navigate=async(href,label,{screenshot=false,width=390,requireDisclosure=false}={})=>{
        const url=new URL(href,preview.origin);assert(url.origin===preview.origin,'Journey escaped local preview');
        errors.length=0;const response=await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});
        await page.locator('dealer-design-switcher').waitFor({state:'attached',timeout:15000}).catch(()=>{});
        const welcome=await completeDealerPackWelcome(page,variant);
        const screenshotPreparation=screenshot?await prepareDealerPackScreenshot(page):null;
        if(screenshotPreparation?.status==='failed')check('screenshot-readiness:'+variant.key+':'+width,'failed',screenshotPreparation);
        const snapshot=await pageSnapshot(page,response,branding,imageDigests,errors);
        const result=assessPageSnapshot({snapshot,facts:pack.facts,stock:pack.stock,manifest:pack.manifest,variant,fleet,demoStock,requireDisclosure,identityRequirements:dealerPackIdentityRequirements(label)});
        result.label=label;result.width=width;result.welcome=welcome;
        if(screenshotPreparation)result.screenshotPreparation=screenshotPreparation;
        result.logoImages=snapshot.images.filter(image=>image.dealerLogo&&image.consumer==='page').map(imageEvidence);result.fabMarks=snapshot.fabMarks;
        result.brandingImageObservations=snapshot.images.filter(image=>image.consumer==='page'&&(image.dealerLogo||includesName(image.alt,business(pack.facts).name)||/logo|branding|dealer-brand|reviewed-mark|mark-on-/.test(image.src))).slice(0,24).map(imageEvidence);
        result.runtimeErrors=snapshot.errors.slice(0,20).map(value=>value.slice(0,1600));result.brokenImages=snapshot.brokenImages.slice(0,50).map(imageSourceEvidence);
        if(new URL(snapshot.url).origin!==preview.origin){result.findings.push('redirected-away-from-preview');result.status='failed';}
        if(screenshot){const filename=variant.key+'-'+width+'-'+label+'.png',file=path.join(screenshotDir,filename);await page.screenshot({path:file,fullPage:true,animations:'disabled',timeout:30000});report.proof.screenshots.push({key:variant.key,width,route:label,path:path.relative(path.dirname(reportPath),file).replaceAll(path.sep,'/'),sha256:sha256(fs.readFileSync(file))});}
        report.routes.push(result);writeJson(reportPath,report);return result;
      };
      try{
        for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});await navigate(variant.entry,'home',{screenshot:true,width});}
        await page.setViewportSize({width:390,height:900});await navigate(variant.entry,'home-controls');
        const button=page.locator('dealer-design-switcher button.fab');let interaction;
        try{await button.click({timeout:10000});const panel=page.locator('dealer-design-switcher #choices');const inView=await panel.evaluate(element=>{const r=element.getBoundingClientRect();return !element.hidden&&r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;});await page.keyboard.press('Escape');interaction={opened:inView,dismissed:await button.getAttribute('aria-expanded')==='false',focusReturned:await button.evaluate(element=>element.getRootNode().activeElement===element)};}
        catch(error){interaction={error:error.message};}
        check('fab-interaction:'+variant.key,interaction.opened&&interaction.dismissed&&interaction.focusReturned?'passed':'failed',interaction);
        const journeys=previewJourney(pack.manifest,variant);
        await navigate(journeys.inventory,'inventory',{requireDisclosure:true});
        const links=await page.locator('a[href]').evaluateAll(items=>items.map(element=>element.getAttribute('href')));
        const detail=previewDetail(links,page.url(),journeys.detail);
        if(detail)await navigate(new URL(detail,page.url()).href,'detail',{requireDisclosure:true});
        else check('stock-detail:'+variant.key,'failed','No public stock detail link from inventory');
        await navigate(journeys.contact,'contact');
      }catch(error){check('browser:'+variant.key,'failed',error.message);}
      finally{await page.close();}
    }
    check('rendered-routes',report.routes.length>=36&&report.routes.every(row=>row.status==='passed')?'passed':'failed',{observations:report.routes.length,failed:report.routes.filter(row=>row.status!=='passed').map(row=>({key:row.key,label:row.label,width:row.width,findings:row.findings}))});
    report.designIdentities=pack.manifest.variants.map(variant=>assessDealerPackDesignIdentity({routes:report.routes,variant,facts:pack.facts}));
    check('design-identities',report.designIdentities.every(row=>row.status==='passed')?'passed':'failed',{designs:report.designIdentities.length,failed:report.designIdentities.filter(row=>row.status!=='passed').map(row=>({key:row.key,findings:row.findings}))});
    check('screenshots',report.proof.screenshots.length===18?'passed':'failed',{count:report.proof.screenshots.length,widths:[320,390,1280],role:'Evidence for visual review; not a visual acceptance claim.'});
    // The positive review must pin EVERY screenshot captured by this run.
    // Pre-flight source checks cannot infer visual quality from a prior logo hash.
    report.logoVisualReview=assessLogoQualityDecision({pack,screenshots:report.proof.screenshots});
    check('logo-visual-review',report.logoVisualReview.status,report.logoVisualReview);
    const after=inspectDealerPackBundle({bundleRoot,slug,packDigest:report.packDigest,releaseDigest:report.releaseDigest,plan});
    check('bundle-unchanged',after.receipt.outputDigest===report.outputDigest&&after.receipt.packCompositionDigest===report.packCompositionDigest?'passed':'failed',{outputDigest:after.receipt.outputDigest,packCompositionDigest:after.receipt.packCompositionDigest});
    report.success=report.checks.every(row=>row.status==='passed');
  }catch(error){check('verification','failed',error.message);}
  finally{
    for(const [name,resource] of [['browser',browser],['preview',preview]])if(resource)try{await resource.close();}catch(error){check('cleanup:'+name,'failed',error.message);report.success=false;}
    report.finishedAt=new Date().toISOString();report.elapsedMs=Date.parse(report.finishedAt)-Date.parse(report.startedAt);writeJson(reportPath,report);
  }
  return report;
}

export function parseDealerPackVerificationArgs(argv){
  const names={'--slug':'slug','--bundle':'bundleRoot','--plan':'plan','--preview-url':'previewUrl','--report':'reportPath','--screenshots':'screenshotDir'},result={};
  for(let i=0;i<argv.length;i++){const key=argv[i];assert(names[key]&&argv[i+1]&&!argv[i+1].startsWith('--')&&!Object.hasOwn(result,names[key]),'Unknown, repeated or incomplete option: '+key);result[names[key]]=argv[++i];}
  assert(slugPattern.test(result.slug??'')&&['free','paid'].includes(result.plan),'Use --slug SLUG --plan free|paid [--bundle DIRECTORY]');
  if(result.previewUrl)localPreviewOrigin(result.previewUrl);return result;
}

if(isEntrypoint(import.meta.url)){
  if(process.argv.includes('--help'))console.log('Usage: node scripts/verify-dealer-pack.mjs --slug SLUG --plan free|paid [--bundle runtime/dealer-packs/SLUG/bundle] [--preview-url http://127.0.0.1:PORT] [--report PATH] [--screenshots DIRECTORY]\nRuns byte, public-identity, raster, six-design browser and platform-budget checks. Starts local Wrangler when no preview URL is given; no provider writes or form submissions. Reports unknown plan/hosted/owner acceptance honestly.');
  else try{const result=await verifyDealerPack(parseDealerPackVerificationArgs(process.argv.slice(2)));console.log(JSON.stringify({slug:result.slug,success:result.success,checks:result.checks.map(({id,status,details})=>({id,status,...(status==='failed'?{failure:(typeof details==='string'?details:JSON.stringify(details)??'No failure details').slice(0,1600)}:{})})),elapsedMs:result.elapsedMs},null,2));process.exitCode=result.success?0:1;}catch(error){console.error(error.message);process.exitCode=1;}
}
