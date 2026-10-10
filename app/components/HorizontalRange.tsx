'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {currency} from '@/lib/currency';
import {media, tokens as $} from '@/app/tokens.stylex';
import NumberField from './NumberField';

type Props = {label: string; minimum: number; maximum: number; low: number; high: number; step?: number; suffix?: string; onChange: (low: number, high: number) => void};

/** Both desktop bounds share one track while retaining separate native keyboard controls. */
export function DesktopRangeTrack({minimum, maximum, low, high, step = 1, minimumLabel, maximumLabel, format, onChange}: Omit<Props, 'label' | 'suffix'> & {minimumLabel: string; maximumLabel: string; format: (value: number) => string}) {
  const percent = (value: number) => (value - minimum) / (maximum - minimum) * 100;
  return <div data-desktop-range-track {...stylex.props(s.track)}>
    <div aria-hidden="true" {...stylex.props(s.line)}>
      <div style={{left: `${percent(low)}%`, right: `${100 - percent(high)}%`}} {...stylex.props(s.selection)}/>
      <span data-desktop-range-handle="minimum" style={{left: `${percent(low)}%`}} {...stylex.props(s.handle)}/>
      <span data-desktop-range-handle="maximum" style={{left: `${percent(high)}%`}} {...stylex.props(s.handle)}/>
    </div>
    <input type="range" className="cars24-horizontal-range" aria-label={minimumLabel} aria-valuemin={minimum} aria-valuemax={high} aria-valuetext={format(low)} min={minimum} max={maximum} step={step} value={low} onChange={event => onChange(Math.min(high, Number(event.target.value)), high)} style={{zIndex: low === maximum ? 2 : 0}}/>
    <input type="range" className="cars24-horizontal-range" aria-label={maximumLabel} aria-valuemin={low} aria-valuemax={maximum} aria-valuetext={format(high)} min={minimum} max={maximum} step={step} value={high} onChange={event => onChange(low, Math.max(low, Number(event.target.value)))}/>
  </div>
}

function ValueField({value, label, minimum, maximum, onChange}: {value: number; label: string; minimum: number; maximum: number; onChange: (value: number) => void}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  return <input type="text" data-focus-owner="field" inputMode="numeric" aria-label={label} value={editing ? draft : new Intl.NumberFormat(currency.locale).format(value)} onFocus={event => {setDraft(String(value)); setEditing(true); event.currentTarget.select();}} onChange={event => setDraft(event.target.value)} onBlur={event => {const text = event.currentTarget.value.trim().replace(/[\s,]/g, ''); const next = Number(text); if (text && Number.isFinite(next)) onChange(Math.max(minimum, Math.min(maximum, next))); setEditing(false);}} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); event.currentTarget.blur();}}} {...stylex.props(s.input)}/>;
}

/** The desktop mileage range; phone and tablet retain their original control. */
export default function HorizontalRange({label, minimum, maximum, low, high, step = 1, suffix = '', onChange}: Props) {
  const tx = useCopy();
  const minimumLabel = `${tx('Minimum value')}: ${label}`;
  const maximumLabel = `${tx('Maximum value')}: ${label}`;
  return <div data-desktop-horizontal-range {...stylex.props(s.range)}>
    <div {...stylex.props(s.fields)}><label {...stylex.props(s.field)}><NumberField inlineLabel label={tx('From')} suffix={suffix}><ValueField value={low} label={minimumLabel} minimum={minimum} maximum={high} onChange={next => onChange(next, high)}/></NumberField></label><label {...stylex.props(s.field)}><NumberField inlineLabel label={tx('To')} suffix={suffix}><ValueField value={high} label={maximumLabel} minimum={low} maximum={maximum} onChange={next => onChange(low, next)}/></NumberField></label></div>
    <DesktopRangeTrack minimum={minimum} maximum={maximum} low={low} high={high} step={step} minimumLabel={minimumLabel} maximumLabel={maximumLabel} format={value => `${value}${suffix}`} onChange={onChange}/>
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
  // The native thumbs keep their 44px hit areas; these circles draw their exact centers.
  handle: {position: 'absolute', top: '50%', zIndex: 1, width: 20, height: 20, borderWidth: 1, borderStyle: 'solid', borderColor: $.controlBorder, borderRadius: '50%', backgroundColor: $.surface, boxShadow: '0 1px 3px rgba(0,0,0,.12)', transform: 'translate(-50%,-50%)', pointerEvents: 'none'},
});
