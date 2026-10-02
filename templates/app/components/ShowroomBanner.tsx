'use client';

import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import ShowroomBannerFrame from '@/components/ShowroomBannerFrame';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';

type Props = {
  title: string;
  mobileTitle?: string;
  description: string;
  mobileDescription?: string;
  action: string;
  mobileAction?: string;
  image: string;
  colourful?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** Shared content-sized composition for every showroom hero and artwork theme. */
export default function ShowroomBanner({title, mobileTitle, description, mobileDescription, action, mobileAction, image, href, onClick, colourful = false}: Props) {
  const tx = useCopy();

  return <ShowroomBannerFrame><section data-showroom-banner {...stylex.props(s.banner, colourful && s.colourful)}>
    {!colourful && image !== showroom.promotion.image ? <Image src={showroom.promotion.image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image)} /> : null}
    <Image src={image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image, colourful && s.colourImage)} />
    <div {...stylex.props(s.copy)}>
      <h1 {...stylex.props(s.title)}><span {...stylex.props(Boolean(mobileTitle) && s.desktopCopy)}>{tx(title)}</span>{mobileTitle ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileTitle)}</span> : null}</h1>
      <p {...stylex.props(s.description, colourful && s.colourDescription)}><span {...stylex.props(Boolean(mobileDescription) && s.desktopCopy)}>{tx(description)}</span>{mobileDescription ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileDescription)}</span> : null}</p>
      {href ? <Link href={href} aria-label={tx(action)} {...stylex.props(s.action, colourful && s.colourAction)}><span {...stylex.props(Boolean(mobileAction) && s.desktopCopy)}>{tx(action)}</span>{mobileAction ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileAction)}</span> : null}<ArrowRight size={16} aria-hidden="true" /></Link> : <button type="button" onClick={onClick} aria-label={tx(action)} {...stylex.props(s.action, colourful && s.colourAction)}><span {...stylex.props(Boolean(mobileAction) && s.desktopCopy)}>{tx(action)}</span>{mobileAction ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileAction)}</span> : null}<ArrowRight size={16} aria-hidden="true" /></button>}
    </div>
  </section></ShowroomBannerFrame>;
}

const s = stylex.create({
  colourful: {color: '#fff', backgroundColor: campaign.surface},
  colourImage: {width: '100%', height: {[media.mobile]: 'auto', default: '100%'}, objectFit: 'cover', objectPosition: {[media.mobile]: 'right bottom', default: 'right 32%'}, maskImage: {[media.mobile]: 'linear-gradient(to right,transparent,#000 8%),linear-gradient(to bottom,transparent,#000 25%)', default: 'linear-gradient(to right,transparent,#000 8%)'}},
  colourDescription: {color: campaign.muted, maxWidth: {[media.mobile]: '65%', default: 280}},
  colourAction: {color: campaign.actionText, backgroundColor: '#fff'},
  banner: {position: 'relative', isolation: 'isolate', display: 'flex', alignItems: 'center', minHeight: {[media.mobile]: 0, [media.tablet]: 232, default: 248}, padding: {[media.mobile]: $.bannerPadding, [media.tablet]: 28, default: '28px 36px'}, overflow: 'hidden', color: $.ink, backgroundColor: $.bannerSurface},
  copy: {position: 'relative', zIndex: 1, width: {[media.mobile]: '100%', default: '65%'}, minWidth: 0},
  image: {position: 'absolute', right: 0, bottom: 0, width: {[media.mobile]: '92%', default: 'auto'}, maxWidth: 'none', height: {[media.mobile]: 'auto', default: '100%'}, pointerEvents: 'none', maskImage: 'linear-gradient(to right,transparent,#000 22%),linear-gradient(to bottom,transparent,#000 20%)', maskComposite: 'intersect'},
  title: {maxWidth: {[media.mobile]: '85%', default: '100%'}, fontSize: {[media.mobile]: $.bannerTitleSize, [media.tablet]: 30, default: 36}, fontWeight: 600, lineHeight: {[media.mobile]: $.bannerTitleLineHeight, default: 1.2}, letterSpacing: '-.02em', textWrap: 'pretty'},
  description: {maxWidth: {[media.mobile]: '65%', default: 280}, marginTop: {[media.mobile]: 8, default: 12}, fontSize: {[media.mobile]: $.bannerCopySize, default: 16}, fontWeight: 400, lineHeight: {[media.mobile]: $.bannerCopyLineHeight, default: 1.45}, whiteSpace: 'pre-line', color: $.bannerMuted},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: $.controlHeight, marginTop: 16, paddingInline: 18, color: '#fff', fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 30, backgroundColor: $.ink, cursor: 'pointer', outlineColor: '#fff'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
