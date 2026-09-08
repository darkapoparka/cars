import { organizationDirectoryEntriesSchema } from "./directory";
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [
      {
        "authorizationVerified": false,
        "brand": "BMW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Smart",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mercedes-Benz",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "VW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Toyota",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Renault",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359885072555",
      "websiteUrl": "https://championautopro.mobile.bg/"
    },
    "dealerOrgId": "dealer-champion-auto-pro",
    "description": "Автомобили, бартер и лизинг във Варна.",
    "displayName": "Champion Auto Pro",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "Автомобили на бул. Цар Освободител 302",
    "id": "directory-champion-auto-pro",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Champion Auto Pro Варна",
      "url": "/assets/champion/cover.jpg"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/champion-11787294758482309",
        "id": "champion-11787294758482309",
        "image": {
          "alt": "BMW iX 40Xdrive",
          "url": "/assets/champion/vehicle-01-1.webp"
        },
        "price": {
          "amount": 43800,
          "currency": "EUR"
        },
        "title": "BMW iX 40Xdrive"
      },
      {
        "availability": "local",
        "href": "/listing/champion-11787311251312869",
        "id": "champion-11787311251312869",
        "image": {
          "alt": "Audi A6 50TDI Quattro",
          "url": "/assets/champion/vehicle-02-1.webp"
        },
        "price": {
          "amount": 23000,
          "currency": "EUR"
        },
        "title": "Audi A6 50TDI Quattro"
      },
      {
        "availability": "local",
        "href": "/listing/champion-11784794853353090",
        "id": "champion-11784794853353090",
        "image": {
          "alt": "Smart Forfour 22kw.-26000км.",
          "url": "/assets/champion/vehicle-03-1.webp"
        },
        "price": {
          "amount": 12900,
          "currency": "EUR"
        },
        "title": "Smart Forfour 22kw.-26000км."
      }
    ],
    "slug": "champion-auto-pro",
    "tradeLanes": [],
    "verification": {
      "businessVerified": false,
      "inventoryCurrent": false,
      "trustedSupplier": false
    }
  }
]);
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1) => mockOrganizationDirectoryCoreEntries;
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
