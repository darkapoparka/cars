import type { HomeDesktopVehicle } from '$lib/types/home';
import { normalize } from '$lib/utils/daynight-quick-filter-dom';

export const DESKTOP_HOME_INVENTORY_LIMIT = 8;

export type DesktopHomeQuickFieldName = 'brand' | 'model' | 'mileage' | 'price';

export type DesktopHomeQuickField = {
	name: DesktopHomeQuickFieldName;
	label: string;
	placeholder: string;
	options: Array<{ value: string; label: string }>;
};

export type DesktopHomeHeroVehicleFilter = {
	brand: string;
	model: string;
	price: number;
	mileage: number;
	condition: 'new' | 'used';
	haystack: string;
};

export type DesktopHomeInventoryPillIcon =
	| 'all'
	| 'electric'
	| 'sedan'
	| 'suv'
	| 'wagon'
	| 'hatchback'
	| 'coupe'
	| 'budget';

export type DesktopHomeInventoryPillHref = '/inventory' | `/inventory?${string}`;

export type DesktopHomeInventoryPill = {
	label: string;
	href: DesktopHomeInventoryPillHref;
	icon: DesktopHomeInventoryPillIcon;
	isActive?: boolean;
};

export const desktopHomeInventoryPills: readonly DesktopHomeInventoryPill[] = [
	{
		label: 'Всички',
		href: '/inventory',
		icon: 'all',
		isActive: true
	},
	{
		label: 'Електрически',
		href: '/inventory?fuel=%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8',
		icon: 'electric'
	},
	{
		label: 'Седан',
		href: '/inventory?body=%D0%A1%D0%B5%D0%B4%D0%B0%D0%BD',
		icon: 'sedan'
	},
	{
		label: 'Джип',
		href: '/inventory?body=SUV',
		icon: 'suv'
	},
	{
		label: 'Комби',
		href: '/inventory?body=%D0%9A%D0%BE%D0%BC%D0%B1%D0%B8',
		icon: 'wagon'
	},
	{
		label: 'Хечбек',
		href: '/inventory?body=%D0%A5%D0%B5%D1%87%D0%B1%D0%B5%D0%BA',
		icon: 'hatchback'
	},
	{
		label: 'Купе',
		href: '/inventory?body=%D0%9A%D1%83%D0%BF%D0%B5',
		icon: 'coupe'
	},
	{
		label: 'До 10 000 EUR',
		href: '/inventory?price=under-10000',
		icon: 'budget'
	},
	{
		label: 'До 20 000 EUR',
		href: '/inventory?price=under-20000',
		icon: 'budget'
	}
];

const mileageOptions = [
	{ value: '', label: 'Всички пробези' },
	{ value: 'under-100000', label: 'До 100 000 км' },
	{ value: 'under-150000', label: 'До 150 000 км' },
	{ value: 'under-200000', label: 'До 200 000 км' },
	{ value: 'over-200000', label: 'Над 200 000 км' }
];

const priceOptions = [
	{ value: '', label: 'Всички цени' },
	{ value: 'under-10000', label: 'До 10 000 EUR' },
	{ value: 'under-20000', label: 'До 20 000 EUR' },
	{ value: 'under-30000', label: 'До 30 000 EUR' },
	{ value: 'under-50000', label: 'До 50 000 EUR' },
	{ value: 'over-50000', label: 'Над 50 000 EUR' }
];

function uniqueSorted(values: Iterable<string>) {
	return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].sort(
		(left, right) => left.localeCompare(right, 'bg')
	);
}

function getVehicleCondition(vehicle: Pick<HomeDesktopVehicle, 'conditionLine'>): 'new' | 'used' {
	return /нов\s+внос/i.test(vehicle.conditionLine) ? 'new' : 'used';
}

export function getDesktopHomeInventoryPreview(vehicles: readonly HomeDesktopVehicle[]) {
	return {
		vehicles: vehicles.slice(0, DESKTOP_HOME_INVENTORY_LIMIT),
		totalCount: vehicles.length
	};
}

export function getDesktopHomeHeroQuickFields(
	vehicles: readonly HomeDesktopVehicle[]
): DesktopHomeQuickField[] {
	const brandOptions = uniqueSorted(vehicles.map((vehicle) => vehicle.brand));
	const modelOptions = uniqueSorted(vehicles.map((vehicle) => vehicle.model));

	return [
		{
			name: 'brand',
			label: 'Марка',
			placeholder: 'Марка',
			options: [
				{ value: '', label: 'Всички марки' },
				...brandOptions.map((brand) => ({ value: brand, label: brand }))
			]
		},
		{
			name: 'model',
			label: 'Модел',
			placeholder: 'Модел',
			options: [
				{ value: '', label: 'Всички модели' },
				...modelOptions.map((model) => ({ value: model, label: model }))
			]
		},
		{
			name: 'price',
			label: 'Цена',
			placeholder: 'Цена',
			options: priceOptions
		},
		{
			name: 'mileage',
			label: 'Пробег',
			placeholder: 'Пробег',
			options: mileageOptions
		}
	];
}

export function getDesktopHomeHeroVehicleFilterData(
	vehicles: readonly HomeDesktopVehicle[]
): DesktopHomeHeroVehicleFilter[] {
	return vehicles.map((vehicle) => ({
		brand: normalize(vehicle.brand),
		model: normalize(vehicle.model),
		price: vehicle.price,
		mileage: vehicle.mileageValue,
		condition: getVehicleCondition(vehicle),
		haystack: normalize(
			[
				vehicle.title,
				vehicle.brand,
				vehicle.model,
				vehicle.fuel,
				vehicle.transmission,
				vehicle.body,
				vehicle.features.join(' '),
				vehicle.year,
				vehicle.shortTitle,
				vehicle.highlights.join(' '),
				vehicle.color
			].join(' ')
		)
	}));
}
