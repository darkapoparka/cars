import type { RequestHandler } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { getRequestDb, hasDatabaseUrl } from '$lib/server/db/client';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';
import {
	getFeedDealerState,
	getPublishedFeedVehiclesForDealer,
	getStaticFeedVehicles,
	renderCarsBgCsv
} from '$lib/server/repositories/feeds';

const feedCacheControl = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600';

export const GET: RequestHandler = async ({ locals, params, getClientAddress }) => {
	const db = locals.db ?? (hasDatabaseUrl() ? getRequestDb(locals) : null);
	const limit = await rateLimit(
		createRateLimitKey('feed:cars-bg', `${params.dealerSlug}:${getClientAddress()}`),
		120,
		60_000,
		{ db: db ?? undefined, allowMemoryFallback: !db }
	);

	if (!limit.allowed) {
		return new Response('Too many feed requests.', {
			status: 429,
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'retry-after': String(limit.retryAfterSec),
				'cache-control': 'private, no-store'
			}
		});
	}

	if (!db) {
		if (params.dealerSlug !== getDefaultDealerSlug()) {
			return new Response('cars.bg feed is disabled for this dealer.', {
				status: 404,
				headers: {
					'content-type': 'text/plain; charset=utf-8',
					'cache-control': feedCacheControl
				}
			});
		}

		return new Response(renderCarsBgCsv(getStaticFeedVehicles()), {
			headers: {
				'content-type': 'text/csv; charset=utf-8',
				'content-disposition': `attachment; filename="${params.dealerSlug}-cars-bg.csv"`,
				'cache-control': feedCacheControl
			}
		});
	}

	const { dealer, enabled } = await getFeedDealerState(db, params.dealerSlug, 'carsBgCsv');

	if (!enabled) {
		return new Response('cars.bg feed is disabled for this dealer.', {
			status: 404,
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'cache-control': feedCacheControl
			}
		});
	}

	const vehicles = await getPublishedFeedVehiclesForDealer(db, dealer.id);

	return new Response(renderCarsBgCsv(vehicles), {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="${params.dealerSlug}-cars-bg.csv"`,
			'cache-control': feedCacheControl
		}
	});
};
