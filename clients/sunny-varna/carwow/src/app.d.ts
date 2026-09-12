// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Db } from '$lib/server/db/client';
import type { ProfileRow } from '$lib/server/db/types';
import type { InventoryCountSummary } from '$lib/types/inventory';

type SafePageUser = {
	id: string;
	email: string | null;
};

type SafeAuthSession = {
	id: string;
	userId: string;
	expiresAt: Date;
};

type SafeAuthUser = {
	id: string;
	email: string | null;
	name?: string | null;
	image?: string | null;
	emailVerified?: boolean;
};

declare global {
	namespace App {
		interface Error {
			message: string;
			errorId?: string;
		}
		interface Locals {
			db: Db | null;
			session: SafeAuthSession | null;
			user: SafeAuthUser | null;
			staffProfile: ProfileRow | null;
		}
		interface PageData {
			session?: null;
			user?: SafePageUser | null;
			storefrontInventorySummary?: InventoryCountSummary | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
