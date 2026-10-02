'use client';

import {useCopy,useLocale} from '@/lib/locale';
import Image from '@/components/AppImage';
import * as stylex from '@stylexjs/stylex';
import {Info} from 'lucide-react';
import type {ReferenceServiceRecord,ReferenceServiceDue} from '@/lib/reference-types';
import {media, tokens as $} from '@/app/tokens.stylex';
import {showroom} from '@/lib/showroom';

const defaultRecords = [
  {date:'2026-07-28',distance:'50,005 km',location:'Mega Refurbishment Labs, Cars24'},
  {date:'2026-01-12',distance:'39,649 km',location:'Non - Agency Service Center'},
];
/** Reference snapshot for the captured Fortuner, not live service-history verification. */
const defaultDue:ReferenceServiceDue={title:'Servicing due after 10,000 kms/ 6months',description:'Which ever is earliest, from the date of delivery on a chargeable basis',image:'/reference-assets/continuation/fortuner-service-banner.png'};
export default function VehicleServiceHistory({records=defaultRecords,due=defaultDue,embedded=false}:{records?:readonly ReferenceServiceRecord[];due?:ReferenceServiceDue|null;embedded?:boolean}) {
  const tx = useCopy();
  const locale=useLocale();
  const dates=new Intl.DateTimeFormat(locale==='bg'?'bg-BG':'en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'});
  function dateLabel(value:string){const date=new Date(value);return Number.isNaN(date.getTime())?tx(value):dates.format(date);}

  return <section id={embedded?undefined:'service-history'} {...stylex.props(s.section,embedded&&s.embedded)}>
    {embedded?null:<h2 {...stylex.props(s.heading)}>{tx("Service History")}</h2>}
    {due?.image&&!embedded?<Image sizes="(max-width: 1099px) 100vw, 860px" src={showroom.artwork.detail.service} width={1280} height={800} alt={tx(`${showroom.name} car care: oil and filter care, suspension, brakes, AC, diagnostic checks, wheels and tyres.`)} {...stylex.props(s.banner)} />:null}
    {due?<aside {...stylex.props(s.note,(!due.image||embedded)&&s.noteWithoutImage)}><Info size={15} fill="#202024" color="#fff" /><p><strong {...stylex.props(s.noteTitle)}>{tx(due.title)}</strong><span {...stylex.props(s.noteCopy)}>{tx(due.description)}</span></p></aside>:null}
    <ol aria-label={tx("Service History")} {...stylex.props(s.records)}>{records.map((record,index) => <li key={`${record.date}-${index}`} {...stylex.props(s.record)}><div {...stylex.props(s.recordHeader)}><time dateTime={record.date}>{dateLabel(record.date)}</time><span>{record.distance.replace(/\bkm$/,tx('km'))}</span></div><p {...stylex.props(s.location,embedded&&s.embeddedLocation)}>{tx(record.location)}</p>{record.work?.length?<ul {...stylex.props(s.work)}>{record.work.map(item=><li key={item}>{tx(item)}</li>)}</ul>:null}</li>)}</ol>
  </section>;
}
const s=stylex.create({
  section:{scrollMarginTop:179,marginTop:34},
  embedded:{marginTop:0},
  heading:{color:'#202024',fontFamily:$.fontDisplay,fontSize:16,fontWeight:600,lineHeight:'24px'},
  banner:{display:'block',width:{[media.mobile]:'calc(100% + 44px)',default:'100%'},maxWidth:'none',height:'auto',marginTop:20,marginInline:{[media.mobile]:-22,default:0},aspectRatio:'1.6',objectFit:'cover'},
  note:{display:'grid',gridTemplateColumns:'17px minmax(0,1fr)',gap:11,position:'relative',marginTop:{default:-63,'@media (max-width: 359px)':-36},padding:'17px 9px',color:'#202024',fontFamily:$.fontDisplay,borderRadius:15,backgroundColor:'#f8f8f8'},
  noteWithoutImage:{marginTop:18},
  noteTitle:{display:'block',fontSize:13,fontWeight:600,lineHeight:'19px'},
  noteCopy:{display:'block',marginTop:2,color:'#535353',fontSize:14,fontWeight:400,lineHeight:'21px'},
  records:{margin:'21px 0 0',padding:'2px 12px',listStyle:'none',color:'#535353',fontFamily:$.fontDisplay,borderRadius:15,backgroundColor:'#f8f8f8'},
  record:{padding:'13px 0 15px',borderBottomColor:'#e0e0e0',borderBottomStyle:'dashed',borderBottomWidth:{default:1,':last-child':0}},
  recordHeader:{fontFamily:'Roboto,Arial,sans-serif',display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:'4px 16px',color:$.ink,fontSize:14,fontWeight:500,lineHeight:'20px'},
  location:{marginTop:6,color:'#555',fontSize:11.5,lineHeight:'17px'},
  embeddedLocation:{fontSize:14,lineHeight:'22px',overflowWrap:'anywhere'},
  work:{display:'grid',gap:4,margin:'8px 0 0',paddingLeft:18,color:$.ink,fontFamily:$.fontSans,fontSize:14,lineHeight:'22px',overflowWrap:'anywhere'},
});
