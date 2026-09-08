import { load } from 'cheerio';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin='https://demoapus1.com/boxcar/';
const routes=['','listings/','listings/page/2/','listing/ranger-white-2022/','blog/?style=full','blog/page/2/?style=full','bmw-x6-m50i-is-designed-to-exceed-your-sportiest/','contact-us/','about-us/','compare/','calculator/','services/','terms-and-conditions/'];
const pages=[]; const assets=new Map(); const failures=[];
await mkdir('public/assets',{recursive:true}); await mkdir('src/generated',{recursive:true});
function asset(url,base=origin){
 if(!url||/^(data:|#|mailto:|tel:|javascript:)/.test(url))return url;
 try {url=new URL(url,base).href;}catch{return url;}
 if(!/^https?:/.test(url))return url;
 if(assets.has(url))return assets.get(url).local;
 const ext=new URL(url).pathname.match(/\.(\w{1,6})$/)?.[1]||(/fonts.googleapis/.test(url)?'css':'bin');
 const local='/assets/'+createHash('sha256').update(url).digest('hex').slice(0,18)+'.'+ext;
 assets.set(url,{url,local,ext});return local;
}
function css(text,base){return text.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g,(m,q,url)=>`url("${asset(url,base)}")`).replace(/@import\s+(['"])(.*?)\1/g,(m,q,url)=>`@import "${asset(url,base)}"`);}
function routeUrl(href){
 if(!href)return href;
 if(href.startsWith('http://localhost/boxcar'))href=href.replace('http://localhost/boxcar',origin.slice(0,-1));
 if(!href.startsWith(origin))return href;
 let p=href.slice(origin.length);
 if(/^listing-(make|type|label)\//.test(p)){const [kind,value]=p.replace(/\/$/,'').split('/');return `/listings/?filter-${kind.replace('listing-','')}=${value}`;}
 if(/^listing-v\d/.test(p)||p==='listing/'||p==='listing')return '/listings/';
 if(/^home-/.test(p))return '/';
 return '/'+p;
}
async function fetchPage(route){
 const url=origin+route; const response=await fetch(url);if(!response.ok)throw new Error(`${response.status} ${url}`);
 const html=await response.text();await writeFile(`reference/${route.replace(/[^a-z0-9]/gi,'_')||'home'}-raw.html`,html);
 const $=load(html);const title=$('title').text();
 if(route==='blog/?style=full'){
  for(const href of $('article a[href]').map((i,e)=>$(e).attr('href')).get()){
   const r=href.replace(origin,''); if(href.startsWith(origin)&&r.split('/').filter(Boolean).length===1&&!routes.includes(r))routes.push(r);
  }
 }
 if(route===''){
  for(const href of $('a[href]').map((i,e)=>$(e).attr('href')).get()){
   if(href.startsWith(origin)&&(/\/listing\/[^/]+\/?$/.test(href)||/\/\d{4}\//.test(href))){const r=href.slice(origin.length);if(!routes.includes(r)&&!routes.includes(r+'/'))routes.push(r);}
  }
 }
 const styles=[];
 $('link[rel="stylesheet"],style').each((i,e)=>{if(e.tagName==='link')styles.push({href:asset($(e).attr('href'),url),media:$(e).attr('media')||'all'});else styles.push({text:css($(e).html()||'',url)});});
 $('script,link,style,noscript,#wpadminbar').remove();
 $('*').each((i,e)=>{
  const el=$(e);
  for(const [key,value] of Object.entries(e.attribs||{})){
   if(key.startsWith('on'))el.removeAttr(key);
   else if(['src','data-src','data-lazy','data-original','data-img','poster'].includes(key)&&value&&e.tagName!=='iframe')el.attr(key,asset(value,url));
   else if(key==='srcset'||key==='data-srcset')el.attr(key,value.split(',').map(x=>{const [u,...size]=x.trim().split(/\s+/);return [asset(u,url),...size].join(' ');}).join(', '));
   else if(key==='style')el.attr(key,css(value,url));
   else if(key==='href')el.attr(key,/\.(jpg|png|webp|pdf)(\?|$)/i.test(value)?asset(value,url):routeUrl(value));
  }
 });
 $('img').each((i,e)=>{const el=$(e);if(el.attr('data-src'))el.attr('src',el.attr('data-src'));if(el.attr('data-srcset'))el.attr('srcset',el.attr('data-srcset'));el.removeAttr('loading');});
 $('form').attr('action','/listings/');
 $('iframe').each((i,e)=>{const el=$(e);el.attr('title',el.attr('title')||'Location map');});
 const bodyClass=($('body').attr('class')||'').replace('apus-body-loading','').replace('woocommerce-no-js','woocommerce-js');
 pages.push({route:'/'+route.split('?')[0].replace(/\/?$/,'/').replace(/^\//,''),title,bodyClass,styles,html:$('body').html()});
 console.log('page',route||'home');
}
await fetchPage('');
let cursor=1; await Promise.all(Array.from({length:5},async()=>{while(cursor<routes.length){const route=routes[cursor++];try{await fetchPage(route)}catch(e){failures.push(e.message)}}}));
for(const path of ['wp-includes/js/jquery/jquery.min.js','wp-content/themes/boxcar/js/slick.min.js','wp-content/themes/boxcar/js/bootstrap.bundle.min.js','wp-content/plugins/wp-cardealer/assets/js/select2/select2.full.min.js','wp-includes/js/jquery/ui/core.min.js','wp-includes/js/jquery/ui/mouse.min.js','wp-includes/js/jquery/ui/slider.min.js'])asset(origin+path);
let completed=0;
while([...assets.values()].some(a=>!a.done)){
 const batch=[...assets.values()].filter(a=>!a.done).slice(0,12);batch.forEach(a=>a.done=true);
 await Promise.all(batch.map(async a=>{try{const r=await fetch(a.url,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw new Error(String(r.status));let content=Buffer.from(await r.arrayBuffer());if(a.ext==='css')content=css(content.toString(),a.url);await writeFile('public'+a.local,content);completed++;}catch(e){failures.push(a.url+' '+e.message)}}));
 if(completed%60<12)console.log('assets',completed,'/',assets.size);
}
await writeFile('src/generated/pages.json',JSON.stringify(pages));
await writeFile('src/generated/vendor.json',JSON.stringify([...assets.values()].filter(x=>x.ext==='js').map(x=>x.local)));
await writeFile('reference/import-report.json',JSON.stringify({pages:pages.map(p=>({route:p.route,title:p.title})),assetCount:assets.size,failures,assets:[...assets.values()]},null,2));
console.log('Done',pages.length,'pages',assets.size,'assets',failures.length,'failures');
