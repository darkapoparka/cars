import { agents, type Agent } from '$lib/data/agents';
import { listDayNightInquiries } from './db';

export type ManagedAgentStatus = 'active' | 'paused';

export type ManagedAgent = Agent & {
	assignedInquiryIds: string[];
	note: string;
	openInquiries: number;
	status: ManagedAgentStatus;
	updatedAt: string;
};

type ManagedAgentState = {
	note: string;
	status: ManagedAgentStatus;
	updatedAt: string;
};

const stamp = () => new Date().toISOString();

const agentState = new Map<string, ManagedAgentState>(
	agents.map((agent) => [
		agent.slug,
		{
			note: `${agent.title} is available for Day Night Auto customer follow-up.`,
			status: 'active',
			updatedAt: '2026-05-25T09:00:00.000Z'
		}
	])
);

export const normalizeManagedAgentStatus = (value: string | undefined) => {
	if (value === 'active' || value === 'paused') return value;

	return undefined;
};

const agentAssignments = (slug: string) =>
	listDayNightInquiries().filter(
		(inquiry) => inquiry.assignedAgentSlug === slug && inquiry.status !== 'closed'
	);

const managedAgentFromAgent = (agent: Agent): ManagedAgent => {
	const state = agentState.get(agent.slug) ?? {
		note: '',
		status: 'active' as const,
		updatedAt: '2026-05-25T09:00:00.000Z'
	};
	const assignments = agentAssignments(agent.slug);

	return {
		...agent,
		assignedInquiryIds: assignments.map((inquiry) => inquiry.id),
		note: state.note,
		openInquiries: assignments.length,
		status: state.status,
		updatedAt: state.updatedAt
	};
};

export const listManagedAgents = () => agents.map(managedAgentFromAgent);

export const updateManagedAgent = ({
	note,
	slug,
	status
}: {
	note?: string;
	slug: string;
	status?: ManagedAgentStatus;
}) => {
	const agent = agents.find((candidate) => candidate.slug === slug);

	if (!agent) return undefined;

	const current = agentState.get(slug) ?? {
		note: '',
		status: 'active' as const,
		updatedAt: '2026-05-25T09:00:00.000Z'
	};
	const next = {
		note: note === undefined ? current.note : note.trim(),
		status: status ?? current.status,
		updatedAt: stamp()
	};

	agentState.set(slug, next);

	return managedAgentFromAgent(agent);
};
