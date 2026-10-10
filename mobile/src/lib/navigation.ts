import { vehicles } from './catalog';
const roots = new Set([
  '/',
  '/search',
  '/results',
  '/sell/create',
  '/sell/direct',
  '/sell/valuation',
  '/profile',
  '/messages',
  '/my-searches',
  '/car-park',
]);
export function localReturnPath(value: string): string {
  const pathname = value.split(/[?#]/)[0];
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/profile';
  if (roots.has(pathname)) return value;
  for (const vehicle of vehicles) {
    for (const suffix of ['', '/gallery', '/message', '/checklist']) {
      if (pathname === '/vehicle/' + vehicle.id + suffix) return value;
    }
  }
  return '/profile';
}
