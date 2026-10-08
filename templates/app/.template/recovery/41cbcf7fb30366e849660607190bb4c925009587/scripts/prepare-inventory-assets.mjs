import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='public/reference-assets',root='reference/2026-09-26-parity';
const sources=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));
const assets={
 'ciaz.png':'https://media-ae.cars24.com/c24-uae-ct-masked-images-prod/9714842062/standardised-1-6aa92c11bde06361f0ca83bd-1789472449017.png',
 'veloz.png':'https://media-ae.cars24.com/c24-uae-ct-masked-images-prod/9718403147/standardised-1-6a9837ec09e25b406610c7e2-1788361399128.png'
};
const service=await fs.readFile(`${root}/public-service.html`,'utf8');
const home=await fs.readFile(`${root}/public-mobile.html`,'utf8');
const images=[...`${service}${home}`.matchAll(/<img[^>]*>/g)].map(m=>({alt:m[0].match(/alt="([^"]*)/)?.[1],src:m[0].match(/src="([^"]*)/)?.[1]?.replaceAll('&amp;','&').split('?')[0]}));
const chevrolet=images.find(i=>/chevrolet/i.test(i.alt??''));
if(chevrolet)assets['brand-chevrolet.png']=chevrolet.src;
for(const name of ['suv','sedan','hatchback','coupe','convertible','mpv']){
 const item=images.find(i=>i.alt?.toLowerCase()===name||i.alt?.endsWith(`1=${name.toUpperCase()}.png`));
 if(item)assets[`body-${name}.png`]=item.src;
}
console.log('DOWNLOADS',Object.keys(assets));
await Promise.all(Object.entries(assets).map(async([name,url])=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status} ${url}`);const bytes=Buffer.from(await r.arrayBuffer());await fs.writeFile(`${dir}/${name}`,bytes);const {width,height}=await sharp(bytes).metadata();sources.assets.push({name,url,width,height});}));
await sharp(`${dir}/home-promotion.png`).extract({left:490,top:0,width:590,height:432}).png().toFile(`${dir}/listing-promotion-right.png`);
await fs.copyFile(`${root}/assets/luxe-finance.png`,`${dir}/luxe-promotion.png`);
await sharp(`${root}/android-cars-top.png`).resize(427,952).png().toFile(`${root}/android-cars-427.png`);
await sharp(`${root}/android-budget.png`).resize(427,952).png().toFile(`${root}/android-budget-427.png`);
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="56" viewBox="0 0 60 56"><rect x="3" y="7" width="43" height="32" rx="5" fill="#5e80e7" transform="rotate(-15 24 24)"/><rect x="10" y="20" width="45" height="29" rx="5" fill="#2245b0"/><path d="M10 28h45" stroke="#79a2ee" stroke-width="5"/><path d="M16 40h10m4 0h6" stroke="#b8d2ff" stroke-width="3"/></svg>`)).png().toFile(`${dir}/loan-card.png`);
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(sources,null,2));
const decoded=home.replaceAll('\\"','"');
for(const m of decoded.matchAll(/9714841126/g)){const piece=decoded.slice(Math.max(0,m.index-250),m.index+300);if(/cdpRelativeUrl|href|buy-used/.test(piece))console.log('FORTUNER',piece);}
console.log('DONE');
