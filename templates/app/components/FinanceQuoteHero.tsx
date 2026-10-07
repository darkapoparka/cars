'use client';

import {useEffect, useId, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Search} from 'lucide-react';
import {currency} from '@/lib/currency';
import {formatPrice, type Vehicle} from '@/lib/data';
import {estimateFinance} from '@/lib/finance';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import {media, tokens as $} from '@/app/tokens.stylex';
import {pillStyles} from './pill.stylex';
import {searchField} from './search-field.stylex';
import {desktopHero} from './desktop-hero.stylex';
import DepositPresetMenu from './DepositPresetMenu';

export type QuoteSelection = {car: Vehicle | null; custom: boolean};

function QuoteNumber({id, label, value, onChange, min, max, step = 1, inputRef}: {id: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; inputRef?: React.Ref<HTMLInputElement>}) {
  const [draft, setDraft] = useState(String(value));
  const [editing, setEditing] = useState(false);
  return <input ref={inputRef} id={id} data-focus-owner="field" type="number" inputMode={step < 1 ? 'decimal' : 'numeric'} aria-label={label} min={min} max={max} step={step} value={editing ? draft : value}
    onFocus={() => {setDraft(String(value)); setEditing(true);}}
    onChange={event => {const raw = event.target.value; setDraft(raw); if (raw.trim() && Number.isFinite(Number(raw))) onChange(Math.max(min, Math.min(max, Number(raw))));}}
    onBlur={() => {onChange(Math.max(min, Math.min(max, Number(draft) || min))); setEditing(false);}}
    onKeyDown={event => {if (event.key === 'Enter') event.currentTarget.blur();}} {...stylex.props(s.input)}/>;
}

/** The desktop leasing bar uses the existing stock picker and finance domain estimate. */
export default function FinanceQuoteHero({selection, onChooseCar, pickerOpen}: {selection: QuoteSelection; onChooseCar: () => void; pickerOpen: boolean}) {
  const tx = useCopy(), id = useId();
  const [customPrice, setCustomPrice] = useState(25000);
  const [depositPercent, setDepositPercent] = useState(20);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);
  const priceInput = useRef<HTMLInputElement>(null);
  const depositInput = useRef<HTMLInputElement>(null);
  const chooseControl = useRef<HTMLButtonElement>(null);
  const price = selection.car?.price ?? customPrice;
  const ready = Boolean(selection.car || selection.custom);
  const deposit = price * depositPercent / 100;
  const estimate = estimateFinance(price, deposit, rate, years);

  useEffect(() => {
    if (!selection.custom && !selection.car) return;
    const frame = requestAnimationFrame(() => {
      const control = selection.custom ? priceInput.current : chooseControl.current;
      if (control?.getClientRects().length) control.focus({preventScroll: true});
    });
    return () => cancelAnimationFrame(frame);
  }, [selection.car, selection.custom]);

  return <section data-finance-quote aria-label={tx('Illustrative finance calculator')} {...stylex.props(s.quote)}>
    <div {...stylex.props(searchField.field, s.bar, desktopHero.bar)}>
      <div {...stylex.props(s.carSlot)}>
        {selection.custom ? <><label htmlFor={id + '-price'} {...stylex.props(pillStyles.surface, pillStyles.soft, s.field, desktopHero.cell, desktopHero.field, s.priceField)}><span {...stylex.props(s.caption)}>{tx('Vehicle price')} ({currency.symbol})</span><QuoteNumber inputRef={priceInput} id={id + '-price'} label={`${tx('Vehicle price')} (${currency.symbol})`} min={1} max={10000000} value={customPrice} onChange={setCustomPrice}/></label><button ref={chooseControl} type="button" aria-label={tx('Choose your car')} aria-haspopup="dialog" aria-expanded={pickerOpen} onClick={onChooseCar} {...stylex.props(s.chooseIcon)}><Search size={20} aria-hidden="true"/></button></> :
          <button ref={chooseControl} type="button" data-finance-quote-car aria-label={tx(selection.car ? 'Change car' : 'Choose your car')} aria-describedby={selection.car ? id + '-car' : undefined} aria-haspopup="dialog" aria-expanded={pickerOpen} onClick={onChooseCar} {...stylex.props(pillStyles.control, s.car, desktopHero.cell)}>
            {selection.car ? <img src={assetPath(selection.car.image)} width={64} height={48} alt="" {...stylex.props(s.carImage)}/> : <Search size={20} aria-hidden="true" {...stylex.props(s.icon)}/>}
            <span id={id + '-car'} {...stylex.props(s.carCopy)}><span {...stylex.props(s.carTitle)}>{selection.car ? `${selection.car.make} ${selection.car.model}` : tx('Choose your car')}</span><span {...stylex.props(s.caption)}>{selection.car ? `${selection.car.year} · ${currency.symbol} ${formatPrice(selection.car.price)}` : tx('Search our stock')}</span></span><ChevronDown size={16} aria-hidden="true" {...stylex.props(s.icon)}/>
          </button>}
      </div>
      <div {...stylex.props(s.terms)}>
        <div data-deposit-field {...stylex.props(pillStyles.surface, pillStyles.soft, s.field, desktopHero.cell, desktopHero.field, s.depositField)}><label htmlFor={id + '-deposit'} {...stylex.props(s.caption)}>{tx('Down payment')}</label><span {...stylex.props(s.numberValue)}><QuoteNumber inputRef={depositInput} id={id + '-deposit'} label={tx('Deposit percentage')} min={0} max={80} value={depositPercent} onChange={setDepositPercent}/><span aria-hidden="true">%</span></span><DepositPresetMenu value={depositPercent} onChange={setDepositPercent} inputRef={depositInput}/></div>
        <label htmlFor={id + '-term'} {...stylex.props(pillStyles.surface, pillStyles.soft, s.field, desktopHero.cell, desktopHero.field)}><span {...stylex.props(s.caption)}>{tx('Term')}</span><span {...stylex.props(s.numberValue)}><select id={id + '-term'} data-focus-owner="field" aria-label={tx('Repayment term')} value={years} onChange={event => setYears(Number(event.target.value))} {...stylex.props(s.input, s.select)}>{[1, 2, 3, 4, 5, 6, 7].map(term => <option key={term} value={term}>{term * 12} {tx('months')}</option>)}</select><ChevronDown size={14} aria-hidden="true" {...stylex.props(s.selectIcon)}/></span></label>
      </div>
      <div {...stylex.props(s.result, desktopHero.cell)}>
        <output data-finance-quote-monthly aria-live="polite" aria-atomic="true" aria-label={tx('Monthly estimate')} {...stylex.props(s.monthly)}>{ready ? `${currency.symbol} ${formatPrice(Math.round(estimate.monthly))}` : '—'}<span {...stylex.props(s.perMonth)}>{tx('per month')}</span></output>
        <span data-finance-quote-total {...stylex.props(s.total)}>{ready ? `${tx('Total with deposit')}: ${currency.symbol} ${formatPrice(Math.round(estimate.total))}` : tx('Choose a car to see your estimate')}</span>
      </div>
    </div>
    <div {...stylex.props(s.assumptions)}>
      <label htmlFor={id + '-rate'} {...stylex.props(s.rate)}>{tx('Annual interest')}<span {...stylex.props(s.rateInput)}><QuoteNumber id={id + '-rate'} label={`${tx('Annual interest')} (%)`} min={0} max={50} step={0.1} value={rate} onChange={setRate}/><span aria-hidden="true">%</span></span></label>
      <span {...stylex.props(s.estimateNote)}>{tx('An estimate, not a finance offer.')}</span>
      <details {...stylex.props(s.details)}><summary {...stylex.props(s.detailsToggle)}>{tx('About this estimate')}</summary><p {...stylex.props(s.detailCopy)}>{tx('Taxes, registration, insurance and additional fees are not included. Actual rates, eligibility and service availability must be confirmed with the dealer and lender.')}</p></details>
    </div>
  </section>;
}

const s = stylex.create({
  quote: {width: '100%', color: '#fff', fontFamily: $.fontSans},
  bar: {display: 'grid', alignItems: 'stretch', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1.1fr) minmax(0,.95fr)', color: $.ink, borderColor: '#fff', backgroundColor: '#fff'},
  carSlot: {display: 'flex', alignItems: 'stretch', gap: 8, minWidth: 0},
  car: {display: 'flex', justifyContent: 'flex-start', gap: 10, width: '100%', minWidth: 0, paddingBlock: 6, paddingInline: 16, textAlign: 'left', fontWeight: 400, backgroundColor: {default: '#f4f4f5', ':hover': '#eaeaed'}, outline: {default: 'none', ':focus-visible': '2px solid #202023'}, outlineOffset: -2},
  carImage: {flexShrink: 0, width: 56, height: 42, objectFit: 'cover', borderRadius: 14},
  carCopy: {display: 'grid', flexGrow: 1, gap: {[media.desktop]: 2, default: 3}, minWidth: 0},
  carTitle: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: {[media.desktop]: $.desktopTextSize, default: 15}, lineHeight: {[media.desktop]: '24px', default: '20px'}},
  icon: {flexShrink: 0},
  terms: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8, minWidth: 0},
  field: {display: 'grid', alignContent: 'center', justifyContent: 'stretch', gap: 2, minWidth: 0, borderWidth: 0, outline: {default: 'none', ':focus-within': '2px solid #202023'}, outlineOffset: -2},
  depositField: {position: 'relative', paddingInlineEnd: {[media.desktop]: 40, default: null}},
  caption: {color: $.muted, fontSize: 12, fontWeight: 400, lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  numberValue: {position: 'relative', display: 'flex', alignItems: 'center', gap: 3, minWidth: 0, fontSize: 16, lineHeight: '22px'},
  input: {width: '100%', minWidth: 0, height: 24, padding: 0, color: 'inherit', fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: '24px', borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent', fontVariantNumeric: 'tabular-nums'},
  select: {appearance: 'none', paddingRight: 14, cursor: 'pointer'},
  selectIcon: {position: 'absolute', right: 0, pointerEvents: 'none'},
  priceField: {flexGrow: 1},
  chooseIcon: {display: 'grid', placeItems: 'center', alignSelf: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: {default: '#f4f4f5', ':hover': '#eaeaed'}, cursor: 'pointer'},
  result: {display: 'grid', alignContent: 'center', gap: 2, minWidth: 0, paddingBlock: {[media.desktop]: 3, default: 4}, paddingInline: 16, color: $.ink, borderInlineStartWidth: 1, borderInlineStartStyle: 'solid', borderInlineStartColor: $.line},
  monthly: {display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, fontSize: 24, fontWeight: 600, lineHeight: '28px', fontVariantNumeric: 'tabular-nums'},
  perMonth: {fontSize: 12, fontWeight: 400, lineHeight: '18px', color: $.muted},
  total: {fontSize: {[media.desktop]: $.desktopLabelSize, default: 11}, fontWeight: 400, lineHeight: {[media.desktop]: '18px', default: '16px'}, color: $.muted},
  assumptions: {display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: 16, rowGap: 4, marginTop: 8, paddingInline: 18, color: '#d8d8de', fontSize: 12, lineHeight: '18px'},
  rate: {display: 'inline-flex', alignItems: 'baseline', gap: 6},
  rateInput: {display: 'inline-flex', alignItems: 'center', width: 68, gap: 2, padding: '0 6px', color: '#fff', borderRadius: 8, backgroundColor: '#38383d', outline: {default: 'none', ':focus-within': '2px solid #fff'}, outlineOffset: 2},
  estimateNote: {flexGrow: 1, textAlign: 'center'},
  details: {display: 'contents'},
  detailsToggle: {minHeight: 32, paddingBlock: 6, cursor: 'pointer', borderRadius: 4, outlineColor: '#fff'},
  detailCopy: {flexBasis: '100%', padding: '8px 0 0', margin: 0, color: '#d8d8de', textAlign: 'left'},
});
