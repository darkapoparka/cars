import {
	listManagedAgents,
	normalizeManagedAgentStatus,
	updateManagedAgent
} from '$lib/server/agents';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';

const optionalPayloadString = (payload: Record<string, unknown>, ...keys: string[]) => {
	for (const key of keys) {
		const value = payload[key];

		if (typeof value === 'string') return value;
	}

	return undefined;
};

export function GET() {
	return okJson({ agents: listManagedAgents() });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/agents'
	});

	if (access.response) return access.response;

	const slug = payloadString(payload, 'slug', 'agentSlug', 'id');
	const rawStatus = payloadString(payload, 'status');

	if (!slug) {
		return errorJson('Agent slug is required', 400);
	}

	const status = normalizeManagedAgentStatus(rawStatus);

	if (rawStatus && !status) {
		return errorJson('Agent status must be active or paused', 400);
	}

	const agent = updateManagedAgent({
		note: optionalPayloadString(payload, 'note', 'message'),
		slug,
		status
	});

	if (!agent) {
		return errorJson('OUTLETCARS.BG — Варна agent not found', 404);
	}

	return okJson({ agent });
}
