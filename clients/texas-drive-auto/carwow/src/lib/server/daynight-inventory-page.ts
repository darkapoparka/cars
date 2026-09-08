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
		priceLabel: vehicle.priceLabel,
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
	{ value: 'under-100000', label: 'Up to 100 000 miles' },
	{ value: 'under-150000', label: 'Up to 150 000 miles' },
	{ value: 'under-200000', label: 'Up to 200 000 miles' },
	{ value: 'over-200000', label: 'Over 200 000 miles' }
];

// Each model carries the brands that stock it, so the Model menu can be
// scoped to the chosen Make at runtime.
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
			label: 'Make',
			placeholder: 'All makes',
			options: toOptions(vehicles.map((vehicle) => vehicle.brand))
		},
		{
			name: 'model',
			label: 'Model',
			placeholder: 'All models',
			options: toModelOptions(vehicles)
		},
		{
			name: 'price',
			label: 'Price',
			placeholder: 'All prices',
			options: [
				{ value: 'under-10000', label: 'Up to 10 000 USD' },
				{ value: 'under-20000', label: 'Up to 20 000 USD' },
				{ value: 'under-30000', label: 'Up to 30 000 USD' },
				{ value: 'under-50000', label: 'Up to 50 000 USD' },
				{ value: 'over-50000', label: 'Over 50 000 USD' }
			]
		},
		{
			name: 'mileage',
			label: 'Mileage',
			placeholder: 'All mileage',
			options: mileageOptions
		},
		{
			name: 'fuel',
			label: 'Fuel',
			placeholder: 'All fuel types',
			options: toOptions(vehicles.map((vehicle) => vehicle.fuel))
		},
		{
			name: 'transmission',
			label: 'Transmission',
			placeholder: 'All transmissions',
			options: toOptions(vehicles.map((vehicle) => vehicle.transmission))
		},
		{
			name: 'body',
			label: 'Body style',
			placeholder: 'All body styles',
			options: toOptions(vehicles.map((vehicle) => vehicle.body))
		},
		{
			name: 'feature',
			label: 'Features',
			placeholder: 'All features',
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
