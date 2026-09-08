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
	import HeroFilterPopover from './HeroFilterPopover.svelte';

	let { hero }: { hero?: HomeFiveHeroData } = $props();

	const mobileShowroomMapHref =
		'https://www.google.com/maps/search/?api=1&query=Eliq%20Auto%20Pazardzhik%20Ul.%20Svoboda';
	const mobileShowroomPhoneHref = 'tel:+359896781662';
	const inventoryFilterHref = (name: string, value: string) =>
		`/inventory?${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	const isEnglish = $derived(hero?.searchSubmitPrefix === 'Show');
	const activeMode = $derived(hero?.activeMode ?? 'buy');
	const activeAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === activeMode) ?? hero?.actions[0]
	);
	const activeActionHref = $derived(activeAction?.actionHref ?? '/inventory');
	let brandSelection = $state<string[]>([]);
	let modelSelection = $state<string[]>([]);
	let bodySelection = $state<string[]>([]);
	let priceSelection = $state<string[]>([]);
	const activeSubmitLabel = $derived(
		activeAction?.mode === 'buy' && hero
			? brandSelection.length ||
				modelSelection.length ||
				bodySelection.length ||
				priceSelection.length
				? isEnglish
					? 'Show vehicles'
					: 'Покажи автомобили'
				: `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
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

	// Desktop buy box — modal selectors give long, searchable option sets enough room.
	// Selection lives here so the model list can cascade off the chosen make(s),
	// and so each field renders hidden inputs that preserve the GET /inventory contract.
	const brandFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'brand'));
	const modelFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'q'));
	const bodyFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'bodyType'));
	const priceFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'maxPrice'));

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
	// Selling remains available in the persistent mobile bottom navigation. Keep
	// this compact search control focused on the two journeys that share it.
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
						{ href: '/contact', label: 'Ask Eliq Auto' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/calculator', label: 'Калкулатор' },
						{ href: '/services', label: 'Процес по внос' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Eliq Auto' },
						{ href: '/inventory', label: 'Налични коли' }
					];
		}

		if (mode === 'sell') {
			return isEnglish
				? [
						{ href: '/sell-your-car', label: 'Valuation form' },
						{ href: '/services', label: 'Selling process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Eliq Auto' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/sell-your-car', label: 'Оценка' },
						{ href: '/services', label: 'Как продаваме' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Eliq Auto' },
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
	let mobileSearchReturnFocus: HTMLElement | null = null;
	let mobileSearchOverlay = $state<HTMLDivElement | null>(null);
	let mobileSearchInput = $state<HTMLInputElement | null>(null);
	const openMobileSearch = (event?: MouseEvent) => {
		if (event?.currentTarget instanceof HTMLElement) {
			mobileSearchReturnFocus = event.currentTarget;
		}
		mobileSearchOpen = true;
	};
	const closeMobileSearch = () => {
		mobileSearchOpen = false;
	};
	const mobileOpenSearchLabel = $derived(
		isEnglish ? 'Open vehicle search' : 'Отвори търсене на автомобили'
	);
	// While the overlay is open: focus the input (ready to type), lock background scroll,
	// and close on Escape. Cleanup restores everything when it closes.
	$effect(() => {
		if (!mobileSearchOpen) return;
		const { body } = document;
		const prevOverflow = body.style.overflow;
		body.style.overflow = 'hidden';
		// The overlay is white, so recolour the iOS status-bar/browser chrome to match
		// (it follows the red hero theme-color otherwise) and restore it on close.
		const themeMeta = document.querySelector('meta[name="theme-color"]');
		const prevTheme = themeMeta?.getAttribute('content') ?? null;
		themeMeta?.setAttribute('content', '#ffffff');
		tick().then(() => mobileSearchInput?.focus());
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeMobileSearch();
				return;
			}

			if (event.key !== 'Tab' || !mobileSearchOverlay) return;

			const focusables = Array.from(
				mobileSearchOverlay.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)
			).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

			if (!focusables.length) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => {
			body.style.overflow = prevOverflow;
			if (themeMeta && prevTheme !== null) themeMeta.setAttribute('content', prevTheme);
			window.removeEventListener('keydown', onKey);
			mobileSearchReturnFocus?.focus();
			mobileSearchReturnFocus = null;
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
			'eliqauto-mobile-location-toggle'
		) as HTMLInputElement | null;
		if (toggle) toggle.checked = false;
	};
	const canStartLocationDrag = (event: PointerEvent) => {
		const target = event.target as HTMLElement | null;
		if (!target) return false;
		if (target.closest('a, button, input, label, select, textarea')) return false;
		return Boolean(
			target.closest(
				'.eliqauto-mobile-location-sheet__handle, .eliqauto-mobile-location-sheet__panel header'
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
		tab.mode === 'buy'
			? isEnglish
				? 'Show all vehicles'
				: 'Покажи всички автомобили'
			: tab.submitLabel;
	const drawerSubmitAriaLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' ? drawerSubmitLabel(tab) : tab.submitLabel;
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
	<div class="eliqauto-mobile-home" data-eliqauto-search-form={activeMobileAction?.mode ?? 'buy'}>
		<input
			id="eliqauto-mobile-location-toggle"
			class="eliqauto-mobile-location-toggle"
			type="checkbox"
			tabindex="-1"
			aria-hidden="true"
		/>
		<section class="eliqauto-mobile-hero" aria-label={mobileHeading}>
			<div class="container">
				<div class="eliqauto-mobile-hero__copy">
					<h1>{mobileModeHeading}</h1>
				</div>

				<div class="eliqauto-mobile-hero__search-module">
					<div
						class="eliqauto-mobile-hero__tabs"
						style:--eliqauto-tab-index={mobileTabIndex}
						aria-label={hero.heading}
						role="tablist"
					>
						{#each mobileActionTabs as tab (tab.mode)}
							<button
								type="button"
								role="tab"
								class={`eliqauto-mobile-hero__tab eliqauto-mobile-hero__tab--${tab.mode} ${tab.mode === mobileMode ? 'active' : ''}`}
								aria-selected={tab.mode === mobileMode}
								onclick={() => selectMobileMode(tab.mode)}
							>
								{tab.label}
							</button>
						{/each}
					</div>

					<div class="eliqauto-mobile-hero__search">
						<button
							type="button"
							class="eliqauto-mobile-hero__search-label"
							aria-haspopup="dialog"
							aria-controls="eliqauto-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
							onclick={openMobileSearch}
						>
							<span>{mobileSearchPlaceholder}</span>
						</button>
						<button
							type="button"
							class="eliqauto-mobile-hero__search-action"
							aria-label={mobileOpenSearchLabel}
							aria-controls="eliqauto-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
							onclick={openMobileSearch}
						>
							<Search size={23} strokeWidth={2.25} aria-hidden="true" />
						</button>
					</div>
				</div>

				<div class="eliqauto-mobile-hero__all-row">
					<a
						class="eliqauto-mobile-hero__all"
						href={resolve((activeMobileAction?.secondaryHref ?? '/inventory') as '/')}
					>
						<span>{activeMobileAction ? modeAllText(activeMobileAction) : mobileAllLabel}</span>
						<ArrowRight size={16} strokeWidth={2.3} aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>

		<div class="eliqauto-mobile-location-sheet">
			<label
				for="eliqauto-mobile-location-toggle"
				class="eliqauto-mobile-location-sheet__backdrop"
				aria-label={isEnglish ? 'Close location picker' : 'Затвори избор на локация'}
			></label>
			<div
				id="eliqauto-mobile-location-panel"
				class="eliqauto-mobile-location-sheet__panel"
				style={`--eliqauto-mobile-location-drag-y: ${mobileLocationDragOffset}px`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="eliqauto-mobile-location-title"
				tabindex="-1"
				onpointerdown={startLocationDrag}
				onpointermove={moveLocationDrag}
				onpointerup={finishLocationDrag}
				onpointercancel={finishLocationDrag}
			>
				<span class="eliqauto-mobile-location-sheet__handle"></span>
				<header>
					<div>
						<p>{isEnglish ? 'Eliq Auto showroom' : 'Шоурум на Eliq Auto'}</p>
						<h2 id="eliqauto-mobile-location-title">
							{isEnglish ? 'Pazardzhik, Stavropol area' : 'Пазарджик, кв. Ставропол'}
						</h2>
					</div>
					<label for="eliqauto-mobile-location-toggle" aria-label={isEnglish ? 'Close' : 'Затвори'}>
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					</label>
				</header>
				<div class="eliqauto-mobile-location-map" aria-hidden="true">
					<span class="eliqauto-mobile-location-map__road road-a"></span>
					<span class="eliqauto-mobile-location-map__road road-b"></span>
					<span class="eliqauto-mobile-location-map__road road-c"></span>
					<span class="eliqauto-mobile-location-map__pin">
						<MapPin size={24} strokeWidth={2.4} aria-hidden="true" />
					</span>
					<span class="eliqauto-mobile-location-map__badge">Eliq Auto</span>
				</div>
				<div class="eliqauto-mobile-location-address">
					<span>{isEnglish ? 'Showroom address' : 'Адрес на шоурума'}</span>
					<strong>{isEnglish ? 'Pazardzhik, Ul. Svoboda' : 'Пазарджик, ул. Свобода'}</strong>
					<p>
						{isEnglish
							? 'Vehicle viewings are by appointment. Call before visiting.'
							: 'Огледите са след уговорка. Обади се преди посещение.'}
					</p>
				</div>
				<div class="eliqauto-mobile-location-actions">
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
				id="eliqauto-mobile-search-panel"
				bind:this={mobileSearchOverlay}
				class="eliqauto-home-search-overlay bc-drawer bc-drawer--{activeMobileAction.mode}"
				role="dialog"
				aria-modal="true"
				aria-label={activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}
			>
				<header class="eliqauto-home-search-overlay__bar">
					<span class="eliqauto-home-search-drawer__title"
						>{activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}</span
					>
					<button
						type="button"
						class="eliqauto-home-search-overlay__close"
						aria-label={mobileSearchDrawerClose}
						onclick={closeMobileSearch}
					>
						<X size={20} strokeWidth={2.4} aria-hidden="true" />
					</button>
				</header>
				<form
					class="eliqauto-home-search-drawer__form"
					action={resolve(activeMobileAction.actionHref)}
					method="get"
				>
					<div class="eliqauto-home-search-drawer__field">
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
					<div class="eliqauto-home-search-overlay__scroll">
						<div class="eliqauto-home-search-drawer__body">
							{#if activeMobileAction.mode === 'buy'}
								{#each hero.primaryFilters.slice(0, 3) as select (select.id)}
									<section
										class={`eliqauto-home-search-drawer__group ${select.name === 'brand' ? 'eliqauto-home-search-drawer__group--logos' : ''}`}
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
														<span class="eliqauto-mobile-brand-chip__logo">
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
								<section class="eliqauto-home-search-drawer__group">
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
								<p class="eliqauto-home-search-drawer__hint">{activeMobileAction.helper}</p>
							{/if}
						</div>
					</div>
					<div class="eliqauto-home-search-drawer__actions">
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
		<section class="eliqauto-mobile-home-quick" aria-label={hero.heading}>
			<div class="container">
				<nav class="eliqauto-mobile-home-quick__scroller bc-quick bc-quick--{mobileMode}">
					{#if mobileMode === 'buy'}
						<button
							type="button"
							class="eliqauto-mobile-home-quick__filter"
							aria-haspopup="dialog"
							aria-controls="eliqauto-mobile-search-panel"
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
		class="eliqauto-desktop-hero"
		action={resolve(activeActionHref)}
		method="get"
		data-eliqauto-search-form={activeAction?.mode ?? 'buy'}
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

			<div class="eliqauto-hero-cars" aria-hidden="true">
				<img
					class="eliqauto-hero-car eliqauto-hero-car--left"
					src="/assets/eliqauto/hero/home-hero-runway-car-black-v1.webp"
					alt=""
					width="1600"
					height="900"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
				<img
					class="eliqauto-hero-car eliqauto-hero-car--right"
					src="/assets/eliqauto/hero/home-hero-runway-car-white-v1.webp"
					alt=""
					width="1600"
					height="900"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</div>

			<!-- Search Cars Section -->
			<div class="search-cars thumb effect-zoom-item container">
				<h1 class="eliqauto-hero-accessible-title">{hero.heading}</h1>
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
							<HeroFilterPopover
								select={brandFilter}
								bind:selected={() => brandSelection, updateBrandSelection}
								mode="multi"
								variant="grid"
								searchable
								{isEnglish}
							/>
						{/if}
						{#if modelFilter}
							<HeroFilterPopover
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
							<HeroFilterPopover
								select={bodyFilter}
								bind:selected={bodySelection}
								mode="multi"
								variant="list"
								{isEnglish}
							/>
						{/if}
						{#if priceFilter}
							<HeroFilterPopover
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

				{#if isInventoryMode}
					<!-- Advanced Filters Panel -->
					<div class="search-cars__advanced" id="advancedFilters">
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
				{/if}
			</div>
		</section>
	</form>
{/if}

<style>
	:global(.page-title.page-title-style-4) {
		height: auto;
		min-height: 0;
		align-items: center;
		padding-top: 24px;
		padding-bottom: 24px;
		background: #18181b;
		z-index: 20;
	}

	:global(.page-title.page-title-style-4::before) {
		display: none;
	}

	/* Let the hero collapse to its real content height (the template swiper
	   otherwise stretches it ~180px taller than the search module needs). */
	:global(.page-title.page-title-style-4 .search-cars) {
		height: auto;
		min-height: 0;
		position: relative;
		z-index: 7;
	}

	.eliqauto-hero-cars {
		position: absolute;
		inset: 0;
		z-index: 4;
		overflow: hidden;
		pointer-events: none;
	}

	.eliqauto-hero-cars::before {
		position: absolute;
		right: 4%;
		bottom: 46px;
		left: 4%;
		height: 96px;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgb(0 0 0 / 0.32), transparent 68%);
		content: '';
		filter: blur(8px);
		opacity: 0.82;
	}

	.eliqauto-hero-car {
		position: absolute;
		top: 41%;
		width: clamp(280px, 31vw, 410px);
		height: auto;
		max-width: none;
		user-select: none;
		filter: drop-shadow(0 24px 22px rgb(0 0 0 / 0.36));
		opacity: 0.9;
		transform: translateY(-50%);
	}

	.eliqauto-hero-car--left {
		left: clamp(30px, 5vw, 76px);
		transform: translateY(-50%) scaleX(-1);
	}

	.eliqauto-hero-car--right {
		right: clamp(26px, 4.4vw, 70px);
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg::after) {
		display: none;
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg) {
		background: none;
		background-position: center bottom;
	}

	:global(.page-title.page-title-style-4 .search-cars__title),
	:global(.page-title.page-title-style-4 .search-cars .h7) {
		color: #ffffff;
		text-shadow: 0 2px 12px rgb(0 0 0 / 0.34);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 .font-weight-600) {
		color: #ffffff;
		font-size: 17px;
		font-weight: var(--bc-weight-semibold);
		letter-spacing: 0;
		line-height: 20px;
		text-shadow: none;
	}

	.eliqauto-mobile-home,
	.eliqauto-mobile-home-quick {
		display: none;
	}

	:global(.page-title.page-title-style-4 .search-cars) {
		padding-top: 4px;
	}

	@media (min-width: 768px) {
		:global(.page-title.page-title-style-4) {
			padding-bottom: 12px;
		}

		:global(.page-title.page-title-style-4 .sw-single-thumb) {
			height: 172px;
		}

		:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-wrapper),
		:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide) {
			height: 100%;
		}

		:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide) {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		:global(.page-title.page-title-style-4 .flat-tabs) {
			position: relative;
			z-index: 13;
			margin-top: 10px;
			margin-bottom: -1px;
		}

		:global(.page-title.page-title-style-4 .flat-tabs > .overflow-x-auto) {
			width: 100%;
			margin: 0;
			overflow: visible;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1) {
			display: grid;
			width: max-content;
			margin: 0 auto;
			grid-template-columns: repeat(3, 130px);
			gap: 0;
			padding: 0;
			border: 1px solid rgba(255, 255, 255, 0.18);
			border-bottom: 0;
			border-radius: 14px 14px 0 0;
			background: rgba(255, 255, 255, 0.1);
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
			overflow: hidden;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li) {
			min-width: 0;
			margin: 0;
			padding: 0;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li + li) {
			border-left: 1px solid rgba(255, 255, 255, 0.13);
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li::before) {
			display: none;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 a) {
			position: relative;
			display: flex;
			min-height: 52px;
			align-items: center;
			justify-content: center;
			padding: 0 16px;
			border-radius: 0;
			isolation: isolate;
			transition: background-color 0.16s ease;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 a::before) {
			position: absolute;
			inset: 3px;
			border: 2px solid transparent;
			border-radius: 9px 9px 2px 2px;
			content: '';
			pointer-events: none;
			transition: border-color 0.16s ease;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 a .font-weight-600) {
			font-size: 17px;
			font-weight: var(--bc-weight-semibold);
			line-height: var(--bc-leading-control);
			transition: color 0.16s ease;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li:not(.active) .font-weight-600) {
			color: rgba(255, 255, 255, 0.78);
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li.active a) {
			background: #a51717;
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li.active .font-weight-600) {
			font-weight: var(--bc-weight-semibold);
		}

		@media (hover: hover) and (pointer: fine) {
			:global(.page-title.page-title-style-4 .menu-tab-style1 li:not(.active) a:hover) {
				background: rgba(255, 255, 255, 0.12);
			}

			:global(
				.page-title.page-title-style-4 .menu-tab-style1 li:not(.active) a:hover .font-weight-600
			) {
				color: #ffffff;
			}

			:global(.page-title.page-title-style-4 .menu-tab-style1 li.active a:hover) {
				background: #b51c1c;
			}
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li:not(.active) a:active) {
			background: rgba(255, 255, 255, 0.16);
		}

		:global(.page-title.page-title-style-4 .menu-tab-style1 li.active a:active) {
			background: #941515;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters) {
			position: relative;
			z-index: 12;
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(220px, 272px);
			gap: 12px;
			padding: 15px 16px;
			border-color: rgba(255, 255, 255, 0.14);
			border-radius: 14px;
			background: rgba(255, 255, 255, 0.14);
			box-shadow: 0 20px 44px rgba(0, 0, 0, 0.18);
			overflow: visible;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .hfp) {
			min-width: 0;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__search) {
			width: 100%;
			min-width: 0;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__intent-field) {
			grid-column: 1 / span 4;
			min-width: 0;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__search--intent) {
			grid-column: 5;
		}
	}

	@media (max-width: 1199px) {
		.eliqauto-hero-car {
			top: 50%;
			width: clamp(200px, 27vw, 300px);
			opacity: 0.64;
		}

		.eliqauto-hero-car--left {
			left: clamp(12px, 2.5vw, 28px);
		}

		.eliqauto-hero-car--right {
			right: clamp(12px, 2.5vw, 28px);
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		:global(.page-title.page-title-style-4 .sw-single-thumb) {
			height: 148px;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__search) {
			grid-column: 2 / span 2;
			justify-self: center;
			width: min(272px, 100%);
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__intent-field) {
			grid-column: 1 / -1;
		}

		:global(.page-title.page-title-style-4 .search-cars__filters > .search-cars__search--intent) {
			grid-column: 2 / span 2;
		}
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb) {
		overflow: hidden;
		width: min(760px, 100%);
		margin-right: auto;
		margin-left: auto;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide) {
		opacity: 0;
		pointer-events: none;
		visibility: hidden;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide-active) {
		opacity: 1;
		pointer-events: auto;
		visibility: visible;
	}

	.search-cars__title {
		font-family: var(--bc-font-heading);
		font-size: clamp(58px, 4.45vw, 68px);
		font-weight: 580;
		letter-spacing: -0.025em;
		line-height: 1.04;
		margin-bottom: 14px;
		text-shadow: 0 4px 22px rgba(0, 0, 0, 0.4);
	}

	.search-cars .swiper-slide > .h7 {
		font-size: clamp(18px, 1.25vw, 19px);
		font-weight: var(--bc-weight-medium);
		line-height: 1.4;
	}

	.eliqauto-hero-accessible-title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.search-cars p:not(.search-cars__title) {
		max-width: 760px;
		margin-right: auto;
		margin-left: auto;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible) {
		outline: 0;
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 li:not(.active) a:focus-visible) {
		background: rgba(255, 255, 255, 0.12);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 li.active a:focus-visible) {
		background: #a51717;
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible::before) {
		border-color: rgb(181 18 27 / 0.72);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible .font-weight-600) {
		color: #ffffff;
	}

	.search-cars__filters {
		align-items: stretch;
	}

	.search-cars__select-wrapper {
		min-width: 120px;
	}

	.search-cars__select {
		display: grid;
		min-height: 66px;
		align-content: center;
		gap: 3px;
		padding: 10px 40px 9px 14px;
		transition: background-color var(--bc-motion-hover);
	}

	@media (hover: hover) and (pointer: fine) {
		.search-cars__select:hover,
		.search-cars__select:focus-within {
			background: var(--bc-surface-soft);
		}
	}

	.search-cars__label {
		position: static;
		max-width: 100%;
		overflow: hidden;
		color: #5f5f5f;
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-semibold);
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 17px;
		font-weight: var(--bc-weight-medium);
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
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-semibold);
		line-height: 1.2;
	}

	.search-cars__intent-field input {
		width: 100%;
		height: 25px;
		border: 0;
		background: transparent;
		box-shadow: none;
		color: #1c1c1c;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-medium);
		line-height: 1.2;
		outline: 0;
		padding: 0;
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
		gap: 10px;
		padding: 13px 16px;
		font-size: 17px;
		font-weight: var(--bc-weight-semibold);
		letter-spacing: 0;
		line-height: 21px;
		white-space: nowrap;
	}

	.search-cars__search img {
		width: 19px;
		height: 19px;
		flex: 0 0 19px;
	}

	.search-cars__advanced--hidden {
		display: none;
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
			--eliqauto-mobile-hero-top: #090a0c;
			--eliqauto-mobile-hero-bg: #090a0c;
			--eliqauto-mobile-hero-bottom: #090a0c;
			--eliqauto-mobile-hero-fill: #090a0c;
			--eliqauto-mobile-ink: #1c1c1c;
			--eliqauto-mobile-ink-muted: rgba(28, 28, 28, 0.82);
			--eliqauto-mobile-ink-strong: #1c1c1c;
			--eliqauto-mobile-cta: var(--bc-accent);
			--eliqauto-mobile-cta-ink: #ffffff;
			--eliqauto-mobile-action: #111216;
			--eliqauto-mobile-action-focus: #b5121b;
			--eliqauto-mobile-surface: #ffffff;
			background: var(--eliqauto-mobile-hero-top);
			background-color: var(--eliqauto-mobile-hero-top);
		}

		.eliqauto-desktop-hero {
			display: none;
		}

		.eliqauto-mobile-home,
		.eliqauto-mobile-home-quick {
			display: block;
		}

		.eliqauto-mobile-home {
			margin: 0;
			background: var(--eliqauto-mobile-hero-fill, var(--eliqauto-mobile-hero-bg, #a51717));
			color: var(--eliqauto-mobile-ink, #ffffff);
		}

		.eliqauto-mobile-location-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.eliqauto-mobile-hero {
			padding: 6px 0 14px;
			background: transparent;
		}

		.eliqauto-mobile-hero :global(.container),
		.eliqauto-mobile-home-quick :global(.container) {
			width: 100%;
			max-width: 480px;
			padding-right: 16px;
			padding-left: 16px;
		}

		.eliqauto-mobile-hero__copy {
			display: none;
		}

		.eliqauto-mobile-hero__copy h1 {
			margin: 0;
			color: #fff;
			font-family: var(--bc-font-heading);
			font-size: clamp(23px, 7vw, 28px);
			font-weight: 650;
			letter-spacing: -0.025em;
			line-height: 1.1;
		}

		.eliqauto-mobile-hero__search-module {
			display: grid;
			gap: 10px;
			margin-bottom: 10px;
			padding: 0;
		}

		/* Two search journeys use a simple tab rail; selling stays in bottom navigation. */
		.eliqauto-mobile-hero__tabs {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0;
			min-height: 0;
			border: 0;
			border-bottom: 1px solid rgb(255 255 255 / 0.25);
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.eliqauto-mobile-hero__tabs button {
			display: flex;
			min-height: 44px;
			width: 100%;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: rgb(255 255 255 / 0.72);
			font-size: 17px;
			font-weight: 600;
			letter-spacing: 0;
			line-height: 22px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
		}

		.eliqauto-mobile-hero__tab.active {
			background: transparent;
			box-shadow: inset 0 -3px 0 var(--bc-accent);
			color: #ffffff;
			font-weight: 700;
		}

		.eliqauto-mobile-hero__tab:focus-visible {
			outline: 2px solid #ffffff;
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

		.eliqauto-mobile-hero__search {
			display: flex;
			height: 56px;
			align-items: center;
			gap: 10px;
			padding: 6px 6px 6px 20px;
			border: 0;
			border-radius: 999px;
			background: var(--eliqauto-mobile-surface, #ffffff);
			color: #1c1c1c;
			box-shadow: none;
		}

		.eliqauto-mobile-hero__search :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.eliqauto-mobile-hero__search-label {
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

		.eliqauto-mobile-hero__search-label span {
			min-width: 0;
			overflow: hidden;
			color: #1c1c1c;
			font-size: 16px;
			font-weight: 400;
			line-height: 22px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-mobile-hero__search-action {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 999px;
			background: var(--eliqauto-mobile-action, #7a1212);
			box-shadow: none;
			color: #ffffff;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-mobile-hero__search-action:focus-visible {
			background: var(--eliqauto-mobile-action-focus, #1c1c1c);
			color: #ffffff;
			outline: 0;
		}

		.eliqauto-mobile-hero__search-action :global(svg),
		.eliqauto-mobile-hero__search-action :global(path),
		.eliqauto-mobile-hero__search-action :global(circle),
		.eliqauto-mobile-hero__search-action :global(line) {
			color: #ffffff;
			stroke: #ffffff;
		}

		.eliqauto-mobile-hero__all-row {
			display: flex;
			width: 100%;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 8px;
		}

		.eliqauto-mobile-hero__all {
			display: inline-flex;
			min-height: var(--bc-touch);
			min-width: 0;
			max-width: 100%;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border-radius: 999px;
			background: var(--eliqauto-mobile-cta, var(--bc-accent));
			border: 0;
			box-shadow: none;
			padding: 0 18px;
			color: #ffffff;
			font-size: var(--bc-text-control);
			font-weight: 700;
			line-height: 20px;
			text-decoration: none;
		}

		.eliqauto-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			color: var(--eliqauto-mobile-cta-ink, #ffffff);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-mobile-hero__all:focus-visible {
			background: #ffffff;
			color: #2a0c0c;
			outline: 2px solid rgb(181 18 27 / 0.45);
			outline-offset: 2px;
		}

		.eliqauto-mobile-hero__all:focus-visible span {
			color: var(--eliqauto-mobile-cta-ink, #ffffff);
		}

		.eliqauto-mobile-hero__all :global(svg),
		.eliqauto-mobile-hero__all :global(path),
		.eliqauto-mobile-hero__all :global(line),
		.eliqauto-mobile-hero__all :global(polyline) {
			flex: 0 0 auto;
			color: var(--eliqauto-mobile-cta-ink, #ffffff);
			stroke: var(--eliqauto-mobile-cta-ink, #ffffff);
		}

		.eliqauto-mobile-hero__all :global(svg) {
			width: 16px;
			height: 16px;
		}

		.eliqauto-mobile-location-sheet {
			position: fixed;
			inset: 0;
			z-index: 1200;
			display: block;
			visibility: hidden;
			pointer-events: none;
		}

		.eliqauto-mobile-location-sheet__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(0, 0, 0, 0.34);
			padding: 0;
		}

		.eliqauto-mobile-location-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			gap: 12px;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			padding: 10px 16px max(20px, env(safe-area-inset-bottom));
			box-shadow: 0 -18px 34px rgba(17, 24, 39, 0.18);
			color: #111111;
			transform: translateY(var(--eliqauto-mobile-location-drag-y, 0px));
		}

		:global(.eliqauto-mobile-location-toggle:checked ~ .eliqauto-mobile-location-sheet) {
			visibility: visible;
			pointer-events: auto;
		}

		.eliqauto-mobile-location-sheet__handle {
			justify-self: center;
			width: 42px;
			height: 4px;
			border-radius: 999px;
			background: var(--bc-border);
			touch-action: none;
		}

		.eliqauto-mobile-location-sheet__panel header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
			touch-action: none;
		}

		.eliqauto-mobile-location-sheet__panel header p,
		.eliqauto-mobile-location-sheet__panel header h2 {
			margin: 0;
			letter-spacing: 0;
		}

		.eliqauto-mobile-location-sheet__panel header p {
			color: #a51717;
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.eliqauto-mobile-location-sheet__panel header h2 {
			color: #111111;
			font-size: 20px;
			font-weight: 700;
			line-height: 26px;
		}

		.eliqauto-mobile-location-sheet__panel header label {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 999px;
			background: #f0f1f3;
			color: #111111;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-mobile-location-map {
			position: relative;
			min-height: 156px;
			overflow: hidden;
			border-radius: 12px;
			background: linear-gradient(135deg, rgb(181 18 27 / 0.58), rgb(148 16 24 / 0.34)), #2a0c0c;
		}

		.eliqauto-mobile-location-map::before,
		.eliqauto-mobile-location-map::after {
			position: absolute;
			content: '';
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.72);
		}

		.eliqauto-mobile-location-map::before {
			top: 34px;
			right: -28px;
			left: -20px;
			height: 16px;
			transform: rotate(-13deg);
		}

		.eliqauto-mobile-location-map::after {
			right: -16px;
			bottom: 30px;
			left: -26px;
			height: 18px;
			transform: rotate(16deg);
		}

		.eliqauto-mobile-location-map__road {
			position: absolute;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.58);
		}

		.eliqauto-mobile-location-map__road.road-a {
			top: -22px;
			left: 42px;
			width: 18px;
			height: 205px;
			transform: rotate(31deg);
		}

		.eliqauto-mobile-location-map__road.road-b {
			top: 62px;
			right: 42px;
			width: 14px;
			height: 128px;
			transform: rotate(-22deg);
		}

		.eliqauto-mobile-location-map__road.road-c {
			top: 74px;
			right: -26px;
			width: 190px;
			height: 12px;
			transform: rotate(-8deg);
		}

		.eliqauto-mobile-location-map__pin {
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
			color: var(--bc-accent-on-dark);
			transform: translate(-50%, -50%);
			box-shadow: 0 12px 26px rgba(17, 17, 17, 0.22);
		}

		.eliqauto-mobile-location-map__pin :global(svg) {
			color: currentColor;
			stroke: currentColor;
		}

		.eliqauto-mobile-location-map__badge {
			position: absolute;
			right: 12px;
			bottom: 12px;
			border-radius: 999px;
			background: #ffffff;
			padding: 7px 11px;
			color: #111111;
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 14px;
			box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
		}

		.eliqauto-mobile-location-address {
			display: grid;
			gap: 4px;
			border-radius: 10px;
			background: #f4f5f7;
			padding: 12px;
		}

		.eliqauto-mobile-location-address span {
			color: #6b7280;
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.eliqauto-mobile-location-address strong {
			color: #111111;
			font-size: 16px;
			font-weight: 700;
			line-height: 21px;
		}

		.eliqauto-mobile-location-address p {
			margin: 0;
			color: #4b5563;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.eliqauto-mobile-location-actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 9px;
		}

		.eliqauto-mobile-location-actions a {
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

		.eliqauto-mobile-location-actions a:first-child {
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
		}

		.eliqauto-mobile-location-actions :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		/* Homepage mobile search = full-screen overlay. Input pinned top, chips scroll
		   below; the keyboard opens beneath the input and never fights the panel. Appears
		   instantly (no slide). The authored inner markup keeps normal scoped styles. */
		.eliqauto-home-search-overlay {
			position: fixed;
			inset: 0;
			z-index: 1300;
			display: grid;
			grid-template-rows: max-content minmax(0, 1fr);
			background: #ffffff;
			color: #111111;
		}

		.eliqauto-home-search-overlay__bar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: max(12px, env(safe-area-inset-top)) 16px 12px;
		}

		.eliqauto-home-search-overlay__close {
			display: flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			flex: 0 0 40px;
			border: 0;
			border-radius: 999px;
			background: #f0f1f3;
			color: #111111;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-home-search-overlay__scroll {
			display: grid;
			min-height: 0;
			gap: 13px;
			align-content: start;
			overflow-y: auto;
			padding: 13px 16px max(20px, env(safe-area-inset-bottom));
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}

		.eliqauto-home-search-overlay__scroll::-webkit-scrollbar {
			display: none;
		}

		/* Lock background scroll while the location sheet is open (the search overlay
		   locks body scroll from script). */
		:global(body:has(.eliqauto-mobile-location-toggle:checked)) {
			overflow: hidden;
		}

		.eliqauto-home-search-drawer__title {
			display: block;
			margin: 0;
			color: #111111;
			font-size: 19px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 24px;
		}

		.eliqauto-home-search-drawer__form {
			display: grid;
			min-height: 0;
			gap: 0;
			grid-template-rows: max-content minmax(0, 1fr) max-content;
			overflow: hidden;
		}

		.eliqauto-home-search-drawer__form > .eliqauto-home-search-drawer__field {
			margin: 13px 16px 0;
		}

		.eliqauto-home-search-drawer__field {
			display: flex;
			min-height: 46px;
			align-items: center;
			gap: 10px;
			border-radius: 999px;
			background: #f4f5f7;
			padding: 0 13px;
			color: #111111;
		}

		.eliqauto-home-search-drawer__field input {
			min-width: 0;
			width: 100%;
			height: 44px;
			flex: 1 1 auto;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			color: #111111;
			/* >=16px stops iOS Safari from auto-zooming (and shifting the sheet) on focus. */
			font-size: 16px;
			font-weight: 700;
			line-height: 22px;
			outline: 0;
			padding: 0;
			appearance: none;
		}

		.eliqauto-home-search-drawer__field input::-webkit-search-cancel-button {
			appearance: none;
		}

		.eliqauto-home-search-drawer__body {
			display: grid;
			min-height: 0;
			gap: 13px;
			overflow-y: auto;
			padding-right: 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-home-search-drawer__body::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-home-search-drawer__group {
			display: grid;
			gap: 8px;
		}

		.eliqauto-home-search-drawer__group p {
			margin: 0;
			color: #586070;
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.eliqauto-home-search-drawer__group div {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.eliqauto-home-search-drawer__group--logos div {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-home-search-drawer__group--logos div::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-home-search-drawer__group a {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			border-radius: 8px;
			background: #f0f1f3;
			padding: 0 12px;
			color: #111111;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			text-decoration: none;
		}

		.eliqauto-home-search-drawer__group--logos a {
			width: 86px;
			min-width: 86px;
			min-height: 68px;
			justify-content: center;
			flex-direction: column;
			gap: 6px;
			padding: 8px 5px;
			font-size: var(--bc-text-micro);
			text-align: center;
		}

		.eliqauto-mobile-brand-chip__logo {
			display: flex;
			width: 38px;
			height: 28px;
			align-items: center;
			justify-content: center;
			flex: 0 0 28px;
		}

		.eliqauto-mobile-brand-chip__logo img {
			display: block;
			max-width: 38px;
			max-height: 26px;
			object-fit: contain;
		}

		.eliqauto-home-search-drawer__group--logos a > span:last-child {
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-home-search-drawer__group a:focus-visible {
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
			outline: 0;
		}

		.eliqauto-home-search-drawer__hint {
			margin: 0;
			border-radius: 12px;
			background: #f4f5f7;
			padding: 12px 13px;
			color: #4b5563;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		/* Pinned footer bar: the form's last grid row, so it sits flush at the bottom of
		   the screen (the 1fr scroll above absorbs the slack) instead of floating. */
		.eliqauto-home-search-drawer__actions {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
			gap: 10px;
			padding: 10px 16px max(14px, env(safe-area-inset-bottom));
			border-top: 0;
			background: #ffffff;
		}

		.eliqauto-home-search-drawer__actions a,
		.eliqauto-home-search-drawer__actions button {
			display: flex;
			min-height: 52px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 14px;
			background: #f0f1f3;
			padding: 0 12px;
			color: #1c1c1c;
			font-size: 14px;
			font-weight: 800;
			line-height: 17px;
			text-align: center;
			text-decoration: none;
			white-space: normal;
		}

		.eliqauto-home-search-drawer__actions button {
			background: var(--bc-accent);
			color: #ffffff;
			cursor: pointer;
		}

		.eliqauto-mobile-home-quick {
			background: #ffffff;
			margin: 0;
			padding: 8px 0 9px;
			border: 0;
			box-shadow: none;
			overflow: hidden;
		}

		.eliqauto-mobile-home-quick__scroller {
			display: flex;
			gap: 8px;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-mobile-home-quick__scroller::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-mobile-home-quick__scroller a,
		.eliqauto-mobile-home-quick__scroller button {
			display: inline-flex;
			min-width: max-content;
			min-height: 42px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			flex: 0 0 auto;
			padding: 0 12px;
			border: 0;
			border-radius: 12px;
			background: #f0f1f3;
			box-shadow: none;
			color: #24262a;
			cursor: pointer;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			text-decoration: none;
			white-space: nowrap;
		}

		.eliqauto-mobile-home-quick__scroller .eliqauto-mobile-home-quick__filter {
			width: 44px;
			min-width: 44px;
			padding: 0;
		}

		.eliqauto-mobile-home-quick__scroller a:focus-visible,
		.eliqauto-mobile-home-quick__scroller button:focus-visible {
			background: var(--bc-accent);
			box-shadow: none;
			color: var(--bc-accent-contrast);
		}

		.eliqauto-mobile-home-quick__scroller a:focus-visible,
		.eliqauto-mobile-home-quick__scroller button:focus-visible {
			outline: 2px solid rgba(28, 28, 28, 0.7);
			outline-offset: 3px;
		}

		.eliqauto-mobile-home-quick__scroller :global(svg) {
			flex: 0 0 auto;
			color: inherit;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header.header-style-4) {
			border-bottom: 0;
			background: var(--eliqauto-mobile-hero-top, #090a0c);
			box-shadow: none;
			height: 64px;
			min-height: 64px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 64px;
			min-height: 64px;
			background: var(--eliqauto-mobile-hero-top, #090a0c);
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: var(--eliqauto-mobile-hero-top, #090a0c);
			height: 64px;
			min-height: 64px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-inner) {
			height: 64px;
			min-height: 64px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 10px;
			gap: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-map) {
			width: 40px;
			height: 40px;
			border: 1px solid #3b3d42;
			background: #1a1b1f;
			color: #ffffff;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 178px;
			height: 40px;
			align-items: center;
			background: none;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			content: normal;
			width: 174px;
			max-width: 174px;
			height: auto;
			opacity: 1;
			filter: brightness(0) invert(1);
		}
	}
</style>
