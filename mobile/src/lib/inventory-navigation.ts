import { storageKeys } from './showroom-config';

type InventoryContext = { href: string; scrollY: number; vehicleId: string; vehicleIds?: string[] };
const contextKey = storageKeys.inventoryContext;
const restoreKey = storageKeys.restoreInventory;

export function rememberInventory(vehicleId: string): void {
  try {
    const href = window.location.pathname + window.location.search;
    const previous = inventoryContext();
    const fromInventory =
      window.location.pathname === '/' || window.location.pathname === '/car-park';
    if (!fromInventory && !previous) return;
    sessionStorage.setItem(
      contextKey,
      JSON.stringify({
        href: fromInventory ? href : previous?.href,
        scrollY: fromInventory ? window.scrollY : previous?.scrollY,
        vehicleId,
        vehicleIds: fromInventory
          ? [vehicleId]
          : [...new Set([previous?.vehicleId || '', ...(previous?.vehicleIds || []), vehicleId])]
              .filter(Boolean)
              .slice(-50),
      }),
    );
  } catch {
    // Browsing remains usable when session storage is unavailable.
  }
}

function inventoryContext(): InventoryContext | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(contextKey) || 'null');
    if (
      value &&
      typeof value.href === 'string' &&
      (value.href === '/' || value.href.startsWith('/?') || value.href === '/car-park') &&
      typeof value.vehicleId === 'string' &&
      (value.vehicleIds === undefined ||
        (Array.isArray(value.vehicleIds) &&
          value.vehicleIds.every((id: unknown) => typeof id === 'string'))) &&
      Number.isFinite(value.scrollY) &&
      value.scrollY >= 0
    )
      return value;
  } catch {
    // A missing or corrupt browsing record falls back to Cars.
  }
  return null;
}

export function inventoryReturnHref(vehicleId: string): string {
  const context = inventoryContext();
  if (!context || (context.vehicleId !== vehicleId && !context.vehicleIds?.includes(vehicleId)))
    return '/';
  try {
    sessionStorage.setItem(restoreKey, context.href);
  } catch {
    // URL-based filters still restore without a stored scroll position.
  }
  return context.href;
}

export function inventoryCanGoBack(vehicleId: string): boolean {
  const context = inventoryContext();
  return Boolean(
    context &&
    (context.vehicleId === vehicleId || context.vehicleIds?.includes(vehicleId)) &&
    window.history.length > 1,
  );
}

export function restoreInventoryPosition(): () => void {
  const context = inventoryContext();
  let frame = 0;
  try {
    const href = window.location.pathname + window.location.search;
    if (context && context.href === href && sessionStorage.getItem(restoreKey) === href) {
      sessionStorage.removeItem(restoreKey);
      frame = requestAnimationFrame(() => window.scrollTo(0, context.scrollY));
    }
  } catch {
    // Native browser Back also restores scroll without this optional record.
  }
  return () => cancelAnimationFrame(frame);
}
