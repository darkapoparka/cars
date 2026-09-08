import type { Agent } from '$lib/data/agents';
import { daynightContact } from '$lib/data/daynight';

export type AuxeroAgentSocialLink = {
	href: string;
	icon: string;
	label: string;
};

export type AuxeroAgentCard = {
	active: boolean;
	emailHref: string;
	image: string;
	management?: {
		assignedLeadsHref: '/admin/inquiries?role=admin';
		assignedLeadsLabel: string;
		messagesHref: '/admin/messages?role=admin';
		note: string;
		status: string;
		statusText: string;
	};
	name: string;
	phoneHref: string;
	slug: string;
	socials: AuxeroAgentSocialLink[];
	title: string;
};

type AgentLike = Agent & {
	note?: string;
	openInquiries?: number;
	status?: 'active' | 'paused';
};

const agentSocials = (): AuxeroAgentSocialLink[] => [
	{ href: daynightContact.facebookHref, icon: 'input-facebook.svg', label: 'Facebook' },
	{ href: daynightContact.viberHref, icon: 'ChatCircleDots.svg', label: 'Viber' },
	{ href: daynightContact.youtubeHref, icon: 'input-youtube.svg', label: 'YouTube' },
	{ href: daynightContact.emailHref, icon: 'input-telegram.svg', label: 'Email' }
];

export const agentCardsFromAgents = (agents: Agent[]): AuxeroAgentCard[] =>
	agents.map((agent, index) => ({
		active: index === 1,
		emailHref: daynightContact.emailHref,
		image: agent.image,
		name: agent.name,
		phoneHref: daynightContact.primaryPhoneHref,
		slug: agent.slug,
		socials: agentSocials(),
		title: agent.title
	}));

export const managedAgentCardsFromAgents = (agents: AgentLike[]): AuxeroAgentCard[] =>
	agents.map((agent, index) => {
		const openInquiries = agent.openInquiries ?? 0;
		const status = agent.status ?? 'active';

		return {
			active: index === 1,
			emailHref: daynightContact.emailHref,
			image: agent.image,
			management: {
				assignedLeadsHref: '/admin/inquiries?role=admin',
				assignedLeadsLabel: `Assigned Leads (${openInquiries})`,
				messagesHref: '/admin/messages?role=admin',
				note: agent.note ?? '',
				status,
				statusText: `${status === 'active' ? 'Active' : 'Paused'} · ${openInquiries} open leads`
			},
			name: agent.name,
			phoneHref: daynightContact.primaryPhoneHref,
			slug: agent.slug,
			socials: agentSocials(),
			title: agent.title
		};
	});
