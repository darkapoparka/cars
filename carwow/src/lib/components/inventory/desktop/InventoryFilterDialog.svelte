<script lang="ts">
	import { tick } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import Search from '@lucide/svelte/icons/search';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { InventoryListVehicle, InventoryQuickFilterGroup } from '$lib/types/inventory';
	import { vehicleMatches } from '$lib/state/inventory-filters.svelte';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';

	let {
		filters,
		vehicles,
		isOpen = $bindable(false)
	}: {
		filters: InventoryQuickFilterGroup[];
		vehicles: InventoryListVehicle[];
		isOpen?: boolean;
	} = $props();
	const inventory = getDesktopInventoryContext();
	let dialog: HTMLDialogElement;
	let focusedField = $state('');
	let optionQuery = $state('');
	let query = $state('');
	let condition = $state('');
	let allFeatures = $state(false);
	let draft = $state<Record<string, string[]>>({});
	const field = $derived(filters.find((item) => item.name === focusedField));
	const featureField = $derived(filters.find((item) => item.name === 'feature'));
	const basicFields = $derived(filters.filter((item) => item.name !== 'feature'));
	const commonFeatures = [
		'4x4',
		'360 camera \\ Задна камера',
		'Apple CarPlay \\ Android Auto',
		'LED фарове',
		'7 места',
		'Безключово палене',
		'Адаптивни предни светлини',
		'Адаптивно въздушно окачване',
		'Bluetooth \\ handsfree система'
	];
	const displayedFeatures = $derived(
		featureField
			? options(featureField).filter(
					(option) =>
						allFeatures ||
						commonFeatures.includes(option.value) ||
						draft.feature?.includes(option.value)
				)
			: []
	);
	const count = $derived(
		vehicles.filter((vehicle) =>
			vehicleMatches(vehicle, {
				query,
				condition,
				brand: draft.brand ?? [],
				model: draft.model ?? [],
				body: draft.body ?? [],
				fuel: draft.fuel?.[0] ?? '',
				transmission: draft.transmission?.[0] ?? '',
				price: draft.price?.[0] ?? '',
				mileage: draft.mileage?.[0] ?? '',
				feature: draft.feature ?? [],
				availability: draft.availability?.[0] ?? ''
			})
		).length
	);

	export async function open(name = '', focusSearch = false) {
		draft = Object.fromEntries(
			[...filters.map((item) => item.name), 'availability'].map((key) => [
				key,
				[...inventory.getFieldValues(key)]
			])
		);
		query = inventory.store.query;
		condition = inventory.store.condition;
		focusedField = name;
		optionQuery = '';
		allFeatures = false;
		inventory.openField = '';
		dialog.showModal();
		isOpen = true;
		await tick();
		if (focusSearch && dialog.open)
			dialog.querySelector<HTMLInputElement>('.filter-dialog-search input')?.focus();
	}

	$effect(() => {
		if (!isOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});

	function options(group: InventoryQuickFilterGroup, searchable = false) {
		return group.options.filter(
			(option) =>
				option.value &&
				(group.name !== 'model' ||
					!draft.brand?.length ||
					!option.brands?.length ||
					option.brands.some((brand) => draft.brand.includes(brand))) &&
				(!searchable ||
					option.label.toLocaleLowerCase('bg').includes(optionQuery.toLocaleLowerCase('bg')))
		);
	}
	function setValues(name: string, values: string[]) {
		draft[name] = values.filter(Boolean);
		if (name === 'brand') {
			const models = filters.find((item) => item.name === 'model');
			if (models)
				draft.model = (draft.model ?? []).filter((value) =>
					options(models).some((option) => option.value === value)
				);
		}
	}
	function toggle(name: string, value: string) {
		const selected = draft[name] ?? [];
		const multiple = ['brand', 'model', 'feature'].includes(name);
		setValues(
			name,
			selected.includes(value)
				? selected.filter((item) => item !== value)
				: multiple
					? [...selected, value]
					: [value]
		);
	}
	function clear() {
		if (focusedField) setValues(focusedField, []);
		else {
			draft = {};
			query = '';
			condition = '';
		}
	}
	function apply() {
		for (const group of filters) {
			const selected = draft[group.name] ?? [];
			inventory.setFieldValues(
				group.name,
				group.options
					.filter((option) => selected.includes(option.value))
					.map((option) => option.value)
			);
		}
		inventory.setFieldValues('availability', draft.availability ?? []);
		inventory.store.query = query;
		inventory.store.condition = condition;
		inventory.syncUrl();
		dialog.close();
	}
	function keepFocus(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			dialog.close();
			return;
		}
		if (
			event.key === 'Enter' &&
			event.target instanceof HTMLInputElement &&
			event.target.type === 'search' &&
			!field
		) {
			event.preventDefault();
			apply();
			return;
		}
		if (event.key !== 'Tab') return;
		const controls = [
			...dialog.querySelectorAll<HTMLElement>('button, input, select, summary, [tabindex="0"]')
		].filter((element) => element.getClientRects().length && !element.hasAttribute('disabled'));
		const first = controls[0],
			last = controls.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}
</script>

<dialog
	id="searchForm"
	bind:this={dialog}
	class="inventory-filter-dialog"
	class:inventory-filter-dialog--focused={!!field}
	aria-labelledby="inventory-filter-title"
	onclose={() => {
		isOpen = false;
	}}
	onkeydown={keepFocus}
>
	<div class="filter-dialog-header">
		<h2 id="inventory-filter-title">{field ? field.label : 'Търсене на автомобили'}</h2>
		<button
			type="button"
			class="filter-dialog-close"
			aria-label="Затвори филтрите"
			onclick={() => dialog.close()}><X size={22} /></button
		>
	</div>
	<div class="filter-dialog-body">
		{#if field}
			{#if field.options.length > 8}
				<label class="filter-dialog-search"
					><Search size={20} /><input
						type="search"
						aria-label={`Търси ${field.label.toLocaleLowerCase('bg')}`}
						placeholder="Търси…"
						bind:value={optionQuery}
					/></label
				>
			{/if}
			<div class="filter-dialog-options">
				{#each options(field, true) as option (option.value)}
					<label
						class="filter-dialog-choice"
						class:selected={draft[field.name]?.includes(option.value)}
					>
						<input
							type={['brand', 'model', 'feature'].includes(field.name) ? 'checkbox' : 'radio'}
							name={`focused-${field.name}`}
							checked={draft[field.name]?.includes(option.value) ?? false}
							onchange={() => toggle(field.name, option.value)}
						/>{option.label}
					</label>
				{:else}<p class="filter-dialog-empty">Няма съвпадения.</p>{/each}
			</div>
		{:else}
			<label class="filter-dialog-search"
				><Search size={20} /><input
					type="search"
					aria-label="Марка, модел или ключова дума"
					placeholder="Марка, модел или ключова дума"
					bind:value={query}
				/></label
			>
			<div class="filter-dialog-grid">
				{#each basicFields as group (group.name)}
					<div class="filter-dialog-field">
						{#if ['brand', 'model'].includes(group.name)}
							<span class="filter-dialog-label" id={`modal-label-${group.name}`}>{group.label}</span
							>
							<details class="filter-dialog-multiselect">
								<summary aria-labelledby={`modal-label-${group.name}`}
									><span>{draft[group.name]?.length ? draft[group.name].join(', ') : 'Всички'}</span
									><ChevronDown size={16} /></summary
								>
								<div class="filter-dialog-multi-options">
									{#each options(group) as option (option.value)}
										<label
											><input
												type="checkbox"
												checked={draft[group.name]?.includes(option.value) ?? false}
												onchange={() => toggle(group.name, option.value)}
											/>{option.label}</label
										>
									{:else}<p>Няма налични модели.</p>{/each}
								</div>
							</details>
						{:else}
							<label class="filter-dialog-label" for={`modal-${group.name}`}>{group.label}</label>
							<select
								id={`modal-${group.name}`}
								value={draft[group.name]?.[0] ?? ''}
								onchange={(event) => setValues(group.name, [event.currentTarget.value])}
							>
								<option value="">Всички</option>
								{#each options(group) as option (option.value)}<option value={option.value}
										>{option.label}</option
									>{/each}
							</select>
						{/if}
					</div>
				{/each}
				<div class="filter-dialog-field">
					<label class="filter-dialog-label" for="modal-availability">Наличност</label>
					<select
						id="modal-availability"
						value={draft.availability?.[0] ?? ''}
						onchange={(event) => setValues('availability', [event.currentTarget.value])}
					>
						<option value="">Всички</option><option value="available">Налични</option><option
							value="incoming">Очакван внос</option
						>
					</select>
				</div>
			</div>
			{#if featureField}
				<section class="filter-dialog-features" aria-labelledby="filter-extras-title">
					<h3 id="filter-extras-title">Екстри</h3>
					<div class="filter-dialog-feature-grid">
						{#each displayedFeatures as option (option.value)}
							<label
								class="filter-dialog-choice"
								class:selected={draft.feature?.includes(option.value)}
								><input
									type="checkbox"
									checked={draft.feature?.includes(option.value) ?? false}
									onchange={() => toggle('feature', option.value)}
								/>{option.label}</label
							>
						{/each}
					</div>
					<button
						type="button"
						class="filter-dialog-more"
						aria-expanded={allFeatures}
						onclick={() => {
							allFeatures = !allFeatures;
						}}
						>{allFeatures ? 'По-малко екстри' : `Всички екстри (${options(featureField).length})`}
						<ChevronDown size={16} /></button
					>
				</section>
			{/if}
		{/if}
	</div>
	<div class="filter-dialog-footer">
		<button type="button" class="filter-dialog-clear" onclick={clear}
			>Изчисти{field ? '' : ' всички'}</button
		>
		<button type="button" class="filter-dialog-apply" onclick={apply}
			>Покажи {count} автомобила <Search size={18} /></button
		>
	</div>
</dialog>

<style>
	.inventory-filter-dialog {
		background: #fff;
		border: 0;
		border-radius: 20px;
		color: #141719;
		font-family: var(--sa-font);
		margin: auto;
		padding: 0;
		width: min(1080px, calc(100vw - 64px));
		max-width: none;
		max-height: calc(100dvh - 64px);
		overflow: hidden;
	}
	.inventory-filter-dialog[open] {
		display: flex;
		flex-direction: column;
	}
	.inventory-filter-dialog--focused {
		width: min(680px, calc(100vw - 64px));
	}
	.inventory-filter-dialog::backdrop {
		background: rgb(14 17 20 / 62%);
	}
	.filter-dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 26px 28px 20px;
		flex-shrink: 0;
	}
	h2 {
		font: var(--sa-weight-strong) var(--sa-text-2xl)/1.2 var(--sa-font);
		letter-spacing: -0.6px;
		margin: 0;
	}
	button,
	input,
	select,
	summary {
		font-family: inherit;
	}
	button {
		cursor: pointer;
	}
	.filter-dialog-close {
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #f1f2f3;
		color: #25282b;
		flex-shrink: 0;
	}
	.filter-dialog-body {
		overflow-y: auto;
		padding: 0 28px 8px;
		min-height: 0;
	}
	.filter-dialog-search {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--discovery-panel);
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		padding: 0 16px;
		color: #727982;
		margin-bottom: 24px;
	}
	.filter-dialog-search input {
		background: transparent;
		border: 0;
		outline: 0;
		width: 100%;
		min-width: 0;
		flex: 1;
		height: 52px;
		padding: 0;
		font-size: var(--sa-text-base);
		color: #141719;
		box-shadow: none;
	}
	.filter-dialog-search input:focus-visible {
		outline: none;
		box-shadow: none;
	}
	.filter-dialog-search :global(svg) {
		flex: none;
	}
	.filter-dialog-search:focus-within {
		border-color: var(--discovery-action);
		outline: 2px solid var(--discovery-action);
		outline-offset: -1px;
	}
	.filter-dialog-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px 16px;
		align-items: start;
	}
	.filter-dialog-field {
		min-width: 0;
	}
	.filter-dialog-label {
		display: block;
		font-size: var(--sa-text-caption);
		line-height: 20px;
		font-weight: var(--sa-weight-semibold);
		color: #606871;
		margin-bottom: 7px;
	}
	select,
	summary {
		width: 100%;
		height: 48px;
		background: var(--discovery-panel);
		border: 1px solid var(--discovery-control-border);
		border-radius: var(--discovery-control-radius);
		padding: 0 12px;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		color: #141719;
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.filter-dialog-multi-options {
		max-height: 180px;
		overflow: auto;
		padding: 8px;
		background: var(--discovery-muted-surface);
		border-radius: var(--discovery-control-radius);
		margin-top: 6px;
	}
	.filter-dialog-multi-options label {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 38px;
		font-size: var(--sa-text-caption);
		cursor: pointer;
	}
	.filter-dialog-features {
		background: var(--discovery-panel);
		border-radius: 14px;
		padding: 20px;
		margin-top: 24px;
	}
	h3 {
		font: var(--sa-weight-strong) var(--sa-text-lg)/1.3 var(--sa-font);
		margin: 0 0 14px;
	}
	.filter-dialog-feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}
	.filter-dialog-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
	.filter-dialog-choice {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 12px;
		background: #fff;
		border: 1px solid var(--discovery-control-border);
		border-radius: var(--discovery-control-radius);
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-medium);
		line-height: 1.4;
		cursor: pointer;
	}
	.filter-dialog-choice.selected {
		border-color: var(--discovery-action);
		background: var(--discovery-muted-surface);
	}
	input[type='checkbox'],
	input[type='radio'] {
		accent-color: var(--discovery-action);
		appearance: auto;
		width: 17px;
		height: 17px;
		flex-shrink: 0;
		margin: 0;
	}
	.filter-dialog-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 22px 28px 26px;
		flex-shrink: 0;
	}
	.filter-dialog-clear {
		background: transparent;
		border: 0;
		padding: 12px 0;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.filter-dialog-apply {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		min-height: 48px;
		padding: 12px 24px;
		border: 0;
		border-radius: var(--discovery-control-radius);
		background: var(--discovery-action);
		color: #fff;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-strong);
	}
	.filter-dialog-apply:hover {
		background: var(--discovery-action-hover);
	}
	button:focus-visible,
	summary:focus-visible,
	select:focus-visible {
		outline: 2px solid var(--discovery-action);
		outline-offset: 3px;
	}
	.filter-dialog-empty {
		padding: 24px 0;
		color: #606871;
	}
	.filter-dialog-more {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 0;
		min-height: 36px;
		padding: 12px 0 0;
		color: #31383e;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-semibold);
	}
</style>
