'use client';

import {Search} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import Link from '@/components/AppLink';
import {useCopy} from '@/lib/locale';
import {showroom} from '@/lib/showroom';
import {vehicles} from '@/lib/data';
import {searchField} from '@/components/search-field.stylex';
import {media} from '@/app/tokens.stylex';

/** Shared Home search entry, including its actual stock count. */
export default function ShowroomSearchField({onDark = false}: {onDark?: boolean}) {
  const tx = useCopy();
  return <Link data-search-field href="/search" aria-label={`${tx('Search cars')} · ${vehicles.length} ${tx(vehicles.length === 1 ? 'car' : 'cars')}`} {...stylex.props(searchField.field, onDark && s.onDark)}>
    <Search size={22} strokeWidth={2} aria-hidden="true" {...stylex.props(searchField.icon)}/>
    <span {...stylex.props(searchField.copy)}>
      <span data-search-prompt {...stylex.props(s.desktopPrompt)}>{tx(showroom.searchPlaceholder)}</span>
      <span data-search-prompt {...stylex.props(s.mobilePrompt)}>{tx(showroom.mobileSearchPlaceholder)}</span>
      <span data-result-count aria-hidden="true" {...stylex.props(searchField.count)}>({vehicles.length})</span>
    </span>
  </Link>;
}

const s = stylex.create({
  onDark: {backgroundColor: '#fff', outlineColor: {':focus-visible': '#fff'}, outlineOffset: 3},
  desktopPrompt: {display: {[media.mobile]: 'none', default: 'block'}, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  mobilePrompt: {display: {[media.mobile]: 'block', default: 'none'}, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
});
