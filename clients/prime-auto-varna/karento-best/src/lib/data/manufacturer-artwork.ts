type ManufacturerArtwork = {
  image: string;
  width: number;
  height: number;
  bounds: readonly [number, number, number, number];
};

// Preserved Cars Mobile marks; visible bounds keep wide and tall logos comparable.
const artwork: Readonly<Record<string, ManufacturerArtwork>> = {
  audi: {
    image: "/assets/imgs/makes/audi.webp",
    width: 120,
    height: 120,
    bounds: [1, 41, 119, 82],
  },
  chevrolet: {
    image: "/assets/imgs/makes/chevrolet.webp",
    width: 120,
    height: 120,
    bounds: [1, 44, 119, 77],
  },
  ford: {
    image: "/assets/imgs/makes/ford.webp",
    width: 120,
    height: 120,
    bounds: [0, 37, 120, 83],
  },
  gmc: {
    image: "/assets/imgs/makes/gmc.webp",
    width: 120,
    height: 120,
    bounds: [5, 48, 114, 72],
  },
  hyundai: {
    image: "/assets/imgs/makes/hyundai.webp",
    width: 120,
    height: 120,
    bounds: [1, 30, 118, 90],
  },
  jeep: {
    image: "/assets/imgs/makes/jeep.webp",
    width: 120,
    height: 120,
    bounds: [1, 36, 119, 84],
  },
  kia: {
    image: "/assets/imgs/makes/kia.webp",
    width: 120,
    height: 120,
    bounds: [1, 46, 119, 74],
  },
  mazda: {
    image: "/assets/imgs/makes/mazda.webp",
    width: 120,
    height: 120,
    bounds: [6, 17, 114, 103],
  },
  mini: {
    image: "/assets/imgs/makes/mini.webp",
    width: 120,
    height: 120,
    bounds: [3, 35, 117, 85],
  },
  porsche: {
    image: "/assets/imgs/makes/porsche.webp",
    width: 120,
    height: 120,
    bounds: [17, 4, 103, 115],
  },
  subaru: {
    image: "/assets/imgs/makes/subaru.webp",
    width: 120,
    height: 120,
    bounds: [1, 28, 118, 92],
  },
  toyota: {
    image: "/assets/imgs/makes/toyota.webp",
    width: 120,
    height: 120,
    bounds: [3, 20, 117, 100],
  },
};

export function manufacturerArtwork(
  make: string,
): ManufacturerArtwork | undefined {
  const key = make.trim().toLocaleLowerCase();
  return Object.hasOwn(artwork, key) ? artwork[key] : undefined;
}
