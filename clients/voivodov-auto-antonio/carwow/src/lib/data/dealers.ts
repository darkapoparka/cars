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
    "slug": "voivodov-auto-antonio",
    "name": "VOIVODOV AUTO & ANTONIO",
    "location": "Пловдив",
    "address": "кв. Въстанически — точният адрес се уточнява по телефона",
    "phone": "0899 813 628",
    "logo": "/dealer/logo-light.png",
    "cover": "/dealer/stock/21787584817368418-1.webp",
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
