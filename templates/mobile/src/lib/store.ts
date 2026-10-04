'use client';
import { useSyncExternalStore } from 'react';
import { defaultFilters, type Filters } from './types';
import { normalizeFilters } from './filters';
import { createInitialState, decodeState, type State } from './persistence';
const initial = createInitialState();
let state: State = initial;
let hydrated = false;
const listeners = new Set<() => void>();
const key = 'mobile-reference-v1';
const emit = () => {
  for (const listener of listeners) listener();
};
function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    state = decodeState(localStorage.getItem(key));
  } catch {
    state = createInitialState();
  }
}
export function hydrateStore() {
  ensureHydrated();
  emit();
}
export function syncStorage(event: StorageEvent) {
  if (event.key === key || event.key === null) {
    state = decodeState(event.newValue);
    hydrated = true;
    emit();
  }
}
export function patchState(patch: Partial<State>): boolean {
  // Child route effects may run before AppShell: hydrate before any first write.
  ensureHydrated();
  state = { ...state, ...patch };
  let persisted = false;
  try {
    localStorage.setItem(key, JSON.stringify({ ...state, toast: '' }));
    persisted = true;
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  emit();
  return persisted;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function useAppState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}
export function updateFilters(patch: Partial<Filters>) {
  ensureHydrated();
  patchState({ filters: normalizeFilters({ ...state.filters, ...patch }) });
}
export function resetFilters() {
  ensureHydrated();
  const filters = { ...structuredClone(defaultFilters), category: state.filters.category };
  patchState({
    filters,
    categoryFilters: { ...state.categoryFilters, [filters.category]: filters },
  });
}
export function togglePark(id: string) {
  ensureHydrated();
  const exists = state.parked.includes(id);
  patchState({
    parked: exists ? state.parked.filter((value) => value !== id) : [...state.parked, id],
    parkedAt: exists ? state.parkedAt : { ...state.parkedAt, [id]: Date.now() },
    toast: exists ? 'Car removed from saved cars' : 'Car saved on this device',
  });
}
export function saveSearch(name: string, filters: Filters) {
  ensureHydrated();
  patchState({
    saved: [
      ...state.saved,
      {
        id: crypto.randomUUID(),
        name: name.trim().slice(0, 80) || 'My search',
        filters: normalizeFilters(filters),
        notifications: true,
      },
    ],
    toast: 'Search saved on this device',
  });
}
export function markViewed(id: string) {
  ensureHydrated();
  if (state.viewed[0] !== id)
    patchState({ viewed: [id, ...state.viewed.filter((value) => value !== id)].slice(0, 20) });
}
export function saveMessageDraft(id: string, message: string): boolean {
  ensureHydrated();
  const persisted = patchState({
    messageDrafts: { ...state.messageDrafts, [id]: message.trim().slice(0, 4000) },
  });
  notify(
    persisted
      ? 'Message saved as a local draft. Nothing was sent.'
      : 'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.',
  );
  return persisted;
}
export function notify(toast: string) {
  // Transient feedback does not need a storage write.
  ensureHydrated();
  state = { ...state, toast };
  emit();
}

/** Remember the active image across gallery and detail navigation. */
export function setVehiclePhoto(id: string, index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= 1000) return;
  ensureHydrated();
  if (state.photoIndexes[id] === index) return;
  patchState({ photoIndexes: { ...state.photoIndexes, [id]: index } });
}

export function switchVehicleCategory(category: Filters['category']) {
  ensureHydrated();
  const previous = state.filters;
  const snapshots = { ...state.categoryFilters, [previous.category]: previous };
  let next =
    category === previous.category
      ? previous
      : snapshots[category] || { ...structuredClone(defaultFilters), category };
  if (category === 'truck')
    next = {
      ...next,
      details: next.details.filter((value) => !value.startsWith('truckCategory=')),
    };
  patchState({ filters: normalizeFilters(next), categoryFilters: snapshots });
  return state.filters;
}

export function removeParkedVehicle(id: string) {
  ensureHydrated();
  patchState({
    parked: state.parked.filter((value) => value !== id),
    parkedAt: { ...state.parkedAt, [id]: state.parkedAt[id] || Date.now() },
  });
}
