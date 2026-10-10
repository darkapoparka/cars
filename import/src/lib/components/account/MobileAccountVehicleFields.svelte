<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import MobileIntakeChoiceField from '$lib/components/common/MobileIntakeChoiceField.svelte';
	import MobileIntakeChoiceList from '$lib/components/common/MobileIntakeChoiceList.svelte';
	import { mobileIntakeCopy } from '$lib/content/mobile-intake';
	import {
		emptyVehicleIntakeOptions,
		type VehicleIntakeOptions
	} from '$lib/domain/vehicle-intake-options';

	let {
		title = $bindable(''),
		locale,
		options = emptyVehicleIntakeOptions,
		disabled = false
	}: {
		title?: string;
		locale: 'en' | 'bg';
		options?: VehicleIntakeOptions;
		disabled?: boolean;
	} = $props();
	const id = $props.id();
	const english = $derived(locale === 'en');
	const copy = $derived(mobileIntakeCopy[locale]);
	function splitTitle(value: string) {
		const make = [...options.makes]
			.sort((a, b) => b.length - a.length)
			.find((name) => value.toLowerCase().startsWith(name.toLowerCase() + ' '));
		return make ? { make, model: value.slice(make.length).trim() } : null;
	}
	const initial = untrack(() => splitTitle(title));
	let make = $state(initial?.make ?? '');
	let model = $state(initial?.model ?? '');
	let manual = $state(untrack(() => Boolean(title && !initial)));
	let enhanced = $state(false);
	let choice = $state<'make' | 'model' | null>(null);
	let pickerOpen = $state(false);
	let invalid = $state<'make' | 'model' | 'manual' | null>(null);
	let titleInput = $state<HTMLInputElement | null>(null);
	const choiceTitle = $derived(choice === 'model' ? copy.selectModel : copy.selectMake);
	const choiceOptions = $derived(
		(choice === 'model' ? (options.modelsByMake[make] ?? []) : options.makes).map((value) => ({
			value,
			label: value
		}))
	);

	onMount(() => {
		enhanced = true;
	});
	function selectChoice(value: string) {
		if (choice === 'make') {
			if (make !== value) {
				make = value;
				model = '';
				title = '';
			}
		} else {
			model = value;
			title = `${make} ${model}`.trim();
		}
		invalid = null;
		pickerOpen = false;
	}
	function openChoice(value: 'make' | 'model') {
		choice = value;
		pickerOpen = true;
	}
	async function toggleManual() {
		invalid = null;
		if (manual) {
			const parsed = splitTitle(title);
			make = parsed?.make ?? '';
			model = parsed?.model ?? '';
			if (!parsed) title = '';
			manual = false;
		} else {
			manual = true;
			await tick();
			titleInput?.focus();
		}
	}
	// Selectors still submit the existing title field; uploads and page actions stay native.
	export function validate() {
		if (title.trim()) {
			invalid = null;
			return true;
		}
		if (!enhanced || manual) {
			invalid = 'manual';
			titleInput?.focus();
			return false;
		}
		invalid = make ? 'model' : 'make';
		document.getElementById(`${id}-${invalid}`)?.focus();
		return false;
	}
</script>

<svelte:window
	onresize={() => {
		if (innerWidth >= 768) pickerOpen = false;
	}}
/>

<div class="mobile-account-vehicle-fields" data-listing-vehicle-fields>
	{#if enhanced && !manual}
		<input type="hidden" name="title" value={title} />
		<div class="mobile-account-vehicle-fields__pair">
			<MobileIntakeChoiceField
				id={`${id}-make`}
				label={english ? 'Make' : 'Марка'}
				value={make}
				placeholder={copy.selectMake}
				{disabled}
				invalid={invalid === 'make'}
				describedBy={invalid === 'make' ? `${id}-error` : undefined}
				onopen={() => openChoice('make')}
			/>
			<MobileIntakeChoiceField
				id={`${id}-model`}
				label={english ? 'Model' : 'Модел'}
				value={model}
				placeholder={make ? copy.selectModel : copy.makeFirst}
				disabled={disabled || !make}
				invalid={invalid === 'model'}
				describedBy={invalid === 'model' ? `${id}-error` : undefined}
				onopen={() => openChoice('model')}
			/>
		</div>
	{:else}
		<label>
			<span>{english ? 'Make and model' : 'Марка и модел'} <span aria-hidden="true">*</span></span>
			<input
				bind:this={titleInput}
				name="title"
				bind:value={title}
				placeholder={english ? 'e.g. BMW 320d' : 'напр. BMW 320d'}
				autocomplete="off"
				aria-invalid={invalid === 'manual' || undefined}
				aria-describedby={invalid === 'manual' ? `${id}-error` : undefined}
				oninput={() => (invalid = null)}
				required
				{disabled}
			/>
		</label>
	{/if}
	{#if invalid}
		<p id={`${id}-error`} role="alert">
			{invalid === 'make'
				? copy.selectMake
				: invalid === 'model'
					? copy.selectModel
					: english
						? 'Enter a make and model.'
						: 'Въведи марка и модел.'}
		</p>
	{/if}
	{#if enhanced}
		<button
			class="mobile-account-vehicle-fields__manual"
			type="button"
			{disabled}
			onclick={toggleManual}
		>
			{manual
				? english
					? 'Choose from the list'
					: 'Избери от списъка'
				: english
					? 'Enter manually'
					: 'Въведи ръчно'}
		</button>
	{/if}
</div>

<MobileSheet
	bind:open={pickerOpen}
	title={choiceTitle}
	mode="full"
	showHeader={false}
	contentClass="mobile-listing-choice-sheet"
	onclose={() => (choice = null)}
>
	{#if choice}
		<MobileIntakeChoiceList
			title={choiceTitle}
			options={choiceOptions}
			value={choice === 'make' ? make : model}
			{locale}
			backLabel={english ? 'Back' : 'Назад'}
			searchLabel={choice === 'make' ? copy.searchMake : copy.searchModel}
			allowCustom
			onback={() => (pickerOpen = false)}
			onselect={selectChoice}
		/>
	{/if}
</MobileSheet>

<style>
	.mobile-account-vehicle-fields {
		--bc-control-height-standard: var(--bc-control-height-chip);
		display: grid;
		min-width: 0;
		gap: 5px;
	}
	.mobile-account-vehicle-fields__pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	label {
		display: grid;
		min-width: 0;
		gap: 5px;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		line-height: var(--bc-mobile-label-leading);
		font-weight: var(--bc-weight-heading);
	}
	.mobile-account-vehicle-fields label input:not([type='hidden']) {
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-standard) !important;
		border: 0;
		border-radius: 10px;
		padding: 0 11px;
		background: var(--bc-white);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
	}
	input:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.mobile-account-vehicle-fields__manual {
		justify-self: start;
		min-height: var(--bc-control-height-chip);
		max-width: 100%;
		overflow: hidden;
		border: 0;
		background: transparent;
		padding: 0;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	.mobile-account-vehicle-fields__manual:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	p {
		margin: 0;
		color: var(--bc-danger);
		font-size: var(--bc-mobile-label);
	}
	:global(.mobile-listing-choice-sheet) {
		padding: 0;
		background: var(--bc-bg-strong);
	}
	:global(.mobile-listing-choice-sheet .bc-mobile-sheet__body) {
		overflow: hidden;
	}
</style>
