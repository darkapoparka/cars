import { daynightSite } from './daynight-site';
import stock from './dealer-stock.json';
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
export const dealers: Dealer[] = [{
 slug: stock.facts.slug, name: daynightSite.name, location: stock.facts.city, address: daynightSite.location, phone: daynightSite.phoneLabel,
 logo: daynightSite.logoDark, cover: stock.vehicles[0].image, inventory: stock.vehicles.length, rating: 0,
 specialties: ['Публикувани автомобили', 'Наличност по запитване', 'Оглед след потвърждение']
}];
export function getDealerBySlug(slug: string) {
 return dealers.find((dealer) => dealer.slug === slug) ?? (/^day[-]?night/.test(slug) ? dealers[0] : undefined);
}
