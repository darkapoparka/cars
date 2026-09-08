import source from './navara-data.json';

// The identifiers are the retained template's internal composition slots, not model labels.
// Every slot now uses an actual photograph from the selected dealer's dated sample.
const photo = (index: number, height = 667) => ({
  src: source.vehicles[index].images[0],
  width: 1000,
  height,
  bounds: [0, 0, 1000, height] as readonly [number, number, number, number]
});
export const vehicleArtwork = {
  silver: photo(2, 750), graphite: photo(1), gclass: photo(3, 750), urus: photo(4),
  golf: photo(1), a45: photo(0), porsche: photo(6, 750), amggt: photo(7),
  m5: photo(2, 750), e63: photo(8, 750), m4: photo(5), rs5: photo(0)
} as const;
export type Vehicle = keyof typeof vehicleArtwork;
export const heroVehiclePairs = {
  home: ['gclass', 'urus'], inventory: ['golf', 'a45'], about: ['porsche', 'amggt'],
  blog: ['m5', 'e63'], contact: ['m4', 'rs5']
} as const satisfies Record<string, readonly [Vehicle, Vehicle]>;
export type HeroVehiclePair = keyof typeof heroVehiclePairs;
