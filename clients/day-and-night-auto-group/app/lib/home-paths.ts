import {withoutLocale, withoutMount} from './paths';

const routes = new Set(['/', '/cars', '/saved', '/more', '/search', '/sell', '/sell/details', '/finance', '/service', '/service/details', '/services', '/stores', '/shop']);

export function isHomeAlternative(pathname: string) {
  return pathname === '/2' || pathname.startsWith('/2/');
}

export function primaryHomePath(pathname: string) {
  return isHomeAlternative(pathname) ? pathname.slice(2) || '/' : pathname;
}

/** The Services dock owns the hub and all three journeys, including nested screens. */
export function isServicesRoute(pathname: string) {
  const path = primaryHomePath(pathname);
  return ['/services', '/sell', '/finance', '/service'].some(route => path === route || path.startsWith(route + '/'));
}

/** Keep the comparison journey on its aliases; detail and enquiry routes stay shared. */
export function homeAlternativeHref(href: string, enabled: boolean) {
  if (!enabled || !href.startsWith('/') || href.startsWith('//')) return href;
  const [, path, suffix] = href.match(/^([^?#]*)(.*)$/) ?? [];
  if (!path) return href;
  const route = withoutLocale(path);
  if (!routes.has(route)) return href;
  const locale = withoutMount(path).match(/^\/(?:en|bg)(?=\/|$)/)?.[0] ?? '';
  return `${locale}/2${route === '/' ? '' : route}${suffix}`;
}

