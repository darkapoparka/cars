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
		name: "Аутолайф",
		role: "Запитвания за наличност и оглед",
		phone: "0895 766 736",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с Аутолайф, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Представителна извадка от 16 публикувани обяви; наличност и цена се потвърждават по телефона. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
