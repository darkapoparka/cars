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
		name: "Navara Car",
		role: "Запитвания за наличност и оглед",
		phone: "0899 192 300",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с Navara Car, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Селекция от обяви към 08.09.2026 г., а не складова наличност в реално време. Потвърдете цената, наличността и данните с продавача. Свържете се с автокъщата преди посещение и потвърдете наличността. Демонстрационен сайт за преглед — не е официален канал на автокъщата."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
