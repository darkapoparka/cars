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
		name: "F1rst Motors",
		role: "Availability and viewing enquiries",
		phone: "+971 4 320 1030",
		email: "info@f1rstmotors.com",
		image: "/variant-3/assets/brand/logo-on-light.webp",
		bio: "Contact F1rst Motors to confirm current availability, vehicle details, and viewing arrangements.",
		detail: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages. Contact the showroom before travelling and confirm availability. F1rst Motors terms state that site logos/images/content require prior written consent. The committed branding and stock illustrations are internal proposal concepts, not copied official assets."
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
