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
  banner: {display:'flex',alignItems:'center',position:'relative',isolation:'isolate',minHeight:{[media.mobile]:0,default:180},overflow:'hidden',borderRadius:20,fontFamily:$.fontSans,color:$.surface,backgroundColor:campaign.surface,outlineOffset:3},
  image: {position:'absolute',right:0,bottom:0,height:{[media.mobile]:'auto',default:'100%'},width:{[media.mobile]:'100%',default:'auto'},maxWidth:'none',maskImage:'linear-gradient(to right,transparent,#000 35%)'},
  copy: {position:'relative',zIndex:1,width:'100%',padding:18},
  title: {maxWidth:'75%',fontSize:{[media.mobile]:24,default:26},fontWeight:600,lineHeight:1.2,textWrap:'pretty'},
  description: {maxWidth:'65%',marginTop:8,color:campaign.muted,fontSize:15,lineHeight:1.4},
  action: {display:'inline-flex',alignItems:'center',gap:8,minHeight:44,marginTop:16,padding:'10px 18px',color:campaign.actionText,fontSize:16,fontWeight:500,lineHeight:1.4,borderRadius:30,backgroundColor:$.surface},
});
