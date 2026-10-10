import { clearDayNightRequestSession, expiredDayNightSessionCookie } from '$lib/server/auth';

export function POST({ request }: { request: Request }) {
	clearDayNightRequestSession(request);

	return new Response(null, {
		headers: {
			location: '/admin/login',
			'set-cookie': expiredDayNightSessionCookie()
		},
		status: 303
	});
}
