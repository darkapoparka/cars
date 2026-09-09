<script lang="ts">
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import { page } from '$app/state';
	import { importCriteriaFromParams } from '$lib/data/import-criteria';
	import ImportBrowseControls from './ImportBrowseControls.svelte';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy, importRequestSteps } from '$lib/auxero/services';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileServiceEntry from '$lib/components/services/MobileServiceEntry.svelte';
	import { ArrowRight, Link2, Search } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import ImportRequestWizard from './ImportRequestWizard.svelte';

	type ImportIntent = 'listing' | 'source';

	let {
		form,
		serviceVehicles
	}: { form: AuxeroServiceFormData; serviceVehicles: HomeFiveVehicleCardData[] } = $props();

	// The route supplies the initial listing value once; the user owns it after hydration.
	// svelte-ignore state_referenced_locally
	let vehicle = $state(form.vehicleField.value ?? '');
	let wizardOpen = $state(false);
	let wizardIntent = $state<ImportIntent>('listing');
	let wizardSession = $state(0);
	const criteria = $derived(importCriteriaFromParams(page.url.searchParams));

	const openWizard = (intent: ImportIntent) => {
		wizardIntent = intent;
		wizardSession += 1;
		wizardOpen = true;
	};

	const handleVehicleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		openWizard('listing');
	};
</script>

<div class="daynight-import-mobile">
	<MobileAppbar surface="dark" />

	<MobileServiceEntry
		{serviceVehicles}
		inventoryTitle="Налични в България"
		title={importRequestMobileCopy.title}
		intro={importRequestMobileCopy.intro}
		meta="3 стъпки · Без ангажимент"
		response="Отговор до 24 ч."
		steps={importRequestSteps.map((step, index) =>
			index === 0 ? { ...step, text: 'Изпращаш линк към обявата или директно VIN номера.' } : step
		)}
	>
		{#snippet browseControls()}<ImportBrowseControls />{/snippet}
		{#snippet entry()}
			<form onsubmit={handleVehicleSubmit}>
				<label for="import-mobile-vehicle">Линк към обява или VIN</label>
				<div class="service-input">
					<Link2 size={21} strokeWidth={2.15} aria-hidden="true" />
					<input
						id="import-mobile-vehicle"
						name={form.vehicleField.name}
						type={form.vehicleField.type}
						placeholder="Линк към обява или VIN"
						required
						bind:value={vehicle}
					/>
					<button type="submit" aria-label="Провери автомобила">
						<ArrowRight size={21} strokeWidth={2.35} aria-hidden="true" />
					</button>
				</div>
			</form>
		{/snippet}
		{#snippet alternative()}
			<button type="button" onclick={() => openWizard('source')}>
				<Search size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>
					<strong>Заяви търсене</strong>
				</span>
				<ArrowRight size={18} strokeWidth={2.3} aria-hidden="true" />
			</button>
		{/snippet}
	</MobileServiceEntry>

	<Drawer.Root bind:open={wizardOpen} direction="bottom" fixed={true}>
		<Drawer.Overlay class="daynight-import-wizard-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="daynight-import-wizard-drawer__sheet">
			<Drawer.Handle class="daynight-import-wizard-drawer__handle" />
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
		min-height: calc(100dvh - 70px - env(safe-area-inset-bottom));
		background: var(--bc-bg);
		color: #111111;
	}

	:global(.daynight-import-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.42);
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
		height: 100dvh;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: 0;
		background: var(--bc-bg);
		outline: 0;
		padding: max(8px, env(safe-area-inset-top)) 14px max(20px, env(safe-area-inset-bottom));
		scrollbar-width: none;
	}

	:global(.daynight-import-wizard-drawer__sheet::-webkit-scrollbar) {
		display: none;
	}

	:global(.daynight-import-wizard-drawer__sheet)::after {
		display: none;
	}

	:global(.daynight-import-wizard-drawer__handle) {
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
		border-radius: 999px;
		background: var(--bc-border);
		content: '';
	}
</style>
