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
    "slug": "kris-car-plovdiv",
    "name": "Крис Кар",
    "location": "Пловдив",
    "address": "Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив",
    "phone": "0885 232 858",
    "logo": "/dealer/brand/logo-light.png",
    "cover": "/dealer/stock/11788863173361582-1.webp",
    "inventory": 8,
    "rating": null,
    "specialties": [
      "Публикувани обяви",
      "Оглед по уговорка",
      "Финансиране по запитване"
    ]
  }
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
