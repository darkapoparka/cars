import type { Locale } from './core';
import { message, type MessageKey } from './messages';
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
/** Native form validity messages in the selected UI locale, attached per control. */
export function attachLocalizedValidation(node: Control, locale: () => Locale) {
	const invalid = () => {
		const validity = node.validity;
		if (validity.customError) return; // Preserve the component's own domain validator.
		let key: MessageKey = 'form.invalid';
		if (validity.valueMissing) key = 'form.required';
		else if (validity.typeMismatch && node instanceof HTMLInputElement && node.type === 'email')
			key = 'form.email';
		else if (validity.rangeUnderflow) key = 'form.minimum';
		else if (validity.rangeOverflow) key = 'form.maximum';
		else if (validity.tooShort) key = 'form.tooShort';
		else if (validity.tooLong) key = 'form.tooLong';
		node.setCustomValidity(
			message(locale(), key, {
				min: node.getAttribute('min') ?? node.getAttribute('minlength') ?? '',
				max: node.getAttribute('max') ?? node.getAttribute('maxlength') ?? ''
			})
		);
	};
	const clear = () => node.setCustomValidity('');
	node.addEventListener('invalid', invalid);
	node.addEventListener('input', clear);
	node.addEventListener('change', clear);
	return () => {
		node.removeEventListener('invalid', invalid);
		node.removeEventListener('input', clear);
		node.removeEventListener('change', clear);
	};
}
