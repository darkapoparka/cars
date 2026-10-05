'use client';

import { useId, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, X } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { useLocale } from '@/lib/use-locale';
import { useAppState } from '@/lib/store';
import { showroomInventoryHref } from '@/lib/showroom';
import {
  showroomServices,
  serviceCategoryHref,
  serviceQuickFilters,
  serviceQuickFilterHref,
  serviceSearchHref,
  type ShowroomService,
} from '@/lib/showroom-services';
import { colors } from '@/styles/tokens.stylex';
import { Icon, type IconName } from './Icon';
import { showroomNavigation } from './showroom-navigation';

const s = stylex.create({
  root: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    position: 'relative',
    zIndex: 60,
    marginLeft: 8,
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: { default: colors.background, ':hover': colors.stripe },
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
  panel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 420,
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100dvh - 92px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
    color: colors.text,
    boxShadow: '0 12px 36px rgba(20, 24, 32, .16)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
    paddingBlock: 8,
    paddingInline: 12,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    textDecoration: 'none',
    outlineColor: colors.text,
    outlineOffset: -2,
  },
  current: { backgroundColor: colors.stripe, fontWeight: 600 },
  linkLabel: { flex: '1', minWidth: 0 },
  icon: { flexShrink: 0, color: colors.muted },
  services: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
  },
  sectionTitle: {
    paddingInline: 12,
    paddingBottom: 8,
    color: colors.muted,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '18px',
  },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 4 },
  serviceLink: { minHeight: 52, paddingInline: 10, gap: 8, fontSize: 14, lineHeight: '20px' },
});

const serviceIcons: Record<string, IconName> = {
  import: 'globe',
  sell: 'tag',
  viewing: 'calendar',
  'trade-in': 'reset',
  sourcing: 'search',
  servicing: 'wrench',
  financing: 'euro',
  parts: 'settings',
};

function serviceHref(service: ShowroomService) {
  if (service.category !== 'services') return serviceCategoryHref(service.category);
  const quickFilter = serviceQuickFilters.find(({ value }) => value === service.id);
  return quickFilter ? serviceQuickFilterHref(quickFilter.value) : serviceSearchHref(service.title);
}

export function ShowroomDesktopMenu() {
  const { t } = useLocale();
  const { filters, inventorySort } = useAppState();
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
    function resize(event: MediaQueryListEvent) {
      if (event.matches) return;
      if (root.current?.contains(document.activeElement)) {
        trigger.current
          ?.closest('header')
          ?.querySelector<HTMLAnchorElement>('a[href="/car-park"]')
          ?.focus({ preventScroll: true });
      }
      close();
    }
    document.addEventListener('pointerdown', dismiss);
    window.addEventListener('popstate', close);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
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
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return;
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }}
      {...stylex.props(s.root)}
    >
      <button
        ref={trigger}
        type="button"
        data-desktop-menu-trigger
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
        {...stylex.props(s.trigger, open && s.triggerOpen)}
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        <span>{t('Menu')}</span>
      </button>
      {open && (
        <nav
          ref={panel}
          id={id}
          data-desktop-navigation
          aria-label={t('Main navigation')}
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
          {showroomNavigation.map(([href, label, NavigationIcon]) => (
            <Link
              key={href}
              href={href === '/' ? showroomInventoryHref(filters, inventorySort) : href}
              prefetch={false}
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
              {...stylex.props(s.link, pathname === href && s.current)}
            >
              <NavigationIcon
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                {...stylex.props(s.icon)}
              />
              <span {...stylex.props(s.linkLabel)}>{t(label)}</span>
              <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.icon)} />
            </Link>
          ))}
          <div {...stylex.props(s.services)}>
            <h2 {...stylex.props(s.sectionTitle)}>{t('Services')}</h2>
            <div {...stylex.props(s.serviceGrid)}>
              {showroomServices.map((service) => (
                <Link
                  key={service.id}
                  href={serviceHref(service)}
                  prefetch={false}
                  data-desktop-service={service.id}
                  onClick={() => setOpen(false)}
                  {...stylex.props(s.link, s.serviceLink)}
                >
                  <span {...stylex.props(s.icon)}>
                    <Icon name={serviceIcons[service.id] || 'grid'} size={18} />
                  </span>
                  <span {...stylex.props(s.linkLabel)}>{t(service.title)}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
