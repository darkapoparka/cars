'use client';

import {useId, useState} from 'react';
import {ArrowRight, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import {importListings, type ImportListing} from '@/lib/import-inventory';
import VehicleCard from './VehicleCard';
import DealerEnquirySheet from './DealerEnquirySheet';
import {useModal} from './useModal';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';
import FilterPill from '@/components/FilterPill';

/** Filter import listings by country and prepare a local enquiry. */
export default function ImportCountryPicker() {
  const tx = useCopy(), id = useId();
  const [filterCountry, setFilterCountry] = useState('all');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<string>(showroom.importCountries[0]?.code || 'other');
  const [details, setDetails] = useState({country: '',model: '',budget: '',listing: ''});
  const [enquiry, setEnquiry] = useState<string | null>(null);
  const country = showroom.importCountries.find(item => item.code === origin);
  const visible = importListings.filter(listing => filterCountry === 'all' || filterCountry === listing.countryCode);
  function close() {setEnquiry(null); setOpen(false);}
  const panel = useModal(open, close);
  function choose(listing: ImportListing) {
    if (selectedListing !== listing.vehicle.slug) {
      setSelectedListing(listing.vehicle.slug);
      const knownCountry = showroom.importCountries.find(item => item.code === listing.countryCode);
      setOrigin(knownCountry ? listing.countryCode : 'other');
      setDetails({country: knownCountry ? '' : listing.countryCode, model: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`, budget: String(listing.vehicle.price), listing: listing.vehicle.sourceUrl || ''});
    }
    setEnquiry(null); setOpen(true);
  }
  function showAll() {setFilterCountry('all');}
  function update(field: keyof typeof details, value: string) {setDetails(previous => ({...previous,[field]: value}));}
  function prepare() {
    const lines = [tx('Country') + ': ' + (country ? tx(country.name) : details.country.trim())];
    if (details.model.trim()) lines.push(tx('Make and model') + ': ' + details.model.trim());
    if (details.budget) lines.push(tx('Budget') + ': ' + currency.symbol + ' ' + details.budget);
    if (details.listing.trim()) lines.push(tx('Listing link') + ': ' + details.listing.trim());
    setEnquiry(lines.join('\n'));
  }

  return <>
    <section data-import-countries aria-label={tx('Import cars')} {...stylex.props(s.discovery)}>
      <div role="group" aria-label={tx('Import country')} {...stylex.props(s.pills)}>
        {[{code: 'all', name: 'All', flagSrc: undefined}, ...showroom.importCountries].map(item => <FilterPill key={item.code} label={item.name} flagSrc={item.flagSrc} tone="soft" pressed={filterCountry === item.code} onClick={() => setFilterCountry(item.code)}/>)}
      </div>
      <span role="status" {...stylex.props(s.srOnly)}>{tx('Import cars')}: {visible.length}</span>
      {visible.length ? <div data-import-listings {...stylex.props(s.listings)}>{visible.map(listing => <VehicleCard key={listing.vehicle.slug} vehicle={listing.vehicle} importListing={{country: tx(showroom.importCountries.find(item => item.code === listing.countryCode)?.name || listing.countryCode), onEnquire: () => choose(listing)}}/>)}</div> : <div {...stylex.props(s.empty)}><p {...stylex.props(t.body)}>{tx('No matching import cars.')}</p><button type="button" onClick={showAll} {...stylex.props(s.reset,t.control)}>{tx('Show all cars')}<ArrowRight size={18} aria-hidden="true"/></button></div>}
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
  discovery: {marginTop: {[media.mobile]: $.mobilePillGap,default: 24},color: $.ink,minWidth: 0},
  pills: {display: 'flex',flexWrap: 'nowrap',gap: 8,overflowX: 'auto',overscrollBehaviorX: 'contain',paddingBlock: {[media.mobile]: 0,default: 3},scrollbarWidth: 'none'},
  listings: {display: 'grid',gridTemplateColumns: {[media.mobile]: '1fr',default: 'repeat(2,minmax(0,1fr))'},gap: {[media.mobile]: $.mobileSectionGap,default: 12},marginTop: {[media.mobile]: $.mobilePillGap,default: 12}},
  empty: {display: 'grid',justifyItems: 'start',gap: 12,marginTop: {[media.mobile]: $.mobilePillGap,default: 12},padding: '24px 16px',borderRadius: 16,backgroundColor: '#f5f5f6'},
  reset: {display: 'inline-flex',alignItems: 'center',gap: 8,minHeight: 44,padding: '8px 12px',color: '#fff',borderWidth: 0,borderRadius: 12,backgroundColor: $.ink,cursor: 'pointer'},
  srOnly: {position: 'absolute',width: 1,height: 1,padding: 0,margin: -1,overflow: 'hidden',clip: 'rect(0,0,0,0)',whiteSpace: 'nowrap',borderWidth: 0},
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
