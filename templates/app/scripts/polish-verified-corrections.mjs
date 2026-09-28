import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const pending=[];
async function edit(file,sha,replacements){let source=await readFile(file,'utf8');if(createHash('sha256').update(source).digest('hex')!==sha)throw Error('Source changed: '+file);for(const[a,b]of replacements){if(source.split(a).length!==2)throw Error('Ambiguous match in '+file+': '+a.slice(0,60));source=source.replace(a,b);}pending.push([file,source]);}
await edit('components/VehicleGallery.tsx','9b69a6e3dc0f8be0b871db8253ca504cd178818475a1a3b89c8cc71ff4be6842',[["aspectRatio: '1.92', objectFit: 'fill'","aspectRatio: '1.92', objectFit: 'cover'"]]);
await edit('components/VehiclePriceSheet.tsx','ec74858681cf4116b5572f46fa38e64a37669bd46b38c346628b014fa157d538',[
 ["backgroundColor: 'rgba(0,0,0,.6)'","backgroundColor: 'rgba(0,0,0,.45)'"],
 ["limits: {display: 'flex', justifyContent: 'space-between', marginTop: 13,","limits: {display: 'flex', justifyContent: 'space-between', marginTop: 0,"],
 ["depositValue:{fontFamily:'Roboto,Arial,sans-serif',fontSize:16,fontWeight:500}","depositValue:{fontFamily:'Roboto,Arial,sans-serif',color:'#40547c',fontSize:16,fontWeight:500}"],
 ["baseRow: {color: '#3b507b'}","baseRow: {color: '#3b507b',fontWeight:700}"],
]);
await edit('components/VehicleFinanceSection.tsx','7735cca6362d96edc55dce4c4d61ed259273601d52c6e2545679b92237bbc3ff',[
 ["limits: {display:'flex',justifyContent:'space-between',marginTop:14,","limits: {display:'flex',justifyContent:'space-between',marginTop:0,"],
 ["depositValue:{fontFamily:'Roboto,Arial,sans-serif',fontSize:16,fontWeight:500}","depositValue:{fontFamily:'Roboto,Arial,sans-serif',color:'#40547c',fontSize:16,fontWeight:500}"],
]);
await edit('components/VehicleDetailClient.tsx','e6dc49767709fbbe6056001b73a2d2c01dde713abefef8ce0b72d0387be4ffe8',[
 ["screen:{paddingTop:{[media.mobile]:51,default:0}","screen:{paddingTop:{[media.mobile]:52,default:0}"],
 ['height={40}/><span><strong {...stylex.props(s.promiseTitle)}>Lifetime','height={40} {...stylex.props(s.warrantyArt)}/><span><strong {...stylex.props(s.promiseTitle)}>Lifetime'],
 ['km</span></span></Link><Link href="/benefits/warranty"','km</span></span><Info size={15} aria-hidden="true" {...stylex.props(s.promiseInfo)}/></Link><Link href="/benefits/warranty"'],
 ['3 months</span></span></Link></section>','3 months</span></span><Info size={15} aria-hidden="true" {...stylex.props(s.promiseInfo)}/></Link></section>'],
 ["promise:{display:'grid'","promise:{position:'relative',display:'grid'"],
 ["promiseTitle:{display:","warrantyArt:{borderRadius:'50%'},\npromiseInfo:{position:'absolute',top:21,right:21,color:'#06359f'},\npromiseTitle:{display:"],
]);
for(const[file,source]of pending){await writeFile(file,source);console.log('Updated',file);}
