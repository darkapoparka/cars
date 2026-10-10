import { getVehicleBySlug, vehicles, type Vehicle } from '$lib/data/vehicles';
import { resolveDayNightSession, type DayNightSession } from './auth';
import { getDayNightGarageState } from './garage';

export type CompareVehicleOptions = {
	routePath?: string;
	searchParams?: URLSearchParams;
	session?: DayNightSession;
};

const compareLimit = 4;

const getParam = (params: URLSearchParams, ...keys: string[]) => {
	for (const key of keys) {
		const value = params.get(key)?.trim();

		if (value) return value;
	}

	return undefined;
};

const vehiclesFromSlugs = (slugs: string[]) =>
	slugs
		.map((slug) => getVehicleBySlug(slug))
		.filter((vehicle): vehicle is Vehicle => Boolean(vehicle));

export const compareIdsFromSearchParams = (searchParams?: URLSearchParams) =>
	getParam(new URLSearchParams(searchParams), 'ids', 'compare')
		?.split(',')
		.map((slug) => slug.trim())
		.filter(Boolean) ?? [];

export const getCompareVehicles = (options: CompareVehicleOptions = {}) => {
	const ids = compareIdsFromSearchParams(options.searchParams);
	const routePath = options.routePath?.replace(/^\/+|\/+$/g, '') ?? '';
	const accountGarageIds =
		!ids.length && routePath === 'account/compare'
			? getDayNightGarageState(
					options.session ?? resolveDayNightSession(options.routePath, options.searchParams)
				).compare
			: undefined;
	const selected = ids.length
		? vehiclesFromSlugs(ids)
		: accountGarageIds?.length
			? vehiclesFromSlugs(accountGarageIds)
			: vehicles.slice(0, compareLimit);

	return (selected.length ? selected : vehicles.slice(0, compareLimit)).slice(0, compareLimit);
};
