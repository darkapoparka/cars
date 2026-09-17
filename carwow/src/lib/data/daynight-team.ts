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
		name: "Excellent Cars",
		role: "Запитвания за наличност и оглед",
		phone: "0895 996 559",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с Excellent Cars, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
