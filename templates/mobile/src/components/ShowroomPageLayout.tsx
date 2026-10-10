'use client';

import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { showroom, showroomPreviewLocation } from '@/lib/showroom';
import { Icon } from './Icon';
import { showroomHeroStyles as hero } from './showroom-hero.stylex';

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
    marginTop: { default: 0, '@media (min-width: 1024px)': showroomDesktop.drawerOverlap },
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
      {...stylex.props(s.drawer, inventory && s.inventory, phoneResults && s.phoneResults)}
    >
      {children}
    </div>
  );
}

export function ShowroomHeroHeading({
  title,
  heading = 'h1',
  id,
  desktopOnly = false,
}: {
  title: string;
  heading?: 'h1' | 'h2';
  id?: string;
  desktopOnly?: boolean;
}) {
  const { t, locale } = useLocale();
  const Heading = heading;
  return (
    <div {...stylex.props(hero.copy, desktopOnly && hero.desktopCopy)}>
      <p data-desktop-showroom-location {...stylex.props(hero.location)}>
        <Icon name="pin" size={14} />
        <span>{showroom.address || showroomPreviewLocation[locale]}</span>
      </p>
      <Heading id={id} data-showroom-hero-title {...stylex.props(hero.title)}>
        {t(title)}
      </Heading>
    </div>
  );
}

export function ShowroomPageHero({
  title,
  children,
  controlLayout = 'contact',
}: {
  title: string;
  children?: ReactNode;
  controlLayout?: 'services' | 'contact';
}) {
  return (
    <div data-showroom-page-hero {...stylex.props(hero.layout)}>
      <ShowroomHeroHeading title={title} />
      <div
        data-showroom-hero-controls
        {...stylex.props(
          hero.controlSurface,
          controlLayout === 'services' ? hero.serviceControlSurface : hero.contactControlSurface,
        )}
      >
        {children}
      </div>
    </div>
  );
}
