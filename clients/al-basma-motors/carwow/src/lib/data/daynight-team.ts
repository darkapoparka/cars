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
		name: "Al Basma",
		role: "Availability and viewing enquiries",
		phone: "+971 54 342 2222",
		email: "admin@albasmamotors.com",
		image: "/assets/brand/logo-on-light.webp",
		bio: "Contact Al Basma to confirm current availability, vehicle details, and viewing arrangements.",
		detail: "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered. Contact the showroom before travelling and confirm availability."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
