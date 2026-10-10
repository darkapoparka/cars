import sharp from 'sharp';
import fs from 'node:fs/promises';
const jobs=[['first','99-popular-next',81,1766,844,528],['premium','102-home-types-next',62,1766,844,528],['eco','103-popular-eco',298,1766,844,528],['new','100-featured-more',410,1049,546,252]];
for(const [name,source,left,top,width,height] of jobs){await sharp('reference/android/'+source+'.png').extract({left,top,width,height}).webp({quality:95}).toFile('public/images/discovery/'+name+'.webp');}
await fs.writeFile('reference/web/pass2/discovery-assets-additional.json',JSON.stringify(jobs,null,2));
