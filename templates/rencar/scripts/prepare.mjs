import { load } from 'cheerio';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('reference/manifest.json','utf8'));
const assets=JSON.parse(await readFile('reference/assets.json','utf8'));
const base='https://live.themewild.com/rencar/';
await mkdir('src/pages',{recursive:true});
for(const name of Object.keys(manifest)) {
  const $=load(await readFile('reference/pages/'+name,'utf8'));
  manifest[name].bodyClass=$('body').attr('class')||'';
  $('script').remove();
  $('*').each((i,e)=>{
    for(const [attr,value] of Object.entries(e.attribs||{})) {
      if(/^on[a-z]+$/.test(attr)) { $(e).removeAttr(attr); continue; }
      if(['src','href','data-background','poster'].includes(attr) && value && !/^(#|data:|tel:|mailto:|javascript:)/.test(value)) {
        const u=new URL(value,base).href;
        if(assets[u]&&!assets[u].error) $(e).attr(attr,assets[u].local);
        else if(u.startsWith(base)&&u.includes('.html')) $(e).attr(attr,'/'+u.slice(base.length));
      }
      if(attr==='style') $(e).attr(attr,value.replaceAll('assets/','/assets/'));
    }
    if($(e).is('form')) {
      $(e).attr('action','#');
      $(e).removeAttr('method');
    }
    if($(e).is('button')&&!$(e).attr('type')) $(e).attr('type','button');
    if($(e).is('a')&&$(e).attr('href')==='#') $(e).attr('href','#top');
    if($(e).is('a,button')&&!$(e).text().trim()&&!$(e).attr('aria-label')&&!$(e).attr('aria-labelledby')) {
      const icon=($(e).find('i').attr('class')||'').split(' ').find(c=>c.startsWith('fa-'));
      const known={ 'fa-search':'Search','fa-arrow-up':'Back to top','fa-bars':'Open menu','fa-times':'Close','fa-xmark':'Close','fa-heart':'Add to wishlist','fa-play':'Play video' };
      const label=known[icon]||icon?.slice(3).replaceAll('-',' ')||($(e).find('img').length?'Rencar home':($(e).attr('class')||'Open menu').replaceAll('-',' '));
      $(e).attr('aria-label',label);
    }
    if($(e).is('iframe')&&!$(e).attr('title')) $(e).attr('title','Location map');
    if($(e).is('input,select,textarea')&&!$(e).attr('aria-label')&&!$(e).attr('id')) {
      const label=$(e).attr('placeholder')||$(e).find('option').first().text()||$(e).attr('name')||$(e).attr('type');
      if(label) $(e).attr('aria-label',label);
    }
  });
  $('label:not([for])').each((i,e)=>{
    const input=$(e).parent().find('input,select,textarea').first();
    if(input.length) {
      const id=input.attr('id')||'field-'+i;
      input.attr('id',id); $(e).attr('for',id);
    }
  });
  let body=$('body').html().replace(/<!--[^]*?-->/g,'').replaceAll('{','&#123;').replaceAll('}','&#125;');
  // Keep each page as editable, compiled Svelte markup with the exact reference classes.
  await writeFile('src/pages/'+name.replace('.html','.svelte'),'<svelte:options runes={true} />\n'+body);
}
await writeFile('src/manifest.json',JSON.stringify(manifest,null,2));
const $=load(await readFile('index.html','utf8'));
$('body').attr('id','top');
$('link[rel="stylesheet"]').remove();
for(const style of manifest['index.html'].styles) $('head').append('<link rel="stylesheet" href="'+assets[style].local+'">');
await writeFile('index.html',$.html());
let main=await readFile('public/assets/js/main.js','utf8');
// Vite mounts after window.load. Initialize load/ready handlers after Svelte has rendered.
main=main.replaceAll('$(window).on("load", function () {','$(function () {').replaceAll('$(document).on("ready", function () {','$(function () {');
await writeFile('public/assets/js/main.js',main);
console.log('Prepared',Object.keys(manifest).length,'Svelte pages');
