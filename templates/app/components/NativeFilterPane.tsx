'use client';
import {assetPath} from '@/lib/paths';
import {useCopy, useLocale} from '@/lib/locale';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Search, X} from 'lucide-react';
import VerticalRange from '@/components/VerticalRange';
import HorizontalRange from '@/components/HorizontalRange';
import CompactRange from '@/components/CompactRange';
import {BrandEmblem} from '@/components/ReferenceUI';
import {vehicles} from '@/lib/data';
import {bodyTypes, budgetOptions, categoryOptions, emiOptions, featureOptions, filterMakes, mileageOptions, toggleFilter, yearOptions, type Filters, type FilterTab} from '@/lib/inventory-filters';
import {media, tokens as $} from '@/app/tokens.stylex';
import {searchField} from '@/components/search-field.stylex';

const modelChoices = [...new Map(vehicles.map(vehicle => [`${vehicle.make}::${vehicle.model}`.toLowerCase(), {make: vehicle.make, model: vehicle.model}])).values()]
  .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));
const modelKey = (make: string, model: string) => `${make}::${model}`;
const hasModel = (models: string[], value: string) => models.some(model => model.toLowerCase() === value.toLowerCase());
const toggleModelSelection = (models: string[], value: string) => hasModel(models, value) ? models.filter(model => model.toLowerCase() !== value.toLowerCase()) : [...models, value];

function CheckRow({label, checked, onChange, radio, large = false, multiline = false}: {label: ReactNode; checked: boolean; onChange: () => void; radio?: string; large?: boolean; multiline?: boolean}) {
  const tx = useCopy();

  return <label {...stylex.props(s.option, large && s.optionLarge, multiline && s.optionMultiline)}><input type={radio ? 'radio' : 'checkbox'} className={radio ? 'cars24-filter-radio' : 'cars24-filter-checkbox'} name={radio} checked={checked} onChange={onChange} /><span>{tx(label)}</span></label>;
}
function BrandGroup({make, filters, update}: {make: string; filters: Filters; update: (next: Filters) => void}) {
  const tx = useCopy();

  const [expanded, setExpanded] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const selected = filters.brands.includes(make);
  const partial = filters.models.some(model => model.startsWith(`${make}::`));
  const models = modelChoices.filter(choice => choice.make === make).map(choice => choice.model);
  const stockCount = vehicles.filter(vehicle => vehicle.make === make).length;
  useEffect(() => {if (checkbox.current) checkbox.current.indeterminate = !selected && partial;}, [selected, partial]);
  function toggleBrand() {update({...filters, brands: toggleFilter(filters.brands, make), models: filters.models.filter(model => !model.startsWith(`${make}::`))});}
  function toggleBrandModel(model: string) {
    const previous = selected ? [...filters.models, ...models.map(value => modelKey(make, value))] : filters.models;
    update({...filters, brands: filters.brands.filter(value => value !== make), models: toggleModelSelection(previous, modelKey(make, model))});
  }
  return <div {...stylex.props(s.brandGroup, (selected || partial) && s.brandGroupSelected, !stockCount && !selected && !partial && s.unstockedBrand)}>
    <div {...stylex.props(s.brandRow)}><label {...stylex.props(s.brandLabel)}><input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" checked={selected} onChange={toggleBrand} /><span {...stylex.props(s.desktopBrandLogo)}><BrandEmblem make={make}/></span><span>{tx(make === 'Mercedes-Benz' ? 'Mercedes Benz' : make)}</span><span aria-hidden="true" {...stylex.props(s.stockCount)}>{stockCount}</span></label><button type="button" aria-label={tx(`Show ${make} models`)} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} {...stylex.props(s.expand)}><ChevronDown size={17} strokeWidth={1.8} {...stylex.props(expanded && s.rotate)} /></button></div>
    {expanded ? <div {...stylex.props(s.models)}>{models.map(model => <CheckRow key={model} label={tx(model)} checked={selected || hasModel(filters.models, modelKey(make, model))} onChange={() => toggleBrandModel(model)} />)}{!models.length ? <p {...stylex.props(s.emptyModels)}>{tx("No models from this brand are included in the captured local catalog.")}</p> : null}</div> : null}
  </div>;
}
export default function NativeFilterPane({active, filters, update, modelMakes}: {active: FilterTab; filters: Filters; update: (next: Filters) => void; modelMakes?: readonly string[]}) {
  const locale = useLocale();
  const mobileMoney = (value: number) => `${currency.symbol}${new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {useGrouping: true}).format(value)}`;
  const tx = useCopy();

  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {(root.current?.closest<HTMLElement>('[data-filter-scroll-pane]') ?? root.current?.parentElement)?.scrollTo({top: 0, behavior: 'instant'});}, [active]);
  function extra(key: string, value: string, radio = false) {update({...filters, extra: {...filters.extra, [key]: radio ? [value] : toggleFilter(filters.extra[key] ?? [], value)}});}
  const selected = filters.extra[active] ?? [];
  const availableModels = modelMakes?.length ? modelChoices.filter(choice => modelMakes.includes(choice.make)) : modelChoices;
  const matchingModels = availableModels.filter(({make, model}) => `${make} ${model}`.toLowerCase().includes(query.trim().toLowerCase()));
  function toggleModel(make: string, model: string) {update({...filters, brands: filters.brands.filter(brand => brand !== make), models: toggleModelSelection(filters.models, modelKey(make, model))});}
  let content;
  if (active === 'BRAND') content = <>
    <div data-search-field {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={tx("Search brand")} aria-label={tx("Search brands")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)} /></div>
    <h3 {...stylex.props(s.brandTitle)}>{tx("All Brands")}</h3>
    <div {...stylex.props(s.brandGrid)}>{filterMakes.filter(make => make.toLowerCase().includes(query.toLowerCase())).map(make => <BrandGroup key={make} make={make} filters={filters} update={update} />)}</div>
    {filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase())) && !filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase()) && (vehicles.some(vehicle => vehicle.make === make) || filters.brands.includes(make) || filters.models.some(model => model.startsWith(`${make}::`)))) ? <p role="status" {...stylex.props(s.desktopOnly, s.emptyModels)}>{tx('No brands found')}</p> : null}
    {!filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase())) ? <p role="status" {...stylex.props(s.emptyModels)}>{tx('No brands found')}</p> : null}
  </>;
  else if (active === 'MODEL') content = <>
    <div data-search-field {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={tx("Search models")} aria-label={tx("Search models")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)} /></div>
    <div {...stylex.props(s.phoneTabletContents)}>{matchingModels.map(({make, model}) => {
      const value = modelKey(make, model);
      return <CheckRow key={value} label={`${make} ${model}`} checked={hasModel(filters.models, value)} large onChange={() => toggleModel(make, model)} />;
    })}</div>
    <div {...stylex.props(s.desktopOnly, s.modelGroups)}>{[...new Set(matchingModels.map(choice => choice.make))].map(make => <section key={make} {...stylex.props(s.modelGroup)}><h3 {...stylex.props(s.modelMake)}><span {...stylex.props(s.desktopBrandLogo)}><BrandEmblem make={make}/></span>{make}</h3><div {...stylex.props(s.modelOptions)}>{matchingModels.filter(choice => choice.make === make).map(({model}) => <CheckRow key={model} label={model} checked={hasModel(filters.models, modelKey(make, model))} onChange={() => toggleModel(make, model)}/>)}</div></section>)}</div>
    {!availableModels.some(({make, model}) => `${make} ${model}`.toLowerCase().includes(query.trim().toLowerCase())) ? <p role="status" {...stylex.props(s.emptyModels)}>{tx('No models found')}</p> : null}
  </>;
  else if (active === 'BUDGET') content = <>
    <Link href="/finance" {...stylex.props(s.loan)}><img src={assetPath("/reference-assets/loan-card.png")} alt={tx("")} width={30} height={28} /><span>{tx("Finance help")}</span></Link>
    <div {...stylex.props(s.phoneOnly)}>
      {filters.budget.length ? <div role="group" aria-label={tx('Applied')} {...stylex.props(s.mobileLegacy)}>{budgetOptions.filter(option => filters.budget.includes(option.value)).map(option => {const label = `${tx(option.relation)} ${mobileMoney(Number(option.amount.replace(/\D/g, '')) * 1000)}`; return <button type="button" key={option.value} aria-label={`${tx('Clear')}: ${label}`} onClick={() => update({...filters, budget: toggleFilter(filters.budget, option.value)})} {...stylex.props(s.mobilePreset, s.mobilePresetSelected)}>{label}<X size={14} aria-hidden="true"/></button>;})}</div> : null}
      <h3 {...stylex.props(s.mobileRangeTitle)}>{tx('Set price')}</h3><CompactRange label={tx('price')} minimum={8000} maximum={950000} low={filters.minimum} high={filters.maximum} step={1000} prefix={`${currency.symbol} `} onChange={(minimum, maximum) => update({...filters, budget: [], minimum, maximum})}/>
      <h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div role="group" aria-label={tx('Suggestions')} {...stylex.props(s.mobilePresets)}>{[30000, 50000, 80000].map(maximum => <button type="button" key={maximum} aria-pressed={filters.minimum === 8000 && filters.maximum === maximum && filters.budget.length === 0} onClick={() => update({...filters, budget: [], minimum: 8000, maximum: filters.minimum === 8000 && filters.maximum === maximum && filters.budget.length === 0 ? 950000 : maximum})} {...stylex.props(s.mobilePreset, filters.minimum === 8000 && filters.maximum === maximum && filters.budget.length === 0 && s.mobilePresetSelected)}>{tx('Up to')} {mobileMoney(maximum)}</button>)}</div>
    </div>
    <div {...stylex.props(s.desktopOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set price')}</h3><CompactRange label={tx('price')} minimum={8000} maximum={950000} low={filters.minimum} high={filters.maximum} step={1000} prefix={`${currency.symbol} `} onChange={(minimum, maximum) => update({...filters, budget: [], minimum, maximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.modelOptions)}>{budgetOptions.map(option => <CheckRow key={option.value} label={`${tx(option.relation)} ${mobileMoney(Number(option.amount.replace(/\D/g, '')) * 1000)}`} checked={filters.budget.includes(option.value)} onChange={() => update({...filters, budget: toggleFilter(filters.budget, option.value)})}/>)}</div></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.suggestions)}>{tx("Suggestions")}</h3>{budgetOptions.map(option => <CheckRow key={option.value} label={`${tx(option.relation)} ${option.amount}`} checked={filters.budget.includes(option.value)} onChange={() => update({...filters, budget: toggleFilter(filters.budget, option.value)})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set price")}</h3><VerticalRange label={tx("price")} minimum={8000} maximum={950000} low={filters.minimum} high={filters.maximum} step={1000} prefix={currency.code + ' '} onChange={(minimum, maximum) => update({...filters, minimum, maximum})} />
    </div>
  </>;
  else if (active === 'DISCOUNTS') content = <CheckRow label={tx("On Discount")} checked={selected.includes('On Discount')} onChange={() => extra(active, 'On Discount')} />;
  else if (active === 'DOWN PAYMENT') content = <CheckRow label={tx("Show only Zero down payment cars")} checked={selected.length > 0} multiline onChange={() => extra(active, 'Show only Zero down payment cars')} />;
  else if (active === 'EMI') content = <>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{emiOptions.map(option => <CheckRow key={option.value} label={<><span {...stylex.props(s.phoneOnly)}>{tx(option.relation)} {mobileMoney(Number(option.amount.replace(/\D/g, '')))}</span><span {...stylex.props(s.wideOnly)}>{tx(option.relation)} {option.amount}</span></>} radio="emi" checked={selected.includes(option.value)} onChange={() => update({...filters, emiLimit: null, extra: {...filters.extra, EMI: [option.value]}})} />)}
    <h3 {...stylex.props(s.rangeTitle)}><span {...stylex.props(s.phoneOnly)}>{tx('Monthly payment')}</span><span {...stylex.props(s.wideOnly)}>{tx("Set max EMI")}</span></h3><label {...stylex.props(s.emiInput)}><span {...stylex.props(s.phoneOnly)}>{currency.symbol}</span><span {...stylex.props(s.wideOnly)}>{tx(currency.code)}</span><input type="number" inputMode="numeric" min={0} max={100000} aria-label={tx("Maximum EMI")} value={filters.emiLimit ?? ''} onChange={event => update({...filters, emiLimit: event.target.value === '' ? null : Math.max(0, Math.min(100000, Number(event.target.value))), extra: {...filters.extra, EMI: []}})} {...stylex.props(s.emiNumber)} /></label>
  </>;
  else if (active === 'YEAR') content = <>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set year')}</h3><CompactRange label={tx('year')} minimum={2003} maximum={2026} low={filters.yearMinimum} high={filters.yearMaximum} grouping={false} onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.mobileOptions)}>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mobile-year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: 2026})}/>)}</div></div>
    <div {...stylex.props(s.desktopOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set year')}</h3><CompactRange label={tx('year')} minimum={2003} maximum={2026} low={filters.yearMinimum} high={filters.yearMaximum} grouping={false} onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.modelOptions)}>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="desktop-year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: 2026})}/>)}</div></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: 2026})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set year")}</h3><VerticalRange label={tx("year")} minimum={2003} maximum={2026} low={filters.yearMinimum} high={filters.yearMaximum} maxLabel="Max Year" minLabel="Min Year" onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})} />
    </div>
  </>;
  else if (active === 'MILEAGE') content = <>
    <HorizontalRange label={tx("mileage")} minimum={0} maximum={530000} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} suffix={` ${tx('km')}`} onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})}/>
    <div role="group" aria-label={tx('Suggestions')} {...stylex.props(s.desktopMileageChoices)}>{mileageOptions.map(value => {const maximum = Number(value.replace(/\D/g, '')); return <button type="button" key={value} aria-label={tx(value)} title={tx(value)} aria-pressed={filters.mileage === value} onClick={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: maximum})} {...stylex.props(s.mileagePreset, filters.mileage === value && s.mileagePresetSelected)}>≤ {new Intl.NumberFormat(currency.locale).format(maximum)} {tx('km')}</button>;})}</div>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set range')}</h3><CompactRange label={tx('mileage')} minimum={0} maximum={530000} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} suffix={` ${tx('km')}`} onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.mobileOptions)}>{mileageOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mobile-mileage" checked={filters.mileage === value} onChange={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: Number(value.replace(/\D/g, ''))})}/>)}</div></div>
    <div {...stylex.props(s.phoneTabletMileage)}><div {...stylex.props(s.wideOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{mileageOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mileage" checked={filters.mileage === value} onChange={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: Number(value.replace(/\D/g, ''))})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set range")}</h3><VerticalRange label={tx("mileage")} minimum={0} maximum={530000} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} maxLabel="Max Kms" minLabel="Min Kms" suffix=" km" onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})} /></div></div>
  </>;
  else if (active === 'BODY TYPE') content = <div {...stylex.props(s.bodies)}>{bodyTypes.map((body, index) => <button type="button" key={body} aria-pressed={filters.bodies.includes(body)} onClick={() => update({...filters, bodies: toggleFilter(filters.bodies, body)})} {...stylex.props(s.body, filters.bodies.includes(body) && s.bodyActive)}><img src={assetPath(`/reference-assets/continuation/filter-body-${index}.png`)} width={82} height={43} alt={tx("")} {...stylex.props(s.bodyImage)} /><span>{tx(body)}</span></button>)}</div>;
  else if (active === 'CAR TYPE') content = <div {...stylex.props(s.types)}>{[
    ['Prime', 'Everyday cars from our showroom.'], ['Luxe', 'Explore our premium selection.'], ['Lite', 'Explore more affordable options.'],
  ].map(([label, copy]) => <label key={label} {...stylex.props(s.type)}><input type="checkbox" className="cars24-filter-checkbox" checked={selected.includes(label)} onChange={() => extra(active, label)} /><span><strong>{tx(label === 'Luxe' ? 'Select' : label === 'Prime' ? 'Everyday' : 'Value')}</strong><span {...stylex.props(s.typeCopy)}>{tx(copy)}</span></span></label>)}</div>;
  else if (active === 'FUEL TYPE') content = <>{['Petrol', 'Hybrid', 'Electric', 'Diesel'].map(value => <CheckRow key={value} label={tx(value)} checked={filters.fuel.includes(value)} onChange={() => update({...filters, fuel: toggleFilter(filters.fuel, value)})} large />)}</>;
  else if (active === 'TRANSMISSION') content = <>{['Automatic', 'Manual'].map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} onChange={() => extra(active, value)} large />)}</>;
  else if (active === 'CATEGORIES') content = <>{categoryOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} onChange={() => extra(active, value)} large />)}</>;
  else if (active === 'FEATURES') content = <>{featureOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} onChange={() => extra(active, value)} large />)}</>;
  else content = <>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Engine Size (Litres)')}</h3><CompactRange label={tx('engine size')} minimum={0} maximum={7} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})}/><p {...stylex.props(s.engineHint)}>{tx('Engine range: 0–7 litres.')}</p><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Number Of Cylinders')}</h3><CompactRange label={tx('cylinders')} minimum={0} maximum={12} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})}/></div>
    <div {...stylex.props(s.desktopOnly, s.desktopEngineRanges)}><section><h3 {...stylex.props(s.firstTitle)}>{tx('Engine Size (Litres)')}</h3><CompactRange label={tx('engine size')} minimum={0} maximum={7} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})}/><p {...stylex.props(s.engineHint)}>{tx('Engine range: 0–7 litres.')}</p></section><section><h3 {...stylex.props(s.firstTitle)}>{tx('Number Of Cylinders')}</h3><CompactRange label={tx('cylinders')} minimum={0} maximum={12} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})}/></section></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Engine Size (Litres)")}</h3><VerticalRange label={tx("engine size")} minimum={0} maximum={7} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})} /><p {...stylex.props(s.engineHint)}>{tx("Minimum size of Engine is 0L and Maximum size is 7L.")}</p>
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Number Of Cylinders")}</h3><VerticalRange label={tx("cylinders")} minimum={0} maximum={12} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})} />
    </div>
  </>;
  return <div ref={root} {...stylex.props(s.pane)}>{tx(content)}</div>;
}
const s = stylex.create({
  desktopOnly: {display: {[media.desktop]: 'block', default: 'none'}},
  tabletOnly: {display: {[media.tablet]: 'contents', default: 'none'}},
  phoneTabletContents: {display: {[media.desktop]: 'none', default: 'contents'}},
  brandGrid: {display: {[media.desktop]: 'grid', default: 'contents'}, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', alignItems: 'start', gap: 8},
  brandGroup: {minWidth: 0, padding: {[media.desktop]: '6px 8px', default: 0}, borderWidth: {[media.desktop]: 1, default: 0}, borderStyle: 'solid', borderColor: $.line, borderRadius: {[media.desktop]: 12, default: 0}, backgroundColor: {[media.desktop]: {default: '#fff', ':hover': $.surfaceAlt}, default: 'transparent'}},
  brandGroupSelected: {borderColor: {[media.desktop]: $.controlBorder, default: null}, backgroundColor: {[media.desktop]: $.surfaceAlt, default: null}},
  unstockedBrand: {display: {[media.desktop]: 'none', default: 'block'}},
  desktopBrandLogo: {display: {[media.desktop]: 'block', default: 'none'}, flexShrink: 0, width: 36, height: 36},
  stockCount: {display: {[media.desktop]: 'inline', default: 'none'}, marginLeft: 'auto', color: $.muted, fontSize: 12},
  modelGroups: {display: {[media.desktop]: 'grid', default: 'none'}, gap: 16, marginTop: 20},
  modelGroup: {padding: 12, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12},
  modelMake: {display: 'flex', alignItems: 'center', gap: 10, color: $.ink, fontSize: 15, fontWeight: 500},
  modelOptions: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 16},
  desktopEngineRanges: {display: {[media.desktop]: 'grid', default: 'none'}, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 24},
  phoneOnly: {display: {[media.mobile]: 'block', default: 'none'}},
  wideOnly: {display: {[media.mobile]: 'none', default: 'contents'}},
  mobileRangeTitle: {marginTop: 18, color: $.ink, fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  mobileSuggestions: {marginTop: 18, marginBottom: 8, color: $.ink, fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  mobilePresets: {display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6},
  mobileLegacy: {display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16},
  mobilePreset: {minWidth: 0, minHeight: 44, paddingInline: 4, color: $.ink, fontFamily: $.fontSans, fontSize: 12, fontWeight: 400, whiteSpace: 'nowrap', borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  mobilePresetSelected: {color: '#fff', backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  mobileOptions: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 12},
  pane: {color: '#535353', fontFamily: $.fontSans},
  firstTitle: {marginTop: 8, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  brandTitle: {marginTop: 26, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  brandRow: {display: 'grid', gridTemplateColumns: {[media.desktop]: 'minmax(0,1fr) 32px', default: 'minmax(0,1fr) 44px'}, minHeight: 44,},
  brandLabel: {display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, color: '#535353', fontSize: 15, lineHeight: '23px', cursor: 'pointer'},
  expand: {display: 'grid', placeItems: 'center', width: {[media.desktop]: 32, default: 44}, minHeight: 44, padding: 0, color: $.ink, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  rotate: {transform: 'rotate(180deg)'},
  models: {paddingLeft: 26,},
  emptyModels: {paddingBlock: 12, color: '#727272', fontSize: 12, lineHeight: '18px'},
  option: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, color: '#535353', fontSize: 14, fontWeight: 400, lineHeight: '22px', cursor: 'pointer'},
  optionLarge: {minHeight: 49, fontSize: 15, lineHeight: '26px'},
  optionMultiline: {alignItems: 'flex-start', minHeight: 65, paddingTop: 12, fontSize: 15, lineHeight: '25px'},
  loan: {display: 'flex', alignItems: 'center', gap: 8, minHeight: 51, paddingInline: 11, color: '#101010', fontSize: 12, lineHeight: '17px', borderColor: '#e7e7e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 9, backgroundColor: '#f8f8f8'},
  suggestions: {marginTop: 18, marginBottom: 8, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  rangeTitle: {marginTop: 26, color: '#202024', fontSize: 14, fontWeight: 600, lineHeight: '21px'},
  desktopMileageChoices: {display: {[media.desktop]: 'grid', default: 'none'}, gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6, marginTop: 6},
  mileagePreset: {minWidth: 0, minHeight: 40, paddingInline: 4, color: $.ink, fontFamily: $.fontSans, fontSize: 12, whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 8, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer'},
  mileagePresetSelected: {color: '#fff', backgroundColor: {default: $.ink, ':hover': '#3b3b40'}},
  phoneTabletMileage: {display: {[media.desktop]: 'none', default: 'contents'}},
  emiInput: {display: 'flex', alignItems: 'center', gap: 8, width: 164, height: 51, marginTop: 18, paddingLeft: 14, color: '#5f5f5f', fontSize: 15, borderColor: '#c4c4c4', borderStyle: 'solid', borderWidth: 1, borderRadius: 4},
  emiNumber: {width: '100%', minWidth: 0, height: 43, marginLeft: 5, paddingLeft: 10, color: '#535353', fontSize: {[media.mobile]: 16, default: 15}, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  bodies: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '12px 20px', marginTop: 8, marginLeft: -4, marginRight: -4},
  body: {display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', gap: 4, minHeight: 91, padding: '8px 6px', color: '#202024', fontSize: 13, fontWeight: 500, lineHeight: '17px', textAlign: 'center', borderColor: '#c6c6c6', borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff', cursor: 'pointer'},
  bodyActive: {color: $.violet, borderColor: $.violet, backgroundColor: $.violetSoft},
  // Blend the captured white image canvas into the selected card.
  bodyImage: {width: 82, maxWidth: '100%', height: 43, objectFit: 'contain', mixBlendMode: 'multiply'},
  types: {paddingInline: 2},
  type: {display: 'grid', gridTemplateColumns: '19px minmax(0,1fr)', alignItems: 'start', gap: 9, padding: '18px 6px 22px', cursor: 'pointer'},
  typeCopy: {display: 'block', marginTop: 9, color: '#202024', fontSize: 12, fontWeight: 400, lineHeight: '18px'},
  engineHint: {marginTop: 6, color: $.muted, fontSize: 12, fontWeight: 400, lineHeight: '18px'},
});
