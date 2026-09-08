import { organizationDirectoryEntriesSchema } from "./directory";
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
        "brand": "Volvo",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Toyota",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Subaru",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Mazda",
        "relationship": "independent_importer"
      },
      {
        "authorizationVerified": false,
        "brand": "Hyundai",
        "relationship": "independent_importer"
      }
    ],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359887777887",
      "websiteUrl": "https://elitautoimport.mobile.bg/"
    },
    "dealerOrgId": "dealer-elit-auto",
    "description": "Внос от Европа, САЩ и Япония. Автомобили във Варна.",
    "displayName": "ELIT AUTO IMPORT EXPORT",
    "headquarters": {
      "city": "Варна",
      "countryCode": "BG"
    },
    "headline": "Автомобили на Прилеп 74А",
    "id": "directory-elit-auto",
    "inventory": {
      "activeListingCount": 15,
      "inTransitCount": 0,
      "localCount": 15,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "ELIT AUTO Варна",
      "url": "/assets/elit/cover.png"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/elit-21717056982373192",
        "id": "elit-21717056982373192",
        "image": {
          "alt": "Mercedes-Benz GL 450",
          "url": "/assets/elit/21717056982373192-0.webp"
        },
        "price": {
          "amount": 13500,
          "currency": "EUR"
        },
        "title": "Mercedes-Benz GL 450"
      },
      {
        "availability": "local",
        "href": "/listing/elit-11700571967441521",
        "id": "elit-11700571967441521",
        "image": {
          "alt": "Volvo S60",
          "url": "/assets/elit/11700571967441521-0.webp"
        },
        "price": {
          "amount": 10890.52,
          "currency": "EUR"
        },
        "title": "Volvo S60"
      },
      {
        "availability": "local",
        "href": "/listing/elit-11529502627430878",
        "id": "elit-11529502627430878",
        "image": {
          "alt": "Toyota Prius  Hybrid",
          "url": "/assets/elit/11529502627430878-0.webp"
        },
        "price": {
          "amount": 16105.69,
          "currency": "EUR"
        },
        "title": "Toyota Prius  Hybrid"
      }
    ],
    "slug": "elit-auto-import",
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
