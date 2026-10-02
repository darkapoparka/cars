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
  const promotion = showroom.inventoryPromotion;

  return <div {...stylex.props(s.wrap)}><Link href={showroom.locationHref} aria-label={tx("Visit the showroom — plan your visit")} data-inventory-promotion {...stylex.props(s.panel)}>
    <Image src={showroom.artwork.highlights.visit} alt={tx("")} width={1672} height={941} sizes="(max-width: 767px) 360px, 600px" priority {...stylex.props(s.image)}/>
    <div {...stylex.props(s.copy)}><h2 {...stylex.props(s.title)}>{tx(promotion.title)}</h2><p {...stylex.props(s.description)}><span {...stylex.props(s.desktopCopy)}>{tx(promotion.description)}</span><span {...stylex.props(s.mobileCopy)}>{tx(promotion.mobileDescription)}</span></p><span {...stylex.props(s.link)}><span {...stylex.props(s.desktopCopy)}>{tx(promotion.action)}</span><span {...stylex.props(s.mobileCopy)}>{tx(promotion.mobileAction)}</span><ArrowUpRight size={14} aria-hidden="true"/></span></div>
  </Link></div>;
}
const s = stylex.create({
  wrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 14, paddingBottom: 4},
  panel: {display: 'flex', alignItems: 'center', position: 'relative', isolation: 'isolate', minHeight: {[media.mobile]: 0, default: 180}, overflow: 'hidden', borderRadius: 20, backgroundColor: campaign.surface},
  image: {position: 'absolute', right: 0, bottom: 0, height: {[media.mobile]: 'auto', default: '100%'}, width: {[media.mobile]: '100%', default: 'auto'}, maxWidth: 'none', maskImage: 'linear-gradient(to right,transparent,#000 30%)'},
  copy: {position: 'relative', zIndex: 1, padding: 18, width: '100%'},
  title: {maxWidth: '75%', color: '#fff', fontSize: {[media.mobile]: 24, default: 26}, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.2},
  description: {marginTop: 8, maxWidth: {[media.mobile]: '65%', default: '51%'}, color: campaign.muted, fontSize: 15, lineHeight: 1.4},
  link: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, paddingInline: 18, marginTop: 16, borderRadius: 30, backgroundColor: '#fff', fontSize: 16, color: campaign.actionText, fontWeight: 500, whiteSpace: 'nowrap'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
