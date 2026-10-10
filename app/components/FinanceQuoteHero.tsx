'use client';

import * as stylex from '@stylexjs/stylex';
import {ArrowRight, Search} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {tokens as $} from '@/app/tokens.stylex';
import {searchField} from './search-field.stylex';
import {desktopHero} from './desktop-hero.stylex';

/** Choose a real car before opening the existing calculator and its assumptions. */
export default function FinanceQuoteHero({onChooseCar, pickerOpen}: {onChooseCar: () => void; pickerOpen: boolean}) {
  const tx = useCopy();
  return <button type="button" data-finance-quote-car aria-haspopup="dialog" aria-expanded={pickerOpen} onClick={onChooseCar} {...stylex.props(searchField.field, desktopHero.bar, desktopHero.singleFieldBar, s.control)}>
    <Search size={22} aria-hidden="true" {...stylex.props(searchField.icon)}/>
    <span {...stylex.props(s.label)}>{tx('Choose your car')}</span>
    <span aria-hidden="true" {...stylex.props(s.arrow)}><ArrowRight size={20}/></span>
  </button>;
}

const s = stylex.create({
  control: {display: 'flex', alignItems: 'center', gap: 12, paddingInline: 20, color: $.ink, fontFamily: $.fontSans, textAlign: 'left', backgroundColor: {default: '#fff', ':hover': '#f4f4f5'}, outlineColor: '#fff', outlineOffset: 3, cursor: 'pointer'},
  label: {flexGrow: 1, fontSize: 16, fontWeight: 400, lineHeight: '24px'},
  arrow: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, color: '#fff', borderRadius: '50%', backgroundColor: $.ink},
});
