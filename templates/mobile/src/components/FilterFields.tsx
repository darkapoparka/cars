'use client';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { updateFilters } from '@/lib/store';
import { CheckRow, ui } from './ui';
export function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: (string | [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <label {...stylex.props(ui.label)}>
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...stylex.props(ui.input)}
      >
        <option value="">Any</option>
        {options.map((option) => {
          const [v, name] = typeof option === 'string' ? [option, option] : option;
          return (
            <option key={v} value={v}>
              {name}
            </option>
          );
        })}
      </select>
    </label>
  );
}
export function MultiChoices({
  field,
  options,
  filters,
}: {
  field: 'fuel' | 'transmission' | 'body' | 'color' | 'features';
  options: string[];
  filters: Filters;
}) {
  return (
    <div>
      {options.map((value) => (
        <CheckRow
          key={value}
          checked={filters[field].includes(value)}
          onChange={(checked) =>
            updateFilters({
              [field]: checked
                ? [...filters[field], value]
                : filters[field].filter((v) => v !== value),
            })
          }
        >
          {value}
        </CheckRow>
      ))}
    </div>
  );
}
export {
  ConditionFields,
  FinancialFields,
  TechnicalFields,
  LocationFields,
} from './NativeFilterFields';
