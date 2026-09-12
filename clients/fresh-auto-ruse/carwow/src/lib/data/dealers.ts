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

export const dealers: Dealer[] = [{slug:'day-night-auto-group',name:daynightSite.name,location:daynightSite.locationShort,address:daynightSite.location,phone:daynightSite.phoneLabel,logo:daynightSite.logoDark,cover:"/dealer/stock/11786096960383049-1.webp",inventory:daynightSite.inventoryCount,rating:0,specialties:['Публикувани обяви','Оглед след потвърждение','Условия по конкретната обява']}];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug) ?? (['daynight-auto-plovdiv','daynight-auto-sourcing','day-night-auto-group-documents','day-night-auto-group-sourcing'].includes(slug) ? dealers[0] : undefined);
}
