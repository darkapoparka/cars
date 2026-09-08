<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		CarFront,
		MapPin,
		MessageCircle,
		Navigation,
		PhoneCall,
		X
	} from '@lucide/svelte';
	import type {
		AuxeroSellCarFormData,
		AuxeroSellCarMobileCopy,
		AuxeroSellCarMobileStep
	} from '$lib/auxero/sell-your-car';
	import { eliqautoContact } from '$lib/data/eliqauto';
	import { Drawer } from 'vaul-svelte';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
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
	let initialValues = $derived.by(
		() =>
			Object.fromEntries(form.fields.map((field) => [field.name, field.value ?? ''])) as Record<
				string,
				string
			>
	);
	// svelte-ignore state_referenced_locally
	let quickIdentifier = $state(initialValues.vin ?? '');
	// svelte-ignore state_referenced_locally
	let wizardIdentifier = $state(initialValues.vin ?? '');
	let wizardInstance = $state(0);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		eliqautoContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});

	const openWizard = (identifier = quickIdentifier) => {
		wizardIdentifier = identifier.trim();
		wizardInstance += 1;
		wizardOpen = true;
	};

	const handleQuickStart = (event: SubmitEvent) => {
		event.preventDefault();
		openWizard();
	};
</script>

<div class="eliqauto-sell-mobile">
	<input
		id="sell-mobile-location-toggle"
		class="eliqauto-sell-mobile__sheet-toggle"
		type="checkbox"
		autocomplete="off"
		tabindex="-1"
		aria-hidden="true"
	/>

	<MobileAppbar actionsLabel={copy.contactLabel} logoAlt={copy.logoAlt}>
		<label
			for="sell-mobile-location-toggle"
			aria-label={eliqautoContact.addressLabel}
			aria-controls="sell-mobile-location-sheet"
			aria-haspopup="dialog"
		>
			<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
		</label>
		<a
			{...hrefAttributes(eliqautoContact.primaryPhoneHref)}
			aria-label={eliqautoContact.primaryPhoneLabel}
		>
			<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
		<a {...hrefAttributes(eliqautoContact.viberHref)} aria-label={copy.messageLabel}>
			<MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
	</MobileAppbar>

	<main class="eliqauto-sell-mobile__main">
		<section class="eliqauto-sell-mobile__hero" aria-labelledby="sell-mobile-title">
			<img
				class="eliqauto-sell-mobile__hero-image"
				src="/assets/eliqauto/cta/sell-car-banner-v2.webp"
				alt=""
				width="1600"
				height="1067"
				aria-hidden="true"
			/>

			<header class="eliqauto-sell-mobile__hero-copy">
				<h1 id="sell-mobile-title">Продай автомобил</h1>
				<p>Започни с VIN или регистрационен номер — отнема под минута.</p>
			</header>

			<form
				class="eliqauto-sell-mobile__identifier"
				aria-label="Начало на заявката за продажба"
				onsubmit={handleQuickStart}
			>
				<label for="sell-mobile-identifier">
					<span class="eliqauto-sell-mobile__sr-only">VIN или регистрационен номер</span>
					<CarFront size={19} strokeWidth={2.2} aria-hidden="true" />
					<input
						id="sell-mobile-identifier"
						type="text"
						name="vehicle-identifier"
						placeholder="CA 1234 AB или WBA..."
						autocomplete="off"
						minlength="5"
						required
						bind:value={quickIdentifier}
					/>
				</label>
				<button type="submit" aria-label="Продължи към заявката">
					<ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
				</button>
			</form>

			<div class="eliqauto-sell-mobile__entry-meta">
				<span>Номерът се използва само за заявката.</span>
				<button type="button" onclick={() => openWizard('')}>Нямам VIN или номер</button>
			</div>
		</section>

		<section
			class="eliqauto-sell-mobile__continuation"
			aria-labelledby="sell-mobile-response-title"
		>
			<div class="eliqauto-sell-mobile__value-card">
				<button
					type="button"
					aria-labelledby="sell-mobile-response-title"
					aria-describedby="sell-mobile-response-detail"
					onclick={() => openWizard('')}
				></button>
				<div>
					<h2 id="sell-mobile-response-title">Оценка до 24 часа</h2>
					<p>История, състояние и реална пазарна цена.</p>
					<span id="sell-mobile-response-detail" class="eliqauto-sell-mobile__sr-only">
						{steps[1]?.text ?? 'Преглеждаме автомобила и подготвяме ясна оценка.'}
					</span>
					<span class="eliqauto-sell-mobile__value-action">
						Започни заявка
						<ArrowRight size={17} strokeWidth={2.35} aria-hidden="true" />
					</span>
				</div>
				<img
					src="/assets/eliqauto/hero/home-hero-runway-car-black-v1.webp"
					alt=""
					width="1536"
					height="1024"
					loading="lazy"
					decoding="async"
				/>
			</div>

			<nav class="eliqauto-sell-mobile__contact-actions" aria-label="Бърз контакт">
				<a {...hrefAttributes(eliqautoContact.primaryPhoneHref)}>
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					Обади се
				</a>
				<a {...hrefAttributes(eliqautoContact.viberHref)}>
					<MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
					Пиши ни
				</a>
			</nav>
		</section>
	</main>

	<div
		id="sell-mobile-location-sheet"
		class="eliqauto-sell-mobile-sheet eliqauto-sell-mobile-sheet--location"
		role="dialog"
		aria-modal="true"
		aria-labelledby="sell-mobile-location-title"
	>
		<label
			for="sell-mobile-location-toggle"
			class="eliqauto-sell-mobile-sheet__backdrop"
			aria-label="Затвори локацията"
		></label>
		<div class="eliqauto-sell-mobile-sheet__panel">
			<span class="eliqauto-sell-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="eliqauto-sell-mobile-sheet__header">
				<div>
					<p>Eliqauto шоурум</p>
					<h2 id="sell-mobile-location-title">{eliqautoContact.addressLabel}</h2>
				</div>
				<label for="sell-mobile-location-toggle" aria-label="Затвори">
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</label>
			</header>
			<div class="eliqauto-sell-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.4} /></span>
				<span class="badge">Eliqauto</span>
			</div>
			<div class="eliqauto-sell-mobile__location-copy">
				<span>{eliqautoContact.appointmentNote}</span>
				<strong>{eliqautoContact.addressLabel}</strong>
				<p>Огледите са с уговорка. Обади се преди посещение, за да подготвим човека и времето.</p>
			</div>
			<div class="eliqauto-sell-mobile-sheet__actions">
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
					Отвори карта
				</a>
				<a {...hrefAttributes(eliqautoContact.primaryPhoneHref)}>
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					Обади се
				</a>
			</div>
		</div>
	</div>

	<Drawer.Root bind:open={wizardOpen} direction="bottom" fixed={true}>
		<Drawer.Overlay class="eliqauto-sell-wizard-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="eliqauto-sell-wizard-drawer__sheet">
			<Drawer.Handle class="eliqauto-sell-wizard-drawer__handle" />
			<Drawer.Title class="eliqauto-sell-wizard-drawer__title">Продай автомобил</Drawer.Title>
			{#key wizardInstance}
				<SellCarWizard
					detailed={true}
					initial={{
						mileage: initialValues.mileage,
						phone: initialValues.phone,
						price: initialValues.price,
						vin: wizardIdentifier
					}}
					onclose={() => (wizardOpen = false)}
				/>
			{/key}
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	.eliqauto-sell-mobile {
		position: relative;
		min-height: 100vh;
		background: #ffffff;
		color: #111111;
	}

	.eliqauto-sell-mobile__sheet-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.eliqauto-sell-mobile__main {
		position: relative;
		display: grid;
		overflow: hidden;
		background: #ffffff;
		padding-bottom: calc(84px + env(safe-area-inset-bottom));
	}

	.eliqauto-sell-mobile__hero {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 14px;
		min-height: 338px;
		overflow: hidden;
		background: #090a0c;
		color: #ffffff;
		padding: calc(88px + env(safe-area-inset-top)) 16px 34px;
	}

	.eliqauto-sell-mobile__hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgba(6, 7, 9, 0.7) 0%, rgba(6, 7, 9, 0.92) 70%),
			linear-gradient(90deg, rgba(181, 18, 27, 0.18), transparent 56%);
		content: '';
	}

	.eliqauto-sell-mobile__hero-image {
		position: absolute;
		inset: 0;
		z-index: -2;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 54% center;
	}

	.eliqauto-sell-mobile__hero-copy {
		display: grid;
		gap: 6px;
		max-width: 340px;
		min-width: 0;
	}

	.eliqauto-sell-mobile__hero-copy h1,
	.eliqauto-sell-mobile__hero-copy p {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-sell-mobile__hero-copy h1 {
		color: #ffffff;
		font-size: 28px;
		font-weight: 750;
		line-height: 32px;
	}

	.eliqauto-sell-mobile__hero-copy p {
		max-width: 320px;
		color: rgba(255, 255, 255, 0.84);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}

	.eliqauto-sell-mobile__identifier {
		display: flex;
		width: 100%;
		min-height: 58px;
		align-items: center;
		box-sizing: border-box;
		gap: 8px;
		margin: 0;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
		padding: 5px 5px 5px 15px;
	}

	.eliqauto-sell-mobile__identifier:focus-within {
		box-shadow:
			0 0 0 2px var(--bc-accent),
			0 12px 30px rgba(0, 0, 0, 0.28);
	}

	.eliqauto-sell-mobile__identifier label {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		flex: 1 1 auto;
		align-items: center;
		gap: 8px;
		min-width: 0;
		min-height: 48px;
		color: #626d7c;
	}

	.eliqauto-sell-mobile__identifier input {
		width: 100%;
		min-width: 0;
		height: 48px;
		border: 0;
		background: transparent;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
		outline: 0;
		padding: 0;
		text-transform: uppercase;
	}

	.eliqauto-sell-mobile__identifier input::placeholder {
		color: #626d7c;
		font-weight: 600;
		opacity: 1;
		text-transform: none;
	}

	.eliqauto-sell-mobile__identifier button {
		display: flex;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-sell-mobile__identifier button :global(svg),
	.eliqauto-sell-mobile__identifier button :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-sell-mobile__identifier button:focus-visible,
	.eliqauto-sell-mobile__entry-meta button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}

	.eliqauto-sell-mobile__entry-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.eliqauto-sell-mobile__entry-meta span {
		color: rgba(255, 255, 255, 0.66);
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 15px;
	}

	.eliqauto-sell-mobile__entry-meta button {
		flex: 0 0 auto;
		border: 0;
		background: transparent;
		color: #ffffff;
		cursor: pointer;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 16px;
		min-height: 44px;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.eliqauto-sell-mobile__sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.eliqauto-sell-mobile__continuation {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 12px;
		margin-top: -18px;
		border-radius: 20px 20px 0 0;
		background: #ffffff;
		padding: 26px 16px 22px;
	}

	.eliqauto-sell-mobile__value-card {
		position: relative;
		isolation: isolate;
		min-height: 184px;
		overflow: hidden;
		border-radius: 16px;
		background: #f4f5f7;
		padding: 20px 22px;
	}

	.eliqauto-sell-mobile__value-card > button {
		position: absolute;
		inset: 0;
		z-index: 4;
		border: 0;
		border-radius: inherit;
		background: transparent;
		cursor: pointer;
		padding: 0;
		touch-action: manipulation;
	}

	.eliqauto-sell-mobile__value-card > button:focus-visible {
		outline: 3px solid rgba(181, 18, 27, 0.28);
		outline-offset: -3px;
	}

	.eliqauto-sell-mobile__value-card > div {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 8px;
		width: 100%;
	}

	.eliqauto-sell-mobile__value-card h2,
	.eliqauto-sell-mobile__value-card p {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-sell-mobile__value-card h2 {
		color: #111111;
		font-size: 22px;
		font-weight: 750;
		line-height: 26px;
		white-space: nowrap;
	}

	.eliqauto-sell-mobile__value-card p {
		width: 56%;
		color: #626d7c;
		font-size: 14px;
		font-weight: 550;
		line-height: 19px;
	}

	.eliqauto-sell-mobile__value-action {
		display: flex;
		align-items: center;
		justify-content: center;
		width: max-content;
		min-height: 32px;
		gap: 6px;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		padding: 6px 11px;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-sell-mobile__value-action :global(svg),
	.eliqauto-sell-mobile__value-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-sell-mobile__value-card img {
		position: absolute;
		right: -192px;
		bottom: -2px;
		z-index: 1;
		display: block;
		width: 328px;
		height: auto;
		max-width: none;
		filter: drop-shadow(0 16px 20px rgba(0, 0, 0, 0.18));
	}

	.eliqauto-sell-mobile__contact-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.eliqauto-sell-mobile__contact-actions a {
		display: flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 12px;
		background: #111111;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		text-decoration: none;
	}

	.eliqauto-sell-mobile__contact-actions a:last-child {
		border: 1px solid var(--bc-border);
		background: #ffffff;
		color: #111111;
	}

	.eliqauto-sell-mobile__contact-actions a:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	:global(.eliqauto-sell-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.38);
		cursor: pointer;
		padding: 0;
	}

	:global(.eliqauto-sell-wizard-drawer__backdrop span),
	:global(.eliqauto-sell-wizard-drawer__title) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.eliqauto-sell-wizard-drawer__sheet) {
		position: fixed;
		right: 0;
		/* vaul repositions the sheet itself when the mobile keyboard opens. */
		bottom: 0;
		left: 0;
		z-index: 1201;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		gap: 6px;
		height: min(92dvh, 760px);
		overflow: hidden;
		border-radius: 20px 20px 0 0;
		background: #ffffff;
		outline: 0;
		padding: 10px 14px max(16px, env(safe-area-inset-bottom));
	}

	:global(.eliqauto-sell-wizard-drawer__sheet .bc-sell-wizard) {
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	:global(.eliqauto-sell-wizard-drawer__sheet .bc-sell-wizard)::-webkit-scrollbar {
		display: none;
	}

	:global(.eliqauto-sell-wizard-drawer__handle) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.eliqauto-sell-wizard-drawer__handle)::after {
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

	.eliqauto-sell-mobile-sheet {
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

	.eliqauto-sell-mobile-sheet__backdrop {
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
		.eliqauto-sell-mobile-sheet__backdrop {
		opacity: 1;
	}

	.eliqauto-sell-mobile-sheet__panel {
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
		.eliqauto-sell-mobile-sheet__panel {
		transform: translateY(0);
	}

	.eliqauto-sell-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.eliqauto-sell-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.eliqauto-sell-mobile-sheet__header div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.eliqauto-sell-mobile-sheet__header p {
		color: #626d7c;
	}

	.eliqauto-sell-mobile-sheet__header h2 {
		margin: 0;
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 27px;
	}

	.eliqauto-sell-mobile-sheet__header label {
		display: flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-sell-mobile__map-preview {
		position: relative;
		height: 132px;
		overflow: hidden;
		border-radius: 16px;
		background: linear-gradient(135deg, rgba(165, 23, 23, 0.1), rgba(255, 255, 255, 0.78)), #ffffff;
	}

	.eliqauto-sell-mobile__map-preview::before,
	.eliqauto-sell-mobile__map-preview::after {
		position: absolute;
		inset: 18px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.eliqauto-sell-mobile__map-preview::after {
		inset: 42px -22px auto 44px;
		height: 48px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-7deg);
	}

	.eliqauto-sell-mobile__map-preview .road {
		position: absolute;
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.1);
	}

	.eliqauto-sell-mobile__map-preview .road-a {
		top: 29px;
		left: -20px;
		width: 72%;
		height: 8px;
		transform: rotate(12deg);
	}

	.eliqauto-sell-mobile__map-preview .road-b {
		right: 18px;
		bottom: 31px;
		width: 52%;
		height: 8px;
		transform: rotate(-19deg);
	}

	.eliqauto-sell-mobile__map-preview .road-c {
		top: 15px;
		left: 47%;
		width: 8px;
		height: 116px;
		transform: rotate(21deg);
	}

	.eliqauto-sell-mobile__map-preview .pin {
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

	.eliqauto-sell-mobile__map-preview .badge {
		position: absolute;
		right: 15px;
		bottom: 14px;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 16px;
		padding: 7px 10px;
	}

	.eliqauto-sell-mobile__location-copy {
		display: grid;
		gap: 4px;
		border-radius: 8px;
		background: #ffffff;
		padding: 13px 14px;
	}

	.eliqauto-sell-mobile__location-copy span,
	.eliqauto-sell-mobile__location-copy strong,
	.eliqauto-sell-mobile__location-copy p {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-sell-mobile__location-copy span {
		color: #626d7c;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-sell-mobile__location-copy strong {
		color: #111111;
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	.eliqauto-sell-mobile__location-copy p {
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	.eliqauto-sell-mobile-sheet__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.eliqauto-sell-mobile-sheet__actions a {
		display: flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 8px;
		background: #ffffff;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-sell-mobile-sheet__actions a:first-child {
		background: var(--bc-accent-bright-soft);
	}

	@media (max-width: 359px) {
		.eliqauto-sell-mobile__hero-copy h1 {
			font-size: 25px;
			line-height: 29px;
		}

		.eliqauto-sell-mobile__hero {
			padding-inline: 13px;
		}

		.eliqauto-sell-mobile__continuation {
			padding-inline: 13px;
		}
	}
</style>
