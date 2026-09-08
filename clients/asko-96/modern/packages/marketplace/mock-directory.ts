import { organizationDirectoryEntriesSchema } from "./directory";
// ASKO96 representative stock snapshot; this is not a live inventory feed.
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [
      {
        "authorizationVerified": false,
        "brand": "Toyota",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mercedes-Benz",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mini",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Citroen",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Porsche",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Jeep",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "BMW",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "email": "askogroup@abv.bg",
      "phone": "+359899769696",
      "websiteUrl": "https://asko96.bg/"
    },
    "dealerOrgId": "dealer-asko-96",
    "description": "Автомобили, внос по поръчка и собствен лизинг в София.",
    "displayName": "АСКО 96",
    "headquarters": {
      "city": "София",
      "countryCode": "BG"
    },
    "headline": "Автомобили на Ботевградско шосе 300",
    "id": "directory-asko-96",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "АСКО 96 София",
      "url": "/assets/asko96/asko96-showroom.jpg"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/asko-21788444587626928",
        "id": "asko-21788444587626928",
        "image": {
          "alt": "Toyota Rav4 HYBRID",
          "url": "/assets/asko96/vehicle-01-1.webp"
        },
        "price": {
          "amount": 36500,
          "currency": "EUR"
        },
        "title": "Toyota Rav4 HYBRID"
      },
      {
        "availability": "local",
        "href": "/listing/asko-11788418194310981",
        "id": "asko-11788418194310981",
        "image": {
          "alt": "Audi A7 S-LINE",
          "url": "/assets/asko96/vehicle-02-1.webp"
        },
        "price": {
          "amount": 14000,
          "currency": "EUR"
        },
        "title": "Audi A7 S-LINE"
      },
      {
        "availability": "local",
        "href": "/listing/asko-21788361724092359",
        "id": "asko-21788361724092359",
        "image": {
          "alt": "Mercedes-Benz GLC Coupe 350AMG",
          "url": "/assets/asko96/vehicle-03-1.webp"
        },
        "price": {
          "amount": 26000,
          "currency": "EUR"
        },
        "title": "Mercedes-Benz GLC Coupe 350AMG"
      }
    ],
    "slug": "asko-96",
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
