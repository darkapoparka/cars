<script lang="ts">
	import { tick } from 'svelte';
	import DesktopDiscoveryPanel from '$lib/components/common/DesktopDiscoveryPanel.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import DesktopImportEntry from './DesktopImportEntry.svelte';
	import {
		desktopServiceEntryCopy,
		serviceTaskIds,
		serviceTask,
		type ServiceTaskId
	} from '$lib/content/desktop-service-entry';
	import { importEntryComplete, type ImportIntent } from '$lib/domain/import-entry';
	import { importEntryCopy } from '$lib/content/import-entry';
	import { isVehicleReference, isVin } from '$lib/domain/vehicle-intake';
	import type { ServiceRequestKind } from '$lib/domain/service-request';
	import type { Locale } from '$lib/locale/core';
	import { linkHref } from '$lib/utils/links';

	let {
		task = $bindable<ServiceTaskId>('check'),
		locale = 'bg',
		onrequest
	}: {
		task?: ServiceTaskId;
		locale?: Locale;
		onrequest?: (kind: ServiceRequestKind, event: SubmitEvent, reference: string) => void;
	} = $props();
	const id = $props.id();
	const copy = $derived(desktopServiceEntryCopy[locale]);
	const selected = $derived(task);
	const options = $derived(
		serviceTaskIds.map((task) => ({
			value: task,
			label: copy.labels[task],
			panelId: id + '-entry'
		}))
	);
	let references = $state({ check: '', selling: '', viewing: '' });
	let errors = $state({ check: '', selling: '', viewing: '' });
	let importIntent = $state<ImportIntent>('listing');
	let importVehicle = $state('');
	let importMake = $state('');
	let importModel = $state('');
	let importType = $state('');
	let importError = $state('');
	let form = $state<HTMLFormElement>();
	const fieldLabel = $derived(
		selected === 'selling'
			? copy.sellingLabel
			: selected === 'viewing'
				? copy.viewingLabel
				: copy.checkLabel
	);
	const placeholder = $derived(
		selected === 'selling'
			? copy.sellingPlaceholder
			: selected === 'viewing'
				? copy.viewingPlaceholder
				: copy.checkPlaceholder
	);

	async function continueEntry(event: SubmitEvent) {
		if (selected === 'import') {
			if (
				importEntryComplete(importIntent, importVehicle, {
					make: importMake,
					model: importModel,
					origin: ''
				})
			) {
				importError = '';
				return;
			}
			event.preventDefault();
			const entryCopy = importEntryCopy[locale];
			importError =
				importIntent === 'listing' ? entryCopy.invalidListing : copy.missingImportCriteria;
		} else {
			const reference = references[selected].trim();
			const valid =
				selected === 'check'
					? isVehicleReference(reference)
					: selected === 'selling'
						? isVin(reference)
						: reference.length >= 2;
			if (valid) {
				errors[selected] = '';
				if (selected !== 'selling')
					onrequest?.(selected === 'check' ? 'vin-check' : 'viewing', event, reference);
				return;
			}
			event.preventDefault();
			errors[selected] =
				selected === 'check'
					? copy.invalidCheck
					: selected === 'selling'
						? copy.invalidSelling
						: copy.invalidViewing;
		}
		await tick();
		form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
	}
</script>

<DesktopDiscoveryPanel class="desktop-service-finder" compactHeader>
	{#snippet header()}
		<ModeTabs
			class="service-modes"
			value={selected}
			{options}
			label={copy.choose}
			idPrefix="desktop-service-mode"
			surface="light"
			appearance="segmented"
			onchange={(value) => (task = serviceTask(value))}
		/>
	{/snippet}
	<div class="service-controls">
		<div
			id={id + '-entry'}
			role="tabpanel"
			tabindex="0"
			aria-labelledby={`desktop-service-mode-${selected}`}
		>
			<form
				action={linkHref(
					selected === 'import' ? '/import' : selected === 'selling' ? '/sell-your-car' : '/contact'
				)}
				bind:this={form}
				onsubmit={continueEntry}
				oninput={() => {
					if (selected === 'import') importError = '';
				}}
			>
				{#if locale === 'en'}<input type="hidden" name="lang" value="en" />{/if}
				{#if selected === 'import'}
					<input type="hidden" name="step" value="details" />
					<input type="hidden" name="intent" value={importIntent} />
					<DesktopImportEntry
						intent={importIntent}
						bind:vehicle={importVehicle}
						bind:make={importMake}
						bind:model={importModel}
						bind:bodyType={importType}
						{locale}
						countries={false}
						compactLabels
						error={importError}
						onIntentChange={(intent) => {
							importIntent = intent;
							importError = '';
						}}
					/>
				{:else}
					{#if selected !== 'selling'}<input
							type="hidden"
							name="topic"
							value={selected === 'check' ? 'vin-check' : 'viewing'}
						/>{/if}
					<div class="service-entry-row">
						<label for={id + '-reference'} class="sr-only">{fieldLabel}</label>
						<input
							id={id + '-reference'}
							name={selected === 'selling' ? 'vin' : 'reference'}
							{placeholder}
							maxlength={selected === 'selling' ? 17 : 2000}
							bind:value={references[selected]}
							oninput={() => (errors[selected] = '')}
							aria-invalid={Boolean(errors[selected])}
							aria-describedby={errors[selected] ? id + '-error' : id + '-hint'}
						/>
						<Action type="submit" variant="strong" size="compact" data-service-next
							>{copy.continue}</Action
						>
					</div>
					<div class="service-utility" id={id + '-hint'}>
						{#if selected === 'selling'}<a href={linkHref('/sell-your-car?mode=manual')}
								>{copy.manual}</a
							>
						{:else}<p>{selected === 'check' ? copy.checkHint : copy.viewingHint}</p>{/if}
					</div>
					{#if errors[selected]}<p class="service-entry-error" id={id + '-error'} role="alert">
							{errors[selected]}
						</p>{/if}
				{/if}
			</form>
		</div>
	</div>
</DesktopDiscoveryPanel>

<style>
	@media (min-width: 768px) {
		:global(.desktop-service-finder) {
			--mode-tab-font-size: var(--bc-text-body);
			--mode-segment-width: 420px;
			--service-error-ink: color-mix(in srgb, var(--bc-danger) 75%, var(--bc-ink));
		}
		.service-controls {
			display: grid;
			width: 100%;
			max-width: var(--bc-desktop-service-search-width);
			min-width: 0;
			margin-inline: auto;
		}
		:global(.desktop-service-finder .desktop-import-entry) {
			gap: var(--bc-space-7);
		}
		:global(.desktop-service-finder .desktop-import-entry__countries),
		:global(.desktop-service-finder .desktop-import-entry__toggle) {
			min-height: var(--bc-control-height-compact);
		}
		form {
			position: relative;
		}
		.service-entry-row {
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
		.service-entry-row:hover {
			background: var(--bc-control-hover);
		}
		.service-entry-row:has(input:focus-visible) {
			outline: 2px solid var(--bc-focus);
			outline-offset: 2px;
		}
		.service-entry-row:has(input[aria-invalid='true']) {
			outline: 2px solid var(--bc-danger);
			outline-offset: 2px;
		}
		.service-entry-row input {
			flex: 1;
			min-width: 0;
			min-height: calc(var(--bc-desktop-search-height) - 2 * var(--bc-space-1) - 2px);
			padding: 0 var(--bc-space-3);
			border: 0;
			border-radius: var(--bc-desktop-control-radius);
			background: transparent;
			color: var(--bc-ink);
			font: var(--bc-weight-control) var(--bc-text-search-trigger)/var(--bc-leading-control)
				var(--bc-font-body);
		}
		.service-entry-row input::placeholder {
			color: var(--bc-copy);
			opacity: 1;
		}
		.service-entry-row input:focus-visible {
			outline: none !important;
			box-shadow: none !important;
		}
		.service-entry-row :global(.site-action) {
			flex: none;
			padding-inline: var(--bc-space-3);
		}
		.service-utility {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: var(--bc-control-height-compact);
			margin-top: var(--bc-space-7);
			color: var(--bc-copy);
			font-size: var(--bc-text-label);
		}
		.service-utility p {
			margin: 0;
			text-align: center;
		}
		.service-utility a {
			display: inline-flex;
			align-items: center;
			min-height: var(--bc-control-height-compact);
			color: inherit;
			text-decoration: underline;
			text-underline-offset: 4px;
		}
		.service-utility a:hover {
			color: var(--bc-ink);
		}
		.service-entry-error {
			position: absolute;
			top: calc(var(--bc-desktop-search-height) + var(--bc-space-1));
			inset-inline: 0;
			margin: 0;
			color: var(--service-error-ink);
			font-size: var(--bc-text-label);
			line-height: var(--bc-leading-control);
		}
		:global(.desktop-service-finder .desktop-import-entry__error) {
			top: calc(var(--bc-desktop-search-height) + var(--bc-space-1));
			color: var(--service-error-ink);
			line-height: var(--bc-leading-control);
		}
	}
</style>
