<script lang="ts">
	import type { AuxeroServiceFormData, AuxeroServicesContent } from '$lib/auxero/services';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
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
	const normalizedServiceQuery = $derived(serviceQuery.trim().toLocaleLowerCase('bg-BG'));
	const filteredServices = $derived(
		normalizedServiceQuery
			? services.cards.filter((service) =>
					`${service.title} ${service.description}`
						.toLocaleLowerCase('bg-BG')
						.includes(normalizedServiceQuery)
				)
			: services.cards
	);
	const handleServiceSearchInput = (value: string) => {
		serviceQuery = value;
	};
	const handleServiceSearchSubmit = () => {
		document
			.getElementById('services-list')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
	const serviceSearch = $derived({
		quickSearches: ['Внос', 'Проверка', 'Документи', 'Продажба'].filter((term) =>
			services.cards.some((service) =>
				`${service.title} ${service.description}`
					.toLocaleLowerCase('bg-BG')
					.includes(term.toLocaleLowerCase('bg-BG'))
			)
		),
		ariaLabel: 'Търсене на услуга',
		onInput: handleServiceSearchInput,
		onSubmit: handleServiceSearchSubmit,
		placeholder: 'Търси услуга...',
		submitLabel: 'Търси',
		value: serviceQuery
	});
	const showSecondaryPhone = $derived(
		services.contact.secondaryPhoneHref !== services.contact.phoneHref ||
			services.contact.secondaryPhoneLabel !== services.contact.phoneLabel
	);
</script>

<div class="eliqauto-services-page" data-eliqauto-services>
	<PageBanner
		compactDesktop
		banner={services.hero}
		search={serviceSearch}
		leftCutout={{
			src: '/assets/eliqauto/hero/eliq-s-class-cutout-v1.webp',
			variant: 'vehicle'
		}}
		cutout={{
			alt: 'Mercedes-Benz S-Class',
			src: '/assets/eliqauto/hero/eliq-s-class-cutout-v1.webp',
			mirror: true,
			variant: 'service'
		}}
	/>

	<section id="services-list" class="eliqauto-services-page__cards background-light py-100">
		<div class="container">
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
				<div class="eliqauto-services-page__empty" role="status">
					<h2>Няма услуга с това търсене</h2>
					<p>Опитайте с „внос“, „проверка“, „документи“ или „продажба“.</p>
					<button type="button" onclick={() => (serviceQuery = '')}>Изчисти търсенето</button>
				</div>
			{/if}
		</div>
	</section>

	<section class="eliqauto-services-contact relative py-100">
		<div class="overlay-parallax"></div>
		<div class="overlay image">
			<img
				class="lazyload parallax"
				data-src="/assets/eliqauto/proof-studio-import-handoff.webp"
				src="/assets/eliqauto/proof-studio-import-handoff.webp"
				alt="Eliqauto service support"
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
								<p class="text-muted text-sm">Eliqauto</p>
								<a {...externalHref(services.contact.phoneHref)} class="text-sm text-white">
									{services.contact.phoneLabel}
								</a>
								{#if showSecondaryPhone}
									<a
										{...externalHref(services.contact.secondaryPhoneHref)}
										class="text-sm text-white"
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
	.eliqauto-services-page {
		background: var(--bc-bg);
	}

	.eliqauto-services-page :global(.background-light) {
		background: var(--bc-surface-raised);
	}

	.eliqauto-services-page__cards {
		background: var(--bc-surface-raised);
		padding-top: 64px;
		scroll-margin-top: 96px;
	}

	.eliqauto-services-page__empty {
		display: grid;
		min-height: 260px;
		place-items: center;
		align-content: center;
		padding: 40px 24px;
		border-radius: 16px;
		background: var(--bc-surface);
		text-align: center;
	}

	.eliqauto-services-page__empty h2 {
		margin: 0 0 8px;
		font-size: 28px;
		line-height: 1.2;
	}

	.eliqauto-services-page__empty p {
		margin: 0;
		color: var(--bc-muted);
	}

	.eliqauto-services-page__empty button {
		min-height: 44px;
		margin-top: 20px;
		padding: 0 18px;
		border: 1px solid var(--bc-ink);
		border-radius: 8px;
		background: var(--bc-ink);
		color: #ffffff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.eliqauto-services-page__empty button:focus-visible {
		outline: 3px solid var(--bc-accent);
		outline-offset: 3px;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-services-page__empty button:hover {
			background: #303035;
		}
	}

	.eliqauto-services-contact {
		overflow: hidden;
		background: #111;
	}

	.eliqauto-services-contact :global(.overlay-parallax) {
		background: rgb(0 0 0 / 0.62);
	}

	.eliqauto-services-contact :global(.services-center-form) {
		align-self: start;
	}
</style>
