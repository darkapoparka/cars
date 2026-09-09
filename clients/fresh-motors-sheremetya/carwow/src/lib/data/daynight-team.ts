export const daynightTeamDisclosure = "Теми за разговор на един и същ публикуван телефон. Не са представени отделни служители или измислени лични профили.";

export type DayNightTeamMember = {
	slug: string;
	name: string;
	role: string;
	phone: string;
	email: string;
	image: string;
	bio: string;
	detail: string;
};

export const daynightTeam: DayNightTeamMember[] = [
  {
    "slug": "prodazhbi-showroom",
    "name": "Обяви и наличност",
    "role": "Общ телефон на FRESH MOTORS",
    "phone": "0879975969",
    "email": "",
    "image": "/dealer/stock/21785176725815752-1.webp",
    "bio": "Попитайте за конкретен автомобил от селекцията. Наличността и актуалният пробег се уточняват с продавача.",
    "detail": "Попитайте за конкретен автомобил от селекцията. Наличността и актуалният пробег се уточняват с продавача."
  },
  {
    "slug": "barter-i-ocenka",
    "name": "Въпрос за вашия автомобил",
    "role": "Общ телефон на FRESH MOTORS",
    "phone": "0879975969",
    "email": "",
    "image": "/dealer/stock/11788155451115148-1.webp",
    "bio": "Обсъдете с FRESH MOTORS дали може да разгледа предложение за замяна. Тази демонстрация не представлява оценка или прието предложение.",
    "detail": "Обсъдете с FRESH MOTORS дали може да разгледа предложение за замяна. Тази демонстрация не представлява оценка или прието предложение."
  },
  {
    "slug": "dokumenti-finansirane",
    "name": "Условия за лизинг",
    "role": "Общ телефон на FRESH MOTORS",
    "phone": "0879975969",
    "email": "",
    "image": "/dealer/stock/11781244991826508-1.webp",
    "bio": "Обявите споменават лизинг, но условията и доставчикът се уточняват отделно. Демото не дава кредитно одобрение.",
    "detail": "В обявите FRESH MOTORS посочва съдействие за финансиране. Попитайте за писмени индивидуални условия; няма обещано или автоматично одобрение."
  },
  {
    "slug": "klientski-zapitvania",
    "name": "Оглед в обл. Велико Търново",
    "role": "Общ телефон на FRESH MOTORS",
    "phone": "0879975969",
    "email": "",
    "image": "/dealer/stock/21783576446638408-1.webp",
    "bio": "Преди посещение уточнете автомобила, точната точка за среща и удобния час по публикувания телефон.",
    "detail": "Преди посещение уточнете автомобила, точната точка за среща и удобния час по публикувания телефон."
  }
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
