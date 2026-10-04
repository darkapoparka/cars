'use client';
import { hydrateLocale, useLocale } from '@/lib/use-locale';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CarFront, LayoutGrid, MessageSquare } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, darkTheme } from '@/styles/tokens.stylex';
import { hydrateStore, notify, syncStorage, useAppState } from '@/lib/store';
import { showroomInventoryHref } from '@/lib/showroom';
import { translate } from '@/lib/locale';
import { getVehicle } from '@/lib/catalog';
const tabs = [
  ['/', 'Cars', CarFront],
  ['/services', 'Services', LayoutGrid],
  ['/contact', 'Contact', MessageSquare],
] as const;
const s = stylex.create({
  root: {
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: '100dvh',
    maxWidth: 1100,
    marginInline: 'auto',
    position: 'relative',
  },
  primary: {
    paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))',
  },
  nav: {
    position: 'fixed',
    bottom: 'calc(10px + env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 204,
    padding: 1,
    display: 'flex',
    gap: 2,
    backgroundColor: colors.background,
    zIndex: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 24,
    boxShadow: '0 2px 12px #17202b12',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    color: colors.muted,
    fontSize: '0.75rem',
    lineHeight: 1.2,
    fontWeight: 600,
    textDecoration: 'none',
    minWidth: 0,
    minHeight: 44,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingBlock: 2,
    paddingInline: 4,
    borderRadius: 22,
    outlineColor: colors.text,
    outlineOffset: -3,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    opacity: { default: 1, ':active': 0.7 },
    transition: 'background-color 140ms, color 140ms',
  },
  active: {
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
    color: colors.text,
  },
  icon: { width: 20, height: 20, display: 'block', flexShrink: 0 },
  label: { minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' },
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 'calc(4rem + 10px + env(safe-area-inset-bottom))',
    maxWidth: 'calc(100% - 32px)',
    width: 'max-content',
    zIndex: 120,
    backgroundColor: '#26222b',
    color: '#fff',
    borderRadius: 12,
    paddingBlock: 14,
    paddingInline: 20,
    boxShadow: '0 5px 25px #0003',
    fontSize: 14,
  },
  skip: { position: 'absolute', top: { default: -100, ':focus': 12 }, left: 12, zIndex: 150 },
});
const subscribeReady = () => () => {};
export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const ready = useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
  const state = useAppState();
  const primary = tabs.some(([href]) => href === pathname) || pathname === '/car-park';
  useEffect(() => {
    hydrateStore();
    hydrateLocale();
    window.addEventListener('storage', syncStorage);
    window.addEventListener('storage', hydrateLocale);
    window.addEventListener('popstate', hydrateLocale);
    return () => {
      window.removeEventListener('storage', syncStorage);
      window.removeEventListener('storage', hydrateLocale);
      window.removeEventListener('popstate', hydrateLocale);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    const vehicle = pathname.startsWith('/vehicle/')
      ? getVehicle(pathname.split('/')[2])
      : undefined;
    const page = vehicle
      ? vehicle.make + ' ' + vehicle.model
      : pathname === '/services'
        ? 'Services'
        : pathname === '/contact'
          ? 'Contact'
          : pathname === '/car-park'
            ? 'Saved cars'
            : 'Cars';
    const title = translate(page, locale) + ' — ' + translate('Your showroom', locale);
    const syncTitle = () => {
      if (document.title !== title) document.title = title;
    };
    syncTitle();
    // Streamed route metadata can arrive after the locale effect.
    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [locale, pathname, ready]);
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => notify(''), 3500);
    return () => clearTimeout(timer);
  }, [state.toast]);
  return (
    <div
      data-hydrated={ready ? 'true' : 'false'}
      {...stylex.props(s.root, primary && s.primary, state.theme === 'dark' && darkTheme)}
    >
      <a href="#main-content" {...stylex.props(s.skip)}>
        {t('Skip to content')}
      </a>
      <main id="main-content">{children}</main>
      {primary && (
        <nav aria-label={t('Main navigation')} {...stylex.props(s.nav)}>
          {tabs.map(([href, label, NavigationIcon]) => (
            <Link
              key={href}
              href={href === '/' ? showroomInventoryHref(state.filters, state.inventorySort) : href}
              prefetch={href === '/' ? false : undefined}
              aria-current={pathname === href ? 'page' : undefined}
              {...stylex.props(s.tab, pathname === href && s.active)}
            >
              <NavigationIcon
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                focusable="false"
                {...stylex.props(s.icon)}
              />
              <span {...stylex.props(s.label)}>{t(label)}</span>
            </Link>
          ))}
        </nav>
      )}
      {state.toast && (
        <div role="status" {...stylex.props(s.toast)}>
          {t(state.toast)}
        </div>
      )}
    </div>
  );
}
