import { resolve } from '$app/paths';

export type AuxeroSwiperInstance = {
	destroy?: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
};

export type AuxeroSwiperConstructor = new (
	element: Element | string,
	options: Record<string, unknown>
) => AuxeroSwiperInstance;

declare global {
	interface Window {
		Swiper?: AuxeroSwiperConstructor;
	}
}

const swiperScriptSrc = resolve('/assets/js/swiper-bundle.min.js');
const swiperLoaderAttribute = 'data-eliqauto-swiper-loader';

let swiperLoadPromise: Promise<AuxeroSwiperConstructor> | undefined;

const loadedSwiper = () => {
	if (typeof window === 'undefined') return undefined;

	return typeof window.Swiper === 'function' ? window.Swiper : undefined;
};

export const loadAuxeroSwiper = () => {
	const existingSwiper = loadedSwiper();

	if (existingSwiper) return Promise.resolve(existingSwiper);
	if (swiperLoadPromise) return swiperLoadPromise;

	swiperLoadPromise = new Promise<AuxeroSwiperConstructor>((resolveSwiper, reject) => {
		const existingScript = document.querySelector<HTMLScriptElement>(
			`script[${swiperLoaderAttribute}], script[src="${swiperScriptSrc}"]`
		);
		const script = existingScript ?? document.createElement('script');
		const rejectLoad = (error: Error) => {
			swiperLoadPromise = undefined;
			reject(error);
		};

		const settle = () => {
			const Swiper = loadedSwiper();

			if (Swiper) {
				resolveSwiper(Swiper);
				return;
			}

			rejectLoad(new Error('Auxero Swiper script loaded without exposing window.Swiper'));
		};

		script.addEventListener('load', settle, { once: true });
		script.addEventListener(
			'error',
			() => rejectLoad(new Error(`Failed to load Auxero Swiper script: ${swiperScriptSrc}`)),
			{ once: true }
		);

		if (!existingScript) {
			script.async = true;
			script.defer = true;
			script.src = swiperScriptSrc;
			script.setAttribute(swiperLoaderAttribute, 'true');
			document.body.append(script);
			return;
		}

		if (loadedSwiper()) {
			settle();
		}
	});

	return swiperLoadPromise;
};
