// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: '/dealer/hero-car-1.webp', width: 1000, height: 667, bounds: [160, 57, 840, 617] },
  graphite: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  gclass: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  urus: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  golf: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  a45: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  porsche: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  amggt: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  m5: { src: '/dealer/hero-car-1.webp', width: 1000, height: 667, bounds: [160, 57, 840, 617] },
  e63: { src: '/dealer/hero-car-2.webp', width: 1000, height: 667, bounds: [191, 57, 808, 617] },
  m4: { src: '/dealer/hero-car-1.webp', width: 1000, height: 667, bounds: [160, 57, 840, 617] },
  rs5: { src: '/dealer/hero-car-1.webp', width: 1000, height: 667, bounds: [160, 57, 840, 617] },
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
