'use client';

import {useRef, useState} from 'react';
import {ArrowRight, Check, Search, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Image from '@/components/AppImage';
import Link from '@/components/AppLink';
import {searchField} from '@/components/search-field.stylex';
import {useCopy} from '@/lib/locale';
import {useSearchParams} from '@/lib/navigation';
import {serviceOptions} from '@/lib/service-catalogue';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export default function ServiceCatalogue() {
  const tx = useCopy();
  const params = useSearchParams();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState<string>(serviceOptions.find(option => option.id === params.get('category'))?.id ?? 'all');
  const search = query.trim().toLocaleLowerCase();
  const visible = serviceOptions.filter(option => {
    const terms = [option.name, option.label, option.copy, ...option.checks];
    return (category === 'all' || option.id === category)
      && terms.flatMap(term => [term, tx(term)]).join(' ').toLocaleLowerCase().includes(search);
  });

  function update(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery); setCategory(nextCategory);
    const next = new URLSearchParams(window.location.search);
    if (nextQuery) next.set('q', nextQuery); else next.delete('q');
    if (nextCategory !== 'all') next.set('category', nextCategory); else next.delete('category');
    const suffix = next.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${suffix ? `?${suffix}` : ''}${window.location.hash}`);
  }
  function clear(nextCategory = category) {update('', nextCategory); input.current?.focus();}

  return <section aria-label={tx('Service options')} {...stylex.props(s.catalogue)}>
    <div role="search">
      <div data-search-field {...stylex.props(searchField.field, s.search)}>
        <Search aria-hidden="true" {...stylex.props(searchField.icon)}/>
        <input ref={input} data-search-input type="search" aria-label={tx('Search services')} placeholder={tx('Search services')} value={query} onChange={event => update(event.target.value, category)} {...stylex.props(searchField.input, s.input)}/>
        {query ? <button type="button" aria-label={tx('Clear search')} onClick={() => clear()} {...stylex.props(searchField.clear, s.clear)}><X size={18} aria-hidden="true"/></button> : null}
      </div>
    </div>
    <div role="group" aria-label={tx('Service categories')} {...stylex.props(s.pills)}>
      {[{id: 'all', label: 'All'}, ...serviceOptions].map(option => <button key={option.id} type="button" aria-pressed={category === option.id} onClick={() => update(query, option.id)} {...stylex.props(s.pill, t.caption, category === option.id && s.selectedPill)}>{tx(option.label)}</button>)}
    </div>
    <span role="status" {...stylex.props(s.srOnly)}>{visible.length} {tx('Service options')}</span>
    {visible.length > 0 ? <div {...stylex.props(s.cards)}>{visible.map(option => <Link key={option.id} href={`/service/details?service=${option.id}`} aria-label={`${tx('Choose a service')}: ${tx(option.label)}`} data-service-card={option.id} {...stylex.props(s.card)}>
      <Image src={option.image} width={1200} height={800} sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1240px) 50vw, 584px" alt="" {...stylex.props(s.image)}/>
      <div {...stylex.props(s.cardBody)}>
        <div {...stylex.props(s.cardHeading)}><h2 {...stylex.props(t.heading, s.title)}>{tx(option.label)}</h2><span {...stylex.props(s.arrow)}><ArrowRight size={20} aria-hidden="true"/></span></div>
        <ul {...stylex.props(s.checks)}>{option.checks.map(check => <li key={check} {...stylex.props(s.check, t.body)}><Check size={18} aria-hidden="true" {...stylex.props(s.icon)}/>{tx(check)}</li>)}</ul>
      </div>
    </Link>)}</div> : <div {...stylex.props(s.empty)}><p {...stylex.props(t.title)}>{tx('No matching services.')}</p><button type="button" onClick={() => clear('all')} {...stylex.props(s.reset, t.control)}>{tx('Show all services')}<ArrowRight size={18} aria-hidden="true"/></button></div>}
  </section>;
}

const s = stylex.create({
  catalogue: {marginTop: {[media.mobile]: 16, default: 24}},
  search: {minHeight: 48, outline: {default: 'none', ':focus-within': '2px solid #242428'}, outlineOffset: 2},
  input: {minHeight: 44, appearance: {default: 'auto', '::-webkit-search-cancel-button': 'none'}},
  clear: {width: 44, height: 44},
  pills: {display: 'flex', gap: 8, overflowX: 'auto', marginTop: 10, paddingBlock: 3, scrollbarWidth: 'none'},
  pill: {flexShrink: 0, minWidth: 44, minHeight: 44, padding: {[media.mobile]: '8px 7px', default: '8px 12px'}, color: $.ink, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 9999, backgroundColor: {default: $.surfaceAlt, ':hover': '#eaeaed'}, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: -3, cursor: 'pointer'},
  selectedPill: {color: '#fff', borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': '#353539'}, outlineColor: {':focus-visible': '#fff'}},
  cards: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: 14, default: 20}, marginTop: 14},
  card: {display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', color: $.ink, textDecoration: 'none', borderRadius: 20, backgroundColor: {default: $.surfaceAlt, ':hover': '#ededf0'}, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 3},
  image: {display: 'block', width: '100%', height: 'auto', aspectRatio: '2 / 1', objectFit: 'cover', objectPosition: 'center 55%'},
  cardBody: {padding: {[media.mobile]: 18, default: 24}},
  cardHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  title: {minWidth: 0, margin: 0, overflowWrap: 'anywhere'},
  arrow: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fff'},
  checks: {display: 'grid', gap: 8, margin: '10px 0 0', padding: 0, listStyle: 'none'},
  check: {display: 'flex', alignItems: 'center', gap: 8, color: $.muted},
  icon: {flexShrink: 0, color: $.muted},
  empty: {display: 'grid', justifyItems: 'start', alignContent: 'center', gap: 16, minHeight: 220, marginTop: 14, padding: 24, borderRadius: 20, backgroundColor: $.surfaceAlt},
  reset: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, padding: '10px 18px', color: $.ink, borderWidth: 0, borderRadius: 30, backgroundColor: '#fff', cursor: 'pointer'},
  srOnly: {position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap'},
});
