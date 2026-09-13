import { createContext } from 'svelte';
import { MAX_COMPARE_VEHICLES, normalizeGarageSlugs } from '$lib/utils/garage';

const FAVORITES_KEY = 'daynight:favorites';
const COMPARE_KEY = 'daynight:compare';

function readStored(key: string): string[] {
	try {
		const raw = globalThis.localStorage?.getItem(key);
		return raw ? normalizeGarageSlugs(JSON.parse(raw)) : [];
	} catch {
		// Storage access itself can throw in restricted browser contexts.
		return [];
	}
}

function writeStored(key: string, value: string[]) {
	try {
		globalThis.localStorage?.setItem(key, JSON.stringify(value));
	} catch {
		// Favorites stay in memory when browser storage is unavailable.
	}
}

export class GarageState {
	favorites = $state<string[]>([]);
	compare = $state<string[]>([]);
	formMessage = $state('');
	#messageTimer: ReturnType<typeof setTimeout> | undefined;
	hydrateFromStorage() {
		this.favorites = readStored(FAVORITES_KEY);
		this.compare = readStored(COMPARE_KEY).slice(0, MAX_COMPARE_VEHICLES);
	}

	toggleFavorite(slug: string) {
		this.favorites = this.favorites.includes(slug)
			? this.favorites.filter((item) => item !== slug)
			: [...this.favorites, slug];
		writeStored(FAVORITES_KEY, this.favorites);
	}

	toggleCompare(slug: string) {
		if (this.compare.includes(slug)) {
			this.compare = this.compare.filter((item) => item !== slug);
		} else {
			if (this.compare.length >= MAX_COMPARE_VEHICLES) {
				this.setMessage(
					`Можете да сравните до ${MAX_COMPARE_VEHICLES} автомобила. Премахнете един, за да добавите друг.`
				);
				return false;
			}
			this.compare = [...this.compare, slug];
		}
		writeStored(COMPARE_KEY, this.compare);
		return true;
	}
	isFavorite(slug: string) {
		return this.favorites.includes(slug);
	}

	isCompared(slug: string) {
		return this.compare.includes(slug);
	}

	clearCompare() {
		this.compare = [];
		writeStored(COMPARE_KEY, this.compare);
		this.setMessage('');
	}

	setMessage(message: string) {
		this.dispose();
		this.formMessage = message;
		if (message && typeof window !== 'undefined') {
			this.#messageTimer = setTimeout(() => {
				this.#messageTimer = undefined;
				this.formMessage = '';
			}, 3600);
		}
	}

	dispose() {
		clearTimeout(this.#messageTimer);
		this.#messageTimer = undefined;
	}
}

export const [getGarageContext, setGarageContext] = createContext<GarageState>();

type OptionalGarageContext = Pick<
	GarageState,
	| 'favorites'
	| 'compare'
	| 'isFavorite'
	| 'isCompared'
	| 'toggleFavorite'
	| 'toggleCompare'
	| 'clearCompare'
	| 'formMessage'
	| 'setMessage'
>;

const fallbackGarage: OptionalGarageContext = {
	favorites: [],
	compare: [],
	isFavorite: () => false,
	isCompared: () => false,
	toggleFavorite: () => undefined,
	toggleCompare: () => true,
	clearCompare: () => undefined,
	formMessage: '',
	setMessage: () => undefined
};

export function getOptionalGarageContext(): OptionalGarageContext {
	try {
		return getGarageContext();
	} catch {
		return fallbackGarage;
	}
}
