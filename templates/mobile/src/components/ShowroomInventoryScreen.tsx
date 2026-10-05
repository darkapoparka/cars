'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowDownUp,
  CalendarDays,
  Fuel,
  Settings2,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { defaultFilters, type Filters } from '@/lib/types';
import { filterVehicles, parseFilters, sortVehicles } from '@/lib/search';
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
import { showroomFilterTab, type ShowroomFilterTab } from '@/lib/showroom-filter-editor';
import { excludedMakeNames, makeSelectionSummary } from '@/lib/make-selection';
import { ShowroomFilterSheet } from './ShowroomFilterSheet';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearch } from './ShowroomSearch';
import { ShowroomDesktopHero } from './ShowroomDesktopHero';
import { ShowroomQuickPill, ShowroomQuickPills } from './ShowroomQuickPills';
import { ShowroomSortDialog } from './ShowroomSortDialog';
import { Button, ui } from './ui';

const s = stylex.create({
  categoryBar: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'none' },
    borderBottomWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  categoryChoice: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    display: { default: 'none', '@media (min-width: 1024px)': 'block' },
    fontSize: 14,
    lineHeight: '20px',
  },
  categoryImage: {
    display: 'block',
    width: { default: 64, '@media (min-width: 1024px)': 48 },
    height: { default: 40, '@media (min-width: 1024px)': 30 },
    objectFit: 'contain',
    flexShrink: 0,
  },
  search: {
    paddingTop: 4,
    display: { default: 'block', '@media (min-width: 1024px)': 'none' },
  },
  stockHeading: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stockTitle: { fontSize: 20, fontWeight: 700, lineHeight: '28px' },
  stockCount: { color: colors.muted, fontSize: 15, lineHeight: '24px' },
  stockMeta: { display: 'flex', alignItems: 'center', gap: 16 },
  stockSort: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingInline: 10,
    paddingBlock: 8,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    outlineColor: colors.accent,
    outlineOffset: -2,
  },
  stockClear: { minHeight: 44, color: colors.muted },
  pillWrapper: { display: 'contents' },
  phoneOnly: { display: { default: 'contents', '@media (min-width: 1024px)': 'none' } },
  desktopOnly: { display: { default: 'none', '@media (min-width: 1024px)': 'contents' } },
  controls: {
    position: { default: 'sticky', '@media (min-width: 1024px)': 'static' },
    top: 0,
    zIndex: 25,
    display: { default: 'flow-root', '@media (min-width: 1024px)': 'contents' },
    backgroundColor: colors.background,
  },
  quickBar: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'block' },
    position: { default: 'static', '@media (min-width: 1024px)': 'sticky' },
    top: 0,
    zIndex: 25,
    paddingBlock: { default: 0, '@media (min-width: 1024px)': 16 },
    backgroundColor: colors.background,
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
  pillText: {
    maxWidth: { default: 160, '@media (min-width: 1024px)': 'none' },
    flex: { default: 'initial', '@media (min-width: 1024px)': '1' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  pillIcon: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    flexShrink: 0,
    color: colors.muted,
  },
  content: {
    backgroundColor: colors.background,
    scrollMarginTop: { default: 0, '@media (min-width: 1024px)': 96 },
    paddingInline: 16,
    paddingTop: { default: 12, '@media (max-width: 699px)': 8 },
    paddingBottom: 24,
  },
  grid: {
    display: 'grid',
    gap: 14,
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 1024px)': 'repeat(4,minmax(0,1fr))',
    },
  },
  note: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    lineHeight: '20px',
    paddingTop: 24,
  },
});

export function ShowroomInventoryScreen() {
  const { t, locale, money } = useLocale();
  const params = useSearchParams();
  const query = params.toString();
  const filters = showroomFilters(parseFilters(query));
  const sort = showroomSorts.find(([value]) => value === params.get('sort'))?.[0] || 'standard';
  const [sorting, setSorting] = useState(false);
  const sheet = showroomFilterTab(params.get('filter'));
  const opener = useRef<HTMLButtonElement | null>(null);
  const category = showroomCategory(filters.category);
  const excludedNames = excludedMakeNames(filters);
  const stock = vehicles.filter((vehicle) => vehicle.category === filters.category);
  const results = sortVehicles(filterVehicles(stock, filters), sort);
  const active =
    showroomInventoryHref(filters) !==
    showroomInventoryHref({ ...defaultFilters, category: filters.category });
  const otherFilterCount = [
    filters.condition.length,
    filters.minMileage || filters.maxMileage,
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
  function openSheet(value: ShowroomFilterTab | 'sort', button: HTMLButtonElement) {
    opener.current = button;
    button.focus({ preventScroll: true });
    if (value === 'sort') setSorting(true);
    else {
      const url = new URL(window.location.href);
      url.searchParams.set('filter', value);
      window.history.pushState({ carsMobileFilterEditor: true }, '', url.pathname + url.search);
    }
  }
  function close() {
    setSorting(false);
    if (sheet) {
      if (window.history.state?.carsMobileFilterEditor) window.history.back();
      else window.history.replaceState(null, '', showroomInventoryHref(filters, sort));
    }
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }
  function selectFilterTab(value: ShowroomFilterTab) {
    const url = new URL(window.location.href);
    url.searchParams.set('filter', value);
    window.history.replaceState(
      window.history.state?.carsMobileFilterEditor ? { carsMobileFilterEditor: true } : null,
      '',
      url.pathname + url.search,
    );
  }
  function applyFilters(next: Filters) {
    change(next);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }
  const priceLabel =
    filters.minPrice || filters.maxPrice
      ? filters.minPrice && filters.maxPrice
        ? money(Number(filters.minPrice)) + '–' + money(Number(filters.maxPrice))
        : filters.maxPrice
          ? t('Up to') + ' ' + money(Number(filters.maxPrice))
          : t('From') + ' ' + money(Number(filters.minPrice))
      : 'Price';
  const yearLabel =
    filters.minYear || filters.maxYear
      ? filters.minYear && filters.maxYear
        ? filters.minYear + '–' + filters.maxYear
        : filters.minYear
          ? t('From') + ' ' + filters.minYear
          : t('To') + ' ' + filters.maxYear
      : 'Year';
  const pills: {
    key: ShowroomFilterTab | 'gearbox';
    label: string;
    active: boolean;
    name: string;
    icon?: LucideIcon;
  }[] = [
    {
      key: 'make',
      label:
        filters.makes.length === 1 && filters.models.length
          ? filters.makes[0] + ' · ' + makeSelectionSummary(filters, filters.makes[0])
          : filters.makes.join(', ') ||
            (excludedNames.length ? 'Exclude ' + excludedNames.join(', ') : 'Make & model'),
      active: Boolean(filters.makes.length || excludedNames.length || filters.models.length),
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
      icon: CalendarDays,
    },
    {
      key: 'fuel',
      label: filters.fuel.map(t).join(', ') || 'Fuel',
      active: Boolean(filters.fuel.length),
      name: 'Fuel',
      icon: Fuel,
    },
    {
      key: 'gearbox',
      label: filters.transmission.map(t).join(', ') || 'Gearbox',
      active: filters.transmission.length > 0,
      name: 'Gearbox',
      icon: Settings2,
    },
    {
      key: 'more',
      label: 'More',
      active: otherFilterCount > 0,
      name: 'More',
      icon: SlidersHorizontal,
    },
  ];
  return (
    <>
      <Header home showLanguageSwitcher sticky={false} />
      <ShowroomDesktopHero
        category={filters.category}
        query={filters.query}
        makeLabel={pills[0].active ? t(pills[0].label) : t('All makes')}
        priceLabel={t(filters.minPrice || filters.maxPrice ? priceLabel : 'Any price')}
        resultLabel={
          t('Show ') +
          results.length +
          ' ' +
          t(results.length === 1 ? category.singular : category.plural)
        }
        sheet={sheet}
        onSelectCategory={selectCategory}
        onOpen={openSheet}
        onBrowse={() => {
          const stock = document.getElementById('showroom-stock');
          stock?.focus({ preventScroll: true });
          stock?.scrollIntoView({
            block: 'start',
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          });
        }}
      />
      <div {...stylex.props(s.search)}>
        <ShowroomSearch
          label={t('Search make or model')}
          value={filters.query}
          onOpen={(button) => openSheet('search', button)}
        />
      </div>
      <section
        aria-label={t('Find a vehicle')}
        data-showroom-controls
        {...stylex.props(s.controls)}
      >
        <div {...stylex.props(s.categoryBar)}>
          <ShowroomTabs
            label={t('Vehicle category')}
            variant="icon"
            tone="neutral"
            layout="desktop-categories"
            tabs={showroomCategories.map(({ value, label, image }) => ({
              value,
              label,
              content: (
                <span {...stylex.props(s.categoryChoice)}>
                  <Image
                    src={image}
                    alt=""
                    width={64}
                    height={40}
                    sizes="64px"
                    loading="eager"
                    draggable={false}
                    {...stylex.props(s.categoryImage)}
                  />
                  <span {...stylex.props(s.categoryLabel)}>{t(label)}</span>
                </span>
              ),
            }))}
            selected={filters.category}
            panelId="showroom-stock"
            idPrefix="category-"
            onChange={selectCategory}
          />
        </div>
        <div data-desktop-quick-bar {...stylex.props(s.quickBar)}>
          <ShowroomQuickPills label={t('Quick filters')} fillDesktop>
            <div {...stylex.props(s.phoneOnly)}>
              <ShowroomQuickPill
                aria-label={t('Sort') + ' · ' + t(category.plural) + ': ' + t(sortLabel)}
                aria-haspopup="dialog"
                aria-expanded={sorting}
                active={sort !== 'standard'}
                onClick={(event) => openSheet('sort', event.currentTarget)}
              >
                <ArrowDownUp size={16} strokeWidth={1.8} aria-hidden="true" />
                {t(compactSortLabel)}
              </ShowroomQuickPill>
            </div>
            {pills.map((pill) => (
              <div
                key={pill.key}
                {...stylex.props(
                  s.pillWrapper,
                  pill.key === 'gearbox' && s.desktopOnly,
                  (pill.key === 'make' || pill.key === 'price') && s.phoneOnly,
                )}
              >
                <ShowroomQuickPill
                  type="button"
                  data-quick-filter={pill.key}
                  aria-label={
                    t(pill.name) + ' · ' + t('Filters') + (pill.active ? ': ' + t(pill.label) : '')
                  }
                  aria-haspopup="dialog"
                  aria-describedby={
                    pill.key === 'more' && otherFilterCount > 0
                      ? 'showroom-filter-count'
                      : undefined
                  }
                  onClick={(event) =>
                    openSheet(pill.key === 'gearbox' ? 'more' : pill.key, event.currentTarget)
                  }
                  active={pill.active}
                  fillDesktop
                >
                  {pill.icon && (
                    <span aria-hidden="true" {...stylex.props(s.pillIcon)}>
                      <pill.icon size={18} strokeWidth={1.8} />
                    </span>
                  )}
                  <span {...stylex.props(s.pillText)}>{t(pill.label)}</span>
                  {pill.key === 'more' && otherFilterCount > 0 && (
                    <>
                      <span aria-hidden="true" {...stylex.props(s.filterCount)}>
                        {otherFilterCount}
                      </span>
                      <span id="showroom-filter-count" {...stylex.props(ui.srOnly)}>
                        {otherFilterCount} active {otherFilterCount === 1 ? 'filter' : 'filters'}
                      </span>
                    </>
                  )}
                  <Icon name="down" size={14} />
                </ShowroomQuickPill>
              </div>
            ))}
            {active && (
              <div {...stylex.props(s.phoneOnly)}>
                <ShowroomQuickPill aria-label={t('Clear filters')} onClick={reset}>
                  {t('Clear')}
                  <Icon name="close" size={14} />
                </ShowroomQuickPill>
              </div>
            )}
          </ShowroomQuickPills>
        </div>
      </section>
      <section
        id="showroom-stock"
        tabIndex={-1}
        role="tabpanel"
        aria-labelledby={'category-' + filters.category}
        {...stylex.props(s.content)}
      >
        <h1 aria-live="polite" {...stylex.props(ui.srOnly)}>
          {results.length} {t(results.length === 1 ? category.singular : category.plural)}
        </h1>
        <div {...stylex.props(s.stockHeading)}>
          <h2 {...stylex.props(s.stockTitle)}>{t('In this showroom')}</h2>
          <div {...stylex.props(s.stockMeta)}>
            <span aria-live="polite" {...stylex.props(s.stockCount)}>
              {results.length} {t(results.length === 1 ? category.singular : category.plural)}
            </span>
            {active && (
              <button
                type="button"
                data-desktop-clear-filters
                aria-label={t('Clear filters')}
                onClick={reset}
                {...stylex.props(s.stockSort, s.stockClear)}
              >
                <Icon name="close" size={16} />
                {t('Clear')}
              </button>
            )}
            <button
              type="button"
              data-desktop-sort
              aria-label={t('Sort') + ' · ' + t(category.plural) + ': ' + t(sortLabel)}
              aria-haspopup="dialog"
              aria-expanded={sorting}
              onClick={(event) => openSheet('sort', event.currentTarget)}
              {...stylex.props(s.stockSort)}
            >
              <ArrowDownUp size={16} strokeWidth={1.8} aria-hidden="true" />
              {t(compactSortLabel)}
              <Icon name="down" size={14} />
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
                ? locale === 'bg'
                  ? 'Няма резултати за тези филтри'
                  : 'No ' + category.plural + ' match these filters'
                : locale === 'bg'
                  ? 'Все още няма предложения в тази категория'
                  : 'No ' + category.plural + ' listed yet'}
            </h2>
            <p>
              {stock.length
                ? t('Try another make, a wider budget or fewer filters.')
                : t('Choose another vehicle category to browse this showroom’s inventory.')}
            </p>
            <Button onClick={stock.length ? reset : () => selectCategory('car')}>
              {stock.length
                ? t('Show') + ' ' + t('All').toLowerCase() + ' ' + t(category.plural)
                : t('View cars')}
            </Button>
          </div>
        )}
        <p {...stylex.props(s.note)}>{t('Sample inventory · Showroom template preview')}</p>
      </section>
      {sheet && (
        <ShowroomFilterSheet
          sheet={sheet}
          filters={filters}
          onApply={applyFilters}
          onClose={close}
          onTabChange={selectFilterTab}
        />
      )}
      <ShowroomSortDialog
        open={sorting}
        categoryLabel={category.plural}
        value={sort}
        onClose={close}
        onChange={(value) => {
          change({}, value);
          close();
        }}
      />
    </>
  );
}
