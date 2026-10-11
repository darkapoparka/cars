const applicationKeys = ['cars24Inventory', 'cars24InventoryReturn', 'cars24Modal', 'cars24Overlay'] as const;
export function applicationHistoryState(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(applicationKeys.filter(key => Object.hasOwn(source, key)).map(key => [key, source[key]]));
}
