'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent} from 'react';
import Link from '@/components/AppLink';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {ChevronRight, Search, X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, vehicles} from '@/lib/data';
import { tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';

const popular = ['Nissan', 'Toyota', 'Mitsubishi', 'MG', 'Mercedes-Benz'];
const priorityModels: Record<string, string[]> = {
  Toyota: ['Yaris', 'RAV4', 'Prado', 'Corolla', 'Fortuner'],
  Nissan: ['Sunny', 'Patrol', 'Altima', 'Kicks', 'X-Trail'],
  Mitsubishi: ['Pajero', 'Attrage', 'Outlander', 'ASX', 'Xpander'],
  BMW: ['X1', 'X2', 'X3', 'X5', '3 Series'],
};
type Suggestion = {label: string; brand?: string; body?: string; query?: string};

export default function SearchClient({initialQuery = ''}: {initialQuery?: string}) {
  const tx = useCopy();

  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(-1);
  const recent = useRecentVehicles().map(getVehicle).filter(vehicle => vehicle !== undefined);
  const suggestions = useMemo<Suggestion[]>(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const makes = [...new Set([...popular, ...vehicles.map(vehicle => vehicle.make)])];
    const matchingMake = makes.find(make => make.toLowerCase().startsWith(value));
    if (matchingMake) {
      const models = priorityModels[matchingMake] ?? [...new Set(vehicles.filter(vehicle => vehicle.make === matchingMake).map(vehicle => vehicle.model))];
      return [{label: matchingMake, brand: matchingMake},
        {label: `${matchingMake} SUV`, brand: matchingMake, body: 'SUV'},
        {label: `${matchingMake} ${tx('Sedan')}`, brand: matchingMake, body: 'Sedan'},
        ...models.slice(0, 5).map(model => ({label: `${matchingMake} ${model}`, query: `${matchingMake} ${model}`}))];
    }
    return [...new Map(vehicles.filter(vehicle => `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(value)).map(vehicle => [`${vehicle.make} ${vehicle.model}`, {label: `${vehicle.make} ${vehicle.model}`, query: `${vehicle.make} ${vehicle.model}`}])).values()].slice(0, 8);
  }, [query, tx]);
  useEffect(() => {input.current?.focus({preventScroll: true});}, []);
  useEffect(() => {if (active >= 0) document.getElementById(`suggestion-${active}`)?.scrollIntoView({block: 'nearest', behavior: 'instant'});}, [active]);
  function choose(suggestion?: Suggestion) {
    const params = new URLSearchParams();
    if (suggestion?.brand) params.set('brand', suggestion.brand);
    if (suggestion?.body) params.set('body', suggestion.body);
    if (suggestion?.query || !suggestion) params.set('q', suggestion?.query ?? query.trim());
    router.push(`/cars?${params.toString()}`);
  }
  function submit(event: FormEvent) {event.preventDefault(); choose(active >= 0 ? suggestions[active] : undefined);}
  function keydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {event.preventDefault(); setActive(index => Math.min(index + 1, suggestions.length - 1));}
    if (event.key === 'ArrowUp') {event.preventDefault(); setActive(index => Math.max(index - 1, -1));}
    if (event.key === 'Escape') {event.preventDefault(); router.back();}
  }
  return <><PageHeader title={tx("Search")} backHref="/cars" backLabel={tx("Back to cars")}/><main {...stylex.props(s.page)}>
    <form data-search-field role="search" onSubmit={submit} {...stylex.props(searchField.field)}>
      <Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/>
      <input data-search-input ref={input} type="search" enterKeyHint="search" role="combobox" aria-label={tx("Search by brand or model")} aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls={suggestions.length ? "search-suggestions" : undefined} aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined} placeholder={tx("Make or model")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={event => {setQuery(event.target.value); setActive(-1);}} onKeyDown={keydown} {...stylex.props(searchField.input)} />
      {query ? <button type="button" aria-label={tx("Clear search")} onClick={() => {setQuery(''); setActive(-1); input.current?.focus();}} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true" /></button> : null}
    </form>
    <p role="status" className="visually-hidden">{query.trim() ? `${suggestions.length} ${tx('search suggestions available')}` : ''}</p>
    {query.trim() ? <div id="search-suggestions" role={suggestions.length ? "listbox" : undefined} aria-label={suggestions.length ? tx("Search suggestions") : undefined} {...stylex.props(s.suggestions)}>
      {suggestions.map((suggestion, index) => <button type="button" id={`suggestion-${index}`} key={suggestion.label} role="option" aria-selected={index === active} onClick={() => choose(suggestion)} {...stylex.props(s.suggestion, index === active && s.active)}>
        <span {...stylex.props(s.suggestionIcon)}><Search size={18} strokeWidth={1.8} aria-hidden="true"/></span><span {...stylex.props(s.suggestionText)}><strong {...stylex.props(s.suggestionMake)}>{tx(suggestion.label.split(' ')[0])}</strong>{tx(suggestion.label.includes(' ') ? ` ${suggestion.label.split(' ').slice(1).join(' ')}` : '')}</span><ChevronRight size={18} strokeWidth={1.6} aria-hidden="true" {...stylex.props(s.suggestionArrow)}/>
      </button>)}
      {!suggestions.length ? <button type="button" onClick={() => choose()} {...stylex.props(s.suggestion)}><span {...stylex.props(s.suggestionIcon)}><Search size={18} strokeWidth={1.8} aria-hidden="true"/></span><span {...stylex.props(s.suggestionText)}>{tx("Search for “")}{tx(query)}{tx("”")}</span><ChevronRight size={18} aria-hidden="true" {...stylex.props(s.suggestionArrow)}/></button> : null}
    </div> : <>
      <Link href="/finance" {...stylex.props(s.loan)}><img src={assetPath("/reference-assets/loan-card.png")} width={30} height={28} alt="" /><span>{tx("Finance help")}</span><u>{tx("Explore")}</u><ChevronRight size={12} aria-hidden="true" /></Link>
      <section {...stylex.props(s.popular)}><h2 {...stylex.props(s.title)}>{tx("Popular Brands")}</h2><div {...stylex.props(s.brands)}>{popular.map((brand, index) => <button type="button" key={brand} onClick={() => choose({label: brand, brand})} aria-label={tx(`Search ${brand}`)} {...stylex.props(s.brand)}><img src={assetPath(`/reference-assets/continuation/search-circle-${index}.png`)} width={65} height={66} alt="" {...stylex.props(s.brandLogo)} /><span {...stylex.props(s.brandLabel)}>{brand === 'Mercedes-Benz' ? 'Mercedes' : brand}</span></button>)}</div></section>
      {recent.length ? <section {...stylex.props(s.recent)}><h2 {...stylex.props(s.title)}>{tx("Recently viewed cars")}</h2><div {...stylex.props(s.recentRail)}>{recent.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div></section> : null}
    </>}
  </main></>;
}
const s = stylex.create({
  page: {maxWidth: 720, marginInline: 'auto', paddingTop: 8, paddingInline: 16, paddingBottom: 32, color: $.ink, fontFamily: $.fontSans, backgroundColor: '#fff'},
  loan: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 51, marginTop: 9, paddingInline: 14, color: '#080808', fontSize: 14, borderColor: '#e8e8e8', borderStyle: 'solid', borderWidth: 1, borderRadius: 7, backgroundColor: '#f9f9f9'},
  popular: {marginTop: 28},
  title: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  brands: {display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', marginTop: 12, marginRight: -16, paddingTop: 4, paddingBottom: 4, paddingRight: 16, scrollbarWidth: 'none'},
  brand: {display: 'flex', alignItems: 'center', flexDirection: 'column', flexShrink: 0, gap: 8, width: 76, minHeight: 96, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 14, backgroundColor: 'transparent', cursor: 'pointer'},
  brandLogo: {width: 65, height: 66, objectFit: 'contain'},
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
