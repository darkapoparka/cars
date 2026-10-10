import { parseInventoryQuery, serializeInventoryQuery } from './inventory-query';

export type InventoryDraft = Record<string, string>;

/** Normalize repeated selections and legacy aliases before adapting them to form controls. */
export function inventoryDraftFromQuery(params: URLSearchParams): InventoryDraft {
	return Object.fromEntries(serializeInventoryQuery(parseInventoryQuery(params), params));
}

/** Keep unrelated, potentially repeated context parameters outside the editable draft. */
export function serializeInventoryDraft(draft: InventoryDraft, original: URLSearchParams) {
	const selected = new URLSearchParams(
		Object.entries(draft).filter(([, value]) => value && value.trim().toLowerCase() !== 'all')
	);
	const params = serializeInventoryQuery(parseInventoryQuery(selected), original);
	if (draft.lang) params.set('lang', draft.lang);
	params.delete('page');
	params.delete('preview');
	return params;
}

/** Changing make invalidates model aliases, but never the independent keyword. */
export function updateInventoryDraft(draft: InventoryDraft, name: string, value: string) {
	const next = { ...draft, [name]: value };
	if (name === 'brand' || name === 'model') {
		delete next.q;
		delete next.query;
	}
	if (name === 'brand' || name === 'q') delete next.model;
	if (name === 'q') delete next.query;
	delete next.page;
	return next;
}
