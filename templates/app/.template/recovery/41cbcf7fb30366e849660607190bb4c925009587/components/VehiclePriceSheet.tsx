'use client';
import {useCopy} from '@/lib/locale';
import {useState} from 'react';
import {currency} from '@/lib/currency';
import LoanSliderFrame from '@/components/LoanSliderFrame';
import * as stylex from '@stylexjs/stylex';
import {X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import {formatPrice, type Vehicle} from '@/lib/data';
import {calculateReferenceLoan} from '@/lib/loan-estimate';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Displays the captured fee/loan presentation. It never requests a loan or credit check. */
export default function VehiclePriceSheet({kind, vehicle, onClose, onEligibility,convenienceFee=3500}: {kind: 'price' | 'emi'; vehicle: Vehicle;convenienceFee?:number; onClose: () => void; onEligibility: () => void}) {
  const tx = useCopy();

  const panel = useModal(true, onClose);
  const [downPayment, setDownPayment] = useState(Math.floor(vehicle.price * 0.2));
  const [years, setYears] = useState(5);
  const fee = convenienceFee;
  const {loan, interest, monthly} = calculateReferenceLoan(vehicle.price, downPayment, years);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => event.currentTarget === event.target && onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx(kind === 'price' ? 'Price breakdown' : 'EMI plans')} {...stylex.props(s.sheet, kind === 'emi' && s.emiSheet)}>
      {kind === 'price' ? <>
        <span aria-hidden="true" {...stylex.props(s.handle)} />
        <h2 {...stylex.props(s.priceHeading)}>{tx("Price breakdown")}</h2>
        <div {...stylex.props(s.box)}>
          <div {...stylex.props(s.priceRow, s.baseRow)}><strong {...stylex.props(s.strong)}>{tx("Base car price")}</strong><strong {...stylex.props(s.strong)}>{tx(currency.code)} {tx(formatPrice(vehicle.price))}</strong></div>
          <div {...stylex.props(s.feeGroup)}><div {...stylex.props(s.priceRow)}><span {...stylex.props(s.dotted)}>{tx("Convenience fee")}</span><span>{tx(currency.code)} {tx(formatPrice(fee))}</span></div><p {...stylex.props(s.description,s.feeDescription)}>{tx("Includes end to end support for a stress-free car buying experience.")}</p></div>
          <div {...stylex.props(s.priceRow, s.benefit, s.firstBenefit)}><span>{tx("3 months warranty")}</span><span {...stylex.props(s.free)}>{tx("Free")}</span></div>
          <div {...stylex.props(s.priceRow, s.benefit)}><span>{tx("30 day return")}</span><span {...stylex.props(s.free)}>{tx("Free")}</span></div>
          <div {...stylex.props(s.priceRow, s.total)}><strong {...stylex.props(s.strong)}>{tx("Total car price")}</strong><strong {...stylex.props(s.strong)}>{tx(currency.code)} {tx(formatPrice(vehicle.price + fee))}</strong></div>
        </div>
        <div {...stylex.props(s.box, s.mandatory)}><h3 {...stylex.props(s.boxHeading)}>{tx("Other mandatory charges")}</h3>
          <div {...stylex.props(s.charge, s.firstCharge)}><div><span {...stylex.props(s.dotted)}>{tx("Registration fee (Dubai)")}</span><p {...stylex.props(s.description)}>{tx("Paid to Road Transport Authority (RTA)")}</p></div><p {...stylex.props(s.actuals)}>{tx("On actuals")}<small>{tx("(")}{tx(currency.code)} {tx(" 788)")}</small></p></div>
          <div {...stylex.props(s.charge)}><div><span {...stylex.props(s.dotted)}>{tx("Insurance fee (estimated)")}</span><p {...stylex.props(s.description)}>{tx("Paid directly to insurance provider")}</p></div><p {...stylex.props(s.actuals)}>{tx("On actuals")}<small>{tx("(")}{tx(currency.code)} {tx(" 2,500)")}</small></p></div>
        </div>
        <p {...stylex.props(s.priceNote)}><strong {...stylex.props(s.strong)}>{tx("Note:")}</strong> {tx(" 2 year warranty and service contract is mandatory for availing zero downpayment option.")}</p>
        <button type="button" onClick={onClose} aria-label={tx("Close price breakdown")} {...stylex.props(s.accessibleClose)}><X size={20} /></button>
      </> : <>
        <header {...stylex.props(s.emiHeader)}><h2 {...stylex.props(s.emiHeading)}>{tx("Your loan eligibility")}</h2><button type="button" aria-label={tx("Close EMI plans")} onClick={onClose} {...stylex.props(s.close)}><X size={23} strokeWidth={1.5} /></button></header>
        <section {...stylex.props(s.emiSummary)}><p {...stylex.props(s.emiLabel)}>{tx("Total Monthly EMI:")}</p><output aria-live="polite" {...stylex.props(s.emiAmount)}><strong {...stylex.props(s.strong)}>{tx(currency.code)} {tx(formatPrice(monthly))}</strong> {tx(" for ")}{tx(years)} {tx(years === 1 ? 'year' : 'years')}</output></section>
        <div {...stylex.props(s.sliderLabel)}><label htmlFor="vehicle-downpayment">{tx("Select your Downpayment")}</label><output {...stylex.props(s.depositValue)}>{tx(currency.code)} {tx(formatPrice(downPayment))}</output></div>
        <LoanSliderFrame><input id="vehicle-downpayment" type="range" min={0} max={Math.floor(vehicle.price / 2)} step={1} value={downPayment} onChange={event => setDownPayment(Number(event.target.value))} aria-label={tx("Downpayment amount")} style={{'--range-progress': `${downPayment / Math.floor(vehicle.price / 2) * 100}%`} as React.CSSProperties} className="cars24-emi-range" /></LoanSliderFrame>
        <div {...stylex.props(s.limits)}><span>{tx(currency.code)} {tx(" 0")}</span><span>{tx(currency.code)} {tx(formatPrice(Math.floor(vehicle.price / 2)))}</span></div>
        <fieldset {...stylex.props(s.tenure)}><legend>{tx("I can repay the loan in (years)*")}</legend><div {...stylex.props(s.yearButtons)}>{[1, 2, 3, 4, 5].map(value => <button type="button" key={value} onClick={() => setYears(value)} aria-label={tx(`${value} ${value === 1 ? 'year' : 'years'} loan tenure`)} aria-pressed={years === value} {...stylex.props(s.year, years === value && s.selectedYear)}>{tx(value)}</button>)}</div></fieldset>
        <div {...stylex.props(s.interestRow)}><p>{tx("Interest rate*")}<small {...stylex.props(s.rateDetail)}>{tx("Calculated @ ")}{tx(interest.toFixed(2))}{tx("%")}</small></p><p {...stylex.props(s.loanAmount)}>{tx("Loan Amount")}<small {...stylex.props(s.rateDetail)}>{tx(currency.code)} {tx(formatPrice(loan))}</small></p></div>
        <p {...stylex.props(s.loanTerms)}>{tx("*Special interest rate at 1.99% per year for ENBD customers.")}<br />{tx("1.99% interest rate is for the first year and 2.99% for the next 4 years, averaging 2.79% over 5 years.")}</p>
        <p {...stylex.props(s.loanTerms)}>{tx("Loan approval, repayment schedule, interest rates, and other terms are decided solely by the partner banks after reviewing the customer’s credit history and other factors. Loan tenure can range from 12 to 60 months. Repayments usually begin 1 month after approval unless covered by a special bank offer.")}</p>
        <aside {...stylex.props(s.pleaseNote)}><h3 {...stylex.props(s.noteTitle)}>{tx("Please Note")}</h3><ul {...stylex.props(s.noteList)}><li>{tx("Convenience fee, Insurance fee &amp; RTA fee is not included in this EMI")}</li><li>{tx("2 year warranty and service contract is mandatory for availing zero downpayment")}</li></ul></aside>
        <button type="button" onClick={onEligibility} aria-label={tx("Check loan eligibility from EMI plans")} {...stylex.props(s.eligibility)}>{tx("CHECK YOUR LOAN ELIGIBILITY")}</button>
      </>}
    </section>
  </div>;
}
const s = stylex.create({
  strong:{fontWeight:600},
  backdrop: {display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', position: 'fixed', top: {[media.mobile]:51,default:0}, right:0, bottom:0, left:0, zIndex: 210, backgroundColor: 'rgba(0,0,0,.45)'},
  sheet: {position: 'relative', width: '100%', maxWidth: 600, minHeight:{[media.mobile]:'min(620px,calc(100dvh - 75px))',default:0}, maxHeight: 'calc(100dvh - 75px)', overflowY: 'auto', padding: '20px 18px 58px', color: '#202024', fontFamily: $.fontDisplay, borderRadius: '8px 8px 0 0', outlineStyle: 'none', backgroundColor: '#fafafa'},
  handle: {position: 'absolute', top: 8, left: 'calc(50% - 17px)', width: 34, height: 2, borderRadius: 2, backgroundColor: '#c6c6c6'},
  priceHeading: {marginBottom: 12, color: '#080808', fontSize: 16, fontWeight: 500, lineHeight: '24px'},
  box: {padding: '18px 17px 13px', borderColor: '#e7e7e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff'},
  priceRow: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 13, lineHeight: '20px'},
  baseRow: {color: '#202024',fontWeight:700},
  feeDescription:{maxWidth:300},
  feeGroup: {marginTop: 24},
  dotted: {textDecorationLine: 'underline', textDecorationStyle: 'dashed', textUnderlineOffset: '6px'},
  description: {marginTop: 6, color: '#696969', fontSize: 12, lineHeight: '18px'},
  firstBenefit:{marginTop:15},
  benefit: {marginTop: 16, color: '#535353'},
  free: {padding: '0 5px', color: '#1d713b', fontSize: 11, letterSpacing: '.04em', borderRadius: 2, backgroundColor: '#edf9f3'},
  total: {marginTop: 17, fontSize: 16, lineHeight: '24px'},
  mandatory: {marginTop: 12, paddingBottom:19},
  boxHeading: {fontSize: 13, fontWeight: 500, lineHeight: '20px'},
  firstCharge:{marginTop:11},
  charge: {display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8, marginTop: 16, fontSize: 13, lineHeight: '20px'},
  actuals: {display: 'flex', alignItems: 'flex-end', flexDirection: 'column', flexShrink: 0, color: '#202024', fontSize: 13},
  priceNote: {maxWidth:355, marginTop: 27, paddingInline: 8, color: '#5f5f5f', fontSize: 13, lineHeight: '20px'},
  accessibleClose: {position: 'absolute', top: 17, right: 17, display: 'grid', placeItems: 'center', width: 26, height: 26, padding: 0, opacity: {default: 0, ':focus-visible': 1}, color: '#202024', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  emiSheet: {minHeight:{[media.mobile]:'min(856px,calc(100dvh - 96px))',default:0}, maxHeight: 'calc(100dvh - 96px)', padding: '12px 22px 50px', borderRadius: '16px 16px 0 0', backgroundColor: '#fff'},
  emiHeader: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 34},
  emiHeading: {position:'relative',left:-2,top:-2,fontSize: 18, fontWeight: 600, lineHeight: '27px'},
  close: {display: 'grid', placeItems: 'center', width: 32, height: 32, padding: 0, color: '#f17100', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  emiSummary: {marginTop: 21, padding: '13px 12px 10px', textAlign: 'center', borderRadius: 11, backgroundColor: '#f8f8f8'},
  emiLabel: {color: '#5e5e5e', fontSize: 11, fontWeight: 500, lineHeight: '17px'},
  emiAmount: {display: 'block', marginTop: 2, color: '#202024', fontSize: 22, lineHeight: '33px'},
  sliderLabel: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 19, fontSize: 13, fontWeight: 500, lineHeight: '20px'},
  depositValue:{fontFamily:'Roboto,Arial,sans-serif',color:'#535353',fontSize:16,fontWeight:500},
  limits: {display: 'flex', justifyContent: 'space-between', marginTop: 0, color: '#535353', fontSize: 12, lineHeight: '18px'},
  tenure: {marginTop: 20, padding: 0, color: '#202024', fontSize: 14, fontWeight: 500, lineHeight: '21px', borderWidth: 0},
  yearButtons: {display: 'flex', gap: 12, marginTop: 16},
  year: {width: 49, height: 36, padding: 0, color: '#202024', fontSize: 16, fontWeight: 600, borderColor: '#e7e7e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 5, backgroundColor: '#fff', cursor: 'pointer'},
  selectedYear: {color: '#fff', borderColor: '#202024', backgroundColor: '#202024'},
  interestRow: {display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24, fontSize: 13, lineHeight: '21px'},
  rateDetail: {display:'block',marginTop:2,color:'#929292',fontSize:13,lineHeight:'20px'},
  loanAmount: {textAlign: 'right'},
  loanTerms: {marginTop: 21, color: '#535353', fontSize: 11, lineHeight: '18px'},
  noteTitle:{fontSize:13,fontWeight:500,lineHeight:'20px'},
  noteList:{display:'grid',gap:3,margin:'8px 0 0',paddingLeft:11,lineHeight:'18px'},
  pleaseNote: {marginTop: 18, padding: '12px 13px', color: '#943700', fontSize: 11, lineHeight: '19px', borderColor: '#fa9400', borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: '#fff6e1'},
  eligibility: {width: '100%', minHeight: 45, marginTop: 25, padding: '10px 8px', color: '#fff', fontSize: 17, fontWeight: 600, lineHeight: '24px', borderWidth: 0, borderRadius: 9, backgroundColor: '#202024', cursor: 'pointer'},
});
