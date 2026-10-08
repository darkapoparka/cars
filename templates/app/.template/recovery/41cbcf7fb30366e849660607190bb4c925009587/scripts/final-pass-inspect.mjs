import {readFile, mkdir, writeFile} from 'node:fs/promises';
const root='reference/2026-09-26-final-pass';
await mkdir(root,{recursive:true});
const state=JSON.parse(await readFile('reference/2026-09-26-continuation/fortuner-detail-state.json','utf8'));
console.log('ROOTS',Object.keys(state));
const candidates=[];
function walk(value,path='') {
 if(typeof value==='string'&&(/https?:/.test(value))&&/video|\.mp4|\.m3u8|review|testimon|offer/i.test(path+' '+value))candidates.push({path,value});
 else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))walk(v,path+'.'+k);
}
walk(state);
for(const [key,part]of Object.entries(state))if(part?.similarCars) {
 console.log('SIMILAR_KEY',key);
 console.log('SIMILAR',JSON.stringify(part.similarCars.map(c=>({id:c.appointmentId,make:c.make,model:c.model,year:c.year,variant:c.variant,price:c.price,originalPrice:c.targetPrice,discount:c.discountAmount,km:c.odometerReading,engine:c.engineSize,options:c.optionsType,monthly:c.emiDetails?.emi,image:c.mainImage?.path,specs:c.specs,highlights:c.carHighlights,features:c.topFeatures,color:c.color,transmission:c.transmissionType,shareUrl:c.shareUrl})),null,2));
}
const html=await readFile('reference/2026-09-26-parity/public-fortuner.html','utf8');
const videos=[...new Set([...html.matchAll(/https?:[^\s"'<>\\]+\.(?:mp4|m3u8)[^\s"'<>\\]*/g)].map(m=>m[0]))];
const scripts=[...html.matchAll(/<script[^>]*\bsrc=["']([^"']+)/g)].map(m=>m[1]);
console.log('VIDEO_CANDIDATES',JSON.stringify(candidates));console.log('HTML_VIDEOS',videos);console.log('SCRIPTS',scripts);
await writeFile(root+'/source-discovery.json',JSON.stringify({videos,candidates,scripts},null,2));
