import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const fontDir=process.argv[2]||'public/fonts';
for (const filename of fs.readdirSync(fontDir)) {
  const b=fs.readFileSync(path.join(fontDir,filename));
  const count=b.readUInt16BE(4); let offset=0;
  for(let i=0;i<count;i++) if(b.toString('ascii',12+i*16,16+i*16)==='name') offset=b.readUInt32BE(20+i*16);
  if(!offset) continue;
  const n=b.readUInt16BE(offset+2), start=offset+b.readUInt16BE(offset+4), names=[];
  for(let i=0;i<n;i++) { const p=offset+6+i*12, id=b.readUInt16BE(p+6); if(![1,2,6].includes(id))continue; const len=b.readUInt16BE(p+8), o=start+b.readUInt16BE(p+10); const value=Buffer.from(b.subarray(o,o+len)); if(b.readUInt16BE(p)===3)value.swap16(); names.push(value.toString(b.readUInt16BE(p)===3?'utf16le':'utf8')); }
  console.log(filename,[...new Set(names)].join(' | '));
}
if(process.argv[2]) process.exit(0);
const pairs=[['17-home','home'],['02-search-cars','search'],['26-sell','sell'],['18-profile','profile'],['12-car-park','park'],['11-my-searches','searches'],['07-results-clean','results'],['08-detail','detail']];
for(const [android,web] of pairs){
  const input='reference/android/'+android+'.png'; const meta=await sharp(input).metadata();
  console.log(android,meta.width,meta.height);
  const normalized=await sharp(input).extract({left:0,top:168,width:1280,height:2616}).resize(427,872).toBuffer();
  await sharp({create:{width:854,height:872,channels:3,background:'#fff'}}).composite([{input:normalized,left:0,top:0},{input:'reference/web/resume/'+web+'.png',left:427,top:0}]).png().toFile('reference/web/resume/compare-'+web+'.png');
}
