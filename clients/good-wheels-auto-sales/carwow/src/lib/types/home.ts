import type { Car } from '$lib/data/daynight-vehicles';

export type HomePageHeadData = {
	title: string;
	description?: string;
};

// Which home layout the server renders first, decided from the request
// User-Agent. The client corrects it from the real viewport after mount.
export type HomeInitialViewport = 'mobile' | 'desktop';

export type HomeMobileVehicle = {
	slug: string;
	shortTitle: string;
	brand: string;
	model: string;
	year: number;
	mileage: string;
	fuel: string;
	transmission: string;
	image: string;
	priceEur: string;
	badges: string[];
	conditionLine: string;
};

export type HomeMobileBudgetTile = {
	label: string;
	value: string;
	count: number;
	image: string;
	caption?: string;
	variant?: 'price' | 'open';
};

export type HomeMobileBrandTile = {
	brand: string;
	count: number;
};

export type HomeMobileModelOption = {
	model: string;
	brands: string[];
	count: number;
};

export type HomeMobileData = {
	brands: string[];
	models: string[];
	modelOptions: HomeMobileModelOption[];
	bodyTypes: string[];
	featuredCars: HomeMobileVehicle[];
	bodyTiles: { body: string; count: number }[];
	brandTiles: HomeMobileBrandTile[];
	budgetTiles: HomeMobileBudgetTile[];
	total: number;
};

export type HomeDesktopVehicle = Car;

export type HomeDesktopData = {
	vehicles: HomeDesktopVehicle[];
};
