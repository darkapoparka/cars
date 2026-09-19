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
		name: "Иво Ауто",
		role: "Запитвания за наличност и оглед",
		phone: "0878 720 035",
		email: "",
		image: "/dealer-brand/logo-on-light.webp",
		bio: "Свържете се с Иво Ауто, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани публикувани обяви; наличностите и условията се потвърждават с Иво Ауто. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
