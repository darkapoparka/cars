import stock from './dealer-stock.json';

export type Car = {
	slug: string;
	title: string;
	shortTitle: string;
	brand: string;
	model: string;
	year: number;
	mileage: string;
	mileageValue: number;
	fuel: string;
	transmission: string;
	body: string;
	doors: number | string;
	engine: string;
	power: string;
	drive: string;
	color: string;
	price: number;
	priceEur: string;
	priceBgn: string;
 priceNote?: string;
	monthly: string;
	image: string;
	gallery: string[];
	badges: string[];
	conditionLine: string;
	description: string;
	features: string[];
	highlights: string[];
	lot: string;
	sourceUrl: string;
};

const number = (value: number) => new Intl.NumberFormat('bg-BG').format(value);
/** Exact same record IDs, photographs, tax notes and prices as the other designs. */
export const cars: Car[] = stock.vehicles.map((vehicle) => ({
 slug: vehicle.slug, title: vehicle.title, shortTitle: vehicle.make + ' ' + vehicle.model,
 brand: vehicle.make, model: vehicle.model, year: vehicle.year,
 mileage: number(vehicle.mileageKm) + ' км', mileageValue: vehicle.mileageKm,
 fuel: vehicle.fuelType === 'electric' ? 'Електрически' : vehicle.fuel,
 transmission: vehicle.transmission === 'Автоматична' ? 'Автоматик' : vehicle.transmission,
 body: vehicle.bodyLabel, doors: vehicle.doorsLabel,
 engine: vehicle.engineCc ? number(vehicle.engineCc) + ' см³' : 'Не е посочен',
 power: vehicle.powerHp ? number(vehicle.powerHp) + ' к.с.' : 'Не е посочена',
 drive: vehicle.equipment.includes('4x4') ? '4x4' : 'По запитване', color: vehicle.color,
 price: vehicle.priceEur, priceEur: vehicle.priceEur > 0 ? number(vehicle.priceEur) + ' €' : 'Цена при запитване',
 priceBgn: '', priceNote: vehicle.priceNote, monthly: 'Условия по запитване',
 image: vehicle.image, gallery: [...vehicle.gallery], badges: [vehicle.availabilityLabel],
 conditionLine: vehicle.priceNote + ' ' + vehicle.conditionNote,
 description: vehicle.description, features: [...vehicle.equipment],
 highlights: [vehicle.availabilityLabel, vehicle.priceNote], lot: vehicle.sourceId, sourceUrl: vehicle.sourceUrl
}));
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used' | 'unknown';
export type DayNightVehicleAvailability = 'available' | 'incoming';
// Availability filter keys are retained for compatibility; public badges are source-qualified.
export const getDayNightVehicleCondition = (vehicle: Pick<Car, 'slug'>): DayNightVehicleCondition => { const record = stock.vehicles.find((item) => item.slug === vehicle.slug); return record?.condition === 'new' ? 'new' : record?.condition === 'unknown' ? 'unknown' : 'used'; };
export const getDayNightVehicleAvailability = (vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => vehicle.highlights.some((value) => /очакван внос/i.test(value)) ? 'incoming' : 'available';
export const getDayNightVehicleBySlug = (slug: string) => daynightVehicles.find((vehicle) => vehicle.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
