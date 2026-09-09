import { daynightSite } from './daynight-site';

export type VehicleCondition = 'New' | 'Used' | 'Certified';

export type SortKey = 'template' | 'lowest' | 'highest' | 'newest' | 'mileage';

export interface Vehicle {
	slug: string;
	title: string;
	brand: string;
	model: string;
	bodyType: string;
	condition: VehicleCondition;
	price: number;
	monthly: number;
	year: number;
	mileage: number;
	fuel: string;
	displayFuel?: string;
	transmission: string;
	engine: string;
	exterior: string;
	interior: string;
	location: string;
	vin: string;
	stockNumber: string;
	tag?: string;
	tagTone?: 'lime' | 'violet' | 'dark';
	image: string;
	images: string[];
	gallery: string[];
	dealerSlug: string;
	agentSlug: string;
	rating: number;
	description: string;
	features: string[];
}

export interface InventoryFilters {
	query?: string;
	brand?: string;
	bodyType?: string;
	condition?: VehicleCondition | 'All';
	maxPrice?: number;
	minYear?: number;
	fuel?: string;
}

const detailGallery = [] as string[];

export const vehicles: Vehicle[] = [
  {
    "slug": "bmw-740d-xdrive-449508",
    "title": "BMW 740d xDrive",
    "brand": "BMW",
    "model": "740d xDrive",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 71999,
    "monthly": 0,
    "year": 2023,
    "mileage": 85000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2993 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "WBA21EJ070CN21228",
    "stockNumber": "11760378435449508",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11760378435449508-1.webp",
    "images": [
      "/dealer/stock/11760378435449508-1.webp",
      "/dealer/stock/11760378435449508-2.webp",
      "/dealer/stock/11760378435449508-3.webp",
      "/dealer/stock/11760378435449508-4.webp",
      "/dealer/stock/11760378435449508-5.webp",
      "/dealer/stock/11760378435449508-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11760378435449508-1.webp",
      "/dealer/stock/11760378435449508-2.webp",
      "/dealer/stock/11760378435449508-3.webp",
      "/dealer/stock/11760378435449508-4.webp",
      "/dealer/stock/11760378435449508-5.webp",
      "/dealer/stock/11760378435449508-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11760378435449508-bmw-740-d-xdrive-garantsiya-04-2028",
    "features": []
  },
  {
    "slug": "bmw-x6-m-package-054749",
    "title": "BMW X6 M Package",
    "brand": "BMW",
    "model": "X6 M Package",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 22500,
    "monthly": 0,
    "year": 2017,
    "mileage": 230000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "2979 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "5UXKU2C5XH0N84496",
    "stockNumber": "21769205380054749",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21769205380054749-1.webp",
    "images": [
      "/dealer/stock/21769205380054749-1.webp",
      "/dealer/stock/21769205380054749-2.webp",
      "/dealer/stock/21769205380054749-3.webp",
      "/dealer/stock/21769205380054749-4.webp",
      "/dealer/stock/21769205380054749-5.webp",
      "/dealer/stock/21769205380054749-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21769205380054749-1.webp",
      "/dealer/stock/21769205380054749-2.webp",
      "/dealer/stock/21769205380054749-3.webp",
      "/dealer/stock/21769205380054749-4.webp",
      "/dealer/stock/21769205380054749-5.webp",
      "/dealer/stock/21769205380054749-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-21769205380054749-bmw-x6-m-package",
    "features": []
  },
  {
    "slug": "hyundai-tucson-ix35-914903",
    "title": "Hyundai Tucson ix35",
    "brand": "Hyundai",
    "model": "Tucson ix35",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 34999,
    "monthly": 0,
    "year": 2025,
    "mileage": 8000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1600 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "TMAJB81BFTJ585121",
    "stockNumber": "21782908599914903",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21782908599914903-1.webp",
    "images": [
      "/dealer/stock/21782908599914903-1.webp",
      "/dealer/stock/21782908599914903-2.webp",
      "/dealer/stock/21782908599914903-3.webp",
      "/dealer/stock/21782908599914903-4.webp",
      "/dealer/stock/21782908599914903-5.webp",
      "/dealer/stock/21782908599914903-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21782908599914903-1.webp",
      "/dealer/stock/21782908599914903-2.webp",
      "/dealer/stock/21782908599914903-3.webp",
      "/dealer/stock/21782908599914903-4.webp",
      "/dealer/stock/21782908599914903-5.webp",
      "/dealer/stock/21782908599914903-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-21782908599914903-hyundai-tucson-ix35",
    "features": []
  },
  {
    "slug": "opel-corsa-e-294061",
    "title": "Opel Corsa E",
    "brand": "Opel",
    "model": "Corsa E",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 8999,
    "monthly": 0,
    "year": 2018,
    "mileage": 36644,
    "fuel": "Бензин",
    "transmission": "Manual",
    "engine": "1400 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "W0V0XEP68J4182966",
    "stockNumber": "11782907735294061",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11782907735294061-1.webp",
    "images": [
      "/dealer/stock/11782907735294061-1.webp",
      "/dealer/stock/11782907735294061-2.webp",
      "/dealer/stock/11782907735294061-3.webp",
      "/dealer/stock/11782907735294061-4.webp",
      "/dealer/stock/11782907735294061-5.webp",
      "/dealer/stock/11782907735294061-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11782907735294061-1.webp",
      "/dealer/stock/11782907735294061-2.webp",
      "/dealer/stock/11782907735294061-3.webp",
      "/dealer/stock/11782907735294061-4.webp",
      "/dealer/stock/11782907735294061-5.webp",
      "/dealer/stock/11782907735294061-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11782907735294061-opel-corsa-e",
    "features": []
  },
  {
    "slug": "audi-rs6-avant-performance-497458",
    "title": "Audi RS6 Avant Performance",
    "brand": "Audi",
    "model": "RS6 Avant Performance",
    "bodyType": "Wagon",
    "condition": "Used",
    "price": 123000,
    "monthly": 0,
    "year": 2025,
    "mileage": 20000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "3996 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "WUAZZZF24SN907918",
    "stockNumber": "11752078175497458",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11752078175497458-1.webp",
    "images": [
      "/dealer/stock/11752078175497458-1.webp",
      "/dealer/stock/11752078175497458-2.webp",
      "/dealer/stock/11752078175497458-3.webp",
      "/dealer/stock/11752078175497458-4.webp",
      "/dealer/stock/11752078175497458-5.webp",
      "/dealer/stock/11752078175497458-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11752078175497458-1.webp",
      "/dealer/stock/11752078175497458-2.webp",
      "/dealer/stock/11752078175497458-3.webp",
      "/dealer/stock/11752078175497458-4.webp",
      "/dealer/stock/11752078175497458-5.webp",
      "/dealer/stock/11752078175497458-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11752078175497458-audi-rs6-avant-performance",
    "features": []
  },
  {
    "slug": "mercedes-benz-cls-400-695554",
    "title": "Mercedes-Benz CLS 400",
    "brand": "Mercedes-Benz",
    "model": "CLS 400",
    "bodyType": "Coupe",
    "condition": "Used",
    "price": 30999,
    "monthly": 0,
    "year": 2018,
    "mileage": 145000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2925 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11780753459695554",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11780753459695554-1.webp",
    "images": [
      "/dealer/stock/11780753459695554-1.webp",
      "/dealer/stock/11780753459695554-2.webp",
      "/dealer/stock/11780753459695554-3.webp",
      "/dealer/stock/11780753459695554-4.webp",
      "/dealer/stock/11780753459695554-5.webp",
      "/dealer/stock/11780753459695554-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11780753459695554-1.webp",
      "/dealer/stock/11780753459695554-2.webp",
      "/dealer/stock/11780753459695554-3.webp",
      "/dealer/stock/11780753459695554-4.webp",
      "/dealer/stock/11780753459695554-5.webp",
      "/dealer/stock/11780753459695554-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11780753459695554-mercedes-benz-cls-400",
    "features": []
  },
  {
    "slug": "porsche-cayenne-turbo-4-0-v8-031902",
    "title": "Porsche Cayenne Turbo 4.0 V8",
    "brand": "Porsche",
    "model": "Cayenne Turbo 4.0 V8",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 49500,
    "monthly": 0,
    "year": 2018,
    "mileage": 192000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "3996 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "WP1ZZZ9YZKDA90569",
    "stockNumber": "21751722135031902",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21751722135031902-1.webp",
    "images": [
      "/dealer/stock/21751722135031902-1.webp",
      "/dealer/stock/21751722135031902-2.webp",
      "/dealer/stock/21751722135031902-3.webp",
      "/dealer/stock/21751722135031902-4.webp",
      "/dealer/stock/21751722135031902-5.webp",
      "/dealer/stock/21751722135031902-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21751722135031902-1.webp",
      "/dealer/stock/21751722135031902-2.webp",
      "/dealer/stock/21751722135031902-3.webp",
      "/dealer/stock/21751722135031902-4.webp",
      "/dealer/stock/21751722135031902-5.webp",
      "/dealer/stock/21751722135031902-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-21751722135031902-porsche-cayenne-turbo-4-0-v8-550-ks",
    "features": []
  },
  {
    "slug": "audi-a8-50-tdi-s-line-317225",
    "title": "Audi A8 50 TDI S line",
    "brand": "Audi",
    "model": "A8 50 TDI S line",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 37999,
    "monthly": 0,
    "year": 2019,
    "mileage": 235000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2967 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11695297184317225",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11695297184317225-1.webp",
    "images": [
      "/dealer/stock/11695297184317225-1.webp",
      "/dealer/stock/11695297184317225-2.webp",
      "/dealer/stock/11695297184317225-3.webp",
      "/dealer/stock/11695297184317225-4.webp",
      "/dealer/stock/11695297184317225-5.webp",
      "/dealer/stock/11695297184317225-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11695297184317225-1.webp",
      "/dealer/stock/11695297184317225-2.webp",
      "/dealer/stock/11695297184317225-3.webp",
      "/dealer/stock/11695297184317225-4.webp",
      "/dealer/stock/11695297184317225-5.webp",
      "/dealer/stock/11695297184317225-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11695297184317225-audi-a8-50-tdi-s-line-sportpacket-b-o-massage",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "Система за контрол на дистанцията",
      "Система за контрол на спускането",
      "4x4",
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Каско",
      "Централно заключване",
      "Кожен салон",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Адаптивно въздушно окачване",
      "Безключово палене",
      "Блокаж на диференциала",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. регулиране на седалките",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "bmw-x5-30d-xdrive-653350",
    "title": "BMW X5 30d xDrive",
    "brand": "BMW",
    "model": "X5 30d xDrive",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 32500,
    "monthly": 0,
    "year": 2019,
    "mileage": 192000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2993 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21725449678653350",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21725449678653350-1.webp",
    "images": [
      "/dealer/stock/21725449678653350-1.webp",
      "/dealer/stock/21725449678653350-2.webp",
      "/dealer/stock/21725449678653350-3.webp",
      "/dealer/stock/21725449678653350-4.webp",
      "/dealer/stock/21725449678653350-5.webp",
      "/dealer/stock/21725449678653350-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21725449678653350-1.webp",
      "/dealer/stock/21725449678653350-2.webp",
      "/dealer/stock/21725449678653350-3.webp",
      "/dealer/stock/21725449678653350-4.webp",
      "/dealer/stock/21725449678653350-5.webp",
      "/dealer/stock/21725449678653350-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-21725449678653350-bmw-x5-30d-xdrive",
    "features": [
      "GPS система за проследяване",
      "Адаптивни предни светлини",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Парктроник",
      "Система ISOFIX",
      "Система за динамична устойчивост",
      "Система за защита от пробуксуване",
      "Система за контрол на дистанцията",
      "Система за контрол на спускането",
      "4(5) Врати",
      "Лети джанти",
      "Металик",
      "Централно заключване",
      "Кожен салон",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Безключово палене",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. регулиране на седалките",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на предното стъкло",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "mercedes-benz-v-300-4matic-amg-line-long-768513",
    "title": "Mercedes-Benz V 300 4Matic AMG Line Long",
    "brand": "Mercedes-Benz",
    "model": "V 300 4Matic AMG Line Long",
    "bodyType": "Minivan",
    "condition": "Used",
    "price": 50999,
    "monthly": 0,
    "year": 2020,
    "mileage": 149000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "1950 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11711117396768513",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11711117396768513-1.webp",
    "images": [
      "/dealer/stock/11711117396768513-1.webp",
      "/dealer/stock/11711117396768513-2.webp",
      "/dealer/stock/11711117396768513-3.webp",
      "/dealer/stock/11711117396768513-4.webp",
      "/dealer/stock/11711117396768513-5.webp",
      "/dealer/stock/11711117396768513-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11711117396768513-1.webp",
      "/dealer/stock/11711117396768513-2.webp",
      "/dealer/stock/11711117396768513-3.webp",
      "/dealer/stock/11711117396768513-4.webp",
      "/dealer/stock/11711117396768513-5.webp",
      "/dealer/stock/11711117396768513-6.webp"
    ],
    "dealerSlug": "icars-plovdiv",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на icars, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://icars.mobile.bg/obiava-11711117396768513-mercedes-benz-v-300-4matic-amg-line-long",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "Система за динамична устойчивост",
      "Система за контрол на дистанцията",
      "Система за контрол на спускането",
      "4x4",
      "7 места",
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Панорамен люк",
      "Каско",
      "Централно заключване",
      "Кожен салон",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. регулиране на седалките",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Печка",
      "Подгряване на предното стъкло",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)"
    ]
  }
];

export const bodyTypes = Array.from(new Set(vehicles.map((vehicle) => vehicle.bodyType)));
export const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand))).sort();
export const fuels = Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel))).sort();

export function getVehicleBySlug(slug: string) {
	return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getRelatedVehicles(vehicle: Vehicle, limit = 4) {
	const closeMatches = vehicles.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			(candidate.brand === vehicle.brand || candidate.bodyType === vehicle.bodyType)
	);
	const fallback = vehicles.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			!closeMatches.some((match) => match.slug === candidate.slug)
	);

	return [...closeMatches, ...fallback].slice(0, limit);
}

export function filterVehicles(source: Vehicle[], filters: InventoryFilters) {
	const query = filters.query?.trim().toLowerCase() ?? '';

	return source.filter((vehicle) => {
		const matchesQuery =
			!query ||
			[vehicle.title, vehicle.brand, vehicle.model, vehicle.bodyType, vehicle.location]
				.join(' ')
				.toLowerCase()
				.includes(query);
		const matchesBrand =
			!filters.brand || filters.brand === 'All' || vehicle.brand === filters.brand;
		const matchesType =
			!filters.bodyType || filters.bodyType === 'All' || vehicle.bodyType === filters.bodyType;
		const matchesCondition =
			!filters.condition || filters.condition === 'All' || vehicle.condition === filters.condition;
		const matchesPrice = !filters.maxPrice || vehicle.price <= filters.maxPrice;
		const matchesYear = !filters.minYear || vehicle.year >= filters.minYear;
		const matchesFuel = !filters.fuel || filters.fuel === 'All' || vehicle.fuel === filters.fuel;

		return (
			matchesQuery &&
			matchesBrand &&
			matchesType &&
			matchesCondition &&
			matchesPrice &&
			matchesYear &&
			matchesFuel
		);
	});
}

export function sortVehicles(source: Vehicle[], sort: SortKey) {
	const sorted = [...source];

	if (sort === 'template') return sorted;
	if (sort === 'highest') return sorted.sort((a, b) => b.price - a.price);
	if (sort === 'newest') return sorted.sort((a, b) => b.year - a.year);
	if (sort === 'mileage') return sorted.sort((a, b) => a.mileage - b.mileage);

	return sorted.sort((a, b) => a.price - b.price);
}
