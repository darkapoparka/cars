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
    "role": "Общ телефон на Slavi Cars",
    "phone": "0895714484",
    "email": "",
    "image": "/dealer/stock/21784972577846700-1.webp",
    "bio": "Попитайте за конкретен автомобил от селекцията. Наличността и актуалният пробег се уточняват с продавача.",
    "detail": "Попитайте за конкретен автомобил от селекцията. Наличността и актуалният пробег се уточняват с продавача."
  },
  {
    "slug": "barter-i-ocenka",
    "name": "Въпрос за вашия автомобил",
    "role": "Общ телефон на Slavi Cars",
    "phone": "0895714484",
    "email": "",
    "image": "/dealer/stock/21783616523271437-1.webp",
    "bio": "Обсъдете с Slavi Cars дали може да разгледа предложение за замяна. Тази демонстрация не представлява оценка или прието предложение.",
    "detail": "Обсъдете с Slavi Cars дали може да разгледа предложение за замяна. Тази демонстрация не представлява оценка или прието предложение."
  },
  {
    "slug": "dokumenti-finansirane",
    "name": "Условия за лизинг",
    "role": "Общ телефон на Slavi Cars",
    "phone": "0895714484",
    "email": "",
    "image": "/dealer/stock/21781031373368322-1.webp",
    "bio": "Сайтът описва съдействие за финансиране, не собствен лизинг. Условията се уточняват с доставчика. Няма автоматично одобрение в демото.",
    "detail": "В обявите Slavi Cars посочва съдействие за финансиране. Попитайте за писмени индивидуални условия; няма обещано или автоматично одобрение."
  },
  {
    "slug": "klientski-zapitvania",
    "name": "Оглед в път E79",
    "role": "Общ телефон на Slavi Cars",
    "phone": "0895714484",
    "email": "",
    "image": "/dealer/stock/11788507328571944-1.webp",
    "bio": "Преди посещение уточнете автомобила, точната точка за среща и удобния час по публикувания телефон.",
    "detail": "Преди посещение уточнете автомобила, точната точка за среща и удобния час по публикувания телефон."
  }
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
