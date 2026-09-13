export type FeatureArtwork = {
  src: string;
  width: number;
  height: number;
  crop: readonly [number, number, number, number];
};

// Service artwork uses a common landscape frame; inspection remains the owner's reference.
export const featureArtwork = {
  showroom: { src: '/assets/images/template/menu-showroom-v2.png', width: 1536, height: 1024, crop: [-150, -65, 1836, 1020] },
  import: { src: '/assets/images/template/menu-import-v2.png', width: 1536, height: 1024, crop: [0, 80, 1536, 853] },
  finance: { src: '/assets/images/template/menu-leasing-v2.png', width: 1610, height: 977, crop: [0, 35, 1610, 894] },
  inspection: { src: '/assets/images/lead/day-night-studio-guide-v1.webp', width: 1200, height: 800, crop: [0, 30, 1200, 667] },
} as const satisfies Record<string, FeatureArtwork>;

// Photo-derived menu vignettes are separate from both service art and blog-listing photos.
export const editorialArtwork = {
  inspection: { src: '/assets/images/template/menu-editorial-inspection-v1.png', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  import: { src: '/assets/images/template/menu-editorial-import-v1.png', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  finance: { src: '/assets/images/template/menu-editorial-leasing-v1.png', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
} as const satisfies Record<string, FeatureArtwork>;
