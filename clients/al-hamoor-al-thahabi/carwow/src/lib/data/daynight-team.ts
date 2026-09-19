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
		name: "Al Hamoor Al Thahabi",
		role: "Availability and viewing enquiries",
		phone: "+971 54 555 5204",
		email: "",
		image: "/dealer-brand/logo-on-light.webp",
		bio: "Contact Al Hamoor Al Thahabi to confirm current availability, vehicle details, and viewing arrangements.",
		detail: "Dated listing samples; confirm price and availability directly with the dealership. Independent design preview. Dated listing samples, not a live stock feed. Confirm availability, price, vehicle condition and location directly. No dealership approval or form delivery is implied."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
