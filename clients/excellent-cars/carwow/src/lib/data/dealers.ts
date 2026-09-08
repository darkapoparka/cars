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
	rating: number | null;
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
		cover: '/assets/excellent/vehicle-01-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: null,
		specialties: ['Проверени автомобили', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "Excellent Cars Документи и съдействие",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/assets/excellent/vehicle-02-1.webp',
		inventory: daynightSite.inventoryCount,
		rating: null,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "Excellent Cars Подбор на автомобил",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/assets/excellent/logo-header.png',
		cover: '/assets/excellent/logo-header.png',
		inventory: daynightSite.inventoryCount,
		rating: null,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
