'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { defaultFilters, type Filters } from '@/lib/types';
import { filterVehicles, money, parseFilters, sortVehicles } from '@/lib/search';
import { patchState, switchVehicleCategory } from '@/lib/store';
import {
  restoreInventoryPosition,
  showroomCategories,
  showroomCategory,
  showroomFilters,
  showroomInventoryHref,
  showroomSorts,
} from '@/lib/showroom';
import { Header } from './Header';
import { Icon } from './Icon';
import { MakePicker } from './MakePicker';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ShowroomFilterSheet, type ShowroomSheet } from './ShowroomFilterSheet';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearch } from './ShowroomSearch';
import { Button, IconButton, Modal, ui } from './ui';

const s = stylex.create({
  controls: {
    position: 'sticky',
    top: 60,
    zIndex: 25,
    backgroundColor: colors.background,
    paddingTop: 4,
  },
  filterRow: { display: 'flex', alignItems: 'center', gap: 8, paddingBlock: 6, paddingLeft: 16 },
  filterScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingRight: 16,
    minWidth: 0,
    paddingBlock: 2,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingInline: 12,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 24,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  filterCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    minHeight: 20,
    paddingInline: 4,
    borderRadius: 20,
    backgroundColor: '#db3000',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '20px',
  },
  selectedPill: {
    backgroundColor: colors.activeSurface,
    borderColor: colors.accent,
    color: colors.accent,
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
  actions: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, maxWidth: '100%' },
  sort: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    maxWidth: '100%',
    borderWidth: 0,
    borderRadius: 8,
    paddingInline: 4,
    paddingBlock: 6,
    backgroundColor: 'transparent',
    color: colors.muted,
    fontSize: 14,
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gap: 14,
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
  },
  reset: {
    minHeight: 44,
    minWidth: 44,
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
  const category = showroomCategory(filters.category);
  const stock = vehicles.filter((vehicle) => vehicle.category === filters.category);
  const stockMakes = [...new Set(stock.map((vehicle) => vehicle.make))];
  const results = sortVehicles(filterVehicles(stock, filters), sort);
  const active =
    showroomInventoryHref(filters) !==
    showroomInventoryHref({ ...defaultFilters, category: filters.category });
  const activeFilterCount = [
    filters.makes.length || filters.excludedMakes.length || filters.models.length,
    filters.condition.length,
    filters.minPrice || filters.maxPrice,
    filters.minYear || filters.maxYear,
    filters.minMileage || filters.maxMileage,
    filters.fuel.length,
    filters.transmission.length,
    filters.body.length,
    filters.color.length,
    filters.minPower || filters.maxPower,
    filters.seats || filters.maxSeats,
    filters.doors,
    filters.features.length,
    filters.details.length,
    filters.deal,
    filters.damagedOnly || !filters.excludeDamaged,
  ].filter(Boolean).length;
  const sortLabel = showroomSorts.find(([value]) => value === sort)?.[1] || 'Recommended';
  const compactSortLabel = {
    standard: 'Sort',
    'price-asc': 'Price ↑',
    'price-desc': 'Price ↓',
    newest: 'Newest',
    mileage: 'Low mileage',
  }[sort];
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
    change({ ...structuredClone(defaultFilters), category: filters.category });
  }
  function selectCategory(value: Filters['category']) {
    if (value === filters.category) return;
    const next = showroomFilters(switchVehicleCategory(value));
    window.history.replaceState(null, '', showroomInventoryHref(next, sort));
    patchState({ filters: next, inventorySort: sort });
    window.scrollTo(0, 0);
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
  function closeMake() {
    if (returnToFilters) {
      setSheet('all');
      setReturnToFilters(false);
    } else close();
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
      label: filters.makes.join(', ') || 'Make',
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
      <section aria-label="Find a vehicle" {...stylex.props(s.controls)}>
        <ShowroomSearch
          label="Search make or model"
          value={filters.query}
          onChange={(query) => change({ query })}
        />
        <ShowroomTabs
          label="Vehicle category"
          tabs={showroomCategories.map(({ value, label, icon }) => ({
            value,
            label,
            content: <Icon name={icon} size={40} />,
          }))}
          selected={filters.category}
          panelId="showroom-stock"
          idPrefix="category-"
          onChange={selectCategory}
        />
        <div {...stylex.props(s.filterRow)}>
          <button
            type="button"
            aria-label="Filters"
            aria-describedby={activeFilterCount > 0 ? 'showroom-filter-count' : undefined}
            aria-haspopup="dialog"
            onClick={(event) => openSheet('all', event.currentTarget)}
            {...stylex.props(s.pill, activeFilterCount > 0 && s.selectedPill)}
          >
            <SlidersHorizontal size={18} strokeWidth={2} aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <>
                <span aria-hidden="true" {...stylex.props(s.filterCount)}>
                  {activeFilterCount}
                </span>
                <span id="showroom-filter-count" {...stylex.props(ui.srOnly)}>
                  {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                </span>
              </>
            )}
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
      <section
        id="showroom-stock"
        role="tabpanel"
        aria-labelledby={'category-' + filters.category}
        {...stylex.props(s.content)}
      >
        <div {...stylex.props(s.toolbar)}>
          <h1 aria-live="polite" {...stylex.props(s.count)}>
            {results.length} {results.length === 1 ? category.singular : category.plural}
          </h1>
          <div {...stylex.props(s.actions)}>
            {active && (
              <button
                type="button"
                aria-label="Clear filters"
                onClick={reset}
                {...stylex.props(s.reset)}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              aria-label={'Sort ' + category.plural + ': ' + sortLabel}
              aria-haspopup="dialog"
              onClick={(event) => openSheet('sort', event.currentTarget)}
              {...stylex.props(s.sort)}
            >
              <ArrowDownUp size={18} strokeWidth={1.8} aria-hidden="true" />
              {compactSortLabel}
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
            <Icon name={category.icon} size={40} />
            <h2 {...stylex.props(ui.title)}>
              {stock.length
                ? 'No ' + category.plural + ' match these filters'
                : 'No ' + category.plural + ' listed yet'}
            </h2>
            <p>
              {stock.length
                ? 'Try another make, a wider budget or fewer filters.'
                : 'Choose another vehicle category to browse this showroom’s inventory.'}
            </p>
            <Button onClick={stock.length ? reset : () => selectCategory('car')}>
              {stock.length ? 'Show all ' + category.plural : 'View cars'}
            </Button>
          </div>
        )}
        <p {...stylex.props(s.note)}>Sample inventory · Showroom template preview</p>
      </section>
      {sheet === 'make' && filters.category === 'car' && (
        <MakePicker
          open
          availableMakes={stockMakes}
          filters={filters}
          onApply={change}
          onClose={closeMake}
        />
      )}
      {sheet === 'make' && filters.category !== 'car' && (
        <CategoryMakePicker filters={filters} onApply={change} onClose={closeMake} />
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
      <Modal open={sheet === 'sort'} onClose={close} label={'Sort ' + category.plural}>
        <div {...stylex.props(s.modalHead)}>
          <h2 {...stylex.props(ui.title)}>Sort {category.plural}</h2>
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
