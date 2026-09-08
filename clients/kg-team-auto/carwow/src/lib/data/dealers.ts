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

// One unclaimed preview profile; rating 0 denotes no confirmed rating, not a customer score.
export const dealers: Dealer[] = [
  {
    "slug": "kg-team-auto",
    "name": "K-G Team Auto",
    "location": "Пловдив",
    "address": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
    "phone": "0877 34 62 62",
    "logo": "/dealer/logo.png",
    "cover": "/dealer/11783754278742708-1.webp",
    "inventory": 10,
    "rating": 0,
    "specialties": [
      "Датирани обяви",
      "Пловдив",
      "Потвърдете наличността"
    ]
  }
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
