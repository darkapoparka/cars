import { organizationDirectoryEntriesSchema } from "./directory";
// Representative snapshot, not a live feed or verified organization.
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
        "brand": "Seat",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Ford",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "VW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Citroen",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mercedes-Benz",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Peugeot",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Volvo",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359895766736",
      "websiteUrl": "https://autolife.mobile.bg/"
    },
    "dealerOrgId": "dealer-autolife",
    "description": "Публикувани автомобили във Варна. Наличност и цена се потвърждават по телефона.",
    "displayName": "Аутолайф",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "ГП4, разклон за с. Тополи",
    "id": "directory-autolife",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Аутолайф — автосалон Варна",
      "url": "/assets/autolife/cover.jpg"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/autolife-21769682585171886",
        "id": "autolife-21769682585171886",
        "image": {
          "alt": "BMW X4 2.0D-190",
          "url": "/assets/autolife/vehicle-01-1.webp"
        },
        "price": {
          "amount": 20500,
          "currency": "EUR"
        },
        "title": "BMW X4 2.0D-190"
      },
      {
        "availability": "local",
        "href": "/listing/autolife-11770980926901387",
        "id": "autolife-11770980926901387",
        "image": {
          "alt": "Seat Alhambra 2.0TDI-150",
          "url": "/assets/autolife/vehicle-02-1.webp"
        },
        "price": {
          "amount": 11999,
          "currency": "EUR"
        },
        "title": "Seat Alhambra 2.0TDI-150"
      },
      {
        "availability": "local",
        "href": "/listing/autolife-11741772051965725",
        "id": "autolife-11741772051965725",
        "image": {
          "alt": "Ford Ka +",
          "url": "/assets/autolife/vehicle-03-1.webp"
        },
        "price": {
          "amount": 6999,
          "currency": "EUR"
        },
        "title": "Ford Ka +"
      }
    ],
    "slug": "autolife",
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
