import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-finish';await mkdir(root,{recursive:true});
const details=JSON.parse(await readFile('lib/captured-vehicle-details.json','utf8'));
const cases=[{slug:'2024-toyota-fortuner-exr',native:'finish-native-detail',boxes:[[67,904,353,146],[453,904,354,146],[840,904,354,146]]},{slug:'2023-suzuki-ciaz-glx',native:'recovery-native-ciaz',boxes:[[67,904,264,146],[364,904,264,146],[662,904,264,146],[960,904,264,146]]}];
const output=[];
for(const c of cases){const d=details[c.slug];const paths=[...new Set([d.primaryImage,d.videoTour?.poster,...d.gallery.map(p=>p.src)].filter(Boolean))];const list=[];
 for(const [left,top,width,height] of c.boxes){const native=await sharp(`reference/2026-09-26-continuation/${c.native}.png`).extract({left,top,width,height}).removeAlpha().raw().toBuffer();const ranks=[];
  for(const src of paths)for(const fit of ['cover','fill']){const im=await sharp('public'+src).resize(width,height,{fit}).removeAlpha().raw().toBuffer();let sum=0,n=0;for(let y=8;y<height-8;y++){if(y>39&&y<108)continue;let xx=0,xy=0;for(let x=8;x<width-8;x++)for(let ch=0;ch<3;ch++){const k=(y*width+x)*3+ch;xx+=im[k]*im[k];xy+=im[k]*native[k];}const a=Math.min(1,Math.max(.03,xy/(xx||1)));for(let x=8;x<width-8;x++)for(let ch=0;ch<3;ch++){const k=(y*width+x)*3+ch;sum+=Math.abs(im[k]*a-native[k]);n++;}}ranks.push({src,fit,mae:sum/n});}
  ranks.sort((a,b)=>a.mae-b.mae);list.push({left,width,top:ranks.slice(0,4)});
 }
 output.push({slug:c.slug,thumbs:list});
}
await writeFile(root+'/thumbnail-match.json',JSON.stringify(output,null,2));console.log(JSON.stringify(output));
