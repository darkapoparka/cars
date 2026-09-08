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
		slug: 'prodazhbi-showroom',
		name: "Екип продажби Приселци",
		role: 'Контакт за продажби',
		phone: "0886251705",
		email: '',
		image: '/assets/priselci/wordmark.svg',
		bio: 'Свържете се с автокъщата на публикувания телефон.',
		detail: 'Контактна тема, а не потвърден профил на отделен служител. Уточнете наличните услуги и условия по телефона.'
	},
	{
		slug: 'barter-i-ocenka',
		name: 'Въпрос за замяна',
		role: 'Възможността се потвърждава',
		phone: "0886251705",
		email: '',
		image: '/assets/priselci/wordmark.svg',
		bio: 'Свържете се с автокъщата на публикувания телефон.',
		detail: 'Контактна тема, а не потвърден профил на отделен служител. Уточнете наличните услуги и условия по телефона.'
	},
	{
		slug: 'dokumenti-finansirane',
		name: 'Въпроси за документи',
		role: 'Документи и финансиране',
		phone: "0886251705",
		email: '',
		image: '/assets/priselci/wordmark.svg',
		bio: 'Свържете се с автокъщата на публикувания телефон.',
		detail: 'Контактна тема, а не потвърден профил на отделен служител. Уточнете наличните услуги и условия по телефона.'
	},
	{
		slug: 'klientski-zapitvania',
		name: 'Уговорка за оглед',
		role: 'Огледи и следващи стъпки',
		phone: "0886251705",
		email: '',
		image: '/assets/priselci/wordmark.svg',
		bio: 'Свържете се с автокъщата на публикувания телефон.',
		detail: 'Контактна тема, а не потвърден профил на отделен служител. Уточнете наличните услуги и условия по телефона.'
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
