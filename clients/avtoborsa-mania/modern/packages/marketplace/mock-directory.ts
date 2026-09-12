import { organizationDirectoryEntriesSchema, type OrganizationDirectoryEntry } from './directory';
import { mockListings } from './mock-data';
import { leadSite } from './lead-site';

// One real assigned dealer. These are dated source advertisements, not a live or verified local stock count.
const dealerEntry: OrganizationDirectoryEntry = {
  id: `directory-${leadSite.slug}`, slug: leadSite.slug, dealerOrgId: `dealer-${leadSite.slug}`,
  displayName: leadSite.name, orgType: 'dealer', claimStatus: 'unclaimed',
  headline: `Автомобилни обяви от ${leadSite.name}, ${leadSite.city}`,
  description: 'Неофициална демонстрация по публични обяви, наблюдавани на 09.09.2026. Потвърдете наличността, местоположението и условията с продавача.',
  contact: {phone:leadSite.phoneDisplay,...(leadSite.email ? {email:leadSite.email} : {})},
  headquarters: {city:leadSite.city,countryCode:'BG'}, logoUrl:leadSite.logoPath,
  brandCoverage: [], tradeLanes: [], services: [],
  inventory: {activeListingCount:mockListings.length,sourceStockCount:mockListings.length,localCount:0,inTransitCount:0,orderableCount:0},
  representativeVehicles: mockListings.slice(0,4).map(listing=>({
    id:listing.id,title:listing.title,href:`/listing/${listing.slug}`,availability:'source_stock',price:listing.price,
    image:{url:listing.images[0].url,alt:listing.images[0].alt}
  })),
  verification: {businessVerified:false,inventoryCurrent:false,trustedSupplier:false}
};
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([dealerEntry]);
// Preserve the public test/helper API without populating the dealer preview with unrelated synthetic businesses.
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1): OrganizationDirectoryEntry[] => mockOrganizationDirectoryCoreEntries.map(entry=>({...entry}));
export const mockOrganizationDirectoryEntries = createMockOrganizationDirectoryScaleEntries();
