import { type OrganizationDirectoryEntry, organizationDirectoryEntriesSchema } from "./directory";
import { mockListings } from "./mock-data";

// Assigned dealer snapshot. Directory scale does not authorize donor organizations or current-stock claims.
const assignedDealer: OrganizationDirectoryEntry = {
  "brandCoverage": [],
  "claimStatus": "unclaimed",
  "contact": {
    "email": "askogroup@abv.bg",
    "phone": "0899 76 96 96",
    "websiteUrl": "https://asko96.bg/"
  },
  "dealerOrgId": "dealer-asko-96",
  "description": "Подбрани автомобили от публикуваните обяви. Наличностите и условията се потвърждават с АСКО 96.",
  "displayName": "АСКО 96",
  "id": "directory-asko-96",
  "inventory": {
    "activeListingCount": 0,
    "inTransitCount": 0,
    "localCount": 0,
    "orderableCount": 0,
    "sourceStockCount": 16
  },
  "orgType": "dealer",
  "representativeVehicles": [],
  "slug": "asko-96",
  "tradeLanes": [],
  "verification": {
    "businessVerified": false,
    "inventoryCurrent": false,
    "trustedSupplier": false
  },
  "headquarters": {
    "countryCode": "BG",
    "city": "София"
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
