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
		location: "Пловдив",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/dealer/11701247770704576-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.8,
		specialties: ['Обявени автомобили', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "K-G Team Auto Документи и съдействие",
		location: "Пловдив",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/dealer/11782979504874945-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "K-G Team Auto Подбор на автомобил",
		location: "Пловдив",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/dealer/logo.png',
		cover: '/dealer/logo.png',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
