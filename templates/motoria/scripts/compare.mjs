import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const manifest=JSON.parse(await readFile('references/manifest.json','utf8'));
await mkdir('references/diffs',{recursive:true});
const results=[];
for(const route of manifest)for(const viewport of ['desktop','mobile']){
 const a=PNG.sync.read(await readFile(`references/screenshots/${route.name}-${viewport}.png`));
 const b=PNG.sync.read(await readFile(`references/local/${route.name}-${viewport}.png`));
 const height=Math.min(a.height,b.height),width=a.width;
 // The reference's theme-marketplace toolbar varies by domain. Compare the product below it.
 const top=viewport==='desktop'?94:0;
 const aa=a.data.subarray(top*width*4,height*width*4),bb=b.data.subarray(top*width*4,height*width*4);
 const diff=new PNG({width,height:height-top});
 const pixels=pixelmatch(aa,bb,diff.data,width,height-top,{threshold:0.12});
 await writeFile(`references/diffs/${route.name}-${viewport}.png`,PNG.sync.write(diff));
 const row={name:route.name,viewport,referenceHeight:a.height,localHeight:b.height,diffPercent:Math.round(pixels/(width*(height-top))*10000)/100};results.push(row);console.log(row);
}
await writeFile('references/comparison.json',JSON.stringify(results,null,2));
