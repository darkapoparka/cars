import fs from 'node:fs/promises';import path from 'node:path';
const root='J:/cars/clients/ivo-auto';
async function walk(d){let a=[];for(const e of await fs.readdir(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())a.push(...await walk(p));else a.push(p)}return a}
for(const p of await walk(root+'/carwow/src'))if(/\.(svelte|ts)$/.test(p)){
 let s=await fs.readFile(p,'utf8');
 s=s.replaceAll('/assets/images/assets/ivo-auto/vehicle-01-1.webp','/assets/ivo-auto/wordmark.svg');
 if(p.endsWith('.svelte'))s=s.replace(/<a\b[^>]*(?:aria-label="(?:Facebook|Instagram)"|href="https:\/\/ivoauto-varna\.mobile\.bg\/"[^>]*aria-label="(?:Facebook|Instagram)")[^>]*>[\s\S]*?<\/a>/g,'');
 await fs.writeFile(p,s);
}
const mobile=root+'/carwow/src/lib/components/home/mobile/mobile-home-data.ts';let s=await fs.readFile(mobile,'utf8');s=s.replace(/export const footerSocialLinks: FooterSocialLink\[\] = \[[\s\S]*?\n\];/,"export const footerSocialLinks: FooterSocialLink[] = [{label:'Mobile.bg',title:'Публикувани обяви',icon:'mobilebg',href:daynightSite.sourceInventory,external:true}];");await fs.writeFile(mobile,s);
const header=root+'/auto-best/src/lib/components/layout/Header.svelte';s=await fs.readFile(header,'utf8');s=s.replace(/<div class="dn-mobile-menu__social"[\s\S]*?<\/div>/,'<div class="dn-mobile-menu__social"><a href={brand.stockUrl} target="_blank" rel="noopener noreferrer">Обяви в Mobile.bg</a></div>');await fs.writeFile(header,s);
const video=root+'/auto-best/src/lib/components/home/VideoSection.svelte';s=await fs.readFile(video,'utf8');s=s.replace(/^\s*\.dn-videos__(?:brand-mark|intro) \{[^\n]+\}\s*$/gm,'');await fs.writeFile(video,s);
