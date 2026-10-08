'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
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
import {
  clearShowroomQuickFilter,
  showroomFilterTab,
  showroomMoreSection,
  type ShowroomFilterTab,
  type ShowroomMoreSection,
  type ShowroomQuickFilter,
} from '@/lib/showroom-filter-editor';
import {
  clearModelSelections,
  excludedMakeNames,
  makeSelectionSummary,
} from '@/lib/make-selection';
import { ShowroomFilterSheet } from './ShowroomFilterSheet';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomHeaderSurface } from './ShowroomHeaderSurface';
import { ShowroomSearch } from './ShowroomSearch';
import { ShowroomDesktopHero } from './ShowroomDesktopHero';
import { ShowroomBanner, ShowroomDrawer } from './ShowroomPageLayout';
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
  pillWrapper: { display: 'contents' },
  phoneOnly: { display: { default: 'contents', '@media (min-width: 1024px)': 'none' } },
  desktopOnly: { display: { default: 'none', '@media (min-width: 1024px)': 'contents' } },
  controls: {
    display: { default: 'flow-root', '@media (min-width: 1024px)': 'contents' },
    backgroundColor: { default: colors.background, '@media (max-width: 699px)': 'transparent' },
  },
  quickBar: {
    position: { default: 'sticky', '@media (min-width: 1024px)': 'static' },
    top: 0,
    zIndex: 25,
    flexShrink: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: { default: colors.background, '@media (min-width: 1024px)': 'transparent' },
  },
  desktopRail: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    minWidth: 0,
    backgroundColor: 'transparent',
    paddingInline: 0,
    paddingBlock: 0,
  },
  desktopActions: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    paddingInlineStart: 0,
    paddingInlineEnd: 0,
    paddingBlock: 0,
  },
  pillChevron: { display: { default: 'contents', '@media (min-width: 1024px)': 'none' } },
  emptyCount: { visibility: 'hidden' },
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
  desktopFilterCount: {
    position: { default: 'static', '@media (min-width: 1024px)': 'absolute' },
    top: 0,
    insetInlineEnd: 0,
    minWidth: { default: 20, '@media (min-width: 1024px)': 16 },
    minHeight: { default: 20, '@media (min-width: 1024px)': 16 },
    fontSize: { default: 12, '@media (min-width: 1024px)': 10 },
    lineHeight: { default: '20px', '@media (min-width: 1024px)': '16px' },
    backgroundColor: {
      default: colors.accent,
      '@media (min-width: 1024px)': colors.controlSurface,
    },
    color: { default: colors.background, '@media (min-width: 1024px)': colors.muted },
  },
  pillText: {
    maxWidth: { default: 160, '@media (min-width: 1024px)': 128 },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  pillIcon: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    flexShrink: 0,
  },
  desktopSortLabel: {
    display: { default: 'none', '@media (min-width: 1200px)': 'inline' },
  },
  content: {
    flexGrow: { default: 1, '@media (min-width: 1024px)': 0 },
    backgroundColor: { default: colors.background, '@media (min-width: 1024px)': 'transparent' },
    borderTopLeftRadius: { default: 0, '@media (max-width: 699px)': 24 },
    borderTopRightRadius: { default: 0, '@media (max-width: 699px)': 24 },
    scrollMarginTop: { default: 0, '@media (min-width: 1024px)': 96 },
    paddingInline: { default: 16, '@media (min-width: 1024px)': 0 },
    paddingTop: { default: 12, '@media (max-width: 699px)': 16, '@media (min-width: 1024px)': 16 },
    paddingBottom: 24,
  },
  grid: {
    display: 'grid',
    gap: { default: 14, '@media (min-width: 1024px)': showroomDesktop.cardGap },
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 1024px)': showroomDesktop.inventoryColumns,
      '@media (min-width: 1280px)': showroomDesktop.wideInventoryColumns,
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

function browseResults() {
  const stock = document.getElementById('showroom-stock');
  const desktop = window.matchMedia('(min-width: 1024px)').matches;
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant'
    : 'smooth';
  stock?.focus({ preventScroll: true });
  if (desktop && stock) {
    const quickBar = document.querySelector<HTMLElement>('[data-desktop-quick-bar]');
    const railHeight =
      quickBar && getComputedStyle(quickBar).position === 'sticky'
        ? quickBar.getBoundingClientRect().height
        : 0;
    window.scrollTo({
      top: Math.max(0, window.scrollY + stock.getBoundingClientRect().top - railHeight - 12),
      behavior,
    });
  } else {
    document.getElementById('showroom-results')?.scrollIntoView({ block: 'start', behavior });
  }
}

export function ShowroomInventoryScreen() {
  const { t, locale, money, number } = useLocale();
  const params = useSearchParams();
  const query = params.toString();
  const filters = showroomFilters(parseFilters(query));
  const sort = showroomSorts.find(([value]) => value === params.get('sort'))?.[0] || 'standard';
  const [sorting, setSorting] = useState(false);
  const [desktopFilterAnchor, setDesktopFilterAnchor] = useState<HTMLElement>();
  const [desktopKeyboardOpening, setDesktopKeyboardOpening] = useState(false);
  const sheet = showroomFilterTab(params.get('filter'));
  const desktopMakeView = params.get('picker') === 'model' ? 'model' : 'make';
  const moreSection = sheet === 'more' ? showroomMoreSection(params.get('section')) : null;
  const opener = useRef<{ button: HTMLButtonElement; scrollY: number } | null>(null);
  const browseAfterApply = useRef(false);
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
  useEffect(() => {
    if (sheet || sorting) return;
    const previous = opener.current;
    opener.current = null;
    if (browseAfterApply.current) {
      browseAfterApply.current = false;
      browseResults();
    } else if (previous) {
      // Restore after the dialog unlocks and native history traversal settles.
      const frame = requestAnimationFrame(() => {
        window.scrollTo({ top: previous.scrollY, behavior: 'instant' });
        previous.button.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [sheet, sorting]);

  function change(patch: Partial<Filters>, nextSort: string = sort) {
    const next = showroomFilters({ ...filters, ...patch });
    window.history.replaceState(null, '', showroomInventoryHref(next, nextSort));
    patchState({ filters: next, inventorySort: nextSort });
  }
  function reset() {
    change({ ...structuredClone(defaultFilters), category: filters.category });
  }
  function clearAppliedFilter(key: ShowroomQuickFilter | 'all' | 'more' | 'model') {
    if (key === 'all' || key === 'more') return;
    const removers = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-remove-selected-filter]'),
    );
    const index = removers.findIndex((button) => button.dataset.removeSelectedFilter === key);
    change(
      key === 'model' ? clearModelSelections(filters) : clearShowroomQuickFilter(filters, key),
    );
    requestAnimationFrame(() => {
      const remaining = document.querySelectorAll<HTMLButtonElement>(
        '[data-remove-selected-filter]',
      );
      const target =
        remaining[Math.min(Math.max(index, 0), remaining.length - 1)] ||
        document.querySelector<HTMLElement>('[data-quick-filter="all"]');
      target?.focus({ preventScroll: true });
    });
  }
  function selectCategory(value: Filters['category']) {
    if (value === filters.category) return;
    const next = showroomFilters(switchVehicleCategory(value));
    window.history.replaceState(null, '', showroomInventoryHref(next, sort));
    patchState({ filters: next, inventorySort: sort });
    window.scrollTo(0, 0);
  }
  function openSheet(
    value: ShowroomFilterTab | 'model' | 'sort',
    button: HTMLButtonElement,
    section?: ShowroomMoreSection,
    keyboardOpening = false,
  ) {
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (desktop && (sheet || sorting) && desktopFilterAnchor === button) {
      close();
      return;
    }
    opener.current = { button, scrollY: window.scrollY };
    setDesktopFilterAnchor(desktop ? button : undefined);
    setDesktopKeyboardOpening(desktop && keyboardOpening);
    button.focus({ preventScroll: true });
    if (value === 'sort') {
      if (desktop && sheet)
        window.history.replaceState(null, '', showroomInventoryHref(filters, sort));
      setSorting(true);
    } else {
      if (desktop) setSorting(false);
      const url = new URL(window.location.href);
      url.searchParams.set('filter', value === 'model' ? 'make' : value);
      if (value === 'model') url.searchParams.set('picker', 'model');
      else url.searchParams.delete('picker');
      if (button.dataset.quickFilter === 'all') url.searchParams.set('panel', 'all');
      else if (button.dataset.quickFilter && window.matchMedia('(min-width: 1024px)').matches)
        url.searchParams.set('panel', 'quick');
      else url.searchParams.delete('panel');
      if (section) url.searchParams.set('section', section);
      else url.searchParams.delete('section');
      if (desktop && sheet) {
        window.history.replaceState(
          window.history.state?.carsMobileFilterEditor ? { carsMobileFilterEditor: true } : null,
          '',
          url.pathname + url.search,
        );
      } else {
        window.history.pushState({ carsMobileFilterEditor: true }, '', url.pathname + url.search);
      }
    }
  }
  function close() {
    setSorting(false);
    if (sheet) {
      if (window.history.state?.carsMobileFilterEditor) window.history.back();
      else window.history.replaceState(null, '', showroomInventoryHref(filters, sort));
    }
  }
  function dismissDesktopDropdown() {
    // An outside click or Tab keeps focus on the control the user moved to.
    opener.current = null;
    setSorting(false);
    if (sheet) window.history.replaceState(null, '', showroomInventoryHref(filters, sort));
  }
  function selectFilterTab(value: ShowroomFilterTab) {
    const url = new URL(window.location.href);
    url.searchParams.set('filter', value);
    url.searchParams.delete('section');
    window.history.replaceState(
      window.history.state?.carsMobileFilterEditor ? { carsMobileFilterEditor: true } : null,
      '',
      url.pathname + url.search,
    );
  }
  function applyFilters(next: Filters) {
    browseAfterApply.current = !window.matchMedia('(min-width: 1024px)').matches;
    change(next);
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
  const mileageLabel =
    filters.minMileage || filters.maxMileage
      ? (filters.minMileage && filters.maxMileage
          ? number(Number(filters.minMileage)) + '–' + number(Number(filters.maxMileage))
          : filters.maxMileage
            ? t('Up to') + ' ' + number(Number(filters.maxMileage))
            : t('From') + ' ' + number(Number(filters.minMileage))) +
        ' ' +
        t('km')
      : 'Mileage';
  const makeLabel =
    filters.makes.length === 1 && filters.models.length
      ? filters.makes[0] + ' · ' + makeSelectionSummary(filters, filters.makes[0])
      : filters.makes.join(', ') ||
        (excludedNames.length ? 'Exclude ' + excludedNames.join(', ') : 'Make & model');
  const hasMakeSelection = Boolean(
    filters.makes.length || excludedNames.length || filters.models.length,
  );
  const desktopMakeLabel =
    filters.makes.join(', ') ||
    (excludedNames.length ? t('Exclude') + ': ' + excludedNames.join(', ') : t('All makes'));
  const desktopModelLabel =
    [
      ...filters.makes.flatMap((name) => {
        const summary = makeSelectionSummary(filters, name);
        return summary === 'Any'
          ? []
          : [(filters.makes.length > 1 ? name + ' · ' : '') + t(summary)];
      }),
      ...excludedNames.flatMap((name) => {
        const summary = makeSelectionSummary(filters, name, true);
        return summary === 'Any' ? [] : [t('Excluded') + ': ' + name + ' · ' + t(summary)];
      }),
    ].join(', ') || t('All models');
  const hasModelSelection = Boolean(
    filters.models.length ||
    Object.values(filters.makeVariants).some(Boolean) ||
    Object.values(filters.modelVariants).some((variants) => Object.keys(variants).length) ||
    Object.values(filters.excludedModels).some((models) => models.length) ||
    Object.values(filters.excludedMakeVariants).some(Boolean) ||
    Object.values(filters.excludedModelVariants).some((variants) => Object.keys(variants).length),
  );
  const allFilterCount =
    otherFilterCount +
    [
      filters.query,
      filters.makes.length || excludedNames.length || filters.models.length,
      filters.minPrice || filters.maxPrice,
      filters.minYear || filters.maxYear,
      filters.fuel.length,
    ].filter(Boolean).length;
  const pills: {
    key: ShowroomQuickFilter | 'all' | 'more';
    tab: ShowroomFilterTab;
    section?: ShowroomMoreSection;
    label: string;
    active: boolean;
    name: string;
    desktopOnly?: boolean;
    phoneOnly?: boolean;
    count?: number;
  }[] = [
    {
      key: 'all',
      tab: 'make',
      desktopOnly: true,
      label: 'All filters',
      active: allFilterCount > 0,
      name: 'All filters',
      count: allFilterCount,
    },
    {
      key: 'make',
      tab: 'make',
      phoneOnly: true,
      label: makeLabel,
      active: hasMakeSelection,
      name: 'Make and model',
    },
    {
      key: 'price',
      tab: 'price',
      phoneOnly: true,
      label: priceLabel,
      active: Boolean(filters.minPrice || filters.maxPrice),
      name: 'Price',
    },
    {
      key: 'year',
      tab: 'year',
      label: yearLabel,
      active: Boolean(filters.minYear || filters.maxYear),
      name: 'Year',
    },
    {
      key: 'mileage',
      tab: 'more',
      section: 'mileage',
      desktopOnly: true,
      label: mileageLabel,
      active: Boolean(filters.minMileage || filters.maxMileage),
      name: 'Mileage',
    },
    {
      key: 'fuel',
      tab: 'fuel',
      label: filters.fuel.map(t).join(', ') || 'Fuel',
      active: Boolean(filters.fuel.length),
      name: 'Fuel',
    },
    {
      key: 'gearbox',
      tab: 'more',
      section: 'transmission',
      desktopOnly: true,
      label: filters.transmission.map(t).join(', ') || 'Gearbox',
      active: filters.transmission.length > 0,
      name: 'Gearbox',
    },
    {
      key: 'body',
      tab: 'more',
      section: 'body',
      desktopOnly: true,
      label: filters.body.map(t).join(', ') || 'Body type',
      active: filters.body.length > 0,
      name: 'Body type',
    },
    {
      key: 'condition',
      tab: 'condition',
      desktopOnly: true,
      label: filters.condition.map(t).join(', ') || 'Condition',
      active: filters.condition.length > 0,
      name: 'Condition',
    },
    {
      key: 'more',
      tab: 'more',
      phoneOnly: true,
      label: 'More',
      active: otherFilterCount > 0,
      name: 'More',
      count: otherFilterCount,
    },
  ];
  return (
    <>
      <ShowroomBanner discovery>
        <ShowroomHeaderSurface>
          <Header home showLanguageSwitcher sticky={false} overHeroDesktop />
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
          </section>
        </ShowroomHeaderSurface>
        <ShowroomDesktopHero
          category={filters.category}
          makeLabel={
            filters.category === 'car'
              ? desktopMakeLabel
              : hasMakeSelection
                ? t(makeLabel)
                : t('All makes')
          }
          modelLabel={hasMakeSelection ? desktopModelLabel : t('Choose a make first')}
          priceLabel={t(filters.minPrice || filters.maxPrice ? priceLabel : 'Any price')}
          resultLabel={
            t('Show ') +
            results.length +
            ' ' +
            t(results.length === 1 ? category.singular : category.plural)
          }
          sheet={params.get('panel') ? null : sheet}
          makeView={desktopMakeView}
          onSelectCategory={selectCategory}
          onOpen={(tab, button, keyboardOpening) =>
            openSheet(tab, button, undefined, keyboardOpening)
          }
          onBrowse={browseResults}
          makeActive={hasMakeSelection}
          modelActive={hasModelSelection}
          modelReady={Boolean(filters.makes.length || excludedNames.length)}
          priceActive={Boolean(filters.minPrice || filters.maxPrice)}
          onClear={clearAppliedFilter}
        />
      </ShowroomBanner>
      <ShowroomDrawer id="showroom-results" inventory>
        <div data-desktop-quick-bar {...stylex.props(s.quickBar)}>
          <div {...stylex.props(s.desktopRail)}>
            <ShowroomQuickPills label={t('Quick filters')} inventoryDesktop>
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
                    pill.desktopOnly && s.desktopOnly,
                    pill.phoneOnly && s.phoneOnly,
                  )}
                >
                  <ShowroomQuickPill
                    type="button"
                    data-quick-filter={pill.key}
                    title={t(pill.label)}
                    aria-label={
                      pill.key === 'all'
                        ? t('All filters')
                        : t(pill.name) +
                          ' · ' +
                          t('Filters') +
                          (pill.active ? ': ' + t(pill.label) : '')
                    }
                    aria-haspopup="dialog"
                    aria-expanded={
                      pill.key === 'all'
                        ? Boolean(sheet && params.get('panel') === 'all')
                        : Boolean(
                            sheet === pill.tab &&
                            moreSection === (pill.section || null) &&
                            params.get('panel') !== 'all',
                          )
                    }
                    aria-describedby={pill.count ? 'showroom-filter-count-' + pill.key : undefined}
                    onClick={(event) =>
                      openSheet(pill.tab, event.currentTarget, pill.section, event.detail === 0)
                    }
                    active={pill.key !== 'all' && pill.active}
                    inventoryDesktop
                    emphasizedDesktop={pill.key === 'all'}
                    clearDesktop={
                      pill.key !== 'all' && !pill.phoneOnly
                        ? {
                            key: pill.key,
                            label: t('Clear filters') + ': ' + t(pill.name),
                            onClear: () => clearAppliedFilter(pill.key),
                          }
                        : undefined
                    }
                  >
                    {pill.key === 'all' && (
                      <span aria-hidden="true" {...stylex.props(s.pillIcon)}>
                        <SlidersHorizontal size={16} strokeWidth={1.8} />
                      </span>
                    )}
                    <span {...stylex.props(s.pillText)}>
                      <span {...stylex.props(s.phoneOnly)}>{t(pill.label)}</span>
                      <span {...stylex.props(s.desktopOnly)}>
                        {t(pill.key === 'make' ? 'Make & model' : pill.name)}
                      </span>
                    </span>
                    {(Boolean(pill.count) || pill.key === 'all') && (
                      <>
                        <span
                          aria-hidden="true"
                          {...stylex.props(
                            s.filterCount,
                            pill.key === 'all' && s.desktopFilterCount,
                            !pill.count && s.emptyCount,
                          )}
                        >
                          {pill.count}
                        </span>
                        {Boolean(pill.count) && (
                          <span
                            id={'showroom-filter-count-' + pill.key}
                            {...stylex.props(ui.srOnly)}
                          >
                            {pill.key === 'all'
                              ? t('Active filters') + ': ' + pill.count
                              : pill.count + ' active ' + (pill.count === 1 ? 'filter' : 'filters')}
                          </span>
                        )}
                      </>
                    )}
                    {pill.key !== 'all' && (
                      <span {...stylex.props(s.pillChevron)}>
                        <Icon name="down" size={14} />
                      </span>
                    )}
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
            <div {...stylex.props(s.desktopActions)}>
              <ShowroomQuickPill
                data-desktop-sort
                aria-label={t('Sort') + ': ' + t(sortLabel)}
                title={t('Sort') + ': ' + t(sortLabel)}
                aria-haspopup="dialog"
                aria-expanded={sorting}
                active={sort !== 'standard'}
                inventoryDesktop
                trailingDesktop
                onClick={(event) => openSheet('sort', event.currentTarget)}
              >
                <ArrowDownUp size={16} strokeWidth={1.8} aria-hidden="true" />
                <span {...stylex.props(s.pillText, s.desktopSortLabel)}>{t('Sort')}</span>
              </ShowroomQuickPill>
            </div>
          </div>
        </div>
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
      </ShowroomDrawer>
      {sheet && (
        <ShowroomFilterSheet
          key={
            desktopFilterAnchor
              ? `${sheet}:${moreSection}:${desktopMakeView}:${params.get('panel')}`
              : undefined
          }
          sheet={sheet}
          moreSection={moreSection}
          filters={filters}
          desktopPresentation={
            params.get('panel') === 'all'
              ? 'all'
              : params.get('panel') === 'quick'
                ? 'quick'
                : 'sheet'
          }
          desktopAnchor={desktopFilterAnchor}
          desktopKeyboardOpening={desktopKeyboardOpening}
          desktopMakeView={desktopMakeView}
          onApply={applyFilters}
          onClose={close}
          onDesktopDismiss={dismissDesktopDropdown}
          onTabChange={selectFilterTab}
        />
      )}
      <ShowroomSortDialog
        open={sorting}
        value={sort}
        onClose={close}
        desktopAnchor={desktopFilterAnchor}
        onDesktopDismiss={dismissDesktopDropdown}
        onChange={(value) => {
          change({}, value);
          close();
        }}
      />
    </>
  );
}
