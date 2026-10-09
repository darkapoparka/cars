'use client';

import {useState} from 'react';
import {Search} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import ShowroomSearchSheet from '@/components/ShowroomSearchSheet';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {vehicles} from '@/lib/data';
import {searchField} from '@/components/search-field.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared Home search entry, including its actual stock count. */
export default function ShowroomSearchField({onDark = false}: {onDark?: boolean}) {
  const tx = useCopy();
  const [open, setOpen] = useState(false);
  return <><button type="button" data-search-field aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} aria-label={`${tx('Search cars')} · ${vehicles.length} ${tx(vehicles.length === 1 ? 'car' : 'cars')}`} {...stylex.props(searchField.field, s.entry, onDark && s.onDark)}>
    <Search size={22} strokeWidth={2} aria-hidden="true" {...stylex.props(searchField.icon)}/>
    <span {...stylex.props(searchField.copy)}>
      <span data-search-prompt {...stylex.props(s.desktopPrompt)}>{tx(showroom.searchPlaceholder)}</span>
      <span data-search-prompt {...stylex.props(s.mobilePrompt)}>{tx(showroom.mobileSearchPlaceholder)}</span>
      <span data-result-count aria-hidden="true" {...stylex.props(searchField.count)}>({vehicles.length})</span>
    </span>
  </button>{open ? <ShowroomSearchSheet onClose={() => setOpen(false)}/> : null}</>;
}

const s = stylex.create({
  entry: {width: '100%', paddingBlock: 0, textAlign: 'left', cursor: 'pointer'},
  onDark: {backgroundColor: $.surface, outlineColor: {':focus-visible': {[media.mobile]: '#242428', default: '#fff'}}, outlineOffset: 3},
  desktopPrompt: {display: {[media.mobile]: 'none', default: 'block'}, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  mobilePrompt: {display: {[media.mobile]: 'block', default: 'none'}, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
});
