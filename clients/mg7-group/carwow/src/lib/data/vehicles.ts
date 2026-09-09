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
    "slug": "bmw-x7-40d-xdrive-m-sport-332885",
    "title": "BMW X7 40d xDrive M Sport",
    "brand": "BMW",
    "model": "X7 40d xDrive M Sport",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 61900,
    "monthly": 0,
    "year": 2023,
    "mileage": 45000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "21785564544332885",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21785564544332885-1.webp",
    "images": [
      "/dealer/stock/21785564544332885-1.webp",
      "/dealer/stock/21785564544332885-2.webp",
      "/dealer/stock/21785564544332885-3.webp",
      "/dealer/stock/21785564544332885-4.webp",
      "/dealer/stock/21785564544332885-5.webp",
      "/dealer/stock/21785564544332885-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21785564544332885-1.webp",
      "/dealer/stock/21785564544332885-2.webp",
      "/dealer/stock/21785564544332885-3.webp",
      "/dealer/stock/21785564544332885-4.webp",
      "/dealer/stock/21785564544332885-5.webp",
      "/dealer/stock/21785564544332885-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-21785564544332885-bmw-x7-40d-xdrive-m-sport-facelift-carbon-1-vi-sobstvenik",
    "features": []
  },
  {
    "slug": "mercedes-benz-g-63-amg-440995",
    "title": "Mercedes-Benz G 63 AMG",
    "brand": "Mercedes-Benz",
    "model": "G 63 AMG",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 181000,
    "monthly": 0,
    "year": 2025,
    "mileage": 22000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "W1NWH5AB4SX030587",
    "stockNumber": "21745605265440995",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21745605265440995-1.webp",
    "images": [
      "/dealer/stock/21745605265440995-1.webp",
      "/dealer/stock/21745605265440995-2.webp",
      "/dealer/stock/21745605265440995-3.webp",
      "/dealer/stock/21745605265440995-4.webp",
      "/dealer/stock/21745605265440995-5.webp",
      "/dealer/stock/21745605265440995-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21745605265440995-1.webp",
      "/dealer/stock/21745605265440995-2.webp",
      "/dealer/stock/21745605265440995-3.webp",
      "/dealer/stock/21745605265440995-4.webp",
      "/dealer/stock/21745605265440995-5.webp",
      "/dealer/stock/21745605265440995-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Цената е без ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-21745605265440995-mercedes-benz-g-63-amg-2025g-nov-ot-silvar-star",
    "features": []
  },
  {
    "slug": "bmw-850-v8-gran-coupe-975456",
    "title": "BMW 850 V8 Gran Coupe",
    "brand": "BMW",
    "model": "850 V8 Gran Coupe",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 54555,
    "monthly": 0,
    "year": 2022,
    "mileage": 107000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11786258864975456",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11786258864975456-1.webp",
    "images": [
      "/dealer/stock/11786258864975456-1.webp",
      "/dealer/stock/11786258864975456-2.webp",
      "/dealer/stock/11786258864975456-3.webp",
      "/dealer/stock/11786258864975456-4.webp",
      "/dealer/stock/11786258864975456-5.webp",
      "/dealer/stock/11786258864975456-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11786258864975456-1.webp",
      "/dealer/stock/11786258864975456-2.webp",
      "/dealer/stock/11786258864975456-3.webp",
      "/dealer/stock/11786258864975456-4.webp",
      "/dealer/stock/11786258864975456-5.webp",
      "/dealer/stock/11786258864975456-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11786258864975456-bmw-850-v8-gran-coupe-1-vi-sobstvenik-v-garantsiya",
    "features": []
  },
  {
    "slug": "bmw-x6-m-sport-362812",
    "title": "BMW X6 M Sport",
    "brand": "BMW",
    "model": "X6 M Sport",
    "bodyType": "SUV",
    "condition": "Used",
    "price": 45000,
    "monthly": 0,
    "year": 2020,
    "mileage": 141000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "21782394387362812",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/21782394387362812-1.webp",
    "images": [
      "/dealer/stock/21782394387362812-1.webp",
      "/dealer/stock/21782394387362812-2.webp",
      "/dealer/stock/21782394387362812-3.webp",
      "/dealer/stock/21782394387362812-4.webp",
      "/dealer/stock/21782394387362812-5.webp",
      "/dealer/stock/21782394387362812-6.webp"
    ],
    "gallery": [
      "/dealer/stock/21782394387362812-1.webp",
      "/dealer/stock/21782394387362812-2.webp",
      "/dealer/stock/21782394387362812-3.webp",
      "/dealer/stock/21782394387362812-4.webp",
      "/dealer/stock/21782394387362812-5.webp",
      "/dealer/stock/21782394387362812-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-21782394387362812-bmw-x6-m-sport-v-garantsiya-do-09-2027g",
    "features": []
  },
  {
    "slug": "mercedes-benz-e-53-amg-coupe-457814",
    "title": "Mercedes-Benz E 53 AMG Coupe",
    "brand": "Mercedes-Benz",
    "model": "E 53 AMG Coupe",
    "bodyType": "Coupe",
    "condition": "Used",
    "price": 31000,
    "monthly": 0,
    "year": 2019,
    "mileage": 144000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11774522821457814",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11774522821457814-1.webp",
    "images": [
      "/dealer/stock/11774522821457814-1.webp",
      "/dealer/stock/11774522821457814-2.webp",
      "/dealer/stock/11774522821457814-3.webp",
      "/dealer/stock/11774522821457814-4.webp",
      "/dealer/stock/11774522821457814-5.webp",
      "/dealer/stock/11774522821457814-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11774522821457814-1.webp",
      "/dealer/stock/11774522821457814-2.webp",
      "/dealer/stock/11774522821457814-3.webp",
      "/dealer/stock/11774522821457814-4.webp",
      "/dealer/stock/11774522821457814-5.webp",
      "/dealer/stock/11774522821457814-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11774522821457814-mercedes-benz-e-53-amg-coupe-amg",
    "features": []
  },
  {
    "slug": "chevrolet-camaro-362453",
    "title": "Chevrolet Camaro",
    "brand": "Chevrolet",
    "model": "Camaro",
    "bodyType": "Convertible",
    "condition": "Used",
    "price": 5300,
    "monthly": 0,
    "year": 2000,
    "mileage": 90700,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "3791 см³",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11784017637362453",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11784017637362453-1.webp",
    "images": [
      "/dealer/stock/11784017637362453-1.webp",
      "/dealer/stock/11784017637362453-2.webp",
      "/dealer/stock/11784017637362453-3.webp",
      "/dealer/stock/11784017637362453-4.webp",
      "/dealer/stock/11784017637362453-5.webp",
      "/dealer/stock/11784017637362453-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11784017637362453-1.webp",
      "/dealer/stock/11784017637362453-2.webp",
      "/dealer/stock/11784017637362453-3.webp",
      "/dealer/stock/11784017637362453-4.webp",
      "/dealer/stock/11784017637362453-5.webp",
      "/dealer/stock/11784017637362453-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11784017637362453-chevrolet-camaro-palna-servizna-istoriya-90-700km",
    "features": []
  },
  {
    "slug": "bmw-840ci-m-sport-122620",
    "title": "BMW 840Ci M Sport",
    "brand": "BMW",
    "model": "840Ci M Sport",
    "bodyType": "Coupe",
    "condition": "Used",
    "price": 24900,
    "monthly": 0,
    "year": 1995,
    "mileage": 173000,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "3982 см³",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11787220789122620",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11787220789122620-1.webp",
    "images": [
      "/dealer/stock/11787220789122620-1.webp",
      "/dealer/stock/11787220789122620-2.webp",
      "/dealer/stock/11787220789122620-3.webp",
      "/dealer/stock/11787220789122620-4.webp",
      "/dealer/stock/11787220789122620-5.webp",
      "/dealer/stock/11787220789122620-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11787220789122620-1.webp",
      "/dealer/stock/11787220789122620-2.webp",
      "/dealer/stock/11787220789122620-3.webp",
      "/dealer/stock/11787220789122620-4.webp",
      "/dealer/stock/11787220789122620-5.webp",
      "/dealer/stock/11787220789122620-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11787220789122620-bmw-840-ci-m-sport",
    "features": []
  },
  {
    "slug": "audi-a8-50-tdi-v6-736875",
    "title": "Audi A8 50 TDI V6",
    "brand": "Audi",
    "model": "A8 50 TDI V6",
    "bodyType": "Sedan",
    "condition": "Used",
    "price": 29900,
    "monthly": 0,
    "year": 2018,
    "mileage": 175000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11787219518736875",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11787219518736875-1.webp",
    "images": [
      "/dealer/stock/11787219518736875-1.webp",
      "/dealer/stock/11787219518736875-2.webp",
      "/dealer/stock/11787219518736875-3.webp",
      "/dealer/stock/11787219518736875-4.webp",
      "/dealer/stock/11787219518736875-5.webp",
      "/dealer/stock/11787219518736875-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11787219518736875-1.webp",
      "/dealer/stock/11787219518736875-2.webp",
      "/dealer/stock/11787219518736875-3.webp",
      "/dealer/stock/11787219518736875-4.webp",
      "/dealer/stock/11787219518736875-5.webp",
      "/dealer/stock/11787219518736875-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Цената е с включено ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11787219518736875-audi-a8-50-tdi-v6",
    "features": []
  },
  {
    "slug": "audi-a6-allroad-50-tdi-v6-128831",
    "title": "Audi A6 Allroad 50 TDI V6",
    "brand": "Audi",
    "model": "A6 Allroad 50 TDI V6",
    "bodyType": "Wagon",
    "condition": "Used",
    "price": 27000,
    "monthly": 0,
    "year": 2020,
    "mileage": 115000,
    "fuel": "Дизел",
    "transmission": "Automatic",
    "engine": "3000 см³",
    "exterior": "Сив",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "Не е публикуван",
    "stockNumber": "11787042642128831",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11787042642128831-1.webp",
    "images": [
      "/dealer/stock/11787042642128831-1.webp",
      "/dealer/stock/11787042642128831-2.webp",
      "/dealer/stock/11787042642128831-3.webp",
      "/dealer/stock/11787042642128831-4.webp",
      "/dealer/stock/11787042642128831-5.webp",
      "/dealer/stock/11787042642128831-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11787042642128831-1.webp",
      "/dealer/stock/11787042642128831-2.webp",
      "/dealer/stock/11787042642128831-3.webp",
      "/dealer/stock/11787042642128831-4.webp",
      "/dealer/stock/11787042642128831-5.webp",
      "/dealer/stock/11787042642128831-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11787042642128831-audi-a6-allroad-50-tdi-v6-286hp-dosie-ot-0-km",
    "features": []
  },
  {
    "slug": "porsche-911-997-turbo-074384",
    "title": "Porsche 911 997 Turbo",
    "brand": "Porsche",
    "model": "911 997 Turbo",
    "bodyType": "Coupe",
    "condition": "Used",
    "price": 83000,
    "monthly": 0,
    "year": 2008,
    "mileage": 79907,
    "fuel": "Бензин",
    "transmission": "Automatic",
    "engine": "—",
    "exterior": "Не е посочен",
    "interior": "Не е посочен",
    "location": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
    "vin": "WP0ZZZ99Z8S782906",
    "stockNumber": "11754657468074384",
    "tag": "Публична обява",
    "tagTone": "dark",
    "image": "/dealer/stock/11754657468074384-1.webp",
    "images": [
      "/dealer/stock/11754657468074384-1.webp",
      "/dealer/stock/11754657468074384-2.webp",
      "/dealer/stock/11754657468074384-3.webp",
      "/dealer/stock/11754657468074384-4.webp",
      "/dealer/stock/11754657468074384-5.webp",
      "/dealer/stock/11754657468074384-6.webp"
    ],
    "gallery": [
      "/dealer/stock/11754657468074384-1.webp",
      "/dealer/stock/11754657468074384-2.webp",
      "/dealer/stock/11754657468074384-3.webp",
      "/dealer/stock/11754657468074384-4.webp",
      "/dealer/stock/11754657468074384-5.webp",
      "/dealer/stock/11754657468074384-6.webp"
    ],
    "dealerSlug": "mg7-group",
    "agentSlug": "prodazhbi-showroom",
    "rating": 0,
    "description": "Публична обява на MG7 Group, наблюдавана на 09.09.2026 г. Не се начислява ДДС. Наличността и състоянието се потвърждават по телефона. https://mg7group.mobile.bg/obiava-11754657468074384-porsche-911-997-turbo-mezger-carbon-akrapovic",
    "features": []
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
