<script lang="ts">
	// Branded inline placeholder — never 404s, so a failed external photo
	// degrades to the same "Очаквайте снимки" card the rest of the site uses.
	import { DAY_IMAGE_FALLBACK as IMAGE_FALLBACK } from '$lib/utils/daynight-image-fallback';

	function describeRouteImage(img: HTMLImageElement): string {
		const card = img.closest<HTMLElement>('[data-daynight-title]');
		if (card?.dataset.daynightTitle) {
			return card.dataset.daynightTitle;
		}

		const scope = img.closest(
			'figure, article, .card, .card-box, .box-car, .card-product, .listing'
		);
		const headingText = scope
			?.querySelector('h1, h2, h3, h4, .card-title, .title')
			?.textContent?.trim();
		if (headingText) {
			return headingText;
		}

		return img.closest('a')?.getAttribute('title')?.trim() || 'Фреш Ауто';
	}

	// One pass over route images: lazy-load below-the-fold media, async-decode,
	// backfill missing alt text (SEO + a11y) and swap broken photos for the
	// branded placeholder. Idempotent so it can run again as galleries hydrate.
	function enhanceRouteImages() {
		document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
			const applyFallback = () => {
				if (img.dataset.daynightImgFallback === '1') return;
				img.dataset.daynightImgFallback = '1';
				img.src = IMAGE_FALLBACK;
				img.removeAttribute('srcset');
				img.classList.add('daynight-img-fallback');
			};

			if (img.dataset.daynightImg !== '1') {
				img.dataset.daynightImg = '1';

				if (!img.hasAttribute('decoding')) {
					img.decoding = 'async';
				}

				if (!img.hasAttribute('loading')) {
					const belowFold = img.getBoundingClientRect().top > (window.innerHeight || 800) * 1.15;
					img.loading = belowFold ? 'lazy' : 'eager';
				}

				// Only backfill a genuinely missing alt. An explicit alt="" on an
				// aria-hidden/decorative icon is correct a11y and must be preserved.
				if (
					img.getAttribute('alt') === null &&
					img.getAttribute('aria-hidden') !== 'true' &&
					img.getAttribute('role') !== 'presentation'
				) {
					img.alt = describeRouteImage(img);
				}

				img.addEventListener('error', applyFallback);
			}

			// Catch images that already failed before the listener was attached.
			// A number of desktop images intentionally use a transparent 1x1 `src`
			// plus a real `srcset` candidate. During the first pass the placeholder
			// can be complete while the responsive candidate is still resolving;
			// treating that transient state as a failure would replace valid logos
			// and vehicle photos with the branded fallback.
			if (
				img.complete &&
				img.naturalWidth === 0 &&
				img.getAttribute('src') &&
				!img.hasAttribute('srcset')
			) {
				applyFallback();
			}
		});
	}

	// Give the route <main> a stable id + focus target so the layout
	// skip-to-content link lands on the real content (past the header).
	function ensureMainLandmark() {
		const main = document.querySelector('main');
		if (main && !main.id) {
			main.id = 'main-content';
			if (!main.hasAttribute('tabindex')) {
				main.setAttribute('tabindex', '-1');
			}
		}
	}

	$effect(() => {
		enhanceRouteImages();
		ensureMainLandmark();

		const timers = [
			window.setTimeout(enhanceRouteImages, 250),
			window.setTimeout(enhanceRouteImages, 1000),
			window.setTimeout(enhanceRouteImages, 2500)
		];
		const observer = new MutationObserver(() => {
			enhanceRouteImages();
			ensureMainLandmark();
		});
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			timers.forEach((timer) => window.clearTimeout(timer));
			observer.disconnect();
		};
	});
</script>
