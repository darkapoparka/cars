'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {currency} from '@/lib/currency';
import {media, tokens as $} from '@/app/tokens.stylex';

type Props = {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; suffix?: string; onChange: (low: number, high: number) => void};

function ValueField({value, label, minimum, maximum, suffix, onChange}: {value: number; label: string; minimum: number; maximum: number; suffix: string; onChange: (value: number) => void}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  return <input type="text" inputMode="numeric" aria-label={label} value={editing ? draft : `${new Intl.NumberFormat(currency.locale).format(value)}${suffix}`} onFocus={event => {setDraft(String(value)); setEditing(true); event.currentTarget.select();}} onChange={event => setDraft(event.target.value)} onBlur={event => {const text = event.currentTarget.value.trim().replace(/[\s,]/g, ''); const next = Number(text); if (text && Number.isFinite(next)) onChange(Math.max(minimum, Math.min(maximum, next))); setEditing(false);}} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.input)}/>;
}

/** The desktop mileage range; phone and tablet retain their original control. */
export default function HorizontalRange({label, minimum, maximum, low, high, step = 1, suffix = '', onChange}: Props) {
  const tx = useCopy();
  const percent = (value: number) => (value - minimum) / (maximum - minimum) * 100;
  const minimumLabel = `${tx('Minimum value')}: ${label}`;
  const maximumLabel = `${tx('Maximum value')}: ${label}`;
  return <div data-desktop-horizontal-range {...stylex.props(s.range)}>
    <div {...stylex.props(s.fields)}><label {...stylex.props(s.field)}><span>{tx('From')}</span><ValueField value={low} label={minimumLabel} minimum={minimum} maximum={high} suffix={suffix} onChange={next => onChange(next, high)}/></label><label {...stylex.props(s.field)}><span>{tx('To')}</span><ValueField value={high} label={maximumLabel} minimum={low} maximum={maximum} suffix={suffix} onChange={next => onChange(low, next)}/></label></div>
    <div {...stylex.props(s.track)}><div aria-hidden="true" {...stylex.props(s.line)}><div style={{left: `${percent(low)}%`, right: `${100 - percent(high)}%`}} {...stylex.props(s.selection)}/></div><input type="range" className="cars24-horizontal-range" aria-label={minimumLabel} aria-valuetext={`${low}${suffix}`} min={minimum} max={maximum} step={step} value={low} onChange={event => onChange(Math.min(high, Number(event.target.value)), high)} style={{zIndex: low === maximum ? 2 : 0}}/><input type="range" className="cars24-horizontal-range" aria-label={maximumLabel} aria-valuetext={`${high}${suffix}`} min={minimum} max={maximum} step={step} value={high} onChange={event => onChange(low, Math.max(low, Number(event.target.value)))}/></div>
  </div>;
}

const s = stylex.create({
  range: {display: {[media.desktop]: 'block', default: 'none'}},
  fields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  field: {display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, color: $.muted, fontSize: 13},
  input: {width: '100%', minWidth: 0, minHeight: 44, paddingInline: 10, color: $.ink, fontFamily: $.fontSans, fontSize: 15, fontWeight: 400, borderWidth: 0, borderRadius: 8, backgroundColor: $.surfaceAlt, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: 2},
  track: {position: 'relative', height: 44, marginTop: 8},
  line: {position: 'absolute', top: 20, left: 22, right: 22, height: 4, borderRadius: 999, backgroundColor: $.line},
  selection: {position: 'absolute', insetBlock: 0, borderRadius: 999, backgroundColor: $.ink},
});
