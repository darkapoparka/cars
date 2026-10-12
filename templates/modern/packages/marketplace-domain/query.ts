import type { MarketplaceSearchParams } from "./search";
import type { VehicleCategory, VehicleListing } from "./types";

const matchesText = (listing: VehicleListing, query: string) => {
  const haystack = [
    listing.title,
    listing.description,
    listing.spec.make,
    listing.spec.model,
    listing.spec.trim,
    listing.location.city,
    listing.seller.displayName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

type ListingPredicate = (listing: VehicleListing) => boolean;
type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;

const createListingPredicates = (
  filters: MarketplaceSearchParams
): ListingPredicate[] => [
  (listing) => listing.status === "active",
  (listing) => listing.category === filters.category,
  (listing) => !filters.q || matchesText(listing, filters.q),
  (listing) => !filters.make || listing.spec.make === filters.make,
  (listing) => !filters.model || listing.spec.model === filters.model,
  (listing) => !filters.location || listing.location.city === filters.location,
  (listing) =>
    !filters.origin ||
    listing.supply?.origin.countryCode === filters.origin ||
    (filters.origin === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) => !filters.currency || listing.price.currency === filters.currency,
  (listing) =>
    filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  (listing) =>
    filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  (listing) =>
    filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  (listing) =>
    filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  (listing) =>
    filters.mileageMax === undefined ||
    listing.spec.mileageValue <= filters.mileageMax,
  (listing) => !filters.fuel || listing.spec.fuelType === filters.fuel,
  (listing) =>
    filters.powerMin === undefined ||
    (listing.spec.enginePowerHp !== undefined &&
      listing.spec.enginePowerHp >= filters.powerMin),
  (listing) =>
    !filters.extra ||
    Boolean(listing.features?.some((feature) => feature.en === filters.extra)),
  (listing) =>
    !filters.transmission || listing.spec.transmission === filters.transmission,
  (listing) => !filters.body || listing.spec.bodyType === filters.body,
  (listing) => !filters.seller || listing.seller.type === filters.seller,
];

const listingComparators: Record<
  MarketplaceSearchParams["sort"],
  ListingComparator
> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year,
};

/** Filter and sort native inventory; parsing and route pagination remain caller-owned. */
export const filterMarketplaceListings = (
  listings: readonly VehicleListing[],
  filters: MarketplaceSearchParams
): VehicleListing[] => {
  const predicates = createListingPredicates(filters);
  return listings
    .filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};

export interface MarketplaceListingProjection {
  facets: {
    categoryCounts: { category: VehicleCategory; count: number }[];
    modelCounts: { make: string; model: string; count: number }[];
    status: "exact";
  };
  listings: VehicleListing[];
  totalListings: number;
}

/** Preserve native demo facet scope and page slicing without changing inventory facts. */
export const projectMarketplaceListings = (
  listings: readonly VehicleListing[],
  filters: MarketplaceSearchParams,
  pageSize: number
): MarketplaceListingProjection => {
  const categoryCountMap = new Map<VehicleCategory, number>();
  for (const listing of listings) {
    categoryCountMap.set(
      listing.category,
      (categoryCountMap.get(listing.category) ?? 0) + 1
    );
  }
  const filtered = filterMarketplaceListings(listings, { ...filters, page: 1 });
  const modelCountListings = filterMarketplaceListings(listings, {
    ...filters,
    derivative: undefined,
    make: undefined,
    model: undefined,
    page: 1,
    trim: undefined,
  });
  const modelCountMap = new Map<string, { make: string; model: string; count: number }>();

  for (const listing of modelCountListings) {
    const key = `${listing.spec.make}\u0000${listing.spec.model}`;
    const current = modelCountMap.get(key);
    modelCountMap.set(key, {
      count: (current?.count ?? 0) + 1,
      make: listing.spec.make,
      model: listing.spec.model,
    });
  }

  const offset = (filters.page - 1) * pageSize;

  return {
    facets: {
      categoryCounts: [...categoryCountMap].map(([category, count]) => ({
        category,
        count,
      })),
      modelCounts: [...modelCountMap.values()].sort(
        (left, right) =>
          left.make.localeCompare(right.make) ||
          left.model.localeCompare(right.model)
      ),
      status: "exact",
    },
    listings: filtered
      .slice(offset, offset + pageSize),
    totalListings: filtered.length,
  };
};

const scoreRelatedListing = (
  source: VehicleListing,
  candidate: VehicleListing
) =>
  Number(candidate.category === source.category) * 4 +
  Number(candidate.spec.make === source.spec.make) * 3 +
  Number(candidate.location.city === source.location.city) * 2 +
  Number(candidate.promoted);

export const getRelatedListingsFromInventory = (inventory: readonly VehicleListing[], source: VehicleListing, limit = 3) =>
  inventory
    .filter(
      (listing) => listing.status === "active" && listing.id !== source.id
    )
    .map((listing) => ({
      listing,
      score: scoreRelatedListing(source, listing),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ listing }) => listing);

