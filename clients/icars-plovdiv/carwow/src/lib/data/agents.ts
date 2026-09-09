import { daynightSite } from './daynight-site';
import { daynightTeam } from './daynight-team';

export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number;
	sales: number;
	bio: string;
}

export const agents: Agent[] = [
  {
    "slug": "prodazhbi-showroom",
    "name": "Оглед на автомобил",
    "title": "Контактна тема",
    "phone": "0885 595 555",
    "email": "",
    "image": "/dealer/logo-light.png",
    "rating": 0,
    "sales": 0,
    "bio": "Посочете автомобила и попитайте за наличността, мястото и часа за оглед."
  },
  {
    "slug": "barter-i-ocenka",
    "name": "Друг въпрос",
    "title": "Контактна тема",
    "phone": "0885 595 555",
    "email": "",
    "image": "/dealer/logo-light.png",
    "rating": 0,
    "sales": 0,
    "bio": "Попитайте дали автосалонът разглежда конкретното ви предложение. Приемане на бартер или изкупуване не се обещава."
  },
  {
    "slug": "dokumenti-finansirane",
    "name": "Документи и цена",
    "title": "Контактна тема",
    "phone": "0885 595 555",
    "email": "",
    "image": "/dealer/logo-light.png",
    "rating": 0,
    "sales": 0,
    "bio": "Поискайте конкретни документи и пълни условия за плащане. Този сайт не одобрява кредит."
  },
  {
    "slug": "klientski-zapitvania",
    "name": "Подготовка за контакт",
    "title": "Контактна тема",
    "phone": "0885 595 555",
    "email": "",
    "image": "/dealer/logo-light.png",
    "rating": 0,
    "sales": 0,
    "bio": "Подгответе въпросите си и използвайте публикувания телефон. Демо формите не изпращат съобщение."
  }
];

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
