import type {AppLocale} from './dealer-config';
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
export function assetPath<T>(source: T): T {
  if (typeof source !== 'string' || !source.startsWith('/') || source.startsWith('//')) return source;
  if (!basePath || source === basePath || source.startsWith(basePath + '/')) return source;
  return (basePath + source) as T;
}
export function withoutMount(pathname: string): string {
  return basePath && (pathname === basePath || pathname.startsWith(basePath + '/'))
    ? pathname.slice(basePath.length) || '/' : pathname;
}
export function withoutLocale(pathname: string): string {
  return withoutMount(pathname).replace(/^\/(?:en|bg)(?=\/|$)/, '') || '/';
}
export function localePath(href: string, locale: AppLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const relative = withoutMount(href);
  if (/^\/(?:en|bg)(?=\/|\?|#|$)/.test(relative)) return relative;
  return '/' + locale + (relative === '/' ? '' : relative);
}
export const browserPath = (href: string, locale: AppLocale) => assetPath(localePath(href, locale));
