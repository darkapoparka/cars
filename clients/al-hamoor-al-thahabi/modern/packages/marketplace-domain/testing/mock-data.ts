import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Dated advertised snapshots. publishedAt carries observation time, not a verified first-advertised date.
export const mockListings: VehicleListing[] = [
  {
    "id": "listing-965722",
    "slug": "mercedes-benz-cla250-2025-965722",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2025 Mercedes-Benz CLA250 Premium + 2.0L",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2025-mercedes-benz-cla250-premium-20l-965722.html Observed 2026-09-09.",
    "price": {
      "amount": 95000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/965722-1.webp",
        "alt": "2025 Mercedes-Benz CLA250 Premium + 2.0L — source photograph 1"
      },
      {
        "url": "/dealer/inventory/965722-2.webp",
        "alt": "2025 Mercedes-Benz CLA250 Premium + 2.0L — source photograph 2"
      },
      {
        "url": "/dealer/inventory/965722-3.webp",
        "alt": "2025 Mercedes-Benz CLA250 Premium + 2.0L — source photograph 3"
      },
      {
        "url": "/dealer/inventory/965722-4.webp",
        "alt": "2025 Mercedes-Benz CLA250 Premium + 2.0L — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "American specification",
        "en": "American specification"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "CLA250",
      "trim": "Premium + 2.0L",
      "year": 2025,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 22000,
      "mileageUnit": "km",
      "colorExterior": "Brown"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-1005647",
    "slug": "nissan-rogue-2023-1005647",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2023 Nissan Rogue Platinum",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2023-nissan-rogue-1005647.html Observed 2026-09-09.",
    "price": {
      "amount": 45000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/1005647-1.webp",
        "alt": "2023 Nissan Rogue Platinum — source photograph 1"
      },
      {
        "url": "/dealer/inventory/1005647-2.webp",
        "alt": "2023 Nissan Rogue Platinum — source photograph 2"
      },
      {
        "url": "/dealer/inventory/1005647-3.webp",
        "alt": "2023 Nissan Rogue Platinum — source photograph 3"
      },
      {
        "url": "/dealer/inventory/1005647-4.webp",
        "alt": "2023 Nissan Rogue Platinum — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "American specification",
        "en": "American specification"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Rogue",
      "trim": "Platinum",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 56000,
      "mileageUnit": "km",
      "colorExterior": "Grey"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-1010924",
    "slug": "toyota-prado-2011-1010924",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2011 Toyota Prado TX-L",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2011-toyota-prado-1010924.html Observed 2026-09-09.",
    "price": {
      "amount": 56000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/1010924-1.webp",
        "alt": "2011 Toyota Prado TX-L — source photograph 1"
      },
      {
        "url": "/dealer/inventory/1010924-2.webp",
        "alt": "2011 Toyota Prado TX-L — source photograph 2"
      },
      {
        "url": "/dealer/inventory/1010924-3.webp",
        "alt": "2011 Toyota Prado TX-L — source photograph 3"
      },
      {
        "url": "/dealer/inventory/1010924-4.webp",
        "alt": "2011 Toyota Prado TX-L — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "GCC specification",
        "en": "GCC specification"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Prado",
      "trim": "TX-L",
      "year": 2011,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 212000,
      "mileageUnit": "km",
      "colorExterior": "White"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-1018774",
    "slug": "chevrolet-malibu-2022-1018774",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2022 Chevrolet Malibu LT",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2022-chevrolet-malibu-1018774.html Observed 2026-09-09.",
    "price": {
      "amount": 32000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/1018774-1.webp",
        "alt": "2022 Chevrolet Malibu LT — source photograph 1"
      },
      {
        "url": "/dealer/inventory/1018774-2.webp",
        "alt": "2022 Chevrolet Malibu LT — source photograph 2"
      },
      {
        "url": "/dealer/inventory/1018774-3.webp",
        "alt": "2022 Chevrolet Malibu LT — source photograph 3"
      },
      {
        "url": "/dealer/inventory/1018774-4.webp",
        "alt": "2022 Chevrolet Malibu LT — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "GCC specification",
        "en": "GCC specification"
      }
    ],
    "spec": {
      "make": "Chevrolet",
      "model": "Malibu",
      "trim": "LT",
      "year": 2022,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 95000,
      "mileageUnit": "km",
      "colorExterior": "Silver"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-916417",
    "slug": "toyota-rush-2023-916417",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2023 Toyota Rush EX 1.5L",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2023-toyota-rush-15l-ex-916417.html Observed 2026-09-09.",
    "price": {
      "amount": 43000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/916417-1.webp",
        "alt": "2023 Toyota Rush EX 1.5L — source photograph 1"
      },
      {
        "url": "/dealer/inventory/916417-2.webp",
        "alt": "2023 Toyota Rush EX 1.5L — source photograph 2"
      },
      {
        "url": "/dealer/inventory/916417-3.webp",
        "alt": "2023 Toyota Rush EX 1.5L — source photograph 3"
      },
      {
        "url": "/dealer/inventory/916417-4.webp",
        "alt": "2023 Toyota Rush EX 1.5L — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "GCC specification",
        "en": "GCC specification"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Rush",
      "trim": "EX 1.5L",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 121000,
      "mileageUnit": "km",
      "colorExterior": "White"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-906007",
    "slug": "chevrolet-trax-2020-906007",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2020 Chevrolet Trax LT 1.8L AWD",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2020-chevrolet-trax-lt-18l-awd-906007.html Observed 2026-09-09.",
    "price": {
      "amount": 14500,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/906007-1.webp",
        "alt": "2020 Chevrolet Trax LT 1.8L AWD — source photograph 1"
      },
      {
        "url": "/dealer/inventory/906007-2.webp",
        "alt": "2020 Chevrolet Trax LT 1.8L AWD — source photograph 2"
      },
      {
        "url": "/dealer/inventory/906007-3.webp",
        "alt": "2020 Chevrolet Trax LT 1.8L AWD — source photograph 3"
      },
      {
        "url": "/dealer/inventory/906007-4.webp",
        "alt": "2020 Chevrolet Trax LT 1.8L AWD — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "American specification",
        "en": "American specification"
      }
    ],
    "spec": {
      "make": "Chevrolet",
      "model": "Trax",
      "trim": "LT 1.8L AWD",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 106000,
      "mileageUnit": "km",
      "colorExterior": "Black"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-1017078",
    "slug": "ford-figo-2019-1017078",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2019 Ford Figo Ambiente",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2019-ford-figo-1017078.html Observed 2026-09-09.",
    "price": {
      "amount": 13500,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/1017078-1.webp",
        "alt": "2019 Ford Figo Ambiente — source photograph 1"
      },
      {
        "url": "/dealer/inventory/1017078-2.webp",
        "alt": "2019 Ford Figo Ambiente — source photograph 2"
      },
      {
        "url": "/dealer/inventory/1017078-3.webp",
        "alt": "2019 Ford Figo Ambiente — source photograph 3"
      },
      {
        "url": "/dealer/inventory/1017078-4.webp",
        "alt": "2019 Ford Figo Ambiente — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "GCC specification",
        "en": "GCC specification"
      }
    ],
    "spec": {
      "make": "Ford",
      "model": "Figo",
      "trim": "Ambiente",
      "year": 2019,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 185000,
      "mileageUnit": "km",
      "colorExterior": "White"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-969234",
    "slug": "nissan-sentra-2021-969234",
    "category": "car",
    "dealerOrgId": "dealer-al-hamoor-al-thahabi",
    "status": "active",
    "title": "2021 Nissan Sentra SV 1.6L",
    "description": "Dated advertised listing sample. Confirm the vehicle condition, availability and viewing location with the dealership. The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted.  Source listing: https://www.dubicars.com/2021-nissan-sentra-sv-16l-113-hp-969234.html Observed 2026-09-09.",
    "price": {
      "amount": 23000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/969234-1.webp",
        "alt": "2021 Nissan Sentra SV 1.6L — source photograph 1"
      },
      {
        "url": "/dealer/inventory/969234-2.webp",
        "alt": "2021 Nissan Sentra SV 1.6L — source photograph 2"
      },
      {
        "url": "/dealer/inventory/969234-3.webp",
        "alt": "2021 Nissan Sentra SV 1.6L — source photograph 3"
      },
      {
        "url": "/dealer/inventory/969234-4.webp",
        "alt": "2021 Nissan Sentra SV 1.6L — source photograph 4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dubai (advertised location)",
      "country": "United Arab Emirates"
    },
    "features": [
      {
        "bg": "American specification",
        "en": "American specification"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Sentra",
      "trim": "SV 1.6L",
      "year": 2021,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 116000,
      "mileageUnit": "km",
      "colorExterior": "Blue"
    },
    "seller": {
      "id": "dealer-al-hamoor-al-thahabi",
      "type": "dealer",
      "displayName": "Al Hamoor Al Thahabi Used Cars",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  }
];

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
    (filters.origin === "AE" &&
      (listing.location.country === "United Arab Emirates" ||
        listing.location.country === "United Arab Emirates")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "AE" &&
      (listing.location.country === "United Arab Emirates" ||
        listing.location.country === "United Arab Emirates")),
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

export const getMockListings = (filters: MarketplaceSearchParams) => {
  const predicates = createListingPredicates(filters);

  return mockListings
    .filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};

const legacyListingSlugAliases: Readonly<Record<string, string>> = {};

export const getMockListingBySlug = (slug: string) => {
  const resolvedSlug = legacyListingSlugAliases[slug] ?? slug;
  return mockListings.find((listing) => listing.slug === resolvedSlug);
};

export const getMockListingById = (id: string) =>
  mockListings.find((listing) => listing.id === id);

const scoreRelatedListing = (
  source: VehicleListing,
  candidate: VehicleListing
) =>
  Number(candidate.category === source.category) * 4 +
  Number(candidate.spec.make === source.spec.make) * 3 +
  Number(candidate.location.city === source.location.city) * 2 +
  Number(candidate.promoted);

export const getMockRelatedListings = (source: VehicleListing, limit = 3) =>
  mockListings
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

export const mockSavedListingIds: string[] = [];

export const getMockSavedListings = () =>
  mockListings.filter((listing) => mockSavedListingIds.includes(listing.id));

export interface MockSavedSearch {
  cadence: "instant" | "daily" | "weekly";
  description: string;
  filters: Partial<MarketplaceSearchParams>;
  id: string;
  lastRunAt: string;
  newMatches: number;
  title: string;
}

export const mockSavedSearches: MockSavedSearch[] = [];

const sellerListingStatuses: Record<string, VehicleListing["status"]> = {
  "am-1001": "active",
  "am-1003": "pending_review",
  "am-1007": "draft",
};

export const getMockSellerListings = () =>
  mockListings
    .filter((listing) =>
      Object.keys(sellerListingStatuses).includes(listing.id)
    )
    .map((listing) => ({
      ...listing,
      status: sellerListingStatuses[listing.id] ?? listing.status,
    }));

export const getMockSellerListingById = (id: string) =>
  getMockSellerListings().find((listing) => listing.id === id);

export const getMockDealerInventory = () =>
  mockListings.filter((listing) => listing.seller.type === "dealer");

export interface MockDealerLead {
  buyerName: string;
  id: string;
  intent: "test_drive" | "finance" | "trade_in" | "availability";
  listingId: string;
  listingTitle: string;
  receivedAt: string;
  source: "listing" | "saved_search" | "dealer_profile";
  status: "new" | "contacted" | "qualified" | "closed";
}

export const mockDealerLeads: MockDealerLead[] = [];

export const getMockDealerStats = () => {
  const inventory = getMockDealerInventory();
  const activeInventory = inventory.filter(
    (listing) => listing.status === "active"
  );
  const newLeads = mockDealerLeads.filter((lead) => lead.status === "new");

  return {
    activeInventory: activeInventory.length,
    averagePrice:
      inventory.reduce((total, listing) => total + listing.price.amount, 0) /
      inventory.length,
    leadCount: mockDealerLeads.length,
    newLeadCount: newLeads.length,
  };
};

export interface MockModerationReport {
  createdAt: string;
  details: string;
  flags: string[];
  id: string;
  listingId: string;
  listingTitle: string;
  reason:
    | "duplicate"
    | "fraud_risk"
    | "incorrect_details"
    | "prohibited_content"
    | "seller_behavior";
  reporter: string;
  severity: "low" | "medium" | "high";
  source: "buyer_report" | "system_flag" | "admin_review";
  status: "new" | "reviewing" | "resolved" | "dismissed";
}

export const mockModerationReports: MockModerationReport[] = [];

export interface MockTrustReview {
  city: string;
  documents: string[];
  entityId: string;
  entityName: string;
  entityType: "dealer" | "seller";
  linkedListings: number;
  riskLevel: "low" | "medium" | "high";
  status: "unverified" | "pending" | "verified" | "rejected";
  submittedAt: string;
}

export const mockTrustReviews: MockTrustReview[] = [];

export interface MockAuditLogEntry {
  action: string;
  actor: string;
  createdAt: string;
  entityId: string;
  entityType: "listing" | "report" | "seller" | "dealer";
  id: string;
  note: string;
}

export const mockAuditLog: MockAuditLogEntry[] = [
  {
    id: "audit-1001",
    actor: "Admin",
    action: "report.opened",
    entityType: "report",
    entityId: "report-1001",
    note: "Moved Tesla lease report to new queue.",
    createdAt: "2026-06-07T09:25:00.000Z",
  },
  {
    id: "audit-1002",
    actor: "System",
    action: "listing.flagged",
    entityType: "listing",
    entityId: "am-1006",
    note: "Duplicate image match over threshold.",
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "audit-1003",
    actor: "Trust ops",
    action: "dealer.verified",
    entityType: "dealer",
    entityId: "dealer-trakia-auto",
    note: "Business registry and address checks passed.",
    createdAt: "2026-06-06T11:15:00.000Z",
  },
];

export const getMockAdminStats = () => {
  const openReports = mockModerationReports.filter(
    (report) => report.status === "new" || report.status === "reviewing"
  );
  const highRiskReports = mockModerationReports.filter(
    (report) => report.severity === "high"
  );
  const pendingTrustReviews = mockTrustReviews.filter(
    (review) => review.status === "pending"
  );

  return {
    auditEvents: mockAuditLog.length,
    highRiskReports: highRiskReports.length,
    openReports: openReports.length,
    pendingTrustReviews: pendingTrustReviews.length,
  };
};

export interface MockDealerPlan {
  current?: boolean;
  description: string;
  id: string;
  leadCredits: number;
  listingLimit: number;
  monthlyPrice: Money;
  name: string;
  promotionCredits: number;
  support: "standard" | "priority" | "managed";
}

export const mockDealerPlans: MockDealerPlan[] = [
  {
    id: "dealer-starter",
    name: "Starter",
    description: "For small dealers testing AutoMarket inventory.",
    monthlyPrice: { amount: 99, currency: "EUR" },
    listingLimit: 20,
    leadCredits: 25,
    promotionCredits: 0,
    support: "standard",
  },
  {
    id: "dealer-growth",
    name: "Growth",
    description: "More active listings, included leads, and promotion credits.",
    monthlyPrice: { amount: 249, currency: "EUR" },
    listingLimit: 80,
    leadCredits: 120,
    promotionCredits: 4,
    support: "priority",
    current: true,
  },
  {
    id: "dealer-scale",
    name: "Scale",
    description: "High-volume inventory with managed marketplace support.",
    monthlyPrice: { amount: 599, currency: "EUR" },
    listingLimit: 250,
    leadCredits: 400,
    promotionCredits: 12,
    support: "managed",
  },
];

export interface MockPromotionProduct {
  description: string;
  durationDays: number;
  id: string;
  label: string;
  placement: "search_top" | "category_featured" | "lease_partner";
  price: Money;
}

export const mockPromotionProducts: MockPromotionProduct[] = [
  {
    id: "promo-search-top-7",
    label: "Top search boost",
    description: "Promoted placement in relevant search results for 7 days.",
    placement: "search_top",
    durationDays: 7,
    price: { amount: 39, currency: "EUR" },
  },
  {
    id: "promo-category-featured-14",
    label: "Category featured",
    description: "Featured card in category browse pages for 14 days.",
    placement: "category_featured",
    durationDays: 14,
    price: { amount: 79, currency: "EUR" },
  },
  {
    id: "promo-lease-partner-30",
    label: "Lease partner slot",
    description: "Finance and lease partner placement for eligible inventory.",
    placement: "lease_partner",
    durationDays: 30,
    price: { amount: 149, currency: "EUR" },
  },
];

export interface MockActivePromotion {
  clicks: number;
  endsAt: string;
  id: string;
  impressions: number;
  leads: number;
  listingId: string;
  productId: string;
  spend: Money;
  startsAt: string;
  status: "scheduled" | "active" | "ended";
}

export const mockActivePromotions: MockActivePromotion[] = [
  {
    id: "promotion-1001",
    listingId: "am-1001",
    productId: "promo-search-top-7",
    status: "active",
    startsAt: "2026-06-05T08:00:00.000Z",
    endsAt: "2026-06-12T08:00:00.000Z",
    spend: { amount: 39, currency: "EUR" },
    impressions: 4200,
    clicks: 184,
    leads: 8,
  },
  {
    id: "promotion-1002",
    listingId: "am-1003",
    productId: "promo-lease-partner-30",
    status: "active",
    startsAt: "2026-06-01T08:00:00.000Z",
    endsAt: "2026-07-01T08:00:00.000Z",
    spend: { amount: 149, currency: "EUR" },
    impressions: 6100,
    clicks: 246,
    leads: 12,
  },
  {
    id: "promotion-1003",
    listingId: "am-1008",
    productId: "promo-category-featured-14",
    status: "scheduled",
    startsAt: "2026-06-10T08:00:00.000Z",
    endsAt: "2026-06-24T08:00:00.000Z",
    spend: { amount: 79, currency: "EUR" },
    impressions: 0,
    clicks: 0,
    leads: 0,
  },
];

export interface MockDealerBillingAccount {
  currentPlanId: string;
  includedLeadCredits: number;
  invoiceBalance: Money;
  monthlySpend: Money;
  paymentMethod: string;
  renewalDate: string;
  status: "active" | "past_due" | "trialing";
  usedLeadCredits: number;
}

export const mockDealerBillingAccount: MockDealerBillingAccount = {
  currentPlanId: "dealer-growth",
  status: "active",
  renewalDate: "2026-07-01T00:00:00.000Z",
  paymentMethod: "Visa ending 4242",
  invoiceBalance: { amount: 0, currency: "EUR" },
  monthlySpend: { amount: 267, currency: "EUR" },
  includedLeadCredits: 120,
  usedLeadCredits: 74,
};

export const getMockCurrentDealerPlan = () =>
  mockDealerPlans.find(
    (plan) => plan.id === mockDealerBillingAccount.currentPlanId
  ) ?? mockDealerPlans[0];

export const getMockPromotionProductById = (id: string) =>
  mockPromotionProducts.find((product) => product.id === id);

export const getMockMonetizationStats = () => {
  const activePromotions = mockActivePromotions.filter(
    (promotion) => promotion.status === "active"
  );
  const totalLeads = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.leads,
    0
  );
  const totalSpend = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.spend.amount,
    0
  );

  return {
    activePromotions: activePromotions.length,
    leadCreditsRemaining:
      mockDealerBillingAccount.includedLeadCredits -
      mockDealerBillingAccount.usedLeadCredits,
    promotionLeads: totalLeads,
    promotionSpend: { amount: totalSpend, currency: "EUR" } satisfies Money,
  };
};
