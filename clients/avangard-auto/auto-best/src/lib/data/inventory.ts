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
  image: string;
  gallery: string[];
  sourceUrl: string;
  description: string;
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
    "image": "/assets/avangard/vehicle-01-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-01-1.webp",
      "/assets/avangard/vehicle-01-2.webp",
      "/assets/avangard/vehicle-01-3.webp",
      "/assets/avangard/vehicle-01-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-11785010475119627-vw-passat-alltrack-2-0tdi-190k-s-4h4",
    "description": "VW Passat Alltrack, юли 2018 г.  220 000 км Тъмно сив Дизелов 190 к.с. Евро 6 2000 куб.см Автоматична Комби. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Комби",
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
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 13500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "image": "/assets/avangard/vehicle-02-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-02-1.webp",
      "/assets/avangard/vehicle-02-2.webp",
      "/assets/avangard/vehicle-02-3.webp",
      "/assets/avangard/vehicle-02-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21783748809976935-volvo-xc40-2-0d-150k-s-4h4",
    "description": "Volvo XC40 2.0D, октомври 2019 г.  166 000 км Сив Дизелов 150 к.с. Евро 6 2000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 17999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "image": "/assets/avangard/vehicle-03-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-03-1.webp",
      "/assets/avangard/vehicle-03-2.webp",
      "/assets/avangard/vehicle-03-3.webp",
      "/assets/avangard/vehicle-03-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21766322242220471-volvo-xc40-t5-inscription-lizing-bez-parvonachalna-vnoska",
    "description": "Volvo XC40 T5 inscription, юни 2019 г.  278 000 км Сив Бензинов 248 к.с. Евро 6 2000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 16900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "image": "/assets/avangard/vehicle-04-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-04-1.webp",
      "/assets/avangard/vehicle-04-2.webp",
      "/assets/avangard/vehicle-04-3.webp",
      "/assets/avangard/vehicle-04-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-11782450720679744-peugeot-208-1-6hdi-facelift",
    "description": "Peugeot 208 1.6HDI, юли 2016 г.  214 000 км Бял Дизелов 75 к.с. Евро 6 1600 куб.см Ръчна Хечбек. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Хечбек",
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
    "image": "/assets/avangard/vehicle-05-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-05-1.webp",
      "/assets/avangard/vehicle-05-2.webp",
      "/assets/avangard/vehicle-05-3.webp",
      "/assets/avangard/vehicle-05-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-11782462832415648-peugeot-2008-1-6hdi-92k-s-allure",
    "description": "Peugeot 2008 1.6HDI, ноември 2013 г.  216 000 км Бял Дизелов 92 к.с. Евро 5 1600 куб.см Ръчна Хечбек. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Хечбек",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "image": "/assets/avangard/vehicle-06-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-06-1.webp",
      "/assets/avangard/vehicle-06-2.webp",
      "/assets/avangard/vehicle-06-3.webp",
      "/assets/avangard/vehicle-06-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21776284342452600-nissan-qashqai-1-5dci-110k-s-facelift-tekna",
    "description": "Nissan Qashqai 1.5dCi, юли 2018 г.  175 000 км Бял Дизелов 110 к.с. Евро 6 1500 куб.см Ръчна Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "image": "/assets/avangard/vehicle-07-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-07-1.webp",
      "/assets/avangard/vehicle-07-2.webp",
      "/assets/avangard/vehicle-07-3.webp",
      "/assets/avangard/vehicle-07-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21773782041228539-mitsubishi-outlander-2-2di-d-150k-s-4h4",
    "description": "Mitsubishi Outlander 2.2DI-D, септември 2014 г.  167 000 км Бял Дизелов 150 к.с. Евро 5 2200 куб.см Ръчна Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
    "image": "/assets/avangard/vehicle-08-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-08-1.webp",
      "/assets/avangard/vehicle-08-2.webp",
      "/assets/avangard/vehicle-08-3.webp",
      "/assets/avangard/vehicle-08-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21760385289842805-kia-sportage-1-7crdi-facelift",
    "description": "Kia Sportage 1.7CRDI, юли 2014 г.  179 000 км Светло сив Дизелов 116 к.с. Евро 5 1700 куб.см Ръчна Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8500,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "image": "/assets/avangard/vehicle-09-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-09-1.webp",
      "/assets/avangard/vehicle-09-2.webp",
      "/assets/avangard/vehicle-09-3.webp",
      "/assets/avangard/vehicle-09-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21785012088488667-bmw-x1-2-0d-150k-s",
    "description": "BMW X1 2.0D, август 2016 г.  138 000 км Тъмно сив Дизелов 150 к.с. Евро 6 2000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "image": "/assets/avangard/vehicle-10-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-10-1.webp",
      "/assets/avangard/vehicle-10-2.webp",
      "/assets/avangard/vehicle-10-3.webp",
      "/assets/avangard/vehicle-10-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21746821020349714-bmw-x1-2-0d-177k-s-xdrive",
    "description": "BMW X1 2.0D, септември 2010 г.  187 000 км Светло сив Дизелов 177 к.с. 2000 куб.см Ръчна Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
    "image": "/assets/avangard/vehicle-11-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-11-1.webp",
      "/assets/avangard/vehicle-11-2.webp",
      "/assets/avangard/vehicle-11-3.webp",
      "/assets/avangard/vehicle-11-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-11754080933689299-bmw-320-i-184k-s",
    "description": "BMW 320 i, юли 2013 г.  187 000 км Тъмно син мет. Бензинов 184 к.с. 2000 куб.см Ръчна Комби. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Комби",
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
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "image": "/assets/avangard/vehicle-12-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-12-1.webp",
      "/assets/avangard/vehicle-12-2.webp",
      "/assets/avangard/vehicle-12-3.webp",
      "/assets/avangard/vehicle-12-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21779794798955793-audi-sq5-3-0v6t-zf-lizing-bez-parvonachalna-vnoska",
    "description": "Audi SQ5 3.0V6T ZF, май 2018 г.  197 000 км Сив Бензинов 354 к.с. Евро 6 3000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 21999,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "image": "/assets/avangard/vehicle-13-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-13-1.webp",
      "/assets/avangard/vehicle-13-2.webp",
      "/assets/avangard/vehicle-13-3.webp",
      "/assets/avangard/vehicle-13-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21786111867697018-audi-q7-premium-plus-lizing-bez-parvonachalna-vnoska",
    "description": "Audi Q7 Premium Plus, април 2017 г.  255 000 км Тъмно сив Бензинов 333 к.с. Евро 6 3000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "image": "/assets/avangard/vehicle-14-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-14-1.webp",
      "/assets/avangard/vehicle-14-2.webp",
      "/assets/avangard/vehicle-14-3.webp",
      "/assets/avangard/vehicle-14-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21779802183945718-audi-q5-sq5-3-0v6t-lizing-bez-parvonachalna-vnoska",
    "description": "Audi Q5 SQ5 3.0V6T, май 2018 г.  197 000 км Сив Бензинов 354 к.с. Евро 6 3000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 21999,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "image": "/assets/avangard/vehicle-15-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-15-1.webp",
      "/assets/avangard/vehicle-15-2.webp",
      "/assets/avangard/vehicle-15-3.webp",
      "/assets/avangard/vehicle-15-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-21762503862293800-audi-q5-premium-plus-lizing-bez-parvonachalna-vnoska",
    "description": "Audi Q5 Premium Plus, март 2018 г.  206 000 км Светло сив Бензинов 252 к.с. Евро 6 2000 куб.см Автоматична Джип. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Джип",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 17999,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "image": "/assets/avangard/vehicle-16-1.webp",
    "gallery": [
      "/assets/avangard/vehicle-16-1.webp",
      "/assets/avangard/vehicle-16-2.webp",
      "/assets/avangard/vehicle-16-3.webp",
      "/assets/avangard/vehicle-16-4.webp"
    ],
    "sourceUrl": "https://avangard-auto.mobile.bg/obiava-11787435697096424-audi-a4-2-0tdi-143k-s",
    "description": "Audi A4 2.0TDI, юли 2011 г.  202 000 км Бял Дизелов 143 к.с. 2000 куб.см Автоматична Комби. Обявен от AVANGARD AUTO. Потвърдете наличността и условията по телефона преди посещение.",
    "category": "Комби",
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
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/16"
  }
];
export const formatVehiclePrice = (priceEur: number) => new Intl.NumberFormat('bg-BG').format(priceEur) + ' €';
