import { eq } from 'drizzle-orm';
import type { Db } from '$lib/server/db/client';
import { dealers } from '$lib/server/db/schema';
import type { DealerRow } from '$lib/types/database';

export async function getDealerBySlug(db: Db, slug: string): Promise<DealerRow> {
	const [dealer] = await db.select().from(dealers).where(eq(dealers.slug, slug)).limit(1);

	if (!dealer) {
		throw new Error(`Dealer "${slug}" was not found.`);
	}

	return dealer;
}
