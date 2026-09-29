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
  return <div {...stylex.props(s.backdrop)} onMouseDown={event=>event.currentTarget===event.target&&onClose()}><section ref={panel} role="dialog" aria-modal="true" aria-label={tx("Similar vehicles")} tabIndex={-1} {...stylex.props(s.sheet)}><header {...stylex.props(s.header)}><h2 {...stylex.props(s.title)}>{tx("Similar cars to ")}{tx(vehicle.year)} {tx(vehicle.make.toUpperCase())} {tx(vehicle.model.toUpperCase())}</h2><button type="button" aria-label={tx("Close similar cars")} onClick={onClose} {...stylex.props(s.close)}><X size={22}/></button></header><div {...stylex.props(s.cars)}>{cars.map(car=><VehicleCard key={car.slug} vehicle={{...car,mileage:Math.floor(car.mileage/1000)*1000}}/>)}</div></section></div>;
}
const s=stylex.create({
  backdrop:{position:'fixed',top:{[media.mobile]:51,default:0},left:0,right:0,bottom:0,zIndex:210,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',backgroundColor:'rgba(0,0,0,.4)'},
  sheet:{fontFamily:'Roboto,Arial,sans-serif',width:'100%',maxWidth:650,height:{[media.mobile]:'calc(100dvh - 104px)',default:'min(85dvh,850px)'},overflowY:'auto',paddingTop:{[media.mobile]:'clamp(28px,29dvh,274px)',default:28},paddingInline:22,paddingBottom:32,outlineStyle:'none',backgroundColor:'#fff'},
  header:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:18,minHeight:49,paddingBottom:15,borderBottomColor:'#eaeaea',borderBottomStyle:'solid',borderBottomWidth:1},
  title:{maxWidth:260,overflow:'hidden',color:'#202024',fontFamily:$.fontDisplay,fontSize:18,fontWeight:600,lineHeight:'26px',whiteSpace:'nowrap',textOverflow:'ellipsis'},
  close:{display:'grid',placeItems:'center',width:20,height:32,padding:0,color:'#f17100',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  cars:{display:'grid',gap:13,marginTop:10},
});
