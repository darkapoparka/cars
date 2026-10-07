'use client';

import {useId} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {tokens as $} from '@/app/tokens.stylex';
import type {SellCarDetails} from './SellEnquirySheet';
import {pillStyles} from './pill.stylex';
import {searchField} from './search-field.stylex';
import {desktopHero} from './desktop-hero.stylex';

/** Start the same local car-details draft directly inside the desktop hero. */
export default function SellQuoteHero({car, onCarChange, onStart, expanded}: {car: SellCarDetails; onCarChange: (car: SellCarDetails) => void; onStart: () => void; expanded: boolean}) {
  const tx = useCopy(), id = useId();
  return <section data-sell-hero aria-label={tx('Your car details')} {...stylex.props(s.quote)}>
    <form onSubmit={event => {event.preventDefault(); onCarChange({...car, make: car.make.trim(), model: car.model.trim()}); onStart();}} {...stylex.props(searchField.field, s.bar, desktopHero.bar)}>
      <label htmlFor={id + '-make'} {...stylex.props(pillStyles.surface, pillStyles.soft, s.field, desktopHero.cell, desktopHero.field)}><span {...stylex.props(s.caption)}>{tx('Make')}</span><input id={id + '-make'} data-focus-owner="field" required pattern={'.*\\S.*'} maxLength={80} autoComplete="off" value={car.make} onChange={event => onCarChange({...car, make: event.target.value})} placeholder={tx('e.g. Toyota')} {...stylex.props(s.input)}/></label>
      <label htmlFor={id + '-model'} {...stylex.props(pillStyles.surface, pillStyles.soft, s.field, desktopHero.cell, desktopHero.field)}><span {...stylex.props(s.caption)}>{tx('Model')}</span><input id={id + '-model'} data-focus-owner="field" required pattern={'.*\\S.*'} maxLength={100} autoComplete="off" value={car.model} onChange={event => onCarChange({...car, model: event.target.value})} placeholder={tx('e.g. Corolla')} {...stylex.props(s.input)}/></label>
      <button type="submit" aria-haspopup="dialog" aria-expanded={expanded} {...stylex.props(pillStyles.control, s.action, desktopHero.cell)}>{tx('Sell')}<ArrowRight size={18} aria-hidden="true"/></button>
    </form>
    <p {...stylex.props(s.note)}>{tx('The dealer confirms the valuation after reviewing your car.')}</p>
  </section>;
}

const s = stylex.create({
  quote: {width: '100%', maxWidth: 720, marginInline: 'auto', fontFamily: $.fontSans},
  bar: {display: 'grid', alignItems: 'stretch', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) auto', color: $.ink, borderColor: '#fff', backgroundColor: '#fff'},
  field: {display: 'grid', alignContent: 'center', justifyContent: 'stretch', gap: 2, minWidth: 0, borderWidth: 0, outline: {default: 'none', ':focus-within': '2px solid #202023'}, outlineOffset: -2},
  caption: {fontSize: 12, fontWeight: 400, lineHeight: '16px', color: $.muted},
  input: {width: '100%', minWidth: 0, height: 24, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: '24px', borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 24px', color: '#fff', fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: '24px', whiteSpace: 'nowrap', borderWidth: 0, backgroundColor: {default: '#202023', ':hover': '#38383d'}, outline: {default: 'none', ':focus-visible': '2px solid #fff'}, outlineOffset: -4, cursor: 'pointer'},
  note: {margin: '8px 18px 0', color: '#d8d8de', fontSize: 12, lineHeight: '18px', textAlign: 'center'},
});
