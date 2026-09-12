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
	import HeroFilterDialog from '../home/HeroFilterDialog.svelte';

	type MobileTabsVariant = 'boxed' | 'underline';

	let {
		hero,
		mobileTabsVariant = 'boxed'
	}: { hero?: HomeFiveHeroData; mobileTabsVariant?: MobileTabsVariant } = $props();

	const mobileShowroomMapHref =
		'https://www.google.com/maps/search/?api=1&query=Promosale Varna%20Plovdiv%20South%20Industrial%20Zone';
	const mobileShowroomPhoneHref = 'tel:+359892020208';
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

	// Desktop buy box — rich popover fields replace the cramped CSS dropdowns.
	// Selection lives here so the model list can cascade off the chosen make(s),
	// and so each field renders hidden inputs that preserve the GET /inventory contract.
	const brandFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'brand'));
	const modelFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'q'));
	const bodyFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'bodyType'));
	const priceFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'maxPrice'));

	let brandSelection = $state<string[]>([]);
	let modelSelection = $state<string[]>([]);
	let bodySelection = $state<string[]>([]);
	let priceSelection = $state<string[]>([]);

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
	const updateModelSelection = (selection: string[]) => {
		modelSelection = pruneModelSelection(selection);
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
	const mobileActionTabs = $derived.by(() => hero?.actions ?? []);
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
	// Price quick-picks for the Buy search overlay (low ranges buyers actually use).
	const overlayPriceOptions = $derived(
		isEnglish
			? [
					{ value: '10000', label: 'Up to 10k' },
					{ value: '20000', label: 'Up to 20k' },
					{ value: '30000', label: 'Up to 30k' },
					{ value: '50000', label: 'Up to 50k' }
				]
			: [
					{ value: '10000', label: 'До 10 000' },
					{ value: '20000', label: 'До 20 000' },
					{ value: '30000', label: 'До 30 000' },
					{ value: '50000', label: 'До 50 000' }
				]
	);

	const quickLinksForMode = (mode: string) => {
		if (mode === 'import') {
			return isEnglish
				? [
						{ href: '/calculator', label: 'Import calculator' },
						{ href: '/services', label: 'Import process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Promosale Varna' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/calculator', label: 'Калкулатор' },
						{ href: '/services', label: 'Процес по внос' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Promosale Varna' },
						{ href: '/inventory', label: 'Налични коли' }
					];
		}

		if (mode === 'sell') {
			return isEnglish
				? [
						{ href: '/sell-your-car', label: 'Valuation form' },
						{ href: '/services', label: 'Selling process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Promosale Varna' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/sell-your-car', label: 'Оценка' },
						{ href: '/services', label: 'Как продаваме' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Promosale Varna' },
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
	const openMobileSearch = () => {
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
		// (it's green from the hero theme-color otherwise) and restore it on close.
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
			? `${isEnglish ? 'All' : 'Всички'} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
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

{#if hero}
	<div class="daynight-mobile-home" data-daynight-search-form={activeMobileAction?.mode ?? 'buy'}>
		<input
			id="daynight-mobile-location-toggle"
			class="daynight-mobile-location-toggle"
			type="checkbox"
			tabindex="-1"
			aria-hidden="true"
		/>
		<section
			class={`daynight-mobile-hero daynight-mobile-hero--${mobileTabsVariant}`}
			aria-label={mobileHeading}
		>
			<div class="container">
				<div class="daynight-mobile-hero__copy">
					<h1>
						{mobileTabsVariant === 'underline'
							? isEnglish
								? 'Find your car.'
								: 'Намери автомобила си.'
							: mobileModeHeading}
					</h1>
				</div>

				<div
					class={`daynight-mobile-hero__search-module daynight-mobile-hero__search-module--${mobileTabsVariant}`}
				>
					<div class="daynight-mobile-hero__box">
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
								aria-controls="daynight-mobile-search-panel"
								aria-expanded={mobileSearchOpen}
								onclick={openMobileSearch}
							>
								<span>{mobileSearchPlaceholder}</span>
							</button>
							<button
								type="button"
								class="daynight-mobile-hero__search-action"
								aria-label={hero.searchSubmitPrefix}
								aria-controls="daynight-mobile-search-panel"
								aria-expanded={mobileSearchOpen}
								onclick={openMobileSearch}
							>
								<Search size={23} strokeWidth={2.25} aria-hidden="true" />
							</button>
						</div>
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
			<label
				for="daynight-mobile-location-toggle"
				class="daynight-mobile-location-sheet__backdrop"
				aria-label={isEnglish ? 'Close location picker' : 'Затвори избор на локация'}
			></label>
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
						<p>{isEnglish ? 'Promosale Varna showroom' : 'Promosale Varna шоурум'}</p>
						<h2 id="daynight-mobile-location-title">
							{isEnglish ? 'Plovdiv, South Industrial Zone' : 'Варна, Индустриална зона - Юг'}
						</h2>
					</div>
					<label for="daynight-mobile-location-toggle" aria-label={isEnglish ? 'Close' : 'Затвори'}>
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					</label>
				</header>
				<div class="daynight-mobile-location-map" aria-hidden="true">
					<span class="daynight-mobile-location-map__road road-a"></span>
					<span class="daynight-mobile-location-map__road road-b"></span>
					<span class="daynight-mobile-location-map__road road-c"></span>
					<span class="daynight-mobile-location-map__pin">
						<MapPin size={24} strokeWidth={2.4} aria-hidden="true" />
					</span>
					<span class="daynight-mobile-location-map__badge">Promosale Varna</span>
				</div>
				<div class="daynight-mobile-location-address">
					<span>{isEnglish ? 'Showroom address' : 'Адрес на шоурума'}</span>
					<strong
						>{isEnglish
							? 'Plovdiv, South Industrial Zone'
							: 'Варна, Южна Индустриална зона'}</strong
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
								<section class="daynight-home-search-drawer__group">
									<p>{isEnglish ? 'Price' : 'Цена'}</p>
									<div>
										{#each overlayPriceOptions as option (option.value)}
											<a
												href={resolve(
													inventoryFilterHref('maxPrice', option.value) as '/inventory'
												)}
											>
												{option.label}
											</a>
										{/each}
									</div>
								</section>
							{:else}
								<p class="daynight-home-search-drawer__hint">{activeMobileAction.helper}</p>
								<section class="daynight-home-search-drawer__group">
									<p>{isEnglish ? 'Quick links' : 'Бързи връзки'}</p>
									<div>
										{#each quickLinksForMode(activeMobileAction.mode) as link (link.href)}
											<a href={resolve(link.href as '/')}>{link.label}</a>
										{/each}
									</div>
								</section>
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
							aria-controls="daynight-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
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
				<h1 class="daynight-hero-accessible-title">{hero.heading}</h1>
				<div class="sw-single-thumb swiper">
					<div class="swiper-wrapper">
						{#each hero.textSlides as slide, index (slide.id)}
							<div class={['swiper-slide', index === 0 && 'swiper-slide-active']}>
								<p class="search-cars__title effect-item effect-up text-center delay-3">
									{slide.heading}
								</p>
								<p class="h7 effect-item effect-up text-center text-white delay-4">
									{slide.subtitle}
								</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="flat-tabs mb-16">
					<div class="overflow-x-auto">
						<ul class="menu-tab menu-tab-style1 margin-auto text-white">
							{#each hero.actions as tab (tab.mode)}
								<li class={tab.mode === activeMode ? 'active' : ''}>
									<a
										href={resolve(tab.tabHref)}
										aria-current={tab.mode === activeMode ? 'page' : undefined}
									>
										<span class="font-weight-600 text-white">{tab.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>

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
								{isEnglish}
							/>
						{/if}
						{#if modelFilter}
							<HeroFilterDialog
								select={modelFilter}
								options={modelOptions}
								bind:selected={() => modelSelection, updateModelSelection}
								mode="multi"
								variant="list"
								searchable
								{isEnglish}
								emptyHint={isEnglish ? 'No models for this make' : 'Няма модели за тази марка'}
							/>
						{/if}
						{#if bodyFilter}
							<HeroFilterDialog
								select={bodyFilter}
								bind:selected={bodySelection}
								mode="multi"
								variant="list"
								{isEnglish}
							/>
						{/if}
						{#if priceFilter}
							<HeroFilterDialog
								select={priceFilter}
								bind:selected={priceSelection}
								mode="single"
								variant="list"
								{isEnglish}
							/>
						{/if}
						<button
							type="submit"
							class="search-cars__search md-w-full flex items-center justify-center gap-8"
						>
							<img src="/assets/icons/search.svg" alt="search" />
							{activeSubmitLabel}
						</button>
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
		</section>
	</form>
{/if}

<style>
	:global(.page-title.page-title-style-4) {
		height: auto !important;
		min-height: 0 !important;
		align-items: center;
		padding-top: 24px !important;
		padding-bottom: 24px !important;
		background:
			radial-gradient(ellipse at 50% 111%, rgb(227 6 47 / 0.52) 0 18%, transparent 53%),
			radial-gradient(circle at 50% 24%, rgb(255 255 255 / 0.13) 0 12%, transparent 41%),
			linear-gradient(115deg, #1c1c1c 0%, #1c1c1c 48%, #1c1c1c 100%);
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
		color: #ffffff !important;
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

	@media (min-width: 768px) {
		:global(.page-title.page-title-style-4 .flat-tabs) {
			margin-top: clamp(40px, 4.4vw, 60px) !important;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters) {
			padding: 15px 16px;
			border-color: rgba(255, 255, 255, 0.14);
			background: rgba(255, 255, 255, 0.14);
			box-shadow: 0 20px 44px rgba(0, 0, 0, 0.18);
			backdrop-filter: blur(10px);
		}
	}

	@media (max-width: 1199px) {
		.daynight-hero-car {
			width: min(31vw, 380px);
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
		font-size: clamp(44px, 4vw, 64px);
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
		margin-bottom: 14px;
		text-shadow: 0 4px 22px rgba(0, 0, 0, 0.4);
	}

	.daynight-hero-accessible-title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
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
		color: #5f5f5f;
		font-size: 12px;
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 15px;
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
		background: #ffffff;
		padding: 9px 18px;
	}

	.search-cars__intent-field span {
		color: #5f5f5f;
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
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		outline: 0;
		padding: 0 !important;
	}

	.search-cars__intent-field input::placeholder {
		color: #858585;
		opacity: 1;
	}

	.search-cars__search--intent {
		min-width: 210px;
	}

	.search-cars__search {
		height: 66px;
	}

	.search-cars__search {
		width: 272px;
		padding: 13px 16px;
		font-size: 16px;
		font-weight: 600;
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
			--daynight-mobile-hero-top: #ffffff;
			--daynight-mobile-hero-bg: #e3062f;
			--daynight-mobile-hero-bottom: #e3062f;
			--daynight-mobile-hero-fill: #e3062f;
			--daynight-mobile-ink: #1c1c1c;
			--daynight-mobile-ink-muted: rgba(28, 28, 28, 0.82);
			--daynight-mobile-ink-strong: #1c1c1c;
			--daynight-mobile-cta: rgba(251, 252, 247, 0.32);
			--daynight-mobile-cta-ink: #1c1c1c;
			--daynight-mobile-action: #1c1c1c;
			--daynight-mobile-action-focus: #1c1c1c;
			--daynight-mobile-surface: #fbfcf7;
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
			background: var(--daynight-mobile-hero-fill, var(--daynight-mobile-hero-bg, #e3062f));
			color: var(--daynight-mobile-ink, #ffffff);
		}

		.daynight-mobile-location-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.daynight-mobile-hero {
			padding: 10px 0 13px;
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

		/* Underline variant: no visible headline — the tab row leads the hero. The
		   <h1> stays in the DOM (sr-only, via the base rule) for SEO/a11y. The tabs
		   get a little top breathing room since nothing sits above them now. */
		.daynight-mobile-hero--underline .daynight-mobile-hero__search-module {
			margin-top: 6px;
		}

		.daynight-mobile-hero__search-module {
			display: grid;
			gap: 10px;
			margin-bottom: 9px;
			padding: 0;
		}

		/* home1 variant: segmented tabs + search fused into one white card. The
		   wrapper is contents by default; here it becomes the boxed surface. */
		.daynight-mobile-hero__box {
			display: contents;
		}

		.daynight-mobile-hero__search-module--boxed .daynight-mobile-hero__box {
			display: grid;
			gap: 9px;
			border-radius: 16px;
			background: var(--daynight-mobile-surface, #ffffff);
			padding: 9px;
			box-shadow: 0 10px 22px rgba(32, 53, 15, 0.16);
		}

		/* Track sits on white now — recolour from the on-hero translucent style. */
		.daynight-mobile-hero__search-module--boxed .daynight-mobile-hero__tabs {
			background: #eef1ea;
			padding: 3px;
		}

		.daynight-mobile-hero__search-module--boxed .daynight-mobile-hero__tab {
			color: rgba(28, 28, 28, 0.62);
		}

		.daynight-mobile-hero__search-module--boxed .daynight-mobile-hero__tab.active {
			background: #1c1c1c;
			box-shadow: none;
			color: #ffffff;
		}

		/* Search row is inside the white card — drop the floating-pill look and use
		   a light inset field so it reads as part of the box. */
		.daynight-mobile-hero__search-module--boxed .daynight-mobile-hero__search {
			height: 52px;
			padding: 5px 5px 5px 16px;
			border-radius: 12px;
			background: #f4f6f0;
			box-shadow: none;
		}

		/* Underline tabs (SPARTAK-style): full-width, each label takes an equal share
		   and the active indicator spans its whole tab, riding a faint full-width
		   baseline. Inactive labels muted, active bright/bold. 44px tap targets. */
		/* Full-width tabs: each label takes an equal share; the active tab's indicator
		   spans its whole segment (like the reference), riding a thin faint track. */
		.daynight-mobile-hero__search-module--underline .daynight-mobile-hero__tabs {
			position: relative;
			display: flex;
			align-items: stretch;
			gap: 0;
			min-height: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
			margin-bottom: 2px;
		}

		/* thin faint track line under the whole row */
		.daynight-mobile-hero__search-module--underline .daynight-mobile-hero__tabs::after {
			content: '';
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			background: rgba(255, 255, 255, 0.22);
		}

		.daynight-mobile-hero__search-module--underline .daynight-mobile-hero__tabs button {
			position: relative;
			flex: 1 1 0;
			width: auto;
			min-height: 42px;
			align-items: center;
			justify-content: center;
			white-space: nowrap;
			border-radius: 0;
			background: transparent;
			padding: 0 4px 7px;
			color: rgba(255, 255, 255, 0.62);
			font-size: 19px;
			font-weight: 700;
			letter-spacing: -0.1px;
			line-height: 24px;
			transition: color 0.16s ease;
		}

		.daynight-mobile-hero__search-module--underline .daynight-mobile-hero__tab.active {
			background: transparent;
			box-shadow: none;
			color: #ffffff;
			font-weight: 800;
		}

		/* indicator spans the whole active tab segment */
		.daynight-mobile-hero__search-module--underline .daynight-mobile-hero__tab.active::after {
			content: '';
			position: absolute;
			right: 4px;
			bottom: -1px;
			left: 4px;
			height: 3px;
			border-radius: 999px;
			background: #ffffff;
			box-shadow: 0 1px 7px rgba(255, 255, 255, 0.4);
		}

		/* Showroom intent modes = boxed segmented control (best mobile pattern for a
		   small mutually-exclusive set): active segment is filled white, the rest are
		   transparent. Instant — no sliding/animation. */
		.daynight-mobile-hero__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 3px;
			min-height: 0;
			border: 0;
			border-radius: 11px;
			background: rgba(28, 28, 28, 0.1);
			box-shadow: none;
			padding: 3px;
		}

		.daynight-mobile-hero__tabs button {
			display: flex;
			min-height: 34px;
			width: 100%;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 8px;
			background: transparent;
			color: rgba(28, 28, 28, 0.66);
			font-size: 13px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
		}

		.daynight-mobile-hero__tab.active {
			background: #ffffff;
			box-shadow: 0 1px 2px rgba(28, 28, 28, 0.18);
			color: #1c1c1c;
			font-weight: 800;
		}

		.daynight-mobile-hero__tab:focus-visible {
			outline: 2px solid rgba(28, 28, 28, 0.64);
			outline-offset: 3px;
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
			height: 58px;
			align-items: center;
			gap: 10px;
			padding: 6px 6px 6px 20px;
			border: 0;
			border-radius: 999px;
			background: var(--daynight-mobile-surface, #ffffff);
			color: #1c1c1c;
			box-shadow: 0 8px 16px rgba(32, 53, 15, 0.14);
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
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
			text-align: left;
		}

		.daynight-mobile-hero__search-label span {
			min-width: 0;
			overflow: hidden;
			color: #1c1c1c;
			font-size: 16px;
			font-weight: 400;
			line-height: 22px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-hero__search-action {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0 !important;
			border-radius: 999px;
			background: var(--daynight-mobile-action, #b9161c);
			box-shadow: none !important;
			color: #ffffff;
			cursor: pointer;
			padding: 0;
		}

		.daynight-mobile-hero__search-action:focus-visible {
			background: var(--daynight-mobile-action-focus, #1c1c1c);
			color: #ffffff;
			outline: 0;
		}

		.daynight-mobile-hero__search-action :global(svg),
		.daynight-mobile-hero__search-action :global(path),
		.daynight-mobile-hero__search-action :global(circle),
		.daynight-mobile-hero__search-action :global(line) {
			color: #ffffff;
			stroke: #ffffff !important;
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
			width: auto;
			max-width: 100%;
			min-height: 38px;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.16);
			border: 1px solid rgba(255, 255, 255, 0.55);
			box-shadow: none;
			padding: 0 20px;
			color: #1c1c1c !important;
			font-size: 13px;
			font-weight: 700;
			line-height: 16px;
			text-decoration: none;
		}

		.daynight-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			color: var(--daynight-mobile-cta-ink, #ffffff);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-hero__all:focus-visible {
			background: #ffffff;
			color: #1c1c1c !important;
			outline: 2px solid rgba(28, 28, 28, 0.72);
			outline-offset: 2px;
		}

		.daynight-mobile-hero__all:focus-visible span {
			color: var(--daynight-mobile-cta-ink, #ffffff);
		}

		.daynight-mobile-hero__all :global(svg),
		.daynight-mobile-hero__all :global(path),
		.daynight-mobile-hero__all :global(line),
		.daynight-mobile-hero__all :global(polyline) {
			flex: 0 0 auto;
			color: var(--daynight-mobile-cta-ink, #ffffff) !important;
			stroke: var(--daynight-mobile-cta-ink, #ffffff) !important;
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
			box-shadow: 0 -18px 34px rgba(28, 28, 28, 0.18);
			color: #111111;
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
			color: #e3062f;
			font-size: 12px;
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.daynight-mobile-location-sheet__panel header h2 {
			color: #111111;
			font-size: 20px;
			font-weight: 700;
			line-height: 26px;
		}

		.daynight-mobile-location-sheet__panel header label {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			color: #111111;
			cursor: pointer;
			padding: 0;
		}

		.daynight-mobile-location-map {
			position: relative;
			min-height: 156px;
			overflow: hidden;
			border-radius: 12px;
			background:
				linear-gradient(135deg, rgba(254, 226, 226, 0.68), rgba(143, 197, 29, 0.2)), #fee2e2;
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
			background: #111111;
			color: #fee2e2;
			transform: translate(-50%, -50%);
			box-shadow: 0 12px 26px rgba(17, 17, 17, 0.22);
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
			background: #ffffff;
			padding: 7px 11px;
			color: #111111;
			font-size: 12px;
			font-weight: 700;
			line-height: 14px;
			box-shadow: 0 8px 20px rgba(28, 28, 28, 0.12);
		}

		.daynight-mobile-location-address {
			display: grid;
			gap: 4px;
			border-radius: 10px;
			background: var(--bc-surface);
			padding: 12px;
		}

		.daynight-mobile-location-address span {
			color: #6b7280;
			font-size: 12px;
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.daynight-mobile-location-address strong {
			color: #111111;
			font-size: 16px;
			font-weight: 700;
			line-height: 21px;
		}

		.daynight-mobile-location-address p {
			margin: 0;
			color: #4b5563;
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
			background: #111111;
			padding: 0 12px;
			color: #ffffff;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
		}

		.daynight-mobile-location-actions a:first-child {
			background: #fee2e2;
			color: #111111;
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
			color: #111111;
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
			color: #111111;
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
			color: #111111;
			font-size: 19px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 24px;
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
			color: #111111;
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
			color: #111111;
			/* >=16px stops iOS Safari from auto-zooming (and shifting the sheet) on focus. */
			font-size: 16px;
			font-weight: 700;
			line-height: 22px;
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
			color: #728093;
			font-size: 12px;
			font-weight: 700;
			line-height: 14px;
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
			color: #111111;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
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
			font-size: 12px;
			text-align: center;
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
			background: #fee2e2;
			color: #111111;
			outline: 0;
		}

		.daynight-home-search-drawer__hint {
			margin: 0;
			border-radius: 12px;
			background: var(--bc-surface);
			padding: 12px 13px;
			color: #4b5563;
			font-size: 14px;
			font-weight: 700;
			line-height: 20px;
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
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 800;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
			white-space: nowrap;
		}

		.daynight-home-search-drawer__actions button {
			background: #e3062f;
			color: #1c1c1c;
			cursor: pointer;
		}

		.daynight-mobile-home-quick {
			background: var(--bc-bg);
			margin: 0;
			padding: 8px 0 9px;
			border: 0;
			box-shadow: none;
			overflow: hidden;
		}

		.daynight-mobile-home-quick__scroller {
			display: flex;
			gap: 8px;
			overflow-x: auto;
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
			min-height: 42px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			flex: 0 0 auto;
			padding: 0 12px;
			border: 0;
			border-radius: 10px;
			background: #fee2e2;
			box-shadow: none;
			color: #1c1c1c;
			cursor: pointer;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			text-decoration: none;
			white-space: nowrap;
		}

		.daynight-mobile-home-quick__scroller .daynight-mobile-home-quick__filter {
			width: 44px;
			min-width: 44px;
			padding: 0;
		}

		.daynight-mobile-home-quick__scroller a:focus-visible,
		.daynight-mobile-home-quick__scroller button:focus-visible {
			background: #dfe9c7;
			box-shadow: none;
			color: #1c1c1c;
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
			background: var(--daynight-mobile-hero-top, #b9161c) !important;
			box-shadow: none !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 56px !important;
			min-height: 56px !important;
			background: var(--daynight-mobile-hero-top, #b9161c) !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: var(--daynight-mobile-hero-top, #b9161c) !important;
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

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 204px;
			height: 36px;
			align-items: center;
			background: none;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			width: 196px !important;
			max-width: 196px;
			height: auto;
			opacity: 1;
			filter: none !important;
		}
	}
</style>
