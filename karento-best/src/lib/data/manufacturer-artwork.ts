type ManufacturerArtwork = {
  image: string;
  width: number;
  height: number;
  bounds: readonly [number, number, number, number];
};

// Preserved Cars Mobile marks; visible bounds keep wide and tall logos comparable.
const artwork: Readonly<Record<string, ManufacturerArtwork>> = {
  audi: {
    image: "/variant-6/assets/imgs/makes/audi.webp",
    width: 120,
    height: 120,
    bounds: [1, 41, 119, 82],
  },
  chevrolet: {
    image: "/variant-6/assets/imgs/makes/chevrolet.webp",
    width: 120,
    height: 120,
    bounds: [1, 44, 119, 77],
  },
  ford: {
    image: "/variant-6/assets/imgs/makes/ford.webp",
    width: 120,
    height: 120,
    bounds: [0, 37, 120, 83],
  },
  gmc: {
    image: "/variant-6/assets/imgs/makes/gmc.webp",
    width: 120,
    height: 120,
    bounds: [5, 48, 114, 72],
  },
  hyundai: {
    image: "/variant-6/assets/imgs/makes/hyundai.webp",
    width: 120,
    height: 120,
    bounds: [1, 30, 118, 90],
  },
  jeep: {
    image: "/variant-6/assets/imgs/makes/jeep.webp",
    width: 120,
    height: 120,
    bounds: [1, 36, 119, 84],
  },
  kia: {
    image: "/variant-6/assets/imgs/makes/kia.webp",
    width: 120,
    height: 120,
    bounds: [1, 46, 119, 74],
  },
  mazda: {
    image: "/variant-6/assets/imgs/makes/mazda.webp",
    width: 120,
    height: 120,
    bounds: [6, 17, 114, 103],
  },
  mini: {
    image: "/variant-6/assets/imgs/makes/mini.webp",
    width: 120,
    height: 120,
    bounds: [3, 35, 117, 85],
  },
  porsche: {
    image: "/variant-6/assets/imgs/makes/porsche.webp",
    width: 120,
    height: 120,
    bounds: [17, 4, 103, 115],
  },
  subaru: {
    image: "/variant-6/assets/imgs/makes/subaru.webp",
    width: 120,
    height: 120,
    bounds: [1, 28, 118, 92],
  },
  toyota: {
    image: "/variant-6/assets/imgs/makes/toyota.webp",
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
