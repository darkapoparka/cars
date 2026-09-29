import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
function one(source,a,b){if(source.split(a).length!==2)throw Error('Nonunique final match: '+a.slice(0,100));return source.replace(a,b);}
async function edit(path,sha,change){const source=await readFile(path,'utf8');if(createHash('sha256').update(source).digest('hex')!==sha)throw Error('Source changed: '+path);changes.push([path,change(source)]);}
await edit('components/VehicleDetailClient.tsx','87abfe7d73c041137e786af1b2af2b7a3f6106ce256f5aa06cf7246cdc6280b6',source=>{
 source=one(source,"{label:'Exteriors',image:vehicle.image}","{label:'Exteriors',image:primaryImage}");
 return one(source,"const first=photos.find(p=>p.category===category);","const first=(category==='Interiors'?photos.find(p=>/Right Side Front Door Cabin/i.test(p.label)):category==='Features'?photos.find(p=>/Steering Wheel/i.test(p.label)):undefined)??photos.find(p=>p.category===category);");
});
await edit('scripts/verify-captured-detail-coverage.mjs','fb7d9af54965098434f3b53a74db07dccf077ce7d9fdd183e2e5b23598e518cd',source=>one(source,"  await b.click(`document.querySelector('[aria-label=\"Open vehicle video tour\"]')`);await b.waitFor(`!!document.querySelector('[aria-label=\"Vehicle video tour\"] video')`);",`  // Real pointer activation is required by the browser's audio-autoplay contract.
  const tourPoint=await b.evaluate(\`(()=>{const r=document.querySelector('[aria-label="Open vehicle video tour"]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()\`);
  for(const type of ['mousePressed','mouseReleased'])await b.send('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...tourPoint});
  await b.waitFor(\`!!document.querySelector('[aria-label="Vehicle video tour"] video')\`);`));
for(const[path,source]of changes){await writeFile(path,source);console.log('UPDATED',path);}
