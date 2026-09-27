import { leadSite } from '$config/lead-site';
// Generated decorative service art; not inventory photography. See provenance/service-cards-2026-09-10.md.
export const serviceArtwork = {
  car: { src: '/assets/images/template/service-car-v1.webp', width: 1536, height: 1024, crop: [65, 160, 1390, 720] },
  value: { src: leadSite.artwork.home.sell, width: 1200, height: 400, crop: [49, 8, 1081, 380] },
  contact: { src: leadSite.artwork.home.import, width: 1200, height: 400, crop: [42, 11, 1078, 374] },
  finance: { src: '/assets/images/template/service-leasing-v1.webp', width: 1536, height: 1024, crop: [100, 30, 1360, 994] }
} as const;
