'use client';

import {useEffect, useRef} from 'react';
import {type Filters} from '@/lib/inventory-filters';
import {inventorySearch, readInventorySearch, restoreInventoryState, type InventoryState} from '@/lib/inventory-search';
import {applicationHistoryState} from '@/lib/history-state';
import {useRouter} from '@/lib/navigation';
import {withoutLocale} from '@/lib/paths';
import {primaryHomePath} from '@/lib/home-alternative';

type State = InventoryState;
type Controls = {setQuery: (value: string) => void; setFilters: (value: Filters) => void; setSort: (value: string) => void; setEmiMax: (value: number | undefined) => void};
let pendingReturn: {entry: string; detail: string; home?: boolean} | null = null;

/** Remember which collection opened the car without changing its URL or scroll position. */
export function useVehicleReturn(home = false, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    pendingReturn = null;
    function rememberReturn(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const destination = new URL(link.href);
      pendingReturn = destination.origin === location.origin && /^\/cars\/[^/]+$/.test(withoutLocale(destination.pathname))
        ? {entry: `${location.pathname}${location.search}`, detail: destination.pathname, ...(home?{home:true}:{})} : null;
    }
    document.addEventListener('click', rememberReturn, true);
    return () => document.removeEventListener('click', rememberReturn, true);
  }, [home, enabled]);
}

/** Store list state on its own history entry, so Back from a car restores the list. */
export function useInventoryHistory(state: State, controls: Controls, home = false, overlayOpen = false) {
  useVehicleReturn(home);
  const {query, filters, sort, emiMax} = state;
  const latest = useRef(state);
  const setters = useRef(controls);
  const ready = useRef(false);
  const entry = useRef('');
  useEffect(() => {setters.current = controls;});
  useEffect(() => {
    const snapshot = {query, filters, sort, emiMax};
    latest.current = snapshot;
    if (!ready.current || `${location.pathname}${location.search}` !== entry.current) return;
    // Commit a sheet's portable URL after dismissal so its Back step cannot discard live edits.
    const nextEntry = `${location.pathname}${overlayOpen ? location.search : inventorySearch(location.search, snapshot)}`;
    entry.current = nextEntry;
    const previous = history.state?.cars24Inventory;
    if (previous?.version === 1 && previous.entry === nextEntry && previous.query === query && previous.sort === sort && previous.emiMax === emiMax && JSON.stringify(previous.filters) === JSON.stringify(filters)) return;
    history.replaceState({...applicationHistoryState(history.state), cars24Inventory: {version: 1, entry: nextEntry, ...snapshot}}, '', `${nextEntry}${location.hash}`);
  }, [query, filters, sort, emiMax, overlayOpen]);
  useEffect(() => {
    entry.current = `${location.pathname}${location.search}`;
    const pathname = location.pathname;
    const initial = restoreInventoryState(history.state?.cars24Inventory, entry.current) ?? readInventorySearch(new URLSearchParams(location.search));
    function restore(snapshot: State) {
      latest.current = snapshot;
      setters.current.setQuery(snapshot.query); setters.current.setFilters(snapshot.filters); setters.current.setSort(snapshot.sort); setters.current.setEmiMax(snapshot.emiMax);
    }
    const frame = requestAnimationFrame(() => {
      restore(initial);
      ready.current = true;
    });
    function pop() {
      if (location.pathname !== pathname) return;
      const nextEntry = `${location.pathname}${location.search}`;
      const stored = restoreInventoryState(history.state?.cars24Inventory, nextEntry);
      // A sheet's Back step retains its live selections; another URL restores that entry's selections.
      if (nextEntry === entry.current) return;
      entry.current = nextEntry;
      restore(stored ?? readInventorySearch(new URLSearchParams(location.search)));
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
      let entry: URL;
      try {entry = new URL(origin.entry, location.origin);} catch {router.push('/cars'); return;}
      const entryPath = primaryHomePath(withoutLocale(entry.pathname));
      if (entry.origin === location.origin && (['/cars', '/luxe', '/saved'].includes(entryPath) || origin.home===true&&entryPath==='/')) {
        router.back();
        return;
      }
    }
    router.push('/cars');
  };
}
