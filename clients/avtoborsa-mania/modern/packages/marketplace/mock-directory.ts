import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "phone": "0899 874 488",
    "websiteUrl": "https://mania.mobile.bg/"
  },
  "dealerOrgId": "dealer-avtoborsa-mania",
  "description": "Демонстрационни автомобили от шаблона, а не наличност на автокъщата. Illustrative template vehicles, not this dealership’s stock.",
  "displayName": "АВТОБОРСА МАНИЯ",
  "id": "directory-avtoborsa-mania",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 0
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "avtoborsa-mania",
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
