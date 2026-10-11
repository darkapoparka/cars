import { defaultLocale, validLocale, type Locale } from './locale';
import { storageKeys } from './showroom-config';
import type { StateStorageEvent, StoreEnvironment } from './app-store';

type LocaleEnvironment = StoreEnvironment & { getSearch(): string };

/** Locale synchronization shares the same isolated, injectable browser boundary as app state. */
export function createLocaleStore(environment: LocaleEnvironment, key = storageKeys.language) {
  let current: Locale = defaultLocale;
  const listeners = new Set<() => void>();
  const requested = () => new URLSearchParams(environment.getSearch()).get('lang');
  function publish(locale: Locale) {
    if (current === locale) return;
    current = locale;
    listeners.forEach((listener) => listener());
  }
  function persist(locale: Locale): boolean {
    try {
      environment.getStorage().setItem(key, locale);
      return true;
    } catch {
      return false;
    }
  }
  function hydrate() {
    if (!environment.isBrowser()) return;
    const locale = requested();
    if (validLocale(locale)) {
      publish(locale);
      persist(locale);
      return;
    }
    try {
      const saved = environment.getStorage().getItem(key);
      publish(validLocale(saved) ? saved : defaultLocale);
    } catch {
      // Preserve the active language if storage becomes unavailable.
    }
  }
  function syncStorage(event: StateStorageEvent): boolean {
    if (!environment.isBrowser() || (event.key !== key && event.key !== null)) return false;
    try {
      const storage = environment.getStorage();
      if (storage !== event.storageArea) return false;
      const locale = requested();
      const saved = storage.getItem(key);
      publish(validLocale(locale) ? locale : validLocale(saved) ? saved : defaultLocale);
    } catch {
      return false;
    }
    // Synchronization is read-only: unrelated events and clear never echo writes.
    return true;
  }
  return {
    hydrate,
    syncStorage,
    set(locale: Locale): boolean {
      if (!environment.isBrowser() || !validLocale(locale)) return false;
      publish(locale);
      return persist(locale);
    },
    getSnapshot: () => current,
    getServerSnapshot: () => defaultLocale,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
