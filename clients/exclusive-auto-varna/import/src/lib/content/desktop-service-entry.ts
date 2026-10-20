import type { Locale } from '$lib/locale/core';

export const serviceTaskIds = ['check', 'selling', 'import', 'viewing'] as const;
export type ServiceTaskId = (typeof serviceTaskIds)[number];
export function serviceTask(value: string | null): ServiceTaskId {
	return serviceTaskIds.find((id) => id === value) ?? 'check';
}
export const desktopServiceEntryCopy = {
	bg: {
		choose: 'Избери услуга',
		labels: { check: 'Проверка', selling: 'Продажба', import: 'Внос', viewing: 'Оглед' },
		continue: 'Продължи',
		checkLabel: 'Линк към обява или VIN',
		checkPlaceholder: 'Линк към обява или 17-символен VIN',
		checkHint: 'Провери историята преди покупка.',
		sellingLabel: 'VIN на твоя автомобил',
		sellingPlaceholder: '17-символен VIN на твоя автомобил',
		manual: 'Нямам VIN',
		viewingLabel: 'Автомобил за оглед',
		viewingPlaceholder: 'Автомобил или линк към обява',
		viewingHint: 'Избери автомобил. Уточняваме часа в следващата стъпка.',
		invalidCheck: 'Въведи валиден линк към обява или 17-символен VIN.',
		invalidSelling: 'Въведи 17-символен VIN или избери „Нямам VIN“.',
		invalidViewing: 'Въведи автомобил или линк към обява.',
		missingImportCriteria: 'Въведи марка или модел.'
	},
	en: {
		choose: 'Choose a service',
		labels: { check: 'Check', selling: 'Selling', import: 'Import', viewing: 'Viewing' },
		continue: 'Continue',
		checkLabel: 'Listing link or VIN',
		checkPlaceholder: 'Listing link or a 17-character VIN',
		checkHint: 'Check the history before buying.',
		sellingLabel: 'Your car’s VIN',
		sellingPlaceholder: 'Your car’s 17-character VIN',
		manual: 'I don’t have a VIN',
		viewingLabel: 'Car to view',
		viewingPlaceholder: 'Car or listing link',
		viewingHint: 'Choose a car. Pick a preferred time in the next step.',
		invalidCheck: 'Enter a valid listing link or 17-character VIN.',
		invalidSelling: 'Enter a 17-character VIN or choose “I don’t have a VIN”.',
		invalidViewing: 'Enter a car or listing link.',
		missingImportCriteria: 'Enter a make or model.'
	}
} as const satisfies Record<Locale, object>;
