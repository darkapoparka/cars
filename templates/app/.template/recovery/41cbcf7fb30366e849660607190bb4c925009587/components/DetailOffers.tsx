'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState} from 'react';
import {currency} from '@/lib/currency';
import * as stylex from '@stylexjs/stylex';
import {Check, Flame, X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function DetailOffers({vehicle,onLogin}: {vehicle:Vehicle;onLogin:()=>void}) {
  const tx = useCopy();

  const [index,setIndex]=useState(0),[open,setOpen]=useState<'interest'|'exchange'|null>(null),[visible,setVisible]=useState(false);
  const rail=useRef<HTMLDivElement>(null),touch=useRef<number|null>(null);
  const panel=useModal(open!==null,()=>setOpen(null));
  useEffect(()=>{const node=rail.current;if(!node)return;const observer=new IntersectionObserver(entries=>setVisible(Boolean(entries[0]?.isIntersecting)));observer.observe(node);return()=>observer.disconnect();},[]);
  useEffect(()=>{
    if(!visible||open||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const timer=setInterval(()=>{
      const node=rail.current,active=document.activeElement;
      const keyboardFocus=active instanceof HTMLElement&&node?.contains(active)&&active.matches(':focus-visible');
      const mouseHover=matchMedia('(hover: hover)').matches&&node?.matches(':hover');
      if(document.hidden||document.querySelector('[aria-modal="true"]')||touch.current!==null||keyboardFocus||mouseHover)return;
      setIndex(value=>(value+1)%3);
    },5000);
    return()=>clearInterval(timer);
  },[visible,open]);
  function action(){if(index===1)onLogin();else setOpen(index===0?'interest':'exchange');}
  return <>
    <div ref={rail} role="region" aria-label={tx("Vehicle offers")} aria-roledescription="carousel" data-offer-index={index} data-offer-visible={visible} onTouchStart={event=>{touch.current=event.touches[0].clientX;}} onTouchCancel={()=>{touch.current=null;}} onTouchEnd={event=>{const start=touch.current;touch.current=null;if(start!==null&&Math.abs(event.changedTouches[0].clientX-start)>35)setIndex(value=>(value+(event.changedTouches[0].clientX<start?1:2))%3);}} {...stylex.props(s.banner)}>
      <img src={assetPath(`/reference-assets/final-pass/offer-icon-${index}.png`)} width={32} height={32} alt={tx("")} {...stylex.props(s.icon)}/>
      <div {...stylex.props(s.copy)}>{index===0?<><p {...stylex.props(s.title)}>{tx("Special interest rate @1.99% p.a.*")}</p><p {...stylex.props(s.subtitle)}>{tx("Exclusively on Cars24 cars. ")}<button type="button" onClick={action} {...stylex.props(s.link)}>{tx("View details")}</button></p></>:index===1?<><p {...stylex.props(s.title)}>{tx("Buy for as low as ")}<strong>{tx(currency.code)} {tx(formatPrice(vehicle.price-Math.floor(vehicle.price*0.01)))}</strong></p><p {...stylex.props(s.subtitle)}>{tx("Only valid for non loa...")}</p></>:<><p {...stylex.props(s.title)}>{tx("Exchange your car")}</p><p {...stylex.props(s.subtitle)}>{tx("Save ")}{tx(currency.code)} {tx(" 2000 on c... ")}<button type="button" onClick={action} {...stylex.props(s.link)}>{tx("View details")}</button></p></>}</div>
      {index===0?<span {...stylex.props(s.lowInterest)}><Flame size={9} fill="currentColor"/>{tx("Lower interest")}</span>:index===1?<button type="button" onClick={action} {...stylex.props(s.unlock)}>{tx("UNLOCK")}</button>:null}
      <div aria-label={tx("Choose a vehicle offer")} {...stylex.props(s.dots)}>{[0,1,2].map(item=><button key={item} type="button" aria-label={tx(`Show vehicle offer ${item+1}`)} aria-pressed={index===item} onClick={()=>setIndex(item)} {...stylex.props(s.dotButton)}><span {...stylex.props(s.dot,index===item&&s.activeDot)}/></button>)}</div>
    </div>
    {open?<div {...stylex.props(s.backdrop)} onMouseDown={event=>event.target===event.currentTarget&&setOpen(null)}><section ref={panel} role="dialog" aria-modal="true" aria-label={tx(open==='interest'?'Special interest offer':'Coupon Details')} tabIndex={-1} {...stylex.props(s.sheet,open==='interest'&&s.interestSheet)}>
      {open==='interest'?<><button type="button" aria-label={tx("Close offer details")} onClick={()=>setOpen(null)} {...stylex.props(s.floatingClose)}><X size={23}/></button><div {...stylex.props(s.scroll)}><img src={assetPath("/reference-assets/final-pass/interest-offer.png")} alt={tx("Special interest rate offer on Cars24 cars")} width={1280} height={729} {...stylex.props(s.art)}/><div {...stylex.props(s.interestBody)}><h2 {...stylex.props(s.interestTitle)}>{tx("Special interest rate @1.99% p.a.")}</h2><p {...stylex.props(s.offerSubtitle)}>{tx("Unlock exclusive benefits for ENBD &amp; EIB customers")}</p><dl {...stylex.props(s.benefits)}>{[
        ['Low interest financing','1.99% for first year, then 2.99%, overall just 2.79%'],['For every Cars24 car','Available across all cars in the Cars24 app'],['30 day return','Return within 30 days if it doesn’t feel right'],['2 year premium care','Warranty and service contract are mandatory to avail this offer'],
      ].map(([title,copy])=><div key={title} {...stylex.props(s.benefit)}><dt {...stylex.props(s.benefitTitle)}>{tx(title)}</dt><dd {...stylex.props(s.offerSubtitle)}>{tx(copy)}</dd></div>)}</dl></div></div></>:<><header {...stylex.props(s.couponHeader)}><h2 {...stylex.props(s.couponTitle)}>{tx("Coupon Details")}</h2><button type="button" aria-label={tx("Close offer details")} onClick={()=>setOpen(null)} {...stylex.props(s.close)}><X size={23}/></button></header><div {...stylex.props(s.couponBody)}><h3 {...stylex.props(s.code)}>{tx("TRADEINCAR")}</h3><p {...stylex.props(s.couponDescription)}>{tx("Save ")}{tx(currency.code)} {tx(" 2000 on car exchange")}</p><h3 {...stylex.props(s.termsTitle)}>{tx("Terms and conditions")}</h3><div {...stylex.props(s.terms)}><span {...stylex.props(s.check)}><Check size={10} strokeWidth={2.5}/></span><p>{tx("- This coupon will become active as soon as you sell your car to Cars24")}<br/>{tx("- You can apply this at any time till full payment for the car that you want to buy")}<br/>{tx("- You can use this coupon within 60 days of selling your car to us")}</p></div></div></>}
    </section></div>:null}
  </>;
}
const s=stylex.create({
  banner:{position:'relative',display:'flex',alignItems:'center',gap:12,minHeight:78,marginTop:13,marginInline:{[media.mobile]:-22,default:0},padding:'14px 22px',color:'#202024',borderColor:'#dcf6ea',borderStyle:'solid',borderWidth:1,borderRadius:10,backgroundImage:'linear-gradient(100deg,#ddf8ec,#fff)'},
  icon:{flexShrink:0,width:32,height:32,objectFit:'contain'},
  copy:{minWidth:0},
  title:{fontFamily:$.fontDisplay,fontSize:13,fontWeight:400,lineHeight:'20px'},
  subtitle:{marginTop:3,color:'#535353',fontFamily:$.fontDisplay,fontSize:11,fontWeight:400,lineHeight:'18px'},
  link:{padding:0,color:'#202024',fontSize:11,fontWeight:600,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  lowInterest:{position:'absolute',top:5,right:20,display:'inline-flex',alignItems:'center',gap:2,padding:'1px 5px',color:'#fff',fontSize:8,fontWeight:600,lineHeight:'16px',borderRadius:'0 0 6px 6px',backgroundColor:'#fa5900'},
  unlock:{marginLeft:'auto',marginRight:33,padding:0,color:'#202024',fontSize:11,fontWeight:600,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  dots:{position:'absolute',right:15,bottom:7,display:'flex',alignItems:'center',gap:2},
  dotButton:{display:'grid',placeItems:'center',width:9,height:14,padding:0,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  dot:{width:4,height:4,borderRadius:3,backgroundColor:'#a1a1a1'},
  activeDot:{width:12,backgroundColor:'#202024'},
  backdrop:{position:'fixed',top:{[media.mobile]:51,default:0},right:0,bottom:0,left:0,zIndex:210,display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',backgroundColor:'rgba(0,0,0,.4)'},
  sheet:{position:'relative',width:'100%',maxWidth:600,maxHeight:'calc(100dvh - 100px)',color:'#202024',fontFamily:$.fontDisplay,borderRadius:'16px 16px 0 0',outlineStyle:'none',backgroundColor:'#fff'},
  interestSheet:{maxHeight:'calc(100dvh - 165px)',borderRadius:0},
  scroll:{maxHeight:'calc(100dvh - 165px)',overflowY:'auto',borderRadius:0},
  art:{display:'block',width:'100%',height:243,objectFit:'fill'},
  floatingClose:{position:'absolute',top:-66,right:26,display:'grid',placeItems:'center',width:40,height:40,padding:0,color:'#202024',borderWidth:0,borderRadius:'50%',backgroundColor:'#fff',cursor:'pointer'},
  interestBody:{padding:'20px 20px 51px'},
  interestTitle:{color:'#050505',fontSize:20,fontWeight:600,lineHeight:'30px'},
  offerSubtitle:{color:'#616161',fontSize:16,fontWeight:400,lineHeight:'24px'},
  benefits:{margin:'25px 0 0'},
  benefit:{marginTop:6},
  benefitTitle:{color:'#050505',fontSize:16,fontWeight:600,lineHeight:'24px'},
  couponHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',height:52,paddingInline:20,borderRadius:'16px 16px 0 0',backgroundColor:'#fafafa'},
  couponTitle:{fontSize:16,fontWeight:600,lineHeight:'24px'},
  close:{display:'grid',placeItems:'center',width:32,height:32,padding:0,color:'#f17100',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
  couponBody:{padding:'24px 22px 54px'},
  code:{fontSize:14,fontWeight:500,lineHeight:'21px',color:'#050505'},
  couponDescription:{marginTop:1,fontSize:12,lineHeight:'20px',color:'#535353'},
  termsTitle:{marginTop:30,fontSize:14,fontWeight:500,lineHeight:'22px',color:'#333'},
  terms:{fontFamily:'Roboto,Arial,sans-serif',display:'grid',gridTemplateColumns:'16px minmax(0,1fr)',alignItems:'center',gap:9,marginTop:11,color:'#777',fontSize:14,lineHeight:'20px'},
  check:{display:'grid',placeItems:'center',width:16,height:16,color:'#fff',borderRadius:'50%',backgroundColor:'#00bd71'},
});
