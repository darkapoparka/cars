import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
if(path.resolve('.').toLowerCase()!=='l:\\cars-app')throw Error('This bounded migration is only for the existing cars-app checkout.');
const plans=[];
async function edit(file,transform){const before=await fs.readFile(file,'utf8');const after=transform(before);if(before===after)throw Error(`No change for ${file}`);plans.push({file,before,after,sha:createHash('sha256').update(before).digest('hex')});}
function one(text,from,to){const count=text.split(from).length-1;if(count!==1)throw Error(`Expected one exact match (${count}): ${from.slice(0,100)}`);return text.replace(from,to);}
await edit('components/InventoryClient.tsx',text=>{
 const start=text.indexOf('<div {...stylex.props(s.promo)}><img');const end=text.indexOf('</div>}\n',start);if(start<0||end<0)throw Error('Promotion boundary changed');
 text=text.slice(0,start)+'<div {...stylex.props(s.promo)}><img src="/reference-assets/listing-promotion.png" alt="You can’t know a car in 20 minutes. Take 30 days to see if it feels right. 30-day return guarantee. Terms and conditions apply." {...stylex.props(s.promoArt)}/>'+text.slice(end);
 text=one(text,"topInnerLuxe:{paddingTop:{[media.mobile]:65,default:30}}","topInnerLuxe:{paddingTop:{[media.mobile]:63,default:30}}");
 const ps=text.indexOf("promo:{position:'relative'");const pe=text.indexOf('luxePromo:',ps);if(ps<0||pe<0)throw Error('Promotion styles changed');
 text=text.slice(0,ps)+"promo:{position:'relative',height:{[media.mobile]:137,default:280},marginTop:16,marginInline:-12,overflow:'hidden'},promoArt:{display:'block',width:'100%',height:'100%',objectFit:'fill'},\n "+text.slice(pe);
 text=one(text,"luxePromo:{marginInline:-12,marginTop:14}","luxePromo:{marginInline:-12,marginTop:0}");
 text=one(text,"gap:8,flexShrink:0,minHeight:37,paddingInline:14,color:$.text,fontSize:16,fontWeight:500","gap:6,flexShrink:0,minHeight:36,paddingInline:12,color:$.text,fontSize:14,fontWeight:500");
 text=one(text,"gap:9,minHeight:24,marginBottom:9","gap:9,minHeight:20,marginBottom:6");
 text=one(text,"resultTitle:{fontSize:15","resultTitle:{fontSize:14");
 text=one(text,"lineHeight:'22px',color:$.ink},grid:","lineHeight:'20px',color:$.ink},grid:");
 text=one(text,"['Mercedes-Benz','BMW','Audi'].includes(car.make))&&matches","['Mercedes-Benz','BMW','Audi'].includes(car.make)||car.slug==='2024-toyota-land-cruiser-exr')&&matches");
 return text;
});
await edit('components/VehicleCard.tsx',text=>{
 text=one(text,"gap:7,paddingTop:11,paddingBottom:8,paddingInline:8,minHeight:101","gap:6,paddingTop:12,paddingBottom:6,paddingInline:8,minHeight:101");
 text=one(text,"priceRow:{display:'flex',alignItems:'center',gap:5,marginTop:6","priceRow:{display:'flex',alignItems:'center',gap:5,marginTop:3");
 text=one(text,"monthly:{display:'flex',alignItems:'baseline',gap:4,marginTop:3","monthly:{display:'flex',alignItems:'center',gap:4,marginTop:1");
 return text;
});
await edit('components/FeatureLanding.tsx',text=>{
 text=one(text,"import {ServiceTabs,WhatsAppIcon}","import {useModal} from '@/components/useModal';\nimport {ServiceTabs,WhatsAppIcon}");
 text=one(text,"const [requestOpen,setRequestOpen]=useState(false);","const [requestOpen,setRequestOpen]=useState(false);\n const requestPanel=useModal(requestOpen,()=>setRequestOpen(false));");
 text=one(text,'<section role="dialog" aria-modal="true" aria-labelledby="journey-title"','<div ref={requestPanel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="journey-title"');
 text=one(text,'</button></>}</section></div>:null}','</button></>}</div></div>:null}');
 text=one(text,"heroTitle:{fontSize:{[media.mobile]:22,default:40},fontWeight:600,lineHeight:1.15","heroTitle:{fontSize:{[media.mobile]:20,default:40},fontWeight:600,lineHeight:1.2");
 text=one(text,"heroText:{marginTop:12,fontSize:{[media.mobile]:14,default:22}","heroText:{marginTop:10,fontSize:{[media.mobile]:13,default:22}");
 text=one(text,"columnGap:14,rowGap:20","columnGap:14,rowGap:18");
 text=one(text,"alignItems:'center',gap:9,padding:0,color:$.text","alignItems:'center',gap:8,padding:0,color:$.text");
 text=one(text,"brandImage:{width:'100%',height:76","brandImage:{width:'100%',height:68");
 text=one(text,"benefitTitle:{position:'relative',zIndex:1","benefitTitle:{position:'absolute',top:0,left:0,zIndex:1");
 return text;
});
await edit('components/ReferenceUI.tsx',text=>{
 const a=text.indexOf('export function WhatsAppIcon('),b=text.indexOf('export function BottomIcon(',a);if(a<0||b<a)throw Error('WhatsApp component boundary changed');
 return text.slice(0,a)+`export function WhatsAppIcon({size=26}: {size?:number}) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="4 4 17 17" fill="currentColor"><path d="M17.48 14.41c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.12 4.51.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>;
}

`+text.slice(b);
});
await edit('app/page.tsx',text=>{
 text=one(text,"import {useState, type FormEvent}","import {useEffect,useState, type FormEvent}");
 text=one(text,'const [saved,setSaved]=useState(false);',`const [saved,setSaved]=useState(false);
  useEffect(()=>{const sync=()=>{try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');setSaved(Array.isArray(value)&&value.includes(vehicle.slug));}catch{setSaved(false);}};const frame=requestAnimationFrame(sync);window.addEventListener('drive24:saved-change',sync);window.addEventListener('storage',sync);return()=>{cancelAnimationFrame(frame);window.removeEventListener('drive24:saved-change',sync);window.removeEventListener('storage',sync);};},[vehicle.slug]);`);
 text=one(text,"heading:{fontSize:{[media.mobile]:18,default:25},fontWeight:500,lineHeight:1.35","heading:{fontSize:{[media.mobile]:18,default:25},fontWeight:500,lineHeight:1.2");
 text=one(text,"recent:{marginTop:28}","recent:{marginTop:27}");
 return text;
});
await edit('lib/data.ts',text=>{
 text=one(text,"image: '/reference-assets/ciaz.png'","image: '/reference-assets/ciaz-native-card.png'");
 text=one(text,"image: '/reference-assets/veloz.png'","image: '/reference-assets/veloz-native-card.png'");
 const marker="  {\n    slug: '2023-haval-h6-gt-top'";
 return one(text,marker,`  {
    slug: '2024-toyota-land-cruiser-exr', year: 2024, make: 'Toyota', model: 'Land Cruiser', trim: 'EXR • GCC Specs',
    price: 224599, previousPrice: 227999, monthly: 3413, mileage: 44000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'SUV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/reference-assets/land-cruiser-native-card.png', color: 'White',
    badges: ['1.99% interest rate*'], highlights: ['DC Fast Charging'],
    power: 'Not captured', engine: 'Not captured', warranty: 'Reference listing', condition: 'Reference listing',
  },
`+marker);
});
await edit('app/layout.tsx',text=>{
 text=one(text,"title: { default: 'Drive24 Showroom', template: '%s · Drive24' }","title: { default: 'Cars24 Reference', template: '%s · Cars24 Reference' }");
 text=one(text,"description: 'A premium dealer-first vehicle showroom, built for web, PWA and future native apps.'","description: 'Local CARS24 UAE interface reconstruction. Not an official Cars24 service; no live booking, payment or authentication is connected.'");
 text=one(text,"applicationName: 'Drive24 Showroom'","applicationName: 'Cars24 Reference'");
 text=one(text,"  maximumScale: 1,\n",'');
 return one(text,"themeColor: '#4b35ff'","themeColor: '#4736fe'");
});
for(const plan of plans){const current=await fs.readFile(plan.file,'utf8');if(createHash('sha256').update(current).digest('hex')!==plan.sha)throw Error(`Concurrent change: ${plan.file}`);}
for(const plan of plans){await fs.writeFile(plan.file,plan.after);console.log('POLISHED',plan.file);}
for(const kind of ['sell','finance','service']){
 const input=`reference/2026-09-26-parity/android-${kind}.png`;const {width}=await sharp(input).metadata();const scale=width/427;
 const banner=await sharp(input).extract({left:0,top:Math.round(164*scale),width,height:Math.round(171*scale)}).png().toBuffer();
 const bg=await sharp(banner).extract({left:8,top:0,width:1,height:Math.round(171*scale)}).resize(Math.round(225*scale),Math.round(171*scale),{fit:'fill'}).png().toBuffer();
 await sharp(banner).composite([{input:bg,left:0,top:0}]).png().toFile(`public/reference-assets/${kind}-hero-art.png`);
}
