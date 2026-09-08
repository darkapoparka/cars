import { organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";
const listings = mockListings.filter((listing) => listing.dealerOrgId === "dealer-legend-auto");
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([{
  brandCoverage: [], claimStatus: "unclaimed",
  contact: { phone: "+359899877305", websiteUrl: "https://legendauto1.mobile.bg/" },
  dealerOrgId: "dealer-legend-auto", description: "Автомобили от LEGEND AUTO във Варна. Потвърдете наличността преди оглед.",
  displayName: "LEGEND AUTO", headquarters: { city: "Варна", countryCode: "BG" },
  headline: "бул. Цар Освободител 289, срещу МАКАО", id: "directory-legend-auto",
  inventory: { activeListingCount: listings.length, inTransitCount: 0, localCount: listings.length, orderableCount: 0, sourceStockCount: 0 },
  orgType: "dealer", profileImage: { alt: "LEGEND AUTO", url: "/assets/legend-auto/logo-original.png" },
  representativeVehicles: listings.slice(0, 3).map((listing) => ({ availability: "local", href: `/listing/${listing.slug}`, id: listing.id, image: listing.images[0], price: listing.price, title: listing.title })),
  slug: "legend-auto", tradeLanes: [], verification: { businessVerified: false, inventoryCurrent: false, trustedSupplier: false }
}]);
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1) => mockOrganizationDirectoryCoreEntries;
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
