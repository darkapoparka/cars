import { organizationDirectoryEntriesSchema } from './directory';
// Published Excellent Cars advert snapshot, not live stock.
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [
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
        "brand": "Skoda",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Cupra",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Hyundai",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Kia",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Land Rover",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Dodge",
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
      },
      {
        "authorizationVerified": false,
        "brand": "Peugeot",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mazda",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359895996559",
      "websiteUrl": "https://excellent.cars.bg/"
    },
    "dealerOrgId": "dealer-excellent-cars",
    "description": "Автомобили, бартер и лизинг по договаряне във Варна.",
    "displayName": "Excellent Cars",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
    "id": "directory-excellent-cars",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Excellent Cars Варна",
      "url": "/assets/excellent/vehicle-01-1.webp"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/excellent-21781257688134220",
        "id": "excellent-21781257688134220",
        "image": {
          "alt": "Mercedes-Benz GLE 350 AMG  DESIGNO",
          "url": "/assets/excellent/vehicle-01-1.webp"
        },
        "price": {
          "amount": 32900,
          "currency": "EUR"
        },
        "title": "Mercedes-Benz GLE 350 AMG  DESIGNO"
      },
      {
        "availability": "local",
        "href": "/listing/excellent-11785932596351376",
        "id": "excellent-11785932596351376",
        "image": {
          "alt": "VW Passat 2.0TDI  HIGHLINE",
          "url": "/assets/excellent/vehicle-02-1.webp"
        },
        "price": {
          "amount": 10500,
          "currency": "EUR"
        },
        "title": "VW Passat 2.0TDI  HIGHLINE"
      },
      {
        "availability": "local",
        "href": "/listing/excellent-11788181514006324",
        "id": "excellent-11788181514006324",
        "image": {
          "alt": "Skoda Octavia 2.0TDI  4x4",
          "url": "/assets/excellent/vehicle-03-1.webp"
        },
        "price": {
          "amount": 17900,
          "currency": "EUR"
        },
        "title": "Skoda Octavia 2.0TDI  4x4"
      }
    ],
    "slug": "excellent-cars",
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
