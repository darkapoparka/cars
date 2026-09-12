// Alpha bounds measured at opacity > 128; preserve natural proportions when aligning artwork.
export const vehicleArtwork = {
  silver: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [10, 154, 989, 516] },
  graphite: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [17, 162, 984, 476] },
  gclass: { src: '/inventory/21767797586155338-1.webp?v=profile-1', width: 1000, height: 667, bounds: [7, 112, 995, 542] },
  urus: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  golf: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [15, 150, 984, 507] },
  a45: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [13, 146, 987, 511] },
  porsche: { src: '/inventory/21776348634522888-1.webp?v=profile-1', width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  amggt: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [14, 169, 980, 473] },
  m5: { src: '/inventory/11731086831031986-1.webp?v=profile-1', width: 1000, height: 667, bounds: [10, 165, 990, 482] },
  e63: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [12, 168, 990, 482] },
  m4: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [16, 161, 983, 484] },
  rs5: { src: '/inventory/11749039399452266-1.webp?v=profile-1', width: 1000, height: 667, bounds: [7, 166, 994, 488] },
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
