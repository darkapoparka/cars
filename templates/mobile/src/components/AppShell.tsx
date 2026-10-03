'use client';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors, darkTheme } from '@/styles/tokens.stylex';
import { hydrateStore, patchState, syncStorage, useAppState } from '@/lib/store';
import { showroomInventoryHref } from '@/lib/showroom';
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
    paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))',
    backgroundColor: colors.stripe,
  },
  nav: {
    position: 'fixed',
    bottom: 'calc(12px + env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 360,
    padding: 4,
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    gap: 4,
    backgroundColor: colors.background,
    zIndex: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 26,
    boxShadow: '0 8px 28px #17202b14, 0 2px 6px #17202b08',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    color: colors.muted,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    textDecoration: 'none',
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 500,
    minWidth: 0,
    minHeight: 56,
    paddingBlock: 6,
    paddingInline: 8,
    borderRadius: 21,
    textAlign: 'center',
    overflowWrap: 'anywhere',
    outlineColor: colors.text,
    outlineOffset: -4,
    transition: 'background-color 140ms, color 140ms',
  },
  active: {
    color: colors.text,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
  },
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 'calc(100px + env(safe-area-inset-bottom))',
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
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);
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
        Skip to content
      </a>
      <main id="main-content">{children}</main>
      {primary && (
        <nav aria-label="Main navigation" {...stylex.props(s.nav)}>
          {tabs.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href === '/' ? showroomInventoryHref(state.filters, state.inventorySort) : href}
              prefetch={href === '/' ? false : undefined}
              aria-current={pathname === href ? 'page' : undefined}
              {...stylex.props(s.tab, pathname === href && s.active)}
            >
              <ShowroomNavIcon name={icon} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
      {state.toast && (
        <div role="status" {...stylex.props(s.toast)}>
          {state.toast}
        </div>
      )}
    </div>
  );
}
