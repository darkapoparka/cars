import { daynightSite } from './daynight-site';
import { daynightTeam } from './daynight-team';

export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number | null;
	sales: number | null;
	bio: string;
}

export const agents: Agent[] = daynightTeam.map(topic=>({slug:topic.slug,name:topic.name,title:topic.role,phone:daynightSite.phoneLabel,email:'',image:topic.image,rating:null,sales:null,bio:topic.bio}));

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
