// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: '/assets/images/lead/day-night-cutout-silver-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [10, 154, 989, 516] },
  graphite: { src: '/assets/images/lead/day-night-cutout-graphite-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [17, 162, 984, 476] },
  gclass: { src: '/assets/images/lead/day-night-cutout-gclass-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [7, 112, 995, 542] },
  urus: { src: '/assets/images/lead/day-night-cutout-urus-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  golf: { src: '/assets/images/lead/day-night-cutout-golf-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [15, 150, 984, 507] },
  a45: { src: '/assets/images/lead/day-night-cutout-a45-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [13, 146, 987, 511] },
  porsche: { src: '/assets/images/lead/day-night-cutout-porsche-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  amggt: { src: '/assets/images/lead/day-night-cutout-amggt-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [14, 169, 980, 473] },
  m5: { src: '/assets/images/lead/day-night-cutout-m5-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [10, 165, 990, 482] },
  e63: { src: '/assets/images/lead/day-night-cutout-e63-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [12, 168, 990, 482] },
  m4: { src: '/assets/images/lead/day-night-cutout-m4-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [16, 161, 983, 484] },
  rs5: { src: '/assets/images/lead/day-night-cutout-rs5-v1.webp?v=profile-1', width: 1000, height: 667, bounds: [7, 166, 994, 488] },
} as const;

export type Vehicle = keyof typeof vehicleArtwork;

export const heroVehiclePairs = {
  home: ['gclass', 'urus'],
  inventory: ['golf', 'a45'],
  about: ['porsche', 'amggt'],
  blog: ['m5', 'e63'],
  contact: ['m4', 'rs5']
} as const satisfies Record<string, readonly [Vehicle, Vehicle]>;

export type HeroVehiclePair = keyof typeof heroVehiclePairs;

// Center the car itself; supporting objects can make the full composition asymmetric.
export const mobileHeroArtwork = {
  car: { src: '/assets/images/lead/day-night-urus-front-v1.webp', width: 600, height: 600, carCenter: 300 },
  sell: { src: '/assets/images/lead/day-night-mobile-sell-v1.webp', width: 1200, height: 438, carCenter: 641.5 },
  import: { src: '/assets/images/lead/day-night-mobile-import-v1.webp', width: 1200, height: 450, carCenter: 598 }
} as const;

export type MobileHeroScene = keyof typeof mobileHeroArtwork;

// Viewports into the existing transparent artwork; no duplicate raster assets.
export const mobileHeroRegions = {
  sell: { src: mobileHeroArtwork.sell.src, width: 1200, height: 438, crop: [927, 140, 267, 291] },
  import: { src: mobileHeroArtwork.import.src, width: 1200, height: 450, crop: [0, 152, 354, 259] },
  home: { src: '/assets/images/lead/day-night-collection-banner-v2.webp', width: 1200, height: 660, crop: [8, 110, 1170, 443] }
} as const;
