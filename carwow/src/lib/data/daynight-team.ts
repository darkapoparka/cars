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
		name: "АСКО 96",
		role: "Запитвания за наличност и оглед",
		phone: "0899 76 96 96",
		email: "askogroup@abv.bg",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с АСКО 96, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани автомобили от публикуваните обяви. Наличностите и условията се потвърждават с АСКО 96. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
