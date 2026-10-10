'use client';
import { useSyncExternalStore } from 'react';
import { defaultFilters, type Filters } from './types';
import { normalizeFilters } from './filters';
import { normalizeShowroomContactDetails, type ShowroomContactDetails } from './persistence';
import { createAppStore } from './app-store';

const store = createAppStore({
  isBrowser: () => typeof window !== 'undefined',
  getStorage: () => window.localStorage,
});
export const hydrateStore = store.hydrate;
export const syncStorage = store.syncStorage;
export const patchState = store.patch;

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
export function updateFilters(patch: Partial<Filters>) {
  const state = store.read();
  patchState({ filters: normalizeFilters({ ...state.filters, ...patch }) });
}
export function resetFilters() {
  const state = store.read();
  const filters = { ...structuredClone(defaultFilters), category: state.filters.category };
  patchState({
    filters,
    categoryFilters: { ...state.categoryFilters, [filters.category]: filters },
  });
}
export function togglePark(id: string) {
  const state = store.read();
  const exists = state.parked.includes(id);
  patchState({
    parked: exists ? state.parked.filter((value) => value !== id) : [...state.parked, id],
    parkedAt: exists ? state.parkedAt : { ...state.parkedAt, [id]: Date.now() },
    toast: exists ? 'Car removed from saved cars' : 'Car saved on this device',
  });
}
export function saveSearch(name: string, filters: Filters) {
  const state = store.read();
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
  const state = store.read();
  if (state.viewed[0] !== id)
    patchState({ viewed: [id, ...state.viewed.filter((value) => value !== id)].slice(0, 20) });
}
export function saveMessageDraft(
  id: string,
  message: string,
  details?: ShowroomContactDetails,
): boolean {
  const state = store.read();
  const persisted = patchState({
    messageDrafts: { ...state.messageDrafts, [id]: message.trim().slice(0, 4000) },
    ...(details
      ? {
          showroomContactDetails: {
            ...state.showroomContactDetails,
            [id]: normalizeShowroomContactDetails(details),
          },
        }
      : {}),
  });
  notify(
    persisted
      ? 'Message saved as a local draft. Nothing was sent.'
      : 'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.',
  );
  return persisted;
}
export const notify = store.notify;

/** Remember the active image across gallery and detail navigation. */
export function setVehiclePhoto(id: string, index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= 1000) return;
  const state = store.read();
  if (state.photoIndexes[id] === index) return;
  patchState({ photoIndexes: { ...state.photoIndexes, [id]: index } });
}

export function switchVehicleCategory(category: Filters['category']) {
  const state = store.read();
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
  return store.getSnapshot().filters;
}

export function removeParkedVehicle(id: string) {
  const state = store.read();
  patchState({
    parked: state.parked.filter((value) => value !== id),
    parkedAt: { ...state.parkedAt, [id]: state.parkedAt[id] || Date.now() },
  });
}
