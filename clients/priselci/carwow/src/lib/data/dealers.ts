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
		cover: '/assets/priselci/vehicle-05-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 0,
		specialties: ['Автомобили от обяви', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "Приселци Документи и съдействие",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/assets/priselci/vehicle-05-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: 0,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "Приселци Подбор на автомобил",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/assets/priselci/wordmark.svg',
		cover: '/assets/priselci/wordmark.svg',
		inventory: daynightSite.inventoryCount,
		rating: 0,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
