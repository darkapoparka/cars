import { errorJson } from './api';
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
	const session = resolveDayNightApiSession(request, fallbackRole);

	if (!session) {
		return { response: errorJson('OUTLETCARS.BG — Варна account session is required', 401) };
	}

	if (allowedRoles && !allowedRoles.includes(session.role)) {
		return {
			response: errorJson(
				`OUTLETCARS.BG — Варна ${daynightRoleLabel(session.role)} role cannot access this API`,
				403
			)
		};
	}

	if (routePath && !canAccessDayNightRoute(session, routePath)) {
		return {
			response: errorJson('OUTLETCARS.BG — Варна account role cannot access this API route', 403)
		};
	}

	return { session };
};
