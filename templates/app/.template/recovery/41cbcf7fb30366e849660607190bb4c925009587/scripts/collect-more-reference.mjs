import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity';
const dir='public/reference-assets';
const ua='Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const assets={
 'tab-buy-selected.png':'https://static-cdn.cars24.com/qa/cms/2026/01/16/0934f1d5-ad05-4331-be0d-2a14195259a5Buy_car_selected.png',
 'tab-sell-selected.png':'https://static-cdn.cars24.com/qa/cms/2026/01/09/72075000-5575-4743-b740-12f71fe728b2sell-selected.png',
 'tab-finance-selected.png':'https://static-cdn.cars24.com/qa/cms/2026/01/09/37687cea-2efc-4c0e-b58e-f787e0c7551cloan-selected.png',
 'tab-service-selected.png':'https://static-cdn.cars24.com/qa/cms/2026/01/09/88ff790e-de3c-422f-9d40-6aa8c9677ec9care-selected.png',
 'offer-return.png':'https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/30%20day%20updated/Buy%20carousel%20new.png',
 'offer-warranty.png':'https://media-ae.cars24.com/blog/cms/cms/2026/04/16/e2ffdc13-7d4f-42bb-81b1-a7c6f58a2db6LTW.png',
 'offer-finance.png':'https://c24-media-service.c24.tech/production/prod/c24-assembly-service/uae/Subvention/carousel.png'
};
const provenance=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));
async function get(url){const r=await fetch(url,{headers:{'user-agent':ua},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status} ${url}`);return Buffer.from(await r.arrayBuffer());}
await Promise.all(Object.entries(assets).map(async([name,url])=>{const b=await get(url);await fs.writeFile(`${dir}/${name}`,b);const {width,height}=await sharp(b).metadata();provenance.assets.push({name,url,width,height});}));
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(provenance,null,2));
const pages=[['listing','buy-used-cars-dubai'],['sell','sell-used-car'],['finance','car-loan'],['service','car-servicing']];
const data=await Promise.all(pages.map(async([name,slug])=>{
 const html=(await get(`https://www.cars24.ae/${slug}/`)).toString();await fs.writeFile(`${root}/public-${name}.html`,html);
 const images=[...html.matchAll(/<img[^>]*>/g)].map(m=>({alt:m[0].match(/alt="([^"]*)/)?.[1],src:m[0].match(/src="([^"]*)/)?.[1]?.replaceAll('&amp;','&').split('?')[0]})).filter(i=>i.src?.startsWith('https://')&&!/masked-images|hello-ar/.test(i.src));
 const unique=[...new Map(images.map(i=>[i.src,i])).values()];
 return {name,images:unique};
}));
await fs.writeFile(`${root}/service-assets.json`,JSON.stringify(data,null,2));
console.log(JSON.stringify(data.map(d=>({name:d.name,images:d.images.slice(0,24)})),null,2));
