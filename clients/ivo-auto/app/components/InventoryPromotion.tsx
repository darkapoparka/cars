'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import {ArrowUpRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';

export default function InventoryPromotion() {
  const tx = useCopy();

  return <div {...stylex.props(s.wrap)}><Link href={showroom.locationHref} aria-label={tx("Visit the showroom — plan your visit")} data-inventory-promotion {...stylex.props(s.panel)}>
    <Image src={showroom.artwork.highlights.visit} alt={tx("")} width={1672} height={941} sizes="(max-width: 767px) 360px, 600px" {...stylex.props(s.image)}/>
    <div {...stylex.props(s.copy)}><h2 {...stylex.props(s.title)}>{tx("See it up close.")}</h2><p {...stylex.props(s.description)}>{tx("Take a closer look at your next car.")}</p><span {...stylex.props(s.link)}>{tx("Plan your visit ")}<ArrowUpRight size={14} aria-hidden="true"/></span></div>
  </Link></div>;
}
const s = stylex.create({
  wrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 14, paddingBottom: 4},
  panel: {display: 'flex', alignItems: 'center', position: 'relative', isolation: 'isolate', minHeight: {[media.mobile]: 160, default: 180}, overflow: 'hidden', borderRadius: 20, backgroundColor: campaign.surface},
  image: {position: 'absolute', right: 0, bottom: 0, height: '100%', width: 'auto', maxWidth: 'none', maskImage: 'linear-gradient(to right,transparent,#000 30%)'},
  copy: {position: 'relative', zIndex: 1, padding: 16, width: '100%'},
  title: {color: '#fff', fontSize: {[media.mobile]: 20, default: 26}, fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.2},
  description: {marginTop: 7, maxWidth: '51%', color: campaign.muted, fontSize: {[media.mobile]: 12, default: 14}, lineHeight: 1.45},
  link: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 32, paddingInline: 11, marginTop: 12, borderRadius: 30, backgroundColor: '#fff', fontSize: 11, color: campaign.actionText, fontWeight: 600, whiteSpace: 'nowrap'},
});
