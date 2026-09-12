import { error } from '@sveltejs/kit';
import { getDayNightTeamMemberBySlug, daynightTeam, legacyDaynightTeamSlugs } from '$lib/data/daynight-team';
import { daynightSite } from '$lib/data/daynight-site';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

// Preserve previous detailed URLs without retaining fictional people or roles.
export const entries: EntryGenerator = () => [
	...daynightTeam.map(({ slug }) => ({ slug })),
	...legacyDaynightTeamSlugs.map((slug) => ({ slug }))
];

export const load: PageServerLoad = async ({ params }) => {
	const member = getDayNightTeamMemberBySlug(params.slug);
	if (!member) {
		error(404, 'Контактът не е намерен');
	}
	return {
		member,
		members: daynightTeam,
		seo: {
			title: `Бизнес контакт | ${daynightSite.name}`,
			description: member.bio
		}
	};
};
