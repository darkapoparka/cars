<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal, X } from '@lucide/svelte';
	import { tick } from 'svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Drawer } from 'vaul-svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';
	import MobileVehicleCard from '$lib/components/common/MobileVehicleCard.svelte';

	type FilterDrawerMode =
		| 'all'
		| 'brand'
		| 'model'
		| 'sort'
		| 'fuel'
		| 'mileage'
		| 'body'
		| 'price'
		| 'extras'
		| 'year';
	type FilterDraft = {
		body: string;
		brand: string;
		feature: string;
		fuel: string;
		mileage: string;
		model: string;
		price: string;
		sort: string;
		transmission: string;
		year: string;
	};
	type InventoryMobileOption = InventoryMobileData['brandOptions'][number];

	let {
		cards,
		copy,
		mobile,
		filtersOnly = false,
		filterDrawerOpen = $bindable(false),
		onclose
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
		filtersOnly?: boolean;
		filterDrawerOpen?: boolean;
		onclose?: () => void;
	} = $props();

	const filterDrawerIds = {
		all: 'daynight-inventory-mobile-filter-drawer',
		body: 'daynight-inventory-mobile-body-drawer',
		brand: 'daynight-inventory-mobile-brand-drawer',
		extras: 'daynight-inventory-mobile-extras-drawer',
		fuel: 'daynight-inventory-mobile-fuel-drawer',
		mileage: 'daynight-inventory-mobile-mileage-drawer',
		model: 'daynight-inventory-mobile-model-drawer',
		price: 'daynight-inventory-mobile-price-drawer',
		sort: 'daynight-inventory-mobile-sort-drawer',
		year: 'daynight-inventory-mobile-year-drawer'
	} as const;
	const activeOptionValue = (options: InventoryMobileData['brandOptions']) =>
		options.find((option) => option.active)?.value ?? '';
	const activeOptionValues = (options: InventoryMobileData['brandOptions']) =>
		options
			.filter((option) => option.active && option.value)
			.map((option) => option.value)
			.join(',');
	const activeOptionLabel = (
		options: InventoryMobileData['brandOptions'],
		values: string,
		fallback: string
	) => {
		const selectedLabels = splitDraftValues(values)
			.map((value) => options.find((option) => option.value === value)?.label ?? value)
			.filter(Boolean);

		if (!selectedLabels.length) return fallback;
		if (selectedLabels.length <= 2) return selectedLabels.join(' + ');

		return `${selectedLabels.length} ${mobile.filterLabel === 'Филтри' ? 'избрани' : 'selected'}`;
	};
	const normalizedOptionQuery = (value: string) => value.trim().toLocaleLowerCase();
	const optionSearchText = (option: InventoryMobileOption) =>
		`${option.label} ${option.value}`.toLocaleLowerCase();
	const splitDraftValues = (value: string) =>
		value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	const joinDraftValues = (values: string[]) =>
		Array.from(new Set(values.filter(Boolean))).join(',');
	const hasDraftValue = (current: string, value: string) =>
		splitDraftValues(current).some(
			(item) => item.toLocaleLowerCase() === value.toLocaleLowerCase()
		);
	const draftOptionActive = (current: string, value: string) =>
		value ? hasDraftValue(current, value) : !current;
	const toggleDraftValue = (current: string, value: string) => {
		if (!value) return '';

		const values = splitDraftValues(current);

		return joinDraftValues(
			hasDraftValue(current, value)
				? values.filter((item) => item.toLocaleLowerCase() !== value.toLocaleLowerCase())
				: [...values, value]
		);
	};
	const rangeParams = (value: string) => {
		const [min, max] = value.split('-');

		return {
			max: max ? Number(max) : undefined,
			min: min ? Number(min) : undefined
		};
	};
	const currentFilterDraft = (): FilterDraft => ({
		body: activeOptionValues(mobile.bodyOptions),
		brand: activeOptionValues(mobile.brandOptions),
		feature: activeOptionValues(mobile.featureOptions),
		fuel: activeOptionValues(mobile.fuelOptions),
		mileage: activeOptionValue(mobile.mileageOptions),
		model: mobile.searchValue || activeOptionValue(mobile.modelOptions),
		price: activeOptionValue(mobile.priceOptions),
		sort: activeOptionValue(mobile.sortOptions) || 'best-match',
		transmission: activeOptionValues(mobile.transmissionOptions),
		year: activeOptionValue(mobile.yearOptions)
	});

	let searchDrawerOpen = $state(false);
	$effect(() => {
		if (filtersOnly && !filterDrawerOpen) onclose?.();
	});
	let searchInput = $state<HTMLInputElement | null>(null);
	// Search is a full-screen overlay (input pinned top → keyboard never fights it). While
	// it's open, focus the input, lock background scroll, and close on Escape.
	$effect(() => {
		if (!searchDrawerOpen) return;
		const { body } = document;
		const prevOverflow = body.style.overflow;
		body.style.overflow = 'hidden';
		// Recolour the iOS status-bar/browser chrome to the overlay's white while open.
		const themeMeta = document.querySelector('meta[name="theme-color"]');
		const prevTheme = themeMeta?.getAttribute('content') ?? null;
		themeMeta?.setAttribute('content', '#ffffff');
		tick().then(() => searchInput?.focus());
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeSearchDrawer();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			body.style.overflow = prevOverflow;
			if (themeMeta && prevTheme !== null) themeMeta.setAttribute('content', prevTheme);
			window.removeEventListener('keydown', onKey);
		};
	});
	// The filters drawer is still a vaul bottom sheet; expose the keyboard height as
	// --bc-kb-inset on the document root so its inputs can lift above the keyboard.
	$effect(() => {
		if (!filterDrawerOpen) return;
		return trackKeyboardInset();
	});
	let filterDrawerMode = $state<FilterDrawerMode>('all');
	let filterDraft = $state<FilterDraft>(currentFilterDraft());
	let brandDrawerQuery = $state('');
	let modelDrawerQuery = $state('');

	const brandSelected = $derived(
		mobile.brandOptions.some((option) => option.active && option.value)
	);
	const modelSelected = $derived(Boolean(mobile.searchValue));
	const bodySelected = $derived(mobile.bodyOptions.some((option) => option.active && option.value));
	const bodyValue = $derived(
		activeOptionLabel(mobile.bodyOptions, currentFilterDraft().body, mobile.countLabel)
	);
	const extrasSelected = $derived(
		mobile.featureOptions.some((option) => option.active && option.value)
	);
	const fuelSelected = $derived(mobile.fuelOptions.some((option) => option.active && option.value));
	const mileageSelected = $derived(
		mobile.mileageOptions.some((option) => option.active && option.value)
	);
	const priceSelected = $derived(
		mobile.priceOptions.some((option) => option.active && option.value)
	);
	const yearSelected = $derived(mobile.yearOptions.some((option) => option.active && option.value));
	const sortSelected = $derived(
		mobile.sortOptions.some((option) => option.active && option.value !== 'best-match')
	);
	const hasActiveFilters = $derived(mobile.activeFilters.length > 0);
	const mobileSearchShowAllLabel = $derived(
		mobile.countLabel.toLocaleLowerCase().startsWith('all') ? 'Show all' : 'Покажи всички'
	);
	const mobileSearchCount = $derived(mobile.countLabel.match(/\d+/)?.[0] ?? '');
	const inventoryHeading = $derived(mobile.filterLabel === 'Филтри' ? 'Автомобили' : 'Vehicles');
	const filterDrawerId = $derived(filterDrawerIds[filterDrawerMode]);
	const filterDrawerHasActions = $derived(
		filterDrawerMode === 'all' || filterDrawerMode === 'brand' || filterDrawerMode === 'model'
	);
	const filterDrawerTitle = $derived.by(() => {
		if (filterDrawerMode === 'body') return mobile.bodyLabel;
		if (filterDrawerMode === 'brand') return mobile.brandLabel;
		if (filterDrawerMode === 'extras') return mobile.extrasLabel;
		if (filterDrawerMode === 'fuel') return mobile.fuelLabel;
		if (filterDrawerMode === 'mileage') return mobile.mileageLabel;
		if (filterDrawerMode === 'model') return mobile.modelLabel;
		if (filterDrawerMode === 'price') return mobile.priceLabel;
		if (filterDrawerMode === 'sort') return mobile.sortLabel;
		if (filterDrawerMode === 'year') return mobile.yearLabel;

		return mobile.drawerTitle;
	});
	const stagedModelOptions = $derived.by(() => {
		const options =
			mobile.modelOptionsByBrand[filterDraft.brand] ??
			mobile.modelOptionsByBrand[''] ??
			mobile.modelOptions;

		return options.map((option) => ({
			...option,
			active: draftOptionActive(filterDraft.model, option.value)
		}));
	});
	const visibleBrandOptions = $derived.by(() => {
		const query = normalizedOptionQuery(brandDrawerQuery);

		return mobile.brandOptions.filter((option) => {
			if (!option.value) return !query;

			return !query || optionSearchText(option).includes(query);
		});
	});
	const visibleStagedModelOptions = $derived.by(() => {
		const query = normalizedOptionQuery(modelDrawerQuery);

		return stagedModelOptions.filter(
			(option) => !query || optionSearchText(option).includes(query)
		);
	});
	const filterDraftChanged = $derived.by(() => {
		const current = currentFilterDraft();

		return (
			filterDraft.brand !== current.brand ||
			filterDraft.model !== current.model ||
			filterDraft.body !== current.body ||
			filterDraft.feature !== current.feature ||
			filterDraft.fuel !== current.fuel ||
			filterDraft.mileage !== current.mileage ||
			filterDraft.price !== current.price ||
			filterDraft.sort !== current.sort ||
			filterDraft.transmission !== current.transmission ||
			filterDraft.year !== current.year
		);
	});

	const resetFilterDraft = () => {
		filterDraft = currentFilterDraft();
	};
	const selectDraftOption = (key: keyof FilterDraft, value: string) => {
		if (key === 'brand') {
			filterDraft.brand = toggleDraftValue(filterDraft.brand, value);
			filterDraft.model = '';
			modelDrawerQuery = '';
			return;
		}

		if (key === 'model') {
			filterDraft.model = toggleDraftValue(filterDraft.model, value);
			return;
		}

		if (key === 'sort') {
			filterDraft.sort = value || 'best-match';
			return;
		}

		if (key === 'body' || key === 'feature' || key === 'fuel' || key === 'transmission') {
			filterDraft[key] = toggleDraftValue(filterDraft[key], value);
			return;
		}

		filterDraft[key] = filterDraft[key] === value ? '' : value;
	};
	const filterDraftHref = () => {
		const params = new SvelteURLSearchParams(page.url.search);
		const setParam = (key: string, value: string, defaultValue = '') => {
			if (!value || value === defaultValue) {
				params.delete(key);
				return;
			}

			params.set(key, value);
		};

		setParam('brand', filterDraft.brand);
		params.delete('query');
		params.delete('keyword');
		params.delete('model');
		setParam('q', filterDraft.model);
		params.delete('body');
		params.delete('bodystyle');
		setParam('bodyType', filterDraft.body);
		params.delete('equipment');
		params.delete('extra');
		params.delete('features');
		setParam('feature', filterDraft.feature);
		params.delete('FuelType');
		setParam('fuel', filterDraft.fuel);
		params.delete('mileageFrom');
		params.delete('mileageTo');
		const mileage = rangeParams(filterDraft.mileage);
		setParam('minMileage', mileage.min ? String(mileage.min) : '');
		setParam('maxMileage', mileage.max ? String(mileage.max) : '');
		params.delete('price');
		params.delete('priceFrom');
		params.delete('priceTo');
		const price = rangeParams(filterDraft.price);
		setParam('minPrice', price.min ? String(price.min) : '');
		setParam('maxPrice', price.max ? String(price.max) : '');
		setParam('sort', filterDraft.sort, 'best-match');
		params.delete('Transmission');
		params.delete('gearbox');
		setParam('transmission', filterDraft.transmission);
		params.delete('yearFrom');
		params.delete('yearTo');
		const year = rangeParams(filterDraft.year);
		setParam('minYear', year.min ? String(year.min) : '');
		setParam('maxYear', year.max ? String(year.max) : '');

		const query = params.toString();

		return `/inventory${query ? `?${query}` : ''}`;
	};
	const clearFilterDraft = () => {
		if (filterDrawerMode === 'all') {
			void navigateToFilterDraft(mobile.clearHref);
			return;
		}

		if (filterDrawerMode === 'brand') {
			filterDraft.brand = '';
			filterDraft.model = '';
			brandDrawerQuery = '';
			modelDrawerQuery = '';
			return;
		}

		if (filterDrawerMode === 'model') {
			filterDraft.model = '';
			modelDrawerQuery = '';
		}
	};
	const navigateToFilterDraft = async (href = filterDraftHref()) => {
		const queryStart = href.indexOf('?');
		filterDrawerOpen = false;

		await goto(resolve(`/inventory${queryStart === -1 ? '' : href.slice(queryStart)}`), {
			noScroll: true
		});
	};
	const applyFilterDraft = () => {
		if (!filtersOnly && !filterDraftChanged) {
			closeFilterDrawer();
			return;
		}

		void navigateToFilterDraft();
	};
	const selectFilterOption = (key: keyof FilterDraft, value: string) => {
		const previousHref = filterDraftHref();
		selectDraftOption(key, value);

		if (
			filterDrawerMode === 'all' ||
			filterDrawerMode === 'brand' ||
			filterDrawerMode === 'model'
		) {
			return;
		}

		const nextHref = filterDraftHref();
		if (nextHref === previousHref) {
			closeFilterDrawer();
			return;
		}

		void navigateToFilterDraft(nextHref);
	};

	const openSearchDrawer = () => {
		filterDrawerOpen = false;
		searchDrawerOpen = true;
	};
	const closeSearchDrawer = () => {
		searchDrawerOpen = false;
	};
	const openFilterDrawer = (mode: FilterDrawerMode = 'all') => {
		searchDrawerOpen = false;
		filterDrawerMode = mode;
		resetFilterDraft();
		if (mode === 'brand') brandDrawerQuery = '';
		if (mode === 'model') modelDrawerQuery = '';
		filterDrawerOpen = true;
	};
	const closeFilterDrawer = () => {
		filterDrawerOpen = false;
	};
</script>

<div class="daynight-inventory-mobile" style:display={filtersOnly ? 'contents' : undefined}>
	{#if !filtersOnly}
		<main class="daynight-inventory-mobile__main">
			<h1 class="sr-only">{inventoryHeading}</h1>
			<div class="daynight-inventory-mobile__search">
				<button
					type="button"
					class="daynight-inventory-mobile__search-field"
					aria-label={mobile.searchDisplayValue || mobile.searchPlaceholder}
					aria-haspopup="dialog"
					aria-expanded={searchDrawerOpen}
					onclick={openSearchDrawer}
				>
					<Search size={20} strokeWidth={2} aria-hidden="true" />
					<span>{mobile.searchDisplayValue || mobile.searchLabel}</span>
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__header-action"
					class:active={hasActiveFilters}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'all'}
					onclick={() => openFilterDrawer('all')}
				>
					<SlidersHorizontal size={20} strokeWidth={2} aria-hidden="true" />
					<span class="sr-only">{mobile.filterLabel}</span>
					{#if hasActiveFilters}
						<span class="daynight-inventory-mobile__filter-count"
							>{mobile.activeFilters.length}</span
						>
					{/if}
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__header-action"
					class:active={sortSelected}
					aria-label={`${mobile.sortLabel}: ${mobile.sortValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'sort'}
					onclick={() => openFilterDrawer('sort')}
				>
					<ArrowUpDown size={20} strokeWidth={2} aria-hidden="true" />

					{#if sortSelected}
						<span class="daynight-inventory-mobile__sort-dot" aria-hidden="true"></span>
					{/if}
				</button>
			</div>

			<nav class="daynight-inventory-mobile__tools" aria-label={mobile.filterLabel}>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={brandSelected}
					aria-label={`${mobile.brandLabel}: ${mobile.brandValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'brand'}
					onclick={() => openFilterDrawer('brand')}
				>
					<span>{mobile.brandLabel}</span>
					{#if brandSelected}
						<strong>{mobile.brandValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={modelSelected}
					aria-label={`${mobile.modelLabel}: ${mobile.modelValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'model'}
					onclick={() => openFilterDrawer('model')}
				>
					<span>{mobile.modelLabel}</span>
					{#if modelSelected}
						<strong>{mobile.modelValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={priceSelected}
					aria-label={`${mobile.priceLabel}: ${mobile.priceValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'price'}
					onclick={() => openFilterDrawer('price')}
				>
					<span>{mobile.priceLabel}</span>
					{#if priceSelected}
						<strong>{mobile.priceValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={yearSelected}
					aria-label={`${mobile.yearLabel}: ${mobile.yearValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'year'}
					onclick={() => openFilterDrawer('year')}
				>
					<span>{mobile.yearLabel}</span>
					{#if yearSelected}
						<strong>{mobile.yearValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={fuelSelected}
					aria-label={`${mobile.fuelLabel}: ${mobile.fuelValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'fuel'}
					onclick={() => openFilterDrawer('fuel')}
				>
					<span>{mobile.fuelLabel}</span>
					{#if fuelSelected}
						<strong>{mobile.fuelValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={mileageSelected}
					aria-label={`${mobile.mileageLabel}: ${mobile.mileageValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'mileage'}
					onclick={() => openFilterDrawer('mileage')}
				>
					<span>{mobile.mileageLabel}</span>
					{#if mileageSelected}
						<strong>{mobile.mileageValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={bodySelected}
					aria-label={`${mobile.bodyLabel}: ${bodyValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'body'}
					onclick={() => openFilterDrawer('body')}
				>
					<span>{mobile.bodyRailLabel}</span>
					{#if bodySelected}
						<strong>{bodyValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="daynight-inventory-mobile__tool-choice"
					class:active={extrasSelected}
					aria-label={`${mobile.extrasLabel}: ${mobile.featureValue}`}
					aria-haspopup="dialog"
					aria-expanded={filterDrawerOpen && filterDrawerMode === 'extras'}
					onclick={() => openFilterDrawer('extras')}
				>
					<span>{mobile.extrasLabel}</span>
					{#if extrasSelected}
						<strong>{mobile.featureValue}</strong>
					{/if}
					<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
				{#if hasActiveFilters}
					<a
						class="daynight-inventory-mobile__tool-clear"
						href={resolve(mobile.clearHref as '/inventory')}
					>
						{mobile.clearLabel}
					</a>
				{/if}
			</nav>

			<section class="daynight-inventory-mobile__cards" aria-label={mobile.countLabel}>
				{#each cards as card (card.slug)}
					<MobileVehicleCard {card} />
				{:else}
					<div class="daynight-inventory-mobile__empty">
						<h2>{copy.emptyTitle}</h2>
						<p>{copy.emptyBody}</p>
						<a href={resolve('/inventory')}>{copy.reset}</a>
					</div>
				{/each}
			</section>
		</main>
	{/if}

	{#if searchDrawerOpen}
		<!-- Full-screen search overlay (replaces the old bottom drawer): input pinned top so
		     the keyboard opens beneath it and never fights the panel. Appears instantly. -->
		<div
			id="daynight-inventory-mobile-search-drawer"
			class="daynight-inventory-mobile-search-overlay"
			role="dialog"
			aria-modal="true"
			aria-label={mobile.searchDrawerTitle}
		>
			<header class="daynight-inventory-mobile-search-overlay__bar">
				<span class="daynight-inventory-mobile-drawer__title">
					{mobile.searchDrawerTitle}
				</span>
				<button
					type="button"
					class="daynight-inventory-mobile-search-overlay__close"
					aria-label={mobile.closeLabel}
					onclick={closeSearchDrawer}
				>
					<X size={20} strokeWidth={2.4} aria-hidden="true" />
				</button>
			</header>
			<form
				class="daynight-inventory-mobile-drawer__search-form"
				action={resolve('/inventory')}
				method="get"
			>
				{#each mobile.hiddenInputs as input (`${input.name}-${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				<div
					class="daynight-inventory-mobile-drawer__search-box daynight-inventory-mobile-drawer__search-box--submit"
				>
					<input
						bind:this={searchInput}
						name="q"
						type="search"
						value={mobile.searchValue}
						placeholder={mobile.searchPlaceholder}
						autocomplete="off"
						enterkeyhint="search"
						aria-label={mobile.searchPlaceholder}
					/>
					<button
						type="submit"
						class="daynight-inventory-mobile-drawer__search-submit"
						aria-label={mobile.searchLabel}
					>
						<Search size={18} strokeWidth={2.25} aria-hidden="true" />
					</button>
				</div>
				<div class="daynight-inventory-mobile-search-overlay__scroll">
					<div
						class="daynight-inventory-mobile-drawer__group daynight-inventory-mobile-drawer__group--logos"
					>
						<p>{mobile.brandLabel}</p>
						<div>
							{#each mobile.brandOptions.slice(1, 7) as option (option.value)}
								<a
									class:active={option.active}
									href={resolve(option.href as '/inventory')}
									aria-current={option.active ? 'page' : undefined}
								>
									{#if option.image}
										<span class="daynight-inventory-mobile-drawer__brand-logo-frame">
											<img
												class="daynight-inventory-mobile-drawer__brand-logo"
												src={option.image}
												alt=""
												aria-hidden="true"
												width="96"
												height="64"
												loading="lazy"
												decoding="async"
											/>
										</span>
									{/if}
									<span>{option.label}</span>
								</a>
							{/each}
						</div>
					</div>
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.bodyLabel}</p>
						<div>
							{#each mobile.bodyOptions.slice(1, 7) as option (option.value)}
								<a
									class:active={option.active}
									href={resolve(option.href as '/inventory')}
									aria-current={option.active ? 'page' : undefined}
								>
									{option.label}
								</a>
							{/each}
						</div>
					</div>
				</div>
				<a
					class="daynight-inventory-mobile-drawer__clear daynight-inventory-mobile-drawer__clear--search daynight-inventory-mobile-search-overlay__cta"
					href={resolve('/inventory')}
					aria-label={mobile.countLabel}
				>
					<span>{mobileSearchShowAllLabel}</span>
					{#if mobileSearchCount}
						<small>{mobileSearchCount}</small>
					{/if}
				</a>
			</form>
		</div>
	{/if}

	<Drawer.Root
		bind:open={filterDrawerOpen}
		direction="bottom"
		fixed={true}
		repositionInputs={false}
	>
		<Drawer.Overlay class="daynight-inventory-mobile-drawer__backdrop">
			<span>{mobile.closeLabel}</span>
		</Drawer.Overlay>
		<Drawer.Content
			id={filterDrawerId}
			class={`daynight-inventory-mobile-drawer__sheet daynight-inventory-mobile-drawer__sheet--filters ${filtersOnly ? 'daynight-inventory-mobile-drawer__sheet--fullscreen' : ''} ${filterDrawerMode === 'all' ? 'daynight-inventory-mobile-drawer__sheet--full' : ''} ${filterDrawerHasActions ? 'daynight-inventory-mobile-drawer__sheet--with-actions' : ''}`}
		>
			{#if !filtersOnly}<Drawer.Handle class="daynight-inventory-mobile-drawer__handle" />{/if}
			<header>
				<div>
					<Drawer.Title>
						<span class="daynight-inventory-mobile-drawer__title">
							{filterDrawerTitle}
						</span>
					</Drawer.Title>
				</div>
				<button type="button" aria-label={mobile.closeLabel} onclick={closeFilterDrawer}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description>
				<span class="daynight-inventory-mobile-drawer__description">
					{mobile.countLabel}
				</span>
			</Drawer.Description>
			{#if filterDrawerMode === 'all'}
				<form
					onsubmit={(event) => {
						event.preventDefault();
						applyFilterDraft();
					}}
				>
					<label class="daynight-inventory-mobile-drawer__search-box">
						<Search size={19} strokeWidth={2.15} aria-hidden="true" />
						<input
							type="search"
							bind:value={filterDraft.model}
							placeholder={mobile.searchPlaceholder}
							aria-label={mobile.searchPlaceholder}
							enterkeyhint="search"
						/>
					</label>
				</form>
			{/if}
			<div class="daynight-inventory-mobile-drawer__body" data-vaul-no-drag>
				{#if filterDrawerMode === 'brand'}
					<div class="daynight-inventory-mobile-drawer__group">
						<label class="daynight-inventory-mobile-drawer__search-box">
							<Search size={19} strokeWidth={2.15} aria-hidden="true" />
							<input
								type="search"
								bind:value={brandDrawerQuery}
								placeholder={mobile.brandSearchPlaceholder}
								autocomplete="off"
								autocapitalize="none"
								spellcheck="false"
								enterkeyhint="search"
								aria-label={mobile.brandSearchPlaceholder}
							/>
						</label>
						{#if visibleBrandOptions.length}
							<div>
								{#each visibleBrandOptions as option (option.value)}
									<button
										type="button"
										class:active={draftOptionActive(filterDraft.brand, option.value)}
										aria-pressed={draftOptionActive(filterDraft.brand, option.value)}
										onclick={() => selectFilterOption('brand', option.value)}
									>
										{#if option.image}
											<img
												class="daynight-inventory-mobile-drawer__brand-logo"
												src={option.image}
												alt=""
												aria-hidden="true"
												width="96"
												height="64"
												loading="lazy"
												decoding="async"
											/>
										{/if}
										<span>{option.label}</span>
										{#if option.countLabel}
											<small>{option.countLabel}</small>
										{/if}
									</button>
								{/each}
							</div>
						{:else}
							<span class="daynight-inventory-mobile-drawer__empty-option">
								{mobile.noMatchesLabel}
							</span>
						{/if}
					</div>
				{/if}
				{#if filterDrawerMode === 'model'}
					<div class="daynight-inventory-mobile-drawer__group">
						<label class="daynight-inventory-mobile-drawer__search-box">
							<Search size={19} strokeWidth={2.15} aria-hidden="true" />
							<input
								type="search"
								bind:value={modelDrawerQuery}
								placeholder={mobile.modelSearchPlaceholder}
								autocomplete="off"
								autocapitalize="none"
								spellcheck="false"
								enterkeyhint="search"
								aria-label={mobile.modelSearchPlaceholder}
							/>
						</label>
						{#if visibleStagedModelOptions.length}
							<div>
								{#each visibleStagedModelOptions as option (option.value)}
									<button
										type="button"
										class:active={option.active}
										aria-pressed={option.active}
										onclick={() => selectFilterOption('model', option.value)}
									>
										<span>{option.label}</span>
										{#if option.countLabel}
											<small>{option.countLabel}</small>
										{/if}
									</button>
								{/each}
							</div>
						{:else}
							<span class="daynight-inventory-mobile-drawer__empty-option">
								{mobile.noMatchesLabel}
							</span>
						{/if}
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'body'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.bodyLabel}</p>
						<div>
							{#each mobile.bodyOptions as option (option.value)}
								<button
									type="button"
									class:active={draftOptionActive(filterDraft.body, option.value)}
									aria-pressed={draftOptionActive(filterDraft.body, option.value)}
									onclick={() => selectFilterOption('body', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'sort'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.sortLabel}</p>
						<div>
							{#each mobile.sortOptions as option (option.value)}
								<button
									type="button"
									class:active={filterDraft.sort === option.value}
									aria-pressed={filterDraft.sort === option.value}
									onclick={() => selectFilterOption('sort', option.value)}
								>
									<span>{option.label}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'fuel'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.fuelLabel}</p>
						<div>
							{#each mobile.fuelOptions as option (option.value)}
								<button
									type="button"
									class:active={draftOptionActive(filterDraft.fuel, option.value)}
									aria-pressed={draftOptionActive(filterDraft.fuel, option.value)}
									onclick={() => selectFilterOption('fuel', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'mileage'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.mileageLabel}</p>
						<div>
							{#each mobile.mileageOptions as option (option.value)}
								<button
									type="button"
									class:active={filterDraft.mileage === option.value}
									aria-pressed={filterDraft.mileage === option.value}
									onclick={() => selectFilterOption('mileage', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'price'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.priceLabel}</p>
						<div>
							{#each mobile.priceOptions as option (option.value)}
								<button
									type="button"
									class:active={filterDraft.price === option.value}
									aria-pressed={filterDraft.price === option.value}
									onclick={() => selectFilterOption('price', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'year'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.yearLabel}</p>
						<div>
							{#each mobile.yearOptions as option (option.value)}
								<button
									type="button"
									class:active={filterDraft.year === option.value}
									aria-pressed={filterDraft.year === option.value}
									onclick={() => selectFilterOption('year', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.transmissionLabel}</p>
						<div>
							{#each mobile.transmissionOptions as option (option.value)}
								<button
									type="button"
									class:active={draftOptionActive(filterDraft.transmission, option.value)}
									aria-pressed={draftOptionActive(filterDraft.transmission, option.value)}
									onclick={() => selectFilterOption('transmission', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'extras'}
					<div class="daynight-inventory-mobile-drawer__group">
						<p>{mobile.extrasLabel}</p>
						<div>
							{#each mobile.featureOptions as option (option.value)}
								<button
									type="button"
									class:active={draftOptionActive(filterDraft.feature, option.value)}
									aria-pressed={draftOptionActive(filterDraft.feature, option.value)}
									onclick={() => selectFilterOption('feature', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			{#if filterDrawerHasActions}
				<div class="daynight-inventory-mobile-drawer__actions">
					<button
						type="button"
						class="daynight-inventory-mobile-drawer__clear"
						onclick={clearFilterDraft}
					>
						{mobile.clearLabel}
					</button>
					<button
						type="button"
						class="daynight-inventory-mobile-drawer__done"
						onclick={applyFilterDraft}
					>
						{filterDraftChanged ? mobile.applyLabel : mobile.showResultsLabel}
					</button>
				</div>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	:global(body.auxero-template-listing-grid4-columns-html) {
		background: var(--bc-surface) !important;
		background-color: var(--bc-surface) !important;
	}

	.daynight-inventory-mobile {
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		min-height: 100vh;
		background: var(--bc-bg);
		color: var(--bc-ink);
	}

	.daynight-inventory-mobile__main {
		display: grid;
		width: 100%;
		max-width: 100vw;
		min-width: 0;
		gap: var(--bc-space-2);
		overflow-x: hidden;
		padding: max(6px, env(safe-area-inset-top)) 14px 92px;
	}

	.daynight-inventory-mobile__search {
		display: grid;
		grid-template-columns: minmax(0, 1fr) repeat(2, var(--bc-control-height-standard));
		align-items: center;
		gap: var(--bc-space-2);
		min-width: 0;
	}

	.daynight-inventory-mobile__header-action {
		position: relative;
		display: grid;
		place-items: center;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		padding: 0;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
	}
	.daynight-inventory-mobile__header-action.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.daynight-inventory-mobile__header-action:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.daynight-inventory-mobile__filter-count {
		position: absolute;
		top: -3px;
		right: -3px;
		display: grid;
		place-items: center;
		min-width: 18px;
		height: 18px;
		padding: 0 3px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: var(--bc-mobile-stat);
		line-height: 1;
	}
	.daynight-inventory-mobile__sort-dot {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: currentColor;
	}

	.daynight-inventory-mobile__search-field {
		display: flex;
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		padding: 0 14px;
		color: var(--bc-ink);
		cursor: pointer;
		text-align: left;
	}
	.daynight-inventory-mobile__search-field :global(svg) {
		flex: 0 0 auto;
		color: var(--bc-copy);
	}
	.daynight-inventory-mobile__search-field span {
		min-width: 0;
		overflow: hidden;
		font-size: var(--bc-text-search-trigger);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.daynight-inventory-mobile__search-field:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.daynight-inventory-mobile__tools {
		display: flex;
		min-width: 0;
		gap: var(--bc-space-2);
		margin: 0 calc(-1 * var(--bc-mobile-gutter));
		overflow-x: auto;
		padding: 0 var(--bc-mobile-gutter) 2px;
		scrollbar-width: none;
		-webkit-mask-image: linear-gradient(to right, var(--bc-ink) calc(100% - 34px), transparent);
		mask-image: linear-gradient(to right, var(--bc-ink) calc(100% - 34px), transparent);
	}

	.daynight-inventory-mobile__tools::-webkit-scrollbar {
		display: none;
	}

	.daynight-inventory-mobile__tools a,
	.daynight-inventory-mobile__tools button {
		display: inline-flex;
		min-width: 0;
		flex: 0 0 auto;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		padding: 0 var(--bc-space-3);
		appearance: none;
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
		text-decoration: none;
		white-space: nowrap;
	}

	.daynight-inventory-mobile__tools button.active {
		background: var(--bc-accent);
		box-shadow: none;
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tools button:focus-visible,
	.daynight-inventory-mobile__tools a:focus-visible {
		background: var(--bc-accent-hover);
		box-shadow: none;
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tool-choice:focus-visible span,
	.daynight-inventory-mobile__tool-choice:focus-visible strong,
	.daynight-inventory-mobile__tool-choice:focus-visible :global(svg) {
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tools button.daynight-inventory-mobile__tool-choice {
		gap: 6px;
		padding-right: 10px;
	}

	.daynight-inventory-mobile__tool-choice span {
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
	}

	.daynight-inventory-mobile__tool-choice.active span {
		color: var(--bc-white);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
		text-transform: none;
	}

	.daynight-inventory-mobile__tool-choice strong {
		display: block;
		min-width: 0;
		max-width: min(42vw, 138px);
		overflow: hidden;
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-inventory-mobile__tool-choice :global(svg) {
		flex: 0 0 auto;
	}

	.daynight-inventory-mobile__tool-clear {
		min-height: var(--bc-control-height-standard);
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		font-size: var(--bc-text-filter);
		line-height: var(--bc-leading-filter);
		font-weight: var(--bc-weight-control);
	}

	.daynight-inventory-mobile__cards {
		display: grid;
		min-width: 0;
		gap: var(--bc-space-3);
		margin-top: 8px;
	}

	.daynight-inventory-mobile__empty {
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		padding: 18px;
	}

	.daynight-inventory-mobile__empty h2 {
		margin: 0 0 6px;
		font-size: 18px;
		line-height: 24px;
	}

	.daynight-inventory-mobile__empty p {
		margin: 0 0 12px;
		color: var(--bc-muted);
	}

	.daynight-inventory-mobile__empty a {
		color: var(--bc-accent);
		font-weight: var(--bc-weight-heading);
	}

	:global(.daynight-inventory-mobile-drawer__backdrop) {
		position: fixed;
		inset: 0;
		display: block;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.34);
		cursor: pointer;
	}

	:global(.daynight-inventory-mobile-drawer__backdrop span) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.daynight-inventory-mobile-drawer__sheet[data-vaul-drawer]) {
		position: fixed;
		right: 0;
		/* Lifted above the on-screen keyboard on iOS; --bc-kb-inset stays ~0 on Android,
		   where interactive-widget=resizes-content already lifts the layout. vaul's own
		   repositionInputs is disabled (it conflicts with that meta and collapses the sheet). */
		bottom: var(--bc-kb-inset, 0px);
		left: 0;
		display: grid;
		z-index: 1201;
		height: auto;
		max-height: min(calc(86dvh - var(--bc-kb-inset, 0px)), 720px);
		align-content: start;
		gap: var(--bc-space-4);
		grid-auto-rows: max-content;
		overflow: hidden;
		border-radius: 18px 18px 0 0;
		background: var(--bc-bg);
		outline: 0;
		padding: 10px 16px max(22px, env(safe-area-inset-bottom));
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	/* Inventory search = full-screen overlay. Input pinned top; chips scroll below; the
	   keyboard opens beneath the input and never fights the panel. Appears instantly. */
	.daynight-inventory-mobile-search-overlay {
		position: fixed;
		inset: 0;
		z-index: 1300;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		background: var(--bc-bg);
		color: var(--bc-ink, var(--bc-ink));
	}

	.daynight-inventory-mobile-search-overlay__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: max(12px, env(safe-area-inset-top)) 16px 12px;
	}

	.daynight-inventory-mobile-search-overlay__close {
		display: flex;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		flex: 0 0 40px;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: inherit;
		cursor: pointer;
		padding: 0;
	}

	.daynight-inventory-mobile-search-overlay__scroll {
		display: grid;
		min-height: 0;
		gap: var(--bc-space-4);
		align-content: start;
		grid-auto-rows: max-content;
		overflow-y: auto;
		padding: 16px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.daynight-inventory-mobile-search-overlay__scroll::-webkit-scrollbar {
		display: none;
	}

	.daynight-inventory-mobile-search-overlay .daynight-inventory-mobile-drawer__search-form {
		min-height: 0;
		grid-template-rows: max-content minmax(0, 1fr) max-content;
		overflow: hidden;
	}

	.daynight-inventory-mobile-search-overlay .daynight-inventory-mobile-drawer__search-box {
		margin: 16px 16px 0;
	}

	/* Pinned footer CTA: the form's last grid row, flush at the bottom of the screen. */
	.daynight-inventory-mobile-search-overlay__cta {
		border-radius: 12px;
		margin: 12px 16px max(14px, env(safe-area-inset-bottom));
		min-height: 52px;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--filters[data-vaul-drawer]) {
		max-height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
		padding-bottom: 0;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--full[data-vaul-drawer]) {
		height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
	}

	:global(.daynight-inventory-mobile-drawer__sheet--with-actions[data-vaul-drawer]) {
		grid-template-rows: max-content max-content max-content minmax(0, 1fr) max-content;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--full[data-vaul-drawer]) {
		grid-template-rows: max-content max-content max-content max-content minmax(0, 1fr) max-content;
	}
	:global(.daynight-inventory-mobile-drawer__sheet--fullscreen[data-vaul-drawer]) {
		top: 0;
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		max-height: calc(100dvh - var(--bc-kb-inset, 0px));
		border-radius: 0;
		padding-top: max(var(--bc-space-3), env(safe-area-inset-top));
		grid-template-rows: max-content max-content max-content minmax(0, 1fr) max-content;
	}

	:global(.daynight-inventory-mobile-drawer__sheet[data-vaul-drawer]::-webkit-scrollbar) {
		display: none;
	}

	:global(.daynight-inventory-mobile-drawer__handle[data-vaul-handle]) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.daynight-inventory-mobile-drawer__handle[data-vaul-handle])::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 44px;
		height: 5px;
		transform: translate(-50%, -50%);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border);
		content: '';
	}

	:global(.daynight-inventory-mobile-drawer__handle [data-vaul-handle-hitarea]) {
		position: absolute;
		inset: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		transform: none;
	}

	:global(.daynight-inventory-mobile-drawer__sheet header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
	}

	:global(.daynight-inventory-mobile-drawer__sheet header div) {
		min-width: 0;
	}

	.daynight-inventory-mobile-drawer__title {
		display: block;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}

	.daynight-inventory-mobile-drawer__description {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.daynight-inventory-mobile-drawer__sheet header button) {
		display: flex;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--bc-control-height-standard);
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface);
		color: var(--bc-ink);
		cursor: pointer;
		padding: 0;
	}

	.daynight-inventory-mobile-drawer__search-form {
		display: grid;
		gap: var(--bc-space-3);
	}

	.daynight-inventory-mobile-drawer__search-box {
		display: flex;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		gap: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		padding: 0 var(--bc-space-3);
		color: var(--bc-ink);
	}

	.daynight-inventory-mobile-drawer__search-box--submit {
		padding-right: 6px;
	}

	.daynight-inventory-mobile-drawer__search-box input {
		min-width: 0;
		width: 100%;
		height: var(--bc-control-height-primary);
		flex: 1 1 auto;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--bc-ink);
		/* >=16px stops iOS Safari from auto-zooming (and shifting the vaul sheet) on focus. */
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
		outline: 0;
		padding: 0 !important;
		appearance: none;
	}

	.daynight-inventory-mobile-drawer__search-box input::-webkit-search-cancel-button {
		appearance: none;
	}

	.daynight-inventory-mobile-drawer__search-box:focus-within {
		outline: 2px solid var(--bc-ink);
		outline-offset: 2px;
	}

	.daynight-inventory-mobile-drawer__search-submit {
		display: inline-flex;
		width: var(--bc-control-height-standard);
		min-width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		min-height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		appearance: none;
		color: var(--bc-white);
		cursor: pointer;
		padding: 0;
	}

	.daynight-inventory-mobile-drawer__search-submit :global(svg),
	.daynight-inventory-mobile-drawer__search-submit :global(path) {
		stroke: var(--bc-white);
	}

	.daynight-inventory-mobile-drawer__search-submit:focus-visible,
	.daynight-inventory-mobile-drawer__group a:focus-visible,
	.daynight-inventory-mobile-drawer__group button:focus-visible,
	.daynight-inventory-mobile-drawer__clear:focus-visible,
	.daynight-inventory-mobile-drawer__done:focus-visible {
		outline: 2px solid var(--bc-ink);
		outline-offset: 2px;
	}

	.daynight-inventory-mobile-drawer__body {
		display: grid;
		min-height: 0;
		overflow-y: auto;
		gap: var(--bc-space-4);
		padding-bottom: 2px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.daynight-inventory-mobile-drawer__body::-webkit-scrollbar {
		display: none;
	}

	.daynight-inventory-mobile-drawer__group {
		display: grid;
		gap: var(--bc-space-2);
	}

	.daynight-inventory-mobile-drawer__group p {
		margin: 0;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-inventory-mobile-drawer__group div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}

	.daynight-inventory-mobile-drawer__group--logos div {
		flex-wrap: nowrap;
		overflow-x: auto;
		padding-bottom: 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.daynight-inventory-mobile-drawer__group--logos div::-webkit-scrollbar {
		display: none;
	}

	.daynight-inventory-mobile-drawer__group a,
	.daynight-inventory-mobile-drawer__group button,
	.daynight-inventory-mobile-drawer__clear {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		padding: 0 var(--bc-space-3);
		appearance: none;
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		text-align: left;
	}

	.daynight-inventory-mobile-drawer__group--logos a {
		width: 86px;
		min-width: 86px;
		min-height: 68px;
		justify-content: center;
		flex-direction: column;
		gap: 6px;
		padding: var(--bc-space-2) 5px;
		font-size: var(--bc-text-control);
		text-align: center;
		line-height: var(--bc-leading-control);
		font-weight: var(--bc-weight-control);
	}

	.daynight-inventory-mobile-drawer__group a.active,
	.daynight-inventory-mobile-drawer__group button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	.daynight-inventory-mobile-drawer__brand-logo-frame {
		display: flex;
		width: 40px;
		height: 28px;
		align-items: center;
		justify-content: center;
		flex: 0 0 28px;
	}

	.daynight-inventory-mobile-drawer__brand-logo {
		display: block;
		max-width: 40px;
		max-height: 26px;
		object-fit: contain;
	}

	.daynight-inventory-mobile-drawer__group--logos a > span:last-child {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__group button span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__group button small {
		display: inline-flex;
		min-width: 21px;
		height: 21px;
		align-items: center;
		justify-content: center;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}

	.daynight-inventory-mobile-drawer__empty-option {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-soft);
		color: var(--bc-muted);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-3);
	}

	.daynight-inventory-mobile-drawer__actions {
		position: sticky;
		bottom: 0;
		z-index: 3;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: var(--bc-space-2);
		margin: 2px calc(-1 * var(--bc-space-4)) 0;
		border-top: 1px solid var(--bc-border);
		background: var(--bc-bg);
		padding: var(--bc-space-3) var(--bc-space-4)
			max(var(--bc-mobile-gutter), env(safe-area-inset-bottom));
		box-shadow: var(--bc-shadow-sticky);
	}

	.daynight-inventory-mobile-drawer__clear {
		justify-content: center;
		min-height: var(--bc-control-height-primary);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.daynight-inventory-mobile-drawer__clear--search {
		gap: var(--bc-space-2);
		background: var(--bc-accent);
		color: var(--bc-white);
		font-weight: var(--bc-weight-heading);
		text-align: center;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__clear--search small {
		display: inline-flex;
		min-width: 23px;
		height: 23px;
		align-items: center;
		justify-content: center;
		border-radius: var(--bc-radius-pill);
		background: rgba(255, 255, 255, 0.72);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}

	.daynight-inventory-mobile-drawer__done {
		display: inline-flex;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-accent);
		appearance: none;
		color: var(--bc-white);
		cursor: pointer;
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-cta);
	}
</style>
