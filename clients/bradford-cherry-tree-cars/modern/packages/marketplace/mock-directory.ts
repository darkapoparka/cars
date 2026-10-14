import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {},
  "dealerOrgId": "dealer-bradford-cherry-tree-cars",
  "description": "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
  "displayName": "Cherry Tree Cars Ltd",
  "id": "directory-bradford-cherry-tree-cars",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 8
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "bradford-cherry-tree-cars",
  "tradeLanes": [],
  "verification": {
    "businessVerified": false,
    "inventoryCurrent": false,
    "trustedSupplier": false
  },
  "headquarters": {
    "countryCode": "GB",
    "city": "Bradford, West Yorkshire"
  }
};
const representative = mockListings[0];
if (!representative || !representative.images[0]) throw new Error("Missing recorded assigned-dealer representative listing");
assignedDealer.representativeVehicles = [{ availability: "source_stock", href: "/listing/" + representative.slug, id: representative.id, image: representative.images[0], price: representative.price, title: representative.title }];
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([assignedDealer]);
export const createMockOrganizationDirectoryScaleEntries = (totalOrganizations = 1) => {
  if (!Number.isSafeInteger(totalOrganizations) || totalOrganizations < 1) throw new Error("Invalid assigned-directory count");
  return organizationDirectoryEntriesSchema.parse(mockOrganizationDirectoryCoreEntries);
};
export const mockOrganizationDirectoryEntries = createMockOrganizationDirectoryScaleEntries();
