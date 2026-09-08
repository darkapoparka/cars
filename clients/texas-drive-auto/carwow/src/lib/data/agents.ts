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

export const agents: Agent[] = [
	{
		slug: 'prodazhbi-daynight-auto',
		name: daynightTeam[0]?.name ?? 'Texas Drive Auto Sales Team',
		title: daynightTeam[0]?.role ?? 'Sample sales profiles',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[0]?.image ?? daynightSite.logoDark,
		rating: 4.9,
		sales: daynightSite.inventoryCount,
		bio:
			daynightTeam[0]?.bio ??
			'Ask about vehicle selection, inspections, paperwork, and trade-in availability. No dealer financing or payment plans are offered.'
	},
	{
		slug: 'barter-i-ocenka',
		name: daynightTeam[1]?.name ?? 'Texas Drive Auto Trade-In Team',
		title: daynightTeam[1]?.role ?? 'Appraisal, purchase, and trade-in questions',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[1]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[1]?.bio ??
			'Ask whether the dealership buys vehicles or accepts trade-ins, and what an appraisal would require.'
	},
	{
		slug: 'dokumenti-finansirane',
		name: daynightTeam[2]?.name ?? 'Paperwork and buyer-arranged funding questions',
		title: daynightTeam[2]?.role ?? 'Paperwork and payment',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[2]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[2]?.bio ??
			'Ask about paperwork, registration, and next steps after choosing a vehicle. Funding must be arranged independently.'
	},
	{
		slug: 'klientski-zapitvania',
		name: daynightTeam[3]?.name ?? 'Customer inquiry preview',
		title: daynightTeam[3]?.role ?? 'Viewings and next steps',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[3]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[3]?.bio ??
			'Contact the dealership to confirm how to request a viewing and prepare for a visit.'
	}
];

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
