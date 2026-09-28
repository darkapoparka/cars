'use client';

import {useCopy} from '@/lib/locale';
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared gutters and clipping for every showroom landing banner. */
export default function ShowroomBannerFrame({children}: {children: ReactNode}) {
  const tx = useCopy();

  return <div {...stylex.props(s.wrap)}><div {...stylex.props(s.frame)}>{tx(children)}</div></div>;
}

const s = stylex.create({
  wrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 4, paddingBottom: 6},
  frame: {isolation: 'isolate', overflow: 'hidden', borderRadius: 20},
});
