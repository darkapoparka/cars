// Full-photo bounds: retain source photographs and visible watermarks; do not apply source cutout cropping.
export const vehicleArtwork = {
  silver: { src: '/dealer/stock/11779353271465012-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  graphite: { src: '/dealer/stock/11783143816803427-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  gclass: { src: '/dealer/stock/21781675547654182-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  urus: { src: '/dealer/stock/11786096960383049-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  golf: { src: '/dealer/stock/11783143816803427-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  a45: { src: '/dealer/stock/21786097412257292-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  porsche: { src: '/dealer/stock/11783143816803427-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  amggt: { src: '/dealer/stock/11787310277898087-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  m5: { src: '/dealer/stock/11786096960383049-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  e63: { src: '/dealer/stock/21786097412257292-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  m4: { src: '/dealer/stock/11786096960383049-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
  rs5: { src: '/dealer/stock/11779353271465012-1.webp', width: 1000, height: 667, bounds: [0, 0, 1000, 667] },
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
