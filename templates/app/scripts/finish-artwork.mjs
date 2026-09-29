import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity',dir='public/reference-assets';
const iconCenters={location:160,bookings:251,seller:303,wishlist:355,sell:418,buy:490,service:562,care:633,finance:705,valuation:755,how:839};
const source=`${root}/android-menu.png`;const {width}=await sharp(source).metadata();const scale=width/427;
const manifest=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));
for(const [name,y] of Object.entries(iconCenters)){
 const region={left:Math.round(22*scale),top:Math.round((y-10)*scale),width:Math.round(20*scale),height:Math.round(20*scale)};
 await sharp(source).extract(region).png().toFile(`${dir}/menu-${name}.png`);manifest.assets.push({name:`menu-${name}.png`,source,crop:region});
}
const chevy='https://static-cdn.cars24.com/qa/cms/2026/01/19/aabd6575-55cb-440b-a269-f638a7463081.slots.png';
const response=await fetch(chevy,{signal:AbortSignal.timeout(15000)});if(response.ok){await fs.writeFile(`${dir}/brand-chevrolet.png`,Buffer.from(await response.arrayBuffer()));manifest.assets.push({name:'brand-chevrolet.png',url:chevy});}
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(manifest,null,2));
const html=await fs.readFile(`${root}/public-fortuner.html`,'utf8');const decoded=html.replaceAll('\\"','"');
const urls=[...new Set([...decoded.matchAll(/https:\/\/[^"<>\s\\]+/g)].map(m=>m[0].replaceAll('&amp;','&').split('?')[0]))];
const images=urls.filter(u=>/9714841126/.test(u)&&/\.(jpg|png|webp)/.test(u));
await fs.writeFile(`${root}/fortuner-images.json`,JSON.stringify(images,null,2));
console.log('FORTUNER IMAGES',images.slice(0,45));
console.log('ASSETS DONE');
