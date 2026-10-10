'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Check, Copy} from 'lucide-react';
import {media,tokens as $} from '@/app/tokens.stylex';

export default function StructuralSummary({vin}: {vin: string}) {
  const tx = useCopy();

  const [message,setMessage]=useState('');
  async function copy(){
    try {
      if(navigator.clipboard) await navigator.clipboard.writeText(vin);
      else {
        const input=document.createElement('textarea');input.value=vin;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
        const copied=document.execCommand('copy');input.remove();if(!copied)throw Error('Clipboard unavailable');
      }
      setMessage('VIN copied');
    } catch {setMessage(`VIN: ${vin}`);}
  }
  return <section aria-label={tx("Captured structural inspection")} {...stylex.props(s.section)}><div {...stylex.props(s.body)}><Check size={22} strokeWidth={1.5} color="#00a64f"/><div><h3 {...stylex.props(s.title)}>{tx("No major structural damage")}</h3><div {...stylex.props(s.vin)}><span>{tx("Vin : ")}{tx(vin)}</span><button type="button" aria-label={tx("Copy vehicle VIN")} onClick={()=>void copy()} {...stylex.props(s.copy)}><Copy size={14} fill="currentColor"/></button></div></div></div><img src={assetPath("/reference-assets/final-pass/structural-illustration.png")} width={336} height={150} alt={tx("")} {...stylex.props(s.illustration)}/>{message?<output role="status" {...stylex.props(s.message)}>{tx(message)}</output>:null}</section>;
}
const s=stylex.create({
  section:{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,minHeight:95,marginTop:30,marginInline:{[media.mobile]:-22,default:0},padding:'14px 22px',backgroundColor:'#fafafa'},
  body:{display:'flex',alignItems:'start',gap:4,minWidth:0},
  title:{color:'#202024',fontFamily:$.fontDisplay,fontSize:13,fontWeight:600,lineHeight:'20px',whiteSpace:'nowrap'},
  vin:{display:'flex',alignItems:'center',gap:9,marginTop:10,color:'#535353',fontFamily:$.fontDisplay,fontSize:10,lineHeight:'18px',whiteSpace:'nowrap'},
  copy:{display:'grid',placeItems:'center',width:17,height:21,padding:0,color:'#202024',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  illustration:{flexShrink:0,width:{[media.mobile]:112,default:145},maxWidth:'30%',height:'auto',objectFit:'contain'},
  message:{position:'absolute',left:'50%',bottom:2,maxWidth:'calc(100% - 20px)',transform:'translateX(-50%)',padding:'3px 8px',color:'#fff',fontSize:11,lineHeight:'18px',borderRadius:4,backgroundColor:'#202024'},
});
