<script lang="ts">
	import { resolve } from '$app/paths';
	import RouteQuickNav from '$lib/components/common/RouteQuickNav.svelte';
	import { Search, X } from '@lucide/svelte';
	import type { AuxeroServiceFormData, AuxeroServicesContent } from '$lib/auxero/services';
	import CenteredRouteHero from '$lib/components/common/CenteredRouteHero.svelte';
	import ServiceCard from '$lib/components/common/ServiceCard.svelte';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		form,
		services
	}: {
		form: AuxeroServiceFormData;
		services: AuxeroServicesContent;
	} = $props();

	const externalHref = (href: string) => ({ href });
	let serviceQuery = $state('');
	const filteredServices = $derived.by(() => {
		const query = serviceQuery.trim().toLocaleLowerCase('bg');
		if (!query) return services.cards;

		return services.cards.filter((service) =>
			`${service.title} ${service.description}`.toLocaleLowerCase('bg').includes(query)
		);
	});
	const showSecondaryPhone = $derived(
		services.contact.secondaryPhoneHref !== services.contact.phoneHref ||
			services.contact.secondaryPhoneLabel !== services.contact.phoneLabel
	);

	const applyServiceQuery = (query: string) => {
		serviceQuery = query;
		document.getElementById('services-results')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	};
</script>

<div class="daynight-services-page" data-daynight-services>
	<CenteredRouteHero
		supportText="Търсиш конкретна услуга?"
		supportHref={services.contact.phoneHref}
		supportLabel="Обади ни се"
		image="/assets/daynight/banners/route-services-studio-v6.png"
		labelledby="services-page-title"
		title={services.hero.title}
		mobileDescription={services.hero.description}
		mobileTone="sun"
	>
		<form
			class="daynight-services-search"
			role="search"
			onsubmit={(event) => {
				event.preventDefault();
				document.getElementById('services-results')?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}}
		>
			<Search size={21} strokeWidth={2} aria-hidden="true" />
			<label class="sr-only" for="services-search">Търси услуга</label>
			<input
				id="services-search"
				type="search"
				value={serviceQuery}
				oninput={(event) => (serviceQuery = event.currentTarget.value)}
				placeholder="Търси услуга, VIN, документи..."
				autocomplete="off"
			/>
			{#if serviceQuery}
				<button
					class="daynight-services-search__clear"
					type="button"
					onclick={() => (serviceQuery = '')}
					aria-label="Изчисти търсенето"
				>
					<X size={19} strokeWidth={2.2} aria-hidden="true" />
				</button>
			{/if}
			<button class="route-hero-search-submit" type="submit"
				>Търси ({filteredServices.length})</button
			>
		</form>
	</CenteredRouteHero>

	<section id="services-results" class="daynight-services-page__cards background-light py-100">
		<div class="container">
			<RouteQuickNav
				label="Филтри за услуги"
				align="center"
				value={serviceQuery}
				onchange={applyServiceQuery}
				items={[
					{ label: 'Всички услуги', value: '' },
					{ label: 'VIN проверка', value: 'VIN' },
					{ label: 'Документи', value: 'документи' },
					{ label: 'Продажба', value: 'продажба' },
					{ label: 'Консултация →', value: 'contact', href: resolve('/contact') }
				]}
			/>
			{#if filteredServices.length}
				<div class="lg-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-30">
					{#each filteredServices as service, index (service.title)}
						<ServiceCard
							ctaLabel="Научи повече"
							delay={`0.${(index % 3) + 1}s`}
							description={service.description}
							href={service.href}
							image={service.image}
							title={service.title}
						/>
					{/each}
				</div>
			{:else}
				<div class="daynight-services-empty">
					<h2>Няма намерена услуга</h2>
					<p>Опитайте с „VIN“, „документи“, „продажба“ или „оглед“.</p>
					<button type="button" onclick={() => (serviceQuery = '')}>Покажи всички услуги</button>
				</div>
			{/if}
		</div>
	</section>

	<section class="daynight-services-contact relative py-100">
		<div class="overlay-parallax"></div>
		<div class="overlay image">
			<img
				class="lazyload parallax"
				data-src="/assets/daynight/proof-studio-import-handoff.webp"
				src="/assets/daynight/proof-studio-import-handoff.webp"
				alt="Promosale Varna service support"
			/>
		</div>
		<div class="index-10 relative container">
			<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
				<div class="services-center-info">
					<h2 class="mb-12 text-white">{services.contact.title}</h2>
					<p class="h7 line-height-28 font-weight-500 mb-28 text-white">
						{services.contact.description}
					</p>
					<ul class="list mb-32">
						{#each services.contact.checklist as item (item)}
							<li
								class="md-items-start font-weight-500 h7 mb-8 flex items-center gap-12 text-white"
							>
								<img src="/assets/icons/check-white.svg" alt="check" />
								{item}
							</li>
						{/each}
					</ul>
					<div class="divider-vertical-style4 mb-40"></div>
					<ul class="lg-grid-cols-1 grid grid-cols-2 gap-12">
						<li class="contact gap-12">
							<div class="icon"><img src="/assets/icons/PhoneCall-2.svg" alt="phone" /></div>
							<div class="flex flex-col gap-4">
								<p class="text-muted text-sm">Promosale Varna</p>
								<a
									{...externalHref(services.contact.phoneHref)}
									class="inline-flex min-h-8 items-center text-sm text-white"
								>
									{services.contact.phoneLabel}
								</a>
								{#if showSecondaryPhone}
									<a
										{...externalHref(services.contact.secondaryPhoneHref)}
										class="inline-flex min-h-8 items-center text-sm text-white"
									>
										{services.contact.secondaryPhoneLabel}
									</a>
								{/if}
							</div>
						</li>
						<li class="contact gap-12">
							<div class="icon"><img src="/assets/icons/Alarm.svg" alt="hours" /></div>
							<div class="flex flex-col gap-4">
								<p class="text-muted text-sm">Работно време</p>
								<span class="text-sm text-white">{services.contact.workNote}</span>
								<span class="text-sm text-white">{services.contact.emailLabel}</span>
							</div>
						</li>
					</ul>
				</div>
				<ServiceFormCard {form} />
			</div>
		</div>
	</section>
</div>

<style>
	@media (min-width: 768px) {
		.daynight-services-page__cards > .container {
			width: calc(100% - 64px) !important;
			max-width: var(--bc-page-width) !important;
			margin-inline: auto;
		}
	}
	@media (min-width: 768px) {
		.daynight-services-page__cards :global(.daynight-service-card) {
			padding: 24px !important;
			border-radius: 16px;
		}
		.daynight-services-page__cards :global(.daynight-service-card__media) {
			max-height: 190px;
			margin-bottom: 14px !important;
			border-radius: 12px;
		}
		.daynight-services-page__cards :global(.daynight-service-card__description) {
			font-size: 15px;
			line-height: 22px;
		}
		.daynight-services-page__cards :global(.daynight-service-card__cta) {
			margin-top: 16px;
		}
	}
	.daynight-services-page {
		background: var(--bc-bg);
	}

	.daynight-services-page :global(.background-light) {
		background: var(--bc-bg) !important;
	}

	.daynight-services-page__cards {
		padding-top: 0 !important;
		scroll-margin-top: 108px;
	}

	.daynight-services-search {
		display: flex;
		width: 100%;
		height: 56px;
		align-items: center;
		gap: 12px;
		margin: 0 auto;
		border: 1px solid var(--daynight-route-hero-control-border);
		border-radius: 12px;
		background: #ffffff;
		color: #1c1c1c;
		padding: 6px 6px 6px 18px;
		text-align: left;
	}

	.daynight-services-search input {
		width: 100%;
		min-width: 0;
		height: 44px;
		border: 0;
		background: transparent;
		box-shadow: none;
		color: #1c1c1c;
		font: inherit;
		font-size: 16px;
		font-weight: 500;
		outline: 0;
		padding: 0;
	}

	.daynight-services-search input::placeholder {
		color: #666b72;
		opacity: 1;
	}

	.daynight-services-search input::-webkit-search-cancel-button {
		display: none;
	}

	.daynight-services-search__clear {
		display: inline-flex;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		font: inherit;
		cursor: pointer;
	}

	.daynight-services-search__clear {
		width: 44px;
		flex: 0 0 44px;
		background: transparent;
		color: #5f6670;
	}

	.daynight-services-search:focus-within {
		outline: 2px solid var(--daynight-route-hero-focus);
		outline-offset: 3px;
	}

	.daynight-services-search__clear:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.daynight-services-empty {
		padding: 56px 24px;
		text-align: center;
	}

	.daynight-services-empty h2,
	.daynight-services-empty p {
		margin: 0;
	}

	.daynight-services-empty p {
		margin-top: 8px;
		color: #696665;
	}

	.daynight-services-empty button {
		min-height: 44px;
		margin-top: 20px;
		border: 0;
		border-radius: 8px;
		background: var(--bc-accent);
		color: #ffffff;
		font: inherit;
		font-weight: 700;
		padding: 0 18px;
		cursor: pointer;
	}

	.daynight-services-contact {
		overflow: hidden;
		background: #111;
	}

	.daynight-services-contact :global(.overlay-parallax) {
		background: rgb(0 0 0 / 0.62);
	}

	.daynight-services-contact :global(.services-center-form) {
		align-self: start;
	}

	.daynight-services-contact :global(.contact a) {
		display: inline-flex;
		min-height: var(--bc-control-height-compact);
		align-items: center;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-services-empty button:hover {
			background: var(--bc-accent);
		}
	}

	@media (max-width: 767px) {
		.daynight-services-search {
			height: 54px;
			padding-left: 14px;
		}

		.daynight-services-page__cards {
			padding-top: 40px !important;
		}
	}
</style>
