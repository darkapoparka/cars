'use client';

import {useId, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, CalendarDays, CarFront, Phone, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {useModal} from '@/components/useModal';
import {useCopy, useLocale} from '@/lib/locale';
import {dealer} from '@/lib/dealer-config';
import {localDateValue, validRentalDates} from '@/lib/rental-enquiry';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Signature's dates → preference → review flow, using this App's native sheet. */
export default function RentalSearch({active}: {active: boolean}) {
  const tx = useCopy(), locale = useLocale(), id = useId();
  const [open, setOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [pickup, setPickup] = useState('');
  const [returning, setReturning] = useState('');
  const [preference, setPreference] = useState('');
  const [today, setToday] = useState('');
  const [error, setError] = useState('');
  const pickupInput = useRef<HTMLInputElement>(null);
  const panel = useModal(active && open, () => setOpen(false), {onBack: () => {
    if (!reviewed) return false;
    setReviewed(false);
    return true;
  }});
  const formatDate = (value: string) => value
    ? new Intl.DateTimeFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(value + 'T00:00:00'))
    : tx('Select date');
  function launch() {setToday(localDateValue()); setReviewed(false); setError(''); setOpen(true);}
  function edit() {setReviewed(false); requestAnimationFrame(() => pickupInput.current?.focus());}
  function review() {
    if (!validRentalDates(pickup, returning, localDateValue())) {setError(tx('Choose valid pick-up and return dates.')); return;}
    setError(''); setReviewed(true); panel.current?.focus({preventScroll: true});
  }
  return <>
    {active ? <main data-rental-entry aria-labelledby={id + '-entry'} {...stylex.props(s.entry)}>
      <h2 id={id + '-entry'} {...stylex.props(s.entryTitle)}>{tx('Rent a car')}</h2>
      <p {...stylex.props(s.note)}>{tx('Day & Night will confirm availability and pricing for your dates.')}</p>
      <div {...stylex.props(s.dateChoices)}>{[{label: 'Pick-up date', value: pickup}, {label: 'Return date', value: returning}].map(item => <button key={item.label} type="button" onClick={launch} aria-haspopup="dialog" {...stylex.props(s.entryControl)}><CalendarDays size={20} aria-hidden="true"/><span><span {...stylex.props(s.caption)}>{tx(item.label)}</span><span {...stylex.props(s.value)}>{formatDate(item.value)}</span></span></button>)}</div>
      <button type="button" onClick={launch} aria-haspopup="dialog" {...stylex.props(s.entryControl, s.preferenceControl)}><CarFront size={20} aria-hidden="true"/><span><span {...stylex.props(s.caption)}>{tx('Vehicle preference')}</span><span {...stylex.props(s.value)}>{preference || tx('Make, model or vehicle type')}</span></span><ArrowRight size={18} aria-hidden="true" {...stylex.props(s.arrow)}/></button>
      <button type="button" onClick={launch} aria-haspopup="dialog" {...stylex.props(s.primary)}>{tx('Plan your rental')}<ArrowRight size={18} aria-hidden="true"/></button>
    </main> : null}
    {active && open ? <div {...stylex.props(s.backdrop)} onMouseDown={event => {if (event.target === event.currentTarget) setOpen(false);}}>
      <section ref={panel} role="dialog" aria-modal="true" aria-labelledby={id + '-title'} tabIndex={-1} data-rental-sheet data-rental-view={reviewed ? 'review' : 'dates'} {...stylex.props(s.sheet)}>
        <header {...stylex.props(s.header)}>{reviewed ? <button type="button" aria-label={tx('Back to rental dates')} onClick={edit} {...stylex.props(s.icon, s.back)}><ArrowLeft size={20}/></button> : null}<h2 id={id + '-title'} {...stylex.props(s.title)}>{tx(reviewed ? 'Your rental enquiry' : 'Rent a car')}</h2><button type="button" aria-label={tx('Close rental enquiry')} onClick={() => setOpen(false)} {...stylex.props(s.icon, s.close)}><X size={21}/></button></header>
        <form id={id + '-form'} onSubmit={event => {event.preventDefault(); review();}} {...stylex.props(s.body)}>
          {reviewed ? <><dl {...stylex.props(s.summary)}>{[{label: 'Pick-up date', value: formatDate(pickup)}, {label: 'Return date', value: formatDate(returning)}, {label: 'Vehicle preference', value: preference.trim() || tx('No preference')}, {label: 'Dealer location', value: dealer.address || dealer.city}].map(item => <div key={item.label} {...stylex.props(s.summaryRow)}><dt {...stylex.props(s.caption)}>{tx(item.label)}</dt><dd {...stylex.props(s.summaryValue)}>{item.value}</dd></div>)}</dl><p role="status" {...stylex.props(s.note)}>{tx('Your enquiry has not been sent. Call to confirm availability and rental terms.')}</p></> : <>
            <div {...stylex.props(s.dateFields)}><label {...stylex.props(s.label)}>{tx('Pick-up date')}<input ref={pickupInput} type="date" required min={today} max={returning || undefined} value={pickup} onInput={event => setPickup(event.currentTarget.value)} onChange={event => setPickup(event.target.value)} {...stylex.props(s.input)}/></label><label {...stylex.props(s.label)}>{tx('Return date')}<input type="date" required min={pickup || today} value={returning} onInput={event => setReturning(event.currentTarget.value)} onChange={event => setReturning(event.target.value)} {...stylex.props(s.input)}/></label></div>
            <label {...stylex.props(s.label)}>{tx('Vehicle preference')}<input type="text" maxLength={120} value={preference} onChange={event => setPreference(event.target.value)} placeholder={tx('Make, model or vehicle type')} {...stylex.props(s.input)}/></label>
            <div {...stylex.props(s.summaryRow)}><span {...stylex.props(s.caption)}>{tx('Dealer location')}</span><span {...stylex.props(s.summaryValue)}>{dealer.address || dealer.city}</span></div>
            <p {...stylex.props(s.note)}>{tx('Day & Night will confirm availability and pricing for your dates.')}</p>
            {error ? <p role="alert" {...stylex.props(s.error)}>{error}</p> : null}
          </>}
        </form>
        <footer {...stylex.props(s.footer)}>{reviewed ? <><button type="button" onClick={edit} {...stylex.props(s.secondary)}>{tx('Edit')}</button>{dealer.phoneE164 ? <a href={'tel:' + dealer.phoneE164} {...stylex.props(s.primary, s.footerPrimary)}><Phone size={18}/>{tx('Call for availability')}</a> : null}</> : <><button type="button" onClick={() => {setPickup(''); setReturning(''); setPreference(''); setError('');}} {...stylex.props(s.secondary)}>{tx('Clear all')}</button><button type="submit" form={id + '-form'} {...stylex.props(s.primary, s.footerPrimary)}>{tx('Review enquiry')}<ArrowRight size={18}/></button></>}</footer>
      </section>
    </div> : null}
  </>;
}

const s = stylex.create({
  entry: {maxWidth: 640, marginInline: 'auto', padding: '24px 12px'},
  entryTitle: {fontSize: 22, fontWeight: 600, lineHeight: '28px'},
  note: {marginTop: 12, color: $.muted, fontSize: 14, lineHeight: '21px'},
  dateChoices: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, marginTop: 22},
  entryControl: {display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, minHeight: 76, padding: 12, color: $.ink, textAlign: 'left', borderWidth: 0, borderRadius: 14, backgroundColor: $.rail, cursor: 'pointer'},
  caption: {display: 'block', color: $.muted, fontSize: 12, lineHeight: '18px'},
  value: {display: 'block', overflowWrap: 'anywhere', fontSize: 14, fontWeight: 500, lineHeight: '21px'},
  preferenceControl: {width: '100%', marginTop: 12, marginBottom: 20},
  arrow: {marginLeft: 'auto', flexShrink: 0},
  primary: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, width: '100%', padding: '10px 14px', borderWidth: 0, borderRadius: 12, color: '#fff', backgroundColor: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 500, lineHeight: '20px', textAlign: 'center', cursor: 'pointer'},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 560, maxHeight: '92dvh', overflow: 'hidden', borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, backgroundColor: '#fff', color: $.ink, outlineStyle: 'none'},
  header: {display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 44px', alignItems: 'center', gap: 8, padding: '12px 16px', flexShrink: 0},
  title: {gridColumn: 2, gridRow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 19, fontWeight: 600, lineHeight: '26px', textAlign: 'center'},
  icon: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: '50%', color: $.ink, backgroundColor: $.rail, cursor: 'pointer'},
  back: {gridColumn: 1, gridRow: 1},
  close: {gridColumn: 3, gridRow: 1},
  body: {display: 'grid', gap: 18, minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '4px 20px 20px'},
  dateFields: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12},
  label: {display: 'grid', gap: 7, minWidth: 0, fontSize: 14, lineHeight: '20px'},
  input: {display: 'block', width: '100%', minWidth: 0, minHeight: 46, padding: '10px 10px', color: $.ink, fontFamily: $.fontSans, fontSize: 16, lineHeight: '24px', borderWidth: 1, borderStyle: 'solid', borderColor: $.controlBorder, borderRadius: 12, backgroundColor: '#fff'},
  summary: {display: 'grid', gap: 16, margin: 0},
  summaryRow: {display: 'grid', gap: 4, minWidth: 0},
  summaryValue: {margin: 0, overflowWrap: 'anywhere', fontSize: 15, lineHeight: '22px'},
  footer: {display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
  secondary: {flexShrink: 0, minHeight: 48, padding: '10px 12px', borderWidth: 0, borderRadius: 12, color: $.ink, backgroundColor: $.rail, fontFamily: $.fontSans, fontSize: 14, cursor: 'pointer'},
  footerPrimary: {flexGrow: 1, minWidth: 0},
  error: {color: '#b42318', fontSize: 14, lineHeight: '20px'},
});
