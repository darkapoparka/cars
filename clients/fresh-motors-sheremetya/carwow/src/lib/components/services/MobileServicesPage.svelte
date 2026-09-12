<script lang="ts">
	import {
		BadgeCheck,
		Banknote,
		CarFront,
		ChevronRight,
		ClipboardCheck,
		Phone,
		Repeat,
		ShieldCheck,
		X
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileDrawer from '$lib/components/shared/mobile/MobileDrawer.svelte';

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	type ServiceSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const services = [
		{
			id: 'inspection',
			label: 'Оглед',
			title: 'Проверка преди покупка',
			kicker: 'Оглед и история',
			cta: 'Заяви оглед',
			href: '/contact',
			icon: ShieldCheck,
			points: ['Проверка на историята', 'Оглед на място', 'Следващи стъпки преди капаро']
		},
		{
			id: 'documents',
			label: 'Документи',
			title: 'Регистрация и документи',
			kicker: 'Договор и прехвърляне',
			cta: 'Попитай за документи',
			href: '/contact',
			icon: ClipboardCheck,
			points: ['Договор и фактура', 'Прехвърляне и номера', 'Финални стъпки при предаване']
		},
		{
			id: 'trade',
			label: 'Бартер',
			title: 'Бартер или изкупуване',
			kicker: 'Оценка на автомобил',
			cta: 'Заяви оценка',
			href: '/sell-your-car',
			icon: Repeat,
			points: [
				'Оценка на Вашия автомобил',
				'Приспадане към следваща покупка',
				'Опция за директно изкупуване'
			]
		},
		{
			id: 'finance',
			label: 'Финансиране',
			title: 'Финансиране',
			kicker: 'Лизинг и бюджет',
			cta: 'Виж варианти',
			href: '/financing',
			icon: Banknote,
			points: ['Ориентировъчна месечна вноска', 'Съдействие с лизинг', 'Сравнение спрямо бюджет']
		}
	] as const;

	type ServiceId = (typeof services)[number]['id'];

	const quickActions = services.map(({ id, label }) => ({ id, label }));

	let activeServiceId = $state<ServiceId | null>(null);
	let serviceDrawerOpen = $state(false);
	let serviceVehicle = $state('');
	let servicePhone = $state('');
	let drawerSubmitted = $state(false);
	let serviceSubmitState = $state<ServiceSubmitState>('idle');
	let serviceSubmitMessage = $state('');
	// Keeps rendering the last service while the sheet animates closed.
	const activeService = $derived(
		activeServiceId ? services.find((service) => service.id === activeServiceId) : null
	);

	function openServiceDrawer(id: ServiceId) {
		serviceVehicle = '';
		servicePhone = '';
		drawerSubmitted = false;
		serviceSubmitState = 'idle';
		serviceSubmitMessage = '';
		activeServiceId = id;
		serviceDrawerOpen = true;
	}

	async function handleServiceRequest(event: SubmitEvent) {
		event.preventDefault();
		if (!activeService || serviceSubmitState === 'submitting') return;

		const contactValue = servicePhone.trim();
		if (!contactValue) {
			serviceSubmitState = 'error';
			serviceSubmitMessage = 'Моля, въведете телефон, за да уточним следващата стъпка.';
			return;
		}

		serviceSubmitState = 'submitting';
		serviceSubmitMessage = '';

		const result = await submitLead({
			customerName: 'Мобилна заявка за услуга',
			contact: contactValue,
			email: null,
			phone: contactValue,
			source: 'services-mobile',
			message: [
				`Услуга: ${activeService.title}`,
				serviceVehicle.trim() ? `Автомобил: ${serviceVehicle.trim()}` : ''
			]
				.filter(Boolean)
				.join('\n'),
			companyWebsite: null
		});

		if (result.ok) {
			serviceSubmitState = 'success';
			serviceSubmitMessage = '';
			drawerSubmitted = true;
			return;
		}

		serviceSubmitState = 'error';
		serviceSubmitMessage =
			result.error ||
			`Не успяхме да изпратим запитването. Моля, обадете се на ${daynightSite.phoneLabel}.`;
	}
</script>

<div class="mobile-services-app" aria-label="Услуги FRESH MOTORS">
	<header class="mobile-services-hero">
		<img
			class="mobile-services-hero__bg"
			src={resolve('/assets/images/services/support-hero-v1.webp')}
			alt=""
			aria-hidden="true"
		/>
		<div class="mobile-services-hero__bar">
			<a href={resolve('/')} aria-label="FRESH MOTORS начало">
				<img
					src={resolve('/dealer/brand/logo-light.png')}
					alt={daynightSite.shortName}
				/>
			</a>
			<a class="mobile-services-hero__phone" href={phoneHref} aria-label="Обади се">
				<Phone size={19} strokeWidth={2.45} />
			</a>
		</div>

		<div class="mobile-services-hero__copy">
			<span>Услуги</span>
			<h1>Подкрепа преди и след покупка</h1>
			<p>Оглед, документи, регистрация, финансиране и бартер от екипа в Шереметя.</p>
		</div>

		<div class="mobile-services-hero__actions">
			<button
				class="mobile-services-primary"
				type="button"
				onclick={() => openServiceDrawer('inspection')}
			>
				<span>Заяви услуга</span>
				<ChevronRight size={18} strokeWidth={2.55} />
			</button>
			<a class="mobile-services-secondary" href={resolve('/inventory')}>
				<CarFront size={18} strokeWidth={2.45} />
				<span>Виж автомобили</span>
			</a>
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<nav class="mobile-services-chips" aria-label="Бързи услуги">
			{#each quickActions as action (action.label)}
				<button
					type="button"
					onclick={() => openServiceDrawer(action.id)}
					aria-haspopup="dialog"
					aria-expanded={activeServiceId === action.id}
				>
					<span>{action.label}</span>
				</button>
			{/each}
		</nav>

		<section class="mobile-services-section" aria-labelledby="mobile-services-title">
			<div class="mobile-services-heading">
				<h2 id="mobile-services-title">Как помагаме</h2>
			</div>

			<div class="mobile-services-list">
				{#each services as service (service.title)}
					{@const Icon = service.icon}
					<button
						class="mobile-services-card"
						type="button"
						onclick={() => openServiceDrawer(service.id)}
						aria-haspopup="dialog"
					>
						<div>
							<Icon size={22} strokeWidth={2.45} />
						</div>
						<span>
							<strong>{service.title}</strong>
							<small>{service.kicker}</small>
						</span>
						<ChevronRight size={18} strokeWidth={2.55} />
					</button>
				{/each}
			</div>
		</section>
	</main>

	<MobileDrawer bind:open={serviceDrawerOpen} labelledBy="mobile-service-drawer-title">
		{#if activeService}
			{@const DrawerIcon = activeService.icon}
			<div class="mobile-service-sheet">
				<header>
					<div class="mobile-service-sheet__icon">
						<DrawerIcon size={22} strokeWidth={2.45} />
					</div>
					<div>
						<span>{activeService.kicker}</span>
						<h2 id="mobile-service-drawer-title">{activeService.title}</h2>
					</div>
					<button type="button" aria-label="Затвори" onclick={() => (serviceDrawerOpen = false)}>
						<X size={19} strokeWidth={2.5} />
					</button>
				</header>
				<ul>
					{#each activeService.points as point (point)}
						<li>
							<BadgeCheck size={18} strokeWidth={2.4} />
							<span>{point}</span>
						</li>
					{/each}
				</ul>
				{#if drawerSubmitted}
					<div class="mobile-service-sheet__success" role="status" aria-live="polite">
						<BadgeCheck size={22} strokeWidth={2.45} />
						<span>
							<strong>Заявката е подготвена</strong>
							<small>Екипът ще се свърже с Вас за следващата стъпка.</small>
						</span>
					</div>
				{:else}
					<form class="mobile-service-sheet__form" onsubmit={handleServiceRequest}>
						<label
							class="mobile-service-sheet__field"
							for={`mobile-service-vehicle-${activeService.id}`}
						>
							<span>Автомобил</span>
							<input
								id={`mobile-service-vehicle-${activeService.id}`}
								type="text"
								bind:value={serviceVehicle}
								placeholder="Марка, модел или линк към обява"
								autocomplete="off"
							/>
						</label>
						<label
							class="mobile-service-sheet__field"
							for={`mobile-service-phone-${activeService.id}`}
						>
							<span>Телефон</span>
							<input
								id={`mobile-service-phone-${activeService.id}`}
								type="tel"
								bind:value={servicePhone}
								placeholder={daynightSite.phoneLabel}
								autocomplete="tel"
								required
							/>
						</label>
						{#if serviceSubmitMessage}
							<p class="mobile-service-sheet__error" role="alert" aria-live="polite">
								{serviceSubmitMessage}
							</p>
						{/if}
						<button
							class="mobile-service-sheet__submit"
							type="submit"
							disabled={serviceSubmitState === 'submitting'}
						>
							<span>{serviceSubmitState === 'submitting' ? 'Изпращаме...' : activeService.cta}</span
							>
							<ChevronRight size={19} strokeWidth={2.6} />
						</button>
					</form>
				{/if}
			</div>
		{/if}
	</MobileDrawer>
</div>

<style>
	.mobile-services-app {
		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-services-app :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.mobile-services-app :where(button) {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		padding: 0;
	}

	.mobile-services-app :global(svg),
	.mobile-services-app :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-services-hero {
		position: relative;
		display: grid;
		gap: var(--sa-mobile-gap-md);
		overflow: hidden;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 15px;
		color: #fff;
		isolation: isolate;
	}

	.mobile-services-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(176, 0, 0, 0.88);
		content: '';
	}

	.mobile-services-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.42;
		object-fit: cover;
		object-position: center right;
	}

	.mobile-services-hero__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-services-hero__bar img {
		display: block;
		width: 170px;
		height: auto;
	}

	.mobile-services-hero__phone {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-red);
		color: #fff !important;
	}

	.mobile-services-hero__phone :global(svg),
	.mobile-services-hero__phone :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-services-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 320px;
	}

	.mobile-services-hero__copy span {
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-services-hero__copy span {
		color: rgba(255, 255, 255, 0.76);
	}

	.mobile-services-hero h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.07;
	}

	.mobile-services-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.87);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-services-hero__actions {
		display: grid;
		grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-services-primary,
	.mobile-services-secondary {
		display: inline-flex;
		min-width: 0;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		overflow: hidden;
		padding: 0 8px;
		white-space: nowrap;
	}

	.mobile-services-primary {
		background: var(--sa-red);
		color: #fff !important;
	}

	.mobile-services-secondary {
		border: 1px solid rgba(255, 255, 255, 0.34);
		background: rgba(255, 255, 255, 0.1);
		color: #fff !important;
	}

	.mobile-services-primary *,
	.mobile-services-secondary * {
		color: #fff !important;
	}

	.mobile-services-primary span,
	.mobile-services-secondary span,
	.mobile-services-primary :global(svg),
	.mobile-services-primary :global(svg *),
	.mobile-services-secondary :global(svg),
	.mobile-services-secondary :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-services-primary span,
	.mobile-services-secondary span {
		min-width: 0;
		overflow: hidden;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-services-app main {
		display: grid;
		gap: var(--sa-mobile-page-gap);
		padding: 12px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-services-chips {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-services-chips button {
		display: inline-flex;
		min-height: var(--sa-mobile-pill-h);
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 0 12px;
		color: #1f2937 !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		white-space: nowrap;
	}

	.mobile-services-chips button[aria-expanded='true'] {
		background: #e7efff;
		color: var(--sa-blue) !important;
	}

	.mobile-services-chips button:focus-visible,
	.mobile-services-card:focus-visible,
	.mobile-services-primary:focus-visible,
	.mobile-services-secondary:focus-visible,
	.mobile-service-sheet__submit:focus-visible,
	.mobile-service-sheet header button:focus-visible {
		outline: 2px solid rgba(176, 0, 0, 0.48);
		outline-offset: 2px;
	}

	.mobile-services-chips button span {
		color: inherit !important;
		line-height: 1.2;
	}

	.mobile-services-section,
	.mobile-services-list {
		display: grid;
		gap: var(--sa-mobile-section-gap);
	}

	.mobile-services-heading {
		display: grid;
		gap: 0;
	}

	.mobile-services-heading h2,
	.mobile-service-sheet h2 {
		margin: 0;
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.1;
	}

	.mobile-services-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 20px;
		min-height: 78px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 10px 12px;
		text-align: left;
		width: 100%;
	}

	.mobile-services-card > div {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue);
	}

	.mobile-services-card span {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.mobile-services-card strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-services-card small {
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 600;
		line-height: 1.34;
	}

	.mobile-services-card > :global(svg) {
		color: #6b7280;
		justify-self: end;
	}

	.mobile-service-sheet {
		display: grid;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-service-sheet header {
		display: grid;
		grid-template-columns: 46px minmax(0, 1fr) var(--sa-mobile-action-h);
		align-items: center;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-service-sheet__icon {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border-radius: 50%;
		background: var(--sa-blue-soft);
		color: var(--sa-blue);
	}

	.mobile-service-sheet header div:nth-child(2) {
		display: grid;
		min-width: 0;
		gap: 3px;
	}

	.mobile-service-sheet header div:nth-child(2) > span {
		color: var(--sa-blue);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-service-sheet header button {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border-radius: 50%;
		background: var(--sa-fill);
		color: #344054;
	}

	.mobile-service-sheet ul {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-service-sheet li {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr);
		align-items: center;
		gap: 8px;
		border-radius: 11px;
		background: var(--sa-fill);
		padding: 10px;
		color: #111827;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.25;
	}

	.mobile-service-sheet li :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-service-sheet__form {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-service-sheet__field {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		min-width: 0;
		min-height: var(--sa-mobile-form-field-h);
		border: 1px solid #dfe5ec;
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 8px 11px;
	}

	.mobile-service-sheet__field:focus-within {
		border-color: rgba(176, 0, 0, 0.52);
		box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.11);
	}

	.mobile-service-sheet__field span {
		color: #74808c;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-service-sheet__field input {
		width: 100%;
		min-width: 0;
		min-height: 24px;
		appearance: none;
		-webkit-appearance: none;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--sa-ink) !important;
		font: 700 var(--sa-text-base) / 1.18 var(--sa-font) !important;
		outline: 0 !important;
		padding: 0 !important;
	}

	.mobile-service-sheet__field input::placeholder {
		color: #9aa3ad;
	}

	.mobile-service-sheet__submit {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 11px;
		background: var(--sa-red);
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.mobile-service-sheet__submit:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.mobile-service-sheet__error {
		margin: 0;
		border-radius: 10px;
		background: #fff1f1;
		padding: 10px 11px;
		color: #b42318;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1.35;
	}

	.mobile-service-sheet__submit span,
	.mobile-service-sheet__submit :global(svg) {
		color: inherit !important;
		stroke: currentColor !important;
	}

	.mobile-service-sheet__success {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		border-radius: 11px;
		background: var(--sa-blue-soft);
		padding: 13px 12px;
		color: #111827;
	}

	.mobile-service-sheet__success :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-service-sheet__success span {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.mobile-service-sheet__success strong {
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.12;
	}

	.mobile-service-sheet__success small {
		color: #647084;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
	}

	@media (max-width: 991px) {
		.mobile-services-app {
			display: block;
		}
	}
</style>
