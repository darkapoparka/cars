import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	redirect(308, '/variant-3/sell-your-car' + url.search);
};
