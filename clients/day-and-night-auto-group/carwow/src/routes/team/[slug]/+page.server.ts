import { error, redirect } from '@sveltejs/kit';
import { getDayNightTeamMemberBySlug, daynightTeam } from '$lib/data/daynight-team';
import type { EntryGenerator, PageServerLoad } from './$types';

// This response includes request-specific viewport chrome and live inventory context.
export const prerender = false;

const legacyTeamSlugRedirects: Record<string, string> = {
	'prodazhbi-daynight-auto': 'prodazhbi-showroom'
};

export const entries: EntryGenerator = () => [
	...daynightTeam.map(({ slug }) => ({ slug })),
	...Object.keys(legacyTeamSlugRedirects).map((slug) => ({ slug }))
];

export const load: PageServerLoad = async ({ params }) => {
	const redirectTarget = legacyTeamSlugRedirects[params.slug];
	if (redirectTarget) {
		redirect(308, `/team/${redirectTarget}`);
	}

	const member = getDayNightTeamMemberBySlug(params.slug);

	if (!member) {
		error(404, 'Sale agent not found');
	}

	return {
		member,
		members: daynightTeam,
		seo: {
			title: `${member.name} | Day Night Auto`,
			description: member.bio
		}
	};
};
