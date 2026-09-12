import { currentDayNightListings, type CurrentDayNightListing } from './daynight-current-inventory';

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
	doors: number | null;
	engine: string;
	power: string;
	drive: string;
	color: string;
	price: number;
	priceEur: string;
	priceBgn: string;
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

const parseLocalizedNumber=(value:string)=>Number(value.replace(/[^0-9.,]/g,'').replace(',','.'));
const listingToVehicle=(listing:CurrentDayNightListing):Car=>({slug:listing.slug,title:listing.title,shortTitle:listing.title,brand:listing.brand,model:listing.model,year:Number(listing.date.match(/(?:19|20)[0-9]{2}/)?.[0]),mileage:listing.mileage,mileageValue:parseLocalizedNumber(listing.mileage),fuel:listing.fuel,transmission:listing.transmission,body:listing.body,doors:null,engine:listing.engine,power:listing.power,drive:listing.features.includes('4x4')?'4x4':'—',color:listing.color,price:parseLocalizedNumber(listing.priceEur),priceEur:listing.priceEur,priceBgn:listing.priceBgn,monthly:'Условия по запитване',image:listing.image,gallery:listing.gallery,badges:[listing.status],conditionLine:'Обява към 09.09.2026 — потвърдете наличността с Крис Кар.',description:listing.notes+' '+listing.taxText,features:listing.features,highlights:['Наличност за потвърждение',listing.power],lot:'KC-'+listing.id.slice(-6),sourceUrl:listing.sourceUrl});
export const cars = currentDayNightListings.map(listingToVehicle);
export const daynightVehicles = cars;

export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming' | 'unconfirmed';

export const getDayNightVehicleCondition = (
	vehicle: Pick<Car, 'mileageValue'>
): DayNightVehicleCondition => (vehicle.mileageValue <= 100 ? 'new' : 'used');

export const getDayNightVehicleAvailability = (
	vehicle: Pick<Car, 'highlights'>
): DayNightVehicleAvailability =>
	vehicle.highlights.some((highlight) => /очакван внос/i.test(highlight))
		? 'incoming'
		: 'unconfirmed';

export const getDayNightVehicleBySlug = (slug: string) =>
	daynightVehicles.find((car) => car.slug === slug);

export const placeholderImageSlugs = new Set<string>();

export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
