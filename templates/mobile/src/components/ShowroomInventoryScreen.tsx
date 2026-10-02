'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { defaultFilters, type Filters } from '@/lib/types';
import { filterVehicles, money, parseFilters, sortVehicles } from '@/lib/search';
import { patchState } from '@/lib/store';
import {
  restoreInventoryPosition,
  showroomFilters,
  showroomInventoryHref,
  showroomSorts,
} from '@/lib/showroom';
import { Header } from './Header';
import { Icon } from './Icon';
import { MakePicker } from './MakePicker';
import { ShowroomFilterSheet, type ShowroomSheet } from './ShowroomFilterSheet';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { Button, IconButton, Modal, ui } from './ui';

const stock = vehicles.filter((vehicle) => vehicle.category === 'car');
const stockMakes = [...new Set(stock.map((vehicle) => vehicle.make))];
const hasUsed = stock.some((vehicle) => vehicle.mileage > 0);
const hasNew = stock.some((vehicle) => vehicle.mileage === 0);
const s = stylex.create({
  controls: {
    position: 'sticky',
    top: 60,
    zIndex: 25,
    backgroundColor: colors.background,
    paddingTop: 4,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginInline: 16,
    paddingLeft: 16,
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 16,
    color: colors.muted,
  },
  input: {
    minWidth: 0,
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    paddingBlock: 14,
    outlineOffset: 3,
  },
  tabs: { display: 'flex', gap: 24, marginInline: 16, marginTop: 8 },
  tab: {
    minWidth: 48,
    minHeight: 48,
    paddingInline: 2,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
    color: colors.muted,
    fontSize: 15,
    fontWeight: 500,
  },
  chosenTab: { color: colors.accent, borderBottomColor: colors.accent, fontWeight: 700 },
  filterRow: { display: 'flex', alignItems: 'center', gap: 8, paddingBlock: 12, paddingLeft: 16 },
  filterScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingRight: 16,
    minWidth: 0,
    paddingBlock: 4,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingInline: 14,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 24,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  fixedFilter: {
    backgroundColor: colors.deepPurple,
    borderColor: colors.deepPurple,
    color: '#fff',
  },
  selectedPill: {
    backgroundColor: colors.assistant,
    borderColor: colors.purpleLine,
    color: colors.purple,
  },
  pillText: { maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' },
  content: { backgroundColor: colors.stripe, paddingInline: 16, paddingBottom: 24 },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    minHeight: 60,
  },
  count: { fontSize: 16, fontWeight: 700, lineHeight: '24px' },
  sort: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderWidth: 0,
    paddingInline: 8,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
  },
  reset: {
    minHeight: 44,
    paddingInline: 4,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.purple,
    fontSize: 14,
    fontWeight: 700,
  },
  note: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    lineHeight: '20px',
    paddingTop: 24,
  },
  modalHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  sortOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    fontSize: 16,
    paddingBlock: 8,
  },
  radio: { width: 22, height: 22, flexShrink: 0, accentColor: colors.accent },
});

export function ShowroomInventoryScreen() {
  const params = useSearchParams();
  const query = params.toString();
  const filters = showroomFilters(parseFilters(query));
  const sort = showroomSorts.find(([value]) => value === params.get('sort'))?.[0] || 'standard';
  const [sheet, setSheet] = useState<ShowroomSheet | 'make' | 'sort' | null>(null);
  const [returnToFilters, setReturnToFilters] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const results = sortVehicles(filterVehicles(stock, filters), sort);
  const condition = filters.condition.length === 1 ? filters.condition[0] : '';
  const active = showroomInventoryHref(filters) !== '/';
  useEffect(() => {
    patchState({ filters: showroomFilters(parseFilters(query)), inventorySort: sort });
  }, [query, sort]);
  useEffect(restoreInventoryPosition, []);

  function change(patch: Partial<Filters>, nextSort: string = sort) {
    const next = showroomFilters({ ...filters, ...patch });
    window.history.replaceState(null, '', showroomInventoryHref(next, nextSort));
    patchState({ filters: next, inventorySort: nextSort });
  }
  function reset() {
    change(structuredClone(defaultFilters));
  }
  function openSheet(value: ShowroomSheet | 'make' | 'sort', button: HTMLButtonElement) {
    opener.current = button;
    button.focus({ preventScroll: true });
    setSheet(value);
  }
  function close() {
    setSheet(null);
    setReturnToFilters(false);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }
  const priceLabel =
    filters.minPrice || filters.maxPrice
      ? filters.minPrice && filters.maxPrice
        ? money(Number(filters.minPrice)) + '–' + money(Number(filters.maxPrice))
        : filters.maxPrice
          ? 'Up to ' + money(Number(filters.maxPrice))
          : 'From ' + money(Number(filters.minPrice))
      : 'Price';
  const yearLabel =
    filters.minYear || filters.maxYear
      ? filters.minYear && filters.maxYear
        ? filters.minYear + '–' + filters.maxYear
        : filters.minYear
          ? 'From ' + filters.minYear
          : 'To ' + filters.maxYear
      : 'Year';
  const pills: { key: 'make' | ShowroomSheet; label: string; active: boolean; name: string }[] = [
    {
      key: 'make',
      label: filters.makes.join(', ') || 'Make & model',
      active: Boolean(filters.makes.length || filters.excludedMakes.length),
      name: 'Make and model',
    },
    {
      key: 'price',
      label: priceLabel,
      active: Boolean(filters.minPrice || filters.maxPrice),
      name: 'Price',
    },
    {
      key: 'year',
      label: yearLabel,
      active: Boolean(filters.minYear || filters.maxYear),
      name: 'Year',
    },
    {
      key: 'fuel',
      label: filters.fuel.join(', ') || 'Fuel',
      active: Boolean(filters.fuel.length),
      name: 'Fuel',
    },
  ];
  return (
    <>
      <Header home />
      <section aria-label="Find a car" {...stylex.props(s.controls)}>
        <div {...stylex.props(s.search)}>
          <Icon name="search" size={22} />
          <input
            type="search"
            aria-label="Search make or model"
            placeholder="Search make or model"
            value={filters.query}
            onChange={(event) => change({ query: event.target.value })}
            {...stylex.props(s.input)}
          />
          {filters.query ? (
            <IconButton icon="close" label="Clear search" onClick={() => change({ query: '' })} />
          ) : (
            <span {...stylex.props(ui.pad)} />
          )}
        </div>
        {hasUsed && hasNew && (
          <div role="group" aria-label="Stock condition" {...stylex.props(s.tabs)}>
            {[
              ['', 'All cars'],
              ['Used', 'Used'],
              ['New', 'New'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={condition === value}
                onClick={() => change({ condition: value ? [value] : [] })}
                {...stylex.props(s.tab, condition === value && s.chosenTab)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div {...stylex.props(s.filterRow)}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => openSheet('all', event.currentTarget)}
            {...stylex.props(s.pill, s.fixedFilter)}
          >
            <Icon name="filter" size={18} />
            Filters
          </button>
          <div aria-label="Quick filters" {...stylex.props(s.filterScroll)}>
            {pills.map((pill) => (
              <button
                key={pill.key}
                type="button"
                data-quick-filter={pill.key}
                aria-label={pill.name + ' filters' + (pill.active ? ': ' + pill.label : '')}
                aria-haspopup="dialog"
                onClick={(event) => openSheet(pill.key, event.currentTarget)}
                {...stylex.props(s.pill, pill.active && s.selectedPill)}
              >
                <span {...stylex.props(s.pillText)}>{pill.label}</span>
                <Icon name="down" size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section aria-label="Cars" {...stylex.props(s.content)}>
        <div {...stylex.props(s.toolbar)}>
          <h1 aria-live="polite" {...stylex.props(s.count)}>
            {results.length} {results.length === 1 ? 'car' : 'cars'}
          </h1>
          <div {...stylex.props(ui.row)}>
            {active && (
              <button type="button" onClick={reset} {...stylex.props(s.reset)}>
                Clear filters
              </button>
            )}
            <button
              type="button"
              aria-label={'Sort cars: ' + showroomSorts.find(([value]) => value === sort)?.[1]}
              aria-haspopup="dialog"
              onClick={(event) => openSheet('sort', event.currentTarget)}
              {...stylex.props(s.sort)}
            >
              <Icon name="sort" size={20} />
              Sort
            </button>
          </div>
        </div>
        {results.length ? (
          <div {...stylex.props(s.grid)}>
            {results.map((vehicle, index) => (
              <ShowroomVehicleCard key={vehicle.id} vehicle={vehicle} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <Icon name="car" size={40} />
            <h2 {...stylex.props(ui.title)}>No cars match these filters</h2>
            <p>Try another make, a wider budget or fewer filters.</p>
            <Button onClick={reset}>Show all cars</Button>
          </div>
        )}
        <p {...stylex.props(s.note)}>Sample inventory · Showroom template preview</p>
      </section>
      {sheet === 'make' && (
        <MakePicker
          open
          availableMakes={stockMakes}
          filters={filters}
          onApply={change}
          onClose={() => {
            if (returnToFilters) {
              setSheet('all');
              setReturnToFilters(false);
            } else close();
          }}
        />
      )}
      {sheet && sheet !== 'make' && sheet !== 'sort' && (
        <ShowroomFilterSheet
          sheet={sheet}
          filters={filters}
          count={results.length}
          onChange={change}
          onClose={close}
          onReset={reset}
          onMake={() => {
            setReturnToFilters(true);
            setSheet('make');
          }}
        />
      )}
      <Modal open={sheet === 'sort'} onClose={close} label="Sort cars">
        <div {...stylex.props(s.modalHead)}>
          <h2 {...stylex.props(ui.title)}>Sort cars</h2>
          <IconButton icon="close" label="Close sorting" onClick={close} />
        </div>
        {showroomSorts.map(([value, label]) => (
          <label key={value} {...stylex.props(s.sortOption)}>
            <input
              type="radio"
              name="showroom-sort"
              checked={sort === value}
              onChange={() => {
                change({}, value);
                close();
              }}
              {...stylex.props(s.radio)}
            />
            {label}
          </label>
        ))}
      </Modal>
    </>
  );
}
