<script lang="ts">
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import { page } from '$app/state';
	import { templateInquiryCopy } from '$lib/data/template-settings';
	import { importCriteriaFromParams } from '$lib/data/import-criteria';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy, importRequestSteps } from '$lib/auxero/services';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileServiceEntry from '$lib/components/services/MobileServiceEntry.svelte';
	import MobileServiceManualEntry from '$lib/components/services/MobileServiceManualEntry.svelte';
	import { ArrowRight, Link2 } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';
	import ImportRequestWizard from './ImportRequestWizard.svelte';

	type ImportIntent = 'listing' | 'source';

	let {
		form,
		serviceVehicles
	}: { form: AuxeroServiceFormData; serviceVehicles: HomeFiveVehicleCardData[] } = $props();

	const vehicle = $derived(form.vehicleField.value ?? '');
	let entryMode = $state<ImportIntent>('listing');
	let wizardOpen = $state(false);
	let wizardIntent = $state<ImportIntent>('listing');
	let wizardSession = $state(0);
	const criteria = $derived(importCriteriaFromParams(page.url.searchParams));

	const openWizard = (intent: ImportIntent) => {
		wizardIntent = intent;
		wizardSession += 1;
		wizardOpen = true;
	};

	$effect(() => {
		if (!wizardOpen) return;
		return trackKeyboardInset();
	});
</script>

<div class="daynight-import-mobile">
	<MobileAppbar surface="dark" />

	<MobileServiceEntry
		{serviceVehicles}
		showTitle={false}
		title={importRequestMobileCopy.title}
		intro={importRequestMobileCopy.intro}
		meta="3 стъпки · Без ангажимент"
		response={templateInquiryCopy.response}
		steps={importRequestSteps.map((step, index) =>
			index === 0 ? { ...step, text: 'Изпращаш линк към обявата или директно VIN номера.' } : step
		)}
	>
		{#snippet modes()}
			<div class="import-mode-tabs" role="tablist" aria-label="Начин за заявка">
				<button
					type="button"
					class:active={entryMode === 'listing'}
					role="tab"
					aria-selected={entryMode === 'listing'}
					onclick={() => (entryMode = 'listing')}>LINK / VIN</button
				>
				<button
					type="button"
					class:active={entryMode === 'source'}
					role="tab"
					aria-selected={entryMode === 'source'}
					onclick={() => (entryMode = 'source')}>Нямам линк</button
				>
			</div>
		{/snippet}
		{#snippet entry()}
			{#if entryMode === 'listing'}
				<button
					type="button"
					class="service-input service-manual-entry"
					aria-haspopup="dialog"
					aria-expanded={wizardOpen && wizardIntent === 'listing'}
					onclick={() => openWizard('listing')}
				>
					<Link2 size={21} strokeWidth={2.15} aria-hidden="true" />
					<span class="service-input__text">{vehicle || 'Линк към обява или VIN'}</span>
					<span class="service-input__go" aria-hidden="true">
						<ArrowRight size={21} strokeWidth={2.35} />
					</span>
				</button>
			{:else}
				<MobileServiceManualEntry onclick={() => openWizard('source')} />
			{/if}
		{/snippet}
	</MobileServiceEntry>

	<Drawer.Root bind:open={wizardOpen} direction="bottom" fixed={true} repositionInputs={false}>
		<Drawer.Overlay class="daynight-import-wizard-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="daynight-import-wizard-drawer__sheet">
			<Drawer.Title class="daynight-import-wizard-drawer__title">Заявка за внос</Drawer.Title>
			{#key wizardSession}
				<ImportRequestWizard
					initialCriteria={criteria}
					initialIntent={wizardIntent}
					initialVehicle={vehicle}
					onclose={() => (wizardOpen = false)}
				/>
			{/key}
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	.daynight-import-mobile {
		position: relative;
		min-height: calc(100dvh - var(--bc-mobile-nav-height) - env(safe-area-inset-bottom));
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}

	.daynight-import-mobile :global(a) {
		text-decoration: none !important;
	}

	.import-mode-tabs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0;
		min-height: 0;
		border: 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.2);
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	.import-mode-tabs button {
		position: relative;
		display: flex;
		width: 100%;
		height: 44px;
		min-height: 44px;
		align-items: flex-end;
		justify-content: center;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: rgb(255 255 255 / 0.72);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-h5);
		font-weight: var(--bc-weight-control);
		letter-spacing: 0;
		line-height: 24px;
		text-align: center;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		padding: 0 0 6px;
	}

	.import-mode-tabs button.active {
		background: transparent;
		box-shadow: none;
		color: var(--bc-white);
		font-weight: var(--bc-weight-heading);
	}

	.import-mode-tabs button.active::after {
		position: absolute;
		inset: auto 0 -1px;
		height: 2px;
		background: var(--bc-white);
		content: '';
	}

	.import-mode-tabs button:focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.72);
		outline-offset: -3px;
	}

	:global(.daynight-import-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: transparent;
		cursor: pointer;
		padding: 0;
	}

	:global(.daynight-import-wizard-drawer__backdrop span),
	:global(.daynight-import-wizard-drawer__title) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.daynight-import-wizard-drawer__sheet) {
		position: fixed;
		inset: 0;
		z-index: 1201;
		display: block;
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		overflow: hidden;
		overscroll-behavior: contain;
		border-radius: 0;
		background: var(--bc-bg-strong);
		outline: 0;
		padding: 0;
		scrollbar-width: none;
	}

	:global(.daynight-import-wizard-drawer__sheet::-webkit-scrollbar) {
		display: none;
	}

	:global(.daynight-import-wizard-drawer__sheet)::after {
		display: none;
	}

	:global(.daynight-import-wizard-drawer__handle) {
		display: none !important;
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.daynight-import-wizard-drawer__handle)::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 42px;
		height: 4px;
		transform: translate(-50%, -50%);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border);
		content: '';
	}
</style>
