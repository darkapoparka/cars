'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import {ArrowUpRight, MapPin, Phone, Mail} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {media, tokens as $} from '@/app/tokens.stylex';
export default function StoresClient() {
  const tx = useCopy();

  return <><PageHeader title={tx("Visit showroom")}/><main {...stylex.props(s.page)}>
    <section {...stylex.props(s.hero)}><Image src={showroom.locationImage} alt={tx("Illustrative showroom artwork")} width={1774} height={887} sizes="(max-width:767px) 100vw, 900px" priority {...stylex.props(s.image)}/><div {...stylex.props(s.copy)}><p {...stylex.props(s.eyebrow)}>{tx(dealer.name)}</p><h2 {...stylex.props(s.title)}><span {...stylex.props(s.desktopTitle)}>{tx("Meet your")}<br/>{tx("next car.")}</span><span {...stylex.props(s.mobileTitle)}>{tx("Your next car.")}</span></h2></div></section>
    <section {...stylex.props(s.info)}><MapPin size={24}/><div><h2 {...stylex.props(s.heading)}>{tx(dealer.name)}</h2><address {...stylex.props(s.text)}>{tx(dealer.address || dealer.city || 'Contact details are not configured for this template.')}</address><p {...stylex.props(s.note)}>{tx("Arrange a suitable time before travelling. Confirm the exact location and availability with the dealer.")}</p></div></section>
    <div {...stylex.props(s.contactGrid)}>
      {dealer.phoneE164 ? <a href={'tel:' + dealer.phoneE164} {...stylex.props(s.contact)}><Phone size={19}/><span>{tx(dealer.phoneDisplay)}</span></a> : null}
      {dealer.email ? <a href={'mailto:' + dealer.email} {...stylex.props(s.contact)}><Mail size={19}/><span>{tx(dealer.email)}</span></a> : null}
      {dealer.mapsUrl ? <a href={dealer.mapsUrl} target="_blank" rel="noopener noreferrer" {...stylex.props(s.contact)}><MapPin size={19}/><span>{tx("Open directions")}</span><ArrowUpRight size={16}/></a> : null}
    </div>
    {dealer.services.length ? <section {...stylex.props(s.info)}><div><h2 {...stylex.props(s.heading)}>{tx("Dealer services")}</h2><ul {...stylex.props(s.services)}>{dealer.services.map(service => <li key={service}>{tx(service)}</li>)}</ul></div></section> : null}
    <Link href="/cars" {...stylex.props(s.action)}>{tx("Explore our cars ")}<ArrowUpRight size={18}/></Link>
    <p {...stylex.props(s.note)}>{tx(dealer.previewNotice)}</p><p {...stylex.props(s.note)}>{tx(dealer.inventoryNotice)}</p>
  </main></>;
}
const s = stylex.create({
  page:{maxWidth:$.content,marginInline:'auto',paddingInline:{[media.mobile]:12,default:28},paddingBottom:48},hero:{position:'relative',overflow:'hidden',borderRadius:20,backgroundColor:$.bannerSurface},image:{width:'100%',height:{[media.desktop]:360,default:'auto'},objectFit:{[media.desktop]:'cover',default:'fill'},objectPosition:{[media.desktop]:'center 70%',default:'center'}},copy:{position:'absolute',left:{[media.mobile]:12,default:20},top:{[media.mobile]:12,default:20},maxWidth:{[media.mobile]:'62%',default:'none'},padding:{[media.mobile]:8,default:0},borderRadius:10,backgroundColor:{[media.mobile]:'rgba(255,255,255,.88)',default:'transparent'}},eyebrow:{fontSize:12,color:$.muted},title:{fontSize:{[media.mobile]:20,default:32},lineHeight:1.15,letterSpacing:'-.025em',marginTop:8},desktopTitle:{display:{[media.mobile]:'none',default:'inline'}},mobileTitle:{display:{[media.mobile]:'inline',default:'none'}},
  info:{display:'flex',gap:16,marginTop:24,padding:20,borderRadius:20,backgroundColor:'#f5f5f6'},heading:{fontSize:18,fontWeight:600},text:{marginTop:8,fontSize:14,fontStyle:'normal',color:$.muted,lineHeight:1.5},note:{marginTop:14,fontSize:12,color:$.muted,lineHeight:1.6},action:{display:'flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:48,marginTop:18,paddingInline:20,color:'#fff',fontSize:14,fontWeight:600,borderRadius:24,backgroundColor:$.ink},
  contactGrid:{display:'grid',gap:10,marginTop:16},contact:{display:'flex',alignItems:'center',gap:10,minHeight:48,padding:'12px 16px',fontSize:14,color:$.ink,overflowWrap:'anywhere',borderRadius:12,backgroundColor:'#f4f4f5'},services:{margin:'12px 0 0',paddingLeft:18,fontSize:14,color:$.muted,lineHeight:1.8},
});
