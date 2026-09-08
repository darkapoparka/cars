import { daynightSite } from './daynight-site';

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

export const dealers: Dealer[] = [{slug:'ivo-auto',name:daynightSite.name,location:'Варна',address:daynightSite.location,phone:daynightSite.phoneLabel,logo:daynightSite.logoDark,cover:'/assets/ivo-auto/vehicle-01-1.webp',inventory:16,rating:0,specialties:['Автомобили','Бартер според обявата','Лизинг според обявата']}];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
