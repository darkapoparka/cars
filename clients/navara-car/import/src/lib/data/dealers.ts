import { daynightAssets, daynightBrand, daynightContact } from './daynight';
import { vehicles } from './vehicles';

export interface Dealer {
	slug: string;
	name: string;
	location: string;
	address: string;
	phone: string;
	logo: string;
	cover: string;
	inventory: number;
	rating: number;
	specialties: string[];
}

export const dealers: Dealer[] = [
	{
		slug: "navara-car",
		name: daynightBrand.name,
		location: daynightContact.addressLabel,
		address: daynightContact.addressLabel + '. ' + daynightContact.appointmentNote + '.',
		phone: daynightContact.primaryPhoneLabel,
		logo: daynightAssets.logoDark,
		cover: daynightAssets.hero,
		inventory: vehicles.length,
		rating: 0,
		specialties: ["Продажба на автомобили","Съдействие за регистрация","Лизинг по запитване"]
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
