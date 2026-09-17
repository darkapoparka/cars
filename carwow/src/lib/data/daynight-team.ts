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
		name: "K-G Team Auto",
		role: "Запитвания за наличност и оглед",
		phone: "+359877346262",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Свържете се с K-G Team Auto, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.",
		detail: "Датирани примерни обяви, не потвърдена наличност. Проверете цена, състояние и местоположение при продавача. Свържете се с автокъщата преди посещение и потвърдете наличността. Unapproved, unpublished prospect concept. No dealer agreement or media permission evidenced."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
