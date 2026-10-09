'use client';
import {hasPublishedMileage} from '@/lib/vehicle-values';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';

import {useState,type ReactNode} from 'react';
import {dealer,isDealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {CarFront, Check, ChevronRight, ClipboardCheck, History, Info, Music2, ShieldCheck} from 'lucide-react';
import StructuralSummary from '@/components/StructuralSummary';
import ReferenceInfoSheet from '@/components/ReferenceInfoSheet';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import {getVehicleServiceHistory} from '@/lib/vehicle-service-history';
import VehicleRecordsSheet from '@/components/VehicleRecordsSheet';
import VehicleFinanceSection from '@/components/VehicleFinanceSection';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media,tokens as $} from '@/app/tokens.stylex';

const fortunerSpecs = [
  ['Engine', '2.7L'], ['Options', 'Basic'],
  ['Transmission', 'Automatic'], ['Drive', 'Four Wheel Drive'],
  ['Body Type', 'SUV'], ['Mileage', '9.75 km/L mileage'],
  ['Wheels', 'Alloy Wheels'], ['Exterior', 'Exterior Color Grey'],
  ['Trim', 'Fabric Trim'], ['Airbags', '3 Airbags'],
  ['Seats', '7 Seats'], ['Keys', '1 Keys'],
] as const;
function OverviewRow({icon, title, copy, information = false}: {icon: ReactNode; title: string; copy?: string; information?: boolean}) {
  const tx = useCopy();

  return <div {...stylex.props(s.overviewRow)}><span aria-hidden="true" {...stylex.props(s.overviewIcon)}>{icon}</span><div {...stylex.props(s.rowCopy)}><h3 {...stylex.props(s.rowTitle)}>{tx(title)}{information ? <Info size={15} aria-hidden="true"/> : null}</h3>{copy ? <p {...stylex.props(s.rowText)}>{tx(copy)}</p> : null}</div></div>;
}
function RecordRow({id,title,status,icon,onOpen,open}: {id:string;title:string;status:string;icon:ReactNode;onOpen:()=>void;open:boolean}) {
  const tx=useCopy();
  return <section id={id} {...stylex.props(s.recordSection)}>
    <h2><button type="button" onClick={onOpen} aria-haspopup="dialog" aria-expanded={open} aria-describedby={`${id}-status`} {...stylex.props(s.recordRow)}>
      <span aria-hidden="true" {...stylex.props(s.recordIcon)}>{icon}</span>
      <span {...stylex.props(s.rowCopy)}><span {...stylex.props(s.recordTitle)}>{tx(title)}</span><span id={`${id}-status`} {...stylex.props(s.recordStatus)}>{tx(status)}</span></span>
      <ChevronRight size={20} aria-hidden="true"/>
    </button></h2>
  </section>;
}
export function VehicleSpecifications({vehicle,reference,compact=false}: {vehicle: Vehicle;reference?:ReferenceVehicleDetail;compact?:boolean}) {
  const tx = useCopy();
  const [information,setInformation]=useState<{title:string;description:string}|null>(null);

  const fallback=dealer.referenceClaimsApproved&&!isDealer&&vehicle.slug==='2024-toyota-fortuner-exr'?fortunerSpecs:[['Engine',vehicle.engine],['Transmission',vehicle.transmission],['Body Type',vehicle.body],['Fuel Type',vehicle.fuel],['Color',vehicle.color],['Distance driven',hasPublishedMileage(vehicle)?`${formatPrice(vehicle.mileage)} ${tx('km')}`:tx('Mileage on request')]] as const;
  const entries=reference?.specifications.length?reference.specifications.filter(spec=>!['odometerReading','specs','vin'].includes(spec.key)).map(spec=>({label:spec.label,value:spec.value,description:spec.description})):fallback.map(([label,value])=>({label,value,description:undefined}));
  return <><section data-vehicle-specifications aria-label={tx('Specifications')} {...stylex.props(s.specCard,compact?s.sidebarSpecs:s.contentSpecs)}>
    <h2 {...stylex.props(s.sectionHeading)}>{tx('Specifications')}</h2>
    <dl {...stylex.props(s.specGrid,compact&&s.sidebarSpecGrid)}>{entries.map(({label,value,description})=><div key={label} {...stylex.props(s.spec)}>
      <dt {...stylex.props(s.specLabel)}>{tx(label==='Transmission'?'Gearbox':label)}</dt>
      <dd {...stylex.props(s.specValue)}><span>{tx(value)}</span>{description?<button type="button" aria-label={tx('About '+label)} onClick={()=>setInformation({title:label,description})} {...stylex.props(s.specInfo)}><Info size={16} aria-hidden="true"/></button>:null}</dd>
    </div>)}</dl>
  </section>{information?<ReferenceInfoSheet title={tx(information.title)} description={tx(information.description)} onClose={()=>setInformation(null)}/>:null}</>;
}
export default function VehicleBelowFold({vehicle, onLogin,reference,equipment}: {vehicle: Vehicle; onLogin: (intent?:'condition'|'service-history') => void;reference?:ReferenceVehicleDetail;equipment?:readonly string[]}) {
  const tx = useCopy();

  const fortuner = Boolean(dealer.referenceClaimsApproved && !isDealer && vehicle.slug === '2024-toyota-fortuner-exr');
  const [record,setRecord]=useState<'condition'|'service-history'|null>(null);
  const hasDetails=Boolean(reference)||fortuner;
  const serviceHistory=getVehicleServiceHistory(vehicle.slug,reference?.serviceRecords);
  const comparison=reference?.priceComparison??(fortuner?{cars24Price:94099,marketPrice:104000,newCarPrice:127000,totalSavings:9901}:undefined);
  const comparedPrices=comparison?[['Showroom price',comparison.cars24Price,72],['Market price',comparison.marketPrice,93],...(comparison.newCarPrice?[['New car price',comparison.newCarPrice,150]]:[])]:[];
  const structural=Boolean(reference?.structuralClear&&reference.vin);
  const overviewIcons:Record<string,typeof CarFront>={convenienceFee:ShieldCheck,appleplay:Music2,cruisecontrol:CarFront};
  const previewFeatures = (equipment?.length ? equipment : reference?.topFeatures.length ? reference.topFeatures : fortuner ? ['Fog Light Front','Cruise Control','Parking Sensors Rear'] : vehicle.highlights).slice(0,3);
  return <>
    <section id="overview" aria-label={tx('Overview')} {...stylex.props(s.overview)}>
      <VehicleSpecifications vehicle={vehicle} reference={reference}/>
      {reference?.highlights.length || fortuner ? <div {...stylex.props(s.overviewDetails)}>
      {reference?.highlights.length?reference.highlights.map(item=>{const Icon=overviewIcons[item.key]??CarFront;return <OverviewRow key={item.key} icon={<Icon size={21}/>} title={tx(item.title)} copy={tx(item.description)} information={item.key==='convenienceFee'}/>;}):<>
      {fortuner ? <OverviewRow icon={<CarFront size={20}/>} title={tx('Great condition')} copy={tx('Car has low imperfections')}/> : null}
      {fortuner ? <OverviewRow icon={<CarFront size={21} />} title={tx("Cruise control")} copy={tx("Cruise control to drive with ease & comfort")} /> : null}
      {fortuner ? <OverviewRow icon={<ShieldCheck size={22}/>} title={tx("Confirm the details")} copy={tx("Confirm any additional fees with the showroom")} information /> : null}
      {fortuner ? <OverviewRow icon={<Music2 size={22}/>} title={tx("Apple play")} copy={tx("Enjoy your drive with apple play")} /> : null}
      </>}
      </div> : null}
      {comparison ? <section aria-labelledby="price-comparison" {...stylex.props(s.comparison)}><div {...stylex.props(s.dividerHeading)}><h2 id="price-comparison" {...stylex.props(s.comparisonHeading)}>{tx("Understanding Price Comparison")}</h2></div><div {...stylex.props(s.comparisonGraphic)}><span {...stylex.props(s.savings)}>{tx(currency.code)} {tx(formatPrice(comparison.totalSavings))} {tx(" Savings")}</span><span {...stylex.props(s.savingsStripe)} /><img src={assetPath("/reference-assets/continuation/comparison-car.png")} width={450} height={210} alt={tx("Vehicle price comparison")} {...stylex.props(s.comparisonCar)} /><div {...stylex.props(s.comparisonRows)}>{comparedPrices.map(([label, value, length], index) => <div key={label} {...stylex.props(s.comparisonRow)}><span>{tx(label)}</span><i style={{width: Number(length)}} {...stylex.props(s.comparisonLine, index === 0 && s.primaryLine)} /><strong {...stylex.props(s.comparisonValue, index === 0 && s.primaryValue)}>{tx(currency.code)} {tx(formatPrice(Number(value)))}</strong></div>)}</div></div></section> : null}
    </section>
    {structural?<StructuralSummary vin={reference!.vin!}/>:null}
    <section id="features" aria-label={tx('Features')} {...stylex.props(s.features,structural&&s.featuresAfterSummary)}>
      <h2 {...stylex.props(s.sectionHeading)}>{tx('Features')}</h2>
      <ul {...stylex.props(s.featureHighlights)}>{previewFeatures.map(feature=><li key={feature} {...stylex.props(s.featureItem)}><span aria-hidden="true" {...stylex.props(s.featureCheck)}><Check size={12} strokeWidth={2.5}/></span>{tx(feature)}</li>)}</ul>
      <Link href={`/cars/${vehicle.slug}/features`} {...stylex.props(s.allFeatures)}>{tx('View all features')}<ChevronRight size={18} aria-hidden="true"/></Link>
    </section>
    <div {...stylex.props(s.recordGroup)}>
      {reference?.inspection.length?<RecordRow id="condition" title="Inspection report" status="View inspection report" icon={<CarFront size={21}/>} open={record==='condition'} onOpen={()=>setRecord('condition')}/>:null}
      <RecordRow id="service-history" title="Service History" status={serviceHistory.isSample?'Sample records':serviceHistory.records.length?'View service records':'No records'} icon={serviceHistory.records.length&&!serviceHistory.isSample?<ClipboardCheck size={21}/>:<History size={21}/>} open={record==='service-history'} onOpen={()=>setRecord('service-history')}/>
    </div>
    {hasDetails?<VehicleFinanceSection vehicle={vehicle} onLogin={onLogin}/>:null}
    {record?<VehicleRecordsSheet kind={record} vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} reference={reference} serviceHistory={serviceHistory} onClose={()=>setRecord(null)} onRequest={()=>{setRecord(null);onLogin(record);}}/>:null}
  </>;
}
const s=stylex.create({
overview: {scrollMarginTop: 152, marginTop: {[media.desktop]:0,default:16}},
overviewDetails: {marginTop: 12, padding: 16, borderRadius: $.radiusMd, backgroundColor: $.surfaceAlt},
overviewRow: {display: 'grid', gridTemplateColumns: '38px minmax(0,1fr)', alignItems: 'center', gap: 12, minHeight: 58, paddingBlock: 8},
overviewIcon: {display: 'grid', placeItems: 'center', width: 38, height: 38, color: $.ink, borderRadius: '50%', backgroundColor: $.surfaceAlt},
rowCopy: {minWidth: 0},
rowTitle: {display: 'flex', alignItems: 'center', gap: 8, color: $.ink, fontFamily: $.fontSans, fontSize: {[media.desktop]: $.desktopTextSize, default: 15}, fontWeight: 500, lineHeight: {[media.desktop]: '24px', default: '22px'}},
rowText: {marginTop: 3, color: $.muted, fontFamily: $.fontSans, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}, fontWeight: 400, lineHeight: {[media.desktop]: '20px', default: '19px'}},
specCard: {padding: {[media.mobile]: 12, default: 16}, borderRadius: $.radiusMd, backgroundColor: $.surfaceAlt},
contentSpecs: {display:{[media.desktop]:'none',default:'block'}},
sidebarSpecs: {marginTop:22,padding:'20px 0 0',borderRadius:0,backgroundColor:'transparent'},
sidebarSpecGrid: {gridTemplateColumns:'repeat(2,minmax(0,1fr))'},
specGrid: {display: 'grid', gridTemplateColumns: {[media.desktop]: 'repeat(3,minmax(0,1fr))', default: 'repeat(auto-fit,minmax(min(100%,max(9em,calc(50% - 4px))),1fr))'}, gap: {[media.mobile]: 6, default: 8}, margin: '10px 0 0', padding: 0, fontSize: 14},
spec: {display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, minWidth: 0, minHeight: {[media.mobile]: 56, default: 68}, padding: {[media.mobile]: 8, default: 12}, borderRadius: $.radiusSm, backgroundColor: $.surface},
specLabel: {color: $.muted, fontFamily: $.fontSans, fontSize: {[media.mobile]: 12, [media.desktop]: $.desktopSupportSize, default: 13}, fontWeight: 400, lineHeight: {[media.mobile]: '16px', [media.desktop]: '20px', default: '18px'}},
dividerHeading: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#202024', fontSize: 14, fontWeight: 500, lineHeight: '22px'},
comparison: {marginTop: 20, paddingBottom: 18},
comparisonHeading: {fontSize: 14, fontWeight: 600, lineHeight: '22px'},
comparisonGraphic: {position: 'relative', minHeight: 226, marginTop: 18},
savings: {position: 'absolute', top: 0, left: '42%', zIndex: 3, padding: '3px 6px', color: '#fff', fontSize: 12, fontStyle: 'italic', lineHeight: '18px', borderRadius: 5, backgroundColor: '#00ae60'},
savingsStripe: {position: 'absolute', top: 34, left: '50%', width: 24, height: 100, backgroundColor: '#d7f0e5'},
comparisonCar: {position: 'absolute', top: 48, left: '31%', width: 152, height: 71, objectFit: 'contain'},
comparisonRows: {position: 'absolute', top: 122, left: 25, right: 25},
comparisonRow: {display: 'flex', alignItems: 'center', gap: 8, position: 'relative', minHeight: 30, color: '#535353', fontSize: 14, lineHeight: '20px'},
comparisonLine: {position: 'absolute', left: 96, top: 17, height: 3,},
primaryLine: {},
comparisonValue: {marginLeft: 'auto', color: '#202024', fontSize: {[media.desktop]: $.desktopLabelSize, default: 11}, fontWeight: 500},
primaryValue: {color: '#f17400'},
featuresAfterSummary:{marginTop:16},
specValue:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:4,minWidth:0,margin:0,color:$.ink,fontFamily:$.fontSans,fontSize:{[media.mobile]:14,[media.desktop]:$.desktopTextSize,default:15},fontWeight:600,lineHeight:{[media.mobile]:'20px',[media.desktop]:'24px',default:'22px'},overflowWrap:'anywhere'},
specInfo:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:$.surfaceAlt,cursor:'pointer'},
features: {scrollMarginTop: 152, marginTop: 16, padding: 16, borderRadius: $.radiusMd, backgroundColor: $.surfaceAlt},
allFeatures: {display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',minHeight:44,marginTop:12,padding:'10px 12px',color:$.ink,fontFamily:$.fontSans,fontSize:14,fontWeight:500,lineHeight:'20px',borderWidth:1,borderStyle:'solid',borderColor:$.controlBorder,borderRadius:$.radiusPill,backgroundColor:{default:$.surface,':hover':$.rail},outlineOffset:3},
sectionHeading: {color: $.ink, fontFamily: $.fontSans, fontSize: 18, fontWeight: 600, lineHeight: '26px', overflowWrap: 'anywhere'},
featureHighlights: {display: 'grid', gridTemplateColumns: {[media.mobile]:'1fr',default:'repeat(2,minmax(0,1fr))'}, gap: 8, margin: '12px 0 0', padding: 0, listStyle:'none', color: $.ink, fontFamily: $.fontSans, fontSize: 14, lineHeight: '21px'},
featureItem: {display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, minHeight: 44, padding: '10px 12px', borderRadius: $.radiusSm, backgroundColor: $.surface, overflowWrap: 'anywhere'},
featureCheck: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 18, height: 18, color: $.surface, borderRadius: '50%', backgroundColor: $.ink},
recordGroup: {display:'grid',gap:8,marginTop:24},
recordSection: {scrollMarginTop:152},
recordRow: {display:'grid',gridTemplateColumns:'36px minmax(0,1fr) 20px',alignItems:'center',gap:12,width:'100%',minHeight:72,padding:12,textAlign:'left',color:$.ink,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:$.radiusMd,backgroundColor:{default:$.surfaceAlt,':hover':$.line},outlineOffset:3,cursor:'pointer'},
recordIcon: {display:'grid',placeItems:'center',width:36,height:36,borderRadius:'50%',backgroundColor:$.surface},
recordTitle: {display:'block',fontFamily:$.fontSans,fontSize:16,fontWeight:500,lineHeight:'22px'},
recordStatus: {display:'block',marginTop:2,color:$.muted,fontFamily:$.fontSans,fontSize:{[media.desktop]:$.desktopSupportSize,default:13},fontWeight:400,lineHeight:{[media.desktop]:'20px',default:'18px'}}
});
