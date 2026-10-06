'use client';

import {createContext, useContext, type ReactNode} from 'react';
import {withoutLocale, withoutMount} from '@/lib/paths';

const AlternativeHomeContext = createContext(false);
const routes = new Set(['/', '/cars', '/saved', '/more', '/search', '/sell', '/sell/details', '/finance', '/service', '/service/details', '/services', '/stores']);

export function isHomeAlternative(pathname: string) {
  return pathname === '/2' || pathname.startsWith('/2/');
}

export function primaryHomePath(pathname: string) {
  return isHomeAlternative(pathname) ? pathname.slice(2) || '/' : pathname;
}

/** Keep the comparison journey on its aliases; detail and enquiry routes stay shared. */
export function homeAlternativeHref(href: string, enabled: boolean) {
  if (!enabled || !href.startsWith('/') || href.startsWith('//')) return href;
  const [, path, suffix] = href.match(/^([^?#]*)(.*)$/) ?? [];
  if (!path) return href;
  const route = withoutLocale(path);
  if (!routes.has(route)) return href;
  const locale = withoutMount(path).match(/^\/(?:en|bg)(?=\/|$)/)?.[0] ?? '';
  return `${locale}/2${route === '/' ? '' : route}${suffix}`;
}

export function HomeAlternativeProvider({enabled, children}: {enabled: boolean; children: ReactNode}) {
  return <AlternativeHomeContext.Provider value={enabled}>{children}</AlternativeHomeContext.Provider>;
}

export function useHomeAlternative() {
  return useContext(AlternativeHomeContext);
}
