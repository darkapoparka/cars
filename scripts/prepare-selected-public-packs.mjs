/** Prepare only the two reviewed original-logo/source cohorts. No ref/ledger/provider writes. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {ROOT} from './lib/workflow.mjs';
import {readPackFiles,encodePackJson} from './lib/dealer-pack.mjs';
import {importPublicStock,draftInventoryCopy} from './draft-dealer-pack.mjs';
import {prepareDealerPackLogo,loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';
import {reviewDealerPack} from './review-dealer-pack.mjs';
import {checkDealerPackInputs} from './check-dealer-pack-inputs.mjs';
import {inspectLogoPixels,readFaviconPngs} from './verify-dealer-pack.mjs';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hash=b=>createHash('sha256').update(b).digest('hex');
const blob=b=>createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const out=path.join(ROOT,'runtime/public-prepared-packs');fs.mkdirSync(out,{recursive:true});
const toolPackage=process.env.CARS_DEALER_PACK_TOOL_PACKAGE;
const sharp=createRequire(path.resolve(toolPackage))('sharp');sharp.concurrency(1);sharp.cache(false);
assert(process.env.GITHUB_REPOSITORY==='darkapoparka/cars'&&process.env.GITHUB_REF==='refs/heads/astra/source-prep','Exact isolated source preparation context required');
assert(!process.env.CLOUDFLARE_API_TOKEN,'Provider credentials forbidden during source preparation');
const sourceParent='381c78e238d20f2c60d3988bcf17191e27875eb7';
const save=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.isBuffer(value)?value:encodePackJson(value));};
async function publicRead(url,maximum=6*1024**2){
 const u=new URL(url);assert(u.protocol==='https:'&&!u.username&&!u.password,'Public HTTPS source required');
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)});assert(response.ok,'Public source HTTP '+response.status+': '+u.hostname);
 const bytes=Buffer.from(await response.arrayBuffer());assert(bytes.length>0&&bytes.length<=maximum,'Public source exceeds bound');
 return {bytes,proof:{url,finalUrl:response.url,httpStatus:response.status,observedAt:new Date().toISOString(),bytes:bytes.length,sha256:hash(bytes)}};
}
function jsonLd(html){
 const output=[];for(const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  let value;try{value=JSON.parse(match[1]);}catch{continue;}output.push(...(Array.isArray(value)?value:value['@graph']??[value]));
 }return output;
}
const specs=[
 {slug:'drive-direct',batch:1,home:'https://showroom.ebaymotorspro.co.uk/Drive-Direct?menu=1',logo:'https://i.ebayimg.com/00/s/NDIwWDUwNQ==/z/9UwAAOSwX9JmvNp0/$_3.JPG',logoHash:'ded6c7eee0d63abf0da203d46f14ffe7a23e310ab46a35b41b2e258b4e9face7',logoFile:'branding/original-public-drive-direct.jpg',
  cars:[{id:'ebay-860067229070',sourceUrl:'https://www.ebay.co.uk/itm/860067229070',title:'2006 Honda CR-V 2.0 i-VTEC Sport Automatic',make:'Honda',model:'CR-V Sport',year:2006,mileageValue:125000,mileageUnit:'mi',sourceTitle:'HONDA CR-V 2.0 PETROL I-VTEC SPORT',photo:'https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/rxMAAeSw~ttq2BzT/$_2.JPG'},
   {id:'ebay-860063458415',sourceUrl:'https://www.ebay.co.uk/itm/860063458415',title:'2008 Jeep Cherokee 2.8 CRD Limited Automatic',make:'Jeep',model:'Cherokee Limited',year:2008,mileageValue:105000,mileageUnit:'mi',sourceTitle:'JEEP CHEROKEE 2.8 CRD DIESEL AUTO AUTOMATIC LIMITED',photo:'https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/aBYAAeSwKhdq1r1a/$_2.JPG'}]},
 {slug:'midwest-work-truck-sales',batch:2,home:'https://www.mwworktrucks.com/',logo:'https://static.wixstatic.com/media/b915d1_b34eb3fcd17544a3bcb3d97ff4b2d2a1~mv2.png',logoHash:'7b6b7e38d76ccba2535a0f7bd74ad083ac6ffe92d9b2a82ab68dcf4ba52f0823',logoFile:'branding/original-public-midwest-work-truck-sales.png',
  cars:[{id:'2014-ram-4500-service-truck',sourceUrl:'https://www.mwworktrucks.com/product-page/2014-ram-4500-service-truck-6-7l-cummins-diesel',title:'2014 RAM 4500 Service Truck',make:'RAM',model:'4500 Service Truck',year:2014,sourceTitle:'2014 RAM 4500 Service Truck'},
   {id:'2020-ford-f550-service-truck',sourceUrl:'https://www.mwworktrucks.com/product-page/2020-ford-f-550-crew-cab-service-truck',title:'2020 Ford F-550 Crew Cab Service Truck',make:'Ford',model:'F-550 Crew Cab Service Truck',year:2020,sourceTitle:'2020 Ford F-550 Crew Cab Service Truck'},
   {id:'2014-ram-5500-crew-cab',sourceUrl:'https://www.mwworktrucks.com/product-page/2014-ram-5500-4x4-crew-cab-flatbed',title:'2014 RAM 5500 4x4 Crew Cab Flatbed',make:'RAM',model:'5500 4x4 Crew Cab Flatbed',year:2014,sourceTitle:'2014 RAM 5500 4x4 Crew Cab Flatbed'}]}
];
const results=[];
for(const spec of specs){
 const {slug,batch}=spec,dir=path.join(ROOT,'dealers',slug),before=readPackFiles(dir),home=await publicRead(spec.home),logo=await publicRead(spec.logo);
 assert(logo.proof.sha256===spec.logoHash,'Reviewed public original changed: '+slug);
 const homeHtml=home.bytes.toString('utf8'),facts=JSON.parse(before.get('business-facts.json'));
 assert(homeHtml.includes(facts.business.email),'Exact published public-business contact no longer matches: '+slug);
 const source=JSON.parse(before.get('branding/source.json'));assert(!source.reviewedInputs&&!source.generatedInputs,'Preserve already reviewed or concurrently changed branding: '+slug);
 const now=new Date().toISOString(),row=ink=>({path:spec.logoFile,sha256:spec.logoHash,retainedSource:{kind:'retained-original-raster',sha256:spec.logoHash,url:spec.logo,observedAt:logo.proof.observedAt},rasterTreatment:'reviewed-white-matte-'+ink,
  matteReview:{kind:'reviewed-flat-white-canvas',reviewed:true,background:'#ffffff',noWhiteForegroundArtwork:true,sourceSha256:spec.logoHash,reviewedAt:'2026-10-21'}});
 delete source.generatedInputs;source.status='reviewed-public-original';source.creationMethod='retained-public-raster-reviewed-white-canvas-monochrome';source.originalDraftSha256=hash(before.get('branding/source.json'));
 source.originals=[{path:spec.logoFile,sha256:spec.logoHash,url:spec.logo,observedAt:logo.proof.observedAt}];source.publicSources.push({...logo.proof,supports:['exact-published-original-logo']});
 source.reviewedInputs={reviewedAt:now,master:row('black'),mark:row('black'),markOnDark:row('white'),surfaces:{onLight:row('black'),onDark:row('white'),onAccent:row('white')},
  surfaceReview:{reviewed:true,kind:'agent-public-original-and-native-consumer-visual-review',humanReview:false,dealerApproval:false,
   notes:slug==='drive-direct'?'Exact public JPEG and all light/dark/accent 32/64px wordmark and compact consumers inspected. Original car/hand/percentage emblem and Drive Direct lettering retained. Source JPEG edge detail and small compact lettering remain limitations; fresh native pages remain mandatory. No drawn or generated artwork.':'Exact public MW truck symbol and Midwest Work Truck Sales wordmark inspected at 32/64px on light/dark/accent. Explicit white-canvas treatment preserves sourced foreground pixels; rejected partial-alpha alternate is not used. No drawn or generated artwork.'}};
 const mediaRoot=path.join(out,slug,'fetched'),stockSources=[],records=[];
 for(const selected of spec.cars){
  let page=home,photoUrl=selected.photo,sourceTitle;
  if(slug==='drive-direct'){
   const cards=homeHtml.split('<div class="item">').slice(1),card=cards.find(x=>x.includes(selected.sourceUrl));
   assert(card&&card.includes(selected.sourceTitle)&&card.includes(selected.photo),'Exact seller vehicle card no longer matches');
   const details=card.match(/<div class="item__details">([\s\S]*?)<\/div>/)?.[1]??'';
   assert(new RegExp('\\b'+selected.year+'\\b').test(details)&&details.includes(selected.mileageValue.toLocaleString('en-US')+' Miles'),'Year or mileage no longer matches exact seller card');
   sourceTitle=card.match(/data-q="itemTitleLink">([^<]+)</)?.[1];
  }else{
   page=await publicRead(selected.sourceUrl);const product=jsonLd(page.bytes.toString('utf8')).find(x=>x['@type']==='Product');
   assert(product?.name?.startsWith(selected.sourceTitle),'Exact seller product identity no longer matches');sourceTitle=product.name;
   photoUrl=typeof product.image?.[0]==='string'?product.image[0]:product.image?.[0]?.contentUrl;
   assert(typeof photoUrl==='string'&&photoUrl.startsWith('https://static.wixstatic.com/media/'),'Exact first listing photo required');
  }
  const photo=await publicRead(photoUrl,5*1024**2),meta=await sharp(photo.bytes).metadata(),ext=meta.format==='jpeg'?'jpg':meta.format;
  assert(['jpg','png','webp'].includes(ext)&&meta.width>=150&&meta.height>=100,'Usable actual retained public vehicle photo required');
  const image='dealer-stock/public-'+selected.id+'.'+ext;save(path.join(mediaRoot,image),photo.bytes);
  const {sourceTitle:_,photo:__,...car}=selected;records.push({...car,observedAt:page.proof.observedAt,images:['/'+image]});
  stockSources.push({id:selected.id,sourceUrl:selected.sourceUrl,sourceTitle,sellerPage:spec.home,observedAt:page.proof.observedAt,htmlSha256:page.proof.sha256,
   sourceObservationUrl:page.proof.url,photo:{...photo.proof,path:image,width:meta.width,height:meta.height},claimsPolicy:'Only sourced vehicle identity, explicit year and exact stated mileage where provided. Prices and unverified promotional condition claims omitted.'});
 }
 const imported=importPublicStock({schemaVersion:1,dealer:slug,kind:'dated-listing-snapshot',observedAt:now,records},{slug,country:facts.business.countryCode,mediaRoot}),copy=draftInventoryCopy(imported.stock,{slug});
 const evidence=JSON.parse(before.get('source-evidence.json')),inventory=JSON.parse(before.get('FACTS-AND-INVENTORY.json')),missing=JSON.parse(before.get('missing-facts.json')),updates=new Map();
 facts.business.inventoryNotice=imported.stock.disclosure;facts.business.observedAt=home.proof.observedAt;
 facts.sources.push({url:spec.home,observedAt:home.proof.observedAt,htmlSha256:home.proof.sha256,supports:['business.name','public-business-contact','dealer-stock-source','published-original-logo']},...stockSources.map(x=>({url:x.sourceUrl,observedAt:x.observedAt,htmlSha256:x.htmlSha256,supports:['stock.'+x.id]})));
 if(slug==='drive-direct'){
  evidence.addressConflict={priorValue:facts.business.address,action:'omit-unresolved-optional-address',sourceUrl:spec.home,observedAt:home.proof.observedAt,htmlSha256:home.proof.sha256};
  facts.business.address='';missing.missing=missing.missing.filter(x=>x.field!=='business.address');missing.missing.push({field:'business.address',required:false,reason:'Retained AutoTrader premises B8 1QA disagree with current eBay appointment-only B27 6EJ. Street/postcode omitted until reconciled; Birmingham remains sourced.'});
  const contact=JSON.parse(before.get('contact-review.json'));contact.checks.push({field:'business.email',valueSha256:hash(facts.business.email),classification:'public-business',reviewed:true,reviewKind:'source-evidence',sourceUrl:spec.home,observedAt:home.proof.observedAt,htmlSha256:home.proof.sha256,evidence:'Unchanged exact mailbox appears in the dealer-operated public seller contact section. Earlier evidence is preserved.'});updates.set('contact-review.json',encodePackJson(contact));
 }
 Object.assign(inventory,{inventoryKind:imported.stock.kind,inventoryNotice:imported.stock.disclosure,sources:facts.sources});
 Object.assign(evidence,{liveFetchPerformed:true,publicSources:facts.sources,stockSources,sourceRefresh:{sourceParent,priorFactsSha256:hash(before.get('business-facts.json')),priorStockSha256:hash(before.get('stock.json')),observedAt:now,method:'Exact public original artwork and seller listing snapshots replace held branding and disclosed demo stock; previous source bytes remain retained in published history.'}});
 for(const [name,bytes] of [['business-facts.json',encodePackJson(facts)],['stock.json',encodePackJson(imported.stock)],['copy-review.json',encodePackJson(copy)],['source-evidence.json',encodePackJson(evidence)],['FACTS-AND-INVENTORY.json',encodePackJson(inventory)],['missing-facts.json',encodePackJson(missing)],['branding/source.json',encodePackJson(source)],[spec.logoFile,logo.bytes],...imported.media])updates.set(name,bytes);
 for(const [name,bytes] of updates)save(path.join(dir,name),bytes);
 await prepareDealerPackLogo({root:ROOT,slug,toolPackage});await reviewDealerPack({root:ROOT,slug,batch,toolPackage});
 const check=await checkDealerPackInputs({root:ROOT,slug,batch,toolPackage}),pack=await loadPreparedDealerPack(ROOT,slug,{toolPackage,batch}),checks=[];
 const primary=[['onLight','branding/logo-on-light.png',['#ffffff']],['onDark','branding/logo-on-dark.png',['#111113','#101820']],['onAccent','branding/logo-on-accent.png',['#09090b','#17191c','#c40101']],['master','branding/logo-master.png',['#ffffff']],['mark','branding/logo-mark.png',['#ffffff']],['markOnDark','branding/logo-mark-on-dark.png',['#111113']]];
 for(const [role,file,backgrounds] of primary){checks.push({file,...await inspectLogoPixels(pack.files.get(file),{sharp,role,backgrounds})});if(pack.branding.assets[role]){const file=pack.branding.assets[role].publicPath.slice(1);checks.push({file,...await inspectLogoPixels(pack.files.get(file),{sharp,role,backgrounds})});}}
 for(const [file,role,bg] of [['dealer-brand/mark-on-light.webp','mark','#ffffff'],['dealer-brand/mark-on-dark.webp','markOnDark','#111113'],['dealer-brand/app-icon.png','mark','#ffffff']])checks.push({file,...await inspectLogoPixels(pack.files.get(file),{sharp,role,backgrounds:[bg]})});
 for(const image of readFaviconPngs(pack.files.get('dealer-brand/favicon.ico')).filter(x=>[32,64].includes(x.size)))checks.push({file:'dealer-brand/favicon.ico',size:image.size,...await inspectLogoPixels(image.bytes,{sharp,role:'favicon',backgrounds:['#ffffff'],minimumNativeSize:image.size,smallSizes:[image.size]})});
 assert(checks.every(x=>x.status==='passed'),'Existing source raster gates failed for '+slug);
 const composite=[];let top=0;
 for(const [role,file,backgrounds] of primary.filter(x=>x[0]!=='master'))for(const size of [32,64]){const tile=await sharp(pack.files.get(file)).resize({height:size}).png().toBuffer();composite.push({input:Buffer.from('<svg width="600" height="90"><rect width="600" height="90" fill="'+backgrounds[0]+'"/></svg>'),left:0,top},{input:tile,left:10,top:top+10});top+=90;}
 await sharp({create:{width:600,height:top,channels:4,background:'#ddd'}}).composite(composite).png().toFile(path.join(out,slug+'-consumers.png'));
 const after=readPackFiles(dir),changed=[...after].filter(([name,bytes])=>!before.get(name)?.equals(bytes)).map(([name,bytes])=>({path:'dealers/'+slug+'/'+name,bytes:bytes.length,sha256:hash(bytes),blob:blob(bytes)}));
 save(path.join(out,slug+'-source-check.json'),{check,checks,changed,sourceParent,nativeApproval:false,hostedApproval:false,providerWrites:0});
 const previous=[...before].map(([name,bytes])=>({path:'dealers/'+slug+'/'+name,blob:blob(bytes),sha256:hash(bytes)}));
 results.push({slug,packDigest:check.packDigest,stock:check.stock,sourceFiles:check.sourceFiles,sourceBytes:check.sourceBytes,changed,previous});
}
// Store immutable content only. The connected, reviewed GitHub tree/ref action
// remains the publication boundary; no branch, queue or provider endpoint exists.
const files=[...results.flatMap(x=>x.changed),...['scripts/prepare-dealer-pack-logo.mjs','scripts/dealer-pack-public-matte.test.mjs'].map(name=>{const bytes=fs.readFileSync(path.join(ROOT,name));return{path:name,bytes:bytes.length,sha256:hash(bytes),blob:blob(bytes)};})];
const entries=[];
for(const row of files){
 assert(row.path.startsWith('dealers/drive-direct/')||row.path.startsWith('dealers/midwest-work-truck-sales/')||['scripts/prepare-dealer-pack-logo.mjs','scripts/dealer-pack-public-matte.test.mjs'].includes(row.path),'Publication input scope mismatch');
 const bytes=fs.readFileSync(path.join(ROOT,row.path));assert(hash(bytes)===row.sha256&&bytes.length<6*1024**2,'Changed qualified input bytes');
 const response=await fetch('https://api.github.com/repos/darkapoparka/cars/git/blobs',{method:'POST',headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+process.env.GITHUB_TOKEN,'Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'},body:JSON.stringify({content:bytes.toString('base64'),encoding:'base64'}),signal:AbortSignal.timeout(30000)});
 assert(response.ok,'Immutable source blob was not acknowledged; no ref write attempted');const value=await response.json();assert(value.sha===row.blob,'Content-addressed source blob mismatch');entries.push({path:row.path,mode:'100644',type:'blob',sha:value.sha});
}
save(path.join(out,'publication.json'),{sourceParent,preparationCommit:process.env.GITHUB_SHA,results,treeEntries:entries,providerWrites:0,queueWrites:0,refWrites:0,nativeApproval:false,hostedApproval:false});
console.log(JSON.stringify({results:results.map(({slug,packDigest,stock,sourceFiles,sourceBytes})=>({slug,packDigest,stock,sourceFiles,sourceBytes})),immutableBlobs:entries.length,providerWrites:0,queueWrites:0,refWrites:0}));
