type DraftValues = Record<string, string | number | boolean>;
const lifetime = 24 * 60 * 60 * 1000;
const storage = () => {
	try {
		return typeof window === 'undefined' ? undefined : window.sessionStorage;
	} catch {
		return undefined;
	}
};

export function readSessionDraft(
	key: string,
	store = storage(),
	now = Date.now()
): DraftValues | undefined {
	try {
		const raw = store?.getItem(key);
		if (!raw || raw.length > 16000) return undefined;
		const parsed = JSON.parse(raw);
		if (
			parsed.version !== 2 ||
			typeof parsed.savedAt !== 'number' ||
			now - parsed.savedAt > lifetime ||
			parsed.savedAt > now ||
			!parsed.values ||
			typeof parsed.values !== 'object' ||
			Array.isArray(parsed.values)
		) {
			clearSessionDraft(key, store);
			return undefined;
		}
		const entries = Object.entries(parsed.values);
		if (
			entries.length > 32 ||
			entries.some(([, value]) =>
				typeof value === 'string'
					? value.length > 2048
					: typeof value === 'number'
						? !Number.isFinite(value)
						: typeof value !== 'boolean'
			)
		)
			return undefined;
		return Object.fromEntries(entries) as DraftValues;
	} catch {
		return undefined;
	}
}

/** Only non-contact preferences belong here. Never persist free text, files, names or phone/email. */
export function saveSessionDraft(
	key: string,
	values: DraftValues,
	store = storage(),
	now = Date.now()
) {
	const safe = Object.fromEntries(
		Object.entries(values).filter(
			([name]) => !['name', 'phone', 'email', 'notes', 'message'].includes(name)
		)
	);
	try {
		store?.setItem(key, JSON.stringify({ version: 2, savedAt: now, values: safe }));
	} catch {
		/* The current in-memory form remains usable. */
	}
}
export function clearSessionDraft(key: string, store = storage()) {
	try {
		store?.removeItem(key);
	} catch {
		/* Storage may be unavailable. */
	}
}
