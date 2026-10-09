'use client';

import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** The page surface meets the matching landing background without enclosing search. */
export default function LandingContentFrame({children, enabled = true}: {children: ReactNode; enabled?: boolean}) {
  return enabled ? <div {...stylex.props(s.backdrop)}>{children}</div> : children;
}

export const landingContent = stylex.create({
  panel: {
    position: 'relative',
    paddingTop: 8,
    borderTopLeftRadius: {[media.desktop]: 0, [media.mobile]: 24, default: 32},
    borderTopRightRadius: {[media.desktop]: 0, [media.mobile]: 24, default: 32},
    backgroundColor: $.surface,
  },
});

const s = stylex.create({
  backdrop: {maxWidth: $.content, marginInline: 'auto', backgroundColor: {[media.desktop]: $.surface, [media.mobile]: $.rail, default: '#202023'}},
});
