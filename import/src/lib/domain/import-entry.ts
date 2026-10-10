import { importCriteriaFromParams, type ImportCriteria } from '$lib/data/import-criteria';
import { isVehicleReference } from './vehicle-intake';

export type ImportIntent = 'listing' | 'source';

export function importEntryComplete(
	intent: ImportIntent,
	vehicle: string,
	criteria: Pick<ImportCriteria, 'make' | 'model' | 'origin'>
): boolean {
	return intent === 'listing'
		? isVehicleReference(vehicle)
		: Boolean(criteria.origin) ||
				criteria.make.trim().length > 1 ||
				criteria.model.trim().length > 1;
}

/** Desktop entry navigation starts the remaining steps only after a complete first step. */
export function importEntryFromParams(params: URLSearchParams) {
	const intent: ImportIntent = params.get('intent') === 'source' ? 'source' : 'listing';
	const vehicle = (params.get('vehicle') ?? '').trim().slice(0, 2000);
	const criteria = importCriteriaFromParams(params);
	const complete = importEntryComplete(intent, vehicle, criteria);
	const step: 0 | 1 =
		complete && (intent === 'listing' || params.get('step') === 'details') ? 1 : 0;
	return { intent, step, key: JSON.stringify({ intent, vehicle, criteria, step }) };
}
