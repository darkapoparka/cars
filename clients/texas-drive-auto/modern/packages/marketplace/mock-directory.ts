import { organizationDirectoryEntriesSchema } from './directory';
/** One matched dealer; all numbers refer only to this dated sample, not live stock. */
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+12149723233",
      "websiteUrl": "https://www.texasdriveauto.com/"
    },
    "dealerOrgId": "dealer-texas-drive-auto",
    "description": "Used-vehicle listing samples in Dallas. USD prices and miles. No dealer financing or payment plans. Eight dated samples, not a live available-stock count. Confirm hours and appointments directly.",
    "displayName": "Texas Drive Auto",
    "headquarters": {
      "city": "Dallas",
      "countryCode": "US"
    },
    "headline": "Dated used-vehicle samples · USD and miles",
    "id": "directory-texas-drive-auto",
    "inventory": {
      "activeListingCount": 8,
      "localCount": 8,
      "inTransitCount": 0,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Published Texas Drive Auto office photograph",
      "url": "/office.webp"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/2008-acura-tl-127361913",
        "id": "tx-127361913",
        "image": {
          "url": "/stock/127361913-1.webp",
          "alt": "2008 Acura TL — published dealer listing photograph"
        },
        "price": {
          "amount": 4500,
          "currency": "USD"
        },
        "title": "2008 Acura TL"
      },
      {
        "availability": "local",
        "href": "/listing/2013-audi-q5-127361925",
        "id": "tx-127361925",
        "image": {
          "url": "/stock/127361925-1.webp",
          "alt": "2013 Audi Q5 — published dealer listing photograph"
        },
        "price": {
          "amount": 6990,
          "currency": "USD"
        },
        "title": "2013 Audi Q5 2.0T quattro Premium Plus"
      },
      {
        "availability": "local",
        "href": "/listing/2014-bmw-x5-127361904",
        "id": "tx-127361904",
        "image": {
          "url": "/stock/127361904-1.webp",
          "alt": "2014 BMW X5 — published dealer listing photograph"
        },
        "price": {
          "amount": 7990,
          "currency": "USD"
        },
        "title": "2014 BMW X5 xDrive35i"
      }
    ],
    "slug": "texas-drive-auto",
    "tradeLanes": [],
    "verification": {
      "businessVerified": false,
      "inventoryCurrent": false,
      "trustedSupplier": false
    }
  }
]);
/** Kept as a compatibility export. No fictitious organizations are added to a dealer concept. */
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations = 1) => [...mockOrganizationDirectoryCoreEntries];
export const mockOrganizationDirectoryEntries = [...mockOrganizationDirectoryCoreEntries];
