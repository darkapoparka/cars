'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  rail: {
    display: 'flex',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minHeight: 52,
    marginTop: 8,
    paddingInline: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    boxShadow: '0 2px 3px #00000008',
  },
  fillRail: { paddingInline: 0, overflowX: 'visible' },
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
  iconTab: { minWidth: 76, paddingInline: 18 },
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
});

export function ShowroomTabs<T extends string>({
  label,
  tabs,
  selected,
  panelId,
  idPrefix,
  variant = 'text',
  layout = 'scroll',
  onChange,
}: {
  label: string;
  tabs: readonly { value: T; label: string; content?: ReactNode }[];
  selected: T;
  panelId: string;
  idPrefix: string;
  variant?: 'text' | 'icon';
  layout?: 'scroll' | 'fill';
  onChange: (value: T) => void;
}) {
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
      aria-label={label}
      {...stylex.props(s.rail, layout === 'fill' && s.fillRail)}
    >
      {tabs.map(({ value, label: tabLabel, content }, index) => (
        <button
          key={value}
          type="button"
          role="tab"
          id={idPrefix + value}
          aria-controls={panelId}
          aria-label={tabLabel}
          aria-selected={selected === value}
          tabIndex={selected === value ? 0 : -1}
          title={tabLabel}
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
            variant === 'text' && s.textTab,
            variant === 'icon' && s.iconTab,
            layout === 'fill' && s.fillTab,
            selected === value && s.selected,
            selected === value && variant === 'text' && s.selectedText,
          )}
        >
          {content ?? tabLabel}
        </button>
      ))}
    </div>
  );
}
