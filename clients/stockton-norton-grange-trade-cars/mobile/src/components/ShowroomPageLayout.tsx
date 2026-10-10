'use client';

import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import { useLocale } from '@/lib/use-locale';

const s = stylex.create({
  banner: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'block' },
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': '#263644' },
    backgroundImage: {
      default: 'none',
      '@media (min-width: 1024px)':
        'linear-gradient(180deg, rgba(14, 25, 36, .82), rgba(14, 25, 36, .52) 48%, rgba(14, 25, 36, .28)), url("/images/desktop/discovery-hero.jpg")',
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center 80%',
  },
  drawer: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    position: { default: 'static', '@media (min-width: 1024px)': 'relative' },
    zIndex: { default: 'auto', '@media (min-width: 1024px)': 1 },
    backgroundColor: colors.background,
    marginInline: 0,
    marginTop: { default: 0, '@media (min-width: 1024px)': -28 },
    paddingInline: { default: 0, '@media (min-width: 1024px)': showroomDesktop.gutter },
    paddingTop: { default: 0, '@media (min-width: 1024px)': 16 },
    borderTopLeftRadius: { default: 0, '@media (min-width: 1024px)': showroomDesktop.drawerRadius },
    borderTopRightRadius: {
      default: 0,
      '@media (min-width: 1024px)': showroomDesktop.drawerRadius,
    },
  },
  inventory: {
    display: 'flex',
    minHeight: { default: '100svh', '@media (min-width: 1024px)': 0 },
    backgroundColor: colors.background,
  },
  phoneResults: {
    display: {
      default: 'contents',
      '@media (max-width: 699px)': 'block',
      '@media (min-width: 1024px)': 'flex',
    },
    backgroundColor: { default: colors.background, '@media (max-width: 699px)': colors.stripe },
  },
  page: {
    fontFamily: {
      default: 'inherit',
      '@media (min-width: 1024px)': '"Mobile UI", Arial, sans-serif',
    },
  },
  hero: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 340,
    paddingTop: 52,
    paddingBottom: 68,
    paddingInline: 40,
    gap: 24,
    color: '#fff',
    textAlign: 'center',
  },
  compact: { minHeight: 280 },
  stackedControls: {
    paddingBottom: { default: 40, '@media (min-width: 1024px)': 48 },
    gap: 20,
  },
  copy: { display: { default: 'contents', '@media (min-width: 1024px)': 'block' } },
  title: {
    // One heading serves both sizes; it is visually hidden on the phone layout.
    position: { default: 'absolute', '@media (min-width: 1024px)': 'static' },
    width: { default: 1, '@media (min-width: 1024px)': 'auto' },
    height: { default: 1, '@media (min-width: 1024px)': 'auto' },
    margin: { default: -1, '@media (min-width: 1024px)': 0 },
    padding: 0,
    overflow: { default: 'hidden', '@media (min-width: 1024px)': 'visible' },
    clip: { default: 'rect(0,0,0,0)', '@media (min-width: 1024px)': 'auto' },
    whiteSpace: { default: 'nowrap', '@media (min-width: 1024px)': 'normal' },
    borderWidth: 0,
    fontFamily: 'var(--font-base), Arial, sans-serif',
    fontSize: 'clamp(32px, 3vw, 40px)',
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: '-.02em',
    textWrap: 'balance',
  },
  description: {
    display: { default: 'none', '@media (min-width: 1024px)': 'block' },
    marginTop: 12,
    maxWidth: 620,
    color: 'rgba(255, 255, 255, .82)',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    textWrap: 'balance',
  },
});

export function ShowroomBanner({
  children,
  discovery = false,
}: {
  children: ReactNode;
  discovery?: boolean;
}) {
  return (
    <div
      data-showroom-banner
      data-desktop-discovery-shell={discovery || undefined}
      {...stylex.props(s.banner)}
    >
      {children}
    </div>
  );
}

export function ShowroomDrawer({
  children,
  id,
  inventory = false,
  phoneResults = false,
}: {
  children: ReactNode;
  id?: string;
  inventory?: boolean;
  phoneResults?: boolean;
}) {
  return (
    <div
      id={id}
      data-showroom-drawer
      data-desktop-results-drawer={inventory || undefined}
      data-mobile-results-drawer={phoneResults || undefined}
      {...stylex.props(s.drawer, inventory ? s.inventory : s.page, phoneResults && s.phoneResults)}
    >
      {children}
    </div>
  );
}

export function ShowroomPageHero({
  title,
  description,
  children,
  compact,
  stackedControls = false,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
  stackedControls?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div
      data-showroom-page-hero
      {...stylex.props(
        s.hero,
        (compact ?? !children) && s.compact,
        stackedControls && s.stackedControls,
      )}
    >
      <div {...stylex.props(s.copy)}>
        <h1 {...stylex.props(s.title)}>{t(title)}</h1>
        {description && <p {...stylex.props(s.description)}>{t(description)}</p>}
      </div>
      {children}
    </div>
  );
}
