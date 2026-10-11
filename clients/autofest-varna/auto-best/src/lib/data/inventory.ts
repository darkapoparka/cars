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
    "evidenceUrl": "https://autofest.mobile.bg/obiava-21791561972367404-honda-cr-v-2-0i-4x4-avtomat-g-inzhektsion",
    "image": "/assets/vehicles/21791561972367404/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Honda",
    "title": "Honda Cr-v 2.0i 4x4 АВТОМАТ Г.ИНЖЕКЦИОН",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "121 000 км",
    "mileageKm": 121000,
    "mileageKnown": true,
    "mileageValue": 121000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 18500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-21785142785989074-seat-ateca-fr-2-0-tdi-4x4-avtomatik-360-kamera-led-navi",
    "image": "/assets/vehicles/21785142785989074/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Seat",
    "title": "Seat Ateca FR 2.0 TDI 4x4 АВТОМАТИК 360-КАМЕРА LED NAVI",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "167 400 км",
    "mileageKm": 167400,
    "mileageKnown": true,
    "mileageValue": 167400,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 17990,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-11780325425358655-audi-a4-2-0tdi-facelift-bixenon-evro-5v",
    "image": "/assets/vehicles/11780325425358655/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 2.0TDI FACELIFT BiXenon ЕВРО-5В",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "225 000 км",
    "mileageKm": 225000,
    "mileageKnown": true,
    "mileageValue": 225000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 7670,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-11761146192856132-audi-a4-2-0tdi-facelift-navi-bi-ksenon",
    "image": "/assets/vehicles/11761146192856132/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 2.0TDI FACELIFT НАВИ БИ-КСЕНОН",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "193 000 км",
    "mileageKm": 193000,
    "mileageKnown": true,
    "mileageValue": 193000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 8999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-21784645887752101-audi-q3-2-0-tdi-bixenon-led-navi-servizna-istoriya",
    "image": "/assets/vehicles/21784645887752101/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q3 2.0 TDI BIXENON LED NAVI СЕРВИЗНА ИСТОРИЯ",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "205 000 км",
    "mileageKm": 205000,
    "mileageKnown": true,
    "mileageValue": 205000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-21774286824949260-audi-q5-2-0tdi-sline-digital-evro-6v",
    "image": "/assets/vehicles/21774286824949260/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 2.0TDI SLINE DIGITAL ЕВРО-6В",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "196 000 км",
    "mileageKm": 196000,
    "mileageKnown": true,
    "mileageValue": 196000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 18500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-11771069281557713-kia-soul-1-6i-avtomatik-4-zimni-gumi-dzhanti",
    "image": "/assets/vehicles/11771069281557713/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Kia",
    "title": "Kia Soul 1.6i АВТОМАТИК 4-ЗИМНИ ГУМИ+ ДЖАНТИ",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "165 200 км",
    "mileageKm": 165200,
    "mileageKnown": true,
    "mileageValue": 165200,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 7300,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autofest.mobile.bg/obiava-21777861065408895-kia-sportage-1-6i-led-kamera-navi-podgrev-novi-zimni-gumi",
    "image": "/assets/vehicles/21777861065408895/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Sportage 1.6i LED КАМЕРА NAVI ПОДГРЕВ НОВИ ЗИМНИ ГУМИ",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "97 000 км",
    "mileageKm": 97000,
    "mileageKnown": true,
    "mileageValue": 97000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 9990,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
