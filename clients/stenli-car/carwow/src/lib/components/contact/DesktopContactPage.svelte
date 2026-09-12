<script lang="ts">
	import { page as appPage } from '$app/state';
	import { submitImportRequest } from '$lib/client/import-request-submit';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import { readContactIntent, buildContactMessage } from '$lib/utils/contact-intent';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import {
		buildImportNotes,
		parseBudgetAmount,
		parseYearValue,
		readImportIntent
	} from '$lib/utils/import-intent';
	import { deferredMapFrame } from './deferred-map-frame';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	// Native self-contained rebuild of /contact (contact-us.html) desktop main
	// content. The look that used to come from app.css + StorefrontTemplateContent's
	// :global stylesheet (plus the body.daynight-template-contact-us-html overrides) is
	// reproduced as a SELF-CONTAINED scoped style block: the design-system generics
	// (.container/.h3/.text-body-style-2/.input-large/.btn/grid utils) are inlined and
	// every body-class override is folded into a plain scoped rule. The desktop viewport
	// (1440x1100) keeps the @992 refinements; the compact (max-height 1040 / max-width
	// 1280) and 1500px blocks are kept for smaller desktops. Brand colours stay literal
	// for an exact visual match.

	type AssetHref = `/assets/${string}`;
	type LeadSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const contactBannerSrc: AssetHref =
		'/assets/daynight-auto-v3/class-b-banners/webp/contact-showroom-entrance-banner-1x-2400x1100.webp';
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const mapLinkAttributes = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
	const initialSearchParams = appPage.url.searchParams;
	const contactContext = readContactIntent(initialSearchParams);
	const initialImportFields = readImportIntent(initialSearchParams);
	const initialEmail = initialSearchParams.get('email')?.trim() ?? '';
	const initialSubject = initialImportFields.isImport ? 'Внос на автомобил' : contactContext.subject;
	const importFields = $derived(
		readImportIntent(appPage.url.searchParams)
	);
	const isImportMode = $derived(importFields.isImport);

	let name = $state('');
	let subject = $state(initialSubject);
	let email = $state(initialEmail);
	let phone = $state(initialImportFields.phone);
	let sourceUrl = $state(initialImportFields.sourceUrl);
	let message = $state(contactContext.message);
	let leadSubmitState = $state<LeadSubmitState>('idle');
	let leadSubmitMessage = $state('');

	const leadErrorMessage = `Не успяхме да изпратим запитването. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;
	const importErrorMessage = `Не успяхме да изпратим заявката за внос. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;

	function readFormValue(formData: FormData, name: string) {
		const value = formData.get(name);
		return typeof value === 'string' ? value.trim() : '';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (leadSubmitState === 'submitting') {
			return;
		}

		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(form);
		const customerName =
			readFormValue(formData, 'name') || (isImportMode ? 'Заявка за внос от сайта' : '');
		const subjectValue = readFormValue(formData, 'subject');
		const emailValue = readFormValue(formData, 'email');
		const phoneValue = readFormValue(formData, 'phone');
		const messageValue = readFormValue(formData, 'message');
		const sourceUrlValue = readFormValue(formData, 'sourceUrl');
		const companyWebsite = readFormValue(formData, 'companyWebsite');
		const fullMessage = buildContactMessage(contactContext, messageValue, subjectValue);

		leadSubmitState = 'submitting';
		leadSubmitMessage = '';

		const result = isImportMode
			? await submitImportRequest({
					customerName,
					contact: phoneValue || emailValue,
					email: emailValue || null,
					phone: phoneValue || null,
					originCountry: 'DE',
					destinationCountry: 'BG',
					desiredMake: importFields.make || null,
					desiredModel: importFields.model || null,
					desiredYearMin: parseYearValue(importFields.year),
					desiredYearMax: null,
					budgetMin: null,
					budgetMax: parseBudgetAmount(importFields.budget),
					fuel: null,
					transmission: null,
					notes: buildImportNotes({ ...importFields, sourceUrl: sourceUrlValue }, messageValue),
					companyWebsite
				})
			: await submitLead({
					customerName,
					contact: phoneValue || emailValue,
					email: emailValue || null,
					phone: phoneValue || null,
					source: 'contact-page-desktop',
					message: fullMessage,
					companyWebsite
				});

		if (result.ok) {
			leadSubmitState = 'success';
			leadSubmitMessage = isImportMode
				? 'Благодарим! Заявката за внос е изпратена и ще Ви изпратим конкретни варианти.'
				: 'Благодарим! Ще се свържем с Вас възможно най-скоро.';
			name = '';
			subject = initialSubject;
			email = '';
			phone = '';
			sourceUrl = '';
			message = '';
			return;
		}

		leadSubmitState = 'error';
		leadSubmitMessage = result.error || (isImportMode ? importErrorMessage : leadErrorMessage);
	}
</script>

{#snippet phoneIcon()}
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet mapIcon()}
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75Z"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<div class="contact-page-root">
	<main id="main-content" tabindex="-1" aria-labelledby="daynight-contact-title">
		<DesktopYellowRouteHero
			artwork={isImportMode ? 'cars' : 'contact'}
			panel="light"
			headingId="daynight-contact-title"
			title={isImportMode ? 'Заявка за внос на автомобил' : 'Свържете се с нас'}
			copy={isImportMode
				? 'Изпратете линк, модел или бюджет и ще Ви върнем конкретна следваща стъпка.'
				: 'Оглед, документи, финансиране, бартер или въпрос за наличен автомобил.'}
			primaryLabel="Изпрати запитване"
			primaryHref="/contact#contact-form"
			secondaryLabel="Виж автомобили"
			secondaryHref="/inventory"
		/>
		<section id="contact-form" class="daynight-contact-primary bg-white pb-84">
			<div class="tf-spacing"></div>
			<div class="contact-page container">
				<div class="daynight-contact-page-banner" aria-hidden="true">
					<img
						src={desktopOnlyImagePlaceholder}
						srcset={desktopOnlySrcset(contactBannerSrc, 2400)}
						sizes={desktopOnlySizes('70vw')}
						alt=""
						aria-hidden="true"
						loading="eager"
						decoding="async"
					/>
					<span>Шоурум в София</span>
				</div>

				<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
					<div class="contact-page-info">
						<div class="daynight-contact-info-body">
							<h2 class="daynight-contact-title h3">
								{isImportMode ? 'Заявка за внос на автомобил' : 'Свържете се със СТЕНЛИ КАР'}
							</h2>
							<p class="daynight-contact-intro text-body-style-2">
								{isImportMode
									? 'Изпратете линк, модел или бюджет и ще Ви изпратим конкретни варианти за внос.'
									: 'Свържете се за оглед, документи, регистрация, финансиране, бартер или въпрос за наличен автомобил.'}
							</p>

							<div class="daynight-contact-actions">
								<a
									href={`tel:${daynightSite.phone}`}
									class="daynight-contact-action sa-cta sa-cta-primary"
								>
									{@render phoneIcon()}
									<span>Обади се / Viber</span>
								</a>
								<a
									{...mapLinkAttributes}
									class="daynight-contact-action daynight-contact-action--map sa-cta sa-cta-ghost"
								>
									{@render mapIcon()}
									<span>Виж карта</span>
								</a>
							</div>

							<div class="daynight-contact-details" aria-label="Данни за контакт">
								<div class="daynight-contact-detail daynight-contact-detail--wide">
									<p class="daynight-contact-detail-label">Адрес</p>
									<p class="daynight-contact-detail-value">{daynightSite.location}</p>
								</div>
								<div class="daynight-contact-detail">
									<p class="daynight-contact-detail-label">Телефон / Viber</p>
									<a href={`tel:${daynightSite.phone}`} class="daynight-contact-detail-value">
										{daynightSite.phoneLabel}
									</a>
								</div>
								<div class="daynight-contact-detail">
									<p class="daynight-contact-detail-label">Писмен контакт</p>
									<p class="daynight-contact-detail-value">Използвайте формата за запитване</p>
								</div>
								<div class="daynight-contact-detail daynight-contact-detail--wide">
									<p class="daynight-contact-detail-label">Работно време</p>
									<p class="daynight-contact-detail-value">
										{daynightSite.hoursLabel}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="radius-20 contact-page-form bg-white">
						<p class="h3 mb-12">{isImportMode ? 'Данни за внос' : 'Пишете ни за автомобил'}</p>
						<p class="text-body-style-2 mb-32">
							{isImportMode
								? 'Попълнете контакт и линк към обява, ако вече сте избрали автомобил.'
								: 'Пишете ни за автомобил, оглед, документи или следващи стъпки.'}
						</p>

						{#if !isImportMode && contactContext.vehicle}
							<p class="mb-20">Автомобил: <strong>{contactContext.vehicle.shortTitle}</strong> · {contactContext.vehicle.year} · {contactContext.vehicle.lot}</p>
						{/if}

						<form
							onsubmit={handleSubmit}
							aria-busy={leadSubmitState === 'submitting'}
							data-daynight-live-lead="true"
							data-daynight-import-request={isImportMode ? 'true' : undefined}
						>
							<!-- Honeypot: hidden from users, populated only by bots; dropped server-side. -->
							<div
								aria-hidden="true"
								style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"
							>
								<label for="contact-company-website">Не попълвайте това поле</label>
								<input
									id="contact-company-website"
									name="companyWebsite"
									type="text"
									aria-hidden="true"
									tabindex="-1"
									autocomplete="off"
									value=""
								/>
							</div>
							<div class="md-grid-cols-1 mb-22 grid grid-cols-2 gap-x-20 gap-y-24">
								<div class="padding-0">
									<p class="mb-8">Име</p>
									<input
										class="active input-large"
										id="contact-name"
										name="name"
										type="text"
										bind:value={name}
										placeholder="Вашето име"
										required={!isImportMode}
										aria-label="Вашето име"
									/>
								</div>
								<div class="padding-0">
									<p class="mb-8">Тема</p>
									<input
										class="input-large"
										placeholder={isImportMode ? 'Внос на автомобил' : 'Автомобил, бартер...'}
										id="contact-subject"
										name="subject"
										type="text"
										bind:value={subject}
										required
										aria-label="Тема на запитването"
									/>
								</div>
								<div class="padding-0">
									<p class="mb-8">Имейл</p>
									<input
										class="input-large"
										name="email"
										id="contact-email"
										type="email"
										bind:value={email}
										placeholder="Имейл по желание"
										aria-label="Имейл"
									/>
								</div>
								<div class="padding-0">
									<p class="mb-8">Телефон</p>
									<input
										placeholder="Въведете телефон"
										class="input-large"
										name="phone"
										id="contact-phone"
										type="tel"
										bind:value={phone}
										required
										aria-label="Телефон"
									/>
								</div>
								{#if isImportMode}
									<div class="padding-0 col-span-2">
										<p class="mb-8">Линк към обява</p>
										<input
											class="input-large"
											name="sourceUrl"
											id="contact-source-url"
											type="text"
											inputmode="url"
											bind:value={sourceUrl}
											placeholder="mobile.de, autoscout24..."
											aria-label="Линк към обява"
										/>
									</div>
								{/if}
								<div class="padding-0 col-span-2">
									<p class="mb-8">{isImportMode ? 'Какво търсите' : 'Съобщение'}</p>
									<textarea
										placeholder={isImportMode
											? 'Марка, модел, бюджет, условия или допълнителни изисквания...'
											: 'Вашето съобщение*'}
										rows="3"
										name="message"
										class="message"
										id="message"
										bind:value={message}
										required={!isImportMode}
										aria-label="Съобщение"
									></textarea>
								</div>
							</div>
							<button
								type="submit"
								class="daynight-contact-submit sa-cta w-full sa-cta-primary"
								disabled={leadSubmitState === 'submitting'}
							>
								{leadSubmitState === 'submitting'
									? 'Изпращаме...'
									: isImportMode
										? 'Изпрати заявка'
										: 'Изпрати запитване'}
							</button>
							{#if leadSubmitMessage}
								<p
									class={[
										'daynight-form-status font-weight-600 mt-12',
										leadSubmitState === 'success' && 'text-highlight',
										leadSubmitState === 'error' && 'daynight-form-status--error'
									]}
									role={leadSubmitState === 'error' ? 'alert' : 'status'}
									aria-live="polite"
								>
									{leadSubmitMessage}
								</p>
							{/if}
						</form>
					</div>
				</div>
			</div>
		</section>

		<section class="daynight-contact-map bg-white">
			<div class="mx-auto w-full max-w-1920">
				<div class="widget-gg-map radius-8 daynight-contact-map__frame flex overflow-hidden">
					<iframe
						{@attach deferredMapFrame(mapEmbedSrc, '180px')}
						title="Карта до СТЕНЛИ КАР София"
						data-map-src={mapEmbedSrc}
						height="520"
						style="border:0;width: 100%;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
					></iframe>
					<div class="daynight-contact-map__overlay" aria-label="Локация СТЕНЛИ КАР">
						<p class="daynight-contact-map__eyebrow">СТЕНЛИ КАР</p>
						<p class="daynight-contact-map__address">{daynightSite.location}</p>
						<a {...mapLinkAttributes}>Отвори в Google Maps</a>
					</div>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	/* Self-contained scoped styles for /contact. Inlines the StorefrontTemplateContent
	   :global generics the markup uses and folds every body.daynight-template-contact-us-html
	   override into a plain scoped rule. Brand neutrals stay literal for an exact match. */

	.contact-page-root {
		box-sizing: border-box;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		letter-spacing: 0;
	}

	/* Universal reset at low specificity so margin utilities still win. */
	.contact-page-root :global(*) {
		box-sizing: border-box;
		margin: 0;
	}

	.contact-page-root :global(a:not(.sa-cta)) {
		color: inherit;
		text-decoration: none;
	}

	.contact-page-root :global(img) {
		display: block;
		max-width: 100%;
	}

	/* StorefrontTemplateContent generics used by the markup */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.bg-white {
		background: #fff;
	}

	.pb-84 {
		padding-bottom: 84px;
	}

	.tf-spacing {
		height: 48px;
	}

	.grid {
		display: grid;
	}

	.grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.gap-30 {
		gap: 30px;
	}

	.gap-x-20 {
		column-gap: 20px;
	}

	.gap-y-24 {
		row-gap: 24px;
	}

	.col-span-2 {
		grid-column: span 2;
	}

	.padding-0 {
		padding: 0;
	}

	.mx-auto {
		margin-right: auto;
		margin-left: auto;
	}

	.w-full {
		width: 100%;
	}

	.max-w-1920 {
		max-width: 1920px;
	}

	.flex {
		display: flex;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	.radius-8 {
		border-radius: 8px;
	}

	.widget-gg-map {
		width: 100%;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-22 {
		margin-bottom: 22px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	.mt-12 {
		margin-top: 12px;
	}

	.font-weight-600 {
		font-weight: 600;
	}

	.text-highlight {
		color: var(--desktop-action);
	}

	.h3 {
		font-size: clamp(24px, 2.4vw, 32px);
		font-weight: 700;
		line-height: 1.16;
	}

	.text-body-style-2 {
		color: #4b5565;
		font-size: var(--sa-text-desktop-body);
		line-height: 1.7;
	}

	/* Form fields — StorefrontTemplateContent input/select/textarea base + .input-large
	   height, with the @992 desktop border/background folded in below. */
	.input-large {
		width: 100%;
		height: 56px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font: inherit;
		font-size: var(--sa-text-desktop-body);
		font-weight: 600;
		outline: 0;
		padding: 0 16px;
	}

	textarea.message {
		width: 100%;
		min-height: 120px;
		resize: vertical;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font: inherit;
		font-size: var(--sa-text-desktop-body);
		font-weight: 600;
		outline: 0;
		padding: 14px 16px;
	}

	.input-large:focus,
	textarea.message:focus {
		border-color: var(--desktop-action);
		box-shadow: none;
		outline: 2px solid var(--desktop-focus);
		outline-offset: 2px;
	}

	/* Component-specific contact styles (verbatim from the template build). */
	.daynight-form-status--error {
		color: #b91c1c;
	}

	.daynight-contact-primary .contact-page-info {
		overflow: hidden;
		padding: 0;
		height: 100%;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
		box-shadow: none;
		text-align: left;
	}

	.daynight-contact-primary .contact-page > .grid {
		align-items: stretch;
		gap: 28px;
	}

	.daynight-contact-primary .contact-page-form {
		height: auto;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
		box-shadow: none;
		padding: 34px;
	}

	.daynight-contact-page-banner {
		position: relative;
		height: clamp(88px, 6.4vw, 118px);
		margin-bottom: 22px;
		overflow: hidden;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #0c1c36;
	}

	.daynight-contact-page-banner img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 58% center;
		filter: saturate(1.02) contrast(1.02);
	}

	.daynight-contact-page-banner::after {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(5, 22, 58, 0.76), rgba(5, 22, 58, 0.1)),
			linear-gradient(0deg, rgba(176, 0, 0, 0.1), rgba(176, 0, 0, 0.1));
		content: '';
	}

	.daynight-contact-page-banner span {
		position: absolute;
		left: 22px;
		bottom: 18px;
		z-index: 3;
		display: inline-flex;
		border-radius: 999px;
		background: #e4072f;
		padding: 8px 12px;
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1;
	}

	.daynight-contact-info-body {
		display: flex;
		min-height: 100%;
		flex-direction: column;
		padding: 28px 30px;
	}

	.daynight-contact-info-body .daynight-contact-title {
		max-width: 560px;
		margin: 0 0 10px;
		letter-spacing: 0;
		font-weight: 700;
		font-size: 36px;
		line-height: 1.16;
		text-align: left;
	}

	.contact-page-form > .h3 {
		margin-bottom: 10px;
		letter-spacing: 0;
		font-size: 29px;
		font-weight: 700;
		line-height: 1.16;
	}

	.daynight-contact-intro {
		max-width: 560px;
		margin: 0 0 20px;
		color: #42526a;
		line-height: 1.52;
	}

	.daynight-contact-details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		flex: 1 1 auto;
		overflow: hidden;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
	}

	.daynight-contact-detail {
		display: flex;
		min-width: 0;
		flex-direction: column;
		justify-content: center;
		border-top: 1px solid var(--desktop-control-border);
		padding: 15px 16px;
	}

	.daynight-contact-detail:nth-child(2n + 3) {
		border-left: 1px solid var(--desktop-control-border);
	}

	.daynight-contact-detail:first-child {
		border-top: 0;
	}

	.daynight-contact-detail--wide {
		grid-column: 1 / -1;
	}

	.daynight-contact-detail-label {
		margin: 0 0 5px;
		color: var(--desktop-action);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: 0;
		line-height: 1.2;
	}

	.daynight-contact-detail-value {
		margin: 0;
		color: #42526a;
		font-size: var(--sa-text-desktop-dense);
		font-weight: 500;
		line-height: 1.45;
	}

	a.daynight-contact-detail-value {
		display: inline-flex;
		width: auto;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		text-decoration: none;
		white-space: nowrap;
	}

	.daynight-contact-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin: 0 0 20px;
	}

	.daynight-contact-action {
		min-width: 0;
		--sa-cta-font-size: var(--sa-text-desktop-action-sm);
		--sa-cta-gap: 8px;
		--sa-cta-height: 48px;
		--sa-cta-pad-x: 16px;
		width: 100%;
	}

	.daynight-contact-action span {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.daynight-contact-action :global(svg),
	.daynight-contact-action :global(svg *) {
		flex: 0 0 auto;
		color: currentColor;
		stroke: currentColor;
	}

	.daynight-contact-action :global(svg [fill='#1C1C1C']) {
		fill: currentColor;
	}

	.daynight-contact-submit {
		--sa-cta-gap: 9px;
		--sa-cta-font-size: var(--sa-text-desktop-action-sm);
		--sa-cta-height: 50px;
		--sa-cta-pad-x: 22px;
	}

	@media (min-width: 992px) {
		.daynight-contact-primary .contact-page-form .md-grid-cols-1 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.daynight-contact-primary .contact-page-form .input-large,
		.daynight-contact-primary .contact-page-form textarea.message {
			border-color: var(--desktop-control-border);
			background: var(--desktop-panel);
		}

		.daynight-contact-primary .contact-page-form .input-large:focus,
		.daynight-contact-primary .contact-page-form textarea.message:focus {
			border-color: var(--desktop-action);
			background: #fff;
			box-shadow: none;
			outline: 2px solid var(--desktop-action);
			outline-offset: 0;
		}

		.daynight-contact-primary .contact-page-form form > .grid > div > p {
			color: #111827;
			font-weight: 600;
		}

		.daynight-contact-primary .contact-page-form input,
		.daynight-contact-primary .contact-page-form textarea {
			font-weight: 500;
		}

		.daynight-contact-primary .contact-page-form input::placeholder,
		.daynight-contact-primary .contact-page-form textarea::placeholder {
			color: #667085;
			font-weight: 500;
		}

		.daynight-contact-primary .contact-page-form .daynight-contact-submit {
			box-shadow: none;
		}

		.daynight-contact-primary .contact-page-form .daynight-contact-submit:hover,
		.daynight-contact-primary .contact-page-form .daynight-contact-submit:focus-visible {
			box-shadow: none;
			transform: none;
		}
	}

	@media (min-width: 992px) and (max-height: 1040px), (min-width: 992px) and (max-width: 1280px) {
		.daynight-contact-primary.pb-84 {
			padding-bottom: 44px;
		}

		.daynight-contact-primary .tf-spacing {
			height: 16px;
		}

		.daynight-contact-page-banner {
			height: 62px;
			margin-bottom: 14px;
		}

		.daynight-contact-page-banner span {
			left: 20px;
			bottom: 10px;
			padding: 6px 10px;
			font-size: var(--sa-text-sm);
		}

		.daynight-contact-info-body {
			padding: 20px 24px;
		}

		.daynight-contact-info-body .daynight-contact-title {
			margin-bottom: 7px;
			font-size: 32px;
			line-height: 1.16;
		}

		.daynight-contact-primary .contact-page .daynight-contact-info-body .daynight-contact-title {
			margin-bottom: 7px;
			font-size: 32px;
			line-height: 1.16;
		}

		.daynight-contact-intro {
			margin-bottom: 13px;
			font-size: var(--sa-text-desktop-dense);
			line-height: 1.4;
		}

		.daynight-contact-actions {
			margin-bottom: 13px;
		}

		.daynight-contact-detail {
			padding: 10px 12px;
		}

		.daynight-contact-detail-label {
			margin-bottom: 3px;
			font-size: var(--sa-text-sm);
		}

		.daynight-contact-detail-value {
			font-size: var(--sa-text-desktop-dense);
			line-height: 1.35;
		}

		.daynight-contact-primary .contact-page-form {
			padding: 20px 24px;
		}

		.daynight-contact-primary .contact-page-form > .h3 {
			margin-bottom: 7px;
			font-size: 26px;
			font-weight: 700;
			line-height: 1.16;
		}

		.contact-page-form > .h3 {
			margin-bottom: 7px;
			font-size: 26px;
			font-weight: 700;
			line-height: 1.16;
		}

		.daynight-contact-primary .contact-page .contact-page-form > .h3 {
			margin-bottom: 7px;
			font-size: 26px;
			font-weight: 700;
			line-height: 1.16;
		}

		.daynight-contact-primary .contact-page-form > .text-body-style-2 {
			margin-bottom: 13px;
			font-size: var(--sa-text-desktop-dense);
			line-height: 1.4;
		}

		.daynight-contact-primary .contact-page-form .gap-y-24 {
			row-gap: 10px;
		}

		.daynight-contact-primary .contact-page-form .mb-22 {
			margin-bottom: 12px;
		}

		.daynight-contact-primary .contact-page-form .input-large {
			height: 44px;
		}

		.daynight-contact-primary .contact-page-form textarea.message {
			min-height: 80px;
		}

		.daynight-contact-primary .contact-page-form .daynight-contact-submit {
			--sa-cta-height: 50px;
			height: 50px;
		}
	}

	@media (min-width: 1500px) and (max-height: 1040px) {
		.daynight-contact-page-banner {
			height: 92px;
		}

		.daynight-contact-info-body {
			padding: 26px 28px;
		}

		.daynight-contact-primary .contact-page-form {
			padding: 26px 28px;
		}

		.daynight-contact-info-body .daynight-contact-title {
			font-size: 36px;
		}

		.daynight-contact-intro {
			margin-bottom: 18px;
		}

		.daynight-contact-actions {
			margin-bottom: 18px;
		}

		.daynight-contact-detail {
			padding: 14px 16px;
		}
	}

	.daynight-contact-map__frame {
		position: relative;
		min-height: 520px;
		background-color: #eef3f9;
		background-image:
			linear-gradient(90deg, rgba(8, 20, 42, 0.7), rgba(8, 20, 42, 0.18)),
			url('/assets/daynight-auto-v3/class-b-banners/webp/contact-showroom-entrance-banner-1x-2400x1100.webp');
		background-position: center;
		background-size: cover;
	}

	.daynight-contact-map__frame iframe {
		position: relative;
		z-index: 1;
		display: block;
		min-height: 520px;
		opacity: 1;
		transition: opacity 180ms ease;
	}

	.daynight-contact-map__frame iframe:not([src]) {
		opacity: 0;
	}

	.daynight-contact-map__overlay {
		position: absolute;
		right: 32px;
		bottom: 32px;
		z-index: 2;
		display: grid;
		max-width: min(390px, calc(100% - 48px));
		gap: 10px;
		border: 1px solid rgba(17, 24, 39, 0.1);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: none;
		padding: 20px 22px;
	}

	.daynight-contact-map__eyebrow {
		margin: 0;
		color: var(--desktop-action);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: 0;
		line-height: var(--sa-leading-snug);
		text-transform: uppercase;
	}

	.daynight-contact-map__address {
		margin: 0;
		color: #111827;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.24;
	}

	.daynight-contact-map__overlay a {
		color: #cf2029;
		font-size: var(--sa-text-desktop-dense);
		font-weight: var(--sa-weight-semibold);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-84 {
			padding-bottom: 56px;
		}

		.md-grid-cols-1 {
			grid-template-columns: 1fr;
		}

		.lg-grid-cols-1 {
			grid-template-columns: 1fr;
		}

		.daynight-contact-map__overlay {
			right: 16px;
			bottom: 16px;
			left: 16px;
			max-width: none;
			padding: 16px;
		}
	}

	@media (max-width: 1100px) {
		.lg-grid-cols-1 {
			grid-template-columns: 1fr;
		}
	}
</style>
