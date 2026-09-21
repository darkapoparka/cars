<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	import { inventoryFilterParam } from '$lib/domain/inventory-query';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	let {
		filter,
		english = false,
		selection = $bindable(null),
		showTitle = true,
		framed = true,
		expandedInitially = false
	}: {
		filter: AuxeroInventoryFilter;
		english?: boolean;
		selection?: string[] | null;
		showTitle?: boolean;
		framed?: boolean;
		expandedInitially?: boolean;
	} = $props();
	const id = $props.id();
	let query = $state('');
	// svelte-ignore state_referenced_locally
	let expanded = $state(expandedInitially);
	const selected = $derived(selection ?? filter.selectedValues);
	const name = $derived(inventoryFilterParam(filter.name));
	const searchLabel = $derived((english ? 'Search in ' : 'Търси в ') + filter.label);
	const matching = $derived(
		filter.options.filter((option) =>
			option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
		)
	);
	const visible = $derived(
		expanded || query.trim() || matching.length <= 8 ? matching : matching.slice(0, 4)
	);
	const toggle = (value: string) => {
		selection =
			filter.mode === 'single'
				? [value]
				: selected.includes(value)
					? selected.filter((item) => item !== value)
					: [...selected, value];
	};
</script>

<fieldset class={['filter-group', !framed && 'filter-group--unframed']}>
	<legend class:sr-only={!showTitle}
		>{filter.label}{#if selected.length}<span class="filter-group__count">{selected.length}</span
			>{/if}</legend
	>
	<div class="filter-group__body">
		{#if filter.numericInput}
			<label class="sr-only" for={id + '-maximum'}
				>{filter.numericInput.label} ({filter.numericInput.unit})</label
			>
			<div class="filter-group__number">
				<input
					class="filter-group__search"
					id={id + '-maximum'}
					type="number"
					inputmode="numeric"
					min="1"
					step="1"
					value={selected[0] ?? ''}
					placeholder={filter.numericInput.label}
					oninput={(event) => {
						const value = event.currentTarget.valueAsNumber;
						selection = Number.isFinite(value) ? [String(value)] : [];
					}}
				/>
				<span aria-hidden="true">{filter.numericInput.unit}</span>
			</div>
		{:else}
			<label class="sr-only" for={id + '-search'}>{searchLabel}</label>
			<input
				class="filter-group__search"
				id={id + '-search'}
				type="search"
				bind:value={query}
				placeholder={searchLabel}
				autocomplete="off"
			/>
		{/if}
		<!-- A custom maximum has no checked preset; hidden values also preserve searched-out choices. -->
		{#each selected.filter((value) => !visible.some((option) => option.value === value)) as value (value)}<input
				type="hidden"
				{name}
				{value}
			/>{/each}
		<div class="filter-group__options" id={id + '-options'}>
			{#each visible as option (option.value)}
				<label class="filter-group__option"
					><input
						type={filter.mode === 'single' ? 'radio' : 'checkbox'}
						{name}
						value={option.value}
						checked={selected.includes(option.value)}
						onchange={() => toggle(option.value)}
					/>{#if option.image}<img
							class="filter-group__image"
							src={assetHref(option.image)}
							alt=""
							width="36"
							height="28"
							loading="lazy"
						/>{/if}<span>{option.label}</span></label
				>
			{:else}<p class="filter-group__empty" role="status">
					{english ? 'No matching options' : 'Няма съвпадения'}
				</p>{/each}
		</div>
		{#if !query.trim() && matching.length > 8}
			<button
				class="filter-group__more"
				type="button"
				aria-expanded={expanded}
				aria-controls={id + '-options'}
				onclick={() => (expanded = !expanded)}
				>{expanded
					? english
						? 'Show fewer'
						: 'Покажи по-малко'
					: (english ? 'Show all' : 'Покажи всички') + ' (' + matching.length + ')'}<ChevronDown
					size={16}
					aria-hidden="true"
				/></button
			>
		{/if}
	</div>
</fieldset>

<style>
	.filter-group {
		min-width: 0;
		margin: 0;
		padding: var(--bc-space-5);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
	}
	.filter-group--unframed {
		padding: 0;
		border: 0;
		border-radius: 0;
	}
	legend {
		float: left;
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		width: 100%;
		padding: 0 0 var(--bc-space-3);
		color: var(--bc-ink);
		font: var(--bc-weight-heading) var(--bc-text-h5)/var(--bc-leading-h5) var(--bc-font-heading);
	}
	.filter-group__body {
		clear: both;
		display: grid;
		gap: var(--bc-space-2);
	}
	.filter-group__count {
		display: inline-grid;
		place-items: center;
		min-width: var(--bc-space-6);
		height: var(--bc-space-6);
		padding-inline: var(--bc-space-1);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-control);
		color: var(--bc-copy);
		font: var(--bc-weight-heading) var(--bc-text-label)/1 var(--bc-font-body);
	}
	.filter-group__search {
		min-width: 0;
		width: 100%;
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		border: 1px solid var(--bc-route-pill-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
	}
	.filter-group__search::placeholder {
		color: var(--bc-muted);
	}
	.filter-group__number {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		min-width: 0;
	}
	.filter-group__number input {
		flex: 1;
	}
	.filter-group__number > span {
		flex: none;
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
	}
	.filter-group__options {
		display: grid;
		gap: var(--bc-space-2);
	}
	.filter-group__option {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-route-pill-height);
		padding: var(--bc-space-3) var(--bc-space-4);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		line-height: var(--bc-leading-control);
		cursor: pointer;
	}
	.filter-group__option:hover,
	.filter-group__option:has(input:checked) {
		background: var(--bc-surface-hover);
	}
	.filter-group__option:has(input:checked) {
		font-weight: var(--bc-weight-control);
		border-color: var(--bc-accent);
		box-shadow: inset 0 0 0 1px var(--bc-accent);
	}
	.filter-group__option input {
		margin: 0;
		width: var(--bc-text-filter);
		height: var(--bc-text-filter);
		flex: 0 0 var(--bc-text-filter);
		accent-color: var(--bc-accent);
		cursor: pointer;
	}
	.filter-group__more {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		min-height: var(--bc-route-pill-height);
		padding: var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-copy);
		font: var(--bc-weight-heading) var(--bc-text-label)/var(--bc-leading-label) var(--bc-font-body);
	}
	.filter-group__more:hover {
		background: var(--bc-surface);
		color: var(--bc-ink);
	}
	.filter-group__more[aria-expanded='true'] :global(svg) {
		transform: rotate(180deg);
	}
	.filter-group__empty {
		margin: var(--bc-space-2);
		color: var(--bc-muted);
	}
	.filter-group__image {
		width: 36px;
		height: 28px;
		object-fit: contain;
		flex: 0 0 36px;
	}
</style>
