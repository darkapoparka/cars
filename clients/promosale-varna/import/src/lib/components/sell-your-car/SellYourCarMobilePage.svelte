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
	import MobileServiceManualEntry from '$lib/components/services/MobileServiceManualEntry.svelte';
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
	let entryMode = $state<'vin' | 'manual'>('vin');
	let manualEntry = $state(false);
	let wizardSession = $state(0);
	const guideSteps = $derived(
		steps.map((step, index) =>
			index === 0
				? { ...step, text: 'Добави VIN или марка и модел, пробег и телефон за контакт.' }
				: step
		)
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
	const handleModeKeydown = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		entryMode =
			event.key === 'Home'
				? 'vin'
				: event.key === 'End'
					? 'manual'
					: entryMode === 'vin'
						? 'manual'
						: 'vin';
		(event.currentTarget as HTMLElement).parentElement
			?.querySelector<HTMLButtonElement>(`[data-mode="${entryMode}"]`)
			?.focus();
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
		showTitle={false}
		title={copy.title}
		intro="Въведи VIN или опиши автомобила с марка, модел, година и пробег."
		meta="2 стъпки · Автомобил и контакт"
		response="Демонстрационна оценка"
		stepsTitle={copy.stepsTitle}
		steps={guideSteps}
	>
		{#snippet modes()}
			<div class="sell-mode-tabs" role="tablist" aria-label="Данни за автомобила">
				{#each [{ value: 'vin', label: 'VIN' }, { value: 'manual', label: 'Нямам VIN' }] as mode (mode.value)}
					<button
						type="button"
						id={`sell-mode-${mode.value}`}
						data-mode={mode.value}
						role="tab"
						class:active={entryMode === mode.value}
						aria-selected={entryMode === mode.value}
						aria-controls="sell-entry-panel"
						tabindex={entryMode === mode.value ? 0 : -1}
						onkeydown={handleModeKeydown}
						onclick={() => (entryMode = mode.value as 'vin' | 'manual')}>{mode.label}</button
					>
				{/each}
			</div>
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
						<span class="service-input__text">{fieldValues.vin || 'Въведи VIN номер'}</span>
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
			<section class="sell-guide" aria-label="Стъпки за продажба">
				<ol class="sell-guide__steps">
					{#each guideSteps as step, index (step.title)}
						<li>
							<span class="sell-guide__number" aria-hidden="true">{index + 1}</span>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</li>
					{/each}
				</ol>
			</section>
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
					<p>Day Night Auto шоурум</p>
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
				<span class="badge">Day Night Auto</span>
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
			<Drawer.Title class="daynight-sell-wizard-drawer__title">Оценка на автомобила</Drawer.Title>
			{#key wizardSession}
				<SellCarWizard
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
		</Drawer.Content>
	</Drawer.Root>
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

	.sell-guide {
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.sell-guide__steps {
		display: grid;
		gap: var(--bc-space-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.sell-guide__steps li {
		display: grid;
		grid-template-columns: max-content minmax(0, 1fr);
		align-items: center;
		gap: var(--bc-space-1);
	}
	.sell-guide__number {
		color: var(--bc-accent);
		font-size: var(--bc-mobile-card-title);
		line-height: var(--bc-mobile-card-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.sell-guide h3 {
		margin: 0;
		font-size: var(--bc-mobile-card-title);
		line-height: var(--bc-mobile-card-title-leading);
		font-weight: var(--bc-weight-heading);
		color: var(--bc-ink);
	}
	.sell-guide__steps p {
		grid-column: 1 / -1;
		margin: 0;
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		color: var(--bc-copy);
		font-weight: var(--bc-weight-body);
	}
	.sell-mode-tabs {
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

	.sell-mode-tabs button {
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

	.sell-mode-tabs button.active {
		background: transparent;
		box-shadow: none;
		color: var(--bc-white);
		font-weight: var(--bc-weight-heading);
	}

	.sell-mode-tabs button.active::after {
		position: absolute;
		inset: auto 0 -1px;
		height: 2px;
		background: var(--bc-white);
		content: '';
	}

	.sell-mode-tabs button:focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.72);
		outline-offset: -3px;
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
		color: var(--bc-accent);
		font-size: var(--bc-mobile-meta);
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: var(--bc-mobile-meta-leading);
		text-transform: uppercase;
	}

	:global(.daynight-sell-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: transparent;
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
		width: 100%;
		height: 100dvh;
		max-height: none;
		overflow: hidden;
		overscroll-behavior: contain;
		border-radius: 0;
		background: var(--bc-bg-strong);
		box-shadow: none;
		outline: 0;
		padding: 0;
		scrollbar-width: none;
	}

	:global(.daynight-sell-wizard-drawer__sheet .sell-flow) {
		height: 100%;
		min-height: 0;
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
		position: absolute;
		top: 7px;
		left: 50%;
		z-index: 5;
		display: block !important;
		width: 40px;
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.34);
		transform: translateX(-50%);
		opacity: 1;
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
		gap: var(--bc-space-3);
		max-height: min(calc(88dvh - var(--bc-kb-inset, 0px)), 720px);
		overflow-y: auto;
		border: 0;
		border-top: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-bg-strong);
		box-shadow: var(--bc-shadow-panel);
		padding: var(--bc-space-2) var(--bc-mobile-gutter)
			calc(var(--bc-space-4) + env(safe-area-inset-bottom));
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
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border);
	}

	.daynight-sell-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}

	.daynight-sell-mobile-sheet__header div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.daynight-sell-mobile-sheet__header p {
		color: var(--bc-muted);
	}

	.daynight-sell-mobile-sheet__header h2 {
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		font-weight: 700;
		letter-spacing: 0;
		line-height: var(--bc-mobile-section-title-leading);
	}

	.daynight-sell-mobile-sheet__header button {
		display: flex;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		flex: 0 0 var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		cursor: pointer;
		padding: 0;
	}

	.daynight-sell-mobile__map-preview {
		position: relative;
		height: 132px;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(135deg, rgba(216, 221, 227, 0.72), rgba(248, 250, 252, 0.92)),
			var(--bc-bg-strong);
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
		border-radius: var(--bc-radius-pill);
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
		border: 4px solid var(--bc-white);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		color: var(--bc-white);
		color: var(--bc-ink);
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
		font-weight: 700;
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
		letter-spacing: 0;
	}

	.daynight-sell-mobile__location-copy span {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: 700;
		line-height: var(--bc-mobile-meta-leading);
		text-transform: uppercase;
	}

	.daynight-sell-mobile__location-copy strong {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: 700;
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-sell-mobile__location-copy p {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		font-weight: 500;
		line-height: var(--bc-mobile-label-leading);
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
		font-weight: 700;
		line-height: var(--bc-mobile-label-leading);
	}

	.daynight-sell-mobile-sheet__actions a:first-child {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
</style>
