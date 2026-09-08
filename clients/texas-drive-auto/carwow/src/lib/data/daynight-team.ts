export const daynightTeamDisclosure = "No verified staff biographies or portraits are included in this preview.";

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

export const daynightTeam: DayNightTeamMember[] = [];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
