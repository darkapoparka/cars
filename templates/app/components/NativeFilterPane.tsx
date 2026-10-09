'use client';
import {inventoryBounds} from '@/lib/inventory-settings';
import {filterPaneStyles as s} from './filters/filter-pane.stylex';
import CheckRow from './filters/FilterCheckRow';
import BrandGroup from './filters/BrandFilterGroup';
import {modelChoices,modelKey,hasModel,toggleModelSelection} from '@/lib/inventory-options';
import {assetPath} from '@/lib/paths';
import {useCopy, useLocale} from '@/lib/locale';
import {useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import {currency} from '@/lib/currency';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {ChevronRight, Search, X} from 'lucide-react';
import VerticalRange from '@/components/VerticalRange';
import DesktopFilterRange from '@/components/DesktopFilterRange';
import CompactRange from '@/components/CompactRange';

import DesktopModelFamilies from '@/components/DesktopModelFamilies';
import {vehicles} from '@/lib/data';
import {bodyTypes, budgetOptions, categoryOptions, emiOptions, featureOptions, mileageOptions, toggleFilter, yearOptions, type Filters, type FilterTab} from '@/lib/inventory-filters';
import { filterMakes} from '@/lib/inventory-options';
import {searchField} from '@/components/search-field.stylex';
import {clearDesktopFilter} from '@/lib/desktop-filter-ui';


function DesktopRangeGroup({title, children, separated = false}: {title: string; children: ReactNode; separated?: boolean}) {
  return <section data-desktop-range-group {...stylex.props(s.desktopOnly, s.desktopRangeGroup, separated && s.desktopRangeGroupSeparated)}>
    <h3 {...stylex.props(s.firstTitle, s.desktopRangeGroupTitle)}>{title}</h3>
    {children}
  </section>;
}
export default function NativeFilterPane({active, filters, update, modelMakes, wide = false, countMatches}: {active: FilterTab; filters: Filters; update: (next: Filters) => void; modelMakes?: readonly string[]; wide?: boolean; countMatches?: (next: Filters) => number}) {
  const locale = useLocale();
  const mobileMoney = (value: number) => `${currency.symbol}${new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {useGrouping: true}).format(value)}`;
  const tx = useCopy();

  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const [rangeRevision, setRangeRevision] = useState(0);
  const defaults = {minimum: inventoryBounds.minimum, maximum: inventoryBounds.maximum};
  const facetBase = clearDesktopFilter(filters, active);
  const countExtra = (value: string) => countMatches?.({...facetBase, extra: {...facetBase.extra, [active]: [value]}});
  useLayoutEffect(() => {(root.current?.closest<HTMLElement>('[data-filter-scroll-pane]') ?? root.current?.parentElement)?.scrollTo({top: 0, behavior: 'instant'});}, [active]);
  function extra(key: string, value: string, radio = false) {update({...filters, extra: {...filters.extra, [key]: radio ? [value] : toggleFilter(filters.extra[key] ?? [], value)}});}
  const selected = filters.extra[active] ?? [];
  const availableModels = modelMakes?.length ? modelChoices.filter(choice => modelMakes.includes(choice.make)) : modelChoices;
  const matchingModels = availableModels.filter(({make, model}) => `${make} ${model}`.toLowerCase().includes(query.trim().toLowerCase()));
  function toggleModel(make: string, model: string) {update({...filters, brands: filters.brands.filter(brand => brand !== make), models: toggleModelSelection(filters.models, modelKey(make, model))});}
  let content;
  if (active === 'BRAND') content = <>
    <div data-search-field {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={tx("Search brand")} aria-label={tx("Search brands")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)} /></div>
    <h3 {...stylex.props(s.brandTitle)}>{tx("All Brands")}</h3>
    <div {...stylex.props(s.brandGrid, wide && s.wideBrandGrid)}>{filterMakes.filter(make => make.toLowerCase().includes(query.toLowerCase())).map(make => <BrandGroup key={make} make={make} filters={filters} update={update} countMatches={countMatches}/>)}</div>
    {filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase())) && !filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase()) && (vehicles.some(vehicle => vehicle.make.trim().toLowerCase() === make.trim().toLowerCase()) || filters.brands.includes(make) || filters.models.some(model => model.startsWith(`${make}::`)))) ? <p role="status" {...stylex.props(s.desktopOnly, s.emptyModels)}>{tx('No brands found')}</p> : null}
    {!filterMakes.some(make => make.toLowerCase().includes(query.toLowerCase())) ? <p role="status" {...stylex.props(s.emptyModels)}>{tx('No brands found')}</p> : null}
  </>;
  else if (active === 'MODEL') content = <>
    <div data-search-field {...stylex.props(searchField.field, s.desktopModelSearch)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input type="search" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={tx("Search models")} aria-label={tx("Search models")} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)} /></div>
    <div {...stylex.props(s.phoneTabletContents)}>{matchingModels.map(({make, model}) => {
      const value = modelKey(make, model);
      return <CheckRow key={value} label={`${make} ${model}`} checked={hasModel(filters.models, value)} large onChange={() => toggleModel(make, model)} />;
    })}</div>
    <DesktopModelFamilies filters={filters} update={update} query={query} makes={modelMakes ?? [...new Set([...filters.brands, ...filters.models.map(model => model.split('::')[0])])]} wide={wide}/>
    {!availableModels.some(({make, model}) => `${make} ${model}`.toLowerCase().includes(query.trim().toLowerCase())) ? <p role="status" {...stylex.props(s.emptyModels, s.phoneTabletOnly)}>{tx('No models found')}</p> : null}
  </>;
  else if (active === 'BUDGET') content = <>
    <Link href="/finance" {...stylex.props(s.loan, s.desktopHidden)}><img src={assetPath("/reference-assets/loan-card.png")} alt={tx("")} width={30} height={28} /><span>{tx("Finance help")}</span></Link>
    <div {...stylex.props(s.phoneOnly)}>
      {filters.budget.length ? <div role="group" aria-label={tx('Applied')} {...stylex.props(s.mobileLegacy)}>{budgetOptions.filter(option => filters.budget.includes(option.value)).map(option => {const label = `${tx(option.relation)} ${mobileMoney(Number(option.amount.replace(/\D/g, '')) * 1000)}`; return <button type="button" key={option.value} aria-label={`${tx('Clear')}: ${label}`} onClick={() => update({...filters, budget: toggleFilter(filters.budget, option.value)})} {...stylex.props(s.mobilePreset, s.mobilePresetSelected)}>{label}<X size={14} aria-hidden="true"/></button>;})}</div> : null}
      <h3 {...stylex.props(s.mobileRangeTitle)}>{tx('Set price')}</h3><CompactRange label={tx('price')} minimum={inventoryBounds.minimum} maximum={inventoryBounds.maximum} low={filters.minimum} high={filters.maximum} step={1000} prefix={`${currency.symbol} `} onChange={(minimum, maximum) => update({...filters, budget: [], minimum, maximum})}/>
      <h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div role="group" aria-label={tx('Suggestions')} {...stylex.props(s.mobilePresets)}>{[30000, 50000, 80000].map(maximum => <button type="button" key={maximum} aria-pressed={filters.minimum === inventoryBounds.minimum && filters.maximum === maximum && filters.budget.length === 0} onClick={() => update({...filters, budget: [], minimum: inventoryBounds.minimum, maximum: filters.minimum === inventoryBounds.minimum && filters.maximum === maximum && filters.budget.length === 0 ? inventoryBounds.maximum : maximum})} {...stylex.props(s.mobilePreset, filters.minimum === inventoryBounds.minimum && filters.maximum === maximum && filters.budget.length === 0 && s.mobilePresetSelected)}>{tx('Up to')} {mobileMoney(maximum)}</button>)}</div>
    </div>
    <div {...stylex.props(s.desktopOnly)}><DesktopFilterRange key={rangeRevision} label={tx('price')} minimum={defaults.minimum} maximum={defaults.maximum} low={filters.budget.length ? Math.min(...filters.budget.map(value => value.startsWith('Above') ? 100000 : defaults.minimum)) : filters.minimum} high={filters.budget.length ? Math.max(...filters.budget.map(value => value.startsWith('Above') ? defaults.maximum : Number(value.replace(/\D/g, '')) * 1000 - 1)) : filters.maximum} step={1000} prefix={currency.symbol} anyBounds showTrack={false} onChange={(minimum, maximum) => update({...filters, budget: [], minimum, maximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggested budgets')}</h3><div {...stylex.props(s.desktopPresets)}>{budgetOptions.map(option => {const above = option.value.startsWith('Above'); const amount = Number(option.amount.replace(/\D/g, '')) * 1000; const minimum = above ? amount : defaults.minimum; const maximum = above ? defaults.maximum : amount - 1; const checked = filters.budget.includes(option.value) || (!filters.budget.length && filters.minimum === minimum && filters.maximum === maximum); return <button type="button" key={option.value} aria-pressed={checked} onClick={() => {setRangeRevision(value => value + 1); update(checked ? clearDesktopFilter(filters, 'BUDGET') : {...filters, budget: [], minimum, maximum});}} {...stylex.props(s.desktopPreset, checked && s.desktopPresetSelected)}>{tx(option.relation)} {mobileMoney(amount)}</button>;})}</div><Link href="/finance" data-desktop-finance-card {...stylex.props(s.desktopFinanceCard)}><img src={assetPath('/reference-assets/loan-card.png')} alt="" width={30} height={28}/><span {...stylex.props(s.desktopFinanceLabel)}>{tx('Finance help')}</span><ChevronRight size={18} aria-hidden="true"/></Link></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.suggestions)}>{tx("Suggestions")}</h3>{budgetOptions.map(option => <CheckRow key={option.value} label={`${tx(option.relation)} ${option.amount}`} checked={filters.budget.includes(option.value)} onChange={() => update({...filters, budget: toggleFilter(filters.budget, option.value)})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set price")}</h3><VerticalRange label={tx("price")} minimum={inventoryBounds.minimum} maximum={inventoryBounds.maximum} low={filters.minimum} high={filters.maximum} step={1000} prefix={currency.code + ' '} onChange={(minimum, maximum) => update({...filters, minimum, maximum})} />
    </div>
  </>;
  else if (active === 'DISCOUNTS') content = <CheckRow label={tx("On Discount")} count={countExtra('On Discount')} checked={selected.includes('On Discount')} onChange={() => extra(active, 'On Discount')} />;
  else if (active === 'DOWN PAYMENT') content = <CheckRow label={tx("Show only Zero down payment cars")} count={countExtra('Show only Zero down payment cars')} checked={selected.length > 0} multiline onChange={() => extra(active, 'Show only Zero down payment cars')} />;
  else if (active === 'EMI') content = <>
    <div {...stylex.props(s.phoneTabletContents)}><h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{emiOptions.map(option => <CheckRow key={option.value} label={<><span {...stylex.props(s.phoneOnly)}>{tx(option.relation)} {mobileMoney(Number(option.amount.replace(/\D/g, '')))}</span><span {...stylex.props(s.wideOnly)}>{tx(option.relation)} {option.amount}</span></>} radio="emi" checked={selected.includes(option.value)} onChange={() => update({...filters, emiLimit: null, extra: {...filters.extra, EMI: [option.value]}})} />)}</div>
    <div {...stylex.props(s.desktopOnly)}><div {...stylex.props(s.desktopPayment)}><DesktopFilterRange key={rangeRevision} label={tx('Monthly payment')} minimum={0} maximum={100000} low={0} high={filters.emiLimit ?? (selected[0] && !selected[0].startsWith('Above') ? Number(selected[0].replace(/\D/g, '')) - 1 : 100000)} prefix={currency.symbol} anyBounds={filters.emiLimit === null} showTrack={false} onlyMaximum onChange={(_, maximum, emptyMaximum) => update({...filters, emiLimit: emptyMaximum ? null : maximum, extra: {...filters.extra, EMI: []}})}/></div><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.desktopPresets)}>{emiOptions.map(option => <CheckRow key={option.value} label={`${tx(option.relation)} ${mobileMoney(Number(option.amount.replace(/\D/g, '')))}`} count={countExtra(option.value)} radio="desktop-emi" checked={selected.includes(option.value)} onChange={() => {setRangeRevision(revision => revision + 1); update({...filters, emiLimit: null, extra: {...filters.extra, EMI: [option.value]}});}}/>)}</div></div>
    <div {...stylex.props(s.phoneTabletContents)}><h3 {...stylex.props(s.rangeTitle)}><span {...stylex.props(s.phoneOnly)}>{tx('Monthly payment')}</span><span {...stylex.props(s.wideOnly)}>{tx("Set max EMI")}</span></h3><label {...stylex.props(s.emiInput)}><span {...stylex.props(s.phoneOnly)}>{currency.symbol}</span><span {...stylex.props(s.wideOnly)}>{tx(currency.code)}</span><input type="number" data-focus-owner="field" inputMode="numeric" min={0} max={100000} aria-label={tx("Maximum EMI")} value={filters.emiLimit ?? ''} onChange={event => update({...filters, emiLimit: event.target.value === '' ? null : Math.max(0, Math.min(100000, Number(event.target.value))), extra: {...filters.extra, EMI: []}})} {...stylex.props(s.emiNumber)} /></label></div>
  </>;
  else if (active === 'YEAR') content = <>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set year')}</h3><CompactRange label={tx('year')} minimum={inventoryBounds.yearMinimum} maximum={inventoryBounds.yearMaximum} low={filters.yearMinimum} high={filters.yearMaximum} grouping={false} onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.mobileOptions)}>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mobile-year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: inventoryBounds.yearMaximum})}/>)}</div></div>
    <div {...stylex.props(s.desktopOnly)}><DesktopFilterRange key={rangeRevision} label={tx('year')} minimum={inventoryBounds.yearMinimum} maximum={inventoryBounds.yearMaximum} low={filters.yearMinimum} high={filters.yearMaximum} grouping={false} onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.desktopPresets)}>{yearOptions.map(value => <button type="button" key={value} aria-pressed={filters.year === value} onClick={() => {setRangeRevision(revision => revision + 1); update(filters.year === value ? clearDesktopFilter(filters, 'YEAR') : {...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: inventoryBounds.yearMaximum});}} {...stylex.props(s.desktopPreset, filters.year === value && s.desktopPresetSelected)}>{tx(value)}</button>)}</div></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{yearOptions.map(value => <CheckRow key={value} label={tx(value)} radio="year" checked={filters.year === value} onChange={() => update({...filters, year: value, yearMinimum: Number.parseInt(value), yearMaximum: inventoryBounds.yearMaximum})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set year")}</h3><VerticalRange label={tx("year")} minimum={inventoryBounds.yearMinimum} maximum={inventoryBounds.yearMaximum} low={filters.yearMinimum} high={filters.yearMaximum} maxLabel="Max Year" minLabel="Min Year" onChange={(yearMinimum, yearMaximum) => update({...filters, year: '', yearMinimum, yearMaximum})} />
    </div>
  </>;
  else if (active === 'MILEAGE') content = <>
    <div {...stylex.props(s.desktopOnly)}><DesktopFilterRange key={rangeRevision} label={tx('mileage')} minimum={0} maximum={inventoryBounds.mileageMaximum} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} suffix={tx('km')} anyBounds onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})}/></div>
    <div role="group" aria-label={tx('Suggestions')} {...stylex.props(s.desktopMileageChoices)}>{mileageOptions.map(value => {const maximum = Number(value.replace(/\D/g, '')); return <button type="button" key={value} aria-label={tx(value)} title={tx(value)} aria-pressed={filters.mileage === value} onClick={() => {setRangeRevision(revision => revision + 1); update(filters.mileage === value ? clearDesktopFilter(filters, 'MILEAGE') : {...filters, mileage: value, mileageMinimum: 0, mileageMaximum: maximum});}} {...stylex.props(s.desktopPreset, filters.mileage === value && s.desktopPresetSelected)}>{'< '}{new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB').format(maximum)} {tx('km')}</button>;})}</div>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Set range')}</h3><CompactRange label={tx('mileage')} minimum={0} maximum={inventoryBounds.mileageMaximum} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} suffix={` ${tx('km')}`} onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})}/><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Suggestions')}</h3><div {...stylex.props(s.mobileOptions)}>{mileageOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mobile-mileage" checked={filters.mileage === value} onChange={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: Number(value.replace(/\D/g, ''))})}/>)}</div></div>
    <div {...stylex.props(s.phoneTabletMileage)}><div {...stylex.props(s.wideOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx("Suggestions")}</h3>{mileageOptions.map(value => <CheckRow key={value} label={tx(value)} radio="mileage" checked={filters.mileage === value} onChange={() => update({...filters, mileage: value, mileageMinimum: 0, mileageMaximum: Number(value.replace(/\D/g, ''))})} />)}
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Set range")}</h3><VerticalRange label={tx("mileage")} minimum={0} maximum={inventoryBounds.mileageMaximum} low={filters.mileageMinimum} high={filters.mileageMaximum} step={1000} maxLabel="Max Kms" minLabel="Min Kms" suffix=" km" onChange={(mileageMinimum, mileageMaximum) => update({...filters, mileage: '', mileageMinimum, mileageMaximum})} /></div></div>
  </>;
  else if (active === 'BODY TYPE') content = <div {...stylex.props(s.bodies, wide && s.wideBodies)}>{bodyTypes.map((body, index) => {
    const count = countMatches?.({...facetBase, bodies: [body]});
    return <button type="button" key={body} aria-label={tx(body)} title={tx(body)} aria-pressed={filters.bodies.includes(body)} onClick={() => update({...filters, bodies: toggleFilter(filters.bodies, body)})} {...stylex.props(s.body, filters.bodies.includes(body) && s.bodyActive)}><img src={assetPath(`/reference-assets/continuation/filter-body-${index}.png`)} width={82} height={43} alt={tx("")} {...stylex.props(s.bodyImage)} /><span>{tx(body)}</span>{count !== undefined ? <span aria-hidden="true" {...stylex.props(s.bodyCount)}>{count} {tx(count === 1 ? 'car' : 'cars')}</span> : null}</button>;
  })}</div>;
  else if (active === 'CAR TYPE') content = <div {...stylex.props(s.types)}>{[
    ['Prime', 'Everyday cars from our showroom.'], ['Luxe', 'Explore our premium selection.'], ['Lite', 'Explore more affordable options.'],
  ].map(([label, copy]) => <label key={label} {...stylex.props(s.type, selected.includes(label) && s.optionSelected)}><input type="checkbox" className="cars24-filter-checkbox" checked={selected.includes(label)} onChange={() => extra(active, label)} /><span><strong>{tx(label === 'Luxe' ? 'Select' : label === 'Prime' ? 'Everyday' : 'Value')}</strong><span {...stylex.props(s.typeCopy)}>{tx(copy)}</span></span></label>)}</div>;
  else if (active === 'FUEL TYPE') content = <>{['Petrol', 'Hybrid', 'Electric', 'Diesel'].map(value => <CheckRow key={value} label={tx(value)} checked={filters.fuel.includes(value)} count={countMatches?.({...facetBase, fuel: [value]})} onChange={() => update({...filters, fuel: toggleFilter(filters.fuel, value)})} large />)}</>;
  else if (active === 'TRANSMISSION') content = <>{['Automatic', 'Manual'].map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} count={countExtra(value)} onChange={() => extra(active, value)} large />)}</>;
  else if (active === 'CATEGORIES') content = <>{categoryOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} count={countExtra(value)} onChange={() => extra(active, value)} large />)}</>;
  else if (active === 'FEATURES') content = <>{featureOptions.map(value => <CheckRow key={value} label={tx(value)} checked={selected.includes(value)} count={countExtra(value)} onChange={() => extra(active, value)} large />)}</>;
  else content = <>
    <div {...stylex.props(s.phoneOnly)}><h3 {...stylex.props(s.firstTitle)}>{tx('Engine Size (Litres)')}</h3><CompactRange label={tx('engine size')} minimum={0} maximum={inventoryBounds.engineMaximum} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})}/><p {...stylex.props(s.engineHint)}>{tx('Engine range: 0–{maximum} litres.').replace('{maximum}', String(inventoryBounds.engineMaximum))}</p><h3 {...stylex.props(s.mobileSuggestions)}>{tx('Number Of Cylinders')}</h3><CompactRange label={tx('cylinders')} minimum={0} maximum={inventoryBounds.cylinderMaximum} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})}/></div>
    <div {...stylex.props(s.desktopOnly, s.desktopEngineRanges)}><DesktopRangeGroup title={tx('Engine Size (Litres)')}><DesktopFilterRange label={tx('engine size')} minimum={0} maximum={inventoryBounds.engineMaximum} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})}/></DesktopRangeGroup><DesktopRangeGroup title={tx('Number Of Cylinders')}><DesktopFilterRange label={tx('cylinders')} minimum={0} maximum={inventoryBounds.cylinderMaximum} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})}/></DesktopRangeGroup></div>
    <div {...stylex.props(s.tabletOnly)}>
    <h3 {...stylex.props(s.firstTitle)}>{tx("Engine Size (Litres)")}</h3><VerticalRange label={tx("engine size")} minimum={0} maximum={inventoryBounds.engineMaximum} low={filters.engineMinimum} high={filters.engineMaximum} step={0.1} onChange={(engineMinimum, engineMaximum) => update({...filters, engineMinimum, engineMaximum})} /><p {...stylex.props(s.engineHint)}>{tx("Engine range: 0–{maximum} litres.").replace("{maximum}", String(inventoryBounds.engineMaximum))}</p>
    <h3 {...stylex.props(s.rangeTitle)}>{tx("Number Of Cylinders")}</h3><VerticalRange label={tx("cylinders")} minimum={0} maximum={inventoryBounds.cylinderMaximum} low={filters.cylinderMinimum} high={filters.cylinderMaximum} onChange={(cylinderMinimum, cylinderMaximum) => update({...filters, cylinderMinimum, cylinderMaximum})} />
    </div>
  </>;
  return <div ref={root} {...stylex.props(s.pane, ['FUEL TYPE', 'TRANSMISSION', 'CATEGORIES', 'FEATURES'].includes(active) && s.desktopChoices)}>{tx(content)}</div>;
}
