import { cars } from '$lib/data/daynight-vehicles';

const fuelLabels: Record<string, string> = {
	Бензин: 'Petrol',
	'Газ/Бензин': 'Petrol/LPG',
	'Бензин/Газ': 'Petrol/LPG',
	Дизел: 'Diesel',
	Електрически: 'Electric',
	Хибриден: 'Hybrid'
};

const transmissionLabels: Record<string, string> = {
	Автоматик: 'Automatic',
	Ръчна: 'Manual',
	Ръчни: 'Manual'
};

const brandLogoPaths: Record<string, string> = {
	Audi: '/variant-3/assets/images/brand/mobile/audi.svg',
	BMW: '/variant-3/assets/images/brand/mobile/bmw.svg',
	Chevrolet: '/variant-3/assets/images/brand/mobile/chevrolet.svg',
	Chrysler: '/variant-3/assets/images/brand/mobile/chrysler.svg',
	Citroen: '/variant-3/assets/images/brand/mobile/citroen.svg',
	Ford: '/variant-3/assets/images/brand/mobile/ford.svg',
	Honda: '/variant-3/assets/images/brand/mobile/honda.svg',
	Jaguar: '/variant-3/assets/images/brand/mobile/jaguar.svg',
	'Land Rover': '/variant-3/assets/images/brand/mobile/land-rover.svg',
	Mazda: '/variant-3/assets/images/brand/mobile/mazda.svg',
	Opel: '/variant-3/assets/images/brand/mobile/opel.svg',
	Peugeot: '/variant-3/assets/images/brand/mobile/peugeot.svg',
	Porsche: '/variant-3/assets/images/brand/mobile/porsche.svg',
	Skoda: '/variant-3/assets/images/brand/mobile/skoda.svg',
	Volvo: '/variant-3/assets/images/brand/mobile/volvo.svg',
	VW: '/variant-3/assets/images/brand/mobile/volkswagen.svg'
};

const bodyLabels: Record<string, string> = {
	Седан: 'Saloons',
	Комби: 'Estate cars',
	Хечбек: 'Hatchbacks',
	Ван: 'Vans',
	Лимузина: 'Luxury cars',
	Купе: 'Coupes',
	Кабрио: 'Convertibles'
};

const bodyImagePaths: Record<string, string> = {
	SUV: '/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp',
	Седан: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent.webp',
	Комби: '/variant-3/assets/images/body-type/normalized/body-wagon-transparent.webp',
	Хечбек: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent.webp',
	Ван: '/variant-3/assets/images/body-type/normalized/body-mpv-transparent.webp',
	Лимузина: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent.webp',
	Купе: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent.webp',
	Кабрио: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent.webp'
};

const featuredSlugs = [
	'mercedes-benz-gle-coupe-400d-2021-68018',
	'bmw-i7-2023-full-maxx',
	'porsche-macan-s-2015-02733'
];

const fallbackFeatureImages = [
	'/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp',
	'/variant-3/assets/images/megamenu/bmw-i7.webp',
	'/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp'
];

function pickFeaturedCars() {
	const bySlug = new Map(cars.map((car) => [car.slug, car]));
	const selected = featuredSlugs
		.map((slug) => bySlug.get(slug))
		.filter((car): car is (typeof cars)[number] => Boolean(car));
	const fallback = cars
		.filter((car) => !featuredSlugs.includes(car.slug))
		.sort((a, b) => b.price - a.price || b.year - a.year);

	return [...selected, ...fallback].slice(0, 3).map((car, index) => ({
		slug: car.slug,
		title:
			index === 0
				? 'Mercedes-Benz GLC 300d 4MATIC'
				: index === 1
					? 'BMW i5 eDrive40 M Sport'
					: 'Porsche Macan T',
		meta: `${car.year} • ${fuelLabels[car.fuel] ?? car.fuel} • ${transmissionLabels[car.transmission] ?? car.transmission}`,
		image: fallbackFeatureImages[index] ?? car.image,
		cash: index === 0 ? '£41,990' : index === 1 ? '£53,990' : '£69,990',
		lease: index === 0 ? '£499 / month' : index === 1 ? '£599 / month' : '£779 / month',
		badge: 'DayNight inspected'
	}));
}

function countBetween(min: number, max: number) {
	return cars.filter((car) => car.price >= min && car.price < max).length;
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
	const counts = new Map<string, number>();
	for (const item of items) {
		const key = getKey(item);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return counts;
}

export function load() {
	const brandCounts = countBy(cars, (car) => car.brand);
	const bodyCounts = countBy(cars, (car) => car.body);

	return {
		navItems: [
			'New cars',
			'Used cars',
			'Electric',
			'Leasing',
			'Vans',
			'Reviews',
			'News',
			'Financing'
		],
		searchTabs: [
			{ id: 'find', label: 'Find a car', placeholder: 'Search make, model or keyword' },
			{ id: 'sell', label: 'Sell my car', placeholder: 'Enter make, model or reg' },
			{ id: 'reviews', label: 'Read reviews', placeholder: 'Search reviews by model' }
		],
		shortcutPills: [
			{ label: 'EVs', icon: 'zap' },
			{ label: 'Lease', icon: 'lease' },
			{ label: 'New', icon: 'star' },
			{ label: 'Used', icon: 'car' },
			{ label: 'Vans', icon: 'truck' },
			{ label: 'SUVs', icon: 'suv' },
			{ label: 'Hybrids', icon: 'fuel' },
			{ label: 'Big boot', icon: 'box' },
			{ label: 'Below £30k', icon: 'tag' }
		],
		sellPoints: ['5,500+ dealers competing for your car', 'Free home collection', 'Fast payment'],
		budgetTiles: [
			{
				label: 'Under £10k',
				count: `${Math.max(148, countBetween(0, 10000))} cars`,
				image: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent.webp'
			},
			{
				label: 'Under £20k',
				count: `${Math.max(326, countBetween(10000, 20000))} cars`,
				image: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent.webp',
				tone: 'blue'
			},
			{
				label: 'Under £30k',
				count: `${Math.max(412, countBetween(20000, 30000))} cars`,
				image: '/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp'
			},
			{
				label: 'Under £40k',
				count: `${Math.max(276, countBetween(30000, 40000))} cars`,
				image: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent.webp',
				tone: 'dark'
			},
			{
				label: 'Under £50k',
				count: `${Math.max(184, countBetween(40000, 50000))} cars`,
				image: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent.webp'
			},
			{
				label: 'Over £50k',
				count: '112 cars',
				image: '/variant-3/assets/images/budget/open-budget-supercar-v2.webp',
				tone: 'red'
			}
		],
		premiumCars: pickFeaturedCars(),
		newsCards: [
			{
				title: 'Skoda Enyaq review',
				image: '/variant-3/assets/images/blog/post-31.jpg'
			},
			{
				title: 'New Hyundai Santa Fe',
				image: '/variant-3/assets/images/blog/post-32.jpg'
			},
			{
				title: 'EV charging guide',
				image: '/variant-3/assets/images/blog/post-30.jpg'
			},
			{
				title: 'New Audi A5 review',
				image: '/variant-3/assets/images/blog/post-34.jpg'
			}
		],
		brands: [...brandCounts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
			.slice(0, 10)
			.map(([brand, count]) => ({
				brand,
				count,
				logo: brandLogoPaths[brand] ?? null
			})),
		bodyTypes: [...bodyCounts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'bg'))
			.slice(0, 6)
			.map(([body, count]) => ({
				body: bodyLabels[body] ?? body,
				count,
				image:
					bodyImagePaths[body] ?? '/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp'
			}))
	};
}
