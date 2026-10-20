import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "phone": "0878483604",
    "websiteUrl": "https://kalo.mobile.bg/"
  },
  "dealerOrgId": "dealer-kalo-0404-varna",
  "description": "Показаните демонстрационни автомобили са илюстративни и не представляват наличности на автокъщата. За действителните оферти и наличности се свържете директно с нея.",
  "displayName": "Кало 0404",
  "id": "directory-kalo-0404-varna",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 0
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "kalo-0404-varna",
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
