import { defaultFilters, type Filters, type SavedSearch } from './types';
import { normalizeFilters } from './filters';
export type ShowroomContactDetails = { name: string; phone: string; email: string };
export type State = {
  filters: Filters;
  inventorySort: string;
  categoryFilters: Partial<Record<Filters['category'], Filters>>;
  parked: string[];
  parkedAt: Record<string, number>;
  parkNotes: Record<string, string>;
  parkNoticeDismissed: boolean;
  saved: SavedSearch[];
  dealers: string[];
  checklist: string[];
  viewed: string[];
  messageDrafts: Record<string, string>;
  showroomContactDetails: Record<string, ShowroomContactDetails>;
  view: 'list' | 'grid';
  theme: 'light' | 'dark';
  language: string;
  email: string;
  notifications: boolean;
  readWelcome: boolean;
  photoIndexes: Record<string, number>;
  consent: boolean;
  draft: Record<string, string>;
  toast: string;
};
export function createInitialState(): State {
  return {
    filters: structuredClone(defaultFilters),
    inventorySort: 'standard',
    categoryFilters: {},
    parked: [],
    parkedAt: {},
    parkNotes: {},
    parkNoticeDismissed: false,
    saved: [],
    dealers: [],
    checklist: [],
    viewed: [],
    messageDrafts: {},
    showroomContactDetails: {},
    view: 'list',
    theme: 'light',
    language: 'English',
    email: '',
    notifications: true,
    readWelcome: false,
    photoIndexes: {},
    consent: false,
    draft: {},
    toast: '',
  };
}
function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (item): item is string =>
              typeof item === 'string' && item.length > 0 && item.length <= 200,
          ),
        ),
      ].slice(0, 200)
    : [];
}
const reservedKeys = new Set(['__proto__', 'constructor', 'prototype']);
function validRecordKey(key: string): boolean {
  // Reject rather than truncate keys: truncation can merge unrelated records.
  return key.length > 0 && key.length <= 100 && !reservedKeys.has(key);
}
function textRecord(value: unknown): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record(value))
      .filter(([key, text]) => validRecordKey(key) && typeof text === 'string')
      .slice(0, 100)
      .map(([key, text]) => [key.slice(0, 100), String(text).slice(0, 4000)]),
  );
}
export function normalizeShowroomContactDetails(value: unknown): ShowroomContactDetails {
  const data = record(value);
  const text = (key: string, limit: number) =>
    typeof data[key] === 'string' ? data[key].trim().slice(0, limit) : '';
  return { name: text('name', 80), phone: text('phone', 60), email: text('email', 254) };
}
/** Only known, validated fields survive an old/corrupt browser-storage record. */
export function decodeState(raw: string | null): State {
  const initial = createInitialState();
  if (!raw) return initial;
  try {
    const data = record(JSON.parse(raw));
    const result: State = { ...initial, filters: normalizeFilters(data.filters) };
    if (
      ['standard', 'price-asc', 'price-desc', 'newest', 'mileage'].includes(
        String(data.inventorySort),
      )
    )
      result.inventorySort = String(data.inventorySort);
    for (const key of ['parked', 'dealers', 'checklist', 'viewed'] as const)
      result[key] = strings(data[key]);
    for (const key of ['notifications', 'consent', 'readWelcome', 'parkNoticeDismissed'] as const)
      if (typeof data[key] === 'boolean') result[key] = data[key];
    result.theme = data.theme === 'dark' ? 'dark' : 'light';
    result.view = data.view === 'grid' ? 'grid' : 'list';
    result.email = data.email === 'demo@example.test' ? data.email : '';
    for (const category of ['car', 'bike', 'electric-bike', 'motorhome', 'truck'] as const) {
      const stored = record(data.categoryFilters)[category];
      if (stored) result.categoryFilters[category] = { ...normalizeFilters(stored), category };
    }
    result.draft = textRecord(data.draft);

    result.messageDrafts = textRecord(data.messageDrafts);
    result.showroomContactDetails = Object.fromEntries(
      Object.entries(record(data.showroomContactDetails))
        .filter(([key]) => validRecordKey(key))
        .slice(0, 100)
        .map(([key, value]) => [key.slice(0, 100), normalizeShowroomContactDetails(value)]),
    );
    result.parkNotes = textRecord(data.parkNotes);
    result.parkedAt = Object.fromEntries(
      Object.entries(record(data.parkedAt))
        .filter(
          (entry): entry is [string, number] =>
            validRecordKey(entry[0]) &&
            typeof entry[1] === 'number' &&
            Number.isFinite(entry[1]) &&
            entry[1] >= 0,
        )
        .slice(0, 200),
    );
    result.photoIndexes = Object.fromEntries(
      Object.entries(record(data.photoIndexes))
        .filter(
          (entry): entry is [string, number] =>
            validRecordKey(entry[0]) &&
            typeof entry[1] === 'number' &&
            Number.isInteger(entry[1]) &&
            entry[1] >= 0 &&
            entry[1] < 1000,
        )
        .slice(0, 200),
    );
    if (Array.isArray(data.saved)) {
      const savedIds = new Set<string>();
      result.saved = data.saved.slice(0, 100).flatMap((value) => {
        const item = record(value);
        if (
          typeof item.id !== 'string' ||
          typeof item.name !== 'string' ||
          !item.id ||
          !item.name.trim()
        )
          return [];
        const id = item.id.slice(0, 100);
        if (savedIds.has(id)) return [];
        savedIds.add(id);
        return [
          {
            id,
            name: item.name.trim().slice(0, 80),
            filters: normalizeFilters(item.filters),
            notifications: item.notifications !== false,
          },
        ];
      });
    }
    return result;
  } catch {
    return initial;
  }
}
