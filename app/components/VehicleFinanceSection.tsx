'use client';
import {useCopy} from '@/lib/locale';
import Image from '@/components/AppImage';

import {useState} from 'react';
import {currency} from '@/lib/currency';
import LoanSliderFrame from '@/components/LoanSliderFrame';
import * as stylex from '@stylexjs/stylex';
import {BadgeCheck, House, TrendingDown} from 'lucide-react';
import {calculateReferenceLoan} from '@/lib/loan-estimate';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';
import {showroom} from '@/lib/showroom';

export default function VehicleFinanceSection({vehicle, onLogin}: {vehicle: Vehicle; onLogin: () => void}) {
  const tx = useCopy();

  const [deposit, setDeposit] = useState(Math.floor(vehicle.price * .2));
  const [years, setYears] = useState(5);
  const {monthly, loan, interest} = calculateReferenceLoan(vehicle.price, deposit, years);
  return <section id="car-finance" {...stylex.props(s.section)}>
    <h2 {...stylex.props(s.heading)}>{tx("Car Finance")}</h2>
    <Image sizes="(max-width: 1099px) 100vw, 860px" src={showroom.artwork.detail.finance} width={1280} height={918} alt={tx("Car finance: explore your deposit, term and monthly cost.")} {...stylex.props(s.banner)} />
    <div {...stylex.props(s.benefits)}><span><BadgeCheck size={12} />{tx("High approval rates")}</span><span><TrendingDown size={12} />{tx("Low interest rate")}</span><span><House size={12} />{tx("In-house team")}</span></div>
    <div {...stylex.props(s.calculator)}>
      <h3 {...stylex.props(s.calculatorTitle)}>{tx("Estimate your auto loan EMI")}</h3>
      <output aria-live="polite" data-inline-emi {...stylex.props(s.result)}><strong>{tx(currency.code)} {tx(formatPrice(monthly))}{tx("/Month")}</strong> {tx(" for ")}{tx(years)} {tx(years === 1 ? 'year' : 'years')}</output>
      <div {...stylex.props(s.fields)}>
        <div {...stylex.props(s.row)}><label htmlFor="inline-downpayment">{tx("Select your Downpayment")}</label><output {...stylex.props(s.depositValue)}>{tx(currency.code)} {tx(formatPrice(deposit))}</output></div>
        <LoanSliderFrame><input id="inline-downpayment" type="range" aria-label={tx("Inline downpayment amount")} min={0} max={Math.floor(vehicle.price / 2)} value={deposit} onChange={event => setDeposit(Number(event.target.value))} style={{'--range-progress': `${deposit / (vehicle.price / 2) * 100}%`} as React.CSSProperties} className="cars24-emi-range" /></LoanSliderFrame>
        <div {...stylex.props(s.limits)}><span>{tx(currency.code)} {tx(" 0")}</span><span>{tx(currency.code)} {tx(formatPrice(Math.floor(vehicle.price / 2)))}</span></div>
        <fieldset {...stylex.props(s.tenure)}><legend>{tx("I can repay the loan in (years)*")}</legend><div {...stylex.props(s.years)}>{[1,2,3,4,5].map(value => <button key={value} type="button" aria-label={tx(`Inline ${value} year tenure`)} aria-pressed={value === years} onClick={() => setYears(value)} {...stylex.props(s.year, value === years && s.selected)}>{tx(value)}</button>)}</div></fieldset>
        <div {...stylex.props(s.interest)}><p>{tx("Interest rate*")}<br/><small>{tx("Calculated @ ")}{tx(interest.toFixed(2))}{tx("%")}</small></p><p>{tx("Loan Amount")}<br/><small>{tx(currency.code)} {tx(formatPrice(loan))}</small></p></div>
        <p {...stylex.props(s.terms)}>{tx("*Special interest rate at 1.99% per year for ENBD customers.")}<br />{tx("1.99% interest rate is for the first year and 2.99% for the next 4 years, averaging 2.79% over 5 years.")}</p>
        <p {...stylex.props(s.terms)}>{tx("Loan approval, repayment schedule, interest rates, and other terms are decided solely by the partner banks after reviewing the customer’s credit history and other factors. Loan tenure can range from 12 to 60 months.")}</p>
        <aside {...stylex.props(s.note)}><strong>{tx("Please Note")}</strong><p>{tx("• Convenience fee, Insurance fee &amp; RTA fee is not included in this EMI")}<br />{tx("• 2 year warranty and service contract is mandatory for availing zero downpayment")}</p></aside>
        <button type="button" onClick={onLogin} {...stylex.props(s.button)}>{tx("CHECK YOUR LOAN ELIGIBILITY")}</button>
      </div>
    </div>
  </section>;
}
const s = stylex.create({
  section: {scrollMarginTop: 169, marginTop: 40},
  heading: {color: '#202024', fontFamily: $.fontDisplay, fontSize: 16, fontWeight: 600, lineHeight: '24px'},
  banner: {display: 'block', width: {[media.mobile]:'calc(100% + 44px)',default:'100%'}, maxWidth:'none', height: 'auto', aspectRatio: '1280 / 918', objectFit: 'cover', marginTop: 18, marginInline: {[media.mobile]:-22,default:0}},
  benefits: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginInline: {[media.mobile]:-22,default:0}, padding:'10px 22px', color:'#202024', fontSize:11, lineHeight:'17px', backgroundColor:'#fff1e3'},
  calculator: {marginTop:17,overflow:'hidden',borderColor:'#e7e7e7',borderStyle:'solid',borderWidth:1,borderRadius:8,backgroundColor:'#f9f9f9',fontFamily:$.fontDisplay},
  calculatorTitle: {padding:'19px 14px 15px',color:'#202024',fontSize:16,fontWeight:600,lineHeight:'24px'},
  result: {display:'block',padding:'12px 14px',color:$.ink,fontSize:14,lineHeight:'21px',backgroundColor:$.surfaceAlt},
  fields: {padding:'28px 14px 20px'},
  row: {display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,fontSize:13,fontWeight:500,lineHeight:'21px'},
  depositValue:{fontFamily:'Roboto,Arial,sans-serif',color:'#535353',fontSize:16,fontWeight:500},
  limits: {display:'flex',justifyContent:'space-between',marginTop:0,color:'#535353',fontSize:12,lineHeight:'18px'},
  tenure: {marginTop:26,padding:0,borderWidth:0,fontSize:14,fontWeight:500,lineHeight:'22px'},
  years: {display:'flex',gap:11,marginTop:18},
  year: {width:49,height:36,padding:0,color:'#202024',fontSize:16,fontWeight:600,borderColor:'#e7e7e7',borderStyle:'solid',borderWidth:1,borderRadius:5,backgroundColor:'#fff',cursor:'pointer'},
  selected: {color:'#fff',borderColor:'#202024',backgroundColor:'#202024'},
  interest: {display:'flex',justifyContent:'space-between',gap:15,marginTop:26,color:'#202024',fontSize:13,lineHeight:'21px'},
  terms: {marginTop:24,color:'#535353',fontSize:11,lineHeight:'18px'},
  note: {marginTop:20,padding:'13px 14px',color:'#943700',fontSize:11,lineHeight:'19px',borderColor:'#fa9400',borderStyle:'solid',borderWidth:1,borderRadius:9,backgroundColor:'#fff6e1'},
  button: {width:'100%',minHeight:45,marginTop:22,padding:'10px 8px',color:'#fff',fontSize:16,fontWeight:600,lineHeight:'24px',borderWidth:0,borderRadius:9,backgroundColor:'#202024',cursor:'pointer'},
});
