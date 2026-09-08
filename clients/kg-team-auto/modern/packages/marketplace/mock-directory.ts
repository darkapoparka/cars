import { organizationDirectoryEntriesSchema } from "./directory";
// Unclaimed prospect profile. No synthetic suppliers or live availability counts.
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359877346262",
      "websiteUrl": "https://team-auto.mobile.bg/"
    },
    "dealerOrgId": "dealer-kg-team-auto",
    "description": "Непубликуван примерен профил на K-G Team Auto. Каталогът съдържа датирани обяви към 09.09.2026 г.; текущата наличност се потвърждава с продавача.",
    "displayName": "K-G Team Auto",
    "headquarters": {
      "city": "Пловдив",
      "countryCode": "BG"
    },
    "headline": "Пловдив · обяви и контакт с продавача",
    "id": "directory-kg-team-auto",
    "inventory": {
      "activeListingCount": 0,
      "inTransitCount": 0,
      "localCount": 0,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Публикувана емблема TEAM AUTO",
      "url": "/dealer/logo.png"
    },
    "representativeVehicles": [],
    "slug": "kg-team-auto",
    "tradeLanes": [],
    "verification": {
      "businessVerified": false,
      "inventoryCurrent": false,
      "trustedSupplier": false
    }
  }
]);
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
// Source-compatible helper; this prospect does not fabricate a scale directory.
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1) => mockOrganizationDirectoryCoreEntries;
