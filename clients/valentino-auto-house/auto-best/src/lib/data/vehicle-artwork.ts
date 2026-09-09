// Actual local seller photographs, not cutouts or invented stock. Full-frame bounds preserve all source marks.
export const vehicleArtwork = {
  "silver": {
    "src": "/media/stock/11785220779595617-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "graphite": {
    "src": "/media/stock/11777318867210441-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "gclass": {
    "src": "/media/stock/21724767264834325-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "urus": {
    "src": "/media/stock/11768394188936705-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "golf": {
    "src": "/media/stock/11732307740792726-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "a45": {
    "src": "/media/stock/11780736224961272-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "porsche": {
    "src": "/media/stock/11785220779595617-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "amggt": {
    "src": "/media/stock/11777318867210441-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "m5": {
    "src": "/media/stock/11709149044159957-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "e63": {
    "src": "/media/stock/11713813771194540-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "m4": {
    "src": "/media/stock/11780736224961272-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  },
  "rs5": {
    "src": "/media/stock/11732307740792726-card.webp",
    "width": 640,
    "height": 295,
    "bounds": [
      0,
      0,
      640,
      295
    ]
  }
} as const;

export type Vehicle = keyof typeof vehicleArtwork;
export const heroVehiclePairs = { home: ['gclass','urus'], inventory: ['golf','a45'], about: ['porsche','amggt'], blog: ['m5','e63'], contact: ['m4','rs5'] } as const satisfies Record<string, readonly [Vehicle, Vehicle]>;
export type HeroVehiclePair = keyof typeof heroVehiclePairs;
