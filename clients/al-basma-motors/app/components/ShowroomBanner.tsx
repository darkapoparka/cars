'use client';

import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {desktopHero, geometry} from '@/components/desktop-hero.stylex';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {assetPath} from '@/lib/paths';
import {media, tokens as $} from '@/app/tokens.stylex';

type Props = {
  title: string;
  description?: string;
  control?: ReactNode;
  compact?: boolean;
};

/** Every desktop journey shares the same heading, control and supporting-note space. */
export default function ShowroomBanner({title, description, control, compact = false}: Props) {
  const tx = useCopy();

  return <div {...stylex.props(s.frame)}>
    <section data-showroom-banner aria-label={tx(title)} {...stylex.props(s.banner, compact && s.compactBanner)}>
      <div aria-hidden="true" {...stylex.props(s.backdrop(`url("${assetPath(showroom.desktopHeroArtwork)}")`))}/>
      <div aria-hidden="true" {...stylex.props(s.shade)}/>
      <div {...stylex.props(s.content, desktopHero.container)}>
        <div data-hero-heading {...stylex.props(s.heading)}>
          <h1 {...stylex.props(s.title)}>{tx(title)}</h1>
          {description ? <p {...stylex.props(s.description)}>{tx(description)}</p> : null}
        </div>
        {control != null ? <div data-hero-control {...stylex.props(s.control)}>{control}</div> : null}
      </div>
    </section>
  </div>;
}

/** Reserve the desktop hero before client-only search state is available. */
export function ShowroomBannerSkeleton(props: Omit<Props, 'control'>) {
  return <ShowroomBanner {...props} control={<div aria-hidden="true" {...stylex.props(s.placeholder)}/>}/>;
}

const s = stylex.create({
  frame: {display: {[media.desktop]: 'block', default: 'none'}, maxWidth: $.content, marginInline: 'auto', padding: '16px 28px 20px'},
  banner: {
    display: {[media.desktop]: 'block', default: 'none'},
    position: 'relative',
    isolation: 'isolate',
    minHeight: geometry.height,
    padding: '80px 28px 60px',
    overflow: 'hidden',
    borderRadius: 24,
    color: '#fff',
    backgroundColor: '#202023',
    fontFamily: $.fontSans,
  },
  compactBanner: {display: {[media.desktop]: 'grid', default: 'none'}, alignItems: 'center', minHeight: 240, padding: '56px 28px'},
  backdrop: (image: string) => ({position: 'absolute', inset: 0, backgroundImage: image, backgroundSize: 'cover', backgroundPosition: 'right 58%', pointerEvents: 'none'}),
  shade: {position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(180deg, #202023 0%, rgba(32,32,35,.15) 32%, rgba(32,32,35,.1) 100%), linear-gradient(90deg, rgba(17,18,20,.45) 0%, rgba(17,18,20,.35) 65%, rgba(17,18,20,.08) 100%)', pointerEvents: 'none'},
  content: {position: 'relative'},
  heading: {minHeight: 56, textAlign: 'center'},
  title: {margin: 0, fontSize: 48, fontWeight: 600, lineHeight: '56px', letterSpacing: '-.025em', textWrap: 'balance'},
  description: {marginTop: 10, fontSize: 16, lineHeight: '24px', color: '#eeeef0'},
  control: {minHeight: 112, marginTop: 24, textAlign: 'left'},
  placeholder: {minHeight: geometry.barHeight, borderRadius: 9999, backgroundColor: '#fff'},
});
