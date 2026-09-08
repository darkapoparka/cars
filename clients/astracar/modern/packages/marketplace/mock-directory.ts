import { organizationDirectoryEntriesSchema } from './directory';
import { mockListings } from './mock-data';

// Only this dealer's dated representative stock is exposed in the local demo.
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([{
  brandCoverage: [], claimStatus: 'unclaimed',
  contact: { phone: '+359899908040', websiteUrl: 'https://astracar.mobile.bg/' },
  dealerOrgId: 'dealer-astracar',
  description: 'Подбрани публикувани автомобили на Астракар. Наличностите и условията се потвърждават по телефона.',
  displayName: 'Астракар', headquarters: { city: 'Варна', countryCode: 'BG' },
  headline: 'Автомобили на бул. Цар Освободител 282', id: 'directory-astracar',
  inventory: { activeListingCount: mockListings.length, inTransitCount: 0, localCount: mockListings.length, orderableCount: 0, sourceStockCount: 0 },
  orgType: 'dealer',
  profileImage: { alt: 'Астракар — официално рекламно изображение', url: '/assets/astracar/astracar-cover.jpg' },
  representativeVehicles: mockListings.slice(0, 3).map(listing => ({ availability: 'local', href: `/listing/${listing.slug}`, id: listing.id, image: listing.images[0], price: listing.price, title: listing.title })),
  slug: 'astracar', tradeLanes: [],
  verification: { businessVerified: false, inventoryCurrent: false, trustedSupplier: false },
}]);
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1) => mockOrganizationDirectoryCoreEntries;
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
