'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';

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
    boxShadow: {
      default: '0 4px 8px rgba(23, 32, 43, 0.12)',
      '@media (min-width: 700px)': 'none',
    },
    borderBottomWidth: { default: 0, '@media (min-width: 700px)': 1 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  fillRail: { paddingInline: 0, overflowX: 'visible' },
  flushRail: { marginTop: 0 },
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
  selectedNeutral: {
    color: colors.text,
    '::after': { backgroundColor: colors.text },
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
  flush = false,
  onChange,
}: {
  label: string;
  tabs: readonly { value: T; label: string; content?: ReactNode }[];
  selected: T;
  panelId: string;
  idPrefix: string;
  variant?: 'text' | 'icon';
  tone?: 'accent' | 'neutral';
  layout?: 'scroll' | 'fill';
  flush?: boolean;
  onChange: (value: T) => void;
}) {
  const { t, locale } = useLocale();
  const tabText = (text: string) => (locale === 'bg' && text === 'Features' ? 'Екстри' : t(text));
  const activeTab = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const tab = activeTab.current;
    const rail = tab?.parentElement;
    if (!tab || !rail) return;
    const reveal = () => {
      const bounds = tab.getBoundingClientRect();
      const visible = rail.getBoundingClientRect();
      if (bounds.left < visible.left) rail.scrollLeft += bounds.left - visible.left;
      else if (bounds.right > visible.right) rail.scrollLeft += bounds.right - visible.right;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(tab);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [selected]);
  return (
    <div
      role="tablist"
      aria-label={t(label)}
      {...stylex.props(s.rail, layout === 'fill' && s.fillRail, flush && s.flushRail)}
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
              event.key === 'ArrowRight'
                ? (index + 1) % tabs.length
                : event.key === 'ArrowLeft'
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
            layout === 'fill' && s.fillTab,
            selected === value && s.selected,
            selected === value && tone === 'neutral' && s.selectedNeutral,
            selected === value && variant === 'text' && s.selectedText,
          )}
        >
          {content ?? tabText(tabLabel)}
        </button>
      ))}
    </div>
  );
}
