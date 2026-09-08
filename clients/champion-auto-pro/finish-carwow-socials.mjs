import fs from 'node:fs/promises';import path from 'node:path';const root=import.meta.dirname+'/carwow';
async function walk(d){for(const e of await fs.readdir(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())await walk(p);else if(/\.(svelte|ts)$/.test(p)){
let s=await fs.readFile(p,'utf8'),t=s;
for(const url of ['https://www.facebook.com/61566304063141/','https://www.instagram.com/daynight.auto.plovdiv/']){t=t.replaceAll(`href="${url}"`,'hidden href="https://championautopro.mobile.bg/"').replaceAll(`href: '${url}'`,"href: 'https://championautopro.mobile.bg/', hidden: true");}
t=t.replace('<a {...youtubeLink} aria-label="YouTube">','<a hidden {...youtubeLink} aria-label="YouTube">').replace('<a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">','<a hidden href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">');
if(p.endsWith('mobile-home-data.ts'))t=t.replace(/\{\s*label: '(Facebook|Instagram)',[\s\S]*?\},\s*/g,'');
t=t.replaceAll('on 2026-07-24','on 2026-09-07');if(t!==s)await fs.writeFile(p,t);
}}}await walk(root+'/src');console.log('Inherited unrelated social destinations suppressed.');
