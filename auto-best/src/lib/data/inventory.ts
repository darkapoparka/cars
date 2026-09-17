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
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11779989521200947-audi-a5-3-0tdi-s-line-facelift-led-navi-b-o-lizing-100",
    "image": "/assets/eliqauto/cars/11779989521200947/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "172 000 км",
    "mileageKm": 172000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 12880,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780007305121982-bmw-750-i-long-xdrive-led-navi-360-b-w-lizing-100",
    "image": "/assets/eliqauto/cars/11780007305121982/img-02.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "BMW",
    "title": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "163 000 км",
    "mileageKm": 163000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 24880,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780175636720970-mercedes-benz-s-500-long-facelift-led-pano-h-k-3xtv-lizing-100",
    "image": "/assets/eliqauto/cars/11780175636720970/img-02.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13660,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780176585830804-mercedes-benz-cla-200-d-facelift-amg-line-led-navi-lizing-100",
    "image": "/assets/eliqauto/cars/11780176585830804/img-02.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13660,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780177315125298-mercedes-benz-s-560-long-facelift-amg-line-pano-burm-hud-lizing-100",
    "image": "/assets/eliqauto/cars/11780177315125298/img-01.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "177 000 км",
    "mileageKm": 177000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 0,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780254722465322-mercedes-benz-s-400-d-long-amg-line-led-pano-5d-burm-hud-lizing-100",
    "image": "/assets/eliqauto/cars/11780254722465322/img-01.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "80 000 км",
    "mileageKm": 80000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 77880,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780906851194765-audi-a8-50tdi-quattro-matrix-pano-b-o-3xtv-lizing-100",
    "image": "/assets/eliqauto/cars/11780906851194765/img-01.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Audi",
    "title": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "158 000 км",
    "mileageKm": 158000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 39660,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780907716855488-mercedes-benz-gls-450-i-4matic-full-amg-line-led-pano-burm-lizing-100",
    "image": "/assets/eliqauto/cars/11780907716855488/img-01.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "72 000 км",
    "mileageKm": 72000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 81745,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11780909888518340-mercedes-benz-e-220-d-full-amg-line-led-pano-burm-3xtv-lizing-100",
    "image": "/assets/eliqauto/cars/11780909888518340/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "200 000 км",
    "mileageKm": 200000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 25660,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781187597210481-mercedes-benz-gls-450-i-4matic-full-maybach-pano-burm-360-lizing-100",
    "image": "/assets/eliqauto/cars/11781187597210481/img-01.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "78 000 км",
    "mileageKm": 78000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 79660,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781207164422554-mercedes-benz-amg-gt-53-4matic-led-designo-burm-360-lizing-100",
    "image": "/assets/eliqauto/cars/11781207164422554/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "135 000 км",
    "mileageKm": 135000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 64880,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781211980587571-bmw-750-d-xdrive-black-fire-edition-1of150-lizing-100",
    "image": "/assets/eliqauto/cars/11781211980587571/img-01.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "BMW",
    "title": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "87 000 км",
    "mileageKm": 87000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 57880,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781244995278530-audi-a8-50tdi-long-matrix-pano-3xtv-b-o-lizing-100",
    "image": "/assets/eliqauto/cars/11781244995278530/img-01.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Audi",
    "title": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "164 000 км",
    "mileageKm": 164000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 39660,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781281410239020-mercedes-benz-c-63-amg-s-v8-biturbo-led-navi-burm-lizing-100",
    "image": "/assets/eliqauto/cars/11781281410239020/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 39660,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781294210212810-bmw-330-i-xdrive-m-pack-facelift-led-navi-lizing-100",
    "image": "/assets/eliqauto/cars/11781294210212810/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 330 I XDRIVE M PACK FACELIFT LED NAVI ЛИЗИНГ 100%",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "146 000 км",
    "mileageKm": 146000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 29660,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://eliqauto.mobile.bg/obiava-11781346026930952-audi-a6-3-0tdi-quattro-full-rs6-pack-led-navi-lizing-100",
    "image": "/assets/eliqauto/cars/11781346026930952/img-01.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A6 3.0TDI QUATTRO FULL RS6 PACK LED NAVI ЛИЗИНГ 100%",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 15880,
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
