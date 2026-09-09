export const importCountries = [
	{ value: '', label: 'Всички' },
	{ value: 'CN', label: 'Китай' },
	{ value: 'DE', label: 'Германия' },
	{ value: 'US', label: 'САЩ' },
	{ value: 'JP', label: 'Япония' },
	{ value: 'KR', label: 'Южна Корея' }
] as const;

export const importFuels = ['Бензин', 'Дизел', 'Хибрид', 'Електрически'];
export const importTransmissions = ['Автомат', 'Ръчни'];
export const importMakes = [
	'Audi',
	'BMW',
	'Mercedes-Benz',
	'Volkswagen',
	'Toyota',
	'Porsche',
	'Volvo',
	'Hyundai',
	'Kia',
	'Tesla'
];
export type ImportCriteria = {
	origin: string;
	make: string;
	model: string;
	minYear: string;
	maxPrice: string;
	fuel: string;
	transmission: string;
};
export const emptyImportCriteria: ImportCriteria = {
	origin: '',
	make: '',
	model: '',
	minYear: '',
	maxPrice: '',
	fuel: '',
	transmission: ''
};
export const importCriteriaFromParams = (params: URLSearchParams): ImportCriteria => {
	const origin = params.get('origin')?.toUpperCase() ?? '';
	const year = params.get('minYear') ?? '';
	const budget = params.get('maxPrice') ?? '';
	return {
		origin: importCountries.some((country) => country.value === origin) ? origin : '',
		make: (params.get('make') ?? '').trim().slice(0, 60),
		model: (params.get('model') ?? '').trim().slice(0, 80),
		minYear:
			/^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= new Date().getFullYear()
				? year
				: '',
		maxPrice: /^\d{1,8}$/.test(budget) && Number(budget) > 0 ? String(Number(budget)) : '',
		fuel: importFuels.find((fuel) => fuel === params.get('fuel')) ?? '',
		transmission: importTransmissions.find((value) => value === params.get('transmission')) ?? ''
	};
};
export const importCriteriaUrl = (url: URL, criteria: ImportCriteria) => {
	const next = new URL(url);
	for (const key of Object.keys(emptyImportCriteria) as (keyof ImportCriteria)[]) {
		if (criteria[key].trim()) next.searchParams.set(key, criteria[key].trim());
		else next.searchParams.delete(key);
	}
	return `${next.pathname}${next.search}${next.hash}`;
};
export const importCriteriaSummary = (criteria: ImportCriteria) =>
	[
		importCountries.find((country) => country.value === criteria.origin && country.value)?.label,
		[criteria.make, criteria.model].filter(Boolean).join(' '),
		criteria.minYear ? `от ${criteria.minYear} г.` : '',
		criteria.maxPrice ? `до ${Number(criteria.maxPrice).toLocaleString('bg-BG')} €` : '',
		criteria.fuel,
		criteria.transmission
	]
		.filter(Boolean)
		.join(' · ');
