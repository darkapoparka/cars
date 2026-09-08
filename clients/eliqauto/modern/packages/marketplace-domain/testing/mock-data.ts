import type { BodyType, FuelType, VehicleListing } from '../types';
import type { MarketplaceSearchParams } from '../search';
import type { MockSavedSearch, MockDealerLead, MockModerationReport, MockTrustReview, MockAuditLogEntry } from './template-mock-data';
import { eliqStock, inventoryCapturedAt } from './eliq-stock';

// Preserve non-public template fixture contracts, explicitly override public stock
// and fabricated customer/activity records below. No module-level array mutation.
export * from './template-mock-data';
const bodyTypes: Record<string, BodyType> = { Sedan: 'sedan', Wagon: 'wagon', SUV: 'suv', Coupe: 'coupe', Hatchback: 'hatchback', Convertible: 'convertible', Minivan: 'van' };
const fuelTypes: Record<string, FuelType> = { 'Бензин': 'gasoline', 'Дизел': 'diesel', 'Хибрид': 'hybrid', 'Електрически': 'electric' };
export const mockListings: VehicleListing[] = eliqStock.map(vehicle => ({
  id: `eliq-${vehicle.id}`, slug: `eliq-${vehicle.id}`, category: 'car',
  dealerOrgId: 'dealer-eliqauto', status: 'active', title: `${vehicle.make} ${vehicle.model}`,
  description: `${vehicle.description} Източник: ${vehicle.sourceUrl}`,
  price: { amount: vehicle.priceEur, currency: 'EUR' }, priceType: 'fixed',
  images: vehicle.images.map(url => ({ url, alt: vehicle.title })), badges: ['used'],
  location: { city: 'Пазарджик', region: 'Пазарджик', country: 'България' },
  features: vehicle.features.map(feature => ({ bg: feature, en: feature })),
  spec: {
    make: vehicle.make, model: vehicle.model, year: vehicle.year,
    bodyType: bodyTypes[vehicle.body], fuelType: fuelTypes[vehicle.fuel],
    transmission: vehicle.transmission === 'Автоматик' ? 'automatic' : 'manual',
    mileageValue: vehicle.mileageKm, mileageUnit: 'km',
    ...(vehicle.powerHp === null ? {} : { enginePowerHp: vehicle.powerHp }), colorExterior: vehicle.color
  },
  seller: { id: 'dealer-eliqauto', type: 'dealer', displayName: 'ELIQ AUTO', verificationStatus: 'unverified', city: 'Пазарджик', logoUrl: '/assets/eliqauto/brand/eliq-auto-wordmark-header.png' },
  // Capture time is used only to order this static preview, not as a live-ad date.
  publishedAt: inventoryCapturedAt, promoted: false
}));

type Comparator = (a: VehicleListing, b: VehicleListing) => number;
const comparators: Record<MarketplaceSearchParams['sort'], Comparator> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year
};
export const getMockListings = (filters: MarketplaceSearchParams): VehicleListing[] => mockListings.filter(listing => {
  const text = [listing.title, listing.description, listing.spec.make, listing.spec.model, listing.spec.trim, listing.location.city, listing.seller.displayName].filter(Boolean).join(' ').toLocaleLowerCase('bg-BG');
  return listing.status === 'active' && listing.category === filters.category
    && (!filters.q || text.includes(filters.q.trim().toLocaleLowerCase('bg-BG')))
    && (!filters.make || listing.spec.make === filters.make)
    && (!filters.model || listing.spec.model === filters.model)
    && (!filters.location || listing.location.city === filters.location)
    && (!filters.origin || filters.origin === 'BG')
    && (!filters.deliverTo || filters.deliverTo === 'BG')
    && (!filters.currency || listing.price.currency === filters.currency)
    && (filters.priceMin === undefined || listing.price.amount >= filters.priceMin)
    && (filters.priceMax === undefined || listing.price.amount <= filters.priceMax)
    && (filters.yearMin === undefined || listing.spec.year >= filters.yearMin)
    && (filters.yearMax === undefined || listing.spec.year <= filters.yearMax)
    && (filters.mileageMax === undefined || listing.spec.mileageValue <= filters.mileageMax)
    && (!filters.fuel || listing.spec.fuelType === filters.fuel)
    && (!filters.transmission || listing.spec.transmission === filters.transmission)
    && (!filters.body || listing.spec.bodyType === filters.body)
    && (!filters.seller || listing.seller.type === filters.seller);
}).sort(comparators[filters.sort]);
export const getMockListingBySlug = (slug: string) => mockListings.find(listing => listing.slug === slug);
export const getMockListingById = (id: string) => mockListings.find(listing => listing.id === id);
export const getMockRelatedListings = (source: VehicleListing, limit = 3) => mockListings
  .filter(listing => listing.status === 'active' && listing.id !== source.id)
  .map(listing => ({ listing, score: Number(listing.category === source.category) * 4 + Number(listing.spec.make === source.spec.make) * 3 + Number(listing.location.city === source.location.city) * 2 + Number(listing.promoted) }))
  .sort((a, b) => b.score - a.score).slice(0, Math.max(0, limit)).map(item => item.listing);
export const getMockDealerInventory = (): VehicleListing[] => [...mockListings];
export const mockSavedListingIds: string[] = [];
export const mockSavedSearches: MockSavedSearch[] = [];
export const mockDealerLeads: MockDealerLead[] = [];
export const mockModerationReports: MockModerationReport[] = [];
export const mockTrustReviews: MockTrustReview[] = [];
export const mockAuditLog: MockAuditLogEntry[] = [];
export const getMockSavedListings = (): VehicleListing[] => mockListings.filter(listing => mockSavedListingIds.includes(listing.id));
export const getMockSellerListings = (): VehicleListing[] => [];
export const getMockSellerListingById = (id: string) => getMockSellerListings().find(listing => listing.id === id);
export const getMockDealerStats = () => ({ activeInventory: mockListings.length, averagePrice: mockListings.length ? mockListings.reduce((sum, listing) => sum + listing.price.amount, 0) / mockListings.length : 0, leadCount: 0, newLeadCount: 0 });
export const getMockAdminStats = () => ({ auditEvents: 0, highRiskReports: 0, openReports: 0, pendingTrustReviews: 0 });
