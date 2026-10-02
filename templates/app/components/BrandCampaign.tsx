'use client';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {campaignTokens as theme} from '@/app/campaign-theme.stylex';
import {showroom} from '@/lib/showroom';
import {media} from '@/app/tokens.stylex';

type Kind = 'sell' | 'care' | 'finance';
const campaigns = {
  sell: {title: 'Your next chapter.', mobileTitle: 'Your next car.', copy: 'Sell or part-exchange with the showroom.', mobileCopy: 'Sell or exchange.', action: 'Start with a valuation', mobileAction: 'Get valuation', href: '/sell/details'},
  care: {title: 'A little care. A better drive.', mobileTitle: 'Car care.', copy: 'Maintenance, inspections and advice for the road ahead.', mobileCopy: 'Servicing and inspections.', action: 'Explore car care', mobileAction: 'View services', href: '/service/details'},
  finance: {title: 'Make the numbers work.', mobileTitle: 'Plan your budget.', copy: 'Explore deposits, payment terms and your next steps.', mobileCopy: 'Choose a deposit and term.', action: 'Discuss your options', mobileAction: 'Ask us', href: '/finance'},
} as const;

/** Original campaign compositions with readable, editable dealer copy. */
export default function BrandCampaign({kind, onAction}: {kind: Kind; onAction?: () => void}) {
  const tx = useCopy();

  const campaign = campaigns[kind];
  function copy(full: string, short: string) {return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;}
  return <section data-brand-campaign={kind} {...stylex.props(s.campaign, kind === 'finance' && s.wide)}>
    <Image src={showroom.artwork.campaigns[kind]} width={1080} height={kind === 'finance' ? 540 : 1080} alt={tx("")} sizes="(max-width:767px) 100vw, 680px" {...stylex.props(s.art)} />
    <div {...stylex.props(s.copy, kind === 'sell' && s.sellCopy, kind === 'finance' && s.financeCopy)}>
      {kind !== 'sell' ? <p {...stylex.props(s.brand)}>{tx(showroom.name)}{tx(kind === 'care' ? ' Car Care' : ' Finance')}</p> : null}
      <h2 {...stylex.props(s.title)}>{copy(campaign.title, campaign.mobileTitle)}</h2>
      <p {...stylex.props(s.description, kind === 'finance' && s.shortDescription)}>{copy(campaign.copy, campaign.mobileCopy)}</p>
      {onAction ? <button type="button" onClick={onAction} {...stylex.props(s.action)}>{copy(campaign.action, campaign.mobileAction)}<ArrowRight size={17} {...stylex.props(s.icon)}/></button> : <Link href={campaign.href} {...stylex.props(s.action)}>{copy(campaign.action, campaign.mobileAction)}<ArrowRight size={17} {...stylex.props(s.icon)}/></Link>}
    </div>
  </section>;
}
const s = stylex.create({
  campaign: {position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', width: '100%', aspectRatio: {[media.mobile]: 'auto', default: '1'}, minHeight: 350, maxWidth: 680, marginInline: 'auto', marginTop: 28, overflow: 'hidden', borderRadius: 20, color: '#fff', backgroundColor: theme.surface},
  wide: {aspectRatio: {[media.mobile]: 'auto', default: '2'}, minHeight: 220, maxWidth: 'none'},
  art: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  copy: {position: 'relative', zIndex: 1, padding: {[media.mobile]: 20, default: 32}},
  sellCopy: {marginTop: 'auto'},
  financeCopy: {padding: {[media.mobile]: 18, default: 28}},
  brand: {fontSize: 12, fontWeight: 600, letterSpacing: '.03em'},
  title: {maxWidth: 440, marginTop: 8, fontSize: {[media.mobile]: 23, default: 32}, fontWeight: 650, lineHeight: 1.12, letterSpacing: '-.025em', overflowWrap: 'anywhere'},
  description: {maxWidth: 350, marginTop: 9, color: theme.muted, fontSize: {[media.mobile]: 13, default: 16}, lineHeight: 1.4},
  shortDescription: {maxWidth: {[media.mobile]: '70%', default: '55%'}},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, maxWidth: '100%', marginTop: 16, padding: '10px 16px', color: theme.actionText, fontSize: 13, fontWeight: 600, lineHeight: 1.5, borderWidth: 0, borderRadius: 14, backgroundColor: '#fff', cursor: 'pointer'},
  icon: {flexShrink: 0},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
