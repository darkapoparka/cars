/** Construct contact destinations once from the dealer's international phone number. */
export function contactLinks(phoneE164: string) {
	if (!/^\+[1-9]\d{5,14}$/.test(phoneE164)) {
		throw new Error('Configure the dealer phone as an international +country-code number.');
	}
	return {
		phoneHref: `tel:${phoneE164}` as const,
		viberHref: `viber://chat?number=${encodeURIComponent(phoneE164)}` as const
	};
}
