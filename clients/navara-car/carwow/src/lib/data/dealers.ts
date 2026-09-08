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
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/navara/vehicles/11786363468065195-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.8,
		specialties: ['Автомобили от обяви', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "Навара кар Документи и съдействие",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/navara/vehicles/11786363468065195-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "Навара кар Подбор на автомобил",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/navara/wordmark.svg',
		cover: '/navara/wordmark.svg',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
