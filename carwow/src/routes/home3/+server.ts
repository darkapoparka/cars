import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	throw redirect(308, '/variant-3/presentation/home3');
};
