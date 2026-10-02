'use client';

import {useCallback, useMemo, useState, useSyncExternalStore} from 'react';

export const SAVED_KEY = 'drive24:saved';
const RECENT_KEY = 'cars24:recent';
const CHANGE_EVENT = 'drive24:saved-change';
const SEED_RECENT = '["2024-toyota-fortuner-exr"]';
const empty = () => '[]';
function read(key: string, fallback = '[]') {
  try {return localStorage.getItem(key) ?? fallback;} catch {return fallback;}
}
function decode(value: string): string[] {
  try {const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];} catch {return [];}
}
function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {window.removeEventListener('storage', notify); window.removeEventListener(CHANGE_EVENT, notify);};
}
const savedSnapshot = () => read(SAVED_KEY);
const recentSnapshot = () => read(RECENT_KEY, SEED_RECENT);
const recentServerSnapshot = () => SEED_RECENT;
export function useSavedVehicles() {
  const snapshot = useSyncExternalStore(subscribe, savedSnapshot, empty);
  return useMemo(() => decode(snapshot), [snapshot]);
}
export function useRecentVehicles() {
  const snapshot = useSyncExternalStore(subscribe, recentSnapshot, recentServerSnapshot);
  return useMemo(() => decode(snapshot), [snapshot]);
}
export function useSavedVehicle(slug: string) {
  const saved = useSavedVehicles().includes(slug);
  const [error, setError] = useState('');
  const change = useCallback((value?: boolean) => {
    try {
      const previous = decode(localStorage.getItem(SAVED_KEY) ?? '[]');
      const save = value ?? !previous.includes(slug);
      const next = previous.filter(item => item !== slug);
      if (save) next.push(slug);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
      setError('');
      return true;
    } catch {setError('This browser could not update saved cars. Please allow local storage and try again.'); return false;}
  }, [slug]);
  const toggle = useCallback(() => change(), [change]);
  const remove = useCallback(() => change(false), [change]);
  const clearError = useCallback(() => setError(''), []);
  return {saved, toggle, remove, error, clearError};
}
export function recordVehicleView(slug: string) {
  try {
    const recent = decode(read(RECENT_KEY, SEED_RECENT));
    localStorage.setItem(RECENT_KEY, JSON.stringify([slug, ...recent.filter(item => item !== slug)].slice(0, 12)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch { /* Browsing remains available when local storage is blocked. */ }
}
