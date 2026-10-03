'use client';

import {useRef, useState} from 'react';
import {Search, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {searchField} from '@/components/search-field.stylex';
import {useCopy} from '@/lib/locale';
import {useSearchParams} from '@/lib/navigation';
import {serviceOptions} from '@/lib/service-catalogue';

/** Both responsive search fields and the category strip share the URL state. */
export function useServiceSearch() {
  const params = useSearchParams();
  const mobileInput = useRef<HTMLInputElement>(null);
  const desktopInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState<string>(serviceOptions.find(option => option.id === params.get('category'))?.id ?? 'all');

  function update(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery); setCategory(nextCategory);
    const next = new URLSearchParams(window.location.search);
    if (nextQuery) next.set('q', nextQuery); else next.delete('q');
    if (nextCategory !== 'all') next.set('category', nextCategory); else next.delete('category');
    const suffix = next.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${suffix ? `?${suffix}` : ''}${window.location.hash}`);
  }
  function clear(nextCategory = category) {
    update('', nextCategory);
    [mobileInput.current, desktopInput.current].find(input => input && input.getClientRects().length > 0)?.focus();
  }

  return {query, category, update, clear, mobileInput, desktopInput};
}

export type ServiceSearchState = ReturnType<typeof useServiceSearch>;

export default function ServiceSearchField({state, onDark = false}: {state: ServiceSearchState; onDark?: boolean}) {
  const tx = useCopy();
  return <div role="search">
    <div data-search-field {...stylex.props(searchField.field, s.search, onDark && s.onDark)}>
      <Search aria-hidden="true" {...stylex.props(searchField.icon)}/>
      <input ref={onDark ? state.mobileInput : state.desktopInput} data-search-input type="search" aria-label={tx('Search services')} placeholder={tx('Search services')} value={state.query} onChange={event => state.update(event.target.value, state.category)} {...stylex.props(searchField.input, s.input, onDark && s.compactInput)}/>
      {state.query ? <button type="button" aria-label={tx('Clear search')} onClick={() => state.clear()} {...stylex.props(searchField.clear, s.clear, onDark && s.compactClear)}><X size={18} aria-hidden="true"/></button> : null}
    </div>
  </div>;
}

const s = stylex.create({
  search: {minHeight: 48, outline: {default: 'none', ':focus-within': '2px solid #242428'}, outlineOffset: 2},
  onDark: {minHeight: 44, backgroundColor: '#fff', outlineColor: {':focus-within': '#fff'}, outlineOffset: 3},
  input: {minHeight: 44, appearance: {default: 'auto', '::-webkit-search-cancel-button': 'none'}},
  compactInput: {minHeight: 40},
  clear: {width: 44, height: 44},
  compactClear: {width: 42, height: 42},
});
