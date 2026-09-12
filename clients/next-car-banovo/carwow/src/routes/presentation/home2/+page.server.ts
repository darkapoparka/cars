import { cars } from '$lib/data/daynight-vehicles';
import { daynightSite } from '$lib/data/daynight-site';

function countBy<T>(items: T[], getKey: (item: T) => string) {
	const counts = new Map<string, number>();
	for (const item of items) {
		const key = getKey(item);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return counts;
}

const featuredSlugs = [
	'mercedes-benz-gle-coupe-400d-2021-68018',
	'bmw-i7-2023-full-maxx',
	'mercedes-benz-amg-gt-53-2020-00956'
];

const featuredSummaries: Record<string, string> = {
	'mercedes-benz-gle-coupe-400d-2021-68018': 'Premium coupe SUV with clear history',
	'bmw-i7-2023-full-maxx': 'Electric flagship comfort, ready to view',
	'mercedes-benz-amg-gt-53-2020-00956': 'AMG performance with everyday usability'
};

const featuredCardImages: Record<string, string> = {
	'mercedes-benz-gle-coupe-400d-2021-68018':
		'/assets/images/body-type/normalized/body-suv-transparent.webp',
	'bmw-i7-2023-full-maxx': '/assets/images/megamenu/bmw-i7.webp',
	'mercedes-benz-amg-gt-53-2020-00956':
		'/assets/images/body-type/normalized/body-coupe-transparent.webp'
};

const fuelLabels: Record<string, string> = {
	Бензин: 'Petrol',
	Дизел: 'Diesel',
	Електрически: 'Electric',
	Хибриден: 'Hybrid',
	'Бензин/Газ': 'Petrol/LPG'
};

const transmissionLabels: Record<string, string> = {
	Автоматик: 'Automatic',
	Ръчна: 'Manual'
};

const bodyLabels: Record<string, string> = {
	Седан: 'Saloons',
	Комби: 'Estate cars',
	Хечбек: 'Hatchbacks',
	Ван: 'Vans',
	Лимузина: 'Luxury cars',
	Купе: 'Coupes'
};

const brandLogoPaths: Record<string, string> = {
	Citroen: '/assets/images/brand/oem/citroen.svg',
	'Land Rover': '/assets/images/brand/oem/land-rover.svg',
	Opel: '/assets/images/brand/oem/opel.svg',
	Porsche: '/assets/images/brand/oem/porsche.webp'
};

const bodyImagePaths: Record<string, string> = {
	Седан: '/assets/images/body-type/normalized/body-sedan-transparent.webp',
	Комби: '/assets/images/body-type/normalized/body-wagon-transparent.webp',
	Хечбек: '/assets/images/body-type/normalized/body-hatchback-transparent.webp',
	Ван: '/assets/images/body-type/normalized/body-mpv-transparent.webp',
	Лимузина: '/assets/images/body-type/normalized/body-sedan-transparent.webp',
	Купе: '/assets/images/body-type/normalized/body-coupe-transparent.webp',
	SUV: '/assets/images/body-type/normalized/body-suv-transparent.webp'
};

function featuredCars() {
	const bySlug = new Map(cars.map((car) => [car.slug, car]));
	const primary = featuredSlugs
		.map((slug) => bySlug.get(slug))
		.filter((car): car is (typeof cars)[number] => Boolean(car));
	const fallback = cars
		.filter((car) => !featuredSlugs.includes(car.slug))
		.sort((a, b) => b.price - a.price || b.year - a.year);

	return [...primary, ...fallback].slice(0, 3).map((car) => ({
		slug: car.slug,
		title: car.shortTitle,
		subtitle: `${car.year} • ${fuelLabels[car.fuel] ?? car.fuel} • ${transmissionLabels[car.transmission] ?? car.transmission}`,
		summary: featuredSummaries[car.slug] ?? 'Verified NEXT CAR stock',
		image: car.image,
		cardImage: featuredCardImages[car.slug] ?? car.image,
		price: car.priceEur,
		badge: car.badges[0] ?? 'Checked',
		saving: 'DayNight inspected'
	}));
}

function budgetTiles() {
	const buckets = [
		{
			label: 'Under €10k',
			image: '/assets/images/body-type/normalized/body-hatchback-transparent.webp',
			count: cars.filter((car) => car.price > 0 && car.price <= 10000).length
		},
		{
			label: 'Under €20k',
			image: '/assets/images/body-type/normalized/body-sedan-transparent.webp',
			count: cars.filter((car) => car.price > 10000 && car.price <= 20000).length
		},
		{
			label: 'Under €30k',
			image: '/assets/images/body-type/normalized/body-wagon-transparent.webp',
			count: cars.filter((car) => car.price > 20000 && car.price <= 30000).length
		},
		{
			label: 'Under €50k',
			image: '/assets/images/body-type/normalized/body-suv-transparent.webp',
			count: cars.filter((car) => car.price > 30000 && car.price <= 50000).length
		},
		{
			label: 'Over €50k',
			image: '/assets/images/body-type/normalized/body-coupe-transparent.webp',
			count: cars.filter((car) => car.price > 50000).length
		},
		{
			label: 'Open budget',
			image: '/assets/images/budget/open-budget-supercar-v2.webp',
			count: cars.length
		}
	];

	return buckets;
}

export function load() {
	const brandCounts = countBy(cars, (car) => car.brand);
	const bodyCounts = countBy(cars, (car) => car.body);

	return {
		site: daynightSite,
		stats: {
			total: daynightSite.inventoryCount,
			dealers: 'Варна',
			rating: '4.9/5',
			reviews: '240+'
		},
		shortcutPills: [
			'Used cars',
			'Trade-in',
			'Finance',
			'Inspection',
			'SUVs',
			'Premium',
			'Hybrids',
			'Big boot',
			'Below €30k'
		],
		budgetTiles: budgetTiles(),
		featuredCars: featuredCars(),
		brands: [...brandCounts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
			.slice(0, 10)
			.map(([brand, count]) => ({ brand, count, logo: brandLogoPaths[brand] ?? null })),
		bodyTypes: [...bodyCounts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
			.slice(0, 6)
			.map(([body, count]) => ({
				body: bodyLabels[body] ?? body,
				count,
				image:
					bodyImagePaths[body] ?? '/assets/images/body-type/normalized/body-suv-transparent.webp'
			}))
	};
}
