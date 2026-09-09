<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, MapPin, Navigation, PhoneCall, ScanLine, X } from '@lucide/svelte';
	import type {
		AuxeroSellCarFormData,
		AuxeroSellCarMobileCopy,
		AuxeroSellCarMobileStep
	} from '$lib/auxero/sell-your-car';
	import { daynightContact } from '$lib/data/daynight';
	import { Drawer } from 'vaul-svelte';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileServiceEntry from '$lib/components/services/MobileServiceEntry.svelte';
	import SellCarWizard from './SellCarWizard.svelte';

	let {
		copy,
		form,
		steps
	}: {
		copy: AuxeroSellCarMobileCopy;
		form: AuxeroSellCarFormData;
		steps: AuxeroSellCarMobileStep[];
	} = $props();

	let wizardOpen = $state(false);
	let manualMake = $state('');
	let manualModel = $state('');
	let manualYear = $state('');
	let manualMileage = $state('');
	const manualYears = Array.from({ length: 37 }, (_, index) =>
		String(new Date().getFullYear() - index)
	);
	const manualMakes = [
		'BMW',
		'Mercedes-Benz',
		'Audi',
		'Volkswagen',
		'Toyota',
		'Volvo',
		'Ford',
		'Porsche',
		'Honda',
		'Друга'
	];
	const submitManual = (event: SubmitEvent) => {
		event.preventDefault();
		openWizard(true);
	};
	let manualEntry = $state(false);
	let wizardSession = $state(0);
	const vinField = $derived(form.fields.find((field) => field.name === 'vin')!);
	/* Editable copies let the hero VIN carry into the detailed valuation. */
	// svelte-ignore state_referenced_locally
	let fieldValues = $state(
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
	const handleVinSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		openWizard(false);
	};
	const setLocationSheetOpen = (open: boolean) => {
		const toggle = document.getElementById(
			'sell-mobile-location-toggle'
		) as HTMLInputElement | null;
		if (toggle && toggle.checked !== open) toggle.click();
	};
</script>

<div class="daynight-sell-mobile">
	<input
		id="sell-mobile-location-toggle"
		class="daynight-sell-mobile__sheet-toggle"
		type="checkbox"
		autocomplete="off"
		tabindex="-1"
		aria-hidden="true"
	/>

	<MobileAppbar
		actionsLabel={copy.contactLabel}
		logoAlt={copy.logoAlt}
		surface="dark"
		onMap={() => setLocationSheetOpen(true)}
	/>

	<MobileServiceEntry
		title={copy.title}
		intro="Въведи VIN, добави основните данни и ще се свържем с оценка до 24 ч."
		meta="5 стъпки · Снимки по желание"
		response="Оценка до 24 ч."
		stepsTitle={copy.stepsTitle}
		{steps}
	>
		{#snippet entry()}
			<form onsubmit={handleVinSubmit}>
				<label for="sell-mobile-vin">VIN номер</label>
				<div class="service-input">
					<ScanLine size={21} strokeWidth={2.15} aria-hidden="true" />
					<input
						id="sell-mobile-vin"
						name={vinField.name}
						type={vinField.type}
						placeholder="Въведи VIN номер"
						required={vinField.required}
						autocomplete={vinField.autocomplete}
						bind:value={fieldValues.vin}
					/>
					<button type="submit" aria-label="Продължи с VIN">
						<ArrowRight size={21} strokeWidth={2.35} aria-hidden="true" />
					</button>
				</div>
			</form>
		{/snippet}
		{#snippet content()}
			<form class="sell-manual-entry" onsubmit={submitManual}>
				<h2>Нямаш VIN?</h2>
				<div class="sell-manual-entry__fields">
					<label for="sell-entry-make"
						>Марка<select id="sell-entry-make" required bind:value={manualMake}
							><option value="">Избери марка</option>{#each manualMakes as make (make)}<option
									value={make}>{make}</option
								>{/each}</select
						></label
					>
					<label for="sell-entry-model"
						>Модел<input
							id="sell-entry-model"
							required
							minlength="2"
							maxlength="80"
							placeholder="Напр. X5"
							bind:value={manualModel}
						/></label
					>
					<label for="sell-entry-year"
						>Година<select id="sell-entry-year" bind:value={manualYear}
							><option value="">Избери година</option>{#each manualYears as year (year)}<option
									value={year}>{year}</option
								>{/each}</select
						></label
					>
					<label for="sell-entry-mileage"
						>Пробег (км)<input
							id="sell-entry-mileage"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength="8"
							placeholder="125000"
							bind:value={manualMileage}
						/></label
					>
				</div>
				<button type="submit">Продължи с данните <ArrowRight size={20} aria-hidden="true" /></button
				>
			</form>
		{/snippet}
	</MobileServiceEntry>

	<div
		id="sell-mobile-location-sheet"
		class="daynight-sell-mobile-sheet daynight-sell-mobile-sheet--location"
		role="dialog"
		aria-modal="true"
		aria-labelledby="sell-mobile-location-title"
	>
		<button
			type="button"
			class="daynight-sell-mobile-sheet__backdrop"
			aria-label="Затвори локацията"
			onclick={() => setLocationSheetOpen(false)}
		></button>
		<div class="daynight-sell-mobile-sheet__panel">
			<span class="daynight-sell-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="daynight-sell-mobile-sheet__header">
				<div>
					<p>Promosale Varna шоурум</p>
					<h2 id="sell-mobile-location-title">{daynightContact.addressLabel}</h2>
				</div>
				<button type="button" aria-label="Затвори" onclick={() => setLocationSheetOpen(false)}>
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</button>
			</header>
			<div class="daynight-sell-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.4} /></span>
				<span class="badge">Promosale Varna</span>
			</div>
			<div class="daynight-sell-mobile__location-copy">
				<span>{daynightContact.appointmentNote}</span>
				<strong>{daynightContact.addressLabel}</strong>
				<p>Огледите са с уговорка. Обади се преди посещение, за да подготвим човека и времето.</p>
			</div>
			<div class="daynight-sell-mobile-sheet__actions">
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
					Отвори карта
				</a>
				<a {...hrefAttributes(daynightContact.primaryPhoneHref)}>
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					Обади се
				</a>
			</div>
		</div>
	</div>

	<Drawer.Root bind:open={wizardOpen} direction="bottom" fixed={true}>
		<Drawer.Overlay class="daynight-sell-wizard-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="daynight-sell-wizard-drawer__sheet">
			<Drawer.Handle class="daynight-sell-wizard-drawer__handle" />
			<Drawer.Title class="daynight-sell-wizard-drawer__title">Оценка на автомобила</Drawer.Title>
			{#key wizardSession}
				<SellCarWizard
					initial={{
						make: manualEntry ? manualMake : '',
						model: manualEntry ? manualModel : '',
						year: manualEntry ? manualYear : '',
						mileage: manualEntry ? manualMileage : fieldValues.mileage,
						phone: fieldValues.phone,
						price: fieldValues.price,
						vin: manualEntry ? '' : fieldValues.vin
					}}
					{manualEntry}
					onclose={() => (wizardOpen = false)}
				/>
			{/key}
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	.sell-manual-entry {
		padding: 4px 2px 12px;
	}
	.sell-manual-entry h2 {
		margin: 0 0 12px;
		color: #17191c;
		font-size: 23px;
		font-weight: 700;
		line-height: 28px;
	}
	.sell-manual-entry__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.sell-manual-entry label {
		display: grid;
		gap: 6px;
		min-width: 0;
		color: #34383d;
		font-size: 13px;
		font-weight: 600;
	}
	.sell-manual-entry input,
	.sell-manual-entry select {
		width: 100%;
		min-width: 0;
		height: 48px !important;
		padding: 0 12px !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: #ffffff !important;
		color: #17191c;
		box-shadow: none !important;
		font-size: 16px;
	}
	.sell-manual-entry input::placeholder {
		color: #626973;
	}
	.sell-manual-entry button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		min-height: 50px;
		margin-top: 12px;
		padding: 0 18px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}
	.sell-manual-entry input:focus-visible,
	.sell-manual-entry select:focus-visible,
	.sell-manual-entry button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	@media (max-height: 620px) {
		.sell-manual-entry h2 {
			margin-bottom: 8px;
		}
	}

	.daynight-sell-mobile {
		position: relative;
		min-height: calc(100dvh - 70px - env(safe-area-inset-bottom));
		background: var(--bc-bg);
		color: #111111;
	}

	.daynight-sell-mobile__sheet-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.daynight-sell-mobile-sheet__header p {
		margin: 0;
		color: var(--bc-accent-bright-soft);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	:global(.daynight-sell-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.38);
		cursor: pointer;
		padding: 0;
	}

	:global(.daynight-sell-wizard-drawer__backdrop span),
	:global(.daynight-sell-wizard-drawer__title) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.daynight-sell-wizard-drawer__sheet) {
		position: fixed;
		inset: 0;
		z-index: 1201;
		display: block;
		height: 100dvh;
		max-height: none;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: 0;
		background: var(--bc-bg);
		outline: 0;
		padding: max(8px, env(safe-area-inset-top)) 14px max(20px, env(safe-area-inset-bottom));
		scrollbar-width: none;
	}

	:global(.daynight-sell-wizard-drawer__sheet .bc-sell-wizard) {
		height: auto;
		min-height: calc(100dvh - 38px - max(28px, env(safe-area-inset-top)));
		overflow: visible;
		padding-bottom: 4px;
	}

	:global(.daynight-sell-wizard-drawer__sheet::-webkit-scrollbar) {
		display: none;
	}

	/* Vaul extends bottom sheets with a 200% pseudo-element for drag bounce.
	   A full-screen document sheet must not expose that empty scroll range. */
	:global(.daynight-sell-wizard-drawer__sheet)::after {
		display: none;
	}

	:global(.daynight-sell-wizard-drawer__handle) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.daynight-sell-wizard-drawer__handle)::after {
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

	.daynight-sell-mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 1000;
		visibility: hidden;
		pointer-events: none;
	}

	#sell-mobile-location-toggle:checked ~ #sell-mobile-location-sheet {
		visibility: visible;
		pointer-events: auto;
	}

	.daynight-sell-mobile-sheet__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(28, 28, 28, 0.36);
		cursor: pointer;
		opacity: 0;
		padding: 0;
		transition: opacity 180ms ease;
	}

	#sell-mobile-location-toggle:checked
		~ #sell-mobile-location-sheet
		.daynight-sell-mobile-sheet__backdrop {
		opacity: 1;
	}

	.daynight-sell-mobile-sheet__panel {
		position: absolute;
		right: 0;
		/* Lifted above the on-screen keyboard on iOS; --bc-kb-inset stays 0 elsewhere. */
		bottom: var(--bc-kb-inset, 0px);
		left: 0;
		display: grid;
		gap: 12px;
		max-height: min(calc(88dvh - var(--bc-kb-inset, 0px)), 720px);
		overflow-y: auto;
		border: 0;
		border-top: 1px solid var(--bc-border);
		border-radius: 22px 22px 0 0;
		background: var(--bc-bg);
		box-shadow: 0 -18px 42px rgba(28, 28, 28, 0.18);
		padding: 10px 14px calc(18px + env(safe-area-inset-bottom));
		transform: translateY(100%);
		transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	#sell-mobile-location-toggle:checked
		~ #sell-mobile-location-sheet
		.daynight-sell-mobile-sheet__panel {
		transform: translateY(0);
	}

	.daynight-sell-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.daynight-sell-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.daynight-sell-mobile-sheet__header div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.daynight-sell-mobile-sheet__header p {
		color: #626d7c;
	}

	.daynight-sell-mobile-sheet__header h2 {
		margin: 0;
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 27px;
	}

	.daynight-sell-mobile-sheet__header button {
		display: flex;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		flex: 0 0 var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.daynight-sell-mobile__map-preview {
		position: relative;
		height: 132px;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(254, 226, 226, 0.22), rgba(255, 255, 255, 0.74)), #ffffff;
	}

	.daynight-sell-mobile__map-preview::before,
	.daynight-sell-mobile__map-preview::after {
		position: absolute;
		inset: 18px;
		border: 1px solid rgba(28, 28, 28, 0.08);
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
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.1);
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
		border: 4px solid #ffffff;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #111111;
		transform: translateX(-50%);
	}

	.daynight-sell-mobile__map-preview .badge {
		position: absolute;
		right: 15px;
		bottom: 14px;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		padding: 7px 10px;
	}

	.daynight-sell-mobile__location-copy {
		display: grid;
		gap: 4px;
		border-radius: 8px;
		background: #ffffff;
		padding: 13px 14px;
	}

	.daynight-sell-mobile__location-copy span,
	.daynight-sell-mobile__location-copy strong,
	.daynight-sell-mobile__location-copy p {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-sell-mobile__location-copy span {
		color: #626d7c;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-sell-mobile__location-copy strong {
		color: #111111;
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	.daynight-sell-mobile__location-copy p {
		color: #56635a;
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	.daynight-sell-mobile-sheet__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.daynight-sell-mobile-sheet__actions a {
		display: flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: var(--bc-radius-control);
		background: #ffffff;
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.daynight-sell-mobile-sheet__actions a:first-child {
		background: var(--bc-accent-bright-soft);
	}
</style>
