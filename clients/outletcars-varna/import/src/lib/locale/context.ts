import type { Locale, LocaleState } from './core';
import { page } from '$app/state';
import { message, type en } from './messages';
export function getI18n() {
	return {
		get locale(): Locale {
			return page.data.localeState.locale;
		},
		get state(): LocaleState {
			return page.data.localeState;
		},
		t: (key: keyof typeof en, params?: Record<string, string | number>) =>
			message(page.data.localeState.locale, key, params),
		restoreFocus: () =>
			Array.from(document.querySelectorAll<HTMLElement>('[data-locale-selector]'))
				.find(
					(node) =>
						node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden'
				)
				?.focus({ preventScroll: true })
	};
}
