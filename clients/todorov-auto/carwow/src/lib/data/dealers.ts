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
    "slug": "todorov-auto",
    "name": "Автосалон Тодоров",
    "location": "Бургас",
    "address": "Изгрев, ул. Транспортна, 5-ти километър",
    "phone": "0888 417 282",
    "logo": "/dealer/logo-light.png",
    "cover": "/dealer/stock/11763371717307272-1.webp",
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
