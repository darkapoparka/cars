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
    "slug": "icars-plovdiv",
    "name": "icars",
    "location": "Пловдив",
    "address": "ул. Напредък 1, Индустриална зона — Север",
    "phone": "0885 595 555",
    "logo": "/dealer/logo-light.png",
    "cover": "/dealer/stock/11760378435449508-1.webp",
    "inventory": 10,
    "rating": 0,
    "specialties": [
      "Публични обяви",
      "Контакт по телефона",
      "Оглед след потвърждение"
    ]
  }
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
