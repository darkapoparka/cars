'use client';

import {useState} from 'react';
import {ArrowRight, Check} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Image from '@/components/AppImage';
import ServiceDetailsSheet from '@/components/ServiceDetailsSheet';
import type {ServiceSearchState} from '@/components/ServiceSearchField';
import {useCopy} from '@/lib/locale';
import {serviceOptions, type ServiceOption} from '@/lib/service-catalogue';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';
import FilterPill from '@/components/FilterPill';
import {desktopHero} from '@/components/desktop-hero.stylex';

function ServiceCategories({searchState, onDark = false}: {searchState: ServiceSearchState; onDark?: boolean}) {
  const tx = useCopy();
  const {query, category, update} = searchState;
  return <div role="group" aria-label={tx('Service categories')} {...stylex.props(s.pills)}>
    {[{id: 'all', label: 'All'}, ...serviceOptions].map(option => <FilterPill key={option.id} label={option.label} tone="soft" onDark={onDark} pressed={category === option.id} onClick={() => update(query, option.id)}/>)}
  </div>;
}

export function ServiceHeroControls({searchState}: {searchState: ServiceSearchState}) {
  const tx = useCopy();
  const [open, setOpen] = useState(false);
  return <>
    <div {...stylex.props(desktopHero.secondary)}><ServiceCategories searchState={searchState} onDark/><button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} {...stylex.props(desktopHero.action)}><span {...stylex.props(desktopHero.actionSurface)}>{tx('Enquire')}<ArrowRight size={16} aria-hidden="true"/></span></button></div>
    {open ? <ServiceDetailsSheet service={null} initialView="enquiry" onClose={() => setOpen(false)}/> : null}
  </>;
}

export default function ServiceCatalogue({searchState}: {searchState: ServiceSearchState}) {
  const tx = useCopy();
  const [selection, setSelection] = useState<{service: ServiceOption | null; initialView: 'details' | 'enquiry'} | null>(null);
  const {query, category, clear} = searchState;
  const search = query.trim().toLocaleLowerCase();
  const visible = serviceOptions.filter(option => {
    const terms = [option.name, option.label, option.copy, ...option.checks];
    return (category === 'all' || option.id === category)
      && terms.flatMap(term => [term, tx(term)]).join(' ').toLocaleLowerCase().includes(search);
  });

  return <section aria-label={tx('Service options')} {...stylex.props(s.catalogue)}>
    <div {...stylex.props(s.toolbar)}>
    <ServiceCategories searchState={searchState}/>
    </div>
    <span role="status" {...stylex.props(s.srOnly)}>{visible.length} {tx('Service options')}</span>
    {visible.length > 0 ? <div {...stylex.props(s.cards)}>{visible.map(option => <button key={option.id} type="button" aria-haspopup="dialog" onClick={() => setSelection({service: option, initialView: 'details'})} aria-label={`${tx('Choose a service')}: ${tx(option.label)}`} data-service-card={option.id} {...stylex.props(s.card, s.compactCard)}>
      <div {...stylex.props(s.artwork, s.compactArtwork)}>
        <Image src={option.image} width={1200} height={800} sizes="(min-width: 1240px) 284px, (min-width: 1100px) 25vw, (max-width: 767px) 88px, 50vw" alt="" {...stylex.props(s.image, s.compactImage)}/>
      </div>
      <div {...stylex.props(s.cardBody, s.compactBody)}>
        <div {...stylex.props(s.cardHeading, s.compactHeading)}><h2 {...stylex.props(t.heading, s.title, s.compactTitle)}>{tx(option.label)}</h2><span {...stylex.props(s.arrow, s.compactArrow)}><ArrowRight size={20} aria-hidden="true"/></span></div>
        <ul {...stylex.props(s.checks, s.compactChecks)}>{option.checks.map(check => <li key={check} {...stylex.props(t.body, s.check, s.compactCheck)}><span aria-hidden="true" {...stylex.props(s.icon, s.compactIcon)}><Check size={12} strokeWidth={2.25}/></span>{tx(check)}</li>)}</ul>
      </div>
    </button>)}</div> : <div {...stylex.props(s.empty)}><p {...stylex.props(t.title)}>{tx('No matching services.')}</p><button type="button" onClick={() => clear('all')} {...stylex.props(s.reset, t.control)}>{tx('Show all services')}<ArrowRight size={18} aria-hidden="true"/></button></div>}
    {selection ? <ServiceDetailsSheet key={selection.service?.id || 'service-enquiry'} {...selection} onClose={() => setSelection(null)}/> : null}
  </section>;
}

const s = stylex.create({
  catalogue: {marginTop: {[media.mobile]: $.mobilePillGap, [media.desktop]: 12, default: 24}},
  toolbar: {display: {[media.desktop]: 'none', default: 'contents'}, alignItems: 'center', justifyContent: 'space-between', gap: 16},
  pills: {display: 'flex', minWidth: 0, gap: 8, overflowX: 'auto', marginTop: {[media.mobile]: 0, [media.desktop]: 0, default: 10}, paddingBlock: {[media.mobile]: 0, [media.desktop]: 0, default: 3}, scrollbarWidth: 'none'},
  cards: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.desktop]: 'repeat(4,minmax(0,1fr))', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, [media.desktop]: 16, default: 20}, marginTop: {[media.mobile]: $.mobilePillGap, [media.desktop]: 12, default: 14}},
  card: {display: 'flex', flexDirection: 'column', alignItems: 'stretch', minWidth: 0, padding: 0, overflow: 'hidden', color: $.ink, fontFamily: $.fontSans, textAlign: 'left', borderWidth: 0, borderRadius: {[media.desktop]: 14, default: 20}, backgroundColor: {default: $.surfaceAlt, ':hover': '#ededf0'}, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 3, cursor: 'pointer'},
  image: {display: 'block', width: '100%', height: {[media.desktop]: 120, default: 'auto'}, aspectRatio: {[media.desktop]: 'auto', default: '2 / 1'}, objectFit: 'cover', objectPosition: 'center 55%'},
  artwork: {position: 'relative'},
  cardBody: {padding: {[media.mobile]: 18, [media.desktop]: 16, default: 24}},
  cardHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: {[media.desktop]: 8, default: 12}},
  title: {minWidth: 0, margin: 0, overflowWrap: 'anywhere', fontSize: {[media.mobile]: 24, [media.desktop]: 20, default: 28}, lineHeight: {[media.mobile]: '28px', [media.desktop]: '26px', default: '34px'}},
  arrow: {display: 'grid', placeItems: 'center', flexShrink: 0, width: {[media.desktop]: 28, default: 40}, height: {[media.desktop]: 28, default: 40}, borderRadius: '50%', backgroundColor: '#fff'},
  checks: {display: 'grid', gap: {[media.desktop]: 6, default: 8}, margin: {[media.desktop]: '8px 0 0', default: '10px 0 0'}, padding: 0, listStyle: 'none'},
  check: {display: 'flex', alignItems: 'center', gap: 8, color: $.muted, fontSize: {[media.mobile]: 15, [media.desktop]: 14, default: 16}, lineHeight: {[media.mobile]: '22px', [media.desktop]: '20px', default: '24px'}},
  icon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 18, height: 18, borderRadius: '50%', borderWidth: 1, borderStyle: 'solid', borderColor: '#dedee3', backgroundColor: '#fff', color: $.muted},
  compactCard: {flexDirection: {[media.mobile]: 'row', default: 'column'}, alignItems: {[media.mobile]: 'center', default: 'stretch'}, gap: {[media.mobile]: 12, default: 0}, padding: {[media.mobile]: 12, default: 0}},
  compactArtwork: {flexShrink: 0, width: {[media.mobile]: 88, default: 'auto'}, height: {[media.mobile]: 88, default: 'auto'}, overflow: {[media.mobile]: 'hidden', default: 'visible'}, borderRadius: {[media.mobile]: 14, default: 0}},
  compactImage: {height: {[media.mobile]: '100%', [media.desktop]: 120, default: 'auto'}, aspectRatio: {[media.mobile]: '1 / 1', [media.desktop]: 'auto', default: '2 / 1'}},
  compactBody: {flexGrow: {[media.mobile]: 1, default: 0}, minWidth: 0, padding: {[media.mobile]: 0, [media.desktop]: 16, default: 24}},
  compactHeading: {gap: {[media.mobile]: 6, [media.desktop]: 8, default: 12}},
  compactTitle: {fontSize: {[media.mobile]: 18, [media.desktop]: 20, default: 28}, fontWeight: {[media.mobile]: 500, default: 600}, lineHeight: {[media.mobile]: '24px', [media.desktop]: '26px', default: '34px'}},
  compactArrow: {width: {[media.mobile]: 20, [media.desktop]: 28, default: 40}, height: {[media.mobile]: 24, [media.desktop]: 28, default: 40}, backgroundColor: {[media.mobile]: 'transparent', default: '#fff'}},
  compactChecks: {gap: {[media.mobile]: 4, [media.desktop]: 6, default: 8}, margin: {[media.mobile]: '6px 0 0', [media.desktop]: '8px 0 0', default: '10px 0 0'}},
  compactCheck: {gap: {[media.mobile]: 6, default: 8}, alignItems: {[media.mobile]: 'flex-start', default: 'center'}, fontSize: {[media.mobile]: 13, [media.desktop]: 14, default: 16}, lineHeight: {[media.mobile]: '18px', [media.desktop]: '20px', default: '24px'}},
  compactIcon: {width: {[media.mobile]: 14, default: 18}, height: {[media.mobile]: 14, default: 18}, marginTop: {[media.mobile]: 2, default: 0}},
  empty: {display: 'grid', justifyItems: 'start', alignContent: 'center', gap: 16, minHeight: 220, marginTop: {[media.mobile]: $.mobilePillGap, default: 14}, padding: 24, borderRadius: 20, backgroundColor: $.surfaceAlt},
  reset: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, padding: '10px 18px', color: $.ink, borderWidth: 0, borderRadius: 30, backgroundColor: '#fff', cursor: 'pointer'},
  srOnly: {position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap'},
});
