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
		name: "Астракар",
		role: "Запитвания за наличност и оглед",
		phone: "0899 908 040",
		email: "astracar_2006@abv.bg",
		image: "/assets/brand/logo-on-light.webp",
		bio: "Свържете се с Астракар, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Подбрани публикувани обяви. Наличностите и условията се потвърждават с Астракар. Свържете се с автокъщата преди посещение и потвърдете наличността."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
