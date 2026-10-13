'use client';

import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  surface: {
    display: { default: 'contents', '@media (max-width: 699px)': 'block' },
    position: { default: 'static', '@media (max-width: 699px)': 'relative' },
    zIndex: { default: 'auto', '@media (max-width: 699px)': 26 },
    backgroundColor: colors.background,
  },
});

export function ShowroomHeaderSurface({ children }: { children: ReactNode }) {
  return (
    <div data-showroom-header-surface {...stylex.props(s.surface)}>
      {children}
    </div>
  );
}
