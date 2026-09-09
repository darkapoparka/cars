<script lang="ts">
	import { getGarageContext } from '$lib/state/garage.svelte';
	import type { Attachment } from 'svelte/attachments';
	import SiteChromeCtaButtons from './SiteChromeCtaButtons.svelte';
	import SiteChromeNavRow from './SiteChromeNavRow.svelte';
	import SiteChromePrimaryRow from './SiteChromePrimaryRow.svelte';
	import SiteChromeTopBar from './SiteChromeTopBar.svelte';
	import SiteSearchDialog from './SiteSearchDialog.svelte';

	let { onSearch, searchExpanded }: { onSearch?: () => void; searchExpanded?: boolean } = $props();

	const garage = (() => {
		try {
			return getGarageContext();
		} catch {
			return null;
		}
	})();

	let headerHeight = $state(58);
	let headerWrapperHeight = $state(58);
	let languageOpen = $state(false);
	let pageScrollY = $state(0);
	let searchOpen = $state(false);

	const isStickyFixed = $derived.by(() => {
		const stickyThreshold = Math.max(headerWrapperHeight, headerHeight, 58);

		return pageScrollY > stickyThreshold + 200;
	});
	const headerClasses = $derived(
		[
			'group w-full bg-sa-surface',
			isStickyFixed
				? 'is-fixed is-custom is-visible fixed left-0 right-0 top-0 z-[900] min-h-[58px] bg-[#f3f6fa] shadow-sa-md'
				: 'relative z-[60]'
		]
			.filter(Boolean)
			.join(' ')
	);
	const compareBadge = $derived(garage?.compare.length ?? 0);
	const favoritesBadge = $derived(garage?.favorites.length ?? 0);

	function closeLanguageMenu() {
		languageOpen = false;
	}

	function toggleLanguageMenu() {
		languageOpen = !languageOpen;
	}

	function toggleHeaderSearch() {
		if (onSearch) {
			onSearch();
			return;
		}
		searchOpen = !searchOpen;
	}

	function handleDocumentClick(event: MouseEvent) {
		const clickedInsideLanguageMenu = event
			.composedPath()
			.some((node) => node instanceof HTMLElement && node.id === 'language-select');

		if (languageOpen && !clickedInsideLanguageMenu) {
			closeLanguageMenu();
		}
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') {
			return;
		}

		closeLanguageMenu();
	}

	function trackElementHeight(setHeight: (height: number) => void): Attachment<HTMLElement> {
		return (node) => {
			const measure = () => setHeight(node.offsetHeight);
			measure();

			if (!('ResizeObserver' in window)) {
				return;
			}

			const observer = new ResizeObserver(measure);
			observer.observe(node);

			return () => observer.disconnect();
		};
	}

	const trackHeaderWrapperHeight = trackElementHeight((height) => {
		headerWrapperHeight = height;
	});
	const trackHeaderHeight = trackElementHeight((height) => {
		headerHeight = height;
	});
</script>

<svelte:window bind:scrollY={pageScrollY} />
<svelte:document onclick={handleDocumentClick} onkeydown={handleDocumentKeydown} />

<div
	class="site-chrome relative z-50 min-h-[158px] bg-sa-surface font-sa tracking-normal text-sa-ink max-[1199px]:min-h-[58px] max-[991px]:min-h-0"
	data-daynight-site-chrome
	{@attach trackHeaderWrapperHeight}
>
	<header class={headerClasses} id="header_main" {@attach trackHeaderHeight}>
		{#if !isStickyFixed}
			<SiteChromeTopBar {languageOpen} onLanguageToggle={toggleLanguageMenu} />
			<SiteChromePrimaryRow
				searchOpen={searchExpanded ?? searchOpen}
				{compareBadge}
				{favoritesBadge}
				onSearchToggle={toggleHeaderSearch}
			/>
		{/if}
		<SiteChromeNavRow
			searchOpen={searchExpanded ?? searchOpen}
			{compareBadge}
			{favoritesBadge}
			onSearchToggle={toggleHeaderSearch}
		/>
		<div class="hidden">
			<SiteChromeCtaButtons mobile />
		</div>
	</header>
	{#if !onSearch}<SiteSearchDialog bind:open={searchOpen} />{/if}
</div>

<style>
	@media (min-width: 992px) {
		.site-chrome {
			font: 400 16px/24px var(--sa-font);
		}
		.site-chrome :global([data-daynight-header-tool]) {
			height: 48px !important;
			width: 48px !important;
		}

		.site-chrome :global([data-daynight-header-tool] .site-chrome-outline-icon) {
			height: 24px !important;
			width: 24px !important;
		}

		.site-chrome :global([data-daynight-header-tool] .site-chrome-outline-icon),
		.site-chrome :global([data-daynight-header-tool] .site-chrome-outline-icon *) {
			stroke-width: 2px !important;
		}
	}

	@media (min-width: 992px) and (max-width: 1279px) {
		.site-chrome :global(#main-nav) {
			transform: translateX(-56px);
		}
	}

	/* The homepage's yellow-mounted chrome is the canonical desktop identity.
		Keep the route shell continuous with that surface instead of reintroducing
		the legacy white primary strip on secondary pages. */
	@media (min-width: 1200px) {
		.site-chrome {
			--sa-header-ink: var(--sa-ink);
			background: var(--sa-yellow) !important;
			min-height: 94px !important;
		}

		.site-chrome :global(#header_main:not(.is-fixed)) {
			background: transparent !important;
			box-shadow: none !important;
			display: grid !important;
			grid-template-rows: 32px 62px;
			height: 94px !important;
			min-height: 94px !important;
		}

		.site-chrome :global(#header_main.is-fixed) {
			background: var(--sa-yellow) !important;
			box-shadow: 0 8px 20px rgba(24, 18, 4, 0.14) !important;
			min-height: 62px !important;
		}

		.site-chrome :global(#header_main.is-fixed .site-chrome-nav-row) {
			background: var(--sa-yellow) !important;
			border-bottom-color: transparent !important;
			border-top-color: transparent !important;
		}

		.site-chrome :global(.site-chrome-topbar) {
			align-self: stretch;
			background: transparent !important;
			border-bottom-color: transparent !important;
			border-bottom-width: 0 !important;
			grid-column: 1;
			grid-row: 1;
			height: 32px !important;
			min-height: 32px !important;
		}

		.site-chrome :global(.site-chrome-topbar a),
		.site-chrome :global(.site-chrome-topbar__dot),
		.site-chrome :global(.site-chrome-topbar__language),
		.site-chrome :global(.site-chrome-topbar__language span),
		.site-chrome :global(.site-chrome-topbar svg),
		.site-chrome :global(.site-chrome-topbar svg *) {
			color: var(--sa-header-ink) !important;
		}

		.site-chrome :global(.site-chrome-topbar__location),
		.site-chrome :global(.site-chrome-topbar__phone) {
			min-height: 28px;
		}

		.site-chrome :global(#language-select),
		.site-chrome :global(.site-chrome-topbar__inventory) {
			border-color: rgba(15, 20, 23, 0.2) !important;
		}

		.site-chrome :global(#header_main a:focus-visible),
		.site-chrome :global(#header_main button:focus-visible) {
			outline: 2px solid var(--sa-header-ink) !important;
			outline-offset: -2px !important;
		}

		.site-chrome :global(.header-style-2-main),
		.site-chrome :global(.site-chrome-nav-row) {
			align-self: stretch;
			background: transparent !important;
			border: 0 !important;
			box-shadow: none !important;
			grid-column: 1;
			grid-row: 2;
			height: 62px !important;
			min-height: 62px !important;
		}

		.site-chrome :global(.header-style-2-main) {
			pointer-events: none;
			z-index: 3;
		}

		.site-chrome :global(.header-style-2-main > div > div) {
			height: 62px !important;
		}

		.site-chrome :global(.header-style-2-main a),
		.site-chrome :global(.header-style-2-main button),
		.site-chrome :global(.header-style-2-main [role='button']),
		.site-chrome :global(.header-style-2-main form),
		.site-chrome :global(.header-style-2-main input) {
			pointer-events: auto;
		}

		.site-chrome :global(.header-style-2-main .logo),
		.site-chrome :global(.header-style-2-main a[data-logo-role='header']) {
			flex: 0 0 auto !important;
			width: auto !important;
		}

		.site-chrome :global(.header-style-2-main img[data-logo-role='header']) {
			height: 46px !important;
			max-height: 46px !important;
			max-width: 240px !important;
			object-fit: contain !important;
			width: auto !important;
		}

		.site-chrome :global(.header-style-2-main [data-daynight-header-tool]) {
			background: transparent !important;
			border-color: transparent !important;
			color: var(--sa-header-ink) !important;
			height: 48px !important;
			width: 48px !important;
		}

		.site-chrome
			:global(.header-style-2-main [data-daynight-header-tool]:is(:hover, :focus-visible)) {
			background: rgba(15, 20, 23, 0.08) !important;
			color: var(--sa-header-ink) !important;
		}

		.site-chrome :global(.header-style-2-main [data-daynight-header-tool] svg) {
			color: var(--sa-header-ink) !important;
			fill: none !important;
			height: 24px !important;
			stroke: currentColor !important;
			width: 24px !important;
		}

		.site-chrome :global(.header-style-2-main [data-daynight-header-tool] svg path) {
			color: var(--sa-header-ink) !important;
			fill: none !important;
			stroke: currentColor !important;
		}

		.site-chrome :global(.site-chrome-nav-row) {
			z-index: 2;
		}

		.site-chrome :global(.site-chrome-nav-row > div > div) {
			height: 62px !important;
			min-height: 62px !important;
		}

		.site-chrome :global(.site-chrome-nav-row #main-nav a) {
			color: var(--sa-header-ink) !important;
			font-size: 18px !important;
			padding-inline: 12px !important;
		}

		.site-chrome :global(.site-chrome-nav-row #main-nav ul) {
			gap: 4px !important;
		}

		.site-chrome :global(.site-chrome-nav-row #main-nav a:hover),
		.site-chrome :global(.site-chrome-nav-row #main-nav a:focus-visible) {
			background: transparent !important;
			color: var(--sa-header-ink) !important;
		}
	}
</style>
