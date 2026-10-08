import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-parity',dir='public/reference-assets';
const selections=[['android-cars-top.png','listing-promotion.png',0,182,427,137],['android-cars-top.png','ciaz-native-card.png',21,603,134,76],['android-cars-top.png','veloz-native-card.png',21,781,134,76],['android-luxe.png','land-cruiser-native-card.png',21,711,134,76],['android-detail-loaded.png','return-icon.png',25,760,42,40]];
const provenance=JSON.parse(await fs.readFile(`${dir}/sources.json`,'utf8'));
for(const [source,name,x,y,w,h] of selections){const {width}=await sharp(`${root}/${source}`).metadata();const scale=width/427;const crop={left:Math.round(x*scale),top:Math.round(y*scale),width:Math.min(Math.round(w*scale),width-Math.round(x*scale)),height:Math.round(h*scale)};await sharp(`${root}/${source}`).extract(crop).png().toFile(`${dir}/${name}`);provenance.assets.push({name,source:`${root}/${source}`,crop,purpose:'Isolated native marketing artwork or vehicle photograph; cards, controls and prices remain real HTML.'});}
const photos=JSON.parse(await fs.readFile(`${root}/fortuner-images.json`,'utf8'));
for(const [name,term] of [['fortuner-interior.jpg','Dashboard-View'],['fortuner-feature.jpg','Infotainment-System'],['fortuner-right.jpg','Right-Front-Diagonal']])provenance.assets.push({name,url:photos.find(url=>url.includes(term))});
await fs.writeFile(`${dir}/sources.json`,JSON.stringify(provenance,null,2));
console.log('Prepared isolated native marketing art and matching card photographs.');
