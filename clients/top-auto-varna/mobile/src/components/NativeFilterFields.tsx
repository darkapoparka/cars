'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Filters } from '@/lib/types';
import { updateFilters } from '@/lib/store';
import { vehicles } from '@/lib/catalog';
import { nativeFilterOptions } from '@/lib/native-filter-options';
import nativeCountries from '@/lib/native-data/countries.json';
import { Button, Modal, ui } from './ui';
import { Icon } from './Icon';
import { RangeField } from './RangeField';
const s = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontSize: 16, fontWeight: 700, lineHeight: '24px', marginBottom: 12 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 8,
    paddingBlock: 6,
    paddingInline: 10,
    minHeight: 32,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 14,
    lineHeight: '18px',
  },
  selected: { borderColor: colors.purpleLine, backgroundColor: colors.deepPurple, color: '#fff' },
  inlineMore: { width: 'auto' },
  more: {
    backgroundColor: 'transparent',
    color: colors.accent,
    borderColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    borderWidth: 0,
  },
  segments: { display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 8 },
  segment: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    height: 36,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 700,
    color: colors.text,
  },
  first: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  last: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  chosen: { borderColor: colors.purpleLine, borderWidth: 1.5 },
  select: {
    display: 'flex',
    width: '100%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 8,
    paddingInline: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  locate: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.purple,
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 700,
    fontSize: 14,
  },
  list: { maxHeight: '55dvh', overflowY: 'auto' },
  option: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    minHeight: 48,
    gap: 12,
    textAlign: 'left',
    fontSize: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    backgroundColor: 'transparent',
    color: colors.text,
  },
  input: { height: 44 },
});
export function FilterChips({
  label,
  options,
  selected,
  onChange,
  initialCount,
  moreInline = false,
}: {
  label?: string;
  options: (string | [string, string])[];
  selected: string[];
  onChange: (selected: string[]) => void;
  initialCount?: number;
  moreInline?: boolean;
}) {
  const [all, setAll] = useState(false);
  const visible = initialCount && !all ? options.slice(0, initialCount) : options;
  return (
    <div>
      {label && <h3 {...stylex.props(s.title)}>{label}</h3>}
      <div {...stylex.props(s.chips)}>
        {visible.map((option) => {
          const [value, text] = Array.isArray(option) ? option : [option, option];
          return (
            <button
              type="button"
              key={value}
              aria-pressed={selected.includes(value)}
              onClick={() =>
                onChange(
                  selected.includes(value)
                    ? selected.filter((x) => x !== value)
                    : [...selected, value],
                )
              }
              {...stylex.props(s.chip, selected.includes(value) && s.selected)}
            >
              {text}
            </button>
          );
        })}
        {initialCount && options.length > initialCount && (
          <button
            type="button"
            onClick={() => setAll(!all)}
            {...stylex.props(s.chip, s.more, moreInline && s.inlineMore)}
          >
            {all ? 'Show less' : 'Show all'}
          </button>
        )}
      </div>
    </div>
  );
}
export function ConditionFields({ filters: f }: { filters: Filters }) {
  return (
    <div {...stylex.props(s.stack)}>
      <RangeField
        label="First Registration"
        floor={1980}
        ceiling={2026}
        min={f.minYear}
        max={f.maxYear}
        onChange={(minYear, maxYear) => updateFilters({ minYear, maxYear })}
      />
      <RangeField
        label="Mileage"
        floor={0}
        ceiling={200000}
        step={5000}
        unit="km"
        min={f.minMileage}
        max={f.maxMileage}
        onChange={(minMileage, maxMileage) => updateFilters({ minMileage, maxMileage })}
      />
    </div>
  );
}
export function FinancialFields({ filters: f }: { filters: Filters }) {
  const lease = f.payment === 'lease';
  return (
    <div {...stylex.props(s.stack)}>
      <div {...stylex.props(s.segments)}>
        {(['buy', 'lease'] as const).map((value, i) => (
          <button
            type="button"
            key={value}
            aria-pressed={f.payment === value}
            onClick={() => updateFilters({ payment: value })}
            {...stylex.props(
              s.segment,
              i === 0 ? s.first : s.last,
              f.payment === value && s.chosen,
            )}
          >
            {i === 0 ? 'Purchase' : 'Leasing'}
          </button>
        ))}
      </div>
      <RangeField
        key={f.payment}
        label={lease ? 'Leasing rate' : 'Price'}
        floor={0}
        ceiling={lease ? 2000 : 100000}
        step={lease ? 10 : 500}
        unit="€"
        min={lease ? f.minLease : f.minPrice}
        max={lease ? f.maxLease : f.maxPrice}
        onChange={(min, max) =>
          updateFilters(lease ? { minLease: min, maxLease: max } : { minPrice: min, maxPrice: max })
        }
      />
    </div>
  );
}
export function TechnicalFields({ filters: f }: { filters: Filters }) {
  return (
    <div {...stylex.props(s.stack)}>
      <FilterChips
        label="Transmission"
        options={nativeFilterOptions.transmission.options}
        selected={f.transmission}
        onChange={(transmission) => updateFilters({ transmission })}
      />
      <FilterChips
        label="Fuel type"
        options={
          f.category === 'bike'
            ? ['Petrol', 'Diesel', 'Electric', 'Other fuel type']
            : nativeFilterOptions.fuel.options
        }
        initialCount={5}
        selected={f.fuel}
        onChange={(fuel) => updateFilters({ fuel })}
      />
      <RangeField
        label="Power"
        floor={0}
        ceiling={600}
        step={10}
        unit="hp"
        min={f.minPower}
        max={f.maxPower}
        onChange={(minPower, maxPower) => updateFilters({ minPower, maxPower })}
      />
    </div>
  );
}
export const countries = nativeCountries.countries.map((country) => country.name);
export function LocationFields({
  filters: f,
  onChange = updateFilters,
}: {
  filters: Filters;
  onChange?: (patch: Partial<Filters>) => void;
}) {
  const [dialog, setDialog] = useState<'country' | 'city' | 'location' | null>(null);
  const [query, setQuery] = useState('');
  const choices = dialog === 'country' ? countries : [...new Set(vehicles.map((v) => v.location))];
  return (
    <div {...stylex.props(s.stack)}>
      <label {...stylex.props(ui.label)}>
        <strong>Country</strong>
        <button
          type="button"
          aria-label="Open country selection"
          onClick={() => {
            setQuery('');
            setDialog('country');
          }}
          {...stylex.props(s.select)}
        >
          {f.country || 'Any'}
          <Icon name="down" size={18} />
        </button>
      </label>
      <div>
        <label {...stylex.props(ui.label)}>
          <strong>City or zip code</strong>
          <button
            type="button"
            onClick={() => {
              setQuery(f.location);
              setDialog('city');
            }}
            {...stylex.props(s.select)}
          >
            {f.location || 'Enter city or zip code'}
            <Icon name="search" size={18} />
          </button>
        </label>
        <button type="button" onClick={() => setDialog('location')} {...stylex.props(s.locate)}>
          <Icon name="pin" size={18} />
          Use current location
        </button>
      </div>
      <Modal
        open={dialog !== null}
        title={
          dialog === 'country'
            ? 'Country'
            : dialog === 'city'
              ? 'City or zip code'
              : 'Use current location'
        }
        onClose={() => setDialog(null)}
      >
        {dialog === 'location' ? (
          <div {...stylex.props(ui.column)}>
            <p>
              Live location search is not connected. Select a city from the captured vehicle
              locations or enter a postal code.
            </p>
            <Button
              onClick={() => {
                setQuery('');
                setDialog('city');
              }}
              variant="purple"
            >
              Choose location
            </Button>
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div {...stylex.props(ui.column)}>
            <input
              autoFocus
              aria-label={dialog === 'country' ? 'Search countries' : 'City or zip code'}
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              {...stylex.props(ui.input, s.input)}
            />
            <div {...stylex.props(s.list)}>
              <button
                type="button"
                onClick={() => {
                  onChange(dialog === 'country' ? { country: '' } : { location: '' });
                  setDialog(null);
                }}
                {...stylex.props(s.option)}
              >
                Any
              </button>
              {choices
                .filter((x) => x.toLowerCase().includes(query.toLowerCase()))
                .map((x) => (
                  <button
                    type="button"
                    key={x}
                    onClick={() => {
                      onChange(dialog === 'country' ? { country: x } : { location: x });
                      setDialog(null);
                    }}
                    {...stylex.props(s.option)}
                  >
                    {x}
                  </button>
                ))}
            </div>
            {dialog === 'city' && (
              <Button
                onClick={() => {
                  onChange({ location: query });
                  setDialog(null);
                }}
                variant="purple"
              >
                Apply location
              </Button>
            )}
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
