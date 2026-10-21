/** Bounded public source acquisition; no queue, provider, main or pack-review writes. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {queueDigest, validatePackQueue} from './lib/dealer-pack-queue.mjs';

const repository='darkapoparka/cars';
const out=path.resolve('runtime/public-source-preparation');
fs.mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const save=(name,value)=>{const p=path.join(out,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n');};
const assert=(v,m)=>{if(!v)throw Error(m);};
assert(process.env.GITHUB_REPOSITORY===repository,'Canonical repository required');
assert(process.env.GITHUB_REF==='refs/heads/astra/source-prep','Provider-free source branch required');
assert(!process.env.CLOUDFLARE_API_TOKEN,'No provider credential may enter source acquisition');
async function api(endpoint,{raw=false}={}){
 assert(endpoint.startsWith('/repos/'+repository+'/'),'Scoped repository read required');
 const response=await fetch('https://api.github.com'+endpoint,{headers:{Accept:raw?'application/vnd.github.raw+json':'application/vnd.github+json',Authorization:'Bearer '+process.env.GITHUB_TOKEN,'X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(30000)});
 assert(response.ok,'GitHub source read failed: '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());assert(bytes.length<8*1024**2,'GitHub response exceeds source bound');
 return raw?bytes:JSON.parse(bytes);
}
const head=await api('/repos/'+repository+'/git/ref/heads/cars-deploy-queue');
const stateRef=head.object.sha;
const state=validatePackQueue(JSON.parse(await api('/repos/'+repository+'/contents/queue.json?ref='+stateRef,{raw:true})));
const campaign=JSON.parse(await api('/repos/'+repository+'/contents/source-campaign.json?ref='+stateRef,{raw:true}));
const rows=state.order.map(id=>state.requests[id]);
const counts={};for(const row of rows)counts[row.status]=(counts[row.status]??0)+1;
const verified=rows.filter(row=>row.status==='deployed'&&state.receipts[row.request.slug]?.some(item=>item.sha256===row.receiptSha256&&queueDigest(item.receipt)===item.sha256&&item.receipt.hostedVerified===true&&item.receipt.requestId===row.request.id));
const publicRows=rows.map(row=>({id:row.request.id,slug:row.request.slug,status:row.status,action:row.request.action,sourceCommit:row.request.sourceCommit,buildArtifact:row.request.buildArtifact,receiptSha256:row.receiptSha256,events:(row.events??[]).map(event=>Object.fromEntries(['kind','at','owner','stage','reason','status'].filter(k=>event[k]!==undefined).map(k=>[k,event[k]])))}));
const sourceCounts={};for(const target of Object.values(campaign.targets)){const key=target.status+' | '+target.reason;sourceCounts[key]=(sourceCounts[key]??0)+1;}
const summary={observedAt:new Date().toISOString(),stateRef,queueGeneration:state.generation,counts,passingReceiptCount:verified.length,passingSlugs:verified.map(row=>row.request.slug),active:state.active?{requestId:state.active.requestId,owner:state.active.owner,slug:state.requests[state.active.requestId].request.slug,status:state.requests[state.active.requestId].status}:null,requests:publicRows,sourceGeneration:campaign.generation,sourceCounts,targets:Object.values(campaign.targets),activeSourceReservation:campaign.activeReservationId?campaign.reservations[campaign.activeReservationId]:null,baselinePreviouslyVerifiedSeparately:100,historicalExceptionsPreviouslyVerifiedSeparately:['car-avenue-llc','dubuy-auto-cars'],providerWrites:0,queueWrites:0};
// Never export the queue's account claim token or credential-bearing objects.
save('queue-summary.json',summary);console.log(JSON.stringify({observedAt:summary.observedAt,queueGeneration:state.generation,counts,passingReceiptCount:verified.length,active:summary.active,sourceCounts}));
const slugs=['drive-direct','midwest-work-truck-sales','nextstep-auto-llc','affordable-motors','auto-club','first-choice-auto-sales','jwg-auto-sales-llc','albert-s-auto-sales','islandwide-auto-sales-llc','322-budget-auto-sales-llc','merly-motors-llc','titanes-auto-sales-rentals-titan-4778885363'];
const kit=path.join(out,'source');fs.mkdirSync(kit,{recursive:true});
let copiedBytes=0;
function copy(from,to){const info=fs.lstatSync(from);assert(!info.isSymbolicLink(),'No source symlink');if(info.isDirectory()){fs.mkdirSync(to,{recursive:true});for(const file of fs.readdirSync(from))copy(path.join(from,file),path.join(to,file));}else{assert(info.isFile()&&info.size<25*1024**2,'Source file bound exceeded');copiedBytes+=info.size;assert(copiedBytes<150*1024**2,'Source acquisition archive exceeds bound');fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}}
for(const name of ['scripts','leads/expansion-2026-10-18','templates.lock.json','workspace.json','catalog.json','clients/index.json','dealers/templates.lock.json'])copy(name,path.join(kit,name));
// Retain only exact qualification references, not the unrelated historical
// fleet evidence archive under docs/. The ordinary qualification validators
// still verify every required referenced file and digest after extraction.
const references=new Set(['docs/DEPLOYMENT-INVENTORY.json']);
const collectReferences=value=>{if(typeof value==='string'&&/^docs\/[A-Za-z0-9._/-]+\.(json|md)$/.test(value))references.add(value);else if(Array.isArray(value))value.forEach(collectReferences);else if(value&&typeof value==='object')Object.values(value).forEach(collectReferences);};
for(const name of ['templates.lock.json','dealers/templates.lock.json'])collectReferences(JSON.parse(fs.readFileSync(name)));
for(const name of references){assert(fs.existsSync(name),'Qualification source reference unavailable: '+name);copy(name,path.join(kit,name));}
// All assigned manifests remain available for identity collision checks; only
// explicitly selected compact packs carry their other factual/media inputs.
for(const entry of fs.readdirSync('dealers',{withFileTypes:true}))if(entry.isDirectory()){
 const p='dealers/'+entry.name+'/dealer.json';if(fs.existsSync(p))copy(p,path.join(kit,p));
}
const selected=[];for(const slug of slugs)if(fs.existsSync('dealers/'+slug)){copy('dealers/'+slug,path.join(kit,'dealers',slug));selected.push(slug);}
const urls=[
 ['drive-direct-seller','https://showroom.ebaymotorspro.co.uk/Drive-Direct?menu=1'],
 ['drive-direct-logo','https://i.ebayimg.com/00/s/NDIwWDUwNQ==/z/9UwAAOSwX9JmvNp0/$_3.JPG'],
 ['drive-direct-honda','https://www.ebay.co.uk/itm/860067229070'],
 ['drive-direct-jeep','https://www.ebay.co.uk/itm/860063458415'],
 ['midwest-seller','https://www.mwworktrucks.com/'],
 ['midwest-logo','https://static.wixstatic.com/media/b915d1_b34eb3fcd17544a3bcb3d97ff4b2d2a1~mv2.png'],
 ['midwest-ram4500','https://www.mwworktrucks.com/product-page/2014-ram-4500-service-truck-6-7l-cummins-diesel'],
 ['midwest-f550','https://www.mwworktrucks.com/product-page/2020-ford-f-550-crew-cab-service-truck'],
 ['midwest-ram5500','https://www.mwworktrucks.com/product-page/2014-ram-5500-4x4-crew-cab-flatbed'],
 ['al-kuwait-seller','https://www.dubicars.com/dealers/sharjah-al-kuwait-used-cars-exhibition-2717'],
 ['al-kuwait-logo','https://www.dubicars.com/images/960363/z_400x234/al-kuwait-used-cars-exhibition/logo-e8f061bc-ab72-43f4-9c34-890eee3eeb2d.jpeg'],
 ['al-kuwait-formacar','https://www.formacar.com/en/shop/0a0006a5-9807-1782-8198-55afc394782d'],
 ['drive-direct-honda-photo','https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/rxMAAeSw~ttq2BzT/$_2.JPG'],
 ['drive-direct-jeep-photo','https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/aBYAAeSwKhdq1r1a/$_2.JPG']
];
const downloads=[];
for(const [name,url] of urls){try{const response=await fetch(url,{signal:AbortSignal.timeout(25000)}),bytes=Buffer.from(await response.arrayBuffer());assert(bytes.length<=6*1024**2,'Public source response exceeds bound');const mime=response.headers.get('content-type')??'',ext=mime.includes('html')?'html':mime.includes('png')?'png':mime.includes('jpeg')?'jpg':'txt',file='public/'+name+'.'+ext;fs.mkdirSync(path.join(out,'public'),{recursive:true});fs.writeFileSync(path.join(out,file),bytes);downloads.push({name,url,finalUrl:response.url,status:response.status,mime,bytes:bytes.length,sha256:sha(bytes),observedAt:new Date().toISOString(),file});}catch(error){downloads.push({name,url,error:error.message});}}
save('public-source-index.json',downloads);
const files=[];const walk=(dir,prefix='')=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+entry.name,p=path.join(dir,entry.name);if(entry.isDirectory())walk(p,name+'/');else{const bytes=fs.readFileSync(p);files.push({path:name,bytes:bytes.length,sha256:sha(bytes)});}}};walk(kit);
save('source-inventory.json',{sourceCommit:process.env.GITHUB_SHA,mainParent:'381c78e238d20f2c60d3988bcf17191e27875eb7',selected,files,copiedBytes,providerWrites:0,nativeApproval:false,hostedApproval:false});
const result=spawnSync('tar',['-czf',path.join(out,'source-toolkit.tgz'),'-C',kit,'.'],{stdio:'inherit'});assert(result.status===0,'Source toolkit archive failed');
// Exact Linux preparation dependencies, not a compiled/native dealer bundle.
const tools=spawnSync('tar',['-czf',path.join(out,'sharp-tools.tgz'),'-C','runtime/source-prep-tools','.'],{stdio:'inherit'});assert(tools.status===0,'Preparation tools archive failed');
