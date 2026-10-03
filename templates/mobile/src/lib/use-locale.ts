'use client';
import { useSyncExternalStore } from 'react';
import {
  defaultLocale,
  localeMoney,
  localeNumber,
  translate,
  validLocale,
  type Locale,
} from './locale';

const key = 'cars-mobile-language';
const listeners = new Set<() => void>();
let current: Locale = defaultLocale;
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function publish(locale: Locale) {
  if (current === locale) return;
  current = locale;
  listeners.forEach((listener) => listener());
}
export function hydrateLocale() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (validLocale(requested)) {
    publish(requested);
    try {
      localStorage.setItem(key, requested);
    } catch {
      /* The session remains usable. */
    }
    return;
  }
  try {
    const saved = localStorage.getItem(key);
    if (validLocale(saved)) publish(saved);
  } catch {
    /* Bulgarian remains the default without storage. */
  }
}
export function setLocale(locale: Locale) {
  publish(locale);
  try {
    localStorage.setItem(key, locale);
  } catch {
    /* Keep the current session language. */
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}
export function useLocale() {
  const locale = useSyncExternalStore(
    subscribe,
    () => current,
    () => defaultLocale,
  );
  return {
    locale,
    setLocale,
    t: (message: string) => translate(message, locale),
    money: (value: number) => localeMoney(value, locale),
    number: (value: number) => localeNumber(value, locale),
  };
}
