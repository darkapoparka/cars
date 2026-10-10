import { importBodyTypes, importCriteriaFromParams, importMakes } from '$lib/data/import-criteria';
import { inventoryCardsFromVehicles, type VehicleCardSummary } from '$lib/domain/vehicle-card';
import type { Vehicle } from '$lib/types/vehicle';
import type { Locale } from '$lib/locale/core';
import { translateVehicleTerm } from '$lib/i18n/messages';

export type ImportBrowseData = {
	cards: VehicleCardSummary[];
	count: number;
	types: { value: string; label: string }[];
	makes: string[];
	models: string[];
};

export function importBrowseData(
	stock: Vehicle[],
	params: URLSearchParams,
	locale: Locale
): ImportBrowseData {
	const criteria = importCriteriaFromParams(params);
	const normalized = (value: string) => value.trim().toLocaleLowerCase();
	const makeMatches = (vehicle: Vehicle) =>
		!criteria.make || normalized(vehicle.brand) === normalized(criteria.make);
	const selected = stock.filter(
		(vehicle) =>
			makeMatches(vehicle) &&
			(!criteria.bodyType || vehicle.bodyType === criteria.bodyType) &&
			(!criteria.model ||
				normalized(vehicle.model).includes(normalized(criteria.model)) ||
				normalized(vehicle.title).includes(normalized(criteria.model)))
	);
	// Country describes a sourcing request. Stock has no verified origin-country field.
	return {
		cards: inventoryCardsFromVehicles(selected.slice(0, 3), locale),
		count: selected.length,
		types: importBodyTypes.map((value) => ({
			value,
			label: translateVehicleTerm(locale, 'bodyTypes', value)
		})),
		makes: [...new Set([...importMakes, ...stock.map((vehicle) => vehicle.brand)])].sort(),
		models: [...new Set(stock.filter(makeMatches).map((vehicle) => vehicle.model))].sort()
	};
}
