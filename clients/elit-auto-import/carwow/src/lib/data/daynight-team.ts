export const daynightTeamDisclosure = "Общ контакт на автокъщата, а не именуван или независимо потвърден профил на служител." as const;

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
		slug: 'dealer-contact',
		name: "ELIT AUTO",
		role: "Запитвания за наличност и оглед",
		phone: "0887 777 887",
		email: "",
		image: "/assets/brand/logo-on-light.webp",
		bio: "Свържете се с ELIT AUTO, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани текущо рекламирани автомобили. Наличност, състояние, пробег и условия се потвърждават с продавача. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
