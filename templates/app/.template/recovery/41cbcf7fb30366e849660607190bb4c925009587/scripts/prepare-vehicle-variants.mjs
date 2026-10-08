import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='reference/2026-09-26-final-pass/vehicle-details';
const manifest=JSON.parse(await readFile(root+'/manifest.json','utf8'));
const variants={},jobs=[];
for(const entry of manifest.results){if(!entry.file)continue;const {content:c}=JSON.parse(await readFile(entry.file,'utf8'));const variant={};
 if(c.aiVideoLink?.videoLink&&c.aiVideoLink.thumbnail){
  const video=new URL(c.aiVideoLink.videoLink),poster=new URL(c.aiVideoLink.thumbnail);
  if(video.protocol!=='https:'||poster.protocol!=='https:'||video.hostname!=='media-ae.cars24.com'||poster.hostname!=='media-ae.cars24.com')throw Error('Unexpected video host');
  variant.videoTour={src:`/reference-assets/vehicle-details/${entry.id}/tour.mp4`,poster:`/reference-assets/vehicle-details/${entry.id}/tour.jpg`};
  jobs.push({source:video.href,file:'public'+variant.videoTour.src},{source:poster.href,file:'public'+variant.videoTour.poster});
 }
 if(c.priceCompare)variant.priceComparison=c.priceCompare;
 variant.category=c.assortmentCategory;
 variant.subcategory=c.assortmentSubCategory;
 variants[entry.slug]=variant;
}
console.log('VARIANTS',JSON.stringify(variants));
let next=0,blocked=false;const failures=[];
async function worker(){while(next<jobs.length&&!blocked){const job=jobs[next++];try{await access(job.file);continue;}catch(error){if(error.code!=='ENOENT')throw error;}try{const response=await fetch(job.source,{signal:AbortSignal.timeout(45000)});if([401,403,429].includes(response.status)){blocked=true;throw Error('Public media access limit');}if(!response.ok)throw Error(`Media HTTP ${response.status}`);if(Number(response.headers.get('content-length'))>100000000)throw Error('Unexpected large clip');const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>100000000)throw Error('Clip size exceeds limit');await mkdir(job.file.slice(0,job.file.lastIndexOf('/')),{recursive:true});await writeFile(job.file,bytes);job.sha256=createHash('sha256').update(bytes).digest('hex');job.bytes=bytes.length;console.log('MEDIA',job.file,bytes.length);}catch(error){failures.push({...job,error:error.message});}}}
await Promise.all([worker(),worker(),worker()]);
await writeFile(root+'/variant-media-manifest.json',JSON.stringify({jobs,failures,blocked},null,2));if(failures.length||blocked)throw Error('Media incomplete; variant index not promoted');
await writeFile(root+'/variant-data.json',JSON.stringify(variants,null,2));
// Native Prime artwork and structural illustration are isolated graphics, not flattened UI.
const image=sharp('reference/2026-09-26-continuation/final-ciaz-lower.png');const m=await image.metadata(),scale=m.width/427;
await image.extract({left:Math.round(32*scale),top:Math.round(466*scale),width:Math.round(363*scale),height:Math.round(234*scale)}).png().toFile('public/reference-assets/final-pass/prime-assurance.png');
console.log(JSON.stringify({vehicles:Object.keys(variants).length,videoTours:jobs.length/2,failed:failures.length}));
