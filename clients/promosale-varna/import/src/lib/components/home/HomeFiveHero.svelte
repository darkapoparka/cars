<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeroAction,
		HomeFiveHeroActionMode,
		HomeFiveHeroData,
		HomeFiveHeroSelect
	} from '$lib/auxero/home-five';
	import {
		ArrowRight,
		MapPin,
		Navigation,
		PhoneCall,
		Search,
		SlidersHorizontal,
		X
	} from '@lucide/svelte';
	import { onMount, tick } from 'svelte';
	import InventoryAdvancedFilters from '$lib/components/inventory/InventoryAdvancedFilters.svelte';
	import InventoryMobilePage from '$lib/components/inventory/InventoryMobilePage.svelte';
	import HeroFilterDialog from './HeroFilterDialog.svelte';

	let { hero }: { hero?: HomeFiveHeroData } = $props();

	const mobileShowroomMapHref =
		'https://www.google.com/maps/search/?api=1&query=Day Night Auto%20Plovdiv%20South%20Industrial%20Zone';
	const mobileShowroomPhoneHref = 'tel:0877733110';
	const inventoryFilterHref = (name: string, value: string) =>
		`/inventory?${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	const isEnglish = $derived(hero?.searchSubmitPrefix === 'Show');
	const activeMode = $derived(hero?.activeMode ?? 'buy');
	const activeAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === activeMode) ?? hero?.actions[0]
	);
	const activeActionHref = $derived(activeAction?.actionHref ?? '/inventory');
	const activeSubmitLabel = $derived(
		activeAction?.mode === 'buy' && hero
			? `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: (activeAction?.submitLabel ?? '')
	);
	const isInventoryMode = $derived(activeAction?.mode === 'buy');
	let mobileModeOverride = $state<HomeFiveHeroActionMode | null>(null);
	const mobileMode = $derived(mobileModeOverride ?? activeMode);
	const activeMobileAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === mobileMode) ?? hero?.actions[0]
	);
	const selectMobileMode = (mode: HomeFiveHeroActionMode) => {
		mobileModeOverride = mode;
	};

	// Desktop buy box — consistent dialogs replace the cramped CSS dropdowns.
	// Selection lives here so the model list can cascade off the chosen make(s),
	// and so each field renders hidden inputs that preserve the GET /inventory contract.
	const brandFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'brand'));
	const modelFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'q'));
	const priceFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'maxPrice'));

	let brandSelection = $state<string[]>([]);
	let modelSelection = $state<string[]>([]);
	let priceSelection = $state<string[]>([]);
	let keyword = $state('');
	let mileageSelection = $state<string[]>([]);
	const mileageFilter = $derived({
		id: 'home-mileage',
		name: 'mileageTo',
		title: isEnglish ? 'Mileage' : 'Пробег',
		defaultLabel: isEnglish ? 'Mileage' : 'Пробег',
		options: [50000, 100000, 150000, 200000, 250000].map((value) => ({
			value: String(value),
			label: `${isEnglish ? 'Up to' : 'До'} ${value.toLocaleString('bg-BG')} km`
		}))
	});

	const modelOptionsForBrands = (brands: string[]) => {
		const all = modelFilter?.options ?? [];
		if (!brands.length) return all;
		return all.filter((option) => option.brand && brands.includes(option.brand));
	};
	const pruneModelSelection = (selection: string[], brands = brandSelection) => {
		const valid = new Set(modelOptionsForBrands(brands).map((option) => option.value));
		return selection.filter((value) => valid.has(value));
	};
	const updateBrandSelection = (selection: string[]) => {
		brandSelection = selection;
		modelSelection = pruneModelSelection(modelSelection, selection);
	};
	const modelOptions = $derived(modelOptionsForBrands(brandSelection));

	const mobileSearchPlaceholder = $derived(
		activeMobileAction?.placeholder ??
			(isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...')
	);
	const mobileHeading = $derived(
		activeMobileAction?.mobileHeading ?? (isEnglish ? 'Find your car.' : 'Намери автомобила си.')
	);
	const mobileModeHeading = $derived.by(() => {
		if (activeMobileAction?.mode === 'import') {
			return isEnglish ? 'Import a car' : 'Внеси автомобил';
		}

		if (activeMobileAction?.mode === 'sell') {
			return isEnglish ? 'Sell your car' : 'Продай автомобил';
		}

		return isEnglish ? 'Buy a car' : 'Купи автомобил';
	});
	const mobileSearchDrawerTitle = $derived(
		activeMobileAction?.drawerTitle ?? (isEnglish ? 'Find a car' : 'Намери автомобил')
	);
	const mobileSearchDrawerClose = $derived(isEnglish ? 'Close search' : 'Затвори търсенето');
	const mobileAllLabel = $derived(
		activeMobileAction?.secondaryLabel ?? (isEnglish ? 'Browse all' : 'Разгледай всички')
	);
	const mobileShowAllCommand = $derived(isEnglish ? 'Show all' : 'Покажи всички');
	const mobileActionTabs = $derived.by(() =>
		(hero?.actions ?? []).filter((action) => action.mode !== 'sell')
	);
	const mobileTabIndex = $derived(
		Math.max(
			0,
			mobileActionTabs.findIndex((tab) => tab.mode === mobileMode)
		)
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
					{ href: '/inventory?maxPrice=10000', label: 'До 10 000' },
					{ href: '/inventory?maxPrice=20000', label: 'До 20 000' },
					{ href: '/inventory?maxPrice=30000', label: 'До 30 000' },
					{ href: '/inventory?status=New%20listing', label: 'Нови обяви' },
					{ href: '/inventory?status=Available', label: 'Налични' }
				]
	);
	const quickLinksForMode = (mode: string) => {
		if (mode === 'import') {
			return isEnglish
				? [
						{ href: '/calculator', label: 'Import calculator' },
						{ href: '/services', label: 'Import process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Day Night Auto' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/calculator', label: 'Калкулатор' },
						{ href: '/services', label: 'Процес по внос' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Day Night Auto' },
						{ href: '/inventory', label: 'Налични коли' }
					];
		}

		if (mode === 'sell') {
			return isEnglish
				? [
						{ href: '/sell-your-car', label: 'Valuation form' },
						{ href: '/services', label: 'Selling process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Day Night Auto' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/sell-your-car', label: 'Оценка' },
						{ href: '/services', label: 'Как продаваме' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Day Night Auto' },
						{ href: '/inventory', label: 'Налични коли' }
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
	let inventorySearchOpen = $state(false);
	let desktopSearchOpen = $state(false);
	const openDesktopSearch = () => {
		inventorySearchTrigger =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		desktopSearchOpen = true;
	};
	let inventorySearchTrigger: HTMLElement | null = null;
	const closeInventorySearch = () => {
		inventorySearchOpen = false;
		desktopSearchOpen = false;
		void tick().then(() => inventorySearchTrigger?.focus());
	};
	const openMobileSearch = () => {
		if (mobileMode === 'buy' && hero?.inventorySearch) {
			inventorySearchTrigger =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			inventorySearchOpen = true;
			return;
		}
		mobileSearchOpen = true;
	};
	const closeMobileSearch = () => {
		mobileSearchOpen = false;
	};
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

	// The location sheet stays hand-rolled (no input → no keyboard problem). Keep its
	// drag-to-dismiss; it no longer shares state with the search sheet.
	let mobileLocationDragOffset = $state(0);
	let locationDragActive = false;
	let locationDragStartY = 0;
	const closeMobileLocation = () => {
		locationDragActive = false;
		mobileLocationDragOffset = 0;
		const toggle = document.getElementById(
			'daynight-mobile-location-toggle'
		) as HTMLInputElement | null;
		if (toggle) toggle.checked = false;
	};
	const canStartLocationDrag = (event: PointerEvent) => {
		const target = event.target as HTMLElement | null;
		if (!target) return false;
		if (target.closest('a, button, input, label, select, textarea')) return false;
		return Boolean(
			target.closest(
				'.daynight-mobile-location-sheet__handle, .daynight-mobile-location-sheet__panel header'
			)
		);
	};
	const startLocationDrag = (event: PointerEvent) => {
		if (!canStartLocationDrag(event)) return;
		locationDragActive = true;
		locationDragStartY = event.clientY;
		mobileLocationDragOffset = 0;
		try {
			(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		} catch {
			// Some browser/device pairs reject capture during synthetic pointer paths.
		}
		event.preventDefault();
	};
	const moveLocationDrag = (event: PointerEvent) => {
		if (!locationDragActive) return;
		const offset = Math.max(0, event.clientY - locationDragStartY);
		mobileLocationDragOffset = Math.min(offset, window.innerHeight * 0.75);
		event.preventDefault();
	};
	const finishLocationDrag = (event: PointerEvent) => {
		if (!locationDragActive) return;
		const panel = event.currentTarget as HTMLElement;
		const offset = mobileLocationDragOffset;
		const threshold = Math.min(128, panel.offsetHeight * 0.28);
		locationDragActive = false;
		mobileLocationDragOffset = 0;
		try {
			panel.releasePointerCapture?.(event.pointerId);
		} catch {
			// Capture may already be released when the pointer is cancelled.
		}
		if (offset >= threshold) closeMobileLocation();
	};
	const modeAllText = (action: { mode: string; secondaryLabel?: string }) =>
		action.mode === 'buy' && hero
			? `${isEnglish ? 'View all' : 'Виж всички'} (${hero.totalMatches})`
			: (action.secondaryLabel ?? mobileAllLabel);
	const drawerSubmitLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' ? mobileShowAllCommand : tab.submitLabel;
	const drawerSubmitAriaLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' && hero
			? `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: tab.submitLabel;
	const desktopIntentTitle = $derived(
		activeAction?.drawerTitle ?? (isEnglish ? 'Find a car' : 'Намери автомобил')
	);
	const desktopIntentPlaceholder = $derived(
		activeAction?.placeholder ??
			(isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...')
	);

	// The hero reads as a single static block — the three intents live in the
	// Купи/Внос/Продай tabs below, so we halt the template's auto-rotating slider
	// (and the nav arrows are removed from the markup).
	onMount(() => {
		let tries = 0;
		const timer = setInterval(() => {
			tries += 1;
			const autoplays = Array.from(document.querySelectorAll('.page-title [class*="swiper"]'))
				.map(
					(el) =>
						(el as unknown as { swiper?: { autoplay?: { stop: () => void } } }).swiper?.autoplay
				)
				.filter((a): a is { stop: () => void } => Boolean(a));
			if (autoplays.length) {
				autoplays.forEach((a) => a.stop());
				clearInterval(timer);
			} else if (tries > 50) {
				clearInterval(timer);
			}
		}, 100);
		return () => clearInterval(timer);
	});
</script>

{#snippet heroSelect(select: HomeFiveHeroSelect)}
	<div class="search-cars__select-wrapper">
		<div class="search-cars__select filter-select-dropdown bg-white" data-name={select.name}>
			<label for={select.id} class="search-cars__label">{select.title}</label>
			<input type="checkbox" id={select.id} class="filter-select-dropdown__toggle" />
			<label for={select.id} class="filter-select-dropdown__text">
				<span>{select.defaultLabel}</span>
			</label>
			<div class="filter-select-dropdown__menu">
				<div class="filter-select-dropdown__list">
					<label class="filter-checkbox">
						<input type="checkbox" name={select.name} value="" checked />
						<span>{select.defaultLabel}</span>
					</label>
					{#each select.options as option (option.value)}
						<label class="filter-checkbox">
							<input type="checkbox" name={select.name} value={option.value} />
							<span>{option.label}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#if desktopSearchOpen && hero?.inventorySearch}
	<InventoryAdvancedFilters
		desktop={hero.inventorySearch.desktop}
		initialValues={{
			q: keyword,
			brand: brandSelection.join(','),
			model: modelSelection.join(','),
			priceTo: priceSelection.join(','),
			mileageTo: mileageSelection.join(',')
		}}
		onclose={closeInventorySearch}
	/>
{/if}
{#if inventorySearchOpen && hero?.inventorySearch}
	<InventoryMobilePage
		cards={[]}
		mobile={hero.inventorySearch.mobile}
		copy={hero.inventorySearch.copy}
		filtersOnly
		filterDrawerOpen={true}
		onclose={closeInventorySearch}
	/>
{/if}
{#if hero}
	<div class="daynight-mobile-home" data-daynight-search-form={activeMobileAction?.mode ?? 'buy'}>
		<input
			id="daynight-mobile-location-toggle"
			class="daynight-mobile-location-toggle"
			type="checkbox"
			tabindex="-1"
			aria-hidden="true"
		/>
		<section class="daynight-mobile-hero" aria-label={mobileHeading}>
			<div class="container">
				<div class="daynight-mobile-hero__copy">
					<h1>{mobileModeHeading}</h1>
				</div>

				<div class="daynight-mobile-hero__search-module">
					<div
						class="daynight-mobile-hero__tabs"
						style:--daynight-tab-index={mobileTabIndex}
						aria-label={hero.heading}
						role="tablist"
					>
						{#each mobileActionTabs as tab (tab.mode)}
							<button
								type="button"
								role="tab"
								class={`daynight-mobile-hero__tab daynight-mobile-hero__tab--${tab.mode} ${tab.mode === mobileMode ? 'active' : ''}`}
								aria-selected={tab.mode === mobileMode}
								onclick={() => selectMobileMode(tab.mode)}
							>
								{tab.label}
							</button>
						{/each}
					</div>

					<div class="daynight-mobile-hero__search">
						<button
							type="button"
							class="daynight-mobile-hero__search-label"
							aria-haspopup="dialog"
							aria-expanded={mobileSearchOpen || inventorySearchOpen}
							onclick={openMobileSearch}
						>
							<span>{mobileSearchPlaceholder}</span>
						</button>
						<button
							type="button"
							class="daynight-mobile-hero__search-action"
							aria-label={hero.searchSubmitPrefix}
							aria-expanded={mobileSearchOpen || inventorySearchOpen}
							onclick={openMobileSearch}
						>
							<Search size={20} strokeWidth={2.25} aria-hidden="true" />
						</button>
					</div>
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

		<div class="daynight-mobile-location-sheet">
			<button
				type="button"
				class="daynight-mobile-location-sheet__backdrop"
				aria-label={isEnglish ? 'Close location picker' : 'Затвори избор на локация'}
				onclick={closeMobileLocation}
			></button>
			<div
				id="daynight-mobile-location-panel"
				class="daynight-mobile-location-sheet__panel"
				style={`--daynight-mobile-location-drag-y: ${mobileLocationDragOffset}px`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="daynight-mobile-location-title"
				tabindex="-1"
				onpointerdown={startLocationDrag}
				onpointermove={moveLocationDrag}
				onpointerup={finishLocationDrag}
				onpointercancel={finishLocationDrag}
			>
				<span class="daynight-mobile-location-sheet__handle"></span>
				<header>
					<div>
						<p>{isEnglish ? 'Day Night Auto showroom' : 'Day Night Auto шоурум'}</p>
						<h2 id="daynight-mobile-location-title">
							{isEnglish ? 'Plovdiv, South Industrial Zone' : 'Пловдив, Индустриална зона - Юг'}
						</h2>
					</div>
					<button
						type="button"
						aria-label={isEnglish ? 'Close' : 'Затвори'}
						onclick={closeMobileLocation}
					>
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					</button>
				</header>
				<div class="daynight-mobile-location-map" aria-hidden="true">
					<span class="daynight-mobile-location-map__road road-a"></span>
					<span class="daynight-mobile-location-map__road road-b"></span>
					<span class="daynight-mobile-location-map__road road-c"></span>
					<span class="daynight-mobile-location-map__pin">
						<MapPin size={24} strokeWidth={2.4} aria-hidden="true" />
					</span>
					<span class="daynight-mobile-location-map__badge">Day Night Auto</span>
				</div>
				<div class="daynight-mobile-location-address">
					<span>{isEnglish ? 'Showroom address' : 'Адрес на шоурума'}</span>
					<strong
						>{isEnglish
							? 'Plovdiv, South Industrial Zone'
							: 'Пловдив, Южна Индустриална зона'}</strong
					>
					<p>
						{isEnglish
							? 'Vehicle viewings are by appointment. Call before visiting.'
							: 'Огледите са след уговорка. Обади се преди посещение.'}
					</p>
				</div>
				<div class="daynight-mobile-location-actions">
					<a href={mobileShowroomMapHref} target="_blank" rel="noreferrer">
						<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Open map' : 'Отвори карта'}
					</a>
					<a href={mobileShowroomPhoneHref}>
						<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Call showroom' : 'Обади се'}
					</a>
				</div>
			</div>
		</div>

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
			>
				<header class="daynight-home-search-overlay__bar">
					<span class="daynight-home-search-drawer__title"
						>{activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}</span
					>
					<button
						type="button"
						class="daynight-home-search-overlay__close"
						aria-label={mobileSearchDrawerClose}
						onclick={closeMobileSearch}
					>
						<X size={20} strokeWidth={2.4} aria-hidden="true" />
					</button>
				</header>
				<form
					class="daynight-home-search-drawer__form"
					action={resolve(activeMobileAction.actionHref)}
					method="get"
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
																src={option.image}
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
									<p>{isEnglish ? 'Fuel' : 'Гориво'}</p>
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
			<div class="container">
				<nav class="daynight-mobile-home-quick__scroller bc-quick bc-quick--{mobileMode}">
					{#if mobileMode === 'buy'}
						<button
							type="button"
							class="daynight-mobile-home-quick__filter"
							aria-haspopup="dialog"
							aria-expanded={mobileSearchOpen || inventorySearchOpen}
							aria-label={isEnglish ? 'Open filters' : 'Отвори филтри'}
							onclick={openMobileSearch}
						>
							<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
						</button>
					{/if}
					{#each activeMobileQuickLinks as filter (filter.href)}
						<a href={resolve(filter.href as '/')}>{filter.label}</a>
					{/each}
				</nav>
			</div>
		</section>
	{/if}

	<form
		class="daynight-desktop-hero"
		action={resolve(activeActionHref)}
		method="get"
		data-daynight-search-form={activeAction?.mode ?? 'buy'}
	>
		<section class="page-title page-title-style-4 effect-content-slide effect-2 flex">
			<div class="swiper-container page-title--slider sw-single">
				<div class="swiper-wrapper">
					{#each hero.textSlides as slide, index (slide.id)}
						<div class={['swiper-slide', index === 0 && 'swiper-slide-active']}>
							<div class="tp-showcase-slider-bg"></div>
						</div>
					{/each}
				</div>
			</div>

			<div class="daynight-hero-cars" aria-hidden="true">
				<img
					class="daynight-hero-car daynight-hero-car--left"
					src="/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp"
					alt=""
					width="820"
					height="420"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
				<img
					class="daynight-hero-car daynight-hero-car--right"
					src="/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp"
					alt=""
					width="820"
					height="420"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</div>

			<!-- Search Cars Section -->
			<div class="search-cars thumb effect-zoom-item container">
				<div class="daynight-hero-heading">
					<div class="sw-single-thumb swiper">
						<div class="swiper-wrapper">
							{#each hero.textSlides as slide, index (slide.id)}
								<div class={['swiper-slide', index === 0 && 'swiper-slide-active']}>
									{#if index === 0}
										<h1 class="search-cars__title effect-item effect-up text-center delay-3">
											{slide.heading}
										</h1>
									{:else}
										<p class="search-cars__title effect-item effect-up text-center delay-3">
											{slide.heading}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="daynight-hero-search-panel">
					<nav
						class="flat-tabs daynight-intent-switch"
						aria-label={isEnglish ? 'Choose what you want to do' : 'Избери какво искаш да направиш'}
					>
						<div class="overflow-x-auto">
							<ul
								class="menu-tab menu-tab-style1 daynight-intent-switch__list margin-auto text-white"
							>
								{#each hero.actions as tab (tab.mode)}
									<li class={['daynight-intent-switch__item', tab.mode === activeMode && 'active']}>
										<a
											class="daynight-intent-switch__link"
											href={resolve(tab.tabHref)}
											aria-current={tab.mode === activeMode ? 'page' : undefined}
										>
											<span class="font-weight-600 text-white">{tab.label}</span>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</nav>

					{#if isInventoryMode}
						<div class="hero-keyword-row">
							<div class="hero-keyword">
								<Search size={20} aria-hidden="true" />
								<input
									type="search"
									name="keyword"
									bind:value={keyword}
									readonly={Boolean(hero?.inventorySearch)}
									onclick={hero?.inventorySearch ? openDesktopSearch : undefined}
									onkeydown={(event) => {
										if (hero?.inventorySearch && (event.key === 'Enter' || event.key === ' ')) {
											event.preventDefault();
											openDesktopSearch();
										}
									}}
									aria-haspopup="dialog"
									aria-label={isEnglish
										? 'Search make, model or keyword'
										: 'Търси марка, модел или ключова дума'}
									placeholder={isEnglish
										? 'Make, model or keyword'
										: 'Марка, модел или ключова дума'}
								/>
								<button
									class="hero-keyword-submit"
									type={hero?.inventorySearch ? 'button' : 'submit'}
									onclick={hero?.inventorySearch ? openDesktopSearch : undefined}
									><Search size={19} aria-hidden="true" />{isEnglish ? 'Search' : 'Търси'}</button
								>
							</div>
						</div>
					{/if}
					<!-- Primary Search Filters -->
					<div class="search-cars__filters">
						{#if isInventoryMode}
							{#if brandFilter}
								<HeroFilterDialog
									select={brandFilter}
									bind:selected={() => brandSelection, updateBrandSelection}
									mode="multi"
									variant="grid"
									searchable
									dialogTitle={isEnglish ? 'Choose make' : 'Избери марка'}
									dialogDescription={isEnglish
										? 'Choose one or more makes. The model list updates automatically.'
										: 'Избери една или повече марки. Списъкът с модели се обновява автоматично.'}
									searchPlaceholder={isEnglish ? 'Search makes…' : 'Търси марка…'}
									{isEnglish}
								/>
							{/if}

							{#if modelFilter}
								<HeroFilterDialog
									select={{ ...modelFilter, name: 'model' }}
									bind:selected={modelSelection}
									options={modelOptions}
									mode="multi"
									variant="list"
									searchable
									{isEnglish}
									dialogTitle={isEnglish ? 'Choose model' : 'Избери модел'}
									searchPlaceholder={isEnglish ? 'Search models…' : 'Търси модел…'}
								/>
							{/if}

							{#if priceFilter}
								<HeroFilterDialog
									select={priceFilter}
									bind:selected={priceSelection}
									mode="single"
									variant="list"
									dialogTitle={isEnglish ? 'Choose maximum price' : 'Избери максимална цена'}
									dialogDescription={isEnglish
										? 'Show vehicles within the selected budget.'
										: 'Покажи автомобили до избрания бюджет.'}
									{isEnglish}
								/>
							{/if}
							<HeroFilterDialog
								select={mileageFilter}
								bind:selected={mileageSelection}
								mode="single"
								variant="list"
								{isEnglish}
								dialogTitle={isEnglish ? 'Choose maximum mileage' : 'Избери максимален пробег'}
							/>
						{:else}
							<label class="search-cars__intent-field">
								<span>{desktopIntentTitle}</span>
								<input
									name={activeAction?.inputName ?? 'vehicle'}
									type="search"
									placeholder={desktopIntentPlaceholder}
									required
									autocomplete="off"
								/>
							</label>
							<button
								type="submit"
								class="search-cars__search search-cars__search--intent md-w-full flex items-center justify-center gap-8"
							>
								<img src="/assets/icons/search.svg" alt="search" />
								{activeSubmitLabel}
							</button>
						{/if}
					</div>

					<!-- Advanced Filters Panel -->
					<div
						class={['search-cars__advanced', !isInventoryMode && 'search-cars__advanced--hidden']}
						id="advancedFilters"
					>
						<div class="search-cars__advanced-content">
							<div class="search-cars__advanced-row">
								{#each hero.advancedFilters as select (select.id)}
									{@render heroSelect(select)}
								{/each}
								<div class="search-cars__range">
									<p class="search-cars__range-label">
										{hero.yearLabel}: <span id="yearMin">{hero.yearRange.min}</span> -
										<span id="yearMax">{hero.yearRange.max}</span>
									</p>
									<div class="search-cars__range-wrapper" id="yearRangeWrapper">
										<div
											id="slider-range"
											data-min={hero.yearRange.min}
											data-max={hero.yearRange.max}
											data-step="1"
											data-values={`${hero.yearRange.min}, ${hero.yearRange.max}`}
										></div>
									</div>
								</div>
							</div>
							<div class="divider mt-28 mb-24"></div>
							<div class="search-cars__features">
								<p class="h3 search-cars__features-title flex items-center gap-8">
									{hero.checksTitle}
									<img src="/assets/icons/minus.svg" alt="minus" />
								</p>
								<div class="search-cars__features-grid">
									{#each hero.features as feature, index (feature)}
										<div class="form-group">
											<input
												type="checkbox"
												id={`Home05Feature${index}`}
												name="feature"
												value={feature}
											/>
											<label for={`Home05Feature${index}`}>{feature}</label>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</form>
{/if}

<style>
	.hero-keyword-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.hero-keyword {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		min-width: 0;
		border: 1px solid var(--bc-hero-control-border);
		border-radius: 10px;
		padding: 5px 5px 5px 16px;
		background: var(--bc-white);
		color: var(--bc-muted);
	}
	.hero-keyword input {
		flex: 1;
		min-width: 0;
		width: 100%;
		height: 50px;
		padding: 0 !important;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--bc-dark-border) !important;
		font-size: 16px;
	}
	.hero-keyword:focus-within {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.hero-keyword input:focus {
		outline: none;
	}
	.hero-keyword-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		flex: 0 0 148px;
		min-height: 50px;
		padding: 0 20px;
		border: 0;
		border-radius: 7px;
		background: var(--bc-accent);
		color: white;
		font: inherit;
		font-size: 17px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}
	.hero-keyword-submit:hover {
		background: var(--bc-accent-hover);
	}
	.hero-keyword-submit:focus-visible {
		outline: 2px solid var(--bc-dark-border);
		outline-offset: 2px;
	}

	:global(.page-title.page-title-style-4) {
		height: auto !important;
		min-height: 0 !important;
		align-items: center;
		padding-top: 30px !important;
		padding-bottom: 30px !important;
		background: linear-gradient(
			120deg,
			var(--bc-dark-surface) 0%,
			var(--bc-dark-surface) 58%,
			var(--bc-mobile-dark) 100%
		);
	}

	/* Let the hero collapse to its real content height (the template swiper
	   otherwise stretches it ~180px taller than the search module needs). */
	:global(.page-title.page-title-style-4 .search-cars) {
		height: auto !important;
		min-height: 0 !important;
		position: relative;
		z-index: 7;
	}

	.daynight-hero-cars {
		position: absolute;
		inset: 0;
		z-index: 4;
		overflow: hidden;
		pointer-events: none;
	}

	.daynight-hero-cars::before {
		position: absolute;
		right: 4%;
		bottom: 18px;
		left: 4%;
		height: 118px;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgb(227 6 47 / 0.32), transparent 68%);
		content: '';
		filter: blur(2px);
		opacity: 0.8;
	}

	.daynight-hero-car {
		position: absolute;
		top: 43%;
		width: min(28vw, 438px);
		height: auto;
		user-select: none;
		filter: drop-shadow(0 26px 24px rgb(0 0 0 / 0.38));
		transform: translateY(-50%);
	}

	.daynight-hero-car--left {
		left: 0.8%;
	}

	.daynight-hero-car--right {
		right: 0.8%;
		transform: translateY(-50%) scaleX(-1);
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg::after) {
		background:
			linear-gradient(
				180deg,
				rgba(4, 7, 5, 0.1) 0%,
				rgba(4, 7, 5, 0.02) 42%,
				rgba(7, 13, 9, 0.34) 78%,
				rgba(5, 9, 6, 0.54) 100%
			),
			linear-gradient(90deg, rgba(0, 0, 0, 0.44), rgba(0, 0, 0, 0.04) 50%, rgba(0, 0, 0, 0.38));
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg) {
		background: none !important;
		background-position: center bottom;
	}

	:global(.page-title.page-title-style-4 .search-cars__title),
	:global(.page-title.page-title-style-4 .search-cars .h7),
	:global(.page-title.page-title-style-4 .menu-tab-style1 .font-weight-600) {
		color: var(--bc-white) !important;
		text-shadow: 0 4px 22px rgb(0 0 0 / 0.4);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible) {
		outline-color: rgb(255 255 255 / 0.72);
	}

	.daynight-mobile-home,
	.daynight-mobile-home-quick {
		display: none;
	}

	:global(.page-title.page-title-style-4 .search-cars) {
		padding-top: 4px;
	}

	.daynight-hero-heading,
	.daynight-hero-search-panel {
		position: relative;
		z-index: 8;
	}

	.daynight-hero-heading {
		display: grid;
		justify-items: center;
	}

	.daynight-hero-search-panel {
		display: grid;
		gap: 12px;
	}

	@media (min-width: 768px) {
		:global(.page-title.page-title-style-4 .search-cars) {
			width: calc(100% - 64px);
			max-width: 1320px;
			padding-inline: 0;
		}

		.daynight-hero-heading {
			min-height: 110px;
		}

		.daynight-hero-cars {
			width: calc(100% - 64px);
			max-width: 1420px;
			margin-inline: auto;
		}

		.daynight-hero-car {
			top: 88px;
			width: min(23.5vw, 350px);
		}

		.daynight-hero-search-panel {
			gap: 16px;
			margin-top: 24px;
			padding: 0 20px 20px;
			border: 1px solid rgba(255, 255, 255, 0.18);
			border-radius: 16px;
			background: var(--bc-dark-surface);
		}

		:global(.page-title.page-title-style-4 .sw-single-thumb) {
			translate: none;
		}

		:global(.page-title.page-title-style-4 .daynight-intent-switch) {
			margin-top: 0 !important;
			margin-bottom: 0 !important;
			position: relative;
			z-index: 2;
			border-bottom: 1px solid rgba(255, 255, 255, 0.14);
		}

		:global(.page-title.page-title-style-4 .daynight-intent-switch__list) {
			width: min(100%, 480px) !important;
			margin: 0 auto !important;
			padding: 0;
			border: 0 !important;
			border-radius: 0;
			background: transparent;
		}

		:global(.page-title.page-title-style-4 .daynight-intent-switch__link) {
			min-height: 52px;
			font-size: 20px !important;
			font-weight: 650;
			color: var(--bc-muted-on-dark);
			border-radius: 0;
			border-bottom: 2px solid transparent;
			background: transparent;
		}

		:global(
			.page-title.page-title-style-4
				.daynight-intent-switch__item.active
				.daynight-intent-switch__link
		),
		:global(
			.page-title.page-title-style-4
				.daynight-intent-switch__item.active
				.daynight-intent-switch__link:hover
		) {
			border-bottom-color: var(--bc-white);
			color: var(--bc-white);
			background: rgb(255 255 255 / 0.05);
		}

		:global(.page-title.page-title-style-4 .daynight-intent-switch__link:focus-visible) {
			outline: 2px solid var(--bc-white);
			outline-offset: -5px;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters) {
			min-height: 62px;
			align-items: center;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
		}
	}

	@media (min-width: 768px) {
		:global(.page-title.page-title-style-4 .hfp__value) {
			font-size: 16px !important;
			line-height: 22px;
			color: var(--bc-ink);
		}
		:global(.page-title.page-title-style-4 .hfp__label) {
			font-size: 12px;
			line-height: 16px;
			letter-spacing: 0.02em;
		}
	}
	.daynight-intent-switch__list {
		display: grid !important;
		width: min(100%, 390px) !important;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 2px;
		margin-bottom: 0 !important;
		border: 1px solid rgba(255, 255, 255, 0.14) !important;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.14);
		padding: 5px;
	}

	.daynight-intent-switch__item {
		min-width: 0 !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	.daynight-intent-switch__item::before {
		display: none !important;
	}

	.daynight-intent-switch__link {
		display: flex;
		min-height: 51px;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		padding: 0 18px;
		font-size: 17px;
		font-weight: 650;
		line-height: 1;
		transition:
			background-color var(--bc-motion-hover),
			color var(--bc-motion-hover);
	}

	.daynight-intent-switch__item.active .daynight-intent-switch__link {
		background: var(--bc-accent);
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-intent-switch__item:not(.active) .daynight-intent-switch__link:hover {
			background: rgba(255, 255, 255, 0.14);
		}

		.daynight-intent-switch__item.active .daynight-intent-switch__link:hover {
			background: var(--bc-accent-hover);
		}
	}

	@media (max-width: 1199px) {
		.daynight-hero-car {
			width: min(24vw, 280px);
		}
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb) {
		overflow: hidden;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide) {
		opacity: 0 !important;
		pointer-events: none !important;
		visibility: hidden;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide-active) {
		opacity: 1 !important;
		pointer-events: auto !important;
		visibility: visible;
	}

	.search-cars__title {
		max-width: 13ch;
		margin-inline: auto;
		font-family: var(--bc-font-heading);
		font-size: clamp(44px, 4vw, 64px);
		font-weight: 700;
		letter-spacing: var(--bc-tracking-display);
		line-height: 1.08;
		margin-bottom: 14px;
		text-shadow: 0 4px 22px rgba(0, 0, 0, 0.4);
	}

	@media (min-width: 768px) {
		/* Desktop intent titles are a single-line state label, not a paragraph. */
		.search-cars__title {
			width: max-content;
			max-width: none;
			margin-bottom: 18px;
			white-space: nowrap;
		}
	}

	:global(.page-title.page-title-style-4 .search-cars .h7) {
		max-width: 62ch;
		margin-inline: auto;
		font-size: 16px;
		font-weight: 400;
		line-height: 1.5;
	}

	.search-cars p:not(.search-cars__title) {
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible) {
		outline: 2px solid rgba(255, 255, 255, 0.72);
		outline-offset: 4px;
	}

	.search-cars__filters {
		align-items: stretch;
	}

	.search-cars__select-wrapper {
		min-width: 120px;
	}

	.search-cars__select {
		display: grid;
		min-height: 62px;
		align-content: center;
		gap: 3px;
		padding: 9px 38px 8px 12px;
	}

	.search-cars__label {
		position: static;
		max-width: 100%;
		overflow: hidden;
		color: var(--bc-copy);
		font-size: var(--bc-text-meta);
		font-weight: 600;
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 16px;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.search-cars__intent-field {
		display: grid;
		min-width: min(520px, 100%);
		flex: 1 1 auto;
		align-content: center;
		gap: 4px;
		border-radius: 8px;
		background: var(--bc-white);
		padding: 9px 18px;
	}

	.search-cars__intent-field:focus-within {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.search-cars__intent-field span {
		color: var(--bc-copy);
		font-size: 12px;
		font-weight: 700;
		line-height: 1.15;
	}

	.search-cars__intent-field input {
		width: 100%;
		height: 25px;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		outline: 0 !important;
		padding: 0 !important;
	}

	.search-cars__intent-field input::placeholder {
		color: var(--bc-muted-light);
		opacity: 1;
	}

	.search-cars__search--intent {
		min-width: 210px;
	}

	.search-cars__search {
		height: auto;
		min-height: 66px;
	}

	.search-cars__search {
		box-sizing: border-box;
		flex: 0 0 272px;
		height: 62px;
		min-height: 62px;
		width: 272px;
		padding: 0 16px;
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		font-size: 18px;
		font-weight: 600;
		line-height: 1.2;
		white-space: nowrap;
		transition:
			background-color var(--bc-motion-hover),
			border-color var(--bc-motion-hover),
			color var(--bc-motion-hover);
	}

	.search-cars__search img {
		flex: 0 0 auto;
	}

	.search-cars__search:is(:hover, :focus-visible) {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	.search-cars__advanced--hidden {
		display: none !important;
	}

	@media (max-width: 575px) {
		.search-cars__title {
			font-size: 40px;
			line-height: 1.12;
		}

		.search-cars__select-wrapper {
			min-width: 100%;
		}
	}

	@media (max-width: 767.98px) {
		:global(body.auxero-template-home-05-html.auxero-template-home-05-html) {
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

		.daynight-desktop-hero {
			display: none;
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

		.daynight-mobile-location-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.daynight-mobile-hero {
			padding: 10px 0 33px;
			background: transparent;
		}

		.daynight-mobile-hero :global(.container),
		.daynight-mobile-home-quick :global(.container) {
			width: 100%;
			max-width: 480px;
			padding-right: 16px;
			padding-left: 16px;
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
			gap: var(--bc-mobile-entry-gap);
			margin-bottom: 9px;
			padding: 0;
		}

		/* Buying and importing are the two discovery modes. Selling remains available
		   in the persistent bottom navigation instead of being duplicated here. */
		.daynight-mobile-hero__tabs {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0;
			min-height: 0;
			border: 0;
			border-bottom: 1px solid rgb(255 255 255 / 0.2);
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.daynight-mobile-hero__tabs button {
			position: relative;
			display: flex;
			min-height: 44px;
			width: 100%;
			align-items: flex-end;
			justify-content: center;
			padding: 0 0 6px;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: rgb(255 255 255 / 0.72);
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-h5);
			font-weight: var(--bc-weight-control);
			letter-spacing: 0;
			line-height: 24px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
		}

		.daynight-mobile-hero__tab.active {
			background: transparent;
			box-shadow: none;
			color: var(--bc-white);
			font-weight: var(--bc-weight-heading);
		}

		.daynight-mobile-hero__tab.active::after {
			position: absolute;
			inset: auto 0 -1px;
			height: 2px;
			background: var(--bc-white);
			content: '';
		}

		.daynight-mobile-hero__tab:focus-visible {
			outline: 2px solid rgb(255 255 255 / 0.72);
			outline-offset: -3px;
		}

		/* No press-move on mobile: tapping must not nudge the search bar, CTAs or chips. */

		.bc-drawer {
			display: grid;
			min-height: 0;
			gap: 13px;
			grid-template-rows: max-content minmax(0, 1fr);
			overflow: hidden;
		}

		.daynight-mobile-hero__search {
			display: flex;
			height: var(--bc-control-height-primary);
			align-items: center;
			gap: 10px;
			padding: var(--bc-mobile-entry-inset) var(--bc-mobile-entry-inset)
				var(--bc-mobile-entry-inset) var(--bc-space-4);
			border: 0;
			border-radius: 999px;
			background: var(--daynight-mobile-surface, var(--bc-white));
			color: var(--bc-ink);
			box-shadow: none;
		}

		.daynight-mobile-hero__search :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.daynight-mobile-hero__search-label {
			display: flex;
			min-width: 0;
			height: 100%;
			flex: 1 1 auto;
			align-items: center;
			border: 0;
			background: transparent;
			color: var(--bc-ink);
			cursor: pointer;
			padding: 0;
			text-align: left;
		}

		.daynight-mobile-hero__search-label span {
			min-width: 0;
			overflow: hidden;
			color: var(--bc-ink);
			font-size: var(--bc-text-search);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-search);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-hero__search-action {
			display: flex;
			width: var(--bc-control-height-standard);
			height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			flex: 0 0 var(--bc-control-height-standard);
			border: 4px solid transparent !important;
			border-radius: 999px;
			background: var(--daynight-mobile-action, var(--bc-accent));
			background-clip: padding-box;
			box-shadow: none !important;
			color: var(--bc-white);
			cursor: pointer;
			padding: 0;
		}

		.daynight-mobile-hero__search-action:focus-visible {
			background-color: var(--daynight-mobile-action-focus, var(--bc-ink));
			color: var(--bc-white);
			outline: 0;
		}

		.daynight-mobile-hero__search-action :global(svg),
		.daynight-mobile-hero__search-action :global(path),
		.daynight-mobile-hero__search-action :global(circle),
		.daynight-mobile-hero__search-action :global(line) {
			color: var(--bc-white);
			stroke: var(--bc-white) !important;
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
			min-height: var(--bc-control-height-standard);
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
			font-size: var(--bc-text-cta);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-cta);
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
			width: 16px;
			height: 16px;
		}

		.daynight-mobile-location-sheet {
			position: fixed;
			inset: 0;
			z-index: 1200;
			display: block;
			visibility: hidden;
			pointer-events: none;
		}

		.daynight-mobile-location-sheet__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(0, 0, 0, 0.34);
			padding: 0;
		}

		.daynight-mobile-location-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			gap: 12px;
			border-radius: 22px 22px 0 0;
			background: var(--bc-bg);
			padding: 10px 16px max(20px, env(safe-area-inset-bottom));
			box-shadow: none;
			color: var(--bc-ink);
			transform: translateY(var(--daynight-mobile-location-drag-y, 0px));
		}

		:global(.daynight-mobile-location-toggle:checked ~ .daynight-mobile-location-sheet) {
			visibility: visible;
			pointer-events: auto;
		}

		.daynight-mobile-location-sheet__handle {
			justify-self: center;
			width: 42px;
			height: 4px;
			border-radius: 999px;
			background: var(--bc-border);
			touch-action: none;
		}

		.daynight-mobile-location-sheet__panel header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
			touch-action: none;
		}

		.daynight-mobile-location-sheet__panel header p,
		.daynight-mobile-location-sheet__panel header h2 {
			margin: 0;
			letter-spacing: 0;
		}

		.daynight-mobile-location-sheet__panel header p {
			color: var(--bc-accent);
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
			text-transform: uppercase;
		}

		.daynight-mobile-location-sheet__panel header h2 {
			color: var(--bc-ink);
			font-size: var(--bc-mobile-section-title);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-section-title-leading);
		}

		.daynight-mobile-location-sheet__panel header button {
			display: flex;
			width: var(--bc-control-height-standard);
			height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			flex: 0 0 var(--bc-control-height-standard);
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			color: var(--bc-ink);
			cursor: pointer;
			padding: 0;
		}

		.daynight-mobile-location-map {
			position: relative;
			min-height: 156px;
			overflow: hidden;
			border-radius: 12px;
			background:
				linear-gradient(135deg, rgb(185 22 28 / 0.16), rgb(5 5 5 / 0.08)), var(--bc-surface);
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
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		/* Homepage mobile search = full-screen overlay. Input pinned top, chips scroll
		   below; the keyboard opens beneath the input and never fights the panel. Appears
		   instantly (no slide). The authored inner markup keeps normal scoped styles. */
		.daynight-home-search-overlay {
			position: fixed;
			inset: 0;
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

		.daynight-home-search-overlay__close {
			display: flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			flex: 0 0 40px;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			color: var(--bc-ink);
			cursor: pointer;
			padding: 0;
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

		/* Lock background scroll while the location sheet is open (the search overlay
		   locks body scroll from script). */
		:global(body:has(.daynight-mobile-location-toggle:checked)) {
			overflow: hidden;
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
			min-height: 46px;
			align-items: center;
			gap: 10px;
			border-radius: 999px;
			background: var(--bc-surface);
			padding: 0 13px;
			color: var(--bc-ink);
		}

		.daynight-home-search-drawer__field input {
			min-width: 0;
			width: 100%;
			height: 44px;
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
			min-height: 44px;
			align-items: center;
			border-radius: 8px;
			background: var(--bc-surface);
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
			background: var(--bc-surface);
			color: var(--bc-ink);
			outline: 0;
		}

		.daynight-home-search-drawer__hint {
			margin: 0;
			border-radius: 12px;
			background: var(--bc-surface);
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
			background: var(--bc-surface);
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
			padding: 26px 0 9px;
			border: 0;
			border-radius: 24px 24px 0 0;
			box-shadow: 0 -1px 0 rgb(255 255 255 / 0.14);
			overflow: hidden;
		}

		.daynight-mobile-home-quick::before {
			position: absolute;
			top: 9px;
			left: 50%;
			width: 38px;
			height: 4px;
			border-radius: var(--bc-radius-pill);
			background: #c3cad2;
			content: '';
			transform: translateX(-50%);
		}

		.daynight-mobile-home-quick__scroller {
			display: flex;
			gap: 8px;
			width: calc(100% + 24px);
			overflow-x: auto;
			padding-right: 24px;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.daynight-mobile-home-quick__scroller::-webkit-scrollbar {
			display: none;
		}

		.daynight-mobile-home-quick__scroller a,
		.daynight-mobile-home-quick__scroller button {
			display: inline-flex;
			min-width: max-content;
			min-height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			gap: 8px;
			flex: 0 0 auto;
			padding: 0 12px;
			border: 0;
			border-radius: 10px;
			background: var(--bc-card-bg);
			box-shadow: none;
			color: var(--bc-ink);
			cursor: pointer;
			font-size: var(--bc-text-filter);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-filter);
			text-decoration: none;
			white-space: nowrap;
		}

		.daynight-mobile-home-quick__scroller .daynight-mobile-home-quick__filter {
			width: var(--bc-control-height-standard);
			min-width: var(--bc-control-height-standard);
			padding: 0;
		}

		.daynight-mobile-home-quick__scroller a:focus-visible,
		.daynight-mobile-home-quick__scroller button:focus-visible {
			background: var(--bc-surface-hover);
			box-shadow: none;
			color: var(--bc-ink);
		}

		.daynight-mobile-home-quick__scroller a:focus-visible,
		.daynight-mobile-home-quick__scroller button:focus-visible {
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
