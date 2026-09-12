import { getDayNightVehicleBySlug, type DayNightVehicle } from '../data/daynight-vehicles';

const contactSubjects = {
	video: 'Заявка за видео преглед',
	photos: 'Заявка за още снимки',
	review: 'Изпращане на отзив',
	financing: 'Buying options',
	services: 'Services',
	'sell-your-car': 'Sell or trade in',
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
	const intent = searchParams.get('intent')?.trim() ?? '';
	const vehicle = getDayNightVehicleBySlug(searchParams.get('vehicle')?.trim() ?? '');
	const subject = Object.hasOwn(contactSubjects, intent)
		? contactSubjects[intent as ContactIntent]
		: vehicle ? 'Запитване за автомобил' : '';
	const message = intent === 'video'
		? 'Бих искал видео преглед на автомобила.'
		: intent === 'photos'
			? 'Бих искал още снимки на автомобила.'
			: '';
	return { subject, message, vehicle };
}

/** Public catalog slugs are not database UUIDs. Preserve them as readable context. */
export function buildContactMessage(context: ContactContext, message: string, subject = context.subject) {
	const vehicle = context.vehicle;
	return [
		subject.trim() ? `Тема: ${subject.trim()}` : '',
		vehicle ? `Автомобил: ${vehicle.shortTitle} (${vehicle.year}), ${vehicle.lot}\nОбява: /inventory/${vehicle.slug}` : '',
		message.trim()
	].filter(Boolean).join('\n\n');
}
