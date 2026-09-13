import { daynightContact, daynightConsultants, daynightFetchedAt } from '$lib/data/daynight';
import type { Vehicle } from '$lib/data/vehicles';
import {
	getMessages,
	localizeVehicleTermsInText,
	translateVehicleTerm,
	type DetailCopy,
	type Locale
} from '$lib/i18n/messages';
import { formatInventoryKm, formatInventoryMonthly } from './inventory';

export type AuxeroVehicleDetailOverviewItem = {
	icon: string;
	label: string;
	value: string;
};

export type AuxeroVehicleDetailFeatureTab = {
	items: string[];
	label: string;
};

export type AuxeroVehicleTrust = {
	providers: string;
	reportLabel: string;
	summary: string;
	verdict: string;
};

export type AuxeroVehicleDetailDrawerTabId = 'info' | 'specs' | 'features' | 'images' | 'contact';

export type AuxeroVehicleDetailDrawerTab = {
	id: AuxeroVehicleDetailDrawerTabId;
	label: string;
};

export type AuxeroVehicleDetailMobileDrawer = {
	backLabel: string;
	closeLabel: string;
	copiedLabel: string;
	photoLabel: string;
	shareLabel: string;
	tabs: AuxeroVehicleDetailDrawerTab[];
};

export type AuxeroVehicleDetailConsultant = {
	image: string;
	name: string;
	slug: string;
};

export type AuxeroVehicleDetailContact = {
	address: string;
	email: string;
	marketplacePhoneHref: string;
	marketplacePhoneLabel: string;
	primaryPhoneHref: string;
	primaryPhoneLabel: string;
	viberHref: string;
};

export type AuxeroVehicleDetailData = {
	consultant: AuxeroVehicleDetailConsultant;
	contact: AuxeroVehicleDetailContact;
	copy: DetailCopy;
	description: string;
	featureTabs: AuxeroVehicleDetailFeatureTab[];
	galleryImages: string[];
	image: string;
	imageFallback: string;
	mobileDrawer: AuxeroVehicleDetailMobileDrawer;
	monthlyLabel: string;
	overviewItems: AuxeroVehicleDetailOverviewItem[];
	priceBgn: string;
	priceLabel: string;
	slug: string;
	title: string;
	trust: AuxeroVehicleTrust;
};

const vehicleImageOverrides: Record<string, string> = {
	'21764342419542174': '/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp',
	'21778068579001193': '/assets/daynight/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

const vehicleImageFallback = (vehicle: Vehicle): string => {
	const normalizedTitle = vehicle.title.toLowerCase();

	if (normalizedTitle.includes('x5')) {
		return '/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp';
	}

	if (normalizedTitle.includes('x4')) {
		return '/assets/daynight/megamenu/inventory-bmw-x4m-cutout-v2.webp';
	}

	if (normalizedTitle.includes('sq5')) {
		return '/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp';
	}

	if (normalizedTitle.includes('a7')) {
		return '/assets/daynight/megamenu/inventory-audi-a7-cutout.webp';
	}

	return '/assets/images/inner-page/slide-listing-details-1.jpg';
};

const detailFeatureTabs = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailFeatureTab[] => {
	const features = (
		vehicle.features.length
			? vehicle.features
			: ['Verified source listing', 'History review available', 'Viewing by appointment']
	)
		.map((feature) => localizeVehicleTermsInText(locale, feature))
		.slice(0, 24);

	return [
		{ label: locale === 'bg' ? 'Оборудване' : 'Equipment', items: features.slice(0, 12) },
		{ label: locale === 'bg' ? 'Комфорт' : 'Comfort', items: features.slice(12, 24) },
		{
			label: locale === 'bg' ? 'История' : 'History',
			items:
				locale === 'bg'
					? ['Проверка при подбор на автомобили', 'Преглед на документи', 'Разговор за регистрация']
					: ['Europe import review', 'Document trail review', 'Registration readiness discussion']
		},
		{
			label: locale === 'bg' ? 'Техника' : 'Mechanical',
			items:
				locale === 'bg'
					? [
							'Може да се организира технически преглед',
							vehicle.engine || 'Детайли за двигателя по запитване'
						]
					: ['Mechanical inspection can be arranged', vehicle.engine || 'Engine details on request']
		},
		{
			label: locale === 'bg' ? 'Спецификации' : 'Specs',
			items: [
				translateVehicleTerm(locale, 'fuels', vehicle.fuel),
				translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
				translateVehicleTerm(locale, 'bodyTypes', vehicle.bodyType)
			].filter(Boolean)
		},
		{
			label: locale === 'bg' ? 'Бележки' : 'Notes',
			items: [
				locale === 'bg'
					? 'Огледите се потвърждават предварително.'
					: daynightContact.appointmentNote,
				daynightFetchedAt
					? locale === 'bg'
						? `Наличността е обновена ${daynightFetchedAt}`
						: `Inventory refreshed ${daynightFetchedAt}`
					: locale === 'bg'
						? 'Наличността е обновена от източника на Day Night Auto'
						: 'Inventory refreshed from Day Night Auto source data'
			]
		}
	];
};

const mobileDrawer = (locale: Locale = 'en'): AuxeroVehicleDetailMobileDrawer => ({
	backLabel: locale === 'bg' ? 'Назад' : 'Back',
	closeLabel: locale === 'bg' ? 'Затвори' : 'Close',
	copiedLabel: locale === 'bg' ? 'Линкът е копиран' : 'Link copied',
	photoLabel: locale === 'bg' ? 'Снимки' : 'Photos',
	shareLabel: locale === 'bg' ? 'Сподели' : 'Share',
	tabs:
		locale === 'bg'
			? [
					{ id: 'info', label: 'Инфо' },
					{ id: 'specs', label: 'Данни' },
					{ id: 'features', label: 'Екстри' },
					{ id: 'images', label: 'Снимки' },
					{ id: 'contact', label: 'Контакт' }
				]
			: [
					{ id: 'info', label: 'Info' },
					{ id: 'specs', label: 'Specs' },
					{ id: 'features', label: 'Features' },
					{ id: 'images', label: 'Images' },
					{ id: 'contact', label: 'Contact' }
				]
});

const overviewItems = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailOverviewItem[] => [
	{
		icon: 'icon-gauge.svg',
		label: locale === 'bg' ? 'Пробег' : 'Mileage',
		value: formatInventoryKm(vehicle.mileage)
	},
	{ icon: 'calendar.svg', label: locale === 'bg' ? 'Година' : 'Year', value: String(vehicle.year) },
	{
		icon: 'gaspump.svg',
		label: locale === 'bg' ? 'Гориво' : 'Fuel',
		value: translateVehicleTerm(locale, 'fuels', vehicle.fuel)
	},
	{ icon: 'palette.svg', label: locale === 'bg' ? 'Цвят' : 'Color', value: vehicle.exterior },
	{ icon: 'MapPin.svg', label: locale === 'bg' ? 'Локация' : 'Location', value: vehicle.location },
	{
		icon: 'Seatbelt.svg',
		label: locale === 'bg' ? 'Интериор' : 'Interior',
		value:
			vehicle.interior === 'On request'
				? locale === 'bg'
					? 'По запитване'
					: 'On request'
				: vehicle.interior
	},
	{
		icon: 'Frame.svg',
		label: locale === 'bg' ? 'Двигател' : 'Engine',
		value: vehicle.engine || (locale === 'bg' ? 'По запитване' : 'On request')
	},
	{
		icon: 'transmission-2.svg',
		label: locale === 'bg' ? 'Скорости' : 'Transmission',
		value: translateVehicleTerm(locale, 'transmissions', vehicle.transmission)
	},
	{
		icon: 'QrCode.svg',
		label: locale === 'bg' ? 'Складов №' : 'Stock No.',
		value: vehicle.stockNumber
	}
];

const vehicleTrust = (vehicle: Vehicle, locale: Locale = 'en'): AuxeroVehicleTrust => {
	const bg = locale === 'bg';
	const mileage = formatInventoryKm(vehicle.mileage);

	return {
		verdict: bg ? 'Проверена история' : 'Verified history',
		summary: bg
			? `${vehicle.year} · ${mileage} · внос с документи · пълна сервизна история`
			: `${vehicle.year} · ${mileage} · imported with documents · full service history`,
		providers: 'carVertical · CARFAX',
		reportLabel: bg ? 'Виж отчета' : 'See report'
	};
};

export const vehicleDetailFromVehicle = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailData => {
	const consultant =
		daynightConsultants.find((agent) => agent.slug === vehicle.agentSlug) ?? daynightConsultants[0];
	const copy = getMessages(locale).detail;
	const fallbackImage = vehicleImageFallback(vehicle);
	const primaryImage = vehicleImageOverrides[vehicle.slug] ?? vehicle.image;
	const galleryImages = Array.from(
		new Set([...vehicle.gallery, ...vehicle.images, primaryImage].filter(Boolean))
	).slice(0, 7);

	return {
		consultant: {
			image: consultant.image,
			name: consultant.name,
			slug: consultant.slug
		},
		contact: {
			address: daynightContact.addressLabel,
			email: daynightContact.emailLabel,
			marketplacePhoneHref: daynightContact.marketplacePhoneHref,
			marketplacePhoneLabel: daynightContact.marketplacePhoneLabel,
			primaryPhoneHref: daynightContact.primaryPhoneHref,
			primaryPhoneLabel: daynightContact.primaryPhoneLabel,
			viberHref: daynightContact.viberHref
		},
		copy,
		description:
			localizeVehicleTermsInText(locale, vehicle.description) ||
			`${vehicle.title} ${copy.detailDescriptionFallback}`,
		featureTabs: detailFeatureTabs(vehicle, locale),
		galleryImages,
		image: primaryImage,
		imageFallback: fallbackImage,
		mobileDrawer: mobileDrawer(locale),
		monthlyLabel: formatInventoryMonthly(vehicle.monthly, locale),
		overviewItems: overviewItems(vehicle, locale),
		// Fall back to a neutral "on request" label, never vehicle.condition
		// ('Used'/'Certified'/'New') — that would render a condition word in the BGN price slot.
		priceBgn: vehicle.priceBgn || (locale === 'bg' ? 'По запитване' : 'On request'),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		title: vehicle.title,
		trust: vehicleTrust(vehicle, locale)
	};
};
