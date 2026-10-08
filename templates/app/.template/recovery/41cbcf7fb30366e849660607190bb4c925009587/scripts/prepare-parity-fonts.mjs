import fs from 'node:fs/promises';
const root='reference/2026-09-26-parity';
await fs.mkdir('public/fonts',{recursive:true});
const css=await fs.readFile(`${root}/google-fonts.css`,'utf8');
const faces=[...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);
let local='';
for(const face of faces){
 const family=face.match(/font-family:\s*'([^']+)'/)?.[1];
 const weight=face.match(/font-weight:\s*([^;]+);/)?.[1];
 const url=face.match(/url\(([^)]+)\)/)?.[1];
 if(!family||!weight||!url?.startsWith('https://fonts.gstatic.com/'))throw Error('Unexpected font source');
 const name=`${family.toLowerCase()}-${weight}.ttf`;
 const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Font download failed');
 await fs.writeFile(`public/fonts/${name}`,Buffer.from(await r.arrayBuffer()));
 local+=face.replace(url,`/fonts/${name}`)+'\n';
}
await fs.writeFile(`${root}/local-font-faces.css`,local);
console.log('Prepared font faces',faces.length);
const html=await fs.readFile(`${root}/public-mobile.html`,'utf8');
const decoded=html.replaceAll('\\"','"');
const matches=[...decoded.matchAll(/https:\/\/[^"<>\s]+(?:selected|Selected)[^"<>\s]*/g)].map(m=>m[0].replace(/\\$/,''));
console.log('SELECTED ART',JSON.stringify([...new Set(matches)].map(u=>u.split('?')[0])));
const index=decoded.indexOf('c6e40749',decoded.indexOf('self.__next_f'));
console.log('TILE CONFIG',decoded.slice(Math.max(0,index-600),index+1600));
