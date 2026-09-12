import type { Vehicle } from '$lib/types/vehicle';
import type { Locale } from '$lib/i18n/messages';

type HomeTwoDealRoute =
	| {
			kind: 'vehicle';
			slug: string;
	  }
	| {
			kind: 'service';
	  };

export type HomeTwoDealCard = HomeTwoDealRoute & {
	badge: string;
	description: string;
	flip?: boolean;
	image: string;
	imageMax: string;
	meta: string;
	monthly: string;
	price: string;
	priceLabel: string;
	saving: string;
	stock: string;
	title: string;
};

export type HomeTwoBudgetTile = {
	count: string;
	href: `/inventory${string}`;
	image: string;
	label: string;
	meta: string;
	tone: 'entry' | 'mid' | 'premium' | 'luxury' | 'suv' | 'open';
};

export type HomeTwoReview = {
	author: string;
	body: string;
	title: string;
};

const homeTwoBrandLogoOverrides: Record<string, string> = {
	Audi: '/assets/daynight/brands/audi.webp',
	BMW: '/assets/daynight/brands/bmw.webp',
	Ford: '/assets/daynight/brands/ford.webp',
	Kia: '/assets/daynight/brands/kia-transparent.webp',
	Mazda: '/assets/daynight/brands/mazda.webp',
	Mercedes: '/assets/daynight/brands/mercedes-benz.webp',
	'Mercedes-Benz': '/assets/daynight/brands/mercedes-benz.webp',
	Porsche: '/assets/daynight/brands/porsche.webp',
	Toyota: '/assets/daynight/brands/toyota.webp',
	Volkswagen: '/assets/daynight/brands/volkswagen.webp'
};

export const homeTwoBrandLogoForName = (name: string, fallbackImage: string) =>
	homeTwoBrandLogoOverrides[name] ?? fallbackImage;

export const homeTwoReviews: HomeTwoReview[] = [
	{
		author: 'Александър, клиент на OUTLETCARS.BG — Варна',
		body: 'Преди огледа получих история, разходи и следващи стъпки. Нямаше дребен шрифт, само конкретна информация.',
		title: 'Пълна картина преди сделка'
	},
	{
		author: 'Красимир, подбор на автомобили',
		body: 'Показаха ми снимки, документи, пробег и крайни разходи преди да взема решение. Това ми спести много чудене.',
		title: 'Внос без изненади'
	},
	{
		author: 'Илиян, продажба на автомобил',
		body: 'Изпратих данните за автомобила и получих честна обратна връзка за цена, документи и как да го представим.',
		title: 'Честна обратна връзка'
	},
	{
		author: 'Мария, оглед във Варна',
		body: 'Колата беше подготвена, проверката беше ясна, а финансирането беше обяснено спокойно, без натиск.',
		title: 'Оглед без натиск'
	}
];

const countLabel = (locale: Locale, count: number) =>
	locale === 'bg' ? `${count} автомобила` : `${count} cars`;

const budgetTile = (
	locale: Locale,
	vehicles: Vehicle[],
	tile: Omit<HomeTwoBudgetTile, 'count'> & { matches: (vehicle: Vehicle) => boolean }
): HomeTwoBudgetTile => {
	const count = vehicles.filter(tile.matches).length;

	return {
		count: countLabel(locale, count),
		href: tile.href,
		image: tile.image,
		label: tile.label,
		meta: tile.meta,
		tone: tile.tone
	};
};

export const homeTwoBudgetTilesFromVehicles = (
	vehicles: Vehicle[],
	locale: Locale
): HomeTwoBudgetTile[] => [
	budgetTile(locale, vehicles, {
		href: '/inventory?maxPrice=30000',
		image: '/assets/daynight/home2/home2-budget-entry.webp',
		label: locale === 'bg' ? 'до 30 000 EUR' : 'Under EUR 30k',
		matches: (vehicle) => vehicle.price <= 30000,
		meta: locale === 'bg' ? 'Практичен старт' : 'Practical start',
		tone: 'entry'
	}),
	budgetTile(locale, vehicles, {
		href: '/inventory?minPrice=30000&maxPrice=50000',
		image: '/assets/daynight/home2/home2-budget-mid.webp',
		label: locale === 'bg' ? '30 000 - 50 000 EUR' : 'EUR 30k - 50k',
		matches: (vehicle) => vehicle.price >= 30000 && vehicle.price <= 50000,
		meta: locale === 'bg' ? 'Семейни SUV и седани' : 'Family SUVs and sedans',
		tone: 'mid'
	}),
	budgetTile(locale, vehicles, {
		href: '/inventory?minPrice=50000&maxPrice=80000',
		image: '/assets/daynight/home2/home2-budget-premium.webp',
		label: locale === 'bg' ? '50 000 - 80 000 EUR' : 'EUR 50k - 80k',
		matches: (vehicle) => vehicle.price >= 50000 && vehicle.price <= 80000,
		meta: locale === 'bg' ? 'Премиум избор' : 'Premium choice',
		tone: 'premium'
	}),
	budgetTile(locale, vehicles, {
		href: '/inventory?minPrice=80000',
		image: '/assets/daynight/home2/home2-budget-luxury.webp',
		label: locale === 'bg' ? '80 000+ EUR' : 'EUR 80k+',
		matches: (vehicle) => vehicle.price >= 80000,
		meta: locale === 'bg' ? 'Луксозни модели' : 'Luxury models',
		tone: 'luxury'
	}),
	budgetTile(locale, vehicles, {
		href: '/inventory?bodyType=SUV',
		image: '/assets/daynight/home2/home2-action-buy.webp',
		label: locale === 'bg' ? 'SUV избор' : 'SUV picks',
		matches: (vehicle) => /suv/i.test(vehicle.bodyType),
		meta: locale === 'bg' ? 'Висока позиция' : 'High driving position',
		tone: 'suv'
	}),
	{
		count: countLabel(locale, vehicles.length),
		href: '/inventory',
		image: '/assets/daynight/home2/home2-action-import.webp',
		label: locale === 'bg' ? 'Отворен бюджет' : 'Open budget',
		meta: locale === 'bg' ? 'Всички налични' : 'All available',
		tone: 'open'
	}
];

export const homeTwoDealCards: HomeTwoDealCard[] = [
	{
		badge: 'Наличен',
		description: 'Премиум SUV, наличен за оглед',
		image: '/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2019 · Бензин · Автоматик',
		monthly: 'от 690 €/месец',
		price: '36 500 EUR',
		priceLabel: 'Цена от',
		saving: 'Попитайте за историята',
		slug: '21764342419542174',
		stock: 'Варна · Наличен',
		title: 'BMW X5 M Sport'
	},
	{
		badge: 'Премиум',
		description: 'M Competition, наличен в България',
		image: '/assets/daynight/megamenu/inventory-bmw-x4m-cutout-v2.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2020 · Бензин · Автоматик',
		monthly: 'от 830 €/месец',
		price: '43 500 EUR',
		priceLabel: 'Цена от',
		saving: 'Готов за регистрация',
		slug: '21778068579001193',
		stock: 'OUTLETCARS.BG — Варна · Проверен',
		title: 'BMW X4 M Competition'
	},
	{
		badge: 'Нов внос',
		description: 'Technik Black Optic от Европа',
		image: '/assets/daynight/megamenu/inventory-audi-a7-cutout.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2021 · Хибрид · Автоматик',
		monthly: 'от 720 €/месец',
		price: '35 000 EUR',
		priceLabel: 'Цена от',
		saving: 'Финансиране',
		slug: '11774283016080050',
		stock: 'Нов внос · Оглед',
		title: 'Audi A7 55TFSI'
	},
	{
		badge: 'Европа',
		description: 'Подбор, проверка и доставка',
		flip: true,
		image: '/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp',
		imageMax: '124%',
		kind: 'service',
		meta: 'Подбор · Проверка · Доставка',
		monthly: 'оферта по заявка',
		price: 'по заявка',
		priceLabel: 'Оферта',
		saving: 'Подбрани автомобили',
		stock: 'Европа · По заявка',
		title: 'SUV по поръчка'
	}
];
