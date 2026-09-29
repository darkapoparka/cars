import { leadSite } from '$config/lead-site';

export type FeatureArtwork = {
  src: string;
  width: number;
  height: number;
  crop: readonly [number, number, number, number];
};

// Service artwork uses a common landscape frame; inspection remains the owner's reference.
export const featureArtwork = {
  showroom: { src: '/assets/images/template/menu-showroom-v2.webp', width: 1536, height: 1024, crop: [-150, -65, 1836, 1020] },
  import: { src: '/assets/images/template/menu-import-v2.webp', width: 1536, height: 1024, crop: [0, 80, 1536, 853] },
  finance: { src: '/assets/images/template/menu-leasing-v2.webp', width: 1610, height: 977, crop: [0, 35, 1610, 894] },
  inspection: { src: leadSite.artwork.routeHero.standard.guide, width: 1200, height: 800, crop: [0, 30, 1200, 667] },
} as const satisfies Record<string, FeatureArtwork>;

// Photo-derived menu vignettes are separate from both service art and blog-listing photos.
export const editorialArtwork = {
  inspection: { src: '/assets/images/template/menu-editorial-inspection-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  import: { src: '/assets/images/template/menu-editorial-import-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  finance: { src: '/assets/images/template/menu-editorial-leasing-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
} as const satisfies Record<string, FeatureArtwork>;

// Crop transparent canvas padding so mobile actions share a visible baseline and width.
export const mobileActionArtwork = {
  collection: { src: leadSite.artwork.home.collection, width: 1200, height: 668, crop: [20, 121, 1153, 431] },
  sell: { src: leadSite.artwork.home.sell, width: 1200, height: 438, crop: [121, 8, 1040, 413] },
  import: { src: leadSite.artwork.home.import, width: 1200, height: 450, crop: [88, 27, 1020, 388] },
  finance: { src: '/assets/images/template/mobile-leasing-card-v4.webp', width: 720, height: 240, crop: [73, 9, 573, 215] },
} as const satisfies Record<string, FeatureArtwork>;
