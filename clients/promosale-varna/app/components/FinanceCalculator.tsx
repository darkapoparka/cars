'use client';

import {useId, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {currency} from '@/lib/currency';
import {formatPrice} from '@/lib/data';
import {estimateFinance} from '@/lib/finance';
import {useCopy} from '@/lib/locale';
import LoanSliderFrame from './LoanSliderFrame';
import {media, tokens as $} from '@/app/tokens.stylex';
export default function FinanceCalculator({initialPrice = 25000}: {initialPrice?: number}) {
  const tx = useCopy(), id = useId();
  const [price, setPrice] = useState(Math.max(1, initialPrice));
  const [depositPercent, setDepositPercent] = useState(20);
  const [rate, setRate] = useState(7), [years, setYears] = useState(5);
  const deposit = price * depositPercent / 100;
  const estimate = estimateFinance(price, deposit, rate, years);
  return <section aria-label={tx('Illustrative finance calculator')} {...stylex.props(s.card)}>
    <h2 {...stylex.props(s.title)}>{tx('Explore a payment example')}</h2>
    <p {...stylex.props(s.note)}>{tx('Illustration only. This is not a dealer or lender offer. Change the assumptions below.')}</p>
    <div {...stylex.props(s.fields)}>
      <label htmlFor={id + '-price'} {...stylex.props(s.field)}>{tx('Vehicle price')} ({currency.code})<input id={id + '-price'} type="number" min={1} max={10000000} value={price} onChange={e => setPrice(Math.max(1, Math.min(10000000, Number(e.target.value) || 1)))} {...stylex.props(s.number)}/></label>
      <label htmlFor={id + '-rate'} {...stylex.props(s.field)}>{tx('Annual interest')} (%)<input id={id + '-rate'} type="number" min={0} max={50} step={0.1} value={rate} onChange={e => setRate(Math.max(0, Math.min(50, Number(e.target.value) || 0)))} {...stylex.props(s.number)}/></label>
    </div>
    <div {...stylex.props(s.row)}><label htmlFor={id + '-deposit'}>{tx('Deposit')}</label><output>{currency.code} {formatPrice(Math.round(deposit))} · {depositPercent}%</output></div>
    <LoanSliderFrame><input id={id + '-deposit'} type="range" min={0} max={80} value={depositPercent} onChange={e => setDepositPercent(Number(e.target.value))} aria-label={tx('Deposit percentage')} className="cars24-emi-range" style={{'--range-progress': `${depositPercent / 80 * 100}%`} as React.CSSProperties}/></LoanSliderFrame>
    <fieldset {...stylex.props(s.term)}><legend>{tx('Repayment term')}</legend><div {...stylex.props(s.terms)}>{[1, 2, 3, 4, 5, 6, 7].map(term => <button type="button" key={term} aria-pressed={years === term} onClick={() => setYears(term)} {...stylex.props(s.termButton, years === term && s.selected)}>{term} {tx(term === 1 ? 'year' : 'years')}</button>)}</div></fieldset>
    <div {...stylex.props(s.summary)}><span>{tx('Estimated monthly payment')}</span><output aria-live="polite" {...stylex.props(s.amount)}>{currency.code} {formatPrice(Math.round(estimate.monthly))}</output><span>{tx('Example total including deposit')}: {currency.code} {formatPrice(Math.round(estimate.total))}</span></div>
    <p {...stylex.props(s.note)}>{tx('Taxes, registration, insurance and additional fees are not included. Actual rates, eligibility and service availability must be confirmed with the dealer and lender.')}</p>
  </section>;
}
const s = stylex.create({
  card: {marginTop: 24, padding: {[media.mobile]: 18, default: 26}, color: $.ink, borderColor: '#e4e4e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, backgroundColor: '#fff'},
  title: {fontSize: {[media.mobile]: 19, default: 24}, fontWeight: 600, lineHeight: 1.3},
  note: {marginTop: 12, color: $.muted, fontSize: 12, lineHeight: 1.6},
  fields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, marginTop: 20},
  field: {display: 'grid', alignContent: 'start', gap: 8, fontSize: 12, lineHeight: 1.5},
  number: {width: '100%', minWidth: 0, height: 44, padding: '8px 10px', borderColor: '#d4d4d8', borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: '#fff', color: $.ink, fontSize: 16},
  row: {display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 24, fontSize: 13},
  term: {marginTop: 16, padding: 0, borderWidth: 0, fontSize: 13},
  terms: {display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10},
  termButton: {minWidth: 58, minHeight: 44, padding: '6px 10px', borderColor: '#d4d4d8', borderStyle: 'solid', borderWidth: 1, borderRadius: 10, backgroundColor: '#fff', color: $.ink, fontSize: 12, cursor: 'pointer'},
  selected: {color: '#fff', borderColor: '#262629', backgroundColor: '#262629'},
  summary: {display: 'grid', gap: 6, marginTop: 22, padding: 18, textAlign: 'center', color: $.muted, fontSize: 12, borderRadius: 14, backgroundColor: '#f4f4f5'},
  amount: {color: $.ink, fontSize: 29, fontWeight: 600},
});
