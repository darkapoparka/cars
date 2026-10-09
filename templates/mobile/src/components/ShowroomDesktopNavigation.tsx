'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { showroomInventoryHref } from '@/lib/showroom';
import { useAppState } from '@/lib/store';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { showroomNavigation } from './showroom-navigation';

const s = stylex.create({
  nav: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 44,
    borderRadius: 10,
    color: { default: colors.muted, ':hover': colors.text },
    fontSize: 16,
    lineHeight: '22px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    outlineColor: colors.text,
    outlineOffset: -3,
    outlineWidth: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  current: { color: colors.text },
  hero: {
    color: { default: 'rgba(255, 255, 255, .82)', ':hover': '#fff' },
    outlineColor: '#fff',
  },
  heroCurrent: { color: '#fff' },
  face: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
    paddingInline: 12,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
  },
  currentFace: {
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
  },
  heroFace: {
    backgroundColor: { default: 'transparent', ':hover': 'rgba(255, 255, 255, .08)' },
  },
  heroCurrentFace: {
    backgroundColor: {
      default: 'rgba(255, 255, 255, .14)',
      ':hover': 'rgba(255, 255, 255, .14)',
    },
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, .10)',
  },
});

export function ShowroomDesktopNavigation({ overHero = false }: { overHero?: boolean }) {
  const { t } = useLocale();
  const { filters, inventorySort } = useAppState();
  const pathname = usePathname();

  return (
    <nav data-desktop-primary-navigation aria-label={t('Main navigation')} {...stylex.props(s.nav)}>
      {showroomNavigation.map(([href, label]) => {
        const current =
          pathname === href ||
          (href === '/' && (pathname === '/car-park' || pathname === '/results'));
        return (
          <Link
            key={href}
            href={href === '/' ? showroomInventoryHref(filters, inventorySort) : href}
            prefetch={false}
            aria-current={current ? 'page' : undefined}
            {...stylex.props(
              s.link,
              current && s.current,
              overHero && s.hero,
              overHero && current && s.heroCurrent,
            )}
          >
            <span
              data-desktop-nav-surface
              {...stylex.props(
                s.face,
                current && s.currentFace,
                overHero && s.heroFace,
                overHero && current && s.heroCurrentFace,
              )}
            >
              {t(label)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
