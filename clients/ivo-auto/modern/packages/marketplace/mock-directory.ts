import { organizationDirectoryEntriesSchema } from './directory';
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [
      {
        "authorizationVerified": false,
        "brand": "Rolls-Royce",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Porsche",
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
        "brand": "VW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Subaru",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mercedes-Benz",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359878720035",
      "websiteUrl": "https://ivoauto-varna.mobile.bg/"
    },
    "dealerOrgId": "dealer-ivo-auto",
    "description": "Подбрани публикувани обяви; наличностите и условията се потвърждават с Иво Ауто.",
    "displayName": "Иво Ауто",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "бул. „Цар Освободител“ 256",
    "id": "directory-ivo-auto",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Иво Ауто",
      "url": "/assets/ivo-auto/wordmark.svg"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/ivo-11786049135297264",
        "id": "ivo-11786049135297264",
        "image": {
          "alt": "Rolls-Royce Ghost",
          "url": "/assets/ivo-auto/vehicle-01-1.webp"
        },
        "price": {
          "amount": 105000,
          "currency": "EUR"
        },
        "title": "Rolls-Royce Ghost"
      },
      {
        "availability": "local",
        "href": "/listing/ivo-11784822971964926",
        "id": "ivo-11784822971964926",
        "image": {
          "alt": "Audi A4 S-line 4x4 2.0T",
          "url": "/assets/ivo-auto/vehicle-02-1.webp"
        },
        "price": {
          "amount": 2800,
          "currency": "EUR"
        },
        "title": "Audi A4 S-line 4x4 2.0T"
      },
      {
        "availability": "local",
        "href": "/listing/ivo-11775231551222536",
        "id": "ivo-11775231551222536",
        "image": {
          "alt": "Porsche Panamera Turbo 4.8i",
          "url": "/assets/ivo-auto/vehicle-03-1.webp"
        },
        "price": {
          "amount": 21000,
          "currency": "EUR"
        },
        "title": "Porsche Panamera Turbo 4.8i"
      }
    ],
    "slug": "ivo-auto",
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
