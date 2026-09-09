// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: '/dealer/inventory/21774987156419677-1.webp', width: 1000, height: 667, bounds: [10, 154, 989, 516] },
  graphite: { src: '/dealer/inventory/21774987156419677-1.webp', width: 1000, height: 667, bounds: [17, 162, 984, 476] },
  gclass: { src: '/dealer/inventory/21782532150311090-1.webp', width: 1000, height: 667, bounds: [7, 112, 995, 542] },
  urus: { src: '/dealer/inventory/21782532150311090-1.webp', width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  golf: { src: '/dealer/inventory/11776195342993015-1.webp', width: 1000, height: 667, bounds: [15, 150, 984, 507] },
  a45: { src: '/dealer/inventory/21782618805725512-1.webp', width: 1000, height: 667, bounds: [13, 146, 987, 511] },
  porsche: { src: '/dealer/inventory/21774987156419677-1.webp', width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  amggt: { src: '/dealer/inventory/11787687890119606-1.webp', width: 1000, height: 667, bounds: [14, 169, 980, 473] },
  m5: { src: '/dealer/inventory/11776195342993015-1.webp', width: 1000, height: 667, bounds: [10, 165, 990, 482] },
  e63: { src: '/dealer/inventory/11787687890119606-1.webp', width: 1000, height: 667, bounds: [12, 168, 990, 482] },
  m4: { src: '/dealer/inventory/21782532150311090-1.webp', width: 1000, height: 667, bounds: [16, 161, 983, 484] },
  rs5: { src: '/dealer/inventory/11776195342993015-1.webp', width: 1000, height: 667, bounds: [7, 166, 994, 488] },
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
