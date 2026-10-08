import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root = 'reference/2026-09-26-parity';
const dir = `${root}/assets`;
await fs.mkdir(dir, {recursive:true});
const ua = 'Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
async function get(url) {
 const r = await fetch(url, {headers:{'user-agent':ua},signal:AbortSignal.timeout(30000)});
 if(!r.ok) throw Error(`${r.status} ${url}`);
 return Buffer.from(await r.arrayBuffer());
}
const assets = {
 'hero-return.png':'https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/30%20day%20updated/Banner%20(14).png',
 'offer-return.png':'https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/30%20day%20updated/Homepage%20carousel%20new.png',
 'luxe-finance.png':'https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/Subvention/special%20rate.png',
 'fortuner.jpg':'https://media-ae.cars24.com/c24-uae-ct-masked-images-prod/9714841126/standardised-camera-Front-Left-1783105759070.jpg',
 'mercedes.png':'https://static-cdn.cars24.com/prod/cms/2026/02/12/615063a3-3ade-4151-a2b9-b37069d3ce6bMERCEDES.png',
 'bmw.png':'https://static-cdn.cars24.com/prod/cms/2026/02/12/1704702d-472a-4423-a705-811d9277c6c6BMW.png',
 'audi.png':'https://static-cdn.cars24.com/prod/cms/2026/02/12/0c14cf3e-6b1c-4ba7-b41f-d0ff8c594c04AUDI.png',
 'nissan.png':'https://static-cdn.cars24.com/prod/cms/2026/02/12/740898ef-91a3-4a07-8922-f1502420ab40NISSAN.png',
 'hyundai.png':'https://static-cdn.cars24.com/prod/cms/2026/02/12/5479668a-809f-4469-a052-e5a171d814c7HYUNDAI.png',
 'logo.png':'https://static-cdn.cars24.com/qa/cms/2026/01/08/d820a07a-0539-471a-b61c-84487e9d67b9org-logo.png',
 'luxe-tag.svg':'https://media-ae.cars24.com/dls-central/uae/car-card/uae-luxe-car-tag.svg',
 'sell.png':'https://static-cdn.cars24.com/qa/cms/2026/02/10/a2ca32b8-1471-4cfb-98da-d98442ec8b30Sell.png',
 'service-1.png':'https://static-cdn.cars24.com/qa/cms/2026/01/08/7020d9f2-1161-47b4-b442-c01181fbd90bImage%20Slot.png',
 'service-2.png':'https://static-cdn.cars24.com/qa/cms/2026/02/10/5b2623db-b71a-4624-9589-374fd34f64a1Image%20Slot.png',
 'service-3.png':'https://static-cdn.cars24.com/qa/cms/2026/02/10/1862f054-95c2-4e5f-ad3e-be195f8aa722Image%20Slot.png'
};
const results = await Promise.all(Object.entries(assets).map(async ([name,url])=>{
 try { const b = await get(url); await fs.writeFile(`${dir}/${name}`,b); const m=await sharp(b).metadata(); return {name,url,width:m.width,height:m.height,bytes:b.length}; }
 catch(e){return {name,url,error:e.message};}
}));
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(results,null,2));
console.log('ASSETS',JSON.stringify(results.map(r=>({name:r.name,width:r.width,height:r.height,bytes:r.bytes,error:r.error}))));
const thumbs = await Promise.all(results.filter(r=>!r.error).map(async(r,i)=>({input:await sharp(`${dir}/${r.name}`).resize(240,150,{fit:'contain',background:'#ededf2'}).png().toBuffer(),left:(i%4)*240,top:Math.floor(i/4)*180})));
await sharp({create:{width:960,height:Math.ceil(thumbs.length/4)*180,channels:3,background:'#ededf2'}}).composite(thumbs).png().toFile(`${dir}/contact-sheet.png`);
const html = (await get('https://www.cars24.ae/')).toString();
await fs.writeFile(`${root}/public-mobile.html`,html);
console.log('MOBILE IMAGES',JSON.stringify([...html.matchAll(/<img[^>]*>/g)].slice(0,35).map(m=>({alt:m[0].match(/alt="([^"]*)/)?.[1],src:m[0].match(/src="([^"]*)/)?.[1]}))));
const cssUrls = [...new Set([...html.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"/g)].map(m=>m[1]))];
for(const url of cssUrls){const css=(await get(url)).toString(); await fs.writeFile(`${dir}/${path.basename(url)}`,css);const faces=[...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);if(faces.length)console.log('FONT FACES',url,faces.join('\n').slice(0,6000));}
console.log('MOBILE TERMS', ['Buy Car','Get Loans','Car Service','30%20day'].map(t=>{const i=html.indexOf(t);return {term:t,index:i,context:i<0?'':html.slice(Math.max(0,i-120),i+550)};}));
