import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "am-1001",
    "slug": "lexus-ct200h-2018-1",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus CT200h Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 64000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/2.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/3.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/4.webp",
        "alt": "Lexus CT200h Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "CT200h",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "semi_automatic",
      "mileageValue": 168000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1010",
    "slug": "lexus-is300-2023-2",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus IS300 Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 105000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/2.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/3.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/4.webp",
        "alt": "Lexus IS300 Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "IS300",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 40000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1011",
    "slug": "lexus-rc-f-2020-3",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus RC-F",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 150000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/2.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/3.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/4.webp",
        "alt": "Lexus RC-F"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "RC-F",
      "year": 2020,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 140000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1012",
    "slug": "lexus-is350-2024-4",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus IS350 F-Sport",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 140000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/2.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/3.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/4.webp",
        "alt": "Lexus IS350 F-Sport"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "IS350",
      "year": 2024,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 151000,
      "mileageUnit": "km",
      "colorExterior": "Cloudburst Gray"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1013",
    "slug": "lexus-gs250-2015-5",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus GS250 Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 65000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmte58re000ykp1we0fkcsw8e/1.webp",
        "alt": "Lexus GS250 Platinum"
      },
      {
        "url": "/dealer/stock/cmte58re000ykp1we0fkcsw8e/2.webp",
        "alt": "Lexus GS250 Platinum"
      },
      {
        "url": "/dealer/stock/cmte58re000ykp1we0fkcsw8e/3.webp",
        "alt": "Lexus GS250 Platinum"
      },
      {
        "url": "/dealer/stock/cmte58re000ykp1we0fkcsw8e/4.webp",
        "alt": "Lexus GS250 Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "GS250",
      "year": 2015,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 52000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1014",
    "slug": "lexus-rc350-2021-6",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus RC350 F-Sport",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 80000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/1.webp",
        "alt": "Lexus RC350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/2.webp",
        "alt": "Lexus RC350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/3.webp",
        "alt": "Lexus RC350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/4.webp",
        "alt": "Lexus RC350 F-Sport"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "RC350",
      "year": 2021,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 120000,
      "mileageUnit": "km",
      "colorExterior": "Royal Black"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1002",
    "slug": "lexus-es350-2023-7",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus ES350 F-Sport",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 145000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmt6yyshu00ljp1wewaxpucal/1.webp",
        "alt": "Lexus ES350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmt6yyshu00ljp1wewaxpucal/2.webp",
        "alt": "Lexus ES350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmt6yyshu00ljp1wewaxpucal/3.webp",
        "alt": "Lexus ES350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmt6yyshu00ljp1wewaxpucal/4.webp",
        "alt": "Lexus ES350 F-Sport"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "ES350",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 77000,
      "mileageUnit": "km",
      "colorExterior": "Iridium Silver"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1003",
    "slug": "lexus-lx570-2016-8",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus LX570 Signature",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 175000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/1.webp",
        "alt": "Lexus LX570 Signature"
      },
      {
        "url": "/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/2.webp",
        "alt": "Lexus LX570 Signature"
      },
      {
        "url": "/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/3.webp",
        "alt": "Lexus LX570 Signature"
      },
      {
        "url": "/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/4.webp",
        "alt": "Lexus LX570 Signature"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "LX570",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 228000,
      "mileageUnit": "km",
      "colorExterior": "Cloudburst Gray"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1004",
    "slug": "lexus-tx350-2024-9",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus TX350 Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 185000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmt4czt2400gqp1weg7ck3qba/1.webp",
        "alt": "Lexus TX350 Platinum"
      },
      {
        "url": "/dealer/stock/cmt4czt2400gqp1weg7ck3qba/2.webp",
        "alt": "Lexus TX350 Platinum"
      },
      {
        "url": "/dealer/stock/cmt4czt2400gqp1weg7ck3qba/3.webp",
        "alt": "Lexus TX350 Platinum"
      },
      {
        "url": "/dealer/stock/cmt4czt2400gqp1weg7ck3qba/4.webp",
        "alt": "Lexus TX350 Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "TX350",
      "year": 2024,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 53000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1005",
    "slug": "lexus-rx350-2024-10",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus RX350 Premier",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 165000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp",
        "alt": "Lexus RX350 Premier"
      },
      {
        "url": "/dealer/stock/cms38d0r90058p1a10q2alud6/2.webp",
        "alt": "Lexus RX350 Premier"
      },
      {
        "url": "/dealer/stock/cms38d0r90058p1a10q2alud6/3.webp",
        "alt": "Lexus RX350 Premier"
      },
      {
        "url": "/dealer/stock/cms38d0r90058p1a10q2alud6/4.webp",
        "alt": "Lexus RX350 Premier"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "RX350",
      "year": 2024,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 12000,
      "mileageUnit": "km",
      "colorExterior": "Royal Black"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1006",
    "slug": "lexus-ct200h-2018-1",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus CT200h Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 64000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/2.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/3.webp",
        "alt": "Lexus CT200h Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/4.webp",
        "alt": "Lexus CT200h Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "CT200h",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "semi_automatic",
      "mileageValue": 168000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1007",
    "slug": "lexus-is300-2023-2",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus IS300 Platinum",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 105000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/2.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/3.webp",
        "alt": "Lexus IS300 Platinum"
      },
      {
        "url": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/4.webp",
        "alt": "Lexus IS300 Platinum"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "IS300",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 40000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1008",
    "slug": "lexus-rc-f-2020-3",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus RC-F",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 150000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/2.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/3.webp",
        "alt": "Lexus RC-F"
      },
      {
        "url": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/4.webp",
        "alt": "Lexus RC-F"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "RC-F",
      "year": 2020,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 140000,
      "mileageUnit": "km",
      "colorExterior": "Ultra White"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1009",
    "slug": "lexus-is350-2024-4",
    "category": "car",
    "dealerOrgId": "dealer-al-basma-motors",
    "status": "active",
    "title": "Lexus IS350 F-Sport",
    "description": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
    "price": {
      "amount": 140000,
      "currency": "AED"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/2.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/3.webp",
        "alt": "Lexus IS350 F-Sport"
      },
      {
        "url": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/4.webp",
        "alt": "Lexus IS350 F-Sport"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Sharjah",
      "region": "Sharjah",
      "country": "United Arab Emirates"
    },
    "spec": {
      "make": "Lexus",
      "model": "IS350",
      "year": 2024,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "semi_automatic",
      "mileageValue": 151000,
      "mileageUnit": "km",
      "colorExterior": "Cloudburst Gray"
    },
    "seller": {
      "id": "dealer-al-basma-motors",
      "type": "dealer",
      "displayName": "Al Basma Motors",
      "verificationStatus": "unverified",
      "city": "Sharjah",
      "logoUrl": "/variant-2/assets/brand/logo-on-light.webp"
    },
    "publishedAt": "2026-09-08T09:00:00.000Z",
    "promoted": false
  }
]

const matchesText = (listing: VehicleListing, query: string) => {
  const haystack = [
    listing.title,
    listing.description,
    listing.spec.make,
    listing.spec.model,
    listing.spec.trim,
    listing.location.city,
    listing.seller.displayName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

type ListingPredicate = (listing: VehicleListing) => boolean;
type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;

const createListingPredicates = (
  filters: MarketplaceSearchParams
): ListingPredicate[] => [
  (listing) => listing.status === "active",
  (listing) => listing.category === filters.category,
  (listing) => !filters.q || matchesText(listing, filters.q),
  (listing) => !filters.make || listing.spec.make === filters.make,
  (listing) => !filters.model || listing.spec.model === filters.model,
  (listing) => !filters.location || listing.location.city === filters.location,
  (listing) =>
    !filters.origin ||
    listing.supply?.origin.countryCode === filters.origin ||
    (filters.origin === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) => !filters.currency || listing.price.currency === filters.currency,
  (listing) =>
    filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  (listing) =>
    filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  (listing) =>
    filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  (listing) =>
    filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  (listing) =>
    filters.mileageMax === undefined ||
    listing.spec.mileageValue <= filters.mileageMax,
  (listing) => !filters.fuel || listing.spec.fuelType === filters.fuel,
  (listing) =>
    !filters.transmission || listing.spec.transmission === filters.transmission,
  (listing) => !filters.body || listing.spec.bodyType === filters.body,
  (listing) => !filters.seller || listing.seller.type === filters.seller,
];

const listingComparators: Record<
  MarketplaceSearchParams["sort"],
  ListingComparator
> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year,
};

export const getMockListings = (filters: MarketplaceSearchParams) => {
  const predicates = createListingPredicates(filters);

  return mockListings
    .filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};

const legacyListingSlugAliases: Readonly<Record<string, string>> = {
  "audi-q5-45-tfsi-quattro-stara-zagora-2021": "bmw-m4-competition-sofia-2021",
};

export const getMockListingBySlug = (slug: string) => {
  const resolvedSlug = legacyListingSlugAliases[slug] ?? slug;
  return mockListings.find((listing) => listing.slug === resolvedSlug);
};

export const getMockListingById = (id: string) =>
  mockListings.find((listing) => listing.id === id);

const scoreRelatedListing = (
  source: VehicleListing,
  candidate: VehicleListing
) =>
  Number(candidate.category === source.category) * 4 +
  Number(candidate.spec.make === source.spec.make) * 3 +
  Number(candidate.location.city === source.location.city) * 2 +
  Number(candidate.promoted);

export const getMockRelatedListings = (source: VehicleListing, limit = 3) =>
  mockListings
    .filter(
      (listing) => listing.status === "active" && listing.id !== source.id
    )
    .map((listing) => ({
      listing,
      score: scoreRelatedListing(source, listing),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ listing }) => listing);

export const mockSavedListingIds = ["am-1001", "am-1003", "am-1008"];

export const getMockSavedListings = () =>
  mockListings.filter((listing) => mockSavedListingIds.includes(listing.id));

export interface MockSavedSearch {
  cadence: "instant" | "daily" | "weekly";
  description: string;
  filters: Partial<MarketplaceSearchParams>;
  id: string;
  lastRunAt: string;
  newMatches: number;
  title: string;
}

export const mockSavedSearches: MockSavedSearch[] = [
  {
    id: "saved-search-premium-suv",
    title: "Premium SUVs under 100k",
    description: "BMW, Audi, and Toyota SUVs with verified sellers.",
    filters: {
      body: "suv",
      category: "car",
      priceMax: 100_000,
      seller: "dealer",
    },
    cadence: "daily",
    newMatches: 3,
    lastRunAt: "2026-06-06T07:00:00.000Z",
  },
  {
    id: "saved-search-lease-ev",
    title: "Lease-ready EVs",
    description: "Electric lease offers with automatic transmission.",
    filters: {
      category: "lease",
      fuel: "electric",
      transmission: "automatic",
    },
    cadence: "instant",
    newMatches: 1,
    lastRunAt: "2026-06-07T06:30:00.000Z",
  },
  {
    id: "saved-search-family-varna",
    title: "Family cars near Varna",
    description: "Low-mileage vehicles in Varna and nearby coastal cities.",
    filters: {
      category: "car",
      location: "Varna",
      mileageMax: 90_000,
    },
    cadence: "weekly",
    newMatches: 0,
    lastRunAt: "2026-06-03T08:00:00.000Z",
  },
];

const sellerListingStatuses: Record<string, VehicleListing["status"]> = {
  "am-1001": "active",
  "am-1003": "pending_review",
  "am-1007": "draft",
};

export const getMockSellerListings = () =>
  mockListings
    .filter((listing) =>
      Object.keys(sellerListingStatuses).includes(listing.id)
    )
    .map((listing) => ({
      ...listing,
      status: sellerListingStatuses[listing.id] ?? listing.status,
    }));

export const getMockSellerListingById = (id: string) =>
  getMockSellerListings().find((listing) => listing.id === id);

export const getMockDealerInventory = () =>
  mockListings.filter((listing) => listing.seller.type === "dealer");

export interface MockDealerLead {
  buyerName: string;
  id: string;
  intent: "test_drive" | "finance" | "trade_in" | "availability";
  listingId: string;
  listingTitle: string;
  receivedAt: string;
  source: "listing" | "saved_search" | "dealer_profile";
  status: "new" | "contacted" | "qualified" | "closed";
}

export const mockDealerLeads: MockDealerLead[] = [
  {
    buyerName: "Nikolay Petrov",
    id: "lead-1001",
    intent: "finance",
    listingId: "am-1001",
    listingTitle: "2020 BMW X5 M50d",
    receivedAt: "2026-06-07T07:30:00.000Z",
    source: "listing",
    status: "new",
  },
  {
    buyerName: "Elena Dimitrova",
    id: "lead-1002",
    intent: "test_drive",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    receivedAt: "2026-06-06T15:20:00.000Z",
    source: "saved_search",
    status: "contacted",
  },
  {
    buyerName: "Martin Georgiev",
    id: "lead-1003",
    intent: "availability",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    receivedAt: "2026-06-05T12:10:00.000Z",
    source: "dealer_profile",
    status: "qualified",
  },
  {
    buyerName: "Iva Marinova",
    id: "lead-1004",
    intent: "trade_in",
    listingId: "am-1005",
    listingTitle: "2018 Mercedes-Benz V 250d VIP Business",
    receivedAt: "2026-06-04T09:45:00.000Z",
    source: "listing",
    status: "closed",
  },
];

export const getMockDealerStats = () => {
  const inventory = getMockDealerInventory();
  const activeInventory = inventory.filter(
    (listing) => listing.status === "active"
  );
  const newLeads = mockDealerLeads.filter((lead) => lead.status === "new");

  return {
    activeInventory: activeInventory.length,
    averagePrice:
      inventory.reduce((total, listing) => total + listing.price.amount, 0) /
      inventory.length,
    leadCount: mockDealerLeads.length,
    newLeadCount: newLeads.length,
  };
};

export interface MockModerationReport {
  createdAt: string;
  details: string;
  flags: string[];
  id: string;
  listingId: string;
  listingTitle: string;
  reason:
    | "duplicate"
    | "fraud_risk"
    | "incorrect_details"
    | "prohibited_content"
    | "seller_behavior";
  reporter: string;
  severity: "low" | "medium" | "high";
  source: "buyer_report" | "system_flag" | "admin_review";
  status: "new" | "reviewing" | "resolved" | "dismissed";
}

export const mockModerationReports: MockModerationReport[] = [
  {
    id: "report-1001",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    reason: "incorrect_details",
    details:
      "Buyer says lease terms in the message thread do not match the listing price.",
    reporter: "Elena Dimitrova",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Lease price mismatch", "Recent edit", "High intent lead"],
    createdAt: "2026-06-07T09:20:00.000Z",
  },
  {
    id: "report-1002",
    listingId: "am-1006",
    listingTitle: "2021 Range Rover Sport SVR",
    reason: "duplicate",
    details:
      "System found matching photos and mileage on another active dealer listing.",
    reporter: "System",
    source: "system_flag",
    status: "reviewing",
    severity: "medium",
    flags: ["Photo reuse", "Similar VIN pattern"],
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "report-1003",
    listingId: "am-1002",
    listingTitle: "2021 Mercedes-Benz GLE 400d Coupe",
    reason: "seller_behavior",
    details:
      "Reporter says seller asked to move payment to an unverified channel.",
    reporter: "Nikolay Petrov",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Payment risk", "Private seller"],
    createdAt: "2026-06-06T17:30:00.000Z",
  },
  {
    id: "report-1004",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    reason: "prohibited_content",
    details:
      "Admin review flagged promotional copy that may overstate warranty coverage.",
    reporter: "Admin review",
    source: "admin_review",
    status: "dismissed",
    severity: "low",
    flags: ["Copy review"],
    createdAt: "2026-06-05T12:10:00.000Z",
  },
];

export interface MockTrustReview {
  city: string;
  documents: string[];
  entityId: string;
  entityName: string;
  entityType: "dealer" | "seller";
  linkedListings: number;
  riskLevel: "low" | "medium" | "high";
  status: "unverified" | "pending" | "verified" | "rejected";
  submittedAt: string;
}

export const mockTrustReviews: MockTrustReview[] = [
  {
    entityId: "dealer-black-sea-ev",
    entityName: "Black Sea EV",
    entityType: "dealer",
    city: "Varna",
    status: "pending",
    riskLevel: "medium",
    linkedListings: 1,
    documents: ["Business registration", "VAT certificate", "Dealer address"],
    submittedAt: "2026-06-07T08:00:00.000Z",
  },
  {
    entityId: "seller-124",
    entityName: "Private seller",
    entityType: "seller",
    city: "Plovdiv",
    status: "pending",
    riskLevel: "high",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-06T16:15:00.000Z",
  },
  {
    entityId: "dealer-trakia-auto",
    entityName: "Trakia Auto",
    entityType: "dealer",
    city: "Stara Zagora",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["Business registration", "Dealer address"],
    submittedAt: "2026-06-05T10:30:00.000Z",
  },
  {
    entityId: "seller-882",
    entityName: "Private seller",
    entityType: "seller",
    city: "Varna",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-04T14:40:00.000Z",
  },
];

export interface MockAuditLogEntry {
  action: string;
  actor: string;
  createdAt: string;
  entityId: string;
  entityType: "listing" | "report" | "seller" | "dealer";
  id: string;
  note: string;
}

export const mockAuditLog: MockAuditLogEntry[] = [
  {
    id: "audit-1001",
    actor: "Admin",
    action: "report.opened",
    entityType: "report",
    entityId: "report-1001",
    note: "Moved Tesla lease report to new queue.",
    createdAt: "2026-06-07T09:25:00.000Z",
  },
  {
    id: "audit-1002",
    actor: "System",
    action: "listing.flagged",
    entityType: "listing",
    entityId: "am-1006",
    note: "Duplicate image match over threshold.",
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "audit-1003",
    actor: "Trust ops",
    action: "dealer.verified",
    entityType: "dealer",
    entityId: "dealer-trakia-auto",
    note: "Business registry and address checks passed.",
    createdAt: "2026-06-06T11:15:00.000Z",
  },
];

export const getMockAdminStats = () => {
  const openReports = mockModerationReports.filter(
    (report) => report.status === "new" || report.status === "reviewing"
  );
  const highRiskReports = mockModerationReports.filter(
    (report) => report.severity === "high"
  );
  const pendingTrustReviews = mockTrustReviews.filter(
    (review) => review.status === "pending"
  );

  return {
    auditEvents: mockAuditLog.length,
    highRiskReports: highRiskReports.length,
    openReports: openReports.length,
    pendingTrustReviews: pendingTrustReviews.length,
  };
};

export interface MockDealerPlan {
  current?: boolean;
  description: string;
  id: string;
  leadCredits: number;
  listingLimit: number;
  monthlyPrice: Money;
  name: string;
  promotionCredits: number;
  support: "standard" | "priority" | "managed";
}

export const mockDealerPlans: MockDealerPlan[] = [
  {
    id: "dealer-starter",
    name: "Starter",
    description: "For small dealers testing AutoMarket inventory.",
    monthlyPrice: { amount: 99, currency: "EUR" },
    listingLimit: 20,
    leadCredits: 25,
    promotionCredits: 0,
    support: "standard",
  },
  {
    id: "dealer-growth",
    name: "Growth",
    description: "More active listings, included leads, and promotion credits.",
    monthlyPrice: { amount: 249, currency: "EUR" },
    listingLimit: 80,
    leadCredits: 120,
    promotionCredits: 4,
    support: "priority",
    current: true,
  },
  {
    id: "dealer-scale",
    name: "Scale",
    description: "High-volume inventory with managed marketplace support.",
    monthlyPrice: { amount: 599, currency: "EUR" },
    listingLimit: 250,
    leadCredits: 400,
    promotionCredits: 12,
    support: "managed",
  },
];

export interface MockPromotionProduct {
  description: string;
  durationDays: number;
  id: string;
  label: string;
  placement: "search_top" | "category_featured" | "lease_partner";
  price: Money;
}

export const mockPromotionProducts: MockPromotionProduct[] = [
  {
    id: "promo-search-top-7",
    label: "Top search boost",
    description: "Promoted placement in relevant search results for 7 days.",
    placement: "search_top",
    durationDays: 7,
    price: { amount: 39, currency: "EUR" },
  },
  {
    id: "promo-category-featured-14",
    label: "Category featured",
    description: "Featured card in category browse pages for 14 days.",
    placement: "category_featured",
    durationDays: 14,
    price: { amount: 79, currency: "EUR" },
  },
  {
    id: "promo-lease-partner-30",
    label: "Lease partner slot",
    description: "Finance and lease partner placement for eligible inventory.",
    placement: "lease_partner",
    durationDays: 30,
    price: { amount: 149, currency: "EUR" },
  },
];

export interface MockActivePromotion {
  clicks: number;
  endsAt: string;
  id: string;
  impressions: number;
  leads: number;
  listingId: string;
  productId: string;
  spend: Money;
  startsAt: string;
  status: "scheduled" | "active" | "ended";
}

export const mockActivePromotions: MockActivePromotion[] = [
  {
    id: "promotion-1001",
    listingId: "am-1001",
    productId: "promo-search-top-7",
    status: "active",
    startsAt: "2026-06-05T08:00:00.000Z",
    endsAt: "2026-06-12T08:00:00.000Z",
    spend: { amount: 39, currency: "EUR" },
    impressions: 4200,
    clicks: 184,
    leads: 8,
  },
  {
    id: "promotion-1002",
    listingId: "am-1003",
    productId: "promo-lease-partner-30",
    status: "active",
    startsAt: "2026-06-01T08:00:00.000Z",
    endsAt: "2026-07-01T08:00:00.000Z",
    spend: { amount: 149, currency: "EUR" },
    impressions: 6100,
    clicks: 246,
    leads: 12,
  },
  {
    id: "promotion-1003",
    listingId: "am-1008",
    productId: "promo-category-featured-14",
    status: "scheduled",
    startsAt: "2026-06-10T08:00:00.000Z",
    endsAt: "2026-06-24T08:00:00.000Z",
    spend: { amount: 79, currency: "EUR" },
    impressions: 0,
    clicks: 0,
    leads: 0,
  },
];

export interface MockDealerBillingAccount {
  currentPlanId: string;
  includedLeadCredits: number;
  invoiceBalance: Money;
  monthlySpend: Money;
  paymentMethod: string;
  renewalDate: string;
  status: "active" | "past_due" | "trialing";
  usedLeadCredits: number;
}

export const mockDealerBillingAccount: MockDealerBillingAccount = {
  currentPlanId: "dealer-growth",
  status: "active",
  renewalDate: "2026-07-01T00:00:00.000Z",
  paymentMethod: "Visa ending 4242",
  invoiceBalance: { amount: 0, currency: "EUR" },
  monthlySpend: { amount: 267, currency: "EUR" },
  includedLeadCredits: 120,
  usedLeadCredits: 74,
};

export const getMockCurrentDealerPlan = () =>
  mockDealerPlans.find(
    (plan) => plan.id === mockDealerBillingAccount.currentPlanId
  ) ?? mockDealerPlans[0];

export const getMockPromotionProductById = (id: string) =>
  mockPromotionProducts.find((product) => product.id === id);

export const getMockMonetizationStats = () => {
  const activePromotions = mockActivePromotions.filter(
    (promotion) => promotion.status === "active"
  );
  const totalLeads = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.leads,
    0
  );
  const totalSpend = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.spend.amount,
    0
  );

  return {
    activePromotions: activePromotions.length,
    leadCreditsRemaining:
      mockDealerBillingAccount.includedLeadCredits -
      mockDealerBillingAccount.usedLeadCredits,
    promotionLeads: totalLeads,
    promotionSpend: { amount: totalSpend, currency: "EUR" } satisfies Money,
  };
};
