// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [10, 154, 989, 516] },
  graphite: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [17, 162, 984, 476] },
  gclass: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [7, 112, 995, 542] },
  urus: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  golf: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [15, 150, 984, 507] },
  a45: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [13, 146, 987, 511] },
  porsche: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  amggt: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [14, 169, 980, 473] },
  m5: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [10, 165, 990, 482] },
  e63: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [12, 168, 990, 482] },
  m4: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [16, 161, 983, 484] },
  rs5: { src: '/dealer/media-pending.svg', width: 1000, height: 667, bounds: [7, 166, 994, 488] },
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
