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
    "slug": "hyundai-ix35-368418",
    "title": "Hyundai IX35",
    "brand": "Hyundai",
    "model": "IX35",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 5800,
    "monthly": 0,
    "year": 2012,
    "mileage": 175679,
    "fuel": "Дизел",
    "transmission": "Manual",
    "engine": "1700 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21787584817368418",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21787584817368418-1.webp",
    "images": [
      "/dealer/stock/21787584817368418-1.webp",
      "/dealer/stock/21787584817368418-2.webp",
      "/dealer/stock/21787584817368418-3.webp",
      "/dealer/stock/21787584817368418-4.webp",
      "/dealer/stock/21787584817368418-5.webp",
      "/dealer/stock/21787584817368418-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21787584817368418-1.webp",
      "/dealer/stock/21787584817368418-2.webp",
      "/dealer/stock/21787584817368418-3.webp",
      "/dealer/stock/21787584817368418-4.webp",
      "/dealer/stock/21787584817368418-5.webp",
      "/dealer/stock/21787584817368418-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21787584817368418-hyundai-ix35-nov-vnos-ot-italiya",
    "features": [
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Система ISOFIX",
      "Лети джанти",
      "Централно заключване",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла"
    ]
  },
  {
    "slug": "toyota-rav4-hybrid-239119",
    "title": "Toyota RAV4 Hybrid",
    "brand": "Toyota",
    "model": "RAV4 Hybrid",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 14800,
    "monthly": 0,
    "year": 2017,
    "mileage": 175447,
    "fuel": "Хибрид",
    "transmission": "Automatic",
    "engine": "2500 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21778688064239119",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21778688064239119-1.webp",
    "images": [
      "/dealer/stock/21778688064239119-1.webp",
      "/dealer/stock/21778688064239119-2.webp",
      "/dealer/stock/21778688064239119-3.webp",
      "/dealer/stock/21778688064239119-4.webp",
      "/dealer/stock/21778688064239119-5.webp",
      "/dealer/stock/21778688064239119-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21778688064239119-1.webp",
      "/dealer/stock/21778688064239119-2.webp",
      "/dealer/stock/21778688064239119-3.webp",
      "/dealer/stock/21778688064239119-4.webp",
      "/dealer/stock/21778688064239119-5.webp",
      "/dealer/stock/21778688064239119-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21778688064239119-toyota-rav4-hibrid-nov-vnos-ot-italiya",
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
      "Система за защита от пробуксуване",
      "Система за контрол на спускането",
      "4(5) Врати",
      "Ксенонови фарове",
      "Лети джанти",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Автоматично затваряне на багажника",
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
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "opel-corsa-261347",
    "title": "Opel Corsa",
    "brand": "Opel",
    "model": "Corsa",
    "bodyType": "Coupe",
    "condition": "Used",
    "price": 5800,
    "monthly": 0,
    "year": 2018,
    "mileage": 46000,
    "fuel": "Бензин",
    "transmission": "Manual",
    "engine": "1300 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11781437915261347",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11781437915261347-1.webp",
    "images": [
      "/dealer/stock/11781437915261347-1.webp",
      "/dealer/stock/11781437915261347-2.webp",
      "/dealer/stock/11781437915261347-3.webp",
      "/dealer/stock/11781437915261347-4.webp",
      "/dealer/stock/11781437915261347-5.webp",
      "/dealer/stock/11781437915261347-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11781437915261347-1.webp",
      "/dealer/stock/11781437915261347-2.webp",
      "/dealer/stock/11781437915261347-3.webp",
      "/dealer/stock/11781437915261347-4.webp",
      "/dealer/stock/11781437915261347-5.webp",
      "/dealer/stock/11781437915261347-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-11781437915261347-opel-corsa-nov-vnos-ot-italiya",
    "features": [
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "2(3) Врати",
      "Халогенни фарове",
      "Централно заключване",
      "Bluetooth \\ handsfree система",
      "Бордкомпютър",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатик",
      "Мултифункционален волан"
    ]
  },
  {
    "slug": "mazda-cx-5-836463",
    "title": "Mazda CX-5",
    "brand": "Mazda",
    "model": "CX-5",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 6800,
    "monthly": 0,
    "year": 2013,
    "mileage": 173000,
    "fuel": "Дизел",
    "transmission": "Manual",
    "engine": "2200 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21784640560836463",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21784640560836463-1.webp",
    "images": [
      "/dealer/stock/21784640560836463-1.webp",
      "/dealer/stock/21784640560836463-2.webp",
      "/dealer/stock/21784640560836463-3.webp",
      "/dealer/stock/21784640560836463-4.webp",
      "/dealer/stock/21784640560836463-5.webp",
      "/dealer/stock/21784640560836463-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21784640560836463-1.webp",
      "/dealer/stock/21784640560836463-2.webp",
      "/dealer/stock/21784640560836463-3.webp",
      "/dealer/stock/21784640560836463-4.webp",
      "/dealer/stock/21784640560836463-5.webp",
      "/dealer/stock/21784640560836463-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21784640560836463-mazda-cx-5-nov-vnos-ot-italiya",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "Система за защита от пробуксуване",
      "Система за контрол на спускането",
      "4(5) Врати",
      "Ксенонови фарове",
      "Лети джанти",
      "Халогенни фарове",
      "Централно заключване",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатроник",
      "Мултифункционален волан",
      "Регулиране на волана",
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "jeep-cherokee-007255",
    "title": "Jeep Cherokee",
    "brand": "Jeep",
    "model": "Cherokee",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 10500,
    "monthly": 0,
    "year": 2016,
    "mileage": 146000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2200 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21776177602007255",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21776177602007255-1.webp",
    "images": [
      "/dealer/stock/21776177602007255-1.webp",
      "/dealer/stock/21776177602007255-2.webp",
      "/dealer/stock/21776177602007255-3.webp",
      "/dealer/stock/21776177602007255-4.webp",
      "/dealer/stock/21776177602007255-5.webp",
      "/dealer/stock/21776177602007255-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21776177602007255-1.webp",
      "/dealer/stock/21776177602007255-2.webp",
      "/dealer/stock/21776177602007255-3.webp",
      "/dealer/stock/21776177602007255-4.webp",
      "/dealer/stock/21776177602007255-5.webp",
      "/dealer/stock/21776177602007255-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21776177602007255-jeep-cherokee-nov-vnos-ot-italiya-4h4",
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
      "Система за защита от пробуксуване",
      "4x4",
      "4(5) Врати",
      "Ксенонови фарове",
      "Лети джанти",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "Кожен салон",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "honda-jazz-automatic-653263",
    "title": "Honda Jazz Automatic",
    "brand": "Honda",
    "model": "Jazz Automatic",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 16890,
    "monthly": 0,
    "year": 2020,
    "mileage": 24000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1500 см³",
    "exterior": "Металик",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11781213566653263",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11781213566653263-1.webp",
    "images": [
      "/dealer/stock/11781213566653263-1.webp",
      "/dealer/stock/11781213566653263-2.webp",
      "/dealer/stock/11781213566653263-3.webp",
      "/dealer/stock/11781213566653263-4.webp",
      "/dealer/stock/11781213566653263-5.webp",
      "/dealer/stock/11781213566653263-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11781213566653263-1.webp",
      "/dealer/stock/11781213566653263-2.webp",
      "/dealer/stock/11781213566653263-3.webp",
      "/dealer/stock/11781213566653263-4.webp",
      "/dealer/stock/11781213566653263-5.webp",
      "/dealer/stock/11781213566653263-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-11781213566653263-honda-jazz-avtomat-realni-kilometri",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Контрол на налягането на гумите",
      "Система ISOFIX",
      "Система за динамична устойчивост",
      "Система за защита от пробуксуване",
      "Сервизна книжка",
      "4(5) Врати",
      "Ксенонови фарове",
      "Лети джанти",
      "Халогенни фарове",
      "Аларма",
      "360 camera \\ Задна камера",
      "Bluetooth \\ handsfree система",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Система за измиване на фаровете"
    ]
  },
  {
    "slug": "honda-cr-v-hybrid-010518",
    "title": "Honda CR-V Hybrid",
    "brand": "Honda",
    "model": "CR-V Hybrid",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 24999,
    "monthly": 0,
    "year": 2023,
    "mileage": 79000,
    "fuel": "Хибрид",
    "transmission": "Automatic",
    "engine": "2000 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "JHMRT6840NX207938",
    "stockNumber": "21784225734010518",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21784225734010518-1.webp",
    "images": [
      "/dealer/stock/21784225734010518-1.webp",
      "/dealer/stock/21784225734010518-2.webp",
      "/dealer/stock/21784225734010518-3.webp",
      "/dealer/stock/21784225734010518-4.webp",
      "/dealer/stock/21784225734010518-5.webp",
      "/dealer/stock/21784225734010518-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21784225734010518-1.webp",
      "/dealer/stock/21784225734010518-2.webp",
      "/dealer/stock/21784225734010518-3.webp",
      "/dealer/stock/21784225734010518-4.webp",
      "/dealer/stock/21784225734010518-5.webp",
      "/dealer/stock/21784225734010518-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21784225734010518-honda-cr-v-realni-kilometri-sas-servizna-knizhka",
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
      "Система за защита от пробуксуване",
      "Система за контрол на дистанцията",
      "Система за контрол на спускането",
      "4x4",
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Ксенонови фарове",
      "Лети джанти",
      "Аларма",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
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
    "slug": "toyota-prius-100384",
    "title": "Toyota Prius",
    "brand": "Toyota",
    "model": "Prius",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 8200,
    "monthly": 0,
    "year": 2009,
    "mileage": 159000,
    "fuel": "Хибрид",
    "transmission": "Automatic",
    "engine": "1800 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11781101254100384",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11781101254100384-1.webp",
    "images": [
      "/dealer/stock/11781101254100384-1.webp",
      "/dealer/stock/11781101254100384-2.webp",
      "/dealer/stock/11781101254100384-3.webp",
      "/dealer/stock/11781101254100384-4.webp",
      "/dealer/stock/11781101254100384-5.webp",
      "/dealer/stock/11781101254100384-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11781101254100384-1.webp",
      "/dealer/stock/11781101254100384-2.webp",
      "/dealer/stock/11781101254100384-3.webp",
      "/dealer/stock/11781101254100384-4.webp",
      "/dealer/stock/11781101254100384-5.webp",
      "/dealer/stock/11781101254100384-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-11781101254100384-toyota-prius-nov-vnos-ot-italiya",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "Система за динамична устойчивост",
      "Система за защита от пробуксуване",
      "Система за контрол на дистанцията",
      "4(5) Врати",
      "Централно заключване",
      "Велурен салон",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)"
    ]
  },
  {
    "slug": "skoda-yeti-183753",
    "title": "Skoda Yeti",
    "brand": "Skoda",
    "model": "Yeti",
    "bodyType": "Миниван",
    "condition": "Used",
    "price": 6700,
    "monthly": 0,
    "year": 2015,
    "mileage": 143000,
    "fuel": "Дизел",
    "transmission": "Manual",
    "engine": "1600 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "21775747569183753",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21775747569183753-1.webp",
    "images": [
      "/dealer/stock/21775747569183753-1.webp",
      "/dealer/stock/21775747569183753-2.webp",
      "/dealer/stock/21775747569183753-3.webp",
      "/dealer/stock/21775747569183753-4.webp",
      "/dealer/stock/21775747569183753-5.webp",
      "/dealer/stock/21775747569183753-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21775747569183753-1.webp",
      "/dealer/stock/21775747569183753-2.webp",
      "/dealer/stock/21775747569183753-3.webp",
      "/dealer/stock/21775747569183753-4.webp",
      "/dealer/stock/21775747569183753-5.webp",
      "/dealer/stock/21775747569183753-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-21775747569183753-skoda-yeti-nov-vnos-ot-italiya",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "4(5) Врати",
      "Лети джанти",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатик"
    ]
  },
  {
    "slug": "skoda-octavia-815024",
    "title": "Skoda Octavia",
    "brand": "Skoda",
    "model": "Octavia",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 10100,
    "monthly": 0,
    "year": 2018,
    "mileage": 204000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "2000 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "кв. Въстанически — точният адрес се уточнява по телефона, Пловдив",
    "vin": "Не е публикуван",
    "stockNumber": "11775730754815024",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11775730754815024-1.webp",
    "images": [
      "/dealer/stock/11775730754815024-1.webp",
      "/dealer/stock/11775730754815024-2.webp",
      "/dealer/stock/11775730754815024-3.webp",
      "/dealer/stock/11775730754815024-4.webp",
      "/dealer/stock/11775730754815024-5.webp",
      "/dealer/stock/11775730754815024-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11775730754815024-1.webp",
      "/dealer/stock/11775730754815024-2.webp",
      "/dealer/stock/11775730754815024-3.webp",
      "/dealer/stock/11775730754815024-4.webp",
      "/dealer/stock/11775730754815024-5.webp",
      "/dealer/stock/11775730754815024-6.webp"
    ],
    "dealerSlug": "voivodov-auto-antonio",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на VOIVODOV AUTO & ANTONIO, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://voivodovauto.mobile.bg/obiava-11775730754815024-skoda-octavia-nov-vnos-ot-italiya",
    "features": [
      "Адаптивни предни светлини",
      "Антиблокираща система",
      "Въздушни възглавници - Задни",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Контрол на налягането на гумите",
      "Парктроник",
      "Система ISOFIX",
      "Система за защита от пробуксуване",
      "4(5) Врати",
      "Лети джанти",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Регулиране на волана",
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
