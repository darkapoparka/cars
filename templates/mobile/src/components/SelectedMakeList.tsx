'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Filters } from '@/lib/types';
import { excludedMakeNames, makeSelectionSummary, removeMakeSelection } from '@/lib/make-selection';
import { updateFilters } from '@/lib/store';
import { BrandLogo } from './MakePicker';
const s = stylex.create({
  group: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.surface,
  },
  row: {
    minHeight: 81,
    padding: 16,
    paddingRight: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  last: { borderBottomWidth: 0 },
  brand: {
    position: 'relative',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: 0,
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: colors.background,
    color: colors.accent,
  },
  edit: {
    textAlign: 'left',
    minWidth: 0,
    flex: '1',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    padding: 0,
  },
  title: { display: 'block', fontSize: 14, fontWeight: 700, lineHeight: '20px', marginBottom: 4 },
  summary: { display: 'block', color: colors.muted, overflowWrap: 'anywhere' },
  remove: {
    borderWidth: 0,
    width: 48,
    height: 48,
    color: colors.muted,
    padding: 14,
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
});
export function SelectedMakeList({
  filters,
  onEdit,
}: {
  filters: Filters;
  onEdit: (make: string, excluded: boolean) => void;
}) {
  const rows = [
    ...filters.makes.map((make) => ({ make, excluded: false })),
    ...excludedMakeNames(filters).map((make) => ({ make, excluded: true })),
  ];
  return (
    <div {...stylex.props(s.group)}>
      {rows.map(({ make, excluded }, index) => (
        <div key={make + excluded} {...stylex.props(s.row, index === rows.length - 1 && s.last)}>
          <span {...stylex.props(s.brand)}>
            <BrandLogo make={make} />
            {excluded && (
              <svg aria-hidden="true" viewBox="0 0 18 18" {...stylex.props(s.badge)}>
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
                <path d="m5 5 8 8" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            )}
          </span>
          <button
            type="button"
            aria-label={
              (excluded ? 'Excluded ' : '') +
              make +
              ' ' +
              makeSelectionSummary(filters, make, excluded)
            }
            onClick={() => onEdit(make, excluded)}
            {...stylex.props(s.edit)}
          >
            <span {...stylex.props(s.title)}>{make}</span>
            <span {...stylex.props(s.summary)}>
              {makeSelectionSummary(filters, make, excluded)}
            </span>
          </button>
          <button
            type="button"
            aria-label={'Remove ' + (excluded ? 'excluded ' : '') + make}
            onClick={() => updateFilters(removeMakeSelection(filters, make, excluded))}
            {...stylex.props(s.remove)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m8 8 8 8m0-8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
