import type { MarketplaceSearchParams } from '../search';
import type { Money, VehicleListing } from '../types';
import facts from './dealer-facts.json';
import media from './media-manifest.json';

const featureTranslations: Record<string, string> = {
  'Климатроник': 'Climate control', 'Климатик': 'Air conditioning',
  'Навигация': 'Navigation', 'Парктроник': 'Parking sensors',
  'Подгряване на седалките': 'Heated seats', 'Сервизна книжка': 'Service book',
  'Ксенонови фарове': 'Xenon headlights', 'Лети джанти': 'Alloy wheels',
  'Бордкомпютър': 'Trip computer', 'Ел. стъкла': 'Electric windows',
  'Кожен салон': 'Leather interior', '4x4': '4x4'
};
const localPhotos = new Set(media.records.map(record => record.path));

// Active means published in this dated snapshot, not verified available.
// Only cars with complete, locally committed photo selections are rendered.
export const mockListings: VehicleListing[] = facts.vehicles
  .filter(record => record.photos.length > 0 && record.photos.every(photo => localPhotos.has(photo.path)))
  .map((record) => ({
    id: `${facts.slug}-${record.sourceId}`,
    slug: record.slug,
    category: 'car',
    dealerOrgId: `dealer-${facts.slug}`,
    status: 'active',
    title: record.title,
    description: `${record.title}. ${facts.availabilityNotice} Източник: обява ${record.sourceId}. ${record.taxQualification === 'VAT included' ? 'Цената е с ДДС според обявата.' : 'ДДС не се начислява според обявата.'}`,
    price: { amount: record.price, currency: record.currency },
    priceType: 'fixed',
    images: record.photos.map((photo, index) => ({
      url: photo.path,
      alt: `${record.title} — снимка ${index + 1} от публикуваната обява`
    })),
    badges: ['used'],
    location: { city: facts.city, country: facts.country },
    features: record.features.map((feature) => ({
      bg: feature, en: featureTranslations[feature] ?? feature
    })),
    spec: {
      make: record.make,
      model: record.model,
      trim: record.trim,
      year: record.year,
      bodyType: record.body as VehicleListing['spec']['bodyType'],
      fuelType: record.fuel as VehicleListing['spec']['fuelType'],
      transmission: record.transmission as VehicleListing['spec']['transmission'],
      mileageValue: record.mileageKm,
      mileageUnit: 'km',
      enginePowerHp: record.powerHp,
      colorExterior: record.color
    },
    seller: {
      id: `dealer-${facts.slug}`,
      type: 'dealer',
      displayName: facts.name,
      logoUrl: facts.logoPath,
      verificationStatus: 'unverified',
      city: facts.city
    },
    // Deterministic ordering only; this is not the original ad publication date.
    publishedAt: `${facts.observedAt}T00:00:00.000Z`,
    promoted: false
  }));

export const getSourceRecordByListingId = (id: string) =>
  facts.vehicles.find((record) => `${facts.slug}-${record.sourceId}` === id);

const matchesText = (listing: VehicleListing, query: string) =>
  [listing.title, listing.description, listing.spec.make, listing.spec.model,
    listing.spec.trim, listing.location.city, listing.seller.displayName]
    .filter(Boolean).join(' ').toLocaleLowerCase('bg-BG')
    .includes(query.trim().toLocaleLowerCase('bg-BG'));

type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;
const comparators: Record<MarketplaceSearchParams['sort'], ListingComparator> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year
};

export const getMockListings = (filters: MarketplaceSearchParams) => {
  const filtered = mockListings.filter((listing) =>
    listing.status === 'active' &&
    listing.category === filters.category &&
    (!filters.q || matchesText(listing, filters.q)) &&
    (!filters.make || listing.spec.make === filters.make) &&
    (!filters.model || listing.spec.model === filters.model) &&
    (!filters.location || listing.location.city === filters.location) &&
    (!filters.origin || listing.supply?.origin.countryCode === filters.origin) &&
    (!filters.deliverTo || !!listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo)) &&
    (!filters.currency || listing.price.currency === filters.currency) &&
    (filters.priceMin === undefined || listing.price.amount >= filters.priceMin) &&
    (filters.priceMax === undefined || listing.price.amount <= filters.priceMax) &&
    (filters.yearMin === undefined || listing.spec.year >= filters.yearMin) &&
    (filters.yearMax === undefined || listing.spec.year <= filters.yearMax) &&
    (filters.mileageMax === undefined || listing.spec.mileageValue <= filters.mileageMax) &&
    (!filters.fuel || listing.spec.fuelType === filters.fuel) &&
    (!filters.transmission || listing.spec.transmission === filters.transmission) &&
    (!filters.body || listing.spec.bodyType === filters.body) &&
    (!filters.seller || listing.seller.type === filters.seller)
  );
  return filtered.sort(comparators[filters.sort] ?? comparators.recommended);
};

export const getMockListingBySlug = (slug: string) => mockListings.find((listing) => listing.slug === slug);
export const getMockListingById = (id: string) => mockListings.find((listing) => listing.id === id);
export const getMockRelatedListings = (source: VehicleListing, limit = 3) => {
  const score = (listing: VehicleListing) => Number(listing.spec.make === source.spec.make) * 3 + Number(listing.spec.bodyType === source.spec.bodyType) * 2;
  return mockListings.filter((listing) => listing.id !== source.id && listing.status === 'active')
    .sort((a, b) => score(b) - score(a)).slice(0, Math.max(0, limit));
};

// Preserve the workspace API without fabricated private/commercial activity.
export const mockSavedListingIds: string[] = [];
export const getMockSavedListings = () => mockListings.filter((listing) => mockSavedListingIds.includes(listing.id));
export interface MockSavedSearch {
  cadence: 'instant' | 'daily' | 'weekly'; description: string;
  filters: Partial<MarketplaceSearchParams>; id: string; lastRunAt: string;
  newMatches: number; title: string;
}
export const mockSavedSearches: MockSavedSearch[] = [];
export const getMockSellerListings = (): VehicleListing[] => [];
export const getMockSellerListingById = (id: string) => getMockSellerListings().find((listing) => listing.id === id);
export const getMockDealerInventory = () => mockListings.filter((listing) => listing.seller.type === 'dealer');
export interface MockDealerLead {
  buyerName: string; id: string; intent: 'test_drive' | 'finance' | 'trade_in' | 'availability';
  listingId: string; listingTitle: string; receivedAt: string;
  source: 'listing' | 'saved_search' | 'dealer_profile';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}
export const mockDealerLeads: MockDealerLead[] = [];
export const getMockDealerStats = () => {
  const inventory = getMockDealerInventory();
  return {
    activeInventory: inventory.filter((listing) => listing.status === 'active').length,
    averagePrice: inventory.length ? inventory.reduce((sum, listing) => sum + listing.price.amount, 0) / inventory.length : 0,
    leadCount: 0, newLeadCount: 0
  };
};

export interface MockModerationReport {
  createdAt: string; details: string; flags: string[]; id: string;
  listingId: string; listingTitle: string;
  reason: 'duplicate' | 'fraud_risk' | 'incorrect_details' | 'prohibited_content' | 'seller_behavior';
  reporter: string; severity: 'low' | 'medium' | 'high';
  source: 'buyer_report' | 'system_flag' | 'admin_review';
  status: 'new' | 'reviewing' | 'resolved' | 'dismissed';
}
export const mockModerationReports: MockModerationReport[] = [];
export interface MockTrustReview {
  city: string; documents: string[]; entityId: string; entityName: string;
  entityType: 'dealer' | 'seller'; linkedListings: number;
  riskLevel: 'low' | 'medium' | 'high';
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
  current?: boolean; description: string; id: string; leadCredits: number;
  listingLimit: number; monthlyPrice: Money; name: string; promotionCredits: number;
  support: 'standard' | 'priority' | 'managed';
}
const disabledPlan: MockDealerPlan = {
  id: 'offline-preview', name: 'Демонстрация — търговските функции са изключени',
  description: 'Технически празен режим. Това не е абонамент, оферта или клиентски профил.',
  leadCredits: 0, listingLimit: 0, monthlyPrice: { amount: 0, currency: facts.currency },
  promotionCredits: 0, support: 'standard'
};
export const mockDealerPlans: MockDealerPlan[] = [];
export interface MockPromotionProduct {
  description: string; durationDays: number; id: string; label: string;
  placement: 'search_top' | 'category_featured' | 'lease_partner'; price: Money;
}
export const mockPromotionProducts: MockPromotionProduct[] = [];
export interface MockActivePromotion {
  clicks: number; endsAt: string; id: string; impressions: number; leads: number;
  listingId: string; productId: string; spend: Money; startsAt: string;
  status: 'scheduled' | 'active' | 'ended';
}
export const mockActivePromotions: MockActivePromotion[] = [];
export interface MockDealerBillingAccount {
  currentPlanId: string; includedLeadCredits: number; invoiceBalance: Money;
  monthlySpend: Money; paymentMethod: string; renewalDate: string;
  status: 'active' | 'past_due' | 'trialing'; usedLeadCredits: number;
}
export const mockDealerBillingAccount: MockDealerBillingAccount = {
  currentPlanId: 'offline-preview', includedLeadCredits: 0,
  invoiceBalance: { amount: 0, currency: facts.currency },
  monthlySpend: { amount: 0, currency: facts.currency },
  paymentMethod: 'OFFLINE PREVIEW — NO PAYMENTS OR ACCOUNT', renewalDate: '',
  status: 'trialing', usedLeadCredits: 0
};
export const getMockCurrentDealerPlan = () => disabledPlan;
export const getMockPromotionProductById = (id: string) => mockPromotionProducts.find((product) => product.id === id);
export const getMockMonetizationStats = () => ({
  activePromotions: 0, leadCreditsRemaining: 0, promotionLeads: 0,
  promotionSpend: { amount: 0, currency: facts.currency } satisfies Money
});
