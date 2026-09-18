export const DAY_IMAGE_FALLBACK =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">' +
			'<rect width="640" height="480" fill="#f1f4f9"/>' +
			'<rect x="1" y="1" width="638" height="478" rx="20" fill="none" stroke="#d7deea" stroke-width="2"/>' +
			'<path d="M172 274h36l37-62h144l43 62h36M230 274h180M222 274a34 34 0 1 0 68 0M350 274a34 34 0 1 0 68 0" fill="none" stroke="#8A0000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>' +
			'<text x="320" y="168" font-family="Manrope, Arial, sans-serif" font-size="62" font-weight="800" fill="#8A0000" text-anchor="middle" letter-spacing="2">DAY</text>' +
			'<text x="320" y="210" font-family="Manrope, Arial, sans-serif" font-size="34" font-weight="700" fill="#607086" text-anchor="middle" letter-spacing="8">AUTO</text>' +
			'<text x="320" y="372" font-family="Manrope, Arial, sans-serif" font-size="30" font-weight="600" fill="#8a97ab" text-anchor="middle" letter-spacing="1">Очаквайте снимки</text>' +
			'</svg>'
	);

/** Idempotent for both explicit image attachments and a route's capture listener. */
export function applyDayNightImageFallback(img: HTMLImageElement): void {
	if (img.src === DAY_IMAGE_FALLBACK && !img.hasAttribute('srcset')) return;
	img.dataset.daynightImgFallback = '1';
	img.removeAttribute('srcset');
	img.src = DAY_IMAGE_FALLBACK;
	img.classList.add('daynight-img-fallback');
}

export function isBrokenDayNightImage(img: HTMLImageElement): boolean {
	// A responsive image may not have selected its candidate yet. Do not mistake
	// that pending state, an empty source, or a healthy transparent pixel for failure.
	return (
		img.complete &&
		img.naturalWidth === 0 &&
		Boolean(img.currentSrc || (!img.hasAttribute('srcset') && img.getAttribute('src')))
	);
}

const watchers = new WeakMap<HTMLImageElement, { owners: number; dispose: () => void }>();
function installFallback(img: HTMLImageElement): () => void {
	let watcher = watchers.get(img);
	if (!watcher) {
		const handleError = () => applyDayNightImageFallback(img);
		const handleLoad = () => {
			if (isBrokenDayNightImage(img)) handleError();
			else if (img.naturalWidth > 0 && img.currentSrc !== DAY_IMAGE_FALLBACK) {
				delete img.dataset.daynightImgFallback;
				img.classList.remove('daynight-img-fallback');
			}
		};
		img.addEventListener('error', handleError);
		img.addEventListener('load', handleLoad);
		watcher = {
			owners: 0,
			dispose: () => {
				img.removeEventListener('error', handleError);
				img.removeEventListener('load', handleLoad);
			}
		};
		watchers.set(img, watcher);
		if (isBrokenDayNightImage(img)) handleError();
	}
	watcher.owners += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		if (--watcher.owners === 0) {
			watcher.dispose();
			watchers.delete(img);
		}
	};
}

export function daynightImageFallback(img: HTMLImageElement) {
	return { destroy: installFallback(img) };
}

export function enhanceDayNightImageFallbacks(
	root: ParentNode = document,
	selector = 'img[data-daynight-image-fallback]'
): () => void {
	const cleanups = Array.from(root.querySelectorAll<HTMLImageElement>(selector), installFallback);
	return () => cleanups.forEach((cleanup) => cleanup());
}
