import type { Agent } from '$lib/data/agents';
import { eliqautoContact } from '$lib/data/eliqauto';

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
	{ href: eliqautoContact.facebookHref, icon: 'input-facebook.svg', label: 'Facebook' },
	{ href: eliqautoContact.viberHref, icon: 'ChatCircleDots.svg', label: 'Viber' },
	{ href: eliqautoContact.youtubeHref, icon: 'input-youtube.svg', label: 'YouTube' },
	{ href: eliqautoContact.emailHref, icon: 'input-telegram.svg', label: 'Email' }
];

export const agentCardsFromAgents = (agents: Agent[]): AuxeroAgentCard[] =>
	agents.map((agent, index) => ({
		active: index === 1,
		emailHref: eliqautoContact.emailHref,
		image: agent.image,
		name: agent.name,
		phoneHref: eliqautoContact.primaryPhoneHref,
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
			emailHref: eliqautoContact.emailHref,
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
			phoneHref: eliqautoContact.primaryPhoneHref,
			slug: agent.slug,
			socials: agentSocials(),
			title: agent.title
		};
	});
