'use client';

import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import {ArrowRight, ClipboardCheck, FileText, ShieldCheck} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {showroom} from '@/lib/showroom';
import {media} from '@/app/tokens.stylex';

export default function OwnershipPanel({informationPage = false}: {informationPage?: boolean}) {
  const tx = useCopy();

  return <section data-ownership-panel {...stylex.props(s.panel)}>
    <Image src={showroom.artwork.ownership} width={1536} height={1024} alt={tx("")} sizes="(max-width:767px) 100vw, 700px" {...stylex.props(s.art)}/>
    <div {...stylex.props(s.copy)}><p {...stylex.props(s.brand)}>{tx(showroom.name)}</p><h2 {...stylex.props(s.heading)}><span {...stylex.props(s.desktopCopy)}>{tx("Know your next car.")}</span><span {...stylex.props(s.mobileCopy)}>{tx("Get to know the car.")}</span></h2><ul {...stylex.props(s.items)}>{[[ClipboardCheck, 'Condition details'], [FileText, 'Service records'], [ShieldCheck, 'Ownership options']].map(([Icon, label]) => {const Symbol = Icon as typeof FileText; return <li key={String(label)} {...stylex.props(s.item)}><Symbol size={15} aria-hidden="true"/>{tx(String(label))}</li>;})}</ul><Link href={informationPage ? '/stores' : '/benefits/warranty'} {...stylex.props(s.action)}>{tx(informationPage ? 'Talk to the showroom' : 'Explore the details')}<ArrowRight size={15} aria-hidden="true"/></Link></div>
  </section>;
}
const s = stylex.create({
  panel: {position: 'relative', isolation: 'isolate', minHeight: {[media.mobile]: 250, default: 310}, marginBlock: 24, overflow: 'hidden', borderRadius: 20, color: '#fff', backgroundColor: campaign.ownershipSurface},
  art: {position: 'absolute', bottom: 0, right: 0, width: '100%', height: 'auto', maskImage: 'linear-gradient(to bottom,transparent,#000 18%)'},
  copy: {position: 'relative', zIndex: 1, padding: {[media.mobile]: 18, default: 28}},
  brand: {fontSize: 12, fontWeight: 600, color: campaign.ownershipMuted},
  heading: {maxWidth: '75%', marginTop: 6, fontSize: {[media.mobile]: 21, default: 30}, fontWeight: 600, lineHeight: 1.2, textWrap: 'balance'},
  items: {display: 'grid', justifyItems: 'start', gap: 8, margin: '16px 0 0', padding: 0, listStyle: 'none'},
  item: {display: 'flex', alignItems: 'center', gap: 6, padding: '6px 9px', fontSize: 12, borderRadius: 20, backgroundColor: campaign.ownershipChip},
  action: {display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, marginTop: 13, paddingInline: 12, color: campaign.actionText, fontSize: 12, fontWeight: 600, borderRadius: 13, backgroundColor: '#fff', outlineColor: '#fff'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
