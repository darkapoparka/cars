export const vehicleDetailSections = [
  { value: 'details', label: 'Details' },
  { value: 'photos', label: 'Photos' },
  { value: 'features', label: 'Features' },
] as const;

export type VehicleDetailSection = (typeof vehicleDetailSections)[number]['value'];

export function vehicleDetailSection(value: unknown): VehicleDetailSection {
  return vehicleDetailSections.find((section) => section.value === value)?.value || 'details';
}

export function vehicleDetailHashSection(hash: string): VehicleDetailSection {
  return vehicleDetailSection(hash.replace(/^#/, ''));
}

export function vehicleDetailSectionHref(href: string, section: VehicleDetailSection): string {
  const url = new URL(href, 'http://localhost');
  return url.pathname + url.search + (section === 'details' ? '' : '#' + section);
}

export function vehicleGalleryHref(vehicleId: string, section: VehicleDetailSection): string {
  return (
    '/vehicle/' +
    encodeURIComponent(vehicleId) +
    '/gallery' +
    (section === 'details' ? '' : '?returnSection=' + section)
  );
}

export function vehicleGalleryReturnHref(vehicleId: string, section: unknown): string {
  return vehicleDetailSectionHref(
    '/vehicle/' + encodeURIComponent(vehicleId),
    vehicleDetailSection(section),
  );
}

export function vehiclePhotoViewerState(state: unknown, vehicleId: string, index: number) {
  const previous = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  return { ...previous, carsMobilePhotoViewer: { vehicleId, index } };
}

export function vehiclePhotoViewerIndex(
  state: unknown,
  vehicleId: string,
  count: number,
): number | null {
  if (!Number.isInteger(count) || count <= 0) return null;
  if (!state || typeof state !== 'object' || !('carsMobilePhotoViewer' in state)) return null;
  const photo = state.carsMobilePhotoViewer;
  if (!photo || typeof photo !== 'object' || !('vehicleId' in photo) || !('index' in photo))
    return null;
  return photo.vehicleId === vehicleId &&
    typeof photo.index === 'number' &&
    Number.isInteger(photo.index) &&
    photo.index >= 0 &&
    photo.index < count
    ? photo.index
    : null;
}
