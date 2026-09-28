import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity';
const dir='public/reference-assets';
await fs.mkdir(dir,{recursive:true});
const html=await fs.readFile(`${root}/public-mobile.html`,'utf8');
const images=[...html.matchAll(/<img[^>]*>/g)].map(m=>({alt:m[0].match(/alt="([^"]*)/)?.[1],src:m[0].match(/src="([^"]*)/)?.[1]?.replaceAll('&amp;','&').split('?')[0]}));
const selection=[['home-promotion',5],['tab-buy',1],['tab-sell',2],['tab-finance',3],['tab-service',4],['brand-mercedes',6],['brand-bmw',7],['brand-audi',8],['brand-nissan',9],['brand-hyundai',10]];
const records=[];
for(const [name,index] of selection){
 const url=images[index].src;
 if(!url.startsWith('https://static-cdn.cars24.com/')&&!url.startsWith('https://c24-media-service.c24.tech/'))throw Error('Unexpected asset host');
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(`${response.status}: ${url}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 const {width,height}=await sharp(bytes).metadata();
 await fs.writeFile(`${dir}/${name}.png`,bytes);
 records.push({name,url,width,height});
}
for(const name of ['fortuner.jpg','luxe-tag.svg','logo.png'])await fs.copyFile(`${root}/assets/${name}`,`${dir}/${name}`);
const original=JSON.parse(await fs.readFile(`${root}/assets/sources.json`,'utf8'));
await fs.writeFile(`${dir}/sources.json`,JSON.stringify({purpose:'Local reference reconstruction; not an official service',assets:[...records,...original.filter(a=>['fortuner.jpg','luxe-tag.svg','logo.png'].includes(a.name))]},null,2));
const thumbs=await Promise.all(records.map(async(r,i)=>({input:await sharp(`${dir}/${r.name}.png`).resize(200,150,{fit:'contain',background:'#4736fe'}).png().toBuffer(),left:(i%4)*200,top:Math.floor(i/4)*150})));
await sharp({create:{width:800,height:450,channels:3,background:'#4736fe'}}).composite(thumbs).png().toFile(`${root}/mobile-assets.png`);
console.log('IMPORTED',records);
console.log('OTHER ART',JSON.stringify(images.filter(i=>i.src&&!i.src.startsWith('data:')&&!/masked-images|hello-ar/.test(i.src)).slice(20,50)));
