import type {
	AuxeroAccountListingFormData,
	AuxeroListingFormDetailField,
	AuxeroListingFormFeatureGroup,
	AuxeroListingFormHiddenField,
	AuxeroListingFormImage,
	AuxeroListingFormMode,
	AuxeroListingFormOption
} from '$lib/auxero/account-listing-form';
import { eliqautoContact } from '$lib/data/eliqauto';
import { vehicles } from '$lib/data/vehicles';
import { accountContext, type AccountContext } from './account-dashboard-state';
import { accountProfileMapEmbedUrl } from './account-profile-state';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { listInventoryForAdmin, listVehicleSubmissions } from './inventory';

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const editListingIdFromRoute = (routePath = '') => {
	const match = routePath
		.replace(/^\/+|\/+$/g, '')
		.match(/^(?:admin\/inventory|account\/listings)\/edit\/([^/]+)$/);

	if (!match) return undefined;

	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
};

const listingFormGalleryImages: AuxeroListingFormImage[] = [
	{
		alt: 'Gallery 1',
		src: '/assets/images/inner-page/slide-listing-details-6.jpg'
	},
	{
		alt: 'Gallery 2',
		src: '/assets/images/inner-page/slide-listing-details-5.jpg'
	},
	{
		alt: 'Gallery 3',
		src: '/assets/images/inner-page/slide-listing-details-7.jpg'
	},
	{
		alt: 'Gallery 4',
		src: '/assets/images/inner-page/slide-listing-details-8.jpg'
	},
	{
		alt: 'Gallery 5',
		src: '/assets/images/inner-page/slide-listing-details-9.jpg'
	},
	{
		alt: 'Gallery 6',
		src: '/assets/images/inner-page/slide-listing-details-10.jpg'
	},
	{
		alt: 'Gallery 6',
		src: '/assets/images/inner-page/slide-listing-details-11.jpg'
	}
];

const listingFormOptions = (name: string): AuxeroListingFormOption[] =>
	['FWD', 'RWD', 'AWD'].map((value, index) => ({
		label: `${name} ${index + 1}`,
		value
	}));

const listingFormMapOptions = (address: string): AuxeroListingFormOption[] => [
	{ checked: true, label: address, value: address },
	{ label: `${address} 2`, value: 'RWD' },
	{ label: `${address} 3`, value: 'AWD' }
];

const listingInput = (
	wrapperClass: string,
	label: string,
	id: string,
	name: string,
	placeholder: string,
	value = ''
): AuxeroListingFormDetailField => ({
	id,
	label,
	name,
	placeholder,
	required: true,
	type: 'input',
	value,
	wrapperClass
});

const listingDropdown = (
	wrapperClass: string,
	label: string,
	id: string,
	name: string,
	options: AuxeroListingFormOption[] = listingFormOptions(label)
): AuxeroListingFormDetailField => ({
	id,
	label,
	name,
	options,
	type: 'dropdown',
	wrapperClass
});

const listingFormFeatureGroups: AuxeroListingFormFeatureGroup[] = [
	{
		features: [
			{ checked: true, id: 'Front', label: 'A/C: Front' },
			{ checked: true, id: 'BackupCamera', label: 'Backup Camera' },
			{ checked: true, id: 'CruiseControl', label: 'Cruise Control' },
			{ id: 'Navigation', label: 'Navigation' },
			{ id: 'PowerLocks', label: 'Power Locks' }
		],
		title: 'Request Price Label'
	},
	{
		features: [
			{ id: 'Audiosystem', label: 'Audio system' },
			{ id: 'Touchscreendisplay', label: 'Touchscreen display' },
			{ id: 'GPSnavigation', label: 'GPS navigation' },
			{ id: 'Phoneconnectivity', label: 'Phone connectivity' },
			{ id: 'IncarWiFi', label: 'In-car Wi-Fi' }
		],
		title: 'Entertainment'
	},
	{
		features: [
			{ id: 'Antilockbrakesystem', label: 'Anti-lock brake system' },
			{ id: 'Electronicstability', label: 'Electronic stability control' },
			{ id: 'Brakeassist', label: 'Brake assist' },
			{ id: 'Airbags', label: 'Airbags' },
			{ id: 'monitoringBlind', label: 'Blind spot monitoring' }
		],
		title: 'Safety'
	},
	{
		features: [
			{ id: 'Premiumleather', label: 'Premium leather seats' },
			{ id: 'Woodtrim', label: 'Wood trim' },
			{ id: 'Minibar', label: 'Mini bar' },
			{ id: 'ventilation', label: 'Rear seat ventilation' },
			{ id: 'Infotainment', label: 'Infotainment screen' }
		],
		title: 'Interior'
	},
	{
		features: [
			{ id: 'Chromeplatedgrill', label: 'Chrome-plated grill' },
			{ id: 'Smartheadlight', label: 'Smart headlight cluster' },
			{ id: 'Premiumwheels', label: 'Premium wheels' },
			{ id: 'characterBody', label: 'Body character lines' },
			{ id: 'Highqualitypaint', label: 'High-quality paint' }
		],
		title: 'Exterior'
	}
];

export const accountListingFormData = (
	context: AccountContext,
	options: AuxeroRenderOptions = {}
): AuxeroAccountListingFormData => {
	const editListingId = editListingIdFromRoute(options.routePath);
	const editListing = context.isAdmin
		? listInventoryForAdmin().find(
				(listing) =>
					listing.id === editListingId ||
					listing.slug === editListingId ||
					listing.routePath.endsWith(`/${editListingId}`)
			)
		: undefined;
	const editSubmission =
		!context.isAdmin && editListingId
			? listVehicleSubmissions().find((submission) => submission.id === editListingId)
			: undefined;
	const editVehicle = editListing
		? vehicles.find(
				(candidate) =>
					candidate.slug === editListing.slug ||
					candidate.slug === editListing.id ||
					editListing.routePath.endsWith(`/${candidate.slug}`)
			)
		: undefined;
	const vehicle = vehicles[0];
	const title = editSubmission?.title ?? editListing?.title ?? vehicle.title;
	const priceLabel = editSubmission?.expectedPrice ?? editListing?.priceLabel ?? vehicle.priceLabel;
	const vin = editSubmission?.vin ?? editListing?.vin ?? vehicle.stockNumber;
	const mileage =
		editSubmission?.mileage ??
		(typeof editListing?.mileage === 'number' ? km(editListing.mileage) : undefined) ??
		km(vehicle.mileage);
	const engine = editVehicle?.engine ?? vehicle.engine;
	const color = editVehicle?.exterior ?? vehicle.exterior;
	const sourceUrl = editVehicle?.sourceUrl ?? vehicle.sourceUrl;
	const address = editVehicle?.location ?? eliqautoContact.addressLabel;
	const mode: AuxeroListingFormMode =
		editSubmission || editListing?.source === 'admin-listing'
			? 'edit'
			: editListing?.source === 'static-vehicle'
				? 'clone-static'
				: 'create';
	const hiddenFields: AuxeroListingFormHiddenField[] = [
		{ name: 'actorRole', value: context.session.role },
		{ name: 'role', value: context.session.role },
		{
			name: 'routePath',
			value:
				options.routePath ?? (context.isAdmin ? '/admin/inventory/new' : '/account/listings/new')
		},
		{ name: 'status', value: editSubmission?.status ?? editListing?.status ?? 'draft' },
		...(editSubmission ? [{ name: 'submissionId', value: editSubmission.id }] : []),
		...(editListing?.source === 'admin-listing'
			? [{ name: 'listingId', value: editListing.id }]
			: []),
		...(editListing?.source === 'static-vehicle'
			? [{ name: 'sourceId', value: editListing.id }]
			: [])
	];

	return {
		address,
		attachments: [
			{ icon: '/assets/icons/pdf.svg', label: 'Information', type: 'PDF' },
			{ icon: '/assets/icons/doc.svg', label: 'Information', type: 'Doc' }
		],
		detailFields: [
			listingInput('padding-0 col-span-4', 'Car Title', 'title', 'title', 'Car Title*', title),
			listingDropdown('lg-col-span-2 padding-0 sm-col-span-4', 'Model', 'Model', 'model'),
			listingDropdown('lg-col-span-2 padding-0 sm-col-span-4', 'Type', 'Type', 'type'),
			listingInput('lg-col-span-2 padding-0 sm-col-span-4', 'Years', 'Years', 'Years', 'Year'),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Condition',
				'Condition',
				'Condition*',
				'Condition or status'
			),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Stock Number',
				'Enternumber',
				'Enternumber',
				priceLabel,
				priceLabel
			),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'VIN Number',
				'EnterVIN',
				'EnterVIN',
				vin,
				vin
			),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Mileage',
				'mileage',
				'mileage',
				mileage,
				mileage
			),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Transmission',
				'Transmission',
				'Transmission'
			),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Driver Type',
				'DriverType',
				'DriverType',
				listingFormOptions('DriverType')
			),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Engine Size',
				'Enterengine',
				'Enterengine',
				engine || 'Engine on request',
				engine || 'Engine on request'
			),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Cylinders',
				'Cylinders',
				'Cylinders'
			),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Fuel Type',
				'FuelType',
				'FuelType',
				listingFormOptions('FuelType')
			),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Doors',
				'Doors',
				'FuelType',
				listingFormOptions('FuelType')
			),
			listingInput(
				'lg-col-span-2 padding-0 sm-col-span-4',
				'Color',
				'Color',
				'Color',
				color,
				color
			),
			listingDropdown('lg-col-span-2 padding-0 sm-col-span-4', 'Seats', 'Seats', 'Seats'),
			listingDropdown(
				'lg-col-span-2 padding-0 sm-col-span-4 sm-col-span-4',
				'City MPG',
				'CityMPG',
				'CityMPG',
				listingFormOptions('CityMPG')
			),
			{
				id: 'Doorstextarea',
				label: 'Doors',
				name: 'Doorstextarea',
				placeholder: 'Vehicle description and inspection notes',
				required: true,
				rows: 5,
				type: 'textarea',
				value: editSubmission?.message ?? '',
				wrapperClass: 'padding-0 col-span-4'
			}
		],
		featureGroups: listingFormFeatureGroups,
		galleryImages: listingFormGalleryImages,
		hiddenFields,
		locationOptions: listingFormMapOptions(address),
		mapEmbedUrl: accountProfileMapEmbedUrl,
		mode,
		previewImage: {
			alt: 'Car Preview',
			src: '/assets/images/inner-page/slide-listing-details-5.jpg'
		},
		priceLabel,
		sourceUrl
	};
};

export const listingFormFieldValue = (form: AuxeroAccountListingFormData, id: string) => {
	const field = form.detailFields.find(
		(candidate): candidate is Extract<AuxeroListingFormDetailField, { value: string }> =>
			candidate.id === id && candidate.type !== 'dropdown'
	);

	return field?.value ?? '';
};

export const getAccountListingFormData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountListingFormData(accountContext(templateFile, options), options);
