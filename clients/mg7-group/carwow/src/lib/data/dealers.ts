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
    "slug": "mg7-group",
    "name": "MG7 Group",
    "location": "Бургас",
    "address": "Северна промишлена зона, ул. Атанас Буров 7",
    "phone": "0876 277 777",
    "logo": "/dealer/logo-light.png",
    "cover": "/dealer/stock/21785564544332885-1.webp",
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
