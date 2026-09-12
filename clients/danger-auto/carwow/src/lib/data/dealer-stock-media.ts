/** Paths in the committed, source-reviewed inventory pack. Never fetch remote URLs here. */
export const missingStockImage = '/assets/images/lead/stock-photo-pending.svg';

export function localStockImages(values: readonly unknown[] | null | undefined): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string =>
    typeof value === 'string' &&
    /^\/assets\/images\/lead\/[a-zA-Z0-9][a-zA-Z0-9_./-]*\.(?:avif|webp|png|jpe?g)$/i.test(value) &&
    !value.includes('..') && !value.includes('//')
  ))];
}

export function stockGallery(values: readonly unknown[] | null | undefined): string[] {
  const images = localStockImages(values);
  return images.length ? images : [missingStockImage];
}
