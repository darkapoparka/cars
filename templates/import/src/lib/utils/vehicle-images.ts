import delivery from '$lib/data/vehicle-image-delivery.json';
import { assetHref } from './assets';

/** Unknown/dealer-supplied images keep their existing URL and fallback behavior. */
export function vehicleImageDelivery(source: string) {
	const variants = (delivery as Record<string, { path: string; width: number }[]>)[source];
	return {
		src: assetHref(variants?.[0]?.path ?? source),
		srcset: variants?.map(({ path, width }) => `${assetHref(path)} ${width}w`).join(', ')
	};
}
