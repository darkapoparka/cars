import {readFile,writeFile} from 'node:fs/promises';
const kind=process.argv[2]??'finance';
const html=await readFile(`reference/2026-09-26-parity/public-${kind}.html`,'utf8');
const stream=[...html.matchAll(/self\.__next_f\.push\((\[.*?\])\)<\/script>/gs)].flatMap(m=>{try{const v=JSON.parse(m[1]);return v[0]===1&&typeof v[1]==='string'?[v[1]]:[];}catch{return[];}}).join('');
const map=new Map();for(const line of stream.split('\n')){const m=line.match(/^([0-9a-f]+):(.*)$/);if(m){try{map.set(m[1],JSON.parse(m[2].replace(/^T[0-9a-f]+,/,'')));}catch{}}}
function resolve(v,seen=new Set(),depth=0){if(depth>60)return v;if(typeof v==='string'&&/^\$[0-9a-f]+$/.test(v)&&map.has(v.slice(1))&&!seen.has(v))return resolve(map.get(v.slice(1)),new Set([...seen,v]),depth+1);if(typeof v==='string'&&/^[\[{]/.test(v)){try{return resolve(JSON.parse(v),seen,depth+1);}catch{}}if(Array.isArray(v))return v.map(x=>resolve(x,seen,depth+1));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,resolve(x,seen,depth+1)]));return v;}
const widgets=new Map();function walk(v){if(Array.isArray(v)){v.forEach(walk);return;}if(!v||typeof v!=='object')return;if(v.widgetKey&&v.widgetHeader)widgets.set(v.widgetKey,v);Object.values(v).forEach(walk);}
for(const v of map.values())walk(resolve(v));
await writeFile(`reference/2026-09-26-continuation/config-${kind}.json`,JSON.stringify([...widgets.values()],null,2));
for(const [key,v] of widgets)console.log(key,JSON.stringify(v).slice(0,200));
const match=process.argv[3];if(match)for(const [key,v] of widgets)if(key.includes(match))console.log('MATCH',JSON.stringify(v));
