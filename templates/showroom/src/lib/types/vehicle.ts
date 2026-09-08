export type VehicleCondition = 'New' | 'Used' | 'Certified';

export type SortKey = 'template' | 'lowest' | 'highest' | 'newest' | 'mileage' | 'year';

export type Vehicle = {
	slug: string;
	title: string;
	brand: string;
	model: string;
	bodyType: string;
	condition: VehicleCondition;
	price: number;
	priceLabel: string;
	priceBgn: string;
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
	sourceUrl: string;
	isClientVehicle: boolean;
};

export type InventoryFilters = {
	query?: string;
	brand?: string;
	bodyType?: string;
	condition?: VehicleCondition | 'All';
	maxPrice?: number;
	minPrice?: number;
	minYear?: number;
	maxYear?: number;
	minMileage?: number;
	maxMileage?: number;
	feature?: string;
	fuel?: string;
	location?: string;
	sourceId?: string;
	status?: string;
	transmission?: string;
};
