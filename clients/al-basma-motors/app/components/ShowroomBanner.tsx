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
  description: string;
  action: string;
  image: string;
  colourful?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** Shared fixed composition for every showroom hero and artwork theme. */
export default function ShowroomBanner({title, description, action, image, href, onClick, colourful = false}: Props) {
  const tx = useCopy();

  return <ShowroomBannerFrame><section data-showroom-banner {...stylex.props(s.banner, colourful && s.colourful)}>
    {!colourful && image !== showroom.promotion.image ? <Image src={showroom.promotion.image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image)} /> : null}
    <Image src={image} alt={tx("")} width={1774} height={887} sizes="(max-width: 767px) 100vw, 600px" priority {...stylex.props(s.image, colourful && s.colourImage)} />
    <div {...stylex.props(s.copy)}>
      <h1 {...stylex.props(s.title)}>{tx(title)}</h1>
      <p {...stylex.props(s.description, colourful && s.colourDescription)}>{tx(description)}</p>
      {href ? <Link href={href} {...stylex.props(s.action, colourful && s.colourAction)}>{tx(action)}<ArrowRight size={16} aria-hidden="true" /></Link> : <button type="button" onClick={onClick} {...stylex.props(s.action, colourful && s.colourAction)}>{tx(action)}<ArrowRight size={16} aria-hidden="true" /></button>}
    </div>
  </section></ShowroomBannerFrame>;
}

const s = stylex.create({
  colourful: {color: '#fff', backgroundColor: campaign.surface},
  colourImage: {width: {[media.mobile]: '100%', default: 'auto'}, height: '100%', objectFit: 'cover', objectPosition: 'right center', maskImage: 'linear-gradient(to right,transparent,#000 8%),linear-gradient(to bottom,transparent 15%,#000 50%)'},
  colourDescription: {color: campaign.muted, maxWidth: {[media.mobile]: '51%', default: 280}},
  colourAction: {color: campaign.actionText, backgroundColor: '#fff'},
  banner: {position: 'relative', isolation: 'isolate', display: 'flex', alignItems: 'center', minHeight: {[media.mobile]: 180, [media.tablet]: 276, default: 300}, padding: {[media.mobile]: 16, [media.tablet]: 28, default: '32px 40px'}, overflow: 'hidden', color: $.ink, backgroundColor: $.bannerSurface},
  copy: {position: 'relative', zIndex: 1, width: {[media.mobile]: '100%', default: '65%'}, minWidth: 0},
  image: {position: 'absolute', right: 0, bottom: 0, width: {[media.mobile]: '92%', default: 'auto'}, maxWidth: 'none', height: {[media.mobile]: 'auto', default: '100%'}, pointerEvents: 'none', maskImage: 'linear-gradient(to right,transparent,#000 22%),linear-gradient(to bottom,transparent,#000 20%)', maskComposite: 'intersect'},
  title: {fontSize: {[media.mobile]: 'clamp(20px,5.6vw,24px)', [media.tablet]: 28, default: 36}, fontWeight: 600, lineHeight: 1.12, letterSpacing: '-.035em'},
  description: {minHeight: {[media.mobile]: 34, default: 46}, maxWidth: {[media.mobile]: '58%', default: 280}, marginTop: {[media.mobile]: 8, default: 12}, fontSize: {[media.mobile]: 12, default: 16}, fontWeight: 400, lineHeight: 1.4, color: $.bannerMuted},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, marginTop: {[media.mobile]: 12, default: 16}, paddingInline: {[media.mobile]: 12, default: 18}, color: '#fff', fontSize: {[media.mobile]: 12, default: 14}, fontWeight: 600, whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 30, backgroundColor: $.ink, cursor: 'pointer'},
});
