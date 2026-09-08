<script lang="ts">
	function setupHeroLocationPreview() {
		const wraps = Array.from(document.querySelectorAll<HTMLElement>('.search-cars__location-wrap'));
		if (!wraps.length) {
			return () => {};
		}

		const controller = new AbortController();
		const loadMap = (event: Event) => {
			const wrap = event.currentTarget;
			if (!(wrap instanceof HTMLElement)) {
				return;
			}

			const iframe = wrap.querySelector<HTMLIFrameElement>('iframe[data-map-src]');
			const mapSrc = iframe?.dataset.mapSrc;
			if (iframe && mapSrc && !iframe.src) {
				iframe.src = mapSrc;
			}
		};

		wraps.forEach((wrap) => {
			wrap.addEventListener('mouseenter', loadMap, { signal: controller.signal });
			wrap.addEventListener('focusin', loadMap, { signal: controller.signal });
		});

		return () => controller.abort();
	}

	function setupScrollMaps() {
		// About/contact location maps render without a src (see buildDayNightMapIframe). Load
		// the Google Maps embed only when the iframe scrolls near the viewport, so it never
		// costs ~2MB on initial load. The hero-preview maps load on hover/focus instead.
		const maps = Array.from(
			document.querySelectorAll<HTMLIFrameElement>('iframe[data-daynight-scroll-map][data-map-src]')
		).filter((iframe) => !iframe.closest('.search-cars__location-wrap'));

		if (!maps.length) {
			return () => {};
		}

		const load = (iframe: HTMLIFrameElement) => {
			const mapSrc = iframe.dataset.mapSrc;
			if (mapSrc && !iframe.src) {
				iframe.src = mapSrc;
			}
		};

		if (!('IntersectionObserver' in window)) {
			maps.forEach(load);
			return () => {};
		}

		const observer = new IntersectionObserver(
			(entries, obs) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						load(entry.target as HTMLIFrameElement);
						obs.unobserve(entry.target);
					}
				}
			},
			{ rootMargin: '0px' }
		);

		maps.forEach((iframe) => observer.observe(iframe));
		return () => observer.disconnect();
	}

	$effect(() => {
		const cleanupHeroLocation = setupHeroLocationPreview();
		const cleanupScrollMaps = setupScrollMaps();

		return () => {
			cleanupHeroLocation();
			cleanupScrollMaps();
		};
	});
</script>
