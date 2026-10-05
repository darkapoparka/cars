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
  type ShowroomMoreSection,
} from '@/lib/showroom-filter-editor';
import { showroomFilterSheetStyles as s } from './showroom-filter-sheet.stylex';
import { RangeField } from './RangeField';
import { MakePicker } from './MakePicker';
import { ShowroomDesktopMakeModel } from './ShowroomDesktopMakeModel';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearchField } from './ShowroomSearch';
import { Icon } from './Icon';
import { Button, CheckRow, IconButton, Modal } from './ui';

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
    <fieldset data-filter-section={field} {...stylex.props(s.group)}>
      <legend {...stylex.props(s.fieldTitle)}>{t(title)}</legend>
      <div {...stylex.props(s.choiceList)}>
        {options.map((value) => (
          <CheckRow
            key={value}
            xstyle={[s.desktopChoice, filters[field].includes(value) && s.desktopChoiceSelected]}
            checkboxStyle={s.desktopCheckbox}
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
      </div>
    </fieldset>
  );
}

export function ShowroomFilterSheet({
  sheet,
  moreSection = null,
  filters,
  onTabChange,
  onApply,
  onClose,
}: {
  sheet: ShowroomFilterTab;
  moreSection?: ShowroomMoreSection | null;
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
  const initial = useRef({ sheet, moreSection });
  useEffect(() => {
    const selector =
      initial.current.moreSection && window.matchMedia('(min-width: 1024px)').matches
        ? `[data-filter-section="${initial.current.moreSection}"] input`
        : initial.current.sheet === 'search'
          ? '[data-showroom-search-input]'
          : '[role="tab"][aria-selected="true"]';
    const frame = requestAnimationFrame(() =>
      editorRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const fields = fieldsRef.current;
    const target =
      sheet === 'more' && moreSection && window.matchMedia('(min-width: 1024px)').matches
        ? fields?.querySelector<HTMLElement>(`[data-filter-section="${moreSection}"]`)
        : null;
    fields?.scrollTo({
      top: target
        ? Math.max(
            0,
            fields.scrollTop +
              target.getBoundingClientRect().top -
              fields.getBoundingClientRect().top -
              24,
          )
        : 0,
      behavior: 'instant',
    });
  }, [sheet, moreSection]);
  function change(patch: Partial<Filters>) {
    setDraft((current) => updateShowroomFilterDraft(current, patch));
  }
  return (
    <Modal
      open
      onClose={onClose}
      label={t('Search and filters')}
      flowSheet
      wide
      xstyle={s.desktopDialog}
    >
      <div ref={editorRef} {...stylex.props(s.editor)}>
        <div {...stylex.props(s.heading)}>
          <div {...stylex.props(s.closeAction)}>
            <IconButton icon="close" label={t('Close filters')} onClick={onClose} />
          </div>
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
            <span {...stylex.props(s.clearLabel)}>{t('Clear')}</span>
            <span aria-hidden="true" {...stylex.props(s.clearIcon)}>
              <Icon name="reset" />
            </span>
          </button>
        </div>
        <div {...stylex.props(s.tabs)}>
          <ShowroomTabs
            label={t('Filter sections')}
            tabs={showroomFilterTabs}
            selected={sheet}
            panelId="showroom-filter-options"
            idPrefix="filter-section-"
            layout="desktop-sidebar"
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
                  <div {...stylex.props(s.rangeCard)}>
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
                  </div>
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
                <div {...stylex.props(s.rangeCard)}>
                  <RangeField
                    comfortable
                    label={t('Year')}
                    floor={1980}
                    ceiling={new Date().getFullYear() + 1}
                    min={draft.minYear}
                    max={draft.maxYear}
                    onChange={(minYear, maxYear) => change({ minYear, maxYear })}
                  />
                </div>
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
                  <div data-filter-section="mileage" {...stylex.props(s.moreRange, s.mileageCard)}>
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
