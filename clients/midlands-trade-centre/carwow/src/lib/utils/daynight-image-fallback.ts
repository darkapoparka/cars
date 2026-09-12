export const DAY_IMAGE_FALLBACK = '/dealer/image-unavailable.svg';

function applyFallback(img: HTMLImageElement) {
	if (img.dataset.daynightImgFallback === '1') return;

	img.dataset.daynightImgFallback = '1';
	img.src = DAY_IMAGE_FALLBACK;
	img.removeAttribute('srcset');
	img.classList.add('daynight-img-fallback');
}

function installFallback(img: HTMLImageElement) {
	if (img.dataset.daynightImgFallbackWatched === '1') {
		return () => {};
	}

	img.dataset.daynightImgFallbackWatched = '1';
	const handleError = () => applyFallback(img);
	const checkBroken = () => {
		if (img.complete && img.naturalWidth === 0) {
			applyFallback(img);
		}
	};
	const timers = [0, 250, 1000, 2500].map((delay) => window.setTimeout(checkBroken, delay));
	const frame = window.requestAnimationFrame(checkBroken);

	img.addEventListener('error', handleError);
	img.addEventListener('load', checkBroken);

	if (typeof img.decode === 'function') {
		img.decode().catch(checkBroken);
	}

	return () => {
		img.removeEventListener('error', handleError);
		img.removeEventListener('load', checkBroken);
		timers.forEach((timer) => window.clearTimeout(timer));
		window.cancelAnimationFrame(frame);
	};
}

export function daynightImageFallback(img: HTMLImageElement) {
	return {
		destroy: installFallback(img)
	};
}

export function enhanceDayNightImageFallbacks(
	root: ParentNode = document,
	selector = 'img[data-daynight-image-fallback]'
) {
	const cleanups = Array.from(root.querySelectorAll<HTMLImageElement>(selector)).map(
		installFallback
	);

	return () => cleanups.forEach((cleanup) => cleanup());
}
