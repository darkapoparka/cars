'use client';

import * as stylex from '@stylexjs/stylex';
import {Search} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {desktopFilterGroups, desktopFilterTitles, desktopFilterCount} from '@/lib/desktop-filter-ui';
import type {Filters, FilterTab} from '@/lib/inventory-filters';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function DesktopFilterNavigation({filters, active, keyword, onSelect}: {filters: Filters; active: FilterTab; keyword: boolean; onSelect: (tab: FilterTab) => void}) {
  const tx = useCopy();
  return <div {...stylex.props(s.root)}>
    {desktopFilterGroups.map(group => <section key={group.label} aria-label={tx(group.label)}>
      <div {...stylex.props(s.group)}>{group.tabs.map(tab => {const count = desktopFilterCount(filters, tab); return <button key={tab} type="button" aria-pressed={!keyword && active === tab} aria-controls="desktop-filter-pane" onClick={() => onSelect(tab)} {...stylex.props(s.button, !keyword && active === tab && s.active)}><span>{tx(desktopFilterTitles[tab])}</span>{count ? <span aria-label={`${count} ${tx('selected')}`} {...stylex.props(s.count)}>{count}</span> : null}</button>;})}</div>
    </section>)}
  </div>;
}

export function DesktopFilterSearch({active, query, onClick}: {active: boolean; query: string; onClick: () => void}) {
  const tx = useCopy();
  return <button type="button" aria-pressed={active} aria-controls="desktop-filter-pane" onClick={onClick} {...stylex.props(s.button, s.search, active && s.active)}><Search size={16} aria-hidden="true"/><span>{tx('Search')}</span>{query.trim() ? <span {...stylex.props(s.count, s.searchCount)}>1</span> : null}</button>;
}

const s = stylex.create({
  root: {display: {[media.desktop]: 'grid', default: 'none'}, gap: 12},
  group: {padding: 4, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 10, backgroundColor: $.surface},
  button: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', minHeight: {default: 34, '@media (any-pointer: coarse)': 44}, padding: '5px 10px', color: $.ink, fontFamily: $.fontSans, fontSize: $.desktopTextSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopTextLineHeight, whiteSpace: 'nowrap', textAlign: 'left', borderWidth: 0, borderRadius: 6, backgroundColor: {default: 'transparent', ':hover': $.line}, outlineOffset: -2, cursor: 'pointer'},
  search: {display: {[media.desktop]: 'flex', default: 'none'}, justifyContent: 'flex-start', minHeight: 44, paddingInline: 14, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 10, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}},
  searchCount: {marginLeft: 'auto'},
  active: {color: $.surface, fontWeight: $.desktopTextWeight, backgroundColor: {default: $.ink, ':hover': $.ink}},
  count: {display: 'inline-grid', placeItems: 'center', flexShrink: 0, minWidth: 18, height: 18, paddingInline: 4, color: $.ink, fontSize: $.desktopLabelSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopLabelLineHeight, fontVariantNumeric: 'tabular-nums', borderRadius: 5, backgroundColor: $.surface},
});
