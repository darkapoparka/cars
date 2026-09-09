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

const detailGallery = [
	'/assets/images/inner-page/slide-listing-details-5.jpg',
	'/assets/images/inner-page/slide-listing-details-6.jpg',
	'/assets/images/inner-page/slide-listing-details-7.jpg',
	'/assets/images/inner-page/slide-listing-details-8.jpg',
	'/assets/images/inner-page/slide-listing-details-9.jpg',
	'/assets/images/inner-page/slide-listing-details-10.jpg',
	'/assets/images/inner-page/slide-listing-details-11.jpg'
];

export const vehicles: Vehicle[] = [
	{
		slug: 'audi-a6-avant-e-tron',
		title: 'Audi A6 Avant E-Tron',
		brand: 'Audi',
		model: 'A6 Avant',
		bodyType: 'Electric',
		condition: 'New',
		price: 44900,
		monthly: 245,
		year: 2022,
		mileage: 32500,
		fuel: 'EV',
		transmission: 'Manual',
		engine: 'Dual Motor Electric',
		exterior: 'Moss Green',
		interior: 'Jet Black',
		location: daynightSite.location,
		vin: '1G1ZD5ST0PF',
		stockNumber: '165921',
		tag: 'Special',
		tagTone: 'lime',
		image: '/assets/images/card/card-1.jpg',
		images: ['/assets/images/card/card-1.jpg', '/assets/images/card/card-50.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'prodazhbi-daynight-auto',
		rating: 4.9,
		description:
			'A premium electric wagon with a long-range drivetrain, quiet cabin, clean history, and a highly optioned driver assistance package.',
		features: [
			'Premium leather seats',
			'Panoramic roof',
			'360 camera',
			'Adaptive cruise',
			'Heated steering wheel',
			'Wireless charging'
		]
	},
	{
		slug: '2024-hyundai-elantra',
		title: '2024 Hyundai Elantra',
		brand: 'Hyundai',
		model: 'Elantra',
		bodyType: 'Sedan',
		condition: 'Certified',
		price: 42800,
		monthly: 225,
		year: 2024,
		mileage: 83500,
		fuel: 'Benzin',
		transmission: 'Auto',
		engine: '2.0L Inline',
		exterior: 'Champagne',
		interior: 'Warm Gray',
		location: daynightSite.location,
		vin: 'KMHLM4DG2RU',
		stockNumber: '162310',
		tag: 'Great Price',
		tagTone: 'violet',
		image: '/assets/images/card/card-2.jpg',
		images: ['/assets/images/card/card-2.jpg', '/assets/images/card/card-51.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'prodazhbi-daynight-auto',
		rating: 4.8,
		description:
			'A sharp compact sedan with low mileage, excellent warranty coverage, and the technology package buyers ask for most.',
		features: ['Lane keep assist', 'Apple CarPlay', 'Blind spot monitor', 'Remote start']
	},
	{
		slug: 'kia-ev9-2024',
		title: 'Kia EV9 2024',
		brand: 'Kia',
		model: 'EV9',
		bodyType: 'SUV',
		condition: 'New',
		price: 45500,
		monthly: 430,
		year: 2020,
		mileage: 76400,
		fuel: 'EV',
		displayFuel: 'Diesel',
		transmission: 'Auto',
		engine: 'Dual Motor Electric',
		exterior: 'Snow White',
		interior: 'Graphite',
		location: daynightSite.location,
		vin: 'KNDAAFFS3R6',
		stockNumber: '166720',
		image: '/assets/images/card/card-3.jpg',
		images: ['/assets/images/card/card-3.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'dokumenti-finansirane',
		rating: 4.7,
		description:
			'A three-row electric SUV with generous range, fast charging, and a calm cabin suited for daily family use.',
		features: ['Third row seating', 'Fast charging', 'Ventilated seats', 'Tow package']
	},
	{
		slug: 'chevrolet-camaro-2020',
		title: 'Chevrolet Camaro 2020',
		brand: 'Chevrolet',
		model: 'Camaro',
		bodyType: 'Coupe',
		condition: 'Used',
		price: 35500,
		monthly: 298,
		year: 2020,
		mileage: 42600,
		fuel: 'Gasoline',
		transmission: 'Automatic',
		engine: '6.2L V8',
		exterior: 'Crimson Red',
		interior: 'Jet Black',
		location: daynightSite.location,
		vin: '1G1FG1R72L0',
		stockNumber: '163112',
		image: '/assets/images/card/card-4.jpg',
		images: ['/assets/images/card/card-4.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'prodazhbi-daynight-auto',
		rating: 4.6,
		description:
			'A clean performance coupe with confident V8 power, service records, and a driver-focused interior.',
		features: ['Brembo brakes', 'Performance exhaust', 'Head-up display', 'Launch control']
	},
	{
		slug: 'audi-r8',
		title: 'Audi R8',
		brand: 'Audi',
		model: 'R8',
		bodyType: 'Coupe',
		condition: 'Used',
		price: 96500,
		monthly: 1180,
		year: 2021,
		mileage: 21400,
		fuel: 'Gasoline',
		transmission: 'Automatic',
		engine: '5.2L V10',
		exterior: 'Daytona Gray',
		interior: 'Black Alcantara',
		location: daynightSite.location,
		vin: 'WUABAAFX5M7',
		stockNumber: '160081',
		tag: 'Low Miles',
		tagTone: 'dark',
		image: '/assets/images/card/card-5.jpg',
		images: ['/assets/images/card/card-5.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-sourcing',
		agentSlug: 'otsenka-i-barter',
		rating: 4.9,
		description:
			'A naturally aspirated supercar with a precise dual-clutch transmission and a pristine ownership record.',
		features: ['Carbon trim', 'Sport exhaust', 'Magnetic ride', 'Bang & Olufsen audio']
	},
	{
		slug: 'genesis-electrified-g80',
		title: 'Genesis Electrified G80',
		brand: 'Genesis',
		model: 'G80',
		bodyType: 'Sedan',
		condition: 'Certified',
		price: 61500,
		monthly: 512,
		year: 2023,
		mileage: 12200,
		fuel: 'EV',
		transmission: 'Automatic',
		engine: 'Electric AWD',
		exterior: 'Savile Silver',
		interior: 'Navy',
		location: daynightSite.location,
		vin: 'KMTGB4SD7PU',
		stockNumber: '166105',
		image: '/assets/images/card/card-6.jpg',
		images: ['/assets/images/card/card-6.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'dokumenti-finansirane',
		rating: 4.8,
		description:
			'A refined electric luxury sedan with quick acceleration, hush-quiet ride quality, and a spacious rear cabin.',
		features: ['Lexicon audio', 'Massage seats', 'Head-up display', 'Surround view camera']
	},
	{
		slug: '2020-chevy-camaro-zl1',
		title: '2020 Chevy Camaro ZL1',
		brand: 'Chevrolet',
		model: 'Camaro ZL1',
		bodyType: 'Coupe',
		condition: 'Used',
		price: 64500,
		monthly: 642,
		year: 2020,
		mileage: 29800,
		fuel: 'Gasoline',
		transmission: 'Manual',
		engine: '6.2L Supercharged V8',
		exterior: 'Summit White',
		interior: 'Black',
		location: daynightSite.location,
		vin: '1G1FK1R68L0',
		stockNumber: '161904',
		image: '/assets/images/card/card-7.jpg',
		images: ['/assets/images/card/card-7.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-sourcing',
		agentSlug: 'prodazhbi-daynight-auto',
		rating: 4.7,
		description:
			'A high-output ZL1 with track hardware, excellent tire life, and a careful inspection report.',
		features: ['Recaro seats', 'Track cooling', 'Magnetic ride', 'Performance data recorder']
	},
	{
		slug: '2022-ford-mustang-gtd',
		title: '2022 Ford Mustang GTD',
		brand: 'Mustang',
		model: 'GTD',
		bodyType: 'Coupe',
		condition: 'Used',
		price: 73500,
		monthly: 790,
		year: 2022,
		mileage: 16800,
		fuel: 'Gasoline',
		transmission: 'Manual',
		engine: '5.0L V8',
		exterior: 'Shadow Black',
		interior: 'Ebony',
		location: daynightSite.location,
		vin: '1FA6P8CF4N5',
		stockNumber: '164514',
		image: '/assets/images/card/card-8.jpg',
		images: ['/assets/images/card/card-8.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'otsenka-i-barter',
		rating: 4.5,
		description:
			'A muscular Mustang coupe with a manual gearbox, premium audio, and a documented maintenance file.',
		features: ['Track apps', 'Active exhaust', 'B&O audio', 'Performance package']
	},
	{
		slug: 'porsche-911-st',
		title: 'Porsche 911 S/T',
		brand: 'Porsche',
		model: '911 S/T',
		bodyType: 'Coupe',
		condition: 'New',
		price: 145000,
		monthly: 1685,
		year: 2024,
		mileage: 1200,
		fuel: 'Gasoline',
		transmission: 'Manual',
		engine: '4.0L Flat Six',
		exterior: 'GT Silver',
		interior: 'Classic Cognac',
		location: daynightSite.location,
		vin: 'WP0AB2A94RS',
		stockNumber: '166902',
		tag: 'Collector',
		tagTone: 'violet',
		image: '/assets/images/card/card-9.jpg',
		images: ['/assets/images/card/card-9.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-sourcing',
		agentSlug: 'dokumenti-finansirane',
		rating: 5,
		description:
			'A lightweight 911 with rare specification, delivery mileage, and the analog feel collectors prize.',
		features: ['Carbon bucket seats', 'Lightweight glass', 'Ceramic brakes', 'Front axle lift']
	},
	{
		slug: 'bmw-x7-pure-excellence-2023',
		title: 'BMW X7 Pure Excellence 2023',
		brand: 'BMW',
		model: 'X7',
		bodyType: 'SUV',
		condition: 'Certified',
		price: 82200,
		monthly: 910,
		year: 2023,
		mileage: 19600,
		fuel: 'Hybrid',
		transmission: 'Automatic',
		engine: '3.0L Turbo Hybrid',
		exterior: 'Mineral White',
		interior: 'Coffee Merino',
		location: daynightSite.location,
		vin: '5UX23EM04P9',
		stockNumber: '165300',
		image: '/assets/images/card/card-10.jpg',
		images: ['/assets/images/card/card-10.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'prodazhbi-daynight-auto',
		rating: 4.8,
		description:
			'A full-size luxury SUV with a quiet six-cylinder hybrid drivetrain and second-row captain chairs.',
		features: ['Captain chairs', 'Sky lounge roof', 'Air suspension', 'Parking assistant pro']
	},
	{
		slug: '2022-ford-gt-white',
		title: '2022 Ford GT White',
		brand: 'Ford',
		model: 'GT',
		bodyType: 'Coupe',
		condition: 'Used',
		price: 520000,
		monthly: 6120,
		year: 2022,
		mileage: 1900,
		fuel: 'Gasoline',
		transmission: 'Automatic',
		engine: '3.5L Twin Turbo V6',
		exterior: 'Frozen White',
		interior: 'Ebony',
		location: daynightSite.location,
		vin: '2FAGP9CW1NH',
		stockNumber: 'GT2210',
		image: '/assets/images/card/card-54.jpg',
		images: ['/assets/images/card/card-54.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-sourcing',
		agentSlug: 'otsenka-i-barter',
		rating: 5,
		description:
			'A rare low-mile Ford GT with original books, a crisp exterior, and collector-grade presentation.',
		features: ['Carbon fiber wheels', 'Akrapovic exhaust', 'Race seats', 'Front lift']
	},
	{
		slug: 'bmw-x6-electric',
		title: 'BMW X6 Electric',
		brand: 'BMW',
		model: 'X6',
		bodyType: 'SUV',
		condition: 'New',
		price: 78600,
		monthly: 840,
		year: 2024,
		mileage: 4200,
		fuel: 'EV',
		transmission: 'Automatic',
		engine: 'Electric AWD',
		exterior: 'Black Sapphire',
		interior: 'Tacora Red',
		location: daynightSite.location,
		vin: '5UXCY6C02R9',
		stockNumber: '166421',
		image: '/assets/images/card/card-55.jpg',
		images: ['/assets/images/card/card-55.jpg'],
		gallery: detailGallery,
		dealerSlug: 'daynight-auto-plovdiv',
		agentSlug: 'dokumenti-finansirane',
		rating: 4.6,
		description:
			'A sleek electric coupe SUV with rapid charging, premium cabin materials, and confident all-wheel drive.',
		features: ['Curved display', 'Harman Kardon audio', 'M Sport package', 'Gesture control']
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
