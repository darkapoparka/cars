export type ImportIntentFields = {
	isImport: boolean;
	query: string;
	make: string;
	model: string;
	year: string;
	budget: string;
	sourceUrl: string;
	phone: string;
};

export const emptyImportIntentFields: ImportIntentFields = {
	isImport: false,
	query: '',
	make: '',
	model: '',
	year: '',
	budget: '',
	sourceUrl: '',
	phone: ''
};

type SearchParamsReader = Pick<URLSearchParams, 'get'>;

const readParam = (searchParams: SearchParamsReader, key: string) =>
	searchParams.get(key)?.trim() ?? '';

export function readImportIntent(searchParams: SearchParamsReader): ImportIntentFields {
	const sourceUrl = readParam(searchParams, 'sourceUrl') || readParam(searchParams, 'source');

	return {
		isImport: readParam(searchParams, 'intent') === 'import',
		query: readParam(searchParams, 'q'),
		make: readParam(searchParams, 'make'),
		model: readParam(searchParams, 'model'),
		year: readParam(searchParams, 'year'),
		budget: readParam(searchParams, 'budget'),
		sourceUrl,
		phone: readParam(searchParams, 'phone')
	};
}

export function parseYearValue(value: string): number | null {
	const match = value.trim().match(/\b(?:19|20)\d{2}\b/);
	if (!match) return null;

	const year = Number(match[0]);
	const nextYear = new Date().getFullYear() + 1;
	return year >= 1980 && year <= nextYear ? year : null;
}

export function parseBudgetAmount(value: string): number | null {
	const digits = value.replace(/[^\d]/g, '');
	if (!digits) return null;

	const amount = Number(digits);
	return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

export function buildImportNotes(fields: ImportIntentFields, extraNotes = '') {
	const lines = [
		['Search', fields.query],
		['Make', fields.make],
		['Model', fields.model],
		['Year from', fields.year],
		['Budget', fields.budget],
		['Линк към обява', fields.sourceUrl]
	]
		.filter(([, value]) => value)
		.map(([label, value]) => `${label}: ${value}`);

	const trimmedNotes = extraNotes.trim();
	if (trimmedNotes) lines.push(trimmedNotes);

	return lines.join('\n');
}
