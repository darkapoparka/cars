'use client';

import {useId, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useCopy, useLocale} from '@/lib/locale';
import {tokens as $} from '@/app/tokens.stylex';
import {DesktopRangeTrack} from './HorizontalRange';

type Props = {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; prefix?: string; suffix?: string; grouping?: boolean; anyBounds?: boolean; showTrack?: boolean; onlyMaximum?: boolean; onChange: (low: number, high: number, emptyMaximum?: boolean) => void};

/** Desktop-only range editor. Invalid drafts never replace the applied criteria. */
export default function DesktopFilterRange({label, minimum, maximum, low, high, step = 1, prefix = '', suffix = '', grouping = true, anyBounds = false, showTrack = true, onlyMaximum = false, onChange}: Props) {
  const tx = useCopy();
  const locale = useLocale();
  const id = useId();
  const [drafts, setDrafts] = useState<{low: string | null; high: string | null}>({low: null, high: null});
  const number = (value: number) => new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {useGrouping: grouping, maximumFractionDigits: 2}).format(value);
  const valueText = (value: number) => `${prefix}${number(value)}${suffix ? ` ${suffix.trim()}` : ''}`;
  function parse(value: string | null, fallback: number, bound: number) {
    if (value === null) return fallback;
    if (!value.trim()) return bound;
    const clean = value.replace(/\s/g, '');
    const normalized = step < 1 ? clean.replace(',', '.') : clean.replaceAll(',', '');
    return (step < 1 ? /^\d+(?:\.\d+)?$/ : /^\d+$/).test(normalized) ? Number(normalized) : NaN;
  }
  const nextLow = parse(drafts.low, low, minimum);
  const nextHigh = parse(drafts.high, high, maximum);
  const lowInvalid = !Number.isFinite(nextLow) || nextLow < minimum || nextLow > maximum;
  const highInvalid = !Number.isFinite(nextHigh) || nextHigh < minimum || nextHigh > maximum;
  const reversed = !lowInvalid && !highInvalid && nextLow > nextHigh;
  const error = lowInvalid || highInvalid ? `${tx('Allowed range')}: ${valueText(minimum)} – ${valueText(maximum)}.` : reversed ? tx('Minimum must not exceed maximum.') : '';
  function edit(bound: 'low' | 'high', value: string) {
    const next = {...drafts, [bound]: value};
    setDrafts(next);
    const lower = parse(next.low, low, minimum);
    const upper = parse(next.high, high, maximum);
    if (Number.isFinite(lower) && Number.isFinite(upper) && lower >= minimum && upper <= maximum && lower <= upper) onChange(lower, upper, next.high === null ? anyBounds && high === maximum : !next.high.trim());
  }
  return <div data-desktop-filter-range>
    <div {...stylex.props(s.fields, onlyMaximum && s.singleField)}>{(onlyMaximum ? ['high'] as const : ['low', 'high'] as const).map(bound => {
      const isLow = bound === 'low';
      const value = isLow ? low : high;
      const invalid = (isLow ? lowInvalid : highInvalid) || reversed;
      const accessibleLabel = onlyMaximum ? tx('Maximum monthly payment') : `${tx(isLow ? 'Minimum value' : 'Maximum value')}: ${label}`;
      return <label key={bound} {...stylex.props(s.label)}><span>{tx(onlyMaximum ? 'Maximum monthly payment' : isLow ? 'From' : 'To')}</span><span {...stylex.props(s.field, invalid && s.invalid)}>{prefix ? <span aria-hidden="true" {...stylex.props(s.unit)}>{prefix}</span> : null}<input type="text" data-focus-owner="field" inputMode={step < 1 ? 'decimal' : 'numeric'} aria-label={accessibleLabel} aria-invalid={invalid || undefined} aria-describedby={`${id}-bounds${invalid ? ` ${id}-error` : ''}`} placeholder={tx('Any value')} value={drafts[bound] ?? (anyBounds && value === (isLow ? minimum : maximum) ? '' : number(value))} onFocus={event => event.currentTarget.select()} onChange={event => edit(bound, event.target.value)} onBlur={() => {if (!error) setDrafts(current => ({...current, [bound]: null}));}} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();} if (event.key === 'Escape' && error) {event.preventDefault(); event.stopPropagation(); setDrafts({low: null, high: null});}}} {...stylex.props(s.input)}/>{suffix ? <span aria-hidden="true" {...stylex.props(s.unit)}>{suffix}</span> : null}</span></label>;
    })}</div>
    {showTrack ? <DesktopRangeTrack minimum={minimum} maximum={maximum} low={low} high={high} step={step} minimumLabel={`${tx('Minimum value')}: ${label}`} maximumLabel={`${tx('Maximum value')}: ${label}`} format={valueText} onChange={(lower, upper) => {setDrafts({low: null, high: null}); onChange(lower, upper);}}/> : null}
    <p id={`${id}-bounds`} className={showTrack ? undefined : 'visually-hidden'} {...stylex.props(showTrack && s.bounds)}><span>{valueText(minimum)}</span><span> – </span><span>{valueText(maximum)}</span></p>
    {error ? <p id={`${id}-error`} role="status" {...stylex.props(s.error)}>{error}</p> : null}
  </div>;
}

const s = stylex.create({
  fields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16},
  singleField: {gridTemplateColumns: 'minmax(0,1fr)'},
  label: {display: 'grid', gap: 8, minWidth: 0, color: $.muted, fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight},
  field: {display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, height: 48, paddingInline: 14, borderWidth: 1, borderStyle: 'solid', borderColor: {default: $.line, ':hover': $.surfaceBorder}, borderRadius: 10, backgroundColor: $.surface, outline: {default: 'none', ':focus-within': '2px solid #202024'}, outlineOffset: 2},
  input: {width: '100%', minWidth: 0, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: $.desktopTextSize, fontWeight: $.desktopTextWeight, fontVariantNumeric: 'tabular-nums', lineHeight: $.desktopTextLineHeight, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  unit: {flexShrink: 0, color: $.muted, fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight},
  invalid: {borderColor: '#b42318'},
  bounds: {display: 'flex', justifyContent: 'space-between', marginTop: -2, color: $.muted, fontSize: $.desktopLabelSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopLabelLineHeight},
  error: {marginTop: 10, color: '#b42318', fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight},
});
