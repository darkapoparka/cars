import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Dated advertised snapshots. publishedAt carries observation time, not a verified first-advertised date.
export const mockListings: VehicleListing[] = [
  {
    "id": "listing-202601169196000",
    "slug": "bmw-5-series-gran-turismo-2011-202601169196000",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2011 BMW 5 Series Gran Turismo 530d SE GT Steptronic",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/bmw-5-series-gran-turismo-3-0-530d-se-gt-steptronic-euro-5-5dr-birmingham-202601169196000 Observed 2026-09-09.",
    "price": {
      "amount": 4900,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202601169196000-1.webp",
        "alt": "2011 BMW 5 Series Gran Turismo 530d SE GT Steptronic — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [
      {
        "bg": "Panoramic roof",
        "en": "Panoramic roof"
      },
      {
        "bg": "Heated seats",
        "en": "Heated seats"
      },
      {
        "bg": "Navigation",
        "en": "Navigation"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "5 Series Gran Turismo",
      "trim": "530d SE GT Steptronic",
      "year": 2011,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 149900,
      "mileageUnit": "mi",
      "colorExterior": "Black"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202607073982268",
    "slug": "bmw-x3-2015-202607073982268",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2015 BMW X3 20d M Sport xDrive",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/bmw-x3-2-0-20d-m-sport-xdrive-euro-6-ss-5dr-birmingham-202607073982268 Observed 2026-09-09.",
    "price": {
      "amount": 4400,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202607073982268-1.webp",
        "alt": "2015 BMW X3 20d M Sport xDrive — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [
      {
        "bg": "Heated front seats",
        "en": "Heated front seats"
      },
      {
        "bg": "Navigation",
        "en": "Navigation"
      },
      {
        "bg": "Bluetooth",
        "en": "Bluetooth"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X3",
      "trim": "20d M Sport xDrive",
      "year": 2015,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 173000,
      "mileageUnit": "mi",
      "colorExterior": "Black"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202607254508952",
    "slug": "toyota-aygo-2021-202607254508952",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2021 Toyota Aygo 1.0 VVT-i x-play",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/toyota-aygo-1-0-vvt-i-x-play-euro-6-5dr-safety-sense-birmingham-202607254508952 Observed 2026-09-09.",
    "price": {
      "amount": 4000,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202607254508952-1.webp",
        "alt": "2021 Toyota Aygo 1.0 VVT-i x-play — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [
      {
        "bg": "Reverse camera",
        "en": "Reverse camera"
      },
      {
        "bg": "Air conditioning",
        "en": "Air conditioning"
      },
      {
        "bg": "Bluetooth",
        "en": "Bluetooth"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Aygo",
      "trim": "1.0 VVT-i x-play",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 117000,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202609075805069",
    "slug": "audi-q3-2012-202609075805069",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2012 Audi Q3 2.0 TDI S line",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/audi-q3-2-0-tdi-s-line-euro-5-ss-5dr-birmingham-202609075805069 Observed 2026-09-09.",
    "price": {
      "amount": 3900,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202609075805069-1.webp",
        "alt": "2012 Audi Q3 2.0 TDI S line — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [
      {
        "bg": "Sports leather interior",
        "en": "Sports leather interior"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "Q3",
      "trim": "2.0 TDI S line",
      "year": 2012,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 139900,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202608275484997",
    "slug": "nissan-qashqai-2017-202608275484997",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2017 Nissan Qashqai 1.6 dCi Tekna",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/nissan-qashqai-1-6-dci-tekna-euro-6-ss-5dr-birmingham-202608275484997 Observed 2026-09-09.",
    "price": {
      "amount": 3900,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202608275484997-1.webp",
        "alt": "2017 Nissan Qashqai 1.6 dCi Tekna — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [],
    "spec": {
      "make": "Nissan",
      "model": "Qashqai",
      "trim": "1.6 dCi Tekna",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 153000,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202609055756720",
    "slug": "subaru-legacy-2004-202609055756720",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2004 Subaru Legacy 3.0 R Sport Tourer",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/subaru-legacy-3-0-r-sport-tourer-5dr-birmingham-202609055756720 Observed 2026-09-09.",
    "price": {
      "amount": 3500,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202609055756720-1.webp",
        "alt": "2004 Subaru Legacy 3.0 R Sport Tourer — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [
      {
        "bg": "Panoramic sunroof",
        "en": "Panoramic sunroof"
      },
      {
        "bg": "Heated seats",
        "en": "Heated seats"
      },
      {
        "bg": "Cruise control",
        "en": "Cruise control"
      }
    ],
    "spec": {
      "make": "Subaru",
      "model": "Legacy",
      "trim": "3.0 R Sport Tourer",
      "year": 2004,
      "bodyType": "wagon",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 124800,
      "mileageUnit": "mi",
      "colorExterior": "Silver"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202608255427907",
    "slug": "ford-mondeo-2012-202608255427907",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2012 Ford Mondeo 2.2 TDCi Titanium X Sport",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/ford-mondeo-2-2-tdci-titanium-x-sport-euro-5-5dr-birmingham-202608255427907 Observed 2026-09-09.",
    "price": {
      "amount": 3400,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202608255427907-1.webp",
        "alt": "2012 Ford Mondeo 2.2 TDCi Titanium X Sport — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [],
    "spec": {
      "make": "Ford",
      "model": "Mondeo",
      "trim": "2.2 TDCi Titanium X Sport",
      "year": 2012,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 141000,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "listing-202604141546870",
    "slug": "vauxhall-insignia-2012-202604141546870",
    "category": "car",
    "dealerOrgId": "dealer-midlands-trade-centre",
    "status": "active",
    "title": "2012 Vauxhall Insignia 1.8 16V SRi",
    "description": "Dated advertised listing sample. Confirm condition, equipment, availability and final terms directly. All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.  Source listing: https://www.midlandstradecentreltd.co.uk/used-cars/vauxhall-insignia-1-8-16v-sri-euro-5-5dr-birmingham-202604141546870 Observed 2026-09-09.",
    "price": {
      "amount": 2800,
      "currency": "GBP"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/202604141546870-1.webp",
        "alt": "2012 Vauxhall Insignia 1.8 16V SRi — source photograph 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Birmingham",
      "country": "United Kingdom"
    },
    "features": [],
    "spec": {
      "make": "Vauxhall",
      "model": "Insignia",
      "trim": "1.8 16V SRi",
      "year": 2012,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 64500,
      "mileageUnit": "mi",
      "colorExterior": "Black"
    },
    "seller": {
      "id": "dealer-midlands-trade-centre",
      "type": "dealer",
      "displayName": "Midlands Trade Centre Limited",
      "verificationStatus": "unverified",
      "city": "Birmingham",
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
    (filters.origin === "GB" &&
      (listing.location.country === "United Kingdom" ||
        listing.location.country === "United Kingdom")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "GB" &&
      (listing.location.country === "United Kingdom" ||
        listing.location.country === "United Kingdom")),
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
