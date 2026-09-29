import type { RequestHandler } from './$types';
import { preferenceResponse } from '$lib/locale/core';
/** Narrow local preference endpoint, also intercepted by localeHandle before read-only policy. */
export const POST: RequestHandler = ({ request }) => preferenceResponse(request);
export const GET: RequestHandler = ({ request }) => preferenceResponse(request);
export const HEAD: RequestHandler = ({ request }) => preferenceResponse(request);
export const OPTIONS: RequestHandler = ({ request }) => preferenceResponse(request);
