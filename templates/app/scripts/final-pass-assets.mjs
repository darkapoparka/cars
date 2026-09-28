import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='reference/2026-09-26-final-pass',out='public/reference-assets/final-pass';
await mkdir(root,{recursive:true});await mkdir(out,{recursive:true});
const state=JSON.parse(await readFile('reference/2026-09-26-continuation/fortuner-detail-state.json','utf8'));
const discovered=JSON.parse(await readFile(root+'/source-discovery.json','utf8'));
const manifest=[];
for(const car of state.carDetails.similarCars){
 const url=new URL(car.mainImage.path,'https://media-ae.cars24.com/');
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Image ${response.status}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 const file=`${out}/similar-${car.appointmentId}.jpg`;
 await sharp(bytes).resize({width:1200,withoutEnlargement:true}).jpeg({quality:93}).toFile(file);
 manifest.push({file,url:url.href,sourceHash:createHash('sha256').update(bytes).digest('hex')});
}
// Inspect public resource references only; application code is implemented separately.
const matches=[];
for(const url of discovered.scripts.filter(s=>/detail-page|ae\.d\.bundle/.test(s))){
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok){console.log('SCRIPT_UNAVAILABLE',response.status);continue;}
 const text=await response.text();
 for(const pattern of [/https?:[^\s"'<>\\]+\.(?:mp4|m3u8)[^\s"'<>\\]*/g,/[^"'\s]{0,120}(?:\.mp4|\.m3u8)[^"'\s]{0,100}/g,/[^;]{0,150}(?:mrlVideo|inspectionVideo|refurbishmentVideo)[^;]{0,250}/gi]){
  for(const match of text.matchAll(pattern))matches.push({url,text:match[0]});
 }
}
await writeFile(root+'/download-manifest.json',JSON.stringify(manifest,null,2));
await writeFile(root+'/video-discovery.json',JSON.stringify(matches,null,2));
console.log('ASSETS',manifest.map(m=>m.file));console.log('VIDEO_REFERENCES',JSON.stringify(matches));
