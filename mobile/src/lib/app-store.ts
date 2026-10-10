import { createInitialState, decodeState, type State } from './persistence';
import { storageKeys } from './showroom-config';

export const appStateStorageKey = storageKeys.appState;

/** The domain store needs no React, DOM or global browser state. */
export type StateStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};
export type StoreEnvironment = {
  isBrowser(): boolean;
  getStorage(): StateStorage;
};
export type StateStorageEvent = {
  key: string | null;
  storageArea: StateStorage | null;
};

export function createAppStore(environment: StoreEnvironment, storageKey = appStateStorageKey) {
  const initial = createInitialState();
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of listeners) listener();
  };

  function read(): State {
    if (!hydrated && environment.isBrowser()) {
      hydrated = true;
      try {
        state = decodeState(environment.getStorage().getItem(storageKey));
      } catch {
        // Denied storage must not prevent a usable in-memory session.
        state = createInitialState();
      }
    }
    return state;
  }

  function hydrate() {
    read();
    emit();
  }

  function patch(patch: Partial<State>): boolean {
    // Route effects can run before AppShell's hydration effect.
    read();
    // Never mutate a process-wide snapshot while rendering on the server.
    if (!environment.isBrowser()) return false;
    state = { ...state, ...patch };
    let persisted = false;
    try {
      environment.getStorage().setItem(storageKey, JSON.stringify({ ...state, toast: '' }));
      persisted = true;
    } catch {
      // Preserve this session's changes when storage is denied or full.
    }
    emit();
    return persisted;
  }

  function syncStorage(event: StateStorageEvent): boolean {
    if (!environment.isBrowser()) return false;
    if (event.key !== storageKey && event.key !== null) return false;
    try {
      const storage = environment.getStorage();
      // sessionStorage has its own events; they must not reset the app store.
      if (event.storageArea !== storage) return false;
      // Read the latest value, not a queued event's potentially stale newValue.
      state = decodeState(storage.getItem(storageKey));
      hydrated = true;
    } catch {
      return false;
    }
    emit();
    return true;
  }

  function notify(toast: string) {
    read();
    if (!environment.isBrowser()) return;
    state = { ...state, toast };
    emit();
  }

  return {
    read,
    hydrate,
    patch,
    syncStorage,
    notify,
    // Stable, side-effect-free snapshots are required by useSyncExternalStore.
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
