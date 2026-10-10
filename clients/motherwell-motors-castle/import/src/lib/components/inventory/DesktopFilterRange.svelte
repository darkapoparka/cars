<script lang="ts">
	import type { AuxeroInventoryFilter } from '$lib/server/inventory-options';
	import InventoryFilterChoice from './InventoryFilterChoice.svelte';
	let {
		filter,
		english = false,
		minimum = $bindable(''),
		selection = $bindable<string[]>([])
	}: {
		filter: AuxeroInventoryFilter;
		english?: boolean;
		minimum?: string;
		selection?: string[];
	} = $props();
	let lower = $state<HTMLInputElement>();
	let upper = $state<HTMLInputElement>();
	const id = $props.id();
	const subject = $derived(
		filter.name === 'priceTo' ? (english ? 'price' : 'цена') : english ? 'mileage' : 'пробег'
	);
	$effect(updateValidity);
	function clearValidity() {
		upper?.setCustomValidity('');
	}
	export function focusSearch() {
		lower?.focus({ preventScroll: true });
	}
	function updateValidity() {
		upper?.setCustomValidity(
			minimum && selection[0] && Number(minimum) > Number(selection[0])
				? english
					? 'The maximum must be greater than or equal to the minimum.'
					: 'Максимумът трябва да е по-голям или равен на минимума.'
				: ''
		);
	}
	export function validate() {
		updateValidity();
		return (lower?.reportValidity() ?? true) && (upper?.reportValidity() ?? true);
	}
</script>

<div class="range-fields filter-fields">
	<label class="filter-control"
		><span>{english ? 'From' : 'От'}</span><input
			bind:this={lower}
			type="number"
			min="1"
			step="1"
			inputmode="numeric"
			aria-label={(english
				? 'Minimum ' + subject
				: filter.name === 'priceTo'
					? 'Минимална цена'
					: 'Минимален пробег') +
				' (' +
				filter.numericInput?.unit +
				')'}
			value={minimum}
			placeholder="—"
			oninput={(event) => {
				minimum = event.currentTarget.value;
				clearValidity();
			}}
		/><span class="unit">{filter.numericInput?.unit}</span></label
	>
	<label class="filter-control"
		><span>{english ? 'To' : 'До'}</span><input
			bind:this={upper}
			type="number"
			min="1"
			step="1"
			inputmode="numeric"
			aria-label={filter.numericInput?.label + ' (' + filter.numericInput?.unit + ')'}
			value={selection[0] ?? ''}
			placeholder="—"
			oninput={(event) => {
				selection = event.currentTarget.value ? [event.currentTarget.value] : [];
				clearValidity();
			}}
		/><span class="unit">{filter.numericInput?.unit}</span></label
	>
</div>
<div class="range-presets filter-options">
	{#each filter.options as option (option.value)}<InventoryFilterChoice
			label={option.label}
			checked={selection.includes(option.value)}
			mode="single"
			name={id + '-preset'}
			form={id + '-detached'}
			onchange={() => {
				selection = [option.value];
				clearValidity();
			}}
		/>{/each}
</div>

<style>
	.range-fields {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.range-fields label {
		cursor: text;
	}
	.range-fields input {
		text-align: right;
	}
	.unit {
		font-size: var(--bc-text-label);
		color: var(--bc-copy);
	}
	@media (max-width: 767px) {
		.range-fields {
			grid-template-columns: 1fr;
		}
	}
</style>
