import { cars, placeholderImageSlugs, type Car } from '$lib/data/daynight-vehicles';
import { buildHomeBrandStripItems } from '$lib/data/home-brand-strip';
import type { HomeInitialViewport, HomeMobileVehicle, HomePageHeadData } from '$lib/types/home';

function toMobileVehicle(car: Car): HomeMobileVehicle {
	return {
		slug: car.slug,
		shortTitle: car.shortTitle,
		brand: car.brand,
		model: car.model,
		year: car.year,
		mileage: car.mileage,
		fuel: car.fuel,
		transmission: car.transmission,
		image: car.image,
		priceEur: car.priceEur,
		badges: car.badges,
		conditionLine: car.conditionLine
	};
}

// Body-type browse tiles: group by body, count stock, drop thin bodies
// (< 3 cars) so the grid never surfaces a lone Лимузина/Купе, sort by count desc.
function buildBodyTiles(vehicles: Car[]) {
	const order: string[] = [];
	const count = new Map<string, number>();
	for (const car of vehicles) {
		if (!count.has(car.body)) {
			order.push(car.body);
		}
		count.set(car.body, (count.get(car.body) ?? 0) + 1);
	}
	return order
		.map((body) => ({ body, count: count.get(body) ?? 0 }))
		.filter((t) => t.count >= 3)
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);
}

function buildBrandList(vehicles: Car[]) {
	const count = new Map<string, number>();
	for (const car of vehicles) {
		count.set(car.brand, (count.get(car.brand) ?? 0) + 1);
	}
	return [...count.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
		.map(([brand]) => brand)
		.slice(0, 8);
}

function buildBrandTiles(vehicles: Car[]) {
	const count = new Map<string, number>();
	for (const car of vehicles) {
		count.set(car.brand, (count.get(car.brand) ?? 0) + 1);
	}
	return [...count.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
		.map(([brand, count]) => ({ brand, count }))
		.slice(0, 8);
}

function buildModelOptions(vehicles: Car[]) {
	const options = new Map<string, { brands: Set<string>; count: number }>();

	for (const car of vehicles) {
		const option = options.get(car.model) ?? { brands: new Set<string>(), count: 0 };
		option.brands.add(car.brand);
		option.count += 1;
		options.set(car.model, option);
	}

	return [...options.entries()]
		.map(([model, option]) => ({
			model,
			brands: [...option.brands].sort((left, right) => left.localeCompare(right, 'bg')),
			count: option.count
		}))
		.sort((left, right) => right.count - left.count || left.model.localeCompare(right.model, 'bg'));
}

const featuredCarSlugs = [
	'mercedes-benz-gle-coupe-400d-2021-68018',
	'mercedes-benz-amg-gt-53-2020-00956',
	'bmw-i7-2023-full-maxx',
	'mercedes-benz-gls-63-amg-2019-61453',
	'mercedes-benz-eqe-300-2023-14248',
	'audi-q8-5-0tdi-2020-95331'
];

function buildFeaturedCars(vehicles: Car[]) {
	const bySlug = new Map(vehicles.map((car) => [car.slug, car]));
	const picked = featuredCarSlugs
		.map((slug) => bySlug.get(slug))
		.filter((car): car is Car => Boolean(car));
	const pickedSlugs = new Set(picked.map((car) => car.slug));
	const fallback = vehicles
		.filter((car) => !pickedSlugs.has(car.slug) && !placeholderImageSlugs.has(car.slug))
		.sort((a, b) => b.price - a.price || b.year - a.year);

	return [...picked, ...fallback].slice(0, 6);
}

function buildBudgetTiles(vehicles: Car[]) {
	const budgets = [
		{
			label: 'До 10 000 EUR',
			value: 'under-10000',
			limit: 10000,
			image: '/assets/images/body-type/normalized/body-hatchback-transparent.webp'
		},
		{
			label: 'До 20 000 EUR',
			value: 'under-20000',
			limit: 20000,
			image: '/assets/images/body-type/normalized/body-sedan-transparent.webp'
		},
		{
			label: 'До 30 000 EUR',
			value: 'under-30000',
			limit: 30000,
			image: '/assets/images/body-type/normalized/body-wagon-transparent.webp'
		},
		{
			label: 'До 50 000 EUR',
			value: 'under-50000',
			limit: 50000,
			image: '/assets/images/body-type/normalized/body-suv-transparent.webp'
		},
		{
			label: 'Над 50 000 EUR',
			value: 'over-50000',
			min: 50000,
			image: '/assets/images/body-type/normalized/body-coupe-transparent.webp'
		},
		{
			label: 'Без бюджет',
			value: 'all',
			image: '/assets/images/budget/open-budget-supercar-v2.webp',
			caption: `Всички ${vehicles.length} коли`,
			variant: 'open' as const
		}
	];

	return budgets.map(({ label, value, limit, min, image, caption, variant }) => ({
		label,
		value,
		image,
		caption,
		variant,
		count:
			value === 'all'
				? vehicles.length
				: vehicles.filter((car) => {
						if (limit !== undefined) return car.price > 0 && car.price <= limit;
						if (min !== undefined) return car.price > min;
						return false;
					}).length
	}));
}

export function loadHomePageData(
	home: HomePageHeadData = { title: 'Крис Кар' },
	initialViewport: HomeInitialViewport = 'desktop',
	vehicles?: Car[]
) {
	// Production callers pass database-published vehicles. Only legacy/demo
	// callers that omit inventory get the static fixture fallback.
	const displayVehicles = vehicles ?? cars;

	return {
		home,
		initialViewport,
		homeBrandStrip: buildHomeBrandStripItems(displayVehicles),
		desktopHome: {
			vehicles: displayVehicles
		},
		mobileHome: {
			brands: buildBrandList(displayVehicles),
			models: Array.from(new Set(displayVehicles.map((car) => car.model))).slice(0, 12),
			modelOptions: buildModelOptions(displayVehicles),
			bodyTypes: Array.from(new Set(displayVehicles.map((car) => car.body))).slice(0, 8),
			featuredCars: buildFeaturedCars(displayVehicles).map(toMobileVehicle),
			bodyTiles: buildBodyTiles(displayVehicles),
			brandTiles: buildBrandTiles(displayVehicles),
			budgetTiles: buildBudgetTiles(displayVehicles),
			total: displayVehicles.length
		}
	};
}
