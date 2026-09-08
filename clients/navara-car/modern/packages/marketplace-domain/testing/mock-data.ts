import type { MarketplaceSearchParams } from '../search';
import type { BodyType, FuelType, Money, Transmission, VehicleListing } from '../types';
import source from './navara-data.json';

const featureEnglish: Record<string, string> = {
  'Навигация': 'Navigation', 'Парктроник': 'Parking sensors',
  'Подгряване на седалки': 'Heated seats', 'Климатик': 'Air conditioning',
  'Сензор за дъжд': 'Rain sensor', 'Термопомпа': 'Heat pump',
  'Камера за заден ход': 'Reversing camera', 'Шибедах': 'Sunroof',
  'Газова уредба': 'LPG system', 'Климатроник': 'Climate control',
  'Панорамен люк': 'Panoramic sunroof', 'Ел. стъкла': 'Electric windows',
  'Бордкомпютър': 'Trip computer'
};
const bodyTypes: Record<string, BodyType> = {
  Hatchback: 'hatchback', Sedan: 'sedan', SUV: 'suv', Wagon: 'wagon'
};
const fuelTypes: Record<string, FuelType> = {
  petrol: 'gasoline', diesel: 'diesel', electric: 'electric'
};

/**
 * The public storefront's existing demo-data boundary.
 * 'active' enables browsing only: it is not independently verified current stock.
 * publishedAt is the snapshot indexing date; sourceObservedAt/availabilityLabel
 * make its meaning explicit. No source publication timestamp was inferred.
 */
export type SourceBackedListing = VehicleListing & {
  sourceUrl: string;
  sourceObservedAt: string;
  availabilityLabel: string;
};
export const mockListings: SourceBackedListing[] = source.vehicles.map((vehicle) => ({
  id: `navara-${vehicle.id}`,
  slug: vehicle.slug,
  category: 'car',
  dealerOrgId: 'preview-navara-car',
  status: 'active',
  title: vehicle.title,
  description: `${vehicle.title} — ${vehicle.year} г., ${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км, ${vehicle.fuel.toLowerCase()}, ${vehicle.transmission.toLowerCase()}. ${source.inventoryNotice}`,
  price: { amount: vehicle.priceEur, currency: 'EUR' },
  priceType: 'fixed',
  images: vehicle.images.map((url, index) => ({
    url,
    alt: `${vehicle.title} — снимка ${index + 1} от обява на ${source.business.name}`
  })),
  badges: ['used'],
  location: { city: source.business.city, region: 'Кайсиева градина', country: source.business.country },
  features: vehicle.features.map((feature) => ({ bg: feature, en: featureEnglish[feature] ?? feature })),
  spec: {
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.title,
    year: vehicle.year,
    bodyType: bodyTypes[vehicle.bodyType] ?? 'other',
    fuelType: vehicle.fuel.includes('LPG') ? 'lpg' : fuelTypes[vehicle.fuelType] ?? 'other',
    transmission: vehicle.transmissionType as Transmission,
    mileageValue: vehicle.mileageKm,
    mileageUnit: 'km',
    enginePowerHp: vehicle.powerHp,
    colorExterior: vehicle.color
  },
  seller: {
    id: 'preview-navara-car',
    type: 'dealer',
    displayName: source.business.name,
    verificationStatus: 'unverified',
    city: source.business.city,
    logoUrl: '/navara/wordmark.svg'
  },
  publishedAt: `${vehicle.observedAt}T00:00:00.000Z`,
  promoted: false,
  sourceUrl: vehicle.sourceUrl,
  sourceObservedAt: vehicle.observedAt,
  availabilityLabel: source.availabilityLabel
}));

const matchesText = (listing: VehicleListing, query: string) => {
  const haystack = [listing.title, listing.description, listing.spec.make,
    listing.spec.model, listing.spec.trim, listing.location.city, listing.seller.displayName]
    .filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
};
type ListingPredicate = (listing: VehicleListing) => boolean;
type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;
const createListingPredicates = (filters: MarketplaceSearchParams): ListingPredicate[] => [
  (listing) => listing.status === 'active',
  (listing) => listing.category === filters.category,
  (listing) => !filters.q || matchesText(listing, filters.q),
  (listing) => !filters.make || listing.spec.make === filters.make,
  (listing) => !filters.model || listing.spec.model === filters.model,
  (listing) => !filters.location || listing.location.city === filters.location,
  (listing) => !filters.origin || listing.supply?.origin.countryCode === filters.origin ||
    (filters.origin === 'BG' && ['Bulgaria', 'България'].includes(listing.location.country)),
  (listing) => !filters.deliverTo || Boolean(listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo)) ||
    (filters.deliverTo === 'BG' && ['Bulgaria', 'България'].includes(listing.location.country)),
  (listing) => !filters.currency || listing.price.currency === filters.currency,
  (listing) => filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  (listing) => filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  (listing) => filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  (listing) => filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  (listing) => filters.mileageMax === undefined || listing.spec.mileageValue <= filters.mileageMax,
  (listing) => !filters.fuel || listing.spec.fuelType === filters.fuel,
  (listing) => !filters.transmission || listing.spec.transmission === filters.transmission,
  (listing) => !filters.body || listing.spec.bodyType === filters.body,
  (listing) => !filters.seller || listing.seller.type === filters.seller
];
const listingComparators: Record<MarketplaceSearchParams['sort'], ListingComparator> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year
};
export const getMockListings = (filters: MarketplaceSearchParams) => {
  const predicates = createListingPredicates(filters);
  return mockListings.filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};
export const getMockListingBySlug = (slug: string) => mockListings.find((listing) => listing.slug === slug);
export const getMockListingById = (id: string) => mockListings.find((listing) => listing.id === id);
const scoreRelatedListing = (listing: VehicleListing, candidate: VehicleListing) =>
  Number(candidate.category === listing.category) * 4 +
  Number(candidate.spec.make === listing.spec.make) * 3 +
  Number(candidate.location.city === listing.location.city) * 2 + Number(candidate.promoted);
export const getMockRelatedListings = (listing: VehicleListing, limit = 3) => mockListings
  .filter((candidate) => candidate.status === 'active' && candidate.id !== listing.id)
  .map((candidate) => ({ listing: candidate, score: scoreRelatedListing(listing, candidate) }))
  .sort((a, b) => b.score - a.score).slice(0, limit).map(({ listing: candidate }) => candidate);

// No source user's saved activity, CRM leads, trust decisions, billing identity or sales history is inherited.
export const mockSavedListingIds: string[] = [];
export const getMockSavedListings = () => mockListings.filter((listing) => mockSavedListingIds.includes(listing.id));
export interface MockSavedSearch {
  cadence: 'instant' | 'daily' | 'weekly'; description: string;
  filters: Partial<MarketplaceSearchParams>; id: string; lastRunAt: string; newMatches: number; title: string;
}
export const mockSavedSearches: MockSavedSearch[] = [];
export const getMockSellerListings = (): VehicleListing[] => [];
export const getMockSellerListingById = (id: string) => getMockSellerListings().find((listing) => listing.id === id);
export const getMockDealerInventory = () => mockListings.filter((listing) => listing.seller.type === 'dealer');
export interface MockDealerLead {
  buyerName: string; id: string; intent: 'test_drive' | 'finance' | 'trade_in' | 'availability';
  listingId: string; listingTitle: string; receivedAt: string;
  source: 'listing' | 'saved_search' | 'dealer_profile'; status: 'new' | 'contacted' | 'qualified' | 'closed';
}
export const mockDealerLeads: MockDealerLead[] = [];
export const getMockDealerStats = () => {
  const inventory = getMockDealerInventory();
  return {
    activeInventory: inventory.filter((listing) => listing.status === 'active').length,
    averagePrice: inventory.length ? inventory.reduce((total, listing) => total + listing.price.amount, 0) / inventory.length : 0,
    leadCount: 0, newLeadCount: 0
  };
};
export interface MockModerationReport {
  createdAt: string; details: string; flags: string[]; id: string; listingId: string; listingTitle: string;
  reason: 'duplicate' | 'fraud_risk' | 'incorrect_details' | 'prohibited_content' | 'seller_behavior';
  reporter: string; severity: 'low' | 'medium' | 'high'; source: 'buyer_report' | 'system_flag' | 'admin_review';
  status: 'new' | 'reviewing' | 'resolved' | 'dismissed';
}
export const mockModerationReports: MockModerationReport[] = [];
export interface MockTrustReview {
  city: string; documents: string[]; entityId: string; entityName: string; entityType: 'dealer' | 'seller';
  linkedListings: number; riskLevel: 'low' | 'medium' | 'high';
  status: 'unverified' | 'pending' | 'verified' | 'rejected'; submittedAt: string;
}
export const mockTrustReviews: MockTrustReview[] = [];
export interface MockAuditLogEntry {
  action: string; actor: string; createdAt: string; entityId: string;
  entityType: 'listing' | 'report' | 'seller' | 'dealer'; id: string; note: string;
}
export const mockAuditLog: MockAuditLogEntry[] = [];
export const getMockAdminStats = () => ({ auditEvents: 0, highRiskReports: 0, openReports: 0, pendingTrustReviews: 0 });
export interface MockDealerPlan {
  current?: boolean; description: string; id: string; leadCredits: number; listingLimit: number;
  monthlyPrice: Money; name: string; promotionCredits: number; support: 'standard' | 'priority' | 'managed';
}
export const mockDealerPlans: MockDealerPlan[] = [];
export interface MockPromotionProduct {
  description: string; durationDays: number; id: string; label: string;
  placement: 'search_top' | 'category_featured' | 'lease_partner'; price: Money;
}
export const mockPromotionProducts: MockPromotionProduct[] = [];
export interface MockActivePromotion {
  clicks: number; endsAt: string; id: string; impressions: number; leads: number; listingId: string;
  productId: string; spend: Money; startsAt: string; status: 'scheduled' | 'active' | 'ended';
}
export const mockActivePromotions: MockActivePromotion[] = [];
export interface MockDealerBillingAccount {
  currentPlanId: string; includedLeadCredits: number; invoiceBalance: Money; monthlySpend: Money;
  paymentMethod: string; renewalDate: string; status: 'active' | 'past_due' | 'trialing'; usedLeadCredits: number;
}
// A provider-free empty preview state, not an account registered for the business.
export const mockDealerBillingAccount: MockDealerBillingAccount = {
  currentPlanId: '', status: 'trialing', renewalDate: '', paymentMethod: 'Не е конфигурирано',
  invoiceBalance: { amount: 0, currency: 'EUR' }, monthlySpend: { amount: 0, currency: 'EUR' },
  includedLeadCredits: 0, usedLeadCredits: 0
};
const unconfiguredPlan: MockDealerPlan = {
  id: 'preview-not-configured', name: 'Не е конфигурирано',
  description: 'Техническо състояние на демонстрацията, а не абонамент или търговска оферта.',
  leadCredits: 0, listingLimit: 0, monthlyPrice: { amount: 0, currency: 'EUR' },
  promotionCredits: 0, support: 'standard'
};
export const getMockCurrentDealerPlan = () => unconfiguredPlan;
export const getMockPromotionProductById = (id: string) => mockPromotionProducts.find((product) => product.id === id);
export const getMockMonetizationStats = () => ({
  activePromotions: 0, leadCreditsRemaining: 0, promotionLeads: 0,
  promotionSpend: { amount: 0, currency: 'EUR' } satisfies Money
});
