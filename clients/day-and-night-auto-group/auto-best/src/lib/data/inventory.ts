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
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21784728210405323-mercedes-benz-gla-45-amg-ochakvan-vnos-amg-edition-1carbonpanohkcamred",
    "image": "/variant-3/assets/daynight/inventory-current/21784728210405323.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLA 45 AMG Очакван внос AMG EDITION 1CARBONPANOHKCAMRED",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 26699,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11782122632841845-mercedes-benz-s-63-amg-mercedes-s63-amge-performancenardo-greyred-carbon",
    "image": "/variant-3/assets/daynight/inventory-current/11782122632841845.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 63 AMG Mercedes S63 AMGE-PERFORMANCENARDO GREYRED CARBON",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "30 000 км",
    "mileageKm": 30000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 143699,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11781786688563618-mercedes-benz-s-400-ochakvan-vnos-mercedes-s400d-long-amg-chauffeur",
    "image": "/variant-3/assets/daynight/inventory-current/11781786688563618.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 400 ОЧАКВАН ВНОС Mercedes S400d Long* AMG* Chauffeur",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "179 000 км",
    "mileageKm": 179000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 48699,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21781366888650416-mercedes-benz-gls-400-ochakvan-vnos-gls400d-63-amg-optic-3xtv-carbon-b",
    "image": "/variant-3/assets/daynight/inventory-current/21781366888650416.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLS 400 ОЧАКВАН ВНОС GLS400d 63 AMG OPTIC* 3xTV* CARBON* B",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "149 000 км",
    "mileageKm": 149000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 72699,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21784223776383846-mercedes-benz-gle-53-4matic-ochakvan-vnosgle53-amg-coupe-night-pack-obduhvane",
    "image": "/variant-3/assets/daynight/inventory-current/21784223776383846.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE 53 4MATIC Очакван ВносGLE53 AMG Coupe* NIGHT Pack* ОБДУХВАНЕ",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "105 000 км",
    "mileageKm": 105000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 71699,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21781186627237038-mercedes-benz-gle-400-coupe-amg360night-packageburmhudp",
    "image": "/variant-3/assets/daynight/inventory-current/21781186627237038.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE 400 Coupe AMG360Night PackageBURMHUDP",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "166 000 км",
    "mileageKm": 166000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 63699,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21775198700636300-mercedes-benz-gl-63-amg-mercedes-gl63-amg-3xtv-360-vent-heat-panorama",
    "image": "/variant-3/assets/daynight/inventory-current/21775198700636300.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GL 63 AMG Mercedes GL63 AMG* 3xTV* 360* VENT+ HEAT* PANORAMA",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "139 000 км",
    "mileageKm": 139000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 32699,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21758203454344162-mercedes-benz-g-350-mercedes-g350d-amg-face-cam-heat-vent-seats-fu",
    "image": "/variant-3/assets/daynight/inventory-current/21758203454344162.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 350 Mercedes G350d AMG FACE* CAM* Heat+ Vent seats* FU",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "130 000 км",
    "mileageKm": 130000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 54699,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11782540302515038-mercedes-benz-e-63-amg-mercedes-benz-e63s-amg-facelift-360-hud-burm",
    "image": "/variant-3/assets/daynight/inventory-current/11782540302515038.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 63 AMG Mercedes-Benz E63S AMG* FACELIFT* 360* HUD* BURM*",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "96 000 км",
    "mileageKm": 96000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 84699,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11784224743668074-mercedes-benz-e-400-ochakvan-vnos-e400d-facelift-amg-360-3d-burm",
    "image": "/variant-3/assets/daynight/inventory-current/11784224743668074.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 400 Очакван внос E400d * Facelift* AMG * 360* 3D BURM*",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "162 000 км",
    "mileageKm": 162000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 42699,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11777018671764829-mercedes-benz-e-350-ochakvan-vnos-mercedes-e350d-amg-line",
    "image": "/variant-3/assets/daynight/inventory-current/11777018671764829.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 350 ОЧАКВАН ВНОС Mercedes E350d * AMG Line*",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "140 000 км",
    "mileageKm": 140000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 28699,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11783434857807146-mercedes-benz-cls-53-amg-ochakvan-cls53-amg-carbon-360-hud-burm-assis",
    "image": "/variant-3/assets/daynight/inventory-current/11783434857807146.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLS 53 AMG ОЧАКВАН CLS53 AMG * CARBON* 360* HUD* BURM* Assis",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "166 000 км",
    "mileageKm": 166000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 54699,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11782479430635636-mercedes-benz-cls-400-ochakvan-vnos-amg-designo-360-digital-fullmax",
    "image": "/variant-3/assets/daynight/inventory-current/11782479430635636.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLS 400 Очакван Внос AMG * Designo* 360* Digital FullMax",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "171 000 км",
    "mileageKm": 171000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 37699,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11779001443562014-mercedes-benz-amg-gt-mercedes-amg-gt43-burmester-cam360-digital-as",
    "image": "/variant-3/assets/daynight/inventory-current/11779001443562014.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz AMG GT Mercedes AMG GT43 BURMESTER* * CAM360* DIGITAL* AS",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "165 000 км",
    "mileageKm": 165000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 65699,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21781097577012835-land-rover-range-rover-sport-range-rover-sport-svr-600hp-pano-360cam-meridi",
    "image": "/variant-3/assets/daynight/inventory-current/21781097577012835.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Land",
    "title": "Land Rover Range Rover Sport Range Rover SPORT SVR* 600HP* PANO* 360CAM* MERIDI",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "155 000 км",
    "mileageKm": 155000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 54699,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21783785043166128-bmw-x7-ochakvan-vnos-m50d-xdrive-individual-swarovski-sky",
    "image": "/variant-3/assets/daynight/inventory-current/21783785043166128.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X7 Очакван Внос M50d xDrive INDIVIDUAL Swarovski Sky",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "150 000 км",
    "mileageKm": 150000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 53699,
    "href": "/listing-detail-v1/16"
  },
  {
    "id": 17,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21784134153263153-bmw-x6-ochakvan-vno-x6m-compe-tvcarbonindividualtwo-tonepa",
    "image": "/variant-3/assets/daynight/inventory-current/21784134153263153.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 Очакван Вно X6M Compе TVCARBONINDIVIDUALTWO-TonePA",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "160 000 км",
    "mileageKm": 160000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 71669,
    "href": "/listing-detail-v1/17"
  },
  {
    "id": 18,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21765900685685588-bmw-x6-bmw-x6-3-0d-m-sport-digital-camera-assistance",
    "image": "/variant-3/assets/daynight/inventory-current/21765900685685588.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 BMW X6 3. 0d M Sport* Digital* CAMERA* ASSISTANCE*",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "185 000 км",
    "mileageKm": 185000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 28478.45,
    "href": "/listing-detail-v1/18"
  },
  {
    "id": 19,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21777637702876978-bmw-x6-bmw-x6-4-0d-m-sport-digital-camera-assistance",
    "image": "/variant-3/assets/daynight/inventory-current/21777637702876978.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 BMW X6 4.0d M Sport* Digital* CAMERA* ASSISTANCE",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "183 000 км",
    "mileageKm": 183000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 28699,
    "href": "/listing-detail-v1/19"
  },
  {
    "id": 20,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21780050061781136-bmw-x6-bmw-x6-m50i-laser-360harman-fullmax",
    "image": "/variant-3/assets/daynight/inventory-current/21780050061781136.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 BMW X6 M50i LASER 360HARMAN FULLMAX",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "160 000 км",
    "mileageKm": 160000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 55699,
    "href": "/listing-detail-v1/20"
  },
  {
    "id": 21,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11781282994167628-bmw-m5-ochakvan-vnos-competition-625hp-face-b-w-laser",
    "image": "/variant-3/assets/daynight/inventory-current/11781282994167628.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "BMW",
    "title": "BMW M5 Очакван Внос Competition* 625HP* FACE* B&W* LASER*",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "133 000 км",
    "mileageKm": 133000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 68699,
    "href": "/listing-detail-v1/21"
  },
  {
    "id": 22,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11775899765171119-bmw-430-bmw-430xi-gran-coupe-m-sport-digital-cam-harma",
    "image": "/variant-3/assets/daynight/inventory-current/11775899765171119.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "BMW",
    "title": "BMW 430 BMW 430xi Gran Coupe* M Sport* Digital* CAM* HARMA",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "35 000 км",
    "mileageKm": 35000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 41699,
    "href": "/listing-detail-v1/22"
  },
  {
    "id": 23,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11781969350224394-audi-rs6-audi-rs6-avant-performance-ceramic-b-o-360",
    "image": "/variant-3/assets/daynight/inventory-current/11781969350224394.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi Rs6 Audi RS6 Avant PERFORMANCE CERAMIC B&O 360",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "169 000 км",
    "mileageKm": 169000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 69699,
    "href": "/listing-detail-v1/23"
  },
  {
    "id": 24,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21782920140707096-audi-q8-ochakvan-vnos-q8-50-tdi-quattro-s-line-plus-exclus",
    "image": "/variant-3/assets/daynight/inventory-current/21782920140707096.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q8 ОЧАКВАН ВНОС Q8 50 TDI quattro S line Plus Exclus",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "163 000 км",
    "mileageKm": 163000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 50699,
    "href": "/listing-detail-v1/24"
  },
  {
    "id": 25,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21782329010196509-audi-q7-audi-q7-face-hd-matrix-obduhvane-6-1",
    "image": "/variant-3/assets/daynight/inventory-current/21782329010196509.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7 AUDI Q7 FACE* HD MATRIX* ОБДУХВАНЕ 6+ 1",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "160 000 км",
    "mileageKm": 160000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 41699,
    "href": "/listing-detail-v1/25"
  },
  {
    "id": 26,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21784136402983332-audi-q7-ochakvan-vnos-q7-3-0tdi-matrixhudpanocam6-1",
    "image": "/variant-3/assets/daynight/inventory-current/21784136402983332.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7 Очакван Внос Q7 3.0TDI MATRIXHUDPANOCAM6+ 1",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "188 000 км",
    "mileageKm": 188000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 29699,
    "href": "/listing-detail-v1/26"
  },
  {
    "id": 27,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11775198338574112-audi-a8-audi-a8-long-4-2-tdi-w12-pack-mega-full-night",
    "image": "/variant-3/assets/daynight/inventory-current/11775198338574112.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Audi",
    "title": "Audi A8 Audi A8 Long 4.2 TDI W12 Pack MEGA FULL | NIGHT",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "204 000 км",
    "mileageKm": 204000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 27500,
    "href": "/listing-detail-v1/27"
  },
  {
    "id": 28,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21781787768273938-mercedes-benz-gls-400-ochakvan-vnos-mercedes-gls400d-amgline360burmpanora",
    "image": "/variant-3/assets/daynight/inventory-current/21781787768273938.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLS 400 ОЧАКВАН ВНОС Mercedes GLS400d AMGLine360BURMPANORA",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "172 000 км",
    "mileageKm": 172000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 59699,
    "href": "/listing-detail-v1/28"
  },
  {
    "id": 29,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11778599312336917-mercedes-benz-e-350-mercedes-350d-amg-optic-obduhvane-360-multibe",
    "image": "/variant-3/assets/daynight/inventory-current/11778599312336917.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 350 Mercedes 350d * AMG OPTIC* ОБДУХВАНЕ* 360* MULTIBE",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "177 000 км",
    "mileageKm": 177000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 33699,
    "href": "/listing-detail-v1/29"
  },
  {
    "id": 30,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11782541049698048-mercedes-benz-amg-gt-s-mercedes-amg-gt-s-prior-design-designo-exclusive-c",
    "image": "/variant-3/assets/daynight/inventory-current/11782541049698048.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz AMG GT S Mercedes-AMG GT S PRIOR DESIGN Designo Exclusive C",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "70 000 км",
    "mileageKm": 70000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 88699,
    "href": "/listing-detail-v1/30"
  },
  {
    "id": 31,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21762334502775312-lamborghini-urus-lamborghini-urus-fullmaxx",
    "image": "/variant-3/assets/daynight/inventory-current/21762334502775312.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Lamborghini",
    "title": "Lamborghini Urus LAMBORGHINI Urus FULLMAXX",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "86 000 км",
    "mileageKm": 86000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 172669,
    "href": "/listing-detail-v1/31"
  },
  {
    "id": 32,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21782329865022942-bmw-x5-ochakvan-vnos-m50d-360swarovskiskypanohudobduhvane",
    "image": "/variant-3/assets/daynight/inventory-current/21782329865022942.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 ОЧАКВАН ВНОС M50d 360SwarovskiSkyPanoHUDОБДУХВАНЕ",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "167 000 км",
    "mileageKm": 167000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 45699,
    "href": "/listing-detail-v1/32"
  },
  {
    "id": 33,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11784380846697521-audi-a8-audi-a8-5-0tdi-hd-matrix-360cam-distronic-plus",
    "image": "/variant-3/assets/daynight/inventory-current/11784380846697521.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Audi",
    "title": "Audi A8 Audi A8 5.0TDI* HD MATRIX* 360CAM* Distronic Plus*",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "186 000 км",
    "mileageKm": 186000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 28699,
    "href": "/listing-detail-v1/33"
  },
  {
    "id": 34,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11784130537689775-mercedes-benz-s-580-ochakvan-vnos-s580-long-brabus-4matic-burmes-plug-i",
    "image": "/variant-3/assets/daynight/inventory-current/11784130537689775.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 580 Очакван внос S580 Long BRABUS 4Matic BURMES Plug i",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "72 000 км",
    "mileageKm": 72000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 86699,
    "href": "/listing-detail-v1/34"
  },
  {
    "id": 35,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11778179700610297-mercedes-benz-v-300-mercedes-v250d-vip-business-tv-obduhvane-podg",
    "image": "/variant-3/assets/daynight/inventory-current/11778179700610297.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz V 300 Mercedes V250d* VIP* BUSINESS* TV* ОБДУХВАНЕ+ ПОДГ",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "44 500 км",
    "mileageKm": 44500,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 54699,
    "href": "/listing-detail-v1/35"
  },
  {
    "id": 36,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11782329384140338-mercedes-benz-v-300-ochakvan-vnos-v250d-longamg-linedesignoedition",
    "image": "/variant-3/assets/daynight/inventory-current/11782329384140338.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz V 300 Очакван Внос V250d LongAMG LineDesignoEdition",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "187 000 км",
    "mileageKm": 187000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 33699,
    "href": "/listing-detail-v1/36"
  },
  {
    "id": 37,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11778085846169037-mercedes-benz-e-400-mercedes-e400d-amg-lineassistancemultibeamfull",
    "image": "/variant-3/assets/daynight/inventory-current/11778085846169037.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 400 Mercedes E400d AMG LineASSISTANCEMULTIBEAMFULL*",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "172 000 км",
    "mileageKm": 172000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 29699,
    "href": "/listing-detail-v1/37"
  },
  {
    "id": 38,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11774291387702102-audi-rs7-audi-rs7-ceramic-masazhi-obduhvane-full",
    "image": "/variant-3/assets/daynight/inventory-current/11774291387702102.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Audi",
    "title": "Audi Rs7 AUDI RS7 Ceramic Масажи Обдухване Full",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "144 000 км",
    "mileageKm": 144000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 72699,
    "href": "/listing-detail-v1/38"
  },
  {
    "id": 39,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-21782661898906066-mercedes-benz-g-63-amg-ochakvan-vnos-g63-amg-face-3xtv-cam-heat-vent",
    "image": "/variant-3/assets/daynight/inventory-current/21782661898906066.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 63 AMG Очакван внос G63 AMG FACE* 3xTV* CAM* Heat+ Vent",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "164 000 км",
    "mileageKm": 164000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 61699,
    "href": "/listing-detail-v1/39"
  },
  {
    "id": 40,
    "verification": "verified",
    "evidenceUrl": "https://daynight.mobile.bg/obiava-11781790478711568-mercedes-benz-s-500-ochakvan-vnos-s500-longdesignoamg-line3xtv",
    "image": "/variant-3/assets/daynight/inventory-current/11781790478711568.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 500 Очакван Внос S500 LongDESIGNOAMG Line3xTV",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера"
    ],
    "condition": "used",
    "priceEur": 27699,
    "href": "/listing-detail-v1/40"
  }
];

const inventoryLocale = "bg-BG";
const inventoryCurrency = "BGN";
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
