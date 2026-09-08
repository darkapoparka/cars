import { load } from 'cheerio';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const base = 'https://live.themewild.com/rencar/';
const pages = new Map();
const assets = new Map();
const failed = [];
const pendingPages = new Set(['index.html']);
await mkdir('reference/pages', { recursive: true });
await mkdir('public', { recursive: true });
function assetPath(url) {
  const u = new URL(url);
  if (url.startsWith(base)) return '/' + u.pathname.slice('/rencar/'.length);
  const ext = path.extname(u.pathname) || '.css';
  return '/assets/external/' + createHash('sha256').update(url).digest('hex').slice(0,20) + ext;
}
function enqueue(url) {
  if (/^(data:|#|mailto:|tel:|javascript:)/.test(url)) return;
  if (!assets.has(url)) assets.set(url, { local: assetPath(url), done: false });
}
async function fetchRetry(url) {
  for (let n=0;n<3;n++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    } catch(e) { if(n===2) throw e; }
  }
}
while(pendingPages.size) {
  const batch = [...pendingPages].slice(0,6);
  batch.forEach(p=>pendingPages.delete(p));
  await Promise.all(batch.map(async name => {
    if(pages.has(name)) return;
    pages.set(name, null);
    try {
      const html = await (await fetchRetry(base+name)).text();
      if(!html.includes('Rencar')) throw new Error('Unexpected page');
      await writeFile('reference/pages/'+name,html);
      const $ = load(html);
      const styles = $('link[rel="stylesheet"]').map((i,e)=>new URL($(e).attr('href'),base).href).get();
      const scripts = $('script[src]').map((i,e)=>new URL($(e).attr('src'),base).href).get();
      pages.set(name,{title:$('title').text(),bodyClass:$('body').attr('class')||'',styles,scripts});
      $('a[href]').each((i,e)=>{
        const href = $(e).attr('href');
        const u=new URL(href,base);
        if(u.href.startsWith(base) && /\/[^/]+\.html$/.test(u.pathname)) {
          const target=u.pathname.split('/').pop();
          if(!pages.has(target)) pendingPages.add(target);
        }
      });
      $('[src],link[rel="stylesheet"],link[rel="icon"],[data-background]').each((i,e)=>{
        const url=$(e).attr('src')||$(e).attr('href')||$(e).attr('data-background');
        if($(e).is('iframe')) return;
        enqueue(new URL(url,base).href);
      });
      for(const m of html.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) enqueue(new URL(m[1],base).href);
      console.log('Page',name);
    } catch(e) { failed.push({url:base+name,error:e.message}); }
  }));
}
while([...assets.values()].some(a=>!a.done)) {
  const batch = [...assets].filter(([u,a])=>!a.done).slice(0,10);
  await Promise.all(batch.map(async ([url, entry])=>{
    entry.done=true;
    try {
      const r=await fetchRetry(url);
      let buf=Buffer.from(await r.arrayBuffer());
      if(entry.local.endsWith('.css')) {
        let css=buf.toString();
        css=css.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(whole,q,relative)=>{
          if(relative.startsWith('data:')||relative.startsWith('#')) return whole;
          const target=new URL(relative,url).href;
          enqueue(target);
          return 'url("'+assetPath(target)+'")';
        });
        css=css.replace(/@import\s+(['"])([^'"]+)\1/g,(whole,q,relative)=>{
          const target=new URL(relative,url).href; enqueue(target); return '@import "'+assetPath(target)+'"';
        });
        buf=Buffer.from(css);
      }
      const dest=path.join(root,'public',entry.local);
      await mkdir(path.dirname(dest),{recursive:true});
      await writeFile(dest,buf);
      entry.bytes=buf.length;
    } catch(e) { entry.error=e.message; failed.push({url,error:e.message}); }
  }));
  console.log('Assets', [...assets.values()].filter(a=>a.done).length, '/',assets.size);
}
await writeFile('reference/manifest.json',JSON.stringify(Object.fromEntries([...pages].filter(([k,v])=>v)),null,2));
await writeFile('reference/assets.json',JSON.stringify(Object.fromEntries(assets),null,2));
await writeFile('reference/failures.json',JSON.stringify(failed,null,2));
console.log('Complete:',pages.size,'pages,',assets.size,'assets,',failed.length,'failures');
