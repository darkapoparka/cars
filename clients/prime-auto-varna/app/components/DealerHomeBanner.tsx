'use client';

import * as stylex from '@stylexjs/stylex';
import {useState, type ReactNode} from 'react';
import {ChevronDown, MapPin, Phone} from 'lucide-react';
import DealerMobileBanner from '@/components/DealerMobileBanner';
import ShowroomSearchField from '@/components/ShowroomSearchField';
import DealerLocationSheet from '@/components/DealerLocationSheet';
import ShowroomBanner from '@/components/ShowroomBanner';
import {dealer} from '@/lib/dealer-config';
import {showroom} from '@/lib/showroom';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

/** One continuous landing band with dealer identity or live desktop stock search. */
export default function DealerHomeBanner({desktopSearch, desktopFilters}: {desktopSearch?: ReactNode; desktopFilters?: ReactNode}) {
  const tx = useCopy();
  const [locationOpen, setLocationOpen] = useState(false);
  const location = dealer.city || dealer.address || tx('Visit us');
  const locationLabel = dealer.address || dealer.city || tx('Visit showroom');
  const contacts = <div {...stylex.props(s.actions)}>
    <button type="button" onClick={() => setLocationOpen(true)} aria-haspopup="dialog" aria-expanded={locationOpen} title={locationLabel} aria-label={`${tx('Visit showroom')} · ${locationLabel}`} {...stylex.props(s.action)}><span data-dealer-contact-pill {...stylex.props(s.contactPill, t.caption)}><MapPin size={15} strokeWidth={1.75} aria-hidden="true"/><span>{location}</span><ChevronDown size={13} aria-hidden="true"/></span></button>
    {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} title={dealer.phoneDisplay || dealer.phoneE164} aria-label={`${tx('Call')} · ${dealer.phoneDisplay || dealer.phoneE164}`} {...stylex.props(s.action)}><span data-dealer-contact-pill {...stylex.props(s.contactPill, t.caption)}><Phone size={15} strokeWidth={1.75} aria-hidden="true"/><span>{tx('Call us')}</span></span></a> : null}
  </div>;
  return <>
    <DealerMobileBanner secondary={contacts}><ShowroomSearchField onDark/></DealerMobileBanner>
    <ShowroomBanner title={showroom.promotion.title} control={<>{desktopSearch ?? <ShowroomSearchField onDark/>}{desktopFilters}</>}/>
    <DealerLocationSheet open={locationOpen} onClose={() => setLocationOpen(false)}/>
  </>;
}
const s = stylex.create({
  actions: {display: {[media.mobile]: 'none', [media.desktop]:'none', default: 'flex'}, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0px 8px', maxWidth: '100%'},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: $.controlHeight, maxWidth: '100%', padding: 0, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer', color: {default: '#303036', ':hover': '#000'}, borderRadius: 999, outline: {default: 'none', ':focus-visible': '2px solid #fff'}, outlineOffset: 2},
  contactPill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 34, padding: '6px 12px', color: 'inherit', borderRadius: 999, backgroundColor: '#fff', overflowWrap: 'anywhere'},
});
