import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "phone": "0895 303 009",
    "websiteUrl": "https://exclusiveauto.mobile.bg/"
  },
  "dealerOrgId": "dealer-exclusive-auto-varna",
  "description": "Подбрани публични обяви, наблюдавани на 9 септември 2026 г. Потвърдете актуалната наличност, цена и условия с продавача.",
  "displayName": "Exclusive Auto",
  "id": "directory-exclusive-auto-varna",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 8
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "exclusive-auto-varna",
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
const representative = mockListings[0];
if (!representative || !representative.images[0]) throw new Error("Missing recorded assigned-dealer representative listing");
assignedDealer.representativeVehicles = [{ availability: "source_stock", href: "/listing/" + representative.slug, id: representative.id, image: representative.images[0], price: representative.price, title: representative.title }];
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([assignedDealer]);
export const createMockOrganizationDirectoryScaleEntries = (totalOrganizations = 1) => {
  if (!Number.isSafeInteger(totalOrganizations) || totalOrganizations < 1) throw new Error("Invalid assigned-directory count");
  return organizationDirectoryEntriesSchema.parse(mockOrganizationDirectoryCoreEntries);
};
export const mockOrganizationDirectoryEntries = createMockOrganizationDirectoryScaleEntries();
