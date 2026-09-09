<script lang="ts">
	import { LayoutGrid, SlidersHorizontal, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { tick } from 'svelte';
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import type {
		AuxeroInventoryVehicleCard as AuxeroInventoryVehicleCardData,
		AuxeroInventoryView
	} from '$lib/auxero/inventory';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import CenteredRouteHero from '$lib/components/common/CenteredRouteHero.svelte';
	import InventoryAdvancedFilters from './InventoryAdvancedFilters.svelte';
	import AuxeroInventoryActiveFilters from './AuxeroInventoryActiveFilters.svelte';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';
	import AuxeroInventoryFilterPopover from './AuxeroInventoryFilterPopover.svelte';
	import AuxeroInventoryMapFallback from './AuxeroInventoryMapFallback.svelte';

	let {
		cards,
		copy,
		desktop
	}: {
		cards: AuxeroInventoryVehicleCardData[];
		copy: InventoryCopy;
		desktop: AuxeroInventoryDesktopData;
	} = $props();

	const dashboardClass = $derived(
		`daynight-inventory-dashboard daynight-inventory-dashboard--${desktop.view}`
	);
	const hasSidebarActions = $derived(Boolean(desktop.activeFilters));
	const compactFilterNames = [
		'feature',
		'brand',
		'model',
		'priceTo',
		'minYear',
		'fuel',
		'bodyType',
		'transmission',
		'mileageTo'
	] as const;
	const compactFilters = $derived.by(() =>
		compactFilterNames.flatMap((name) => {
			const filter =
				name === 'minYear'
					? {
							id: 'inventory-min-year',
							name: 'minYear',
							label: 'Година от',
							placeholder: 'Година от',
							allLabel: 'Всички години',
							mode: 'single' as const,
							selectedValues: page.url.searchParams.get('minYear')
								? [page.url.searchParams.get('minYear')!]
								: [],
							selectedSummary: page.url.searchParams.get('minYear')
								? 'От ' + page.url.searchParams.get('minYear')
								: 'Година от',
							options: [2015, 2018, 2020, 2022, 2024].map((year) => ({
								value: String(year),
								label: 'От ' + year
							}))
						}
					: desktop.filters.find((candidate) => candidate.name === name);

			return filter ? [filter] : [];
		})
	);

	const sidebarFilters = $derived([
		...desktop.sidebar.filters.slice(0, 3),
		...compactFilters.filter((filter) => filter.name === 'minYear'),
		...desktop.sidebar.filters.slice(3)
	]);

	// Fit quick controls to the actual column, including translated/selected labels.
	// Hidden controls remain in the form and are also available in All filters.
	function fitQuickFilters(element: HTMLDivElement) {
		let frame = 0;
		const fit = () => {
			const controls = Array.from(element.children) as HTMLElement[];
			for (const control of controls) control.style.setProperty('display', 'block', 'important');
			const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
			let used = 0;
			let full = false;
			for (const [index, control] of controls.entries()) {
				const width = control.getBoundingClientRect().width;
				const next = used + (index ? gap : 0) + width;
				if (index && (full || next > element.clientWidth)) {
					control.style.setProperty('display', 'none', 'important');
					full = true;
				} else {
					if (!index) control.style.removeProperty('display');
					used = next;
				}
			}
		};
		const schedule = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(fit);
		};
		const resize = new ResizeObserver(schedule);
		resize.observe(element);
		const content = new MutationObserver(schedule);
		content.observe(element, { childList: true, characterData: true, subtree: true });
		document.fonts.addEventListener('loadingdone', schedule);
		fit();
		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			content.disconnect();
			document.fonts.removeEventListener('loadingdone', schedule);
		};
	}

	let advancedOpen = $state(false);
	const selectedFilterCount = $derived(desktop.activeFilters?.chips.length ?? 0);
	const inventoryAction = resolve('/inventory');
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

		await goto(resolve(`/inventory${suffix}` as `/inventory${string}`), {
			invalidateAll: true,
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

		if (isModalPicker) return;

		void navigateForm(form);
	};

	const closeViewPicker = () => document.getElementById('inventory-view-picker')?.hidePopover();
	const positionViewPicker = (event: MouseEvent) => {
		const trigger = event.currentTarget as HTMLButtonElement;
		const panel = document.getElementById('inventory-view-picker');
		if (!panel) return;
		const bounds = trigger.getBoundingClientRect();
		const width = Math.min(360, window.innerWidth - 32);
		panel.style.width = `${width}px`;
		panel.style.left = `${Math.max(16, Math.min(bounds.right - width, window.innerWidth - width - 16))}px`;
		panel.style.right = 'auto';
		if (window.innerHeight - bounds.bottom >= 350) {
			panel.style.top = `${bounds.bottom + 8}px`;
			panel.style.bottom = 'auto';
		} else {
			panel.style.top = 'auto';
			panel.style.bottom = `${Math.max(16, window.innerHeight - bounds.top + 8)}px`;
		}
	};
	let sortOpen = $state(false);

	const activateSortDropdown = (element: HTMLDivElement) => {
		const onPointerDown = (event: PointerEvent) => {
			if (!element.contains(event.target as Node)) sortOpen = false;
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && sortOpen) {
				sortOpen = false;
				element.querySelector<HTMLButtonElement>('button')?.focus();
			}
			if (
				!element.contains(document.activeElement) ||
				!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
			)
				return;
			event.preventDefault();
			sortOpen = true;
			void tick().then(() => {
				const options = Array.from(
					element.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]')
				);
				const current = options.indexOf(document.activeElement as HTMLAnchorElement);
				const next =
					event.key === 'Home'
						? 0
						: event.key === 'End'
							? options.length - 1
							: current < 0
								? event.key === 'ArrowUp'
									? options.length - 1
									: 0
								: (current + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length;
				options[next]?.focus();
			});
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
		};
	};
</script>

<svelte:window onresize={closeViewPicker} onscroll={closeViewPicker} />

{#snippet viewPicker()}
	<div class="daynight-inventory-view-fab">
		<button
			class="daynight-inventory-view-fab__trigger"
			type="button"
			popovertarget="inventory-view-picker"
			onclick={positionViewPicker}
			aria-label="Промени изгледа на автомобилите"
			><LayoutGrid size={20} aria-hidden="true" />Изглед</button
		>
		<div
			id="inventory-view-picker"
			popover="auto"
			class="daynight-inventory-view-fab__panel"
			aria-label="Изглед на автомобилите"
		>
			<div class="daynight-inventory-view-fab__header">
				<h2>Изглед на автомобилите</h2>
				<button
					class="daynight-inventory-view-fab__close"
					type="button"
					popovertarget="inventory-view-picker"
					popovertargetaction="hide"
					aria-label="Затвори изгледите"><X size={20} aria-hidden="true" /></button
				>
			</div>
			<div class="daynight-inventory-view-fab__section">{@render viewControls()}</div>
		</div>
	</div>
{/snippet}

{#snippet utilityToolbar()}
	<div
		class="daynight-inventory-toolbar-row"
		class:daynight-inventory-toolbar-row--sidebar={desktop.layout === 'dashboard'}
	>
		<div class="daynight-inventory-results-filters" aria-label="Филтри за автомобилите">
			{#if desktop.layout === 'dashboard'}
				<a
					{...linkHref(desktop.layoutToggle.href)}
					class="daynight-hide-sidebar"
					data-daynight-layout-toggle
				>
					<SlidersHorizontal size={18} aria-hidden="true" />
					{desktop.sortLabel === 'Sort Vehicles by' ? 'Hide filters' : 'Скрий филтрите'}
				</a>
				<div class="daynight-sidebar-compact-fallback">{@render filterPanel()}</div>
			{:else}
				{@render filterPanel()}
			{/if}
		</div>
		<div class="daynight-inventory-sort">
			<div class="inventory-sort-control">
				<span class="daynight-inventory-sort__label">{desktop.sortLabel}</span>
				<div class={['core-dropdown', sortOpen && 'active']} {@attach activateSortDropdown}>
					<button
						type="button"
						class="core-dropdown__button"
						aria-label={`${desktop.sortLabel}: ${desktop.selectedSort}`}
						aria-haspopup="menu"
						aria-expanded={sortOpen}
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
										onclick={() => (sortOpen = false)}
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
			{@render viewPicker()}
		</div>
	</div>
{/snippet}

{#snippet viewControls()}
	<div class="daynight-inventory-view-controls" role="group" aria-label={desktop.viewLabel}>
		<span class="daynight-inventory-view-controls__label">{desktop.viewLabel}</span>
		<div class="daynight-inventory-view-controls__options">
			{#each desktop.viewOptions as option (option.view)}
				<a
					class={[
						'daynight-inventory-view-controls__option',
						option.active && 'daynight-inventory-view-controls__option--active'
					]}
					{...linkHref(option.href)}
					onclick={closeViewPicker}
					data-daynight-view-toggle
					aria-current={option.active ? 'page' : undefined}
					aria-label={option.ariaLabel}
					title={option.title}
				>
					{@render viewIcon(option.view)}
					<span>{option.label}</span>
				</a>
			{/each}
			<span class="daynight-inventory-view-controls__layout-divider" aria-hidden="true"></span>
			<a
				class="daynight-inventory-view-controls__option daynight-inventory-view-controls__layout-toggle"
				{...linkHref(desktop.layoutToggle.href)}
				onclick={closeViewPicker}
				data-daynight-layout-toggle
				aria-label={desktop.layoutToggle.ariaLabel}
				title={desktop.layoutToggle.title}
			>
				{@render layoutIcon(desktop.layoutToggle.active)}
				<span>{desktop.layoutToggle.label}</span>
			</a>
		</div>
	</div>
{/snippet}

{#snippet filterPanel()}
	<form
		class="daynight-filter-form daynight-inventory-filter-panel"
		action={inventoryAction}
		method="get"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#if desktop.layout === 'dashboard'}<input type="hidden" name="layout" value="dashboard" />{/if}
		{#each desktop.hiddenInputs.filter((input) => input.name !== 'minYear') as input (`results:${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#if desktop.searchValue}
			<input type="hidden" name="keyword" value={desktop.searchValue} />
		{/if}
		{#each desktop.filters.filter((filter) => filter.name === 'feature' || !compactFilterNames.includes(filter.name as (typeof compactFilterNames)[number])) as filter (filter.name)}
			{#each filter.selectedValues as value (value)}<input
					type="hidden"
					name={filter.name}
					{value}
				/>{/each}
		{/each}
		<div
			class="daynight-inventory-filter-grid"
			aria-label={desktop.filterPresentationLabel}
			{@attach fitQuickFilters}
		>
			{#each compactFilters as filter (filter.name)}
				{#if filter.name === 'feature'}
					<button
						class="inventory-all-filters"
						type="button"
						onclick={() => (advancedOpen = true)}
						aria-haspopup="dialog"
						><SlidersHorizontal size={18} aria-hidden="true" />Всички филтри{#if selectedFilterCount}<span
								>{selectedFilterCount}</span
							>{/if}</button
					>
				{:else}
					<AuxeroInventoryFilterPopover
						{filter}
						allSelectedValue={filter.allLabel}
						allFiltersTrigger={filter.name === 'feature'}
						fieldDisplayMode="single-title"
						showFieldIcon={false}
						fieldTitle={filter.name === 'feature' ? 'Всички филтри' : undefined}
						modalFilters={desktop.filters}
						optionLayout={filter.name === 'model' ? 'grid' : 'auto'}
						presentation="popover"
					/>
				{/if}
			{/each}
		</div>
	</form>
{/snippet}

{#snippet sidebarFilterForm()}
	<form
		class="daynight-filter-form daynight-inventory-sidebar-form"
		action={inventoryAction}
		method="get"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#if desktop.layout === 'dashboard'}<input type="hidden" name="layout" value="dashboard" />{/if}
		{#each desktop.hiddenInputs.filter((input) => input.name !== 'minYear') as input (`sidebar:${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#if desktop.searchValue}
			<input type="hidden" name="keyword" value={desktop.searchValue} />
		{/if}
		<div class="daynight-inventory-sidebar-heading">
			<p class="h5 mb-4">{desktop.sidebar.title}</p>
		</div>
		<div class="daynight-inventory-sidebar-fields">
			{#each sidebarFilters as filter (filter.name)}
				<AuxeroInventoryFilterPopover
					{filter}
					allSelectedValue={filter.allLabel}
					optionLayout="list"
					presentation="sidebar"
				/>
			{/each}
		</div>
		<button
			class="inventory-all-filters daynight-sidebar-more-filters"
			type="button"
			onclick={() => (advancedOpen = true)}
			aria-haspopup="dialog"
		>
			<SlidersHorizontal size={18} aria-hidden="true" />
			{desktop.sortLabel === 'Sort Vehicles by' ? 'More filters' : 'Още филтри'}
		</button>
		{#if hasSidebarActions}
			<div class="daynight-inventory-sidebar-actions">
				<a {...linkHref(desktop.sidebar.actions.clearHref)} class="daynight-inventory-sidebar-clear"
					>{desktop.sidebar.actions.clearLabel}</a
				>
				<button class="daynight-inventory-sidebar-apply" type="submit">
					{desktop.sidebar.actions.showLabel}
				</button>
			</div>
		{/if}
	</form>
{/snippet}

<CenteredRouteHero
	supportText="Не намираш точния автомобил?"
	supportHref={resolve('/contact')}
	supportLabel="Свържи се с нас"
	title={desktop.title}
	labelledby="daynight-inventory-title"
	image="/assets/daynight/banners/route-vehicles-studio-v5.png"
>
	<form
		class="daynight-inventory-searchbar"
		action={inventoryAction}
		method="get"
		role="search"
		aria-label={desktop.searchLabel}
		data-daynight-search-form="inventory"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#if desktop.layout === 'dashboard'}<input type="hidden" name="layout" value="dashboard" />{/if}
		{#each desktop.hiddenInputs as input (`${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#each desktop.filters as filter (filter.name)}{#each filter.selectedValues as value (value)}<input
					type="hidden"
					name={filter.name}
					{value}
				/>{/each}{/each}
		<div class="daynight-inventory-searchbar__row">
			<div class="daynight-inventory-searchbar__primary">
				<label class="daynight-inventory-searchbar__search">
					<img src="/assets/icons/search-icon.svg" alt="" />
					<input
						type="text"
						name="keyword"
						aria-label={desktop.searchLabel}
						value={desktop.searchValue}
						placeholder={desktop.searchPlaceholder}
						autocomplete="off"
					/>
				</label>
				<button class="route-hero-search-submit" type="submit">
					{desktop.searchSubmit} ({desktop.resultCount})
				</button>
			</div>
		</div>
	</form>
</CenteredRouteHero>

<div class="daynight-inventory-control-strip">
	<div class="container">
		<div class="daynight-inventory-results-toolbar">
			{@render utilityToolbar()}
		</div>
	</div>
</div>

{#if advancedOpen}<InventoryAdvancedFilters {desktop} onclose={() => (advancedOpen = false)} />{/if}

<section
	id="inventory-results"
	class="daynight-inventory-main pb-100"
	aria-label="Автомобили в наличност"
>
	<div class="container">
		{#if desktop.layout === 'dashboard'}
			<div class={dashboardClass}>
				<aside class="daynight-inventory-dashboard-sidebar" aria-label={desktop.filterButtonLabel}>
					{@render sidebarFilterForm()}
				</aside>
				<div class="daynight-inventory-dashboard-results">
					<div
						class="daynight-inventory-results-toolbar"
						class:daynight-inventory-results-toolbar--empty={!desktop.activeFilters}
					>
						{#if desktop.activeFilters}<AuxeroInventoryActiveFilters
								activeFilters={desktop.activeFilters}
								modifierClass="daynight-inventory-active-filters--results"
								compactLabels
							/>{/if}
					</div>
					<AuxeroInventoryContent {cards} {copy} view={desktop.view} />
				</div>
				{#if desktop.map}
					<div class="daynight-inventory-dashboard-map">
						<AuxeroInventoryMapFallback map={desktop.map} />
					</div>
				{/if}
			</div>
		{:else}
			<div
				class="daynight-inventory-results-toolbar"
				class:daynight-inventory-results-toolbar--empty={!desktop.activeFilters}
			>
				{#if desktop.activeFilters}<AuxeroInventoryActiveFilters
						activeFilters={desktop.activeFilters}
						modifierClass="daynight-inventory-active-filters--results"
						compactLabels
					/>{/if}
			</div>
			<AuxeroInventoryContent {cards} {copy} view={desktop.view} />

			{#if desktop.map}
				<AuxeroInventoryMapFallback map={desktop.map} />
			{/if}
		{/if}
	</div>
</section>

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

{#snippet layoutIcon(sidebarActive: boolean)}
	{#if sidebarActive}
		<svg
			width="24"
			height="18"
			viewBox="0 0 24 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect x="2" y="2" width="8" height="14" rx="1.5" />
			<path d="M14 4H22M14 9H22M14 14H22" stroke="currentColor" stroke-linecap="round" />
		</svg>
	{:else}
		<svg
			width="24"
			height="18"
			viewBox="0 0 24 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect x="2" y="2" width="8" height="6" rx="1.5" />
			<rect x="14" y="2" width="8" height="6" rx="1.5" />
			<rect x="2" y="10" width="8" height="6" rx="1.5" />
			<rect x="14" y="10" width="8" height="6" rx="1.5" />
		</svg>
	{/if}
{/snippet}

<style>
	.daynight-inventory-results-toolbar :global(.daynight-inventory-active-filters__chips) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.daynight-inventory-results-toolbar :global(.daynight-active-filter) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border: 1px solid #d2d6dc;
		border-radius: 8px;
		background: white;
		color: #25292e;
		font-size: 14px;
		line-height: 22px;
		text-decoration: none;
	}
	.daynight-inventory-results-toolbar :global(.daynight-active-filter--clear) {
		background: transparent;
		border-color: transparent;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	:global(.daynight-inventory-desktop-route #wrapper.daynight-public-shell) {
		overflow: clip !important;
	}
	.inventory-all-filters {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 48px;
		border: 1px solid var(--bc-ink);
		border-radius: 999px;
		background: var(--bc-ink);
		color: #fff;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
	}
	.inventory-all-filters span {
		display: grid;
		place-items: center;
		min-width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		color: var(--bc-ink);
		font-size: 12px;
	}
	.inventory-all-filters:hover {
		background: #343434;
		border-color: #343434;
	}
	.inventory-all-filters:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	@media (min-width: 768px) and (max-width: 999px) {
		.inventory-all-filters :global(svg) {
			display: none;
		}
	}

	.daynight-inventory-view-fab__header h2 {
		margin: 0;
		color: #fff;
		font-size: 19px;
		font-weight: 650;
	}
	.daynight-inventory-view-fab__panel .daynight-inventory-view-controls {
		display: block;
	}
	.daynight-inventory-view-fab__panel .daynight-inventory-view-controls__label,
	.daynight-inventory-view-fab__panel .daynight-inventory-view-controls__layout-divider {
		display: none;
	}
	.daynight-inventory-view-fab__panel .daynight-inventory-view-controls__options {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
	}
	.daynight-inventory-view-fab__panel .daynight-inventory-view-controls__option {
		justify-content: flex-start;
		padding: 12px 16px;
	}

	.daynight-inventory-results-filters {
		min-width: 0;
		grid-area: filters;
		max-width: 760px;
	}
	.daynight-sr-only {
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

	.daynight-inventory-searchbar {
		width: 100%;
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0;
		box-shadow: none;
	}

	.daynight-inventory-searchbar,
	.daynight-inventory-searchbar * {
		box-sizing: border-box;
	}

	.daynight-inventory-searchbar__row {
		display: grid;
		align-items: center;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr);
	}

	.daynight-inventory-searchbar__primary {
		display: grid;
		height: 56px;
		min-height: 56px;
		align-items: center;
		grid-template-columns: minmax(0, 1fr) auto;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: #ffffff;
		padding: 4px;
		transition: none;
	}

	.daynight-inventory-searchbar__primary:focus-within {
		background: #ffffff;
	}

	.daynight-inventory-searchbar__primary:has(input:focus-visible) {
		border-color: var(--bc-accent);
		box-shadow: 0 0 0 2px rgb(185 22 28 / 0.18);
	}

	.daynight-inventory-searchbar__search {
		display: flex;
		min-height: 42px;
		align-items: center;
		gap: 10px;
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0 17px;
	}

	.daynight-inventory-searchbar__search img {
		width: 16px;
		height: 16px;
		flex: 0 0 auto;
		opacity: 0.72;
	}

	.daynight-inventory-searchbar__search input {
		width: 100%;
		min-width: 0;
		height: auto;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent;
		box-shadow: none !important;
		color: #1c1c1c;
		font-size: 16px;
		line-height: 24px;
		outline: 0 !important;
		padding: 0 !important;
		transition: none !important;
	}

	.daynight-inventory-main {
		background: var(--bc-surface);
	}

	:global(body.daynight-inventory-template) .daynight-inventory-main {
		background: var(--bc-surface) !important;
		padding-top: 8px;
		position: relative;
		z-index: 1;
	}

	:global(body.daynight-inventory-template) .daynight-inventory-main > .container {
		width: calc(100vw - 48px);
		max-width: none;
	}

	.daynight-inventory-results-toolbar {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		margin: 0 0 22px;
		padding: 0 2px;
	}

	.daynight-inventory-results-toolbar .daynight-inventory-toolbar-row {
		width: 100%;
		flex: 1 1 auto;
	}

	:global(body.daynight-inventory-template .daynight-active-filter) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(body.daynight-inventory-template .daynight-active-filter:hover) {
		border-color: var(--bc-accent) !important;
		background: #f4f4f4 !important;
		color: #1c1c1c !important;
	}

	:global(body.daynight-inventory-template .daynight-active-filter--clear:hover) {
		border-color: var(--bc-accent-hover) !important;
		background: var(--bc-accent-hover) !important;
		color: #ffffff !important;
	}

	:global(body.daynight-inventory-template .daynight-active-filter:hover svg),
	:global(body.daynight-inventory-template .daynight-active-filter:hover path) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	:global(body.daynight-inventory-template .daynight-active-filter--clear:hover svg),
	:global(body.daynight-inventory-template .daynight-active-filter--clear:hover path) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	.daynight-inventory-dashboard {
		display: grid;
		align-items: start;
		gap: 22px;
		grid-template-columns: 284px minmax(0, 1fr);
		border: 0;
		background: var(--bc-surface);
		box-shadow: none;
	}

	:global(body.daynight-inventory-template) .daynight-inventory-dashboard {
		display: grid !important;
		align-items: start;
		gap: 22px;
		grid-template-columns: 284px minmax(0, 1fr);
		border: 0 !important;
		background: var(--bc-surface) !important;
		box-shadow: none !important;
		padding: 18px;
	}

	:global(body.daynight-inventory-template) .daynight-inventory-dashboard--map {
		grid-template-columns: 320px minmax(410px, 0.86fr) minmax(420px, 1fr);
	}

	.daynight-inventory-dashboard-results {
		min-width: 0;
		background: var(--bc-surface);
	}

	:global(body.daynight-inventory-template) .daynight-inventory-dashboard-results {
		background: var(--bc-surface) !important;
		border: 0 !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		padding: 0 !important;
	}

	:global(body.daynight-inventory-template)
		.daynight-inventory-dashboard-results
		.daynight-inventory-content {
		padding: 0 !important;
	}

	:global(body.daynight-inventory-template .daynight-inventory-content > .content-inner),
	:global(body.daynight-inventory-template .daynight-inventory-content > .content-inner.active) {
		transform: none !important;
		transition-duration: 0s !important;
	}

	.daynight-inventory-demo-strip {
		position: relative;
		z-index: 6;
		display: grid;
		width: min(1220px, calc(100vw - 48px));
		max-width: 100%;
		min-height: 78px;
		align-items: center;
		justify-content: space-between;
		grid-template-columns: minmax(0, 1fr);
		gap: 10px 12px;
		margin: 0 auto 10px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
		padding: 9px 12px;
		box-shadow: 0 8px 24px rgb(17 24 39 / 0.05);
	}

	.daynight-inventory-filter-panel {
		width: 100%;
		position: relative;
		z-index: 5;
		display: grid;
		gap: 14px;
		margin: 0;
		--bc-popover-surface: #f5f6f7;
		--bc-popover-chip-bg: #f3f4f6;
		--bc-popover-chip-hover: #ffffff;
		--bc-popover-chip-border-hover: var(--bc-accent);
		--bc-popover-accent-soft: #fff1f2;
		--bc-popover-focus: var(--bc-accent);
		--bc-filter-field-hover-bg: #e7eaee;
		--bc-filter-field-hover-border: #d2d7dd;
		--bc-filter-close-hover-bg: var(--bc-accent-hover);
		--bc-filter-done-hover: var(--bc-accent-hover);
		--bc-filter-clear-hover: #f3f4f6;
		--bc-filter-modal-row-hover: #ffffff;
		--bc-filter-modal-row-selected: #fff1f2;
		--bc-filter-panel-border: #e1e4e7;
		--bc-filter-panel-shadow:
			0 18px 42px rgb(17 24 39 / 0.16), 0 0 0 1px rgb(255 255 255 / 0.7) inset;
		--bc-filter-modal-border: var(--bc-border);
		--bc-filter-modal-shadow: 0 26px 72px rgba(10, 15, 20, 0.34);
		--bc-filter-backdrop: rgba(13, 19, 26, 0.52);
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0;
		box-shadow: none;
	}

	.daynight-inventory-filter-panel:has(:global(.ifp--modal.ifp--open)) {
		z-index: 10020;
	}

	.daynight-inventory-toolbar-row {
		display: flex;
		flex: 1 1 540px;
		min-width: 0;
		align-items: center;
		gap: 14px;
		justify-content: space-between;
	}

	.daynight-inventory-result-count {
		flex: 0 1 auto;
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 14px;
	}

	.daynight-inventory-result-count__text {
		margin: 0;
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.4;
	}

	.daynight-inventory-result-count p {
		margin: 0;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		white-space: nowrap;
	}

	.daynight-inventory-view-controls {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 9px;
	}

	.daynight-inventory-view-controls__label {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 650;
		white-space: nowrap;
	}

	.daynight-inventory-view-controls__options {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 6px;
	}

	.daynight-inventory-view-controls__option {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid #dde0e4;
		border-radius: var(--bc-radius-control);
		background: #f7f8f9;
		color: #36393e;
		font-size: 12.5px;
		font-weight: 680;
		line-height: 17px;
		padding: 0 10px;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
		white-space: nowrap;
	}

	.daynight-inventory-view-controls__option:hover {
		border-color: var(--bc-accent);
		background: #ffffff;
		color: #1c1c1c;
	}

	.daynight-inventory-view-controls__option:focus-visible {
		outline: 3px solid rgba(185, 22, 28, 0.22);
		outline-offset: 2px;
	}

	.daynight-inventory-view-controls__option--active,
	.daynight-inventory-view-controls__option--active:hover {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #ffffff;
	}

	.daynight-inventory-view-controls__option :global(svg) {
		width: 24px;
		height: 18px;
		flex: 0 0 auto;
	}

	.daynight-inventory-view-controls__option :global(svg circle),
	.daynight-inventory-view-controls__option :global(svg rect) {
		fill: transparent;
		stroke: currentColor;
	}

	.daynight-inventory-view-controls__layout-divider {
		width: 1px;
		height: 26px;
		margin: 0 2px;
		background: #dfe2e5;
	}

	.daynight-inventory-view-controls__layout-toggle {
		border-color: #cdd1d6;
		background: #ffffff;
	}

	.daynight-inventory-sort {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		justify-self: end;
	}

	.daynight-inventory-sort__label {
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}

	.daynight-inventory-demo-strip .daynight-inventory-sort__label {
		display: none;
	}

	.daynight-inventory-sort :global(.core-dropdown) {
		min-width: 154px;
	}

	.daynight-inventory-sort :global(.core-dropdown__button) {
		height: 48px;
		min-height: 48px;
		border-color: #aeb5be;
		border-radius: 999px;
		background: #fff;
		padding-right: 13px;
		padding-left: 14px;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.daynight-inventory-sort :global(.core-dropdown__button:hover) {
		border-color: var(--bc-accent);
		background: #ffffff;
		color: #1c1c1c;
	}

	.daynight-inventory-sort :global(.core-dropdown__menu) {
		z-index: 180;
		min-width: 100%;
		transition:
			opacity 0.16s ease,
			transform 0.16s ease;
	}

	.daynight-inventory-sort :global(.core-dropdown__option) {
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.daynight-inventory-sort :global(.core-dropdown__option:hover) {
		background: #f3f4f6;
		color: #1c1c1c;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row,
	:global(body.auxero-template-listing-grid4-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row {
		display: flex !important;
		flex: 1 1 540px !important;
		width: 100% !important;
		align-items: center !important;
		justify-content: space-between !important;
		gap: 12px !important;
		grid-template-columns: none !important;
		margin: 0 !important;
		background: transparent !important;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-result-count,
	:global(body.auxero-template-listing-grid4-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-result-count,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-result-count {
		display: flex !important;
		align-items: center !important;
		gap: 14px !important;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row
		.core-dropdown,
	:global(body.auxero-template-listing-grid4-columns-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row
		.core-dropdown,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.daynight-inventory-demo-strip
		.daynight-inventory-toolbar-row
		.core-dropdown {
		width: auto !important;
		min-width: 154px !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-main
			> .container
			> .daynight-inventory-content
			.content-inner
			> .grid
	),
	:global(
		body.daynight-inventory-template
			.daynight-inventory-dashboard-results
			.daynight-inventory-content
			.content-inner
			> .grid
	) {
		display: grid !important;
		width: 100%;
		min-width: 0;
		align-items: stretch;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-main
			> .container
			> .daynight-inventory-content
			.content-inner
			> .grid
			> *
	),
	:global(
		body.daynight-inventory-template
			.daynight-inventory-dashboard-results
			.daynight-inventory-content
			.content-inner
			> .grid
			> *
	) {
		min-width: 0;
		max-width: 100%;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-main
			> .container
			> .daynight-inventory-content
			.content-inner
			> .grid.grid-cols-3
	) {
		grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-main
			> .container
			> .daynight-inventory-content
			.content-inner
			> .grid.grid-cols-4
	) {
		grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-main
			> .container
			> .daynight-inventory-content
			.content-inner
			> .grid.grid-cols-5
	) {
		grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
		gap: 20px !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-dashboard--3
			.daynight-inventory-content
			.content-inner
			> .grid.grid-cols-3
	) {
		grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-dashboard--4
			.daynight-inventory-content
			.content-inner
			> .grid.grid-cols-4
	) {
		grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-dashboard--5
			.daynight-inventory-content
			.content-inner
			> .grid.grid-cols-5
	) {
		grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
		gap: 20px !important;
	}

	.daynight-inventory-filter-grid {
		display: grid;
		gap: 10px;
		grid-template-columns: 1.45fr repeat(4, minmax(0, 1fr));
	}

	.daynight-inventory-filter-grid
		:global(.ifp:nth-child(5n + 4) .ifp__panel:not(.ifp__panel--modal)),
	.daynight-inventory-filter-grid :global(.ifp:nth-child(5n) .ifp__panel:not(.ifp__panel--modal)) {
		right: 0;
		left: auto;
	}

	.daynight-inventory-filter-panel :global(.ifp__field) {
		min-height: 48px;
		align-content: center;
		gap: 0;
		border: 1px solid #aeb5be;
		border-radius: 999px;
		background: #fff;
		color: var(--bc-ink);
		padding: 0 30px 0 14px;
		box-shadow: none;
	}
	.daynight-inventory-filter-panel :global(.ifp__label),
	.daynight-inventory-filter-panel :global(.ifp__value) {
		color: inherit;
		font-size: 14px;
		font-weight: 600;
		text-transform: none;
		line-height: 20px;
		white-space: nowrap;
	}
	.daynight-inventory-filter-panel :global(.ifp__chev) {
		right: 10px;
		color: inherit;
	}
	.daynight-inventory-filter-panel :global(.ifp--all-filters .ifp__field) {
		padding-inline: 14px;
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: #fff;
		text-align: center;
	}
	.daynight-inventory-filter-panel :global(.ifp--all-filters .ifp__chev) {
		display: none;
	}
	.daynight-inventory-filter-panel :global(.ifp__field:hover),
	.daynight-inventory-filter-panel :global(.ifp--open .ifp__field),
	.daynight-inventory-filter-panel :global(.ifp__field--selected) {
		background: var(--bc-accent-soft);
		border-color: var(--bc-accent);
		color: var(--bc-accent);
	}
	.daynight-inventory-filter-panel :global(.ifp__field:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 4px;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel) {
		border-color: var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
		padding: 13px;
		box-shadow:
			0 18px 42px rgb(17 24 39 / 0.14),
			0 0 0 1px rgba(255, 255, 255, 0.82) inset;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal) {
		top: 50%;
		right: 0;
		left: 0;
		width: min(760px, calc(100vw - 48px));
		max-height: calc(100dvh - 48px);
		grid-template-rows: auto auto auto auto minmax(0, 1fr) auto;
		background: #ffffff;
		overflow: hidden;
		padding: 0;
		transform: translateY(-50%);
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__modal-list) {
		min-height: 0;
		max-height: none;
	}

	.daynight-inventory-filter-panel :global(.ifp__chip),
	.daynight-inventory-filter-panel :global(.ifp__row) {
		border-width: 1px;
		border-color: #dde0e4;
		background: #f3f4f6;
	}

	.daynight-inventory-filter-panel :global(.ifp__chip:hover),
	.daynight-inventory-filter-panel :global(.ifp__row:hover) {
		border-color: var(--bc-accent);
		background: #ffffff;
	}

	.daynight-inventory-filter-panel :global(.ifp__chip:has(.ifp__input:checked):hover),
	.daynight-inventory-filter-panel :global(.ifp__row:has(.ifp__input:checked):hover) {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: #ffffff;
	}

	.daynight-inventory-filter-panel
		:global(.ifp__chip:not(.ifp__chip--all):has(.ifp__input:checked)),
	.daynight-inventory-filter-panel :global(.ifp__row:has(.ifp__input:checked)) {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #ffffff;
	}

	.daynight-inventory-filter-panel :global(.ifp__chip--all:has(.ifp__input:checked)) {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #ffffff;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__close:hover) {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: #ffffff;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__close:hover svg),
	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__close:hover path) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__done:hover) {
		background: var(--bc-accent-hover);
		color: #ffffff;
	}

	.daynight-inventory-filter-panel :global(.ifp__panel--modal .ifp__clear:hover) {
		background: #f3f4f6;
		color: #1c1c1c;
	}

	.daynight-inventory-dashboard-sidebar {
		z-index: 15;
		background: #ffffff;
	}

	:global(body.daynight-inventory-template) .daynight-inventory-dashboard-sidebar {
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-card) !important;
		background: #ffffff !important;
		box-shadow: none !important;
		max-height: none;
		overflow: visible;
		padding: 18px;
		position: sticky;
		top: 96px;
	}

	.daynight-inventory-sidebar-heading {
		display: grid;
		gap: 3px;
		margin-bottom: 15px;
		padding: 0 2px;
	}

	.daynight-inventory-sidebar-heading :global(.h5) {
		margin: 0 !important;
		color: #101010;
		font-size: 17px;
		font-weight: 700;
		line-height: 24px;
	}

	.daynight-inventory-sidebar-heading :global(.text-secondary) {
		margin: 0;
		color: var(--bc-muted) !important;
		font-size: 13px;
		font-weight: 500;
		line-height: 19px;
	}

	.daynight-inventory-sidebar-fields {
		display: grid;
		gap: 0;
		min-width: 0;
	}
	.daynight-inventory-sidebar-fields :global(.ifp) {
		position: relative;
		min-width: 0;
		padding-block: 4px;
		border-bottom: 1px solid #e8eaed;
	}
	.daynight-inventory-sidebar-fields :global(.ifp--open) {
		z-index: auto;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__field) {
		min-height: 48px;
		padding: 10px 28px 10px 4px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		box-shadow: none;
		gap: 4px;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__field:hover) {
		background: #f5f6f7;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__label) {
		color: #20242a;
		font-size: 16px;
		font-weight: 650;
		line-height: 22px;
		letter-spacing: 0;
		text-transform: none;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__value) {
		color: #5b6470;
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__value--placeholder) {
		display: none;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__chev) {
		right: 4px;
		color: #5b6470;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__panel) {
		position: static;
		width: 100%;
		max-width: 100%;
		margin-top: 0;
		padding: 4px 0 12px;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		gap: 8px;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__list) {
		max-height: 264px;
		min-width: 0;
		gap: 0;
		padding-right: 4px;
		overscroll-behavior: contain;
		scrollbar-width: thin;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__row) {
		min-height: 40px;
		padding: 8px 6px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: #252a31;
		font-size: 14px;
		font-weight: 450;
		gap: 8px;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__row:hover),
	.daynight-inventory-sidebar-fields :global(.ifp__row:has(.ifp__input:checked):hover) {
		background: #f2f3f5;
		color: #252a31;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__row:has(.ifp__input:checked)) {
		background: #faf0f1;
		font-weight: 600;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__tick),
	.daynight-inventory-sidebar-fields :global(.ifp__rowimage) {
		display: none;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__search) {
		display: flex;
		align-items: center;
		min-height: 40px;
		gap: 8px;
		padding: 0 10px;
		border: 1px solid #cbd0d7;
		border-radius: 8px;
		background: #fff;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__search:focus-within) {
		border-color: var(--bc-accent);
		outline: 2px solid color-mix(in srgb, var(--bc-accent) 18%, transparent);
		outline-offset: 1px;
	}
	.daynight-inventory-sidebar-fields :global(.ifp__search input),
	.daynight-inventory-sidebar-fields :global(.ifp__search input:focus),
	.daynight-inventory-sidebar-fields :global(.ifp__search input:focus-visible) {
		min-width: 0;
		width: 100%;
		height: 38px;
		padding: 0 !important;
		border: 0 !important;
		outline: 0 !important;
		box-shadow: none !important;
		background: transparent !important;
		font-size: 14px;
	}

	.daynight-inventory-sidebar-actions {
		display: grid;
		align-items: center;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-top: 14px;
	}

	.daynight-inventory-sidebar-clear,
	.daynight-inventory-sidebar-apply {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		border-radius: var(--bc-radius-control);
		padding: 0 15px;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.2;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.daynight-inventory-sidebar-clear {
		border: 1px solid #cfd3d8;
		background: #ffffff;
		color: #151515;
	}

	.daynight-inventory-sidebar-clear:hover {
		border-color: var(--bc-accent);
		background: #f4f4f4;
		color: #1c1c1c;
	}

	.daynight-inventory-sidebar-apply {
		border: 1px solid var(--bc-accent);
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		font: inherit;
		font-weight: 600;
	}

	.daynight-inventory-sidebar-apply:hover {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: #ffffff;
	}

	:global(body.daynight-inventory-template .daynight-favorite) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(body.daynight-inventory-template .daynight-favorite:hover) {
		border-color: var(--bc-accent-hover) !important;
		background: var(--bc-accent-hover) !important;
		background-color: var(--bc-accent-hover) !important;
		color: #ffffff !important;
		opacity: 1 !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-content
			.card-box
			.top
			.heart.daynight-favorite:hover
	) {
		border-color: var(--bc-accent-hover) !important;
		background: var(--bc-accent-hover) !important;
		background-color: var(--bc-accent-hover) !important;
		color: #ffffff !important;
		opacity: 1 !important;
	}

	:global(body.daynight-inventory-template .daynight-favorite:hover svg),
	:global(body.daynight-inventory-template .daynight-favorite:hover path) {
		color: #ffffff !important;
		fill: none !important;
		stroke: #ffffff !important;
	}

	:global(body.daynight-inventory-template .daynight-favorite.is-active:hover path) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}

	:global(body.daynight-inventory-template .daynight-card-price__finance-link) {
		transition: color 0.14s ease;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-content
			.daynight-card-actions
			.view-details
	),
	:global(body.daynight-inventory-template .card-box__title a),
	:global(body.daynight-inventory-template .daynight-card-price__finance-link) {
		transition:
			color 0.14s ease,
			filter 0.14s ease,
			opacity 0.14s ease;
	}

	:global(body.daynight-inventory-template .daynight-card-price__finance-link:hover),
	:global(body.daynight-inventory-template .card-box__title a:hover) {
		color: var(--bc-accent-hover) !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-content
			.daynight-card-actions
			.view-details:hover
	) {
		background: var(--bc-accent-hover) !important;
		border-color: var(--bc-accent-hover) !important;
		color: #ffffff !important;
	}

	:global(
		body.daynight-inventory-template
			.daynight-inventory-content
			.daynight-card-actions
			.view-details:hover
			img
	) {
		filter: brightness(0) saturate(100%) invert(16%) sepia(97%) saturate(3538%) hue-rotate(348deg)
			brightness(90%) contrast(93%);
		opacity: 0.95;
	}

	.daynight-inventory-view-fab {
		position: static;
		flex: 0 0 auto;
	}
	.daynight-inventory-view-fab__trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 48px;
		padding: 0 16px;
		border: 1px solid #b4bcc6;
		border-radius: 999px;
		background: #fff;
		color: #20242a;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		white-space: nowrap;
	}

	.daynight-inventory-view-fab__trigger svg {
		width: 22px;
		height: 22px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}

	.daynight-inventory-view-fab__trigger:hover {
		background: #f5f6f7;
	}

	.daynight-inventory-view-fab__trigger:focus-visible,
	.daynight-inventory-view-fab:has(.daynight-inventory-view-fab__panel:popover-open)
		.daynight-inventory-view-fab__trigger {
		outline: 3px solid rgba(185, 22, 28, 0.24);
		outline-offset: 3px;
	}

	.daynight-inventory-view-fab__panel {
		position: fixed;
		inset: auto max(24px, env(safe-area-inset-right))
			calc(max(24px, env(safe-area-inset-bottom)) + 66px) auto;
		width: min(390px, calc(100vw - 48px));
		margin: 0;
		overflow: hidden;
		border: 1px solid rgba(22, 22, 22, 0.14);
		border-radius: 18px;
		background: #ffffff;
		padding: 0;
		box-shadow:
			0 28px 70px rgba(10, 10, 10, 0.26),
			0 8px 24px rgba(10, 10, 10, 0.14);
		color: #161616;
	}

	.daynight-inventory-view-fab__panel::backdrop {
		background: transparent;
	}

	.daynight-inventory-view-fab__header {
		display: flex;
		min-height: 82px;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		background: #111111;
		padding: 18px 18px 17px 20px;
		color: #ffffff;
	}

	.daynight-inventory-view-fab__header p,
	.daynight-inventory-view-fab__label {
		margin: 0;
	}

	.daynight-inventory-view-fab__header p {
		margin-bottom: 3px;
		color: rgba(255, 255, 255, 0.66);
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.daynight-inventory-view-fab__close {
		display: inline-flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.daynight-inventory-view-fab__close:hover,
	.daynight-inventory-view-fab__close:focus-visible {
		border-color: rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.16);
	}

	.daynight-inventory-view-fab__section {
		padding: 18px 20px 20px;
	}

	.daynight-inventory-view-fab__section + .daynight-inventory-view-fab__section {
		border-top: 1px solid #e2e4e7;
	}

	.daynight-inventory-view-fab__label {
		margin-bottom: 10px;
		color: #5b6068;
		font-size: 13px;
		font-weight: 720;
		line-height: 18px;
	}

	.daynight-inventory-view-fab__layout-options,
	.daynight-inventory-view-fab__view-options {
		display: grid;
		gap: 9px;
	}

	.daynight-inventory-view-fab__layout-options {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.daynight-inventory-view-fab__view-options {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.daynight-inventory-view-fab__option {
		display: flex;
		min-width: 0;
		min-height: 66px;
		align-items: center;
		justify-content: center;
		gap: 9px;
		border: 1px solid #d9dde2;
		border-radius: 11px;
		background: #f7f8f9;
		color: #171717;
		font-size: 14px;
		font-weight: 720;
		line-height: 18px;
		text-align: center;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease,
			transform 0.14s ease;
	}

	.daynight-inventory-view-fab__option:hover {
		border-color: var(--bc-accent);
		background: #ffffff;
		color: #171717;
		transform: translateY(-1px);
	}

	.daynight-inventory-view-fab__option:focus-visible {
		outline: 3px solid rgba(185, 22, 28, 0.22);
		outline-offset: 2px;
	}

	.daynight-inventory-view-fab__option--view {
		min-height: 72px;
		flex-direction: column;
		gap: 7px;
		font-size: 13px;
	}

	.daynight-inventory-view-fab__option--active,
	.daynight-inventory-view-fab__option--active:hover {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #ffffff;
		transform: none;
	}

	.daynight-inventory-view-fab__option :global(svg) {
		flex: 0 0 auto;
	}

	.daynight-inventory-view-fab__layout-icon {
		width: 30px;
		height: 24px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.35;
	}

	.daynight-inventory-view-fab__option--active :global(svg circle),
	.daynight-inventory-view-fab__option--active :global(svg rect) {
		fill: transparent;
		stroke: #ffffff;
	}

	@media (max-width: 1199px) {
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard,
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard--map {
			grid-template-columns: 1fr;
		}

		:global(body.daynight-inventory-template) .daynight-inventory-dashboard-sidebar,
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard-map {
			max-height: none;
			position: relative;
			top: auto;
		}

		.daynight-inventory-demo-strip {
			grid-template-columns: 1fr;
			width: min(100%, calc(100vw - 32px));
		}

		.daynight-inventory-toolbar-row {
			flex: 1 1 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
			justify-self: start;
		}

		.daynight-inventory-view-controls {
			flex: 1 1 100%;
			order: 3;
		}

		.daynight-inventory-view-controls__options {
			flex-wrap: wrap;
		}

		.daynight-inventory-sort {
			margin-left: auto;
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-main
				> .container
				> .daynight-inventory-content
				.content-inner
				> .grid.grid-cols-3
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-main
				> .container
				> .daynight-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-main
				> .container
				> .daynight-inventory-content
				.content-inner
				> .grid.grid-cols-5
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-3
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
		}
	}

	@media (max-width: 899px) and (min-width: 768px) {
		.daynight-inventory-filter-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.daynight-inventory-filter-grid :global(.ifp--all-filters) {
			grid-column: span 2;
		}
	}

	@media (max-width: 1399px) and (min-width: 1200px) {
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard {
			gap: 18px;
			grid-template-columns: 320px minmax(0, 1fr);
		}

		:global(body.daynight-inventory-template) .daynight-inventory-dashboard--map {
			grid-template-columns: 300px minmax(390px, 0.86fr) minmax(390px, 1fr);
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-main
				> .container
				> .daynight-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard--4
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-4
		),
		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard--5
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-5
		) {
			grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
		}
	}

	@media (min-width: 1400px) {
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard {
			gap: 18px;
			grid-template-columns: 270px minmax(0, 1fr);
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard--4
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-4
		) {
			grid-template-columns: repeat(4, minmax(250px, 1fr)) !important;
			gap: 18px !important;
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-dashboard--3
				.daynight-inventory-content
				.content-inner
				> .grid.grid-cols-3
		) {
			grid-template-columns: repeat(3, minmax(280px, 1fr)) !important;
			gap: 20px !important;
		}

		:global(
			body.daynight-inventory-template
				.daynight-inventory-main
				> .container
				> .daynight-inventory-content
				.content-inner
				> .grid.grid-cols-4
		) {
			grid-template-columns: repeat(4, minmax(250px, 1fr)) !important;
			gap: 20px !important;
		}
	}

	@media (max-width: 767.98px) {
		.daynight-inventory-demo-strip,
		.daynight-inventory-filter-panel,
		.daynight-inventory-view-fab {
			display: none;
		}
	}

	:global(.daynight-inventory-desktop-route #filterSidebar[aria-hidden='false']) {
		opacity: 1 !important;
		pointer-events: auto !important;
		visibility: visible !important;
	}

	:global(.daynight-inventory-desktop-route #filterSidebar[aria-hidden='true']) {
		opacity: 0 !important;
		pointer-events: none !important;
		visibility: hidden !important;
	}

	:global(
		.daynight-inventory-desktop-route #filterSidebar[aria-hidden='false'] .filter-sidebar__panel
	) {
		left: auto !important;
		right: 0 !important;
		transform: none !important;
	}

	:global(
		.daynight-inventory-desktop-route #filterSidebar[aria-hidden='true'] .filter-sidebar__panel
	) {
		right: -400px !important;
		transform: none !important;
	}

	:global(.daynight-inventory-desktop-route .filter-sidebar__overlay) {
		position: fixed;
		inset: 0;
		border: 0;
		background: rgba(0, 0, 0, 0.35);
	}

	:global(.daynight-inventory-desktop-route .filter-sidebar__panel) {
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

	:global(.daynight-inventory-desktop-route .filter-sidebar__close) {
		position: absolute;
		top: 12px;
		right: 12px;
		display: inline-flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f3f4f6;
		color: #1c1c1c;
		font-weight: 650;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(.daynight-inventory-desktop-route .filter-sidebar__close:hover) {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: #ffffff;
	}

	:global(.daynight-inventory-desktop-route .filter-sidebar__close:hover svg),
	:global(.daynight-inventory-desktop-route .filter-sidebar__close:hover path) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	@media (min-width: 768px) {
		.daynight-inventory-toolbar-row {
			display: grid;
			grid-template-areas: 'filters sort';
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 24px;
			align-items: center;
		}
		.daynight-inventory-sort {
			grid-area: sort;
		}
		.daynight-inventory-filter-grid {
			grid-template-columns: 1.45fr repeat(4, minmax(0, 1fr));
			gap: 10px;
		}
		.daynight-inventory-filter-grid :global(.ifp--all-filters) {
			grid-column: auto;
		}
	}
	@media (min-width: 768px) and (max-width: 1279px) {
		.daynight-inventory-toolbar-row {
			grid-template-areas: 'filters sort';
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 12px 20px;
		}
		.daynight-inventory-sort__label {
			display: none;
		}
		.daynight-inventory-filter-grid {
			gap: 8px;
		}
	}

	.daynight-inventory-hero-count {
		margin: 0;
		color: #fff;
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}
	@media (min-width: 768px) {
		.daynight-inventory-results-toolbar {
			position: sticky;
			top: 0;
			z-index: 40;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			padding: 16px 0;
			margin-bottom: 8px;
			background: #f1f2f3;
		}
		.daynight-inventory-toolbar-row {
			display: grid !important;
			grid-template-columns: minmax(0, 760px) auto !important;
			grid-template-areas: 'filters sort' !important;
			justify-content: space-between !important;
			gap: 24px;
		}
		.daynight-inventory-results-filters {
			width: 100%;
			justify-self: start;
		}
		.daynight-inventory-sort {
			flex-wrap: wrap;
			gap: 12px;
			justify-content: flex-end;
		}
		.daynight-inventory-sort__label {
			display: none;
		}
		.daynight-inventory-results-toolbar :global(.daynight-inventory-active-filters) {
			margin: 12px 0 0 !important;
			padding: 0 !important;
			border: 0 !important;
			background: transparent !important;
		}
		.daynight-inventory-results-toolbar :global(.daynight-inventory-active-filters__summary) {
			display: none;
		}
		.daynight-inventory-results-toolbar :global(.daynight-active-filter) {
			min-height: 36px;
		}
	}
	@media (min-width: 768px) and (max-width: 1199px) {
		.daynight-inventory-toolbar-row {
			grid-template-columns: 1fr !important;
			grid-template-areas: 'filters' 'sort' !important;
			gap: 12px;
		}
		.daynight-inventory-results-filters {
			max-width: none;
		}
		.daynight-inventory-sort {
			justify-content: space-between;
			width: 100%;
		}
	}
	@media (min-width: 768px) {
		:global(body.daynight-inventory-template) .daynight-inventory-main > .container {
			width: calc(100% - 64px) !important;
			max-width: var(--bc-page-width) !important;
			margin-inline: auto;
		}
		.daynight-inventory-toolbar-row {
			grid-template-columns: minmax(0, 1fr) auto !important;
			grid-template-areas: 'filters sort' !important;
			gap: 28px !important;
		}
		.daynight-inventory-results-filters {
			max-width: none;
		}
		.daynight-inventory-filter-grid {
			grid-template-columns: 210px repeat(5, minmax(0, 1fr)) !important;
			gap: 12px !important;
		}
		.daynight-inventory-sort {
			width: 100%;
			justify-content: space-between !important;
		}
		.inventory-sort-control {
			display: flex;
			align-items: center;
			gap: 12px;
		}
		.daynight-inventory-sort__label {
			display: none;
			font-size: 14px;
		}
		.daynight-inventory-results-toolbar {
			padding: 16px 0;
		}
		#inventory-results {
			scroll-margin-top: 88px;
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.daynight-inventory-filter-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
		}
	}
	@media (min-width: 768px) {
		.inventory-all-filters {
			font-size: 18px;
			font-weight: 600;
		}
		.daynight-inventory-filter-grid :global(.ifp__label),
		.daynight-inventory-sort :global(.core-dropdown__selected) {
			font-size: var(--bc-route-pill-font) !important;
			font-weight: 550 !important;
			line-height: 26px !important;
			color: #25282c !important;
		}
		.daynight-inventory-filter-grid :global(.ifp__field--selected .ifp__label) {
			color: var(--bc-accent) !important;
		}
		.daynight-inventory-filter-grid :global(.ifp__chev svg),
		.daynight-inventory-sort :global(.core-dropdown__button img) {
			width: 18px !important;
			height: 18px !important;
		}
		.daynight-inventory-sort :global(.core-dropdown__button) {
			min-width: 210px;
		}
		.daynight-inventory-searchbar__search input {
			font-size: var(--bc-route-pill-font) !important;
		}
		.daynight-inventory-searchbar__search input::placeholder {
			color: #626b76 !important;
			opacity: 1;
		}
	}
	@media (min-width: 768px) {
		.inventory-all-filters,
		.daynight-inventory-filter-grid :global(.ifp__field),
		.daynight-inventory-sort :global(.core-dropdown__button) {
			height: 56px !important;
			min-height: 56px !important;
		}
		.inventory-all-filters :global(svg) {
			width: 20px;
			height: 20px;
		}
	}
	@media (min-width: 768px) and (max-width: 1199px) {
		.daynight-inventory-filter-grid {
			grid-template-columns: 190px repeat(3, minmax(0, 1fr)) !important;
		}
	}
	@media (min-width: 768px) {
		.daynight-inventory-filter-grid {
			display: flex !important;
			min-width: 0;
			width: 100%;
			flex-wrap: nowrap;
			gap: 10px !important;
		}
		.daynight-inventory-filter-grid :global(> .ifp) {
			width: auto !important;
			flex: 0 0 auto !important;
		}
		.inventory-all-filters {
			padding: 0 20px;
		}
		.inventory-all-filters,
		.daynight-inventory-filter-grid :global(.ifp__field),
		.daynight-inventory-sort :global(.core-dropdown__button) {
			height: var(--bc-route-pill-height) !important;
			min-height: var(--bc-route-pill-height) !important;
		}
		.daynight-inventory-filter-grid :global(.ifp__field) {
			display: inline-flex !important;
			align-items: center !important;
			justify-content: flex-start !important;
			gap: 14px !important;
			width: auto !important;
			padding: 0 16px !important;
		}
		.daynight-inventory-filter-grid :global(.ifp__label) {
			flex: 0 1 auto !important;
			max-width: 180px;
			letter-spacing: 0 !important;
		}
		.daynight-inventory-filter-grid :global(.ifp__chev) {
			position: static !important;
			transform: none !important;
			margin: 0 !important;
			flex: 0 0 18px;
		}
		.daynight-inventory-sort :global(.core-dropdown__button) {
			min-width: 0;
			width: auto;
			gap: 14px;
			padding: 0 16px;
		}
	}
	@media (min-width: 768px) {
		.daynight-inventory-sort :global(.core-dropdown__button) {
			border-color: #d5d9de !important;
			background: #fff !important;
		}
		.daynight-inventory-sort :global(.core-dropdown__selected) {
			color: #25282c !important;
		}
		.daynight-inventory-sort :global(.core-dropdown__button:hover) {
			background: #f2f3f4 !important;
		}
		.daynight-inventory-filter-grid {
			gap: 10px !important;
		}
	}
	@media (min-width: 1600px) {
		:global(body.daynight-inventory-template) .daynight-inventory-main > .container {
			max-width: var(--bc-page-width) !important;
		}
	}
	:global(body.daynight-inventory-template .daynight-inventory-sort .core-dropdown__button) {
		border: 1px solid #d5d9de !important;
	}
	@media (min-width: 768px) {
		:global(body.daynight-inventory-template .daynight-card-price) {
			display: flex !important;
			flex-direction: column !important;
			align-items: flex-start !important;
			justify-content: flex-start !important;
			gap: 6px !important;
		}
		:global(body.daynight-inventory-template .daynight-card-price__finance) {
			margin-left: 0 !important;
			align-items: flex-start !important;
			text-align: left !important;
			gap: 4px !important;
		}
		:global(body.daynight-inventory-template .daynight-card-price__monthly) {
			font-size: 15px !important;
			font-weight: 500 !important;
			line-height: 22px !important;
			color: #50565e !important;
		}
		:global(body.daynight-inventory-template .daynight-card-price__finance-link) {
			font-size: 13px !important;
			line-height: 20px !important;
		}
	}
	@media (min-width: 768px) {
		:global(html body.daynight-inventory-template #wrapper .card-box-style-1 .content) {
			padding: 16px !important;
			gap: 12px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .card-box-style-1 .card-box__title) {
			margin: 0 !important;
			min-height: 44px !important;
			line-height: 22px !important;
			font-size: 17px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs) {
			display: grid !important;
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
			gap: 6px 10px !important;
			margin: 0 !important;
			padding: 0 !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li) {
			display: flex !important;
			align-items: center;
			gap: 6px !important;
			padding: 0 !important;
			background: none !important;
			border: 0 !important;
			min-width: 0;
			color: #3d4650 !important;
			font-size: 15px !important;
			line-height: 22px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li span) {
			font-size: 15px !important;
			color: #3d4650 !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs img) {
			display: block !important;
			width: 16px !important;
			height: 16px !important;
			flex: 0 0 16px;
			opacity: 0.85;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-price) {
			flex-direction: row !important;
			flex-wrap: nowrap !important;
			align-items: baseline !important;
			justify-content: space-between !important;
			gap: 8px !important;
			margin: 0 !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-price__amount) {
			font-size: 26px !important;
			line-height: 32px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-price__finance) {
			margin: 0 !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-price__monthly) {
			font-size: 14px !important;
			line-height: 22px !important;
			color: #50565e !important;
			text-decoration: none !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-price__monthly:hover) {
			text-decoration: underline !important;
		}
		:global(html body.daynight-inventory-template #wrapper .card-box-style-1 .divider) {
			display: none !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-actions) {
			padding: 0 !important;
			border: 0 !important;
			margin-top: auto !important;
		}
	}
	@media (min-width: 768px) {
		:global(html body.daynight-inventory-template #wrapper .card-box-style-1 .content) {
			display: grid !important;
			grid-template-rows: 44px 24px 32px 44px;
			align-content: start;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-actions) {
			margin: 0 !important;
		}
	}
	@media (min-width: 768px) {
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs) {
			display: flex !important;
			flex-wrap: nowrap !important;
			gap: 10px !important;
			align-items: center;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li) {
			white-space: nowrap;
			flex: 0 1 auto;
			overflow: hidden;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li span) {
			font-size: 14px !important;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs img) {
			display: none !important;
		}
	}
	.daynight-sidebar-more-filters {
		margin-top: 16px;
		width: 100%;
		justify-content: center;
	}
	.daynight-hide-sidebar {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 48px;
		padding: 0 16px;
		border: 1px solid var(--bc-border-strong, #b4bcc6);
		border-radius: 999px;
		background: #fff;
		color: var(--bc-ink, #1c1c1c);
		font-size: 16px;
		font-weight: 600;
	}
	.daynight-hide-sidebar:hover {
		background: #f6f6f6;
	}
	.daynight-hide-sidebar:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.daynight-sidebar-compact-fallback {
		display: none;
	}

	@media (min-width: 1024px) {
		:global(body.daynight-inventory-template)
			.daynight-inventory-dashboard:not(.daynight-inventory-dashboard--map) {
			grid-template-columns: 270px minmax(0, 1fr);
			padding: 0;
		}
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard-sidebar {
			margin-top: 16px;
		}
		.daynight-inventory-toolbar-row--sidebar {
			grid-template-columns: minmax(0, 1fr) auto !important;
			gap: 16px !important;
		}
		.daynight-inventory-dashboard-results .daynight-inventory-results-toolbar {
			margin-bottom: 20px;
		}
	}
	@media (min-width: 1024px) and (max-width: 1199px) {
		:global(body.daynight-inventory-template)
			.daynight-inventory-dashboard:not(.daynight-inventory-dashboard--map) {
			grid-template-columns: 240px minmax(0, 1fr);
		}
	}
	@media (max-width: 1023px) {
		:global(body.daynight-inventory-template)
			.daynight-inventory-dashboard:not(.daynight-inventory-dashboard--map) {
			grid-template-columns: minmax(0, 1fr);
			padding: 0;
		}
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard-sidebar,
		.daynight-hide-sidebar {
			display: none;
		}
		.daynight-sidebar-compact-fallback {
			display: block;
		}
	}
	@media (min-width: 768px) {
		.daynight-inventory-sort {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		.daynight-inventory-results-toolbar {
			row-gap: 12px;
			padding: 16px 0 0;
			margin-bottom: 20px;
		}
		.daynight-inventory-results-toolbar .daynight-inventory-toolbar-row {
			padding: 12px;
			min-height: 72px;
			border-radius: 12px;
			background: #fff;
		}
		.daynight-inventory-toolbar-row .inventory-all-filters {
			font-weight: 700;
			background: #1c1c1c;
			border-color: #1c1c1c;
			color: #fff;
		}
		.daynight-inventory-toolbar-row .inventory-all-filters:hover {
			background: #343434;
		}
		.daynight-inventory-toolbar-row .daynight-inventory-filter-grid :global(.ifp__field) {
			background: #fff !important;
			border-color: #d5d9de !important;
			color: #25282c !important;
		}
		.daynight-inventory-toolbar-row .daynight-inventory-filter-grid :global(.ifp__label),
		.daynight-inventory-toolbar-row .daynight-inventory-filter-grid :global(.ifp__chev) {
			color: #25282c !important;
		}
		.daynight-inventory-toolbar-row .daynight-inventory-filter-grid :global(.ifp__field:hover) {
			background: #f2f3f4 !important;
		}
		.daynight-inventory-toolbar-row .daynight-inventory-filter-grid :global(.ifp__field--selected) {
			background: #fff1f2 !important;
			border-color: var(--bc-accent) !important;
		}
		.daynight-inventory-toolbar-row
			.daynight-inventory-filter-grid
			:global(.ifp__field--selected .ifp__label),
		.daynight-inventory-toolbar-row
			.daynight-inventory-filter-grid
			:global(.ifp__field--selected .ifp__chev) {
			color: var(--bc-accent) !important;
		}
		.daynight-inventory-toolbar-row
			.daynight-inventory-filter-grid
			:global(.ifp__field:focus-visible),
		.daynight-inventory-toolbar-row .inventory-all-filters:focus-visible,
		.daynight-inventory-toolbar-row .daynight-hide-sidebar:focus-visible,
		.daynight-inventory-toolbar-row .daynight-inventory-view-fab__trigger:focus-visible {
			outline: 2px solid var(--bc-accent);
			outline-offset: 3px;
		}
		.daynight-inventory-results-toolbar :global(.daynight-inventory-active-filters__chips) {
			gap: 8px;
		}
		.daynight-inventory-results-toolbar :global(.daynight-active-filter) {
			min-height: 32px;
			padding: 6px 10px;
			font-size: 14px;
			border-radius: 8px;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs) {
			gap: 5px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li) {
			padding: 2px 5px !important;
			border-radius: 4px;
			background: #ffffff !important;
			color: #3d4650 !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-card-specs li span) {
			font-size: 13px !important;
			line-height: 20px !important;
		}
		:global(html body.daynight-inventory-template #wrapper .daynight-favorite:focus-visible),
		:global(html body.daynight-inventory-template #wrapper .card-box__title a:focus-visible),
		:global(html body.daynight-inventory-template #wrapper .daynight-card-actions a:focus-visible) {
			outline: 2px solid var(--bc-accent);
			outline-offset: 3px;
		}
	}

	@media (min-width: 768px) {
		.daynight-inventory-control-strip {
			position: sticky;
			top: 0;
			z-index: 40;
			background: #fff;
			border-bottom: 1px solid #dfe2e6;
		}
		.daynight-inventory-control-strip > .container {
			width: calc(100% - 64px);
			max-width: var(--bc-page-width);
			margin-inline: auto;
		}
		.daynight-inventory-control-strip .daynight-inventory-results-toolbar {
			position: static;
			padding: 12px 0;
			margin: 0;
			background: transparent;
		}
		.daynight-inventory-control-strip .daynight-inventory-toolbar-row {
			min-height: 48px;
			padding: 0;
			border-radius: 0;
		}
		:global(body.daynight-inventory-template) .daynight-inventory-main {
			padding-top: 24px;
		}
		:global(body.daynight-inventory-template) .daynight-inventory-dashboard-sidebar {
			margin-top: 0;
		}
		.daynight-inventory-main .daynight-inventory-results-toolbar {
			position: static;
			min-height: 0;
			padding: 0;
			margin: 0 0 16px;
		}
		.daynight-inventory-main .daynight-inventory-results-toolbar--empty {
			display: none;
		}
		.daynight-inventory-main
			.daynight-inventory-results-toolbar
			:global(.daynight-inventory-active-filters) {
			margin-top: 0 !important;
		}
	}

	@media (min-width: 768px) {
		.daynight-inventory-control-strip :global(.core-dropdown__button),
		.daynight-inventory-control-strip .daynight-inventory-view-fab__trigger,
		.daynight-inventory-control-strip .daynight-hide-sidebar {
			border: 1px solid #d5d9de !important;
			box-shadow: none !important;
			font-size: 16px;
			font-weight: 500;
		}
		.daynight-inventory-control-strip :global(.core-dropdown__selected),
		.daynight-inventory-control-strip .daynight-inventory-filter-grid :global(.ifp__label) {
			font-size: 16px !important;
			font-weight: 500 !important;
			line-height: 24px !important;
		}
	}
</style>
