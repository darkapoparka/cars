'use client';

import {useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft, ArrowRight, Check, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Image from '@/components/AppImage';
import {DealerEnquiryDraft} from '@/components/DealerEnquirySheet';
import {useModal} from '@/components/useModal';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import type {ServiceOption} from '@/lib/service-catalogue';
import {media, tokens as $} from '@/app/tokens.stylex';

type View = 'details' | 'enquiry' | 'draft';
type Props = {service: ServiceOption | null; initialView?: 'details' | 'enquiry'; onClose: () => void};

/** Service information and its enquiry share one modal, preserving the underlying list. */
export default function ServiceDetailsSheet({service, initialView = 'details', onClose}: Props) {
  const tx = useCopy();
  const [view, setView] = useState<View>(service ? initialView : 'enquiry');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState<string>(service ? tx(service.name) : '');
  const panel = useModal(true, onClose);
  const body = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const formId = useId();
  const title = view === 'details' && service ? service.name : view === 'draft' ? 'Your enquiry draft' : 'Vehicle service enquiry';
  const serviceName = tx(service?.name || 'Vehicle service enquiry');
  const notes = details.trim();
  const subject = [`${make.trim()} ${model.trim()}`, serviceName, notes === serviceName ? '' : notes].filter(Boolean).join('\n');

  function changeView(next: View) {
    setView(next);
    body.current?.scrollTo({top: 0, behavior: 'instant'});
    panel.current?.focus({preventScroll: true});
  }

  return createPortal(<div {...stylex.props(s.backdrop)} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} data-service-detail-sheet data-service-view={view} {...stylex.props(s.sheet)}>
      <header {...stylex.props(s.header)}>
        {view === 'draft' || view === 'enquiry' && service ? <button type="button" aria-label={tx(view === 'draft' ? 'Back to enquiry' : 'Back to service')} onClick={() => changeView(view === 'draft' ? 'enquiry' : 'details')} {...stylex.props(s.iconButton)}><ArrowLeft size={20} aria-hidden="true"/></button> : null}
        <div {...stylex.props(s.heading)}><p {...stylex.props(s.eyebrow)}>{dealer.name}</p><h2 id={titleId} {...stylex.props(s.title)}>{tx(title)}</h2></div>
        <button type="button" aria-label={tx('Close service details')} onClick={onClose} {...stylex.props(s.iconButton)}><X size={21} aria-hidden="true"/></button>
      </header>
      <div ref={body} {...stylex.props(s.body)}>
        {view === 'details' && service ? <>
          <div {...stylex.props(s.media)}><Image src={service.image} width={1200} height={800} sizes="(max-width: 767px) calc(100vw - 40px), 512px" alt="" priority {...stylex.props(s.image)}/>{service.demo ? <span {...stylex.props(s.demo)}>{tx('Demo service')}</span> : null}</div>
          <p {...stylex.props(s.copy)}>{tx(service.copy)}</p>
          <h3 {...stylex.props(s.sectionTitle)}>{tx('What this service covers')}</h3>
          <ul {...stylex.props(s.checks)}>{service.checks.map(check => <li key={check} {...stylex.props(s.check)}><Check size={18} strokeWidth={1.8} aria-hidden="true"/>{tx(check)}</li>)}</ul>
        </> : view === 'enquiry' ? <>
          <p {...stylex.props(s.copy)}>{tx('Tell the dealer about your car')}</p>
          <form id={formId} onSubmit={event => {event.preventDefault(); changeView('draft');}} {...stylex.props(s.form)}>
            <label {...stylex.props(s.label)}>{tx('Make')}<input required maxLength={80} value={make} onChange={event => setMake(event.target.value)} autoComplete="off" {...stylex.props(s.input)}/></label>
            <label {...stylex.props(s.label)}>{tx('Model')}<input required maxLength={100} value={model} onChange={event => setModel(event.target.value)} autoComplete="off" {...stylex.props(s.input)}/></label>
            <label {...stylex.props(s.label)}>{tx('Year, mileage and what you need')}<textarea rows={4} maxLength={2000} value={details} onChange={event => setDetails(event.target.value)} {...stylex.props(s.input, s.textarea)}/></label>
          </form>
        </> : <DealerEnquiryDraft vehicleTitle={subject}/>}
      </div>
      {view !== 'draft' ? <footer {...stylex.props(s.footer)}>
        <p {...stylex.props(s.note)}>{tx('Service availability, prices and terms must be confirmed directly with the dealer.')}</p>
        {view === 'details' ? <button key="enquire" type="button" onClick={() => changeView('enquiry')} {...stylex.props(s.action)}>{tx('Enquire')}<ArrowRight size={18} aria-hidden="true"/></button> : <button key="prepare" type="submit" form={formId} {...stylex.props(s.action)}>{tx('Prepare enquiry')}<ArrowRight size={18} aria-hidden="true"/></button>}
      </footer> : null}
    </section>
  </div>, document.body);
}

const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(12,12,16,.5)'},
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 560, maxHeight: '92dvh', overflow: 'hidden', color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, backgroundColor: $.surface, boxShadow: $.shadowStrong, outlineStyle: 'none'},
  header: {display: 'flex', alignItems: 'center', flexShrink: 0, gap: 12, padding: '18px 20px 16px'},
  heading: {flexGrow: 1, minWidth: 0},
  eyebrow: {margin: 0, color: $.muted, fontSize: 12, lineHeight: '18px'},
  title: {margin: '3px 0 0', fontSize: 21, fontWeight: 600, lineHeight: '27px', overflowWrap: 'anywhere'},
  iconButton: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  body: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '0 20px 20px'},
  media: {position: 'relative', overflow: 'hidden', borderRadius: 16},
  image: {display: 'block', width: '100%', height: 'auto', aspectRatio: '2 / 1', objectFit: 'cover', objectPosition: 'center 55%'},
  demo: {position: 'absolute', top: 10, left: 10, padding: '4px 8px', fontSize: 12, lineHeight: '18px', borderRadius: 6, backgroundColor: $.surface},
  copy: {marginTop: 16, color: $.muted, fontSize: 15, lineHeight: '23px'},
  sectionTitle: {margin: '20px 0 10px', fontSize: 15, fontWeight: 500, lineHeight: '22px'},
  checks: {display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none'},
  check: {display: 'flex', alignItems: 'center', gap: 10, color: $.muted, fontSize: 15, lineHeight: '22px'},
  form: {display: 'grid', gap: 16, marginTop: 18},
  label: {display: 'grid', gap: 7, color: $.ink, fontSize: 14, lineHeight: '20px'},
  input: {display: 'block', width: '100%', minHeight: 46, padding: '11px 12px', color: $.ink, fontFamily: $.fontSans, fontSize: 16, lineHeight: '24px', borderWidth: 1, borderStyle: 'solid', borderColor: $.controlBorder, borderRadius: 12, backgroundColor: $.surface},
  textarea: {resize: 'vertical'},
  footer: {flexShrink: 0, padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
  note: {margin: '0 0 14px', color: $.muted, fontSize: 12, lineHeight: '18px'},
  action: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', minHeight: 48, padding: '12px 16px', color: $.surface, fontFamily: $.fontSans, fontSize: 15, fontWeight: 500, lineHeight: '22px', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, cursor: 'pointer'},
});
