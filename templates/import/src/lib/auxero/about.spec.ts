import { describe, expect, it } from 'vitest';
import type { Agent } from '$lib/data/agents';
import { agentCardsFromAgents } from './agents';
import { aboutCardsFromAgents } from './about';

const dealerAgent = (index: number): Agent => ({
	slug: `dealer-team-${index}`,
	name: `Dealer contact ${index}`,
	title: 'Sales and viewings',
	phone: '0123456789',
	email: 'sales@dealer.example',
	image: `/brand/team-${index}.webp`,
	rating: 0,
	sales: 0,
	bio: 'Configured dealer contact'
});

describe('About dealer consultants', () => {
	it.each([0, 1, 4])(
		'uses all %i configured contacts when generated consultants omit About metadata',
		(count) => {
			const agents = Array.from({ length: count }, (_, index) => dealerAgent(index));
			const consultants = agents.map(({ slug, name, title, image }) => ({
				slug,
				name,
				title,
				image
			}));
			expect(aboutCardsFromAgents(agents, consultants)).toEqual(agentCardsFromAgents(agents));
		}
	);

	it('matches optional presentation by consultant identity and retains contact behavior', () => {
		const agents = [dealerAgent(0), dealerAgent(1)];
		const about = {
			name: 'Public team contact',
			socials: [],
			desktopPortrait: { position: '60% top', scale: 1.65 }
		} as const;
		const consultants = [{ slug: agents[1].slug, about }, { slug: agents[0].slug }];
		const cards = agentCardsFromAgents(agents);
		expect(aboutCardsFromAgents(agents, consultants)).toEqual([
			cards[0],
			{ ...cards[1], ...about }
		]);
	});
});
