import { createContext } from 'svelte';
import type { InventoryCountSummary } from '$lib/types/inventory';

export const [getStorefrontInventorySummaryContext, setStorefrontInventorySummaryContext] =
	createContext<() => InventoryCountSummary | null | undefined>();
