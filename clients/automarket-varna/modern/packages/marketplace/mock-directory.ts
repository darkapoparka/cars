import { organizationDirectoryEntriesSchema } from './directory';
// Representative dealer snapshot. No independent supplier directory is offered by this dealer demo.
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "id": "directory-automarket-varna",
    "slug": "automarket-varna",
    "dealerOrgId": "dealer-automarket-varna",
    "displayName": "Аутомаркет Варна",
    "orgType": "dealer",
    "claimStatus": "unclaimed",
    "description": "Представителни обяви към 07.09.2026 г. Потвърдете наличността и условията по телефона.",
    "headline": "Употребявани автомобили от ЕС във Варна",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "contact": {
      "phone": "+359886424400",
      "websiteUrl": "https://automarket.mobile.bg/"
    },
    "brandCoverage": [
      {
        "brand": "Ford",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Opel",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Honda",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "VW",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Nissan",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Dacia",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Mazda",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Suzuki",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "BMW",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Mercedes-Benz",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      },
      {
        "brand": "Audi",
        "authorizationVerified": false,
        "relationship": "independent_importer"
      }
    ],
    "inventory": {
      "activeListingCount": 16,
      "localCount": 16,
      "inTransitCount": 0,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "profileImage": {
      "url": "/assets/automarket/cover.png",
      "alt": "Аутомаркет Варна"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/automarket-11785576029711434",
        "id": "automarket-11785576029711434",
        "image": {
          "url": "/assets/automarket/vehicle-01-1.webp",
          "alt": "Ford Focus 1.6D 115HP"
        },
        "price": {
          "amount": 5112,
          "currency": "EUR"
        },
        "title": "Ford Focus 1.6D 115HP"
      },
      {
        "availability": "local",
        "href": "/listing/automarket-11714813323555032",
        "id": "automarket-11714813323555032",
        "image": {
          "url": "/assets/automarket/vehicle-02-1.webp",
          "alt": "Opel Astra 1.4i 90HP"
        },
        "price": {
          "amount": 2555.95,
          "currency": "EUR"
        },
        "title": "Opel Astra 1.4i 90HP"
      },
      {
        "availability": "local",
        "href": "/listing/automarket-11776340911802527",
        "id": "automarket-11776340911802527",
        "image": {
          "url": "/assets/automarket/vehicle-03-1.webp",
          "alt": "Opel Corsa 1.2i 80HP GPL"
        },
        "price": {
          "amount": 2999,
          "currency": "EUR"
        },
        "title": "Opel Corsa 1.2i 80HP GPL"
      }
    ],
    "tradeLanes": [],
    "verification": {
      "businessVerified": false,
      "inventoryCurrent": false,
      "trustedSupplier": false
    }
  }
]);
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 120) => mockOrganizationDirectoryCoreEntries;
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
