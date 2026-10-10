/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "1",
    "heading": {
      "title": "Nissan Micra 1.0 N-Sport",
      "mobileTitle": "Nissan Micra 1.0 N-Sport",
      "location": "Варна",
      "fleetCode": "1",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "63800 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 63800,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "92 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 92,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11786363468065195-1.webp",
          "alt": "Nissan Micra 1.0 N-Sport"
        },
        {
          "src": "/navara/vehicles/11786363468065195-2.webp",
          "alt": "Nissan Micra 1.0 N-Sport"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11786363468065195-1.webp",
          "alt": "Nissan Micra 1.0 N-Sport"
        },
        {
          "src": "/navara/vehicles/11786363468065195-2.webp",
          "alt": "Nissan Micra 1.0 N-Sport"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Навигация",
        "Парктроник",
        "Подгряване на седалки",
        "Apple CarPlay / Android Auto"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "10500 EUR",
      "discount": "",
      "total": "10500 EUR",
      "priceAmount": 10500,
      "currency": "EUR"
    }
  },
  {
    "id": "2",
    "heading": {
      "title": "VW Polo 1.6 TDI",
      "mobileTitle": "VW Polo 1.6 TDI",
      "location": "Варна",
      "fleetCode": "2",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "125902 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 125902,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Diesel",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.diesel"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "80 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 80,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11782409246983224-1.webp",
          "alt": "VW Polo 1.6 TDI"
        },
        {
          "src": "/navara/vehicles/11782409246983224-2.webp",
          "alt": "VW Polo 1.6 TDI"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11782409246983224-1.webp",
          "alt": "VW Polo 1.6 TDI"
        },
        {
          "src": "/navara/vehicles/11782409246983224-2.webp",
          "alt": "VW Polo 1.6 TDI"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Bluetooth",
        "Климатик",
        "ISOFIX",
        "Сензор за дъжд"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "10000 EUR",
      "discount": "",
      "total": "10000 EUR",
      "priceAmount": 10000,
      "currency": "EUR"
    }
  },
  {
    "id": "3",
    "heading": {
      "title": "Tesla Model 3 Performance Dual Motor",
      "mobileTitle": "Tesla Model 3 Performance Dual Motor",
      "location": "Варна",
      "fleetCode": "3",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "63900 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 63900,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Electric",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.electric"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "534 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 534,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11787311216769974-1.webp",
          "alt": "Tesla Model 3 Performance Dual Motor"
        },
        {
          "src": "/navara/vehicles/11787311216769974-2.webp",
          "alt": "Tesla Model 3 Performance Dual Motor"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11787311216769974-1.webp",
          "alt": "Tesla Model 3 Performance Dual Motor"
        },
        {
          "src": "/navara/vehicles/11787311216769974-2.webp",
          "alt": "Tesla Model 3 Performance Dual Motor"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "4x4",
        "Навигация",
        "Парктроник",
        "Подгряване на седалки",
        "Термопомпа"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "32999 EUR",
      "discount": "",
      "total": "32999 EUR",
      "priceAmount": 32999,
      "currency": "EUR"
    }
  },
  {
    "id": "4",
    "heading": {
      "title": "Nissan Qashqai 2.0i SV AWD",
      "mobileTitle": "Nissan Qashqai 2.0i SV AWD",
      "location": "Варна",
      "fleetCode": "4",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "57000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 57000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "141 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 141,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/21780735125049477-1.webp",
          "alt": "Nissan Qashqai 2.0i SV AWD"
        },
        {
          "src": "/navara/vehicles/21780735125049477-2.webp",
          "alt": "Nissan Qashqai 2.0i SV AWD"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/21780735125049477-1.webp",
          "alt": "Nissan Qashqai 2.0i SV AWD"
        },
        {
          "src": "/navara/vehicles/21780735125049477-2.webp",
          "alt": "Nissan Qashqai 2.0i SV AWD"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "4x4",
        "Парктроник",
        "Подгряване на седалки",
        "Камера за заден ход",
        "Шибедах"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "18499 EUR",
      "discount": "",
      "total": "18499 EUR",
      "priceAmount": 18499,
      "currency": "EUR"
    }
  },
  {
    "id": "5",
    "heading": {
      "title": "Peugeot e-2008 Allure",
      "mobileTitle": "Peugeot e-2008 Allure",
      "location": "Варна",
      "fleetCode": "5",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "59079 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 59079,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Electric",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.electric"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "136 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 136,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11787212062225914-1.webp",
          "alt": "Peugeot e-2008 Allure"
        },
        {
          "src": "/navara/vehicles/11787212062225914-2.webp",
          "alt": "Peugeot e-2008 Allure"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11787212062225914-1.webp",
          "alt": "Peugeot e-2008 Allure"
        },
        {
          "src": "/navara/vehicles/11787212062225914-2.webp",
          "alt": "Peugeot e-2008 Allure"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Парктроник",
        "Подгряване на седалки",
        "Apple CarPlay / Android Auto",
        "Климатроник"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "19999 EUR",
      "discount": "",
      "total": "19999 EUR",
      "priceAmount": 19999,
      "currency": "EUR"
    }
  },
  {
    "id": "6",
    "heading": {
      "title": "Opel Mokka 1.4i Газ/Бензин",
      "mobileTitle": "Opel Mokka 1.4i Газ/Бензин",
      "location": "Варна",
      "fleetCode": "6",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "182000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 182000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "LPG",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.lpg"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "140 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 140,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/21774534756506554-1.webp",
          "alt": "Opel Mokka 1.4i Газ/Бензин"
        },
        {
          "src": "/navara/vehicles/21774534756506554-2.webp",
          "alt": "Opel Mokka 1.4i Газ/Бензин"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/21774534756506554-1.webp",
          "alt": "Opel Mokka 1.4i Газ/Бензин"
        },
        {
          "src": "/navara/vehicles/21774534756506554-2.webp",
          "alt": "Opel Mokka 1.4i Газ/Бензин"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Газова уредба",
        "Парктроник",
        "Климатроник",
        "ISOFIX"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "6999 EUR",
      "discount": "",
      "total": "6999 EUR",
      "priceAmount": 6999,
      "currency": "EUR"
    }
  },
  {
    "id": "7",
    "heading": {
      "title": "Audi A4 1.8i quattro",
      "mobileTitle": "Audi A4 1.8i quattro",
      "location": "Варна",
      "fleetCode": "7",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "212000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 212000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "160 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 160,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11784982235652112-1.webp",
          "alt": "Audi A4 1.8i quattro"
        },
        {
          "src": "/navara/vehicles/11784982235652112-2.webp",
          "alt": "Audi A4 1.8i quattro"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11784982235652112-1.webp",
          "alt": "Audi A4 1.8i quattro"
        },
        {
          "src": "/navara/vehicles/11784982235652112-2.webp",
          "alt": "Audi A4 1.8i quattro"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "4x4",
        "Парктроник",
        "Подгряване на седалки",
        "Панорамен люк"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "6999 EUR",
      "discount": "",
      "total": "6999 EUR",
      "priceAmount": 6999,
      "currency": "EUR"
    }
  },
  {
    "id": "8",
    "heading": {
      "title": "Mercedes-Benz B 250 e",
      "mobileTitle": "Mercedes-Benz B 250 e",
      "location": "Варна",
      "fleetCode": "8",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "106000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 106000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Electric",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.electric"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "180 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 180,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11772183782578045-1.webp",
          "alt": "Mercedes-Benz B 250 e"
        },
        {
          "src": "/navara/vehicles/11772183782578045-2.webp",
          "alt": "Mercedes-Benz B 250 e"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11772183782578045-1.webp",
          "alt": "Mercedes-Benz B 250 e"
        },
        {
          "src": "/navara/vehicles/11772183782578045-2.webp",
          "alt": "Mercedes-Benz B 250 e"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Навигация",
        "Парктроник",
        "Климатроник",
        "ISOFIX"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "9999 EUR",
      "discount": "",
      "total": "9999 EUR",
      "priceAmount": 9999,
      "currency": "EUR"
    }
  },
  {
    "id": "9",
    "heading": {
      "title": "Smart Fortwo 1.0i",
      "mobileTitle": "Smart Fortwo 1.0i",
      "location": "Варна",
      "fleetCode": "9",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "66121 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 66121,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "72 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 72,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/navara/vehicles/11780755712824361-1.webp",
          "alt": "Smart Fortwo 1.0i"
        },
        {
          "src": "/navara/vehicles/11780755712824361-2.webp",
          "alt": "Smart Fortwo 1.0i"
        }
      ],
      "thumbnails": [
        {
          "src": "/navara/vehicles/11780755712824361-1.webp",
          "alt": "Smart Fortwo 1.0i"
        },
        {
          "src": "/navara/vehicles/11780755712824361-2.webp",
          "alt": "Smart Fortwo 1.0i"
        }
      ]
    },
    "content": {
      "overview": [],
      "includedFeatures": [
        "Климатик",
        "Панорамен люк",
        "Ел. стъкла",
        "Бордкомпютър"
      ],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Навара кар",
      "location": "бул. „Цар Освободител“, Кайсиева градина, Варна",
      "avatar": "/dealer-brand/logo-on-light-20260919.webp",
      "mobile": "0899 192 300",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "4500 EUR",
      "discount": "",
      "total": "4500 EUR",
      "priceAmount": 4500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
