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
    "slug": "fresh-motors-sheremetya",
    "name": "FRESH MOTORS",
    "location": "Шереметя",
    "address": "с. Шереметя, обл. Велико Търново",
    "phone": "0879 975 969",
    "logo": "/dealer/brand/logo-light.png",
    "cover": "/dealer/stock/21785176725815752-1.webp",
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
