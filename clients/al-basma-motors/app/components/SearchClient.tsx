'use client';
import {displayMake} from '@/lib/inventory-labels';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent} from 'react';
import Link from '@/components/AppLink';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {ChevronRight, Search, X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import {BrandEmblem} from '@/components/ReferenceUI';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, vehicles} from '@/lib/data';
import { tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';

const distinctNames = (values: string[]) => [...new Map(values.map(value => [value.trim().toLowerCase(), value.trim()])).values()].filter(Boolean);
const stockedMakes = distinctNames(vehicles.map(vehicle => vehicle.make));
const preferredMakes = ['Nissan', 'Toyota', 'Mitsubishi', 'MG', 'Mercedes-Benz'];
const popular = [...preferredMakes.filter(make => stockedMakes.includes(make)), ...stockedMakes.filter(make => !preferredMakes.includes(make))].slice(0, 5);
export type SearchChoice = {brand?: string; body?: string; query?: string};
type Suggestion = SearchChoice & {label: string};

export default function SearchClient({initialQuery = '', overlay = false, formId, onDismiss, onSearch}: {initialQuery?: string; overlay?: boolean; formId?: string; onDismiss?: () => void; onSearch?: (choice: SearchChoice) => void}) {
  const tx = useCopy();

  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(-1);
  const recent = useRecentVehicles().map(getVehicle).filter(vehicle => vehicle !== undefined);
  const suggestions = useMemo<Suggestion[]>(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const makes = distinctNames([...popular, ...stockedMakes]);
    const matchingMake = makes.find(make => make.toLowerCase().startsWith(value));
    if (matchingMake) {
      const stock = vehicles.filter(vehicle => vehicle.make.trim().toLowerCase() === matchingMake.toLowerCase());
      const models = distinctNames(stock.map(vehicle => vehicle.model));
      const bodies = distinctNames(stock.map(vehicle => vehicle.body)).filter(body => body !== 'Not published');
      return [{label: displayMake(matchingMake), brand: matchingMake},
        ...bodies.map(body => ({label: `${displayMake(matchingMake)} ${tx(body)}`, brand: matchingMake, body})),
        ...models.slice(0, 5).map(model => ({label: `${displayMake(matchingMake)} ${model}`, brand: matchingMake, query: `${matchingMake} ${model}`}))];
    }
    return [...new Map(vehicles.filter(vehicle => `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(value)).map(vehicle => [`${vehicle.make} ${vehicle.model}`.toLowerCase(), {label: `${displayMake(vehicle.make)} ${vehicle.model}`, brand: vehicle.make, query: `${vehicle.make} ${vehicle.model}`}])).values()].slice(0, 8);
  }, [query, tx]);
  useEffect(() => {if (!overlay) input.current?.focus({preventScroll: true});}, [overlay]);
  useEffect(() => {if (active >= 0) document.getElementById(`suggestion-${active}`)?.scrollIntoView({block: 'nearest', behavior: 'instant'});}, [active]);
  function choose(suggestion?: Suggestion) {
    if (onSearch) {onSearch({brand: suggestion?.brand, body: suggestion?.body, query: suggestion ? suggestion.query ?? '' : query.trim()}); return;}
    const params = new URLSearchParams();
    if (suggestion?.brand) params.set('brand', suggestion.brand);
    if (suggestion?.body) params.set('body', suggestion.body);
    if (suggestion?.query || !suggestion) params.set('q', suggestion?.query ?? query.trim());
    const suffix = params.toString();
    const href = `/cars${suffix ? `?${suffix}` : ''}`;
    // Replace the modal's history entry so Back returns to Home once.
    if (overlay) router.replace(href); else router.push(href);
  }
  function submit(event: FormEvent) {event.preventDefault(); choose(active >= 0 ? suggestions[active] : undefined);}
  function keydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {event.preventDefault(); setActive(index => Math.min(index + 1, suggestions.length - 1));}
    if (event.key === 'ArrowUp') {event.preventDefault(); setActive(index => Math.max(index - 1, -1));}
    if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); if (onDismiss) onDismiss(); else router.back();}
  }
  const Content = overlay ? 'div' : 'main';
  return <>{!overlay ? <PageHeader title={tx("Search")} backHref="/cars" backLabel={tx("Back to cars")}/> : null}<Content {...stylex.props(s.page, overlay && s.overlayPage)}>
    <div {...stylex.props(overlay && s.overlaySearchBar)}><form id={formId} data-search-field role="search" onSubmit={submit} {...stylex.props(searchField.field)}>
      <Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/>
      <input data-search-input ref={input} type="search" enterKeyHint="search" role="combobox" aria-label={tx("Search by brand or model")} aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls={suggestions.length ? "search-suggestions" : undefined} aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined} placeholder={tx("Make or model")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={event => {setQuery(event.target.value); setActive(-1);}} onKeyDown={keydown} {...stylex.props(searchField.input)} />
      {query ? <button type="button" aria-label={tx("Clear search")} onClick={() => {setQuery(''); setActive(-1); input.current?.focus();}} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true" /></button> : null}
    </form></div>
    <p role="status" className="visually-hidden">{query.trim() ? `${suggestions.length} ${tx('search suggestions available')}` : ''}</p>
    {query.trim() ? <div id="search-suggestions" role={suggestions.length ? "listbox" : undefined} aria-label={suggestions.length ? tx("Search suggestions") : undefined} {...stylex.props(s.suggestions)}>
      {suggestions.map((suggestion, index) => <button type="button" id={`suggestion-${index}`} key={suggestion.label} role="option" aria-selected={index === active} onClick={() => choose(suggestion)} {...stylex.props(s.suggestion, index === active && s.active)}>
        <span {...stylex.props(s.suggestionIcon)}><Search size={18} strokeWidth={1.8} aria-hidden="true"/></span><span {...stylex.props(s.suggestionText)}><strong {...stylex.props(s.suggestionMake)}>{tx(suggestion.label.split(' ')[0])}</strong>{tx(suggestion.label.includes(' ') ? ` ${suggestion.label.split(' ').slice(1).join(' ')}` : '')}</span><ChevronRight size={18} strokeWidth={1.6} aria-hidden="true" {...stylex.props(s.suggestionArrow)}/>
      </button>)}
      {!suggestions.length ? <button type="button" onClick={() => choose()} {...stylex.props(s.suggestion)}><span {...stylex.props(s.suggestionIcon)}><Search size={18} strokeWidth={1.8} aria-hidden="true"/></span><span {...stylex.props(s.suggestionText)}>{tx("Search for “")}{tx(query)}{tx("”")}</span><ChevronRight size={18} aria-hidden="true" {...stylex.props(s.suggestionArrow)}/></button> : null}
    </div> : <>
      {!overlay ? <Link href="/finance" {...stylex.props(s.loan)}><img src={assetPath("/reference-assets/loan-card.png")} width={30} height={28} alt="" /><span>{tx("Finance help")}</span><u>{tx("Explore")}</u><ChevronRight size={12} aria-hidden="true" /></Link> : null}
      {popular.length ? <section {...stylex.props(s.popular)}><h2 {...stylex.props(s.title)}>{tx("Popular Brands")}</h2><div {...stylex.props(s.brands)}>{popular.map(brand => <button type="button" key={brand} onClick={() => choose({label: brand, brand})} aria-label={tx(`Search ${brand}`)} {...stylex.props(s.brand)}><BrandEmblem make={brand}/><span {...stylex.props(s.brandLabel)}>{tx(displayMake(brand))}</span></button>)}</div></section> : null}
      {!overlay && recent.length ? <section {...stylex.props(s.recent)}><h2 {...stylex.props(s.title)}>{tx("Recently viewed cars")}</h2><div {...stylex.props(s.recentRail)}>{recent.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div></section> : null}
    </>}
  </Content></>;
}
const s = stylex.create({
  page: {maxWidth: 720, marginInline: 'auto', paddingTop: 8, paddingInline: 16, paddingBottom: 32, color: $.ink, fontFamily: $.fontSans, backgroundColor: '#fff'},
  overlayPage: {paddingInline: 20, paddingBottom: 20},
  overlaySearchBar: {position: 'sticky', top: 0, zIndex: 1, marginTop: -8, marginInline: -20, paddingTop: 8, paddingBottom: 8, paddingInline: 20, backgroundColor: $.surface},
  loan: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 51, marginTop: 9, paddingInline: 14, color: '#080808', fontSize: 14, borderColor: '#e8e8e8', borderStyle: 'solid', borderWidth: 1, borderRadius: 7, backgroundColor: '#f9f9f9'},
  popular: {marginTop: 28},
  title: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  brands: {display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', marginTop: 12, marginRight: -16, paddingTop: 4, paddingBottom: 4, paddingRight: 16, scrollbarWidth: 'none'},
  brand: {display: 'flex', alignItems: 'center', flexDirection: 'column', flexShrink: 0, gap: 8, width: 72, minHeight: 96, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 14, backgroundColor: 'transparent', cursor: 'pointer'},
  brandLabel: {fontSize: 12, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap'},
  recent: {marginTop: 28},
  recentRail: {display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', marginTop: 12, marginRight: -16, paddingRight: 16, paddingBottom: 8, scrollbarWidth: 'none', fontFamily: $.fontSans},
  suggestions: {display: 'grid', gap: 4, marginTop: 12},
  suggestion: {display: 'grid', gridTemplateColumns: '36px minmax(0,1fr) 20px', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '8px', color: $.ink, fontSize: 16, fontWeight: 400, lineHeight: 1.5, textAlign: 'left', borderWidth: 0, borderRadius: 14, backgroundColor: {default: '#fff', ':hover': '#f4f4f5'}, cursor: 'pointer'},
  suggestionIcon: {display: 'grid', placeItems: 'center', width: 36, height: 36, color: $.muted, borderRadius: '50%', backgroundColor: '#f4f4f5'},
  suggestionMake: {fontWeight: 500},
  suggestionText: {minWidth: 0, overflowWrap: 'anywhere'},
  suggestionArrow: {color: $.muted},
  active: {backgroundColor: {default: '#f0f0f2', ':hover': '#f0f0f2'}},
});
