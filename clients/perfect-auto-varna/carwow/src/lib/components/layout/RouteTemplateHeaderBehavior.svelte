<script lang="ts">
	import { getGarageContext } from '$lib/state/garage.svelte';

	// Tolerant lookup: standalone renders (component tests) have no layout
	// context, and the badge sync is purely cosmetic there.
	const garage = (() => {
		try {
			return getGarageContext();
		} catch {
			return undefined;
		}
	})();

	// The legacy template header may ship hardcoded badges. Keep them aligned
	// with the real garage counts while raw template routes still exist.
	function syncHeaderGarageBadges(favoritesCount: number, compareCount: number) {
		const setBadge = (selector: string, count: number) => {
			document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
				if (count > 0) {
					element.setAttribute('data-badge', String(count));
				} else {
					element.removeAttribute('data-badge');
				}
			});
		};

		setBadge('.header-action-btn[href="/variant-3/favorites"]', favoritesCount);
		setBadge('.header-action-btn[href="/variant-3/compare"]', compareCount);
	}

	function setupHeaderSticky() {
		const header = document.querySelector<HTMLElement>(
			'#header_main.header, .header-wrapper-style-3 .header'
		);
		if (!header) {
			return () => {};
		}

		const wrapper = header.closest<HTMLElement>('.header-wrapper-style-3');
		const controller = new AbortController();
		let headerHeight = 0;

		const measureHeaderHeight = () => {
			const wrapperHeight = wrapper?.offsetHeight ?? 0;
			const naturalHeaderHeight = header.classList.contains('is-fixed') ? 0 : header.offsetHeight;
			headerHeight = Math.max(wrapperHeight, naturalHeaderHeight, 58);
		};

		const syncStickyState = () => {
			measureHeaderHeight();
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

			header.classList.toggle('is-fixed', scrollTop > headerHeight + 200);
			header.classList.toggle('is-custom', scrollTop > headerHeight + 300);
			header.classList.toggle('is-visible', scrollTop > headerHeight + 600);
		};

		syncStickyState();
		window.addEventListener('scroll', syncStickyState, {
			passive: true,
			signal: controller.signal
		});
		window.addEventListener('resize', syncStickyState, { signal: controller.signal });

		return () => {
			controller.abort();
			header.classList.remove('is-fixed', 'is-custom', 'is-visible');
		};
	}

	function setupHeaderTopbarDropdowns() {
		const dropdowns = Array.from(
			document.querySelectorAll<HTMLElement>('.header .header-top-bar .core-dropdown')
		);
		if (!dropdowns.length) {
			return () => {};
		}

		const controller = new AbortController();
		const { signal } = controller;
		const closeDropdown = (dropdown: HTMLElement) => {
			dropdown.classList.remove('active');
			dropdown
				.querySelector<HTMLButtonElement>('.core-dropdown__button')
				?.setAttribute('aria-expanded', 'false');
		};
		const closeOtherDropdowns = (activeDropdown?: HTMLElement) => {
			dropdowns.forEach((dropdown) => {
				if (dropdown !== activeDropdown) {
					closeDropdown(dropdown);
				}
			});
		};

		dropdowns.forEach((dropdown) => {
			const button = dropdown.querySelector<HTMLButtonElement>('.core-dropdown__button');
			const menu = dropdown.querySelector<HTMLElement>('.core-dropdown__menu');
			if (!button || !menu) {
				return;
			}

			if (menu.id && !button.hasAttribute('aria-controls')) {
				button.setAttribute('aria-controls', menu.id);
			}
			button.setAttribute(
				'aria-expanded',
				dropdown.classList.contains('active') ? 'true' : 'false'
			);
			button.addEventListener(
				'click',
				(event) => {
					event.preventDefault();
					const shouldOpen = !dropdown.classList.contains('active');
					closeOtherDropdowns(dropdown);
					dropdown.classList.toggle('active', shouldOpen);
					button.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
				},
				{ signal }
			);
		});

		document.addEventListener(
			'click',
			(event) => {
				const target = event.target;
				if (target instanceof Node && dropdowns.some((dropdown) => dropdown.contains(target))) {
					return;
				}
				closeOtherDropdowns();
			},
			{ signal }
		);
		document.addEventListener(
			'keydown',
			(event) => {
				if (event.key === 'Escape') {
					closeOtherDropdowns();
				}
			},
			{ signal }
		);

		return () => {
			controller.abort();
			closeOtherDropdowns();
		};
	}

	$effect(() => {
		if (!garage) {
			return;
		}
		syncHeaderGarageBadges(garage.favorites.length, garage.compare.length);
	});

	$effect(() => {
		const cleanupHeaderSticky = setupHeaderSticky();
		const cleanupHeaderDropdowns = setupHeaderTopbarDropdowns();

		return () => {
			cleanupHeaderSticky();
			cleanupHeaderDropdowns();
		};
	});
</script>
