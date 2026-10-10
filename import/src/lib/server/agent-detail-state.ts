import { agents, getAgentBySlug, type Agent } from '$lib/data/agents';
import { vehicles, type Vehicle } from '$lib/data/vehicles';

export type AgentInventoryState = {
	count: number;
	vehicles: Vehicle[];
};

export const agentDetailFallbackSlug = agents[0]?.slug ?? 'daynight-sales';

export const listAgentDetails = () => agents;

export const getAgentDetailBySlug = (slug: string) => getAgentBySlug(slug);

export const getAgentDetailOrFallback = (slug?: string) =>
	getAgentBySlug(slug ?? agentDetailFallbackSlug) ?? agents[0];

export const getAgentInventoryState = (agent: Agent, limit = 3): AgentInventoryState => {
	const matchingVehicles = vehicles.filter((vehicle) => vehicle.agentSlug === agent.slug);
	const visibleVehicles = matchingVehicles.slice(0, limit);
	const fallbackVehicles = vehicles.slice(0, limit);

	return {
		count: matchingVehicles.length || vehicles.length,
		vehicles: visibleVehicles.length ? visibleVehicles : fallbackVehicles
	};
};
