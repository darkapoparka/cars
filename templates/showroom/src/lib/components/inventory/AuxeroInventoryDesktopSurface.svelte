<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '$lib/components/common/hero-search.css';
	import InventorySearchDialog from './InventorySearchDialog.svelte';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import type {
		AuxeroInventoryVehicleCard as AuxeroInventoryVehicleCardData,
		AuxeroInventoryView
	} from '$lib/auxero/inventory';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroInventoryActiveFilters from './AuxeroInventoryActiveFilters.svelte';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';
	import AuxeroInventoryFilterPopover from './AuxeroInventoryFilterPopover.svelte';
	import AuxeroInventoryMapFallback from './AuxeroInventoryMapFallback.svelte';
	import { LayoutGrid, Search, SlidersHorizontal, X } from '@lucide/svelte';

	let {
		cards,
		copy,
		desktop,
		modelOptionsByBrand
	}: {
		cards: AuxeroInventoryVehicleCardData[];
		copy: InventoryCopy;
		desktop: AuxeroInventoryDesktopData;
		modelOptionsByBrand: InventoryMobileData['modelOptionsByBrand'];
	} = $props();

	let sidebarOpen = $state(false);
	let filterDrawerTrigger: HTMLButtonElement | null = null;
	const dashboardClass = $derived(
		`eliqauto-inventory-dashboard eliqauto-inventory-dashboard--${desktop.view}`
	);
	const hasSidebarActions = $derived(Boolean(desktop.activeFilters));

	const inventoryAction = resolve('/inventory');
	async function searchFromDialog(params: URLSearchParams) {
		await goto(resolve(`/inventory?${params.toString()}` as `/inventory${string}`), {
			noScroll: true
		});
	}
	const gridFilterNames = new Set(['brand', 'model', 'priceTo', 'fuel', 'bodyType']);
	const multiValueKeys = new Set([
		'bodyType',
		'bodystyle',
		'brand',
		'feature',
		'features',
		'FuelType',
		'fuel',
		'gearbox',
		'model',
		'Transmission',
		'transmission'
	]);
	const linkHref = (href: string) => ({ href });

	const isAllFilterValue = (value: string) => {
		const normalized = value.trim().toLowerCase();

		return !normalized || normalized === 'all';
	};
	const uniqueFilterValues = (values: string[]) =>
		Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

	const inventorySuffixFromForm = (form: HTMLFormElement) => {
		const params = new SvelteURLSearchParams();
		const groupedValues: Record<string, string[]> = {};
		const searchValue = form.querySelector<HTMLInputElement>('input[name="q"]')?.value.trim() ?? '';

		for (const [key, value] of new FormData(form).entries()) {
			if (typeof value !== 'string') continue;

			const trimmed = value.trim();
			const normalized = trimmed.toLowerCase();

			if (
				!trimmed ||
				normalized === 'all' ||
				(key === 'view' && normalized === '4') ||
				(key === 'sort' && normalized === 'best-match')
			) {
				continue;
			}

			if (key === 'model' && searchValue) continue;

			if (multiValueKeys.has(key)) {
				groupedValues[key] = [...(groupedValues[key] ?? []), trimmed];
				continue;
			}

			params.set(key, trimmed);
		}

		for (const [key, values] of Object.entries(groupedValues)) {
			params.set(key, uniqueFilterValues(values).join(','));
		}

		const query = params.toString();

		return query ? `?${query}` : '';
	};

	const navigateForm = async (form: HTMLFormElement) => {
		const suffix = inventorySuffixFromForm(form);

		sidebarOpen = false;
		await goto(resolve(`/inventory${suffix}` as `/inventory${string}`), {
			invalidateAll: true,
			keepFocus: Boolean(
				form.closest('.eliqauto-inventory-dashboard-sidebar, .eliqauto-grid-filters')
			),
			noScroll: true
		});
	};

	const handleSearchSubmit = (event: SubmitEvent) => {
		if (!(event.currentTarget instanceof HTMLFormElement)) return;

		event.preventDefault();
		void navigateForm(event.currentTarget);
	};

	const handleFilterChange = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (event.target.dataset.inventoryFilterInput === undefined) return;

		const input = event.target;
		const form = input.form;
		const isModalPicker = Boolean(input.closest('[data-filter-presentation="modal"]'));

		if (!form) return;

		const filterInputs = Array.from(form.elements).filter(
			(element): element is HTMLInputElement =>
				element instanceof HTMLInputElement &&
				element.dataset.inventoryFilterInput !== undefined &&
				element.name === input.name
		);

		if (input.type === 'checkbox') {
			if (isAllFilterValue(input.value) && input.checked) {
				for (const filterInput of filterInputs) {
					if (filterInput !== input) filterInput.checked = false;
				}
			}

			if (!isAllFilterValue(input.value) && input.checked) {
				for (const filterInput of filterInputs) {
					if (isAllFilterValue(filterInput.value)) filterInput.checked = false;
				}
			}

			if (
				!filterInputs.some(
					(filterInput) => filterInput.checked && !isAllFilterValue(filterInput.value)
				)
			) {
				for (const filterInput of filterInputs) {
					if (isAllFilterValue(filterInput.value)) filterInput.checked = true;
				}
			}
		}

		if (input.name === 'brand') {
			for (const modelInput of Array.from(form.elements).filter(
				(element): element is HTMLInputElement =>
					element instanceof HTMLInputElement &&
					element.dataset.inventoryFilterInput !== undefined &&
					element.name === 'model'
			)) {
				modelInput.checked = isAllFilterValue(modelInput.value);
			}
		}

		if (input.name === 'model' && input.checked) {
			const searchInput = form.querySelector<HTMLInputElement>('input[name="q"]');

			if (searchInput) searchInput.value = '';
		}

		if (isModalPicker) return;

		void navigateForm(form);
	};

	let sortOpen = $state(false);
	let viewMenuOpen = $state(false);

	const activateSortDropdown = (element: HTMLDivElement) => {
		const onPointerDown = (event: PointerEvent) => {
			if (!element.contains(event.target as Node)) sortOpen = false;
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') sortOpen = false;
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
		};
	};

	const activateViewMenu = (element: HTMLDivElement) => {
		const onPointerDown = (event: PointerEvent) => {
			if (!element.contains(event.target as Node)) viewMenuOpen = false;
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && viewMenuOpen) {
				viewMenuOpen = false;
				element.querySelector<HTMLButtonElement>('.eliqauto-inventory-fab__button')?.focus();
			}
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
		};
	};

	const closeFilterDrawer = (restoreFocus = true) => {
		sidebarOpen = false;
		if (restoreFocus) queueMicrotask(() => filterDrawerTrigger?.focus());
	};

	const openFilterDrawer = (trigger: HTMLButtonElement) => {
		filterDrawerTrigger = trigger;
		sidebarOpen = true;
	};

	const activateFilterDrawer: Attachment<HTMLElement> = (element) => {
		const previousOverflow = document.body.style.overflow;
		const focusableSelector =
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusableElements = (root: ParentNode = element) =>
			Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
				(item) => item.getClientRects().length > 0
			);

		document.body.style.overflow = 'hidden';
		requestAnimationFrame(() =>
			requestAnimationFrame(() => element.querySelector<HTMLElement>('.ifp__field')?.focus())
		);

		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				if (element.querySelector('.ifp--open')) return;

				event.preventDefault();
				closeFilterDrawer();
				return;
			}

			if (event.key !== 'Tab') return;

			const openFilter = element.querySelector<HTMLElement>('.ifp--open .ifp__panel--modal');
			const focusable = focusableElements(openFilter ?? element);
			const first = focusable[0];
			const last = focusable.at(-1);

			if (!first || !last) return;

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', onKey);

		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = previousOverflow;
		};
	};
</script>

{#snippet sortControl()}
	<div class="eliqauto-inventory-sort">
		<span class="eliqauto-inventory-sort__label">{desktop.sortLabel}</span>
		<div class={['core-dropdown', sortOpen && 'active']} {@attach activateSortDropdown}>
			<button
				type="button"
				class="core-dropdown__button"
				aria-haspopup="menu"
				aria-expanded={sortOpen}
				aria-label={desktop.sortLabel}
				onclick={() => {
					sortOpen = !sortOpen;
				}}
			>
				<span class="core-dropdown__selected">{desktop.selectedSort}</span>
				<img src="/assets/icons/chevron-down-black.svg" alt="" />
			</button>
			<div class="core-dropdown__menu">
				<ul class="core-dropdown__list" role="menu">
					{#each desktop.sortOptions as option (option.value)}
						<li class="core-dropdown__item">
							<a
								{...linkHref(option.href)}
								class={['core-dropdown__option', option.active && 'active']}
								data-sort={option.value}
								data-value={option.value}
								role="menuitem"
								aria-current={option.active ? 'true' : undefined}
							>
								{option.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/snippet}

{#snippet listingCount()}
	<p class="eliqauto-inventory-listing-count">{desktop.showingText}</p>
{/snippet}

{#snippet resultsToolbar()}
	<div class="eliqauto-inventory-results-toolbar">
		{@render listingCount()}
		{@render sortControl()}
	</div>
{/snippet}

{#snippet viewControls(showAdvancedControls = false)}
	<div class="eliqauto-inventory-view-controls" aria-label={desktop.controlsLabel}>
		<div class="eliqauto-inventory-view-controls__group">
			<span class="eliqauto-inventory-view-controls__label">{desktop.viewLabel}</span>
			<div class="listing-tabs menu-tab eliqauto-view-toggle" aria-label={desktop.viewLabel}>
				{#each desktop.viewOptions as option (option.view)}
					<a
						class={['item-menu', option.active && 'active']}
						{...linkHref(option.href)}
						data-eliqauto-view-toggle
						data-sveltekit-noscroll
						onclick={() => (viewMenuOpen = false)}
						aria-label={option.ariaLabel}
						title={option.title}
					>
						{@render viewIcon(option.view)}
					</a>
				{/each}
			</div>
		</div>

		{#if showAdvancedControls === true}
			<div class="eliqauto-inventory-view-controls__group">
				<span class="eliqauto-inventory-view-controls__label"
					>{desktop.filterPresentationLabel}</span
				>
				<div
					class="eliqauto-inventory-filter-mode-toggle"
					role="group"
					aria-label={desktop.filterPresentationLabel}
				>
					{#each desktop.filterPresentationOptions as option (option.presentation)}
						<a
							class={['eliqauto-inventory-filter-mode-toggle__item', option.active && 'active']}
							{...linkHref(option.href)}
							aria-label={option.ariaLabel}
							title={option.title}
							aria-current={option.active ? 'true' : undefined}
						>
							<span>{option.label}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<div class="eliqauto-inventory-view-controls__group">
			<span class="eliqauto-inventory-view-controls__label">{desktop.layoutLabel}</span>
			<div class="eliqauto-inventory-layout-switch" role="group" aria-label={desktop.layoutLabel}>
				{#each desktop.layoutOptions as option (option.layout)}
					<a
						class={['eliqauto-inventory-layout-toggle', option.active && 'active']}
						{...linkHref(option.href)}
						data-eliqauto-layout-toggle
						data-sveltekit-noscroll
						onclick={() => (viewMenuOpen = false)}
						aria-label={option.ariaLabel}
						title={option.title}
						aria-current={option.active ? 'true' : undefined}
					>
						<span>{option.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

{#snippet sidebarFilterForm()}
	<form
		class="eliqauto-filter-form eliqauto-inventory-sidebar-form"
		action={inventoryAction}
		method="get"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#each desktop.hiddenInputs as input (`sidebar:${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#if desktop.searchValue}
			<input type="hidden" name="q" value={desktop.searchValue} />
		{/if}
		<div class="eliqauto-inventory-sidebar-heading">
			<p class="h5 mb-4">
				<SlidersHorizontal size={18} strokeWidth={2.25} aria-hidden="true" />
				{desktop.sidebar.title}
			</p>
			<p class="text-secondary">{desktop.sidebar.countLabel}</p>
		</div>
		<div class="eliqauto-inventory-sidebar-fields">
			{#each desktop.sidebar.filters as filter (filter.name)}
				<AuxeroInventoryFilterPopover
					{filter}
					allSelectedValue={filter.allLabel}
					optionLayout="list"
					presentation="popover"
				/>
			{/each}
		</div>
		{#if hasSidebarActions}
			<div class="eliqauto-inventory-sidebar-actions">
				<a {...linkHref(desktop.sidebar.actions.clearHref)} class="eliqauto-inventory-sidebar-clear"
					>{desktop.sidebar.actions.clearLabel}</a
				>
				<button class="eliqauto-inventory-sidebar-apply" type="submit">
					{desktop.sidebar.actions.showLabel}
				</button>
			</div>
		{/if}
	</form>
{/snippet}

<section
	class="eliqauto-inventory-banner eliqauto-inventory-banner--compact eliqauto-search-hero"
	aria-label={desktop.ariaLabel}
>
	<div class="container">
		<img
			class="eliqauto-inventory-banner__cutout eliqauto-inventory-banner__cutout--left"
			src="/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp"
			alt=""
			width="1536"
			height="1024"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>
		<div class="eliqauto-inventory-banner__hero-copy">
			<h1 class="eliqauto-inventory-banner__title">Търси автомобили</h1>
		</div>
		<img
			class="eliqauto-inventory-banner__cutout eliqauto-inventory-banner__cutout--right"
			src="/assets/eliqauto/megamenu/inventory-audi-sq5-cutout.webp"
			alt=""
			width="1536"
			height="1024"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>
		<div class="eliqauto-inventory-banner__search-group">
			<InventorySearchDialog
				{desktop}
				{modelOptionsByBrand}
				search={page.url.search}
				onSearch={searchFromDialog}
			>
				{#snippet children(openSearch)}
					<div class="eliqauto-inventory-banner__buybox">
						<form
							class="eliqauto-inventory-searchbar"
							action={inventoryAction}
							method="get"
							role="search"
							aria-label={desktop.searchLabel}
							data-eliqauto-search-form="inventory"
							onsubmit={handleSearchSubmit}
							onchange={handleFilterChange}
						>
							{#each desktop.hiddenInputs as input (`${input.name}:${input.value}`)}
								<input type="hidden" name={input.name} value={input.value} />
							{/each}
							<div class="eliqauto-inventory-searchbar__row">
								<div class="eliqauto-inventory-searchbar__primary">
									<input type="hidden" name="q" value={desktop.searchValue} />
									<button
										type="button"
										class="eliqauto-inventory-searchbar__search"
										aria-label={desktop.searchLabel}
										aria-haspopup="dialog"
										onclick={(event) => openSearch(event.currentTarget)}
									>
										<Search size={18} strokeWidth={2} aria-hidden="true" />
										<span>{desktop.searchValue || desktop.searchPlaceholder}</span>
									</button>
									<button
										class="eliqauto-inventory-searchbar__filter eliqauto-inventory-searchbar__filter--secondary"
										id="filterSidebarToggle"
										type="button"
										aria-label={desktop.filterButtonLabel}
										aria-controls="filterSidebar"
										aria-expanded={sidebarOpen}
										onclick={(event) => openFilterDrawer(event.currentTarget)}
									>
										<SlidersHorizontal size={18} strokeWidth={2.25} aria-hidden="true" />
										<span>{desktop.filterButtonLabel}</span>
									</button>
									<button
										class="eliqauto-inventory-searchbar__submit"
										type="button"
										aria-haspopup="dialog"
										onclick={(event) => openSearch(event.currentTarget)}
									>
										<Search size={18} strokeWidth={2.4} aria-hidden="true" />
										<span>{desktop.searchSubmit}</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				{/snippet}
			</InventorySearchDialog>
		</div>
	</div>
</section>

<div class="eliqauto-inventory-fab" {@attach activateViewMenu}>
	<button
		class="eliqauto-inventory-fab__button"
		type="button"
		aria-haspopup="dialog"
		aria-expanded={viewMenuOpen}
		aria-controls="inventoryViewMenu"
		aria-label={desktop.controlsLabel}
		onclick={() => {
			viewMenuOpen = !viewMenuOpen;
		}}
	>
		<LayoutGrid size={22} strokeWidth={2.25} aria-hidden="true" />
	</button>
	<div id="inventoryViewMenu" class="eliqauto-inventory-fab__panel" hidden={!viewMenuOpen}>
		{@render viewControls()}
	</div>
</div>

<section class="eliqauto-inventory-main pb-100" aria-label={desktop.resultsLabel}>
	<div class="container">
		{#if desktop.layout === 'dashboard'}
			<div class={dashboardClass}>
				<aside class="eliqauto-inventory-dashboard-sidebar" aria-label={desktop.filtersLabel}>
					{@render sidebarFilterForm()}
				</aside>
				<div class="eliqauto-inventory-dashboard-results">
					{#if desktop.activeFilters}
						<AuxeroInventoryActiveFilters
							activeFilters={desktop.activeFilters}
							modifierClass="eliqauto-inventory-active-filters--results"
						/>
					{/if}
					{@render resultsToolbar()}
					<AuxeroInventoryContent {cards} {copy} view={desktop.view} />
				</div>
				{#if desktop.map}
					<div class="eliqauto-inventory-dashboard-map">
						<AuxeroInventoryMapFallback map={desktop.map} />
					</div>
				{/if}
			</div>
		{:else}
			<form
				class="eliqauto-grid-filters"
				action={inventoryAction}
				method="get"
				aria-label={desktop.filtersLabel}
				onsubmit={handleSearchSubmit}
				onchange={handleFilterChange}
			>
				{#each desktop.hiddenInputs as input (`grid:${input.name}:${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				{#if desktop.searchValue}<input type="hidden" name="q" value={desktop.searchValue} />{/if}
				{#each desktop.sidebar.filters as filter (filter.name)}
					{#if gridFilterNames.has(filter.name)}
						<AuxeroInventoryFilterPopover
							{filter}
							fieldDisplayMode="single-title"
							allSelectedValue={filter.allLabel}
							optionLayout="list"
							presentation="popover"
						/>
					{:else}
						{#each filter.selectedValues as value (value)}<input
								type="hidden"
								name={filter.name}
								{value}
							/>{/each}
					{/if}
				{/each}
				<button
					class="eliqauto-grid-filters__more"
					type="button"
					aria-controls="filterSidebar"
					aria-expanded={sidebarOpen}
					onclick={(event) => openFilterDrawer(event.currentTarget)}
				>
					<SlidersHorizontal size={18} aria-hidden="true" /><span>Още филтри</span>
				</button>
			</form>
			{#if desktop.activeFilters}
				<AuxeroInventoryActiveFilters
					activeFilters={desktop.activeFilters}
					modifierClass="eliqauto-inventory-active-filters--results"
				/>
			{/if}

			{@render resultsToolbar()}
			<AuxeroInventoryContent {cards} {copy} view={desktop.view} />

			{#if desktop.map}
				<AuxeroInventoryMapFallback map={desktop.map} />
			{/if}
		{/if}
	</div>
</section>

<div
	id="filterSidebar"
	class={['filter-sidebar', sidebarOpen && 'active']}
	role="dialog"
	aria-modal={sidebarOpen ? 'true' : undefined}
	aria-label={desktop.filtersLabel}
	aria-hidden={!sidebarOpen}
	{@attach sidebarOpen && activateFilterDrawer}
>
	<button
		class="filter-sidebar__overlay"
		type="button"
		aria-label="Close filters"
		onclickcapture={() => closeFilterDrawer()}
	></button>
	<div class="filter-sidebar__panel right-sidebar">
		<button
			id="filterSidebarClose"
			class="filter-sidebar__close"
			type="button"
			aria-label="Close filters"
			onclickcapture={() => closeFilterDrawer()}
		>
			<X size={18} strokeWidth={2.4} aria-hidden="true" />
		</button>
		{@render sidebarFilterForm()}
	</div>
</div>

{#snippet viewIcon(view: AuxeroInventoryView)}
	{#if view === '5'}
		<svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="10" cy="6" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="17" cy="6" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="24" cy="6" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="31" cy="6" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="3" cy="14" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="10" cy="14" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="17" cy="14" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="24" cy="14" r="2.25" fill="white" stroke="#9FA1A4" />
			<circle cx="31" cy="14" r="2.25" fill="white" stroke="#9FA1A4" />
		</svg>
	{:else if view === '4'}
		<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="11" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="19" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="27" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="11" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="19" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="27" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
		</svg>
	{:else if view === 'map'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="5" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<rect x="9" y="3.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="5" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<rect x="9" y="11.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
		</svg>
	{:else}
		<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="19" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
			<circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
			<circle cx="19" cy="14" r="2.5" stroke="#9FA1A4" />
		</svg>
	{/if}
{/snippet}

<style>
	.eliqauto-grid-filters {
		position: relative;
		z-index: 20;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
		gap: 8px;
		margin-bottom: 16px;
	}

	.eliqauto-grid-filters :global(.ifp__field),
	.eliqauto-grid-filters__more {
		min-height: 48px;
		border: 1px solid #d4d4d8;
		border-radius: 8px;
		background: #ffffff;
		color: var(--bc-ink);
		box-shadow: none;
	}

	.eliqauto-grid-filters :global(.ifp__field) {
		padding: 8px 36px 8px 12px;
	}

	.eliqauto-grid-filters :global(.ifp__label) {
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
		color: inherit;
		text-transform: none;
		letter-spacing: 0;
	}

	.eliqauto-grid-filters :global(.ifp__field--selected) {
		border-color: #a1a1aa;
		background: #f5f5f6;
	}

	.eliqauto-grid-filters :global(.ifp__field--selected .ifp__label) {
		font-weight: 600;
	}

	.eliqauto-grid-filters :global(.ifp__panel) {
		width: max(100%, 280px);
		max-width: calc(100vw - 48px);
		border: 1px solid #d4d4d8;
		border-radius: 8px;
		padding: 4px;
		background: #ffffff;
		box-shadow: none;
	}

	.eliqauto-grid-filters :global(.ifp:nth-last-of-type(-n + 2) .ifp__panel) {
		left: auto;
		right: 0;
	}

	.eliqauto-grid-filters :global(.ifp__row) {
		min-height: 44px;
		border-color: transparent;
		border-radius: 6px;
		background: #ffffff;
	}

	.eliqauto-grid-filters :global(.ifp__row:has(input:checked)) {
		background: #fff1f2;
	}

	.eliqauto-grid-filters :global(.ifp__tick) {
		display: none;
	}

	.eliqauto-grid-filters__more {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding-inline: 16px;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
	}

	.eliqauto-grid-filters__more span {
		font: inherit;
		color: inherit;
	}

	.eliqauto-grid-filters__more:hover,
	.eliqauto-grid-filters :global(.ifp__field:hover) {
		border-color: var(--bc-ink);
		background: #f5f5f6;
	}

	.eliqauto-grid-filters__more:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	.eliqauto-inventory-dashboard-sidebar .eliqauto-inventory-sidebar-actions {
		grid-template-columns: 1fr;
	}

	.eliqauto-inventory-dashboard-sidebar .eliqauto-inventory-sidebar-apply {
		display: none;
	}

	.eliqauto-inventory-banner {
		position: relative;
		isolation: isolate;
		display: flex;
		min-height: 0;
		align-items: stretch;
		overflow: hidden;
		border: 0;
		background: #b5121b;
		background-color: #b5121b;
		background-image: none;
		box-shadow: none;
	}

	:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner),
	:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner--compact) {
		align-items: stretch;
		background: #b5121b;
		background-color: #b5121b;
		background-image: none;
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
	}

	.eliqauto-inventory-banner:has(:global(.filter-select-dropdown__toggle:checked)),
	.eliqauto-inventory-banner:has(:global(.ifp--open)),
	.eliqauto-inventory-banner:has(:global(.core-dropdown.active)) {
		z-index: 80;
		overflow: visible;
	}

	.eliqauto-inventory-banner::before,
	:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner::before) {
		display: none;
		content: none;
		width: 0;
		height: 0;
		background: none;
	}

	.eliqauto-inventory-banner > .container,
	:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner > .container),
	:global(
		body.eliqauto-inventory-template section.eliqauto-inventory-banner--compact > .container
	) {
		position: relative;
		z-index: 1;
		display: grid;
		width: 100%;
		min-height: var(--hero-search-height, 340px);
		align-items: start;
		box-sizing: border-box;
		padding-top: var(--hero-search-copy-top, 32px);
		padding-bottom: 24px;
	}

	.eliqauto-sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		border: 0;
		padding: 0;
		white-space: nowrap;
	}

	.eliqauto-inventory-banner__title {
		margin: 0;
		color: #ffffff;
		font-size: 46px;
		font-weight: var(--bc-weight-semibold);
		letter-spacing: -0.03em;
		line-height: 1.05;
		text-align: center;
	}

	.eliqauto-inventory-banner__hero-copy {
		position: relative;
		z-index: 2;
		width: min(680px, 54%);
		margin-inline: auto;
		text-align: center;
	}

	.eliqauto-inventory-banner__cutout {
		position: absolute;
		bottom: 98px;
		z-index: 1;
		display: none;
		width: 31%;
		height: 190px;
		max-width: none;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}

	.eliqauto-inventory-banner__cutout--left {
		left: clamp(-112px, -5vw, -52px);
		object-position: left bottom;
	}

	.eliqauto-inventory-banner__cutout--right {
		right: clamp(-112px, -5vw, -52px);
		object-position: right bottom;
		transform: scaleX(-1);
	}

	@media (min-width: 1024px) {
		.eliqauto-inventory-banner {
			--hero-search-height: 300px;
			--hero-search-copy-top: 40px;
		}
		:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner > .container) {
			grid-template-rows: auto auto;
			align-content: center;
			padding-block: 40px;
			row-gap: 24px;
		}

		.eliqauto-inventory-banner__hero-copy {
			align-self: end;
		}

		.eliqauto-inventory-banner__cutout {
			top: auto;
			bottom: 64px;
			display: block;
			width: var(--hero-search-cutout-width);
		}

		.eliqauto-inventory-banner__cutout--left {
			left: clamp(0px, 1vw, 16px);
		}

		.eliqauto-inventory-banner__cutout--right {
			right: clamp(0px, 1vw, 16px);
		}
	}

	.eliqauto-inventory-banner__search-group {
		position: relative;
		z-index: 5;
		width: min(var(--hero-search-width, 100%), 100%);
		margin: auto auto 0;
	}

	.eliqauto-inventory-banner__buybox,
	:global(
		body.eliqauto-inventory-template .eliqauto-inventory-banner .eliqauto-inventory-banner__buybox
	) {
		position: relative;
		z-index: 5;
		display: grid;
		width: 100%;
		max-width: none;
		margin: 0;
		border: 0;
		border-radius: 12px;
		background: var(--bc-surface-raised);
		padding: var(--hero-search-padding, 14px) var(--hero-search-padding, 16px)
			var(--hero-search-padding, 16px);
		overflow: visible;
		box-shadow: none;
		margin-top: auto;
	}

	.eliqauto-inventory-banner--compact > .container,
	:global(
		body.eliqauto-inventory-template section.eliqauto-inventory-banner--compact > .container
	) {
		padding-top: var(--hero-search-copy-top, 32px);
		padding-bottom: 24px;
	}

	@media (max-width: 1399px) {
		:global(
			body.eliqauto-inventory-template .eliqauto-inventory-banner .eliqauto-inventory-banner__buybox
		) {
			max-width: none;
			margin-inline: 0;
		}
	}

	@media (max-width: 991px) {
		:global(body.eliqauto-inventory-template section.eliqauto-inventory-banner > .container) {
			width: 100%;
			min-height: 300px;
			padding-top: 24px;
			padding-bottom: 20px;
		}

		.eliqauto-inventory-banner__title {
			font-size: 38px;
		}

		:global(
			body.eliqauto-inventory-template .eliqauto-inventory-banner .eliqauto-inventory-banner__buybox
		) {
			max-width: none;
			margin-inline: 0;
			padding: 14px 14px 16px;
		}
	}

	.eliqauto-inventory-searchbar,
	.eliqauto-inventory-searchbar *,
	:global(body.eliqauto-inventory-template form.eliqauto-inventory-searchbar),
	:global(body.eliqauto-inventory-template form.eliqauto-inventory-searchbar *) {
		box-sizing: border-box;
	}

	.eliqauto-inventory-searchbar,
	:global(body.eliqauto-inventory-template form.eliqauto-inventory-searchbar) {
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		background-image: none;
		padding: 0;
		box-shadow: none;
	}

	.eliqauto-inventory-searchbar__row {
		display: grid;
		align-items: center;
		gap: 8px;
		grid-template-columns: minmax(0, 1fr);
	}

	.eliqauto-inventory-searchbar__primary,
	:global(body.eliqauto-inventory-template div.eliqauto-inventory-searchbar__primary),
	:global(body.eliqauto-inventory-template div.eliqauto-inventory-searchbar__primary:focus-within) {
		display: grid;
		height: auto;
		min-height: 0;
		align-items: stretch;
		grid-template-columns: minmax(0, 1fr) 120px 120px;
		gap: 8px;
		overflow: visible;
		border: 0;
		border-radius: 0;
		background: transparent;
		background-image: none;
		padding: 0;
		box-shadow: none;
		transition: none;
	}

	.eliqauto-inventory-searchbar__search,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__search) {
		display: flex;
		min-height: var(--hero-search-control-height, 52px);
		align-items: center;
		gap: 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 0 16px;
		min-width: 0;
		font: inherit;
		font-size: 16px;
		text-align: left;
		color: var(--bc-copy);
		cursor: pointer;
	}

	.eliqauto-inventory-searchbar__search:focus-within,
	:global(
		body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__search:focus-visible
	) {
		border-color: var(--bc-accent);
		box-shadow: 0 0 0 2px var(--bc-filter-ring);
	}

	.eliqauto-inventory-searchbar__search :global(svg) {
		width: 18px;
		height: 18px;
		flex: 0 0 auto;
		color: #62646a;
	}

	.eliqauto-inventory-searchbar__search span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-inventory-searchbar__search:hover {
		border-color: var(--bc-ink);
	}

	.eliqauto-inventory-searchbar__filter,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__filter) {
		display: inline-flex;
		min-height: var(--bc-touch);
		min-width: var(--bc-touch);
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--bc-accent);
		border-radius: 8px;
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		padding: 0 16px;
		white-space: nowrap;
		cursor: pointer;
		font: inherit;
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: 1;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.eliqauto-inventory-searchbar__filter:hover,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__filter:hover) {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-inventory-searchbar__filter :global(svg) {
		flex: 0 0 auto;
		color: currentColor;
	}

	.eliqauto-inventory-searchbar__filter span {
		display: inline-block;
	}

	.eliqauto-inventory-searchbar__filter--secondary,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__filter--secondary) {
		min-width: 120px;
		height: var(--hero-search-control-height, 52px);
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: #ffffff;
	}

	.eliqauto-inventory-searchbar__filter--secondary:hover,
	:global(
		body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__filter--secondary:hover
	) {
		border-color: var(--bc-ink-soft);
		background: var(--bc-ink-soft);
		color: #ffffff;
	}

	.eliqauto-inventory-searchbar__submit,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__submit) {
		display: inline-flex;
		height: var(--hero-search-control-height, 52px);
		min-height: var(--hero-search-control-height, 52px);
		min-width: 120px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 8px;
		background: var(--bc-accent);
		background-image: none;
		color: var(--bc-accent-contrast);
		cursor: pointer;
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		padding: 0 22px;
		box-shadow: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
		white-space: nowrap;
	}

	.eliqauto-inventory-searchbar__submit :global(svg) {
		flex: 0 0 auto;
	}

	.eliqauto-inventory-searchbar__submit:hover,
	:global(body.eliqauto-inventory-template button.eliqauto-inventory-searchbar__submit:hover) {
		background: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-toolbar-row
		:global(.core-dropdown__button) {
		background: var(--bc-control-hover);
		background-image: none;
		border-color: var(--bc-border);
		box-shadow: none;
		color: var(--bc-ink);
		min-height: var(--bc-touch);
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-toolbar-row
		:global(.core-dropdown__button:hover),
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-toolbar-row
		:global(.core-dropdown.active .core-dropdown__button) {
		border-color: var(--bc-border-strong);
		background: var(--bc-border-strong);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-view-toggle,
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-layout-switch,
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-filter-mode-toggle {
		background: var(--bc-surface-raised);
		background-image: none;
		border-color: var(--bc-border);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-view-toggle :global(.item-menu),
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-layout-toggle,
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-filter-mode-toggle__item {
		min-height: var(--bc-touch);
		min-width: var(--bc-touch);
		width: auto;
		height: auto;
		font-size: var(--bc-text-caption, 15px);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-view-toggle :global(.item-menu.active),
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-layout-toggle.active,
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-filter-mode-toggle__item.active {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-inventory-main {
		background: var(--bc-surface);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-main {
		background: var(--bc-surface);
		padding-top: 30px;
		position: relative;
		z-index: 1;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-main > .container {
		width: calc(100vw - 48px);
		max-width: 1600px;
	}

	.eliqauto-inventory-dashboard {
		display: grid;
		align-items: start;
		gap: 22px;
		grid-template-columns: 336px minmax(0, 1fr);
		border: 0;
		background: var(--bc-surface);
		box-shadow: none;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard {
		display: grid;
		align-items: start;
		gap: 22px;
		grid-template-columns: 336px minmax(0, 1fr);
		border: 0;
		background: var(--bc-surface);
		box-shadow: none;
		padding: 18px;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard--map {
		grid-template-columns: 300px minmax(520px, 0.95fr) minmax(320px, 1fr);
	}

	.eliqauto-inventory-dashboard-results {
		min-width: 0;
		background: var(--bc-surface);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard-results {
		background: var(--bc-surface);
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-dashboard-results
		.eliqauto-inventory-content {
		padding: 0;
	}

	:global(body.eliqauto-inventory-template .eliqauto-inventory-content > .content-inner),
	:global(body.eliqauto-inventory-template .eliqauto-inventory-content > .content-inner.active) {
		transform: none;
		transition-duration: 0s;
	}

	.eliqauto-inventory-demo-strip {
		position: relative;
		z-index: 6;
		display: grid;
		width: 100%;
		max-width: 100%;
		min-height: 0;
		align-items: center;
		justify-content: space-between;
		grid-template-columns: minmax(500px, 1fr) minmax(0, auto);
		gap: 10px 12px;
		margin: 0;
		border: 0;
		border-bottom: 1px solid var(--bc-border);
		border-radius: 0;
		background: transparent;
		padding: 0 0 12px;
		box-shadow: none;
	}

	.eliqauto-inventory-demo-strip--modal-focus {
		z-index: 10040;
		background: var(--bc-surface-raised);
		box-shadow: none;
	}

	.eliqauto-inventory-modal-focus-controls {
		display: grid;
		width: 100%;
		align-items: center;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 14px;
	}

	.eliqauto-inventory-modal-focus-controls__lead {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		gap: 10px;
		border-radius: 8px;
		background: var(--bc-accent);
		padding: 0 16px;
		color: var(--bc-accent-contrast);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
	}

	.eliqauto-inventory-modal-focus-controls__lead :global(svg) {
		flex: 0 0 auto;
		color: currentColor;
	}

	.eliqauto-inventory-modal-focus-controls__tabs {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 6px;
		overflow-x: auto;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: var(--bc-surface-raised);
		padding: 4px;
		scrollbar-width: none;
	}

	.eliqauto-inventory-modal-focus-controls__tabs::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-inventory-modal-focus-controls__tab {
		display: inline-flex;
		min-height: var(--bc-touch);
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		padding: 0 14px;
		color: var(--bc-ink);
		font: inherit;
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
		white-space: nowrap;
	}

	.eliqauto-inventory-modal-focus-controls__tab:hover {
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.eliqauto-inventory-modal-focus-controls__tab--active:hover {
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-inventory-modal-focus-controls__tab--active {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-inventory-modal-focus-controls__tab--active :global(*) {
		color: #ffffff;
	}

	.eliqauto-inventory-modal-focus-controls__tab--selected:not(
		.eliqauto-inventory-modal-focus-controls__tab--active
	) {
		background: #ffffff;
		color: #1c1c1c;
	}

	.eliqauto-inventory-listing-count {
		margin: 0 0 12px;
		color: var(--bc-muted);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 500;
		line-height: var(--bc-leading-caption, 1.35);
	}

	.eliqauto-inventory-results-toolbar {
		display: flex;
		min-width: 0;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 12px;
	}

	.eliqauto-inventory-results-toolbar .eliqauto-inventory-listing-count {
		margin: 0;
	}

	.eliqauto-inventory-fab {
		position: fixed;
		right: 24px;
		bottom: 28px;
		z-index: 70;
	}

	.eliqauto-inventory-fab__button {
		display: inline-flex;
		width: 52px;
		height: 52px;
		min-width: var(--bc-touch);
		min-height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 50%;
		background: var(--bc-ink);
		color: #ffffff;
		cursor: pointer;
	}

	.eliqauto-inventory-fab__button:hover {
		background: var(--bc-ink-soft);
		color: #ffffff;
	}

	.eliqauto-inventory-fab__panel {
		position: absolute;
		right: 0;
		bottom: calc(100% + 10px);
		width: min(280px, calc(100vw - 48px));
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: var(--bc-surface-raised);
		padding: 16px;
	}

	.eliqauto-inventory-fab__panel[hidden] {
		display: none;
	}

	.eliqauto-inventory-fab__panel .eliqauto-inventory-view-controls {
		display: grid;
		grid-template-columns: 1fr;
		width: 100%;
		align-items: stretch;
		justify-content: stretch;
		gap: 12px;
		flex-wrap: wrap;
	}

	.eliqauto-inventory-fab__panel .eliqauto-inventory-view-controls__group {
		display: grid;
		justify-items: stretch;
		width: 100%;
		gap: 8px;
	}

	.eliqauto-inventory-fab__panel .eliqauto-view-toggle,
	.eliqauto-inventory-fab__panel .eliqauto-inventory-layout-switch,
	.eliqauto-inventory-fab__panel .eliqauto-inventory-filter-mode-toggle {
		flex-wrap: wrap;
	}

	.eliqauto-inventory-result-count {
		flex: 0 1 auto;
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 14px;
	}

	.eliqauto-inventory-result-count p {
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-text-control, 16px);
		font-weight: 600;
		line-height: var(--bc-leading-control, 1.32);
		white-space: nowrap;
	}

	.eliqauto-inventory-result-count__copy {
		display: grid;
		gap: 2px;
	}

	.eliqauto-inventory-sort {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		justify-self: end;
	}

	.eliqauto-inventory-sort__label {
		color: var(--bc-muted);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 600;
		white-space: nowrap;
	}

	.eliqauto-inventory-demo-strip .eliqauto-inventory-sort__label {
		display: none;
	}

	.eliqauto-inventory-sort :global(.core-dropdown) {
		min-width: 154px;
	}

	.eliqauto-inventory-sort :global(.core-dropdown__button) {
		min-height: var(--bc-touch);
		border-color: var(--bc-border);
		border-radius: 8px;
		background: var(--bc-control-hover);
		padding-right: 13px;
		padding-left: 14px;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.eliqauto-inventory-sort :global(.core-dropdown__button:hover) {
		border-color: var(--bc-border-strong);
		background: var(--bc-border-strong);
		color: var(--bc-ink);
	}

	.eliqauto-inventory-sort :global(.core-dropdown__menu) {
		z-index: 180;
		min-width: 100%;
	}

	.eliqauto-inventory-sort :global(.core-dropdown__option) {
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.eliqauto-inventory-sort :global(.core-dropdown__option:hover) {
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.eliqauto-inventory-view-controls {
		display: flex;
		flex: 0 1 auto;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		flex-wrap: nowrap;
		justify-self: end;
	}

	.eliqauto-inventory-view-controls__group {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.eliqauto-inventory-view-controls__label {
		color: var(--bc-muted);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: var(--bc-leading-caption, 1.35);
		white-space: nowrap;
	}

	.eliqauto-view-toggle,
	.eliqauto-inventory-layout-switch,
	.eliqauto-inventory-filter-mode-toggle {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: var(--bc-surface-raised);
		padding: 3px;
	}

	.eliqauto-view-toggle :global(.item-menu),
	.eliqauto-inventory-layout-toggle,
	.eliqauto-inventory-filter-mode-toggle__item {
		display: inline-flex;
		min-width: var(--bc-touch);
		min-height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		color: var(--bc-ink);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.eliqauto-view-toggle :global(.item-menu:hover),
	.eliqauto-inventory-layout-toggle:hover,
	.eliqauto-inventory-filter-mode-toggle__item:hover {
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.eliqauto-view-toggle :global(.item-menu.active:hover),
	.eliqauto-inventory-layout-toggle.active:hover,
	.eliqauto-inventory-filter-mode-toggle__item.active:hover {
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-view-toggle :global(.item-menu.active),
	.eliqauto-inventory-layout-toggle.active,
	.eliqauto-inventory-filter-mode-toggle__item.active {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-view-toggle :global(.item-menu.active *),
	.eliqauto-inventory-layout-toggle.active :global(*),
	.eliqauto-inventory-filter-mode-toggle__item.active :global(*) {
		color: #ffffff;
	}

	.eliqauto-inventory-layout-toggle {
		padding: 0 12px;
	}

	.eliqauto-inventory-filter-mode-toggle__item {
		padding: 0 11px;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-toolbar-row,
	:global(body.auxero-template-listing-grid4-columns-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-toolbar-row,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-toolbar-row {
		display: flex;
		flex: 1 1 540px;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		grid-template-columns: none;
		margin: 0;
		background: transparent;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-result-count,
	:global(body.auxero-template-listing-grid4-columns-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-result-count,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-result-count {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-filter-mode-toggle__item.active,
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-layout-toggle.active,
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-view-toggle
		:global(.item-menu.active) {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-filter-mode-toggle__item.active
		:global(*),
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-layout-toggle.active
		:global(*),
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-view-toggle
		:global(.item-menu.active *) {
		color: var(--bc-accent-contrast);
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-filter-mode-toggle__item.active:hover,
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-inventory-layout-toggle.active:hover,
	:global(body.eliqauto-inventory-template)
		.eliqauto-inventory-demo-strip
		.eliqauto-view-toggle
		:global(.item-menu.active:hover) {
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-view-toggle :global(.item-menu.active svg circle),
	.eliqauto-view-toggle :global(.item-menu.active svg rect) {
		stroke: #ffffff;
	}

	.eliqauto-view-toggle :global(.item-menu.active:hover svg circle),
	.eliqauto-view-toggle :global(.item-menu.active:hover svg rect) {
		stroke: #ffffff;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-main
			> .container
			> .eliqauto-inventory-content
			.content-inner
			> .grid
	),
	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-dashboard-results
			.eliqauto-inventory-content
			.content-inner
			> .grid
	) {
		display: grid;
		width: 100%;
		min-width: 0;
		align-items: stretch;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-main
			> .container
			> .eliqauto-inventory-content
			.content-inner
			> .grid
			> *
	),
	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-dashboard-results
			.eliqauto-inventory-content
			.content-inner
			> .grid
			> *
	) {
		min-width: 0;
		max-width: 100%;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-main
			> .container
			> .eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-3
	) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-main
			> .container
			> .eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-4
	) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-main
			> .container
			> .eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-5
	) {
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 20px;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-dashboard--3
			.eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-3
	) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-dashboard--4
			.eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-4
	) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-dashboard--5
			.eliqauto-inventory-content
			.content-inner
			> .grid.grid-cols-5
	) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}

	.eliqauto-inventory-dashboard-sidebar {
		z-index: 15;
		background: #ffffff;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard-sidebar {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: #ffffff;
		box-shadow: none;
		max-height: none;
		overflow: visible;
		padding: 14px;
		position: sticky;
		top: 104px;
	}

	.eliqauto-inventory-sidebar-heading {
		display: grid;
		gap: 3px;
		margin-bottom: 12px;
		padding: 0 2px;
	}

	.eliqauto-inventory-sidebar-heading :global(.h5) {
		display: inline-flex;
		margin: 0;
		align-items: center;
		gap: 8px;
		color: var(--bc-ink);
		font-size: var(--bc-text-control, 16px);
		font-weight: 700;
		line-height: var(--bc-leading-card-title, 1.28);
	}

	.eliqauto-inventory-sidebar-heading :global(.text-secondary) {
		margin: 0;
		color: var(--bc-muted);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 500;
		line-height: var(--bc-leading-caption, 1.35);
	}

	.eliqauto-inventory-sidebar-fields {
		display: grid;
		gap: 8px;
		min-width: 0;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp) {
		position: relative;
		min-width: 0;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp--open) {
		z-index: auto;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__field) {
		box-sizing: border-box;
		min-height: var(--bc-touch);
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f5f5f6;
		padding: 8px 36px 8px 12px;
		box-shadow: none;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__field:hover) {
		border-color: #a1a1aa;
		background: #ffffff;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__field--selected) {
		border-color: #a1a1aa;
		background: #ffffff;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__field--selected .ifp__label) {
		color: var(--bc-ink);
		font-weight: 600;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp--open .ifp__field) {
		border-color: var(--bc-ink);
		background: #ffffff;
		box-shadow: none;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__label) {
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0;
		text-transform: none;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__value) {
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__value--placeholder) {
		color: var(--bc-muted);
		font-weight: 500;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__chev) {
		right: 15px;
		color: var(--bc-muted);
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__panel) {
		position: static;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		margin-top: 8px;
		border-color: var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 4px;
		box-shadow: none;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__grid) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__list),
	.eliqauto-inventory-sidebar-fields :global(.ifp__grid) {
		max-height: min(60vh, 384px);
		min-width: 0;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__row) {
		box-sizing: border-box;
		min-height: 44px;
		border-color: transparent;
		border-radius: 6px;
		background: transparent;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__tick) {
		display: none;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__row:has(.ifp__input:checked)) {
		border-color: transparent;
		background: #fff1f2;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__row:has(.ifp__input:focus-visible)) {
		outline: 2px solid var(--bc-accent);
		outline-offset: -2px;
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__chip) {
		min-height: 68px;
		border-color: var(--bc-border);
		background: var(--bc-surface-raised);
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__row:hover),
	.eliqauto-inventory-sidebar-fields :global(.ifp__chip:hover) {
		border-color: var(--bc-accent);
		background: var(--bc-surface);
	}

	.eliqauto-inventory-sidebar-fields :global(.ifp__row:has(.ifp__input:checked):hover),
	.eliqauto-inventory-sidebar-fields :global(.ifp__chip:has(.ifp__input:checked):hover) {
		border-color: var(--bc-accent);
		background: var(--bc-accent-soft);
	}

	.eliqauto-inventory-dashboard-sidebar .eliqauto-inventory-sidebar-fields :global(.ifp--open) {
		z-index: 90;
	}

	.eliqauto-inventory-dashboard-sidebar .eliqauto-inventory-sidebar-fields :global(.ifp__panel) {
		position: static;
		z-index: auto;
		width: 100%;
		margin-top: 8px;
		box-shadow: none;
	}

	.eliqauto-inventory-sidebar-actions {
		display: grid;
		align-items: center;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-top: 14px;
	}

	.eliqauto-inventory-sidebar-clear,
	.eliqauto-inventory-sidebar-apply {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		padding: 0 15px;
		font-size: var(--bc-text-caption, 15px);
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.eliqauto-inventory-sidebar-clear {
		border: 1px solid var(--bc-border);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
	}

	.eliqauto-inventory-sidebar-clear:hover {
		border-color: var(--bc-border-strong);
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.eliqauto-inventory-sidebar-apply {
		border: 1px solid var(--bc-accent);
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		cursor: pointer;
		font: inherit;
		font-weight: 700;
	}

	.eliqauto-inventory-sidebar-apply:hover {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	:global(body.eliqauto-inventory-template .eliqauto-favorite) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(body.eliqauto-inventory-template .eliqauto-favorite:hover) {
		border-color: #a01818;
		background: #a01818;
		background-color: #a01818;
		color: #ffffff;
		opacity: 1;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-content
			.card-box
			.top
			.heart.eliqauto-favorite:hover
	) {
		border-color: #a01818;
		background: #a01818;
		background-color: #a01818;
		color: #ffffff;
		opacity: 1;
	}

	:global(body.eliqauto-inventory-template .eliqauto-favorite:hover svg),
	:global(body.eliqauto-inventory-template .eliqauto-favorite:hover path) {
		color: #ffffff;
		fill: none;
		stroke: #ffffff;
	}

	:global(body.eliqauto-inventory-template .eliqauto-favorite.is-active:hover path) {
		fill: #ffffff;
		stroke: #ffffff;
	}

	:global(body.eliqauto-inventory-template .eliqauto-card-price__finance-link) {
		transition: color 0.14s ease;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-content
			.eliqauto-card-actions
			.view-details
	),
	:global(body.eliqauto-inventory-template .card-box__title a),
	:global(body.eliqauto-inventory-template .eliqauto-card-price__finance-link) {
		transition:
			color 0.14s ease,
			filter 0.14s ease,
			opacity 0.14s ease;
	}

	:global(body.eliqauto-inventory-template .eliqauto-card-price__finance-link:hover),
	:global(body.eliqauto-inventory-template .card-box__title a:hover),
	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-content
			.eliqauto-card-actions
			.view-details:hover
	) {
		color: #a01818;
	}

	:global(
		body.eliqauto-inventory-template
			.eliqauto-inventory-content
			.eliqauto-card-actions
			.view-details:hover
			img
	) {
		filter: brightness(0) saturate(100%) invert(45%) sepia(45%) saturate(962%) hue-rotate(38deg)
			brightness(92%) contrast(89%);
		opacity: 0.95;
	}

	.eliqauto-inventory-banner__buybox .eliqauto-inventory-searchbar {
		padding: 0;
	}

	@media (max-width: 1199px) {
		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard,
		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard--map {
			grid-template-columns: 1fr;
		}

		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard-sidebar,
		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard-map {
			max-height: none;
			position: relative;
			top: auto;
		}

		.eliqauto-inventory-demo-strip {
			grid-template-columns: 1fr;
			width: 100%;
		}

		.eliqauto-inventory-view-controls {
			flex: 1 1 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
			justify-self: start;
		}

		.eliqauto-inventory-results-toolbar {
			flex-wrap: wrap;
		}

		.eliqauto-inventory-modal-focus-controls {
			grid-template-columns: 1fr;
		}

		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-main
				> .container
				> .eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-3
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-main
				> .container
				> .eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-main
				> .container
				> .eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-5
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-dashboard
				.eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-3
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-dashboard
				.eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-dashboard
				.eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 1399px) and (min-width: 1200px) {
		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard {
			gap: 18px;
			grid-template-columns: 320px minmax(0, 1fr);
		}

		:global(body.eliqauto-inventory-template) .eliqauto-inventory-dashboard--map {
			grid-template-columns: 280px minmax(480px, 0.95fr) minmax(280px, 1fr);
		}

		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-main
				> .container
				> .eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}

		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-dashboard--4
				.eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.eliqauto-inventory-template
				.eliqauto-inventory-dashboard--5
				.eliqauto-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.eliqauto-inventory-demo-strip,
		.eliqauto-inventory-fab {
			display: none;
		}
	}

	:global(.eliqauto-inventory-desktop-route #filterSidebar[aria-hidden='false']) {
		opacity: 1;
		pointer-events: auto;
		visibility: visible;
	}

	:global(.eliqauto-inventory-desktop-route #filterSidebar[aria-hidden='true']) {
		opacity: 0;
		pointer-events: none;
		visibility: hidden;
	}

	:global(
		.eliqauto-inventory-desktop-route #filterSidebar[aria-hidden='false'] .filter-sidebar__panel
	) {
		left: auto;
		right: 0;
		transform: none;
	}

	:global(
		.eliqauto-inventory-desktop-route #filterSidebar[aria-hidden='true'] .filter-sidebar__panel
	) {
		right: -400px;
		transform: none;
	}

	:global(.eliqauto-inventory-desktop-route .filter-sidebar__overlay) {
		position: fixed;
		inset: 0;
		border: 0;
		background: rgba(0, 0, 0, 0.35);
	}

	:global(.eliqauto-inventory-desktop-route .filter-sidebar__panel) {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;
		width: min(400px, 100vw);
		overflow-y: auto;
		background: #ffffff;
		padding: 28px;
		transition: right 0.2s ease;
	}

	:global(.eliqauto-inventory-desktop-route .filter-sidebar__close) {
		position: absolute;
		top: 12px;
		right: 12px;
		display: inline-flex;
		width: var(--bc-touch);
		height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		color: #1c1c1c;
		font-weight: 800;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(.eliqauto-inventory-desktop-route .filter-sidebar__close:hover) {
		border-color: #a01818;
		background: #a01818;
		color: #ffffff;
	}

	:global(.eliqauto-inventory-desktop-route .filter-sidebar__close:hover svg),
	:global(.eliqauto-inventory-desktop-route .filter-sidebar__close:hover path) {
		color: #ffffff;
		stroke: #ffffff;
	}
</style>
