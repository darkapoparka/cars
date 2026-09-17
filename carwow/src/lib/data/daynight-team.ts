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
		name: "Приселци",
		role: "Запитвания за наличност и оглед",
		phone: "0886 251 705",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с Приселци, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
