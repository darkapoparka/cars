import { eliqautoAssets, eliqautoContact } from './eliqauto';
import { vehicles } from './vehicles';

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
		slug: 'eliqauto-sofia',
		name: 'Eliqauto',
		location: eliqautoContact.addressLabel,
		address: `${eliqautoContact.addressLabel}. ${eliqautoContact.appointmentNote}.`,
		phone: eliqautoContact.primaryPhoneLabel,
		logo: eliqautoAssets.logoDark,
		cover: eliqautoAssets.hero,
		inventory: vehicles.length,
		rating: 4.9,
		specialties: ['Premium imports', 'Verified history', 'Documents', 'Client vehicles']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
