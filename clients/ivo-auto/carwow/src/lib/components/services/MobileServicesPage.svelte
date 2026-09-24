<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import '$lib/styles/mobile-filter-pill.css';
	import {
		BadgeCheck,
		Banknote,
		Search,
		ArrowRight,
		ChevronRight,
		ClipboardCheck,
		Repeat,
		ShieldCheck,
		X
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileDrawer from '$lib/components/shared/mobile/MobileDrawer.svelte';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	type ServiceSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const services = [
		{
			id: 'inspection',
			image: '/assets/images/services/service-card-inspection-daynight-v2.webp',
			label: i18n.t('copy.fc2859b8e05d'),
			title: i18n.t('copy.5614ec1dae85'),
			kicker: i18n.t('copy.af6caa8fdb12'),
			cta: i18n.t('copy.6f6938ed9245'),
			href: '/contact',
			icon: ShieldCheck,
			points: ['Проверка на историята', 'Оглед на място', 'Следващи стъпки преди капаро']
		},
		{
			id: 'documents',
			image: '/assets/images/services/service-card-documents-daynight-v2.webp',
			label: i18n.t('copy.b7ce7bc1a709'),
			title: i18n.t('copy.d57ca774a015'),
			kicker: i18n.t('copy.761559355d8b'),
			cta: i18n.t('copy.d4fa552cc769'),
			href: '/contact',
			icon: ClipboardCheck,
			points: ['Договор и фактура', 'Прехвърляне и номера', 'Финални стъпки при предаване']
		},
		{
			id: 'trade',
			image: '/assets/images/services/service-card-trade-in-daynight-v2.webp',
			label: i18n.t('copy.48b06561777d'),
			title: i18n.t('copy.99a18e4bc162'),
			kicker: i18n.t('copy.93bf202d3c3c'),
			cta: i18n.t('copy.d915896778d0'),
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
			image: '/assets/images/services/service-card-financing-daynight-v2.webp',
			label: i18n.t('copy.6e55eeb12cce'),
			title: i18n.t('copy.6e55eeb12cce'),
			kicker: i18n.t('copy.69dd492f65ec'),
			cta: i18n.t('copy.ffd3375d7165'),
			href: '/financing',
			icon: Banknote,
			points: ['Ориентировъчна месечна вноска', 'Съдействие с лизинг', 'Сравнение спрямо бюджет']
		}
	] as const;

	type ServiceId = (typeof services)[number]['id'];

	const quickActions = services.map(({ id, label }) => ({ id, label }));
	const query = $derived(page.url.searchParams.get('q')?.trim() ?? '');
	const category = $derived(page.url.searchParams.get('category') ?? '');
	const visibleServices = $derived(
		services.filter((service) => {
			const text = [service.title, service.label, service.kicker, ...service.points]
				.join(' ')
				.toLocaleLowerCase('bg-BG');
			return (
				(!category || category === service.id) &&
				query
					.toLocaleLowerCase('bg-BG')
					.split(/\s+/)
					.filter(Boolean)
					.every((term) => text.includes(term))
			);
		})
	);
	function categoryHref(next: string): '/services' | `/services?${string}` {
		const params = new SvelteURLSearchParams();
		if (query) params.set('q', query);
		if (next) params.set('category', next);
		return params.size ? `/services?${params.toString()}` : '/services';
	}

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
				i18n.t('pattern.19603562a56a', { v0: activeService.title }),
				serviceVehicle.trim() ? i18n.t('pattern.b3d5d0ee75f3', { v0: serviceVehicle.trim() }) : ''
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
			result.error || i18n.t('pattern.092b5d19f038', { v0: daynightSite.phoneLabel });
	}
</script>

<div class="mobile-services-app">
	<h1 class="sr-only">{i18n.t('copy.d700ec2758ef')}</h1>
	<header class="mobile-services-top">
		<form
			action={resolve('/services')}
			method="get"
			role="search"
			aria-label={i18n.t('copy.4856f3f99f34')}
		>
			<label class="sr-only" for="mobile-services-search">{i18n.t('copy.4856f3f99f34')}</label>
			<div class="mobile-services-search">
				<input
					{@attach i18n.validation}
					id="mobile-services-search"
					name="q"
					type="search"
					value={query}
					placeholder={i18n.t('copy.cfe080b319da')}
					enterkeyhint="search"
				/>
				<button type="submit" aria-label={i18n.t('copy.6517beda9674')}
					><Search size={20} aria-hidden="true" /></button
				>
			</div>
			{#if category}<input type="hidden" name="category" value={category} />{/if}
		</form>
		<nav class="mobile-services-chips" aria-label={i18n.t('copy.58a9f990eb56')}>
			<a
				href={i18n.href(resolve(categoryHref('')))}
				class="mobile-filter-pill"
				class:active={!category}
				aria-current={!category ? 'true' : undefined}>{i18n.t('copy.117d98cb652c')}</a
			>
			{#each quickActions as action (action.id)}
				<a
					href={i18n.href(resolve(categoryHref(action.id)))}
					class="mobile-filter-pill"
					class:active={category === action.id}
					aria-current={category === action.id ? 'true' : undefined}>{i18n.text(action.label)}</a
				>
			{/each}
		</nav>
	</header>

	<main id="main-content" tabindex="-1">
		<div class="mobile-services-status">
			<span role="status"
				>{visibleServices.length}
				{visibleServices.length === 1
					? i18n.t('copy.3e823bba937c')
					: i18n.t('copy.3a39ce4ddb25')}</span
			>
			{#if query || category}<a href={i18n.href(resolve('/services'))}
					><X size={14} aria-hidden="true" />{i18n.t('copy.fc38aced5a1d')}</a
				>{/if}
		</div>
		<section aria-label={i18n.t('copy.d6f31e4be09f')}>
			<div class="mobile-services-list">
				{#each visibleServices as service (service.id)}
					<button
						class="mobile-services-card"
						type="button"
						onclick={() => openServiceDrawer(service.id)}
						aria-haspopup="dialog"
						aria-label={service.title}
					>
						<img src={i18n.asset(resolve(service.image))} alt="" decoding="async" />
						<span class="mobile-services-card__copy">
							<strong>{i18n.text(service.title)}</strong>
							<small>{i18n.text(service.kicker)}</small>
							<span class="mobile-services-card__action"
								>{i18n.text(service.cta)}<ArrowRight size={17} aria-hidden="true" /></span
							>
						</span>
					</button>
				{:else}
					<div class="mobile-services-empty">
						<h2>{i18n.t('copy.cfc52b87b24d')}</h2>
						<p>{i18n.t('copy.944ad9ecd0b4')}</p>
						<a href={i18n.href(resolve('/services'))}
							>{i18n.t('copy.2faf9bdd1af7')}<ArrowRight size={18} aria-hidden="true" /></a
						>
					</div>
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
						<span>{i18n.text(activeService.kicker)}</span>
						<h2 id="mobile-service-drawer-title">{i18n.text(activeService.title)}</h2>
					</div>
					<button
						type="button"
						aria-label={i18n.t('copy.1ef1a425356f')}
						onclick={() => (serviceDrawerOpen = false)}
					>
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
							<strong>{i18n.t('copy.467884700d51')}</strong>
							<small>{i18n.t('copy.52b8feeeb000')}</small>
						</span>
					</div>
				{:else}
					<form class="mobile-service-sheet__form" onsubmit={handleServiceRequest}>
						<label
							class="mobile-service-sheet__field"
							for={`mobile-service-vehicle-${activeService.id}`}
						>
							<span>{i18n.t('copy.e549eadf1b38')}</span>
							<input
								{@attach i18n.validation}
								id={`mobile-service-vehicle-${activeService.id}`}
								type="text"
								bind:value={serviceVehicle}
								placeholder={i18n.t('copy.7558220498f7')}
								autocomplete="off"
							/>
						</label>
						<label
							class="mobile-service-sheet__field"
							for={`mobile-service-phone-${activeService.id}`}
						>
							<span>{i18n.t('copy.822f9fd9ba2d')}</span>
							<input
								{@attach i18n.validation}
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
								{i18n.text(serviceSubmitMessage)}
							</p>
						{/if}
						<button
							class="mobile-service-sheet__submit"
							type="submit"
							disabled={serviceSubmitState === 'submitting'}
						>
							<span
								>{serviceSubmitState === 'submitting'
									? i18n.t('copy.acfcd771108c')
									: activeService.cta}</span
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

	.mobile-services-top {
		position: sticky;
		top: 0;
		z-index: 5;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
		padding: calc(8px + env(safe-area-inset-top)) var(--sa-mobile-gutter) 8px;
		background: #fff;
	}
	.mobile-services-search {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 52px;
		padding: 4px 4px 4px 17px;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-pill);
		background: #eef1f6;
	}
	.mobile-services-search input {
		min-width: 0;
		flex: 1;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-base)/1.2 var(--sa-font);
		padding: 0;
	}
	.mobile-services-search input::placeholder {
		color: #56616e;
		opacity: 1;
	}
	.mobile-services-search button {
		display: grid;
		place-items: center;
		flex: 0 0 44px;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--sa-ink);
		color: #fff;
		padding: 0;
		cursor: pointer;
	}
	.mobile-services-search button :global(svg) {
		color: #fff;
		stroke: #fff;
	}
	.mobile-services-search:focus-within {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	.mobile-services-chips {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		scrollbar-width: none;
		margin: 0 calc(-1 * var(--sa-mobile-gutter));
		padding: 2px var(--sa-mobile-gutter);
	}
	.mobile-services-chips::-webkit-scrollbar {
		display: none;
	}
	.mobile-services-chips a.active {
		background: #fce8ed;
		color: var(--sa-red);
	}
	.mobile-services-app main {
		padding: 0 var(--sa-mobile-gutter) calc(88px + env(safe-area-inset-bottom));
	}
	.mobile-services-status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 34px;
		color: #56616e;
		font-size: var(--sa-text-caption);
	}
	.mobile-services-status a {
		display: inline-flex;
		align-items: center;
		min-height: 34px;
		gap: 4px;
		color: var(--sa-red);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-services-list {
		display: grid;
		gap: 10px;
	}
	.mobile-services-card {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr);
		width: 100%;
		min-height: 108px;
		overflow: hidden;
		padding: 0;
		border: 0;
		border-radius: 14px;
		background: #eef1f6;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		text-align: left;
		cursor: pointer;
	}
	.mobile-services-card > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.mobile-services-card__copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
		min-width: 0;
		padding: 10px 12px;
	}
	.mobile-services-card strong {
		font-size: var(--sa-text-base);
		line-height: 1.25;
		font-weight: var(--sa-weight-heading);
	}
	.mobile-services-card small {
		font-size: var(--sa-text-caption);
		line-height: 1.35;
		color: #56616e;
	}
	.mobile-services-card__action {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		margin-top: 4px;
		padding-top: 0;
		color: var(--sa-red);
		font-size: var(--sa-button-font-size);
		line-height: 1.3;
		font-weight: var(--sa-button-font-weight);
	}
	.mobile-services-card__action :global(svg) {
		flex-shrink: 0;
	}
	.mobile-services-empty {
		padding: 36px 12px;
		text-align: center;
	}
	.mobile-services-empty h2 {
		font-size: var(--sa-text-xl);
		margin: 0 0 8px;
	}
	.mobile-services-empty p {
		font-size: var(--sa-type-body);
		margin: 0 0 16px;
		color: #56616e;
	}
	.mobile-services-empty a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 0 16px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-red);
		color: #fff;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-services-app a:focus-visible,
	.mobile-services-app button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: -2px;
	}
	.mobile-service-sheet h2 {
		margin: 0;
		color: var(--sa-ink);
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
		font-weight: var(--sa-weight-strong);
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
		font-weight: var(--sa-weight-strong);
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
		font-weight: var(--sa-weight-strong);
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
		font: var(--sa-weight-strong) var(--sa-text-base) / 1.18 var(--sa-font) !important;
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
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
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
		font-weight: var(--sa-weight-strong);
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
		font-weight: var(--sa-weight-heading);
		line-height: 1.12;
	}

	.mobile-service-sheet__success small {
		color: #647084;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-strong);
		line-height: 1.28;
	}

	@media (max-width: 991px) {
		.mobile-services-app {
			display: block;
		}
	}

	/* Mobile typography contract */
	.mobile-service-sheet header div:nth-child(2) > span,
	.mobile-service-sheet__field span {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-service-sheet h2 {
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}
	.mobile-service-sheet li {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-mobile-leading-meta);
	}
	.mobile-service-sheet__field input {
		font: var(--sa-weight-regular) var(--sa-mobile-type-input) / var(--sa-mobile-leading-meta)
			var(--sa-font) !important;
	}
	.mobile-service-sheet__submit {
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
	}
	.mobile-service-sheet__error {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-mobile-leading-meta);
	}
	.mobile-service-sheet__success strong {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-heading);
	}
	.mobile-service-sheet__success small {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}
</style>
