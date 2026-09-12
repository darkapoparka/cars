import { error } from '@sveltejs/kit';
import { getDayNightTeamMemberBySlug, daynightTeam } from '$lib/data/daynight-team';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

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
			title: `${member.name} | Мания`,
			description: member.bio
		}
	};
};
