import { createContext } from 'svelte';
import { browser } from '$app/environment';
import {
	compareSlugsWith,
	favoriteSlugsWith,
	garageCompareKey,
	garageFavoriteKey,
	normalizeGarageSlugs,
	readGarageCompare,
	readGarageFavorites,
	readGarageSession,
	writeGarageCompare,
	writeGarageFavorites
} from './garage-storage';

const garageStorage = () => (browser ? window.localStorage : undefined);

const syncGarageDom = (
	favorites = readGarageFavorites(garageStorage()),
	compare = normalizeGarageSlugs(readGarageCompare(garageStorage()))
) => {
	if (!browser) return;

	for (const card of document.querySelectorAll<HTMLElement>('[data-eliqauto-slug]')) {
		const slug = card.getAttribute('data-eliqauto-slug');
		const favorite = card.querySelector<HTMLElement>('.eliqauto-favorite, .heart');

		if (!slug || !favorite) continue;

		const isFavorite = favorites.includes(slug);
		favorite.classList.toggle('is-active', isFavorite);
		favorite.setAttribute('aria-pressed', String(isFavorite));
	}

	for (const link of document.querySelectorAll<HTMLElement>(
		'[aria-label="Compare"], [aria-label="Сравни"]'
	)) {
		link.setAttribute('data-badge', String(compare.length));
	}

	for (const link of document.querySelectorAll<HTMLElement>(
		'[aria-label="Wishlist"], [aria-label="Любими"]'
	)) {
		link.setAttribute('data-badge', String(favorites.length));
	}
};

const shouldSyncGarageApi = () => {
	if (!browser) return false;

	return (
		Boolean(new URLSearchParams(window.location.search).get('role')) ||
		readGarageSession(garageStorage()).length > 0
	);
};

const hasStoredGarageState = (storage: Storage | undefined) =>
	storage?.getItem(garageFavoriteKey) !== null || storage?.getItem(garageCompareKey) !== null;

const syncGarageApi = async () => {
	if (!shouldSyncGarageApi()) return;

	try {
		const storage = garageStorage();
		if (!hasStoredGarageState(storage)) return;

		const role = new URLSearchParams(window.location.search).get('role');
		const headers: Record<string, string> = { 'content-type': 'application/json' };
		if (role) headers['x-eliqauto-prototype-role'] = role;

		await fetch('/api/account/garage', {
			body: JSON.stringify({
				compare: normalizeGarageSlugs(readGarageCompare(garageStorage())),
				favorites: readGarageFavorites(garageStorage()),
				...(role ? { role } : {})
			}),
			credentials: 'same-origin',
			headers,
			method: 'POST'
		});
	} catch {
		// LocalStorage remains the immediate source of truth when the prototype API is unavailable.
	}
};

type GarageUpdatedDetail = {
	compare?: unknown;
	favorites?: unknown;
};

const favoriteSlugsFrom = (value: unknown) =>
	Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export class GarageState {
	favorites = $state<string[]>([]);
	compare = $state<string[]>([]);
	formMessage = $state('');

	hydrateFromStorage() {
		const storage = garageStorage();
		const hasStoredGarage = hasStoredGarageState(storage);

		this.favorites = readGarageFavorites(storage);
		this.compare = normalizeGarageSlugs(readGarageCompare(storage));
		if (hasStoredGarage) {
			syncGarageDom(this.favorites, this.compare);
		}
		void syncGarageApi();
	}

	applyExternalGarageState(detail: GarageUpdatedDetail = {}) {
		const storage = garageStorage();
		this.favorites = detail.favorites
			? favoriteSlugsFrom(detail.favorites)
			: readGarageFavorites(storage);
		this.compare = normalizeGarageSlugs(
			detail.compare ? favoriteSlugsFrom(detail.compare) : readGarageCompare(storage)
		);
		syncGarageDom(this.favorites, this.compare);
	}

	watchExternalGarageState() {
		if (!browser) return () => {};

		const listener = (event: Event) => {
			this.applyExternalGarageState((event as CustomEvent<GarageUpdatedDetail>).detail);
		};

		window.addEventListener('eliqauto:garage-updated', listener);

		return () => window.removeEventListener('eliqauto:garage-updated', listener);
	}

	toggleFavorite(slug: string) {
		this.favorites = favoriteSlugsWith(readGarageFavorites(garageStorage()), slug);
		writeGarageFavorites(garageStorage(), this.favorites);
		syncGarageDom();
		void syncGarageApi();
	}

	addCompare(slug: string) {
		this.compare = compareSlugsWith(readGarageCompare(garageStorage()), slug);
		writeGarageCompare(garageStorage(), this.compare);
		syncGarageDom();
		void syncGarageApi();
	}

	toggleCompare(slug: string) {
		this.addCompare(slug);
	}

	removeCompare(slug: string) {
		this.compare = readGarageCompare(garageStorage()).filter((item) => item !== slug);
		writeGarageCompare(garageStorage(), this.compare);
		syncGarageDom();
		void syncGarageApi();
	}

	setCompare(slugs: string[]) {
		this.compare = normalizeGarageSlugs(slugs);
		writeGarageCompare(garageStorage(), this.compare);
		syncGarageDom(this.favorites, this.compare);
		void syncGarageApi();
	}

	isFavorite(slug: string) {
		return this.favorites.includes(slug);
	}

	isCompared(slug: string) {
		return this.compare.includes(slug);
	}

	clearCompare() {
		this.compare = [];
		writeGarageCompare(garageStorage(), this.compare);
		syncGarageDom();
		void syncGarageApi();
	}

	setMessage(message: string) {
		this.formMessage = message;
	}
}

export const [getGarageContext, setGarageContext] = createContext<GarageState>();
