'use client';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { RangeField } from './RangeField';
import { Button, CheckRow, IconButton, Modal } from './ui';

export type ShowroomSheet = 'price' | 'year' | 'fuel' | 'all';
const titles = { price: 'Price', year: 'Year', fuel: 'Fuel', all: 'Filters' };
const stock = vehicles.filter((vehicle) => vehicle.category === 'car');
const fuels = [...new Set(stock.map((vehicle) => vehicle.fuel))];
const transmissions = [...new Set(stock.map((vehicle) => vehicle.transmission))];
const bodies = [...new Set(stock.map((vehicle) => vehicle.body))];
const s = stylex.create({
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 700, lineHeight: '30px' },
  fields: { display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 24 },
  fieldTitle: { fontSize: 16, fontWeight: 700, lineHeight: '24px', marginBottom: 8 },
  make: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.background,
    color: colors.text,
    textAlign: 'left',
    fontSize: 16,
  },
  footer: {
    position: 'sticky',
    bottom: -24,
    backgroundColor: colors.background,
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0,1fr)',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
  },
});

function Choices({
  title,
  field,
  options,
  filters,
  onChange,
}: {
  title: string;
  field: 'fuel' | 'transmission' | 'body';
  options: string[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  return (
    <section>
      <h3 {...stylex.props(s.fieldTitle)}>{title}</h3>
      {options.map((value) => (
        <CheckRow
          key={value}
          checked={filters[field].includes(value)}
          onChange={(checked) =>
            onChange({
              [field]: checked
                ? [...filters[field], value]
                : filters[field].filter((choice) => choice !== value),
            })
          }
        >
          {value}
        </CheckRow>
      ))}
    </section>
  );
}

export function ShowroomFilterSheet({
  sheet,
  filters,
  count,
  onChange,
  onClose,
  onMake,
  onReset,
}: {
  sheet: ShowroomSheet;
  filters: Filters;
  count: number;
  onChange: (patch: Partial<Filters>) => void;
  onClose: () => void;
  onMake: () => void;
  onReset: () => void;
}) {
  const all = sheet === 'all';
  return (
    <Modal open onClose={onClose} label={titles[sheet]} sheet>
      <div {...stylex.props(s.heading)}>
        <h2 {...stylex.props(s.title)}>{titles[sheet]}</h2>
        <IconButton icon="close" label="Close filters" onClick={onClose} />
      </div>
      <div {...stylex.props(s.fields)}>
        {all && (
          <section>
            <h3 {...stylex.props(s.fieldTitle)}>Make &amp; model</h3>
            <button type="button" onClick={onMake} {...stylex.props(s.make)}>
              <span>
                {filters.makes.join(', ') || 'Any make'}
                {filters.models.length ? ' · ' + filters.models.join(', ') : ''}
              </span>
              <Icon name="right" size={20} />
            </button>
          </section>
        )}
        {(all || sheet === 'price') && (
          <RangeField
            label="Price"
            floor={0}
            ceiling={100000}
            step={500}
            unit="€"
            min={filters.minPrice}
            max={filters.maxPrice}
            onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />
        )}
        {(all || sheet === 'year') && (
          <RangeField
            label="Year"
            floor={1980}
            ceiling={2026}
            min={filters.minYear}
            max={filters.maxYear}
            onChange={(minYear, maxYear) => onChange({ minYear, maxYear })}
          />
        )}
        {all && (
          <RangeField
            label="Mileage"
            floor={0}
            ceiling={200000}
            step={5000}
            unit="km"
            min={filters.minMileage}
            max={filters.maxMileage}
            onChange={(minMileage, maxMileage) => onChange({ minMileage, maxMileage })}
          />
        )}
        {(all || sheet === 'fuel') && (
          <Choices
            title="Fuel"
            field="fuel"
            options={fuels}
            filters={filters}
            onChange={onChange}
          />
        )}
        {all && (
          <>
            <Choices
              title="Transmission"
              field="transmission"
              options={transmissions}
              filters={filters}
              onChange={onChange}
            />
            <Choices
              title="Body type"
              field="body"
              options={bodies}
              filters={filters}
              onChange={onChange}
            />
          </>
        )}
      </div>
      <div {...stylex.props(s.footer)}>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onClose}>
          Show {count} {count === 1 ? 'car' : 'cars'}
        </Button>
      </div>
    </Modal>
  );
}
