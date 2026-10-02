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
import {typography as t} from '@/app/typography.stylex';

type Props = {
  title: string;
  mobileTitle?: string;
  description: string;
  mobileDescription?: string;
  mobileAction?: string;
  image: string;
  colourful?: boolean;
  opensDialog?: boolean;
  containArtwork?: boolean;
} & ({action: string; href: string; onClick?: never} | {action: string; href?: never; onClick: () => void} | {action?: never; href?: never; onClick?: never});

/** Shared content-sized composition for every showroom hero and artwork theme. */
export default function ShowroomBanner({title, mobileTitle, description, mobileDescription, action, mobileAction, image, href, onClick, colourful = false, opensDialog = false, containArtwork = false}: Props) {
  const tx = useCopy();

  return <ShowroomBannerFrame><section data-showroom-banner {...stylex.props(s.banner, !action && s.staticBanner, colourful && s.colourful)}>
    {!colourful && image !== showroom.promotion.image ? <Image src={showroom.promotion.image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image)} /> : null}
    <Image src={image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image, colourful && s.colourImage, containArtwork && s.containedImage)} />
    <div {...stylex.props(s.copy)}>
      <h1 {...stylex.props(s.title, !action && s.staticTitle, t.hero)}><span {...stylex.props(Boolean(mobileTitle) && s.desktopCopy)}>{tx(title)}</span>{mobileTitle ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileTitle)}</span> : null}</h1>
      <p {...stylex.props(s.description, t.body, colourful && s.colourDescription)}><span {...stylex.props(Boolean(mobileDescription) && s.desktopCopy)}>{tx(description)}</span>{mobileDescription ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileDescription)}</span> : null}</p>
      {action ? href ? <Link href={href} aria-label={tx(action)} {...stylex.props(s.action, t.control, colourful && s.colourAction)}><span {...stylex.props(Boolean(mobileAction) && s.desktopCopy)}>{tx(action)}</span>{mobileAction ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileAction)}</span> : null}<ArrowRight size={16} aria-hidden="true" /></Link> : <button type="button" onClick={onClick} aria-label={tx(action)} aria-haspopup={opensDialog ? 'dialog' : undefined} {...stylex.props(s.action, t.control, colourful && s.colourAction)}><span {...stylex.props(Boolean(mobileAction) && s.desktopCopy)}>{tx(action)}</span>{mobileAction ? <span {...stylex.props(s.mobileCopy)}>{tx(mobileAction)}</span> : null}<ArrowRight size={16} aria-hidden="true" /></button> : null}
    </div>
  </section></ShowroomBannerFrame>;
}

const s = stylex.create({
  colourful: {color: '#fff', backgroundColor: campaign.surface},
  colourImage: {width: '100%', height: {[media.mobile]: 'auto', default: '100%'}, objectFit: 'cover', objectPosition: {[media.mobile]: 'right bottom', default: 'right 32%'}, maskImage: {[media.mobile]: 'linear-gradient(to right,transparent,#000 8%),linear-gradient(to bottom,transparent,#000 25%)', default: 'linear-gradient(to right,transparent,#000 8%)'}},
  containedImage: {width: {[media.mobile]: '100%', default: 'auto'}, height: {[media.mobile]: 'auto', default: '100%'}, objectFit: 'contain', objectPosition: 'right bottom'},
  colourDescription: {color: campaign.muted, maxWidth: {[media.mobile]: '65%', default: 280}},
  colourAction: {color: campaign.actionText, backgroundColor: '#fff'},
  banner: {position: 'relative', isolation: 'isolate', display: 'flex', alignItems: 'center', minHeight: {[media.mobile]: 0, [media.tablet]: 232, default: 248}, padding: {[media.mobile]: $.bannerPadding, [media.tablet]: 28, default: '28px 36px'}, overflow: 'hidden', color: $.ink, backgroundColor: $.bannerSurface},
  staticBanner: {minHeight: {[media.mobile]: 160, [media.tablet]: 232, default: 248}},
  copy: {position: 'relative', zIndex: 1, width: {[media.mobile]: '100%', default: '65%'}, minWidth: 0},
  image: {position: 'absolute', right: 0, bottom: 0, width: {[media.mobile]: '92%', default: 'auto'}, maxWidth: 'none', height: {[media.mobile]: 'auto', default: '100%'}, pointerEvents: 'none', maskImage: 'linear-gradient(to right,transparent,#000 22%),linear-gradient(to bottom,transparent,#000 20%)', maskComposite: 'intersect'},
  title: {maxWidth: {[media.mobile]: '85%', default: '100%'}, textWrap: 'pretty'},
  staticTitle: {maxWidth: {[media.mobile]: '65%', default: '100%'}},
  description: {maxWidth: {[media.mobile]: '65%', default: 280}, marginTop: {[media.mobile]: 8, default: 12}, whiteSpace: 'pre-line', color: $.bannerMuted},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: $.controlHeight, marginTop: 16, paddingInline: 18, color: '#fff', whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 30, backgroundColor: $.ink, cursor: 'pointer', outlineColor: '#fff'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
