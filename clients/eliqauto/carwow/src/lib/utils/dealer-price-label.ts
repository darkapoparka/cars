/** A zero placeholder for an unquoted listing is not an advertised free car. */
export function dealerVehiclePriceLabel(value: string, locale: 'en' | 'bg'): string {
	return /^\s*0(?:[.,]0+)?\s*(?:€|EUR)\s*$/u.test(value)
		? (locale === 'bg' ? 'Цена при запитване' : 'Price on request')
		: value;
}
