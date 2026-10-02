'use client';

import {useId, useState} from 'react';
import {ArrowRight, Globe2, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import DealerEnquirySheet from './DealerEnquirySheet';
import {useModal} from './useModal';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

/** Select an enquiry origin, then prepare a local draft for this dealer. */
export default function ImportCountryPicker() {
  const tx = useCopy(), id = useId();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<string>(showroom.importCountries[0]?.code || 'other');
  const [details, setDetails] = useState({country: '',model: '',budget: '',listing: ''});
  const [enquiry, setEnquiry] = useState<string | null>(null);
  const country = showroom.importCountries.find(item => item.code === origin);
  function close() {setEnquiry(null); setOpen(false);}
  const panel = useModal(open, close);
  function choose(code: string) {setOrigin(code); setEnquiry(null); setOpen(true);}
  function update(field: keyof typeof details, value: string) {setDetails(previous => ({...previous,[field]: value}));}
  function prepare() {
    const lines = [tx('Country') + ': ' + (country ? tx(country.name) : details.country.trim())];
    if (details.model.trim()) lines.push(tx('Make and model') + ': ' + details.model.trim());
    if (details.budget) lines.push(tx('Budget') + ': ' + currency.symbol + ' ' + details.budget);
    if (details.listing.trim()) lines.push(tx('Listing link') + ': ' + details.listing.trim());
    setEnquiry(lines.join('\n'));
  }

  return <>
    <section data-import-countries aria-labelledby={id + '-heading'} {...stylex.props(s.discovery)}>
      <h2 id={id + '-heading'} {...stylex.props(t.title)}>{tx('Import to order')}</h2>
      <div role="group" aria-label={tx('Import country')} {...stylex.props(s.pills)}>
        {showroom.importCountries.map(item => <button key={item.code} type="button" aria-label={tx('Import from') + ' ' + tx(item.name)} aria-haspopup="dialog" aria-controls={id + '-dialog'} aria-expanded={open && origin === item.code} onClick={() => choose(item.code)} {...stylex.props(s.pill,t.caption)}>{tx(item.name)}</button>)}
        <button type="button" aria-haspopup="dialog" aria-controls={id + '-dialog'} aria-expanded={open && origin === 'other'} onClick={() => choose('other')} {...stylex.props(s.pill,t.caption)}><Globe2 size={16} aria-hidden="true"/>{tx('Other country')}</button>
      </div>
    </section>
    {open ? <div {...stylex.props(s.backdrop)} onMouseDown={event => event.target === event.currentTarget && close()}>
      <section id={id + '-dialog'} ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id + '-title'} {...stylex.props(s.sheet)}>
        <header {...stylex.props(s.header)}><div><p {...stylex.props(s.eyebrow,t.caption)}>{dealer.name}</p><h2 id={id + '-title'} {...stylex.props(t.heading)}>{tx('Import enquiry')}</h2></div><button type="button" aria-label={tx('Close import enquiry')} onClick={close} {...stylex.props(s.close)}><X size={22} aria-hidden="true"/></button></header>
        <form onSubmit={event => {event.preventDefault(); prepare();}} {...stylex.props(s.form)}>
          <label {...stylex.props(s.label,t.caption)}>{tx('Country')}<select value={origin} onChange={event => setOrigin(event.target.value)} {...stylex.props(s.input,t.input)}>{showroom.importCountries.map(item => <option key={item.code} value={item.code}>{tx(item.name)}</option>)}<option value="other">{tx('Other country')}</option></select></label>
          {!country ? <label {...stylex.props(s.label,t.caption)}>{tx('Other country')}<input required pattern={'.*\\S.*'} maxLength={80} value={details.country} onChange={event => update('country',event.target.value)} autoComplete="country-name" {...stylex.props(s.input,t.input)}/></label> : null}
          <label {...stylex.props(s.label,t.caption)}>{tx('Make and model (optional)')}<input maxLength={160} value={details.model} onChange={event => update('model',event.target.value)} autoComplete="off" placeholder={tx('e.g. Toyota Corolla')} {...stylex.props(s.input,t.input)}/></label>
          <label {...stylex.props(s.label,t.caption)}>{tx('Budget')} ({currency.symbol}, {tx('optional')})<input type="number" inputMode="numeric" min={1} step={1} value={details.budget} onChange={event => update('budget',event.target.value)} placeholder="25000" {...stylex.props(s.input,t.input)}/></label>
          <label {...stylex.props(s.label,t.caption)}>{tx('Listing link (optional)')}<input type="url" maxLength={2048} value={details.listing} onChange={event => update('listing',event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="https://…" {...stylex.props(s.input,t.input)}/></label>
          <button type="submit" {...stylex.props(s.action,t.control)}>{tx('Prepare enquiry')}<ArrowRight size={18} aria-hidden="true"/></button>
        </form>
      </section>
    </div> : null}
    <DealerEnquirySheet open={enquiry !== null} onClose={() => setEnquiry(null)} vehicleTitle={enquiry || undefined} intent="importing"/>
  </>;
}

const s = stylex.create({
  discovery: {marginTop: 24,color: $.ink},
  pills: {display: 'flex',flexWrap: 'wrap',gap: 8,marginTop: 12},
  pill: {display: 'inline-flex',alignItems: 'center',justifyContent: 'center',gap: 6,minHeight: 44,padding: '10px 14px',color: $.ink,borderWidth: 1,borderStyle: 'solid',borderColor: '#e6e6e9',borderRadius: 30,backgroundColor: {default: '#f5f5f6',':hover': '#eaeaec'},cursor: 'pointer'},
  backdrop: {position: 'fixed',inset: 0,zIndex: 240,display: 'flex',alignItems: {[media.mobile]: 'flex-end',default: 'center'},justifyContent: 'center',padding: {[media.mobile]: 0,default: 24},backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%',maxWidth: 560,maxHeight: '92dvh',overflowY: 'auto',padding: {[media.mobile]: '20px 20px calc(24px + env(safe-area-inset-bottom))',default: 28},color: $.ink,backgroundColor: '#fff',borderRadius: 24,outlineStyle: 'none'},
  header: {display: 'flex',alignItems: 'center',justifyContent: 'space-between',gap: 12},
  eyebrow: {marginBottom: 4,color: $.muted},
  close: {display: 'grid',placeItems: 'center',flexShrink: 0,width: 44,height: 44,padding: 0,color: $.ink,borderWidth: 0,borderRadius: '50%',backgroundColor: '#f4f4f5',cursor: 'pointer'},
  form: {display: 'grid',gap: 16,marginTop: 22},
  label: {display: 'grid',gap: 7,minWidth: 0},
  input: {display: 'block',width: '100%',minWidth: 0,minHeight: 48,padding: '11px 12px',color: $.ink,borderWidth: 1,borderStyle: 'solid',borderColor: $.controlBorder,borderRadius: 12,backgroundColor: '#fff'},
  action: {display: 'flex',alignItems: 'center',justifyContent: 'center',gap: 10,minHeight: 50,padding: '12px 16px',color: '#fff',borderWidth: 0,borderRadius: 14,backgroundColor: '#262629',cursor: 'pointer'},
});
