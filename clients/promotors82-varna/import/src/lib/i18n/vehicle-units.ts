import type { Locale } from '$lib/locale/core';
export const vehicleUnits = {
	bg: { displacement: 'куб.см', power: 'к.с.', distance: 'км' },
	en: { displacement: 'cc', power: 'hp', distance: 'km' }
} satisfies Record<Locale, Record<'displacement' | 'power' | 'distance', string>>;
/** Translate unit labels only at the presentation boundary. Numeric stock facts are untouched. */
export function engineLabel(value: string, locale: Locale) {
	return value
		.replaceAll(vehicleUnits.bg.displacement, vehicleUnits[locale].displacement)
		.replaceAll(vehicleUnits.bg.power, vehicleUnits[locale].power);
}
