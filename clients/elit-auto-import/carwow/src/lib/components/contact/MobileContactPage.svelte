<script lang="ts">
	import { onMount as onClientMount } from 'svelte';
	let interactive = $state(false);
	onClientMount(() => {
		interactive = true;
	});
	import { onDestroy } from 'svelte';
	import { page as appPage } from '$app/state';
	import { Clock, MapPin, MessageCircle, PhoneCall, Send } from '@lucide/svelte';
	import MobileInfoHero from '$lib/components/shared/mobile/MobileInfoHero.svelte';
	import MobileHomeFooter from '$lib/components/home/mobile/MobileHomeFooter.svelte';
	import '$lib/styles/mobile-info-page.css';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import { readContactIntent, buildContactMessage } from '$lib/utils/contact-intent';
	import { validateLeadContact } from '$lib/utils/lead-validation';
	import { deferredMapFrame } from './deferred-map-frame';

	const phoneHref = daynightSite.phoneHref;
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const contactContext = readContactIntent(appPage.url.searchParams);
	let name = $state('');
	let contact = $state(
		appPage.url.searchParams.get('phone') || appPage.url.searchParams.get('email') || ''
	);
	let message = $state(contactContext.message);
	let companyWebsite = $state('');
	let leadSubmitState = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let leadSubmitMessage = $state('');
	let invalidContact = $state(false);
	let submissionController: AbortController | undefined;
	onDestroy(() => submissionController?.abort());

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (leadSubmitState === 'submitting') return;
		const issue = validateLeadContact(contact);
		invalidContact = Boolean(issue);
		if (issue || !name.trim() || !message.trim()) {
			leadSubmitState = 'error';
			leadSubmitMessage = issue?.message || 'Попълнете име и съобщение.';
			const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
				issue ? 'contact' : !name.trim() ? 'name' : 'message'
			);
			if (field instanceof HTMLElement) field.focus();
			return;
		}
		const controller = new AbortController();
		submissionController = controller;
		leadSubmitState = 'submitting';
		leadSubmitMessage = '';
		const contactValue = contact.trim();
		const email = contactValue.includes('@') ? contactValue : null;
		const result = await submitLead(
			{
				customerName: name.trim(),
				contact: contactValue,
				email,
				phone: email ? null : contactValue,
				source: 'contact-page-mobile',
				message: buildContactMessage(contactContext, message),
				companyWebsite
			},
			{ signal: controller.signal }
		);
		if (controller.signal.aborted) return;
		leadSubmitState = result.ok ? 'success' : 'error';
		leadSubmitMessage = result.ok ? 'Екипът ще се свърже с Вас за следваща стъпка.' : result.error;
	}
	const contactCards = [
		{
			id: 'phone',
			title: 'Телефон',
			value: daynightSite.phoneLabel,
			icon: PhoneCall
		},
		{
			id: 'address',
			title: 'Адрес',
			value: daynightSite.location,
			icon: MapPin
		},
		{
			id: 'hours',
			title: 'Работно време',
			value: daynightSite.hoursLabel,
			href: null,
			icon: Clock
		}
	] as const;
</script>

<div class="mobile-contact-app mobile-info-page">
	<MobileInfoHero
		title="Контакти"
		description="За оглед, въпрос или съдействие — обадете се или ни пишете."
	>
		<a href={phoneHref}><PhoneCall size={18} strokeWidth={2} /> Обади се</a>
		<a href={daynightSite.mapUrl} target="_blank" rel="noopener noreferrer"
			><MapPin size={18} strokeWidth={2} /> Карта</a
		>
	</MobileInfoHero>

	<main id="main-content" tabindex="-1">
		<section
			class="mobile-contact-form-section"
			aria-labelledby="mobile-contact-form-title"
			tabindex="-1"
		>
			<noscript
				><p>
					За онлайн заявка е необходим JavaScript. <a href={daynightSite.phoneHref}
						>Свържете се с екипа по телефона.</a
					>
				</p></noscript
			>
			<div class="mobile-contact-heading">
				<h2 id="mobile-contact-form-title">
					{contactContext.subject || 'Пишете ни'}
				</h2>
			</div>

			{#if contactContext.vehicle}
				<p>
					Автомобил: <strong>{contactContext.vehicle.shortTitle}</strong> · {contactContext.vehicle
						.year} · {contactContext.vehicle.lot}
				</p>
			{/if}

			{#if leadSubmitState === 'success'}
				<div class="mobile-contact-success" role="status" aria-live="polite">
					<MessageCircle size={23} strokeWidth={2} />
					<span>
						<strong>Запитването е изпратено</strong>
						<small>{leadSubmitMessage}</small>
					</span>
				</div>
			{:else}
				<form
					method="post"
					class="mobile-contact-form"
					onsubmit={handleSubmit}
					oninput={() => {
						invalidContact = false;
						leadSubmitMessage = '';
					}}
					aria-busy={leadSubmitState === 'submitting'}
					data-daynight-live-lead="true"
				>
					<!-- Honeypot: hidden from users, populated only by bots; dropped server-side. -->
					<div
						aria-hidden="true"
						style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"
					>
						<label for="mobile-contact-company-website">Не попълвайте това поле</label>
						<input
							id="mobile-contact-company-website"
							name="companyWebsite"
							type="text"
							tabindex="-1"
							autocomplete="off"
							bind:value={companyWebsite}
						/>
					</div>
					<label>
						<span>Име</span>
						<input
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={name}
							name="name"
							maxlength="140"
							type="text"
							placeholder="Вашето име"
							autocomplete="name"
							required
						/>
					</label>

					<label>
						<span>Телефон или имейл</span>
						<input
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={contact}
							name="contact"
							maxlength="180"
							aria-invalid={invalidContact ? true : undefined}
							aria-describedby={invalidContact ? 'mobile-contact-error' : undefined}
							type="text"
							inputmode="text"
							placeholder="Вашият телефон или имейл"
							autocomplete="off"
							required
						/>
					</label>
					<label>
						<span>Съобщение</span>
						<textarea
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={message}
							name="message"
							maxlength="3500"
							rows="3"
							placeholder="Автомобил, оглед, бартер, документи..."
							required
						></textarea>
					</label>
					<button type="submit" disabled={leadSubmitState === 'submitting' || !interactive}>
						<Send size={18} strokeWidth={2} />
						<span>
							{leadSubmitState === 'submitting' ? 'Изпращаме...' : 'Изпрати запитване'}
						</span>
					</button>
					{#if leadSubmitMessage}
						<p
							class="mobile-contact-error"
							id="mobile-contact-error"
							role="alert"
							aria-live="polite"
						>
							{leadSubmitMessage}
						</p>
					{/if}
				</form>
			{/if}
		</section>

		<section class="mobile-contact-section" aria-labelledby="mobile-contact-info-title">
			<div class="mobile-contact-heading">
				<h2 id="mobile-contact-info-title">Посетете ни</h2>
			</div>

			<div class="mobile-contact-cards">
				{#each contactCards as card (card.id)}
					{@const Icon = card.icon}
					<div class="mobile-contact-card">
						<span class="mobile-contact-card__icon"><Icon size={21} strokeWidth={2} /></span>
						<span>
							<strong>{card.title}</strong>
							<small
								>{#if card.id === 'phone'}<a href={phoneHref}>{card.value}</a
									>{:else if card.id === 'address'}<a
										href={daynightSite.mapUrl}
										target="_blank"
										rel="noopener noreferrer">{card.value}</a
									>{:else}{card.value}{/if}</small
							>
						</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="mobile-contact-map" aria-label="Карта">
			<div class="mobile-contact-map__head">
				<div>
					<h2>Шоурум в {daynightSite.city}</h2>
				</div>
			</div>
			<iframe
				{@attach deferredMapFrame(mapEmbedSrc, '120px')}
				title={`Карта до ${daynightSite.shortName}, ${daynightSite.city}`}
				data-map-src={mapEmbedSrc}
				height="270"
				style="border:0;width:100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
			<a
				class="mobile-contact-map__fallback"
				href={daynightSite.mapUrl}
				target="_blank"
				rel="noopener noreferrer">Отвори упътвания</a
			>
		</section>
	</main>
	<MobileHomeFooter showContact={false} />
</div>

<style>
	.mobile-contact-section,
	.mobile-contact-form-section,
	.mobile-contact-form,
	.mobile-contact-cards,
	.mobile-contact-map {
		display: grid;
		gap: 14px;
	}
	.mobile-contact-card {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		align-items: center;
		gap: 12px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--sa-line);
	}
	.mobile-contact-card:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}
	.mobile-contact-card__icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--sa-line);
		border-radius: 50%;
	}
	.mobile-contact-card > span:nth-child(2) {
		display: grid;
		gap: 2px;
		min-width: 0;
	}
	.mobile-contact-card strong {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-regular);
		color: var(--sa-ink-soft);
	}
	.mobile-contact-card small {
		font-size: var(--sa-type-body);
	}
	.mobile-contact-card a {
		display: flex;
		align-items: center;
		min-height: var(--sa-mobile-action-h);
	}
	.mobile-contact-form label {
		display: grid;
		gap: 4px;
		min-width: 0;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-md);
		background: var(--sa-surface);
		padding: 10px 12px;
	}
	.mobile-contact-form label:focus-within {
		border-color: var(--sa-ink);
	}
	.mobile-contact-form label span {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-meta);
	}
	.mobile-contact-form input,
	.mobile-contact-form textarea {
		width: 100%;
		min-width: 0;
		min-height: 36px;
		appearance: none;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--sa-ink);
		font: inherit;
		outline: 0;
		padding: 0;
		resize: vertical;
	}
	.mobile-contact-form input::placeholder,
	.mobile-contact-form textarea::placeholder {
		color: var(--sa-ink-soft);
		opacity: 0.8;
	}
	.mobile-contact-form button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: var(--sa-mobile-action-h);
		border: 0;
		border-radius: 999px;
		background: var(--sa-red);
		color: white;
		font: inherit;
		cursor: pointer;
	}
	.mobile-contact-form button:focus-visible {
		outline: 2px solid var(--sa-ink);
		outline-offset: 3px;
	}
	.mobile-contact-form button:disabled {
		cursor: wait;
		opacity: 0.7;
	}
	.mobile-contact-error {
		border-radius: var(--sa-r-md);
		padding: 12px;
		background: #fff1f2;
		color: #b91c1c !important;
	}
	.mobile-contact-success {
		display: flex;
		align-items: start;
		gap: 12px;
		border-radius: var(--sa-r-md);
		padding: 16px;
		background: var(--sa-fill);
	}
	.mobile-contact-success > span {
		display: grid;
		gap: 4px;
	}
	.mobile-contact-success strong {
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-medium);
	}
	.mobile-contact-success small {
		font-size: var(--sa-type-body);
		color: var(--sa-ink-soft);
	}
	.mobile-contact-map iframe {
		display: block;
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
	}
	.mobile-contact-map__fallback {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		min-height: var(--sa-mobile-action-h);
		padding: 0 16px;
		border: 1px solid var(--sa-line);
		border-radius: 999px;
	}
</style>
