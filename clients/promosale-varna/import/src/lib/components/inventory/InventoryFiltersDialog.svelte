<script lang="ts">
	import { tick } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { page } from '$app/state';
	import Search from '@lucide/svelte/icons/search';
	import DesktopFilterRange from './DesktopFilterRange.svelte';
	import DesktopFilterPicker from './DesktopFilterPicker.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { linkHref } from '$lib/utils/links';
	import {
		inventoryFilterParam,
		parseInventoryQuery,
		serializeInventoryQuery
	} from '$lib/domain/inventory-query';
	import '$lib/styles/desktop-filters.css';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilter
	} from '$lib/server/inventory-options';
	let {
		desktop,
		english = false,
		allOpen = $bindable(false),
		activeFilter = $bindable<AuxeroInventoryFilter | null>(null)
	}: {
		desktop: AuxeroInventoryDesktopData;
		english?: boolean;
		allOpen?: boolean;
		activeFilter?: AuxeroInventoryFilter | null;
	} = $props();
	let cleared = $state(false);
	let draft = $state<Record<string, string[]>>({});
	let keyword = $state('');
	let minimums = $state<Record<string, string>>({});
	let rangePicker = $state<DesktopFilterRange>();
	const minimumParam = (filter: AuxeroInventoryFilter) =>
		filter.name === 'priceTo' ? 'minPrice' : 'minMileage';
	let picker = $state<DesktopFilterPicker>();
	let filterForm = $state<HTMLFormElement>();
	let resultCount = $state<number | null>(null);
	let counting = $state(false);
	const draftFilters = $derived.by(() => {
		const make = desktop.filters.find((filter) => filter.name === 'brand');
		const brands = make ? (draft[make.id] ?? []) : [];
		return desktop.filters.map((filter) =>
			filter.modelCatalog
				? {
						...filter,
						options: filter.modelCatalog
							.filter(
								(option) =>
									!brands.length ||
									option.brands.some((brand) =>
										brands.some((selected) => selected.toLowerCase() === brand.toLowerCase())
									)
							)
							.map((option) => ({
								...option,
								label:
									brands.length === 1
										? option.value
										: `${option.brands.join(' / ')} ${option.value}`
							}))
							.sort((a, b) => a.label.localeCompare(b.label))
					}
				: filter
		);
	});
	const currentFilter = $derived(draftFilters.find((filter) => filter.id === activeFilter?.id));
	const orderedFilters = $derived(
		[...draftFilters].sort((a, b) => {
			const order = [
				'brand',
				'model',
				'priceTo',
				'mileageTo',
				'bodyType',
				'transmission',
				'fuel',
				'feature'
			];
			return order.indexOf(a.name) - order.indexOf(b.name);
		})
	);
	function updateSelection(filter: AuxeroInventoryFilter, values: string[]) {
		draft[filter.id] = values;
		if (filter.name === 'brand') {
			const model = draftFilters.find((item) => item.name === 'model');
			if (model)
				draft[model.id] = (draft[model.id] ?? []).filter((value) =>
					model.options.some((option) => option.value === value)
				);
		}
	}
	$effect(() => {
		if (!allOpen) return;
		const params = new SvelteURLSearchParams(passthrough);
		if (keyword.trim()) params.set('keyword', keyword.trim());
		for (const filter of desktop.filters) {
			if (filter.numericInput && minimums[filter.id])
				params.set(minimumParam(filter), minimums[filter.id]);
			for (const value of draft[filter.id] ?? [])
				params.append(inventoryFilterParam(filter.name), value);
		}
		const controller = new AbortController();
		counting = true;
		resultCount = null;
		const timer = setTimeout(async () => {
			try {
				const response = await fetch(`${linkHref('/api/inventory/count')}?${params}`, {
					signal: controller.signal
				});
				if (!response.ok) throw new Error('Inventory count unavailable');
				const data = await response.json();
				if (!controller.signal.aborted && Number.isInteger(data.count)) resultCount = data.count;
			} catch {
				// Filtering still works through the form when the preview is unavailable.
			} finally {
				if (!controller.signal.aborted) counting = false;
			}
		}, 180);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	});
	async function clearCategory() {
		if (!currentFilter) return;
		updateSelection(currentFilter, []);
		minimums[currentFilter.id] = '';
		await tick();
		(currentFilter.numericInput ? rangePicker : picker)?.focusSearch();
	}
	async function applyFilters() {
		if (rangePicker && !rangePicker.validate()) return;
		const invalid = draftFilters.find(
			(filter) =>
				filter.numericInput &&
				([...(draft[filter.id] ?? []), ...(minimums[filter.id] ? [minimums[filter.id]] : [])].some(
					(value) => !Number.isInteger(Number(value)) || Number(value) < 1
				) ||
					Boolean(
						minimums[filter.id] &&
						draft[filter.id]?.[0] &&
						Number(minimums[filter.id]) > Number(draft[filter.id][0])
					))
		);
		if (invalid) {
			activeFilter = invalid;
			await tick();
			rangePicker?.validate();
			return;
		}
		filterForm?.submit();
	}
	function chooseFilter(filter: AuxeroInventoryFilter | null) {
		activeFilter = filter;
	}
	async function navigateFilters(event: KeyboardEvent, index: number) {
		const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
		if (!keys.includes(event.key)) return;
		event.preventDefault();
		const tabs = [null, ...orderedFilters];
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? tabs.length - 1
					: (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + tabs.length) %
						tabs.length;
		activeFilter = tabs[next];
		await tick();
		filterForm?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus();
	}
	function selectionSummary(filter: AuxeroInventoryFilter) {
		const values = draft[filter.id] ?? [];
		if (filter.numericInput) {
			const min = minimums[filter.id];
			const format = (value: string) => Number(value).toLocaleString(english ? 'en' : 'bg');
			if (!min && !values.length) return '';
			const range =
				min && values[0]
					? `${format(min)} – ${format(values[0])}`
					: min
						? `${english ? 'From' : 'От'} ${format(min)}`
						: `${english ? 'Up to' : 'До'} ${format(values[0])}`;
			return `${range} ${filter.numericInput.unit}`;
		}
		return values
			.map((value) => filter.options.find((option) => option.value === value)?.label ?? value)
			.join(', ');
	}
	export function openFilters(filter?: AuxeroInventoryFilter) {
		cleared = false;
		activeFilter = filter ?? desktop.filters[0];
		draft = Object.fromEntries(
			desktop.filters.map((filter) => [filter.id, [...filter.selectedValues]])
		);
		keyword =
			page.url.searchParams.get('keyword') ??
			(!desktop.filters.find((filter) => filter.name === 'model')?.selectedValues.length
				? (page.url.searchParams.get('q') ?? '')
				: '');
		minimums = Object.fromEntries(
			desktop.filters
				.filter((filter) => filter.numericInput)
				.map((filter) => [filter.id, page.url.searchParams.get(minimumParam(filter)) ?? ''])
		);
		allOpen = true;
	}
	const formId = $props.id();
	const fieldNames = $derived(
		new Set(desktop.filters.map((filter) => inventoryFilterParam(filter.name)))
	);
	const passthrough = $derived(
		[
			...serializeInventoryQuery(
				{ ...parseInventoryQuery(page.url.searchParams), ...(cleared ? { filters: {} } : {}) },
				page.url.searchParams
			)
		].filter(
			([name]) =>
				!fieldNames.has(name) && !['keyword', 'page', 'minPrice', 'minMileage'].includes(name)
		)
	);
</script>

<Modal
	bind:open={allOpen}
	variant="filter"
	onOpenAutoFocus={(event) => {
		event.preventDefault();
		(currentFilter?.numericInput ? rangePicker : picker)?.focusSearch();
	}}
	title={english ? 'Filters' : 'Филтри'}
	wide
	class="inventory-filters-dialog desktop-filter-dialog"
>
	{#snippet headerActions()}
		{#if currentFilter && (draft[currentFilter.id]?.length || minimums[currentFilter.id])}
			<button type="button" class="inventory-all__clear-category" onclick={clearCategory}
				>{english ? 'Clear selection' : 'Изчисти избора'}</button
			>
		{/if}
	{/snippet}
	<form
		class="inventory-all__form"
		bind:this={filterForm}
		id={formId}
		action={linkHref('/inventory')}
		onsubmit={(event) => {
			event.preventDefault();
			void applyFilters();
		}}
	>
		{#each passthrough as [name, value], i (i)}<input type="hidden" {name} {value} />{/each}
		<input type="hidden" name="keyword" value={keyword} />
		{#each desktop.filters.filter((filter) => filter.numericInput && minimums[filter.id]) as filter (filter.id)}<input
				type="hidden"
				name={minimumParam(filter)}
				value={minimums[filter.id]}
			/>{/each}
		{#each desktop.filters as filter (filter.id)}{#each draft[filter.id] ?? [] as value (value)}<input
					type="hidden"
					name={inventoryFilterParam(filter.name)}
					{value}
				/>{/each}{/each}
		<div
			class="inventory-all__navigation"
			role="tablist"
			aria-orientation="horizontal"
			aria-label={english ? 'Filters' : 'Филтри'}
		>
			<button
				type="button"
				role="tab"
				id={formId + '-keyword-tab'}
				aria-selected={!activeFilter}
				aria-controls={formId + '-panel'}
				tabindex={!activeFilter ? 0 : -1}
				onclick={() => chooseFilter(null)}
				onkeydown={(event) => navigateFilters(event, 0)}
			>
				<span>{english ? 'Search' : 'Търсене'}</span>{#if keyword}<small>{keyword}</small>{/if}
			</button>
			{#each orderedFilters as filter, index (filter.id)}
				<button
					type="button"
					role="tab"
					id={formId + '-' + filter.id}
					aria-selected={activeFilter?.id === filter.id}
					aria-controls={formId + '-panel'}
					tabindex={activeFilter?.id === filter.id ? 0 : -1}
					onclick={() => chooseFilter(filter)}
					onkeydown={(event) => navigateFilters(event, index + 1)}
					title={selectionSummary(filter) || undefined}
				>
					<span
						>{filter.label}{#if draft[filter.id]?.length || minimums[filter.id]}<span
								class="inventory-all__selected"
								aria-hidden="true"
							></span>{/if}</span
					>
					{#if draft[filter.id]?.length || minimums[filter.id]}<small
							>{selectionSummary(filter)}</small
						>{/if}
				</button>
			{/each}
		</div>
		<div
			class="inventory-all__panel"
			role="tabpanel"
			id={formId + '-panel'}
			aria-labelledby={activeFilter ? formId + '-' + activeFilter.id : formId + '-keyword-tab'}
			tabindex="0"
		>
			{#if currentFilter}
				{#key currentFilter.id}{#if currentFilter.numericInput}<DesktopFilterRange
							bind:this={rangePicker}
							filter={currentFilter}
							{english}
							bind:minimum={minimums[currentFilter.id]}
							bind:selection={
								() => draft[currentFilter.id] ?? [],
								(values) => updateSelection(currentFilter, values)
							}
						/>{:else}<DesktopFilterPicker
							bind:this={picker}
							filter={currentFilter}
							{english}
							bind:selection={
								() => draft[currentFilter.id] ?? [],
								(values) => updateSelection(currentFilter, values)
							}
						/>{/if}{/key}
			{:else}
				<div class="filter-fields">
					<label class="inventory-all__search filter-control">
						<Search size={20} aria-hidden="true" /><span class="sr-only"
							>{english ? 'Make, model or keyword' : 'Марка, модел или ключова дума'}</span
						>
						<input
							type="search"
							bind:value={keyword}
							placeholder={english ? 'Make, model or keyword' : 'Марка, модел или ключова дума'}
						/>
					</label>
				</div>
			{/if}
		</div>
	</form>
	{#snippet footer()}
		<div class="inventory-all__actions">
			<span class="sr-only" aria-live="polite"
				>{counting
					? ''
					: resultCount === null
						? ''
						: english
							? `${resultCount} matching cars`
							: `${resultCount} намерени автомобила`}</span
			>
			{#if (!cleared && desktop.activeFilters) || keyword || Object.values(draft).some((values) => values.length) || Object.values(minimums).some(Boolean)}
				<Action
					variant="quiet"
					onclick={() => {
						keyword = '';
						cleared = true;
						minimums = {};
						draft = Object.fromEntries(desktop.filters.map((filter) => [filter.id, []]));
					}}>{desktop.sidebar.actions.clearLabel}</Action
				>
			{/if}
			{#if resultCount === 0}<p class="inventory-all__empty">
					{english
						? 'No cars match. Adjust or clear your filters.'
						: 'Няма автомобили. Променете или изчистете филтрите.'}
				</p>{/if}
			<Action class="inventory-all__apply" type="submit" form={formId} aria-busy={counting}
				>{english ? 'Show cars' : 'Покажи автомобили'}<span
					class="inventory-all__count"
					aria-hidden="true">{counting ? '…' : (resultCount ?? '')}</span
				></Action
			>
		</div>
	{/snippet}
</Modal>

<style>
	:global(.site-dialog.inventory-filters-dialog) {
		width: min(1040px, calc(100vw - 2 * var(--bc-space-6)));
		height: min(640px, calc(100dvh - 2 * var(--bc-space-6)));
		max-height: calc(100dvh - 2 * var(--bc-space-6));
	}
	:global(.site-dialog.inventory-filters-dialog .site-dialog__header) {
		padding: var(--bc-space-4) var(--bc-space-6);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
	}
	:global(.inventory-filters-dialog .site-dialog__icon) {
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		color: var(--bc-ink);
		background: transparent;
		border-radius: var(--bc-radius-pill);
	}
	:global(.inventory-filters-dialog .site-dialog__icon:hover) {
		background: var(--bc-bg-strong);
	}
	:global(.site-dialog.inventory-filters-dialog .site-dialog__body) {
		flex: 1;
		padding: 0;
		overflow: hidden;
	}
	:global(.site-dialog.inventory-filters-dialog .site-dialog__footer) {
		padding: var(--bc-space-3) var(--bc-space-6);
		background: var(--bc-surface-raised);
	}
	:global(.site-dialog.inventory-filters-dialog .site-dialog__footer .site-action) {
		min-height: var(--bc-control-height-primary);
		font-size: var(--bc-text-cta);
	}
	.inventory-all__form {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		height: 100%;
		min-height: 0;
	}
	.inventory-all__navigation {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-1);
		margin: 0 var(--bc-space-6);
		padding: var(--bc-space-1);
	}
	.inventory-all__navigation button {
		position: relative;
		flex: 0 0 auto;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-4);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-copy);
		font: var(--bc-weight-control) var(--bc-text-entry)/var(--bc-leading-control)
			var(--bc-font-body);
		cursor: pointer;
	}
	.inventory-all__navigation button:hover {
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}
	.inventory-all__navigation button[aria-selected='true'] {
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}
	.inventory-all__navigation button:focus-visible,
	.inventory-all__clear-category:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: -2px;
	}
	.inventory-all__navigation button > span {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
	}
	.inventory-all__navigation small {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.inventory-all__selected {
		position: absolute;
		top: var(--bc-space-2);
		right: var(--bc-space-1);
		width: var(--bc-space-2);
		height: var(--bc-space-2);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		flex: none;
	}
	.inventory-all__panel {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: var(--bc-space-5) var(--bc-space-6);
		overflow: hidden;
	}
	.inventory-all__clear-category {
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-copy);
		font: inherit;
		cursor: pointer;
	}
	.inventory-all__clear-category:hover {
		color: var(--bc-ink);
		background: var(--bc-bg-strong);
	}
	.inventory-all__actions {
		display: flex;
		align-items: center;
		gap: var(--bc-space-4);
	}
	.inventory-all__actions :global(.inventory-all__apply) {
		margin-left: auto;
		flex: none;
	}
	.inventory-all__count {
		min-width: 2ch;
		text-align: center;
		font-variant-numeric: tabular-nums;
		opacity: 0.85;
	}
	.inventory-all__empty {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		flex: 1;
	}
	@media (min-width: 768px) and (max-width: 900px) {
		.inventory-all__panel {
			padding-block: var(--bc-space-4);
		}
		.inventory-all__navigation {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
</style>
