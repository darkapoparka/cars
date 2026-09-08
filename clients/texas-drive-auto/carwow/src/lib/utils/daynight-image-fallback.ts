export const DAY_IMAGE_FALLBACK =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">' +
			'<rect width="640" height="480" fill="#f1f4f9"/>' +
			'<rect x="1" y="1" width="638" height="478" rx="20" fill="none" stroke="#d7deea" stroke-width="2"/>' +
			'<path d="M172 274h36l37-62h144l43 62h36M230 274h180M222 274a34 34 0 1 0 68 0M350 274a34 34 0 1 0 68 0" fill="none" stroke="#8A0000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>' +
			'<text x="320" y="168" font-family="Manrope, Arial, sans-serif" font-size="62" font-weight="800" fill="#8A0000" text-anchor="middle" letter-spacing="2">DAY</text>' +
			'<text x="320" y="210" font-family="Manrope, Arial, sans-serif" font-size="34" font-weight="700" fill="#607086" text-anchor="middle" letter-spacing="8">AUTO</text>' +
			'<text x="320" y="372" font-family="Manrope, Arial, sans-serif" font-size="30" font-weight="600" fill="#8a97ab" text-anchor="middle" letter-spacing="1">Photos unavailable in preview</text>' +
			'</svg>'
	);

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
