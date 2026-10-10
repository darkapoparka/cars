'use client';

import {useCallback, useMemo, useState, useSyncExternalStore} from 'react';
import {dealer, isDealer} from '@/lib/dealer-config';
import {basePath} from '@/lib/paths';
import {decodeVehicleList, MAX_RECENT_VEHICLES, readVehicleList, updateVehicleList, vehicleStorageKeys} from '@/lib/vehicle-storage';

const keys = vehicleStorageKeys(dealer.id, dealer.mode, basePath);
export const SAVED_KEY = keys.saved;
const RECENT_KEY = keys.recent;
const CHANGE_EVENT = 'drive24:saved-change';
const SEED_RECENT = isDealer ? '[]' : '["2024-toyota-fortuner-exr"]';
const empty = () => '[]';
const storage = () => window.localStorage;
function subscription(key: string) {
  return (notify: () => void) => {
    const onStorage = (event: StorageEvent) => {if (event.key === null || event.key === key) notify();};
    const onChange = (event: Event) => {if (!(event instanceof CustomEvent) || event.detail === key) notify();};
    window.addEventListener('storage', onStorage);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {window.removeEventListener('storage', onStorage); window.removeEventListener(CHANGE_EVENT, onChange);};
  };
}
const subscribeSaved = subscription(SAVED_KEY);
const subscribeRecent = subscription(RECENT_KEY);
const savedSnapshot = () => readVehicleList(storage, SAVED_KEY);
const recentSnapshot = () => readVehicleList(storage, RECENT_KEY, SEED_RECENT);
const recentServerSnapshot = () => SEED_RECENT;
const notifyChange = (key: string) => window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {detail: key}));
export function useSavedVehicles() {
  const snapshot = useSyncExternalStore(subscribeSaved, savedSnapshot, empty);
  return useMemo(() => decodeVehicleList(snapshot), [snapshot]);
}
export function useRecentVehicles() {
  const snapshot = useSyncExternalStore(subscribeRecent, recentSnapshot, recentServerSnapshot);
  return useMemo(() => decodeVehicleList(snapshot, MAX_RECENT_VEHICLES), [snapshot]);
}
export function useSavedVehicle(slug: string) {
  const saved = useSavedVehicles().includes(slug);
  const [error, setError] = useState('');
  const change = useCallback((value?: boolean) => {
    const success = updateVehicleList(storage, SAVED_KEY, previous => {
      const save = value ?? !previous.includes(slug);
      const next = previous.filter(item => item !== slug);
      // Preserve every existing saved car when capacity is reached: fail instead of silently dropping a new save.
      if (save) next.push(slug);
      if (decodeVehicleList(JSON.stringify(next)).length !== next.length) throw new Error('Saved cars limit reached');
      return next;
    });
    if (success) {notifyChange(SAVED_KEY); setError('');}
    else setError('This browser could not update saved cars. Please allow local storage and try again.');
    return success;
  }, [slug]);
  const toggle = useCallback(() => change(), [change]);
  const remove = useCallback(() => change(false), [change]);
  const clearError = useCallback(() => setError(''), []);
  return {saved, toggle, remove, error, clearError};
}
export function recordVehicleView(slug: string) {
  if (updateVehicleList(storage, RECENT_KEY, previous => [slug, ...previous.filter(item => item !== slug)], SEED_RECENT, MAX_RECENT_VEHICLES)) notifyChange(RECENT_KEY);
}
