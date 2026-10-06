'use client';

import {useCopy} from '@/lib/locale';
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Campaigns retain their card frame; landing heroes can meet the page edges. */
export default function ShowroomBannerFrame({children, inline = false, mobileCard = false}: {children: ReactNode; inline?: boolean; mobileCard?: boolean}) {
  const tx = useCopy();

  return <div data-inline-banner={inline || undefined} data-mobile-card-banner={mobileCard || undefined} {...stylex.props(s.wrap, inline && s.inlineWrap, mobileCard && s.mobileCardWrap)}><div {...stylex.props(s.frame, inline && s.inlineFrame, mobileCard && s.mobileCardFrame)}>{tx(children)}</div></div>;
}

const s = stylex.create({
  wrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 4, paddingBottom: {[media.mobile]: 0, default: 6}},
  frame: {isolation: 'isolate', overflow: 'hidden', borderRadius: 20},
  inlineWrap: {paddingInline: 0, paddingTop: 0, paddingBottom: 0},
  inlineFrame: {borderRadius: 0},
  mobileCardWrap: {paddingInline: {[media.mobile]: 12, default: 0}, paddingTop: {[media.mobile]: 4, default: 0}},
  mobileCardFrame: {borderRadius: {[media.mobile]: 20, default: 0}},
});
