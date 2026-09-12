import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Dated advertised snapshots. publishedAt carries observation time, not a verified first-advertised date.
export const mockListings: VehicleListing[] = [
  {
    "id": "listing-6572737",
    "slug": "audi-s5-2012-6572737",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2012 Audi S5 4.2 quattro Premium Plus",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2012-audi-s5/115534047 Observed 2026-09-09.",
    "price": {
      "amount": 24900,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/6572737-1.webp",
        "alt": "2012 Audi S5 4.2 quattro Premium Plus — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [
      {
        "bg": "All-wheel drive",
        "en": "All-wheel drive"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "S5",
      "trim": "4.2 quattro Premium Plus",
      "year": 2012,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 124154,
      "mileageUnit": "mi",
      "colorExterior": "Blue"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-7027165",
    "slug": "bmw-3-series-2014-7027165",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2014 BMW 3 Series 335i",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2014-bmw-3-series/119193560 Observed 2026-09-09.",
    "price": {
      "amount": 19990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/7027165-1.webp",
        "alt": "2014 BMW 3 Series 335i — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [
      {
        "bg": "Six-speed manual transmission",
        "en": "Six-speed manual transmission"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "3 Series",
      "trim": "335i",
      "year": 2014,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 91542,
      "mileageUnit": "mi",
      "colorExterior": "Gray"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-7435783",
    "slug": "chevrolet-silverado-1500-2011-7435783",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2011 Chevrolet Silverado 1500 LT Crew Cab",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2011-chevrolet-silverado-1500/125725588 Observed 2026-09-09.",
    "price": {
      "amount": 17995,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/7435783-1.webp",
        "alt": "2011 Chevrolet Silverado 1500 LT Crew Cab — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [
      {
        "bg": "Crew cab",
        "en": "Crew cab"
      },
      {
        "bg": "4x2",
        "en": "4x2"
      }
    ],
    "spec": {
      "make": "Chevrolet",
      "model": "Silverado 1500",
      "trim": "LT Crew Cab",
      "year": 2011,
      "bodyType": "pickup",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 132301,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-5826218",
    "slug": "bmw-3-series-2011-5826218",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2011 BMW 3 Series 328i Convertible",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2011-bmw-3-series/115534075 Observed 2026-09-09.",
    "price": {
      "amount": 13980,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/5826218-1.webp",
        "alt": "2011 BMW 3 Series 328i Convertible — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "3 Series",
      "trim": "328i Convertible",
      "year": 2011,
      "bodyType": "convertible",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 105567,
      "mileageUnit": "mi",
      "colorExterior": "White"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-4972128",
    "slug": "audi-a4-2007-4972128",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2007 Audi A4 2.0T CVT",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2007-audi-a4/115534077 Observed 2026-09-09.",
    "price": {
      "amount": 11995,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/4972128-1.webp",
        "alt": "2007 Audi A4 2.0T CVT — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [
      {
        "bg": "CVT transmission",
        "en": "CVT transmission"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A4",
      "trim": "2.0T CVT",
      "year": 2007,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 89100,
      "mileageUnit": "mi",
      "colorExterior": "Gray"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-6602792",
    "slug": "chevrolet-colorado-2008-6602792",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2008 Chevrolet Colorado LT Regular Cab",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.keenautomall.com/details/used-2008-chevrolet-colorado/118003301 Observed 2026-09-09.",
    "price": {
      "amount": 8995,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/6602792-1.webp",
        "alt": "2008 Chevrolet Colorado LT Regular Cab — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [
      {
        "bg": "4x2",
        "en": "4x2"
      }
    ],
    "spec": {
      "make": "Chevrolet",
      "model": "Colorado",
      "trim": "LT Regular Cab",
      "year": 2008,
      "bodyType": "pickup",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 222891,
      "mileageUnit": "mi",
      "colorExterior": "Black"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-7043071",
    "slug": "chevrolet-trax-2016-7043071",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2016 Chevrolet Trax LS",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.mynextride.com/dealers/375/keen-auto-mall-llc-pompano-beach-fl/inventory Observed 2026-09-09.",
    "price": {
      "amount": 14995,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/7043071-1.webp",
        "alt": "2016 Chevrolet Trax LS — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [],
    "spec": {
      "make": "Chevrolet",
      "model": "Trax",
      "trim": "LS",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 137286,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-7146154",
    "slug": "toyota-corolla-2014-7146154",
    "category": "car",
    "dealerOrgId": "dealer-keen-auto-mall",
    "status": "active",
    "title": "2014 Toyota Corolla S Plus",
    "description": "Dated advertised sample. Confirm condition, availability, equipment and total purchase price directly. Confirm the selected vehicle, opening hours and your viewing appointment directly before travelling. The dealer's published terms add tax, tag and title plus a $1,298 dealer fee, $1,995 reconditioning fee, $598 electronic filing fee and $189 private tag agency fee. These are not included in the sample advertised prices. Confirm a written total for the specific vehicle. The site describes vehicles as sold as-is, with optional service contracts and finance subject to application and approval. Source listing: https://www.mynextride.com/dealers/375/keen-auto-mall-llc-pompano-beach-fl/inventory Observed 2026-09-09.",
    "price": {
      "amount": 14995,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/7146154-1.webp",
        "alt": "2014 Toyota Corolla S Plus — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Pompano Beach",
      "country": "United States"
    },
    "features": [],
    "spec": {
      "make": "Toyota",
      "model": "Corolla",
      "trim": "S Plus",
      "year": 2014,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 142634,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-keen-auto-mall",
      "type": "dealer",
      "displayName": "Keen Auto Mall",
      "verificationStatus": "unverified",
      "city": "Pompano Beach",
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
    (filters.origin === "US" &&
      (listing.location.country === "United States" ||
        listing.location.country === "United States")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "US" &&
      (listing.location.country === "United States" ||
        listing.location.country === "United States")),
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
