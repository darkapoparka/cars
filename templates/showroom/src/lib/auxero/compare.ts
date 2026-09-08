import type { Vehicle } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
import { formatInventoryKm } from './inventory';

export type AuxeroCompareVehicle = {
	brand: string;
	engine: string;
	exterior: string;
	fuel: string;
	image: string;
	interior: string;
	location: string;
	mileageLabel: string;
	model: string;
	priceLabel: string;
	slug: string;
	stockNumber: string;
	title: string;
	transmission: string;
	vin: string;
	year: number;
};

export type AuxeroCompareRow = {
	alt: string;
	icon: string;
	label: string;
	values: string[];
	/** Column indexes that hold the winning value for this row (empty = no winner). */
	bestIndexes?: number[];
	/** Short pill shown on the winning cell(s), e.g. "Най-добра цена". */
	badge?: string;
};

export type AuxeroCompareRowGroup = {
	open: boolean;
	rows: AuxeroCompareRow[];
	title: string;
};

export type AuxeroCompareBrandOption = {
	brand: string;
	count: number;
};

export type CompareDrawerFilterOptions = {
	brand: string;
	locale: Locale;
	query: string;
	selectedSlugs: string[];
	vehicles: AuxeroCompareVehicle[];
};

const compareFallback = (locale: Locale) => (locale === 'bg' ? 'По запитване' : 'On request');

// Listing data stores the literal English placeholder; treat it as missing so
// the Bulgarian table shows "По запитване" instead of a stray "On request".
const compareValue = (value: string | undefined | null, locale: Locale) =>
	!value || value === 'On request' ? compareFallback(locale) : value;

const compareImageOverrides: Record<string, string> = {
	'11774283016080050': '/assets/eliqauto/megamenu/inventory-audi-a7-cutout.webp',
	'21764342419542174': '/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp',
	'21778068579001193': '/assets/eliqauto/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

export const compareVehiclesFromVehicles = (
	vehicles: Vehicle[],
	locale: Locale = 'en'
): AuxeroCompareVehicle[] =>
	vehicles.map((vehicle) => ({
		brand: vehicle.brand,
		engine: compareValue(vehicle.engine, locale),
		exterior: compareValue(vehicle.exterior, locale),
		fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
		image: compareImageOverrides[vehicle.slug] ?? vehicle.image,
		interior: compareValue(vehicle.interior, locale),
		location: vehicle.location,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		model: vehicle.model,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		stockNumber: vehicle.stockNumber,
		title: vehicle.title,
		transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
		vin: vehicle.vin,
		year: vehicle.year
	}));

// Pull a comparable integer out of a formatted label ("140 000 km" -> 140000).
const numericFromLabel = (value: string): number | null => {
	const digits = String(value).replace(/[^\d]/g, '');
	if (!digits) return null;
	const parsed = Number(digits);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

// Indexes of the winning value(s) for a row. Empty when there is no meaningful
// winner: fewer than two real values, or every value ties.
const bestValueIndexes = (numbers: (number | null)[], direction: 'min' | 'max'): number[] => {
	const valid = numbers.filter((value): value is number => value !== null);
	if (valid.length < 2) return [];
	const target = direction === 'min' ? Math.min(...valid) : Math.max(...valid);
	if (valid.every((value) => value === target)) return [];
	return numbers.flatMap((value, index) => (value === target ? [index] : []));
};

export const compareRowsFromVehicles = (
	vehicles: AuxeroCompareVehicle[],
	locale: Locale = 'en'
): AuxeroCompareRow[] => [
	{
		alt: locale === 'bg' ? 'пробег' : 'mileage',
		icon: 'mileage.svg',
		label: locale === 'bg' ? 'Пробег' : 'Mileage',
		values: vehicles.map((vehicle) => vehicle.mileageLabel),
		bestIndexes: bestValueIndexes(
			vehicles.map((vehicle) => numericFromLabel(vehicle.mileageLabel)),
			'min'
		),
		badge: locale === 'bg' ? 'Най-малко км' : 'Lowest km'
	},
	{
		alt: locale === 'bg' ? 'година' : 'year',
		icon: 'years.svg',
		label: locale === 'bg' ? 'Година' : 'Years',
		values: vehicles.map((vehicle) => String(vehicle.year)),
		bestIndexes: bestValueIndexes(
			vehicles.map((vehicle) => vehicle.year),
			'max'
		),
		badge: locale === 'bg' ? 'Най-нова' : 'Newest'
	},
	{
		alt: locale === 'bg' ? 'гориво' : 'fuel',
		icon: 'gaspump.svg',
		label: locale === 'bg' ? 'Гориво' : 'Fuel',
		values: vehicles.map((vehicle) => vehicle.fuel)
	},
	{
		alt: locale === 'bg' ? 'цвят' : 'color',
		icon: 'color.svg',
		label: locale === 'bg' ? 'Цвят' : 'Color',
		values: vehicles.map((vehicle) => vehicle.exterior)
	},
	{
		alt: locale === 'bg' ? 'локация' : 'location',
		icon: 'location.svg',
		label: locale === 'bg' ? 'Локация' : 'Location',
		values: vehicles.map((vehicle) => vehicle.location)
	},
	{
		alt: locale === 'bg' ? 'интериор' : 'interior',
		icon: 'interior.svg',
		label: locale === 'bg' ? 'Интериор' : 'Interior',
		values: vehicles.map((vehicle) => vehicle.interior)
	},
	{
		alt: locale === 'bg' ? 'двигател' : 'engine',
		icon: 'engine.svg',
		label: locale === 'bg' ? 'Двигател' : 'Engine',
		values: vehicles.map((vehicle) => vehicle.engine)
	},
	{
		alt: locale === 'bg' ? 'скорости' : 'transmission',
		icon: 'transmission.svg',
		label: locale === 'bg' ? 'Скорости' : 'Transmission',
		values: vehicles.map((vehicle) => vehicle.transmission)
	},
	{
		alt: locale === 'bg' ? 'ID от източника' : 'source id',
		icon: 'VIN.svg',
		label: locale === 'bg' ? 'ID от източника' : 'Source ID',
		values: vehicles.map((vehicle) => vehicle.vin)
	},
	{
		alt: locale === 'bg' ? 'номер в наличност' : 'stock number',
		icon: 'QrCode.svg',
		label: locale === 'bg' ? 'Номер в наличност' : 'Stock Number',
		values: vehicles.map((vehicle) => vehicle.stockNumber)
	},
	{
		alt: locale === 'bg' ? 'цена' : 'price',
		icon: 'Payment.png',
		label: locale === 'bg' ? 'Цена' : 'Price',
		values: vehicles.map((vehicle) => vehicle.priceLabel),
		bestIndexes: bestValueIndexes(
			vehicles.map((vehicle) => numericFromLabel(vehicle.priceLabel)),
			'min'
		),
		badge: locale === 'bg' ? 'Най-добра цена' : 'Best price'
	}
];

export const compareRowGroups = (
	sourceRows: AuxeroCompareRow[],
	locale: Locale,
	firstGroupOpen = true
): AuxeroCompareRowGroup[] => {
	const pickRows = (indexes: number[]) =>
		indexes
			.map((index) => sourceRows[index])
			.filter((row): row is AuxeroCompareRow => Boolean(row));

	return [
		{
			open: firstGroupOpen,
			rows: pickRows([10, 0, 1, 2]),
			title: locale === 'bg' ? 'Основни' : 'Core'
		},
		{
			open: false,
			rows: pickRows([6, 7, 3, 5]),
			title: locale === 'bg' ? 'Техника' : 'Technical'
		},
		{
			open: false,
			rows: pickRows([4, 8, 9]),
			title: locale === 'bg' ? 'Произход' : 'Source'
		}
	].filter((group) => group.rows.length > 0);
};

export const compareBrandOptions = (
	vehicles: AuxeroCompareVehicle[],
	locale: Locale
): AuxeroCompareBrandOption[] => {
	const brandCounts: Record<string, number> = {};

	for (const vehicle of vehicles) {
		brandCounts[vehicle.brand] = (brandCounts[vehicle.brand] ?? 0) + 1;
	}

	return Object.entries(brandCounts)
		.map(([brand, count]) => ({ brand, count }))
		.sort((left, right) => left.brand.localeCompare(right.brand, locale));
};

export const filterCompareDrawerVehicles = ({
	brand,
	locale,
	query,
	selectedSlugs,
	vehicles
}: CompareDrawerFilterOptions) => {
	const normalizedQuery = query.trim().toLocaleLowerCase();

	return vehicles
		.filter((vehicle) => {
			const matchesBrand = !brand || vehicle.brand === brand;
			const matchesQuery =
				!normalizedQuery ||
				[vehicle.title, vehicle.brand, vehicle.model, vehicle.year, vehicle.priceLabel]
					.join(' ')
					.toLocaleLowerCase()
					.includes(normalizedQuery);

			return matchesBrand && matchesQuery;
		})
		.sort((left, right) => {
			const leftSelected = selectedSlugs.includes(left.slug) ? 0 : 1;
			const rightSelected = selectedSlugs.includes(right.slug) ? 0 : 1;

			return leftSelected - rightSelected || left.title.localeCompare(right.title, locale);
		});
};

export const compareRowValuesForSlots = (
	row: AuxeroCompareRow,
	slotSlugs: (string | null | undefined)[],
	emptyValue: string
) => {
	let valueIndex = 0;

	return slotSlugs.map((slug) => {
		if (!slug) return emptyValue;

		const value = row.values[valueIndex] ?? emptyValue;
		valueIndex += 1;

		return value;
	});
};
