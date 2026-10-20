import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "phone": "0898685288",
    "websiteUrl": "https://valkovcars.mobile.bg/"
  },
  "dealerOrgId": "dealer-valkov-cars-varna",
  "description": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  "displayName": "ВЪЛКОВ КАРС",
  "id": "directory-valkov-cars-varna",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 0
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "valkov-cars-varna",
  "tradeLanes": [],
  "verification": {
    "businessVerified": false,
    "inventoryCurrent": false,
    "trustedSupplier": false
  },
  "headquarters": {
    "countryCode": "BG",
    "city": "Варна"
  }
};
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([assignedDealer]);
export const createMockOrganizationDirectoryScaleEntries = (totalOrganizations = 1) => {
  if (!Number.isSafeInteger(totalOrganizations) || totalOrganizations < 1) throw new Error("Invalid assigned-directory count");
  return organizationDirectoryEntriesSchema.parse(mockOrganizationDirectoryCoreEntries);
};
export const mockOrganizationDirectoryEntries = createMockOrganizationDirectoryScaleEntries();
