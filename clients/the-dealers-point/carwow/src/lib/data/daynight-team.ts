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
		name: "Dealers Point",
		role: "Availability and viewing enquiries",
		phone: "+971 55 187 5094",
		email: "sales@tdp.ae",
		image: "/dealer-brand/logo-on-light.webp",
		bio: "Contact Dealers Point to confirm current availability, vehicle details, and viewing arrangements.",
		detail: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
