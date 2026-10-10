'use client';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import {X} from 'lucide-react';
import ReferenceVideo from '@/components/ReferenceVideo';
import {useModal} from '@/components/useModal';
import {media} from '@/app/tokens.stylex';

export default function VehicleTourViewer({src,poster,onClose}: {src:string;poster:string;onClose:()=>void}) {
  const tx = useCopy();

  const panel=useModal(true,onClose);
  return <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Vehicle video tour")} {...stylex.props(s.viewer)}><button type="button" aria-label={tx("Close video tour")} onClick={onClose} {...stylex.props(s.close)}><X size={21}/></button><div {...stylex.props(s.stage)}><ReferenceVideo src={src} poster={poster} label={tx("vehicle tour")} ratio="1.77777778" autoPlay/></div></section>;
}
const s=stylex.create({
  viewer:{position:'fixed',top:{[media.mobile]:51,default:0},right:0,bottom:{[media.mobile]:24,default:0},left:0,zIndex:230,display:'flex',alignItems:'center',justifyContent:'center',outlineStyle:'none',backgroundColor:'#000'},
  close:{position:'absolute',top:24,right:22,zIndex:3,display:'grid',placeItems:'center',width:27,height:27,padding:0,color:'#fff',borderWidth:0,borderRadius:'50%',backgroundColor:'#333',cursor:'pointer'},
  stage:{width:'100%',maxWidth:1100},
});
