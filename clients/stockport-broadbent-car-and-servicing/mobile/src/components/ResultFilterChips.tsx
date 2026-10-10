'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Filters } from '@/lib/types';
import { excludedMakeNames, makeSelectionSummary, removeMakeSelection } from '@/lib/make-selection';
import { Button } from './ui';
import { Icon } from './Icon';
const s = stylex.create({
  strip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    paddingBlock: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    whiteSpace: 'nowrap',
    backgroundColor: colors.background,
    position: 'sticky',
    top: 60,
    zIndex: 25,
  },
  chip: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    gap: 6,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingInline: 8,
    height: 32,
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
});
export function ResultFilterChips({
  filters: f,
  onChange,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const bands: [string, keyof Filters, keyof Filters][] = [
    ['Price', 'minPrice', 'maxPrice'],
    ['First registration', 'minYear', 'maxYear'],
    ['Mileage', 'minMileage', 'maxMileage'],
    ['Power', 'minPower', 'maxPower'],
  ];
  return (
    <div {...stylex.props(s.strip)} aria-label="Active search filters">
      <Button href="/search" icon="filter" compact>
        Filter
      </Button>
      {f.makes.map((make) => {
        const summary = makeSelectionSummary(f, make);
        return (
          <button
            type="button"
            key={make}
            aria-label={'Remove ' + make}
            {...stylex.props(s.chip)}
            onClick={() => onChange(removeMakeSelection(f, make))}
          >
            {make}
            {summary !== 'Any' ? ' ' + summary : ''}
            <Icon name="close" size={18} />
          </button>
        );
      })}
      <button
        type="button"
        {...stylex.props(s.chip)}
        aria-label="Reset payment type to Buy"
        onClick={() => onChange({ payment: 'buy' })}
      >
        Payment type: {f.payment === 'buy' ? 'Buy' : 'Leasing'}
        <Icon name="close" size={18} />
      </button>
      {(f.excludeDamaged || f.damagedOnly) && (
        <button
          type="button"
          {...stylex.props(s.chip)}
          aria-label="Remove damaged vehicle filter"
          onClick={() => onChange({ excludeDamaged: false, damagedOnly: false })}
        >
          Damaged Vehicles: {f.damagedOnly ? 'Show only' : 'Do not show'}
          <Icon name="close" size={18} />
        </button>
      )}
      {f.deal && (
        <button
          type="button"
          {...stylex.props(s.chip)}
          onClick={() => onChange({ deal: false })}
          aria-label="Remove Deals"
        >
          Deals
          <Icon name="close" size={18} />
        </button>
      )}
      {excludedMakeNames(f).map((make) => (
        <button
          type="button"
          key={'excluded-' + make}
          {...stylex.props(s.chip)}
          aria-label={'Remove excluded ' + make}
          onClick={() => onChange(removeMakeSelection(f, make, true))}
        >
          {make} (excluded)
          {makeSelectionSummary(f, make, true) !== 'Any'
            ? ': ' + makeSelectionSummary(f, make, true)
            : ''}
          <Icon name="close" size={18} />
        </button>
      ))}
      {(['fuel', 'transmission', 'body', 'condition'] as const).flatMap((key) =>
        f[key].map((value) => (
          <button
            type="button"
            key={key + value}
            {...stylex.props(s.chip)}
            aria-label={'Remove ' + value}
            onClick={() => onChange({ [key]: f[key].filter((item) => item !== value) })}
          >
            {value}
            <Icon name="close" size={18} />
          </button>
        )),
      )}
      {bands
        .filter(([, min, max]) => f[min] || f[max])
        .map(([label, min, max]) => (
          <button
            type="button"
            key={label}
            {...stylex.props(s.chip)}
            aria-label={'Remove ' + label + ' range'}
            onClick={() => onChange({ [min]: '', [max]: '' })}
          >
            {label}: {String(f[min] || 'Any')} – {String(f[max] || 'Any')}
            <Icon name="close" size={18} />
          </button>
        ))}
    </div>
  );
}
