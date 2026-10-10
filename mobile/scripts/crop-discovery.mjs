import sharp from 'sharp';
import fs from 'node:fs/promises';
const out='public/images/discovery';await fs.mkdir(out,{recursive:true});
const jobs=[
 ['electric','72-home-categories',48,864,546,252],
 ['leasing','72-home-categories',640,864,546,252],
 ['family','72-home-categories',48,1581,844,528],
 ['estate','73-home-history',48,2231,546,236],
 ['saloon','73-home-history',640,2231,546,236],
];
for(const [name,source,left,top,width,height] of jobs){await sharp('reference/android/'+source+'.png').extract({left,top,width,height}).webp({quality:95}).toFile(out+'/'+name+'.webp');}
await fs.writeFile('reference/web/pass2/discovery-assets.json',JSON.stringify(jobs,null,2));
