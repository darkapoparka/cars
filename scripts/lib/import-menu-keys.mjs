// Dealer overlays can point several menu cards to the same inventory route.
// The fixed menu slot is part of identity; href alone is never a unique row key.
const previous = '{#each item.megaMenu.vehicles as vehicle (vehicle.href)}';
const interim = '{#each item.megaMenu.vehicles as vehicle (`${vehicle.href}:${vehicle.label}`)}';
const corrected = '{#each item.megaMenu.vehicles as vehicle, vehicleIndex (`${vehicle.href}:${vehicle.label}:${vehicleIndex}`)}';
export function ensureImportMenuKeys(source) {
  if (typeof source !== 'string') throw new TypeError('Expected Svelte source text');
  if (source.includes(corrected)) return source;
  const anchor = source.includes(interim) ? interim : previous;
  if (source.split(anchor).length !== 2) {
    throw new Error('Import menu key contract changed; inspect the component before refreshing');
  }
  return source.replace(anchor, corrected);
}
export const importMenuKeyContract = { previous, interim, corrected };
