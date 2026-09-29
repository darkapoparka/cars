import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='reference/2026-09-26-final-pass',out='public/reference-assets/final-pass';
await mkdir(out,{recursive:true});
const d=JSON.parse(await readFile(root+'/source-discovery.json','utf8'));
const url=d.scripts.find(s=>/ae\.d\.bundle/.test(s));
const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Source ${response.status}`);
const text=await response.text();
const snippets=[];
for(const term of ['Shuaib.mp4','Sushant.mp4','MRL_video_detail_page.mp4','CARS24UAEMRL.mp4','CARS24_certified_static_video.mp4']){
 const at=text.indexOf(term);if(at>=0)snippets.push({term,context:text.slice(Math.max(0,at-450),at+550)});
}
await writeFile(root+'/media-source-context.json',JSON.stringify(snippets,null,2));console.log(JSON.stringify(snippets));
const files=[['inspection.mp4','/ae/testimonial/MRL_video_detail_page.mp4'],['customer-0.mp4','/ae/testimonial/Shuaib.mp4'],['customer-1.mp4','/ae/testimonial/Sushant.mp4']];
const manifest=[];
for(const[name,part]of files){const source=new URL(part,'https://media-ae.cars24.com').href;const r=await fetch(source,{signal:AbortSignal.timeout(40000)});if(!r.ok){console.log('UNAVAILABLE',name,r.status);continue;}const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>60000000)throw Error('Unexpected video size');await writeFile(out+'/'+name,bytes);manifest.push({file:out+'/'+name,source,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});console.log('MEDIA',name,bytes.length);}
await writeFile(root+'/media-manifest.json',JSON.stringify(manifest,null,2));
