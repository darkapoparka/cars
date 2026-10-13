import { featuredVehicles } from './inventory';
import { routeParts } from '$lib/locale/core';

/** Only known records can become contact context; free text is never a vehicle. */
export function selectedVehicle(value: string | null) {
  return value && /^[1-9]\d*$/.test(value)
    ? featuredVehicles.find(vehicle => vehicle.id === Number(value)) ?? null
    : null;
}

export function vehicleContactHref(id: number, topic: 'inspection' | 'leasing' = 'inspection'): `/contact?${string}` {
  return `/contact?${new URLSearchParams({ topic, vehicle: String(id) })}`;
}

/** Return links are confined to their own list, including its filters and anchor. */
export function listReturn(value: string | null, list: '/cars' | '/blog'): string {
  if (!value || /[\\\u0000-\u001f]/.test(value)) return list;
  try {
    const url = new URL(value, 'https://template.invalid');
    const parts = routeParts(url.pathname);
    const legacyInventory = list === '/cars' && parts.path === '/listing-grid';
    if (!value.startsWith('/') || url.origin !== 'https://template.invalid' || parts.base || (parts.path !== list && !legacyInventory)) return list;
    if (legacyInventory) url.pathname = url.pathname.slice(0, -parts.path.length) + '/cars';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return list; }
}

export function withListReturn(href: string, returnTo?: string) {
  return returnTo ? `${href}?${new URLSearchParams({ return: returnTo })}` : href;
}
