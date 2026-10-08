import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
let source = await readFile('components/VehicleDetailClient.tsx','utf8');
if(createHash('sha256').update(source).digest('hex')!=='67f7c75fb176af453c129f71bd433570d9451da19ff6dc948ccb903afc6c7da4')throw Error('Detail component changed');
let price=await readFile('components/VehiclePriceSheet.tsx','utf8');
if(createHash('sha256').update(price).digest('hex')!=='6f35666deaa09f77d2709ad607492d4569175945e0641486e590bc42df867150')throw Error('Price sheet changed');
function replace(before,after){if(source.split(before).length!==2)throw Error(`Missing unique detail match ${before}`);source=source.replace(before,after);}
replace("if(history.length>1&&document.referrer.startsWith(location.origin))router.back();", "if(history.length>1)router.back();");
const urls=JSON.parse(await readFile('reference/2026-09-26-parity/fortuner-images.json','utf8'));
const additions=[];
for(let index=0;index<urls.length;index+=4){await Promise.all(urls.slice(index,index+4).map(async(url,offset)=>{
 const ordinal=index+offset;
 const response=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error(`Gallery HTTP ${response.status}`);
 const bytes=await sharp(Buffer.from(await response.arrayBuffer())).resize({width:1200,withoutEnlargement:true}).jpeg({quality:92}).toBuffer();
 await writeFile(`public/reference-assets/continuation/fortuner-gallery-${ordinal}.jpg`,bytes);
 const label=ordinal<6?'Exteriors':ordinal<13||ordinal===15?'Interiors':'Features';
 additions.push({index:ordinal,label,image:`/reference-assets/continuation/fortuner-gallery-${ordinal}.jpg`,source:url});
}));}
additions.sort((a,b)=>a.index-b.index);
const before=" const gallery=[{label:'Exteriors',image:primaryImage},{label:'Interiors',image:fortuner?'/reference-assets/fortuner-interior.jpg':primaryImage},{label:'Features',image:fortuner?'/reference-assets/fortuner-feature.jpg':primaryImage},{label:'Exteriors',image:fortuner?'/reference-assets/fortuner-right.jpg':primaryImage}];";
replace(before,` const gallery=[{label:'Exteriors',image:primaryImage},{label:'Interiors',image:fortuner?'/reference-assets/fortuner-interior.jpg':primaryImage},{label:'Features',image:fortuner?'/reference-assets/fortuner-feature.jpg':primaryImage},...(fortuner?${JSON.stringify(additions.map(({label,image})=>({label,image})))}:[])];`);
replace("const frame=requestAnimationFrame(sync);const onScroll", "const frame=requestAnimationFrame(()=>{sync();onScroll();});const onScroll");
price=price.replace('<small>Calculated @ {interest.toFixed(2)}%</small>', '<small {...stylex.props(s.rateDetail)}>Calculated @ {interest.toFixed(2)}%</small>').replace('<small>AED {formatPrice(loan)}</small>', '<small {...stylex.props(s.rateDetail)}>AED {formatPrice(loan)}</small>').replace("  loanAmount: {", "  rateDetail: {display:'block',marginTop:5,color:'#40547c',fontSize:12,lineHeight:'18px'},\n  loanAmount: {");
await writeFile('components/VehicleDetailClient.tsx',source);
await writeFile('components/VehiclePriceSheet.tsx',price);
const root='reference/2026-09-26-continuation';
const image=sharp(`${root}/report-confirmed.png`),meta=await image.metadata(),scale=meta.width/427;
const crop={left:Math.round(20*scale),top:Math.round(512*scale),width:Math.round(385*scale),height:Math.round(183*scale)};
await image.extract(crop).png().toFile('public/reference-assets/continuation/report-guarantees.png');
await writeFile(`${root}/detail-source-manifest.json`,JSON.stringify({gallery:additions,guarantees:{source:'report-confirmed.png',crop},nativePolicy:'Observed UI only; not an independent inspection or finance quote.'},null,2));
console.log('Prepared all 16 gallery photographs and the native report assurance cards.');
