<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { site } from '$lib/config/site';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import { beforeNavigate, goto } from '$app/navigation';
	import { linkHref as resolve } from '$lib/utils/links';
	import type {
		HomeFiveHeroAction,
		HomeFiveHeroActionMode,
		HomeFiveHeroData
	} from '$lib/auxero/home-five';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Navigation from '@lucide/svelte/icons/navigation';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import Search from '@lucide/svelte/icons/search';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import { onMount, tick } from 'svelte';
	import InventoryMobilePage from '$lib/components/inventory/InventoryMobilePage.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import MobileModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import MobileSearchControl from '$lib/components/common/MobileSearchControl.svelte';
	import MobileIconAction from '$lib/components/common/MobileIconAction.svelte';
	import { keyboardInset } from '$lib/utils/keyboard-inset';

	let { hero }: { hero?: HomeFiveHeroData } = $props();

	const mobileShowroomMapHref = site.contact.mapHref;
	const mobileShowroomPhoneHref = site.contact.phoneHref;
	const inventoryFilterHref = (name: string, value: string) =>
		`/inventory?${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	const isEnglish = $derived(hero?.searchSubmitPrefix === 'Show');
	const activeMode = $derived(hero?.activeMode ?? 'buy');
	let mobileModeOverride = $state<HomeFiveHeroActionMode | null>(null);
	const mobileMode = $derived(mobileModeOverride ?? activeMode);
	const activeMobileAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === mobileMode) ?? hero?.actions[0]
	);
	const selectMobileMode = (mode: HomeFiveHeroActionMode) => {
		mobileModeOverride = mode;
	};

	const mobileSearchPlaceholder = $derived(activeMobileAction?.placeholder ?? nt('ui77'));
	const mobileHeading = $derived(
		activeMobileAction?.mobileHeading ?? (isEnglish ? 'Find your car.' : nt('ui78'))
	);
	const mobileModeHeading = $derived.by(() => {
		if (activeMobileAction?.mode === 'import') {
			return isEnglish ? 'Import a car' : nt('ui79');
		}

		if (activeMobileAction?.mode === 'sell') {
			return isEnglish ? 'Sell your car' : nt('ui80');
		}

		return isEnglish ? 'Buy a car' : nt('ui81');
	});
	const mobileSearchDrawerTitle = $derived(
		activeMobileAction?.drawerTitle ?? (isEnglish ? 'Find a car' : nt('ui82'))
	);
	const mobileSearchDrawerClose = $derived(isEnglish ? 'Close search' : nt('ui83'));
	const mobileAllLabel = $derived(
		activeMobileAction?.secondaryLabel ?? (isEnglish ? 'Browse all' : nt('ui84'))
	);
	const mobileShowAllCommand = $derived(isEnglish ? 'Show all' : nt('ui85'));
	const mobileActionTabs = $derived.by(() =>
		(hero?.actions ?? []).filter((action) => action.mode !== 'sell')
	);
	const mobileModeOptions = $derived(
		mobileActionTabs.map((tab) => ({ value: tab.mode, label: tab.label }))
	);
	const mobileQuickFilters = $derived(
		isEnglish
			? [
					{ href: '/inventory?maxPrice=10000', label: 'Under 10k' },
					{ href: '/inventory?maxPrice=20000', label: 'Under 20k' },
					{ href: '/inventory?maxPrice=30000', label: 'Under 30k' },
					{ href: '/inventory?status=New%20listing', label: 'New listings' },
					{ href: '/inventory?status=Available', label: 'In stock' }
				]
			: [
					{ href: '/inventory?maxPrice=10000', label: nt('ui86') },
					{ href: '/inventory?maxPrice=20000', label: nt('ui87') },
					{ href: '/inventory?maxPrice=30000', label: nt('ui88') },
					{ href: '/inventory?status=New%20listing', label: nt('ui89') },
					{ href: '/inventory?status=Available', label: nt('ui90') }
				]
	);
	const quickLinksForMode = (mode: string) => {
		if (mode === 'import') {
			return isEnglish
				? [
						{ href: '/calculator', label: 'Import calculator' },
						{ href: '/services', label: 'Import process' },
						{ href: '/contact?topic=import', label: 'Consultant' },
						{ href: '/contact', label: 'Ask ' + site.identity.name },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/calculator', label: nt('ui91') },
						{ href: '/services', label: nt('ui92') },
						{ href: '/contact?topic=import', label: nt('ui93') },
						{ href: '/contact', label: nt('ui94') + site.identity.name },
						{ href: '/inventory', label: nt('ui95') }
					];
		}

		if (mode === 'sell') {
			return isEnglish
				? [
						{ href: '/sell-your-car', label: 'Valuation form' },
						{ href: '/services', label: 'Selling process' },
						{ href: '/contact?topic=sell', label: 'Consultant' },
						{ href: '/contact', label: 'Ask ' + site.identity.name },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/sell-your-car', label: nt('ui96') },
						{ href: '/services', label: nt('ui97') },
						{ href: '/contact?topic=sell', label: nt('ui93') },
						{ href: '/contact', label: nt('ui94') + site.identity.name },
						{ href: '/inventory', label: nt('ui95') }
					];
		}

		return mobileQuickFilters;
	};
	const activeMobileQuickLinks = $derived.by(() => quickLinksForMode(mobileMode));
	// The search UI is a full-screen overlay (not a bottom drawer): the input is pinned to
	// the top, so the on-screen keyboard opens beneath it and never fights the panel. This
	// removes the whole drawer-vs-keyboard problem and the open animation entirely.
	let mobileSearchOpen = $state(false);
	let mobileSearchInput = $state<HTMLInputElement | null>(null);
	let mobileSearchWasOpen = false;
	let mobileSearchHistoryActive = false;
	let mobileSearchClosePending = false;
	let mobileSearchPendingHref: string | null = null;
	let mobileSearchTrigger: HTMLElement | null = null;
	const mobileSearchHistoryId = `daynight-home-search-${Math.random().toString(36).slice(2)}`;
	let inventorySearchOpen = $state(false);
	let inventoryOverlayMode = $state<'search' | 'filters'>('search');
	let inventorySearchTrigger: HTMLElement | null = null;
	const closeInventorySearch = () => {
		inventorySearchOpen = false;
		void tick().then(() => inventorySearchTrigger?.focus());
	};
	const openMobileSearch = () => {
		if (mobileMode === 'buy' && hero?.inventorySearch) {
			inventorySearchTrigger =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			inventoryOverlayMode = 'search';
			inventorySearchOpen = true;
			return;
		}
		mobileSearchOpen = true;
	};
	const openMobileFilters = () => {
		if (!hero?.inventorySearch) return openMobileSearch();
		inventorySearchTrigger =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		inventoryOverlayMode = 'filters';
		inventorySearchOpen = true;
	};
	const closeMobileSearch = () => {
		mobileSearchOpen = false;
	};

	const finishMobileSearchClose = () => {
		const href = mobileSearchPendingHref;
		mobileSearchPendingHref = null;
		const trigger = mobileSearchTrigger;
		mobileSearchTrigger = null;
		if (href) {
			window.setTimeout(() => void goto(href), 0);
		} else {
			void tick().then(() => trigger?.focus({ preventScroll: true }));
		}
	};

	const handleMobileSearchPopState = () => {
		if (mobileSearchClosePending) {
			mobileSearchClosePending = false;
			finishMobileSearchClose();
			return;
		}
		if (!mobileSearchOpen || !mobileSearchHistoryActive) return;
		mobileSearchHistoryActive = false;
		mobileSearchWasOpen = false;
		mobileSearchOpen = false;
		finishMobileSearchClose();
	};

	const submitMobileSearch = (event: SubmitEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const target = new URL(form.action, window.location.href);
		for (const [key, value] of new FormData(form).entries()) {
			if (typeof value !== 'string') continue;
			const normalized = value.trim();
			if (normalized) target.searchParams.set(key, normalized);
			else target.searchParams.delete(key);
		}
		mobileSearchPendingHref = `${target.pathname}${target.search}${target.hash}`;
		mobileSearchOpen = false;
	};

	onMount(() => {
		window.addEventListener('popstate', handleMobileSearchPopState);
		return () => window.removeEventListener('popstate', handleMobileSearchPopState);
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (mobileSearchOpen && !mobileSearchWasOpen) {
			mobileSearchWasOpen = true;
			mobileSearchTrigger =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			if (!mobileSearchHistoryActive) {
				pushState('', { ...page.state, __daynightHomeSearch: mobileSearchHistoryId });
				mobileSearchHistoryActive = true;
			}
			return;
		}
		if (!mobileSearchOpen && mobileSearchWasOpen) {
			mobileSearchWasOpen = false;
			if (mobileSearchHistoryActive) {
				mobileSearchHistoryActive = false;
				mobileSearchClosePending = true;
				history.back();
			} else if (!mobileSearchClosePending) {
				finishMobileSearchClose();
			}
		}
	});

	beforeNavigate((navigation) => {
		if (!mobileSearchOpen || navigation.type === 'popstate' || !navigation.to) return;
		navigation.cancel();
		mobileSearchPendingHref = `${navigation.to.url.pathname}${navigation.to.url.search}${navigation.to.url.hash}`;
		mobileSearchOpen = false;
	});

	// While the overlay is open: focus the input (ready to type), lock background scroll,
	// and close on Escape. Cleanup restores everything when it closes.
	$effect(() => {
		if (!mobileSearchOpen) return;
		const { body } = document;
		const prevOverflow = body.style.overflow;
		body.style.overflow = 'hidden';
		// The overlay is white, so recolour the iOS status-bar/browser chrome to match
		// and restore the page theme color when it closes.
		const themeMeta = document.querySelector('meta[name="theme-color"]');
		const prevTheme = themeMeta?.getAttribute('content') ?? null;
		themeMeta?.setAttribute('content', '#ffffff');
		tick().then(() => mobileSearchInput?.focus());
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeMobileSearch();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			body.style.overflow = prevOverflow;
			if (themeMeta && prevTheme !== null) themeMeta.setAttribute('content', prevTheme);
			window.removeEventListener('keydown', onKey);
		};
	});

	let mobileLocationOpen = $state(false);
	onMount(() => {
		const openLocation = () => (mobileLocationOpen = true);
		window.addEventListener('daynight:open-mobile-location', openLocation);
		return () => window.removeEventListener('daynight:open-mobile-location', openLocation);
	});

	const modeAllText = (action: { mode: string; secondaryLabel?: string }) =>
		action.mode === 'buy' && hero
			? `${isEnglish ? 'View all' : nt('ui98')} (${hero.totalMatches})`
			: (action.secondaryLabel ?? mobileAllLabel);
	const drawerSubmitLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' ? mobileShowAllCommand : tab.submitLabel;
	const drawerSubmitAriaLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' && hero
			? `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: tab.submitLabel;
</script>

{#if inventorySearchOpen && hero?.inventorySearch}
	<InventoryMobilePage
		cards={[]}
		mobile={hero.inventorySearch.mobile}
		copy={hero.inventorySearch.copy}
		filtersOnly
		initialOverlay={inventoryOverlayMode}
		filterDrawerOpen={inventoryOverlayMode === 'filters'}
		onclose={closeInventorySearch}
	/>
{/if}
{#if hero}
	<div class="daynight-mobile-home" data-daynight-search-form={activeMobileAction?.mode ?? 'buy'}>
		<section class="daynight-mobile-hero" aria-label={mobileHeading}>
			<div class="site-container">
				<div class="daynight-mobile-hero__copy">
					<h1>{mobileModeHeading}</h1>
				</div>

				<div class="daynight-mobile-hero__search-module">
					<MobileModeTabs
						class="daynight-mobile-hero__tabs"
						value={mobileMode}
						options={mobileModeOptions}
						label={hero.heading}
						idPrefix="home-mobile-mode"
						onchange={(value) => selectMobileMode(value as HomeFiveHeroActionMode)}
					/>

					<MobileSearchControl
						mode="trigger"
						label={hero.searchSubmitPrefix}
						placeholder={mobileSearchPlaceholder}
						expanded={mobileSearchOpen || inventorySearchOpen}
						onclick={openMobileSearch}
					/>
				</div>

				<div class="daynight-mobile-hero__all-row">
					<a
						class="daynight-mobile-hero__all"
						href={resolve((activeMobileAction?.secondaryHref ?? '/inventory') as '/')}
					>
						<span>{activeMobileAction ? modeAllText(activeMobileAction) : mobileAllLabel}</span>
						<ArrowRight size={16} strokeWidth={2.3} aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>

		<MobileSheet
			bind:open={mobileLocationOpen}
			title={site.contact.address}
			description={site.identity.name}
			contentClass="daynight-home-location-sheet"
		>
			<div class="daynight-home-location-content">
				<div class="daynight-mobile-location-map" aria-hidden="true">
					<span class="daynight-mobile-location-map__road road-a"></span>
					<span class="daynight-mobile-location-map__road road-b"></span>
					<span class="daynight-mobile-location-map__road road-c"></span>
					<span class="daynight-mobile-location-map__pin">
						<MapPin size={24} strokeWidth={2.4} aria-hidden="true" />
					</span>
					<span class="daynight-mobile-location-map__badge">{site.identity.name}</span>
				</div>
				<div class="daynight-mobile-location-address">
					<span>{isEnglish ? 'Showroom address' : nt('ui59')}</span>
					<strong>{site.contact.address}</strong>
					<p>
						{isEnglish ? 'Vehicle viewings are by appointment. Call before visiting.' : nt('ui60')}
					</p>
				</div>
				<div class="daynight-mobile-location-actions">
					<a href={resolve(mobileShowroomMapHref)} target="_blank" rel="noreferrer">
						<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Open map' : nt('ui44')}
					</a>
					<a href={resolve(mobileShowroomPhoneHref)}>
						<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Call showroom' : nt('ui37')}
					</a>
				</div>
			</div>
		</MobileSheet>

		{#if mobileSearchOpen && activeMobileAction}
			<!-- Full-screen search overlay (replaces the old bottom drawer): the input is
			     pinned to the top so the on-screen keyboard opens beneath it and never
			     fights the panel — the whole class of drawer-vs-keyboard bugs is gone.
			     Appears instantly (no slide), chips scroll below. -->
			<div
				id="daynight-mobile-search-panel"
				class="daynight-home-search-overlay bc-drawer bc-drawer--{activeMobileAction.mode}"
				role="dialog"
				aria-modal="true"
				aria-label={activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}
				{@attach keyboardInset}
			>
				<header class="daynight-home-search-overlay__bar">
					<span class="daynight-home-search-drawer__title"
						>{activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}</span
					>
					<MobileIconAction
						class="daynight-home-search-overlay__close"
						label={mobileSearchDrawerClose}
						onclick={closeMobileSearch}
					>
						<X size={20} strokeWidth={2} aria-hidden="true" />
					</MobileIconAction>
				</header>
				<form
					class="daynight-home-search-drawer__form"
					action={resolve(activeMobileAction.actionHref)}
					method="get"
					onsubmit={submitMobileSearch}
				>
					<div class="daynight-home-search-drawer__field">
						<Search size={20} strokeWidth={2.15} aria-hidden="true" />
						<input
							bind:this={mobileSearchInput}
							name={activeMobileAction.inputName ?? 'q'}
							type="search"
							placeholder={activeMobileAction.placeholder ?? mobileSearchPlaceholder}
							autocomplete="off"
							enterkeyhint="search"
							aria-label={activeMobileAction.placeholder ?? mobileSearchPlaceholder}
						/>
					</div>
					<div class="daynight-home-search-overlay__scroll">
						<div class="daynight-home-search-drawer__body">
							{#if activeMobileAction.mode === 'buy'}
								{#each hero.primaryFilters.slice(0, 3) as select (select.id)}
									<section
										class={`daynight-home-search-drawer__group ${select.name === 'brand' ? 'daynight-home-search-drawer__group--logos' : ''}`}
									>
										<p>{select.title}</p>
										<div>
											{#each select.options.slice(0, 8) as option (option.value)}
												<a
													href={resolve(
														inventoryFilterHref(select.name, option.value) as '/inventory'
													)}
												>
													{#if select.name === 'brand' && option.image}
														<span class="daynight-mobile-brand-chip__logo">
															<img
																src={assetHref(option.image)}
																alt=""
																aria-hidden="true"
																loading="lazy"
																decoding="async"
															/>
														</span>
														<span>{option.shortLabel ?? option.label}</span>
													{:else}
														{option.label}
													{/if}
												</a>
											{/each}
										</div>
									</section>
								{/each}
								<section class="daynight-home-search-drawer__group">
									<p>{isEnglish ? 'Fuel' : nt('ui61')}</p>
									<div>
										{#each hero.advancedFilters[0]?.options.slice(0, 6) ?? [] as option (option.value)}
											<a href={resolve(inventoryFilterHref('fuel', option.value) as '/inventory')}>
												{option.label}
											</a>
										{/each}
									</div>
								</section>
							{:else}
								<p class="daynight-home-search-drawer__hint">{activeMobileAction.helper}</p>
							{/if}
						</div>
					</div>
					<div class="daynight-home-search-drawer__actions">
						<a href={resolve((activeMobileAction.secondaryHref ?? '/inventory') as '/')}
							>{activeMobileAction.secondaryLabel ?? mobileAllLabel}</a
						>
						<button type="submit" aria-label={drawerSubmitAriaLabel(activeMobileAction)}>
							{drawerSubmitLabel(activeMobileAction)}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>

	{#if mobileActionTabs.length}
		<section class="daynight-mobile-home-quick" aria-label={hero.heading}>
			<div class="site-container">
				<nav
					class="daynight-mobile-home-quick__scroller mobile-quick-rail bc-quick bc-quick--{mobileMode}"
				>
					{#if mobileMode === 'buy'}
						<button
							type="button"
							class="daynight-mobile-home-quick__filter mobile-quick-pill mobile-quick-pill--icon"
							aria-haspopup="dialog"
							aria-expanded={mobileSearchOpen || inventorySearchOpen}
							aria-label={isEnglish ? 'Open filters' : nt('ui62')}
							onclick={openMobileFilters}
						>
							<SlidersHorizontal size={20} strokeWidth={2} aria-hidden="true" />
						</button>
					{/if}
					{#each activeMobileQuickLinks as filter (filter.href)}
						<a class="mobile-quick-pill" href={resolve(filter.href as '/')}>{filter.label}</a>
					{/each}
				</nav>
			</div>
		</section>
	{/if}
{/if}

<style>
	.daynight-mobile-home,
	.daynight-mobile-home-quick {
		display: none;
	}

	@media (max-width: 767.98px) {
		.daynight-mobile-home {
			--daynight-mobile-hero-top: var(--bc-mobile-dark);
			--daynight-mobile-hero-bg: var(--bc-mobile-dark);
			--daynight-mobile-hero-bottom: var(--bc-mobile-dark);
			--daynight-mobile-hero-fill: var(--bc-mobile-dark);
			--daynight-mobile-ink: var(--bc-white);
			--daynight-mobile-ink-muted: rgb(255 255 255 / 0.72);
			--daynight-mobile-ink-strong: var(--bc-white);
			--daynight-mobile-cta: rgb(255 255 255 / 0.08);
			--daynight-mobile-cta-ink: var(--bc-white);
			--daynight-mobile-action: var(--bc-dark-surface);
			--daynight-mobile-action-focus: var(--bc-dark-hover);
			--daynight-mobile-surface: var(--bc-white);
			background: var(--daynight-mobile-hero-top) !important;
			background-color: var(--daynight-mobile-hero-top) !important;
		}

		.daynight-mobile-home,
		.daynight-mobile-home-quick {
			display: block;
		}

		.daynight-mobile-home {
			margin: 0;
			background: var(
				--daynight-mobile-hero-fill,
				var(--daynight-mobile-hero-bg, var(--bc-accent))
			);
			color: var(--daynight-mobile-ink, var(--bc-white));
		}

		.daynight-mobile-hero {
			padding: 10px 0 var(--bc-space-8);
			background: transparent;
		}

		.daynight-mobile-hero :global(.site-container),
		.daynight-mobile-home-quick :global(.site-container) {
			width: 100%;
			max-width: 480px;
			padding-right: 16px;
			padding-left: 16px;
		}

		.daynight-mobile-home-quick :global(.site-container) {
			padding-inline: var(--bc-mobile-gutter);
		}

		/* Heading mirrors the active Buy/Import/Sell tab, so keep it for SEO/a11y
		   but visually hidden — the tab row is the real heading. */
		.daynight-mobile-hero__copy {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
			border: 0;
		}

		.daynight-mobile-hero__search-module {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			gap: var(--bc-mobile-entry-gap);
			margin-bottom: var(--bc-mobile-entry-gap);
			padding: 0;
		}

		/* No press-move on mobile: tapping must not nudge the search bar, CTAs or chips. */

		.bc-drawer {
			display: grid;
			min-height: 0;
			gap: 13px;
			grid-template-rows: max-content minmax(0, 1fr);
			overflow: hidden;
		}

		.daynight-mobile-hero__all-row {
			display: flex;
			width: 100%;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 8px;
		}

		.daynight-mobile-hero__all {
			display: inline-flex;
			min-height: var(--bc-control-height-chip);
			min-width: 0;
			max-width: 100%;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border-radius: var(--bc-radius-pill);
			background: var(--daynight-mobile-cta, var(--bc-surface-raised));
			border: 2px solid transparent;
			background-clip: padding-box;
			box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
			padding: 0 12px;
			color: var(--bc-accent-contrast) !important;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-control);
			text-decoration: none;
		}

		.daynight-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			color: var(--daynight-mobile-cta-ink, var(--bc-white));
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-hero__all:focus-visible {
			outline: 2px solid var(--bc-white);
			outline-offset: 2px;
		}

		.daynight-mobile-hero__all:focus-visible span {
			color: var(--daynight-mobile-cta-ink, var(--bc-white));
		}

		.daynight-mobile-hero__all :global(svg),
		.daynight-mobile-hero__all :global(path),
		.daynight-mobile-hero__all :global(line),
		.daynight-mobile-hero__all :global(polyline) {
			flex: 0 0 auto;
			color: var(--daynight-mobile-cta-ink, var(--bc-white)) !important;
			stroke: var(--daynight-mobile-cta-ink, var(--bc-white)) !important;
		}

		.daynight-mobile-hero__all :global(svg) {
			width: var(--bc-control-icon-size-chip);
			height: var(--bc-control-icon-size-chip);
		}

		:global(.daynight-home-location-sheet) {
			background: var(--bc-bg-strong);
		}

		.daynight-home-location-content {
			display: grid;
			gap: 12px;
		}

		.daynight-mobile-location-map {
			position: relative;
			min-height: 156px;
			overflow: hidden;
			border-radius: 12px;
			background:
				linear-gradient(
					135deg,
					color-mix(in srgb, var(--bc-accent) 16%, transparent),
					rgb(5 5 5 / 0.08)
				),
				var(--bc-surface);
		}

		.daynight-mobile-location-map::before,
		.daynight-mobile-location-map::after {
			position: absolute;
			content: '';
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.72);
		}

		.daynight-mobile-location-map::before {
			top: 34px;
			right: -28px;
			left: -20px;
			height: 16px;
			transform: rotate(-13deg);
		}

		.daynight-mobile-location-map::after {
			right: -16px;
			bottom: 30px;
			left: -26px;
			height: 18px;
			transform: rotate(16deg);
		}

		.daynight-mobile-location-map__road {
			position: absolute;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.58);
		}

		.daynight-mobile-location-map__road.road-a {
			top: -22px;
			left: 42px;
			width: 18px;
			height: 205px;
			transform: rotate(31deg);
		}

		.daynight-mobile-location-map__road.road-b {
			top: 62px;
			right: 42px;
			width: 14px;
			height: 128px;
			transform: rotate(-22deg);
		}

		.daynight-mobile-location-map__road.road-c {
			top: 74px;
			right: -26px;
			width: 190px;
			height: 12px;
			transform: rotate(-8deg);
		}

		.daynight-mobile-location-map__pin {
			position: absolute;
			top: 50%;
			left: 50%;
			display: flex;
			width: 48px;
			height: 48px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: var(--bc-accent);
			color: var(--bc-white);
			transform: translate(-50%, -50%);
			box-shadow: none;
		}

		.daynight-mobile-location-map__pin :global(svg) {
			color: currentColor;
			stroke: currentColor;
		}

		.daynight-mobile-location-map__badge {
			position: absolute;
			right: 12px;
			bottom: 12px;
			border-radius: 999px;
			background: var(--bc-white);
			padding: 7px 11px;
			color: var(--bc-ink);
			font-size: 12px;
			font-weight: 700;
			line-height: 14px;
			box-shadow: none;
		}

		.daynight-mobile-location-address {
			display: grid;
			gap: 4px;
			border-radius: 10px;
			background: var(--bc-surface);
			padding: 12px;
		}

		.daynight-mobile-location-address span {
			color: var(--bc-muted);
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
			text-transform: uppercase;
		}

		.daynight-mobile-location-address strong {
			color: var(--bc-ink);
			font-size: 16px;
			font-weight: 700;
			line-height: 21px;
		}

		.daynight-mobile-location-address p {
			margin: 0;
			color: var(--bc-copy);
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.daynight-mobile-location-actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 9px;
		}

		.daynight-mobile-location-actions a {
			display: flex;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border-radius: 8px;
			background: var(--bc-ink);
			padding: 0 12px;
			color: var(--bc-white);
			font-size: var(--bc-text-cta);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-cta);
			text-align: center;
			text-decoration: none;
		}

		.daynight-mobile-location-actions a:first-child {
			background: var(--bc-accent);
			color: var(--bc-white);
		}

		.daynight-mobile-location-actions :global(svg) {
			width: var(--bc-control-icon-size-primary);
			height: var(--bc-control-icon-size-primary);
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		/* Homepage mobile search = full-screen overlay. Input pinned top, chips scroll
		   below; the keyboard opens beneath the input and never fights the panel. Appears
		   instantly (no slide). The authored inner markup keeps normal scoped styles. */
		.daynight-home-search-overlay {
			--bc-control-height-standard: var(--bc-control-height-chip);
			position: fixed;
			inset: 0;
			bottom: var(--bc-kb-inset, 0px);
			z-index: 1300;
			display: grid;
			grid-template-rows: max-content minmax(0, 1fr);
			background: var(--bc-bg);
			color: var(--bc-ink);
		}

		.daynight-home-search-overlay__bar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: max(12px, env(safe-area-inset-top)) 16px 12px;
		}

		.daynight-home-search-overlay__scroll {
			display: grid;
			min-height: 0;
			gap: 13px;
			align-content: start;
			overflow-y: auto;
			padding: 13px 16px max(20px, env(safe-area-inset-bottom));
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}

		.daynight-home-search-overlay__scroll::-webkit-scrollbar {
			display: none;
		}

		.daynight-home-search-drawer__title {
			display: block;
			margin: 0;
			color: var(--bc-ink);
			font-size: var(--bc-mobile-section-title);
			font-weight: var(--bc-weight-heading);
			letter-spacing: 0;
			line-height: var(--bc-mobile-section-title-leading);
		}

		.daynight-home-search-drawer__form {
			display: grid;
			min-height: 0;
			gap: 0;
			grid-template-rows: max-content minmax(0, 1fr) max-content;
			overflow: hidden;
		}

		.daynight-home-search-drawer__form > .daynight-home-search-drawer__field {
			margin: 13px 16px 0;
		}

		.daynight-home-search-drawer__field {
			display: flex;
			min-height: var(--bc-control-height-standard);
			align-items: center;
			gap: 10px;
			border-radius: 999px;
			background: var(--bc-white);
			padding: 0 13px;
			color: var(--bc-ink);
		}

		.daynight-home-search-drawer__field input {
			min-width: 0;
			width: 100%;
			height: calc(var(--bc-control-height-standard) - 2px);
			flex: 1 1 auto;
			border: 0 !important;
			border-radius: 0 !important;
			background: transparent !important;
			box-shadow: none !important;
			color: var(--bc-ink);
			/* >=16px stops iOS Safari from auto-zooming (and shifting the sheet) on focus. */
			font-size: var(--bc-text-search);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-search);
			outline: 0;
			padding: 0 !important;
			appearance: none;
		}
		.daynight-home-search-drawer__field :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
			flex-shrink: 0;
		}

		.daynight-home-search-drawer__field input::-webkit-search-cancel-button {
			appearance: none;
		}

		.daynight-home-search-drawer__body {
			display: grid;
			min-height: 0;
			gap: 13px;
			overflow-y: auto;
			padding-right: 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.daynight-home-search-drawer__body::-webkit-scrollbar {
			display: none;
		}

		.daynight-home-search-drawer__group {
			display: grid;
			gap: 8px;
		}

		.daynight-home-search-drawer__group p {
			margin: 0;
			color: var(--bc-muted);
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
			text-transform: uppercase;
		}

		.daynight-home-search-drawer__group div {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.daynight-home-search-drawer__group--logos div {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.daynight-home-search-drawer__group--logos div::-webkit-scrollbar {
			display: none;
		}

		.daynight-home-search-drawer__group a {
			display: inline-flex;
			min-height: var(--bc-control-height-chip);
			align-items: center;
			border-radius: 8px;
			background: var(--bc-white);
			padding: 0 12px;
			color: var(--bc-ink);
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-control);
			text-decoration: none;
		}

		.daynight-home-search-drawer__group--logos a {
			width: 86px;
			min-width: 86px;
			min-height: 68px;
			justify-content: center;
			flex-direction: column;
			gap: 6px;
			padding: 8px 5px;
			font-size: var(--bc-text-control);
			text-align: center;
			line-height: var(--bc-leading-control);
			font-weight: var(--bc-weight-control);
		}

		.daynight-mobile-brand-chip__logo {
			display: flex;
			width: 38px;
			height: 28px;
			align-items: center;
			justify-content: center;
			flex: 0 0 28px;
		}

		.daynight-mobile-brand-chip__logo img {
			display: block;
			max-width: 38px;
			max-height: 26px;
			object-fit: contain;
		}

		.daynight-home-search-drawer__group--logos a > span:last-child {
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-home-search-drawer__group a:focus-visible {
			background: var(--bc-white);
			color: var(--bc-ink);
			outline: 2px solid var(--bc-accent);
			outline-offset: 2px;
		}

		.daynight-home-search-drawer__hint {
			margin: 0;
			border-radius: 12px;
			background: var(--bc-white);
			padding: 12px 13px;
			color: var(--bc-copy);
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
		}

		/* Pinned footer bar: the form's last grid row, so it sits flush at the bottom of
		   the screen (the 1fr scroll above absorbs the slack) instead of floating. */
		.daynight-home-search-drawer__actions {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
			gap: 10px;
			padding: 12px 16px max(14px, env(safe-area-inset-bottom));
			border-top: 1px solid var(--bc-border);
			background: var(--bc-bg);
		}

		.daynight-home-search-drawer__actions a,
		.daynight-home-search-drawer__actions button {
			display: flex;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 12px;
			background: var(--bc-white);
			padding: 0 12px;
			color: var(--bc-ink);
			font-size: var(--bc-text-cta);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-cta);
			text-align: center;
			text-decoration: none;
			white-space: nowrap;
		}

		.daynight-home-search-drawer__actions button {
			background: var(--bc-accent);
			color: var(--bc-white);
			cursor: pointer;
		}

		.daynight-mobile-home-quick {
			position: relative;
			z-index: 2;
			background: var(--bc-bg-strong);
			margin: -20px 0 0;
			padding: var(--bc-mobile-browse-top-inset) 0 9px;
			border: 0;
			border-radius: 24px 24px 0 0;
			box-shadow: 0 -1px 0 rgb(255 255 255 / 0.14);
			overflow: hidden;
		}

		.daynight-mobile-home-quick__scroller {
			--bc-text-filter: var(--bc-text-quick-pill);
			--bc-leading-filter: var(--bc-leading-quick-pill);
			-webkit-overflow-scrolling: touch;
		}

		.daynight-mobile-home-quick__scroller a {
			min-width: max-content;
		}

		.daynight-mobile-home-quick__scroller :is(button, a):focus-visible {
			background: var(--bc-surface-hover);
			box-shadow: none;
			color: var(--bc-ink);
		}

		.daynight-mobile-home-quick__scroller :is(button, a):focus-visible {
			outline: 2px solid rgba(28, 28, 28, 0.7);
			outline-offset: 3px;
		}

		.daynight-mobile-home-quick__scroller :global(svg) {
			flex: 0 0 auto;
			color: inherit;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header.header-style-4) {
			border-bottom: 0 !important;
			background: var(--daynight-mobile-hero-top, var(--bc-accent)) !important;
			box-shadow: none !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 56px !important;
			min-height: 56px !important;
			background: var(--daynight-mobile-hero-top, var(--bc-accent)) !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: var(--daynight-mobile-hero-top, var(--bc-accent)) !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-inner) {
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 8px;
			gap: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-map) {
			border-color: rgb(255 255 255 / 0.3);
			background: rgb(255 255 255 / 0.08);
			color: var(--bc-white);
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 170px;
			height: 48px;
			align-items: center;
			border-radius: 0;
			background: transparent;
			padding: 0;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			width: 168px !important;
			max-width: 168px;
			height: auto;
			opacity: 1;
			filter: none !important;
		}
	}
</style>
