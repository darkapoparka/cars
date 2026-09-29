import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const updates=[];
function one(source,before,after){if(source.split(before).length!==2)throw Error(`Missing/ambiguous source: ${before.slice(0,130)}`);return source.replace(before,after);}
async function edit(file,sha,change){const original=await readFile(file,'utf8');if(createHash('sha256').update(original).digest('hex')!==sha)throw Error(`Concurrent change: ${file}`);updates.push([file,change(original)]);}
await edit('lib/reference-types.ts','396008d8954437a09faedb3c8198b2e5d8c39ecb223845eda37b0886a8e2eb58',s=>one(s,'  featureGroups: ReferenceFeatureGroup[];','  featureGroups: ReferenceFeatureGroup[];\n  topFeatures: string[];'));
await edit('scripts/build-captured-vehicle-details.mjs','26c9052f345cd16eb37933d13b1be4e06a276cee7d165ff008bf8a399743caed',s=>one(s,'specifications:specs,featureGroups:','specifications:specs,topFeatures:(c.topFeatures??[]).map(f=>f.name),featureGroups:'));
await edit('app/cars/[slug]/page.tsx','902f5d5b74afe7be764ecf912ea8d3a457c1a12ab16a8445980c94e93f59ae63',s=>{
 s=one(s,"import VehicleDetailClient from '@/components/VehicleDetailClient';","import VehicleDetailClient from '@/components/VehicleDetailClient';\nimport {getReferenceVehicleDetail} from '@/lib/reference-data.server';");
 return one(s,'<VehicleDetailClient vehicle={vehicle} related={related} />','<VehicleDetailClient vehicle={vehicle} related={related} reference={getReferenceVehicleDetail(slug)} />');
});
await edit('app/cars/[slug]/gallery/page.tsx','74409dc4981ab37a0e70caa9ef66f2fd08011058ae5e7ef09f7144693da9b7d9',s=>{
 s=one(s,"import VehicleGallery from '@/components/VehicleGallery';","import VehicleGallery from '@/components/VehicleGallery';\nimport {getReferenceVehicleDetail} from '@/lib/reference-data.server';");
 return one(s,'vehicle={vehicle} initialCategory={initialCategory}','vehicle={vehicle} initialCategory={initialCategory} capturedPhotos={getReferenceVehicleDetail(slug)?.gallery}');
});
await edit('app/cars/[slug]/features/page.tsx','2806bb0592813b95ebb6f55607c2f4b66221a588bc37050120ee10abde4d17a6',s=>{
 s=one(s,"import VehicleFeatures from '@/components/VehicleFeatures';","import VehicleFeatures from '@/components/VehicleFeatures';\nimport {getReferenceVehicleDetail} from '@/lib/reference-data.server';");
 return one(s,'<VehicleFeatures vehicle={vehicle} />','<VehicleFeatures vehicle={vehicle} featureGroups={getReferenceVehicleDetail(slug)?.featureGroups} />');
});
await edit('app/cars/[slug]/inspection/page.tsx','d9469a718ef22521fdb10a3d297d45e91e658df17e2924239c1d72ae1a72fcde',s=>{
 s=one(s,"import {getVehicle} from '@/lib/data';","import {getVehicle} from '@/lib/data';\nimport {getReferenceVehicleDetail,referenceInspectionSlugs} from '@/lib/reference-data.server';");
 s=one(s,"export function generateStaticParams() {return [{slug: '2024-toyota-fortuner-exr'}];}","export function generateStaticParams() {return referenceInspectionSlugs().map(slug=>({slug}));}");
 s=one(s,"  if (!vehicle || slug !== '2024-toyota-fortuner-exr') notFound();","  const reference=getReferenceVehicleDetail(slug);\n  if (!vehicle || !reference?.inspection.length) notFound();");
 return one(s,'<InspectionReport vehicle={vehicle} />','<InspectionReport vehicle={vehicle} capturedSections={reference.inspection} />');
});
await edit('components/VehicleGallery.tsx','831f0e5021b8533ba8019879839bb5104472109ae26cb74c17f8271adef99f4c',s=>{
 s=one(s,"type GalleryCategory} from '@/lib/vehicle-gallery'","type GalleryCategory,type GalleryPhoto} from '@/lib/vehicle-gallery'");
 s=one(s,"({vehicle, initialCategory = 'Exteriors'}: {vehicle: Vehicle; initialCategory?: GalleryCategory})","({vehicle, initialCategory = 'Exteriors',capturedPhotos}: {vehicle: Vehicle; initialCategory?: GalleryCategory;capturedPhotos?:GalleryPhoto[]})");
 return one(s,'useMemo(() => vehicleGallery(vehicle), [vehicle])','useMemo(() => capturedPhotos?.length?capturedPhotos:vehicleGallery(vehicle), [vehicle,capturedPhotos])');
});
await edit('components/VehicleDetailClient.tsx','1e60a4c5072a7eddff6b1168182456783311f028fd705cc045b11aae763a305b',s=>{
 s=one(s,"import {vehicleGallery} from '@/lib/vehicle-gallery';","import {vehicleGallery} from '@/lib/vehicle-gallery';\nimport type {ReferenceVehicleDetail} from '@/lib/reference-types';");
 s=one(s,'({vehicle,related}: {vehicle:Vehicle;related:Vehicle[]})','({vehicle,related,reference}: {vehicle:Vehicle;related:Vehicle[];reference?:ReferenceVehicleDetail})');
 s=one(s," const primaryImage=vehicle.image;"," const primaryImage=vehicle.image;\n const photos=reference?.gallery.length?reference.gallery:vehicleGallery(vehicle);\n const hasDetails=Boolean(reference)||fortuner;\n const shortlist=reference?.shortListCount??(fortuner?35:undefined);");
 s=one(s,":[{label:'Exteriors',image:primaryImage}];",":(reference?.gallery.length?(['Exteriors','Interiors','Features'] as const).flatMap(category=>{const first=photos.find(p=>p.category===category);return first?[{label:category,image:category==='Exteriors'?primaryImage:first.src}]:[];}):[{label:'Exteriors',image:primaryImage}]);");
 s=one(s,' const fee=3500;',' const fee=reference?.convenienceFee??3500;');
 s=one(s,'if(history.length>1&&document.referrer.startsWith(location.origin))router.back();','if(history.length>1)router.back();');
 s=one(s,'<VehicleBelowFold vehicle={vehicle} onLogin={()=>setLogin(true)}/>','<VehicleBelowFold vehicle={vehicle} reference={reference} onLogin={()=>setLogin(true)}/>');
 s=one(s,"...(fortuner?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[])","...(hasDetails?[['Car finance','car-finance'],['Our happy customers','happy-customers']]:[])");
 s=one(s,'{scrolled&&fortuner?<p {...stylex.props(s.popularity)}>🔥<span>Popular: Recently 35 wishlisted this car</span></p>:null}','{scrolled&&shortlist?<p {...stylex.props(s.popularity)}>🔥<span>Popular: Recently {shortlist} wishlisted this car</span></p>:null}');
 s=one(s,'<VehiclePriceSheet kind={overlay} vehicle={vehicle}','<VehiclePriceSheet kind={overlay} vehicle={vehicle} convenienceFee={fee}');
 return one(s,'<VehiclePhotoViewer photos={vehicleGallery(vehicle)}','<VehiclePhotoViewer photos={photos}');
});
await edit('components/VehiclePriceSheet.tsx','d91e688f82848b89e5ddfefe2c2cb5b2d72122b0bb057147b1faf74d20a98553',s=>{
 s=one(s,'{kind, vehicle, onClose, onEligibility}:','{kind, vehicle, onClose, onEligibility,convenienceFee=3500}:');
 s=one(s,"kind: 'price' | 'emi'; vehicle: Vehicle; onClose:","kind: 'price' | 'emi'; vehicle: Vehicle;convenienceFee?:number; onClose:");
 return one(s,'  const fee = 3500;','  const fee = convenienceFee;');
});
await edit('components/VehicleServiceHistory.tsx','cfe7e36353aab9145451f20a85b373c4a708825331a97ff02a7b08d7a7c21348',s=>{
 s=one(s,"import {Info} from 'lucide-react';","import {Info} from 'lucide-react';\nimport type {ReferenceServiceRecord,ReferenceServiceDue} from '@/lib/reference-types';");
 s=one(s,'const records = [','const defaultRecords = [');
 s=one(s,'export default function VehicleServiceHistory() {',"const defaultDue:ReferenceServiceDue={title:'Servicing due after 10,000 kms/ 6months',description:'Which ever is earliest, from the date of delivery on a chargeable basis',image:'/reference-assets/continuation/fortuner-service-banner.png'};\nexport default function VehicleServiceHistory({records=defaultRecords,due=defaultDue}:{records?:ReferenceServiceRecord[];due?:ReferenceServiceDue|null}) {");
 s=one(s,'    <img src="/reference-assets/continuation/fortuner-service-banner.png"','    {due?.image?<img src={due.image}');
 s=one(s,'{...stylex.props(s.banner)} />','{...stylex.props(s.banner)} />:null}');
 s=one(s,'    <aside {...stylex.props(s.note)}>','    {due?<aside {...stylex.props(s.note,!due.image&&s.noteWithoutImage)}>');
 s=one(s,'>Servicing due after 10,000 kms/ 6months</strong>','>{due.title}</strong>');
 s=one(s,'>Which ever is earliest, from the date of delivery on a chargeable basis</span>','>{due.description}</span>');
 s=one(s,'</p></aside>','</p></aside>:null}');
 s=one(s,'records.map(record => <li key={record.date}','records.map((record,index) => <li key={`${record.date}-${index}`}');
 return one(s,'  noteTitle:{',"  noteWithoutImage:{marginTop:18},\n  noteTitle:{");
});
await edit('components/VehicleFeatures.tsx','d9600dd76460350d4542a48254ba0cea85d01f58b78f3c551028f47d1176d6cb',s=>{
 s=one(s,"import {type Vehicle} from '@/lib/data';","import {type Vehicle} from '@/lib/data';\nimport ReferenceInfoSheet from '@/components/ReferenceInfoSheet';\nimport type {ReferenceFeatureGroup,ReferenceFeature} from '@/lib/reference-types';");
 s=one(s,'({vehicle}: {vehicle: Vehicle})','({vehicle,featureGroups}: {vehicle: Vehicle;featureGroups?:ReferenceFeatureGroup[]})');
 s=one(s,"  const [query, setQuery] = useState('');","  const [query, setQuery] = useState('');\n  const [information,setInformation]=useState<ReferenceFeature|null>(null);\n  const descriptions=new Map(featureGroups?.flatMap(group=>group.items).map(feature=>[feature.name,feature]));\n  const icons:Record<string,typeof CarFront>={exteriors:CarFront,comfortAndConvenience:Sparkles,safetyAndSecurity:ShieldCheck,entertainment:Music2};");
 s=one(s,"  const groups = fortuner ? capturedFortunerFeatures : [{name: 'Captured features', icon: CarFront, items: vehicle.highlights}];","  const groups = featureGroups?.length?featureGroups.map(group=>({name:group.name,icon:icons[group.key]??CarFront,items:group.items.map(item=>item.name)})):fortuner ? capturedFortunerFeatures : [{name: 'Captured features', icon: CarFront, items: vehicle.highlights}];");
 s=one(s,"{item === 'Airbag Knees' ? <Info size={13} fill=\"#0033a1\" color=\"#fff\" /> : null}","{descriptions.get(item)?.description?<button type=\"button\" aria-label={`About ${item}`} onClick={()=>setInformation(descriptions.get(item)!)} {...stylex.props(s.information)}><Info size={13} fill=\"#0033a1\" color=\"#fff\"/></button>:null}");
 s=one(s,'  </main>;','    {information?.description?<ReferenceInfoSheet title={information.name} description={information.description} onClose={()=>setInformation(null)}/>:null}\n  </main>;');
 return one(s,'  check: {',"  information:{display:'inline-flex',alignItems:'center',justifyContent:'center',width:21,height:21,marginLeft:2,padding:0,verticalAlign:'middle',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},\n  check: {");
});
const illustration=sharp('reference/2026-09-26-continuation/final-features-condition.png');const meta=await illustration.metadata(),scale=meta.width/427;
await illustration.extract({left:Math.round(289*scale),top:Math.round(507*scale),width:Math.round(113*scale),height:Math.round(52*scale)}).png().toFile('public/reference-assets/final-pass/structural-illustration.png');
for(const[file,source]of updates){await writeFile(file,source);console.log('UPDATED',file);}
