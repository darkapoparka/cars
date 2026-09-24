import { stockValue, vehicleDescription } from './stock';
import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { attachLocalizedValidation } from './validation';
import { getContext, setContext } from 'svelte';
import { page } from '$app/state';
import { localeHref, resolveLocale, routeParts, type LocaleState } from './core';
import {
	message,
	templateText,
	specificationText,
	vehicleCount,
	dealerLabel,
	type DealerTextField,
	type MessageKey,
	type MessageParameters
} from './messages';
const localeContext = Symbol('cars.locale.v1');
const localeFocusContext = Symbol('cars.locale.focus.v1');
type LocaleReader = () => LocaleState;
export function setLocaleContext(reader: LocaleReader) {
	setContext(localeContext, reader);
	setContext(localeFocusContext, new Set<HTMLElement>());
}
export function getI18n() {
	const focusTargets =
		getContext<Set<HTMLElement> | undefined>(localeFocusContext) ?? new Set<HTMLElement>();
	const reader = getContext<LocaleReader | undefined>(localeContext);
	const state = () =>
		reader?.() ??
		(page.data as { localeState?: LocaleState }).localeState ??
		resolveLocale({ url: page.url });
	function href(value: string): string;
	function href(value: undefined): undefined;
	function href(value: string | undefined): string | undefined;
	function href(value: string | undefined) {
		return value === undefined
			? value
			: localeHref(value, state().locale, routeParts(page.url.pathname).base);
	}
	return {
		registerFocusTarget: (node: HTMLElement) => {
			focusTargets.add(node);
			return () => {
				focusTargets.delete(node);
			};
		},
		restoreFocus: () => {
			[...focusTargets]
				.find((node) => {
					const rect = node.getBoundingClientRect();
					return (
						node.isConnected &&
						rect.width > 0 &&
						rect.height > 0 &&
						rect.top >= 0 &&
						rect.bottom <= innerHeight
					);
				})
				?.focus({ preventScroll: true });
		},
		validation: (node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) =>
			attachLocalizedValidation(node, () => state().locale),
		get locale() {
			return state().locale;
		},
		get state() {
			return state();
		},
		t: (key: MessageKey, parameters?: MessageParameters) =>
			message(state().locale, key, parameters),
		dealer: (field: DealerTextField) => dealerLabel(state().locale, field),
		stock: (value: string | number) => stockValue(state().locale, value),
		vehicleDescription: (value: DayNightVehicle) => vehicleDescription(state().locale, value),
		count: (count: number) => vehicleCount(state().locale, count),
		distance: (value: string) => {
			const number = Number(
				value
					.replace(/\s/g, '')
					.replace(/(?:км|km)$/i, '')
					.replace(',', '.')
			);
			return Number.isFinite(number)
				? new Intl.NumberFormat(state().locale === 'bg' ? 'bg-BG' : 'en-GB').format(number) +
						(state().locale === 'bg' ? ' км' : ' km')
				: value;
		},
		spec: <T>(value: T): T => specificationText(state().locale, value),
		text: <T>(value: T): T => templateText(state().locale, value),
		asset: (value: string) => {
			const base = routeParts(page.url.pathname).base;
			return base &&
				value.startsWith('/') &&
				!value.startsWith('//') &&
				!value.startsWith(base + '/')
				? base + value
				: value;
		},
		endpoint: (value: string) => routeParts(page.url.pathname).base + value,
		href
	};
}
export function applicationUrl(url: URL): URL {
	const result = new URL(url);
	const parts = routeParts(result.pathname);
	result.pathname = parts.base + parts.path;
	return result;
}
