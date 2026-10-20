import { formatPrice, localeContract, type Locale } from '$lib/locale/core';
import { templateText } from '$lib/locale/messages';

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
  /** Seller-supplied highlight by locale; import/condition claims require record-specific evidence. */
  cardNote?: Partial<Record<Locale, string>>;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  mileageKnown?: boolean;
  mileageValue?: number;
  mileageUnit?: 'km' | 'mi';
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
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-11755373421680634-toyota-camry-2-5-hybrid-bisiness-edition",
    "image": "/inventory/11755373421680634-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Toyota",
    "title": "Toyota Camry 2.5 Hybrid Bisiness Edition",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "162 050 км",
    "mileageKm": 162050,
    "mileageKnown": true,
    "mileageValue": 162050,
    "mileageUnit": "km",
    "fuel": "Хибрид",
    "transmission": "Автоматична",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 19000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-21778616329882244-suzuki-across-2-5-p-hev-306hp-comfort",
    "image": "/inventory/21778616329882244-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Suzuki",
    "title": "Suzuki Across 2.5 P-HEV 306HP COMFORT+",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "137 388 км",
    "mileageKm": 137388,
    "mileageKnown": true,
    "mileageValue": 137388,
    "mileageUnit": "km",
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 25000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-11748282363284627-smart-forfour-eq-led",
    "image": "/inventory/11748282363284627-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Smart",
    "title": "Smart Forfour EQ LED",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "16 300 км",
    "mileageKm": 16300,
    "mileageKnown": true,
    "mileageValue": 16300,
    "mileageUnit": "km",
    "fuel": "Електричество",
    "transmission": "Автоматична",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-21766913531494016-mitsubishi-eclipse-cross-2-4-4h4-plug-in",
    "image": "/inventory/21766913531494016-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mitsubishi",
    "title": "Mitsubishi Eclipse Cross 2.4 4x4 Plug-in",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "62 605 км",
    "mileageKm": 62605,
    "mileageKnown": true,
    "mileageValue": 62605,
    "mileageUnit": "km",
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 23500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-21761039729616703-hyundai-santa-fe-2-2crdi-4x4-panorama7-mesta-ful-top",
    "image": "/inventory/21761039729616703-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Santa Fe 2.2 CRDI 4x4 • 7 места",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "118 346 км",
    "mileageKm": 118346,
    "mileageKnown": true,
    "mileageValue": 118346,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 19200,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.cars.bg/offer/6a57ac9bd26832c7c4052853",
    "image": "/inventory/6a57ac9bd26832c7c4052853-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "DS",
    "title": "DS 7 Crossback 1.6 P-HEV 224 к.с.",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "156 868 км",
    "mileageKm": 156868,
    "mileageKnown": true,
    "mileageValue": 156868,
    "mileageUnit": "km",
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 18900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.cars.bg/offer/69551c3403615d4d390bde93",
    "image": "/inventory/69551c3403615d4d390bde93-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A6 40 TDI",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "192 298 км",
    "mileageKm": 192298,
    "mileageKnown": true,
    "mileageValue": 192298,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматична",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 35000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://exclusiveauto.mobile.bg/obiava-21773847467906960-toyota-rav4-2-0-16v-gaz",
    "image": "/inventory/21773847467906960-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota RAV4 2.0 16V • Газ",
    "year": "2004",
    "yearNumber": 2004,
    "mileage": "260 362 км",
    "mileageKm": 260362,
    "mileageKnown": true,
    "mileageValue": 260362,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 2700,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
