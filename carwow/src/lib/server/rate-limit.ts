import { createHash } from 'node:crypto';
import { sql } from 'drizzle-orm';
import type { Db } from '$lib/server/db/client';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
	allowed: boolean;
	remaining: number;
	retryAfterSec: number;
};

type RateLimitRow = {
	allowed: boolean;
	remaining: number;
	retry_after_sec: number;
};

type RateLimitOptions = {
	db?: Db;
	allowMemoryFallback?: boolean;
};

export function hashRateLimitSubject(subject: string) {
	return createHash('sha256').update(subject).digest('hex').slice(0, 32);
}

export function createRateLimitKey(scope: string, subject: string, visitorToken?: string | null) {
	return [
		scope,
		hashRateLimitSubject(subject),
		visitorToken ? hashRateLimitSubject(visitorToken) : null
	]
		.filter(Boolean)
		.join(':');
}

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const existing = buckets.get(key);

	if (!existing || existing.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, remaining: limit - 1, retryAfterSec: Math.ceil(windowMs / 1000) };
	}

	const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

	if (existing.count >= limit) {
		return { allowed: false, remaining: 0, retryAfterSec };
	}

	existing.count += 1;

	if (buckets.size > 5000) {
		for (const [bucketKey, bucket] of buckets) {
			if (bucket.resetAt <= now) buckets.delete(bucketKey);
		}
	}

	return { allowed: true, remaining: limit - existing.count, retryAfterSec };
}

export async function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
	options: RateLimitOptions = {}
): Promise<RateLimitResult> {
	if (!options.db) {
		if (options.allowMemoryFallback) {
			return memoryRateLimit(key, limit, windowMs);
		}

		throw new Error(
			'Rate limit requires a database client. Pass allowMemoryFallback only for local/unit use.'
		);
	}

	const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
	const result = await options.db.execute(sql<RateLimitRow>`
		with rate_limit_time as (
			select now() as value
		),
		upserted as (
			insert into rate_limits (key, window_start, count, reset_at, updated_at)
			select
				${key},
				rate_limit_time.value,
				1,
				rate_limit_time.value + (${windowSeconds}::integer * interval '1 second'),
				rate_limit_time.value
			from rate_limit_time
			on conflict (key) do update set
				window_start = case
					when rate_limits.reset_at <= excluded.window_start then excluded.window_start
					else rate_limits.window_start
				end,
				count = case
					when rate_limits.reset_at <= excluded.window_start then 1
					else rate_limits.count + 1
				end,
				reset_at = case
					when rate_limits.reset_at <= excluded.window_start then excluded.reset_at
					else rate_limits.reset_at
				end,
				updated_at = excluded.updated_at
			returning count, reset_at
		)
		select
			(upserted.count <= ${limit}::integer) as allowed,
			greatest(${limit}::integer - upserted.count, 0)::integer as remaining,
			greatest(
				1,
				ceil(extract(epoch from (upserted.reset_at - (select value from rate_limit_time))))::integer
			) as retry_after_sec
		from upserted
	`);
	const row = (result.rows as RateLimitRow[])[0];

	if (!row) {
		throw new Error('Rate limit query returned no result.');
	}

	return {
		allowed: row.allowed,
		remaining: row.remaining,
		retryAfterSec: row.retry_after_sec
	};
}
