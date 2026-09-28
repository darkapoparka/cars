'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import {dealer} from '@/lib/dealer-config';
import {useLocale} from '@/lib/locale';
import {browserPath} from '@/lib/paths';
import {tokens as $} from '@/app/tokens.stylex';
export default function MorePage() {
  const tx = useCopy();

  const locale = useLocale();
  return <div {...stylex.props(s.screen)}><PageHeader title={tx(dealer.name)}/>
    <div {...stylex.props(s.location)}><MenuImage name="location"/><span>{tx(dealer.city || dealer.country)}</span></div>
    <section><h2 {...stylex.props(s.activityTitle)}>{tx("Your showroom")}</h2><Link href="/saved" {...stylex.props(s.activityRow)}><MenuImage name="wishlist"/><span>{tx("Saved cars")}</span></Link><Link href="/cars" {...stylex.props(s.activityRow)}><MenuImage name="buy"/><span>{tx("Browse cars")}</span></Link></section>
    <section {...stylex.props(s.section)}><MenuLink href="/sell" icon="sell" title={tx("Sell or part-exchange")} copy={tx("Ask the dealer about your car")}/><MenuLink href="/finance" icon="finance" title={tx("Payment options")} copy={tx("Explore an example and ask about availability")}/><MenuLink href="/service" icon="service" title={tx("Vehicle services")} copy={tx("Confirm available services with the dealer")}/><MenuLink href="/stores" icon="location" title={tx("Visit showroom")} copy={tx(dealer.address || dealer.city)}/></section>
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.activityTitle)}>{tx("Language")}</h2><a href={browserPath('/more','en')} lang="en" hrefLang="en" aria-current={locale==='en'?'true':undefined} {...stylex.props(s.activityRow)}>{tx("English ")}{tx(locale==='en'?'✓':'')}</a><a href={browserPath('/more','bg')} lang="bg" hrefLang="bg" aria-current={locale==='bg'?'true':undefined} {...stylex.props(s.activityRow)}>{tx("Български ")}{tx(locale==='bg'?'✓':'')}</a></section>
    <section {...stylex.props(s.section)}><h2 {...stylex.props(s.activityTitle)}>{tx("Contact the dealer")}</h2>{dealer.phoneE164?<a href={'tel:'+dealer.phoneE164} {...stylex.props(s.activityRow)}>{tx(dealer.phoneDisplay)}</a>:null}{dealer.email?<a href={'mailto:'+dealer.email} {...stylex.props(s.activityRow)}>{tx(dealer.email)}</a>:null}<Link href="/stores" {...stylex.props(s.activityRow)}>{tx("Contact and location details")}</Link></section>
    <p {...stylex.props(s.notice)}>{tx(dealer.previewNotice)}</p>
  </div>;
}
function MenuImage({name}: {name:string}) {
  const tx = useCopy();
 return <img src={assetPath(`/reference-assets/menu-${name}.png`)} width={20} height={20} alt={tx("")} {...stylex.props(s.icon)}/>; }
function MenuLink({href, icon, title, copy}: {href:string; icon:string; title:string; copy:string}) {
  const tx = useCopy();
 return <Link href={href} {...stylex.props(s.serviceRow)}><MenuImage name={icon}/><span {...stylex.props(s.copy)}><span>{tx(title)}</span><span {...stylex.props(s.subtitle)}>{tx(copy)}</span></span></Link>; }
const s = stylex.create({
  screen:{maxWidth:$.content,minHeight:'100vh',marginInline:'auto',paddingTop:0,paddingBottom:100,color:$.ink,backgroundColor:'#fff',fontFamily:$.fontSans},
  location:{display:'flex',alignItems:'center',gap:9,minHeight:39,paddingInline:22,fontSize:13,fontWeight:400,backgroundColor:'#f8f8f8'},
  activityTitle:{minHeight:45,paddingTop:24,paddingInline:22,color:'#808080',fontSize:14,fontWeight:400,lineHeight:'21px'},
  activityRow:{display:'flex',alignItems:'center',gap:11,width:'100%',minHeight:52,paddingInline:22,color:$.ink,fontSize:14,fontWeight:500,lineHeight:'21px',textAlign:'left',overflowWrap:'anywhere',borderWidth:0,borderBottomColor:'#f1f1f1',borderBottomStyle:'solid',borderBottomWidth:1,backgroundColor:'#fff'},
  icon:{flexShrink:0,width:20,height:20,objectFit:'contain',filter:'grayscale(1)'},section:{borderTopColor:'#f6f6f6',borderTopStyle:'solid',borderTopWidth:11},
  serviceRow:{display:'flex',alignItems:'flex-start',gap:11,width:'100%',minHeight:72,paddingBlock:15,paddingInline:22,color:$.ink,fontSize:14,fontWeight:500,lineHeight:'21px',textAlign:'left',borderWidth:0,borderBottomColor:'#f1f1f1',borderBottomStyle:'solid',borderBottomWidth:1,backgroundColor:'#fff'},
  copy:{display:'flex',flexDirection:'column',minWidth:0},subtitle:{color:'#808080',fontWeight:400},notice:{padding:22,fontSize:12,lineHeight:1.6,color:'#71717a'},
});
