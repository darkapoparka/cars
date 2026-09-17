export const daynightTeamDisclosure = "Generic dealership contact, not a named or independently verified staff profile." as const;

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
		name: "Texas Drive Auto",
		role: "Availability and viewing enquiries",
		phone: "(214) 972-3233",
		email: "",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Contact Texas Drive Auto to confirm current availability, vehicle details, and viewing arrangements.",
		detail: "Dated listing samples; confirm price and availability directly with the dealership. Contact the showroom before travelling and confirm availability."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
