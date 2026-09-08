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

export const dealers: Dealer[] = [
	{
		slug: "day-night-auto-group",
		name: daynightSite.name,
		location: "София",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/assets/asko96/asko96-showroom.jpg',
		inventory: daynightSite.inventoryCount,
		rating: 4.8,
		specialties: ['Проверени автомобили', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "АСКО 96 Документи и съдействие",
		location: "София",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/assets/asko96/asko96-showroom.jpg',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "АСКО 96 Подбор на автомобил",
		location: "София",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/assets/asko96/asko96-wordmark.png',
		cover: '/assets/asko96/asko96-wordmark.png',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
