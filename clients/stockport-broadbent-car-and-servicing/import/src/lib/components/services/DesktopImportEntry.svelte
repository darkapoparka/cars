<script lang="ts">
	import Action from '$lib/components/common/Action.svelte';
	import { importEntryCopy } from '$lib/content/import-entry';
	import { importCountries, importBodyTypes } from '$lib/data/import-criteria';
	import type { ImportIntent } from '$lib/domain/import-entry';
	import { optionLabel } from '$lib/i18n/options';
	import { translateVehicleTerm } from '$lib/i18n/messages';
	import type { Locale } from '$lib/locale/core';
	let {
		intent,
		vehicle = $bindable(''),
		make = $bindable(''),
		model = $bindable(''),
		bodyType = $bindable(''),
		origin = $bindable(''),
		locale = 'bg',
		countries = true,
		compactLabels = false,
		fieldIds = {},
		error = '',
		oncontinue,
		onIntentChange
	}: {
		intent: ImportIntent;
		vehicle?: string;
		make?: string;
		model?: string;
		bodyType?: string;
		origin?: string;
		locale?: Locale;
		countries?: boolean;
		compactLabels?: boolean;
		fieldIds?: Partial<Record<'vehicle' | 'make' | 'model' | 'type', string>>;
		error?: string;
		oncontinue?: () => void;
		onIntentChange?: (intent: ImportIntent) => void;
	} = $props();
	const id = $props.id();
	const copy = $derived(importEntryCopy[locale]);
	const fieldId = (field: 'vehicle' | 'make' | 'model' | 'type') =>
		fieldIds[field] ?? `${id}-${field}`;
</script>

{#snippet utility()}
	<div class="desktop-import-entry__countries" class:without-countries={!countries}>
		{#if countries}
			<fieldset>
				<legend class="sr-only">{copy.country}</legend>
				<div class="desktop-import-entry__choices">
					{#each importCountries as country (country.value)}
						<button
							type="button"
							class:active={origin === country.value}
							aria-pressed={origin === country.value}
							onclick={() => (origin = country.value)}>{optionLabel(country.label, locale)}</button
						>
					{/each}
				</div>
			</fieldset>
		{/if}
		{#if onIntentChange}
			<button
				class="desktop-import-entry__toggle"
				type="button"
				aria-pressed={intent === 'source'}
				onclick={() => onIntentChange?.(intent === 'listing' ? 'source' : 'listing')}
				>{intent === 'listing' ? copy.withoutListing : copy.withListing}</button
			>
		{/if}
	</div>
{/snippet}

<div class="desktop-import-entry">
	<div class="desktop-import-entry__row">
		<div class="desktop-import-entry__fields" class:listing={intent === 'listing'}>
			{#if intent === 'listing'}
				<label class="desktop-import-entry__listing" for={fieldId('vehicle')}>
					<span class="sr-only">{copy.vehicle}</span>
					<input
						id={fieldId('vehicle')}
						name="vehicle"
						type="text"
						maxlength="2000"
						placeholder={compactLabels ? copy.vehicle : copy.vehiclePlaceholder}
						bind:value={vehicle}
						aria-invalid={Boolean(error)}
						aria-describedby={error ? id + '-error' : undefined}
					/>
				</label>
			{:else}
				<label for={fieldId('make')}>
					<span class="sr-only">{copy.make}</span>
					<input
						id={fieldId('make')}
						name="make"
						maxlength="60"
						placeholder={compactLabels ? copy.make : copy.makePlaceholder}
						bind:value={make}
						aria-invalid={Boolean(error)}
						aria-describedby={error ? id + '-error' : undefined}
					/>
				</label>
				<label for={fieldId('model')}>
					<span class="sr-only">{copy.model}</span>
					<input
						id={fieldId('model')}
						name="model"
						maxlength="80"
						placeholder={compactLabels ? copy.model : copy.modelPlaceholder}
						bind:value={model}
					/>
				</label>
				<label for={fieldId('type')}>
					<span class="sr-only">{copy.type}</span>
					<select id={fieldId('type')} name="bodyType" bind:value={bodyType}>
						<option value="">{compactLabels ? copy.type : copy.anyType}</option>
						{#each importBodyTypes as value (value)}<option {value}
								>{translateVehicleTerm(locale, 'bodyTypes', value)}</option
							>{/each}
					</select>
				</label>
			{/if}
		</div>
		<Action
			type={oncontinue ? 'button' : 'submit'}
			variant="strong"
			size="compact"
			class="desktop-import-entry__continue"
			data-intake-next
			onclick={oncontinue}>{copy.continue}</Action
		>
	</div>
	{@render utility()}
	<input type="hidden" name="origin" value={origin} />
	{#if error}<p class="desktop-import-entry__error" id={id + '-error'} role="alert">{error}</p>{/if}
</div>

<style>
	.desktop-import-entry {
		position: relative;
		display: grid;
		gap: var(--bc-space-4);
	}
	.desktop-import-entry__row {
		--action-height: var(--bc-control-height-compact);
		--action-text: var(--bc-text-body);
		--action-radius: var(--bc-radius-md);
		--action-strong-border: transparent;
		display: flex;
		align-items: center;
		gap: var(--bc-space-1);
		min-height: var(--bc-desktop-search-height);
		padding: var(--bc-space-1);
		border: 1px solid transparent;
		border-radius: var(--bc-desktop-control-radius);
		background: var(--bc-control);
	}
	.desktop-import-entry__row:hover {
		background: var(--bc-control-hover);
	}
	.desktop-import-entry__row:has(input:focus-visible, select:focus-visible) {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.desktop-import-entry__row:has(input[aria-invalid='true']) {
		outline: 2px solid var(--bc-danger);
		outline-offset: 2px;
	}
	.desktop-import-entry__fields {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		flex: 1;
		min-width: 0;
	}
	.desktop-import-entry__fields.listing {
		grid-template-columns: minmax(0, 1fr);
	}
	label {
		min-width: 0;
	}
	input,
	select {
		width: 100%;
		min-width: 0;
		min-height: calc(var(--bc-desktop-search-height) - 2 * var(--bc-space-1) - 2px);
		padding: 0 var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-desktop-control-radius);
		background: transparent;
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-body)/var(--bc-leading-control) var(--bc-font-body);
	}
	.desktop-import-entry__listing input {
		font-size: var(--bc-text-search-trigger);
	}
	input::placeholder {
		color: var(--bc-copy);
		opacity: 1;
	}
	.desktop-import-entry__fields input:focus-visible,
	.desktop-import-entry__fields select:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	:global(.desktop-import-entry__continue) {
		flex: none;
		padding-inline: var(--bc-space-3);
	}
	.desktop-import-entry__countries {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-standard);
	}
	.desktop-import-entry__countries.without-countries {
		justify-content: center;
	}
	fieldset {
		flex: 1;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}
	.desktop-import-entry__choices {
		display: flex;
		justify-content: center;
		gap: var(--bc-space-1);
	}
	button {
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-control);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-label)/var(--bc-leading-control)
			var(--bc-font-body);
		white-space: nowrap;
		cursor: pointer;
	}
	button:hover {
		background: var(--bc-control-hover);
	}
	button.active {
		background: var(--bc-ink);
		color: var(--bc-white);
	}
	button.active:hover {
		background: var(--bc-dark-hover);
	}
	.desktop-import-entry__toggle {
		flex: 0 0 104px;
		border-radius: var(--bc-radius-md);
		background: transparent;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.desktop-import-entry__error {
		position: absolute;
		top: calc(100% + var(--bc-space-1));
		inset-inline: 0;
		margin: 0;
		color: var(--bc-danger);
		font-size: var(--bc-text-label);
	}
</style>
