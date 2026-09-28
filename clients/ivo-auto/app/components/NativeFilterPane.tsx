'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState} from 'react';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Search} from 'lucide-react';
import VerticalRange from '@/components/VerticalRange';
import {vehicles} from '@/lib/data';
import {bodyTypes, budgetOptions, categoryOptions, emiOptions, featureOptions, filterMakes, mileageOptions, toggleFilter, yearOptions, type Filters, type FilterTab} from '@/lib/inventory-filters';
import {tokens as $} from '@/app/tokens.stylex';

function CheckRow({label, checked, onChange, radio, large = false, multiline = false}: {label: string; checked: boolean; onChange: () => void; radio?: string; large?: boolean; multiline?: boolean}) {
  const tx = useCopy();

  return <label {...stylex.props(s.option, large && s.optionLarge, multiline && s.optionMultiline)}><input type={radio ? 'radio' : 'checkbox'} className={radio ? 'cars24-filter-radio' : 'cars24-filter-checkbox'} name={radio} checked={checked} onChange={onChange} /><span>{tx(label)}</span></label>;
}
function BrandGroup({make, filters, update}: {make: string; filters: Filters; update: (next: Filters) => void}) {
  const tx = useCopy();

  const [expanded, setExpanded] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const selected = filters.brands.includes(make);
  const partial = filters.models.some(model => model.startsWith(`${make}::`));
  const models = [...new Set(vehicles.filter(vehicle => vehicle.make === make).map(vehicle => vehicle.model))];
  useEffect(() => {if (checkbox.current) checkbox.current.indeterminate = !selected && partial;}, [selected, partial]);
  function toggleBrand() {update({...filters, brands: toggleFilter(filters.brands, make), models: filters.models.filter(model => !model.startsWith(`${make}::`))});}
  function toggleModel(model: string) {
    const previous = selected ? [...filters.models, ...models.map(value => `${make}::${value}`)] : filters.models;
    update({...filters, brands: filters.brands.filter(value => value !== make), models: toggleFilter(previous, `${make}::${model}`)});
  }
  return <div>
    <div {...stylex.props(s.brandRow)}><label {...stylex.props(s.brandLabel)}><input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" checked={selected} onChange={toggleBrand} /><span>{tx(make === 'Mercedes-Benz' ? 'MERCEDES BENZ' : make.toUpperCase())}</span></label><button type="button" aria-label={tx(`Show ${make} models`)} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} {...stylex.props(s.expand)}><ChevronDown size={17} strokeWidth={2.2} {...stylex.props(expanded && s.rotate)} /></button></div>
    {expanded ? <div {...stylex.props(s.models)}>{models.map(model => <CheckRow key={model} label={tx(model.toUpperCase())} checked={selected || filters.models.includes(`${make}::${model}`)} onChange={() => toggleModel(model)} />)}{!models.length ? <p {...stylex.props(s.emptyModels)}>{tx("No models from this brand are included in the captured local catalog.")}</p> : null}</div> : null}
  </div>;
}
export default function NativeFilterPane({active, filters, update}: {active: FilterTab; filters: Filters; update: (next: Filters) => void}) {
  const tx = useCopy();

  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {root.current?.parentElement?.scrollTo({top: 0, behavior: 'instant'});}, [active]);
  function extra(key: string, value: string, radio = false) {update({...filters, extra: {...filters.extra, [key]: radio ? [value] : toggleFilter(filters.extra[key] ?? [], value)}});}
  const selected = filters.extra[active] ?? [];
  let content;
  if (active === 'BRAND') content = <>
    <label {...stylex.props(s.search)}><Search size={18} strokeWidth={1.8} /><input type="search" placeholder={tx("Search")} aria-label={tx("Search brands")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(s.searchInput)} /></label>
    <h3 {...stylex.props(s.brandTitle)}>{tx("All Brands")}</h3>
    {filterMakes.filter(make => make.toLowerCase().includes(query.toLowerCase())).map(make => <BrandGroup key={make} make={make} filters={filters} update={update} />)}
  </>;
  else if (active === 'BUDGET') content = <>
    <Link href="/finance" {...stylex.props(s.loan)}><img src={assetPath("/reference-assets/loan-card.png")} alt={tx("")} width={30} height={28} /><span>{tx("Check your car loan eligibility")}</span></Link>
    <h3 {...stylex.props(s.suggestions)}>{tx("Suggestions")}</h3>{budgetOptions.map(value => <CheckRow key={value} label={tx(value)} checked={filters.budget.includes(value)} onChange={() => update({...filters, budget: toggleFilter(filters.budget, value)})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set price")}</h3><VerticalRange label={tx("price")} minimum={8000} maximum={950000} low={filters.minimum} high={filters.maximum} step={1000} prefix={currency.code + ' '} onChange={(minimum, maximum) => update({...filters, minimum, maximum})} />
  </>;
  else if (active === 'DISCOUNTS') content = <CheckRow label={tx("On Discount")} checked={selected.includes('On Discount')} onChange={() => extra(active, 'On Discount')} />;
  else if (active === 'DOWN PAYMENT') content = <CheckRow label={tx("Show only Zero down payment cars")} checked={selected.length > 0} multiline onChange={() => extra(active, 'Show only Zero down payment cars')} />;
  else if (active === 'EMI') content = <>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{emiOptions.map(value => <CheckRow key={value} label={tx(value)} radio="emi" checked={selected.includes(value)} onChange={() => update({...filters, emiLimit: null, extra: {...filters.extra, EMI: [value]}})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set max EMI")}</h3><label {...stylex.props(s.emiInput)}><span>{tx(currency.code)}</span><input type="number" inputMode="numeric" min={0} max={100000} aria-label={tx("Maximum EMI")} value={filters.emiLimit ?? ''} onChange={event => update({...filters, emiLimit: event.target.value === '' ? null : Math.max(0, Math.min(100000, Number(event.target.value))), extra: {...filters.extra, EMI: []}})} {...stylex.props(s.emiNumber)} /></label>
  </>;
  else if (active === 'YEAR') content = <>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: 2026})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set year")}</h3><VerticalRange label={tx("year")} minimum={2003} maximum={2026} low={filters.yearMinimum} high={filters.yearMaximum} maxLabel="Max Year" minLabel="Min Year" onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})} />
  </>;
  else if (active === 'MILEAGE') content = <>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{mileageOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mileage" checked={filters.mileage === value} onChange={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: Number(value.replace(/\D/g, ''))})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set range")}</h3><VerticalRange label={tx("mileage")} minimum={0} maximum={530000} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} maxLabel="Max Kms" minLabel="Min Kms" suffix=" km" onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})} />
  </>;
  else if (active === 'BODY TYPE') content = <div {...stylex.props(s.bodies)}>{bodyTypes.map((body, index) => <button type="button" key={body} aria-pressed={filters.bodies.includes(body)} onClick={() => update({...filters, bodies: toggleFilter(filters.bodies, body)})} {...stylex.props(s.body, filters.bodies.includes(body) && s.bodyActive)}><img src={assetPath(`/reference-assets/continuation/filter-body-${index}.png`)} width={82} height={43} alt={tx("")} {...stylex.props(s.bodyImage)} /><span>{tx(body)}</span></button>)}</div>;
  else if (active === 'CAR TYPE') content = <div {...stylex.props(s.types)}>{[
    ['Prime', 'Everyday cars from our showroom.'], ['Luxe', 'Explore our premium selection.'], ['Lite', 'Explore more affordable options.'],
  ].map(([label, copy]) => <label key={label} {...stylex.props(s.type)}><input type="checkbox" className="cars24-filter-checkbox" checked={selected.includes(label)} onChange={() => extra(active, label)} /><span><strong>{tx(label === 'Luxe' ? 'Select' : label === 'Prime' ? 'Everyday' : 'Value')}</strong><span {...stylex.props(s.typeCopy)}>{tx(copy)}</span></span></label>)}</div>;
  else if (active === 'FUEL TYPE') content = <>{['Petrol', 'Hybrid', 'Electric', 'Diesel'].map(value => <CheckRow key={value} label={tx(value)} checked={filters.fuel.includes(value)} onChange={() => update({...filters, fuel: toggleFilter(filters.fuel, value)})} large />)}</>;
  else if (active === 'CATEGORIES') content = <>{categoryOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} onChange={() => extra(active, value)} large />)}</>;
  else if (active === 'FEATURES') content = <>{featureOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} onChange={() => extra(active, value)} large />)}</>;
  else content = <>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Engine Size (Litres)")}</h3><VerticalRange label={tx("engine size")} minimum={0} maximum={7} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})} /><p {...stylex.props(s.engineHint)}>{tx("Minimum size of Engine is 0L and Maximum size is 7L.")}</p>
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Number Of Cylinders")}</h3><VerticalRange label={tx("cylinders")} minimum={0} maximum={12} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})} />
  </>;
  return <div ref={root} {...stylex.props(s.pane)}>{tx(content)}</div>;
}
const s = stylex.create({
  pane: {color: '#535353', fontFamily: $.fontDisplay},
  firstTitle: {marginTop: 8, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  search: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, marginTop: 8, paddingInline: 16, color: '#535353', borderColor: '#c6c6c6', borderStyle: 'solid', borderWidth: 1, borderRadius: 5},
  searchInput: {width: '100%', minWidth: 0, padding: 0, color: '#7f7f7f', fontSize: 16, fontWeight: 400, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  brandTitle: {marginTop: 26, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  brandRow: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 44px', minHeight: 44, borderBottomColor: '#ebebeb', borderBottomStyle: 'solid', borderBottomWidth: 1},
  brandLabel: {display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, color: '#535353', fontSize: 15, lineHeight: '23px', cursor: 'pointer'},
  expand: {display: 'grid', placeItems: 'center', width: 44, minHeight: 44, padding: 0, color: $.ink, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  rotate: {transform: 'rotate(180deg)'},
  models: {paddingLeft: 26, borderBottomColor: '#ebebeb', borderBottomStyle: 'solid', borderBottomWidth: 1},
  emptyModels: {paddingBlock: 12, color: '#727272', fontSize: 12, lineHeight: '18px'},
  option: {display: 'flex', alignItems: 'center', gap: 9, minHeight: 38, color: '#535353', fontSize: 13, fontWeight: 400, lineHeight: '23px', cursor: 'pointer'},
  optionLarge: {minHeight: 49, fontSize: 15, lineHeight: '26px'},
  optionMultiline: {alignItems: 'flex-start', minHeight: 65, paddingTop: 12, fontSize: 15, lineHeight: '25px'},
  loan: {display: 'flex', alignItems: 'center', gap: 8, minHeight: 51, paddingInline: 11, color: '#101010', fontSize: 12, lineHeight: '17px', borderColor: '#e7e7e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: '#f8f8f8'},
  suggestions: {marginTop: 18, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  rangeTitle: {marginTop: 26, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  emiInput: {display: 'flex', alignItems: 'center', gap: 8, width: 164, height: 51, marginTop: 18, paddingLeft: 14, color: '#5f5f5f', fontSize: 15, borderColor: '#c4c4c4', borderStyle: 'solid', borderWidth: 1, borderRadius: 4},
  emiNumber: {width: '100%', minWidth: 0, height: 43, marginLeft: 5, paddingLeft: 10, color: '#535353', fontSize: 15, borderWidth: 0, borderLeftColor: '#c5c5c5', borderLeftStyle: 'solid', borderLeftWidth: 1, outlineStyle: 'none', backgroundColor: 'transparent'},
  bodies: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '12px 20px', marginTop: 8, marginLeft: -4, marginRight: -4},
  body: {display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', gap: 4, minHeight: 91, padding: '8px 6px', color: '#202024', fontSize: 13, fontWeight: 500, lineHeight: '17px', textAlign: 'center', borderColor: '#c6c6c6', borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff', cursor: 'pointer'},
  bodyActive: {color: $.violet, borderColor: $.violet, backgroundColor: $.violetSoft},
  bodyImage: {width: 82, maxWidth: '100%', height: 43, objectFit: 'contain'},
  types: {paddingInline: 2},
  type: {display: 'grid', gridTemplateColumns: '19px minmax(0,1fr)', alignItems: 'start', gap: 9, padding: '18px 6px 22px', borderBottomColor: '#d6d6d6', borderBottomStyle: 'solid', borderBottomWidth: 1, cursor: 'pointer'},
  typeCopy: {display: 'block', marginTop: 9, color: '#202024', fontSize: 12, fontWeight: 400, lineHeight: '18px'},
  engineHint: {marginTop: 6, color: '#9b9b9b', fontSize: 12, fontWeight: 500, lineHeight: '18px'},
});
