import { errorJson } from './api';
import {
	canAccessEliqautoRoute,
	resolveEliqautoApiSession,
	type EliqautoRole,
	type EliqautoSession
} from './auth';
import { eliqautoRoleLabel } from './roles';

type ApiAccessOptions = {
	allowedRoles?: EliqautoRole[];
	fallbackRole?: EliqautoRole | string;
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
			session: EliqautoSession;
	  };

export const requireEliqautoApiAccess = ({
	allowedRoles,
	fallbackRole,
	request,
	routePath = ''
}: ApiAccessOptions): ApiAccessResult => {
	const session = resolveEliqautoApiSession(request, fallbackRole);

	if (!session) {
		return { response: errorJson('Eliqauto account session is required', 401) };
	}

	if (allowedRoles && !allowedRoles.includes(session.role)) {
		return {
			response: errorJson(
				`Eliqauto ${eliqautoRoleLabel(session.role)} role cannot access this API`,
				403
			)
		};
	}

	if (routePath && !canAccessEliqautoRoute(session, routePath)) {
		return {
			response: errorJson('Eliqauto account role cannot access this API route', 403)
		};
	}

	return { session };
};
