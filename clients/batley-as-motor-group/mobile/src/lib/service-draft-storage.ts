import {
  serializeServiceRequest,
  serviceRequestStorageKey,
  type ServiceRequestKind,
  type ServiceRequestValues,
} from './service-requests';

type StorageAccess = () => Pick<Storage, 'getItem' | 'setItem'>;

/** Access the storage getter inside the guard: browsers may deny the getter itself. */
export function readServiceDraft(kind: ServiceRequestKind, storage: StorageAccess): string {
  try {
    return storage().getItem(serviceRequestStorageKey(kind)) || '';
  } catch {
    return '';
  }
}

export function saveServiceDraft(
  kind: ServiceRequestKind,
  values: ServiceRequestValues,
  storage: StorageAccess,
): boolean {
  try {
    storage().setItem(serviceRequestStorageKey(kind), serializeServiceRequest(kind, values));
    return true;
  } catch {
    return false;
  }
}

export function isServiceDraftStorageEvent(
  kind: ServiceRequestKind,
  event: Pick<StorageEvent, 'key' | 'storageArea'>,
  storage: StorageAccess,
): boolean {
  if (event.key !== null && event.key !== serviceRequestStorageKey(kind)) return false;
  try {
    return event.storageArea === storage();
  } catch {
    return false;
  }
}
