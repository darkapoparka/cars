import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "tx-127361913",
    "slug": "2008-acura-tl-127361913",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2008 Acura TL",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 3.2L V6; Automatic 5-Speed; FWD. Odometer 176,729 miles. Advertised price USD 4,500, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2008-acura-tl/127361913",
    "price": {
      "amount": 4500,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/stock/127361913-1.webp",
        "alt": "2008 Acura TL — published dealer listing photograph"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "3.2L V6",
        "en": "3.2L V6"
      },
      {
        "bg": "FWD",
        "en": "FWD"
      }
    ],
    "spec": {
      "make": "Acura",
      "model": "TL",
      "trim": "",
      "year": 2008,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 176729,
      "mileageUnit": "mi",
      "colorExterior": "Gray"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-128538336",
    "slug": "2012-audi-q5-128538336",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2012 Audi Q5 2.0T quattro Premium Plus",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 2.0L Turbo I4; Automatic 8-Speed; AWD. Odometer 104,710 miles. Advertised price USD 6,500, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2012-audi-q5/128538336",
    "price": {
      "amount": 6500,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/media/photo-unavailable.svg",
        "alt": "Listing photograph not yet available"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "2.0L Turbo I4",
        "en": "2.0L Turbo I4"
      },
      {
        "bg": "AWD",
        "en": "AWD"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "Q5",
      "trim": "2.0T quattro Premium Plus",
      "year": 2012,
      "bodyType": "suv",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 104710,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361925",
    "slug": "2013-audi-q5-127361925",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2013 Audi Q5 2.0T quattro Premium Plus",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 2.0L Flex Fuel Turbo I4; Automatic 8-Speed; AWD. Odometer 114,512 miles. Advertised price USD 6,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2013-audi-q5/127361925",
    "price": {
      "amount": 6990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/stock/127361925-1.webp",
        "alt": "2013 Audi Q5 — published dealer listing photograph"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "2.0L Flex Fuel Turbo I4",
        "en": "2.0L Flex Fuel Turbo I4"
      },
      {
        "bg": "AWD",
        "en": "AWD"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "Q5",
      "trim": "2.0T quattro Premium Plus",
      "year": 2013,
      "bodyType": "suv",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 114512,
      "mileageUnit": "mi",
      "colorExterior": "White"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361924",
    "slug": "2018-audi-a4-127361924",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2018 Audi A4 Premium",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 2.0L; Automatic 7-Speed; FWD. Odometer 128,956 miles. Advertised price USD 8,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2018-audi-a4/127361924",
    "price": {
      "amount": 8990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/media/photo-unavailable.svg",
        "alt": "Listing photograph not yet available"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "2.0L",
        "en": "2.0L"
      },
      {
        "bg": "FWD",
        "en": "FWD"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A4",
      "trim": "Premium",
      "year": 2018,
      "bodyType": "sedan",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 128956,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361904",
    "slug": "2014-bmw-x5-127361904",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2014 BMW X5 xDrive35i",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 3.0L Twin Turbo I6; Automatic 8-Speed; AWD. Odometer 177,873 miles. Advertised price USD 7,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2014-bmw-x5/127361904",
    "price": {
      "amount": 7990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/stock/127361904-1.webp",
        "alt": "2014 BMW X5 — published dealer listing photograph"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "3.0L Twin Turbo I6",
        "en": "3.0L Twin Turbo I6"
      },
      {
        "bg": "AWD",
        "en": "AWD"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X5",
      "trim": "xDrive35i",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 177873,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361891",
    "slug": "2014-buick-enclave-127361891",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2014 Buick Enclave Leather",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 3.6L V6; Automatic 6-Speed; AWD. Odometer 162,632 miles. Advertised price USD 6,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2014-buick-enclave/127361891",
    "price": {
      "amount": 6990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/media/photo-unavailable.svg",
        "alt": "Listing photograph not yet available"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "3.6L V6",
        "en": "3.6L V6"
      },
      {
        "bg": "AWD",
        "en": "AWD"
      }
    ],
    "spec": {
      "make": "Buick",
      "model": "Enclave",
      "trim": "Leather",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 162632,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361933",
    "slug": "2007-cadillac-cts-127361933",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2007 Cadillac CTS HI FEATURE V6",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 3.6L V6; Automatic 5-Speed; RWD. Odometer 119,529 miles. Advertised price USD 4,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2007-cadillac-cts/127361933",
    "price": {
      "amount": 4990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/media/photo-unavailable.svg",
        "alt": "Listing photograph not yet available"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "3.6L V6",
        "en": "3.6L V6"
      },
      {
        "bg": "RWD",
        "en": "RWD"
      }
    ],
    "spec": {
      "make": "Cadillac",
      "model": "CTS",
      "trim": "HI FEATURE V6",
      "year": 2007,
      "bodyType": "sedan",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 119529,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tx-127361883",
    "slug": "2018-cadillac-escalade-127361883",
    "category": "car",
    "dealerOrgId": "dealer-texas-drive-auto",
    "status": "active",
    "title": "2018 Cadillac Escalade Standard",
    "description": "Dated Texas Drive Auto listing sample observed 2026-09-08. 6.2L V8; Automatic 10-Speed; 4X4. Odometer 99,315 miles. Advertised price USD 15,990, excluding taxes, title and licensing; confirm final price, condition and availability directly. Title status is not independently verified. No dealer financing or payment plans. Source: https://www.texasdriveauto.com/details/used-2018-cadillac-escalade/127361883",
    "price": {
      "amount": 15990,
      "currency": "USD"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/media/photo-unavailable.svg",
        "alt": "Listing photograph not yet available"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Dallas",
      "region": "Texas",
      "country": "United States"
    },
    "features": [
      {
        "bg": "6.2L V8",
        "en": "6.2L V8"
      },
      {
        "bg": "4X4",
        "en": "4X4"
      }
    ],
    "spec": {
      "make": "Cadillac",
      "model": "Escalade",
      "trim": "Standard",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "other",
      "transmission": "automatic",
      "mileageValue": 99315,
      "mileageUnit": "mi"
    },
    "seller": {
      "id": "dealer-texas-drive-auto",
      "type": "dealer",
      "displayName": "Texas Drive Auto",
      "verificationStatus": "unverified",
      "city": "Dallas",
      "logoUrl": "/brand/logo-on-light.png"
    },
    "publishedAt": "2026-09-08T00:00:00.000Z",
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
        listing.location.country === "US")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "US" &&
      (listing.location.country === "United States" ||
        listing.location.country === "US")),
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

export const mockSavedListingIds = [] as string[];

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

const sellerListingStatuses: Record<string, VehicleListing["status"]> = {};

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

export const mockAuditLog: MockAuditLogEntry[] = [];

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

export const mockDealerPlans: MockDealerPlan[] = [{"id":"unconfigured-demo","name":"Billing not configured","description":"No dealer subscription or paid service is configured in this private preview. This is not an offer.","monthlyPrice":{"amount":0,"currency":"USD"},"listingLimit":0,"leadCredits":0,"promotionCredits":0,"support":"standard"}];

export interface MockPromotionProduct {
  description: string;
  durationDays: number;
  id: string;
  label: string;
  placement: "search_top" | "category_featured" | "lease_partner";
  price: Money;
}

export const mockPromotionProducts: MockPromotionProduct[] = [];

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

export const mockActivePromotions: MockActivePromotion[] = [];

export interface MockDealerBillingAccount {
  currentPlanId: string;
  includedLeadCredits: number;
  invoiceBalance: Money;
  monthlySpend: Money;
  paymentMethod: string;
  renewalDate: string;
  status: "active" | "past_due" | "trialing" | "not_configured";
  usedLeadCredits: number;
}

export const mockDealerBillingAccount: MockDealerBillingAccount = {"currentPlanId":"unconfigured-demo","status":"not_configured","renewalDate":"","paymentMethod":"No payment method configured","invoiceBalance":{"amount":0,"currency":"USD"},"monthlySpend":{"amount":0,"currency":"USD"},"includedLeadCredits":0,"usedLeadCredits":0};

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
    promotionSpend: { amount: totalSpend, currency: "USD" } satisfies Money,
  };
};
