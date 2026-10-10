import vehicleDelivery from '$lib/data/vehicle-image-delivery.json';
import serviceDelivery from '$lib/data/service-image-delivery.json';
import { assetHref } from './assets';

const delivery: Record<string, { path: string; width: number }[]> = {
	...vehicleDelivery,
	...serviceDelivery
};

/** Unknown/dealer-supplied images keep their existing URL and fallback behavior. */
export function imageDelivery(source: string) {
	const variants = delivery[source];
	return {
		src: assetHref(variants?.[0]?.path ?? source),
		srcset: variants?.map(({ path, width }) => `${assetHref(path)} ${width}w`).join(', ')
	};
}
