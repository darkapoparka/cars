'use client';
import { useCallback, useSyncExternalStore } from 'react';
import type { ServiceRequestKind, ServiceRequestValues } from './service-requests';
import {
  isServiceDraftStorageEvent,
  readServiceDraft,
  saveServiceDraft,
} from './service-draft-storage';

const draftEvent = 'cars-service-draft-change';
const getStorage = () => window.localStorage;
const serverSnapshot = () => '';

export function useServiceDraft(kind: ServiceRequestKind) {
  const subscribe = useCallback(
    (listener: () => void) => {
      const storageChanged = (event: StorageEvent) => {
        if (isServiceDraftStorageEvent(kind, event, getStorage)) listener();
      };
      const localChanged = (event: Event) => {
        if (event instanceof CustomEvent && event.detail === kind) listener();
      };
      window.addEventListener('storage', storageChanged);
      window.addEventListener(draftEvent, localChanged);
      return () => {
        window.removeEventListener('storage', storageChanged);
        window.removeEventListener(draftEvent, localChanged);
      };
    },
    [kind],
  );
  const getSnapshot = useCallback(() => readServiceDraft(kind, getStorage), [kind]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  const persist = useCallback(
    (values: ServiceRequestValues) => {
      const saved = saveServiceDraft(kind, values, getStorage);
      if (saved) window.dispatchEvent(new CustomEvent(draftEvent, { detail: kind }));
      return saved;
    },
    [kind],
  );
  return { raw, persist };
}
