import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity';const dir='public/reference-assets';
const {data,info}=await sharp(`${dir}/logo.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<data.length;i+=4){data[i]=71;data[i+1]=54;data[i+2]=254;}
await sharp(data,{raw:info}).png().toFile(`${dir}/logo-blue.png`);
await sharp(data,{raw:info}).extract({left:0,top:0,width:115,height:160}).resize(23,32).png().toFile(`${dir}/logo-symbol.png`);
await fs.copyFile(`${root}/assets/hero-return.png`,`${dir}/listing-art.png`);
const pages=JSON.parse(await fs.readFile(`${root}/service-assets.json`,'utf8'));
const sell=pages.find(p=>p.name==='sell').images;
const finance=pages.find(p=>p.name==='finance').images;
const service=pages.find(p=>p.name==='service').images;
const selected=[
 ['sell-hero',sell.find(i=>i.alt==='Sell-hero-banner-msite')],
 ['finance-hero',finance.find(i=>i.alt==='banner')],
 ['service-hero',service.find(i=>i.alt==='car_servicing_banner')],
 ...finance.slice(6,10).map((image,i)=>[`finance-benefit-${i+1}`,image]),
 ...finance.slice(10,14).map((image,i)=>[`finance-bank-${i+1}`,image]),
 ...sell.slice(6,14).map((image,i)=>[`sell-brand-${i+1}`,image])
];
const records=[];
await Promise.all(selected.map(async([name,image])=>{
 if(!image)throw Error(`Missing ${name}`);const r=await fetch(image.src,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status}: ${image.src}`);
 const b=Buffer.from(await r.arrayBuffer());await fs.writeFile(`${dir}/${name}.png`,b);const {width,height}=await sharp(b).metadata();records.push({name,url:image.src,width,height});
}));
const sources=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));sources.assets.push(...records);await fs.writeFile(`${dir}/sources.json`,JSON.stringify(sources,null,2));
const thumbs=await Promise.all(selected.map(async([name],i)=>({input:await sharp(`${dir}/${name}.png`).resize(240,180,{fit:'contain',background:'#f1f3f8'}).png().toBuffer(),left:(i%4)*240,top:Math.floor(i/4)*200})));
await sharp({create:{width:960,height:Math.ceil(selected.length/4)*200,channels:3,background:'#f1f3f8'}}).composite(thumbs).png().toFile(`${root}/service-contact-sheet.png`);
console.log(JSON.stringify(records));
