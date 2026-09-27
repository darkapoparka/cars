import { leadSite, type LeadHeroVehiclePair, type LeadVehicleArtwork } from '$config/lead-site';

// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: leadSite.artwork.vehicleCutouts.silver, width: 1000, height: 667, bounds: [10, 154, 989, 516] },
  graphite: { src: leadSite.artwork.vehicleCutouts.graphite, width: 1000, height: 667, bounds: [17, 162, 984, 476] },
  gclass: { src: leadSite.artwork.vehicleCutouts.gclass, width: 1000, height: 667, bounds: [7, 112, 995, 542] },
  urus: { src: leadSite.artwork.vehicleCutouts.urus, width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  golf: { src: leadSite.artwork.vehicleCutouts.golf, width: 1000, height: 667, bounds: [15, 150, 984, 507] },
  a45: { src: leadSite.artwork.vehicleCutouts.a45, width: 1000, height: 667, bounds: [13, 146, 987, 511] },
  porsche: { src: leadSite.artwork.vehicleCutouts.porsche, width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  amggt: { src: leadSite.artwork.vehicleCutouts.amggt, width: 1000, height: 667, bounds: [14, 169, 980, 473] },
  m5: { src: leadSite.artwork.vehicleCutouts.m5, width: 1000, height: 667, bounds: [10, 165, 990, 482] },
  e63: { src: leadSite.artwork.vehicleCutouts.e63, width: 1000, height: 667, bounds: [12, 168, 990, 482] },
  m4: { src: leadSite.artwork.vehicleCutouts.m4, width: 1000, height: 667, bounds: [16, 161, 983, 484] },
  rs5: { src: leadSite.artwork.vehicleCutouts.rs5, width: 1000, height: 667, bounds: [7, 166, 994, 488] }
} as const;

export type Vehicle = LeadVehicleArtwork;
export const heroVehiclePairs = leadSite.artwork.heroVehiclePairs;
export type HeroVehiclePair = LeadHeroVehiclePair;

// Center the car itself; supporting objects can make the full composition asymmetric.
export const mobileHeroArtwork = {
  car: { src: leadSite.artwork.mobileHero.car, width: 600, height: 600, carCenter: 300 },
  sell: { src: leadSite.artwork.mobileHero.sell, width: 1200, height: 438, carCenter: 641.5 },
  import: { src: leadSite.artwork.mobileHero.import, width: 1200, height: 450, carCenter: 598 }
} as const;

export type MobileHeroScene = keyof typeof mobileHeroArtwork;

// Viewports into the existing transparent artwork; no duplicate raster assets.
export const mobileHeroRegions = {
  sell: { src: mobileHeroArtwork.sell.src, width: 1200, height: 438, crop: [927, 140, 267, 291] },
  import: { src: mobileHeroArtwork.import.src, width: 1200, height: 450, crop: [0, 152, 354, 259] },
  home: { src: leadSite.artwork.mobileHero.home, width: 1200, height: 660, crop: [8, 110, 1170, 443] }
} as const;
