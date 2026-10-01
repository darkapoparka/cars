import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const folder='reference/android/x6-gallery-complete';const entries=[];
for(let i=1;i<=20;i++){
 const id=String(i).padStart(2,'0');const xml=await fs.readFile(folder+'/'+id+'.xml','utf8');
 if(!xml.includes(`text="${i} / 20"`))throw Error('Missing verified native gallery frame '+i);
 const asset='/images/x6-gallery-'+id+'.webp';await sharp(folder+'/'+id+'.png').extract({left:0,top:1026,width:1280,height:960}).webp({quality:95}).toFile('public'+asset);
 const bytes=await fs.readFile('public'+asset);entries.push({index:i,asset,source:folder+'/'+id+'.png',crop:{left:0,top:1026,width:1280,height:960},sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
await fs.writeFile(folder+'/manifest.json',JSON.stringify({at:new Date().toISOString(),nativeCount:20,captured:entries.length,entries},null,2));
const p='src/lib/catalog.ts';let t=await fs.readFile(p,'utf8');const start=t.indexOf("    images: [",t.indexOf("id: 'bmw-x6'"));const end=t.indexOf('    ],',start);if(start<0||end<0)throw Error('X6 image block missing');
t=t.slice(0,start)+"    images: "+JSON.stringify(entries.map(e=>e.asset))+','+t.slice(end+6);await fs.writeFile(p,t);
console.log('Integrated '+entries.length+' actual photographs; unique hashes '+new Set(entries.map(e=>e.sha256)).size);
