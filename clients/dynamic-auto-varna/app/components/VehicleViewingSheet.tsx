'use client';

import * as stylex from '@stylexjs/stylex';
import {CalendarDays, ChevronRight, MapPin, Phone, X} from 'lucide-react';
import Link from '@/components/AppLink';
import {useModal} from '@/components/useModal';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function VehicleViewingSheet({vehicleTitle, onClose, onRequest}: {vehicleTitle:string; onClose:()=>void; onRequest:()=>void}) {
  const tx = useCopy();
  const panel = useModal(true, onClose);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="vehicle-viewing-title" {...stylex.props(s.sheet)}>
      <span aria-hidden="true" {...stylex.props(s.handle)}/>
      <header {...stylex.props(s.header)}><h2 id="vehicle-viewing-title" {...stylex.props(s.title)}>{tx('Viewing options')}</h2><button type="button" aria-label={tx('Close viewing options')} onClick={onClose} {...stylex.props(s.close)}><X size={22} aria-hidden="true"/></button></header>
      <p {...stylex.props(s.vehicle)}>{vehicleTitle}</p>
      <div {...stylex.props(s.options)}>
        <Link href={showroom.locationHref} {...stylex.props(s.option)}><span aria-hidden="true" {...stylex.props(s.icon)}><MapPin size={22}/></span><span {...stylex.props(s.copy)}><span {...stylex.props(s.label)}>{tx('In person')}</span><span {...stylex.props(s.hint)}>{dealer.address||tx('Visit the showroom')}</span></span><ChevronRight size={18} aria-hidden="true"/></Link>
        {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} {...stylex.props(s.option)}><span aria-hidden="true" {...stylex.props(s.icon)}><Phone size={21}/></span><span {...stylex.props(s.copy)}><span {...stylex.props(s.label)}>{tx('Call')}</span><span {...stylex.props(s.hint)}>{dealer.phoneDisplay||dealer.phoneE164}</span></span><ChevronRight size={18} aria-hidden="true"/></a> : null}
        <button type="button" onClick={onRequest} {...stylex.props(s.option)}><span aria-hidden="true" {...stylex.props(s.icon)}><CalendarDays size={22}/></span><span {...stylex.props(s.copy)}><span {...stylex.props(s.label)}>{tx('Request a viewing')}</span><span {...stylex.props(s.hint)}>{tx('Arrange a suitable time')}</span></span><ChevronRight size={18} aria-hidden="true"/></button>
      </div>
    </section>
  </div>;
}

const s = stylex.create({
  backdrop: {position:'fixed',inset:0,zIndex:240,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.48)'},
  sheet: {width:'100%',maxWidth:520,maxHeight:'92dvh',overflowY:'auto',padding:'10px 20px calc(24px + env(safe-area-inset-bottom))',color:$.ink,fontFamily:$.fontSans,borderRadius:{[media.mobile]:'24px 24px 0 0',default:24},backgroundColor:$.surface,outlineStyle:'none'},
  handle: {display:{[media.mobile]:'block',default:'none'},width:36,height:4,margin:'0 auto 10px',borderRadius:4,backgroundColor:$.line},
  header: {display:'flex',alignItems:'center',justifyContent:'space-between',gap:12},
  title: {fontSize:21,fontWeight:600,lineHeight:'28px'},
  close: {display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:$.surfaceAlt,cursor:'pointer'},
  vehicle: {marginTop:6,color:$.muted,fontSize:13,lineHeight:'20px',overflowWrap:'anywhere'},
  options: {display:'grid',gap:8,marginTop:20},
  option: {display:'grid',gridTemplateColumns:'40px minmax(0,1fr) 18px',alignItems:'center',gap:12,width:'100%',minHeight:72,padding:12,color:$.ink,textAlign:'left',borderWidth:0,borderRadius:14,backgroundColor:{default:$.surfaceAlt,':hover':$.violetSoft},outlineOffset:-3,cursor:'pointer'},
  icon: {display:'grid',placeItems:'center',width:40,height:40,borderRadius:12,backgroundColor:$.surface},
  copy: {display:'grid',gap:3,minWidth:0},
  label: {fontFamily:$.fontSans,fontSize:15,fontWeight:600,lineHeight:'21px'},
  hint: {color:$.muted,fontFamily:$.fontSans,fontSize:13,lineHeight:'19px',overflowWrap:'anywhere'},
});
