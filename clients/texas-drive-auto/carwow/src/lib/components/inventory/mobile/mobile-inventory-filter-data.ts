import type { SortKey } from '$lib/types/mobile-inventory';

type BrandLogoPath = `/assets/images/brand/${string}`;

export const brandLogos: Partial<Record<string, BrandLogoPath>> = {
	Audi: '/assets/images/brand/mobile/audi.svg',
	BMW: '/assets/images/brand/mobile/bmw.svg',
	Chevrolet: '/assets/images/brand/mobile/chevrolet.svg',
	Chrysler: '/assets/images/brand/mobile/chrysler.svg',
	Citroen: '/assets/images/brand/mobile/citroen.svg',
	Ford: '/assets/images/brand/mobile/ford.svg',
	Honda: '/assets/images/brand/mobile/honda.svg',
	Jaguar: '/assets/images/brand/mobile/jaguar.svg',
	'Land Rover': '/assets/images/brand/mobile/land-rover.svg',
	Mazda: '/assets/images/brand/mobile/mazda.svg',
	'Mercedes-Benz': '/assets/images/brand/brand-2.webp',
	Opel: '/assets/images/brand/mobile/opel.svg',
	Peugeot: '/assets/images/brand/mobile/peugeot.svg',
	Porsche: '/assets/images/brand/mobile/porsche.svg',
	Skoda: '/assets/images/brand/mobile/skoda.svg',
	VW: '/assets/images/brand/mobile/volkswagen.svg',
	Volvo: '/assets/images/brand/mobile/volvo.svg'
};

export const sortOptions: { value: SortKey; label: string }[] = [
	{ value: 'price-asc', label: 'Lowest price' },
	{ value: 'price-desc', label: 'Highest price' },
	{ value: 'year-desc', label: 'Newest year' },
	{ value: 'mileage-asc', label: 'Lowest mileage' }
];

export const sortChipLabels: Record<SortKey, string> = {
	'price-asc': 'Sort',
	'price-desc': 'Highest',
	'year-desc': 'Newest',
	'mileage-asc': 'Lowest mileage'
};

export const priceOptions = [
	{ value: 'under-10000', label: 'Up to 10 000 USD', limit: 10000 },
	{ value: 'under-20000', label: 'Up to 20 000 USD', limit: 20000 },
	{ value: 'under-30000', label: 'Up to 30 000 USD', limit: 30000 },
	{ value: 'under-50000', label: 'Up to 50 000 USD', limit: 50000 },
	{ value: 'over-50000', label: 'Over 50 000 USD', min: 50000 }
];

export const searchPriceSuggestions = priceOptions.slice(0, 4);

export const mileageOptions = [
	{ value: 'under-50000', label: 'Up to 50 000 miles', limit: 50000 },
	{ value: 'under-100000', label: 'Up to 100 000 miles', limit: 100000 },
	{ value: 'under-150000', label: 'Up to 150 000 miles', limit: 150000 },
	{ value: 'under-200000', label: 'Up to 200 000 miles', limit: 200000 }
];
