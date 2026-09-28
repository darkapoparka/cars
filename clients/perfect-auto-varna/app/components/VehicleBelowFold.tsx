'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';

import {useState,type ReactNode} from 'react';
import {isDealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {Armchair, CarFront, Check, ChevronRight, CircleGauge, Fuel, Gauge, Info, KeyRound, MapPin, Music2, Palette, Search, ShieldCheck, Sparkles, Wrench} from 'lucide-react';
import {showroom} from '@/lib/showroom';
import ReferenceVideo from '@/components/ReferenceVideo';
import StructuralSummary from '@/components/StructuralSummary';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import VehicleServiceHistory from '@/components/VehicleServiceHistory';
import VehicleFinanceSection from '@/components/VehicleFinanceSection';
import OwnershipPanel from '@/components/OwnershipPanel';
import {formatPrice, type Vehicle} from '@/lib/data';
import {tokens as $} from '@/app/tokens.stylex';

const fortunerSpecs = [
  ['Engine', '2.7L', Wrench], ['Options', 'Basic', Sparkles],
  ['Transmission', 'Automatic', Gauge], ['Drive', 'Four Wheel Drive', CarFront],
  ['Body Type', 'SUV', CarFront], ['Mileage', '9.75 km/L mileage', Fuel],
  ['Wheels', 'Alloy Wheels', CircleGauge], ['Exterior', 'Exterior Color Grey', Palette],
  ['Trim', 'Fabric Trim', Armchair], ['Airbags', '3 Airbags', ShieldCheck],
  ['Seats', '7 Seats', Armchair], ['Keys', '1 Keys', KeyRound],
] as const;
function OverviewRow({icon, title, copy, information = false}: {icon: ReactNode; title: string; copy: string; information?: boolean}) {
  const tx = useCopy();

  return <div {...stylex.props(s.overviewRow)}><span {...stylex.props(s.overviewIcon)}>{tx(icon)}</span><div {...stylex.props(s.rowCopy)}><h3 {...stylex.props(s.rowTitle)}>{tx(title)}{information ? <Info size={15} /> : null}</h3><p {...stylex.props(s.rowText)}>{tx(copy)}</p></div></div>;
}
function SpecGrid({vehicle,reference,onInformation}: {vehicle: Vehicle;reference?:ReferenceVehicleDetail;onInformation:(title:string,description:string)=>void}) {
  const tx = useCopy();

  const icons:Record<string,typeof CarFront>={engineSize:Wrench,optionsType:Sparkles,transmissionType:Gauge,drive:CarFront,bodyType:CarFront,fuelEfficiency:Fuel,alloyWheels:CircleGauge,carExteriorColor:Palette,interiorTrimType:Armchair,noOfAirbags:ShieldCheck,numberOfSeats:Armchair,noOfKeys:KeyRound};
  const fallback=!isDealer&&vehicle.slug==='2024-toyota-fortuner-exr'?fortunerSpecs:[['Engine',vehicle.engine,Wrench],['Transmission',vehicle.transmission,Gauge],['Body Type',vehicle.body,CarFront],['Fuel Type',vehicle.fuel,Fuel],['Exterior',vehicle.color,Palette],['Distance driven',formatPrice(vehicle.mileage)+' km',CircleGauge]] as const;
  const entries=reference?.specifications.length?reference.specifications.filter(spec=>!['odometerReading','specs','vin'].includes(spec.key)).map(spec=>({label:spec.label,value:spec.value,Icon:icons[spec.key]??CarFront,description:spec.description})):fallback.map(([label,value,Icon])=>({label,value,Icon,description:undefined}));
  return <dl {...stylex.props(s.specGrid)}>{entries.map(({label,value,Icon,description})=><div key={label} {...stylex.props(s.spec)}><dt aria-label={tx(label)}><Icon size={17} strokeWidth={1.5}/></dt><dd {...stylex.props(s.specValue)}><span>{tx(value)}</span>{description?<button type="button" aria-label={tx('About '+label)} onClick={()=>onInformation(label,description)} {...stylex.props(s.specInfo)}><Info size={15}/></button>:null}</dd></div>)}</dl>;
}
export default function VehicleBelowFold({vehicle, onLogin,reference}: {vehicle: Vehicle; onLogin: () => void;reference?:ReferenceVehicleDetail}) {
  const tx = useCopy();

  const fortuner = !isDealer && vehicle.slug === '2024-toyota-fortuner-exr';
  const [information,setInformation]=useState<{title:string;description:string}|null>(null);
  const hasDetails=Boolean(reference)||fortuner;
  const comparison=reference?.priceComparison??(fortuner?{cars24Price:94099,marketPrice:104000,newCarPrice:127000,totalSavings:9901}:undefined);
  const comparedPrices=comparison?[['Showroom price',comparison.cars24Price,72],['Market price',comparison.marketPrice,93],...(comparison.newCarPrice?[['New car price',comparison.newCarPrice,150]]:[])]:[];
  const structural=Boolean(reference?.structuralClear&&reference.vin);
  const overviewIcons:Record<string,typeof CarFront>={convenienceFee:ShieldCheck,appleplay:Music2,cruisecontrol:CarFront};
  const previewFeatures = fortuner ? ['Fog Light Front', 'Cruise Control', 'Parking Sensor...', 'Roof Rails', 'Running Lights', 'Rear Bumpe...'] : reference?.topFeatures.length?reference.topFeatures.slice(0,6):vehicle.highlights;
  return <>
    <section id="overview" {...stylex.props(s.overview)}>
      <Link href={showroom.locationHref} aria-label={tx("See it in person — visit showroom")} {...stylex.props(s.visitRow)}><OverviewRow icon={<MapPin size={21} strokeWidth={1.7}/>} title={tx("See it in person")} copy={tx("Plan a visit to the showroom")}/><ChevronRight size={18} aria-hidden="true"/></Link>
      {reference?.highlights.length?reference.highlights.map(item=>{const Icon=overviewIcons[item.key]??CarFront;return <OverviewRow key={item.key} icon={<Icon size={21}/>} title={tx(item.title)} copy={tx(item.description)} information={item.key==='convenienceFee'}/>;}):<>
      <OverviewRow icon={<CarFront size={20} />} title={tx(fortuner ? 'Great condition' : vehicle.condition)} copy={tx(fortuner ? 'Car has low imperfections' : 'Confirm the listing details with the dealer')} />
      {vehicle.highlights.includes('Cruise control') || fortuner ? <OverviewRow icon={<CarFront size={21} />} title={tx("Cruise control")} copy={tx("Cruise control to drive with ease & comfort")} /> : null}
      <OverviewRow icon={<ShieldCheck size={22}/>} title={tx("Confirm the details")} copy={tx("Confirm any additional fees with the showroom")} information />
      {fortuner ? <OverviewRow icon={<Music2 size={22}/>} title={tx("Apple play")} copy={tx("Enjoy your drive with apple play")} /> : null}
      </>}
      <OwnershipPanel/>
      <SpecGrid vehicle={vehicle} reference={reference} onInformation={(title,description)=>setInformation({title,description})}/>
      {comparison ? <section aria-labelledby="price-comparison" {...stylex.props(s.comparison)}><div {...stylex.props(s.dividerHeading)}><i {...stylex.props(s.dividerLine)} /><h2 id="price-comparison" {...stylex.props(s.comparisonHeading)}>{tx("Understanding Price Comparison")}</h2><i {...stylex.props(s.dividerLine)} /></div><div {...stylex.props(s.comparisonGraphic)}><span {...stylex.props(s.savings)}>{tx(currency.code)} {tx(formatPrice(comparison.totalSavings))} {tx(" Savings")}</span><span {...stylex.props(s.savingsStripe)} /><img src={assetPath("/reference-assets/continuation/comparison-car.png")} width={450} height={210} alt={tx("Vehicle price comparison")} {...stylex.props(s.comparisonCar)} /><div {...stylex.props(s.comparisonRows)}>{comparedPrices.map(([label, value, length], index) => <div key={label} {...stylex.props(s.comparisonRow)}><span>{tx(label)}</span><i style={{width: Number(length)}} {...stylex.props(s.comparisonLine, index === 0 && s.primaryLine)} /><strong {...stylex.props(s.comparisonValue, index === 0 && s.primaryValue)}>{tx(currency.code)} {tx(formatPrice(Number(value)))}</strong></div>)}</div></div></section> : null}
    </section>
    {structural?<StructuralSummary vin={reference!.vin!}/>:null}
    <section id="features" {...stylex.props(s.features,structural&&s.featuresAfterSummary)}><h2 {...stylex.props(s.sectionHeading)}>{tx("Features")}</h2><Link href={`/cars/${vehicle.slug}/features`} aria-label={tx("Search for a feature")} {...stylex.props(s.featureSearch)}><Search size={22} /><span>{tx("Search for a feature")}</span></Link><div {...stylex.props(s.featureHighlights)}>{previewFeatures.map(feature => <Link href={`/cars/${vehicle.slug}/features`} key={feature} {...stylex.props(s.featureItem)}><span {...stylex.props(s.featureCheck)}><Check size={11} strokeWidth={2.5} /></span>{tx(feature)}</Link>)}</div><Link href={`/cars/${vehicle.slug}/features`} {...stylex.props(s.outline)}>{tx("VIEW ALL FEATURES")}</Link></section>
    <section id="condition" {...stylex.props(s.condition)}><h2 {...stylex.props(s.sectionHeading)}>{tx("Car Condition")}</h2>
      {reference?.inspection.length || fortuner ? <><div {...stylex.props(s.inspectionCard)}><ReferenceVideo src="/reference-assets/final-pass/inspection.mp4" poster="/reference-assets/continuation/inspection-poster.png" label={tx("inspection video")} posterHasButton ratio="1.64"/></div><Link href={`/cars/${vehicle.slug}/inspection`} {...stylex.props(s.outline)}>{tx("VIEW FULL REPORT")}</Link><h3 {...stylex.props(s.tourHeading)}>{tx("Start Video tour")}</h3><button type="button" onClick={onLogin} aria-label={tx("Book a virtual test drive")} {...stylex.props(s.tour)}><Image sizes="(max-width: 1099px) 100vw, 860px" src={showroom.artwork.detail.videoTour} alt={tx("Ask for a video tour: a closer look at the car with guidance from the showroom.")} width={1212} height={681} {...stylex.props(s.image)} /></button></> : <div {...stylex.props(s.reportCard)}><h3 {...stylex.props(s.reportTitle)}>{tx(vehicle.condition)}</h3><p {...stylex.props(s.sectionText)}>{tx("Only the captured listing details are available for this car. A complete inspection report is not included in this local catalog.")}</p><button type="button" onClick={onLogin} {...stylex.props(s.outline)}>{tx("Request vehicle information")}</button></div>}
    </section>
    {hasDetails?<><VehicleServiceHistory records={reference?.serviceRecords} due={reference?reference.serviceDue??null:undefined}/><VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/></>:<section id="service-history" {...stylex.props(s.serviceHistory)}><h2 {...stylex.props(s.sectionHeading)}>{tx("Service History")}</h2><p {...stylex.props(s.sectionText)}>{tx("A service-history document is not included for this vehicle in the captured local catalog.")}</p><button type="button" onClick={onLogin} {...stylex.props(s.outline)}>{tx("Request service history")}</button></section>}

    {information?<ReferenceInfoSheet title={tx(information.title)} description={tx(information.description)} onClose={()=>setInformation(null)}/>:null}
  </>;
}
const s=stylex.create({
overview: {scrollMarginTop: 152, marginTop: 18},
visitRow: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 18px', alignItems: 'center', gap: 8, color: $.ink, borderRadius: 8},
overviewRow: {display: 'grid', gridTemplateColumns: '38px minmax(0,1fr)', alignItems: 'center', gap: 14, minHeight: 57},
overviewIcon: {display: 'grid', placeItems: 'center', width: 38, height: 38, color: '#202024', borderRadius: 3, backgroundColor: '#f8f8f8'},
rowCopy: {minWidth: 0},
rowTitle: {display: 'flex', alignItems: 'center', gap: 12, color: '#202024', fontFamily: $.fontDisplay, fontSize: 13, fontWeight: 500, lineHeight: '21px'},
rowText: {marginTop: 2, overflow: 'hidden', color: '#535353', fontFamily: $.fontDisplay, fontSize: 11, fontWeight: 400, lineHeight: '18px', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
specGrid: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '0 14px', margin: '24px 0 0', padding: '8px 12px', borderRadius: 10, backgroundColor: '#f8f8f8'},
spec: {display: 'grid', gridTemplateColumns: '17px minmax(0,1fr)', alignItems: 'center', gap: 9, minHeight: 49, color: '#202024', fontFamily: $.fontDisplay, fontSize: 12, fontWeight: 400, lineHeight: '19px', borderBottomColor: '#f0f0f0', borderBottomStyle: 'solid', borderBottomWidth: 1},
image: {display: 'block', width: '100%', height: 'auto'},
dividerHeading: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#202024', fontSize: 14, fontWeight: 500, lineHeight: '22px'},
dividerLine: {flexGrow: 1, height: 1, backgroundColor: '#e7e7e7'},
comparison: {marginTop: 20, paddingBottom: 18},
comparisonHeading: {fontSize: 14, fontWeight: 600, lineHeight: '22px'},
comparisonGraphic: {position: 'relative', minHeight: 226, marginTop: 18},
savings: {position: 'absolute', top: 0, left: '42%', zIndex: 3, padding: '3px 6px', color: '#fff', fontSize: 12, fontStyle: 'italic', lineHeight: '18px', borderRadius: 5, backgroundColor: '#00ae60'},
savingsStripe: {position: 'absolute', top: 34, left: '50%', width: 24, height: 100, backgroundColor: '#d7f0e5'},
comparisonCar: {position: 'absolute', top: 48, left: '31%', width: 152, height: 71, objectFit: 'contain'},
comparisonRows: {position: 'absolute', top: 122, left: 25, right: 25},
comparisonRow: {display: 'flex', alignItems: 'center', gap: 8, position: 'relative', minHeight: 30, color: '#535353', fontSize: 14, lineHeight: '20px'},
comparisonLine: {position: 'absolute', left: 96, top: 17, height: 3, borderTopColor: '#a9a9a9', borderTopStyle: 'dashed', borderTopWidth: 2},
primaryLine: {borderTopColor: '#f77400'},
comparisonValue: {marginLeft: 'auto', color: '#202024', fontSize: 11, fontWeight: 500},
primaryValue: {color: '#f17400'},
featuresAfterSummary:{marginTop:68},
specValue:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:5,minWidth:0},
specInfo:{display:'grid',placeItems:'center',flexShrink:0,width:18,height:24,padding:0,color:'#202024',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
features: {scrollMarginTop: 152, marginTop: 22},
sectionHeading: {color: '#202024', fontFamily: $.fontDisplay, fontSize: 16, fontWeight: 600, lineHeight: '24px'},
sectionText: {marginTop: 8, color: '#535353', fontFamily: $.fontDisplay, fontSize: 12, fontWeight: 400, lineHeight: '20px'},
featureSearch: {display: 'flex', alignItems: 'center', gap: 12, height: 59, marginTop: 18, paddingInline: 17, color: '#838383', fontFamily: $.fontDisplay, fontSize: 13, borderColor: '#c5c5c5', borderStyle: 'solid', borderWidth: 1, borderRadius: 9},
featureHighlights: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '0 15px', marginTop: 22, color: '#535353', fontFamily: $.fontDisplay, fontSize: 13, lineHeight: '22px'},
featureItem: {display: 'flex', alignItems: 'center', gap: 5, minHeight: 40, overflow: 'hidden', borderBottomColor: '#fbfbfb', borderBottomStyle: 'solid', borderBottomWidth: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
featureCheck: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 16, height: 16, color: '#00714c', borderRadius: '50%', backgroundColor: '#e4f1e9'},
outline: {display: 'grid', placeItems: 'center', width: '100%', minHeight: 57, marginTop: 26, padding: '10px 12px', color: '#202024', fontSize: 18, fontWeight: 600, lineHeight: '27px', borderColor: $.line, borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: $.surfaceAlt, cursor: 'pointer'},
condition: {scrollMarginTop: 152, marginTop: 37},
inspectionCard: {marginTop: 18, overflow: 'hidden', borderRadius: 10, backgroundColor: '#fff', boxShadow: '0 8px 15px rgba(0,0,0,.12)'},
tourHeading: {marginTop: 17, color: '#202024', fontSize: 20, fontWeight: 600, lineHeight: '27px'},
tour: {display: 'block', width: '100%', marginTop: 13, padding: 0, overflow: 'hidden', borderWidth: 0, borderRadius: 14, backgroundColor: '#fff', cursor: 'pointer'},
reportCard: {padding: '24px 12px', borderColor: '#e8e8e8', borderStyle: 'solid', borderWidth: 1, borderRadius: 13, backgroundColor: '#fff'},
reportTitle: {color: '#202024', fontSize: 18, fontWeight: 500, lineHeight: '26px'},
serviceHistory: {scrollMarginTop: 152, marginTop: 32}
});
