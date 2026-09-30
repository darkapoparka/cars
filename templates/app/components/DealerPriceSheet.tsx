'use client';

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {ChevronDown, X} from 'lucide-react';
import {currency} from '@/lib/currency';
import {formatPrice, type Vehicle} from '@/lib/data';
import {useCopy} from '@/lib/locale';
import {useModal} from './useModal';
import FinanceCalculator from './FinanceCalculator';
import {media, tokens as $} from '@/app/tokens.stylex';
export default function DealerPriceSheet({vehicle, onClose, onEligibility}: {vehicle: Vehicle; convenienceFee?: number; onClose: () => void; onEligibility: () => void}) {
  const tx = useCopy(), panel = useModal(true, onClose);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => event.currentTarget === event.target && onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="price-information-title" {...stylex.props(s.sheet)}>
      <header {...stylex.props(s.header)}><h2 id="price-information-title" {...stylex.props(s.title)}>{tx('Price information')}</h2><button type="button" aria-label={tx('Close price information')} onClick={onClose} {...stylex.props(s.close)}><X size={22}/></button></header>
      <div {...stylex.props(s.price)}><span>{tx('Advertised vehicle price')}</span><strong>{vehicle.priceOnRequest ? tx('Price on request') : formatPrice(vehicle.price) + ' ' + currency.code}</strong></div><p {...stylex.props(s.note)}>{tx('This is a dated listing sample, not a live quotation. Confirm price, availability, taxes and any additional fees directly with the dealer.')}</p><p {...stylex.props(s.note)}>{tx('No return period, warranty, insurance, registration charge or finance approval is promised by this preview.')}</p>
      <button type="button" aria-expanded={paymentsOpen} aria-controls="vehicle-payment-options" onClick={()=>setPaymentsOpen(open=>!open)} {...stylex.props(s.payments)}>{tx('Payment options')}<ChevronDown size={18} aria-hidden="true" {...stylex.props(paymentsOpen&&s.expanded)}/></button>
      <div id="vehicle-payment-options" hidden={!paymentsOpen}>{paymentsOpen ? <FinanceCalculator initialPrice={vehicle.price || 25000}/> : null}</div>
      <button type="button" onClick={onEligibility} {...stylex.props(s.action)}>{tx('Ask the dealer')}</button>
    </section>
  </div>;
}
const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 600, maxHeight: '92dvh', overflowY: 'auto', padding: '20px 20px calc(28px + env(safe-area-inset-bottom))', color: $.ink, borderRadius: '22px 22px 12px 12px', backgroundColor: '#fff', outlineStyle: 'none'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}, title: {fontSize: 20, fontWeight: 600},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f4f4f5', cursor: 'pointer'},
  price: {display: 'grid', gap: 12, marginTop: 22, padding: 20, fontSize: 18, borderRadius: 14, backgroundColor: '#f4f4f5'},
  note: {marginTop: 16, fontSize: 13, color: $.muted, lineHeight: 1.6},
  payments: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', minHeight: $.controlHeight, marginTop: 20, padding: '10px 12px', color: $.ink, fontFamily: $.fontSans, fontSize: $.controlFontSize, lineHeight: $.controlLineHeight, fontWeight: 500, borderWidth: 0, borderRadius: $.radiusSm, backgroundColor: $.surfaceAlt, cursor: 'pointer'},
  expanded: {transform: 'rotate(180deg)'},
  action: {display: 'grid', placeItems: 'center', width: '100%', minHeight: 46, marginTop: 24, padding: 12, color: '#fff', fontSize: 14, borderWidth: 0, borderRadius: 12, backgroundColor: '#262629', cursor: 'pointer'},
});
