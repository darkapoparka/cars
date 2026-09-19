export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключов достъп'
  | 'Адаптивен круиз контрол';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: `/listing-detail-v1/${number}`;
};

export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2008-acura-tl/127361913",
    "image": "/stock/127361913-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Acura",
    "title": "2008 Acura TL",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "176,729 mi",
    "mileageKm": 284418,
    "fuel": "Gasoline",
    "transmission": "Automatic 5-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 4500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2012-audi-q5/128538336",
    "image": "/media/photo-unavailable.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "2012 Audi Q5 2.0T quattro Premium Plus",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "104,710 mi",
    "mileageKm": 168514,
    "fuel": "Not published",
    "transmission": "Automatic 8-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 6500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2013-audi-q5/127361925",
    "image": "/stock/127361925-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "2013 Audi Q5 2.0T quattro Premium Plus",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "114,512 mi",
    "mileageKm": 184289,
    "fuel": "Flex Fuel",
    "transmission": "Automatic 8-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 6990,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2018-audi-a4/127361924",
    "image": "/media/photo-unavailable.svg",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "2018 Audi A4 Premium",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "128,956 mi",
    "mileageKm": 207535,
    "fuel": "Not published",
    "transmission": "Automatic 7-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 8990,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2014-bmw-x5/127361904",
    "image": "/stock/127361904-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "2014 BMW X5 xDrive35i",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "177,873 mi",
    "mileageKm": 286259,
    "fuel": "Not published",
    "transmission": "Automatic 8-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 7990,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2014-buick-enclave/127361891",
    "image": "/media/photo-unavailable.svg",
    "category": "Crossover",
    "body": "Crossover",
    "make": "Buick",
    "title": "2014 Buick Enclave Leather",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "162,632 mi",
    "mileageKm": 261731,
    "fuel": "Not published",
    "transmission": "Automatic 6-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 6990,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2007-cadillac-cts/127361933",
    "image": "/media/photo-unavailable.svg",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Cadillac",
    "title": "2007 Cadillac CTS HI FEATURE V6",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "119,529 mi",
    "mileageKm": 192363,
    "fuel": "Not published",
    "transmission": "Automatic 5-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 4990,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://www.texasdriveauto.com/details/used-2018-cadillac-escalade/127361883",
    "image": "/media/photo-unavailable.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Cadillac",
    "title": "2018 Cadillac Escalade Standard",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "99,315 mi",
    "mileageKm": 159832,
    "fuel": "Not published",
    "transmission": "Automatic 10-Speed",
    "equipment": [],
    "condition": "used",
    "priceEur": 15990,
    "href": "/listing-detail-v1/8"
  }
];

const inventoryLocale = "en-US";
const inventoryCurrency = "USD";
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
