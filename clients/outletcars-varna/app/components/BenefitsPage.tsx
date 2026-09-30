'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import OwnershipPanel from '@/components/OwnershipPanel';
import {media, tokens as $} from '@/app/tokens.stylex';
export default function BenefitsPage({kind}: {kind:'returns'|'warranty'}) {
  const tx = useCopy();

 const title=kind==='warranty'?'Warranty information':'Return information';
 return <><PageHeader title={tx(title)} backHref="/cars" backLabel={tx("Back to cars")}/><main {...stylex.props(s.page)}><OwnershipPanel informationPage/><h2 {...stylex.props(s.heading)}><span {...stylex.props(s.desktopCopy)}>{tx("Know the details before you decide.")}</span><span {...stylex.props(s.mobileCopy)}>{tx("Before you decide.")}</span></h2><p {...stylex.props(s.copy)}>{tx("Ask the showroom about the policy for your chosen car. Coverage, eligibility, exclusions and any fees should be confirmed in writing before purchase.")}</p><p {...stylex.props(s.copy)}>{tx("This demo does not include a dealer warranty or return policy.")}</p><Link href="/stores" {...stylex.props(s.link)}>{tx("Visit showroom")}</Link></main></>;
}
const s=stylex.create({page:{maxWidth:720,marginInline:'auto',padding:'24px 16px'},heading:{fontSize:{[media.mobile]:22,default:26},fontWeight:600,lineHeight:1.2,textWrap:'balance'},copy:{marginTop:16,color:$.muted,fontSize:15,lineHeight:1.6},link:{display:'inline-flex',alignItems:'center',minHeight:44,marginTop:24,paddingInline:18,borderRadius:24,color:'#fff',backgroundColor:$.ink},desktopCopy:{display:{[media.mobile]:'none',default:'inline'}},mobileCopy:{display:{[media.mobile]:'inline',default:'none'}}});
