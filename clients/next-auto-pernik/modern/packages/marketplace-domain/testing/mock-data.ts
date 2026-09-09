import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {id:"dealer-next-auto-pernik-11787752937990488",slug:"toyota-auris-1-2i-116hp-camera-euro6b-990488",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Toyota Auris 1.2i 116HP CAMERA ПОДГРЕВ EURO6B",description:"Обява на NEXT AUTO: 2016 г., 89 917 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:10990,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11787752937990488-1.webp","alt":"Toyota Auris 1.2i 116HP CAMERA ПОДГРЕВ EURO6B — снимка 1"},{"url":"/dealer/inventory/11787752937990488-2.webp","alt":"Toyota Auris 1.2i 116HP CAMERA ПОДГРЕВ EURO6B — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"}],spec:{make:"Toyota",model:"Auris 1.2i 116HP",year:2016,bodyType:"hatchback",fuelType:"gasoline",transmission:"manual",mileageValue:89917,mileageUnit:'km',enginePowerHp:116,colorExterior:"Тъмно сив"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-11788950238166164",slug:"mercedes-benz-c-220-2-2d-170hp-automat-navi-166164",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Mercedes-Benz C 220 2.2D 170HP AUTOMAT NAVI",description:"Обява на NEXT AUTO: 2009 г., 202 823 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:5990,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11788950238166164-1.webp","alt":"Mercedes-Benz C 220 2.2D 170HP AUTOMAT NAVI — снимка 1"},{"url":"/dealer/inventory/11788950238166164-2.webp","alt":"Mercedes-Benz C 220 2.2D 170HP AUTOMAT NAVI — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"}],spec:{make:"Mercedes-Benz",model:"C 220 2.2D",year:2009,bodyType:"wagon",fuelType:"diesel",transmission:"automatic",mileageValue:202823,mileageUnit:'km',enginePowerHp:170,colorExterior:"Светло сив"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-21769068381599366",slug:"land-rover-range-rover-evoque-sport-2-0i-241hp-pano-camera-swiss-599366",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Land Rover Range Rover Evoque SPORT 2.0i 241HP PANO CAMERA SWISS",description:"Обява на NEXT AUTO: 2013 г., 223 623 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:12500,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21769068381599366-1.webp","alt":"Land Rover Range Rover Evoque SPORT 2.0i 241HP PANO CAMERA SWISS — снимка 1"},{"url":"/dealer/inventory/21769068381599366-2.webp","alt":"Land Rover Range Rover Evoque SPORT 2.0i 241HP PANO CAMERA SWISS — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"}],spec:{make:"Land Rover",model:"Range Rover Evoque",year:2013,bodyType:"suv",fuelType:"gasoline",transmission:"automatic",mileageValue:223623,mileageUnit:'km',enginePowerHp:241,colorExterior:"Черен"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-11768899611936491",slug:"bmw-520-d-190hp-xdrive-m-pack-360-3d-cam-pano-936491",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"BMW 520 D 190HP XDRIVE M PACK 360'3D CAM PANO ОБДУХВАН",description:"Обява на NEXT AUTO: 2020 г., 134 627 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:25000,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11768899611936491-1.webp","alt":"BMW 520 D 190HP XDRIVE M PACK 360'3D CAM PANO ОБДУХВАН — снимка 1"},{"url":"/dealer/inventory/11768899611936491-2.webp","alt":"BMW 520 D 190HP XDRIVE M PACK 360'3D CAM PANO ОБДУХВАН — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"BMW",model:"520 D 190HP",year:2020,bodyType:"wagon",fuelType:"diesel",transmission:"automatic",mileageValue:134627,mileageUnit:'km',enginePowerHp:190,colorExterior:"Черен"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-21787665633476009",slug:"mercedes-benz-gle-350-d-258hp-led-intelligent-eu6b-476009",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Mercedes-Benz GLE 350 D 258HP ПАНО ОБДУХВАНЕ LED INTELLIGENT EU6B",description:"Обява на NEXT AUTO: 2016 г., 271 144 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:18990,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21787665633476009-1.webp","alt":"Mercedes-Benz GLE 350 D 258HP ПАНО ОБДУХВАНЕ LED INTELLIGENT EU6B — снимка 1"},{"url":"/dealer/inventory/21787665633476009-2.webp","alt":"Mercedes-Benz GLE 350 D 258HP ПАНО ОБДУХВАНЕ LED INTELLIGENT EU6B — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Mercedes-Benz",model:"GLE 350 D",year:2016,bodyType:"suv",fuelType:"diesel",transmission:"automatic",mileageValue:271144,mileageUnit:'km',enginePowerHp:258,colorExterior:"Светло сив"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-21784724054336566",slug:"toyota-rav4-2-0i-158hp-keyless-automat-336566",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Toyota Rav4 2.0i 158HP KEYLESS AUTOMAT КОЖА НАВИ",description:"Обява на NEXT AUTO: 2011 г., 157 506 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:11500,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21784724054336566-1.webp","alt":"Toyota Rav4 2.0i 158HP KEYLESS AUTOMAT КОЖА НАВИ — снимка 1"},{"url":"/dealer/inventory/21784724054336566-2.webp","alt":"Toyota Rav4 2.0i 158HP KEYLESS AUTOMAT КОЖА НАВИ — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Toyota",model:"Rav4 2.0i 158HP",year:2011,bodyType:"suv",fuelType:"gasoline",transmission:"automatic",mileageValue:157506,mileageUnit:'km',enginePowerHp:158,colorExterior:"Тъмно сив"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-11778859949237318",slug:"mercedes-benz-s-350-3-0cdi-286hp-long-multibeam-carplay-eu6c-237318",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Mercedes-Benz S 350 3.0CDI 286HP LONG MULTIBEAM CARPLAY EU6C",description:"Обява на NEXT AUTO: 2018 г., 183 276 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:29990,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11778859949237318-1.webp","alt":"Mercedes-Benz S 350 3.0CDI 286HP LONG MULTIBEAM CARPLAY EU6C — снимка 1"},{"url":"/dealer/inventory/11778859949237318-2.webp","alt":"Mercedes-Benz S 350 3.0CDI 286HP LONG MULTIBEAM CARPLAY EU6C — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"360° камера","en":"360° камера"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Mercedes-Benz",model:"S 350 3.0CDI",year:2018,bodyType:"other",fuelType:"diesel",transmission:"automatic",mileageValue:183276,mileageUnit:'km',enginePowerHp:286,colorExterior:"Черен"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-next-auto-pernik-11775038681554863",slug:"mercedes-benz-s-350-3-0cdi-235hp-h-k-distronic-night-vision-massage-554863",category:'car',dealerOrgId:"dealer-next-auto-pernik",status:'active',title:"Mercedes-Benz S 350 3.0CDI 235HP H/K DISTRONIC NIGHT VISION MASSAGE",description:"Обява на NEXT AUTO: 2010 г., 228 382 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:11800,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11775038681554863-1.webp","alt":"Mercedes-Benz S 350 3.0CDI 235HP H/K DISTRONIC NIGHT VISION MASSAGE — снимка 1"},{"url":"/dealer/inventory/11775038681554863-2.webp","alt":"Mercedes-Benz S 350 3.0CDI 235HP H/K DISTRONIC NIGHT VISION MASSAGE — снимка 2"}],badges:['used'],location:{city:"Перник",country:'България'},features:[{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"}],spec:{make:"Mercedes-Benz",model:"S 350 3.0CDI",year:2010,bodyType:"sedan",fuelType:"diesel",transmission:"automatic",mileageValue:228382,mileageUnit:'km',enginePowerHp:235,colorExterior:"Черен"},seller:{id:"dealer-next-auto-pernik",type:'dealer',displayName:"NEXT AUTO",verificationStatus:'unverified',city:"Перник",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
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

const legacyListingSlugAliases: Readonly<Record<string, string>> = {
  "audi-q5-45-tfsi-quattro-stara-zagora-2021": "bmw-m4-competition-sofia-2021",
};

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

export const mockSavedListingIds = ["am-1001", "am-1003", "am-1008"];

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

export const mockSavedSearches: MockSavedSearch[] = [
  {
    id: "saved-search-premium-suv",
    title: "Premium SUVs under 100k",
    description: "BMW, Audi, and Toyota SUVs with verified sellers.",
    filters: {
      body: "suv",
      category: "car",
      priceMax: 100_000,
      seller: "dealer",
    },
    cadence: "daily",
    newMatches: 3,
    lastRunAt: "2026-06-06T07:00:00.000Z",
  },
  {
    id: "saved-search-lease-ev",
    title: "Lease-ready EVs",
    description: "Electric lease offers with automatic transmission.",
    filters: {
      category: "lease",
      fuel: "electric",
      transmission: "automatic",
    },
    cadence: "instant",
    newMatches: 1,
    lastRunAt: "2026-06-07T06:30:00.000Z",
  },
  {
    id: "saved-search-family-varna",
    title: "Family cars near Varna",
    description: "Low-mileage vehicles in Varna and nearby coastal cities.",
    filters: {
      category: "car",
      location: "Varna",
      mileageMax: 90_000,
    },
    cadence: "weekly",
    newMatches: 0,
    lastRunAt: "2026-06-03T08:00:00.000Z",
  },
];

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

export const mockDealerLeads: MockDealerLead[] = [
  {
    buyerName: "Nikolay Petrov",
    id: "lead-1001",
    intent: "finance",
    listingId: "am-1001",
    listingTitle: "2020 BMW X5 M50d",
    receivedAt: "2026-06-07T07:30:00.000Z",
    source: "listing",
    status: "new",
  },
  {
    buyerName: "Elena Dimitrova",
    id: "lead-1002",
    intent: "test_drive",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    receivedAt: "2026-06-06T15:20:00.000Z",
    source: "saved_search",
    status: "contacted",
  },
  {
    buyerName: "Martin Georgiev",
    id: "lead-1003",
    intent: "availability",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    receivedAt: "2026-06-05T12:10:00.000Z",
    source: "dealer_profile",
    status: "qualified",
  },
  {
    buyerName: "Iva Marinova",
    id: "lead-1004",
    intent: "trade_in",
    listingId: "am-1005",
    listingTitle: "2018 Mercedes-Benz V 250d VIP Business",
    receivedAt: "2026-06-04T09:45:00.000Z",
    source: "listing",
    status: "closed",
  },
];

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

export const mockModerationReports: MockModerationReport[] = [
  {
    id: "report-1001",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    reason: "incorrect_details",
    details:
      "Buyer says lease terms in the message thread do not match the listing price.",
    reporter: "Elena Dimitrova",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Lease price mismatch", "Recent edit", "High intent lead"],
    createdAt: "2026-06-07T09:20:00.000Z",
  },
  {
    id: "report-1002",
    listingId: "am-1006",
    listingTitle: "2021 Range Rover Sport SVR",
    reason: "duplicate",
    details:
      "System found matching photos and mileage on another active dealer listing.",
    reporter: "System",
    source: "system_flag",
    status: "reviewing",
    severity: "medium",
    flags: ["Photo reuse", "Similar VIN pattern"],
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "report-1003",
    listingId: "am-1002",
    listingTitle: "2021 Mercedes-Benz GLE 400d Coupe",
    reason: "seller_behavior",
    details:
      "Reporter says seller asked to move payment to an unverified channel.",
    reporter: "Nikolay Petrov",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Payment risk", "Private seller"],
    createdAt: "2026-06-06T17:30:00.000Z",
  },
  {
    id: "report-1004",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    reason: "prohibited_content",
    details:
      "Admin review flagged promotional copy that may overstate warranty coverage.",
    reporter: "Admin review",
    source: "admin_review",
    status: "dismissed",
    severity: "low",
    flags: ["Copy review"],
    createdAt: "2026-06-05T12:10:00.000Z",
  },
];

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

export const mockTrustReviews: MockTrustReview[] = [
  {
    entityId: "dealer-black-sea-ev",
    entityName: "Black Sea EV",
    entityType: "dealer",
    city: "Varna",
    status: "pending",
    riskLevel: "medium",
    linkedListings: 1,
    documents: ["Business registration", "VAT certificate", "Dealer address"],
    submittedAt: "2026-06-07T08:00:00.000Z",
  },
  {
    entityId: "seller-124",
    entityName: "Private seller",
    entityType: "seller",
    city: "Plovdiv",
    status: "pending",
    riskLevel: "high",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-06T16:15:00.000Z",
  },
  {
    entityId: "dealer-trakia-auto",
    entityName: "Trakia Auto",
    entityType: "dealer",
    city: "Stara Zagora",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["Business registration", "Dealer address"],
    submittedAt: "2026-06-05T10:30:00.000Z",
  },
  {
    entityId: "seller-882",
    entityName: "Private seller",
    entityType: "seller",
    city: "Varna",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-04T14:40:00.000Z",
  },
];

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
