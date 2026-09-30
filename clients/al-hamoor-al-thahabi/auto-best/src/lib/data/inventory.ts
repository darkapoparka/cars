import { formatPrice, localeContract, type Locale } from '$lib/locale/core';
import { templateText } from '$lib/locale/messages';
import { leadSite } from '$config/lead-site';

export const vehicleTypes = ['car', 'motorbike', 'van', 'truck'] as const;
export type VehicleType = typeof vehicleTypes[number];

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
  type: VehicleType;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  /** Optional manufacturer sub-brand used by compact card identity. */
  cardBrand?: string;
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
    "evidenceUrl": "https://www.dubicars.com/2025-mercedes-benz-cla250-premium-20l-965722.html",
    "image": "/dealer/inventory/965722-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "2025 Mercedes-Benz CLA250 Premium + 2.0L",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "22,000 км",
    "mileageKm": 22000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 95000,
    "href": "/listing-detail-v1/1",
    "type": "car"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2023-nissan-rogue-1005647.html",
    "image": "/dealer/inventory/1005647-1.webp",
    "category": "SUV/Crossover",
    "body": "SUV",
    "make": "Nissan",
    "title": "2023 Nissan Rogue Platinum",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "56,000 км",
    "mileageKm": 56000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 45000,
    "href": "/listing-detail-v1/2",
    "type": "car"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2011-toyota-prado-1010924.html",
    "image": "/dealer/inventory/1010924-1.webp",
    "category": "SUV/Crossover",
    "body": "SUV",
    "make": "Toyota",
    "title": "2011 Toyota Prado TX-L",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "212,000 км",
    "mileageKm": 212000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 56000,
    "href": "/listing-detail-v1/3",
    "type": "car"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2022-chevrolet-malibu-1018774.html",
    "image": "/dealer/inventory/1018774-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Chevrolet",
    "title": "2022 Chevrolet Malibu LT",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "95,000 км",
    "mileageKm": 95000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 32000,
    "href": "/listing-detail-v1/4",
    "type": "car"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2023-toyota-rush-15l-ex-916417.html",
    "image": "/dealer/inventory/916417-1.webp",
    "category": "SUV/Crossover",
    "body": "SUV",
    "make": "Toyota",
    "title": "2023 Toyota Rush EX 1.5L",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "121,000 км",
    "mileageKm": 121000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 43000,
    "href": "/listing-detail-v1/5",
    "type": "car"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2020-chevrolet-trax-lt-18l-awd-906007.html",
    "image": "/dealer/inventory/906007-1.webp",
    "category": "SUV/Crossover",
    "body": "SUV",
    "make": "Chevrolet",
    "title": "2020 Chevrolet Trax LT 1.8L AWD",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "106,000 км",
    "mileageKm": 106000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/6",
    "type": "car"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2019-ford-figo-1017078.html",
    "image": "/dealer/inventory/1017078-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Ford",
    "title": "2019 Ford Figo Ambiente",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "185,000 км",
    "mileageKm": 185000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 13500,
    "href": "/listing-detail-v1/7",
    "type": "car"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://www.dubicars.com/2021-nissan-sentra-sv-16l-113-hp-969234.html",
    "image": "/dealer/inventory/969234-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Nissan",
    "title": "2021 Nissan Sentra SV 1.6L",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "116,000 км",
    "mileageKm": 116000,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 23000,
    "href": "/listing-detail-v1/8",
    "type": "car"
  }
];

export const formatVehiclePrice = (amount: number, locale: Locale = localeContract.defaultLocale) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\s+/u, '$1 ').replace(/\s+([A-Z]{3})$/u, ' $1');
