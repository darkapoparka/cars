import { leadSite } from '$config/lead-site';

export type FeatureArtwork = {
  src: string;
  width: number;
  height: number;
  crop: readonly [number, number, number, number];
};

// Source paths are dealer-owned; each shared illustration has one measured crop.
export const serviceIllustrationArtwork = {
  collection: { src: leadSite.artwork.serviceIllustrations.collection, width: 800, height: 533, crop: [2, 129, 796, 284] },
  showroom: { src: leadSite.artwork.serviceIllustrations.showroom, width: 800, height: 533, crop: [-35, -23, 870, 580] },
  sell: { src: leadSite.artwork.serviceIllustrations.sell, width: 800, height: 533, crop: [55, 33, 703, 453] },
  import: { src: leadSite.artwork.serviceIllustrations.import, width: 800, height: 533, crop: [28, 43, 730, 437] },
  finance: { src: leadSite.artwork.serviceIllustrations.finance, width: 800, height: 532, crop: [66, 57, 709, 451] },
  car: { src: leadSite.artwork.serviceIllustrations.car, width: 800, height: 532, crop: [37, 164, 683, 331] },
  overview: { src: leadSite.artwork.serviceIllustrations.overview, width: 800, height: 533, crop: [38, 34, 732, 463] }
} as const satisfies Record<string, FeatureArtwork>;

export const featureArtwork = {
  showroom: serviceIllustrationArtwork.overview,
  import: serviceIllustrationArtwork.import,
  finance: serviceIllustrationArtwork.finance,
  inspection: serviceIllustrationArtwork.sell,
} as const satisfies Record<string, FeatureArtwork>;

// Menus retain their full-canvas frames while sharing the same silver sources.
export const desktopServiceArtwork = {
  showroom: serviceIllustrationArtwork.showroom,
  import: { ...serviceIllustrationArtwork.import, crop: [0, 0, 800, 533] },
  finance: { ...serviceIllustrationArtwork.finance, crop: [0, 0, 800, 532] },
} as const satisfies Record<string, FeatureArtwork>;

// Photo-derived menu vignettes are separate from both service art and blog-listing photos.
export const editorialArtwork = {
  inspection: { src: '/assets/images/template/menu-editorial-inspection-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  import: { src: '/assets/images/template/menu-editorial-import-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
  finance: { src: '/assets/images/template/menu-editorial-leasing-v1.webp', width: 1536, height: 1024, crop: [0, 0, 1536, 1024] },
} as const satisfies Record<string, FeatureArtwork>;

// Home, mobile shortcuts and service-card variants share this family.
export const mobileActionArtwork = {
  collection: serviceIllustrationArtwork.collection,
  sell: serviceIllustrationArtwork.sell,
  import: serviceIllustrationArtwork.import,
  finance: serviceIllustrationArtwork.finance,
} as const satisfies Record<string, FeatureArtwork>;

export const homeActionArtwork = mobileActionArtwork;
export const homeServicesArtwork = serviceIllustrationArtwork.overview;

export function illustrationVehicleArtwork(artwork: FeatureArtwork, view: string) {
  const [x, y, width, height] = artwork.crop;
  return { src: artwork.src, width: artwork.width, height: artwork.height, bounds: [x, y, x + width, y + height], view } as const;
}
