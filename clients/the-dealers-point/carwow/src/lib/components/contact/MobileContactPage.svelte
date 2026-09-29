<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
	let message = $state(i18n.text(contactContext.message));
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
				message: buildContactMessage(
					contactContext,
					message,
					i18n.text(contactContext.subject),
					i18n.locale
				),
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
			title: i18n.t('copy.822f9fd9ba2d'),
			value: daynightSite.phoneLabel,
			icon: PhoneCall
		},
		{
			id: 'address',
			title: i18n.t('copy.da82e80563d7'),
			value: i18n.dealer('address'),
			icon: MapPin
		},
		{
			id: 'hours',
			title: i18n.t('copy.e3e2e2339725'),
			value: i18n.text(daynightSite.hoursLabel),
			href: null,
			icon: Clock
		}
	] as const;
</script>

<div class="mobile-contact-app mobile-info-page">
	<MobileInfoHero title={i18n.t('copy.18a85f67cf6a')} description={i18n.t('copy.44d8f321233b')}>
		<a href={i18n.href(phoneHref)}
			><PhoneCall size={18} strokeWidth={2} /> {i18n.t('copy.d40e5119596a')}</a
		>
		<a href={i18n.href(daynightSite.mapUrl)} target="_blank" rel="noopener noreferrer"
			><MapPin size={18} strokeWidth={2} /> {i18n.t('copy.2751c9100018')}</a
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
					{i18n.t('copy.8b681b7a839d')}
					<a href={i18n.href(daynightSite.phoneHref)}>{i18n.t('copy.04eb33f8c2d0')}</a>
				</p></noscript
			>
			<div class="mobile-contact-heading">
				<h2 id="mobile-contact-form-title">
					{i18n.text(contactContext.subject) || i18n.t('copy.b69a9fd53d0a')}
				</h2>
			</div>

			{#if contactContext.vehicle}
				<p>
					{i18n.t('copy.1392cb97602c')} <strong>{contactContext.vehicle.shortTitle}</strong> · {contactContext
						.vehicle.year} · {contactContext.vehicle.lot}
				</p>
			{/if}

			{#if leadSubmitState === 'success'}
				<div class="mobile-contact-success" role="status" aria-live="polite">
					<MessageCircle size={23} strokeWidth={2} />
					<span>
						<strong>{i18n.t('copy.4295b1a0b719')}</strong>
						<small>{i18n.text(leadSubmitMessage)}</small>
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
						<label for="mobile-contact-company-website">{i18n.t('copy.624d565a3f48')}</label>
						<input
							{@attach i18n.validation}
							id="mobile-contact-company-website"
							name="companyWebsite"
							type="text"
							tabindex="-1"
							autocomplete="off"
							bind:value={companyWebsite}
						/>
					</div>
					<label>
						<span>{i18n.t('copy.7848bd195104')}</span>
						<input
							{@attach i18n.validation}
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={name}
							name="name"
							maxlength="140"
							type="text"
							placeholder={i18n.t('copy.62170ed5140f')}
							autocomplete="name"
							required
						/>
					</label>

					<label>
						<span>{i18n.t('copy.e998010069b6')}</span>
						<input
							{@attach i18n.validation}
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={contact}
							name="contact"
							maxlength="180"
							aria-invalid={invalidContact ? true : undefined}
							aria-describedby={invalidContact ? 'mobile-contact-error' : undefined}
							type="text"
							inputmode="text"
							placeholder={i18n.t('copy.c7427fb7089e')}
							autocomplete="off"
							required
						/>
					</label>
					<label>
						<span>{i18n.t('copy.5afae14709c7')}</span>
						<textarea
							{@attach i18n.validation}
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={message}
							name="message"
							maxlength="3500"
							rows="3"
							placeholder={i18n.t('copy.af1947d4c586')}
							required
						></textarea>
					</label>
					<button type="submit" disabled={leadSubmitState === 'submitting' || !interactive}>
						<Send size={18} strokeWidth={2} />
						<span>
							{leadSubmitState === 'submitting'
								? i18n.t('copy.acfcd771108c')
								: i18n.t('copy.8d4343e23a1b')}
						</span>
					</button>
					{#if leadSubmitMessage}
						<p
							class="mobile-contact-error"
							id="mobile-contact-error"
							role="alert"
							aria-live="polite"
						>
							{i18n.text(leadSubmitMessage)}
						</p>
					{/if}
				</form>
			{/if}
		</section>

		<section class="mobile-contact-section" aria-labelledby="mobile-contact-info-title">
			<div class="mobile-contact-heading">
				<h2 id="mobile-contact-info-title">{i18n.t('copy.b41cda79b240')}</h2>
			</div>

			<div class="mobile-contact-cards">
				{#each contactCards as card (card.id)}
					{@const Icon = card.icon}
					<div class="mobile-contact-card">
						<span class="mobile-contact-card__icon"><Icon size={21} strokeWidth={2} /></span>
						<span>
							<strong>{i18n.text(card.title)}</strong>
							<small
								>{#if card.id === 'phone'}<a href={i18n.href(phoneHref)}>{card.value}</a
									>{:else if card.id === 'address'}<a
										href={i18n.href(daynightSite.mapUrl)}
										target="_blank"
										rel="noopener noreferrer">{card.value}</a
									>{:else}{card.value}{/if}</small
							>
						</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="mobile-contact-map" aria-label={i18n.t('copy.2751c9100018')}>
			<div class="mobile-contact-map__head">
				<div>
					<h2>{i18n.t('copy.5a3113aa5669')} {i18n.dealer('city')}</h2>
				</div>
			</div>
			<iframe
				{@attach deferredMapFrame(mapEmbedSrc, '120px')}
				title={i18n.t('pattern.6b3521e28d5f', {
					v0: daynightSite.shortName,
					v1: i18n.dealer('city')
				})}
				data-map-src={mapEmbedSrc}
				height="270"
				style="border:0;width:100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
			<a
				class="mobile-contact-map__fallback"
				href={i18n.href(daynightSite.mapUrl)}
				target="_blank"
				rel="noopener noreferrer">{i18n.t('copy.8c3c925bc79b')}</a
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
