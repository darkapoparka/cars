import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const file='components/VehicleDetailClient.tsx';let s=await readFile(file,'utf8');
if(createHash('sha256').update(s).digest('hex')!=='bf775a4f1123aa98deb7a443fad616fb8cf6f438796cc9538a91a7d828c361d7')throw Error('Detail source changed. Inspect before editing.');
function replace(before,after,count=1){if(s.split(before).length-1!==count)throw Error(`Expected ${count} matches: ${before}`);s=s.split(before).join(after);}
replace("import {WhatsAppIcon} from '@/components/ReferenceUI';","import {WhatsAppIcon} from '@/components/ReferenceUI';\nimport {recordVehicleView} from '@/components/useVehicleState';");
replace(" const primaryImage=vehicle.slug==='2023-suzuki-ciaz-glx'?'/reference-assets/ciaz.png':vehicle.slug==='2025-toyota-veloz-gx'?'/reference-assets/veloz.png':vehicle.image;"," const primaryImage=vehicle.image;\n const isLuxe=vehicle.tier==='Luxe'||fortuner;");
replace(' const fee=3500;',' const fee=3500;\n useEffect(()=>{recordVehicleView(vehicle.slug);},[vehicle.slug]);');
replace("{fortuner?'Basic':vehicle.condition}","{vehicle.optionsType??'Basic'}");
replace('<img src="/reference-assets/luxe-tag.svg" alt="Cars24 Luxe" width={61} height={15}/>',"{isLuxe?<img src=\"/reference-assets/luxe-tag.svg\" alt=\"Cars24 Luxe\" width={61} height={15}/>:<strong>{vehicle.tier??'Cars24'}</strong>}");
replace("<button type=\"button\" onClick={()=>setOverlay('warranty')} {...stylex.props(s.promise)}><img", "<Link href=\"/benefits/returns\" {...stylex.props(s.promise)}><img");
replace("Drive up to 30 days or 1000 km</span></span></button><button type=\"button\" onClick={()=>setOverlay('warranty')} {...stylex.props(s.promise)}>","Drive up to 30 days or 1000 km</span></span></Link><Link href=\"/benefits/warranty\" {...stylex.props(s.promise)}>");
replace('Assured warranty included, free upto 3 months</span></span></button>','Assured warranty included, free upto 3 months</span></span></Link>');
await writeFile(file,s);
console.log('Vehicle detail now tracks recent views, uses correct photographs and routes to the real reconstructed benefits screens.');
