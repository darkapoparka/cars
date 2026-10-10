import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// POC route: NO pageDocument → the theme app.css never loads → clean slate.
// Renders the clean Svelte 5 + Tailwind v4 compare with zero Auxero CSS.
export const load: PageServerLoad = ({ url }) => {
	redirect(308, `/compare${url.search}`);
};
