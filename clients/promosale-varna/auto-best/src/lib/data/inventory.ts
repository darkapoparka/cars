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
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-21788787563552939-mercedes-benz-eqe-350-burmester-podgrev-lizing",
    "image": "/dealer/inventory/21788787563552939-1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz EQE 350+ * Burmester* Подгрев* ЛИЗИНГ",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "294 900 км",
    "mileageKm": 294900,
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 26900,
    "href": "/listing-detail-v1/1",
    "type": "car"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-11787906058256951-peugeot-2008-gt-full-pano-podgrev-lizing",
    "image": "/dealer/inventory/11787906058256951-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 2008 GT* FULL* Pano* Подгрев* ЛИЗИНГ",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "19 900 км",
    "mileageKm": 19900,
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 24990,
    "href": "/listing-detail-v1/2",
    "type": "car"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-11786461174971809-bmw-740-i-long-m-sport-full-individual-lizing",
    "image": "/dealer/inventory/11786461174971809-1.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "BMW",
    "title": "BMW 740 i Long* M-Sport* FULL* Individual* ЛИЗИНГ",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "149 000 км",
    "mileageKm": 149000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 44900,
    "href": "/listing-detail-v1/3",
    "type": "car"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-11786375334835370-porsche-panamera-4s-matrix-nappa-bose-sportchrono-lizing",
    "image": "/dealer/inventory/11786375334835370-1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche Panamera 4S* Matrix* Nappa* Bose* SportChrono* ЛИЗИНГ",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "179 000 км",
    "mileageKm": 179000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 44900,
    "href": "/listing-detail-v1/4",
    "type": "car"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-11786370554050885-audi-a1-s-line-tfsi-ultra-alcantara-carplay-lizing",
    "image": "/dealer/inventory/11786370554050885-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A1 S -Line* TFSI* Ultra* Alcantara* Carplay* ЛИЗИНГ",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "150 300 км",
    "mileageKm": 150300,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 11900,
    "href": "/listing-detail-v1/5",
    "type": "car"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://promosale_varna.mobile.bg/obiava-11786106091652576-mercedes-benz-eqb-amg-7-mesten-garantsiya-obsluzhen-lizing",
    "image": "/dealer/inventory/11786106091652576-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz EQB AMG* 7 МЕСТЕН* ГАРАНЦИЯ* ОБСЛУЖЕН* ЛИЗИНГ",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "140 900 км",
    "mileageKm": 140900,
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 24500,
    "href": "/listing-detail-v1/6",
    "type": "car"
  }
];

export const formatVehiclePrice = (amount: number, locale: Locale = localeContract.defaultLocale) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\s+/u, '$1 ').replace(/\s+([A-Z]{3})$/u, ' $1');
