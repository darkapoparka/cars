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
		image: "/assets/asko96/asko96-logo.png",
		bio: "Свържете се с АСКО 96, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани автомобили от публикуваните обяви. Наличностите и условията се потвърждават с АСКО 96. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
