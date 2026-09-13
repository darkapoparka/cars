import { createContext, onMount } from 'svelte';
import { MOBILE_SHELL_MEDIA } from '$lib/config/viewport';

export interface StorefrontViewport {
	readonly mobile: boolean;
}

export const [getViewportContext, setViewportContext] = createContext<StorefrontViewport>();

/** Request-local SSR guess, preserved through hydration; one live listener per layout. */
export function initializeViewport(initialMobile: () => boolean) {
	let clientMobile = $state<boolean | null>(null);
	const viewport: StorefrontViewport = {
		get mobile() {
			return clientMobile ?? initialMobile();
		}
	};
	setViewportContext(viewport);
	onMount(() => {
		const query = window.matchMedia(MOBILE_SHELL_MEDIA);
		const update = () => {
			clientMobile = query.matches;
		};
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});
	return viewport;
}
