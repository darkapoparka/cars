import { mobileActionArtwork } from '$data/feature-artwork';
// Shared decorative silver service family; see provenance/silver-service-system-2026-10-04.md.
export const serviceArtwork = {
  car: mobileActionArtwork.collection,
  value: mobileActionArtwork.sell,
  contact: mobileActionArtwork.import,
  finance: mobileActionArtwork.finance
} as const;
