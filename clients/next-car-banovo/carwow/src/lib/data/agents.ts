import { daynightSite } from './daynight-site';
import { daynightTeam } from './daynight-team';
export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number;
	sales: number;
	bio: string;
}
export const agents: Agent[] = daynightTeam.map((topic, index) => ({
 slug: index === 0 ? 'dealer-contact' : topic.slug, name: topic.name, title: topic.role, phone: daynightSite.phoneLabel,
 email: '', image: daynightSite.logoDark, rating: 0, sales: 0, bio: topic.bio
}));
export function getAgentBySlug(slug: string) { return agents.find((agent) => agent.slug === slug) ?? (slug === 'prodazhbi-daynight-auto' ? agents[0] : undefined); }
