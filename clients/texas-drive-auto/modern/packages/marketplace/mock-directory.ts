import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "phone": "(214) 972-3233",
    "websiteUrl": "https://www.texasdriveauto.com/"
  },
  "dealerOrgId": "dealer-texas-drive-auto",
  "description": "Dated listing samples; confirm price and availability directly with the dealership.",
  "displayName": "Texas Drive Auto",
  "id": "directory-texas-drive-auto",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 8
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "texas-drive-auto",
  "tradeLanes": [],
  "verification": {
    "businessVerified": false,
    "inventoryCurrent": false,
    "trustedSupplier": false
  },
  "headquarters": {
    "countryCode": "US",
    "city": "Dallas",
    "region": "Texas"
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
