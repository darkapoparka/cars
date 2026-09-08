import catalog from './generated/catalog.json';
export interface Vehicle { id: string; title: string; href: string; image: string; price: number; classes: string[]; html: string; specs: Record<string, string | undefined>; }
export function readIds(key: string): string[] { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter(x => typeof x === 'string') : []; } catch { return []; } }
export function getCatalog(): Vehicle[] {
  return catalog as Vehicle[];
}
