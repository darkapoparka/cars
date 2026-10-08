import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
if(path.resolve('.').toLowerCase()!=='l:\\cars-app')throw Error('Expected existing cars-app checkout');
const plans=[];
function one(text,from,to){if(text.split(from).length!==2)throw Error('Source guard failed: '+from.slice(0,90));return text.replace(from,to);}
async function edit(file,change){const before=await fs.readFile(file,'utf8');const after=change(before);if(before===after)throw Error('No change: '+file);plans.push({file,before,after,sha:createHash('sha256').update(before).digest('hex')});}
await edit('components/ReferenceUI.tsx',text=>{
 const start=text.indexOf('export function BrandRow('),end=text.indexOf('export function FilterPills(',start);if(start<0||end<start)throw Error('Brand component moved');
 const replacement=`export function BrandRow({title='Browse by brands',onSelect,compact=false}: {title?:string;onSelect?:(brand:string)=>void;compact?:boolean}) {
  const items=compact?[['Mercedes Benz','Mercedes-Benz','mercedes'],['BMW','BMW','bmw'],['Audi','Audi','audi'],['Nissan','Nissan','nissan'],['Toyota','Toyota','toyota']]:brandList;
  const compactAssets:Record<string,string>={mercedes:'sell-brand-4',bmw:'sell-brand-5',audi:'sell-brand-6',nissan:'sell-brand-3',toyota:'sell-brand-1'};
  return <section aria-label={title} {...stylex.props(s.brandSection)}><h2 {...stylex.props(s.sectionTitle)}>{title}</h2><div {...stylex.props(s.brandRow)}>{items.map(([label,value,asset])=>{
    const content=<><img src={\`/reference-assets/\${compact?compactAssets[asset]:\`brand-\${asset}\`}.png\`} width={210} height={192} alt="" {...stylex.props(s.brandImage,compact&&s.brandImageCompact)}/><span {...stylex.props(s.brandLabel,compact&&s.brandLabelCompact)}>{label}</span></>;
    return onSelect?<button key={value} type="button" onClick={()=>onSelect(value)} {...stylex.props(s.brand)}>{content}</button>:<Link key={value} href={\`/cars?brand=\${encodeURIComponent(value)}\`} {...stylex.props(s.brand)}>{content}</Link>;
  })}</div></section>;
}

`;
 text=text.slice(0,start)+replacement+text.slice(end);
 text=one(text,"brandImage:{width:'100%',height:'auto'},","brandImage:{width:'100%',height:'auto'},\n brandImageCompact:{width:74},\n brandLabelCompact:{fontWeight:500},");
 const a=text.indexOf("  if(name==='Luxe')"),b=text.indexOf("  if(name==='Menu')",a);if(a<0||b<a)throw Error('Luxe icon moved');
 text=text.slice(0,a)+`  if(name==='Luxe')return <svg {...common}><path d="m4 10 4-5h8l4 5-8 10Z" fill={active?'currentColor':'none'}/><path d="M4 10h16M8 5l4 15 4-15" stroke={active?'white':'currentColor'} strokeWidth="1.1"/>{active?<path d="M12 1v2M4 3l2 2M20 3l-2 2M1 9h1M22 9h1"/>:null}</svg>;
`+text.slice(b);
 return text;
});
await edit('components/InventoryClient.tsx',text=>{
 text=one(text,'<BrandRow title="Explore by brand"','<BrandRow compact title="Explore by brand"');
 return one(text,'luxeBrands:{marginBottom:32}','luxeBrands:{marginTop:-2,marginBottom:28}');
});
await edit('components/VehicleDetailClient.tsx',text=>{
 text=one(text,"pricePart:{padding:'15px 9px 13px'}","pricePart:{padding:'15px 9px 12px'}");
 text=one(text,'fee:{marginTop:10','fee:{marginTop:8');
 text=one(text," const gallery=fortuner?"," const primaryImage=vehicle.slug==='2023-suzuki-ciaz-glx'?'/reference-assets/ciaz.png':vehicle.slug==='2025-toyota-veloz-gx'?'/reference-assets/veloz.png':vehicle.image;\n const gallery=fortuner?");
 return one(text,"image:'/reference-assets/fortuner-right.jpg'}]:[{label:'Exteriors',image:vehicle.image}]","image:'/reference-assets/fortuner-right.jpg'}]:[{label:'Exteriors',image:primaryImage}]");
});
await edit('app/app.css',text=>one(text,"width: 18px; height: 18px; margin: 0; accent-color:","width: 16px; height: 16px; margin: 0; accent-color:"));
await edit('scripts/verify-parity.mjs',text=>one(text,'  await sleep(250);\n  const metrics=',"  await evaluate('document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))');\n  await sleep(750);\n  const metrics="));
await edit('scripts/collect-visual-assets.mjs',text=>one(text,"results.map(({url,...r})=>r)","results.map(r=>({name:r.name,width:r.width,height:r.height,bytes:r.bytes,error:r.error}))"));
for(const plan of plans){const current=await fs.readFile(plan.file,'utf8');if(createHash('sha256').update(current).digest('hex')!==plan.sha)throw Error('Concurrent change: '+plan.file);}
for(const plan of plans){await fs.writeFile(plan.file,plan.after);console.log('POLISHED',plan.file);}
const urls=JSON.parse(await fs.readFile('reference/2026-09-26-parity/fortuner-images.json','utf8'));
const manifest=JSON.parse(await fs.readFile('public/reference-assets/sources.json','utf8'));
for(const [name,part] of [['fortuner-interior.jpg','Right-Side-Front-Door-Cabin-View'],['fortuner-feature.jpg','Engine-Bonet-View']]){
 const url=urls.find(url=>url.includes(part));if(!url)throw Error('Reference photograph missing');const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Image request failed');await fs.writeFile(`public/reference-assets/${name}`,Buffer.from(await response.arrayBuffer()));manifest.assets=manifest.assets.filter(asset=>asset.name!==name);manifest.assets.push({name,url});
}
for(const kind of ['sell','finance','service'])manifest.assets.push({name:`${kind}-hero-art.png`,source:`reference/2026-09-26-parity/android-${kind}.png`,logicalCrop:{left:0,top:164,width:427,height:171},notes:'Left copy area replaced with the native background scanline; visible headings and CTA are HTML.'});
await fs.writeFile('public/reference-assets/sources.json',JSON.stringify(manifest,null,2));
