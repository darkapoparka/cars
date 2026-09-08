import { clearEliqautoRequestSession, expiredEliqautoSessionCookie } from '$lib/server/auth';

export function POST({ request }: { request: Request }) {
	clearEliqautoRequestSession(request);

	return new Response(null, {
		headers: {
			location: '/admin/login',
			'set-cookie': expiredEliqautoSessionCookie()
		},
		status: 303
	});
}
