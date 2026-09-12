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
    "slug": "slavi-cars",
    "name": "Slavi Cars",
    "location": "Дупница",
    "address": "път E79, след отбивката за Блатино, Дупница",
    "phone": "0895 714 484",
    "logo": "/dealer/brand/logo-light.png",
    "cover": "/dealer/stock/21784972577846700-1.webp",
    "inventory": 8,
    "rating": null,
    "specialties": [
      "Обяви за автомобили",
      "Оглед след уточнение",
      "Лизинг по индивидуални условия"
    ]
  }
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug || ['daynight-auto-plovdiv','day-night-auto-group','daynight-auto-sourcing'].includes(slug));
}
