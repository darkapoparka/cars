import { organizationDirectoryEntriesSchema } from './directory';
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [
      {
        "authorizationVerified": false,
        "brand": "VW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Seat",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Renault",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Peugeot",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Ford",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mercedes-Benz",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Citroen",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Dacia",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "BMW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Nissan",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359886251705",
      "websiteUrl": "https://priselci.mobile.bg/"
    },
    "dealerOrgId": "dealer-priselci",
    "description": "Употребявани автомобили във Варна. Обадете се за наличност и оглед.",
    "displayName": "Автокъща Приселци",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "Автомобили на бул. Цар Освободител 285",
    "id": "directory-priselci",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
      "url": "/assets/priselci/vehicle-05-1.webp"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/priselci-11784527405061757",
        "id": "priselci-11784527405061757",
        "image": {
          "alt": "VW Golf 1.4 БЕНЗИН",
          "url": "/assets/priselci/vehicle-01-1.webp"
        },
        "price": {
          "amount": 3600,
          "currency": "EUR"
        },
        "title": "VW Golf 1.4 БЕНЗИН"
      },
      {
        "availability": "local",
        "href": "/listing/priselci-11758270885113337",
        "id": "priselci-11758270885113337",
        "image": {
          "alt": "VW Passat 1.4 БЕНЗИН",
          "url": "/assets/priselci/vehicle-02-1.webp"
        },
        "price": {
          "amount": 4299,
          "currency": "EUR"
        },
        "title": "VW Passat 1.4 БЕНЗИН"
      },
      {
        "availability": "local",
        "href": "/listing/priselci-11753962633467246",
        "id": "priselci-11753962633467246",
        "image": {
          "alt": "VW Passat 2.0TDI COMMONRAIL",
          "url": "/assets/priselci/vehicle-03-1.webp"
        },
        "price": {
          "amount": 3900,
          "currency": "EUR"
        },
        "title": "VW Passat 2.0TDI COMMONRAIL"
      }
    ],
    "slug": "priselci",
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
