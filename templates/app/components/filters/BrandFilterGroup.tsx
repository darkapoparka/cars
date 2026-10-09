'use client';
import {useLayoutEffect,useRef,useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {vehicles} from '@/lib/data';
import {modelChoices,modelKey,hasModel,toggleModelSelection,modelBelongsToMake} from '@/lib/inventory-options';
import {inventoryNameKey} from '@/lib/inventory-identity';
import type {Filters} from '@/lib/inventory-filters';
import {clearDesktopFilter} from '@/lib/desktop-filter-ui';
import {BrandEmblem} from '@/components/ReferenceUI';
import CheckRow from './FilterCheckRow';
import {filterPaneStyles as s} from './filter-pane.stylex';

export default function BrandFilterGroup({make, filters, update, countMatches}: {make: string; filters: Filters; update: (next: Filters) => void; countMatches?: (next: Filters) => number}) {
  const tx = useCopy();

  const [expanded, setExpanded] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const selected = filters.brands.some(brand => inventoryNameKey(brand) === inventoryNameKey(make));
  const partial = filters.models.some(model => modelBelongsToMake(model, make));
  const models = modelChoices.filter(choice => choice.make === make).map(choice => choice.model);
  const stockCount = vehicles.filter(vehicle => vehicle.make.trim().toLowerCase() === make.trim().toLowerCase()).length;
  const availableCount = countMatches?.({...clearDesktopFilter(filters, 'BRAND'), brands: [make]}) ?? stockCount;
  useLayoutEffect(() => {if (checkbox.current) checkbox.current.indeterminate = !selected && partial;}, [selected, partial]);
  const otherBrands = filters.brands.filter(brand => inventoryNameKey(brand) !== inventoryNameKey(make));
  function toggleBrand() {update({...filters, brands: selected ? otherBrands : [...otherBrands, make], models: filters.models.filter(model => !modelBelongsToMake(model, make))});}
  function toggleBrandModel(model: string) {
    const previous = selected ? [...filters.models, ...models.map(value => modelKey(make, value))] : filters.models;
    update({...filters, brands: otherBrands, models: toggleModelSelection(previous, modelKey(make, model))});
  }
  return <div {...stylex.props(s.brandGroup, (selected || partial) && s.brandGroupSelected, !stockCount && !selected && !partial && s.unstockedBrand)}>
    <div {...stylex.props(s.brandRow)}><label {...stylex.props(s.brandLabel)}><input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" checked={selected} onChange={toggleBrand} /><span {...stylex.props(s.desktopBrandLogo)}><BrandEmblem make={make}/></span><span title={tx(make)} {...stylex.props(s.brandName)}>{tx(make === 'Mercedes-Benz' ? 'Mercedes Benz' : make)}</span><span aria-hidden="true" title={`${availableCount} ${tx(availableCount === 1 ? 'car' : 'cars')}`} {...stylex.props(s.stockCount)}>{availableCount}</span></label><button type="button" aria-label={tx(`Show ${make} models`)} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} {...stylex.props(s.expand)}><ChevronDown size={17} strokeWidth={1.8} {...stylex.props(expanded && s.rotate)} /></button></div>
    {expanded ? <div {...stylex.props(s.models)}>{models.map(model => <CheckRow key={model} label={tx(model)} checked={selected || hasModel(filters.models, modelKey(make, model))} onChange={() => toggleBrandModel(model)} />)}{!models.length ? <p {...stylex.props(s.emptyModels)}>{tx("No models from this brand are included in the captured local catalog.")}</p> : null}</div> : null}
  </div>;
}
