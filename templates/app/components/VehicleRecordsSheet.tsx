'use client';

import * as stylex from '@stylexjs/stylex';
import {ChevronRight, X} from 'lucide-react';
import {InspectionSection} from '@/components/InspectionReport';
import VehicleServiceHistory from '@/components/VehicleServiceHistory';
import {useModal} from '@/components/useModal';
import {useCopy} from '@/lib/locale';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import type {VehicleServiceHistoryData} from '@/lib/vehicle-service-history';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function VehicleRecordsSheet({kind,vehicleTitle,reference,serviceHistory,onClose,onRequest}: {
  kind:'condition'|'service-history';
  vehicleTitle:string;
  reference?:ReferenceVehicleDetail;
  serviceHistory:VehicleServiceHistoryData;
  onClose:()=>void;
  onRequest:()=>void;
}) {
  const tx=useCopy();
  const panel=useModal(true,onClose);
  const condition=kind==='condition';
  const inspection=reference?.inspection??[];
  const records=serviceHistory.records;
  const sample=!condition&&serviceHistory.isSample;
  const hasRecords=condition?inspection.length>0:records.length>0;

  return <div {...stylex.props(s.backdrop)} onMouseDown={event=>event.currentTarget===event.target&&onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="vehicle-records-title" {...stylex.props(s.sheet)}>
      <header {...stylex.props(s.header)}>
        <h2 id="vehicle-records-title" {...stylex.props(s.title)}>{tx(condition?'Inspection report':'Service History')}</h2>
        <button type="button" aria-label={tx('Close information')} onClick={onClose} {...stylex.props(s.close)}><X size={22} aria-hidden="true"/></button>
      </header>
      <div {...stylex.props(s.body)}>
        <p {...stylex.props(s.vehicle)}>{vehicleTitle}</p>
        {sample?<p {...stylex.props(s.sample)}>{tx('Sample history')}</p>:null}
        {hasRecords?<>
          {sample?null:<p {...stylex.props(s.copy)}>{tx(condition?'Recorded inspection details from this car’s captured listing.':'Recorded service visits from this car’s captured listing.')}</p>}
          {condition?inspection.map(section=><InspectionSection key={section.title} section={section} embedded/>):<VehicleServiceHistory records={records} due={reference?.serviceDue??null} embedded/>}
          <p {...stylex.props(s.note)}>{tx(sample?'Illustrative records. Request this car’s actual service documents from the dealer.':'These are archived listing records. Confirm the current condition and complete documentation with the dealer.')}</p>
        </>:<div {...stylex.props(s.empty)}>
          <h3 {...stylex.props(s.emptyTitle)}>{tx(condition?'No inspection report supplied':'No service records supplied')}</h3>
          <p {...stylex.props(s.copy)}>{tx(condition?'An inspection report is not available for this car. Ask the dealer for its current condition.':'Service records are not available for this car. Request them from the dealer.')}</p>
        </div>}
        <button type="button" onClick={onRequest} {...stylex.props(s.request)}>{tx(condition?'Request vehicle information':'Request service history')}<ChevronRight size={18} aria-hidden="true" {...stylex.props(s.arrow)}/></button>
      </div>
    </section>
  </div>;
}

const s=stylex.create({
  backdrop:{position:'fixed',inset:0,zIndex:240,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.48)'},
  sheet:{display:'flex',flexDirection:'column',width:'100%',maxWidth:650,maxHeight:'92dvh',color:$.ink,fontFamily:$.fontSans,borderRadius:{[media.mobile]:'24px 24px 0 0',default:24},backgroundColor:$.surface,outlineStyle:'none',overflow:'hidden'},
  header:{display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,gap:12,padding:'16px 20px',borderBottomColor:$.line,borderBottomStyle:'solid',borderBottomWidth:1},
  title:{minWidth:0,fontSize:20,fontWeight:600,lineHeight:'28px'},
  close:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:$.surfaceAlt,cursor:'pointer'},
  body:{minHeight:0,overflowY:'auto',overscrollBehaviorY:'contain',padding:'16px 20px calc(24px + env(safe-area-inset-bottom))'},
  vehicle:{color:$.muted,fontSize:13,fontWeight:400,lineHeight:'20px',overflowWrap:'anywhere'},
  sample:{display:'inline-block',maxWidth:'100%',marginTop:12,padding:'5px 9px',color:$.ink,fontSize:12,fontWeight:500,lineHeight:'18px',borderRadius:$.radiusXs,backgroundColor:$.surfaceAlt},
  copy:{marginTop:8,color:$.muted,fontSize:14,fontWeight:400,lineHeight:'22px'},
  empty:{marginTop:20,padding:16,borderRadius:$.radiusMd,backgroundColor:$.surfaceAlt},
  emptyTitle:{fontSize:16,fontWeight:500,lineHeight:'24px'},
  note:{marginTop:20,color:$.muted,fontSize:12,fontWeight:400,lineHeight:'18px'},
  request:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,width:'100%',minHeight:48,marginTop:20,padding:'12px 16px',color:$.ink,fontFamily:$.fontSans,fontSize:14,fontWeight:500,lineHeight:'22px',textAlign:'left',borderWidth:1,borderStyle:'solid',borderColor:$.controlBorder,borderRadius:$.radiusPill,backgroundColor:{default:$.surface,':hover':$.rail},outlineOffset:3,cursor:'pointer'},
  arrow:{flexShrink:0},
});
