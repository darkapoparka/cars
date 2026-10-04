'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { filterVehicles } from '@/lib/search';
import { showroomCategory } from '@/lib/showroom';
import {
  resetShowroomFilterDraft,
  showroomFilterTabs,
  updateShowroomFilterDraft,
  type ShowroomFilterTab,
} from '@/lib/showroom-filter-editor';
import { colors } from '@/styles/tokens.stylex';
import { RangeField } from './RangeField';
import { MakePicker } from './MakePicker';
import { ShowroomDesktopMakeModel } from './ShowroomDesktopMakeModel';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearchField } from './ShowroomSearch';
import { Icon } from './Icon';
import { Button, CheckRow, IconButton, Modal } from './ui';

const s = stylex.create({
  editor: { display: 'flex', flexDirection: 'column', flex: '1', minHeight: 0, minWidth: 0 },
  heading: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
    alignItems: 'center',
    gap: 8,
    paddingInline: { default: 12, '@media (min-width: 700px)': 16 },
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    flexShrink: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    minWidth: 0,
    textAlign: 'center',
  },
  clearFilters: {
    justifySelf: 'end',
    minHeight: 48,
    paddingInline: 8,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: { default: colors.muted, ':hover': colors.text },
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
  },
  tabs: { flexShrink: 0 },
  panel: { flex: '1', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' },
  makePanel: {
    display: 'flex',
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
    marginInline: 'auto',
  },
  mobileMakePicker: {
    display: { default: 'flex', '@media (min-width: 700px)': 'none' },
    flex: '1',
    minHeight: 0,
    minWidth: 0,
  },
  hidden: { display: 'none' },
  fields: {
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    padding: { default: 20, '@media (min-width: 700px)': 24 },
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  readableFields: {
    width: '100%',
    marginInline: 'auto',
  },
  moreFields: {
    display: { default: 'flex', '@media (min-width: 700px)': 'grid' },
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    alignContent: { default: 'normal', '@media (min-width: 700px)': 'start' },
  },
  moreRange: {
    minWidth: 0,
    gridColumn: {
      default: 'auto',
      '@media (min-width: 700px)': '1 / -1',
    },
  },
  group: { borderWidth: 0, padding: 0, minWidth: 0 },
  fieldTitle: { fontSize: 18, fontWeight: 600, lineHeight: '26px', marginBottom: 12 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: '22px' },
  budgetPresets: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 700px)': 'repeat(4,minmax(0,1fr))',
    },
    gap: 8,
    paddingInline: 4,
  },
  budgetPreset: {
    minWidth: 0,
    minHeight: 48,
    paddingInline: 8,
    paddingBlock: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.stripe },
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
  },
  budgetPresetSelected: {
    backgroundColor: { default: colors.text, ':hover': colors.text },
    borderColor: colors.text,
    color: colors.background,
  },
  searchPanel: { gap: 16 },
  suggestions: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  suggestion: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 48,
    minWidth: 0,
    paddingInline: 12,
    paddingBlock: 10,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    fontSize: 15,
    lineHeight: '22px',
  },
  suggestionName: { flex: '1', minWidth: 0, overflowWrap: 'anywhere', fontWeight: 500 },
  suggestionTail: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  suggestionArrow: { display: 'flex', color: colors.muted },
  suggestionPrice: { flexShrink: 0, color: colors.muted, fontSize: 13, lineHeight: '20px' },
  footer: {
    flexShrink: 0,
    paddingInline: { default: 16, '@media (min-width: 700px)': 24 },
    paddingTop: 12,
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    display: { default: 'block', '@media (min-width: 700px)': 'flex' },
    justifyContent: 'flex-end',
  },
  footerAction: { width: { default: '100%', '@media (min-width: 700px)': 200 } },
  footerButton: {
    transition: {
      default: 'filter 120ms, transform 120ms',
      '@media (min-width: 700px)': 'none',
    },
    transform: {
      default: 'none',
      ':active': { default: 'translateY(1px)', '@media (min-width: 700px)': 'none' },
      '@media (min-width: 700px)': 'none',
    },
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
  field: 'condition' | 'fuel' | 'transmission' | 'body';
  options: string[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const { t } = useLocale();
  return (
    <fieldset {...stylex.props(s.group)}>
      <legend {...stylex.props(s.fieldTitle)}>{t(title)}</legend>
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
    </fieldset>
  );
}

export function ShowroomFilterSheet({
  sheet,
  filters,
  onTabChange,
  onApply,
  onClose,
}: {
  sheet: ShowroomFilterTab;
  filters: Filters;
  onTabChange: (tab: ShowroomFilterTab) => void;
  onApply: (filters: Filters) => void;
  onClose: () => void;
}) {
  const { t, money } = useLocale();
  const [draft, setDraft] = useState(() => structuredClone(filters));
  const [resetVersion, setResetVersion] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const category = showroomCategory(draft.category);
  const stock = vehicles.filter((vehicle) => vehicle.category === draft.category);
  const stockMakes = [...new Set(stock.map((vehicle) => vehicle.make))];
  const fuels = [...new Set(stock.map((vehicle) => vehicle.fuel))];
  const transmissions = [...new Set(stock.map((vehicle) => vehicle.transmission))];
  const bodies = [...new Set(stock.map((vehicle) => vehicle.body))];
  const matches = filterVehicles(stock, draft);
  const count = matches.length;
  const initialSheet = useRef(sheet);
  useEffect(() => {
    const selector =
      initialSheet.current === 'search'
        ? '[data-showroom-search-input]'
        : '[role="tab"][aria-selected="true"]';
    const frame = requestAnimationFrame(() =>
      editorRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    fieldsRef.current?.scrollTo(0, 0);
  }, [sheet]);
  function change(patch: Partial<Filters>) {
    setDraft((current) => updateShowroomFilterDraft(current, patch));
  }
  return (
    <Modal open onClose={onClose} label={t('Search and filters')} flowSheet wide>
      <div ref={editorRef} {...stylex.props(s.editor)}>
        <div {...stylex.props(s.heading)}>
          <IconButton icon="close" label={t('Close filters')} onClick={onClose} />
          <h2 {...stylex.props(s.title)}>{sheet === 'search' ? t('Search') : t('Filters')}</h2>
          <button
            type="button"
            aria-label={t('Clear filters')}
            onClick={() => {
              setDraft(resetShowroomFilterDraft(draft));
              setResetVersion((current) => current + 1);
            }}
            {...stylex.props(s.clearFilters)}
          >
            {t('Clear')}
          </button>
        </div>
        <div {...stylex.props(s.tabs)}>
          <ShowroomTabs
            label={t('Filter sections')}
            tabs={showroomFilterTabs}
            selected={sheet}
            panelId="showroom-filter-options"
            idPrefix="filter-section-"
            layout="desktop-fill"
            onChange={onTabChange}
          />
        </div>
        <div
          id="showroom-filter-options"
          role="tabpanel"
          aria-labelledby={'filter-section-' + sheet}
          {...stylex.props(s.panel)}
        >
          <div
            hidden={sheet !== 'make'}
            {...stylex.props(s.makePanel, sheet !== 'make' && s.hidden)}
          >
            {draft.category === 'car' ? (
              <>
                <div {...stylex.props(s.mobileMakePicker)}>
                  <MakePicker
                    key={resetVersion}
                    embedded
                    open
                    initialMake={draft.makes.length === 1 ? draft.makes[0] : ''}
                    availableMakes={stockMakes}
                    filters={draft}
                    onApply={change}
                    onClose={onClose}
                  />
                </div>
                <ShowroomDesktopMakeModel
                  key={resetVersion}
                  availableMakes={stockMakes}
                  filters={draft}
                  onChange={change}
                />
              </>
            ) : (
              <CategoryMakePicker
                key={resetVersion}
                embedded
                filters={draft}
                onApply={change}
                onClose={onClose}
              />
            )}
          </div>
          {sheet !== 'make' && (
            <div
              ref={fieldsRef}
              data-filter-scroll
              {...stylex.props(
                s.fields,
                sheet === 'more' ? s.moreFields : s.readableFields,
                sheet === 'search' && s.searchPanel,
              )}
            >
              {sheet === 'search' && (
                <>
                  <ShowroomSearchField
                    label={t('Search make or model')}
                    value={draft.query}
                    onChange={(query) => change({ query })}
                    onSubmit={() => onApply(draft)}
                  />
                  <div {...stylex.props(s.suggestions)}>
                    <h3 {...stylex.props(s.copy)}>
                      {draft.query.trim() ? t('Matching vehicles') : t('In this showroom')}
                    </h3>
                    {matches.slice(0, 6).map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        aria-label={t('Search') + ': ' + vehicle.make + ' ' + vehicle.model}
                        onClick={() => change({ query: vehicle.make + ' ' + vehicle.model })}
                        {...stylex.props(s.suggestion)}
                      >
                        <span {...stylex.props(s.suggestionName)}>
                          {vehicle.make} {vehicle.model}
                        </span>
                        <span {...stylex.props(s.suggestionTail)}>
                          <span {...stylex.props(s.suggestionPrice)}>{money(vehicle.price)}</span>
                          <span aria-hidden="true" {...stylex.props(s.suggestionArrow)}>
                            <Icon name="arrow" size={16} />
                          </span>
                        </span>
                      </button>
                    ))}
                    {!count && (
                      <p {...stylex.props(s.copy)}>
                        {t('Try another search or adjust the filter tabs.')}
                      </p>
                    )}
                  </div>
                </>
              )}
              {sheet === 'price' && (
                <>
                  <RangeField
                    comfortable
                    label={t('Price')}
                    floor={0}
                    ceiling={100000}
                    step={500}
                    unit="€"
                    min={draft.minPrice}
                    max={draft.maxPrice}
                    onChange={(minPrice, maxPrice) => change({ minPrice, maxPrice })}
                  />
                  <div role="group" aria-label={t('Price')} {...stylex.props(s.budgetPresets)}>
                    {['', '40000', '60000', '100000'].map((maxPrice) => {
                      const selected = !Number(draft.minPrice) && draft.maxPrice === maxPrice;
                      return (
                        <button
                          key={maxPrice}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => change({ minPrice: '', maxPrice })}
                          {...stylex.props(s.budgetPreset, selected && s.budgetPresetSelected)}
                        >
                          {maxPrice ? t('Up to') + ' ' + money(Number(maxPrice)) : t('Any')}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {sheet === 'year' && (
                <RangeField
                  comfortable
                  label={t('Year')}
                  floor={1980}
                  ceiling={new Date().getFullYear() + 1}
                  min={draft.minYear}
                  max={draft.maxYear}
                  onChange={(minYear, maxYear) => change({ minYear, maxYear })}
                />
              )}
              {sheet === 'fuel' &&
                (fuels.length ? (
                  <Choices
                    title={t('Fuel')}
                    field="fuel"
                    options={fuels}
                    filters={draft}
                    onChange={change}
                  />
                ) : (
                  <p {...stylex.props(s.copy)}>
                    {t('No fuel options in this category’s inventory yet.')}
                  </p>
                ))}
              {sheet === 'condition' && (
                <Choices
                  title={t('Condition')}
                  field="condition"
                  options={['Used', 'New']}
                  filters={draft}
                  onChange={change}
                />
              )}
              {sheet === 'more' && (
                <>
                  <div {...stylex.props(s.moreRange)}>
                    <RangeField
                      comfortable
                      label={t('Mileage')}
                      floor={0}
                      ceiling={200000}
                      step={5000}
                      unit="km"
                      min={draft.minMileage}
                      max={draft.maxMileage}
                      onChange={(minMileage, maxMileage) => change({ minMileage, maxMileage })}
                    />
                  </div>
                  {transmissions.length > 0 && (
                    <Choices
                      title={t('Transmission')}
                      field="transmission"
                      options={transmissions}
                      filters={draft}
                      onChange={change}
                    />
                  )}
                  {bodies.length > 0 && (
                    <Choices
                      title={t('Body type')}
                      field="body"
                      options={bodies}
                      filters={draft}
                      onChange={change}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div data-filter-footer {...stylex.props(s.footer)}>
          <div {...stylex.props(s.footerAction)}>
            <Button block floating xstyle={s.footerButton} onClick={() => onApply(draft)}>
              <span aria-live="polite" aria-atomic="true">
                {t('Show ')}
                {count} {t(count === 1 ? category.singular : category.plural)}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
