import { chromium } from 'playwright';
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
const browser=await chromium.connectOverCDP(process.argv[2]);
const context=browser.contexts()[0];
const assets=JSON.parse(await readFile('references/assets.json','utf8'));
const manifest=JSON.parse(await readFile('references/manifest.json','utf8'));
const queue=new Set();
function add(value,base){
 try{const u=new URL(value,base);u.hash='';if(/^(motors|static)\.stylemixthemes\.com$/.test(u.hostname)&&/\.(jpg|jpeg|png|webp|svg|gif|woff2?|ttf|eot|css|js|mp4)$/i.test(u.pathname)&&!assets[u.href])queue.add(u.href);}catch{}
}
for(const route of manifest){
 for(const suffix of ['html','rendered.html']){
 const s=await readFile(`references/pages/${route.name}.${suffix}`,'utf8');const $=load(s);
 $('[src],[href],[data-src],[srcset]').each((_,e)=>{for(const attr of ['src','href','data-src'])add($(e).attr(attr),route.source);for(const part of ($(e).attr('srcset')||'').split(','))add(part.trim().split(/\s/)[0],route.source);});
 for(const m of s.matchAll(/https?:[^\s"'<>\\]+?\.(?:jpg|png|webp|jpeg|woff2?|ttf|svg|mp4)(?:\?[^\s"'<>\\]*)?/g))add(m[0],route.source);
 }
}
// Fetch only referenced CSS resources, including inactive font and responsive variants.
for(const [url,asset]of Object.entries(assets))if(asset.type==='stylesheet'){
 const css=await readFile('static'+asset.path,'utf8');
 for(const m of css.matchAll(/url\(\s*["']?([^\)"']+)/g))add(m[1],url);
}
console.log('Referenced assets to complete:',queue.size);
let count=0;const failures=[];
const urls=[...queue];
async function worker(){while(urls.length){const url=urls.shift();try{
 const r=await context.request.get(url,{timeout:20000});
 if(!r.ok())throw new Error('HTTP '+r.status());
 const body=await r.body();const ext=new URL(url).pathname.match(/\.[a-z0-9]+$/i)[0];
 const path='/mirror/'+createHash('sha256').update(url).digest('hex').slice(0,20)+ext;
 const type=/\.(css)$/.test(ext)?'stylesheet':/\.(js)$/.test(ext)?'script':/\.(woff2?|ttf|eot)$/.test(ext)?'font':ext==='.mp4'?'media':'image';
 await writeFile('static'+path,body);assets[url]={path,type,bytes:body.length};count++;
 if(count%50===0)console.log('Saved',count);
 }catch(e){failures.push({url,error:e.message});}}}
await Promise.all(Array.from({length:6},worker));
await writeFile('references/assets.json',JSON.stringify(assets,null,2));
await writeFile('references/asset-failures.json',JSON.stringify(failures,null,2));
console.log('Completed',count,'failed',failures.length);
await browser.close();
