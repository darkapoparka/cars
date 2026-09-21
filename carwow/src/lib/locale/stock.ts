import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { intlLocale, type Locale } from './core';
import { specificationText } from './messages';
/** Formatting changes units/labels only. Stock numbers, IDs and customer copy are unchanged. */
export function stockValue(locale: Locale, value: string | number): string {
	if (typeof value === 'number') return new Intl.NumberFormat(intlLocale(locale)).format(value);
	const unit = value.match(/^([\d\s.,]+)\s*(км|km|к\.с\.|hp|лв\.)$/);
	if (unit) {
		const number = Number(unit[1].replace(/\s/g, '').replace(',', '.'));
		if (Number.isFinite(number))
			return (
				new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 2 }).format(number) +
				' ' +
				(locale === 'bg' ? unit[2] : ({ км: 'km', 'к.с.': 'hp', 'лв.': 'BGN' }[unit[2]] ?? unit[2]))
			);
	}
	return specificationText(locale, value);
}
export function vehicleDescription(locale: Locale, vehicle: DayNightVehicle): string {
	const original = `${vehicle.shortTitle}, ${vehicle.year} г., ${vehicle.fuel.toLocaleLowerCase('bg-BG')}, ${vehicle.mileage}, ${vehicle.power}, ${vehicle.transmission.toLocaleLowerCase('bg-BG')}. ${vehicle.conditionLine}`;
	// Only the template-composed description is localized; dealer-entered prose is not rewritten.
	if (vehicle.description !== original) return vehicle.description;
	return `${vehicle.shortTitle}, ${vehicle.year}, ${stockValue(locale, vehicle.fuel)}, ${stockValue(locale, vehicle.mileage)}, ${stockValue(locale, vehicle.power)}, ${stockValue(locale, vehicle.transmission)}. ${stockValue(locale, vehicle.conditionLine)}`;
}
