import dealerPack from "./dealer-pack.json";
import type { MarketplaceSearchParams } from "./filters";
import type { BodyType, FuelType, VehicleListing } from "./types";

const dealer = dealerPack.dealer;
const bodyTypes: Readonly<Record<string, BodyType>> = {
  Wagon: "wagon", Hatchback: "hatchback", SUV: "suv", Minivan: "van",
  Sedan: "sedan", Coupe: "coupe", Convertible: "convertible", Pickup: "pickup",
};
const fuelTypes: Readonly<Record<string, FuelType>> = {
  Petrol: "gasoline", Diesel: "diesel", Electric: "electric", Hybrid: "hybrid",
};

/** The source snapshot is not a live feed or a verified available-stock count. */
export const mockListings: VehicleListing[] = dealerPack.inventory.map((vehicle) => {
  const bodyType = bodyTypes[vehicle.body] ?? "other";
  const taxLabel = vehicle.vat === "included" ? "ДДС е включен в обявената цена." : "В обявата е посочено: ДДС не се начислява.";
  return {
    id: vehicle.sourceId,
    slug: vehicle.slug,
    category: bodyType === "van" ? "van" : "car",
    dealerOrgId: `dealer-${dealer.slug}`,
    // 'active' only makes this dated demonstration record discoverable in the template.
    // Physical availability is explicitly unconfirmed in every description.
    status: "active",
    title: vehicle.title,
    description: [
      `${vehicle.title} — ${dealer.name}, ${dealer.address}.`,
      dealer.stockNotice,
      taxLabel,
      `Гориво: ${vehicle.fuelLabel}. Категория по източника: ${vehicle.sourceCategory}.`,
      vehicle.engineCc === null ? "" : `Работен обем по обявата: ${vehicle.engineCc} см³.`,
      vehicle.seats === null ? "" : `Места по обявата: ${vehicle.seats}.`,
      `Източник: ${vehicle.sourceUrl}`,
    ].filter(Boolean).join("\n\n"),
    price: { amount: vehicle.price, currency: vehicle.currency },
    priceType: "fixed",
    images: vehicle.photos.map((url, index) => ({
      url,
      alt: `${vehicle.title} — снимка ${index + 1} от публикуваната обява`,
    })),
    badges: ["used"],
    location: { city: dealer.city, region: dealer.district, country: "България" },
    features: vehicle.equipment.map((feature) => ({ bg: feature, en: feature })),
    spec: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      bodyType,
      fuelType: fuelTypes[vehicle.fuel] ?? "other",
      transmission: vehicle.transmission === "Automatic" ? "automatic" : "manual",
      mileageValue: vehicle.mileage,
      mileageUnit: "km",
      ...(vehicle.powerHp === null ? {} : { enginePowerHp: vehicle.powerHp }),
      ...(vehicle.color ? { colorExterior: vehicle.color } : {}),
    },
    seller: {
      id: `dealer-${dealer.slug}`,
      type: "dealer",
      displayName: dealer.name,
      verificationStatus: "unverified",
      logoUrl: dealer.logo,
      city: dealer.city,
    },
    // Snapshot ordering timestamp, not an assertion of the seller's original posting date.
    publishedAt: `${vehicle.observedAt}T00:00:00.000Z`,
    promoted: false,
  };
});

const matchesText = (listing: VehicleListing, query: string) =>
  [listing.title, listing.description, listing.spec.make, listing.spec.model,
    listing.spec.trim, listing.location.city, listing.seller.displayName]
    .filter(Boolean).join(" ").toLocaleLowerCase("bg-BG")
    .includes(query.trim().toLocaleLowerCase("bg-BG"));

type ListingPredicate = (listing: VehicleListing) => boolean;
type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;

// Retain the master's search/filter/sort contract, using only this dealer's records.
const createListingPredicates = (filters: MarketplaceSearchParams): ListingPredicate[] => [
  (listing) => listing.status === "active",
  (listing) => listing.category === filters.category,
  (listing) => !filters.q || matchesText(listing, filters.q),
  (listing) => !filters.make || listing.spec.make === filters.make,
  (listing) => !filters.model || listing.spec.model === filters.model,
  (listing) => !filters.location || listing.location.city === filters.location,
  (listing) => !filters.origin || filters.origin === dealer.country,
  // Destination matching is a local showroom filter, not a delivery promise.
  (listing) => !filters.deliverTo || filters.deliverTo === dealer.country,
  (listing) => !filters.currency || listing.price.currency === filters.currency,
  (listing) => filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  (listing) => filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  (listing) => filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  (listing) => filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  (listing) => filters.mileageMax === undefined || listing.spec.mileageValue <= filters.mileageMax,
  (listing) => !filters.fuel || listing.spec.fuelType === filters.fuel,
  (listing) => !filters.transmission || listing.spec.transmission === filters.transmission,
  (listing) => !filters.body || listing.spec.bodyType === filters.body,
  (listing) => !filters.seller || listing.seller.type === filters.seller,
];

const listingComparators: Record<MarketplaceSearchParams["sort"], ListingComparator> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year,
};

export const getMockListings = (filters: MarketplaceSearchParams): VehicleListing[] => {
  const predicates = createListingPredicates(filters);
  return mockListings.filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};
export const getMockListingBySlug = (slug: string) => mockListings.find((listing) => listing.slug === slug);
export const getMockListingById = (id: string) => mockListings.find((listing) => listing.id === id);
export const getMockRelatedListings = (source: VehicleListing, limit = 3): VehicleListing[] =>
  mockListings.filter((listing) => listing.status === "active" && listing.id !== source.id)
    .map((listing) => ({ listing, score:
      Number(listing.category === source.category) * 4 +
      Number(listing.spec.make === source.spec.make) * 3 +
      Number(listing.location.city === source.location.city) * 2 + Number(listing.promoted),
    }))
    .sort((a, b) => b.score - a.score).slice(0, Math.max(0, limit)).map(({ listing }) => listing);
export const getMockDealerInventory = () => [...mockListings];
// No saved cars, enquiries or sales are attributed to a real visitor by default.
export const mockSavedListingIds: string[] = [];
export const getMockSavedListings = (): VehicleListing[] => [];
