<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		ArrowUpDown,
		Calendar,
		ChevronDown,
		Cog,
		Fuel,
		Gauge,
		Search,
		SlidersHorizontal,
		X
	} from '@lucide/svelte';
	import { tick } from 'svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Drawer } from 'vaul-svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';

	type FilterDrawerMode =
		| 'all'
		| 'brand'
		| 'model'
		| 'sort'
		| 'fuel'
		| 'mileage'
		| 'body'
		| 'price'
		| 'extras';
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
		mobile
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
	} = $props();

	const filterDrawerIds = {
		all: 'eliqauto-inventory-mobile-filter-drawer',
		body: 'eliqauto-inventory-mobile-body-drawer',
		brand: 'eliqauto-inventory-mobile-brand-drawer',
		extras: 'eliqauto-inventory-mobile-extras-drawer',
		fuel: 'eliqauto-inventory-mobile-fuel-drawer',
		mileage: 'eliqauto-inventory-mobile-mileage-drawer',
		model: 'eliqauto-inventory-mobile-model-drawer',
		price: 'eliqauto-inventory-mobile-price-drawer',
		sort: 'eliqauto-inventory-mobile-sort-drawer'
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
	let filterDrawerOpen = $state(false);
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
	const transmissionSelected = $derived(
		mobile.transmissionOptions.some((option) => option.active && option.value)
	);
	const yearSelected = $derived(mobile.yearOptions.some((option) => option.active && option.value));
	const drawerFilterSelected = $derived(
		bodySelected ||
			extrasSelected ||
			fuelSelected ||
			mileageSelected ||
			priceSelected ||
			transmissionSelected ||
			yearSelected
	);
	const sortSelected = $derived(
		mobile.sortOptions.some((option) => option.active && option.value !== 'best-match')
	);
	const hasActiveFilters = $derived(mobile.activeFilters.length > 0);
	const mobileSearchShowAllLabel = $derived(
		mobile.countLabel.toLocaleLowerCase().startsWith('all') ? 'Show all' : 'Покажи всички'
	);
	const mobileSearchCount = $derived(mobile.countLabel.match(/\d+/)?.[0] ?? '');
	const filterDrawerId = $derived(filterDrawerIds[filterDrawerMode]);
	const filterDrawerHasActions = $derived(
		filterDrawerMode === 'all' || filterDrawerMode === 'brand' || filterDrawerMode === 'model'
	);
	const filterDrawerKicker = $derived(
		filterDrawerMode === 'sort' ? mobile.sortLabel : mobile.filterLabel
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
		if (!filterDraftChanged) {
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
	const fallbackImage = '/assets/images/card/card-48.jpg';
	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (!image.src.endsWith(fallbackImage)) {
			image.src = fallbackImage;
		}
	};
	const mobileImage = (card: AuxeroInventoryVehicleCard) => card.image;
</script>

<div class="eliqauto-inventory-mobile">
	<main class="eliqauto-inventory-mobile__main">
		<section class="eliqauto-inventory-mobile__hero" aria-labelledby="inventory-mobile-title">
			<div>
				<h1 id="inventory-mobile-title">Търси автомобили</h1>
				<p>{mobile.countLabel}. Избери модел според бюджет и начин на покупка.</p>
			</div>
			<img
				src="/assets/eliqauto/hero/inventory-premium-pair-cutout-v1.webp"
				alt=""
				width="1915"
				height="821"
				loading="eager"
				decoding="async"
				aria-hidden="true"
			/>
		</section>
		<div class="eliqauto-inventory-mobile__search">
			<div class="eliqauto-inventory-mobile__search-field">
				<button
					type="button"
					class="eliqauto-inventory-mobile__search-label"
					aria-haspopup="dialog"
					aria-controls="eliqauto-inventory-mobile-search-drawer"
					aria-expanded={searchDrawerOpen}
					onclick={openSearchDrawer}
				>
					<span class:active={Boolean(mobile.searchValue)}>
						{mobile.searchDisplayValue || mobile.searchPlaceholder}
					</span>
				</button>
				<button
					type="button"
					class="eliqauto-inventory-mobile__search-action"
					aria-label={mobile.searchLabel}
					aria-controls="eliqauto-inventory-mobile-search-drawer"
					aria-expanded={searchDrawerOpen}
					onclick={openSearchDrawer}
				>
					<Search size={19} strokeWidth={2.2} aria-hidden="true" />
				</button>
			</div>
		</div>

		<nav class="eliqauto-inventory-mobile__tools" aria-label={mobile.filterLabel}>
			<button
				type="button"
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={drawerFilterSelected}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.all}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'all'}
				onclick={() => openFilterDrawer('all')}
			>
				<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.filterLabel}</span>
				{#if hasActiveFilters}
					<strong>{mobile.activeFilters.length}</strong>
				{/if}
			</button>
			<button
				type="button"
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={sortSelected}
				aria-label={`${mobile.sortLabel}: ${mobile.sortValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.sort}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'sort'}
				onclick={() => openFilterDrawer('sort')}
			>
				<ArrowUpDown size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.sortLabel}</span>
				{#if sortSelected}
					<strong>{mobile.sortValue}</strong>
				{/if}
			</button>
			<button
				type="button"
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={brandSelected}
				aria-label={`${mobile.brandLabel}: ${mobile.brandValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.brand}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={modelSelected}
				aria-label={`${mobile.modelLabel}: ${mobile.modelValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.model}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={fuelSelected}
				aria-label={`${mobile.fuelLabel}: ${mobile.fuelValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.fuel}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={mileageSelected}
				aria-label={`${mobile.mileageLabel}: ${mobile.mileageValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.mileage}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={bodySelected}
				aria-label={`${mobile.bodyLabel}: ${bodyValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.body}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={priceSelected}
				aria-label={`${mobile.priceLabel}: ${mobile.priceValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.price}
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
				class="eliqauto-inventory-mobile__tool-choice"
				class:active={extrasSelected}
				aria-label={`${mobile.extrasLabel}: ${mobile.featureValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.extras}
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
					class="eliqauto-inventory-mobile__tool-clear"
					href={resolve(mobile.clearHref as '/inventory')}
				>
					{mobile.clearLabel}
				</a>
			{/if}
		</nav>

		<section class="eliqauto-inventory-mobile__cards" aria-label={mobile.countLabel}>
			{#each cards as card (card.slug)}
				<article class="eliqauto-inventory-mobile-card">
					<a
						class="eliqauto-inventory-mobile-card__image"
						href={resolve('/inventory/[slug]', { slug: card.slug })}
					>
						<img
							src={mobileImage(card)}
							alt={card.title}
							width="660"
							height="440"
							loading="lazy"
							decoding="async"
							onerror={useFallbackImage}
						/>
						<span>{card.tag}</span>
					</a>
					<div class="eliqauto-inventory-mobile-card__body">
						<p>{card.brand}</p>
						<h2>
							<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
						</h2>
						<strong>{card.priceLabel}</strong>
						<small>{card.monthlyLabel}</small>
						<ul>
							<li><Gauge size={14} strokeWidth={2} aria-hidden="true" />{card.mileageLabel}</li>
							<li><Calendar size={14} strokeWidth={2} aria-hidden="true" />{card.year}</li>
							<li><Fuel size={14} strokeWidth={2} aria-hidden="true" />{card.fuel}</li>
							<li><Cog size={14} strokeWidth={2} aria-hidden="true" />{card.transmission}</li>
						</ul>
					</div>
				</article>
			{:else}
				<div class="eliqauto-inventory-mobile__empty">
					<h2>{copy.emptyTitle}</h2>
					<p>{copy.emptyBody}</p>
					<a href={resolve('/inventory')}>{copy.reset}</a>
				</div>
			{/each}
		</section>
	</main>

	{#if searchDrawerOpen}
		<!-- Full-screen search overlay (replaces the old bottom drawer): input pinned top so
		     the keyboard opens beneath it and never fights the panel. Appears instantly. -->
		<div
			id="eliqauto-inventory-mobile-search-drawer"
			class="eliqauto-inventory-mobile-search-overlay"
			role="dialog"
			aria-modal="true"
			aria-label={mobile.searchDrawerTitle}
		>
			<header class="eliqauto-inventory-mobile-search-overlay__bar">
				<span class="eliqauto-inventory-mobile-drawer__title">
					{mobile.searchDrawerTitle}
				</span>
				<button
					type="button"
					class="eliqauto-inventory-mobile-search-overlay__close"
					aria-label={mobile.closeLabel}
					onclick={closeSearchDrawer}
				>
					<X size={20} strokeWidth={2.4} aria-hidden="true" />
				</button>
			</header>
			<form
				class="eliqauto-inventory-mobile-drawer__search-form"
				action={resolve('/inventory')}
				method="get"
			>
				{#each mobile.hiddenInputs as input (`${input.name}-${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				<div
					class="eliqauto-inventory-mobile-drawer__search-box eliqauto-inventory-mobile-drawer__search-box--submit"
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
						class="eliqauto-inventory-mobile-drawer__search-submit"
						aria-label={mobile.searchLabel}
					>
						<Search size={18} strokeWidth={2.25} aria-hidden="true" />
					</button>
				</div>
				<div class="eliqauto-inventory-mobile-search-overlay__scroll">
					<div
						class="eliqauto-inventory-mobile-drawer__group eliqauto-inventory-mobile-drawer__group--logos"
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
										<span class="eliqauto-inventory-mobile-drawer__brand-logo-frame">
											<img
												class="eliqauto-inventory-mobile-drawer__brand-logo"
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					class="eliqauto-inventory-mobile-drawer__clear eliqauto-inventory-mobile-drawer__clear--search eliqauto-inventory-mobile-search-overlay__cta"
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
		<Drawer.Overlay class="eliqauto-inventory-mobile-drawer__backdrop">
			<span>{mobile.closeLabel}</span>
		</Drawer.Overlay>
		<Drawer.Content
			id={filterDrawerId}
			class={`eliqauto-inventory-mobile-drawer__sheet eliqauto-inventory-mobile-drawer__sheet--filters ${filterDrawerMode === 'all' ? 'eliqauto-inventory-mobile-drawer__sheet--full' : ''} ${filterDrawerHasActions ? 'eliqauto-inventory-mobile-drawer__sheet--with-actions' : ''}`}
		>
			<Drawer.Handle class="eliqauto-inventory-mobile-drawer__handle" />
			<header>
				<div>
					<p>{filterDrawerKicker}</p>
					<Drawer.Title>
						<span class="eliqauto-inventory-mobile-drawer__title">
							{filterDrawerTitle}
						</span>
					</Drawer.Title>
				</div>
				<button type="button" aria-label={mobile.closeLabel} onclick={closeFilterDrawer}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description>
				<span class="eliqauto-inventory-mobile-drawer__description">
					{mobile.countLabel}
				</span>
			</Drawer.Description>
			<div class="eliqauto-inventory-mobile-drawer__body" data-vaul-no-drag>
				{#if filterDrawerMode === 'brand'}
					<div class="eliqauto-inventory-mobile-drawer__group">
						<label class="eliqauto-inventory-mobile-drawer__search-box">
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
												class="eliqauto-inventory-mobile-drawer__brand-logo"
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
							<span class="eliqauto-inventory-mobile-drawer__empty-option">
								{mobile.noMatchesLabel}
							</span>
						{/if}
					</div>
				{/if}
				{#if filterDrawerMode === 'model'}
					<div class="eliqauto-inventory-mobile-drawer__group">
						<label class="eliqauto-inventory-mobile-drawer__search-box">
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
							<span class="eliqauto-inventory-mobile-drawer__empty-option">
								{mobile.noMatchesLabel}
							</span>
						{/if}
					</div>
				{/if}
				{#if filterDrawerMode === 'all' || filterDrawerMode === 'body'}
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'all'}
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
					<div class="eliqauto-inventory-mobile-drawer__group">
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
				<div class="eliqauto-inventory-mobile-drawer__actions">
					<button
						type="button"
						class="eliqauto-inventory-mobile-drawer__clear"
						onclick={clearFilterDraft}
					>
						{mobile.clearLabel}
					</button>
					<button
						type="button"
						class="eliqauto-inventory-mobile-drawer__done"
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
		background: var(--bc-surface);
		background-color: var(--bc-surface);
	}

	.eliqauto-inventory-mobile {
		width: 100%;
		max-width: 100vw;
		overflow-x: hidden;
		min-height: 100vh;
		background: var(--bc-surface);
		color: #111111;
	}

	.eliqauto-inventory-mobile__main {
		display: grid;
		width: 100%;
		max-width: 100vw;
		min-width: 0;
		gap: 10px;
		overflow-x: hidden;
		padding: max(14px, env(safe-area-inset-top)) 14px 92px;
	}

	.eliqauto-inventory-mobile__hero {
		position: relative;
		isolation: isolate;
		display: block;
		min-height: 246px;
		margin: -14px -14px 24px;
		overflow: hidden;
		background: #b5121b;
		color: #ffffff;
		padding: 26px 18px 142px;
	}

	.eliqauto-inventory-mobile__hero > div {
		position: relative;
		z-index: 2;
		width: min(62%, 230px);
	}

	.eliqauto-inventory-mobile__hero h1 {
		margin: 0;
		color: #ffffff;
		font-size: 30px;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.eliqauto-inventory-mobile__hero p {
		margin: 10px 0 0;
		color: rgb(255 255 255 / 0.84);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.4;
	}

	.eliqauto-inventory-mobile__hero img {
		position: absolute;
		right: -22%;
		bottom: 8px;
		z-index: 1;
		display: block;
		width: 106%;
		height: 148px;
		max-width: none;
		object-fit: contain;
		object-position: right bottom;
		pointer-events: none;
		user-select: none;
	}

	.eliqauto-inventory-mobile__search {
		position: relative;
		z-index: 2;
		display: block;
		min-width: 0;
		margin-top: -52px;
	}

	.eliqauto-inventory-mobile__search-field {
		display: flex;
		width: 100%;
		max-width: 100%;
		min-height: 50px;
		min-width: 0;
		align-items: center;
		gap: 10px;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 1px 2px rgba(23, 31, 18, 0.06);
		padding: 5px 5px 5px 14px;
		color: #1c1c1c;
	}

	.eliqauto-inventory-mobile__search-label {
		display: flex;
		overflow: hidden;
		min-width: 0;
		height: 44px;
		flex: 1 1 auto;
		align-items: center;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		cursor: pointer;
		padding: 0;
		text-align: left;
	}

	.eliqauto-inventory-mobile__search-label span {
		display: block;
		min-width: 0;
		overflow: hidden;
		color: #586070;
		font-size: 15px;
		font-weight: 600;
		line-height: 21px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile__search-label span.active {
		color: #1c1c1c;
	}

	.eliqauto-inventory-mobile__search-action {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0;
		border-radius: 999px;
		background: #1c1c1c;
		box-shadow: none;
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-inventory-mobile__search-action :global(svg),
	.eliqauto-inventory-mobile__search-action :global(path) {
		stroke: #ffffff;
	}

	.eliqauto-inventory-mobile__search-label:focus-visible,
	.eliqauto-inventory-mobile__search-action:focus-visible {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.eliqauto-inventory-mobile__tools {
		display: flex;
		min-width: 0;
		gap: 8px;
		margin: 0 -14px;
		overflow-x: auto;
		padding: 0 14px 2px;
		scrollbar-width: none;
		-webkit-mask-image: linear-gradient(to right, #000 calc(100% - 34px), transparent);
		mask-image: linear-gradient(to right, #000 calc(100% - 34px), transparent);
	}

	.eliqauto-inventory-mobile__tools::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-inventory-mobile__tools a,
	.eliqauto-inventory-mobile__tools button {
		display: inline-flex;
		min-width: 0;
		flex: 0 0 auto;
		min-height: 44px;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 10px;
		background: #ffffff;
		padding: 0 13px;
		appearance: none;
		color: #1c1c1c;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		text-decoration: none;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile__tools button.active {
		background: #a51717;
		box-shadow: none;
		color: #ffffff;
	}

	.eliqauto-inventory-mobile__tools button:focus-visible,
	.eliqauto-inventory-mobile__tools a:focus-visible {
		background: #a51717;
		box-shadow: none;
		color: #ffffff;
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.eliqauto-inventory-mobile__tools button.eliqauto-inventory-mobile__tool-choice {
		gap: 6px;
		padding-right: 10px;
	}

	.eliqauto-inventory-mobile__tool-choice span {
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-inventory-mobile__tool-choice.active span {
		color: #ffffff;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 12px;
		text-transform: uppercase;
	}

	.eliqauto-inventory-mobile__tool-choice.active strong {
		color: #ffffff;
	}

	.eliqauto-inventory-mobile__tool-choice strong {
		display: block;
		min-width: 0;
		max-width: min(42vw, 138px);
		overflow: hidden;
		color: #111111;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile__tool-choice :global(svg) {
		flex: 0 0 auto;
	}

	.eliqauto-inventory-mobile__tool-clear {
		min-height: 44px;
		border: 0;
		border-radius: 10px;
		background: #ffffff;
		font-size: 13px;
	}

	.eliqauto-inventory-mobile__cards {
		display: grid;
		min-width: 0;
		gap: 10px;
		margin-top: 8px;
	}

	.eliqauto-inventory-mobile-card {
		display: grid;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		grid-template-columns: 132px minmax(0, 1fr);
		min-height: 154px;
		overflow: hidden;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 1px 3px rgba(23, 31, 18, 0.08);
	}

	.eliqauto-inventory-mobile-card__image {
		position: relative;
		display: block;
		min-height: 154px;
		overflow: hidden;
	}

	.eliqauto-inventory-mobile-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 154px;
		object-fit: cover;
	}

	.eliqauto-inventory-mobile-card__image span {
		position: absolute;
		top: 8px;
		left: 8px;
		min-height: 26px;
		border-radius: 999px;
		background: #a51717;
		padding: 0 10px;
		color: #ffffff;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 26px;
		text-transform: uppercase;
	}

	.eliqauto-inventory-mobile-card__body {
		display: grid;
		min-width: 0;
		align-content: start;
		overflow: hidden;
		padding: 10px 10px 10px 11px;
	}

	.eliqauto-inventory-mobile-card__body p {
		margin: 0 0 2px;
		color: #637184;
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 13px;
		text-transform: uppercase;
	}

	.eliqauto-inventory-mobile-card__body h2 {
		display: -webkit-box;
		min-width: 0;
		margin: 0 0 5px;
		overflow: hidden;
		color: #101010;
		font-size: 16px;
		font-weight: 600;
		line-height: 21px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.eliqauto-inventory-mobile-card__body h2 a {
		display: -webkit-box;
		min-width: 0;
		overflow: hidden;
		color: inherit;
		font-size: inherit;
		font-weight: 600;
		line-height: inherit;
		overflow-wrap: anywhere;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.eliqauto-inventory-mobile-card__body strong {
		color: #a51717;
		font-size: 18px;
		font-weight: 800;
		line-height: 21px;
	}

	.eliqauto-inventory-mobile-card__body small {
		margin-bottom: 7px;
		color: #67717d;
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 14px;
	}

	.eliqauto-inventory-mobile-card__body ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.eliqauto-inventory-mobile-card__body li {
		display: flex;
		min-width: 0;
		min-height: 28px;
		align-items: center;
		justify-content: flex-start;
		gap: 5px;
		overflow: hidden;
		border-radius: 8px;
		background: #fff7f7;
		padding: 0 8px;
		color: #4b5563;
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 15px;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile-card__body li :global(svg) {
		flex: 0 0 auto;
	}

	.eliqauto-inventory-mobile__empty {
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 18px;
	}

	.eliqauto-inventory-mobile__empty h2 {
		margin: 0 0 6px;
		font-size: 18px;
		line-height: 24px;
	}

	.eliqauto-inventory-mobile__empty p {
		margin: 0 0 12px;
		color: #67717d;
	}

	.eliqauto-inventory-mobile__empty a {
		color: #a51717;
		font-weight: 800;
	}

	:global(.eliqauto-inventory-mobile-drawer__backdrop) {
		position: fixed;
		inset: 0;
		display: block;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.34);
		cursor: pointer;
	}

	:global(.eliqauto-inventory-mobile-drawer__backdrop span) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet[data-vaul-drawer]) {
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
		gap: 16px;
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
	.eliqauto-inventory-mobile-search-overlay {
		position: fixed;
		inset: 0;
		z-index: 1300;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		background: var(--bc-bg);
		color: var(--bc-ink, #111111);
	}

	.eliqauto-inventory-mobile-search-overlay__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: max(12px, env(safe-area-inset-top)) 16px 12px;
	}

	.eliqauto-inventory-mobile-search-overlay__close {
		display: flex;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		flex: 0 0 40px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: inherit;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-inventory-mobile-search-overlay__scroll {
		display: grid;
		min-height: 0;
		gap: 16px;
		align-content: start;
		grid-auto-rows: max-content;
		overflow-y: auto;
		padding: 16px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.eliqauto-inventory-mobile-search-overlay__scroll::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-inventory-mobile-search-overlay .eliqauto-inventory-mobile-drawer__search-form {
		min-height: 0;
		grid-template-rows: max-content minmax(0, 1fr) max-content;
		overflow: hidden;
	}

	.eliqauto-inventory-mobile-search-overlay .eliqauto-inventory-mobile-drawer__search-box {
		margin: 16px 16px 0;
	}

	/* Pinned footer CTA: the form's last grid row, flush at the bottom of the screen. */
	.eliqauto-inventory-mobile-search-overlay__cta {
		border-radius: 12px;
		margin: 12px 16px max(14px, env(safe-area-inset-bottom));
		min-height: 52px;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet--filters[data-vaul-drawer]) {
		max-height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
		padding-bottom: 0;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet--full[data-vaul-drawer]) {
		height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet--with-actions[data-vaul-drawer]) {
		grid-template-rows: max-content max-content max-content minmax(0, 1fr) max-content;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet[data-vaul-drawer]::-webkit-scrollbar) {
		display: none;
	}

	:global(.eliqauto-inventory-mobile-drawer__handle[data-vaul-handle]) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.eliqauto-inventory-mobile-drawer__handle[data-vaul-handle])::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 44px;
		height: 5px;
		transform: translate(-50%, -50%);
		border-radius: 999px;
		background: var(--bc-border);
		content: '';
	}

	:global(.eliqauto-inventory-mobile-drawer__handle [data-vaul-handle-hitarea]) {
		position: absolute;
		inset: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		transform: none;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet header div) {
		min-width: 0;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet header p) {
		margin: 0 0 2px;
		color: #a51717;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 14px;
		text-transform: uppercase;
	}

	.eliqauto-inventory-mobile-drawer__title {
		display: block;
		color: #111111;
		font-size: 22px;
		font-weight: 800;
		line-height: 28px;
	}

	.eliqauto-inventory-mobile-drawer__description {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.eliqauto-inventory-mobile-drawer__sheet header button) {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface);
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-inventory-mobile-drawer__search-form {
		display: grid;
		gap: 10px;
	}

	.eliqauto-inventory-mobile-drawer__search-box {
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: var(--bc-surface);
		padding: 0 13px;
		color: #111111;
	}

	.eliqauto-inventory-mobile-drawer__search-box--submit {
		padding-right: 6px;
	}

	.eliqauto-inventory-mobile-drawer__search-box input {
		min-width: 0;
		width: 100%;
		height: 48px;
		flex: 1 1 auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: #111111;
		/* >=16px stops iOS Safari from auto-zooming (and shifting the vaul sheet) on focus. */
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		outline: 0;
		padding: 0;
		appearance: none;
	}

	.eliqauto-inventory-mobile-drawer__search-box input::-webkit-search-cancel-button {
		appearance: none;
	}

	.eliqauto-inventory-mobile-drawer__search-box:focus-within {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.eliqauto-inventory-mobile-drawer__search-submit {
		display: inline-flex;
		width: 42px;
		min-width: 42px;
		height: 42px;
		min-height: 42px;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		border: 0;
		border-radius: 999px;
		background: #a51717;
		appearance: none;
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-inventory-mobile-drawer__search-submit :global(svg),
	.eliqauto-inventory-mobile-drawer__search-submit :global(path) {
		stroke: #ffffff;
	}

	.eliqauto-inventory-mobile-drawer__search-submit:focus-visible,
	.eliqauto-inventory-mobile-drawer__group a:focus-visible,
	.eliqauto-inventory-mobile-drawer__group button:focus-visible,
	.eliqauto-inventory-mobile-drawer__clear:focus-visible,
	.eliqauto-inventory-mobile-drawer__done:focus-visible {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.eliqauto-inventory-mobile-drawer__body {
		display: grid;
		min-height: 0;
		overflow-y: auto;
		gap: 16px;
		padding-bottom: 2px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.eliqauto-inventory-mobile-drawer__body::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-inventory-mobile-drawer__group {
		display: grid;
		gap: 9px;
	}

	.eliqauto-inventory-mobile-drawer__group p {
		margin: 0;
		color: #586070;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-inventory-mobile-drawer__group div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.eliqauto-inventory-mobile-drawer__group--logos div {
		flex-wrap: nowrap;
		overflow-x: auto;
		padding-bottom: 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.eliqauto-inventory-mobile-drawer__group--logos div::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-inventory-mobile-drawer__group a,
	.eliqauto-inventory-mobile-drawer__group button,
	.eliqauto-inventory-mobile-drawer__clear {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 0 12px;
		appearance: none;
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		text-align: left;
	}

	.eliqauto-inventory-mobile-drawer__group--logos a {
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

	.eliqauto-inventory-mobile-drawer__group a.active,
	.eliqauto-inventory-mobile-drawer__group button.active {
		background: #a51717;
		color: #ffffff;
	}

	.eliqauto-inventory-mobile-drawer__group a.active span,
	.eliqauto-inventory-mobile-drawer__group button.active span {
		color: #ffffff;
	}

	.eliqauto-inventory-mobile-drawer__brand-logo-frame {
		display: flex;
		width: 40px;
		height: 28px;
		align-items: center;
		justify-content: center;
		flex: 0 0 28px;
	}

	.eliqauto-inventory-mobile-drawer__brand-logo {
		display: block;
		max-width: 40px;
		max-height: 26px;
		object-fit: contain;
	}

	.eliqauto-inventory-mobile-drawer__group--logos a > span:last-child {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile-drawer__group button span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile-drawer__group button small {
		display: inline-flex;
		min-width: 21px;
		height: 21px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #ffffff;
		color: #67717d;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 21px;
	}

	.eliqauto-inventory-mobile-drawer__empty-option {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		border-radius: 8px;
		background: var(--bc-surface-soft);
		color: #586070;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 0 12px;
	}

	.eliqauto-inventory-mobile-drawer__actions {
		position: sticky;
		bottom: 0;
		z-index: 3;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 9px;
		margin: 2px -16px 0;
		border-top: 1px solid #f0dddd;
		background: var(--bc-bg);
		padding: 12px 16px max(14px, env(safe-area-inset-bottom));
		box-shadow: 0 -14px 22px rgba(251, 252, 250, 0.95);
	}

	.eliqauto-inventory-mobile-drawer__clear {
		justify-content: center;
		min-height: 50px;
		border-radius: 10px;
		background: var(--bc-surface);
		color: #1c1c1c;
	}

	.eliqauto-inventory-mobile-drawer__clear--search {
		gap: 8px;
		background: #a51717;
		color: #ffffff;
		font-weight: 800;
		text-align: center;
		white-space: nowrap;
	}

	.eliqauto-inventory-mobile-drawer__clear--search span {
		color: #ffffff;
	}

	.eliqauto-inventory-mobile-drawer__clear--search small {
		display: inline-flex;
		min-width: 23px;
		height: 23px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		color: #2a0c0c;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 23px;
	}

	.eliqauto-inventory-mobile-drawer__done {
		display: inline-flex;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 10px;
		background: #a51717;
		appearance: none;
		color: #ffffff;
		cursor: pointer;
		font-size: 15px;
		font-weight: 800;
		line-height: 19px;
	}

	@media (max-width: 399px) {
		.eliqauto-inventory-mobile-card {
			grid-template-columns: 124px minmax(0, 1fr);
		}
	}
</style>
