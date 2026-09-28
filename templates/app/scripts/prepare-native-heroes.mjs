import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='public/reference-assets';
for(const kind of ['sell','finance','service']){
 const source=sharp(`${dir}/${kind}-hero.png`);
 const {width,height}=await source.metadata();
 // The source photograph and background are retained; native copy remains real HTML.
 const left=await source.clone().extract({left:8,top:0,width:1,height}).resize(Math.round(width*.53),height,{fit:'fill'}).png().toBuffer();
 await source.composite([{input:left,left:0,top:0}]).png().toFile(`${dir}/${kind}-hero-art.png`);
}
const root='reference/2026-09-26-parity';
const ua='Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
for(const [name,url] of [['ciaz','https://www.cars24.ae/buy-used-suzuki-ciaz-cars-dubai/'],['veloz','https://www.cars24.ae/buy-used-toyota-veloz-cars-dubai/']]){
 const response=await fetch(url,{headers:{'User-Agent':ua},signal:AbortSignal.timeout(30000)});
 const html=await response.text();await fs.writeFile(`${root}/public-${name}.html`,html);
 const decoded=html.replaceAll('\\"','"');
 console.log(name,'prices',...['28799','64699'].map(p=>{const i=decoded.indexOf(p);return i<0?'not present':decoded.slice(i-700,i+1900);}));
 console.log(name,'IMAGES',[...html.matchAll(/<img[^>]+>/g)].map(m=>({alt:m[0].match(/alt="([^"]*)/)?.[1],src:m[0].match(/src="([^"]*)/)?.[1]})).filter(i=>/masked-images/.test(i.src??'')).slice(0,12));
}
