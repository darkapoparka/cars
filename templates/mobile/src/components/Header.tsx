'use client';
import { useLocale } from '@/lib/use-locale';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { IconButton } from './ui';
import type { IconName } from './Icon';
import { useAppState } from '@/lib/store';
import { showroom, showroomInventoryHref } from '@/lib/showroom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShowroomDesktopMenu } from './ShowroomDesktopMenu';
import { ShowroomBrandLogo } from './ShowroomBrandLogo';
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
    width: { default: 176, '@media (max-width: 699px)': 152 },
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
  darkPhone: {
    backgroundColor: { default: null, '@media (max-width: 699px)': 'transparent' },
    color: { default: null, '@media (max-width: 699px)': '#fff' },
  },
  overHeroSticky: {
    position: { default: 'sticky', '@media (min-width: 1024px)': 'relative' },
    zIndex: { default: 30, '@media (min-width: 1024px)': 40 },
  },
  phoneLogo: { display: { default: 'block', '@media (min-width: 1024px)': 'none' } },
  actions: { display: 'flex', alignItems: 'center', gap: 0 },
  savedAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    color: 'inherit',
    textDecoration: 'none',
  },
  savedActive: { color: '#db3000' },
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
  badge: {
    position: 'absolute',
    right: 9,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: '#db3000',
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: '16px',
  },
  relative: { position: 'relative' },
  placeholder: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
});
export function Header({
  title,
  back,
  children,
  home = false,
  sticky = true,
  showLanguageSwitcher = false,
  overHeroDesktop = false,
  darkOnPhone = false,
  onBack,
  backIcon = 'back',
}: {
  title?: string;
  back?: string;
  children?: ReactNode;
  home?: boolean;
  sticky?: boolean;
  showLanguageSwitcher?: boolean;
  overHeroDesktop?: boolean;
  darkOnPhone?: boolean;
  onBack?: () => void;
  backIcon?: IconName;
}) {
  const { t } = useLocale();
  const { parked, filters, inventorySort } = useAppState();
  const generatedDesktopLogo = showroom.logo === '/branding/showroom-placeholder-20261002.png';
  return (
    <header
      data-desktop-hero-header={overHeroDesktop || undefined}
      {...stylex.props(
        s.header,
        sticky && s.sticky,
        home && s.home,
        overHeroDesktop && s.overHero,
        overHeroDesktop && sticky && s.overHeroSticky,
        darkOnPhone && s.darkPhone,
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
                sizes="176px"
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
      {home ? (
        <div {...stylex.props(s.actions)}>
          {showLanguageSwitcher && <LanguageSwitcher />}
          <span {...stylex.props(s.relative)}>
            <Link
              href="/car-park"
              aria-label={t('Saved cars') + (parked.length ? ', ' + parked.length : '')}
              {...stylex.props(s.savedAction, parked.length > 0 && s.savedActive)}
            >
              <Heart
                size={22}
                strokeWidth={2}
                fill={parked.length > 0 ? 'currentColor' : 'none'}
                aria-hidden="true"
                focusable="false"
              />
            </Link>
            {parked.length > 0 && (
              <span aria-hidden="true" {...stylex.props(s.badge)}>
                {parked.length}
              </span>
            )}
          </span>
          <ShowroomDesktopMenu overHero={overHeroDesktop} />
        </div>
      ) : (
        children
      )}
    </header>
  );
}
