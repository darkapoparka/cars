'use client';

import {useEffect, useRef} from 'react';
import {restoreFilters, type Filters} from '@/lib/inventory-filters';
import {useRouter} from '@/lib/navigation';
import {withoutLocale} from '@/lib/paths';

type State = {query: string; filters: Filters; sort: string; emiMax?: number};
type Controls = {setQuery: (value: string) => void; setFilters: (value: Filters) => void; setSort: (value: string) => void; setEmiMax: (value: number | undefined) => void};
const validSorts = ['default', 'recent', 'price-asc', 'price-desc', 'kms-asc', 'kms-desc', 'discount', 'age-asc', 'age-desc'];
let pendingReturn: {entry: string; detail: string} | null = null;

/** Remember which collection opened the car without changing its URL or scroll position. */
export function useVehicleReturn() {
  useEffect(() => {
    pendingReturn = null;
    const entry = `${location.pathname}${location.search}`;
    function rememberReturn(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const destination = new URL(link.href);
      pendingReturn = destination.origin === location.origin && /^\/cars\/[^/]+$/.test(withoutLocale(destination.pathname))
        ? {entry, detail: destination.pathname} : null;
    }
    document.addEventListener('click', rememberReturn, true);
    return () => document.removeEventListener('click', rememberReturn, true);
  }, []);
}

/** Store list state on its own history entry, so Back from a car restores the list. */
export function useInventoryHistory(state: State, controls: Controls) {
  useVehicleReturn();
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

/** Attach the originating list to the detail's history entry, including on reload. */
export function useInventoryBack() {
  const router = useRouter();
  useEffect(() => {
    const origin = pendingReturn;
    pendingReturn = null;
    if (origin?.detail === location.pathname) {
      history.replaceState({...history.state, cars24InventoryReturn: origin}, '');
    }
  }, []);
  return () => {
    const origin = history.state?.cars24InventoryReturn;
    if (origin?.detail === location.pathname && typeof origin.entry === 'string') {
      const entry = new URL(origin.entry, location.origin);
      if (entry.origin === location.origin && ['/cars', '/luxe', '/saved'].includes(withoutLocale(entry.pathname))) {
        router.back();
        return;
      }
    }
    router.push('/cars');
  };
}
