'use client';

import { useId, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Heart, Menu, Settings, UserRound, X } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { useAppState } from '@/lib/store';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';

const accountNavigation = [
  ['/car-park', 'Saved cars', Heart],
  ['/settings', 'Settings', Settings],
] as const;

const s = stylex.create({
  root: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    position: 'relative',
    zIndex: 60,
    marginLeft: 8,
  },
  rootOpen: {
    '::after': {
      content: '""',
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 'calc(50% - 4px)',
      width: 8,
      height: 8,
      transform: 'translateY(-50%) rotate(45deg)',
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: colors.line,
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: colors.line,
      pointerEvents: 'none',
      zIndex: 1,
    },
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    minHeight: 48,
    padding: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: controlShape.circle,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.text,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    cursor: 'pointer',
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  triggerOpen: { backgroundColor: colors.stripe },
  triggerHero: {
    borderWidth: 0,
    backgroundColor: { default: 'transparent', ':hover': 'rgba(255, 255, 255, .12)' },
    color: '#fff',
    outlineColor: '#fff',
  },
  triggerHeroOpen: { backgroundColor: 'rgba(255, 255, 255, .12)' },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    width: 280,
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100dvh - 92px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    display: 'grid',
    gap: 4,
    padding: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: showroomDesktop.panelRadius,
    backgroundColor: colors.background,
    color: colors.text,
    boxShadow: '0 12px 32px rgba(20, 24, 32, .12)',
  },
  heading: { display: 'flex', alignItems: 'center', gap: 12, padding: 12 },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: controlShape.circle,
    color: colors.muted,
    backgroundColor: colors.controlSurface,
  },
  headingText: { display: 'grid', gap: 2, minWidth: 0 },
  title: { fontSize: 15, lineHeight: '22px', fontWeight: 600 },
  note: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  separator: { height: 1, marginInline: 8, marginBottom: 4, backgroundColor: colors.cardLine },
  count: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    height: 24,
    paddingInline: 6,
    borderRadius: controlShape.pill,
    backgroundColor: colors.controlSurface,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '18px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingBlock: 8,
    paddingInline: 12,
    borderRadius: controlShape.option,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    textDecoration: 'none',
    outlineColor: colors.text,
    outlineOffset: -3,
    outlineWidth: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  current: { backgroundColor: colors.stripe, fontWeight: 600 },
  linkLabel: { flex: '1', minWidth: 0 },
  icon: { flexShrink: 0, color: colors.muted },
  currentIcon: { color: colors.text },
});

export function ShowroomDesktopMenu({ overHero = false }: { overHero?: boolean }) {
  const { t, number } = useLocale();
  const { parked } = useAppState();
  const pathname = usePathname();
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function close() {
      setOpen(false);
    }
    function dismissKeyboard(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      close();
      trigger.current?.focus({ preventScroll: true });
    }
    function resize(event: MediaQueryListEvent) {
      if (event.matches) return;
      if (root.current?.contains(document.activeElement)) {
        trigger.current
          ?.closest('header')
          ?.querySelector<HTMLButtonElement>('[data-profile-menu-trigger]')
          ?.focus({ preventScroll: true });
      }
      close();
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismissKeyboard);
    window.addEventListener('popstate', close);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismissKeyboard);
      window.removeEventListener('popstate', close);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);

  function focusLink(index: number) {
    const links = panel.current?.querySelectorAll<HTMLAnchorElement>('a');
    const link = links?.[index < 0 ? links.length - 1 : index];
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      {...stylex.props(s.root, open && s.rootOpen)}
    >
      <button
        ref={trigger}
        type="button"
        data-desktop-menu-trigger
        data-desktop-menu-surface={overHero ? 'hero' : undefined}
        aria-label={t(open ? 'Close menu' : 'Open menu')}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          setOpen(true);
          requestAnimationFrame(() => focusLink(event.key === 'ArrowUp' ? -1 : 0));
        }}
        {...stylex.props(
          s.trigger,
          open && s.triggerOpen,
          overHero && s.triggerHero,
          overHero && open && s.triggerHeroOpen,
        )}
      >
        {open ? (
          <X size={30} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Menu size={30} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
      {open && (
        <nav
          ref={panel}
          id={id}
          data-desktop-navigation
          aria-label={t('Demo account')}
          onKeyDown={(event) => {
            const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
            const index = links.indexOf(document.activeElement as HTMLAnchorElement);
            const next =
              event.key === 'ArrowDown'
                ? (index + 1) % links.length
                : event.key === 'ArrowUp'
                  ? (index + links.length - 1) % links.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? links.length - 1
                      : null;
            if (next === null) return;
            event.preventDefault();
            focusLink(next);
          }}
          {...stylex.props(s.panel)}
        >
          <div {...stylex.props(s.heading)}>
            <span {...stylex.props(s.avatar)}>
              <UserRound size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span {...stylex.props(s.headingText)}>
              <span {...stylex.props(s.title)}>{t('Demo account')}</span>
              <span {...stylex.props(s.note)}>{t('Saved on this device')}</span>
            </span>
          </div>
          <div role="separator" {...stylex.props(s.separator)} />
          {accountNavigation.map(([href, label, NavigationIcon]) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
              {...stylex.props(s.link, pathname === href && s.current)}
            >
              <NavigationIcon
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                {...stylex.props(s.icon, pathname === href && s.currentIcon)}
              />
              <span {...stylex.props(s.linkLabel)}>{t(label)}</span>
              {href === '/car-park' && (
                <span {...stylex.props(s.count)}>{number(parked.length)}</span>
              )}
              <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.icon)} />
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
