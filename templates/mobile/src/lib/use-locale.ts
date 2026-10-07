'use client';
import { useSyncExternalStore } from 'react';
import { localeMoney, localeNumber, translate, validLocale, type Locale } from './locale';
import { createLocaleStore } from './locale-store';

const store = createLocaleStore({
  isBrowser: () => typeof window !== 'undefined',
  getStorage: () => window.localStorage,
  getSearch: () => window.location.search,
});
export const hydrateLocale = store.hydrate;
export const syncLocale = store.syncStorage;
export function setLocale(locale: Locale) {
  if (typeof window === 'undefined' || !validLocale(locale)) return;
  store.set(locale);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}
export function useLocale() {
  const locale = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return {
    locale,
    setLocale,
    t: (message: string) => translate(message, locale),
    money: (value: number) => localeMoney(value, locale),
    number: (value: number) => localeNumber(value, locale),
  };
}
