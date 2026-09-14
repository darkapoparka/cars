import type {
	AuxeroAccountListingRow,
	AuxeroAccountListingsData
} from '$lib/auxero/account-listings';
import { daynightContact } from '$lib/data/daynight';
import { vehicles, type Vehicle } from '$lib/data/vehicles';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { accountContext, type AccountContext } from './account-dashboard-state';
import { listVehicleSubmissions } from './inventory';

export const accountInventoryListingRows = (
	source: Vehicle[] = vehicles.slice(0, 5)
): AuxeroAccountListingRow[] =>
	source.map((vehicle) => ({
		actions: [
			{
				ariaLabel: `Edit ${vehicle.title}`,
				href: `/admin/inventory/edit/${encodeURIComponent(vehicle.slug)}`,
				icon: '/assets/icons/dashboard-edit.svg',
				kind: 'edit-inventory',
				label: 'Edit Listing'
			},
			{
				ariaLabel: `Remove ${vehicle.title}`,
				icon: '/assets/icons/dashboard-trash.svg',
				kind: 'remove',
				label: 'Remove Listing'
			}
		],
		columns: [vehicle.brand, String(vehicle.year), vehicle.transmission, vehicle.fuel],
		description: vehicle.description || daynightContact.appointmentNote,
		href: `/inventory/${encodeURIComponent(vehicle.slug)}`,
		id: vehicle.slug,
		image: vehicle.image,
		kind: 'inventory',
		priceLabel: vehicle.priceLabel,
		title: vehicle.title
	}));

const submissionStatusBg: Record<string, string> = {
	draft: 'Чернова',
	published: 'Публикувана',
	reviewing: 'В преглед',
	submitted: 'Подадена'
};

// The in-memory demo submissions may carry English seed/default messages. Localize
// the known ones at display time so the list reads fully in Bulgarian regardless of
// when the data was created.
const submissionMessageBg: Record<string, string> = {
	'Vehicle submission queued for review.': 'Заявката е в опашка за преглед.',
	'Client vehicle submitted with VIN, photos, and service history for review.':
		'Клиентският автомобил е подаден с VIN, снимки и сервизна история за преглед.',
	'Customer asked whether Promosale Varna can prepare a direct offer or client listing.':
		'Клиентът пита дали Promosale Varna може да подготви директна оферта или обява.'
};

const localizeSubmissionMessage = (message: string) => submissionMessageBg[message] ?? message;

const submissionTitleBg: Record<string, string> = {
	'Client BMW evaluation': 'Оценка на клиентско BMW',
	'Trade-in review request': 'Заявка за замяна'
};

export const accountSubmissionListingRows = (): AuxeroAccountListingRow[] =>
	listVehicleSubmissions().map((submission) => ({
		actions: [
			{
				ariaLabel: `Редактирай ${submission.title}`,
				href: `/account/listings/edit/${encodeURIComponent(submission.id)}`,
				icon: '/assets/icons/dashboard-edit.svg',
				kind: 'edit-submission',
				label: 'Редактирай'
			},
			{
				ariaLabel: 'Съобщение до Promosale Varna',
				href: '/account/messages',
				icon: '/assets/images/dashboard/Messages.svg',
				kind: 'message',
				label: 'Съобщение'
			}
		],
		columns: [
			submission.contactPhone,
			submission.expectedPrice,
			submission.mileage,
			submissionStatusBg[submission.status] ?? submission.status
		],
		description: localizeSubmissionMessage(submission.message),
		id: submission.id,
		image: '/assets/images/dashboard/car.svg',
		kind: 'submission',
		title: submissionTitleBg[submission.title] ?? submission.title,
		titleMeta: submission.vin
	}));

export const accountListingsData = (
	context: AccountContext,
	source: Vehicle[] = vehicles.slice(0, 5)
): AuxeroAccountListingsData =>
	context.isAdmin
		? {
				footerText: `Showing ${source.length} of ${vehicles.length} Promosale Varna entries`,
				headers: ['Car', 'Brand', 'Year', 'Transmission', 'Fuel Type', 'Action'],
				isSubmissions: false,
				pagination: ['1', '2', '3'],
				rows: accountInventoryListingRows(source)
			}
		: {
				footerText: `Показани ${listVehicleSubmissions().length} заявки за продажба`,
				headers: ['Автомобил', 'Контакти', 'Очаквана цена', 'Пробег', 'Статус', 'Действие'],
				isSubmissions: true,
				rows: accountSubmissionListingRows()
			};

export const getAccountListingsData = (templateFile: string, options: AuxeroRenderOptions = {}) =>
	accountListingsData(accountContext(templateFile, options));
