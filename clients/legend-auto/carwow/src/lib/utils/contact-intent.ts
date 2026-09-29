import type { Locale } from '../locale/core';
import { getDayNightVehicleBySlug, type DayNightVehicle } from '../data/daynight-vehicles';

const contactSubjects = {
	'trade-in': 'Продажба или бартер',
	video: 'Заявка за видео преглед',
	photos: 'Заявка за още снимки',
	review: 'Изпращане на отзив',
	financing: 'Финансиране',
	services: 'Услуги',
	'sell-your-car': 'Продажба или бартер',
	viewing: 'Заявка за оглед'
} as const;

export type ContactIntent = keyof typeof contactSubjects;
export type ContactContext = {
	subject: string;
	message: string;
	vehicle: DayNightVehicle | undefined;
};

export function buildVehicleContactHref(
	vehicle: Pick<DayNightVehicle, 'slug'>,
	intent: ContactIntent
): `/contact?${string}` {
	return `/contact?${new URLSearchParams({ intent, vehicle: vehicle.slug })}`;
}

export function readContactIntent(searchParams: Pick<URLSearchParams, 'get'>): ContactContext {
	const intent = (searchParams.get('intent') ?? searchParams.get('topic'))?.trim() ?? '';
	const vehicle = getDayNightVehicleBySlug(searchParams.get('vehicle')?.trim() ?? '');
	const subject = Object.hasOwn(contactSubjects, intent)
		? contactSubjects[intent as ContactIntent]
		: vehicle
			? 'Запитване за автомобил'
			: '';
	const message =
		intent === 'video'
			? 'Бих искал видео преглед на автомобила.'
			: intent === 'photos'
				? 'Бих искал още снимки на автомобила.'
				: '';
	return { subject, message, vehicle };
}

/** Public catalog slugs are not database UUIDs. Preserve them as readable context. */
export function buildContactMessage(
	context: ContactContext,
	message: string,
	subject = context.subject,
	locale: Locale = 'bg'
) {
	const vehicle = context.vehicle;
	return [
		subject.trim() ? `${locale === 'en' ? 'Subject' : 'Тема'}: ${subject.trim()}` : '',
		vehicle
			? `${locale === 'en' ? 'Vehicle' : 'Автомобил'}: ${vehicle.shortTitle} (${vehicle.year}), ${vehicle.lot}\n${locale === 'en' ? 'Listing' : 'Обява'}: /inventory/${vehicle.slug}`
			: '',
		message.trim()
	]
		.filter(Boolean)
		.join('\n\n');
}
