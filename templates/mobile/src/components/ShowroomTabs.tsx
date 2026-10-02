'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  rail: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(max-content,1fr)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minHeight: 48,
    marginTop: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  tab: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: 47,
    paddingInline: 4,
    paddingBlock: 3,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.muted,
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    outlineOffset: -3,
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
});

export function ShowroomTabs<T extends string>({
  label,
  tabs,
  selected,
  panelId,
  idPrefix,
  onChange,
}: {
  label: string;
  tabs: readonly { value: T; label: string; content?: ReactNode }[];
  selected: T;
  panelId: string;
  idPrefix: string;
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
    <div role="tablist" aria-label={label} {...stylex.props(s.rail)}>
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
          {...stylex.props(s.tab, selected === value && s.selected)}
        >
          {content ?? tabLabel}
        </button>
      ))}
    </div>
  );
}
