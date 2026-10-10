'use client';

import {useId, useState} from 'react';
import {X, Phone, Mail, Copy, MessageCircle} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {dealer} from '@/lib/dealer-config';
import {useCopy, useLocale} from '@/lib/locale';
import {useModal} from './useModal';
import {media, tokens as $} from '@/app/tokens.stylex';
export type DealerEnquiryIntent='enquiry'|'viewing'|'condition'|'service-history'|'selling'|'part-exchange'|'importing';
export function DealerEnquiryDraft({vehicleTitle, intent = 'enquiry'}: {vehicleTitle?: string; intent?: DealerEnquiryIntent}) {
  const tx = useCopy(), locale = useLocale();
  const messageId = useId();
  const [message, setMessage] = useState(() => {
    const subject = vehicleTitle || (locale === 'bg' ? 'вашите автомобили' : 'your cars');
    const greeting = intent === 'importing' ? (locale === 'bg' ? 'Здравейте, интересувам се от внос на автомобил.\n' : 'Hello, I would like to enquire about importing a car.\n') : intent === 'selling' || intent === 'part-exchange' ? (locale === 'bg' ? 'Здравейте, искам да обсъдя ' : 'Hello, I would like to discuss ') : intent === 'viewing' ? (locale === 'bg' ? 'Здравейте, искам да уговоря оглед на ' : 'Hello, I would like to arrange a viewing of ') : (locale === 'bg' ? 'Здравейте, интересувам се от ' : 'Hello, I would like to enquire about ');
    const request=intent==='condition'?tx('Please share the inspection report and current condition details.'):intent==='service-history'?tx('Please share the service history and supporting documents.'):'';
    return greeting + subject + (intent === 'importing' || /[.!?]$/.test(subject.trim()) ? '\n' : '.\n') + (request?request+'\n':'') + (typeof window === 'undefined' ? '' : window.location.href);
  });
  const [status, setStatus] = useState('');
  const mail = dealer.email ? `mailto:${dealer.email}?subject=${encodeURIComponent(vehicleTitle || dealer.name)}&body=${encodeURIComponent(message)}` : '';
  const whatsapp = dealer.whatsappUrl ? dealer.whatsappUrl + (dealer.whatsappUrl.includes('?') ? '&' : '?') + 'text=' + encodeURIComponent(message) : '';
  async function copyDraft() {try {await navigator.clipboard.writeText(message); setStatus(tx('Draft copied. Nothing has been sent.'));} catch {setStatus(tx('Select and copy the draft below.'));}}
  return <>
      <label htmlFor={messageId} {...stylex.props(s.label)}>{tx('Your enquiry draft')}</label>
      <textarea id={messageId} value={message} onChange={event => setMessage(event.target.value)} rows={5} {...stylex.props(s.textarea)}/>
      <div {...stylex.props(s.actions)}>
        {dealer.phoneE164 ? <a href={'tel:' + dealer.phoneE164} {...stylex.props(s.action)}><Phone size={19}/>{tx('Call dealer')} · {dealer.phoneDisplay}</a> : null}
        {mail ? <a href={mail} {...stylex.props(s.action)}><Mail size={19}/>{tx('Open email draft')}</a> : null}
        {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" {...stylex.props(s.action)}><MessageCircle size={19}/>{tx('Open WhatsApp draft')}</a> : null}
        <button type="button" onClick={copyDraft} {...stylex.props(s.secondary)}><Copy size={18}/>{tx('Copy draft')}</button>
      </div>
      <p {...stylex.props(s.note)}>{tx(!dealer.phoneE164 && !mail && !whatsapp ? 'Contact details are not available. Copy the draft to send it separately.' : 'Review the draft before sending it. Nothing is sent automatically.')}</p>
      <p role="status" aria-live="polite" aria-atomic="true" {...stylex.props(Boolean(status) && s.note)}>{status}</p>
  </>;
}
function DealerEnquiryContent({open, onClose, vehicleTitle, intent = 'enquiry'}: {open: boolean; onClose: () => void; vehicleTitle?: string; intent?: DealerEnquiryIntent}) {
  const tx = useCopy();
  const titleId = useId();
  const panel = useModal(open, onClose);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} {...stylex.props(s.sheet)}>
      <header {...stylex.props(s.header)}><div><p {...stylex.props(s.eyebrow)}>{dealer.name}</p><h2 id={titleId} {...stylex.props(s.title)}>{tx(intent === 'importing' ? 'Import enquiry' : intent === 'selling' ? 'Selling enquiry' : intent === 'part-exchange' ? 'Part-exchange enquiry' : intent === 'viewing' ? 'Request a viewing' : 'Contact the dealer')}</h2></div><button type="button" aria-label={tx('Close enquiry')} onClick={onClose} {...stylex.props(s.close)}><X size={22}/></button></header>
      <DealerEnquiryDraft vehicleTitle={vehicleTitle} intent={intent}/>
    </section>
  </div>;
}
export default function DealerEnquirySheet(props: {open: boolean; onClose: () => void; vehicleTitle?: string; intent?: DealerEnquiryIntent}) {
  const locale = useLocale();
  return props.open ? <DealerEnquiryContent key={locale + ':' + (props.vehicleTitle || '') + ':' + (props.intent || 'enquiry')} {...props}/> : null;
}
const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto', padding: '22px 22px calc(24px + env(safe-area-inset-bottom))', color: $.ink, backgroundColor: '#fff', borderRadius: '24px 24px 12px 12px', outlineStyle: 'none'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  eyebrow: {color: $.muted, fontSize: 12}, title: {fontSize: 21, fontWeight: 600, marginTop: 4},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f4f4f5', color: $.ink, cursor: 'pointer'},
  note: {marginTop: 14, color: $.muted, fontSize: 12, lineHeight: 1.6},
  label: {display: 'block', marginTop: 20, marginBottom: 8, fontSize: 14, fontWeight: 500},
  textarea: {display: 'block', width: '100%', resize: 'vertical', padding: 12, fontSize: 16, lineHeight: 1.5, color: $.ink, borderColor: $.controlBorder, borderWidth: 1, borderStyle: 'solid', borderRadius: 12, backgroundColor: '#fff'},
  actions: {display: 'grid', gap: 10, marginTop: 18},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 500, borderRadius: 12, backgroundColor: '#262629'},
  secondary: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46, padding: '10px 14px', color: $.ink, fontSize: 14, borderColor: $.controlBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff', cursor: 'pointer'},
});
