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
		name: "IS AUTO",
		role: "Запитвания за наличност и оглед",
		phone: "0899 266 666",
		email: "varna@isauto.net",
		image: "/dealer-brand/logo-on-light.webp",
		bio: "Свържете се с IS AUTO, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Датирана извадка от публичните обяви към 16.09.2026 г.; потвърдете цената и наличността директно с IS AUTO Varna. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
