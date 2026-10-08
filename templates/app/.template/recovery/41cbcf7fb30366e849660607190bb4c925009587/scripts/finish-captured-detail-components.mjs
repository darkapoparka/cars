import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const changes=[];
function one(s,a,b){if(s.split(a).length!==2)throw Error('Nonunique component boundary '+a.slice(0,100));return s.replace(a,b);}
async function edit(file,sha,fn){const text=await readFile(file,'utf8');if(createHash('sha256').update(text).digest('hex')!==sha)throw Error('Concurrent change: '+file);changes.push([file,fn(text)]);}
await edit('components/VehicleBelowFold.tsx','8dd463509c374acf3ac3586ca02e2cd8a5df10015ef27f259e040264f9b05132',s=>{
 s=one(s,"import type {ReactNode} from 'react';","import {useState,type ReactNode} from 'react';");
 s=one(s,"import CustomerStories from '@/components/CustomerStories';","import CustomerStories from '@/components/CustomerStories';\nimport StructuralSummary from '@/components/StructuralSummary';\nimport ReferenceInfoSheet from '@/components/ReferenceInfoSheet';\nimport type {ReferenceVehicleDetail} from '@/lib/reference-types';");
 const start=s.indexOf('function SpecGrid('),end=s.indexOf('\nexport default function VehicleBelowFold',start);
 if(start<0||end<0)throw Error('Spec grid boundary missing');
 const replacement=`function SpecGrid({vehicle,reference,onInformation}: {vehicle: Vehicle;reference?:ReferenceVehicleDetail;onInformation:(title:string,description:string)=>void}) {
  const icons:Record<string,typeof CarFront>={engineSize:Wrench,optionsType:Sparkles,transmissionType:Gauge,drive:CarFront,bodyType:CarFront,fuelEfficiency:Fuel,alloyWheels:CircleGauge,carExteriorColor:Palette,interiorTrimType:Armchair,noOfAirbags:ShieldCheck,numberOfSeats:Armchair,noOfKeys:KeyRound};
  const fallback=vehicle.slug==='2024-toyota-fortuner-exr'?fortunerSpecs:[['Engine',vehicle.engine,Wrench],['Transmission',vehicle.transmission,Gauge],['Body Type',vehicle.body,CarFront],['Fuel Type',vehicle.fuel,Fuel],['Exterior',vehicle.color,Palette],['Distance driven',formatPrice(vehicle.mileage)+' km',CircleGauge]] as const;
  const entries=reference?.specifications.length?reference.specifications.filter(spec=>!['odometerReading','specs','vin'].includes(spec.key)).map(spec=>({label:spec.label,value:spec.value,Icon:icons[spec.key]??CarFront,description:spec.description})):fallback.map(([label,value,Icon])=>({label,value,Icon,description:undefined}));
  return <dl {...stylex.props(s.specGrid)}>{entries.map(({label,value,Icon,description})=><div key={label} {...stylex.props(s.spec)}><dt aria-label={label}><Icon size={17} strokeWidth={1.5}/></dt><dd {...stylex.props(s.specValue)}><span>{value}</span>{description?<button type="button" aria-label={'About '+label} onClick={()=>onInformation(label,description)} {...stylex.props(s.specInfo)}><Info size={15}/></button>:null}</dd></div>)}</dl>;
}`;
 s=s.slice(0,start)+replacement+s.slice(end);
 s=one(s,'({vehicle, onLogin}: {vehicle: Vehicle; onLogin: () => void})','({vehicle, onLogin,reference}: {vehicle: Vehicle; onLogin: () => void;reference?:ReferenceVehicleDetail})');
 s=one(s,"  const fortuner = vehicle.slug === '2024-toyota-fortuner-exr';","  const fortuner = vehicle.slug === '2024-toyota-fortuner-exr';\n  const [information,setInformation]=useState<{title:string;description:string}|null>(null);\n  const hasDetails=Boolean(reference)||fortuner;\n  const structural=Boolean(reference?.structuralClear&&reference.vin);\n  const overviewIcons:Record<string,typeof CarFront>={convenienceFee:ShieldCheck,appleplay:Music2,cruisecontrol:CarFront};");
 s=one(s,": vehicle.highlights;",": reference?.topFeatures.length?reference.topFeatures.slice(0,6):vehicle.highlights;");
 const first=s.indexOf('      <OverviewRow icon={<CarFront size={20}'),last=s.indexOf('      <SpecGrid vehicle={vehicle} />',first);
 if(first<0||last<0)throw Error('Overview entries missing');
 const legacy=s.slice(first,last);
 s=s.slice(0,first)+'      {reference?.highlights.length?reference.highlights.map(item=>{const Icon=overviewIcons[item.key]??CarFront;return <OverviewRow key={item.key} icon={<Icon size={21}/>} title={item.title} copy={item.description} information={item.key===\'convenienceFee\'}/>;}):<>\n'+legacy+'      </>}\n'+s.slice(last);
 s=one(s,'<SpecGrid vehicle={vehicle} />','<SpecGrid vehicle={vehicle} reference={reference} onInformation={(title,description)=>setInformation({title,description})}/>');
 s=one(s,'    <section id="features" {...stylex.props(s.features)}>','    {structural?<StructuralSummary vin={reference!.vin!}/>:null}\n    <section id="features" {...stylex.props(s.features,structural&&s.featuresAfterSummary)}>');
 s=one(s,'{fortuner ? <><div {...stylex.props(s.inspectionCard)}>','{reference?.inspection.length || fortuner ? <><div {...stylex.props(s.inspectionCard)}>');
 s=one(s,'{fortuner?<><VehicleServiceHistory/><VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/><CustomerStories/></>',"{hasDetails?<><VehicleServiceHistory records={reference?.serviceRecords} due={reference?reference.serviceDue??null:undefined}/><VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/><CustomerStories/></>");
 s=one(s,'\n  </>;','\n    {information?<ReferenceInfoSheet title={information.title} description={information.description} onClose={()=>setInformation(null)}/>:null}\n  </>;');
 s=one(s,'features: {',"featuresAfterSummary:{marginTop:68},\nspecValue:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:5,minWidth:0},\nspecInfo:{display:'grid',placeItems:'center',flexShrink:0,width:18,height:24,padding:0,color:'#07339f',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},\nfeatures: {");
 return s;
});
await edit('components/InspectionReport.tsx','cbc83473ef38fb1fa4e57527ab48855604662830ca1076d7b577e1e214ad0d42',s=>{
 s=one(s,' CircleGauge, Cog, ShieldCheck,',' CircleGauge, Cog, Info, ShieldCheck,');
 s=one(s,"import LoginSheet from '@/components/LoginSheet';","import LoginSheet from '@/components/LoginSheet';\nimport type {ReferenceCheckpoint,ReferenceInspectionSection} from '@/lib/reference-types';");
 const start=s.indexOf('type Group ='),end=s.indexOf('/** This is the observed inspection snapshot',start);
 if(start<0||end<0)throw Error('Inspection data boundary missing');
 const replacement=`const sectionIcons:Record<string,typeof CarFront>={'Exterior':CarFront,'Engine & Transmission':Cog,'Steering, Suspension & Brakes':Wrench,'Electricals, Controls & Lights':Zap,'Interiors & Luggage':Armchair,'Tyres':CircleGauge};
function Checkpoint({item,direct}: {item:ReferenceCheckpoint;direct:boolean}) {
  const [expanded,setExpanded]=useState(false);
  const passed=item.status===1;
  return <><div data-inspection-status={item.status??'unknown'} data-inspection-name={item.name} {...stylex.props(s.row,direct&&s.directRow)}><span>{item.name}</span>{item.remarks.length?<button type="button" aria-label={'Inspection details: '+item.name} aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)} {...stylex.props(s.findingButton)}><Info size={17}/></button>:<span aria-label={passed?'Passed in captured report':'No pass result recorded'} {...stylex.props(s.passed,!passed&&s.unrated)}>{passed?<Check size={16} strokeWidth={1.7}/>:'−'}</span>}</div>{expanded?<div {...stylex.props(s.findingText)}>{item.remarks.map((remark,index)=><p key={index}>{remark}</p>)}</div>:null}</>;
}
function Section({section}: {section:ReferenceInspectionSection}) {
  const [expanded,setExpanded]=useState(false);
  const Icon=sectionIcons[section.title]??CarFront;
  const limit=['Exterior','Electricals, Controls & Lights'].includes(section.title)?6:section.groups.length;
  const groups=expanded?section.groups:section.groups.slice(0,limit);
  return <section {...stylex.props(s.card)}><h2 {...stylex.props(s.cardHeading)}><Icon size={23} strokeWidth={1.2}/>{section.title}</h2>{groups.map((group,index)=><div key={index}>{group.heading?<h3 {...stylex.props(s.groupHeading)}>{group.heading}</h3>:null}{group.items.map((item,ordinal)=><Checkpoint key={item.name+'-'+ordinal} item={item} direct={!group.heading}/>)}</div>)}{section.groups.length>limit?<button type="button" onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded} {...stylex.props(s.expand)}>{expanded?'SEE LESS':'SEE MORE'}<ChevronDown size={17} {...stylex.props(expanded&&s.rotated)}/></button>:null}</section>;
}
`;
 s=s.slice(0,start)+replacement+s.slice(end);
 s=one(s,'({vehicle}: {vehicle: Vehicle})','({vehicle,capturedSections}: {vehicle: Vehicle;capturedSections:ReferenceInspectionSection[]})');
 s=one(s,'{sections.map(section => <Section','{capturedSections.map(section => <Section');
 s=one(s,'Only the checkpoints observed in the emulator are reproduced here.','The recorded checkpoints and findings come from this vehicle’s captured listing.');
 return one(s,'  expand: {',"  findingButton:{display:'grid',placeItems:'center',width:25,height:25,padding:0,color:'#e67e22',borderWidth:0,borderRadius:'50%',backgroundColor:'#fff4e5',cursor:'pointer'},\n  findingText:{padding:'10px 16px 14px',color:'#79522c',fontSize:12,lineHeight:'19px',backgroundColor:'#fffaf3'},\n  unrated:{color:'#7a869f',backgroundColor:'#f1f4f7'},\n  expand: {");
});
for(const[file,source]of changes){await writeFile(file,source);console.log('UPDATED',file);}
