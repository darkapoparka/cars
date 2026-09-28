'use client';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';

function ValueField({value, label, minimum, maximum, suffix, prefix, onChange}: {value: number; label: string; minimum: number; maximum: number; suffix: string; prefix: string; onChange: (value: number) => void}) {
  const tx = useCopy();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  function commit() {
    const next = Number(draft.replace(/[^\d.]/g, ''));
    if (draft.trim() && Number.isFinite(next)) onChange(Math.max(minimum, Math.min(maximum, next)));
    setEditing(false);
  }
  return <input type="text" inputMode="decimal" aria-label={tx(label)} value={editing ? draft : `${prefix}${new Intl.NumberFormat('en-AE').format(value)}${suffix}`} onFocus={() => {setDraft(String(value)); setEditing(true);}} onChange={event => setDraft(event.target.value)} onBlur={commit} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.value)} />;
}
export default function VerticalRange({label, minimum, maximum, low, high, step = 1, prefix = '', suffix = '', maxLabel = 'Max', minLabel = 'Min', onChange}: {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; prefix?: string; suffix?: string; maxLabel?: string; minLabel?: string; onChange: (low: number, high: number) => void}) {
  const tx = useCopy();

  const span = maximum - minimum;
  const position = (value: number) => span ? (1 - (value - minimum) / span) * 236 : 0;
  return <div {...stylex.props(s.range)}>
    <span {...stylex.props(s.endpoint)}>{tx(maxLabel)}</span>
    <div {...stylex.props(s.track)}>
      <i aria-hidden="true" {...stylex.props(s.line)} /><i aria-hidden="true" {...stylex.props(s.ticks)} />
      <input type="range" aria-label={tx(`${label} maximum slider`)} min={minimum} max={maximum} step={step} value={high} onChange={event => onChange(low, Math.max(low, Number(event.target.value)))} className="cars24-vertical-range" />
      <input type="range" aria-label={tx(`${label} minimum slider`)} min={minimum} max={maximum} step={step} value={low} onChange={event => onChange(Math.min(high, Number(event.target.value)), high)} className="cars24-vertical-range" />
      <div style={{top: position(high)}} {...stylex.props(s.valuePosition)}><ValueField value={high} label={tx(`Maximum ${label}`)} minimum={low} maximum={maximum} prefix={prefix} suffix={suffix} onChange={next => onChange(low, next)} /></div>
      <div style={{top: position(low)}} {...stylex.props(s.valuePosition)}><ValueField value={low} label={tx(`Minimum ${label}`)} minimum={minimum} maximum={high} prefix={prefix} suffix={suffix} onChange={next => onChange(next, high)} /></div>
    </div>
    <span {...stylex.props(s.endpoint)}>{tx(minLabel)}</span>
  </div>;
}
const s = stylex.create({
  range: {marginTop: 14},
  endpoint: {display: 'block', color: '#9c9c9c', fontSize: 12, fontWeight: 500, lineHeight: '18px'},
  track: {position: 'relative', height: 264, marginTop: 7, marginBottom: 8},
  line: {position: 'absolute', top: 14, bottom: 14, left: 14, width: 2, backgroundColor: '#f17700'},
  ticks: {position: 'absolute', top: 19, bottom: 12, left: 18, width: 6, backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 23px,#c0c0c0 23px,#c0c0c0 24px)'},
  valuePosition: {position: 'absolute', left: 38, width: 122, height: 29},
  value: {width: '100%', height: 29, padding: '4px 5px', color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: '21px', textAlign: 'center', borderWidth: 0, borderRadius: '0 9px 0 9px', outlineColor: '#f17700', backgroundColor: '#202024'},
});
