import { neon } from '@neondatabase/serverless';
import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import type { DayNightInquiryRecord } from '$lib/types/account';
import { inquiryDatabaseUrl } from './inquiry-config';
import { inquiryRecords } from './inquiry-schema';

const database = () => {
	const url = inquiryDatabaseUrl();
	if (!url) throw new Error('Inquiry database is not configured');
	return drizzle(neon(url, { fetchOptions: { signal: AbortSignal.timeout(15000) } }));
};

const recordFromRow = (row: typeof inquiryRecords.$inferSelect): DayNightInquiryRecord => ({
	...row,
	userRole: 'customer',
	vehicleSlug: row.vehicleSlug ?? undefined,
	vehicleTitle: row.vehicleTitle ?? undefined
});

export const readStoredInquiries = async () =>
	(await database().select().from(inquiryRecords).orderBy(desc(inquiryRecords.createdAt))).map(
		recordFromRow
	);

export const insertStoredInquiry = async (record: DayNightInquiryRecord) => {
	const [saved] = await database().insert(inquiryRecords).values(record).returning();
	return recordFromRow(saved);
};

export const patchStoredInquiry = async (
	id: string,
	patch: Partial<Pick<DayNightInquiryRecord, 'assignedAgentSlug' | 'message' | 'status'>>
) => {
	const [saved] = await database()
		.update(inquiryRecords)
		.set(patch)
		.where(eq(inquiryRecords.id, id))
		.returning();
	return saved ? recordFromRow(saved) : undefined;
};
