'use client';
import {displayMake} from '@/lib/inventory-labels';

import {useEffect, useId, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, X} from 'lucide-react';
import {BrandEmblem} from '@/components/ReferenceUI';
import {vehicles} from '@/lib/data';
import {useCopy} from '@/lib/locale';
import {buildModelFamilyGroups, isStockModelSelected, searchModelFamilyGroups, toggleStockModels, type ModelFamily, type ModelFamilyGroup} from '@/lib/model-families';
import type {Filters} from '@/lib/inventory-filters';
import {inventoryNameKey} from '@/lib/inventory-identity';
import {modelBelongsToMake} from '@/lib/inventory-options';
import {clearDesktopMake} from '@/lib/desktop-filter-ui';
import {filterPaneStyles as filterStyles} from './filters/filter-pane.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

function Family({family, filters, update}: {family: ModelFamily; filters: Filters; update: (next: Filters) => void}) {
  const tx = useCopy();
  const checkbox = useRef<HTMLInputElement>(null);
  const keys = family.models.map(model => model.key);
  const visibleModels = family.visibleModels ?? family.models;
  const selected = keys.length > 0 && keys.every(key => isStockModelSelected(filters.models, key));
  const partial = !selected && keys.some(key => isStockModelSelected(filters.models, key));
  useEffect(() => {if (checkbox.current) checkbox.current.indeterminate = partial;}, [partial]);
  const singleModel = family.models.length === 1 ? family.models[0] : null;
  const modelHint = singleModel && singleModel.model.toLowerCase().replace(/[^a-z0-9]/g, '') !== family.name.toLowerCase().replace(/[^a-z0-9]/g, '') ? singleModel.model : null;
  const showModelOnly = modelHint !== null && modelHint.toLowerCase().startsWith(family.name.toLowerCase());
  return <div data-model-family={family.name} {...stylex.props(s.family)}>
    <label data-desktop-model-option {...stylex.props(filterStyles.desktopModelOption, (selected || partial) && filterStyles.desktopModelOptionSelected)}>
      <input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" aria-label={`${family.make} ${singleModel ? singleModel.model : tx(family.name)}`} checked={selected} onChange={() => update(toggleStockModels(filters, family.make, keys))}/>
      <span {...stylex.props(s.label)}>{showModelOnly ? modelHint : tx(family.name)}{modelHint && !showModelOnly ? <span {...stylex.props(s.modelHint)}> · {modelHint}</span> : null}</span><span aria-hidden="true" {...stylex.props(s.count)}>{family.count}</span>
    </label>
    {!singleModel ? <div {...stylex.props(s.models)}>{visibleModels.map(model => <label key={model.key} data-desktop-model-option {...stylex.props(filterStyles.desktopModelOption, isStockModelSelected(filters.models, model.key) && filterStyles.desktopModelOptionSelected)}>
      <input type="checkbox" className="cars24-filter-checkbox" aria-label={`${model.make} ${model.model}`} checked={isStockModelSelected(filters.models, model.key)} onChange={() => update(toggleStockModels(filters, model.make, [model.key]))}/>
      <span {...stylex.props(s.label)}>{model.model}</span><span aria-hidden="true" {...stylex.props(s.count)}>{model.count}</span>
    </label>)}</div> : null}
  </div>;
}

function MakeGroup({group, filters, update, query, wide, browse, onRemove}: {group: ModelFamilyGroup; filters: Filters; update: (next: Filters) => void; query: string; wide: boolean; browse: boolean; onRemove: () => void}) {
  const tx = useCopy();
  const modelsId = useId();
  const selected = filters.brands.some(make => inventoryNameKey(make) === inventoryNameKey(group.make)) || filters.models.some(model => modelBelongsToMake(model, group.make));
  const [expanded, setExpanded] = useState<boolean | null>(null);
  const [searchDisclosure, setSearchDisclosure] = useState<{query: string; expanded: boolean} | null>(null);
  const term = query.trim().toLowerCase();
  // Search reveals matches without changing the group's normal collapsed/open state.
  const isExpanded = term ? (searchDisclosure?.query === term ? searchDisclosure.expanded : true) : (expanded ?? selected);
  function toggle() {
    if (term) setSearchDisclosure({query: term, expanded: !isExpanded});
    else setExpanded(!isExpanded);
  }
  return <section data-desktop-make-group aria-label={tx(displayMake(group.make))} {...stylex.props(s.make)}>
    <div {...stylex.props(s.makeHeading)}>
      <h4 {...stylex.props(s.makeHeadingTitle)}><button type="button" aria-label={tx(`Show ${group.make} models`)} aria-expanded={isExpanded} aria-controls={modelsId} onClick={toggle} {...stylex.props(s.expandMake)}>
        <span {...stylex.props(s.emblem)}><BrandEmblem make={group.make}/></span>
        <span {...stylex.props(s.makeName)}>{tx(displayMake(group.make))} <span aria-label={`${group.count} ${tx(group.count === 1 ? 'car' : 'cars')}`} {...stylex.props(s.makeCount)}>({group.count})</span></span>
        <span {...stylex.props(s.expandIcon)}><ChevronDown size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(isExpanded && s.expandIconOpen)}/></span>
      </button></h4>
      {selected ? <button type="button" aria-label={`${tx('Clear')}: ${tx(displayMake(group.make))}`} title={`${tx('Clear')}: ${tx(displayMake(group.make))}`} onClick={onRemove} {...stylex.props(s.removeMake)}><X size={18} aria-hidden="true"/></button> : null}
    </div>
    <div id={modelsId} hidden={!isExpanded} {...stylex.props(s.makeContent)}>
      <div {...stylex.props(s.families, wide && s.wideFamilies, browse && s.browseFamilies)}>
        {group.families.filter(family => family.count > 0).map(family => <Family key={family.name} family={family} filters={filters} update={update}/>)}
      </div>
      {group.families.some(family => !family.count) ? <details open={query.trim() && group.families.every(family => !family.count) ? true : undefined} {...stylex.props(s.unavailable)}>
        <summary {...stylex.props(s.caption)}>{tx('Families with no current stock')} ({group.families.filter(family => !family.count).length})</summary>
        <div {...stylex.props(s.emptyGrid, wide && s.wideEmptyGrid)}>{group.families.filter(family => !family.count).map(family => <label key={family.name} data-empty-model-family={family.name} {...stylex.props(s.emptyRow)}>
          <input type="checkbox" className="cars24-filter-checkbox" aria-label={`${family.make} ${tx(family.name)}`} disabled checked={false}/><span {...stylex.props(s.label)}>{tx(family.name)}</span><span aria-hidden="true" {...stylex.props(s.count)}>0</span>
        </label>)}</div>
      </details> : null}
    </div>
  </section>;
}

export default function DesktopModelFamilies({filters, update, query, makes, wide}: {filters: Filters; update: (next: Filters) => void; query: string; makes: readonly string[]; wide: boolean}) {
  const tx = useCopy();
  const root = useRef<HTMLDivElement>(null);
  const groups = searchModelFamilyGroups(buildModelFamilyGroups(vehicles, makes), query, makes.length > 0);
  const browse = groups.length > 2;
  function removeMake(make: string) {
    const search = root.current?.parentElement?.querySelector<HTMLInputElement>('input[data-search-input]');
    update(clearDesktopMake(filters, make));
    requestAnimationFrame(() => {if (search?.isConnected) search.focus();});
  }
  return <div ref={root} data-desktop-model-families {...stylex.props(s.root)}>
    <div {...stylex.props(s.makeGrid, browse && s.browseGrid)}>
      {groups.map(group => <MakeGroup key={group.make} group={group} filters={filters} update={update} query={query} wide={wide} browse={browse} onRemove={() => removeMake(group.make)}/>)}
    </div>
    {!groups.length ? <p role="status" {...stylex.props(s.empty)}>{tx('No models found')}</p> : null}
  </div>;
}

const s = stylex.create({
  root: {display: {[media.desktop]: 'block', default: 'none'}, marginTop: 16},
  makeGrid: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', rowGap: 16},
  browseGrid: {gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, alignItems: 'start'},
  browseFamilies: {gridTemplateColumns: 'minmax(0,1fr)'},
  make: {minWidth: 0, padding: 12, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12, backgroundColor: $.surfaceAlt},
  makeHeading: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 44},
  makeHeadingTitle: {flexGrow: 1, minWidth: 0, margin: 0, fontSize: $.desktopTextSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopTextLineHeight},
  expandMake: {display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, paddingBlock: 0, paddingInline: 10, color: $.ink, fontFamily: $.fontSans, textAlign: 'left', borderWidth: 0, borderRadius: 8, backgroundColor: {default: 'transparent', ':hover': $.line}, outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 2, cursor: 'pointer'},
  expandIcon: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, marginLeft: 'auto', color: $.ink, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 8, backgroundColor: $.surface},
  expandIconOpen: {transform: 'rotate(180deg)'},
  makeContent: {paddingTop: 10},
  emblem: {width: 30, height: 30, flexShrink: 0},
  makeName: {minWidth: 0, margin: 0, color: $.ink, fontSize: $.desktopTextSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopTextLineHeight},
  makeCount: {color: $.muted, fontSize: $.desktopLabelSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopLabelLineHeight, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'},
  removeMake: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 44, height: 44, marginLeft: 'auto', padding: 0, color: $.muted, borderWidth: 0, borderRadius: 999, backgroundColor: {default: 'transparent', ':hover': $.line}, cursor: 'pointer'},
  families: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '6px 10px', alignItems: 'start'},
  wideFamilies: {gridTemplateColumns: 'repeat(3,minmax(0,1fr))'},
  family: {minWidth: 0},
  models: {display: 'grid', gap: 6, paddingLeft: 26, paddingRight: 10, marginTop: 6},
  label: {minWidth: 0, overflowWrap: 'anywhere'},
  modelHint: {color: $.muted, fontWeight: 400},
  count: {marginLeft: 'auto', color: $.muted, fontSize: $.desktopLabelSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopLabelLineHeight, fontVariantNumeric: 'tabular-nums'},
  unavailable: {marginTop: 10, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: $.line},
  caption: {minHeight: 40, padding: '10px 10px', color: $.muted, fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight, cursor: 'pointer'},
  emptyGrid: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '0 20px'},
  wideEmptyGrid: {gridTemplateColumns: 'repeat(3,minmax(0,1fr))'},
  emptyRow: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, paddingInline: 10, color: $.muted, fontSize: $.desktopTextSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopTextLineHeight},
  empty: {paddingBlock: 12, color: $.muted, fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight},
});
