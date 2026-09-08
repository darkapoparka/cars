import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const project=path.resolve(import.meta.dirname,'..');
const donor='M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/autodeal-best-day-night';
const names=['day-night-logo.png','day-night-home-black-v1.webp','day-night-home-hero-v3.webp','day-night-cutout-silver-v1.webp','day-night-cutout-graphite-v1.webp','day-night-cutout-gclass-v1.webp','day-night-cutout-urus-v1.webp','day-night-showroom-color-v1.webp','day-night-studio-keys-v1.webp','day-night-about-showroom-v1-light.webp','day-night-sell-banner-v1.webp','day-night-import-banner-v1.webp',...Array.from({length:6},(_,i)=>`day-night-stock-0${i+1}.webp`)];
const destination=path.join(project,'public/daynight');
await fs.mkdir(destination,{recursive:true});
const files=[];
for(const name of names){
 const source=path.join(donor,'static/assets/images/lead',name),bytes=await fs.readFile(source);
 const target=path.join(destination,name),existing=await fs.readFile(target).catch(()=>null);
 if(existing && !existing.equals(bytes))throw new Error(`Destination differs: ${name}`);
 if(!existing)await fs.writeFile(target,bytes,{flag:'wx'});
 files.push({name,source,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await fs.mkdir(path.join(project,'.client/provenance'),{recursive:true});
await fs.writeFile(path.join(project,'.client/provenance/assets.json'),JSON.stringify({importedAt:new Date().toISOString(),donor,donorHead:'ab92ce9671fb1b56afa38f693755b41aee9c28b0',includesCurrentUncommittedAssets:true,files},null,2));
for(const name of ['ASSET_PROVENANCE.md','SOURCE_LICENSE.md','provenance/vehicle-cutouts-2026-09-06.md']){
 await fs.copyFile(path.join(donor,name),path.join(project,'.client/provenance',path.basename(name)));
}
console.log(JSON.stringify({imported:files.length,destination}));
