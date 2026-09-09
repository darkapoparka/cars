import { env } from '$env/dynamic/private';

export function getDefaultDealerSlug() {
	return env.DEFAULT_DEALER_SLUG?.trim() || 'next-car-banovo';
}
