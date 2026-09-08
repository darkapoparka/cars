import { describe, expect, it } from 'vitest';
import { managedAgentCardsFromAgents } from './agents';
import { agents } from '$lib/data/agents';

describe('managedAgentCardsFromAgents', () => {
	it('adds Auxero-compatible management metadata and actions', () => {
		const [card] = managedAgentCardsFromAgents([
			{
				...agents[0],
				note: 'Handles showroom appointments.',
				openInquiries: 2,
				status: 'active'
			}
		]);

		expect(card.management).toEqual({
			assignedLeadsHref: '/admin/inquiries?role=admin',
			assignedLeadsLabel: 'Assigned Leads (2)',
			messagesHref: '/admin/messages?role=admin',
			note: 'Handles showroom appointments.',
			status: 'active',
			statusText: 'Active · 2 open leads'
		});
	});
});
