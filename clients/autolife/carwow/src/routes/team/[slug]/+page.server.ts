import { error } from '@sveltejs/kit';
import { getDayNightTeamMemberBySlug, daynightTeam } from '$lib/data/daynight-team';
import type { EntryGenerator, PageServerLoad } from './$types';

// No verified staff profiles are published; resolve unknown slugs as runtime 404s.
export const prerender = false;

export const entries: EntryGenerator = () => daynightTeam.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = async ({ params }) => {
	const member = getDayNightTeamMemberBySlug(params.slug);

	if (!member) {
		error(404, 'Sale agent not found');
	}

	return {
		member,
		members: daynightTeam,
		seo: {
			title: `${member.name} | Аутолайф`,
			description: member.bio
		}
	};
};
