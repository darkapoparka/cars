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
    "slug": "success-automobile",
    "name": "Success Automobile",
    "location": "Пловдив",
    "address": "Цариградско шосе, Индустриална зона — Тракия",
    "phone": "0877 333 433",
    "logo": "/dealer/logo-light.png",
    "cover": "/dealer/stock/11788284441880300-1.webp",
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
