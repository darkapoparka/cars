import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { load } from 'cheerio';

const root = new URL('../', import.meta.url);
const assets = JSON.parse(await readFile(new URL('references/assets.json',root),'utf8'));
const manifest = JSON.parse(await readFile(new URL('references/manifest.json',root),'utf8'));
const base='https://motors.stylemixthemes.com';
const replacements = Object.entries(assets).map(([url,asset]) => {
 const parsed = new URL(url);
 return [url, parsed.origin === base ? decodeURI(parsed.pathname).replace(/\/+/g,'/') : asset.path];
}).sort((a,b)=>b[0].length-a[0].length);
const localPaths = new Map(replacements);
const externalReplacements = replacements.filter(([url]) => !url.startsWith(base));
function rewrite(text) {
 for(const [url,path] of externalReplacements) {
  text=text.replaceAll(url,path).replaceAll(url.replaceAll('/','\\/'),path.replaceAll('/','\\/'));
 }
 return text.replaceAll(base,'').replaceAll(base.replaceAll('/','\\/'),'').replaceAll('//motors.stylemixthemes.com','').replaceAll('typeof google.maps.LatLng','typeof globalThis.google?.maps?.LatLng');
}
for(const [url,asset] of Object.entries(assets)) {
 const target = localPaths.get(url);
 const source = new URL('static'+asset.path,root);
 const content=await readFile(source);
 const output=new URL('static'+target,root);
 await mkdir(dirname(output.pathname.replace(/^\/([A-Z]:)/,'$1')),{recursive:true});
 await writeFile(output,['stylesheet','script'].includes(asset.type)?rewrite(content.toString()):content);
}
await mkdir(new URL('src/lib/snapshots/',root),{recursive:true});
for(const entry of manifest) {
 const source=await readFile(new URL(`references/pages/${entry.name}.html`,root),'utf8');
 const $=load(source);
 // Remove document discovery, trackers and live third-party transactional integrations.
 $('link[rel="pingback"],link[rel="https://api.w.org/"],link[rel="EditURI"],link[rel="alternate"],link[rel="canonical"],script[type="speculationrules"]').remove();
 $('script').each((_,e)=>{
  const s=$(e); const src=s.attr('src')||''; const text=s.text();
  if(/recaptcha|maps.googleapis|checkout.freemius/.test(src)||/_paq.push|api\/prices.json|challenge-platform/.test(text))s.remove();
 });
 $('a[href],form[action]').each((_,e)=>{
  const el=$(e),attr=e.tagName==='form'?'action':'href',value=el.attr(attr);
  try {
   const u=new URL(value,entry.source);
   if(u.origin!==base)return;
   const clean=u.pathname.replace(/^\/elementor-classified-(one|four)/,'');
   const match=manifest.find(x=>x.route===clean);
   if(match)el.attr(attr,match.route+u.search+u.hash);
   else if(clean==='/inventory/')el.attr(attr,'/inventory/'+u.search+u.hash);
   else if(attr==='href' && !/\.(jpg|jpeg|png|svg|pdf|webp)$/i.test(u.pathname))el.attr(attr,'__REFERENCE_ORIGIN__'+u.pathname+u.search+u.hash);
   if(attr==='href' && el.text().trim().toLowerCase()==='listing')el.attr(attr,'/listings/bmw-m5/');
  }catch{}
 });
 $('#stm_wrapper').addClass('has-freemius-checkout');
 $('[aria-required="true"]').attr('required','');
 if(entry.name==='contact-us'){
  $('[id^="stm_map-"]').html('<iframe title="Motors location map" src="https://maps.google.com/maps?q=34.070557075299,-117.90565504238&z=7&output=embed" width="100%" height="100%" style="border:0;display:block" loading="lazy" allowfullscreen></iframe>');
 }
 const pricing=$('.elementor-1678 > .elementor-top-section');
 pricing.each((_,e)=>{
  const heading=$(e).find('h2').text().trim();
  const match=heading.match(/^Style (\d+)$/i);
  if(match){$(e).attr('data-pricing-style',match[1]);$(e).attr('id',`style-${match[1]}`);}
 });
 const head=rewrite($('head').html())+'<link rel="stylesheet" href="/local-overrides.css">';
 let body=rewrite($('body').html()).replaceAll('__REFERENCE_ORIGIN__',base);
 body+='<script src="/local-runtime.js" defer></script>';
 const attributes=Object.entries($('body').attr()).filter(([name])=>!name.startsWith('on')).map(([key,value])=>`${key}="${value.replaceAll('"','&quot;')}"`).join(' ');
 const snapshot={...entry,head,body,bodyAttributes:attributes};
 await writeFile(new URL(`src/lib/snapshots/${entry.name}.json`,root),JSON.stringify(snapshot));
 console.log('Prepared',entry.route);
}
const renderedHome=load(await readFile(new URL('references/pages/home.rendered.html',root),'utf8'));
await mkdir(new URL('src/lib/data/',root),{recursive:true});
await writeFile(new URL('src/lib/data/widget-tabs.json',root),JSON.stringify(Object.fromEntries(['popular','recent'].map(tab=>[tab,rewrite(renderedHome(`#${tab}-tab-content`).html()||'')]))));
await writeFile(new URL('references/local-assets.json',root),JSON.stringify(Object.fromEntries(replacements),null,2));
