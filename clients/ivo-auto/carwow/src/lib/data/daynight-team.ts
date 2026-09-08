export type DayNightTeamMember = {
	slug: string;
	name: 'Контакт с Иво Ауто',
	role: string;
	phone: string;
	email: string;
	image: string;
	bio: string;
	detail: string;
};

export const daynightTeam: DayNightTeamMember[] = [
	{
		slug: 'prodazhbi-showroom',
		name: 'Контакт с Иво Ауто',
		role: 'Консултант продажби',
		phone: "0878720035",
		email: '',
		image: '/assets/ivo-auto/vehicle-01-1.webp',
		bio: 'Попитайте за публикуваните автомобили и условията за оглед.',
		detail: 'Свържете се с Иво Ауто по телефона, за да уточните наличността, оборудването и условията.'
	},
	{
		slug: 'barter-i-ocenka',
		name: 'Контакт с Иво Ауто',
		role: 'Оценка, покупка и бартер',
		phone: "0878720035",
		email: '',
		image: '/assets/ivo-auto/vehicle-01-1.webp',
		bio: 'Попитайте за публикуваните автомобили и условията за оглед.',
		detail: 'Свържете се с Иво Ауто по телефона, за да уточните наличността, оборудването и условията.'
	},
	{
		slug: 'dokumenti-finansirane',
		name: 'Контакт с Иво Ауто',
		role: 'Документи и финансиране',
		phone: "0878720035",
		email: '',
		image: '/assets/ivo-auto/vehicle-01-1.webp',
		bio: 'Попитайте за публикуваните автомобили и условията за оглед.',
		detail: 'Свържете се с Иво Ауто по телефона, за да уточните наличността, оборудването и условията.'
	},
	{
		slug: 'klientski-zapitvania',
		name: 'Контакт с Иво Ауто',
		role: 'Огледи и следващи стъпки',
		phone: "0878720035",
		email: '',
		image: '/assets/ivo-auto/vehicle-01-1.webp',
		bio: 'Попитайте за публикуваните автомобили и условията за оглед.',
		detail: 'Свържете се с Иво Ауто по телефона, за да уточните наличността, оборудването и условията.'
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
