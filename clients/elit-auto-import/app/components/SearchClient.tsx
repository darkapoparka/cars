'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent} from 'react';
import Link from '@/components/AppLink';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {ArrowUpLeft, ChevronRight, Search, X} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, vehicles} from '@/lib/data';
import { tokens as $} from '@/app/tokens.stylex';

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
        {label: `${matchingMake} SUV cars`, brand: matchingMake, body: 'SUV'},
        {label: `${matchingMake} Sedan cars`, brand: matchingMake, body: 'Sedan'},
        ...models.slice(0, 5).map(model => ({label: `${matchingMake} ${model}`, query: `${matchingMake} ${model}`}))];
    }
    return [...new Map(vehicles.filter(vehicle => `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(value)).map(vehicle => [`${vehicle.make} ${vehicle.model}`, {label: `${vehicle.make} ${vehicle.model}`, query: `${vehicle.make} ${vehicle.model}`}])).values()].slice(0, 8);
  }, [query]);
  useEffect(() => {input.current?.focus({preventScroll: true});}, []);
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
  return <><PageHeader title={tx("Search cars")} backHref="/cars" backLabel={tx("Back to cars")}/><main {...stylex.props(s.page)}>
    <form role="search" onSubmit={submit} {...stylex.props(s.searchBox)}>
      <Search size={20}/>
      <input ref={input} type="search" role="combobox" aria-label={tx("Search by brand or model")} aria-autocomplete="list" aria-expanded={query.length > 0 && suggestions.length > 0} aria-controls="search-suggestions" aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined} placeholder={tx("Search by Brand or Model...")} autoComplete="off" value={query} onChange={event => {setQuery(event.target.value); setActive(-1);}} onKeyDown={keydown} {...stylex.props(s.input)} />
      {query ? <button type="button" aria-label={tx("Clear search")} onClick={() => {setQuery(''); setActive(-1); input.current?.focus();}} {...stylex.props(s.clear)}><X size={18} /></button> : null}
    </form>
    {query.trim() ? <div id="search-suggestions" role="listbox" aria-label={tx("Search suggestions")} {...stylex.props(s.suggestions)}>
      {suggestions.map((suggestion, index) => <button type="button" id={`suggestion-${index}`} key={suggestion.label} role="option" aria-selected={index === active} onClick={() => choose(suggestion)} {...stylex.props(s.suggestion, index === active && s.active)}>
        <Search size={15} strokeWidth={1.8} /><span><strong>{tx(suggestion.label.split(' ')[0].toUpperCase())}</strong>{tx(suggestion.label.includes(' ') ? ` ${suggestion.label.split(' ').slice(1).join(' ').toUpperCase()}` : '')}</span><ArrowUpLeft size={19} strokeWidth={1.6} />
      </button>)}
      {!suggestions.length ? <button type="button" onClick={() => choose()} {...stylex.props(s.suggestion)}><Search size={16} /><span>{tx("Search for “")}{tx(query)}{tx("”")}</span><ChevronRight size={18} /></button> : null}
    </div> : <>
      <Link href="/finance" {...stylex.props(s.loan)}><img src={assetPath("/reference-assets/loan-card.png")} width={30} height={28} alt={tx("")} /><span>{tx("Check your car loan eligibility")}</span><u>{tx("Check Now")}</u><ChevronRight size={12} /></Link>
      <section {...stylex.props(s.popular)}><h1 {...stylex.props(s.title)}>{tx("Popular Brands")}</h1><div {...stylex.props(s.brands)}>{popular.map((brand, index) => <button type="button" key={brand} onClick={() => choose({label: brand, brand})} aria-label={tx(`Search ${brand}`)} {...stylex.props(s.brand)}><img src={assetPath(`/reference-assets/continuation/search-circle-${index}.png`)} width={65} height={66} alt={tx(brand)} {...stylex.props(s.brandLogo)} /></button>)}</div></section>
      {recent.length ? <section {...stylex.props(s.recent)}><h2 {...stylex.props(s.title)}>{tx("Recently viewed cars")}</h2><div {...stylex.props(s.recentRail)}>{recent.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div></section> : null}
    </>}
  </main></>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', maxWidth: 720, marginInline: 'auto', paddingTop: 0, paddingInline: 12, paddingBottom: 45, color: '#202024', fontFamily: $.fontSans, backgroundColor: '#fff'},
  searchBox: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 53, paddingInline: 13, borderColor: '#e4e4e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 9},
  input: {width: '100%', minWidth: 0, padding: 0, color: '#202024', fontSize: 13, fontWeight: 400, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  clear: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 23, height: 40, padding: 0, color: '#202024', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  loan: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 51, marginTop: 9, paddingInline: 14, color: '#080808', fontSize: 11, borderColor: '#e8e8e8', borderStyle: 'solid', borderWidth: 1, borderRadius: 7, backgroundColor: '#f9f9f9'},
  popular: {marginTop: 20},
  title: {fontSize: 16, fontWeight: 600, lineHeight: '23px'},
  brands: {display: 'flex', gap: 15, overflowX: 'auto', marginTop: 17, marginRight: -22, paddingRight: 22, scrollbarWidth: 'none'},
  brand: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 65, height: 66, padding: 0, borderWidth: 0, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer'},
  brandLogo: {width: 65, height: 66, objectFit: 'contain'},
  recent: {marginTop: 17},
  recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingLeft: 6, paddingBottom: 8, scrollbarWidth: 'none', fontFamily: $.fontSans},
  suggestions: {marginTop: 6},
  suggestion: {display: 'grid', gridTemplateColumns: '18px minmax(0,1fr) 20px', alignItems: 'center', gap: 20, width: '100%', minHeight: 42, padding: 0, color: '#202024', fontSize: 15, fontWeight: 400, textAlign: 'left', borderWidth: 0, backgroundColor: '#fff', cursor: 'pointer'},
  active: {backgroundColor: '#f4f4f4'},
});
