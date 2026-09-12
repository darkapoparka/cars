import { daynightSite } from './daynight-site';
import { daynightTeam } from './daynight-team';

export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number | null;
	sales: number | null;
	bio: string;
}

export const agents: Agent[] = [
  {
    "slug": "kris-car-contact",
    "name": "Крис Кар",
    "title": "Публикуван контакт",
    "phone": "0885 232 858",
    "email": "",
    "image": "/dealer/brand/logo-light.png",
    "rating": null,
    "sales": null,
    "bio": "Информационна тема към същия публикуван контакт на Крис Кар, а не профил на отделен служител. Потвърдете автомобил, наличност и удобен час за посещение."
  },
  {
    "slug": "documents",
    "name": "История и документи",
    "title": "Тема за разговор",
    "phone": "0885 232 858",
    "email": "",
    "image": "/dealer/brand/logo-light.png",
    "rating": null,
    "sales": null,
    "bio": "Информационна тема към същия публикуван контакт на Крис Кар, а не профил на отделен служител. Поискайте сервизна история и документите за избрания автомобил."
  },
  {
    "slug": "financing",
    "name": "Финансиране",
    "title": "Тема за разговор",
    "phone": "0885 232 858",
    "email": "",
    "image": "/dealer/brand/logo-light.png",
    "rating": null,
    "sales": null,
    "bio": "Информационна тема към същия публикуван контакт на Крис Кар, а не профил на отделен служител. Обявите споменават лизингови възможности; попитайте за актуалните писмени условия и одобрение."
  },
  {
    "slug": "showroom",
    "name": "Адрес и работно време",
    "title": "Тема за разговор",
    "phone": "0885 232 858",
    "email": "",
    "image": "/dealer/brand/logo-light.png",
    "rating": null,
    "sales": null,
    "bio": "Информационна тема към същия публикуван контакт на Крис Кар, а не профил на отделен служител. Пон–Пет 09:00–19:00 · Съб 09:30–19:00 · Нед 10:00–16:00"
  }
];

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
