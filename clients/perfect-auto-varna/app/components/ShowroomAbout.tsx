'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ArrowRight, ArrowUpRight, Globe, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ShowroomBanner from '@/components/ShowroomBanner';
import DealerEnquirySheet from '@/components/DealerEnquirySheet';
import ContactShareMenu from '@/components/ContactShareMenu';
import {BrandRow} from '@/components/ReferenceUI';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared showroom information adapts its panels and cards to each viewport. */
export default function ShowroomAbout() {
  const tx = useCopy();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const address = [dealer.address, dealer.city].filter(Boolean).join(', ');
  const map = dealer.mapEmbedUrl || (dealer.address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : '');
  const mapLink = dealer.mapsUrl;
  const profiles = (dealer.socialLinks ?? []).filter(link => link.url);
  const hasContacts = Boolean(dealer.phoneE164 || dealer.email || dealer.whatsappUrl || dealer.website);

  return <div data-showroom-about>
    <div {...stylex.props(s.phoneHeader)}><PageHeader title="About us" compact/></div>
    <ShowroomBanner compact title="About us" description={dealer.aboutText || 'Browse online. See it in person.'}/>
    <main {...stylex.props(s.page)}>
      <p {...stylex.props(s.phoneIntro)}>{tx(dealer.aboutText || 'Browse online. See it in person.')}</p>
      <div data-showroom-layout {...stylex.props(s.layout)}>
        <section data-showroom-location aria-labelledby="showroom-visit-heading" {...stylex.props(s.visit, !map && s.emptyPanel)}>
          <div {...stylex.props(s.visitHeading)}><div {...stylex.props(s.visitLabel)}><h2 id="showroom-visit-heading" {...stylex.props(s.contactTitle, s.locationTitle)}>{tx('Location')}</h2>{address ? <address {...stylex.props(s.address)}>{address}</address> : null}</div>{mapLink ? <a href={mapLink} target="_blank" rel="noopener noreferrer" aria-label={tx('Open directions')} {...stylex.props(s.directions)}><span data-showroom-map-pill {...stylex.props(s.directionsPill)}><span {...stylex.props(s.directionsShort)}>{tx('Map')}</span><span {...stylex.props(s.directionsFull)}>{tx('Open directions')}</span><ArrowUpRight size={16} aria-hidden="true" {...stylex.props(s.directionsIcon)}/></span></a> : null}</div>
          {map ? <iframe data-showroom-map src={map} title={`${tx('Location')} · ${dealer.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" {...stylex.props(s.map)}/> : <div data-showroom-map-empty {...stylex.props(s.mapEmpty)}><MapPin size={32} strokeWidth={1.5} aria-hidden="true"/><p {...stylex.props(s.emptyCopy)}>{tx('Location details are not available.')}</p></div>}
          {map ? <p {...stylex.props(s.visitNote)}>{tx('Arrange a suitable time before travelling. Confirm the exact location and availability with the dealer.')}</p> : null}
        </section>
        <aside data-showroom-contacts aria-labelledby="showroom-contact-heading" {...stylex.props(s.contacts, !hasContacts && s.emptyPanel)}>
          <div><div {...stylex.props(s.contactHeading)}><h2 id="showroom-contact-heading" {...stylex.props(s.contactTitle)}>{tx('Contacts')}</h2><ContactShareMenu/></div><p {...stylex.props(s.contactCopy)}>{tx('Arrange a viewing or ask about a car.')}</p></div>
          <div data-showroom-contact-links {...stylex.props(s.contactLinks)}>
            {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} {...stylex.props(s.contact)}><Phone size={19} aria-hidden="true"/><span><span {...stylex.props(s.label)}>{tx('Phone')}</span>{dealer.phoneDisplay || dealer.phoneE164}</span><ArrowUpRight size={16} aria-hidden="true"/></a> : null}
            {dealer.email ? <a href={`mailto:${dealer.email}`} {...stylex.props(s.contact)}><Mail size={19} aria-hidden="true"/><span><span {...stylex.props(s.label)}>{tx('Email')}</span>{dealer.email}</span><ArrowUpRight size={16} aria-hidden="true"/></a> : null}
            {dealer.whatsappUrl ? <a href={dealer.whatsappUrl} target="_blank" rel="noopener noreferrer" {...stylex.props(s.contact)}><MessageCircle size={19} aria-hidden="true"/><span>WhatsApp</span><ArrowUpRight size={16} aria-hidden="true"/></a> : null}
            {dealer.website ? <a href={dealer.website} target="_blank" rel="noopener noreferrer" {...stylex.props(s.contact)}><Globe size={19} aria-hidden="true"/><span>{tx('Website')}</span><ArrowUpRight size={16} aria-hidden="true"/></a> : null}
            {!hasContacts ? <p {...stylex.props(s.contactCopy)}>{tx('Contact details are not available.')}</p> : null}
          </div>
          {profiles.length ? <div data-showroom-profiles {...stylex.props(s.socials)}><h3 {...stylex.props(s.heading)}>{tx('Our profiles')}</h3><div data-showroom-social-links {...stylex.props(s.socialLinks)}>{profiles.map(link => <a key={link.label + link.url} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} {...stylex.props(s.social)}><span {...stylex.props(s.socialLabel)}>{link.label}</span><ArrowUpRight size={14} aria-hidden="true"/></a>)}</div></div> : null}
          <button type="button" aria-haspopup="dialog" aria-expanded={enquiryOpen} onClick={() => setEnquiryOpen(true)} {...stylex.props(s.enquiry)}>{tx('Contact us')}<ArrowRight size={18} aria-hidden="true"/></button>
        </aside>
      </div>
      <div {...stylex.props(s.brands)}><BrandRow title="Makes in our catalogue"/></div>
      {dealer.services.length ? <section {...stylex.props(s.services)}><h3 {...stylex.props(s.heading)}>{tx('Dealer services')}</h3><ul {...stylex.props(s.serviceList)}>{dealer.services.map(service => <li key={service} {...stylex.props(s.service)}>{tx(service)}</li>)}</ul></section> : null}
      {dealer.previewNotice || dealer.inventoryNotice ? <footer {...stylex.props(s.notices)}><details><summary {...stylex.props(s.noticeSummary)}>{tx('About this catalogue')}</summary>{dealer.previewNotice ? <p>{tx(dealer.previewNotice)}</p> : null}{dealer.inventoryNotice ? <p>{tx(dealer.inventoryNotice)}</p> : null}</details></footer> : null}
    </main>
    <DealerEnquirySheet open={enquiryOpen} onClose={() => setEnquiryOpen(false)}/>
  </div>;
}

const s = stylex.create({
  phoneHeader: {display: {[media.desktop]: 'none', default: 'contents'}},
  phoneIntro: {display: {[media.desktop]: 'none', default: 'block'}, marginBottom: 20, color: $.muted, fontSize: 15, lineHeight: '22px'},
  page: {maxWidth: $.content, marginInline: 'auto', paddingTop: {[media.desktop]: 12, default: 8}, paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: 40},
  layout: {display: 'grid', gridTemplateColumns: {[media.mobile]: 'minmax(0,1fr)', default: 'repeat(2,minmax(0,1fr))'}, alignItems: 'stretch', gap: {[media.mobile]: 16, default: 24}},
  visit: {display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: {[media.mobile]: 'auto', default: 440}, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 20},
  visitHeading: {display: 'flex', alignItems: 'center', gap: 12, minHeight: {[media.desktop]: 80, default: 64}, padding: {[media.mobile]: '12px 16px', [media.desktop]: '18px 24px', default: '16px 20px'}},
  visitLabel: {minWidth: 0},
  heading: {fontSize: 16, fontWeight: 500, lineHeight: '24px'},
  address: {marginTop: 4, color: $.muted, fontSize: 14, fontStyle: 'normal', lineHeight: '22px', overflowWrap: 'anywhere'},
  directions: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: 44, marginLeft: 'auto', color: $.ink, borderRadius: $.radiusPill},
  directionsPill: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: {[media.mobile]: 4, default: 6}, minHeight: {[media.mobile]: 32, default: 44}, paddingInline: {[media.mobile]: 8, [media.desktop]: 12, default: 10}, fontSize: {[media.mobile]: 12, default: 13}, lineHeight: {[media.mobile]: '18px', default: '20px'}, borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  directionsIcon: {width: {[media.mobile]: 14, default: 16}, height: {[media.mobile]: 14, default: 16}},
  directionsShort: {display: {[media.desktop]: 'none', default: 'inline'}},
  directionsFull: {display: {[media.desktop]: 'inline', default: 'none'}},
  map: {display: 'block', flexGrow: 1, width: '100%', height: {[media.mobile]: 220, default: 280}, minHeight: {[media.mobile]: 220, default: 280}, borderWidth: 0, backgroundColor: $.surfaceAlt},
  mapEmpty: {display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: {[media.mobile]: 140, default: 160}, padding: 24, textAlign: 'center', backgroundColor: $.surfaceAlt, backgroundImage: 'linear-gradient(rgba(215,215,220,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(215,215,220,.3) 1px, transparent 1px)', backgroundSize: '48px 48px'},
  emptyPanel: {minHeight: 0},
  emptyCopy: {maxWidth: 280, color: $.muted, fontSize: 14, lineHeight: '22px'},
  visitNote: {padding: {[media.mobile]: '12px 16px', default: '16px 20px'}, color: $.muted, fontSize: 13, lineHeight: '21px'},
  contacts: {display: 'flex', flexDirection: 'column', gap: {[media.mobile]: 16, default: 20}, minWidth: 0, minHeight: {[media.mobile]: 0, default: 440}, padding: {[media.mobile]: 16, default: 24}, borderRadius: 20, backgroundColor: $.surfaceAlt},
  contactHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  contactTitle: {fontSize: {[media.desktop]: 22, default: 20}, fontWeight: 600, lineHeight: {[media.desktop]: '28px', default: '26px'}, letterSpacing: '-.02em'},
  locationTitle: {fontSize: {[media.desktop]: 22, default: 18}, lineHeight: {[media.desktop]: '28px', default: '24px'}},
  contactCopy: {marginTop: 8, color: $.muted, fontSize: 14, lineHeight: '22px'},
  contactLinks: {display: 'grid', gap: 8},
  contact: {display: 'grid', gridTemplateColumns: '20px minmax(0,1fr) 16px', alignItems: 'center', gap: 12, minHeight: 56, padding: '12px 14px', color: $.ink, fontSize: 14, lineHeight: '22px', overflowWrap: 'anywhere', borderRadius: 12, backgroundColor: {default: $.surface, ':hover': $.line}},
  label: {display: 'block', color: $.muted, fontSize: 12, lineHeight: '18px'},
  socials: {padding: 12, borderRadius: 12, backgroundColor: $.surface},
  socialLinks: {display: {[media.mobile]: 'grid', default: 'flex'}, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', flexWrap: 'wrap', gap: 8, marginTop: 8},
  social: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 0, minHeight: 44, paddingInline: 12, color: $.ink, fontSize: 13, lineHeight: '20px', borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  socialLabel: {minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  enquiry: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 48, marginTop: 'auto', padding: '12px 18px', color: '#fff', fontFamily: $.fontSans, fontSize: 14, fontWeight: 500, lineHeight: '20px', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, cursor: 'pointer'},
  brands: {marginTop: 28},
  services: {marginTop: 28},
  serviceList: {display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', marginTop: 12, padding: 0},
  service: {padding: '8px 14px', fontSize: 14, lineHeight: '22px', borderRadius: $.radiusPill, backgroundColor: $.surfaceAlt},
  noticeSummary: {width: 'fit-content', minHeight: 44, paddingBlock: 12, cursor: 'pointer'},
  notices: {display: 'grid', gap: 6, marginTop: 24, color: $.muted, fontSize: 12, lineHeight: '20px'},
});
