'use client';
import {useCopy} from '@/lib/locale';
import {useState,type FormEvent} from 'react';
import * as stylex from '@stylexjs/stylex';
import {X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {media,tokens as $} from '@/app/tokens.stylex';

export default function LoginSheet({open,onClose}: {open:boolean;onClose:()=>void}){
  const tx = useCopy();

 const [phone,setPhone]=useState('');
 const [whatsapp,setWhatsapp]=useState(true);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const panel=useModal(open,onClose);
 function submit(event:FormEvent){
  event.preventDefault();
  const normalized=phone.replace(/\D/g,'').replace(/^971/,'').replace(/^0/,'');
  if(!/^5\d{8}$/.test(normalized)){setError('Enter a valid UAE mobile number.');setNotice('');return;}
  setError('');setNotice('This local reference build is not connected to authentication. No OTP is sent and no credit check is performed.');
 }
 if(!open)return null;
 return <div {...stylex.props(s.backdrop)} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="login-title" {...stylex.props(s.sheet)}>
  <header {...stylex.props(s.header)}><h2 id="login-title" {...stylex.props(s.title)}>{tx("Login or sign up")}</h2><button type="button" aria-label={tx("Close login")} onClick={onClose} {...stylex.props(s.close)}><X size={23} strokeWidth={1.7}/></button></header>
  <form onSubmit={submit} noValidate {...stylex.props(s.body)}><label htmlFor="login-phone" {...stylex.props(s.label)}>{tx("Enter phone number ")}<span {...stylex.props(s.required)}>{tx("*")}</span></label>
   <div {...stylex.props(s.phoneRow)}><span {...stylex.props(s.country)}><svg aria-label={tx("United Arab Emirates")} role="img" width="16" height="16" viewBox="0 0 16 16"><defs><clipPath id="country-circle"><circle cx="8" cy="8" r="8"/></clipPath></defs><g clipPath="url(#country-circle)"><path fill="#16843b" d="M0 0h16v5.34H0Z"/><path fill="#fff" d="M0 5.33h16v5.34H0Z"/><path d="M0 10.66h16V16H0Z"/><path fill="#cf002b" d="M0 0h5v16H0Z"/></g></svg>{tx("+971")}</span><input id="login-phone" type="tel" inputMode="tel" autoComplete="tel-national" aria-invalid={!!error} aria-describedby={error?'phone-error':undefined} placeholder={tx("50 123 4567")} value={phone} onChange={e=>{setPhone(e.target.value);setError('');setNotice('');}} maxLength={16} {...stylex.props(s.input)}/></div>
   {error?<p id="phone-error" role="alert" {...stylex.props(s.error)}>{tx(error)}</p>:null}
   <label {...stylex.props(s.check)}><input type="checkbox" checked={whatsapp} onChange={e=>setWhatsapp(e.target.checked)}/><span>{tx("Get updates on ")}<span {...stylex.props(s.whatsapp)}>{tx("WhatsApp")}</span></span></label>
   <button type="submit" {...stylex.props(s.otp)}>{tx("Get OTP")}</button>
   {notice?<p role="status" {...stylex.props(s.notice)}>{tx(notice)}</p>:null}
   <p {...stylex.props(s.legal)}>{tx("This is a showroom demo. Read our ")}<button type="button" onClick={()=>setNotice('Showroom demo only. This interface does not create an account, send messages, or place bookings.')} {...stylex.props(s.legalLink)}>{tx("Terms of service")}</button> {tx(" &amp; ")}<button type="button" onClick={()=>setNotice('Your phone number stays in this browser form and is not transmitted. Saved cars are stored locally in your browser.')} {...stylex.props(s.legalLink)}>{tx("Privacy policy")}</button></p>
  </form>
 </div></div>;
}
const s=stylex.create({
 backdrop:{display:'flex',alignItems:{[media.mobile]:'flex-end',default:'center'},justifyContent:'center',position:'fixed',inset:0,zIndex:220,padding:{[media.mobile]:0,default:24},backgroundColor:'rgba(0,0,0,.4)'},
 sheet:{width:'100%',maxWidth:560,maxHeight:'92dvh',overflowY:'auto',color:$.text,borderRadius:{[media.mobile]:'24px 24px 0 0',default:24},backgroundColor:'#fff',outlineStyle:'none'},
 header:{display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:52,paddingInline:12,},
 title:{fontSize:18,fontWeight:500,lineHeight:'24px'},
 close:{display:'grid',placeItems:'center',width:24,height:34,padding:0,color:$.text,borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 body:{padding:'16px 12px 32px'},
 label:{display:'block',fontSize:15,fontWeight:400,lineHeight:'20px'},
 required:{color:'#a32d0d'},
 phoneRow:{display:'grid',gridTemplateColumns:'71px minmax(0,1fr)',gap:8,marginTop:8},
 country:{display:'flex',alignItems:'center',justifyContent:'center',gap:3,minHeight:40,fontSize:14,fontWeight:400,borderColor:'#d7d7d7',borderStyle:'solid',borderWidth:1,borderRadius:10},
 input:{minWidth:0,height:40,paddingInline:16,color:{default:$.ink,'::placeholder':'#cecece'},fontSize:14,borderColor:'#d7d7d7',borderStyle:'solid',borderWidth:1,borderRadius:10},
 check:{display:'grid',gridTemplateColumns:'16px minmax(0,1fr)',alignItems:'center',gap:8,marginTop:16,color:$.text,fontSize:13,fontWeight:400,lineHeight:'18px'},
 whatsapp:{color:'#0b6035'},
 otp:{width:'100%',minHeight:48,marginTop:16,color:'#fff',fontSize:18,fontWeight:500,lineHeight:'24px',borderWidth:0,borderRadius:14,backgroundColor:$.violet,cursor:'pointer'},
 legal:{marginTop:16,color:$.muted,fontSize:11,fontWeight:400,lineHeight:'16px',textAlign:'center'},
 legalLink:{padding:0,color:$.violet,fontSize:'inherit',textDecoration:'underline',borderWidth:0,backgroundColor:'transparent',cursor:'pointer'},
 error:{marginTop:6,color:'#b4241f',fontSize:12},
 notice:{marginTop:12,padding:12,color:'#535353',fontSize:13,lineHeight:1.5,borderRadius:9,backgroundColor:'#f6f6f6'},
});
