'use client';
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia('(min-width: 1024px)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
const desktopSnapshot = () => window.matchMedia('(min-width: 1024px)').matches;
const serverSnapshot = () => false;

const s = stylex.create({
  rail: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minHeight: 52,
    marginTop: 8,
    paddingInline: 16,
    backgroundColor: colors.background,
    // Keep elevation below each phone rail without tinting the white surface above.
    clipPath: { default: 'none', '@media (max-width: 699px)': 'inset(0 -16px -16px)' },
    boxShadow: {
      default: '0 4px 8px rgba(23, 32, 43, 0.12)',
      '@media (min-width: 700px)': 'none',
    },
    borderBottomWidth: { default: 0, '@media (min-width: 700px)': 1 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  fillRail: { paddingInline: 0, overflowX: 'visible' },
  desktopFillRail: {
    overflowX: { default: 'auto', '@media (min-width: 700px)': 'visible' },
    paddingInline: { default: 16, '@media (min-width: 700px)': 12 },
    height: { default: 'auto', '@media (min-width: 700px)': 57 },
    backgroundColor: {
      default: colors.background,
      '@media (min-width: 700px)': colors.stripe,
    },
  },
  flushRail: { marginTop: 0 },
  phoneFlushRail: {
    marginTop: { default: 8, '@media (max-width: 699px)': 0, '@media (min-width: 1024px)': 0 },
  },
  heroRail: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    minHeight: 48,
    marginTop: 0,
    paddingInline: 1,
    paddingBlock: 1,
    justifyContent: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,.12)',
    backdropFilter: 'blur(12px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderTopColor: 'rgba(255,255,255,.24)',
    borderRightColor: 'rgba(255,255,255,.24)',
    borderBottomColor: 'rgba(255,255,255,.24)',
    borderLeftColor: 'rgba(255,255,255,.24)',
    borderRadius: controlShape.pill,
    boxShadow: 'none',
  },
  primaryTab: {
    fontSize: 18,
    lineHeight: '26px',
    paddingInline: 4,
    whiteSpace: 'nowrap',
    overflowWrap: 'normal',
  },
  heroTab: {
    minWidth: 72,
    minHeight: 44,
    paddingInline: 12,
    paddingBlock: 0,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    color: '#fff',
    borderRadius: controlShape.pill,
    backgroundColor: {
      default: 'transparent',
      ':hover': 'rgba(255,255,255,.08)',
      ':active': 'rgba(255,255,255,.16)',
    },
    outlineColor: '#fff',
  },
  heroSelected: {
    color: colors.text,
    fontWeight: 500,
    outlineColor: colors.text,
    backgroundColor: { default: '#fff', ':hover': '#fff', ':active': '#fff' },
    '::after': { height: 0 },
  },
  tab: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    minHeight: 52,
    flexShrink: 0,
    paddingInline: 4,
    paddingBlock: 3,
    borderWidth: 0,
    backgroundColor: { default: 'transparent', ':active': colors.controlSurface },
    color: colors.muted,
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    outlineOffset: -3,
    outlineColor: colors.accent,
  },
  textTab: {
    paddingInline: 16,
    paddingBlock: 10,
    fontSize: 16,
  },
  iconTab: { minWidth: 88, paddingInline: 12 },
  neutralTab: { outlineColor: colors.text },
  fillTab: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingInline: 8,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
  desktopFillTab: {
    outlineColor: { default: colors.accent, '@media (min-width: 700px)': colors.text },
    outlineOffset: { default: -3, '@media (min-width: 700px)': -5 },
    flexGrow: { default: 0, '@media (min-width: 700px)': 1 },
    flexShrink: { default: 0, '@media (min-width: 700px)': 1 },
    flexBasis: 'auto',
    minWidth: { default: 72, '@media (min-width: 700px)': 0 },
    height: { default: 'auto', '@media (min-width: 700px)': 56 },
    minHeight: { default: 52, '@media (min-width: 700px)': 56 },
    paddingInline: { default: 16, '@media (min-width: 700px)': 8 },
    paddingBlock: { default: 10, '@media (min-width: 700px)': 6 },
    fontSize: 16,
    lineHeight: '22px',
    fontWeight: { default: 500, '@media (min-width: 700px)': 600 },
    whiteSpace: { default: 'nowrap', '@media (min-width: 700px)': 'normal' },
    overflowWrap: 'normal',
    borderTopLeftRadius: { default: 0, '@media (min-width: 700px)': 8 },
    borderTopRightRadius: { default: 0, '@media (min-width: 700px)': 8 },
    backgroundColor: {
      default: 'transparent',
      ':active': colors.controlSurface,
      '@media (min-width: 700px)': {
        default: 'transparent',
        ':hover': colors.controlSurface,
      },
    },
    transition: 'none',
  },
  selected: {
    color: colors.accent,
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 2,
      right: 2,
      height: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: colors.accent,
    },
  },
  selectedText: { fontWeight: 600 },
  desktopFillSelected: {
    backgroundColor: {
      default: 'transparent',
      ':active': {
        default: colors.controlSurface,
        '@media (min-width: 700px)': colors.activeSurface,
      },
      '@media (min-width: 700px)': {
        default: colors.activeSurface,
        ':hover': colors.activeSurface,
      },
    },
    '::after': {
      left: { default: 2, '@media (min-width: 700px)': 12 },
      right: { default: 2, '@media (min-width: 700px)': 12 },
    },
  },
  selectedNeutral: {
    color: colors.text,
    '::after': { backgroundColor: colors.text },
  },
  categoryRail: {
    boxShadow: { default: 'none', '@media (max-width: 699px)': '0 2px 4px rgba(27,27,33,.06)' },
  },
  desktopCategories: {
    justifyContent: { default: 'flex-start', '@media (min-width: 1024px)': 'center' },
    marginTop: { default: 8, '@media (min-width: 1024px)': 0 },
    paddingInline: { default: 16, '@media (max-width: 699px)': 0 },
    paddingTop: { default: 0, '@media (min-width: 1024px)': 4 },
    paddingBottom: { default: 0, '@media (min-width: 1024px)': 4 },
    borderBottomWidth: {
      default: 1,
      '@media (min-width: 1024px)': 0,
    },
    borderBottomColor: {
      default: colors.cardLine,
      '@media (min-width: 700px)': colors.line,
    },
  },
  categoryTab: {
    minWidth: { default: 88, '@media (max-width: 699px)': 64 },
    flexGrow: 0,
    flexBasis: { default: 'auto', '@media (max-width: 699px)': '25%' },
    paddingInline: { default: 12, '@media (max-width: 699px)': 0 },
  },
  pillsRail: {
    marginTop: { default: 8, '@media (min-width: 1024px)': 0 },
    gap: { default: 0, '@media (min-width: 1024px)': 6 },
    flexShrink: 0,
    borderBottomWidth: 0,
  },
  pillsTab: {
    flexGrow: { default: 1, '@media (min-width: 1024px)': 0 },
    flexShrink: { default: 1, '@media (min-width: 1024px)': 0 },
    flexBasis: { default: 0, '@media (min-width: 1024px)': 'auto' },
    minHeight: { default: 52, '@media (min-width: 1024px)': 44 },
    paddingInline: { default: 8, '@media (min-width: 1024px)': 0 },
    paddingBlock: { default: 10, '@media (min-width: 1024px)': 0 },
    fontSize: { default: 16, '@media (min-width: 1024px)': 14 },
    borderRadius: { default: 0, '@media (min-width: 1024px)': controlShape.pill },
  },
  pillsSelected: {
    fontWeight: { default: 600, '@media (min-width: 1024px)': 500 },
    '::after': { height: { default: 3, '@media (min-width: 1024px)': 0 } },
  },
  pillFace: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'inline-flex' },
    alignItems: 'center',
    minHeight: 38,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: controlShape.pill,
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.stripe },
  },
  pillFaceSelected: {
    borderColor: colors.text,
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.text },
    color: { default: 'inherit', '@media (min-width: 1024px)': colors.background },
  },
  sidebarRail: {
    flexDirection: { default: 'row', '@media (min-width: 1024px)': 'column' },
    gap: { default: 0, '@media (min-width: 1024px)': 6 },
    height: {
      default: 'auto',
      '@media (min-width: 700px)': 57,
      '@media (min-width: 1024px)': '100%',
    },
    marginTop: { default: 8, '@media (max-width: 699px)': 0, '@media (min-width: 1024px)': 0 },
    paddingInline: {
      default: 16,
      '@media (min-width: 700px)': 12,
      '@media (min-width: 1024px)': 12,
    },
    paddingBlock: { default: 0, '@media (min-width: 1024px)': 16 },
    overflowY: { default: 'visible', '@media (min-width: 1024px)': 'auto' },
    borderBottomWidth: {
      default: 0,
      '@media (min-width: 700px)': 1,
      '@media (min-width: 1024px)': 0,
    },
    borderRightWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderRightStyle: 'solid',
    borderRightColor: colors.line,
  },
  phoneEdgeRail: {
    paddingInline: {
      default: 16,
      '@media (max-width: 699px)': 0,
      '@media (min-width: 700px)': 12,
    },
  },
  phoneEdgeSelected: {
    '::after': {
      left: { default: 2, '@media (max-width: 699px)': 0, '@media (min-width: 700px)': 12 },
      right: { default: 2, '@media (max-width: 699px)': 0, '@media (min-width: 700px)': 12 },
      borderTopLeftRadius: { default: 3, '@media (max-width: 699px)': 0 },
      borderTopRightRadius: { default: 3, '@media (max-width: 699px)': 0 },
    },
  },
  sidebarTab: {
    lineHeight: { default: '22px', '@media (max-width: 699px)': '24px' },
    outlineColor: {
      default: colors.accent,
      '@media (min-width: 700px)': colors.text,
      '@media (min-width: 1024px)': colors.accent,
    },
    outlineOffset: {
      default: -3,
      '@media (min-width: 700px)': -5,
      '@media (min-width: 1024px)': -2,
    },
    outlineWidth: {
      default: null,
      '@media (min-width: 1024px)': { default: null, ':focus-visible': 2 },
    },
    justifyContent: { default: 'center', '@media (min-width: 1024px)': 'flex-start' },
    flexGrow: {
      default: 0,
      '@media (min-width: 700px)': 1,
      '@media (min-width: 1024px)': 0,
    },
    height: {
      default: 'auto',
      '@media (min-width: 700px)': 56,
      '@media (min-width: 1024px)': 44,
    },
    minHeight: {
      default: 52,
      '@media (min-width: 700px)': 56,
      '@media (min-width: 1024px)': 44,
    },
    paddingInline: {
      default: 16,
      '@media (max-width: 699px)': 12,
      '@media (min-width: 700px)': 8,
      '@media (min-width: 1024px)': 16,
    },
    fontSize: { default: 16, '@media (min-width: 1024px)': 14 },
    fontWeight: {
      default: 500,
      '@media (min-width: 700px)': 600,
      '@media (min-width: 1024px)': 500,
    },
    borderTopLeftRadius: {
      default: 0,
      '@media (min-width: 700px)': 8,
      '@media (min-width: 1024px)': 10,
    },
    borderTopRightRadius: {
      default: 0,
      '@media (min-width: 700px)': 8,
      '@media (min-width: 1024px)': 10,
    },
    borderBottomLeftRadius: { default: 0, '@media (min-width: 1024px)': 10 },
    borderBottomRightRadius: { default: 0, '@media (min-width: 1024px)': 10 },
  },
  sidebarSelected: {
    color: { default: colors.accent, '@media (min-width: 1024px)': colors.text },
    backgroundColor: {
      default: 'transparent',
      ':active': {
        default: colors.controlSurface,
        '@media (min-width: 700px)': colors.activeSurface,
        '@media (min-width: 1024px)': colors.background,
      },
      '@media (min-width: 700px)': {
        default: colors.activeSurface,
        ':hover': colors.activeSurface,
      },
      '@media (min-width: 1024px)': {
        default: colors.background,
        ':hover': colors.background,
      },
    },
    boxShadow: {
      default: 'none',
      '@media (min-width: 1024px)': '0 1px 3px rgba(27, 27, 33, .08)',
    },
    '::before': {
      content: '""',
      display: { default: 'none', '@media (min-width: 1024px)': 'block' },
      position: 'absolute',
      left: 0,
      top: 12,
      bottom: 12,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    '::after': { height: { default: 3, '@media (min-width: 1024px)': 0 } },
  },
});

export function ShowroomTabs<T extends string>({
  label,
  tabs,
  selected,
  panelId,
  idPrefix,
  variant = 'text',
  tone = 'accent',
  layout = 'scroll',
  primary = false,
  flush = false,
  flushOnPhone = false,
  edgeToEdgeOnPhone = false,
  onChange,
}: {
  label: string;
  tabs: readonly { value: T; label: string; content?: ReactNode }[];
  selected: T;
  panelId: string;
  idPrefix: string;
  variant?: 'text' | 'icon';
  tone?: 'accent' | 'neutral';
  layout?:
    | 'scroll'
    | 'fill'
    | 'desktop-fill'
    | 'desktop-sidebar'
    | 'desktop-categories'
    | 'desktop-pills'
    | 'hero';
  primary?: boolean;
  flush?: boolean;
  flushOnPhone?: boolean;
  edgeToEdgeOnPhone?: boolean;
  onChange: (value: T) => void;
}) {
  const { t, locale } = useLocale();
  const desktopFill = layout === 'desktop-fill' || layout === 'desktop-sidebar';
  const filled = layout === 'fill' || layout === 'desktop-pills';
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, serverSnapshot);
  const vertical = layout === 'desktop-sidebar' && desktop;
  const tabText = (text: string) => (locale === 'bg' && text === 'Features' ? 'Екстри' : t(text));
  const activeTab = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const tab = activeTab.current;
    const rail = tab?.parentElement;
    if (!tab || !rail) return;
    const reveal = () => {
      const bounds = tab.getBoundingClientRect();
      const visible = rail.getBoundingClientRect();
      if (rail.scrollWidth > rail.clientWidth) {
        if (bounds.left < visible.left) rail.scrollLeft += bounds.left - visible.left;
        else if (bounds.right > visible.right) rail.scrollLeft += bounds.right - visible.right;
      }
      if (layout === 'desktop-sidebar' && rail.scrollHeight > rail.clientHeight) {
        if (bounds.top < visible.top) rail.scrollTop += bounds.top - visible.top;
        else if (bounds.bottom > visible.bottom) rail.scrollTop += bounds.bottom - visible.bottom;
      }
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(tab);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [selected, layout]);
  return (
    <div
      role="tablist"
      aria-label={t(label)}
      aria-orientation={vertical ? 'vertical' : undefined}
      {...stylex.props(
        s.rail,
        filled && s.fillRail,
        desktopFill && s.desktopFillRail,
        layout === 'desktop-sidebar' && s.sidebarRail,
        layout === 'desktop-categories' && s.desktopCategories,
        layout === 'desktop-pills' && s.pillsRail,
        (layout === 'desktop-categories' || layout === 'desktop-pills') && s.categoryRail,
        flush && s.flushRail,
        flushOnPhone && s.phoneFlushRail,
        layout === 'hero' && s.heroRail,
        edgeToEdgeOnPhone && s.phoneEdgeRail,
      )}
    >
      {tabs.map(({ value, label: tabLabel, content }, index) => (
        <button
          key={value}
          type="button"
          role="tab"
          id={idPrefix + value}
          aria-controls={panelId}
          aria-label={tabText(tabLabel)}
          aria-selected={selected === value}
          tabIndex={selected === value ? 0 : -1}
          title={tabText(tabLabel)}
          ref={selected === value ? activeTab : undefined}
          onClick={() => onChange(value)}
          onKeyDown={(event) => {
            const next =
              event.key === 'ArrowRight' || (vertical && event.key === 'ArrowDown')
                ? (index + 1) % tabs.length
                : event.key === 'ArrowLeft' || (vertical && event.key === 'ArrowUp')
                  ? (index + tabs.length - 1) % tabs.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? tabs.length - 1
                      : null;
            if (next === null) return;
            event.preventDefault();
            onChange(tabs[next].value);
            event.currentTarget.parentElement
              ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
              [next]?.focus({ preventScroll: true });
          }}
          {...stylex.props(
            s.tab,
            tone === 'neutral' && s.neutralTab,
            variant === 'text' && s.textTab,
            variant === 'icon' && s.iconTab,
            layout === 'desktop-categories' && s.categoryTab,
            filled && s.fillTab,
            desktopFill && s.desktopFillTab,
            layout === 'desktop-sidebar' && s.sidebarTab,
            layout === 'desktop-pills' && s.pillsTab,
            selected === value && s.selected,
            selected === value && tone === 'neutral' && s.selectedNeutral,
            selected === value && variant === 'text' && s.selectedText,
            selected === value && desktopFill && s.desktopFillSelected,
            selected === value && layout === 'desktop-sidebar' && s.sidebarSelected,
            selected === value && layout === 'desktop-pills' && s.pillsSelected,
            primary && s.primaryTab,
            layout === 'hero' && s.heroTab,
            selected === value && layout === 'hero' && s.heroSelected,
            selected === value && edgeToEdgeOnPhone && s.phoneEdgeSelected,
          )}
        >
          {layout === 'desktop-pills' ? (
            <span {...stylex.props(s.pillFace, selected === value && s.pillFaceSelected)}>
              {content ?? tabText(tabLabel)}
            </span>
          ) : (
            (content ?? tabText(tabLabel))
          )}
        </button>
      ))}
    </div>
  );
}
