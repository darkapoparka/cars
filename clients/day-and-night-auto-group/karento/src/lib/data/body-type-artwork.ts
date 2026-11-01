type BodyTypeArtwork = {
  image: string;
  width: number;
  height: number;
};

const artwork: Readonly<Record<string, BodyTypeArtwork>> = {
  hatchback: {
    image: "/assets/imgs/body-types/hatchback.webp",
    width: 320,
    height: 160,
  },
  sedan: {
    image: "/assets/imgs/body-types/sedan.webp",
    width: 320,
    height: 160,
  },
  suv: { image: "/assets/imgs/body-types/suv.webp", width: 320, height: 160 },
  estate: {
    image: "/assets/imgs/body-types/estate.webp",
    width: 320,
    height: 160,
  },
  pickup: {
    image: "/assets/imgs/body-types/pickup.webp",
    width: 320,
    height: 160,
  },
};

const order = ["hatchback", "sedan", "suv", "estate", "pickup"];

export function compareBodyTypes(first: string, second: string): number {
  const firstIndex = order.indexOf(first.trim().toLowerCase());
  const secondIndex = order.indexOf(second.trim().toLowerCase());
  return (
    (firstIndex < 0 ? order.length : firstIndex) -
      (secondIndex < 0 ? order.length : secondIndex) ||
    first.localeCompare(second)
  );
}

export function bodyTypeArtwork(type: string): BodyTypeArtwork | undefined {
  const key = type.trim().toLowerCase();
  return Object.hasOwn(artwork, key) ? artwork[key] : undefined;
}
