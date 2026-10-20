import type { Locale } from '$lib/locale/core';
import { constraintMessage } from '$lib/i18n/validation';
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Scoped to the public layout lifetime, including its portaled native forms. */
export function localizedValidation(node: HTMLElement, readLocale: () => Locale) {
	const document = node.ownerDocument;
	const owned = new Map<Control, string>();
	const control = (target: EventTarget | null): Control | undefined =>
		target instanceof HTMLInputElement ||
		target instanceof HTMLSelectElement ||
		target instanceof HTMLTextAreaElement
			? target
			: undefined;
	const clearOwned = (field: Control) => {
		const previous = owned.get(field);
		if (previous !== undefined && field.validationMessage === previous) field.setCustomValidity('');
		owned.delete(field);
	};
	const invalid = (event: Event) => {
		const field = control(event.target);
		if (!node.isConnected || !field || !field.form) return;
		for (const candidate of owned.keys()) if (!candidate.isConnected) clearOwned(candidate);
		clearOwned(field);
		// Another component's explicit custom error remains its responsibility.
		if (field.validity.customError) return;
		const text = constraintMessage(
			field.validity,
			field instanceof HTMLInputElement ? field.type : '',
			readLocale()
		);
		if (text) {
			field.setCustomValidity(text);
			owned.set(field, text);
		}
	};
	const changed = (event: Event) => {
		const field = control(event.target);
		if (field) clearOwned(field);
	};
	document.addEventListener('invalid', invalid, true);
	document.addEventListener('input', changed, true);
	document.addEventListener('change', changed, true);
	return {
		update(next: () => Locale) {
			readLocale = next;
			for (const field of [...owned.keys()]) clearOwned(field);
		},
		destroy() {
			document.removeEventListener('invalid', invalid, true);
			document.removeEventListener('input', changed, true);
			document.removeEventListener('change', changed, true);
			for (const field of [...owned.keys()]) clearOwned(field);
		}
	};
}
