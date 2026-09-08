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
        "brand": "Volvo",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Peugeot",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Nissan",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mitsubishi",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Kia",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "BMW",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Audi",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      
      "phone": "+359877800921",
      "websiteUrl": "https://avangard-auto.mobile.bg/"
    },
    "dealerOrgId": "dealer-avangard",
    "description": "Автомобили във Варна. Регистрация, транспорт и лизинг според обявата.",
    "displayName": "AVANGARD AUTO",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "Автомобили на бул. Цар Освободител 289",
    "id": "directory-avangard",
    "inventory": {
      "activeListingCount": 16,
      "inTransitCount": 0,
      "localCount": 16,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "AVANGARD AUTO Варна — официална Facebook корица",
      "url": "/assets/avangard/social-cover.jpg"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/avangard-11785010475119627",
        "id": "avangard-11785010475119627",
        "image": {
          "alt": "VW Passat Alltrack",
          "url": "/assets/avangard/vehicle-01-1.webp"
        },
        "price": {
          "amount": 13500,
          "currency": "EUR"
        },
        "title": "VW Passat Alltrack"
      },
      {
        "availability": "local",
        "href": "/listing/avangard-21783748809976935",
        "id": "avangard-21783748809976935",
        "image": {
          "alt": "Volvo XC40 2.0D",
          "url": "/assets/avangard/vehicle-02-1.webp"
        },
        "price": {
          "amount": 17999,
          "currency": "EUR"
        },
        "title": "Volvo XC40 2.0D"
      },
      {
        "availability": "local",
        "href": "/listing/avangard-21766322242220471",
        "id": "avangard-21766322242220471",
        "image": {
          "alt": "Volvo XC40 T5 inscription",
          "url": "/assets/avangard/vehicle-03-1.webp"
        },
        "price": {
          "amount": 16900,
          "currency": "EUR"
        },
        "title": "Volvo XC40 T5 inscription"
      }
    ],
    "slug": "avangard-auto",
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

