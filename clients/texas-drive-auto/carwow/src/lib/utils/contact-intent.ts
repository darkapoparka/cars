import { getDayNightVehicleBySlug, type DayNightVehicle } from '../data/daynight-vehicles';

const contactSubjects = {
	video: 'Request a Video Walkaround',
	photos: 'Request More Photos',
	review: 'Draft a Review',
	financing: 'Buyer-arranged funding',
	services: 'Services',
	'sell-your-car': 'Selling or trading in a vehicle?',
	viewing: 'Request a Viewing'
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
		: vehicle ? 'Vehicle Inquiry' : '';
	const message = intent === 'video'
		? 'I’d like a video walkaround of the vehicle.'
		: intent === 'photos'
			? 'I’d like more photos of the vehicle.'
			: '';
	return { subject, message, vehicle };
}

/** Public catalog slugs are not database UUIDs. Preserve them as readable context. */
export function buildContactMessage(context: ContactContext, message: string, subject = context.subject) {
	const vehicle = context.vehicle;
	return [
		subject.trim() ? `Subject: ${subject.trim()}` : '',
		vehicle ? `Vehicle: ${vehicle.shortTitle} (${vehicle.year}), ${vehicle.lot}\nListing: /inventory/${vehicle.slug}` : '',
		message.trim()
	].filter(Boolean).join('\n\n');
}
