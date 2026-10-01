'use client';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { categoryVehicleTypes, truckCategories } from '@/lib/categories';
import { updateFilters } from '@/lib/store';
import { colors } from '@/styles/tokens.stylex';
import { FilterChips } from './NativeFilterFields';
const s = stylex.create({
  trucks: {
    margin: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  truck: {
    minHeight: 105,
    borderWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: 'transparent',
    padding: 12,
    paddingTop: 4,
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
    minWidth: 0,
  },
  truckArt: { width: '100%', height: 57, objectFit: 'contain' },
  name: { display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  stack: { display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24 },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
  },
  current: { fontSize: 14, fontWeight: 400 },
  slider: { width: '100%', height: 48, accentColor: colors.deepPurple, marginTop: 16 },
});
export function TruckChooser({ filters: f }: { filters: Filters }) {
  return (
    <div {...stylex.props(s.trucks)}>
      {truckCategories.map((name, i) => (
        <button
          key={name}
          type="button"
          onClick={() =>
            updateFilters({
              details: [
                ...f.details.filter((v) => !v.startsWith('truckCategory=')),
                'truckCategory=' + name,
              ],
            })
          }
          {...stylex.props(s.truck)}
        >
          <Image
            src={'/images/categories/truck-' + i + '.webp'}
            alt=""
            width={390}
            height={170}
            {...stylex.props(s.truckArt)}
          />
          <span {...stylex.props(s.name)}>{name}</span>
        </button>
      ))}
    </div>
  );
}
export function CategoryTypes({ filters: f }: { filters: Filters }) {
  return (
    <FilterChips
      options={categoryVehicleTypes[f.category] || []}
      selected={f.body}
      initialCount={5}
      moreInline
      onChange={(body) => updateFilters({ body })}
    />
  );
}
export function ElectricBikeTechnical({ filters: f }: { filters: Filters }) {
  const fields: [string, string, number, number, string][] = [
    ['frameSize', 'Frame size', 80, 1, ' cm'],
    ['gearsFrom', 'Gears from', 30, 1, ''],
    ['batteryFrom', 'Battery capacity from', 1500, 50, ' Wh'],
  ];
  return (
    <div {...stylex.props(s.stack)}>
      {fields.map(([key, label, max, step, unit]) => {
        const value = f.details.find((v) => v.startsWith(key + '='))?.split('=')[1] || '';
        return (
          <section key={key}>
            <label {...stylex.props(s.rangeLabel)} htmlFor={'ebike-' + key}>
              {label}
              <span {...stylex.props(s.current)}>{value ? value + unit : 'Any'}</span>
            </label>
            <input
              id={'ebike-' + key}
              type="range"
              min={0}
              max={max}
              step={step}
              value={value || 0}
              onChange={(e) =>
                updateFilters({
                  details: [
                    ...f.details.filter((v) => !v.startsWith(key + '=')),
                    ...(Number(e.target.value) ? [key + '=' + e.target.value] : []),
                  ],
                })
              }
              {...stylex.props(s.slider)}
            />
          </section>
        );
      })}
    </div>
  );
}
