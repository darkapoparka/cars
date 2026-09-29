<script lang="ts">
	import { localizedCopy, contentText } from '$lib/content/localized';
	const ct = (value: string) => contentText(page.data.locale === 'en' ? 'en' : 'bg', value);
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { VehicleCardSummary } from '$lib/domain/vehicle-card';
	import { page } from '$app/state';
	import { templateInquiryCopy } from '$lib/data/template-settings';
	import { importCriteriaFromParams } from '$lib/data/import-criteria';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy, importRequestSteps } from '$lib/auxero/services';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileServiceEntry from '$lib/components/services/MobileServiceEntry.svelte';
	import MobileServiceManualEntry from '$lib/components/services/MobileServiceManualEntry.svelte';
	import MobileModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Link2 from '@lucide/svelte/icons/link-2';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';
	import ImportRequestWizard from './ImportRequestWizard.svelte';

	type ImportIntent = 'listing' | 'source';

	let {
		embedded = false,
		form,
		serviceVehicles
	}: {
		embedded?: boolean;
		form: AuxeroServiceFormData;
		serviceVehicles: VehicleCardSummary[];
	} = $props();

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
		{embedded}
		{serviceVehicles}
		showTitle={false}
		title={ct(importRequestMobileCopy.title)}
		intro={ct(importRequestMobileCopy.intro)}
		meta={nt('ui209')}
		response={ct(templateInquiryCopy.response)}
		steps={localizedCopy(importRequestSteps, page.data.locale).map((step, index) =>
			index === 0 ? { ...step, text: nt('ui210') } : step
		)}
	>
		{#snippet modes()}
			<MobileModeTabs
				bind:value={entryMode}
				label={nt('ui211')}
				idPrefix="import-mode"
				options={[
					{ value: 'listing', label: 'LINK / VIN', panelId: 'import-entry-panel' },
					{ value: 'source', label: nt('ui212'), panelId: 'import-entry-panel' }
				]}
			/>
		{/snippet}
		{#snippet entry()}
			<div id="import-entry-panel" role="tabpanel" aria-labelledby={'import-mode-' + entryMode}>
				{#if entryMode === 'listing'}
					<button
						type="button"
						class="service-input service-manual-entry"
						aria-haspopup="dialog"
						aria-expanded={wizardOpen && wizardIntent === 'listing'}
						onclick={() => openWizard('listing')}
					>
						<Link2 size={21} strokeWidth={2.15} aria-hidden="true" />
						<span class="service-input__text">{vehicle || nt('ui213')}</span>
						<span class="service-input__go" aria-hidden="true">
							<ArrowRight size={21} strokeWidth={2.35} />
						</span>
					</button>
				{:else}
					<MobileServiceManualEntry onclick={() => openWizard('source')} />
				{/if}
			</div>
		{/snippet}
	</MobileServiceEntry>

	<MobileSheet
		bind:open={wizardOpen}
		title={nt('ui214')}
		mode="full"
		showHeader={false}
		showHandle={false}
		closeOnBack={false}
		contentClass="daynight-import-wizard-drawer__sheet"
	>
		{#key wizardSession}
			<ImportRequestWizard
				initialCriteria={criteria}
				initialIntent={wizardIntent}
				initialVehicle={vehicle}
				onclose={() => (wizardOpen = false)}
			/>
		{/key}
	</MobileSheet>
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

	:global(.daynight-import-wizard-drawer__sheet.bc-mobile-sheet__content) {
		background: var(--bc-bg-strong);
		padding: 0;
	}

	:global(.daynight-import-wizard-drawer__sheet .bc-mobile-sheet__body) {
		overflow: hidden;
	}
</style>
