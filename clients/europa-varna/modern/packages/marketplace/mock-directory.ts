import {
  type OrganizationDirectoryEntry,
  organizationDirectoryEntriesSchema,
} from "./directory";
import { dealer } from "./dealer-profile";
import { mockListings } from "./mock-data";

// This application represents one assigned dealership, not the master's
// multi-organization marketplace or its synthetic scale-testing fixtures.
// Read the same dated listings used by cards/details; never look up am-1009
// or other source-template IDs, which do not exist in these client datasets.
const representativeVehicles: OrganizationDirectoryEntry["representativeVehicles"] =
  mockListings.slice(0, 3).map((listing) => {
    const image = listing.images[0];
    return {
      availability: "source_stock",
      href: `/listing/${listing.slug}`,
      id: listing.id || listing.slug,
      ...(image ? { image: { alt: image.alt, url: image.url } } : {}),
      price: listing.price,
      title: listing.title,
    };
  });

export const mockOrganizationDirectoryCoreEntries: OrganizationDirectoryEntry[] =
  organizationDirectoryEntriesSchema.parse([
    {
      brandCoverage: [],
      claimStatus: "unclaimed",
      contact: {
        phone: dealer.phoneE164,
        websiteUrl: dealer.sourceUrl,
      },
      dealerOrgId: `dealer-${dealer.slug}`,
      description: dealer.stockNotice,
      displayName: dealer.name,
      headline: `Публикувани обяви · ${dealer.city}`,
      headquarters: { city: dealer.city, countryCode: "BG" },
      id: `directory-${dealer.slug}`,
      inventory: {
        // The source snapshot is not confirmation of live/local availability.
        activeListingCount: 0,
        inTransitCount: 0,
        localCount: 0,
        orderableCount: 0,
        sourceStockCount: mockListings.length,
      },
      logoUrl: dealer.logo,
      orgType: "dealer",
      profileImage: { alt: dealer.name, url: dealer.logo },
      representativeVehicles,
      slug: dealer.slug,
      tradeLanes: [],
      verification: {
        businessVerified: false,
        inventoryCurrent: false,
        trustedSupplier: false,
      },
    },
  ]);

/**
 * Retained export for existing callers. A dealer demo remains bounded to its
 * one assigned account even when an old caller requests scale fixtures.
 * No synthetic businesses, verified badges or fictitious stock are generated.
 */
export const createMockOrganizationDirectoryScaleEntries = (
  _totalOrganizations = mockOrganizationDirectoryCoreEntries.length
): OrganizationDirectoryEntry[] =>
  organizationDirectoryEntriesSchema.parse(mockOrganizationDirectoryCoreEntries);

export const mockOrganizationDirectoryEntries =
  createMockOrganizationDirectoryScaleEntries();
