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
		label: 'All',
		href: '/inventory',
		icon: 'all',
		isActive: true
	},
	{
		label: 'Electric',
		href: '/inventory?fuel=%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8',
		icon: 'electric'
	},
	{
		label: 'Sedan',
		href: '/inventory?body=%D0%A1%D0%B5%D0%B4%D0%B0%D0%BD',
		icon: 'sedan'
	},
	{
		label: 'SUV',
		href: '/inventory?body=SUV',
		icon: 'suv'
	},
	{
		label: 'Wagon',
		href: '/inventory?body=%D0%9A%D0%BE%D0%BC%D0%B1%D0%B8',
		icon: 'wagon'
	},
	{
		label: 'Hatchback',
		href: '/inventory?body=%D0%A5%D0%B5%D1%87%D0%B1%D0%B5%D0%BA',
		icon: 'hatchback'
	},
	{
		label: 'Coupe',
		href: '/inventory?body=%D0%9A%D1%83%D0%BF%D0%B5',
		icon: 'coupe'
	},
	{
		label: 'Up to 10 000 USD',
		href: '/inventory?price=under-10000',
		icon: 'budget'
	},
	{
		label: 'Up to 20 000 USD',
		href: '/inventory?price=under-20000',
		icon: 'budget'
	}
];

const mileageOptions = [
	{ value: '', label: 'All mileage' },
	{ value: 'under-100000', label: 'Up to 100 000 miles' },
	{ value: 'under-150000', label: 'Up to 150 000 miles' },
	{ value: 'under-200000', label: 'Up to 200 000 miles' },
	{ value: 'over-200000', label: 'Over 200 000 miles' }
];

const priceOptions = [
	{ value: '', label: 'All prices' },
	{ value: 'under-10000', label: 'Up to 10 000 USD' },
	{ value: 'under-20000', label: 'Up to 20 000 USD' },
	{ value: 'under-30000', label: 'Up to 30 000 USD' },
	{ value: 'under-50000', label: 'Up to 50 000 USD' },
	{ value: 'over-50000', label: 'Over 50 000 USD' }
];

function uniqueSorted(values: Iterable<string>) {
	return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].sort(
		(left, right) => left.localeCompare(right, 'bg')
	);
}

function getVehicleCondition(vehicle: Pick<HomeDesktopVehicle, 'conditionLine'>): 'new' | 'used' {
	return /new\s+import/i.test(vehicle.conditionLine) ? 'new' : 'used';
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
			label: 'Make',
			placeholder: 'Make',
			options: [
				{ value: '', label: 'All makes' },
				...brandOptions.map((brand) => ({ value: brand, label: brand }))
			]
		},
		{
			name: 'model',
			label: 'Model',
			placeholder: 'Model',
			options: [
				{ value: '', label: 'All models' },
				...modelOptions.map((model) => ({ value: model, label: model }))
			]
		},
		{
			name: 'price',
			label: 'Price',
			placeholder: 'Price',
			options: priceOptions
		},
		{
			name: 'mileage',
			label: 'Mileage',
			placeholder: 'Mileage',
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
