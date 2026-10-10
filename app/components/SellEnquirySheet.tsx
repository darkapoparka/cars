'use client';

import {useState} from 'react';
import {ArrowRight, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {dealer} from '@/lib/dealer-config';
import {useModal} from './useModal';
import DealerEnquirySheet from './DealerEnquirySheet';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export type SellIntent = 'sale' | 'exchange';
export type SellCarDetails = {make: string; model: string; year: string; mileage: string; notes: string};

/** Car details stay local; the next sheet prepares a draft for the configured dealer. */
export default function SellEnquirySheet({car, onCarChange, intent, onIntentChange, onClose}: {car: SellCarDetails; onCarChange: (car: SellCarDetails) => void; intent: SellIntent | null; onIntentChange: (intent: SellIntent) => void; onClose: () => void}) {
  const tx = useCopy();
  const [enquiry, setEnquiry] = useState<string | null>(null);
  function close() {setEnquiry(null); onClose();}
  const panel = useModal(intent !== null, close);
  function update(field: keyof SellCarDetails, value: string) {onCarChange({...car, [field]: value});}
  function prepare() {
    const lines = [car.make.trim() + ' ' + car.model.trim(), tx(intent === 'exchange' ? 'Part-exchange enquiry' : 'Selling enquiry')];
    if (car.year) lines.push(tx('Year') + ': ' + car.year);
    if (car.mileage) lines.push(tx('Mileage (mi)') + ': ' + car.mileage);
    if (car.notes.trim()) lines.push(car.notes.trim());
    setEnquiry(lines.join('\n'));
  }

  return intent ? <>
    <div {...stylex.props(s.backdrop)} onMouseDown={event => event.target === event.currentTarget && close()}>
      <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sell-enquiry-title" {...stylex.props(s.sheet)}>
        <header {...stylex.props(s.header)}><div><p {...stylex.props(s.eyebrow, t.caption)}>{dealer.name}</p><h2 id="sell-enquiry-title" {...stylex.props(t.heading)}>{tx('Your car')}</h2></div><button type="button" aria-label={tx('Close car details')} onClick={close} {...stylex.props(s.close)}><X size={22} aria-hidden="true"/></button></header>
        <div role="group" aria-label={tx('Selling options')} {...stylex.props(s.intent)}>
          {(['sale', 'exchange'] as const).map(option => <button key={option} type="button" aria-pressed={intent === option} onClick={() => onIntentChange(option)} {...stylex.props(s.choice, t.control, intent === option && s.selected)}>{tx(option === 'sale' ? 'Sell' : 'Exchange')}</button>)}
        </div>
        <form onSubmit={event => {event.preventDefault(); prepare();}} {...stylex.props(s.form)}>
          <div {...stylex.props(s.fields)}>
            <label {...stylex.props(s.label, t.caption)}>{tx('Make')}<input required maxLength={80} value={car.make} onChange={event => update('make', event.target.value)} autoComplete="off" placeholder={tx('e.g. Toyota')} {...stylex.props(s.input, t.input)}/></label>
            <label {...stylex.props(s.label, t.caption)}>{tx('Model')}<input required maxLength={100} value={car.model} onChange={event => update('model', event.target.value)} autoComplete="off" placeholder={tx('e.g. Corolla')} {...stylex.props(s.input, t.input)}/></label>
            <label {...stylex.props(s.label, t.caption)}>{tx('Year')}<input type="number" inputMode="numeric" min={1900} max={new Date().getFullYear() + 1} value={car.year} onChange={event => update('year', event.target.value)} placeholder="2019" {...stylex.props(s.input, t.input)}/></label>
            <label {...stylex.props(s.label, t.caption)}>{tx('Mileage (mi)')}<input type="number" inputMode="numeric" min={0} max={9999999} value={car.mileage} onChange={event => update('mileage', event.target.value)} placeholder="85000" {...stylex.props(s.input, t.input)}/></label>
          </div>
          <label {...stylex.props(s.label, t.caption)}>{tx('Anything else? (optional)')}<textarea rows={2} maxLength={2000} value={car.notes} onChange={event => update('notes', event.target.value)} placeholder={tx('Condition, service history or your next car')} {...stylex.props(s.input, s.notes, t.input)}/></label>
          <p {...stylex.props(s.note, t.caption)}>{tx('The dealer confirms the valuation after reviewing your car.')}</p>
          <button type="submit" {...stylex.props(s.action, t.control)}>{tx('Prepare enquiry')}<ArrowRight size={18} aria-hidden="true"/></button>
        </form>
      </section>
    </div>
    <DealerEnquirySheet open={enquiry !== null} onClose={() => setEnquiry(null)} vehicleTitle={enquiry || undefined} intent={intent === 'exchange' ? 'part-exchange' : 'selling'}/>
  </> : null;
}

const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 240, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto', padding: {[media.mobile]: '20px 20px calc(24px + env(safe-area-inset-bottom))', default: 28}, color: $.ink, backgroundColor: '#fff', borderRadius: 24, outlineStyle: 'none'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  eyebrow: {marginBottom: 4, color: $.muted},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: '50%', color: $.ink, backgroundColor: '#f4f4f5', cursor: 'pointer'},
  intent: {display: 'flex', gap: 8, marginTop: 20},
  choice: {flex: '1 1 0', minWidth: 0, minHeight: 44, padding: '10px 12px', borderWidth: 0, borderRadius: 30, color: $.ink, backgroundColor: '#f4f4f5', cursor: 'pointer'},
  selected: {color: '#fff', backgroundColor: '#262629'},
  form: {display: 'grid', gap: 18, marginTop: 22},
  fields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '16px 12px'},
  label: {display: 'grid', gap: 7, minWidth: 0},
  input: {display: 'block', width: '100%', minWidth: 0, minHeight: 48, padding: '11px 12px', color: $.ink, borderWidth: 1, borderStyle: 'solid', borderColor: $.controlBorder, borderRadius: 12, backgroundColor: '#fff'},
  notes: {resize: 'vertical'},
  note: {color: $.muted},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 50, padding: '12px 16px', color: '#fff', borderWidth: 0, borderRadius: 14, backgroundColor: '#262629', cursor: 'pointer'},
});
