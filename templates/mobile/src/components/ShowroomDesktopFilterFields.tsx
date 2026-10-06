'use client';
import * as stylex from '@stylexjs/stylex';
import type { Filters, Vehicle } from '@/lib/types';
import type { ShowroomFilterTab, ShowroomMoreSection } from '@/lib/showroom-filter-editor';
import { useLocale } from '@/lib/use-locale';
import { RangeField } from './RangeField';
import { ShowroomDesktopMakeModel } from './ShowroomDesktopMakeModel';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ShowroomSearchField } from './ShowroomSearch';
import { CheckRow, ui } from './ui';
import { Icon } from './Icon';
import { desktopFilterStyles as s } from './showroom-desktop-filters.stylex';
export type DesktopFilterSection =
  Exclude<ShowroomFilterTab, 'more'> | ShowroomMoreSection | 'model';
export const desktopFilterSections: { key: DesktopFilterSection; label: string }[] = [
  { key: 'make', label: 'Make & model' },
  { key: 'price', label: 'Price' },
  { key: 'year', label: 'Year' },
  { key: 'mileage', label: 'Mileage' },
  { key: 'fuel', label: 'Fuel' },
  { key: 'transmission', label: 'Gearbox' },
  { key: 'body', label: 'Body type' },
  { key: 'condition', label: 'Condition' },
  { key: 'search', label: 'Search' },
];

export type DesktopFilterFieldsProps = {
  draft: Filters;
  stock: Vehicle[];
  matches: Vehicle[];
  resetVersion: number;
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  onClose: () => void;
  onDismiss?: () => void;
};
export function ShowroomDesktopFilterFields({
  section,
  compact = false,
  dropdown = false,
  draft,
  stock,
  matches,
  resetVersion,
  onChange,
  onApply,
  onClose,
}: DesktopFilterFieldsProps & {
  section: DesktopFilterSection;
  compact?: boolean;
  dropdown?: boolean;
}) {
  const { t, money } = useLocale();
  function range(
    label: string,
    min: 'minPrice' | 'minYear' | 'minMileage',
    max: 'maxPrice' | 'maxYear' | 'maxMileage',
    floor: number,
    ceiling: number,
    step = 1,
    unit = '',
  ) {
    return (
      <RangeField
        comfortable
        hideHeading
        label={t(label)}
        floor={floor}
        ceiling={ceiling}
        step={step}
        unit={unit}
        min={String(draft[min])}
        max={String(draft[max])}
        onChange={(from, to) => onChange({ [min]: from, [max]: to })}
      />
    );
  }

  function choices(field: 'fuel' | 'transmission' | 'body' | 'condition', label: string) {
    const options =
      field === 'condition'
        ? ['Used', 'New']
        : [...new Set(stock.map((vehicle) => vehicle[field]))];
    return options.length ? (
      <fieldset {...stylex.props(s.group)}>
        <legend {...stylex.props(ui.srOnly)}>{t(label)}</legend>
        <div {...stylex.props(s.choices)}>
          {options.map((value) => (
            <CheckRow
              key={value}
              checked={draft[field].includes(value)}
              xstyle={[s.choice, draft[field].includes(value) && s.selected]}
              checkboxStyle={s.checkbox}
              onChange={(checked) =>
                onChange({
                  [field]: checked
                    ? [...draft[field], value]
                    : draft[field].filter((item) => item !== value),
                })
              }
            >
              {value}
            </CheckRow>
          ))}
        </div>
      </fieldset>
    ) : (
      <p {...stylex.props(s.copy)}>
        {t('Choose another vehicle category to browse this showroom’s inventory.')}
      </p>
    );
  }

  function content(section: DesktopFilterSection) {
    switch (section) {
      case 'make':
        return draft.category === 'car' ? (
          <ShowroomDesktopMakeModel
            key={resetVersion}
            availableMakes={[...new Set(stock.map((vehicle) => vehicle.make))]}
            filters={draft}
            onChange={onChange}
            view="makes"
            dropdown={dropdown}
          />
        ) : (
          <CategoryMakePicker
            key={resetVersion}
            embedded
            filters={draft}
            onApply={onChange}
            onClose={onClose}
          />
        );
      case 'model':
        return (
          <ShowroomDesktopMakeModel
            key={resetVersion}
            availableMakes={[...new Set(stock.map((vehicle) => vehicle.make))]}
            filters={draft}
            onChange={onChange}
            view="models"
            dropdown={dropdown}
          />
        );
      case 'price':
        return (
          <>
            {range('Price', 'minPrice', 'maxPrice', 0, 100000, 500, '€')}
            {!compact && (
              <div role="group" aria-label={t('Price')} {...stylex.props(s.presets)}>
                {['', '40000', '60000', '100000'].map((maxPrice) => {
                  const selected = !Number(draft.minPrice) && draft.maxPrice === maxPrice;
                  return (
                    <button
                      key={maxPrice}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onChange({ minPrice: '', maxPrice })}
                      {...stylex.props(s.preset, selected && s.presetSelected)}
                    >
                      {maxPrice ? t('Up to') + ' ' + money(Number(maxPrice)) : t('Any')}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        );
      case 'year':
        return range('Year', 'minYear', 'maxYear', 1980, new Date().getFullYear() + 1);
      case 'mileage':
        return range('Mileage', 'minMileage', 'maxMileage', 0, 200000, 5000, 'km');
      case 'fuel':
        return choices('fuel', 'Fuel');
      case 'transmission':
        return choices('transmission', 'Gearbox');
      case 'body':
        return choices('body', 'Body type');
      case 'condition':
        return choices('condition', 'Condition');
      case 'search':
        return (
          <>
            <ShowroomSearchField
              label={t('Search make or model')}
              value={draft.query}
              onChange={(query) => onChange({ query })}
              onSubmit={onApply}
            />
            {!compact && (
              <div {...stylex.props(s.suggestions)}>
                {matches.slice(0, 6).map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    aria-label={t('Search') + ': ' + vehicle.make + ' ' + vehicle.model}
                    onClick={() => onChange({ query: vehicle.make + ' ' + vehicle.model })}
                    {...stylex.props(s.suggestion)}
                  >
                    <span {...stylex.props(s.suggestionName)}>
                      {vehicle.make} {vehicle.model}
                    </span>
                    <span {...stylex.props(s.copy)}>{money(vehicle.price)}</span>
                    <Icon name="right" size={16} />
                  </button>
                ))}
                {!matches.length && (
                  <p {...stylex.props(s.copy)}>{t('Try another search or adjust your filters.')}</p>
                )}
              </div>
            )}
          </>
        );
    }
  }

  return content(section);
}
