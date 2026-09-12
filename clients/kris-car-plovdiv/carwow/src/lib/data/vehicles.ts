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
	monthly: number | null;
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
	rating: number | null;
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

const detailGallery = [];

export const vehicles: Vehicle[] = [
  {
    "slug": "toyota-camry-2-5-hybrid-comfort-361582",
    "title": "Toyota Camry 2.5 Hybrid Comfort",
    "brand": "Toyota",
    "model": "Camry",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 29460,
    "monthly": null,
    "year": 2022,
    "mileage": 87358,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "engine": "2500 см³",
    "exterior": "Бял",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11788863173361582",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11788863173361582-1.webp",
    "images": [
      "/dealer/stock/11788863173361582-1.webp",
      "/dealer/stock/11788863173361582-2.webp",
      "/dealer/stock/11788863173361582-3.webp",
      "/dealer/stock/11788863173361582-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11788863173361582-1.webp",
      "/dealer/stock/11788863173361582-2.webp",
      "/dealer/stock/11788863173361582-3.webp",
      "/dealer/stock/11788863173361582-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Безключово палене",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "seat-ateca-4x4-2-0-tdi-448667",
    "title": "SEAT Ateca 4x4 2.0 TDI",
    "brand": "Seat",
    "model": "Ateca",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 21960,
    "monthly": null,
    "year": 2020,
    "mileage": 77257,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "engine": "2000 см³",
    "exterior": "Сив",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "21788856265448667",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/21788856265448667-1.webp",
    "images": [
      "/dealer/stock/21788856265448667-1.webp",
      "/dealer/stock/21788856265448667-2.webp",
      "/dealer/stock/21788856265448667-3.webp",
      "/dealer/stock/21788856265448667-4.webp"
    ],
    "gallery": [
      "/dealer/stock/21788856265448667-1.webp",
      "/dealer/stock/21788856265448667-2.webp",
      "/dealer/stock/21788856265448667-3.webp",
      "/dealer/stock/21788856265448667-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Рейлинг на покрива",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Кожен салон",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Автоматично затваряне на багажника",
      "Безключово палене",
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
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "volkswagen-tiguan-elegance-4x4-250424",
    "title": "Volkswagen Tiguan Elegance 4x4",
    "brand": "Volkswagen",
    "model": "Tiguan",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 32560,
    "monthly": null,
    "year": 2021,
    "mileage": 128422,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "engine": "2000 см³",
    "exterior": "Сив",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "21781080017250424",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/21781080017250424-1.webp",
    "images": [
      "/dealer/stock/21781080017250424-1.webp",
      "/dealer/stock/21781080017250424-2.webp",
      "/dealer/stock/21781080017250424-3.webp",
      "/dealer/stock/21781080017250424-4.webp"
    ],
    "gallery": [
      "/dealer/stock/21781080017250424-1.webp",
      "/dealer/stock/21781080017250424-2.webp",
      "/dealer/stock/21781080017250424-3.webp",
      "/dealer/stock/21781080017250424-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Рейлинг на покрива",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Велурен салон",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Автоматично затваряне на багажника",
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
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "volkswagen-golf-1-5-etsi-207389",
    "title": "Volkswagen Golf 1.5 eTSI",
    "brand": "Volkswagen",
    "model": "Golf",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 21860,
    "monthly": null,
    "year": 2022,
    "mileage": 83965,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "engine": "1500 см³",
    "exterior": "Сив",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11780494813207389",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11780494813207389-1.webp",
    "images": [
      "/dealer/stock/11780494813207389-1.webp",
      "/dealer/stock/11780494813207389-2.webp",
      "/dealer/stock/11780494813207389-3.webp",
      "/dealer/stock/11780494813207389-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11780494813207389-1.webp",
      "/dealer/stock/11780494813207389-2.webp",
      "/dealer/stock/11780494813207389-3.webp",
      "/dealer/stock/11780494813207389-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Безключово палене",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "volkswagen-arteon-2-0-tdi-592650",
    "title": "Volkswagen Arteon 2.0 TDI",
    "brand": "Volkswagen",
    "model": "Arteon",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 25460,
    "monthly": null,
    "year": 2020,
    "mileage": 94910,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "engine": "2000 см³",
    "exterior": "Перла",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11788352260592650",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11788352260592650-1.webp",
    "images": [
      "/dealer/stock/11788352260592650-1.webp",
      "/dealer/stock/11788352260592650-2.webp",
      "/dealer/stock/11788352260592650-3.webp",
      "/dealer/stock/11788352260592650-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11788352260592650-1.webp",
      "/dealer/stock/11788352260592650-2.webp",
      "/dealer/stock/11788352260592650-3.webp",
      "/dealer/stock/11788352260592650-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Кожен салон",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Автоматично затваряне на багажника",
      "Безключово палене",
      "Бордкомпютър",
      "Вентилация на седалките",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. регулиране на седалките",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Отопление на волана",
      "Подгряване на предното стъкло",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за измиване на фаровете",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "toyota-yaris-1-5-hybrid-930244",
    "title": "Toyota Yaris 1.5 Hybrid",
    "brand": "Toyota",
    "model": "Yaris",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 17560,
    "monthly": null,
    "year": 2021,
    "mileage": 79828,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "engine": "1500 см³",
    "exterior": "Бял",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11760713901930244",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11760713901930244-1.webp",
    "images": [
      "/dealer/stock/11760713901930244-1.webp",
      "/dealer/stock/11760713901930244-2.webp",
      "/dealer/stock/11760713901930244-3.webp",
      "/dealer/stock/11760713901930244-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11760713901930244-1.webp",
      "/dealer/stock/11760713901930244-2.webp",
      "/dealer/stock/11760713901930244-3.webp",
      "/dealer/stock/11760713901930244-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "toyota-corolla-1-6-executive-736167",
    "title": "Toyota Corolla 1.6 Executive",
    "brand": "Toyota",
    "model": "Corolla",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 19760,
    "monthly": null,
    "year": 2020,
    "mileage": 86291,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "engine": "1600 см³",
    "exterior": "Сив",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11762013228736167",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11762013228736167-1.webp",
    "images": [
      "/dealer/stock/11762013228736167-1.webp",
      "/dealer/stock/11762013228736167-2.webp",
      "/dealer/stock/11762013228736167-3.webp",
      "/dealer/stock/11762013228736167-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11762013228736167-1.webp",
      "/dealer/stock/11762013228736167-2.webp",
      "/dealer/stock/11762013228736167-3.webp",
      "/dealer/stock/11762013228736167-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "skoda-superb-2-0-tdi-224639",
    "title": "Škoda Superb 2.0 TDI",
    "brand": "Skoda",
    "model": "Superb",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 26860,
    "monthly": null,
    "year": 2021,
    "mileage": 117501,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "engine": "2000 см³",
    "exterior": "Сив",
    "interior": "—",
    "location": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "vin": "—",
    "stockNumber": "11744304007224639",
    "tag": "Обява • потвърдете наличност",
    "tagTone": "dark",
    "image": "/dealer/stock/11744304007224639-1.webp",
    "images": [
      "/dealer/stock/11744304007224639-1.webp",
      "/dealer/stock/11744304007224639-2.webp",
      "/dealer/stock/11744304007224639-3.webp",
      "/dealer/stock/11744304007224639-4.webp"
    ],
    "gallery": [
      "/dealer/stock/11744304007224639-1.webp",
      "/dealer/stock/11744304007224639-2.webp",
      "/dealer/stock/11744304007224639-3.webp",
      "/dealer/stock/11744304007224639-4.webp"
    ],
    "dealerSlug": "kris-car-plovdiv",
    "agentSlug": "kris-car-contact",
    "rating": null,
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС",
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
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Безключово палене",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
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
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
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
