import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import { daynightVehicles } from '$lib/data/daynight-vehicles';

const FAVORITES_KEY = 'daynight:favorites';
const COMPARE_KEY = 'daynight:compare';

// Start with an honest empty garage. The catalogue slugs are derived from the
// current listings, so old demo seeds would make badges disagree with the
// rendered favorites/compare surfaces.
const DEFAULT_FAVORITES: string[] = [];
const DEFAULT_COMPARE: string[] = [];

function readStored(key: string, fallback: string[]): string[] {
	if (typeof localStorage === 'undefined') return fallback;

	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;

		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : fallback;
	} catch {
		return fallback;
	}
}

function writeStored(key: string, value: string[]) {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Ignore quota / privacy-mode write failures — favorites stay in-memory.
	}
}

export class GarageState {
	favorites = $state<string[]>(DEFAULT_FAVORITES);
	compare = $state<string[]>(DEFAULT_COMPARE);
	formMessage = $state('');

	hydrateFromStorage() {
		const knownSlugs = new SvelteSet(daynightVehicles.map((vehicle) => vehicle.slug));
		this.favorites = readStored(FAVORITES_KEY, DEFAULT_FAVORITES).filter((slug) =>
			knownSlugs.has(slug)
		);
		this.compare = readStored(COMPARE_KEY, DEFAULT_COMPARE)
			.filter((slug) => knownSlugs.has(slug))
			.slice(-3);
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
			if (this.compare.length >= 3) {
				this.setMessage(
					'You can compare up to 3 vehicles. Remove one to add another.'
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
		this.formMessage = '';
	}

	setMessage(message: string) {
		this.formMessage = message;
		if (message && typeof window !== 'undefined') {
			window.setTimeout(() => {
				if (this.formMessage === message) this.formMessage = '';
			}, 3600);
		}
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
