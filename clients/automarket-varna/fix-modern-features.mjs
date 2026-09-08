import fs from 'node:fs';
const path=new URL('./modern/packages/marketplace-domain/testing/mock-data.ts',import.meta.url);
const src=fs.readFileSync(path,'utf8');
let count=0;
const next=src.replace(/"features": (\[[\s\S]*?\n    \])/g,(_,json)=>{
  const entries=JSON.parse(json); if(entries.every(x=>typeof x!=='string')) return `"features": ${json}`;
  count++; return `"features": ${JSON.stringify(entries.map(x=>typeof x==='string'?{bg:x,en:x}:x),null,2).replace(/\n/g,'\n    ')}`;
});
fs.writeFileSync(path,next); console.log({convertedListings:count});
