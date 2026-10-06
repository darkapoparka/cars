'use client';

import {ArrowRight, Check} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import type {ServiceSearchState} from '@/components/ServiceSearchField';
import {useCopy} from '@/lib/locale';
import {serviceOptions} from '@/lib/service-catalogue';
import {useHomeAlternative} from '@/lib/home-alternative';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';
import FilterPill from '@/components/FilterPill';

export default function ServiceCatalogue({searchState}: {searchState: ServiceSearchState}) {
  const tx = useCopy();
  const alternative = useHomeAlternative();
  const {query, category, update, clear} = searchState;
  const search = query.trim().toLocaleLowerCase();
  const visible = serviceOptions.filter(option => {
    const terms = [option.name, option.label, option.copy, ...option.checks];
    return (category === 'all' || option.id === category)
      && terms.flatMap(term => [term, tx(term)]).join(' ').toLocaleLowerCase().includes(search);
  });

  return <section aria-label={tx('Service options')} {...stylex.props(s.catalogue)}>
    <div {...stylex.props(s.toolbar)}>
    <div role="group" aria-label={tx('Service categories')} {...stylex.props(s.pills)}>
      {[{id: 'all', label: 'All'}, ...serviceOptions].map(option => <FilterPill key={option.id} label={option.label} tone="soft" pressed={category === option.id} onClick={() => update(query, option.id)}/>)}
    </div>
    <Link href="/service/details" aria-label={tx('Book a service')} {...stylex.props(s.request, t.caption)}>{tx('Book a service')}<ArrowRight size={16} aria-hidden="true"/></Link>
    </div>
    <span role="status" {...stylex.props(s.srOnly)}>{visible.length} {tx('Service options')}</span>
    {visible.length > 0 ? <div {...stylex.props(s.cards)}>{visible.map(option => <Link key={option.id} href={`/service/details?service=${option.id}`} aria-label={`${tx('Choose a service')}: ${tx(option.label)}`} data-service-card={option.id} {...stylex.props(s.card, alternative && s.compactCard)}>
      <div {...stylex.props(s.artwork, alternative && s.compactArtwork)}>
        <Image src={option.image} width={1200} height={800} sizes={alternative ? '(min-width: 1240px) 284px, (min-width: 1100px) 25vw, (max-width: 767px) 88px, 50vw' : '(min-width: 1240px) 284px, (min-width: 1100px) 25vw, (max-width: 767px) calc(100vw - 24px), 50vw'} alt="" {...stylex.props(s.image, alternative && s.compactImage)}/>
        {option.demo ? <span {...stylex.props(s.demo, alternative && s.compactDemo)}>{tx('Demo service')}</span> : null}
      </div>
      <div {...stylex.props(s.cardBody, alternative && s.compactBody)}>
        <div {...stylex.props(s.cardHeading, alternative && s.compactHeading)}><h2 {...stylex.props(t.heading, s.title, alternative && s.compactTitle)}>{tx(option.label)}</h2><span {...stylex.props(s.arrow, alternative && s.compactArrow)}><ArrowRight size={20} aria-hidden="true"/></span></div>
        <ul {...stylex.props(s.checks, alternative && s.compactChecks)}>{option.checks.map(check => <li key={check} {...stylex.props(t.body, s.check, alternative && s.compactCheck)}><span aria-hidden="true" {...stylex.props(s.icon, alternative && s.compactIcon)}><Check size={12} strokeWidth={2.25}/></span>{tx(check)}</li>)}</ul>
      </div>
    </Link>)}</div> : <div {...stylex.props(s.empty)}><p {...stylex.props(t.title)}>{tx('No matching services.')}</p><button type="button" onClick={() => clear('all')} {...stylex.props(s.reset, t.control)}>{tx('Show all services')}<ArrowRight size={18} aria-hidden="true"/></button></div>}
  </section>;
}

const s = stylex.create({
  catalogue: {marginTop: {[media.mobile]: $.mobilePillGap, [media.desktop]: 12, default: 24}},
  toolbar: {display: {[media.desktop]: 'flex', default: 'contents'}, alignItems: 'center', justifyContent: 'space-between', gap: 16},
  request: {display: {[media.desktop]: 'inline-flex', default: 'none'}, alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 8, minHeight: 44, paddingInline: 14, color: $.ink, borderRadius: 999, backgroundColor: {default: $.surfaceAlt, ':hover': '#ededf0'}, textDecoration: 'none'},
  pills: {display: 'flex', minWidth: 0, gap: 8, overflowX: 'auto', marginTop: {[media.mobile]: 0, [media.desktop]: 0, default: 10}, paddingBlock: {[media.mobile]: 0, default: 3}, scrollbarWidth: 'none'},
  cards: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.desktop]: 'repeat(4,minmax(0,1fr))', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, [media.desktop]: 16, default: 20}, marginTop: {[media.mobile]: $.mobilePillGap, default: 14}},
  card: {display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', color: $.ink, textDecoration: 'none', borderRadius: {[media.desktop]: 14, default: 20}, backgroundColor: {default: $.surfaceAlt, ':hover': '#ededf0'}, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 3},
  image: {display: 'block', width: '100%', height: {[media.desktop]: 120, default: 'auto'}, aspectRatio: {[media.desktop]: 'auto', default: '2 / 1'}, objectFit: 'cover', objectPosition: 'center 55%'},
  artwork: {position: 'relative'},
  demo: {position: 'absolute', top: 12, left: 12, padding: '4px 8px', borderRadius: 6, backgroundColor: '#fff', color: $.ink, fontSize: 12, lineHeight: '18px', fontWeight: 500},
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
  compactDemo: {top: {[media.mobile]: 'auto', default: 12}, bottom: {[media.mobile]: 4, default: 'auto'}, left: {[media.mobile]: 4, default: 12}, right: {[media.mobile]: 4, default: 'auto'}, padding: {[media.mobile]: '2px 4px', default: '4px 8px'}, fontSize: {[media.mobile]: 10, default: 12}, lineHeight: {[media.mobile]: '14px', default: '18px'}, textAlign: {[media.mobile]: 'center', default: 'left'}},
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
