'use client';

import {createPortal} from 'react-dom';
import {MapPin, Navigation, Phone, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {useModal} from '@/components/useModal';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Contact facts and destinations always belong to the configured dealer. */
export default function DealerLocationSheet({open, onClose}: {open: boolean; onClose: () => void}) {
  const tx = useCopy();
  const panel = useModal(open, onClose);
  if (!open) return null;
  return createPortal(<div {...stylex.props(s.overlay)} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dealer-location-title" {...stylex.props(s.sheet)}>
      <div aria-hidden="true" {...stylex.props(s.handle)}/>
      <header {...stylex.props(s.header)}><div><p {...stylex.props(s.eyebrow)}>{dealer.name}</p><h2 id="dealer-location-title" {...stylex.props(s.title)}>{tx('Visit showroom')}</h2></div><button type="button" onClick={onClose} aria-label={tx('Close')} {...stylex.props(s.close)}><X size={22}/></button></header>
      <div {...stylex.props(s.address)}><span {...stylex.props(s.pin)}><MapPin size={24} aria-hidden="true"/></span><div><p {...stylex.props(s.city)}>{dealer.city || dealer.name}</p><p {...stylex.props(s.street)}>{dealer.address || tx('Contact the dealer for the showroom address.')}</p></div></div>
      <div {...stylex.props(s.actions)}>
        {dealer.mapsUrl ? <a href={dealer.mapsUrl} target="_blank" rel="noopener noreferrer" {...stylex.props(s.primary)}><Navigation size={18} aria-hidden="true"/>{tx('Open in Google Maps')}</a> : null}
        {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} {...stylex.props(s.secondary)}><Phone size={18} aria-hidden="true"/>{dealer.phoneDisplay || dealer.phoneE164}</a> : null}
      </div>
    </div>
  </div>, document.body);
}
const s = stylex.create({
  overlay: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(12,12,16,.5)'},
  sheet: {width: '100%', maxWidth: 480, maxHeight: '90dvh', overflowY: 'auto', padding: '10px 20px calc(24px + env(safe-area-inset-bottom))', color: $.ink, backgroundColor: '#fff', borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, outlineStyle: 'none'},
  handle: {width: 32, height: 4, borderRadius: 4, backgroundColor: '#d8d8dc', margin: '0 auto 16px'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  eyebrow: {fontSize: 13, color: $.muted, lineHeight: 1.5},
  title: {fontSize: 24, fontWeight: 600, lineHeight: 1.3, marginTop: 3},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f4f4f5', color: $.ink, cursor: 'pointer'},
  address: {display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, marginBlock: 24, borderRadius: 16, backgroundColor: '#f5f5f6'},
  pin: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, backgroundColor: '#fff', borderRadius: 14},
  city: {fontSize: 16, fontWeight: 600, lineHeight: 1.5},
  street: {marginTop: 4, fontSize: 14, lineHeight: 1.6, color: $.muted, overflowWrap: 'anywhere'},
  actions: {display: 'grid', gap: 10},
  primary: {display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, minHeight: 50, padding: '12px 16px', fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: '#fff', backgroundColor: '#202023', borderRadius: 999},
  secondary: {display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, minHeight: 50, padding: '12px 16px', fontSize: 15, lineHeight: 1.5, color: $.ink, backgroundColor: '#f4f4f5', borderRadius: 999},
});
