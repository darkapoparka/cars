'use client';
import { hydrateLocale, useLocale } from '@/lib/use-locale';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors, darkTheme } from '@/styles/tokens.stylex';
import { hydrateStore, patchState, syncStorage, useAppState } from '@/lib/store';
import { showroomInventoryHref } from '@/lib/showroom';
import { translate } from '@/lib/locale';
import { getVehicle } from '@/lib/catalog';
import { ShowroomNavIcon, type ShowroomNavIconName } from './ShowroomNavIcon';
const tabs: [string, string, ShowroomNavIconName][] = [
  ['/', 'Cars', 'cars'],
  ['/services', 'Services', 'services'],
  ['/contact', 'Contact', 'contact'],
];
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
    backgroundColor: colors.stripe,
  },
  nav: {
    position: 'fixed',
    bottom: 'calc(10px + env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 232,
    padding: 4,
    display: 'flex',
    gap: 4,
    backgroundColor: colors.background,
    zIndex: 40,
    borderRadius: 26,
    boxShadow: '0 3px 16px #17202b14',
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: colors.muted,
    textDecoration: 'none',
    fontSize: 13,
    lineHeight: '18px',
    fontWeight: 500,
    minWidth: 0,
    minHeight: 44,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingBlock: 4,
    paddingInline: 8,
    borderRadius: 22,
    textAlign: 'center',
    overflowWrap: 'anywhere',
    outlineColor: colors.text,
    outlineOffset: -3,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    opacity: { default: 1, ':active': 0.7 },
    transition: 'background-color 140ms, color 140ms',
  },
  active: {
    flexGrow: 2.25,
    backgroundColor: { default: colors.text, ':hover': colors.text },
    color: colors.background,
    fontWeight: 600,
    outlineColor: colors.background,
  },
  label: { minWidth: 0, overflowWrap: 'anywhere' },
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 'calc(74px + env(safe-area-inset-bottom))',
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
    const timer = setTimeout(() => patchState({ toast: '' }), 3500);
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
          {tabs.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href === '/' ? showroomInventoryHref(state.filters, state.inventorySort) : href}
              prefetch={href === '/' ? false : undefined}
              aria-label={t(label)}
              title={t(label)}
              aria-current={pathname === href ? 'page' : undefined}
              {...stylex.props(s.tab, pathname === href && s.active)}
            >
              <ShowroomNavIcon name={icon} />
              {pathname === href && <span {...stylex.props(s.label)}>{t(label)}</span>}
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
