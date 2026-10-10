import { daynightBrand, daynightConsultants, daynightContact } from './daynight';
import type { Agent } from '$lib/types/agent';

export type { Agent } from '$lib/types/agent';

export const agents: Agent[] = daynightConsultants.map((consultant) => ({
	slug: consultant.slug,
	name: consultant.name,
	title: consultant.title,
	phone: daynightContact.primaryPhoneLabel,
	email: daynightContact.emailLabel,
	image: consultant.image,
	rating: 0,
	sales: 0,
	bio: daynightBrand.legalNote
}));

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
