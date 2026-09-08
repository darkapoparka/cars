import { clearEliqautoRequestSession, expiredEliqautoSessionCookie } from '$lib/server/auth';
import { okJson } from '$lib/server/api';

export function POST({ request }: { request: Request }) {
	const cleared = clearEliqautoRequestSession(request);

	return okJson(
		{
			cleared,
			status: 'signed-out'
		},
		{
			headers: {
				'set-cookie': expiredEliqautoSessionCookie()
			}
		}
	);
}
