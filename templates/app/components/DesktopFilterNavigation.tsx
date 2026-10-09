'use client';

import * as stylex from '@stylexjs/stylex';
import {Search} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {desktopFilterGroups, desktopFilterTitles, desktopFilterCount} from '@/lib/desktop-filter-ui';
import type {Filters, FilterTab} from '@/lib/inventory-filters';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function DesktopFilterNavigation({filters, active, keyword, query, onSelect, onKeyword}: {filters: Filters; active: FilterTab; keyword: boolean; query: string; onSelect: (tab: FilterTab) => void; onKeyword: () => void}) {
  const tx = useCopy();
  return <div {...stylex.props(s.root)}>
    <button type="button" aria-pressed={keyword} onClick={onKeyword} {...stylex.props(s.button, s.keyword, keyword && s.active)}><Search size={16} aria-hidden="true"/><span>{tx('Search')}</span>{query.trim() ? <span {...stylex.props(s.count)}>1</span> : null}</button>
    {desktopFilterGroups.map(group => <section key={group.label} aria-label={tx(group.label)}>
      <h3 {...stylex.props(s.heading)}>{tx(group.label)}</h3>
      {group.tabs.map(tab => {const count = desktopFilterCount(filters, tab); return <button key={tab} type="button" aria-pressed={!keyword && active === tab} aria-controls="desktop-filter-pane" onClick={() => onSelect(tab)} {...stylex.props(s.button, !keyword && active === tab && s.active)}><span>{tx(desktopFilterTitles[tab])}</span>{count ? <span aria-label={`${count} ${tx('selected')}`} {...stylex.props(s.count)}>{count}</span> : null}</button>;})}
    </section>)}
  </div>;
}

const s = stylex.create({
  root: {display: {[media.desktop]: 'block', default: 'none'}},
  heading: {margin: '16px 12px 6px', color: $.muted, fontSize: 12, fontWeight: 500, lineHeight: '18px'},
  button: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', minHeight: 40, padding: '7px 12px', color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, textAlign: 'left', borderWidth: 0, borderRadius: 8, backgroundColor: {default: 'transparent', ':hover': $.line}, outlineOffset: -2, cursor: 'pointer'},
  keyword: {justifyContent: 'flex-start'},
  active: {fontWeight: 500, backgroundColor: {default: $.line, ':hover': $.line}},
  count: {display: 'inline-grid', placeItems: 'center', flexShrink: 0, minWidth: 22, height: 22, paddingInline: 5, color: $.ink, fontSize: 12, fontVariantNumeric: 'tabular-nums', borderRadius: 6, backgroundColor: $.surface},
});
