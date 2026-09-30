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
  backdrop:{position:'fixed',inset:0,zIndex:215,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',backgroundColor:'rgba(0,0,0,.48)'},
  sheet:{width:'100%',maxWidth:650,maxHeight:'calc(100dvh - 48px)',overflowY:'auto',overscrollBehaviorY:'contain',padding:'20px 20px calc(24px + env(safe-area-inset-bottom))',color:'#202024',fontFamily:$.fontSans,borderRadius:{[media.mobile]:'24px 24px 0 0',default:24},outlineStyle:'none',backgroundColor:'#fff'},
  header:{display:'flex',alignItems:'center',gap:15,minHeight:34},
  close:{display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:$.ink,borderWidth:0,borderRadius:'50%',backgroundColor:'#f4f4f5',cursor:'pointer'},
  title:{fontSize:18,fontWeight:600,lineHeight:'24px'},
  body:{marginTop:16,color:$.muted,fontSize:14,fontWeight:400,lineHeight:1.6},
});
