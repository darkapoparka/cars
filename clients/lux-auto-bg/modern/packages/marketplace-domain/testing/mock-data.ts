import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {id:"dealer-lux-auto-bg-11776195342993015",slug:"bmw-740-m-pack-x-drive-b-w-panorama-iconic-glow-360-cam-993015",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"BMW 740 M-PACK#X-DRIVE#B&W#PANORAMA#ICONIC GLOW#360* CAM",description:"Обява на ЛУКС АВТО: 2024 г., 130 000 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:79999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11776195342993015-1.webp","alt":"BMW 740 M-PACK#X-DRIVE#B&W#PANORAMA#ICONIC GLOW#360* CAM — снимка 1"},{"url":"/dealer/inventory/11776195342993015-2.webp","alt":"BMW 740 M-PACK#X-DRIVE#B&W#PANORAMA#ICONIC GLOW#360* CAM — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"BMW",model:"740 M-PACK#X-DRIVE#B&W#PANORAMA#ICONIC GLOW#360*",year:2024,bodyType:"other",fuelType:"diesel",transmission:"automatic",mileageValue:130000,mileageUnit:'km',enginePowerHp:300,colorExterior:"Черен"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-21782618805725512",slug:"audi-q8-55tfsi-sq8-pack-matrix-pano-softcl-3d-b-o-725512",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Audi Q8 55TFSI#SQ8 PACK#MATRIX#PANO#SOFTCL#ОБДУХ#3D B&O#",description:"Обява на ЛУКС АВТО: 2019 г., 118 500 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:46999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21782618805725512-1.webp","alt":"Audi Q8 55TFSI#SQ8 PACK#MATRIX#PANO#SOFTCL#ОБДУХ#3D B&O# — снимка 1"},{"url":"/dealer/inventory/21782618805725512-2.webp","alt":"Audi Q8 55TFSI#SQ8 PACK#MATRIX#PANO#SOFTCL#ОБДУХ#3D B&O# — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Audi",model:"Q8 55TFSI#SQ8 PACK#MATRIX#PANO#SOFTCL#ОБДУХ#3D",year:2019,bodyType:"suv",fuelType:"gasoline",transmission:"automatic",mileageValue:118500,mileageUnit:'km',enginePowerHp:340,colorExterior:"Оранжев"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-21774987156419677",slug:"mercedes-benz-gle-coupe-350d-125000-designo-full-full-full-419677",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Mercedes-Benz GLE Coupe 350d#125000КМ#DESIGNO#FULL FULL FULL",description:"Обява на ЛУКС АВТО: 2018 г., 125 000 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:36999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21774987156419677-1.webp","alt":"Mercedes-Benz GLE Coupe 350d#125000КМ#DESIGNO#FULL FULL FULL — снимка 1"},{"url":"/dealer/inventory/21774987156419677-2.webp","alt":"Mercedes-Benz GLE Coupe 350d#125000КМ#DESIGNO#FULL FULL FULL — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Mercedes-Benz",model:"GLE Coupe 350d#125000КМ#DESIGNO#FULL",year:2018,bodyType:"suv",fuelType:"diesel",transmission:"automatic",mileageValue:125000,mileageUnit:'km',enginePowerHp:258,colorExterior:"Бял"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-21782532150311090",slug:"mercedes-benz-gle-coupe-350d-amg-panorama-keyless-360-cam-114840km-311090",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Mercedes-Benz GLE Coupe 350d#AMG#PANORAMA#KEYLESS#360* CAM#114840KM",description:"Обява на ЛУКС АВТО: 2017 г., 114 836 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:34999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/21782532150311090-1.webp","alt":"Mercedes-Benz GLE Coupe 350d#AMG#PANORAMA#KEYLESS#360* CAM#114840KM — снимка 1"},{"url":"/dealer/inventory/21782532150311090-2.webp","alt":"Mercedes-Benz GLE Coupe 350d#AMG#PANORAMA#KEYLESS#360* CAM#114840KM — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Mercedes-Benz",model:"GLE Coupe 350d#AMG#PANORAMA#KEYLESS#360*",year:2017,bodyType:"suv",fuelType:"diesel",transmission:"automatic",mileageValue:114836,mileageUnit:'km',enginePowerHp:258,colorExterior:"Бял"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-11787687890119606",slug:"audi-a4-allroad-3-0tdi-quattro-rotor-led-pdc-119606",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Audi A4 Allroad 3.0TDI#QUATTRO#ROTOR#LED#PDC",description:"Обява на ЛУКС АВТО: 2011 г., 257 000 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:6999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11787687890119606-1.webp","alt":"Audi A4 Allroad 3.0TDI#QUATTRO#ROTOR#LED#PDC — снимка 1"},{"url":"/dealer/inventory/11787687890119606-2.webp","alt":"Audi A4 Allroad 3.0TDI#QUATTRO#ROTOR#LED#PDC — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Audi",model:"A4 Allroad 3.0TDI#QUATTRO#ROTOR#LED#PDC",year:2011,bodyType:"wagon",fuelType:"diesel",transmission:"automatic",mileageValue:257000,mileageUnit:'km',enginePowerHp:239,colorExterior:"Тъмно сив"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-11788926599091776",slug:"vw-polo-1-4tdi-carplay-navi-091776",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"VW Polo 1.4TDI#КЛИМАТРОНИК#КАМЕРА#CARPLAY#NAVI",description:"Обява на ЛУКС АВТО: 2016 г., 168 500 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:4499,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11788926599091776-1.webp","alt":"VW Polo 1.4TDI#КЛИМАТРОНИК#КАМЕРА#CARPLAY#NAVI — снимка 1"},{"url":"/dealer/inventory/11788926599091776-2.webp","alt":"VW Polo 1.4TDI#КЛИМАТРОНИК#КАМЕРА#CARPLAY#NAVI — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"360° камера","en":"360° камера"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"}],spec:{make:"VW",model:"Polo 1.4TDI#КЛИМАТРОНИК#КАМЕРА#CARPLAY#NAVI",year:2016,bodyType:"hatchback",fuelType:"diesel",transmission:"manual",mileageValue:168500,mileageUnit:'km',enginePowerHp:75,colorExterior:"Черен"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-11788875732913376",slug:"audi-rs6-mtm-ceramic-b-o-advanced-laser-softclose-full-full-913376",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Audi Rs6 MTM#CERAMIC#B&O ADVANCED#LASER#SOFTCLOSE#FULL FULL",description:"Обява на ЛУКС АВТО: 2020 г., 99 999 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:88999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11788875732913376-1.webp","alt":"Audi Rs6 MTM#CERAMIC#B&O ADVANCED#LASER#SOFTCLOSE#FULL FULL — снимка 1"},{"url":"/dealer/inventory/11788875732913376-2.webp","alt":"Audi Rs6 MTM#CERAMIC#B&O ADVANCED#LASER#SOFTCLOSE#FULL FULL — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Панорамен покрив","en":"Панорамен покрив"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Audi",model:"Rs6 MTM#CERAMIC#B&O ADVANCED#LASER#SOFTCLOSE#FULL",year:2020,bodyType:"wagon",fuelType:"gasoline",transmission:"automatic",mileageValue:99999,mileageUnit:'km',enginePowerHp:800,colorExterior:"Червен"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
  {id:"dealer-lux-auto-bg-11788874274300857",slug:"mercedes-benz-s-350-4matic-amg-keyless-burmester-300857",category:'car',dealerOrgId:"dealer-lux-auto-bg",status:'active',title:"Mercedes-Benz S 350 4MATIC#AMG#ОБДУХ#KEYLESS#BURMESTER",description:"Обява на ЛУКС АВТО: 2015 г., 258 000 км. Статусът и условията се потвърждават директно с дилъра.",price:{amount:24999,currency:'EUR'},priceType:'fixed',images:[{"url":"/dealer/inventory/11788874274300857-1.webp","alt":"Mercedes-Benz S 350 4MATIC#AMG#ОБДУХ#KEYLESS#BURMESTER — снимка 1"},{"url":"/dealer/inventory/11788874274300857-2.webp","alt":"Mercedes-Benz S 350 4MATIC#AMG#ОБДУХ#KEYLESS#BURMESTER — снимка 2"}],badges:['used'],location:{city:"Стара Загора",country:'България'},features:[{"bg":"4x4","en":"4x4"},{"bg":"360° камера","en":"360° камера"},{"bg":"Подгряване на седалки","en":"Подгряване на седалки"},{"bg":"Навигация","en":"Навигация"},{"bg":"Парктроник","en":"Парктроник"},{"bg":"Безключов достъп","en":"Безключов достъп"}],spec:{make:"Mercedes-Benz",model:"S 350 4MATIC#AMG#ОБДУХ#KEYLESS#BURMESTER",year:2015,bodyType:"sedan",fuelType:"diesel",transmission:"automatic",mileageValue:258000,mileageUnit:'km',enginePowerHp:258,colorExterior:"Черен"},seller:{id:"dealer-lux-auto-bg",type:'dealer',displayName:"ЛУКС АВТО",verificationStatus:'unverified',city:"Стара Загора",logoUrl:'/dealer/brand/logo.jpg'},publishedAt:'2026-09-09T12:00:00.000Z',promoted:false},
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
