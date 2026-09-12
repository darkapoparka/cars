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
		cover: '/variant-3/brand/daynight-hero-search-composed.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.8,
		specialties: ['Проверени автомобили', 'Оглед с уговорка', 'Финансиране']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "Перфект Ауто Документи и съдействие",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/variant-3/brand/daynight-hero-mobile-search-composed.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Документи', 'Регистрация', 'Съдействие']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "Перфект Ауто Подбор на автомобил",
		location: "Варна",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/variant-3/brand/daynight-logo-generated.png',
		cover: '/variant-3/brand/daynight-logo-generated.png',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Търсене по заявка', 'Оглед', 'Консултация']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
