'use client';

import {createContext, useCallback, useContext, useSyncExternalStore, type ReactNode} from 'react';
import dynamic from 'next/dynamic';
import {getVehicle} from '@/lib/data';
import {withoutLocale} from '@/lib/paths';

const VehicleDrawer = dynamic(() => import('@/components/VehicleDrawer'));
const VehicleDrawerContext = createContext<((href: string) => boolean) | null>(null);
const changeEvent = 'cars-app-vehicle';

function selectedSlug() {
  const slug = new URLSearchParams(location.hash.slice(1)).get('vehicle') || '';
  return getVehicle(slug) ? slug : '';
}
function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify);
  window.addEventListener('hashchange', notify);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener('popstate', notify);
    window.removeEventListener('hashchange', notify);
    window.removeEventListener(changeEvent, notify);
  };
}
function notify() {window.dispatchEvent(new Event(changeEvent));}

/** Keep the live collection mounted, including filters, scroll and the focused card. */
export default function VehicleDrawerProvider({children}: {children: ReactNode}) {
  const slug = useSyncExternalStore(subscribe, selectedSlug, () => '');
  const open = useCallback((href: string) => {
    const destination = new URL(href, location.origin);
    const match = /^\/cars\/([^/]+)$/.exec(withoutLocale(destination.pathname));
    if (destination.origin !== location.origin || !match || !getVehicle(match[1])) return false;
    const previous = selectedSlug();
    if (previous === match[1]) return true;
    if (previous && history.state?.cars24Modal) {
      // Unwind a child sheet before replacing its parent's vehicle entry.
      window.addEventListener('popstate', () => {
        history.replaceState({...history.state, cars24Vehicle: match[1]}, '', '#vehicle=' + encodeURIComponent(match[1]));
        notify();
      }, {once: true});
      history.back();
      return true;
    }
    const state = {...history.state, cars24Vehicle: match[1]};
    // Selecting a similar car replaces this drawer rather than stacking detail screens.
    if (previous) {delete state.cars24Modal; history.replaceState(state, '', '#vehicle=' + encodeURIComponent(match[1]));}
    else history.pushState(state, '', '#vehicle=' + encodeURIComponent(match[1]));
    notify();
    return true;
  }, []);
  const close = useCallback(() => {
    if (history.state?.cars24Vehicle === selectedSlug()) history.back();
    else {
      const state = {...history.state};
      delete state.cars24Vehicle;
      history.replaceState(state, '', location.pathname + location.search);
      notify();
    }
  }, []);
  return <VehicleDrawerContext.Provider value={open}>{children}{slug ? <VehicleDrawer key={slug} vehicle={getVehicle(slug)!} onClose={close}/> : null}</VehicleDrawerContext.Provider>;
}

export function useVehicleDrawer() {return useContext(VehicleDrawerContext);}
