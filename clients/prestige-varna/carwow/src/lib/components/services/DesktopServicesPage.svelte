<script lang="ts">
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
			image: '/dealer/media-pending.svg',
			imagePosition: 'center bottom'
		},
		{
			id: 'documents',
			title: 'Документи и регистрация',
			summary: 'Съдействаме с талони, регистрация, застраховки и нужните стъпки след сделка.',
			image: '/dealer/media-pending.svg',
			imagePosition: 'center bottom'
		},
		{
			id: 'financing',
			title: 'Финансиране',
			summary: 'Помагаме да сравните варианти за финансиране и месечна вноска.',
			image: '/dealer/media-pending.svg',
			imagePosition: 'center bottom'
		},
		{
			id: 'trade-in',
			title: 'Бартер и оценка',
			summary: 'Оценяваме текущия автомобил и го включваме като част от покупката.',
			image: '/dealer/media-pending.svg',
			imagePosition: 'center bottom'
		},
		{
			id: 'sourcing',
			title: 'Търсене по задание',
			summary: 'Уточняваме марка, бюджет и оборудване, после търсим подходящ автомобил.',
			image: '/dealer/media-pending.svg',
			imagePosition: 'center bottom'
		},
		{
			id: 'delivery',
			title: 'Доставка и предаване',
			summary: 'Координираме транспорт, предаване и последните практически детайли.',
			image: '/dealer/media-pending.svg',
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
		void goto(resolve(serviceRequestPath(id)), { keepFocus: true });
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
			result.error ||
			`Не успяхме да изпратим запитването. Моля, обадете се на ${daynightSite.phoneLabel}.`;
	}
</script>

<main id="main-content" tabindex="-1" class="desktop-services" aria-label="Услуги ПРЕСТИЖ">
	<DesktopYellowRouteHero
		headingId="daynight-services-title"
		title="Услуги за твоя автомобил"
		panel="light"
		compact
	>
		<div class="services-chooser">
			<h2 id="services-choice-title">Какво ти е необходимо?</h2>
			<nav class="services-shortcuts" aria-labelledby="services-choice-title">
				{#each services as service (service.id)}
					<a
						href={resolve(serviceRequestPath(service.id))}
						onclick={(event) => chooseService(service.id, event)}>{service.title}</a
					>
				{/each}
			</nav>
			<p class="services-help">
				Не знаеш коя услуга ти трябва? <a href={`tel:${daynightSite.phone}`}
					>Обади ни се</a
				>
			</p>
		</div>
	</DesktopYellowRouteHero>

	<section class="desktop-services-offers">
		<div class="container">
			<h2 class="desktop-services-sr-only">Конкретни услуги от ПРЕСТИЖ</h2>

			<div class="desktop-services-grid">
				{#each services as service (service.id)}
					<a
						class="desktop-services-card"
						href={resolve(serviceRequestPath(service.id))}
						aria-label={`Заяви услуга: ${service.title}`}
						onclick={(event) => chooseService(service.id, event)}
					>
						<span
							class="desktop-services-card__media"
							aria-hidden="true"
							style:--service-card-position={service.imagePosition}
						>
							<img src={resolve(service.image)} alt="" aria-hidden="true" loading="lazy" />
						</span>
						<div class="desktop-services-card__content">
							<h3>{service.title}</h3>
							<p>{service.summary}</p>
							<span class="desktop-services-card__cta" aria-hidden="true">
								<span>Избери услугата</span><ArrowRight size={18} />
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
				<h2>Да уточним<br />детайлите.</h2>
				<p>
					Остави телефон и ни разкажи за автомобила. Ще се свържем с теб, за да обсъдим услугата,
					документите и удобен срок.
				</p>
			</div>

			<form
				class="desktop-services-form"
				action={resolve('/contact')}
				method="get"
				onsubmit={handleServiceSubmit}
			>
				<input type="hidden" name="intent" value="services" />
				<label class="desktop-services-honeypot" aria-hidden="true">
					<span>Компания</span>
					<input type="text" tabindex="-1" autocomplete="off" bind:value={companyWebsite} />
				</label>

				<div class="desktop-services-form__grid">
					<label class="desktop-services-field">
						<span>Име</span>
						<input name="name" type="text" bind:value={name} placeholder="Име и фамилия" />
					</label>
					<label class="desktop-services-field">
						<span>Телефон</span>
						<input
							name="phone"
							type="tel"
							bind:value={phone}
							placeholder="Телефон за връзка"
							autocomplete="tel"
							required
						/>
					</label>
					<label class="desktop-services-field" for="desktop-services-service">
						<span>Услуга</span>
						<select id="desktop-services-service" name="service" bind:value={selectedService}>
							{#each services as service (service.id)}
								<option value={service.id}>{service.title}</option>
							{/each}
						</select>
					</label>
					<label class="desktop-services-field">
						<span>Автомобил</span>
						<input
							name="vehicle"
							type="text"
							bind:value={vehicle}
							placeholder="Марка, модел или линк към обява"
						/>
					</label>
					<label class="desktop-services-field desktop-services-field--wide">
						<span>Съобщение</span>
						<textarea
							name="message"
							bind:value={message}
							rows="2"
							placeholder="Какво искате да уточним?"
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
						{serviceSubmitMessage}
					</p>
				{/if}

				<button
					class="desktop-services-form__submit sa-cta sa-cta-primary"
					type="submit"
					disabled={serviceSubmitState === 'submitting'}
				>
					<span>{serviceSubmitState === 'submitting' ? 'Изпращаме...' : 'Изпрати запитване'}</span>
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
		font: 500 14px/1.35 var(--sa-font);
	}
	.services-shortcuts a:hover {
		background: var(--desktop-secondary-hover);
		border-color: var(--desktop-secondary-hover);
	}
	.desktop-services .services-help {
		font: 400 14px/1.5 var(--sa-font);
		margin: 14px 0 0;
		color: var(--sa-ink);
	}
	.desktop-services .services-help a {
		font-weight: 600;
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
		font: 600 18px/1.4 var(--sa-font);
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
		font: 700 var(--sa-text-desktop-card-title)/1.25 var(--sa-font);
		letter-spacing: 0;
		margin: 0 0 8px;
		color: #fff;
	}
	.desktop-services-card p {
		font: 400 15px/1.5 var(--sa-font);
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
		font: 600 14px/1.4 var(--sa-font);
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
		font: 800 clamp(36px, 3.4vw, 52px)/1.06 var(--sa-font);
		letter-spacing: -0.04em;
		margin: 0 0 20px;
		color: var(--sa-ink);
	}
	.desktop-services-request__copy p {
		font: 400 18px/1.5 var(--sa-font);
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
		font: 600 14px/1.4 var(--sa-font);
		color: var(--sa-ink);
	}
	.desktop-services-field :is(input, select, textarea) {
		width: 100%;
		min-width: 0;
		border: 1px solid #d7dee7 !important;
		border-radius: 8px;
		background: #f7f8fa !important;
		color: var(--sa-ink) !important;
		font: 400 16px/1.4 var(--sa-font);
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
		--sa-cta-font-size: 16px;
		padding-inline: 24px;
	}
	.desktop-services-form__message {
		margin: 0;
		padding: 12px;
		border-radius: 8px;
		background: #fff1f1;
		color: #b42318;
		font: 400 16px/1.4 var(--sa-font);
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
