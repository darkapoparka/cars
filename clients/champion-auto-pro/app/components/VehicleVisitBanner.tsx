'use client';

import * as stylex from '@stylexjs/stylex';
import {ArrowUpRight} from 'lucide-react';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function VehicleVisitBanner() {
  const tx = useCopy();
  return <Link href={showroom.locationHref} aria-label={tx('See it in person — visit showroom')} data-vehicle-visit-banner {...stylex.props(s.banner)}>
    <Image src={showroom.artwork.highlights.visit} alt="" width={1672} height={941} sizes="(max-width:767px) 100vw, 824px" {...stylex.props(s.image)}/>
    <div {...stylex.props(s.copy)}>
      <h2 {...stylex.props(s.title)}>{tx('See it in person')}</h2>
      <p {...stylex.props(s.description)}>{tx('See the car in person.')}</p>
      <span {...stylex.props(s.action)}>{tx('Visit showroom')}<ArrowUpRight size={16} aria-hidden="true"/></span>
    </div>
  </Link>;
}

const s = stylex.create({
  banner: {display:'flex',alignItems:'center',position:'relative',isolation:'isolate',minHeight:{[media.mobile]:140,default:180},overflow:'hidden',borderRadius:20,fontFamily:$.fontSans,color:$.surface,backgroundColor:campaign.surface,outlineOffset:3},
  image: {position:'absolute',right:0,bottom:0,height:'100%',width:'auto',maxWidth:'none',maskImage:'linear-gradient(to right,transparent,#000 35%)'},
  copy: {position:'relative',zIndex:1,width:'100%',padding:16},
  title: {maxWidth:'70%',fontSize:{[media.mobile]:20,default:26},fontWeight:600,lineHeight:1.2,textWrap:'balance'},
  description: {maxWidth:'62%',marginTop:6,color:campaign.muted,fontSize:13,lineHeight:'19px'},
  action: {display:'inline-flex',alignItems:'center',gap:6,minHeight:36,marginTop:10,padding:'6px 12px',color:campaign.actionText,fontSize:13,fontWeight:600,lineHeight:'20px',borderRadius:10,backgroundColor:$.surface},
});
