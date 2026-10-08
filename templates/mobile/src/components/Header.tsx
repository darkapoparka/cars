'use client';
import { useLocale } from '@/lib/use-locale';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { IconButton } from './ui';
import type { IconName } from './Icon';
import { useAppState } from '@/lib/store';
import { showroom, showroomInventoryHref } from '@/lib/showroom';
import { ShowroomProfileMenu } from './ShowroomProfileMenu';
import { ShowroomBrandLogo } from './ShowroomBrandLogo';
import { showroomPlaceholderLogo } from '@/lib/showroom-config';
const s = stylex.create({
  header: {
    height: 60,
    paddingBottom: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    paddingInline: 0,
    gap: 4,
    backgroundColor: colors.background,
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    flex: '1',
    minWidth: 0,
    paddingInline: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  backTitle: { paddingInline: 8 },
  logo: {
    width: { default: 176, '@media (max-width: 699px)': 128 },
    height: { default: 52, '@media (max-width: 699px)': 'auto' },
    objectFit: 'contain',
    objectPosition: 'left center',
  },
  home: {
    height: { default: 60, '@media (min-width: 1024px)': 72 },
    paddingLeft: 16,
    paddingRight: { default: 8, '@media (min-width: 1024px)': 16 },
    color: colors.text,
  },
  overHero: {
    position: { default: 'static', '@media (min-width: 1024px)': 'relative' },
    zIndex: { default: 'auto', '@media (min-width: 1024px)': 40 },
    paddingLeft: { default: 16, '@media (min-width: 1024px)': 24 },
    paddingRight: { default: 8, '@media (min-width: 1024px)': 24 },
    backgroundColor: { default: colors.background, '@media (min-width: 1024px)': 'transparent' },
    color: { default: colors.text, '@media (min-width: 1024px)': '#fff' },
  },
  overHeroLogo: {
    // Fallback for personalized artwork without its own light presentation.
    filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },
  },
  overHeroSticky: {
    position: { default: 'sticky', '@media (min-width: 1024px)': 'relative' },
    zIndex: { default: 30, '@media (min-width: 1024px)': 40 },
  },
  phoneLogo: { display: { default: 'block', '@media (min-width: 1024px)': 'none' } },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    minWidth: 0,
    minHeight: 48,
    textDecoration: 'none',
    fontSize: 19,
    fontWeight: 700,
    lineHeight: '26px',
  },
  placeholder: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
});
export function Header({
  title,
  back,
  children,
  home = false,
  sticky = true,
  overHeroDesktop = false,
  onBack,
  backIcon = 'back',
}: {
  title?: string;
  back?: string;
  children?: ReactNode;
  home?: boolean;
  sticky?: boolean;
  overHeroDesktop?: boolean;
  onBack?: () => void;
  backIcon?: IconName;
}) {
  const { t } = useLocale();
  const { filters, inventorySort } = useAppState();
  const generatedDesktopLogo = showroom.logo === showroomPlaceholderLogo;
  return (
    <header
      data-desktop-hero-header={overHeroDesktop || undefined}
      {...stylex.props(
        s.header,
        sticky && s.sticky,
        home && s.home,
        overHeroDesktop && s.overHero,
        overHeroDesktop && sticky && s.overHeroSticky,
      )}
    >
      {(back || onBack) && (
        <IconButton
          href={onBack ? undefined : back}
          onClick={onBack}
          icon={backIcon}
          label={backIcon === 'close' ? t('Close') : t('Go back')}
        />
      )}
      {home ? (
        <Link
          href={showroomInventoryHref(filters, inventorySort)}
          prefetch={false}
          {...stylex.props(s.logoLink)}
          aria-label={t(showroom.name) + ' · ' + t('Cars')}
        >
          {showroom.logo ? (
            <>
              {generatedDesktopLogo && (
                <ShowroomBrandLogo light={overHeroDesktop} label={t(showroom.name)} />
              )}
              <Image
                src={showroom.logo}
                alt={t(showroom.name)}
                width={176}
                height={52}
                sizes="(max-width: 699px) 128px, 176px"
                priority
                {...stylex.props(
                  s.logo,
                  generatedDesktopLogo && s.phoneLogo,
                  !generatedDesktopLogo && overHeroDesktop && s.overHeroLogo,
                )}
              />
            </>
          ) : (
            <span {...stylex.props(s.placeholder)}>{t(showroom.name)}</span>
          )}
        </Link>
      ) : (
        <h1 {...stylex.props(s.title, Boolean(back || onBack) && s.backTitle)}>
          {title ? t(title) : title}
        </h1>
      )}
      {home ? <ShowroomProfileMenu overHero={overHeroDesktop} /> : children}
    </header>
  );
}
