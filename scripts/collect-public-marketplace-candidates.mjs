/** Read exact waiting assignments; candidates are evidence, never a pack review. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {ROOT} from './lib/workflow.mjs';
import {readExpansionLead} from './draft-dealer-pack.mjs';
import {listDealerPacks} from './lib/dealer-pack-index.mjs';
const out=path.join(ROOT,'runtime/public-marketplace-candidates');fs.mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const assert=(ok,m)=>{if(!ok)throw Error(m);};
assert(!process.env.CLOUDFLARE_API_TOKEN,'Read-only public acquisition must not have provider credentials');
const sharp=createRequire(path.resolve(process.env.CARS_DEALER_PACK_TOOL_PACKAGE))('sharp');sharp.concurrency(1);sharp.cache(false);
const summary=JSON.parse(fs.readFileSync(path.join(ROOT,'runtime/public-source-preparation/queue-summary.json')));
const packs=listDealerPacks(ROOT),byId=new Map(packs.map(x=>[x.dealerId,x]));
const gather=(x,urls=[])=>{if(typeof x==='string'&&x.startsWith('https://'))urls.push(x);else if(Array.isArray(x))x.forEach(v=>gather(v,urls));else if(x&&typeof x==='object')Object.values(x).forEach(v=>gather(v,urls));return [...new Set(urls)];};
const key=x=>String(x??'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const ld=html=>[...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(m=>{try{const j=JSON.parse(m[1]);return Array.isArray(j)?j:j['@graph']??[j];}catch{return [];}});
async function read(url,max){const u=new URL(url);assert(u.protocol==='https:'&&u.hostname==='www.dubicars.com'&&!u.username&&!u.password,'Exact assigned public marketplace source only');const r=await fetch(url,{signal:AbortSignal.timeout(25000)});assert(r.ok,'HTTP '+r.status);const b=Buffer.from(await r.arrayBuffer());assert(b.length>0&&b.length<=max,'Public source size bound');return{bytes:b,proof:{url,finalUrl:r.url,status:r.status,observedAt:new Date().toISOString(),bytes:b.length,sha256:sha(b)}};}
const candidates=[];
for(const target of summary.targets.filter(x=>x.status==='waiting-inputs')){
 const {lead,source}=readExpansionLead(ROOT,target.dealerId),url=gather(lead).find(x=>/^https:\/\/www\.dubicars\.com\/dealers\//.test(x));
 if(!url)continue;assert(candidates.length<60,'Bounded assigned cohort exceeded');candidates.push({dealerId:target.dealerId,batch:target.batch,position:target.position,slug:byId.get(target.dealerId)?.slug??null,name:lead.name,city:lead.city,url,leadSource:source});
}
const results=[];
for(const candidate of candidates){try{
 const page=await read(candidate.url,3*1024**2),html=page.bytes.toString('utf8'),structured=ld(html),org=structured.find(x=>x['@type']==='Organization'),dealer=structured.find(x=>x['@type']==='AutoDealer'||x['@type']==='LocalBusiness'),items=structured.find(x=>x['@type']==='ItemList')?.itemListElement??[];
 const stock=items.map(x=>x.item).filter(x=>x?.['@type']==='Car').slice(0,3).map(x=>({title:x.name,url:x.url,image:x.image,brand:x.brand,model:x.model,year:x.vehicleModelDate,mileage:x.mileageFromOdometer}));
 const images=[...html.matchAll(/<img\b[^>]+>/gi)].map(x=>x[0]),tag=images.find(x=>key(x.match(/\balt="([^"]*)"/)?.[1])===key(org?.name));
 let logoUrl;
 if(tag){const sourceSet=tag.match(/\bsrcset="([^"]+)"/i)?.[1];logoUrl=sourceSet?.split(',').map(x=>x.trim().split(/\s+/)).sort((a,b)=>parseInt(b[1])-parseInt(a[1]))[0]?.[0]??tag.match(/\bsrc="([^"]+)"/)?.[1];if(logoUrl?.startsWith('//'))logoUrl='https:'+logoUrl;}
 const directory=path.join(out,candidate.dealerId);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'seller.html'),page.bytes);
 const result={...candidate,page:page.proof,sourceName:org?.name??null,exactNameMatch:key(org?.name)===key(candidate.name),publicDealer:dealer?{name:dealer.name,address:dealer.address,telephone:dealer.telephone,email:dealer.email,url:dealer.url}:null,stock,logo:null,reviewed:false,nativeApproval:false,hostedApproval:false};
 if(logoUrl){try{const logo=await read(logoUrl,4*1024**2),meta=await sharp(logo.bytes,{limitInputPixels:25*1024**2}).metadata(),extension=meta.format==='jpeg'?'jpg':meta.format;assert(['jpg','png','webp'].includes(extension),'Actual single raster logo required');const file='original-logo.'+extension;fs.writeFileSync(path.join(directory,file),logo.bytes);result.logo={...logo.proof,path:candidate.dealerId+'/'+file,width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha};}catch(error){result.logoError=error.message;}}
 results.push(result);console.log(JSON.stringify({dealerId:candidate.dealerId,slug:candidate.slug,name:result.sourceName,exactNameMatch:result.exactNameMatch,stock:stock.length,logo:result.logo?{path:result.logo.path,width:result.logo.width,height:result.logo.height}:null,error:result.logoError}));
 }catch(error){results.push({...candidate,error:error.message,reviewed:false});console.log(JSON.stringify({dealerId:candidate.dealerId,error:error.message}));}}
fs.writeFileSync(path.join(out,'candidates.json'),JSON.stringify({stateRef:summary.stateRef,queueGeneration:summary.queueGeneration,observedAt:new Date().toISOString(),candidates:results,providerWrites:0,queueWrites:0,sourceReviewWrites:0},null,2)+'\n');
// Small review sheets keep the original raster proportions. No artwork changes.
const logos=results.filter(x=>x.logo);
for(let offset=0;offset<logos.length;offset+=12){const group=logos.slice(offset,offset+12),tiles=[];for(let i=0;i<group.length;i++){const row=group[i],left=i%3*360,top=Math.floor(i/3)*230,b=fs.readFileSync(path.join(out,row.logo.path));const label=(offset+i+1)+'. '+row.dealerId.replace(/&/g,'&amp;').replace(/</g,'&lt;');tiles.push({input:Buffer.from('<svg width="360" height="25"><rect width="360" height="25" fill="white"/><text x="5" y="17" font-size="10">'+label+'</text></svg>'),left,top});tiles.push({input:await sharp(b).resize(340,190,{fit:'contain',background:'#dddddd'}).png().toBuffer(),left:left+10,top:top+30});}await sharp({create:{width:1080,height:Math.ceil(group.length/3)*230,channels:4,background:'#ffffff'}}).composite(tiles).png().toFile(path.join(out,'logo-review-'+(offset/12+1)+'.png'));}
