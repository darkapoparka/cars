'use client';

import {useId, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {currency} from '@/lib/currency';
import {formatPrice} from '@/lib/data';
import {estimateFinance} from '@/lib/finance';
import {useCopy} from '@/lib/locale';
import LoanSliderFrame from './LoanSliderFrame';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {typography as t} from '@/app/typography.stylex';

function AmountInput({id, label, value, onChange, min, max, step = 1}: {id: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number}) {
  const [draft, setDraft] = useState(String(value));
  const [editing, setEditing] = useState(false);
  function update(raw: string) {
    setDraft(raw);
    if (raw.trim() && Number.isFinite(Number(raw))) onChange(Math.max(min, Math.min(max, Number(raw))));
  }
  return <input id={id} aria-label={label} type="number" inputMode={step < 1 ? 'decimal' : 'numeric'} min={min} max={max} step={step} value={editing ? draft : value}
    onFocus={() => {setDraft(String(value)); setEditing(true);}} onChange={event => update(event.target.value)}
    onBlur={() => {onChange(Math.max(min, Math.min(max, Number(draft) || min))); setEditing(false);}}
    onKeyDown={event => {if (event.key === 'Enter') event.currentTarget.blur();}} {...stylex.props(s.number, t.input)}/>;
}

export default function FinanceCalculator({initialPrice = 25000, presentation = 'card'}: {initialPrice?: number; presentation?: 'card' | 'dialog'}) {
  const tx = useCopy(), id = useId();
  const [price, setPrice] = useState(Math.max(1, initialPrice));
  const [depositPercent, setDepositPercent] = useState(20);
  const [rate, setRate] = useState(7), [years, setYears] = useState(5);
  const deposit = price * depositPercent / 100;
  const estimate = estimateFinance(price, deposit, rate, years);
  return <section aria-label={tx('Illustrative finance calculator')} {...stylex.props(s.card, presentation === 'dialog' && s.dialog)}>
    {presentation === 'card' ? <h2 {...stylex.props(t.heading)}>{tx('Explore a payment example')}</h2> : null}
    {presentation === 'card' ? <p {...stylex.props(s.note, t.caption)}>{tx('An estimate, not a finance offer.')}</p> : null}
    <div {...stylex.props(s.summary, t.caption, presentation === 'dialog' && s.dialogSummary)}>
      <div {...stylex.props(s.payment)}><output aria-live="polite" {...stylex.props(s.amount, t.amount, presentation === 'dialog' && s.dialogAmount, presentation === 'dialog' && t.featuredAmount)}>{currency.symbol} {formatPrice(Math.round(estimate.monthly))}</output><span>{tx('per month')}</span></div>
      <span>{tx('Total with deposit')}: {currency.symbol} {formatPrice(Math.round(estimate.total))}</span>
      {presentation === 'dialog' ? <p {...stylex.props(s.estimateNote)}>{tx('An estimate, not a finance offer.')}</p> : null}
    </div>
    <div {...stylex.props(s.fields)}>
      <label htmlFor={id + '-price'} {...stylex.props(s.field, t.caption)}>{tx('Vehicle price')} ({currency.symbol})<AmountInput id={id + '-price'} label={`${tx('Vehicle price')} (${currency.symbol})`} min={1} max={10000000} value={price} onChange={setPrice}/></label>
      <div {...stylex.props(s.pairedFields)}>
      <label htmlFor={id + '-rate'} {...stylex.props(s.field, t.caption)}><span><span {...stylex.props(s.desktopCopy)}>{tx('Annual interest')}</span><span {...stylex.props(s.mobileCopy)}>{tx('Annual rate')}</span> (%)</span><AmountInput id={id + '-rate'} label={`${tx('Annual interest')} (%)`} min={0} max={50} step={0.1} value={rate} onChange={setRate}/></label>
      <label htmlFor={id + '-term'} {...stylex.props(s.field, t.caption)}><span><span {...stylex.props(s.desktopCopy)}>{tx('Repayment term')}</span><span {...stylex.props(s.mobileCopy)}>{tx('Term')}</span></span><select id={id + '-term'} aria-label={tx('Repayment term')} value={years} onChange={event => setYears(Number(event.target.value))} {...stylex.props(s.number, t.input)}>{[1, 2, 3, 4, 5, 6, 7].map(term => <option key={term} value={term}>{term} {tx(term === 1 ? 'year' : 'years')}</option>)}</select></label>
      </div>
    </div>
    <div {...stylex.props(s.row, t.caption)}><label htmlFor={id + '-deposit'}><span {...stylex.props(s.desktopCopy)}>{tx('Deposit')}</span><span {...stylex.props(s.mobileCopy)}>{tx('Down payment')}</span></label><output>{currency.symbol} {formatPrice(Math.round(deposit))} · {depositPercent}%</output></div>
    <LoanSliderFrame><input id={id + '-deposit'} type="range" min={0} max={80} value={depositPercent} onChange={e => setDepositPercent(Number(e.target.value))} aria-label={tx('Deposit percentage')} className="cars24-emi-range" style={{'--range-progress': `${depositPercent / 80 * 100}%`} as React.CSSProperties}/></LoanSliderFrame>
    <details {...stylex.props(s.details, t.caption)}><summary {...stylex.props(s.detailsToggle)}>{tx('About this estimate')}</summary><p {...stylex.props(s.note)}>{tx('Taxes, registration, insurance and additional fees are not included. Actual rates, eligibility and service availability must be confirmed with the dealer and lender.')}</p></details>
  </section>;
}
const s = stylex.create({
  card: {marginTop: 24, padding: {[media.mobile]: 18, default: 26}, color: $.ink, borderColor: '#e4e4e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, backgroundColor: '#fff'},
  dialog: {marginTop: 0, padding: 0, borderWidth: 0, borderRadius: 0},
  note: {marginTop: 8, color: $.muted},
  fields: {display: 'grid', gap: 12, marginTop: 18},
  pairedFields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  field: {display: 'grid', minWidth: 0, alignContent: 'start', gap: 8},
  number: {width: '100%', minWidth: 0, minHeight: 44, padding: '8px 10px', borderColor: $.controlBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: '#fff', color: $.ink},
  row: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 20},
  summary: {display: 'grid', gap: 6, marginTop: 14, paddingBottom: 18, color: $.muted, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#e4e4e7'},
  dialogSummary: {padding: 18, color: $.muted, borderWidth: 0, borderRadius: 16, backgroundColor: campaign.lightSurface},
  payment: {display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8},
  amount: {color: $.ink},
  dialogAmount: {color: $.ink},
  estimateNote: {margin: 0},
  details: {marginTop: 8, color: $.muted},
  detailsToggle: {minHeight: 44, paddingBlock: 12, cursor: 'pointer'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
