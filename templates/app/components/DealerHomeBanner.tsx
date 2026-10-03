'use client';

import * as stylex from '@stylexjs/stylex';
import {useState} from 'react';
import {ChevronDown, MapPin, Phone} from 'lucide-react';
import DealerBrand from '@/components/DealerBrand';
import DealerMobileBanner from '@/components/DealerMobileBanner';
import ShowroomSearchField from '@/components/ShowroomSearchField';
import DealerLocationSheet from '@/components/DealerLocationSheet';
import ShowroomBannerFrame from '@/components/ShowroomBannerFrame';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

/** The first Buy banner belongs to this dealer; the next banner introduces cars. */
export default function DealerHomeBanner() {
  const tx = useCopy();
  const [locationOpen, setLocationOpen] = useState(false);
  const location = dealer.city || dealer.address || tx('Visit us');
  const locationLabel = dealer.address || dealer.city || tx('Visit showroom');
  return <><DealerMobileBanner><ShowroomSearchField onDark/></DealerMobileBanner><div {...stylex.props(s.desktopOnly)}><ShowroomBannerFrame><section data-dealer-home-banner {...stylex.props(s.banner)}>
    <img src={assetPath('/showroom/black/dealer-satin-v1.webp')} alt="" aria-hidden="true" width={1536} height={512} {...stylex.props(s.backdrop)}/>
    <div {...stylex.props(s.content)}>
      <h1 {...stylex.props(s.brand, t.hero)}><DealerBrand hero onDark/></h1>
      <div {...stylex.props(s.actions)}>
        <button type="button" onClick={() => setLocationOpen(true)} aria-haspopup="dialog" aria-expanded={locationOpen} title={locationLabel} aria-label={`${tx('Visit showroom')} · ${locationLabel}`} {...stylex.props(s.action)}><span data-dealer-contact-pill {...stylex.props(s.contactPill, t.caption)}><MapPin size={15} strokeWidth={1.75} aria-hidden="true"/><span>{location}</span><ChevronDown size={13} aria-hidden="true"/></span></button>
        {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} title={dealer.phoneDisplay || dealer.phoneE164} aria-label={`${tx('Call')} · ${dealer.phoneDisplay || dealer.phoneE164}`} {...stylex.props(s.action)}><span data-dealer-contact-pill {...stylex.props(s.contactPill, t.caption)}><Phone size={15} strokeWidth={1.75} aria-hidden="true"/><span>{tx('Call us')}</span></span></a> : null}
      </div>
    </div>
  </section></ShowroomBannerFrame></div><DealerLocationSheet open={locationOpen} onClose={() => setLocationOpen(false)}/></>;
}
const s = stylex.create({
  desktopOnly: {display: {[media.mobile]: 'none', default: 'block'}},
  banner: {position: 'relative', overflow: 'hidden', backgroundColor: '#171719', color: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#303034', borderRadius: 20},
  backdrop: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .65, pointerEvents: 'none'},
  content: {position: 'relative', display: 'flex', flexDirection: {[media.mobile]: 'column', default: 'row'}, alignItems: 'center', justifyContent: 'center', gap: {[media.mobile]: 0, default: 32}, padding: {[media.mobile]: '14px 16px 8px', default: '24px 28px'}, minHeight: {[media.mobile]: 0, default: 140}},
  brand: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: {[media.mobile]: 204, default: 256}, maxWidth: '100%', minWidth: 0, margin: 0, padding: 0, color: '#fff'},
  actions: {display: {[media.mobile]: 'none', default: 'flex'}, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0px 8px', maxWidth: '100%'},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: $.controlHeight, maxWidth: '100%', padding: 0, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer', color: {default: '#303036', ':hover': '#000'}, borderRadius: 999, outline: {default: 'none', ':focus-visible': '2px solid #fff'}, outlineOffset: 2},
  contactPill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 34, padding: '6px 12px', color: 'inherit', borderRadius: 999, backgroundColor: '#fff', overflowWrap: 'anywhere'},
});
