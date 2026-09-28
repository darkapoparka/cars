'use client';
import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';
import {X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {media,tokens as $} from '@/app/tokens.stylex';

export default function ReferenceInfoSheet({title,description,onClose}: {title:string;description:string;onClose:()=>void}) {
  const tx = useCopy();

  const panel=useModal(true,onClose);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event=>event.currentTarget===event.target&&onClose()}><section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx(title)} {...stylex.props(s.sheet)}><header {...stylex.props(s.header)}><button type="button" aria-label={tx("Close information")} onClick={onClose} {...stylex.props(s.close)}><X size={22} strokeWidth={1.5}/></button><h2 {...stylex.props(s.title)}>{tx(title)}</h2></header><p {...stylex.props(s.body)}>{tx(description)}</p></section></div>;
}
const s=stylex.create({
  backdrop:{position:'fixed',top:{[media.mobile]:114,default:72},right:0,bottom:0,left:0,zIndex:215,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',backgroundColor:'rgba(0,0,0,.5)',backdropFilter:'blur(2px)'},
  sheet:{width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 130px)',overflowY:'auto',padding:'18px 20px 51px',color:'#202024',fontFamily:$.fontDisplay,borderRadius:'10px 10px 0 0',outlineStyle:'none',backgroundColor:'#fff'},
  header:{display:'flex',alignItems:'center',gap:15,minHeight:34},
  close:{display:'grid',placeItems:'center',width:22,height:32,padding:0,color:'#f17100',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  title:{fontSize:16,fontWeight:600,lineHeight:'24px'},
  body:{marginTop:13,color:'#535353',fontSize:12,fontWeight:400,lineHeight:'18px'},
});
