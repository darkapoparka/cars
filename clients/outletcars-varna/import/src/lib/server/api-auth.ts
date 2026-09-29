import { errorJson } from './api';
import { runtimeConfig } from './runtime-config';
import {
	canAccessDayNightRoute,
	resolveDayNightApiSession,
	type DayNightRole,
	type DayNightSession
} from './auth';
import { daynightRoleLabel } from './roles';

type ApiAccessOptions = {
	allowedRoles?: DayNightRole[];
	fallbackRole?: DayNightRole | string;
	request: Request;
	routePath?: string;
};

type ApiAccessResult =
	| {
			response: Response;
			session?: never;
	  }
	| {
			response?: never;
			session: DayNightSession;
	  };

export const requireDayNightApiAccess = ({
	allowedRoles,
	fallbackRole,
	request,
	routePath = ''
}: ApiAccessOptions): ApiAccessResult => {
	const config = runtimeConfig();
	if (config.mode === 'live' && !config.adminEnabled)
		return { response: errorJson('Staff access is unavailable', 401) };
	if (config.mode === 'live' && routePath !== 'admin/inquiries')
		return {
			response: errorJson('This demonstration capability is not enabled in live mode', 503)
		};
	const session = resolveDayNightApiSession(request, fallbackRole);

	if (!session) {
		return { response: errorJson('OUTLETCARS.BG account session is required', 401) };
	}

	if (allowedRoles && !allowedRoles.includes(session.role)) {
		return {
			response: errorJson(
				`OUTLETCARS.BG ${daynightRoleLabel(session.role)} role cannot access this API`,
				403
			)
		};
	}

	if (routePath && !canAccessDayNightRoute(session, routePath)) {
		return {
			response: errorJson('OUTLETCARS.BG account role cannot access this API route', 403)
		};
	}

	return { session };
};
