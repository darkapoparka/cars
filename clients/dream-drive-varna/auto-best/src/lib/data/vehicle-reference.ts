import { resolveImportUrl } from './company';

/** A user-supplied reference only; this does not fetch an ad or decode a VIN. */
export function parseVehicleReference(value: string): { kind: 'vin' | 'listing'; value: string } | null {
  const candidate = value.trim();
  if (/^[A-HJ-NPR-Z0-9]{17}$/i.test(candidate)) return { kind: 'vin', value: candidate.toUpperCase() };
  const withProtocol = /^[\w-]+(?:\.[\w-]+)+(?:[/:?#]|$)/.test(candidate) ? `https://${candidate}` : candidate;
  const url = resolveImportUrl(withProtocol);
  return url ? { kind: 'listing', value: url } : null;
}
