import {readFile,writeFile} from 'node:fs/promises';
const root='reference/2026-09-26-parity';
const name=process.argv[2]??'mobile';
const html=await readFile(`${root}/public-${name}.html`,'utf8');
const stream=[...html.matchAll(/self\.__next_f\.push\((\[.*?\])\)<\/script>/gs)].flatMap(m=>{try{const v=JSON.parse(m[1]);return v[0]===1&&typeof v[1]==='string'?[v[1]]:[];}catch{return[];}}).join('');
const map=new Map();
for(const line of stream.split('\n')){const match=line.match(/^([0-9a-f]+):(.*)$/);if(match){try{map.set(match[1],JSON.parse(match[2].replace(/^T[0-9a-f]+,/,'')));}catch{}}}
function resolve(value,seen=new Set(),depth=0){
 if(depth>60)return value;
 if(typeof value==='string'&&/^\$[0-9a-f]+$/.test(value)&&map.has(value.slice(1))&&!seen.has(value))return resolve(map.get(value.slice(1)),new Set([...seen,value]),depth+1);
 if(typeof value==='string'&&/^[\[{]/.test(value)){try{return resolve(JSON.parse(value),seen,depth+1);}catch{}}
 if(Array.isArray(value))return value.map(v=>resolve(v,seen,depth+1));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,resolve(v,seen,depth+1)]));
 return value;
}
const found=[],images=[],sections=[];
function walk(value){
 if(Array.isArray(value)){for(const item of value)walk(item);return;}
 if(!value||typeof value!=='object')return;
 if(value.carItem||value.listingImage&&value.make)found.push(value);
 if(value.widgetKey&&value.widgetHeader)sections.push({key:value.widgetKey,header:value.widgetHeader,type:value.type});
 if(value.url&&typeof value.url==='string'&&/\.(png|jpg|webp|svg)/i.test(value.url))images.push({url:value.url,alt:value.alt??''});
 for(const child of Object.values(value))walk(child);
}
for(const value of map.values())walk(resolve(value));
const unique=[...new Map(found.map(v=>[v.carItem?.appointmentId??v.carItem?.id??v.appointmentId??JSON.stringify(v.listingImage),v])).values()];
await writeFile(`reference/2026-09-26-continuation/data-${name}.json`,JSON.stringify({cards:unique,sections:[...new Map(sections.map(v=>[v.key,v])).values()],images:[...new Map(images.map(v=>[v.url,v])).values()]},null,2));
console.log(JSON.stringify({name,streamLength:stream.length,records:map.size,cards:unique.length,sections:[...new Set(sections.map(v=>v.key))],vehicles:unique.slice(0,45).map(v=>({title:v.title,make:v.make,model:v.model,price:v.listingPrice,image:v.listingImage}))}));
if(!unique.length)console.log('DIAGNOSTIC',stream.split('\n').map(v=>v.slice(0,150)).slice(0,35));
