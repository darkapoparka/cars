<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import { ArrowRight } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { submitLead } from '$lib/client/lead-submit';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	type ServiceSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const services = [
		{
			id: 'inspection',
			title: 'Проверка преди покупка',
			summary: 'Организираме преглед на автомобила, история и реално състояние преди решение.',
			image: '/assets/images/services/service-card-inspection-daynight-v2.webp',
			imagePosition: 'center bottom'
		},
		{
			id: 'documents',
			title: 'Документи и регистрация',
			summary: 'Съдействаме с талони, регистрация, застраховки и нужните стъпки след сделка.',
			image: '/assets/images/services/service-card-documents-daynight-v2.webp',
			imagePosition: 'center bottom'
		},
		{
			id: 'financing',
			title: 'Финансиране',
			summary: 'Помагаме да сравните варианти за финансиране и месечна вноска.',
			image: '/assets/images/services/service-card-financing-daynight-v2.webp',
			imagePosition: 'center bottom'
		},
		{
			id: 'trade-in',
			title: 'Бартер и оценка',
			summary: 'Оценяваме текущия автомобил и го включваме като част от покупката.',
			image: '/assets/images/services/service-card-trade-in-daynight-v2.webp',
			imagePosition: 'center bottom'
		},
		{
			id: 'sourcing',
			title: 'Търсене по задание',
			summary: 'Уточняваме марка, бюджет и оборудване, после търсим подходящ автомобил.',
			image: '/assets/images/services/service-card-sourcing-daynight-v2.webp',
			imagePosition: 'center bottom'
		},
		{
			id: 'delivery',
			title: 'Доставка и предаване',
			summary: 'Координираме транспорт, предаване и последните практически детайли.',
			image: '/assets/images/services/service-card-delivery-daynight-v2.webp',
			imagePosition: 'center bottom'
		}
	] as const;

	type ServiceId = (typeof services)[number]['id'];
	type ServicesRequestPath = `/services?service=${ServiceId}#services-request`;

	const serviceIds = new Set<ServiceId>(services.map((service) => service.id));

	function serviceFromParam(value: string | null): ServiceId {
		return value && serviceIds.has(value as ServiceId) ? (value as ServiceId) : 'inspection';
	}

	function serviceRequestPath(id: ServiceId): ServicesRequestPath {
		return `/services?service=${id}#services-request`;
	}

	// `?service=` deep-link is resolved on the client only: SvelteKit forbids
	// reading url.searchParams during prerender. Card clicks optimistically assign
	// this writable derived before SvelteKit moves to the query/hash URL.
	let selectedService = $derived(
		browser ? serviceFromParam(page.url.searchParams.get('service')) : serviceFromParam(null)
	);
	let name = $state('');
	let phone = $state('');
	let vehicle = $state('');
	let message = $state('');
	let companyWebsite = $state('');
	let serviceSubmitState = $state<ServiceSubmitState>('idle');
	let serviceSubmitMessage = $state('');

	const selectedServiceItem = $derived.by(
		() => services.find((service) => service.id === selectedService) ?? services[0]
	);

	function chooseService(id: ServiceId, event: MouseEvent) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;

		event.preventDefault();
		selectedService = id;
		void goto(i18n.href(resolve(serviceRequestPath(id))), { keepFocus: true });
	}

	function buildServiceNotes() {
		return [
			['Услуга', selectedServiceItem.title],
			['Автомобил', vehicle.trim()],
			['Съобщение', message.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => `${label}: ${value}`)
			.join('\n');
	}

	async function handleServiceSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (serviceSubmitState === 'submitting') return;

		const contactValue = phone.trim();
		if (!contactValue) {
			serviceSubmitState = 'error';
			serviceSubmitMessage = 'Моля, въведете телефон, за да уточним следващата стъпка.';
			return;
		}

		serviceSubmitState = 'submitting';
		serviceSubmitMessage = '';

		const result = await submitLead({
			customerName: name.trim() || 'Заявка за услуга от сайта',
			contact: contactValue,
			email: null,
			phone: contactValue,
			source: 'services-desktop',
			message: buildServiceNotes(),
			companyWebsite
		});

		if (result.ok) {
			serviceSubmitState = 'success';
			serviceSubmitMessage =
				'Запитването е изпратено. Екипът ще се свърже с Вас за следващата стъпка.';
			return;
		}

		serviceSubmitState = 'error';
		serviceSubmitMessage =
			result.error || i18n.t('pattern.092b5d19f038', { v0: daynightSite.phoneLabel });
	}
</script>

<main
	id="main-content"
	tabindex="-1"
	class="desktop-services"
	aria-label={i18n.t('pattern.eb6cae93a699', { v0: daynightSite.shortName })}
>
	<DesktopYellowRouteHero
		headingId="daynight-services-title"
		title={i18n.t('copy.d700ec2758ef')}
		panel="light"
		compact
	>
		<div class="services-chooser">
			<h2 id="services-choice-title">{i18n.t('copy.c4eb9ace64ee')}</h2>
			<nav class="services-shortcuts" aria-labelledby="services-choice-title">
				{#each services as service (service.id)}
					<a
						href={i18n.href(resolve(serviceRequestPath(service.id)))}
						onclick={(event) => chooseService(service.id, event)}>{i18n.text(service.title)}</a
					>
				{/each}
			</nav>
			<p class="services-help">
				{i18n.t('copy.bade5f3f4082')}
				<a href={i18n.href(daynightSite.phoneHref)}>{i18n.t('copy.2384a5f73657')}</a>
			</p>
		</div>
	</DesktopYellowRouteHero>

	<section class="desktop-services-offers">
		<div class="container">
			<h2 class="desktop-services-sr-only">
				{i18n.t('copy.397d7e3473ba')}
				{daynightSite.shortName}
			</h2>

			<div class="desktop-services-grid">
				{#each services as service (service.id)}
					<a
						class="desktop-services-card"
						href={i18n.href(resolve(serviceRequestPath(service.id)))}
						aria-label={i18n.t('pattern.98f83adf5270', { v0: i18n.text(service.title) })}
						onclick={(event) => chooseService(service.id, event)}
					>
						<span
							class="desktop-services-card__media"
							aria-hidden="true"
							style:--service-card-position={service.imagePosition}
						>
							<img
								src={i18n.asset(resolve(service.image))}
								alt=""
								aria-hidden="true"
								loading="lazy"
							/>
						</span>
						<div class="desktop-services-card__content">
							<h3>{i18n.text(service.title)}</h3>
							<p>{i18n.text(service.summary)}</p>
							<span class="desktop-services-card__cta" aria-hidden="true">
								<span>{i18n.t('copy.b3b1d6656697')}</span><ArrowRight size={18} />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="desktop-services-request" id="services-request">
		<div class="desktop-services-request__shell container">
			<div class="desktop-services-request__copy">
				<h2>{i18n.t('copy.9042389747b0')}<br />{i18n.t('copy.6a83ad41f94f')}</h2>
				<p>
					{i18n.t('copy.09f7bdbf30aa')}
				</p>
			</div>

			<form
				class="desktop-services-form"
				action={resolve('/contact')}
				method="get"
				onsubmit={handleServiceSubmit}
			>
				<input {@attach i18n.validation} type="hidden" name="intent" value="services" />
				<label class="desktop-services-honeypot" aria-hidden="true">
					<span>{i18n.t('copy.64d92044a1ff')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						tabindex="-1"
						autocomplete="off"
						bind:value={companyWebsite}
					/>
				</label>

				<div class="desktop-services-form__grid">
					<label class="desktop-services-field">
						<span>{i18n.t('copy.7848bd195104')}</span>
						<input
							{@attach i18n.validation}
							name="name"
							type="text"
							bind:value={name}
							placeholder={i18n.t('copy.a3203bcb4cff')}
						/>
					</label>
					<label class="desktop-services-field">
						<span>{i18n.t('copy.822f9fd9ba2d')}</span>
						<input
							{@attach i18n.validation}
							name="phone"
							type="tel"
							bind:value={phone}
							placeholder={i18n.t('copy.b4a2956e4ac2')}
							autocomplete="tel"
							required
						/>
					</label>
					<label class="desktop-services-field" for="desktop-services-service">
						<span>{i18n.t('copy.629f17f3b66f')}</span>
						<select
							{@attach i18n.validation}
							id="desktop-services-service"
							name="service"
							bind:value={selectedService}
						>
							{#each services as service (service.id)}
								<option value={service.id}>{i18n.text(service.title)}</option>
							{/each}
						</select>
					</label>
					<label class="desktop-services-field">
						<span>{i18n.t('copy.e549eadf1b38')}</span>
						<input
							{@attach i18n.validation}
							name="vehicle"
							type="text"
							bind:value={vehicle}
							placeholder={i18n.t('copy.7558220498f7')}
						/>
					</label>
					<label class="desktop-services-field desktop-services-field--wide">
						<span>{i18n.t('copy.5afae14709c7')}</span>
						<textarea
							{@attach i18n.validation}
							name="message"
							bind:value={message}
							rows="2"
							placeholder={i18n.t('copy.c72dac4e6b0f')}
						></textarea>
					</label>
				</div>

				{#if serviceSubmitMessage}
					<p
						class="desktop-services-form__message"
						data-state={serviceSubmitState}
						role={serviceSubmitState === 'error' ? 'alert' : 'status'}
						aria-live="polite"
					>
						{i18n.text(serviceSubmitMessage)}
					</p>
				{/if}

				<button
					class="desktop-services-form__submit sa-cta sa-cta-primary"
					type="submit"
					disabled={serviceSubmitState === 'submitting'}
				>
					<span
						>{serviceSubmitState === 'submitting'
							? i18n.t('copy.acfcd771108c')
							: i18n.t('copy.8d4343e23a1b')}</span
					>
				</button>
			</form>
		</div>
	</section>
</main>

<style>
	.services-shortcuts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		margin: 18px 0;
	}
	.services-shortcuts a {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 8px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: var(--desktop-field);
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-caption)/1.35 var(--sa-font);
	}
	.services-shortcuts a:hover {
		background: var(--desktop-secondary-hover);
		border-color: var(--desktop-secondary-hover);
	}
	.desktop-services .services-help {
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.5 var(--sa-font);
		margin: 14px 0 0;
		color: var(--sa-ink);
	}
	.desktop-services .services-help a {
		font-weight: var(--sa-button-font-weight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.desktop-services {
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	.desktop-services :global(svg),
	.desktop-services :global(svg *) {
		stroke: currentColor !important;
	}
	.desktop-services a {
		text-decoration: none;
	}
	.desktop-services .container {
		width: calc(100% - 96px);
		max-width: 1280px;
		margin-inline: auto;
		padding: 0;
	}
	.services-chooser {
		padding: 24px;
		text-align: center;
	}
	.desktop-services .services-chooser h2 {
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.4 var(--sa-font);
		color: var(--sa-ink);
		margin: 0;
		letter-spacing: 0;
	}
	.desktop-services-offers {
		padding: 56px 0 64px;
	}
	.desktop-services-sr-only,
	.desktop-services-honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.desktop-services-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.desktop-services-card {
		display: flex;
		flex-direction: column;
		color: #fff;
		min-width: 0;
		overflow: hidden;
		background: #25292b;
		border-radius: 12px;
	}
	.desktop-services-card__media {
		display: block;
		aspect-ratio: 8 / 5;
		overflow: hidden;
		border-radius: 0;
		background: #25292b;
	}
	.desktop-services-card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--service-card-position, center);
	}
	.desktop-services-card__content {
		padding: 22px 24px 24px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.desktop-services-card h3 {
		font: var(--sa-weight-strong) var(--sa-text-desktop-card-title)/1.25 var(--sa-font);
		letter-spacing: 0;
		margin: 0 0 8px;
		color: #fff;
	}
	.desktop-services-card p {
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
		color: #d9dcde;
		margin: 0;
	}
	.desktop-services-card__cta {
		display: inline-flex;
		align-self: flex-start;
		align-items: center;
		gap: 16px;
		color: #15191b;
		background: #fff;
		border-radius: 8px;
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		padding: 10px 16px;
		margin-top: 20px;
		min-height: 44px;
	}
	.desktop-services-card__content p {
		flex: 1;
	}
	.desktop-services-card__cta :global(*) {
		color: inherit;
	}
	.desktop-services-card:is(:hover, :focus-visible) .desktop-services-card__cta {
		background: var(--sa-yellow);
	}
	.desktop-services :is(a, select):focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 4px;
	}
	.desktop-services-request {
		padding: 0 0 64px;
		scroll-margin-top: 120px;
	}
	.desktop-services .desktop-services-request__shell {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 48px;
		align-items: center;
		padding: 40px;
		background: var(--sa-yellow);
		border-radius: 16px;
	}
	.desktop-services-request__copy h2 {
		font: var(--sa-weight-strong) var(--sa-text-desktop-hero-title)/1.06 var(--sa-font);
		letter-spacing: -0.04em;
		margin: 0 0 20px;
		color: var(--sa-ink);
	}
	.desktop-services-request__copy p {
		font: var(--sa-weight-regular) var(--sa-text-lg)/1.5 var(--sa-font);
		color: var(--sa-ink);
		margin: 0;
		max-width: 34ch;
	}
	.desktop-services-form {
		background: #fff;
		border-radius: 12px;
		padding: 24px;
		display: grid;
		gap: 18px;
	}
	.desktop-services-form__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}
	.desktop-services-field {
		display: grid;
		gap: 6px;
		min-width: 0;
	}
	.desktop-services-field--wide {
		grid-column: span 2;
	}
	.desktop-services-field span {
		font: var(--sa-weight-semibold) var(--sa-text-caption)/1.4 var(--sa-font);
		color: var(--sa-ink);
	}
	.desktop-services-field :is(input, select, textarea) {
		width: 100%;
		min-width: 0;
		border: 1px solid #d7dee7 !important;
		border-radius: 8px;
		background: #f7f8fa !important;
		color: var(--sa-ink) !important;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.4 var(--sa-font);
		box-shadow: none !important;
	}
	.desktop-services-field :is(input, select) {
		height: 46px;
		padding: 0 12px !important;
	}
	.desktop-services-field select {
		padding-right: 30px !important;
	}
	.desktop-services-field textarea {
		min-height: 78px;
		padding: 10px 12px !important;
		resize: vertical;
	}
	.desktop-services-field :is(input, select, textarea):focus {
		outline: 2px solid var(--sa-red) !important;
		outline-offset: 1px;
	}
	.desktop-services-form__submit {
		justify-self: end;
		border: 0;
		--sa-cta-height: 46px;
		--sa-cta-font-size: var(--sa-button-font-size);
		padding-inline: 24px;
	}
	.desktop-services-form__message {
		margin: 0;
		padding: 12px;
		border-radius: 8px;
		background: #fff1f1;
		color: #b42318;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.4 var(--sa-font);
	}
	.desktop-services-form__message[data-state='success'] {
		background: #ecfdf3;
		color: #027a48;
	}
	@media (max-width: 1199px) {
		.desktop-services .container {
			width: calc(100% - 64px);
		}
		.desktop-services .desktop-services-request__shell {
			padding: 32px;
			gap: 28px;
			grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		}
	}
	@media (max-width: 991px) {
		.desktop-services {
			display: none;
		}
	}
</style>
