'use client';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import {X} from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import {useModal} from '@/components/useModal';
import {capturedRelatedVehicles} from '@/lib/captured-related';
import type {Vehicle} from '@/lib/data';
import {media,tokens as $} from '@/app/tokens.stylex';

export default function SimilarVehiclesSheet({vehicle,related,onClose}:{vehicle:Vehicle;related:Vehicle[];onClose:()=>void}){
  const tx = useCopy();

  const panel=useModal(true,onClose);
  const cars=vehicle.slug==='2024-toyota-fortuner-exr'?capturedRelatedVehicles:related;
  return <div {...stylex.props(s.backdrop)} onMouseDown={event=>event.currentTarget===event.target&&onClose()}><section ref={panel} role="dialog" aria-modal="true" aria-label={tx("Similar vehicles")} tabIndex={-1} {...stylex.props(s.sheet)}><header {...stylex.props(s.header)}><div><h2 {...stylex.props(s.title)}>{tx("Similar Cars")}</h2><p {...stylex.props(s.subtitle)}>{vehicle.year} {vehicle.make} {vehicle.model}</p></div><button type="button" aria-label={tx("Close similar cars")} onClick={onClose} {...stylex.props(s.close)}><X size={22}/></button></header><div {...stylex.props(s.cars)}>{cars.map(car=><VehicleCard key={car.slug} vehicle={{...car,mileage:Math.floor(car.mileage/1000)*1000}}/>)}</div></section></div>;
}
const s=stylex.create({
  backdrop:{position:'fixed',inset:0,zIndex:210,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',backgroundColor:'rgba(0,0,0,.48)'},
  sheet:{fontFamily:$.fontSans,width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 48px)',overflowY:'auto',overscrollBehaviorY:'contain',paddingTop:20,paddingInline:16,paddingBottom:'calc(24px + env(safe-area-inset-bottom))',borderRadius:24,outlineStyle:'none',backgroundColor:'#fff'},
  header:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:18,minHeight:49,paddingBottom:15,},
  title:{color:$.ink,fontFamily:$.fontSans,fontSize:18,fontWeight:600,lineHeight:'26px'},
  subtitle:{marginTop:4,color:$.muted,fontSize:13,lineHeight:'19px'},
  close:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:'#f4f4f5',cursor:'pointer'},
  cars:{display:'grid',gap:13,marginTop:10},
});
