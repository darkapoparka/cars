<script lang="ts">
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { site } from '$lib/config/site';
	import { linkHref as resolve } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Navigation from '@lucide/svelte/icons/navigation';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import ScanLine from '@lucide/svelte/icons/scan-line';
	import type {
		AuxeroSellCarFormData,
		AuxeroSellCarMobileCopy,
		AuxeroSellCarMobileStep
	} from '$lib/auxero/sell-your-car';
	import { daynightContact } from '$lib/data/daynight';
	import MobileModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileServiceEntry from '$lib/components/services/MobileServiceEntry.svelte';
	import MobileServiceManualEntry from '$lib/components/services/MobileServiceManualEntry.svelte';
	import SellCarWizard from './SellCarWizard.svelte';
	import type { VehicleIntakeOptions } from '$lib/domain/vehicle-intake-options';
	import SellValuationCard from './SellValuationCard.svelte';

	let {
		embedded = false,
		copy,
		form,
		steps,
		intakeOptions
	}: {
		embedded?: boolean;
		copy: AuxeroSellCarMobileCopy;
		form: AuxeroSellCarFormData;
		steps: AuxeroSellCarMobileStep[];
		intakeOptions: VehicleIntakeOptions;
	} = $props();

	let wizardOpen = $state(false);
	let locationOpen = $state(false);
	let entryMode = $state<'vin' | 'manual'>('vin');
	let manualEntry = $state(false);
	let wizardSession = $state(0);
	const guideSteps = $derived(
		steps.map((step, index) => (index === 0 ? { ...step, text: nt('ui208') } : step))
	);
	const fieldValues = $derived(
		Object.fromEntries(form.fields.map((field) => [field.name, field.value ?? ''])) as Record<
			string,
			string
		>
	);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		daynightContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});

	const openWizard = (manual: boolean) => {
		manualEntry = manual;
		wizardSession += 1;
		wizardOpen = true;
	};
	const setLocationSheetOpen = (open: boolean) => {
		locationOpen = open;
	};

	$effect(() => {
		if (!wizardOpen) return;
		return trackKeyboardInset();
	});
</script>

<div class="daynight-sell-mobile">
	<MobileAppbar
		actionsLabel={copy.contactLabel}
		logoAlt={copy.logoAlt}
		surface="dark"
		onMap={() => setLocationSheetOpen(true)}
	/>

	<MobileServiceEntry
		{embedded}
		showTitle={false}
		title={copy.title}
		intro={nt('ui193')}
		meta={nt('ui194')}
		response={nt('ui195')}
		stepsTitle={copy.stepsTitle}
		steps={guideSteps}
	>
		{#snippet modes()}
			<MobileModeTabs
				bind:value={entryMode}
				label={nt('ui196')}
				idPrefix="sell-mode"
				options={[
					{ value: 'vin', label: 'VIN', panelId: 'sell-entry-panel' },
					{ value: 'manual', label: nt('ui197'), panelId: 'sell-entry-panel' }
				]}
			/>
		{/snippet}
		{#snippet entry()}
			<div id="sell-entry-panel" role="tabpanel" aria-labelledby={`sell-mode-${entryMode}`}>
				{#if entryMode === 'vin'}
					<button
						type="button"
						class="service-input service-manual-entry"
						aria-haspopup="dialog"
						aria-expanded={wizardOpen && !manualEntry}
						onclick={() => openWizard(false)}
					>
						<ScanLine size={21} strokeWidth={2.15} aria-hidden="true" />
						<span class="service-input__text">{fieldValues.vin || nt('ui198')}</span>
						<span class="service-input__go" aria-hidden="true">
							<ArrowRight size={21} strokeWidth={2.35} />
						</span>
					</button>
				{:else}
					<MobileServiceManualEntry onclick={() => openWizard(true)} />
				{/if}
			</div>
		{/snippet}
		{#snippet content()}
			<SellValuationCard open={wizardOpen} onstart={() => openWizard(entryMode === 'manual')} />
		{/snippet}
	</MobileServiceEntry>

	<MobileSheet
		bind:open={locationOpen}
		title={dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].address}
		description={site.identity.name + nt('ui205')}
		contentClass="daynight-sell-location-sheet"
	>
		<div class="daynight-sell-mobile__map-preview" aria-hidden="true">
			<span class="road road-a"></span>
			<span class="road road-b"></span>
			<span class="road road-c"></span>
			<span class="pin"><MapPin size={24} strokeWidth={2.4} /></span>
			<span class="badge">{site.identity.name}</span>
		</div>
		<div class="daynight-sell-mobile__location-copy">
			<span>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].appointment}</span>
			<strong>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].address}</strong>
			<p>{nt('ui206')}</p>
		</div>
		<div class="daynight-sell-mobile-sheet__actions">
			<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
				<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
				{nt('ui44')}
			</a>
			<a {...hrefAttributes(daynightContact.primaryPhoneHref)}>
				<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
				{nt('ui37')}
			</a>
		</div>
	</MobileSheet>

	<MobileSheet
		bind:open={wizardOpen}
		title={nt('ui207')}
		mode="full"
		showHeader={false}
		showHandle={false}
		closeOnBack={false}
		contentClass="daynight-sell-wizard-drawer__sheet"
	>
		{#key wizardSession}
			<SellCarWizard
				mobile
				{intakeOptions}
				initial={{
					make: '',
					model: '',
					year: '',
					mileage: fieldValues.mileage,
					phone: fieldValues.phone,
					price: fieldValues.price,
					vin: manualEntry ? '' : fieldValues.vin
				}}
				{manualEntry}
				onclose={() => (wizardOpen = false)}
			/>
		{/key}
	</MobileSheet>
</div>

<style>
	.daynight-sell-mobile {
		position: relative;
		min-height: calc(100dvh - var(--bc-mobile-nav-height) - env(safe-area-inset-bottom));
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}

	.daynight-sell-mobile :global(a) {
		text-decoration: none !important;
	}

	:global(.daynight-sell-wizard-drawer__sheet.bc-mobile-sheet__content) {
		background: var(--bc-bg-strong);
		padding: 0;
	}

	:global(.daynight-sell-wizard-drawer__sheet .bc-mobile-sheet__body) {
		overflow: hidden;
	}

	:global(.daynight-sell-location-sheet.bc-mobile-sheet__content) {
		background: var(--bc-bg-strong);
	}

	:global(.daynight-sell-location-sheet .bc-mobile-sheet__body) {
		display: grid;
		gap: var(--bc-space-3);
	}

	.daynight-sell-mobile__map-preview {
		position: relative;
		height: 132px;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(135deg, rgb(216 221 227 / 0.72), rgb(248 250 252 / 0.92)), var(--bc-bg-strong);
	}

	.daynight-sell-mobile__map-preview::before,
	.daynight-sell-mobile__map-preview::after {
		position: absolute;
		inset: 18px;
		border: 1px solid rgb(28 28 28 / 0.08);
		border-radius: 18px;
		content: '';
	}

	.daynight-sell-mobile__map-preview::after {
		inset: 42px -22px auto 44px;
		height: 48px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-7deg);
	}

	.daynight-sell-mobile__map-preview .road {
		position: absolute;
		border-radius: var(--bc-radius-pill);
		background: rgb(28 28 28 / 0.1);
	}

	.daynight-sell-mobile__map-preview .road-a {
		top: 29px;
		left: -20px;
		width: 72%;
		height: 8px;
		transform: rotate(12deg);
	}

	.daynight-sell-mobile__map-preview .road-b {
		right: 18px;
		bottom: 31px;
		width: 58%;
		height: 8px;
		transform: rotate(-19deg);
	}

	.daynight-sell-mobile__map-preview .road-c {
		top: 15px;
		left: 47%;
		width: 8px;
		height: 116px;
		transform: rotate(21deg);
	}

	.daynight-sell-mobile__map-preview .pin {
		position: absolute;
		top: 45px;
		left: 50%;
		display: flex;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		border: 4px solid var(--bc-white);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		color: var(--bc-white);
		transform: translateX(-50%);
	}

	.daynight-sell-mobile__map-preview .badge {
		position: absolute;
		right: 15px;
		bottom: 14px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-emphasis);
		line-height: var(--bc-mobile-meta-leading);
		padding: 7px 10px;
	}

	.daynight-sell-mobile__location-copy {
		display: grid;
		gap: 4px;
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
		padding: var(--bc-space-3) var(--bc-mobile-gutter);
	}

	.daynight-sell-mobile__location-copy span,
	.daynight-sell-mobile__location-copy strong,
	.daynight-sell-mobile__location-copy p {
		margin: 0;
	}

	.daynight-sell-mobile__location-copy span {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-meta-leading);
		text-transform: uppercase;
	}

	.daynight-sell-mobile__location-copy strong {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-sell-mobile__location-copy p {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-sell-mobile-sheet__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}

	.daynight-sell-mobile-sheet__actions a {
		display: flex;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-sell-mobile-sheet__actions a:first-child {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
</style>
