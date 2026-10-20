'use client';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {campaignTokens as theme} from '@/app/campaign-theme.stylex';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

type Kind = 'sell' | 'care' | 'finance';
const campaigns = {
  sell: {title: 'Your next chapter.', mobileTitle: 'Your next car.', copy: 'Sell or part-exchange with the showroom.', mobileCopy: 'Sell or exchange.', action: 'Start with a valuation', mobileAction: 'Get valuation', href: '/sell/details'},
  care: {title: 'A little care. A better drive.', mobileTitle: 'Car care.', copy: 'Maintenance, inspections and advice for the road ahead.', mobileCopy: 'Servicing and inspections.', action: 'Explore car care', mobileAction: 'View services', href: '/service/details'},
  finance: {title: 'Need a hand?', mobileTitle: 'Need a hand?', copy: 'Help with your car and finance options.', mobileCopy: 'Let’s talk finance.', action: 'Ask us', mobileAction: 'Ask us', href: '/finance'},
} as const;

/** Original campaign compositions with readable, editable dealer copy. */
export default function BrandCampaign({kind, onAction, image}: {kind: Kind; onAction?: () => void; image?: string}) {
  const tx = useCopy();

  const campaign = campaigns[kind];
  function copy(full: string, short: string) {return <><span {...stylex.props(s.desktopCopy)}>{tx(full)}</span><span {...stylex.props(s.mobileCopy)}>{tx(short)}</span></>;}
  return <section data-brand-campaign={kind} {...stylex.props(s.campaign, kind === 'finance' && s.wide, kind === 'care' && s.care)}>
    <Image src={image ?? showroom.artwork.campaigns[kind]} width={1080} height={kind === 'finance' ? 540 : 1080} alt={tx("")} sizes="(max-width:767px) 100vw, 680px" {...stylex.props(s.art, kind === 'care' && s.careArt, kind === 'finance' && s.financeArt)} />
    <div {...stylex.props(s.copy, kind === 'sell' && s.sellCopy, kind === 'finance' && s.financeCopy, kind === 'care' && s.careCopy)}>
      <h2 {...stylex.props(s.title, t.heading, kind !== 'sell' && s.titleAtTop)}>{kind === 'care' ? tx(campaign.mobileTitle) : copy(campaign.title, campaign.mobileTitle)}</h2>
      <p {...stylex.props(s.description, t.body, kind === 'finance' && s.shortDescription)}>{kind === 'care' ? tx(campaign.mobileCopy) : copy(campaign.copy, campaign.mobileCopy)}</p>
      {onAction ? <button type="button" onClick={onAction} {...stylex.props(s.action, t.control)}>{kind !== 'sell' ? tx(campaign.mobileAction) : copy(campaign.action, campaign.mobileAction)}<ArrowRight size={17} {...stylex.props(s.icon)}/></button> : <Link href={campaign.href} {...stylex.props(s.action, t.control)}>{kind !== 'sell' ? tx(campaign.mobileAction) : copy(campaign.action, campaign.mobileAction)}<ArrowRight size={17} {...stylex.props(s.icon)}/></Link>}
    </div>
  </section>;
}
const s = stylex.create({
  campaign: {position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', width: '100%', aspectRatio: '1', minHeight: {[media.mobile]: 0, default: 350}, maxWidth: 680, marginInline: 'auto', marginTop: {[media.mobile]: $.mobileSectionGap, default: 28}, overflow: 'hidden', borderRadius: 20, color: '#fff', backgroundColor: theme.surface},
  wide: {aspectRatio: 'auto', minHeight: 0, maxWidth: 'none'},
  care: {aspectRatio: 'auto', minHeight: 0, maxWidth: 'none'},
  art: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  careArt: {top: 'auto', left: 'auto', right: 0, bottom: 0, width: 'auto', height: {[media.mobile]: '125%', default: '170%'}, objectFit: 'contain', maskImage: 'linear-gradient(to right,transparent,#000 52%)'},
  financeArt: {left: 'auto', width: 'auto', objectFit: 'contain', maskImage: 'linear-gradient(to right,transparent,#000 32%)'},
  copy: {position: 'relative', zIndex: 1, padding: {[media.mobile]: 20, default: 32}},
  sellCopy: {marginTop: 'auto'},
  financeCopy: {padding: {[media.mobile]: 18, default: 28}},
  careCopy: {width: {[media.mobile]: '100%', default: '65%'}, padding: {[media.mobile]: 20, default: 28}},
  titleAtTop: {marginTop: 0},
  title: {maxWidth: 440, marginTop: 8, textWrap: 'pretty'},
  description: {maxWidth: 350, marginTop: 9, color: theme.muted},
  shortDescription: {maxWidth: {[media.mobile]: '70%', default: '55%'}},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, maxWidth: '100%', marginTop: 16, padding: '10px 18px', color: theme.actionText, borderWidth: 0, borderRadius: 30, backgroundColor: '#fff', cursor: 'pointer'},
  icon: {flexShrink: 0},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
