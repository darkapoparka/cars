<script lang="ts">
	import type { AuxeroInventoryFilter } from '$lib/auxero/inventory-desktop';
	import { Check } from '@lucide/svelte';

	let { filter }: { filter: AuxeroInventoryFilter } = $props();

	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);

	const isChecked = (value: string) =>
		value
			? filter.selectedValues.some((selected) => selected.toLowerCase() === value.toLowerCase())
			: allSelected;
</script>

<div
	class={['sfg', filter.mode === 'single' && 'sfg--single']}
	role="group"
	aria-label={filter.label}
	data-filter-name={filter.name}
>
	<p class="sfg__legend">{filter.label}</p>
	<div class="sfg__options">
		<label class={['sfg__option', allSelected && 'is-selected']}>
			<input
				class="sfg__input"
				type={inputType}
				name={filter.name}
				value=""
				checked={allSelected}
				data-inventory-filter-input
			/>
			<span class="sfg__control" aria-hidden="true">
				<Check size={13} strokeWidth={3} />
			</span>
			<span class="sfg__label">{filter.allLabel}</span>
		</label>
		{#each filter.options as option (option.value)}
			<label class={['sfg__option', isChecked(option.value) && 'is-selected']}>
				<input
					class="sfg__input"
					type={inputType}
					name={filter.name}
					value={option.value}
					checked={isChecked(option.value)}
					data-inventory-filter-input
				/>
				<span class="sfg__control" aria-hidden="true">
					<Check size={13} strokeWidth={3} />
				</span>
				{#if option.image}
					<span class="sfg__media" aria-hidden="true">
						<img src={option.image} alt="" loading="lazy" decoding="async" />
					</span>
				{/if}
				<span class="sfg__label">{option.label}</span>
				{#if typeof option.count === 'number'}
					<small class="sfg__count">{option.count}</small>
				{/if}
			</label>
		{/each}
	</div>
</div>

<style>
	.sfg {
		min-width: 0;
		border: 1px solid #d9e4ee;
		border-radius: 8px;
		background: #ffffff;
		padding: 13px 13px 10px;
		box-shadow: none;
	}

	.sfg__legend {
		margin: 0 4px 8px;
		color: #5b6773;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 1.1;
	}

	.sfg__options {
		display: grid;
		gap: 3px;
	}

	.sfg__option {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 44px;
		padding: 7px 10px;
		border-radius: 9px;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.sfg__option:hover {
		background: #f4f7fa;
	}

	.sfg__option.is-selected {
		background: #eaf5d2;
	}

	.sfg__input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.sfg__control {
		display: inline-grid;
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		place-items: center;
		border: 1.5px solid #c9d6e1;
		border-radius: 7px;
		background: #ffffff;
		color: #ffffff;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.sfg--single .sfg__control {
		border-radius: 999px;
	}

	.sfg__control :global(svg) {
		opacity: 0;
		transition: opacity 0.14s ease;
	}

	.sfg__option.is-selected .sfg__control {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
	}

	.sfg__option.is-selected .sfg__control :global(svg) {
		opacity: 1;
	}

	.sfg__input:focus-visible + .sfg__control {
		outline: 2px solid var(--bc-accent-hover);
		outline-offset: 2px;
	}

	.sfg__media {
		display: inline-grid;
		width: 32px;
		height: 23px;
		flex-shrink: 0;
		place-items: center;
	}

	.sfg__media img {
		max-width: 32px;
		max-height: 22px;
		object-fit: contain;
	}

	.sfg__label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sfg__option.is-selected .sfg__label {
		color: #17210f;
		font-weight: 600;
	}

	.sfg__count {
		flex-shrink: 0;
		color: #8a9180;
		font-size: 13px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.sfg__option.is-selected .sfg__count {
		color: var(--bc-accent-hover);
	}
</style>
