<script lang="ts">
	import { onMount } from 'svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import {
		applyDayNightImageFallback,
		isBrokenDayNightImage
	} from '$lib/utils/daynight-image-fallback';

	function describeImage(img: HTMLImageElement): string {
		const card = img.closest<HTMLElement>('[data-daynight-title]');
		if (card?.dataset.daynightTitle) return card.dataset.daynightTitle;
		const scope = img.closest(
			'figure, article, .card, .card-box, .box-car, .card-product, .listing'
		);
		return (
			scope?.querySelector('h1, h2, h3, h4, .card-title, .title')?.textContent?.trim() ||
			img.closest('a')?.getAttribute('title')?.trim() ||
			daynightSite.shortName
		);
	}

	onMount(() => {
		const processed = new WeakSet<HTMLImageElement>();
		function enhanceImage(img: HTMLImageElement) {
			if (processed.has(img)) return;
			processed.add(img);
			if (!img.hasAttribute('decoding')) img.decoding = 'async';
			if (!img.hasAttribute('loading'))
				img.loading = img.getBoundingClientRect().top > innerHeight * 1.15 ? 'lazy' : 'eager';
			if (
				!img.hasAttribute('alt') &&
				img.getAttribute('aria-hidden') !== 'true' &&
				img.getAttribute('role') !== 'presentation'
			)
				img.alt = describeImage(img);
			if (isBrokenDayNightImage(img)) applyDayNightImageFallback(img);
		}
		function enhanceSubtree(root: ParentNode) {
			if (root instanceof HTMLImageElement) enhanceImage(root);
			root.querySelectorAll<HTMLImageElement>('img').forEach(enhanceImage);
		}
		// Image error events do not bubble. One capture listener covers later images
		// without installing listeners or timers on every node in the document.
		const onImageError = (event: Event) => {
			if (event.target instanceof HTMLImageElement) applyDayNightImageFallback(event.target);
		};
		document.addEventListener('error', onImageError, true);
		enhanceSubtree(document.body);
		const observer = new MutationObserver((records) => {
			for (const record of records)
				for (const node of record.addedNodes) {
					if (node instanceof Element) enhanceSubtree(node);
				}
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => {
			observer.disconnect();
			document.removeEventListener('error', onImageError, true);
		};
	});
</script>
