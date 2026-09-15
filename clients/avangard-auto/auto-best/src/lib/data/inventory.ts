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
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-11785010475119627-vw-passat-alltrack-2-0tdi-190k-s-4h4",
    "image": "/assets/avangard/vehicle-01-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat Alltrack",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "220 000 км",
    "mileageKm": 220000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 13500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21783748809976935-volvo-xc40-2-0d-150k-s-4h4",
    "image": "/assets/avangard/vehicle-02-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Volvo",
    "title": "Volvo XC40 2.0D",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "166 000 км",
    "mileageKm": 166000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 17999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21766322242220471-volvo-xc40-t5-inscription-lizing-bez-parvonachalna-vnoska",
    "image": "/assets/avangard/vehicle-03-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Volvo",
    "title": "Volvo XC40 T5 inscription",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "278 000 км",
    "mileageKm": 278000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
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
    "priceEur": 16900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-11782450720679744-peugeot-208-1-6hdi-facelift",
    "image": "/assets/avangard/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 208 1.6HDI",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "214 000 км",
    "mileageKm": 214000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5800,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-11782462832415648-peugeot-2008-1-6hdi-92k-s-allure",
    "image": "/assets/avangard/vehicle-05-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 2008 1.6HDI",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "216 000 км",
    "mileageKm": 216000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Панорамен покрив",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21776284342452600-nissan-qashqai-1-5dci-110k-s-facelift-tekna",
    "image": "/assets/avangard/vehicle-06-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 1.5dCi",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Панорамен покрив",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21773782041228539-mitsubishi-outlander-2-2di-d-150k-s-4h4",
    "image": "/assets/avangard/vehicle-07-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mitsubishi",
    "title": "Mitsubishi Outlander 2.2DI-D",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "167 000 км",
    "mileageKm": 167000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9350,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21760385289842805-kia-sportage-1-7crdi-facelift",
    "image": "/assets/avangard/vehicle-08-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Sportage 1.7CRDI",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "179 000 км",
    "mileageKm": 179000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8500,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21785012088488667-bmw-x1-2-0d-150k-s",
    "image": "/assets/avangard/vehicle-09-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X1 2.0D",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "138 000 км",
    "mileageKm": 138000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21746821020349714-bmw-x1-2-0d-177k-s-xdrive",
    "image": "/assets/avangard/vehicle-10-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X1 2.0D",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "187 000 км",
    "mileageKm": 187000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 5999,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-11754080933689299-bmw-320-i-184k-s",
    "image": "/assets/avangard/vehicle-11-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "BMW",
    "title": "BMW 320 i",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "187 000 км",
    "mileageKm": 187000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21779794798955793-audi-sq5-3-0v6t-zf-lizing-bez-parvonachalna-vnoska",
    "image": "/assets/avangard/vehicle-12-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi SQ5 3.0V6T ZF",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "197 000 км",
    "mileageKm": 197000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
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
    "priceEur": 21999,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21786111867697018-audi-q7-premium-plus-lizing-bez-parvonachalna-vnoska",
    "image": "/assets/avangard/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7 Premium Plus",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "255 000 км",
    "mileageKm": 255000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
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
    "priceEur": 20500,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21779802183945718-audi-q5-sq5-3-0v6t-lizing-bez-parvonachalna-vnoska",
    "image": "/assets/avangard/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 SQ5 3.0V6T",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "197 000 км",
    "mileageKm": 197000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
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
    "priceEur": 21999,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-21762503862293800-audi-q5-premium-plus-lizing-bez-parvonachalna-vnoska",
    "image": "/assets/avangard/vehicle-15-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 Premium Plus",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "206 000 км",
    "mileageKm": 206000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
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
    "priceEur": 17999,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://avangard-auto.mobile.bg/obiava-11787435697096424-audi-a4-2-0tdi-143k-s",
    "image": "/assets/avangard/vehicle-16-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 2.0TDI",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "202 000 км",
    "mileageKm": 202000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/16"
  }
];

const inventoryLocale = "bg-BG";
const inventoryCurrency = "EUR";
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
