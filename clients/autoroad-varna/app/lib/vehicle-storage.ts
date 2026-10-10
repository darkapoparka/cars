/** Browser-independent persistence rules; callers provide storage access. */
type StorageAccess = () => Pick<Storage, 'getItem' | 'setItem'>;
export const MAX_SAVED_VEHICLES = 500;
export const MAX_RECENT_VEHICLES = 12;
export function vehicleStorageKeys(id: string, mode: 'template' | 'dealer', mount: string) {
  // Keep the original unmounted template shortlist, but never migrate it into a dealer.
  if (mode === 'template' && !mount) return {saved: 'drive24:saved', recent: 'cars24:recent'};
  const scope = 'drive24:' + mode + ':' + encodeURIComponent(id) + ':' + encodeURIComponent(mount || '/');
  return {saved: scope + ':saved', recent: scope + ':recent'};
}
export function decodeVehicleList(value: string, limit = MAX_SAVED_VEHICLES): string[] {
  if (value.length > 262144) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length <= 200 && item.trim() === item);
    return [...new Set(valid)].slice(0, limit);
  } catch {return [];}
}
export function readVehicleList(storage: StorageAccess, key: string, fallback = '[]') {
  try {return storage().getItem(key) ?? fallback;} catch {return fallback;}
}
export function updateVehicleList(storage: StorageAccess, key: string, update: (previous: string[]) => string[], fallback = '[]', limit = MAX_SAVED_VEHICLES) {
  try {
    const target = storage();
    const previous = decodeVehicleList(target.getItem(key) ?? fallback, limit);
    const next = decodeVehicleList(JSON.stringify(update(previous)), limit);
    target.setItem(key, JSON.stringify(next));
    return true;
  } catch {return false;}
}
