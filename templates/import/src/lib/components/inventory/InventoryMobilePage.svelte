<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { routeParts } from '$lib/locale/core';
	import { pushState } from '$app/navigation';
	import { browser } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { linkHref as resolve } from '$lib/utils/links';
	import { navigating, page } from '$app/state';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Search from '@lucide/svelte/icons/search';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import { onMount, tick, untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Action from '$lib/components/common/Action.svelte';
	import MobileIntakeChoiceField from '$lib/components/common/MobileIntakeChoiceField.svelte';
	import MobileIntakeChoiceList from '$lib/components/common/MobileIntakeChoiceList.svelte';
	import { mobileIntakeCopy } from '$lib/content/mobile-intake';
	import { parseInventoryQuery } from '$lib/domain/inventory-query';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import {
		inventoryMobileDraftFromQuery,
		serializeInventoryMobileDraft,
		type InventoryMobileDraft as FilterDraft
	} from '$lib/domain/inventory-mobile-draft';
	import { Drawer } from 'vaul-svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';
	import MobileVehicleCard from '$lib/components/common/MobileVehicleCard.svelte';
	import MobileIconAction from '$lib/components/common/MobileIconAction.svelte';

	type FilterDrawerMode =
		| 'all'
		| 'brand'
		| 'model'
		| 'sort'
		| 'transmission'
		| 'fuel'
		| 'mileage'
		| 'body'
		| 'price'
		| 'extras'
		| 'year';
	type InventoryMobileOption = InventoryMobileData['brandOptions'][number];

	let {
		cards,
		copy,
		mobile,
		filtersOnly = false,
		initialOverlay = 'filters',
		embedded = false,
		filterDrawerOpen = $bindable(false),
		onclose
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
		filtersOnly?: boolean;
		initialOverlay?: 'search' | 'filters';
		embedded?: boolean;
		filterDrawerOpen?: boolean;
		onclose?: () => void;
	} = $props();

	const inventoryScrollKey = () =>
		`daynight-inventory-scroll:${page.url.pathname}${page.url.search}`;

	onMount(() => {
		if (!browser) return;
		let saved: string | null;
		try {
			saved = sessionStorage.getItem(inventoryScrollKey());
			if (!saved) return;
			sessionStorage.removeItem(inventoryScrollKey());
		} catch {
			return;
		}
		const top = Number(saved);
		if (!Number.isFinite(top) || top <= 0) return;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => window.scrollTo({ top, behavior: 'auto' }))
		);
	});

	beforeNavigate((navigation) => {
		if (!browser) return;
		if (overlayOpen() && navigation.type !== 'popstate' && navigation.to) {
			navigation.cancel();
			overlayPendingHref = `${navigation.to.url.pathname}${navigation.to.url.search}${navigation.to.url.hash}`;
			searchDrawerOpen = false;
			filterDrawerOpen = false;
			return;
		}
		if (!navigation.to || !/^\/inventory\/[^/]+$/.test(routeParts(navigation.to.url.pathname).path))
			return;
		try {
			sessionStorage.setItem(inventoryScrollKey(), String(window.scrollY));
		} catch {
			/* Scroll restoration is optional when storage is blocked. */
		}
	});

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
		transmission: 'daynight-inventory-mobile-transmission-drawer',
		year: 'daynight-inventory-mobile-year-drawer'
	} as const;
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
	const currentFilterDraft = (): FilterDraft =>
		inventoryMobileDraftFromQuery(page.url.searchParams);

	let searchDrawerOpen = $state(untrack(() => filtersOnly && initialOverlay === 'search'));
	let overlayWasOpen = false;
	let overlayHistoryActive = false;
	let overlayClosePending = false;
	let overlayPendingHref: string | null = null;
	let overlayTrigger: HTMLElement | null = null;
	const overlayHistoryId = `daynight-inventory-overlay-${Math.random().toString(36).slice(2)}`;
	const overlayOpen = () => searchDrawerOpen || filterDrawerOpen;

	const finishOverlayClose = () => {
		const href = overlayPendingHref;
		overlayPendingHref = null;
		if (filtersOnly) onclose?.();
		const trigger = overlayTrigger;
		overlayTrigger = null;
		if (href) {
			window.setTimeout(() => void goto(href, { noScroll: true }), 0);
		} else {
			void tick().then(() => trigger?.focus({ preventScroll: true }));
		}
	};

	const handleOverlayPopState = () => {
		if (overlayClosePending) {
			overlayClosePending = false;
			finishOverlayClose();
			return;
		}
		if (searchChoiceHistoryActive || searchChoiceClosePending) {
			finishSearchChoice();
			return;
		}
		if (!overlayOpen() || !overlayHistoryActive) return;
		overlayHistoryActive = false;
		overlayWasOpen = false;
		searchDrawerOpen = false;
		filterDrawerOpen = false;
		finishOverlayClose();
	};

	onMount(() => {
		window.addEventListener('popstate', handleOverlayPopState);
		return () => window.removeEventListener('popstate', handleOverlayPopState);
	});

	$effect(() => {
		if (!browser) return;
		const isOpen = overlayOpen();
		if (isOpen && !overlayWasOpen) {
			overlayWasOpen = true;
			overlayTrigger =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			if (!overlayHistoryActive) {
				pushState('', { ...page.state, __daynightInventoryOverlay: overlayHistoryId });
				overlayHistoryActive = true;
			}
			return;
		}
		if (!isOpen && overlayWasOpen) {
			overlayWasOpen = false;
			if (overlayHistoryActive) {
				overlayHistoryActive = false;
				overlayClosePending = true;
				const historyDepth = searchChoiceHistoryActive ? 2 : 1;
				searchChoiceHistoryActive = false;
				searchChoiceClosePending = false;
				searchChoice = null;
				history.go(-historyDepth);
			} else if (!overlayClosePending) {
				finishOverlayClose();
			}
		}
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
			if (e.key === 'Escape') {
				if (searchChoice) {
					e.preventDefault();
					e.stopImmediatePropagation();
					closeSearchChoice();
				} else closeSearchDrawer();
			}
			if (e.key === 'Tab') {
				const dialog = document.getElementById('daynight-inventory-mobile-search-drawer');
				const controls = [
					...(dialog?.querySelectorAll<HTMLElement>(
						'a[href], button, input:not([type="hidden"])'
					) ?? [])
				].filter((control) => control.getClientRects().length > 0);
				const first = controls[0];
				const last = controls.at(-1);
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
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
	let filterOverview = $state(untrack(() => filtersOnly && initialOverlay === 'filters'));
	let filterDraft = $state<FilterDraft>(currentFilterDraft());
	const searchId = $props.id();
	const searchLocale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const intakeCopy = $derived(mobileIntakeCopy[searchLocale]);
	let searchKeyword = $state(
		untrack(() => parseInventoryQuery(page.url.searchParams).filters.keyword ?? '')
	);
	let searchChoice = $state<'brand' | 'model' | 'price' | 'body' | null>(null);
	let searchChoiceHistoryActive = false;
	let searchChoiceClosePending = false;
	let searchCount = $state<number | null>(null);
	const searchParams = $derived.by(() => {
		const params = new SvelteURLSearchParams(
			serializeInventoryMobileDraft(filterDraft, page.url.searchParams).toString()
		);
		if (searchKeyword.trim()) params.set('keyword', searchKeyword.trim());
		else params.delete('keyword');
		params.set('lang', searchLocale);
		return params;
	});
	const searchQuery = $derived(searchParams.toString());
	const searchResultsLabel = $derived(
		searchCount === null
			? searchLocale === 'en'
				? 'Show cars'
				: 'Виж автомобилите'
			: searchLocale === 'en'
				? `Show ${searchCount} cars`
				: `Виж ${searchCount} автомобила`
	);
	$effect(() => {
		if (!searchDrawerOpen) return;
		const query = searchQuery;
		const controller = new AbortController();
		searchCount = null;
		const timer = setTimeout(async () => {
			try {
				const response = await fetch(`${resolve('/api/inventory/count')}?${query}`, {
					signal: controller.signal
				});
				if (!response.ok) return;
				const data = await response.json();
				if (!controller.signal.aborted && Number.isInteger(data.count) && data.count >= 0)
					searchCount = data.count;
			} catch {
				/* The native search remains usable without a preview count. */
			}
		}, 180);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	});
	let brandDrawerQuery = $state('');
	let modelDrawerQuery = $state('');

	const brandSelected = $derived(
		mobile.brandOptions.some((option) => option.active && option.value)
	);
	const modelSelected = $derived(Boolean(mobile.searchValue));
	const bodySelected = $derived(mobile.bodyOptions.some((option) => option.active && option.value));
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
	const transmissionSelected = $derived(
		mobile.transmissionOptions.some((option) => option.active && option.value)
	);
	const moreFiltersActive = $derived(
		fuelSelected || mileageSelected || bodySelected || extrasSelected || transmissionSelected
	);
	const secondaryFilterCount = $derived(
		[fuelSelected, mileageSelected, bodySelected, extrasSelected, transmissionSelected].filter(
			Boolean
		).length
	);
	const filterNavigationPending = $derived(
		navigating.to && routeParts(navigating.to.url.pathname).path === '/inventory'
	);
	const moreFiltersLabel = $derived(mobile.filterLabel === nt('ui133') ? nt('ui134') : 'More');
	const updatingLabel = $derived(mobile.filterLabel === nt('ui133') ? nt('ui135') : 'Updating…');
	const mobileSearchTriggerLabel = $derived(
		`${mobile.searchDisplayValue || mobile.searchLabel} (${mobile.resultCount})`
	);
	const inventoryHeading = $derived(mobile.filterLabel === nt('ui133') ? nt('ui136') : 'Vehicles');
	const filterDrawerId = $derived(filterDrawerIds[filterDrawerMode]);
	const filterDrawerHasActions = $derived(
		filterOverview ||
			filterDrawerMode === 'all' ||
			filterDrawerMode === 'brand' ||
			filterDrawerMode === 'model'
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
		if (filterDrawerMode === 'transmission') return mobile.transmissionLabel;
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
	const categorySummary = (key: keyof FilterDraft, options: InventoryMobileOption[]) => {
		const value = filterDraft[key];
		if (!value || (key === 'sort' && value === 'best-match')) return '';
		return splitDraftValues(value)
			.map((item) => options.find((option) => option.value === item)?.label ?? item)
			.join(', ');
	};
	const filterCategories = $derived([
		{
			mode: 'brand' as const,
			key: 'brand' as const,
			label: mobile.brandLabel,
			options: mobile.brandOptions
		},
		{
			mode: 'model' as const,
			key: 'model' as const,
			label: mobile.modelLabel,
			options: stagedModelOptions
		},
		{
			mode: 'price' as const,
			key: 'price' as const,
			label: mobile.priceLabel,
			options: mobile.priceOptions
		},
		{
			mode: 'mileage' as const,
			key: 'mileage' as const,
			label: mobile.mileageLabel,
			options: mobile.mileageOptions
		},
		{
			mode: 'body' as const,
			key: 'body' as const,
			label: mobile.bodyLabel,
			options: mobile.bodyOptions
		},
		{
			mode: 'fuel' as const,
			key: 'fuel' as const,
			label: mobile.fuelLabel,
			options: mobile.fuelOptions
		},
		{
			mode: 'year' as const,
			key: 'year' as const,
			label: mobile.yearLabel,
			options: mobile.yearOptions
		},
		{
			mode: 'transmission' as const,
			key: 'transmission' as const,
			label: mobile.transmissionLabel,
			options: mobile.transmissionOptions
		},
		{
			mode: 'extras' as const,
			key: 'feature' as const,
			label: mobile.extrasLabel,
			options: mobile.featureOptions
		},
		{
			mode: 'sort' as const,
			key: 'sort' as const,
			label: mobile.sortLabel,
			options: mobile.sortOptions
		}
	]);
	const searchCategory = $derived(
		filterCategories.find((category) => category.mode === searchChoice)
	);
	function openSearchChoice(choice: 'brand' | 'model' | 'price' | 'body') {
		searchInput?.blur();
		searchChoice = choice;
		pushState('', { ...page.state, __daynightInventorySearchChoice: choice });
		searchChoiceHistoryActive = true;
	}
	function finishSearchChoice() {
		const choice = searchChoice;
		searchChoice = null;
		searchChoiceHistoryActive = false;
		searchChoiceClosePending = false;
		void tick().then(() =>
			document.getElementById(`${searchId}-${choice}`)?.focus({ preventScroll: true })
		);
	}
	function closeSearchChoice() {
		if (searchChoiceClosePending) return;
		if (searchChoiceHistoryActive) {
			searchChoiceClosePending = true;
			history.back();
		} else finishSearchChoice();
	}
	function selectSearchChoice(value: string) {
		if (!searchChoice) return;
		if (searchChoice === 'brand' && filterDraft.brand !== value) filterDraft.model = '';
		filterDraft[searchChoice] = value;
		closeSearchChoice();
	}
	function clearSearchDraft() {
		filterDraft = inventoryMobileDraftFromQuery(new URLSearchParams());
		searchKeyword = '';
	}
	function submitSearchDraft(event: SubmitEvent) {
		event.preventDefault();
		navigateToFilterDraft(`/inventory?${searchQuery}`);
	}
	const openFilterCategory = (mode: FilterDrawerMode) => {
		filterDrawerMode = mode;
		brandDrawerQuery = '';
		modelDrawerQuery = '';
	};
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
		const query = serializeInventoryMobileDraft(filterDraft, page.url.searchParams).toString();
		return `/inventory${query ? `?${query}` : ''}`;
	};
	const clearFilterDraft = () => {
		if (filterDrawerMode === 'all') {
			filterDraft = inventoryMobileDraftFromQuery(new URLSearchParams());
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
			return;
		}
		const category = filterCategories.find((value) => value.mode === filterDrawerMode);
		if (category) filterDraft[category.key] = category.key === 'sort' ? 'best-match' : '';
	};
	const navigateToFilterDraft = (href = filterDraftHref()) => {
		const queryStart = href.indexOf('?');
		overlayPendingHref = resolve(`/inventory${queryStart === -1 ? '' : href.slice(queryStart)}`);
		filterDrawerOpen = false;
		searchDrawerOpen = false;
		if (!overlayWasOpen && !overlayHistoryActive) finishOverlayClose();
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
			filterOverview ||
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
		resetFilterDraft();
		searchKeyword = parseInventoryQuery(page.url.searchParams).filters.keyword ?? '';
		filterDrawerOpen = false;
		searchDrawerOpen = true;
	};
	const closeSearchDrawer = () => {
		searchDrawerOpen = false;
	};
	const openFilterDrawer = (mode: FilterDrawerMode = 'all') => {
		searchDrawerOpen = false;
		filterOverview = mode === 'all';
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

<svelte:window
	onresize={() => {
		if (innerWidth >= 768) {
			searchDrawerOpen = false;
			filterDrawerOpen = false;
		}
	}}
/>

<div class="daynight-inventory-mobile" style:display={filtersOnly ? 'contents' : undefined}>
	{#if !filtersOnly}
		<svelte:element this={embedded ? 'section' : 'main'} class="daynight-inventory-mobile__main">
			<h1 class="sr-only">{inventoryHeading}</h1>
			<div class="daynight-inventory-mobile__sticky" aria-busy={filterNavigationPending}>
				<div class="daynight-inventory-mobile__search">
					<button
						type="button"
						class="daynight-inventory-mobile__search-field"
						aria-label={`${mobileSearchTriggerLabel}, ${mobile.searchPlaceholder}`}
						aria-haspopup="dialog"
						aria-expanded={searchDrawerOpen}
						onclick={openSearchDrawer}
					>
						<Search size={20} strokeWidth={2} aria-hidden="true" />
						<span class="daynight-inventory-mobile__search-label">
							<span class="daynight-inventory-mobile__search-value">
								{mobile.searchDisplayValue || mobile.searchLabel}
							</span>
							<span class="daynight-inventory-mobile__search-count">({mobile.resultCount})</span>
						</span>
					</button>
					<MobileIconAction
						label={mobile.filterLabel}
						active={hasActiveFilters}
						badge={hasActiveFilters ? mobile.activeFilters.length : undefined}
						haspopup="dialog"
						expanded={filterDrawerOpen && filterDrawerMode === 'all'}
						onclick={() => openFilterDrawer('all')}
					>
						<SlidersHorizontal size={20} strokeWidth={2} aria-hidden="true" />
					</MobileIconAction>
					<MobileIconAction
						label={mobile.sortLabel + ': ' + mobile.sortValue}
						active={sortSelected}
						haspopup="dialog"
						expanded={filterDrawerOpen && filterDrawerMode === 'sort'}
						onclick={() => openFilterDrawer('sort')}
					>
						<ArrowUpDown size={20} strokeWidth={2} aria-hidden="true" />
					</MobileIconAction>
				</div>

				<nav class="daynight-inventory-mobile__tools" aria-label={mobile.filterLabel}>
					<button
						type="button"
						class="daynight-inventory-mobile__tool-choice"
						class:active={brandSelected}
						aria-label={mobile.brandLabel + ': ' + mobile.brandValue}
						aria-haspopup="dialog"
						aria-expanded={filterDrawerOpen && filterDrawerMode === 'brand'}
						onclick={() => openFilterDrawer('brand')}
					>
						<span>{mobile.brandLabel}</span>
						{#if brandSelected}<strong>{mobile.brandValue}</strong>{/if}
						<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
					</button>
					<button
						type="button"
						class="daynight-inventory-mobile__tool-choice"
						class:active={modelSelected}
						aria-label={mobile.modelLabel + ': ' + mobile.modelValue}
						aria-haspopup="dialog"
						aria-expanded={filterDrawerOpen && filterDrawerMode === 'model'}
						onclick={() => openFilterDrawer('model')}
					>
						<span>{mobile.modelLabel}</span>
						{#if modelSelected}<strong>{mobile.modelValue}</strong>{/if}
						<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
					</button>
					<button
						type="button"
						class="daynight-inventory-mobile__tool-choice"
						class:active={priceSelected}
						aria-label={mobile.priceLabel + ': ' + mobile.priceValue}
						aria-haspopup="dialog"
						aria-expanded={filterDrawerOpen && filterDrawerMode === 'price'}
						onclick={() => openFilterDrawer('price')}
					>
						<span>{mobile.priceLabel}</span>
						{#if priceSelected}<strong>{mobile.priceValue}</strong>{/if}
						<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
					</button>
					<button
						type="button"
						class="daynight-inventory-mobile__tool-choice"
						class:active={yearSelected}
						aria-label={mobile.yearLabel + ': ' + mobile.yearValue}
						aria-haspopup="dialog"
						aria-expanded={filterDrawerOpen && filterDrawerMode === 'year'}
						onclick={() => openFilterDrawer('year')}
					>
						<span>{mobile.yearLabel}</span>
						{#if yearSelected}<strong>{mobile.yearValue}</strong>{/if}
						<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
					</button>

					<button
						type="button"
						class="daynight-inventory-mobile__tool-choice daynight-inventory-mobile__tool-choice--more"
						class:active={moreFiltersActive}
						aria-label={moreFiltersLabel}
						aria-haspopup="dialog"
						aria-expanded={filterDrawerOpen && filterDrawerMode === 'all'}
						onclick={() => openFilterDrawer('all')}
					>
						<span>{moreFiltersLabel}</span>
						{#if secondaryFilterCount}<strong>{secondaryFilterCount}</strong>{/if}
						<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
					</button>
					{#if hasActiveFilters}
						<a
							class="daynight-inventory-mobile__tool-choice daynight-inventory-mobile__tool-choice--clear"
							href={resolve(mobile.clearHref as '/inventory')}
						>
							<span>{mobile.clearLabel}</span>
						</a>
					{/if}
				</nav>
			</div>

			<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{filterNavigationPending ? updatingLabel : mobile.countLabel}
			</p>

			<section class="daynight-inventory-mobile__cards" aria-label={mobile.countLabel}>
				{#each cards as card, index (card.slug)}
					<MobileVehicleCard {card} priority={index < 4} />
				{:else}
					<div class="daynight-inventory-mobile__empty">
						<h2>{copy.emptyTitle}</h2>
						<p>{copy.emptyBody}</p>
						<a href={resolve('/inventory')}>{copy.reset}</a>
					</div>
				{/each}
			</section>
		</svelte:element>
	{/if}

	{#if searchDrawerOpen}
		<!-- Full-screen search overlay (replaces the old bottom drawer): input pinned top so
		     the keyboard opens beneath it and never fights the panel. Appears instantly. -->
		<div
			id="daynight-inventory-mobile-search-drawer"
			class="daynight-inventory-mobile-search-overlay"
			class:daynight-inventory-mobile-search-overlay--choosing={Boolean(searchChoice)}
			role="dialog"
			aria-modal="true"
			aria-label={searchCategory?.label ?? mobile.searchDrawerTitle}
		>
			{#if searchChoice && searchCategory}
				<MobileIntakeChoiceList
					title={searchCategory.label}
					options={searchCategory.options.map((option) => ({
						value: option.value,
						label: option.label
					}))}
					value={filterDraft[searchChoice]}
					locale={searchLocale}
					backLabel={nt('ui183')}
					searchLabel={searchChoice === 'brand'
						? mobile.brandSearchPlaceholder
						: searchChoice === 'model'
							? mobile.modelSearchPlaceholder
							: undefined}
					onback={closeSearchChoice}
					onselect={selectSearchChoice}
				/>
			{:else}
				<header class="daynight-inventory-mobile-search-overlay__bar">
					<span class="daynight-inventory-mobile-drawer__title">
						{mobile.searchDrawerTitle}
					</span>
					<MobileIconAction
						class="daynight-inventory-mobile-search-overlay__close"
						label={mobile.closeLabel}
						onclick={closeSearchDrawer}
					>
						<X size={20} strokeWidth={2} aria-hidden="true" />
					</MobileIconAction>
				</header>
				<form
					class="daynight-inventory-mobile-drawer__search-form"
					action={resolve('/inventory')}
					method="get"
					onsubmit={submitSearchDraft}
				>
					{#each [...searchParams].filter(([name]) => name !== 'keyword') as [name, value], index (index)}
						<input type="hidden" {name} {value} />
					{/each}
					<div class="daynight-inventory-mobile-drawer__search-box">
						<Search size={19} strokeWidth={2.1} aria-hidden="true" />
						<input
							bind:this={searchInput}
							name="keyword"
							type="search"
							bind:value={searchKeyword}
							placeholder={mobile.searchPlaceholder}
							autocomplete="off"
							enterkeyhint="search"
							aria-label={mobile.searchPlaceholder}
						/>
					</div>
					<div class="daynight-inventory-mobile-search-overlay__scroll">
						<div class="daynight-inventory-mobile-search-overlay__fields">
							<MobileIntakeChoiceField
								id={`${searchId}-brand`}
								label={mobile.brandLabel}
								value={categorySummary('brand', mobile.brandOptions)}
								placeholder={intakeCopy.selectMake}
								onopen={() => openSearchChoice('brand')}
							/>
							<MobileIntakeChoiceField
								id={`${searchId}-model`}
								label={mobile.modelLabel}
								value={categorySummary('model', stagedModelOptions)}
								placeholder={intakeCopy.selectModel}
								onopen={() => openSearchChoice('model')}
							/>
							<MobileIntakeChoiceField
								id={`${searchId}-price`}
								label={mobile.priceLabel}
								value={categorySummary('price', mobile.priceOptions)}
								placeholder={searchLocale === 'en' ? 'Any budget' : 'Всеки бюджет'}
								onopen={() => openSearchChoice('price')}
							/>
							<MobileIntakeChoiceField
								id={`${searchId}-body`}
								label={mobile.bodyLabel}
								value={categorySummary('body', mobile.bodyOptions)}
								placeholder={intakeCopy.selectType}
								onopen={() => openSearchChoice('body')}
							/>
						</div>
					</div>
					<div class="daynight-inventory-mobile-search-overlay__actions">
						<Action variant="secondary" onclick={clearSearchDraft}>{mobile.clearLabel}</Action>
						<Action type="submit">{searchResultsLabel}</Action>
					</div>
				</form>
			{/if}
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
			class={`daynight-inventory-mobile-drawer__sheet daynight-inventory-mobile-drawer__sheet--filters ${filtersOnly || filterOverview ? 'daynight-inventory-mobile-drawer__sheet--fullscreen' : ''} ${filterDrawerMode === 'all' ? 'daynight-inventory-mobile-drawer__sheet--full' : 'daynight-inventory-mobile-drawer__sheet--compact'} ${filterDrawerMode === 'brand' || filterDrawerMode === 'model' ? 'daynight-inventory-mobile-drawer__sheet--searchable' : ''} ${filterDrawerHasActions ? 'daynight-inventory-mobile-drawer__sheet--with-actions' : ''}`}
		>
			{#if !filtersOnly && !filterOverview}<Drawer.Handle
					class="daynight-inventory-mobile-drawer__handle"
				/>{/if}
			<header>
				<div class="daynight-inventory-mobile-drawer__heading">
					{#if filterOverview && filterDrawerMode !== 'all'}
						<MobileIconAction label={nt('ui183')} onclick={() => (filterDrawerMode = 'all')}>
							<ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
						</MobileIconAction>
					{/if}
					<Drawer.Title>
						<span class="daynight-inventory-mobile-drawer__title">
							{filterDrawerTitle}
						</span>
					</Drawer.Title>
				</div>
				<MobileIconAction label={mobile.closeLabel} onclick={closeFilterDrawer}>
					<X size={20} strokeWidth={2} aria-hidden="true" />
				</MobileIconAction>
			</header>
			<Drawer.Description class="daynight-inventory-mobile-drawer__description">
				{mobile.countLabel}
			</Drawer.Description>
			<div class="daynight-inventory-mobile-drawer__body" data-vaul-no-drag>
				{#if filterDrawerMode === 'all'}
					<div class="daynight-inventory-mobile-drawer__categories">
						{#each filterCategories as category (category.mode)}
							{@const summary = categorySummary(category.key, category.options)}
							<button
								type="button"
								class:active={Boolean(summary)}
								aria-label={summary ? `${category.label}: ${summary}` : category.label}
								title={summary || category.label}
								onclick={() => openFilterCategory(category.mode)}
							>
								<span
									><strong>{category.label}</strong>{#if summary}<small>{summary}</small>{/if}</span
								>
								<ChevronDown size={17} aria-hidden="true" />
							</button>
						{/each}
					</div>
				{/if}
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
												src={assetHref(option.image)}
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
				{#if filterDrawerMode === 'body'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'fuel'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'mileage'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'price'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'year'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'transmission'}
					<div class="daynight-inventory-mobile-drawer__group">
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
				{#if filterDrawerMode === 'extras'}
					<div class="daynight-inventory-mobile-drawer__group">
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
						onclick={() => {
							if (filterOverview && filterDrawerMode !== 'all') filterDrawerMode = 'all';
							else applyFilterDraft();
						}}
					>
						{filterOverview && filterDrawerMode !== 'all'
							? mobile.doneLabel
							: filterDraftChanged
								? mobile.applyLabel
								: mobile.showResultsLabel}
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
		gap: 0;
		overflow-x: hidden;
		padding: 0 var(--bc-mobile-gutter) 92px;
	}

	.daynight-inventory-mobile__sticky {
		position: sticky;
		top: 0;
		z-index: 40;
		display: grid;
		gap: 6px;
		min-width: 0;
		margin: 0;
		/* Keep one 12px gap between the pills and results, owned by the sticky toolbar. */
		padding: max(var(--bc-space-2), env(safe-area-inset-top)) 0 var(--bc-space-3);
		background: color-mix(in srgb, var(--bc-bg) 94%, transparent);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}

	.daynight-inventory-mobile__sticky[aria-busy='true'] {
		box-shadow: inset 0 -1px var(--bc-accent);
	}

	.daynight-inventory-mobile__search {
		--bc-mobile-icon-action-surface-size: var(--bc-control-height-standard);
		display: grid;
		grid-template-columns: minmax(0, 1fr) repeat(2, var(--bc-mobile-icon-action-hit-size));
		align-items: center;
		gap: var(--bc-space-1);
		min-width: 0;
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
		padding: 0 var(--bc-space-4);
		color: var(--bc-ink);
		cursor: pointer;
		text-align: left;
	}
	.daynight-inventory-mobile__search-field :global(svg) {
		flex: 0 0 auto;
		color: var(--bc-copy);
	}
	.daynight-inventory-mobile__search-label {
		display: flex;
		min-width: 0;
		gap: var(--bc-space-1);
		font-size: var(--bc-text-search);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-search);
		white-space: nowrap;
	}
	.daynight-inventory-mobile__search-value {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.daynight-inventory-mobile__search-count {
		flex: 0 0 auto;
	}
	.daynight-inventory-mobile__search-field:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.daynight-inventory-mobile__tools {
		--bc-text-filter: var(--bc-text-quick-pill);
		--bc-leading-filter: var(--bc-leading-quick-pill);
		display: flex;
		min-width: 0;
		gap: var(--bc-space-2);
		margin: 0 calc(-1 * var(--bc-mobile-gutter));
		overflow-x: auto;
		padding: 0 var(--bc-mobile-gutter);
		scrollbar-width: none;
		-webkit-mask-image: linear-gradient(to right, var(--bc-ink) calc(100% - 34px), transparent);
		mask-image: linear-gradient(to right, var(--bc-ink) calc(100% - 34px), transparent);
	}

	.daynight-inventory-mobile__tools::-webkit-scrollbar {
		display: none;
	}

	.daynight-inventory-mobile__tools :is(button, a) {
		display: inline-flex;
		min-width: 0;
		flex: 0 0 auto;
		min-height: var(--bc-control-height-chip);
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

	.daynight-inventory-mobile__tools :is(button, a).active {
		background: var(--bc-accent);
		box-shadow: none;
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tools :is(button, a):focus-visible {
		background: var(--bc-accent-hover);
		box-shadow: none;
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tool-choice:focus-visible span,
	.daynight-inventory-mobile__tool-choice:focus-visible strong,
	.daynight-inventory-mobile__tool-choice:focus-visible :global(svg) {
		color: var(--bc-white);
	}

	.daynight-inventory-mobile__tools :is(button, a).daynight-inventory-mobile__tool-choice {
		gap: 6px;
		padding-right: 10px;
	}

	.daynight-inventory-mobile__tool-choice span {
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
	}

	.daynight-inventory-mobile__tool-choice.active span,
	.daynight-inventory-mobile__tool-choice.active strong {
		color: var(--bc-white);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
		text-transform: none;
	}

	.daynight-inventory-mobile__tool-choice--clear span {
		color: var(--bc-accent);
		font-weight: var(--bc-weight-heading);
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

	.daynight-inventory-mobile__cards {
		display: grid;
		min-width: 0;
		gap: var(--bc-space-3);
		margin-top: 0;
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
		--bc-control-height-standard: var(--bc-control-height-chip);
		position: fixed;
		right: 0;
		/* Lifted above the on-screen keyboard on iOS; --bc-kb-inset stays ~0 on Android,
		   where interactive-widget=resizes-content already lifts the layout. vaul's own
		   repositionInputs is disabled (it conflicts with that meta and collapses the sheet). */
		bottom: var(--bc-kb-inset, 0px);
		left: 0;
		display: flex;
		flex-direction: column;
		z-index: 1201;
		height: auto;
		max-height: min(calc(86dvh - var(--bc-kb-inset, 0px)), 720px);
		gap: 0;
		overflow: clip;
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
		--bc-control-height-standard: var(--bc-control-height-chip);
		position: fixed;
		inset: 0;
		z-index: 1300;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		background: var(--bc-bg);
		color: var(--bc-ink, var(--bc-ink));
	}
	.daynight-inventory-mobile-search-overlay--choosing {
		grid-template-rows: minmax(0, 1fr);
	}
	.daynight-inventory-mobile-search-overlay__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		min-width: 0;
	}
	.daynight-inventory-mobile-search-overlay__actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
		gap: 10px;
		padding: 12px 16px max(14px, env(safe-area-inset-bottom));
		border-top: 1px solid var(--bc-border);
	}
	.daynight-inventory-mobile-search-overlay__actions :global(.site-action) {
		height: var(--bc-control-height-standard);
		min-width: 0;
		border: 0;
		border-radius: 10px;
		padding: 0 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-search-overlay__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: max(12px, env(safe-area-inset-top)) 16px 8px;
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
		margin: 4px 16px 0;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--filters[data-vaul-drawer]) {
		max-height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
		padding-bottom: 0;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--full[data-vaul-drawer]) {
		height: min(calc(90dvh - var(--bc-kb-inset, 0px)), 760px);
	}

	:global(.daynight-inventory-mobile-drawer__sheet--fullscreen[data-vaul-drawer]) {
		top: 0;
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		max-height: calc(100dvh - var(--bc-kb-inset, 0px));
		border-radius: 0;
		padding-top: max(var(--bc-space-3), env(safe-area-inset-top));
	}
	:global(.daynight-inventory-mobile-drawer__sheet--fullscreen[data-vaul-drawer])::after {
		display: none;
	}

	:global(.daynight-inventory-mobile-drawer__sheet[data-vaul-drawer]::-webkit-scrollbar) {
		display: none;
	}

	:global(.daynight-inventory-mobile-drawer__handle[data-vaul-handle]) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		align-self: center;
		flex: 0 0 22px;
		margin-bottom: 2px;
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
		min-height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
		flex: 0 0 auto;
		padding: 0 0 var(--bc-space-2);
	}

	:global(.daynight-inventory-mobile-drawer__sheet header div) {
		min-width: 0;
	}
	.daynight-inventory-mobile-drawer__heading {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
	}
	.daynight-inventory-mobile-drawer__categories {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}
	.daynight-inventory-mobile-drawer__categories button {
		display: flex;
		min-width: 0;
		height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		padding: 0 var(--bc-space-3);
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-filter)/var(--bc-leading-filter)
			var(--bc-font-body);
		text-align: left;
		cursor: pointer;
	}
	.daynight-inventory-mobile-drawer__categories button.active {
		border-color: var(--bc-accent);
		background: var(--bc-accent-tint);
	}
	.daynight-inventory-mobile-drawer__categories button > span {
		display: flex;
		align-items: baseline;
		min-width: 0;
		gap: 6px;
	}
	.daynight-inventory-mobile-drawer__categories strong,
	.daynight-inventory-mobile-drawer__categories small {
		min-width: 0;
		overflow: hidden;
		font: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.daynight-inventory-mobile-drawer__categories small {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
	}
	.daynight-inventory-mobile-drawer__categories :global(svg) {
		flex: 0 0 auto;
	}

	.daynight-inventory-mobile-drawer__title {
		display: block;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}

	:global(.daynight-inventory-mobile-drawer__description) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__search-form {
		display: grid;
		flex: 0 0 auto;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-3);
	}

	.daynight-inventory-mobile-drawer__search-box {
		display: flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-3);
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		padding: 0 var(--bc-space-3);
		color: var(--bc-ink);
	}

	.daynight-inventory-mobile-drawer__search-box input {
		--control-focus-outline: none;
		--control-focus-shadow: none;
		min-width: 0;
		width: 100%;
		height: var(--bc-control-height-standard);
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
		box-shadow: inset 0 0 0 2px var(--bc-focus);
	}

	.daynight-inventory-mobile-drawer__group button:focus-visible,
	.daynight-inventory-mobile-drawer__clear:focus-visible,
	.daynight-inventory-mobile-drawer__done:focus-visible {
		outline: 2px solid var(--bc-ink);
		outline-offset: 2px;
	}

	.daynight-inventory-mobile-drawer__body {
		display: grid;
		min-height: 0;
		flex: 1 1 auto;
		align-content: start;
		overflow-y: auto;
		gap: var(--bc-space-4);
		padding: 0 0 2px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.daynight-inventory-mobile-drawer__body::-webkit-scrollbar {
		display: none;
	}

	:global(.daynight-inventory-mobile-drawer__sheet--compact[data-vaul-drawer]) {
		padding-top: var(--bc-space-2);
	}

	:global(.daynight-inventory-mobile-drawer__sheet--compact[data-vaul-drawer] header) {
		padding-bottom: var(--bc-space-2);
	}

	:global(.daynight-inventory-mobile-drawer__sheet--compact[data-vaul-drawer])
		.daynight-inventory-mobile-drawer__body {
		gap: var(--bc-space-3);
	}

	:global(.daynight-inventory-mobile-drawer__sheet--searchable[data-vaul-drawer])
		.daynight-inventory-mobile-drawer__group {
		gap: var(--bc-space-2);
	}

	.daynight-inventory-mobile-drawer__group {
		display: grid;
		gap: var(--bc-space-2);
	}

	.daynight-inventory-mobile-drawer__group div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}

	.daynight-inventory-mobile-drawer__group button,
	.daynight-inventory-mobile-drawer__clear {
		display: inline-flex;
		min-width: 0;
		max-width: 100%;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-white);
		padding: 0 var(--bc-space-3);
		appearance: none;
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		text-align: left;
		text-decoration: none;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__group button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	.daynight-inventory-mobile-drawer__brand-logo {
		display: block;
		max-width: 40px;
		max-height: 26px;
		object-fit: contain;
	}

	.daynight-inventory-mobile-drawer__group button span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-inventory-mobile-drawer__group button small {
		flex: 0 0 auto;
	}
	.daynight-inventory-mobile-drawer__clear,
	.daynight-inventory-mobile-drawer__done {
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
		background: var(--bc-white);
		color: var(--bc-ink);
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
