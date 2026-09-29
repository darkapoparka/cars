import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
const root='reference/2026-09-26-continuation';
const regions=[['sell-fuel','gcc-guide',12,383,403,201],['sell-next-info','exchange-banner',12,383,403,201]];
const manifest=[];
for(const [source,name,x,y,w,h] of regions){
 const input=`${root}/${source}.png`,meta=await sharp(input).metadata(),scale=meta.width/427;
 const crop={left:Math.round(x*scale),top:Math.round(y*scale),width:Math.round(w*scale),height:Math.round(h*scale)};
 await sharp(input).extract(crop).png().toFile(`public/reference-assets/continuation/${name}.png`);
 manifest.push({source,name,crop});
}
await writeFile(`${root}/wizard-art-sources.json`,JSON.stringify(manifest,null,2));
console.log('Prepared the GCC guide and exchange marketing banner from the captured flow.');
