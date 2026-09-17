import { and, count, desc, eq, notInArray } from 'drizzle-orm';
import type { Db } from '$lib/server/db/client';
import { conversations, importRequests, leads, posts, vehicles } from '$lib/server/db/schema';
import type { ImportRequestRow, LeadRow, VehicleRow } from '$lib/types/database';

export type DashboardOverview = {
	kpis: {
		liveListings: number;
		draftListings: number;
		openLeads: number;
		activeImports: number;
		publishedPosts: number;
		openConversations: number;
	};
	recentLeads: LeadRow[];
	recentImports: ImportRequestRow[];
	recentVehicles: VehicleRow[];
};

export const emptyDashboardOverview: DashboardOverview = {
	kpis: {
		liveListings: 0,
		draftListings: 0,
		openLeads: 0,
		activeImports: 0,
		publishedPosts: 0,
		openConversations: 0
	},
	recentLeads: [],
	recentImports: [],
	recentVehicles: []
};

async function countWhere(db: Db, table: typeof vehicles, where: ReturnType<typeof and>) {
	const [result] = await db.select({ value: count() }).from(table).where(where);
	return result?.value ?? 0;
}

export async function getDashboardOverview(db: Db, dealerId: string): Promise<DashboardOverview> {
	const [
		liveListings,
		draftListings,
		openLeads,
		activeImports,
		publishedPosts,
		openConversations,
		recentLeads,
		recentImports,
		recentVehicles
	] = await Promise.all([
		countWhere(
			db,
			vehicles,
			and(eq(vehicles.dealer_id, dealerId), eq(vehicles.status, 'published'))
		),
		countWhere(db, vehicles, and(eq(vehicles.dealer_id, dealerId), eq(vehicles.status, 'draft'))),
		db
			.select({ value: count() })
			.from(leads)
			.where(and(eq(leads.dealer_id, dealerId), eq(leads.status, 'new')))
			.then(([result]) => result?.value ?? 0),
		db
			.select({ value: count() })
			.from(importRequests)
			.where(
				and(
					eq(importRequests.dealer_id, dealerId),
					notInArray(importRequests.status, ['delivered', 'cancelled'])
				)
			)
			.then(([result]) => result?.value ?? 0),
		db
			.select({ value: count() })
			.from(posts)
			.where(and(eq(posts.dealer_id, dealerId), eq(posts.status, 'published')))
			.then(([result]) => result?.value ?? 0),
		db
			.select({ value: count() })
			.from(conversations)
			.where(and(eq(conversations.dealer_id, dealerId), eq(conversations.status, 'open')))
			.then(([result]) => result?.value ?? 0),
		db
			.select()
			.from(leads)
			.where(eq(leads.dealer_id, dealerId))
			.orderBy(desc(leads.created_at))
			.limit(6),
		db
			.select()
			.from(importRequests)
			.where(eq(importRequests.dealer_id, dealerId))
			.orderBy(desc(importRequests.created_at))
			.limit(6),
		db
			.select()
			.from(vehicles)
			.where(eq(vehicles.dealer_id, dealerId))
			.orderBy(desc(vehicles.updated_at))
			.limit(6)
	]);

	return {
		kpis: {
			liveListings,
			draftListings,
			openLeads,
			activeImports,
			publishedPosts,
			openConversations
		},
		recentLeads,
		recentImports,
		recentVehicles
	};
}
