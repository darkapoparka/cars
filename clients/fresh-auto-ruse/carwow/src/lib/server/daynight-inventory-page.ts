import { daynightVehicles, type Car } from '$lib/data/daynight-vehicles';
import type {
	InventoryGridDefinition,
	InventoryListVehicle,
	InventoryQuickFilterGroup,
	InventoryQuickFilterOption
} from '$lib/types/inventory';
import type { InventoryTemplatePage, MapInventoryTemplatePage } from '$lib/types/template-page';
import { routeSeo } from './daynight-seo';

export function toInventoryListVehicle(vehicle: Car): InventoryListVehicle {
	return {
		slug: vehicle.slug,
		title: vehicle.title,
		shortTitle: vehicle.shortTitle,
		brand: vehicle.brand,
		model: vehicle.model,
		year: vehicle.year,
		mileage: vehicle.mileage,
		mileageValue: vehicle.mileageValue,
		fuel: vehicle.fuel,
		transmission: vehicle.transmission,
		body: vehicle.body,
		color: vehicle.color,
		price: vehicle.price,
		priceEur: vehicle.priceEur,
		monthly: vehicle.monthly,
		image: vehicle.image,
		gallery: vehicle.gallery,
		badges: vehicle.badges,
		conditionLine: vehicle.conditionLine,
		features: vehicle.features,
		highlights: vehicle.highlights
	};
}

const gridDefinitions: InventoryGridDefinition[] = [
	{
		name: 'two-column',
		contentInnerClass: 'content-inner',
		gridClass: 'grid grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40'
	},
	{
		name: 'three-column',
		contentInnerClass: 'content-inner',
		gridClass: 'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41'
	},
	{
		name: 'four-column',
		contentInnerClass: 'content-inner',
		gridClass: 'grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41'
	},
	{
		name: 'five-column',
		contentInnerClass: 'content-inner active',
		gridClass: 'grid grid-cols-5 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-20 gap-y-41'
	}
];

function uniqueSorted(values: string[]) {
	return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'bg'));
}

function toOptions(values: string[]): InventoryQuickFilterOption[] {
	return uniqueSorted(values).map((value) => ({ value, label: value }));
}

const mileageOptions: InventoryQuickFilterOption[] = [
	{ value: 'under-100000', label: 'До 100 000 км' },
	{ value: 'under-150000', label: 'До 150 000 км' },
	{ value: 'under-200000', label: 'До 200 000 км' },
	{ value: 'over-200000', label: 'Над 200 000 км' }
];

// Each model carries the brands that stock it, so the Модел menu can be
// scoped to the chosen Марка at runtime.
function toModelOptions(vehicles: Car[]): InventoryQuickFilterOption[] {
	const brandsByModel = new Map<string, Set<string>>();
	for (const vehicle of vehicles) {
		const brands = brandsByModel.get(vehicle.model) ?? new Set<string>();
		brands.add(vehicle.brand);
		brandsByModel.set(vehicle.model, brands);
	}

	return toOptions(vehicles.map((vehicle) => vehicle.model)).map((option) => ({
		...option,
		brands: [...(brandsByModel.get(option.value) ?? [])].sort((a, b) => a.localeCompare(b, 'bg'))
	}));
}

function buildQuickFilters(vehicles: Car[]): InventoryQuickFilterGroup[] {
	return [
		{
			name: 'brand',
			label: 'Марка',
			placeholder: 'Всички марки',
			options: toOptions(vehicles.map((vehicle) => vehicle.brand))
		},
		{
			name: 'model',
			label: 'Модел',
			placeholder: 'Всички модели',
			options: toModelOptions(vehicles)
		},
		{
			name: 'price',
			label: 'Цена',
			placeholder: 'Всички цени',
			options: [
				{ value: 'under-10000', label: 'До 10 000 EUR' },
				{ value: 'under-20000', label: 'До 20 000 EUR' },
				{ value: 'under-30000', label: 'До 30 000 EUR' },
				{ value: 'under-50000', label: 'До 50 000 EUR' },
				{ value: 'over-50000', label: 'Над 50 000 EUR' }
			]
		},
		{
			name: 'mileage',
			label: 'Пробег',
			placeholder: 'Всички пробези',
			options: mileageOptions
		},
		{
			name: 'fuel',
			label: 'Гориво',
			placeholder: 'Всички горива',
			options: toOptions(vehicles.map((vehicle) => vehicle.fuel))
		},
		{
			name: 'transmission',
			label: 'Скорости',
			placeholder: 'Всички скорости',
			options: toOptions(vehicles.map((vehicle) => vehicle.transmission))
		},
		{
			name: 'body',
			label: 'Каросерия',
			placeholder: 'Всички каросерии',
			options: toOptions(vehicles.map((vehicle) => vehicle.body))
		},
		{
			name: 'feature',
			label: 'Екстри',
			placeholder: 'Всички екстри',
			options: toOptions(vehicles.flatMap((vehicle) => vehicle.features))
		}
	];
}

// The grid is fully native (the reactive DesktopInventoryFilters store drives
// every control) and ships no template scripts, so the payload is built purely
// from Car data + route SEO.
export async function loadInventoryTemplatePage(vehicles?: Car[]): Promise<InventoryTemplatePage> {
	const publicVehicles = vehicles ?? daynightVehicles;

	return {
		kind: 'inventory',
		...routeSeo('inventory'),
		scriptSrcs: [],
		gridDefinitions,
		quickFilters: buildQuickFilters(publicVehicles),
		vehicles: publicVehicles.map(toInventoryListVehicle)
	};
}

// Native half-map payload — the same quick filters + vehicles the grid carries
// (they drive the shared reactive store), minus the grid layout definitions. The
// map embed itself is masked in the visual gate.
export async function loadInventoryMapPage(vehicles?: Car[]): Promise<MapInventoryTemplatePage> {
	const publicVehicles = vehicles ?? daynightVehicles;

	return {
		kind: 'inventory-map',
		...routeSeo('inventory/map'),
		scriptSrcs: [],
		quickFilters: buildQuickFilters(publicVehicles),
		vehicles: publicVehicles.map(toInventoryListVehicle)
	};
}
