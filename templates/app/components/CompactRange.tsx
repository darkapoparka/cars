'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useCopy, useLocale} from '@/lib/locale';
import {tokens as $} from '@/app/tokens.stylex';

type Props = {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; prefix?: string; suffix?: string; grouping?: boolean; onChange: (low: number, high: number) => void};

function ValueField({value, label, minimum, maximum, decimal, format, onChange}: {value: number; label: string; minimum: number; maximum: number; decimal: boolean; format: (value: number) => string; onChange: (value: number) => void}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  function parse(text: string) {
    const cleaned = text.replace(/[^\d.,-]/g, '');
    const normalized = decimal ? cleaned.replace(',', '.') : cleaned.replaceAll(',', '');
    return /^-?\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : null;
  }
  function commit(text: string) {
    const next = parse(text);
    if (next !== null && Number.isFinite(next)) onChange(Math.max(minimum, Math.min(maximum, next)));
    setEditing(false);
  }
  return <input type="text" inputMode={decimal ? 'decimal' : 'numeric'} aria-label={label} value={editing ? draft : format(value)} onFocus={event => {setDraft(String(value)); setEditing(true); event.currentTarget.select();}} onChange={event => {setDraft(event.target.value); const next = parse(event.target.value); if (next !== null && next >= minimum && next <= maximum) onChange(next);}} onBlur={event => commit(event.currentTarget.value)} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.input)}/>;
}

/** Phone range: both editable bounds stay together, with separate keyboard-accessible sliders. */
export default function CompactRange({label, minimum, maximum, low, high, step = 1, prefix = '', suffix = '', grouping = true, onChange}: Props) {
  const tx = useCopy();
  const locale = useLocale();
  const format = (value: number) => `${prefix}${new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {useGrouping: grouping, maximumFractionDigits: 2}).format(value)}${suffix}`;
  const minimumLabel = `${tx('Minimum value')}: ${label}`;
  const maximumLabel = `${tx('Maximum value')}: ${label}`;
  return <div data-mobile-compact-range {...stylex.props(s.range)}>
    <div {...stylex.props(s.fields)}>
      <label {...stylex.props(s.field)}><span>{tx('From')}</span><ValueField value={low} label={minimumLabel} minimum={minimum} maximum={high} decimal={step < 1} format={format} onChange={next => onChange(next, high)}/></label>
      <label {...stylex.props(s.field)}><span>{tx('To')}</span><ValueField value={high} label={maximumLabel} minimum={low} maximum={maximum} decimal={step < 1} format={format} onChange={next => onChange(low, next)}/></label>
    </div>
    <label {...stylex.props(s.sliderRow)}><span {...stylex.props(s.sliderLabel)}>{tx('Minimum value')}<output>{format(low)}</output></span><input type="range" aria-label={minimumLabel} aria-valuetext={format(low)} min={minimum} max={maximum} step={step} value={low} onChange={event => onChange(Math.min(high, Number(event.target.value)), high)} {...stylex.props(s.slider)}/></label>
    <label {...stylex.props(s.sliderRow)}><span {...stylex.props(s.sliderLabel)}>{tx('Maximum value')}<output>{format(high)}</output></span><input type="range" aria-label={maximumLabel} aria-valuetext={format(high)} min={minimum} max={maximum} step={step} value={high} onChange={event => onChange(low, Math.max(low, Number(event.target.value)))} {...stylex.props(s.slider)}/></label>
  </div>;
}

const s = stylex.create({
  range: {display: 'grid', gap: 12, marginTop: 12},
  fields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  field: {display: 'grid', gap: 6, minWidth: 0, color: $.muted, fontSize: 12, lineHeight: '18px'},
  input: {width: '100%', minWidth: 0, minHeight: 48, paddingInline: 12, color: $.ink, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12, backgroundColor: $.surface, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: 2},
  sliderRow: {display: 'grid', gap: 2, minWidth: 0},
  sliderLabel: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, color: $.muted, fontSize: 12, lineHeight: '18px'},
  slider: {width: '100%', minWidth: 0, height: 44, margin: 0, padding: 0, accentColor: $.ink},
});
