import { base } from '$app/paths';

/** Covers both errors after hydration and images that already failed during SSR loading. */
export function imageFallback(image: HTMLImageElement) {
	const fallback = `${base}/assets/vehicle-placeholder.svg`;
	const recover = () => {
		if (image.getAttribute('src') !== fallback) {
			image.removeAttribute('srcset');
			image.src = fallback;
		}
	};
	image.addEventListener('error', recover);
	if (image.complete && image.getAttribute('src') && image.naturalWidth === 0) recover();
	return { destroy: () => image.removeEventListener('error', recover) };
}
