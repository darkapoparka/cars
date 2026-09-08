// Excellent Cars public advert snapshot, 2026-09-07.
// Images are localized from the same verified dealer listings to prevent CDN hotlink failures.
export type CurrentDayNightListing = {
	id: string;
	title: string;
	sourceUrl: string;
	priceEur: string;
	priceBgn: string;
	status: string;
	date: string;
	mileage: string;
	color: string;
	fuel: string;
	power: string;
	transmission: string;
	body: string;
	features: string[];
	image: string;
};

export const currentDayNightListings: CurrentDayNightListing[] = [
  {
    "id": "21781257688134220",
    "title": "Mercedes-Benz GLE 350 AMG  DESIGNO",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21781257688134220-mercedes-benz-gle-350-amg-designo-360cam-serv-ist-ambient-diss-har",
    "priceEur": "32 900 €",
    "priceBgn": "64346.81 лв.",
    "status": "Публикувана обява",
    "date": "декември 2016 г.",
    "mileage": "179 000 км",
    "color": "Бял",
    "fuel": "Дизел",
    "power": "258 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-01-1.webp"
  },
  {
    "id": "11785932596351376",
    "title": "VW Passat 2.0TDI  HIGHLINE",
    "sourceUrl": "https://excellent.mobile.bg/obiava-11785932596351376-vw-passat-2-0tdi-highline-bluemotion-led-automat",
    "priceEur": "10 500 €",
    "priceBgn": "20536.22 лв.",
    "status": "Публикувана обява",
    "date": "декември 2011 г.",
    "mileage": "212 000 км",
    "color": "Сребърен",
    "fuel": "Дизел",
    "power": "140 к.с.",
    "transmission": "Автоматик",
    "body": "Седан",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-02-1.webp"
  },
  {
    "id": "11788181514006324",
    "title": "Skoda Octavia 2.0TDI  4x4",
    "sourceUrl": "https://excellent.mobile.bg/obiava-11788181514006324-skoda-octavia-2-0tdi-4x4-digital",
    "priceEur": "17 900 €",
    "priceBgn": "35009.36 лв.",
    "status": "Публикувана обява",
    "date": "септември 2022 г.",
    "mileage": "180 000 км",
    "color": "Тъмно сив",
    "fuel": "Дизел",
    "power": "150 к.с.",
    "transmission": "Автоматик",
    "body": "Комби",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-03-1.webp"
  },
  {
    "id": "11786795820524833",
    "title": "Cupra Born RESTYLING  58KW",
    "sourceUrl": "https://excellent.mobile.bg/obiava-11786795820524833-cupra-born-restyling-58kw-67000km",
    "priceEur": "22 900 €",
    "priceBgn": "44788.51 лв.",
    "status": "Публикувана обява",
    "date": "юни 2022 г.",
    "mileage": "67 000 км",
    "color": "Черен",
    "fuel": "Електрически",
    "power": "204 к.с.",
    "transmission": "Автоматик",
    "body": "Хечбек",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-04-1.webp"
  },
  {
    "id": "21786794971218528",
    "title": "Hyundai Kona 1.6HEV  N-LINE",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21786794971218528-hyundai-kona-1-6hev-n-line-40000km",
    "priceEur": "17 900 €",
    "priceBgn": "35009.36 лв.",
    "status": "Публикувана обява",
    "date": "септември 2020 г.",
    "mileage": "40 000 км",
    "color": "Тъмно сив",
    "fuel": "Хибрид",
    "power": "141 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-05-1.webp"
  },
  {
    "id": "21786455005208728",
    "title": "Kia Sportage 1.6D  AUTOMAT",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21786455005208728-kia-sportage-1-6d-automat",
    "priceEur": "10 900 €",
    "priceBgn": "21318.55 лв.",
    "status": "Публикувана обява",
    "date": "август 2017 г.",
    "mileage": "180 000 км",
    "color": "Тъмно сив",
    "fuel": "Дизел",
    "power": "143 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-06-1.webp"
  },
  {
    "id": "21786453972789852",
    "title": "VW Tiguan 2.0ТDI  4MOTION",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21786453972789852-vw-tiguan-2-0tdi-4motion-swiss",
    "priceEur": "16 990 €",
    "priceBgn": "33229.55 лв.",
    "status": "Публикувана обява",
    "date": "декември 2017 г.",
    "mileage": "199 000 км",
    "color": "Тъмно сив",
    "fuel": "Дизел",
    "power": "150 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-07-1.webp"
  },
  {
    "id": "21786451392501339",
    "title": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21786451392501339-land-rover-range-rover-evoque-hybrid-nardo-grey-125000km",
    "priceEur": "25 000 €",
    "priceBgn": "48895.75 лв.",
    "status": "Публикувана обява",
    "date": "септември 2022 г.",
    "mileage": "125 000 км",
    "color": "Тъмно сив",
    "fuel": "Хибрид",
    "power": "163 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-08-1.webp"
  },
  {
    "id": "21773151499854810",
    "title": "Audi Q2 2.0TFSI  QUATTRO",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21773151499854810-audi-q2-2-0tfsi-quattro-s-line-digital-line-assist",
    "priceEur": "16 900 €",
    "priceBgn": "33053.53 лв.",
    "status": "Публикувана обява",
    "date": "ноември 2018 г.",
    "mileage": "133 000 км",
    "color": "Тъмно сив",
    "fuel": "Бензин",
    "power": "190 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-09-1.webp"
  },
  {
    "id": "11768639133016485",
    "title": "Dodge Challenger 5.7HEMI  SRT",
    "sourceUrl": "https://excellent.mobile.bg/obiava-11768639133016485-dodge-challenger-5-7hemi-srt",
    "priceEur": "21 500 €",
    "priceBgn": "42050.35 лв.",
    "status": "Публикувана обява",
    "date": "септември 2014 г.",
    "mileage": "65 000 км",
    "color": "Черен",
    "fuel": "Бензин",
    "power": "380 к.с.",
    "transmission": "Автоматик",
    "body": "Купе",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-10-1.webp"
  },
  {
    "id": "21775914499512125",
    "title": "VW T-Cross 1.5i  AUTOMAT",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21775914499512125-vw-t-cross-1-5i-automat-48000km",
    "priceEur": "21 990 €",
    "priceBgn": "43008.70 лв.",
    "status": "Публикувана обява",
    "date": "октомври 2023 г.",
    "mileage": "48 000 км",
    "color": "Зелен",
    "fuel": "Бензин",
    "power": "150 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-11-1.webp"
  },
  {
    "id": "21785575816054903",
    "title": "Kia Niro PLUG-IN-HYBRID",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21785575816054903-kia-niro-plug-in-hybrid",
    "priceEur": "16 990 €",
    "priceBgn": "33229.55 лв.",
    "status": "Публикувана обява",
    "date": "септември 2019 г.",
    "mileage": "118 000 км",
    "color": "",
    "fuel": "Електрически",
    "power": "141 к.с.",
    "transmission": "Автоматик",
    "body": "Хечбек",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-12-1.webp"
  },
  {
    "id": "21773150110056507",
    "title": "BMW X3 2.0D  xDrive",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21773150110056507-bmw-x3-2-0d-xdrive-m-pack",
    "priceEur": "12 000 €",
    "priceBgn": "23469.96 лв.",
    "status": "Публикувана обява",
    "date": "октомври 2014 г.",
    "mileage": "188 000 км",
    "color": "Черен",
    "fuel": "Дизел",
    "power": "184 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "image": "/assets/excellent/vehicle-13-1.webp"
  },
  {
    "id": "21785323501482685",
    "title": "Nissan Juke 1.6Т  NISMO",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21785323501482685-nissan-juke-1-6t-nismo-alcantara",
    "priceEur": "9500 €",
    "priceBgn": "18580.38 лв.",
    "status": "Публикувана обява",
    "date": "август 2014 г.",
    "mileage": "186 000 км",
    "color": "Бял",
    "fuel": "Бензин",
    "power": "200 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-14-1.webp"
  },
  {
    "id": "11778320754806394",
    "title": "Peugeot 308 1.6GT  205h.p",
    "sourceUrl": "https://excellent.mobile.bg/obiava-11778320754806394-peugeot-308-1-6gt-205h-p-panorama-massage",
    "priceEur": "9200 €",
    "priceBgn": "17993.64 лв.",
    "status": "Публикувана обява",
    "date": "септември 2016 г.",
    "mileage": "130 000 км",
    "color": "Бял",
    "fuel": "Бензин",
    "power": "205 к.с.",
    "transmission": "Ръчна",
    "body": "Хечбек",
    "features": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-15-1.webp"
  },
  {
    "id": "21781781688732220",
    "title": "Mazda CX-5 2.5i  4x4",
    "sourceUrl": "https://excellent.mobile.bg/obiava-21781781688732220-mazda-cx-5-2-5i-4x4-automat-skyactiv",
    "priceEur": "14 990 €",
    "priceBgn": "29317.89 лв.",
    "status": "Публикувана обява",
    "date": "август 2015 г.",
    "mileage": "192 000 км",
    "color": "Бордо",
    "fuel": "Бензин",
    "power": "190 к.с.",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "image": "/assets/excellent/vehicle-16-1.webp"
  }
];
