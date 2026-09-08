export const garageFavoriteKey = 'daynight:favorites';
export const garageCompareKey = 'daynight:compare';
export const garageSessionKey = 'daynight:session';
export const garageCompareSlotsKey = 'daynight:compare:mobile-slots';
export const compareLimit = 4;

export type CompareSlotSlugs = [string | null, string | null];

export const readStoredStringList = (storage: Storage | undefined, key: string) => {
	if (!storage) return [];

	try {
		const value = JSON.parse(storage.getItem(key) || '[]');

		return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
	} catch {
		return [];
	}
};

export const writeStoredStringList = (
	storage: Storage | undefined,
	key: string,
	value: string[]
) => {
	if (!storage) return;

	storage.setItem(key, JSON.stringify(value));
};

export const readGarageFavorites = (storage: Storage | undefined) =>
	readStoredStringList(storage, garageFavoriteKey);

export const writeGarageFavorites = (storage: Storage | undefined, value: string[]) =>
	writeStoredStringList(storage, garageFavoriteKey, value);

export const readGarageCompare = (storage: Storage | undefined) =>
	readStoredStringList(storage, garageCompareKey);

export const writeGarageCompare = (storage: Storage | undefined, value: string[]) =>
	writeStoredStringList(storage, garageCompareKey, value);

export const readGarageSession = (storage: Storage | undefined) =>
	readStoredStringList(storage, garageSessionKey);

export const favoriteSlugsWith = (current: string[], slug: string) =>
	current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];

export const compareSlugsWith = (current: string[], slug: string) =>
	[slug, ...current.filter((item) => item !== slug)].slice(0, compareLimit);

export const normalizeGarageSlugs = (
	slugs: (string | null | undefined)[],
	isAllowed: (slug: string) => boolean = () => true
) =>
	Array.from(
		new Set(
			slugs.filter(
				(slug): slug is string => typeof slug === 'string' && Boolean(slug) && isAllowed(slug)
			)
		)
	).slice(0, compareLimit);

export const sameGarageSlugList = (left: string[], right: string[]) =>
	left.length === right.length && left.every((slug, index) => slug === right[index]);

export const compactCompareSlotsFromSelection = (slugs: string[]): CompareSlotSlugs => [
	slugs[0] ?? null,
	slugs[1] ?? null
];

export const normalizeCompareSlots = (
	slots: (string | null | undefined)[],
	cleanSlugs: string[]
): CompareSlotSlugs => [
	slots[0] && cleanSlugs.includes(slots[0]) ? slots[0] : null,
	slots[1] && cleanSlugs.includes(slots[1]) ? slots[1] : null
];

export const readGarageCompareSlots = (storage: Storage | undefined, cleanSlugs: string[]) => {
	if (!storage) return undefined;

	try {
		const value = JSON.parse(storage.getItem(garageCompareSlotsKey) || 'null');
		const compare = Array.isArray(value?.compare) ? normalizeGarageSlugs(value.compare) : [];
		const slots = Array.isArray(value?.slots) ? value.slots : undefined;

		if (!slots || !sameGarageSlugList(compare, cleanSlugs)) return undefined;

		return normalizeCompareSlots(slots, cleanSlugs);
	} catch {
		return undefined;
	}
};

export const writeGarageCompareSlots = (
	storage: Storage | undefined,
	cleanSlugs: string[],
	slots: CompareSlotSlugs
) => {
	if (!storage) return;

	storage.setItem(
		garageCompareSlotsKey,
		JSON.stringify({
			compare: cleanSlugs,
			slots
		})
	);
};
