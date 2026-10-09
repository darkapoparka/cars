'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import PageHeader from '@/components/PageHeader';
import * as stylex from '@stylexjs/stylex';
import {Armchair, CarFront, Check, ChevronDown, CircleGauge, Cog, Info, ShieldCheck, Wrench, Zap} from 'lucide-react';
import DealerEnquirySheet from '@/components/DealerEnquirySheet';
import type {ReferenceCheckpoint,ReferenceInspectionSection} from '@/lib/reference-types';
import type {Vehicle} from '@/lib/vehicle';
import {dealer} from '@/lib/dealer-config';
import {media,tokens as $} from '@/app/tokens.stylex';

const sectionIcons:Record<string,typeof CarFront>={'Exterior':CarFront,'Engine & Transmission':Cog,'Steering, Suspension & Brakes':Wrench,'Electricals, Controls & Lights':Zap,'Interiors & Luggage':Armchair,'Tyres':CircleGauge};
function Checkpoint({item,direct}: {item:ReferenceCheckpoint;direct:boolean}) {
  const tx = useCopy();

  const passed=item.status===1;
  return <><div data-inspection-status={item.status??'unknown'} data-inspection-name={item.name} {...stylex.props(s.row,direct&&s.directRow,item.remarks.length>0&&s.rowWithFinding)}><span>{tx(item.name)}</span>{item.value?<span {...stylex.props(s.metric)}>{tx(item.value)}</span>:item.remarks.length?<span aria-label={tx("Imperfection recorded")} {...stylex.props(s.findingIcon)}><Info size={20}/></span>:<span aria-label={tx(passed?'Passed in captured report':'No pass result recorded')} {...stylex.props(s.passed,!passed&&s.unrated)}>{passed?<Check size={16} strokeWidth={1.7}/>:'−'}</span>}</div>{item.remarks.length?<div {...stylex.props(s.findingText)}><h4 {...stylex.props(s.findingLabel)}>{tx("Imperfection")}</h4>{item.remarks.map((remark,index)=><p key={index}>{tx(remark)}</p>)}</div>:null}</>;
}
export function InspectionSection({section,embedded=false}: {section:ReferenceInspectionSection;embedded?:boolean}) {
  const tx = useCopy();

  const [expanded,setExpanded]=useState(embedded);
  const Heading=embedded?'h3':'h2';
  const GroupHeading=embedded?'h4':'h3';
  const Icon=sectionIcons[section.title]??CarFront;
  const limit=['Exterior','Electricals, Controls & Lights'].includes(section.title)?6:section.groups.length;
  const groups=expanded?section.groups:section.groups.slice(0,limit);
  return <section {...stylex.props(s.card)}><Heading {...stylex.props(s.cardHeading)}><Icon size={23} strokeWidth={1.2}/>{tx(section.title)}</Heading>{groups.map((group,index)=><div key={index}>{group.heading?<GroupHeading {...stylex.props(s.groupHeading)}>{tx(group.heading)}</GroupHeading>:null}{group.items.map((item,ordinal)=><Checkpoint key={item.name+'-'+ordinal} item={item} direct={!group.heading}/>)}</div>)}{section.groups.length>limit?<button type="button" onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded} {...stylex.props(s.expand)}>{tx(expanded?'SEE LESS':'SEE MORE')}<ChevronDown size={17} {...stylex.props(expanded&&s.rotated)}/></button>:null}</section>;
}
/** This is the observed inspection snapshot, not an inspection performed by this application. */
export default function InspectionReport({vehicle,capturedSections}: {vehicle: Vehicle;capturedSections:ReferenceInspectionSection[]}) {
  const tx = useCopy();

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const approved = Boolean(dealer.referenceClaimsApproved);
  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  return <main {...stylex.props(s.page)}>
    <PageHeader title={tx("Inspection report")} backHref={`/cars/${vehicle.slug}`} backLabel={tx("Back to car")}/>
    <div {...stylex.props(s.content)}><section {...stylex.props(s.intro)}><h2 {...stylex.props(s.vehicleTitle)}>{tx(vehicle.year)} {tx(vehicle.make.toUpperCase())} {tx(vehicle.model.toUpperCase())}</h2><p {...stylex.props(s.trim)}>{tx(vehicle.trim.split(' • ')[0])} {tx(" | ")}{tx(vehicle.engine)}</p><img src={assetPath(vehicle.image)} width={1155} height={651} alt={tx(vehicleTitle)} {...stylex.props(s.car)} /><div {...stylex.props(s.inspectionStatement)}><span {...stylex.props(s.inspectionIcon)}>{approved?<ShieldCheck size={43} fill="#50b67f" color="#fff" />:<Info size={32}/>}</span><p>{tx(approved?"Review the recorded condition details for this demo vehicle.":"No verified inspection report is available for this sample car.")}</p></div></section>
      {approved?<><h2 {...stylex.props(s.reportHeading)}>{tx("YOUR CAR CONDITION REPORT")}</h2>{capturedSections.map(section => <InspectionSection key={section.title} section={section} />)}<p {...stylex.props(s.referenceNote)}>{tx("Archived inspection data for this demo vehicle. The recorded checkpoints and findings come from this vehicle’s captured listing. This application has not independently inspected or certified the vehicle.")}</p></>:null}
    </div>
    <footer data-desktop-page-bar {...stylex.props(s.footer)}><button type="button" onClick={() => setEnquiryOpen(true)} {...stylex.props(s.book)}>{tx("Ask about a viewing")}</button></footer>
    <DealerEnquirySheet vehicleTitle={vehicleTitle} open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', paddingTop: 0, paddingBottom: 120, color: '#202024', fontFamily: $.fontSans, backgroundColor: '#f7f7f7'},
  content: {maxWidth: 760, marginInline: 'auto', paddingInline: 20},
  intro: {paddingTop: 26,paddingBottom:16,marginInline:-20,paddingInline:20,backgroundColor:'#fff'},
  vehicleTitle: {color: '#202024', fontSize: 16, fontWeight: 600, lineHeight: '24px'},
  trim: {marginTop: 8, fontSize: 18, lineHeight: '27px'},
  car: {display: 'block', width: '100%', height: 'auto', aspectRatio: '16/9', marginTop: 18, borderRadius:8, objectFit: 'cover'},
  inspectionStatement: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: 121, marginTop: 22, padding: '13px 20px', color: '#202024', fontSize: 14, lineHeight: '22px', textAlign: 'left', borderColor: '#ffebd9', borderStyle: 'solid', borderWidth: 1, borderRadius: 8, backgroundColor: '#fffaf5', backgroundImage:'linear-gradient(transparent 28px,#fff0de 28px,#fff0de 46px,transparent 46px)'},
  inspectionIcon: {display: 'flex', alignItems: 'center', gap: 7, width: '100%', paddingLeft: 0, fontSize: 21, fontWeight: 600},
  reportHeading: {marginTop: 28, marginBottom: 23, paddingBottom:14, color: '#202024', fontSize: 18, fontWeight: 500, lineHeight: '27px',letterSpacing:'.04em',backgroundImage:'linear-gradient(#fa8300,#fa8300)',backgroundRepeat:'no-repeat',backgroundSize:'41px 4px',backgroundPosition:'left bottom'},
  card: {marginTop: 24, paddingBottom: 12, overflow: 'hidden', borderRadius: 13, backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(58,106,134,.11)'},
  cardHeading: {display: 'flex', alignItems: 'center', gap: 19, minHeight: 55, padding: '10px 16px', color: '#202024', fontSize: 16, fontWeight: 600, lineHeight: '24px', borderColor: '#e5e5e5', borderStyle: 'solid', borderWidth: 1, borderRadius: 11, boxShadow: '0 4px 12px rgba(58,106,134,.08)'},
  groupHeading: {display: 'flex', alignItems: 'center', minHeight: 49, padding: '12px 16px', color: '#202024', fontSize: 14, fontWeight: 500, lineHeight: '22px'},
  row: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, minHeight: 49, padding: '11px 16px', color: '#858585', fontSize: 14, fontWeight: 400, lineHeight: '24px',},
  directRow: {color: '#202024'},
  passed: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 24, height: 24, color: '#00aa67', borderRadius: '50%', backgroundColor: '#e4f7ef'},
  findingIcon:{display:'grid',placeItems:'center',width:24,height:24,color:'#585858'},
  metric:{color:'#202024',fontSize:14,fontWeight:500},
  rowWithFinding:{minHeight:42,paddingBottom:2,},
  findingLabel:{marginBottom:3,color:'#202024',fontSize:12,fontWeight:500,lineHeight:'18px'},
  findingText:{padding:'0 16px 18px',color:'#858585',fontSize:12,lineHeight:'19px',backgroundColor:'#fff'},
  unrated:{color:'#858585',backgroundColor:'#f4f4f4'},
  expand: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', minHeight: 40, marginBottom: -6, padding: '8px 12px', color: '#f17100', fontSize: 14, fontWeight: 400, borderWidth: 0, backgroundColor: '#fff', cursor: 'pointer'},
  rotated: {transform: 'rotate(180deg)'},
  referenceNote: {marginTop: 36, color: '#727272', fontSize: 11, lineHeight: '18px'},
  footer: {position: 'fixed', right: {[media.desktop]:$.desktopShellInset,default:0}, bottom: 0, left: {[media.desktop]:$.desktopShellInset,default:0}, zIndex: 101, padding: '17px 22px 28px', backgroundColor: '#f9f9fa'},
  book: {width: '100%', minHeight: 54, padding: '10px 12px', color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '26px', borderWidth: 0, borderRadius: 8, backgroundColor: $.violet, cursor: 'pointer'},
});
