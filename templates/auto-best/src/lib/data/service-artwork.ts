import { mobileActionArtwork } from '$data/feature-artwork';
// Generated decorative service art; not inventory photography. See provenance/service-cards-2026-09-10.md.
export const serviceArtwork = {
  car: { src: '/assets/images/template/service-car-v1.webp', width: 1536, height: 1024, crop: [65, 160, 1390, 720] },
  value: mobileActionArtwork.sell,
  contact: mobileActionArtwork.import,
  finance: { src: '/assets/images/template/service-leasing-v1.webp', width: 1536, height: 1024, crop: [100, 30, 1360, 994] }
} as const;
