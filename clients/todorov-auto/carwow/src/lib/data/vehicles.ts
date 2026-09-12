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
    "slug": "renault-captur-1-3-tce-intens-307272",
    "title": "Renault Captur 1.3 TCe Intens",
    "brand": "Renault",
    "model": "Captur 1.3 TCe Intens",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 16450,
    "monthly": 0,
    "year": 2021,
    "mileage": 46000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1332 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "VF1RJB00866801585",
    "stockNumber": "11763371717307272",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11763371717307272-1.webp",
    "images": [
      "/dealer/stock/11763371717307272-1.webp",
      "/dealer/stock/11763371717307272-2.webp",
      "/dealer/stock/11763371717307272-3.webp",
      "/dealer/stock/11763371717307272-4.webp",
      "/dealer/stock/11763371717307272-5.webp",
      "/dealer/stock/11763371717307272-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11763371717307272-1.webp",
      "/dealer/stock/11763371717307272-2.webp",
      "/dealer/stock/11763371717307272-3.webp",
      "/dealer/stock/11763371717307272-4.webp",
      "/dealer/stock/11763371717307272-5.webp",
      "/dealer/stock/11763371717307272-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11763371717307272-renault-captur-1-3tce-intens-140ks",
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
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
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "nissan-micra-ig-t-acenta-xtronic-161812",
    "title": "Nissan Micra IG-T Acenta Xtronic",
    "brand": "Nissan",
    "model": "Micra IG-T Acenta Xtronic",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 11950,
    "monthly": 0,
    "year": 2021,
    "mileage": 14144,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "999 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "VNVK1400868551990",
    "stockNumber": "11704208021161812",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11704208021161812-1.webp",
    "images": [
      "/dealer/stock/11704208021161812-1.webp",
      "/dealer/stock/11704208021161812-2.webp",
      "/dealer/stock/11704208021161812-3.webp",
      "/dealer/stock/11704208021161812-4.webp",
      "/dealer/stock/11704208021161812-5.webp",
      "/dealer/stock/11704208021161812-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11704208021161812-1.webp",
      "/dealer/stock/11704208021161812-2.webp",
      "/dealer/stock/11704208021161812-3.webp",
      "/dealer/stock/11704208021161812-4.webp",
      "/dealer/stock/11704208021161812-5.webp",
      "/dealer/stock/11704208021161812-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11704208021161812-nissan-micra-ig-tacenta-xtronic92k",
    "features": [
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Металик",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
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
    "slug": "nissan-leaf-2-zeroemission-980884",
    "title": "Nissan Leaf 2 ZeroEmission",
    "brand": "Nissan",
    "model": "Leaf 2 ZeroEmission",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 11250,
    "monthly": 0,
    "year": 2018,
    "mileage": 102600,
    "fuel": "Електрически",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Резидав",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "SJNFAAZE1U0018220",
    "stockNumber": "11735041255980884",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11735041255980884-1.webp",
    "images": [
      "/dealer/stock/11735041255980884-1.webp",
      "/dealer/stock/11735041255980884-2.webp",
      "/dealer/stock/11735041255980884-3.webp",
      "/dealer/stock/11735041255980884-4.webp",
      "/dealer/stock/11735041255980884-5.webp",
      "/dealer/stock/11735041255980884-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11735041255980884-1.webp",
      "/dealer/stock/11735041255980884-2.webp",
      "/dealer/stock/11735041255980884-3.webp",
      "/dealer/stock/11735041255980884-4.webp",
      "/dealer/stock/11735041255980884-5.webp",
      "/dealer/stock/11735041255980884-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11735041255980884-nissan-leaf-2-zeroemission-150ks",
    "features": [
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
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
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "toyota-yaris-1-5-hybrid-259646",
    "title": "Toyota Yaris 1.5 Hybrid",
    "brand": "Toyota",
    "model": "Yaris 1.5 Hybrid",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 8690,
    "monthly": 0,
    "year": 2017,
    "mileage": 139590,
    "fuel": "Хибрид",
    "transmission": "Automatic",
    "engine": "1497 см³",
    "exterior": "Червен",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "VNKKD3D380A313432",
    "stockNumber": "11757098776259646",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11757098776259646-1.webp",
    "images": [
      "/dealer/stock/11757098776259646-1.webp",
      "/dealer/stock/11757098776259646-2.webp",
      "/dealer/stock/11757098776259646-3.webp",
      "/dealer/stock/11757098776259646-4.webp",
      "/dealer/stock/11757098776259646-5.webp",
      "/dealer/stock/11757098776259646-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11757098776259646-1.webp",
      "/dealer/stock/11757098776259646-2.webp",
      "/dealer/stock/11757098776259646-3.webp",
      "/dealer/stock/11757098776259646-4.webp",
      "/dealer/stock/11757098776259646-5.webp",
      "/dealer/stock/11757098776259646-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11757098776259646-toyota-yaris-1-5i-hybrid",
    "features": [
      "Антиблокираща система",
      "Въздушни възглавници - Предни",
      "Въздушни възглавници - Странични",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Контрол на налягането на гумите",
      "Система ISOFIX",
      "Система за защита от пробуксуване",
      "Сервизна книжка",
      "4(5) Врати",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Климатроник",
      "Мултифункционален волан",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Хомологация N1"
    ]
  },
  {
    "slug": "renault-megane-1-5-dci-zen-114307",
    "title": "Renault Megane 1.5 dCi Zen",
    "brand": "Renault",
    "model": "Megane 1.5 dCi Zen",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 9800,
    "monthly": 0,
    "year": 2016,
    "mileage": 129000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "1461 см³",
    "exterior": "Черен",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "VF1RFB00955219825",
    "stockNumber": "11649235957114307",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11649235957114307-1.webp",
    "images": [
      "/dealer/stock/11649235957114307-1.webp",
      "/dealer/stock/11649235957114307-2.webp",
      "/dealer/stock/11649235957114307-3.webp",
      "/dealer/stock/11649235957114307-4.webp",
      "/dealer/stock/11649235957114307-5.webp",
      "/dealer/stock/11649235957114307-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11649235957114307-1.webp",
      "/dealer/stock/11649235957114307-2.webp",
      "/dealer/stock/11649235957114307-3.webp",
      "/dealer/stock/11649235957114307-4.webp",
      "/dealer/stock/11649235957114307-5.webp",
      "/dealer/stock/11649235957114307-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11649235957114307-renault-megane-1-5-dci-zen-110-k-s",
    "features": [
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Металик",
      "Халогенни фарове",
      "Аларма",
      "Каско",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Безключово палене",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
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
    "slug": "peugeot-2008-allure-premium-170761",
    "title": "Peugeot 2008 Allure Premium",
    "brand": "Peugeot",
    "model": "2008 Allure Premium",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 24900,
    "monthly": 0,
    "year": 2025,
    "mileage": 4000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1199 см³",
    "exterior": "Тъмно сив",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "VR3USHNS9SJ625173",
    "stockNumber": "11784299299170761",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11784299299170761-1.webp",
    "images": [
      "/dealer/stock/11784299299170761-1.webp",
      "/dealer/stock/11784299299170761-2.webp",
      "/dealer/stock/11784299299170761-3.webp",
      "/dealer/stock/11784299299170761-4.webp",
      "/dealer/stock/11784299299170761-5.webp",
      "/dealer/stock/11784299299170761-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11784299299170761-1.webp",
      "/dealer/stock/11784299299170761-2.webp",
      "/dealer/stock/11784299299170761-3.webp",
      "/dealer/stock/11784299299170761-4.webp",
      "/dealer/stock/11784299299170761-5.webp",
      "/dealer/stock/11784299299170761-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11784299299170761-peugeot-2008-1-2pt-allure-premium",
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Металик",
      "Рейлинг на покрива",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
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
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "opel-crossland-x-1-2-tp-ultim-656784",
    "title": "Opel Crossland X 1.2 TP Ultim",
    "brand": "Opel",
    "model": "Crossland X 1.2 TP Ultim",
    "bodyType": "Hatchback",
    "condition": "Used",
    "price": 10450,
    "monthly": 0,
    "year": 2018,
    "mileage": 115403,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1199 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "W0V7H9EDXJ4378298",
    "stockNumber": "21782384979656784",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21782384979656784-1.webp",
    "images": [
      "/dealer/stock/21782384979656784-1.webp",
      "/dealer/stock/21782384979656784-2.webp",
      "/dealer/stock/21782384979656784-3.webp",
      "/dealer/stock/21782384979656784-4.webp",
      "/dealer/stock/21782384979656784-5.webp",
      "/dealer/stock/21782384979656784-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21782384979656784-1.webp",
      "/dealer/stock/21782384979656784-2.webp",
      "/dealer/stock/21782384979656784-3.webp",
      "/dealer/stock/21782384979656784-4.webp",
      "/dealer/stock/21782384979656784-5.webp",
      "/dealer/stock/21782384979656784-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-21782384979656784-opel-crossland-x-1-2i-tp-ultim-110-k-s",
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
      "Система за защита от пробуксуване",
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Лети джанти",
      "Рейлинг на покрива",
      "Халогенни фарове",
      "Аларма",
      "Централно заключване",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Безключово палене",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
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
    "slug": "opel-astra-1-6-cdti-651766",
    "title": "Opel Astra 1.6 CDTi",
    "brand": "Opel",
    "model": "Astra 1.6 CDTi",
    "bodyType": "Wagon",
    "condition": "Used",
    "price": 7400,
    "monthly": 0,
    "year": 2017,
    "mileage": 166000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "1598 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "W0LBD8EG8H8047855",
    "stockNumber": "11701427910651766",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11701427910651766-1.webp",
    "images": [
      "/dealer/stock/11701427910651766-1.webp",
      "/dealer/stock/11701427910651766-2.webp",
      "/dealer/stock/11701427910651766-3.webp",
      "/dealer/stock/11701427910651766-4.webp",
      "/dealer/stock/11701427910651766-5.webp",
      "/dealer/stock/11701427910651766-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11701427910651766-1.webp",
      "/dealer/stock/11701427910651766-2.webp",
      "/dealer/stock/11701427910651766-3.webp",
      "/dealer/stock/11701427910651766-4.webp",
      "/dealer/stock/11701427910651766-5.webp",
      "/dealer/stock/11701427910651766-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11701427910651766-opel-astra-1-6cdtiecofenjoy136ks",
    "features": [
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
      "Сервизна книжка",
      "4(5) Врати",
      "LED фарове",
      "Металик",
      "Рейлинг на покрива",
      "Аларма",
      "Централно заключване",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Датчик за светлина",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Ел. усилвател на волана",
      "Климатроник",
      "Мултифункционален волан",
      "Навигация",
      "Отопление на волана",
      "Подгряване на седалките",
      "Регулиране на волана",
      "Сензор за дъжд",
      "Серво усилвател на волана",
      "Система за контрол на скоростта (автопилот)",
      "Хладилна жабка"
    ]
  },
  {
    "slug": "mercedes-benz-glc-43-amg-4matic-986144",
    "title": "Mercedes-Benz GLC 43 AMG 4Matic",
    "brand": "Mercedes-Benz",
    "model": "GLC 43 AMG 4Matic",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 35750,
    "monthly": 0,
    "year": 2020,
    "mileage": 142065,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "2996 см³",
    "exterior": "Тъмно сив",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "W1N2539641F818182",
    "stockNumber": "21784126666986144",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21784126666986144-1.webp",
    "images": [
      "/dealer/stock/21784126666986144-1.webp",
      "/dealer/stock/21784126666986144-2.webp",
      "/dealer/stock/21784126666986144-3.webp",
      "/dealer/stock/21784126666986144-4.webp",
      "/dealer/stock/21784126666986144-5.webp",
      "/dealer/stock/21784126666986144-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21784126666986144-1.webp",
      "/dealer/stock/21784126666986144-2.webp",
      "/dealer/stock/21784126666986144-3.webp",
      "/dealer/stock/21784126666986144-4.webp",
      "/dealer/stock/21784126666986144-5.webp",
      "/dealer/stock/21784126666986144-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-21784126666986144-mercedes-benz-glc-43-amg-4matic-390-k-s",
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
      "Лети джанти",
      "Металик",
      "Панорамен люк",
      "Рейлинг на покрива",
      "Спойлери",
      "Теглич",
      "Халогенни фарове",
      "Шибедах",
      "Аларма",
      "Централно заключване",
      "Кожен салон",
      "360 camera \\ Задна камера",
      "Apple CarPlay \\ Android Auto",
      "Auto Start Stop function",
      "Bluetooth \\ handsfree система",
      "DVD, TV",
      "Head up display",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Автоматично затваряне на багажника",
      "Адаптивно въздушно окачване",
      "Безключово палене",
      "Блокаж на диференциала",
      "Бордкомпютър",
      "Вентилация на седалките",
      "Датчик за светлина",
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
    "slug": "vw-caddy-1-4-tsi-dsg-281815",
    "title": "VW Caddy 1.4 TSI DSG",
    "brand": "VW",
    "model": "Caddy 1.4 TSI DSG",
    "bodyType": "Minivan",
    "condition": "Used",
    "price": 9450,
    "monthly": 0,
    "year": 2017,
    "mileage": 192781,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "1395 см³",
    "exterior": "Бял",
    "interior": "Не е посочен",
    "location": "Изгрев, ул. Транспортна, 5-ти километър, Бургас",
    "vin": "WV1ZZZ2KZHX076464",
    "stockNumber": "11776511305281815",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11776511305281815-1.webp",
    "images": [
      "/dealer/stock/11776511305281815-1.webp",
      "/dealer/stock/11776511305281815-2.webp",
      "/dealer/stock/11776511305281815-3.webp",
      "/dealer/stock/11776511305281815-4.webp",
      "/dealer/stock/11776511305281815-5.webp",
      "/dealer/stock/11776511305281815-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11776511305281815-1.webp",
      "/dealer/stock/11776511305281815-2.webp",
      "/dealer/stock/11776511305281815-3.webp",
      "/dealer/stock/11776511305281815-4.webp",
      "/dealer/stock/11776511305281815-5.webp",
      "/dealer/stock/11776511305281815-6.webp"
    ],
    "dealerSlug": "todorov-auto",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на Автосалон Тодоров, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://todorovauto.mobile.bg/obiava-11776511305281815-vw-caddy-1-4tsi-bluemotion-technology-dsg",
    "features": [
      "Антиблокираща система",
      "Въздушни възглавници - Предни",
      "Ел. разпределяне на спирачното усилие",
      "Електронна програма за стабилизиране",
      "Контрол на налягането на гумите",
      "Система за динамична устойчивост",
      "Система за защита от пробуксуване",
      "Сервизна книжка",
      "4(5) Врати",
      "Централно заключване",
      "Auto Start Stop function",
      "Steptronic, Tiptronic",
      "USB, audio\\video, IN\\AUX изводи",
      "Бордкомпютър",
      "Ел. Огледала",
      "Ел. Стъкла",
      "Регулиране на волана",
      "Серво усилвател на волана",
      "Система за контрол на скоростта (автопилот)",
      "Хомологация N1"
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
