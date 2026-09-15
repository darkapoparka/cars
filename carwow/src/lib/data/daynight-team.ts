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
		name: "Champion Auto Pro",
		role: "Запитвания за наличност и оглед",
		phone: "0885 072 555",
		email: "",
		image: "/variant-3/assets/champion/logo.png",
		bio: "Свържете се с Champion Auto Pro, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
