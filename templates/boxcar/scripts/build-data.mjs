import { load } from 'cheerio';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
const pages=JSON.parse(await readFile('src/generated/pages.json','utf8'));
await mkdir('public/pages',{recursive:true});
const manifest={}, vehicles=new Map();
for(const [i,page] of pages.entries()){
 const $=load(page.html);$('.apus-page-loading').remove();
 page.html=$('body').html();
 manifest[page.route]=`/pages/${i}.json`;
 await writeFile('public/pages/'+i+'.json',JSON.stringify(page));
}
for(const page of [...pages.filter(p=>p.route.startsWith('/listings/')), ...pages]){
 const $=load(page.html);
 $('article.listing-grid').each((i,el)=>{
  const e=$(el), classes=(e.attr('class')||'').split(/\s+/),id=classes.find(c=>/^post-\d+$/.test(c))?.slice(5);if(!id||vehicles.has(id))return;
  const a=e.find('h2 a,.listing-title a').first(),title=a.text().trim(),price=Number((e.find('.listing-price .price-text').last().text()||'0').replace(/[^\d.]/g,''));
  const specs={};for(const [label,key] of Object.entries({'Body':'type','Fuel Type':'fuel_type','Transmission':'transmission','Condition':'condition','Drive Type':'drive_type','Color':'color','Door':'door','Cylinder':'cylinder'})){const v=classes.find(c=>c.startsWith('listing_'+key+'-'))?.replace('listing_'+key+'-','');if(v)specs[label]=v.split('-').map(x=>x[0]?.toUpperCase()+x.slice(1)).join(' ');}
  specs.Year=title.match(/20\d{2}/)?.[0]||'2023';specs.Mileage=e.text().match(/\d+\s*Miles/)?.[0]||'';
  vehicles.set(id,{id,title,href:a.attr('href'),image:e.find('img').first().attr('src'),price,classes,html:e.toString(),specs});
 });
}
for(const vehicle of vehicles.values()){
 const detail=pages.find(p=>p.route===vehicle.href);if(!detail)continue;
 const $=load(detail.html);$('.meta-overview').each((i,e)=>{const label=$(e).find('.field-title').text().trim(),value=$(e).find('.content-value').text().trim();if(label&&value)vehicle.specs[label]=value;});
}
await writeFile('src/generated/manifest.json',JSON.stringify(manifest,null,2));
await writeFile('src/generated/catalog.json',JSON.stringify([...vehicles.values()]));
console.log('Split',pages.length,'pages;',vehicles.size,'vehicles');
