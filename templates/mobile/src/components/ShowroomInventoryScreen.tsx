'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Button, IconButton, Modal, ui } from './ui';

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
  tabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
    height: 48,
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
    paddingInline: 2,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.muted,
    fontSize: 15,
    fontWeight: 500,
  },
  chosenTab: {
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
  const category = showroomCategory(filters.category);
  const stock = vehicles.filter((vehicle) => vehicle.category === filters.category);
  const stockMakes = [...new Set(stock.map((vehicle) => vehicle.make))];
  const results = sortVehicles(filterVehicles(stock, filters), sort);
  const active =
    showroomInventoryHref(filters) !==
    showroomInventoryHref({ ...defaultFilters, category: filters.category });
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
      <section aria-label="Find a vehicle" {...stylex.props(s.controls)}>
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
        <div role="tablist" aria-label="Vehicle category" {...stylex.props(s.tabs)}>
          {showroomCategories.map(({ value, label, icon }, index) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={'category-' + value}
              aria-controls="showroom-stock"
              aria-label={label}
              aria-selected={filters.category === value}
              tabIndex={filters.category === value ? 0 : -1}
              title={label}
              onClick={() => selectCategory(value)}
              onKeyDown={(event) => {
                const next =
                  event.key === 'ArrowRight'
                    ? (index + 1) % showroomCategories.length
                    : event.key === 'ArrowLeft'
                      ? (index + showroomCategories.length - 1) % showroomCategories.length
                      : event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? showroomCategories.length - 1
                          : null;
                if (next === null) return;
                event.preventDefault();
                selectCategory(showroomCategories[next].value);
                event.currentTarget.parentElement
                  ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                  [next]?.focus({ preventScroll: true });
              }}
              {...stylex.props(s.tab, filters.category === value && s.chosenTab)}
            >
              <Icon name={icon} size={40} />
            </button>
          ))}
        </div>
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
          <div {...stylex.props(ui.row)}>
            {active && (
              <button type="button" onClick={reset} {...stylex.props(s.reset)}>
                Clear filters
              </button>
            )}
            <button
              type="button"
              aria-label={
                'Sort ' +
                category.plural +
                ': ' +
                showroomSorts.find(([value]) => value === sort)?.[1]
              }
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
