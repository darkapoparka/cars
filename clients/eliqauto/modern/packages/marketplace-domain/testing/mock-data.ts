import type { BodyType, FuelType, VehicleListing } from '../types';
import { eliqStock, inventoryCapturedAt } from './eliq-stock';
import * as fixtures from './template-mock-data';

const bodyTypes: Record<string, BodyType> = { Sedan: 'sedan', Wagon: 'wagon', SUV: 'suv', Coupe: 'coupe', Hatchback: 'hatchback', Convertible: 'convertible', Minivan: 'van' };
const fuelTypes: Record<string, FuelType> = { 'Бензин': 'gasoline', 'Дизел': 'diesel', 'Хибрид': 'hybrid', 'Електрически': 'electric' };
const listings: VehicleListing[] = eliqStock.map(vehicle => ({
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
  // Static preview ordering uses the capture timestamp, not a claimed live publication date.
  publishedAt: inventoryCapturedAt, promoted: false
}));

/**
 * Bind the preserved template's preview helpers to this one dealer's dataset.
 * This happens once at module initialization, never from a request or user input.
 * Keeping the original array object means search/detail/related helpers share the
 * same cars rather than returning a second, inherited dealer inventory.
 */
fixtures.mockListings.splice(0, fixtures.mockListings.length, ...listings);
fixtures.mockSavedListingIds.splice(0);
fixtures.mockSavedSearches.splice(0);
fixtures.mockDealerLeads.splice(0);
fixtures.mockModerationReports.splice(0);
fixtures.mockTrustReviews.splice(0);
fixtures.mockAuditLog.splice(0);
export * from './template-mock-data';
