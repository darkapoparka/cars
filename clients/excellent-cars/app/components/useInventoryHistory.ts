'use client';

import {useEffect, useRef} from 'react';
import {restoreFilters, type Filters} from '@/lib/inventory-filters';

type State = {query: string; filters: Filters; sort: string; emiMax?: number};
type Controls = {setQuery: (value: string) => void; setFilters: (value: Filters) => void; setSort: (value: string) => void; setEmiMax: (value: number | undefined) => void};
const validSorts = ['default', 'recent', 'price-asc', 'price-desc', 'kms-asc', 'kms-desc', 'discount', 'age-asc', 'age-desc'];

/** Store list state on its own history entry, so Back from a car restores the list. */
export function useInventoryHistory(state: State, controls: Controls) {
  const latest = useRef(state);
  const setters = useRef(controls);
  const ready = useRef(false);
  const entry = useRef('');
  useEffect(() => {setters.current = controls;});
  useEffect(() => {
    latest.current = state;
    if (!ready.current || `${location.pathname}${location.search}` !== entry.current) return;
    history.replaceState({...history.state, cars24Inventory: {version: 1, entry: entry.current, ...state}}, '');
  }, [state.query, state.filters, state.sort, state.emiMax, state]);
  useEffect(() => {
    entry.current = `${location.pathname}${location.search}`;
    const stored = history.state?.cars24Inventory;
    const frame = requestAnimationFrame(() => {
      if (stored?.version === 1 && stored.entry === entry.current) {
        const snapshot: State = {query: typeof stored.query === 'string' ? stored.query.slice(0, 200) : '', filters: restoreFilters(stored.filters), sort: validSorts.includes(stored.sort) ? stored.sort : 'default', emiMax: typeof stored.emiMax === 'number' && Number.isFinite(stored.emiMax) ? Math.max(0, stored.emiMax) : undefined};
        latest.current = snapshot;
        setters.current.setQuery(snapshot.query); setters.current.setFilters(snapshot.filters); setters.current.setSort(snapshot.sort); setters.current.setEmiMax(snapshot.emiMax);
      }
      ready.current = true;
    });
    function pop() {
      if (`${location.pathname}${location.search}` === entry.current) history.replaceState({...history.state, cars24Inventory: {version: 1, entry: entry.current, ...latest.current}}, '');
    }
    window.addEventListener('popstate', pop);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('popstate', pop); ready.current = false;};
  }, []);
}
