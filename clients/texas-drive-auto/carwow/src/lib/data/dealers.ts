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
		location: "Dallas",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/brand/daynight-hero-search-composed.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.8,
		specialties: ['Ask about vehicle inspections', 'Viewing by appointment', 'Buyer-arranged funding']
	},
	{
		slug: "day-night-auto-group-documents",
		name: "Texas Drive Auto Paperwork and assistance",
		location: "Dallas",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: daynightSite.logoDark,
		cover: '/brand/daynight-hero-mobile-search-composed.webp',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Paperwork', 'Registration', 'Assistance']
	},
	{
		slug: "day-night-auto-group-sourcing",
		name: "Texas Drive Auto Vehicle selection",
		location: "Dallas",
		address: daynightSite.location,
		phone: daynightSite.phoneLabel,
		logo: '/brand/daynight-logo-generated.png',
		cover: '/brand/daynight-logo-generated.png',
		inventory: daynightSite.inventoryCount,
		rating: 4.7,
		specialties: ['Vehicle search inquiry', 'Viewing', 'Consultation']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
