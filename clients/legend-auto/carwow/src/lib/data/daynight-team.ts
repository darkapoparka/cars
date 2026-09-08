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
    "name": "LEGEND AUTO",
    "role": "Продажба на автомобили",
    "phone": "0899877305",
    "email": "",
    "image": "/assets/legend-auto/vehicle-01-1.webp",
    "bio": "Автокъща въвъв Варна. За информация се обадете на 0899 877 305.",
    "detail": "бул. Цар Освободител 289, срещу МАКАО, Варна. Понеделник – събота: 09:00–17:30 · Неделя: почивен ден. Потвърдете наличността преди посещение."
  },
  {
    "slug": "barter-i-ocenka",
    "name": "LEGEND AUTO",
    "role": "Въпрос за автомобил",
    "phone": "0899877305",
    "email": "",
    "image": "/assets/legend-auto/vehicle-02-1.webp",
    "bio": "Автокъща въвъв Варна. За информация се обадете на 0899 877 305.",
    "detail": "бул. Цар Освободител 289, срещу МАКАО, Варна. Понеделник – събота: 09:00–17:30 · Неделя: почивен ден. Потвърдете наличността преди посещение."
  },
  {
    "slug": "dokumenti-finansirane",
    "name": "LEGEND AUTO",
    "role": "Условия за покупка",
    "phone": "0899877305",
    "email": "",
    "image": "/assets/legend-auto/vehicle-03-1.webp",
    "bio": "Автокъща въвъв Варна. За информация се обадете на 0899 877 305.",
    "detail": "бул. Цар Освободител 289, срещу МАКАО, Варна. Понеделник – събота: 09:00–17:30 · Неделя: почивен ден. Потвърдете наличността преди посещение."
  },
  {
    "slug": "klientski-zapitvania",
    "name": "LEGEND AUTO",
    "role": "Уговорете оглед",
    "phone": "0899877305",
    "email": "",
    "image": "/assets/legend-auto/vehicle-04-1.webp",
    "bio": "Автокъща въвъв Варна. За информация се обадете на 0899 877 305.",
    "detail": "бул. Цар Освободител 289, срещу МАКАО, Варна. Понеделник – събота: 09:00–17:30 · Неделя: почивен ден. Потвърдете наличността преди посещение."
  }
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
