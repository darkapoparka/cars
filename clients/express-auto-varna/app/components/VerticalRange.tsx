'use client';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

function ValueField({value, label, minimum, maximum, suffix, prefix, onChange}: {value: number; label: string; minimum: number; maximum: number; suffix: string; prefix: string; onChange: (value: number) => void}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  function commit(text: string) {
    const next = Number(text.replace(/[^\d.]/g, ''));
    if (text.trim() && Number.isFinite(next)) onChange(Math.max(minimum, Math.min(maximum, next)));
    setEditing(false);
  }
  return <input type="text" inputMode="decimal" aria-label={label} value={editing ? draft : `${prefix}${new Intl.NumberFormat('en-AE').format(value)}${suffix}`} onFocus={event => {setDraft(event.currentTarget.value); setEditing(true); event.currentTarget.select();}} onChange={event => setDraft(event.target.value)} onBlur={event => commit(event.currentTarget.value)} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.value)} />;
}
export default function VerticalRange({label, minimum, maximum, low, high, step = 1, prefix = '', suffix = '', maxLabel = 'Max', minLabel = 'Min', onChange}: {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; prefix?: string; suffix?: string; maxLabel?: string; minLabel?: string; onChange: (low: number, high: number) => void}) {
  const tx = useCopy();

  const span = maximum - minimum;
  const position = (value: number) => span ? (1 - (value - minimum) / span) * 236 : 0;
  const highPosition = Math.min(position(high), Math.max(0, position(low) - 48));
  const lowPosition = Math.max(position(low), highPosition + 48);
  const maximumLabel = `${tx('Maximum value')}: ${tx(label)}`;
  const minimumLabel = `${tx('Minimum value')}: ${tx(label)}`;
  return <div {...stylex.props(s.range)}>
    <span {...stylex.props(s.endpoint)}>{tx(maxLabel)}</span>
    <div {...stylex.props(s.track)}>
      <i aria-hidden="true" {...stylex.props(s.line)} /><i aria-hidden="true" {...stylex.props(s.ticks)} />
      <input type="range" aria-label={maximumLabel} min={minimum} max={maximum} step={step} value={high} onChange={event => onChange(low, Math.max(low, Number(event.target.value)))} className="cars24-vertical-range" />
      <input type="range" aria-label={minimumLabel} min={minimum} max={maximum} step={step} value={low} onChange={event => onChange(Math.min(high, Number(event.target.value)), high)} className="cars24-vertical-range" />
      <div style={{top: highPosition}} {...stylex.props(s.valuePosition)}><ValueField value={high} label={maximumLabel} minimum={low} maximum={maximum} prefix={prefix} suffix={suffix} onChange={next => onChange(low, next)} /></div>
      <div style={{top: lowPosition}} {...stylex.props(s.valuePosition)}><ValueField value={low} label={minimumLabel} minimum={minimum} maximum={high} prefix={prefix} suffix={suffix} onChange={next => onChange(next, high)} /></div>
    </div>
    <span {...stylex.props(s.endpoint)}>{tx(minLabel)}</span>
  </div>;
}
const s = stylex.create({
  range: {marginTop: 14},
  endpoint: {display: 'block', color: $.muted, fontSize: 12, fontWeight: 500, lineHeight: '18px'},
  track: {position: 'relative', height: 280, marginTop: 7, marginBottom: 8},
  line: {position: 'absolute', top: 22, bottom: 22, left: 22, width: 2, backgroundColor: '#bd5700'},
  ticks: {position: 'absolute', top: 27, bottom: 20, left: 26, width: 6, backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 23px,#c0c0c0 23px,#c0c0c0 24px)'},
  valuePosition: {position: 'absolute', left: 54, width: 135, height: 44},
  value: {width: '100%', height: 44, padding: '8px 6px', color: '#fff', fontSize: 16, fontWeight: 500, lineHeight: '24px', textAlign: 'center', borderWidth: 0, borderRadius: 12, outlineColor: $.ink, backgroundColor: '#202024'},
});
