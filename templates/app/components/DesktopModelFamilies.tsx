'use client';

import {useEffect, useRef} from 'react';
import * as stylex from '@stylexjs/stylex';
import {BrandEmblem} from '@/components/ReferenceUI';
import {vehicles} from '@/lib/data';
import {useCopy} from '@/lib/locale';
import {buildModelFamilyGroups, isStockModelSelected, searchModelFamilyGroups, toggleStockModels, type ModelFamily} from '@/lib/model-families';
import type {Filters} from '@/lib/inventory-filters';
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
    <label {...stylex.props(s.familyRow, (selected || partial) && s.selected)}>
      <input ref={checkbox} type="checkbox" className="cars24-filter-checkbox" aria-label={`${family.make} ${singleModel ? singleModel.model : tx(family.name)}`} checked={selected} onChange={() => update(toggleStockModels(filters, family.make, keys))}/>
      <span {...stylex.props(s.label)}>{showModelOnly ? modelHint : tx(family.name)}{modelHint && !showModelOnly ? <span {...stylex.props(s.modelHint)}> · {modelHint}</span> : null}</span><span aria-hidden="true" {...stylex.props(s.count)}>{family.count}</span>
    </label>
    {!singleModel ? <div {...stylex.props(s.models)}>{visibleModels.map(model => <label key={model.key} {...stylex.props(s.modelRow)}>
      <input type="checkbox" className="cars24-filter-checkbox" aria-label={`${model.make} ${model.model}`} checked={isStockModelSelected(filters.models, model.key)} onChange={() => update(toggleStockModels(filters, model.make, [model.key]))}/>
      <span {...stylex.props(s.label)}>{model.model}</span><span aria-hidden="true" {...stylex.props(s.count)}>{model.count}</span>
    </label>)}</div> : null}
  </div>;
}

export default function DesktopModelFamilies({filters, update, query, makes, wide}: {filters: Filters; update: (next: Filters) => void; query: string; makes: readonly string[]; wide: boolean}) {
  const tx = useCopy();
  const groups = searchModelFamilyGroups(buildModelFamilyGroups(vehicles, makes), query, makes.length > 0);
  const browse = groups.length > 2;
  return <div data-desktop-model-families {...stylex.props(s.root)}>
    <div {...stylex.props(s.makeGrid, browse && s.browseGrid)}>
      {groups.map(group => <section key={group.make} data-desktop-make-group aria-label={tx(group.make)} {...stylex.props(s.make)}>
        <div {...stylex.props(s.makeHeading)}><span {...stylex.props(s.emblem)}><BrandEmblem make={group.make}/></span><h4 {...stylex.props(s.makeName)}>{tx(group.make)}</h4><span {...stylex.props(s.makeCount)}>{group.count} {tx(group.count === 1 ? 'car' : 'cars')}</span></div>
        <div {...stylex.props(s.families, wide && s.wideFamilies, browse && s.browseFamilies)}>
          {group.families.filter(family => family.count > 0).map(family => <Family key={family.name} family={family} filters={filters} update={update}/>)}
        </div>
        {group.families.some(family => !family.count) ? <div {...stylex.props(s.unavailable)}>
          <p {...stylex.props(s.caption)}>{tx('Families with no current stock')}</p>
          <div {...stylex.props(s.emptyGrid, wide && s.wideEmptyGrid)}>{group.families.filter(family => !family.count).map(family => <label key={family.name} data-empty-model-family={family.name} {...stylex.props(s.emptyRow)}>
            <input type="checkbox" className="cars24-filter-checkbox" aria-label={`${family.make} ${tx(family.name)}`} disabled checked={false}/><span {...stylex.props(s.label)}>{tx(family.name)}</span><span aria-hidden="true" {...stylex.props(s.count)}>0</span>
          </label>)}</div>
        </div> : null}
      </section>)}
    </div>
    {!groups.length ? <p role="status" {...stylex.props(s.empty)}>{tx('No models found')}</p> : null}
  </div>;
}

const s = stylex.create({
  root: {display: {[media.desktop]: 'block', default: 'none'}, marginTop: 16},
  makeGrid: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', rowGap: 20},
  browseGrid: {gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, alignItems: 'start'},
  browseFamilies: {gridTemplateColumns: 'minmax(0,1fr)'},
  make: {minWidth: 0, padding: 8, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12},
  makeHeading: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 36, paddingInline: 10, marginBottom: 4},
  emblem: {width: 36, height: 36, flexShrink: 0},
  makeName: {minWidth: 0, margin: 0, color: $.ink, fontSize: 15, fontWeight: 600, lineHeight: '22px'},
  makeCount: {flexShrink: 0, marginLeft: 'auto', color: $.muted, fontSize: 12, lineHeight: '20px', whiteSpace: 'nowrap'},
  families: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '4px 20px', alignItems: 'start'},
  wideFamilies: {gridTemplateColumns: 'repeat(3,minmax(0,1fr))'},
  family: {minWidth: 0},
  familyRow: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, paddingInline: 10, color: $.ink, fontSize: 15, fontWeight: 400, lineHeight: '22px', borderRadius: 8, backgroundColor: {default: 'transparent', ':hover': $.line}, cursor: 'pointer'},
  selected: {backgroundColor: {default: $.violetSoft, ':hover': $.line}},
  models: {paddingLeft: 26, paddingRight: 10},
  modelRow: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, color: $.text, fontSize: 15, fontWeight: 400, lineHeight: '22px', cursor: 'pointer'},
  label: {minWidth: 0, overflowWrap: 'anywhere'},
  modelHint: {color: $.muted, fontWeight: 400},
  count: {marginLeft: 'auto', color: $.muted, fontSize: 12, fontWeight: 400, fontVariantNumeric: 'tabular-nums'},
  unavailable: {marginTop: 18},
  caption: {margin: '0 0 6px', color: $.muted, fontSize: 12, lineHeight: '18px'},
  emptyGrid: {display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '0 20px'},
  wideEmptyGrid: {gridTemplateColumns: 'repeat(3,minmax(0,1fr))'},
  emptyRow: {display: 'flex', alignItems: 'center', gap: 10, minHeight: 34, paddingInline: 10, color: $.muted, fontSize: 13, lineHeight: '18px'},
  empty: {paddingBlock: 12, color: $.muted, fontSize: 12, lineHeight: '18px'},
});
