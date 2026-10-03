import { leadSite, type LeadHeroVehiclePair, type LeadVehicleArtwork } from '$config/lead-site';
import { frameIllustration, serviceIllustrationArtwork } from '$data/feature-artwork';

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

// A shared size unit gives every cutout the same visible bounding-box area.
// Transparent margins do not affect scale; the original proportions and anchors remain intact.
export function getVehicleArtworkRatios(artwork: { width: number; height: number; bounds: readonly number[]; normalizationBounds?: readonly number[] }) {
  const [left, top, right, bottom] = artwork.bounds;
  const bodyWidth = right - left;
  const bodyHeight = bottom - top;
  // A service composition can size its main car independently of its small side props.
  const [sizeLeft, sizeTop, sizeRight, sizeBottom] = artwork.normalizationBounds ?? artwork.bounds;
  const size = Math.sqrt((sizeRight - sizeLeft) * (sizeBottom - sizeTop));
  return {
    width: artwork.width / size,
    height: artwork.height / size,
    bottom: bottom / size,
    front: (artwork.width - left) / size,
    right: (artwork.width - right) / size,
    bodyWidth: bodyWidth / size,
    bodyHeight: bodyHeight / size
  };
}

const vehicleRatios = Object.values(vehicleArtwork).map(getVehicleArtworkRatios);
export const vehicleArtworkFrame = {
  width: Math.max(...vehicleRatios.map(artwork => artwork.bodyWidth)),
  height: Math.max(...vehicleRatios.map(artwork => artwork.bodyHeight))
};

export const heroVehiclePairs = leadSite.artwork.heroVehiclePairs;
export type HeroVehiclePair = LeadHeroVehiclePair;

// Center the car itself; supporting objects can make the full composition asymmetric.
export const mobileHeroArtwork = {
  car: { src: leadSite.artwork.mobileHero.car, width: 600, height: 600, carCenter: 300 },
  sell: { src: leadSite.artwork.mobileHero.sell, width: 1200, height: 400, carCenter: 598.5 },
  import: { src: leadSite.artwork.mobileHero.import, width: 1200, height: 400, carCenter: 591 }
} as const;

export type MobileHeroScene = keyof typeof mobileHeroArtwork;

// The exact same central vehicle is rendered in both service heroes. Only side details change.
export const mobileServiceArtwork = {
  car: frameIllustration(serviceIllustrationArtwork.car, 600 / 400),
  sell: {
    left: { src: mobileHeroArtwork.sell.src, width: 1200, height: 400, crop: [0, 0, 300, 400] },
    right: { src: mobileHeroArtwork.sell.src, width: 1200, height: 400, crop: [900, 0, 300, 400] }
  },
  import: {
    left: { src: mobileHeroArtwork.import.src, width: 1200, height: 400, crop: [0, 0, 300, 400] },
    right: { src: mobileHeroArtwork.import.src, width: 1200, height: 400, crop: [885, 0, 315, 400] }
  }
} as const;

export const mobileHeroRegions = {
  home: frameIllustration(serviceIllustrationArtwork.collection, 1170 / 443)
} as const;
