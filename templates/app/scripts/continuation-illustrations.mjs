import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-continuation',dir='public/reference-assets/continuation';
await mkdir(dir,{recursive:true});
const selections={sell:['sell-to-us-your-way','listing-boost','highlight-badges','image-enhancer','sell-car-to-us','quick-vehicle-inspection','no-hidden-fees','hassle-free-paperwork','sell-ratings-trust','sell-smarter-sell-faster','Call-us','Email-us','Visit-us'],service:['minor-service','major-service','enter-car-details','select-car-service-package','schedule-appointment','car-service-at-fingertips','delivery-and-payment','happy-driving','cars24-care-plan','Default','Variant2','Variant3','servicing-ratings-trust'],finance:['Emirates Islamic','Wio','background','val','item1','item2','item3','item4','item5','keys']};
const sources=[];
for(const [kind,names] of Object.entries(selections)){
 const data=JSON.parse(await readFile(`${root}/data-${kind}.json`,'utf8'));
 for(let i=0;i<names.length;i+=4)await Promise.all(names.slice(i,i+4).map(async name=>{
  const image=data.images.find(image=>image.alt===name);if(!image)throw Error(`Missing ${kind}: ${name}`);
  const response=await fetch(image.url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`${response.status} ${image.url}`);
  const filename=`${kind}-${name.toLowerCase().replaceAll(' ','-')}.png`;
  const bytes=Buffer.from(await response.arrayBuffer());await sharp(bytes).png().toFile(`${dir}/${filename}`);
  const {width,height}=await sharp(bytes).metadata();sources.push({name,kind,filename,url:image.url,width,height});
 }));
 const entries=sources.filter(image=>image.kind===kind);
 const tiles=[];
 for(const [i,image] of entries.entries()){
  const label=Buffer.from(`<svg width="280" height="28"><rect width="280" height="28" fill="white"/><text x="5" y="18" font-family="Arial" font-size="13">${image.name}</text></svg>`);
  tiles.push({input:await sharp(`${dir}/${image.filename}`).resize(280,170,{fit:'contain',background:'#eeeef2'}).png().toBuffer(),left:i%3*280,top:Math.floor(i/3)*205});
  tiles.push({input:label,left:i%3*280,top:Math.floor(i/3)*205+172});
 }
 await sharp({create:{width:840,height:Math.ceil(entries.length/3)*205,channels:3,background:'#eeeef2'}}).composite(tiles).png().toFile(`${root}/${kind}-illustrations.png`);
}
const native=sharp(`${root}/search-empty.png`);const {width}=await native.metadata(),scale=width/427;
for(const [i,x] of [55,135,215,296,375].entries())await native.clone().extract({left:Math.round((x-23)*scale),top:Math.round(257*scale),width:Math.round(46*scale),height:Math.round(44*scale)}).png().toFile(`public/reference-assets/search-brand-${i}.png`);
await writeFile(`${root}/illustration-sources.json`,JSON.stringify(sources,null,2));
console.log('Prepared',sources.length,'illustrations and 5 native search-brand icons.');
