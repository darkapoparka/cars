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
		name: "Перфект Ауто",
		role: "Запитвания за наличност и оглед",
		phone: "0888 802 226",
		email: "",
		image: "/assets/perfect-auto/cover.png",
		bio: "Свържете се с Перфект Ауто, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Представителни обяви към 10.09.2026 г. Потвърдете наличността и условията по телефона. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
