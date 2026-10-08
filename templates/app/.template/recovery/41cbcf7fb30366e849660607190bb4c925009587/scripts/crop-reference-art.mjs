import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity',dir='public/reference-assets';
const crops=[
 ['android-cars-top.png','assistant.png',359,744,46,46],
 ['android-stores.png','stores-hero.png',0,51,427,170],
 ['android-stores.png','store-barsha.png',14,235,399,144],
 ['android-stores.png','store-ras-al-khor.png',14,566,399,144],
 ['android-luxe.png','luxe-promotion.png',0,103,427,142],
];
const provenance=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));
for(const [source,name,x,y,w,h] of crops){
 const image=sharp(`${root}/${source}`);const {width}=await image.metadata();const scale=width/427;
 const left=Math.round(x*scale),top=Math.round(y*scale);const region={left,top,width:Math.min(width-left,Math.round(w*scale)),height:Math.round(h*scale)};
 await image.extract(region).png().toFile(`${dir}/${name}`);
 provenance.assets.push({name,source:`${root}/${source}`,crop:region,purpose:'Isolated native image artwork; interactive UI is implemented in HTML.'});
}
const html=await fs.readFile(`${root}/public-service.html`,'utf8');const decoded=html.replaceAll('\\"','"');
const chevy=decoded.toLowerCase().indexOf('chevrolet');console.log('CHEVROLET CONTEXT',decoded.slice(Math.max(0,chevy-350),chevy+550));
for(const name of ['suv','sedan','hatchback','coupe','convertible','mpv']){
 try{await fs.access(`${dir}/body-${name}.png`);}catch{
  const input=name==='suv'||name==='mpv'?'public/cutouts/compact-suv.png':name==='sedan'?'public/cutouts/sedan.png':'public/cutouts/premium-suv.png';
  await sharp(input).resize(240,150,{fit:'contain',background:'#ffffff'}).png().toFile(`${dir}/body-${name}.png`);
 }
}
try{await fs.access(`${dir}/brand-chevrolet.png`);}catch{await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="210" height="192" viewBox="0 0 210 192"><circle cx="105" cy="96" r="88" fill="white" stroke="#dfe6ef" stroke-width="3"/><path d="M50 78h38V65h38v13h38l-11 35h-27v14H88v-14H40Z" fill="#d6b459" stroke="#bfc1c1" stroke-width="5"/><path d="M53 84h42V71h25v13h34l-7 23h-27v14H95v-14H48Z" fill="#e7c970"/></svg>')).png().toFile(`${dir}/brand-chevrolet.png`);}
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(provenance,null,2));console.log('Cropped image artwork only.');
