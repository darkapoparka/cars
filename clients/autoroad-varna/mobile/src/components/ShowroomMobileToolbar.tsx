'use client';

import { useEffect, useState, type RefObject } from 'react';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { useLocale } from '@/lib/use-locale';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  bar: {
    position: 'fixed',
    top: 0,
    insetInline: 0,
    zIndex: 25,
    display: { default: 'flex', '@media (min-width: 1024px)': 'none' },
    alignItems: 'center',
    gap: 8,
    paddingInline: 16,
    paddingTop: 'max(6px, env(safe-area-inset-top))',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.cardLine,
    backgroundColor: colors.background,
  },
  hidden: { visibility: 'hidden', pointerEvents: 'none' },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: 'transparent',
    opacity: { default: 1, ':active': 0.75 },
    color: colors.text,
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  face: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    minWidth: 0,
    height: 36,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: controlShape.pill,
    backgroundColor: colors.stripe,
  },
  search: { flex: '1 1 0' },
  searchFace: {
    width: '100%',
    justifyContent: 'flex-start',
    gap: 8,
    paddingInline: 12,
    textAlign: 'left',
    color: colors.muted,
    backgroundColor: colors.controlSurface,
    borderColor: 'transparent',
  },
  text: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
  },
  value: { color: colors.text },
  icon: { display: 'flex', flexShrink: 0 },
  action: { width: 44, flexShrink: 0 },
  actionFace: { position: 'relative', width: 36, borderRadius: controlShape.circle },
  activeAction: {
    borderColor: colors.text,
    backgroundColor: colors.text,
    color: colors.background,
  },
  badge: {
    position: 'absolute',
    top: -2,
    insetInlineEnd: -2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    paddingInline: 3,
    borderRadius: 12,
    backgroundColor: colors.text,
    color: colors.background,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: '18px',
  },
});

export function ShowroomMobileToolbar({
  anchor,
  summary,
  filterCount,
  sortLabel,
  sorted,
  sheet,
  sorting,
  onSearch,
  onFilters,
  onSort,
}: {
  anchor: RefObject<HTMLDivElement | null>;
  summary: string;
  filterCount: number;
  sortLabel: string;
  sorted: boolean;
  sheet: string | null;
  sorting: boolean;
  onSearch: (button: HTMLButtonElement) => void;
  onFilters: (button: HTMLButtonElement) => void;
  onSort: (button: HTMLButtonElement) => void;
}) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const overlayOpen = Boolean(sheet || sorting);
  useEffect(() => {
    // Keep the opener stable while the overlay locks the page's scroll position.
    if (overlayOpen) return;
    const target = anchor.current;
    if (!target) return;
    const mobile = window.matchMedia('(max-width: 1023px)');
    const update = () => setVisible(mobile.matches && target.getBoundingClientRect().bottom <= 0);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(mobile.matches && entry.boundingClientRect.bottom <= 0);
    });
    let settleFrame = 0;
    // The parent restores the list position in the first frame after closing.
    const frame = requestAnimationFrame(() => {
      settleFrame = requestAnimationFrame(() => {
        update();
        observer.observe(target);
      });
    });
    mobile.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
      mobile.removeEventListener('change', update);
      observer.disconnect();
    };
  }, [anchor, overlayOpen]);

  const filterLabel =
    t('Filters') + (filterCount ? ' · ' + t('Active filters') + ': ' + filterCount : '');
  return (
    <div
      data-mobile-inventory-toolbar
      data-visible={visible ? 'true' : 'false'}
      role="search"
      aria-label={t('Search and filters')}
      aria-hidden={!visible}
      inert={!visible}
      {...stylex.props(s.bar, !visible && s.hidden)}
    >
      <button
        type="button"
        data-mobile-toolbar-search
        aria-label={t('Search') + (summary ? ': ' + summary : '')}
        aria-haspopup="dialog"
        aria-expanded={sheet === 'search'}
        title={summary || t('Search make or model')}
        onClick={(event) => onSearch(event.currentTarget)}
        {...stylex.props(s.button, s.search)}
      >
        <span data-mobile-toolbar-surface {...stylex.props(s.face, s.searchFace)}>
          <span aria-hidden="true" {...stylex.props(s.icon)}>
            <Icon name="search" size={16} />
          </span>
          <span {...stylex.props(s.text, Boolean(summary) && s.value)}>
            {summary || t('Search')}
          </span>
        </span>
      </button>
      <button
        type="button"
        data-mobile-toolbar-filters
        aria-label={filterLabel}
        title={filterLabel}
        aria-haspopup="dialog"
        aria-expanded={Boolean(sheet && sheet !== 'search')}
        onClick={(event) => onFilters(event.currentTarget)}
        {...stylex.props(s.button, s.action)}
      >
        <span
          data-mobile-toolbar-surface
          {...stylex.props(s.face, s.actionFace, filterCount > 0 && s.activeAction)}
        >
          <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" />
          {filterCount > 0 && (
            <span aria-hidden="true" data-mobile-toolbar-count {...stylex.props(s.badge)}>
              {filterCount}
            </span>
          )}
        </span>
      </button>
      <button
        type="button"
        data-mobile-toolbar-sort
        aria-label={t('Sort') + ': ' + t(sortLabel)}
        title={t('Sort') + ': ' + t(sortLabel)}
        aria-haspopup="dialog"
        aria-expanded={sorting}
        onClick={(event) => onSort(event.currentTarget)}
        {...stylex.props(s.button, s.action)}
      >
        <span
          data-mobile-toolbar-surface
          {...stylex.props(s.face, s.actionFace, sorted && s.activeAction)}
        >
          <ArrowDownUp size={16} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
