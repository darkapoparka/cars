'use client';
import {displayMake} from '@/lib/inventory-labels';
import {useId,useLayoutEffect,useRef,useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {vehicles} from '@/lib/data';
import {modelChoices,modelKey,hasModel,toggleModelSelection,modelBelongsToMake} from '@/lib/inventory-options';
import {inventoryNameKey} from '@/lib/inventory-identity';
import type {Filters} from '@/lib/inventory-filters';
import {clearDesktopFilter} from '@/lib/desktop-filter-ui';
import {toggleStockModels} from '@/lib/model-families';
import {BrandEmblem} from '@/components/ReferenceUI';
import CheckRow from './FilterCheckRow';
import {filterPaneStyles as s} from './filter-pane.stylex';

export default function BrandFilterGroup({make, filters, update, countMatches}: {make: string; filters: Filters; update: (next: Filters) => void; countMatches?: (next: Filters) => number}) {
  const tx = useCopy();
  const modelsId = useId();

  const [expanded, setExpanded] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const selected = filters.brands.some(brand => inventoryNameKey(brand) === inventoryNameKey(make));
  const partial = filters.models.some(model => modelBelongsToMake(model, make));
  const models = modelChoices.filter(choice => choice.make === make).map(choice => choice.model);
  const wideModels = models.length > 2;
  const stockCount = vehicles.filter(vehicle => vehicle.make.trim().toLowerCase() === make.trim().toLowerCase()).length;
  const availableCount = countMatches?.({...clearDesktopFilter(filters, 'BRAND'), brands: [make]}) ?? stockCount;
  useLayoutEffect(() => {if (checkbox.current) checkbox.current.indeterminate = !selected && partial;}, [selected, partial]);
  const otherBrands = filters.brands.filter(brand => inventoryNameKey(brand) !== inventoryNameKey(make));
  function toggleBrand() {update({...filters, brands: selected ? otherBrands : [...otherBrands, make], models: filters.models.filter(model => !modelBelongsToMake(model, make))});}
  function toggleBrandModel(model: string) {
    const previous = selected ? [...filters.models, ...models.map(value => modelKey(make, value))] : filters.models;
    update({...filters, brands: otherBrands, models: toggleModelSelection(previous, modelKey(make, model))});
  }
  return <div data-filter-make={make} data-filter-make-expanded={expanded || undefined} {...stylex.props(s.brandGroup, expanded && s.brandGroupExpanded, expanded && wideModels && s.brandGroupExpandedWide, (selected || partial) && s.brandGroupSelected, !stockCount && !selected && !partial && s.unstockedBrand)}>
    <div {...stylex.props(s.brandRow)}>
      <label {...stylex.props(s.brandLabel)}>
        <input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" checked={selected} onChange={toggleBrand} />
        <span {...stylex.props(s.desktopBrandLogo)}><BrandEmblem make={make} plain/></span>
        <span title={tx(displayMake(make))} {...stylex.props(s.brandName)}>
          <span {...stylex.props(s.desktopBrandText)}>{tx(displayMake(make))}</span>
          <span aria-hidden="true" title={`${availableCount} ${tx(availableCount === 1 ? 'car' : 'cars')}`} {...stylex.props(s.stockCount, s.brandCount)}>({availableCount})</span>
        </span>
      </label>
      <button type="button" aria-label={tx(`Show ${make} models`)} aria-expanded={expanded} aria-controls={modelsId} onClick={() => setExpanded(value => !value)} {...stylex.props(s.expand)}><span {...stylex.props(s.expandContent, expanded && s.expandOpen)}><ChevronDown size={17} strokeWidth={1.8} {...stylex.props(s.expandChevron, expanded && s.rotate)} /></span></button>
    </div>
    {expanded ? <div id={modelsId} {...stylex.props(s.modelDisclosure)}>
      <div role="group" aria-label={`${tx('Model')}: ${tx(displayMake(make))}`} {...stylex.props(s.brandModels, wideModels && s.brandModelsWide)}>{models.map(model => {
        const key = modelKey(make, model);
        const checked = hasModel(filters.models, key);
        const count = countMatches?.({...clearDesktopFilter(filters, 'BRAND'), models: [key]}) ?? vehicles.filter(vehicle => inventoryNameKey(vehicle.make) === inventoryNameKey(make) && inventoryNameKey(vehicle.model) === inventoryNameKey(model)).length;
        return <label key={key} data-desktop-model-option {...stylex.props(s.desktopModelOption, checked && s.desktopModelOptionSelected)}><input type="checkbox" className="cars24-filter-checkbox" aria-label={`${make} ${model}`} checked={checked} onChange={() => update(toggleStockModels(filters, make, [key]))}/><span {...stylex.props(s.desktopModelLabel)}>{tx(model)}</span><span aria-hidden="true" {...stylex.props(s.stockCount)}>{count}</span></label>;
      })}{!models.length ? <p {...stylex.props(s.emptyModels)}>{tx("No models from this brand are included in the captured local catalog.")}</p> : null}</div>
      <div {...stylex.props(s.models, s.phoneTabletOnly)}>{models.map(model => <CheckRow key={model} label={tx(model)} checked={selected || hasModel(filters.models, modelKey(make, model))} onChange={() => toggleBrandModel(model)} />)}{!models.length ? <p {...stylex.props(s.emptyModels)}>{tx("No models from this brand are included in the captured local catalog.")}</p> : null}</div>
    </div> : null}
  </div>;
}
