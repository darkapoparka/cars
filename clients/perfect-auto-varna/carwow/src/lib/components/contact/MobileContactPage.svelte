<script lang="ts">
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';
	import MobilePromoCard from '$lib/components/shared/MobilePromoCard.svelte';
	import {
		CarFront,
		ChevronRight,
		CircleCheck,
		Clock,
		Link,
		MapPin,
		MessageCircle,
		Phone,
		PhoneCall,
		Send,
		X
	} from '@lucide/svelte';
	import { tick } from 'svelte';
	import { resolve } from '$lib/utils/preview-paths';
	import { page as appPage } from '$app/state';
	import { submitImportRequest } from '$lib/client/import-request-submit';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import { readContactIntent, buildContactMessage } from '$lib/utils/contact-intent';
	import {
		buildImportNotes,
		parseBudgetAmount,
		parseYearValue,
		readImportIntent
	} from '$lib/utils/import-intent';
	import { deferredMapFrame } from './deferred-map-frame';

	type LeadSubmitState = 'idle' | 'submitting' | 'success' | 'error';
	type ImportInfo = 'process' | 'coverage';

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const initialSearchParams = appPage.url.searchParams;
	const contactContext = readContactIntent(initialSearchParams);
	const initialImportFields = readImportIntent(initialSearchParams);
	const initialContactValue =
		initialImportFields.phone || (initialSearchParams.get('email')?.trim() ?? '');
	const importFields = $derived(
		readImportIntent(appPage.url.searchParams)
	);
	const isImportMode = $derived(importFields.isImport);

	const contactCards = [
		{
			id: 'phone',
			title: 'Телефон',
			value: daynightSite.phoneLabel,
			icon: PhoneCall
		},
		{
			id: 'email',
			title: 'Писмен контакт',
			value: 'Използвайте формата за запитване',
			icon: MessageCircle
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

	const importSteps = [
		{
			title: 'Изпращате обявата',
			copy: 'Проверяваме автомобила, продавача и условията в обявата.'
		},
		{
			title: 'Получавате конкретен разчет',
			copy: 'Уточняваме цена, транспорт, срок и необходимите документи.'
		},
		{
			title: 'Организираме вноса',
			copy: 'Координираме покупката, доставката и предаването в България.'
		}
	] as const;

	const importCoverage = [
		{
			title: 'Проверка преди решение',
			copy: 'Преглеждаме обявата и изясняваме важните детайли предварително.'
		},
		{
			title: 'Транспорт и документи',
			copy: 'Подреждаме практическите стъпки по доставката и документацията.'
		},
		{
			title: 'Ясен контакт до предаването',
			copy: 'Знаете какво следва и получавате конкретен отговор на всеки етап.'
		}
	] as const;

	let name = $state('');
	let contact = $state(initialContactValue);
	let sourceUrl = $state(initialImportFields.sourceUrl);
	let importQuery = $state(
		initialImportFields.query ||
			[initialImportFields.make, initialImportFields.model].filter(Boolean).join(' ')
	);
	let importMake = $state(initialImportFields.make);
	let importModel = $state(initialImportFields.model);
	let importYear = $state(initialImportFields.year);
	let importBudget = $state(initialImportFields.budget);
	let message = $state(contactContext.message);
	let companyWebsite = $state(''); // honeypot — only bots fill this; dropped server-side
	let leadSubmitState = $state<LeadSubmitState>('idle');
	let leadSubmitMessage = $state('');
	let importExpanded = $state(
		Boolean(
			initialImportFields.sourceUrl ||
			initialImportFields.query ||
			initialImportFields.make ||
			initialImportFields.model ||
			initialImportFields.year ||
			initialImportFields.budget ||
			initialImportFields.phone
		)
	);
	let importFormSection: HTMLElement | undefined = $state();
	let importInfoDialog: HTMLDialogElement | undefined = $state();
	let activeImportInfo = $state<ImportInfo | null>(null);

	const leadErrorMessage = `Не успяхме да изпратим запитването. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;
	const importErrorMessage = `Не успяхме да изпратим заявката за внос. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;

	async function revealImportForm() {
		importExpanded = true;
		await tick();
		importFormSection?.focus({ preventScroll: true });
		importFormSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function handleImportQuickStart(event: SubmitEvent) {
		event.preventDefault();
		void revealImportForm();
	}

	async function openImportInfo(kind: ImportInfo) {
		activeImportInfo = kind;
		await tick();
		if (importInfoDialog && !importInfoDialog.open) importInfoDialog.showModal();
	}

	function closeImportInfo() {
		if (importInfoDialog?.open) importInfoDialog.close();
		activeImportInfo = null;
	}

	function handleImportSheetBackdrop(event: MouseEvent) {
		if (event.target === event.currentTarget) closeImportInfo();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (leadSubmitState === 'submitting') {
			return;
		}

		const contactValue = contact.trim();
		const email = contactValue.includes('@') ? contactValue : null;
		const phone = email ? null : contactValue;
		const customerName = name.trim() || (isImportMode ? 'Заявка за внос от сайта' : '');

		leadSubmitState = 'submitting';
		leadSubmitMessage = '';

		const result = isImportMode
			? await submitImportRequest({
					customerName,
					contact: contactValue,
					email,
					phone,
					originCountry: 'DE',
					destinationCountry: 'BG',
					desiredMake: importMake.trim() || null,
					desiredModel: importModel.trim() || null,
					desiredYearMin: parseYearValue(importYear),
					desiredYearMax: null,
					budgetMin: null,
					budgetMax: parseBudgetAmount(importBudget),
					fuel: null,
					transmission: null,
					notes: buildImportNotes(
						{
							...importFields,
							query: importQuery.trim(),
							make: importMake.trim(),
							model: importModel.trim(),
							year: importYear.trim(),
							budget: importBudget.trim(),
							sourceUrl: sourceUrl.trim()
						},
						message
					),
					companyWebsite
				})
			: await submitLead({
					customerName,
					contact: contactValue,
					email,
					phone,
					source: 'contact-page-mobile',
					message: buildContactMessage(contactContext, message),
					companyWebsite
				});

		if (result.ok) {
			leadSubmitState = 'success';
			leadSubmitMessage = isImportMode
				? 'Заявката за внос е изпратена. Екипът ще Ви изпрати варианти и следващи стъпки.'
				: 'Екипът ще се свърже с Вас за следваща стъпка.';
			name = '';
			contact = '';
			sourceUrl = '';
			importQuery = '';
			importMake = '';
			importModel = '';
			importYear = '';
			importBudget = '';
			message = '';
			return;
		}

		leadSubmitState = 'error';
		leadSubmitMessage = result.error || (isImportMode ? importErrorMessage : leadErrorMessage);
	}

	function openMap() {
		window.open(daynightSite.mapUrl, '_blank', 'noopener,noreferrer');
	}
</script>

<div class="mobile-contact-app">
	<header class:mobile-contact-hero--import={isImportMode} class="mobile-contact-hero">
		<img
			class="mobile-contact-hero__bg"
			src={resolve('/variant-3/assets/images/pages/daynight-about-showroom-suv-v1.webp')}
			alt=""
			aria-hidden="true"
		/>
		{#if isImportMode}<MobileHeroBar />{:else}<div class="mobile-contact-hero__bar">
				<a href={resolve('/')} aria-label="Перфект Ауто начало">
					<img src={resolve('/variant-3/brand/daynight-logo-generated.png')} alt={daynightSite.shortName} />
				</a>
				<a class="mobile-contact-hero__phone" href={phoneHref} aria-label="Обади се">
					<Phone size={19} strokeWidth={2.35} />
				</a>
			</div>{/if}

		<div class="mobile-contact-hero__copy">
			{#if !isImportMode}<span class="mobile-contact-hero__label">Контакти</span>{/if}
			<h1>
				{isImportMode ? 'Намерете автомобила. Ние ще го внесем.' : 'Свържете се със Перфект Ауто'}
			</h1>
			<p>
				{isImportMode
					? 'Поставете линк — ние поемаме оттам.'
					: 'Огледи, въпроси за налични автомобили, бартер, документи и посещение на място.'}
			</p>
		</div>

		{#if isImportMode}
			<form
				class="mobile-import-quick"
				onsubmit={handleImportQuickStart}
				aria-label="Начало на заявката за внос"
			>
				<label>
					<Link size={18} strokeWidth={2.35} aria-hidden="true" />
					<input
						bind:value={sourceUrl}
						type="url"
						inputmode="url"
						placeholder="Поставете линк към обява"
						autocomplete="url"
						aria-label="Линк към обява за внос"
					/>
				</label>
				<button type="submit" aria-label="Продължи">
					<ChevronRight size={22} strokeWidth={2.7} aria-hidden="true" />
				</button>
			</form>
			<div class="mobile-import-quick__meta">
				<p>mobile.de, AutoScout24 или друга обява</p>
				<button type="button" onclick={() => revealImportForm()}>Нямам линк</button>
			</div>
		{:else}
			<div class="mobile-contact-actions">
				<a class="mobile-contact-action mobile-contact-action--call" href={phoneHref}>
					<PhoneCall size={20} strokeWidth={2.5} />
					<span>Обади се</span>
				</a>
				<button
					class="mobile-contact-action mobile-contact-action--map"
					type="button"
					onclick={openMap}
				>
					<MapPin size={20} strokeWidth={2.5} />
					<span>Карта</span>
				</button>
			</div>
		{/if}
	</header>

	<main id="main-content" tabindex="-1" class={{ 'mobile-contact-main--sheet': isImportMode }}>
		{#if !isImportMode}
			<section class="mobile-contact-section" aria-labelledby="mobile-contact-info-title">
				<div class="mobile-contact-heading">
					<span>Инфо</span>
					<h2 id="mobile-contact-info-title">Данни за контакт</h2>
				</div>

				<div class="mobile-contact-cards">
					{#each contactCards as card (card.id)}
						{@const Icon = card.icon}
						<div class="mobile-contact-card">
							<span class="mobile-contact-card__icon"><Icon size={21} strokeWidth={2.45} /></span>
							<span>
								<strong>{card.title}</strong>
								<small>{card.value}</small>
							</span>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if !isImportMode || importExpanded}
			<section
				bind:this={importFormSection}
				class:mobile-contact-form-section--import={isImportMode}
				class="mobile-contact-form-section"
				aria-labelledby="mobile-contact-form-title"
				tabindex="-1"
			>
				<div class="mobile-contact-heading">
					<span>{isImportMode ? 'Стъпка 2' : 'Запитване'}</span>
					<h2 id="mobile-contact-form-title">
						{isImportMode ? 'Уточнете търсенето' : contactContext.subject || 'Пишете ни за автомобил'}
					</h2>
				</div>

				{#if !isImportMode && contactContext.vehicle}
					<p>Автомобил: <strong>{contactContext.vehicle.shortTitle}</strong> · {contactContext.vehicle.year} · {contactContext.vehicle.lot}</p>
				{/if}

				{#if leadSubmitState === 'success'}
					<div class="mobile-contact-success" role="status" aria-live="polite">
						<MessageCircle size={23} strokeWidth={2.45} />
						<span>
							<strong>{isImportMode ? 'Заявката е изпратена' : 'Запитването е изпратено'}</strong>
							<small>{leadSubmitMessage}</small>
						</span>
					</div>
				{:else}
					<form
						class="mobile-contact-form"
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
						{#if !isImportMode}<label>
								<span>Име</span>
								<input
									bind:value={name}
									name="name"
									type="text"
									placeholder="Вашето име"
									autocomplete="name"
									required={!isImportMode}
								/>
							</label>{/if}
						{#if isImportMode}
							<label>
								<span>Какъв автомобил търсите</span>
								<input
									bind:value={importQuery}
									name="query"
									type="text"
									placeholder="BMW X5, дизел, след 2019..."
									autocomplete="off"
								/>
							</label>
							<div class="mobile-contact-form__grid">
								<label>
									<span>Година от</span>
									<input
										bind:value={importYear}
										name="year"
										type="text"
										inputmode="numeric"
										placeholder="2019"
									/>
								</label>
								<label>
									<span>Бюджет</span>
									<input
										bind:value={importBudget}
										name="budget"
										type="text"
										inputmode="numeric"
										placeholder="30 000 EUR"
									/>
								</label>
							</div>
						{/if}
						<label>
							<span>Телефон или имейл</span>
							<input
								bind:value={contact}
								name="contact"
								type="text"
								inputmode="tel"
								placeholder={daynightSite.phoneLabel}
								autocomplete="tel"
								required
							/>
						</label>
						<label>
							<span>{isImportMode ? 'Допълнителни условия' : 'Съобщение'}</span>
							<textarea
								bind:value={message}
								name="message"
								rows="3"
								placeholder={isImportMode
									? 'Оборудване, гориво или други предпочитания...'
									: 'Автомобил, оглед, бартер, документи...'}
								required={!isImportMode}
							></textarea>
						</label>
						<button type="submit" disabled={leadSubmitState === 'submitting'}>
							<Send size={18} strokeWidth={2.55} />
							<span>
								{leadSubmitState === 'submitting'
									? 'Изпращаме...'
									: isImportMode
										? 'Изпрати заявка'
										: 'Изпрати запитване'}
							</span>
						</button>
						{#if leadSubmitMessage}
							<p class="mobile-contact-error" role="alert" aria-live="polite">
								{leadSubmitMessage}
							</p>
						{/if}
					</form>
				{/if}
			</section>
		{/if}

		{#if isImportMode}
			<nav class="mobile-import-disclosures" aria-label="Повече за вноса">
				<MobilePromoCard
					title="Как работи вносът"
					description="От обявата до конкретна оферта и срок."
					label="Виж стъпките"
					image="/variant-3/assets/images/home-promos/leasing-calculator-cutout-v7.webp"
					tone="red"
					onclick={() => openImportInfo('process')}
				/>
				<MobilePromoCard
					title="Какво поемаме ние"
					description="Проверка, транспорт, документи и предаване."
					label="Виж услугата"
					image="/variant-3/assets/images/home-promos/gclass-urus-pair-v4.webp"
					cars
					onclick={() => openImportInfo('coverage')}
				/>
			</nav>

			<section class="mobile-import-contact" aria-label="Бърз контакт за внос">
				<span>
					<strong>Имате въпрос?</strong>
					<small>Ще Ви ориентираме преди да изпратите заявка.</small>
				</span>
				<a href={phoneHref}>
					<Phone size={18} strokeWidth={2.45} aria-hidden="true" />
					<span>Обади се</span>
				</a>
			</section>
		{/if}

		<section class="mobile-contact-map" aria-label="Карта">
			<div class="mobile-contact-map__head">
				<div>
					<span>Локация</span>
					<h2>Шоурум в Варна</h2>
				</div>
				<a href={resolve('/inventory')}>
					<CarFront size={18} strokeWidth={2.45} />
					<span>Коли</span>
				</a>
			</div>
			<iframe
				{@attach deferredMapFrame(mapEmbedSrc, '120px')}
				title="Карта до Перфект Ауто Варна"
				data-map-src={mapEmbedSrc}
				height="270"
				style="border:0;width:100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</section>
	</main>

	{#if isImportMode}
		<dialog
			bind:this={importInfoDialog}
			class="mobile-import-sheet"
			aria-labelledby="mobile-import-sheet-title"
			onclick={handleImportSheetBackdrop}
			onclose={() => (activeImportInfo = null)}
		>
			<div class="mobile-import-sheet__surface">
				<header
					class:mobile-import-sheet__hero--review={activeImportInfo === 'process'}
					class="mobile-import-sheet__hero"
				>
					<img
						class="mobile-import-sheet__art"
						src={resolve(
							activeImportInfo === 'process'
								? '/variant-3/assets/images/import/import-review-red-campaign-v2.webp'
								: '/variant-3/assets/images/import/import-handoff-graphite-campaign-v2.webp'
						)}
						alt=""
						aria-hidden="true"
					/>
					<img
						class="mobile-import-sheet__brand"
						src={resolve('/variant-3/brand/daynight-logo-generated.png')}
						alt=""
						aria-hidden="true"
					/>
					<div class="mobile-import-sheet__handle" aria-hidden="true"></div>
					<div class="mobile-import-sheet__title">
						<h2 id="mobile-import-sheet-title">
							{activeImportInfo === 'process' ? 'Как работи вносът' : 'Какво поемаме ние'}
						</h2>
						<p>
							{activeImportInfo === 'process'
								? 'Три ясни стъпки от обявата до доставката'
								: 'Практическа помощ до предаването на автомобила'}
						</p>
					</div>
					<button type="button" onclick={closeImportInfo} aria-label="Затвори">
						<X size={20} strokeWidth={2.45} aria-hidden="true" />
					</button>
				</header>

				<div class="mobile-import-sheet__body">
					<div class="mobile-import-sheet__list">
						{#each activeImportInfo === 'process' ? importSteps : importCoverage as item, index (item.title)}
							<article>
								{#if activeImportInfo === 'process'}
									<span class="mobile-import-sheet__number">0{index + 1}</span>
								{:else}
									<span class="mobile-import-sheet__check"
										><CircleCheck size={20} strokeWidth={2.4} aria-hidden="true" /></span
									>
								{/if}
								<span>
									<strong>{item.title}</strong>
									<small>{item.copy}</small>
								</span>
							</article>
						{/each}
					</div>
					<a class="mobile-import-sheet__call" href={phoneHref}>
						<Phone size={18} strokeWidth={2.45} aria-hidden="true" />
						<span>Обади се на {daynightSite.phoneLabel}</span>
					</a>
				</div>
			</div>
		</dialog>
	{/if}
</div>

<style>
	.mobile-contact-app {
		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-contact-app :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.mobile-contact-app :where(button) {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		padding: 0;
	}

	.mobile-contact-app :global(svg),
	.mobile-contact-app :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-contact-hero {
		position: relative;
		display: grid;
		gap: var(--sa-mobile-gap-md);
		overflow: hidden;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 15px;
		color: #fff;
		isolation: isolate;
	}

	.mobile-contact-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(20, 100, 218, 0.88);
		content: '';
	}

	.mobile-contact-hero--import {
		gap: 12px;
		background: #05070a;
		padding-bottom: 18px;
	}

	.mobile-contact-hero--import::after {
		background:
			linear-gradient(180deg, rgba(3, 5, 8, 0.72) 0%, rgba(3, 5, 8, 0.94) 76%),
			linear-gradient(90deg, rgba(213, 0, 50, 0.13), transparent 48%);
	}

	.mobile-contact-hero--import .mobile-contact-hero__bg {
		opacity: 0.48;
		object-position: 62% center;
	}

	.mobile-contact-hero--import .mobile-contact-hero__copy {
		max-width: 318px;
	}

	.mobile-contact-hero.mobile-contact-hero--import h1 {
		line-height: 1.2;
	}

	.mobile-contact-hero.mobile-contact-hero--import p {
		color: rgba(255, 255, 255, 0.86);
		font-weight: 600;
	}

	.mobile-contact-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.42;
		object-fit: cover;
		object-position: center;
	}

	.mobile-contact-hero__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-contact-hero__bar img {
		display: block;
		width: 170px;
		height: auto;
	}

	.mobile-contact-hero__phone {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.34);
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		color: #fff !important;
	}

	.mobile-contact-hero__phone :global(svg),
	.mobile-contact-hero__phone :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-contact-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 330px;
	}

	.mobile-contact-heading span,
	.mobile-contact-map__head span {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-contact-hero__label {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-contact-hero h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.07;
	}

	.mobile-contact-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.88);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-import-quick {
		display: flex;
		width: 100%;
		min-height: var(--sa-mobile-search-h);
		align-items: center;
		box-sizing: border-box;
		gap: 8px;
		margin-top: 2px;
		border-radius: var(--sa-r-pill);
		background: #fff;
		padding: 4px 4px 4px 13px;
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
	}

	.mobile-import-quick:focus-within {
		box-shadow:
			0 0 0 2px rgba(224, 0, 50, 0.78),
			0 12px 32px rgba(0, 0, 0, 0.24);
	}

	.mobile-import-quick label {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		flex: 1 1 auto;
		gap: 8px;
		min-width: 0;
		min-height: 48px;
		align-items: center;
		color: #697483;
		padding: 0;
	}

	.mobile-import-quick input {
		width: 100%;
		min-width: 0;
		appearance: none;
		border: 0;
		background: transparent;
		color: #111827;
		font: 750 15px/1.2 var(--sa-font);
		outline: 0;
		padding: 0;
	}

	.mobile-import-quick input::placeholder {
		color: #626d7a;
		opacity: 1;
	}

	.mobile-import-quick > button {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: #050505;
		color: #fff;
		transition: transform 0.16s ease-out;
	}

	.mobile-import-quick > button :global(svg),
	.mobile-import-quick > button :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-import-quick > button:active {
		transform: scale(0.94);
	}

	.mobile-import-quick__meta {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 12px;
	}

	.mobile-import-quick__meta p {
		margin: 0;
		color: rgba(255, 255, 255, 0.68);
		font-size: 10px;
		font-weight: 650;
		line-height: 1.3;
	}

	.mobile-import-quick__meta button {
		display: inline-flex;
		min-height: 44px;
		flex: 0 0 auto;
		align-items: center;
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		line-height: 1.2;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.mobile-contact-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-action {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1;
	}

	.mobile-contact-action span,
	.mobile-contact-action :global(svg),
	.mobile-contact-action :global(svg *) {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-contact-action--call {
		background: var(--sa-red);
	}

	.mobile-contact-action--map {
		background: #0b63d8;
	}

	.mobile-contact-app main {
		display: grid;
		gap: var(--sa-mobile-page-gap);
		padding: 13px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-contact-app main.mobile-contact-main--sheet {
		position: relative;
		z-index: 2;
		margin-top: -14px;
		border-radius: 22px 22px 0 0;
		background: #fff;
		padding-top: 27px;
	}

	.mobile-contact-section,
	.mobile-contact-form-section {
		display: grid;
		gap: var(--sa-mobile-section-gap);
	}

	.mobile-contact-form-section--import {
		position: relative;
		z-index: 3;
		order: -1;
		margin-top: -30px;
		border-radius: 16px;
		background: #fff;
		padding: 17px 14px 14px;
		scroll-margin-top: 12px;
		box-shadow: 0 18px 42px rgba(8, 12, 18, 0.2);
	}

	.mobile-contact-heading {
		display: grid;
		gap: 5px;
	}

	.mobile-contact-heading span,
	.mobile-contact-map__head span {
		color: var(--sa-blue);
	}

	.mobile-contact-heading h2,
	.mobile-contact-map__head h2 {
		margin: 0;
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.1;
	}

	.mobile-contact-cards,
	.mobile-contact-form {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-form__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 18px;
		min-height: 72px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 8px;
		background: #f4f6f9;
		padding: 10px 12px;
	}

	.mobile-contact-card:not(a) {
		grid-template-columns: 42px minmax(0, 1fr);
	}

	.mobile-contact-card__icon {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue);
	}

	.mobile-contact-card > span:nth-child(2) {
		display: grid;
		min-width: 0;
		gap: 4px;
	}

	.mobile-contact-card strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-contact-card small {
		overflow: hidden;
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
		text-overflow: ellipsis;
	}

	.mobile-contact-card > :global(svg) {
		justify-self: end;
		color: #6b7280;
	}

	.mobile-contact-form label {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		min-width: 0;
		border: 1px solid #dfe5ec;
		border-radius: 12px;
		background: #eef1f6;
		padding: 8px 11px;
	}

	.mobile-contact-form label:focus-within {
		border-color: rgba(176, 0, 0, 0.52);
		box-shadow: none;
	}

	.mobile-contact-form label span {
		color: #56616e;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-contact-form input,
	.mobile-contact-form textarea {
		width: 100%;
		min-width: 0;
		min-height: 44px;
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
		resize: vertical;
	}

	.mobile-contact-form input::placeholder,
	.mobile-contact-form textarea::placeholder {
		color: #626d7a;
		opacity: 1;
	}

	.mobile-contact-form button {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		background: var(--sa-red);
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.mobile-contact-form button:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.mobile-contact-error {
		margin: 0;
		border-radius: 8px;
		background: #fff1f2;
		padding: 10px 11px;
		color: #b91c1c;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1.32;
	}

	.mobile-contact-success {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		border-radius: 8px;
		background: #eef4ff;
		padding: 13px 12px;
		color: #111827;
	}

	.mobile-contact-success :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-contact-success span {
		display: grid;
		gap: 3px;
	}

	.mobile-contact-success strong {
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.12;
	}

	.mobile-contact-success small {
		color: #647084;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
	}

	.mobile-import-disclosures {
		display: grid;
		gap: 10px;
	}

	.mobile-import-contact {
		display: flex;
		min-height: 72px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 1px solid #e0e5eb;
		border-radius: 14px;
		background: #f4f6f9;
		padding: 10px 10px 10px 13px;
	}

	.mobile-import-contact > span {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.mobile-import-contact strong {
		font-size: 15px;
		font-weight: 850;
		line-height: 1.15;
	}

	.mobile-import-contact small {
		color: #626d79;
		font-size: 11px;
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-import-contact a {
		display: inline-flex;
		min-height: 44px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 10px;
		background: var(--sa-red);
		color: #fff !important;
		font-size: 12px;
		font-weight: 850;
		padding: 0 12px;
	}

	.mobile-import-contact a :global(svg),
	.mobile-import-contact a :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-import-sheet {
		width: min(100%, 480px);
		max-width: none;
		max-height: none;
		margin: auto auto 0;
		overflow: visible;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		padding: 0;
	}

	.mobile-import-sheet::backdrop {
		background: rgba(3, 5, 8, 0.72);
		backdrop-filter: blur(3px);
	}

	.mobile-import-sheet[open] {
		animation: mobile-import-sheet-in 0.24s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.mobile-import-sheet__surface {
		display: grid;
		max-height: min(82svh, 680px);
		grid-template-rows: auto minmax(0, 1fr);
		overflow: hidden;
		border-radius: 24px 24px 0 0;
		background: #f1f3f6;
		box-shadow: 0 -18px 52px rgba(3, 5, 8, 0.32);
	}

	.mobile-import-sheet__hero {
		position: relative;
		display: grid;
		min-height: 148px;
		align-content: end;
		overflow: hidden;
		background: #080b0f;
		color: #fff;
		padding: 46px 60px 16px 16px;
		isolation: isolate;
	}

	.mobile-import-sheet__hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(180deg, rgba(3, 5, 8, 0.18) 0%, rgba(3, 5, 8, 0.94) 100%);
		content: '';
	}

	.mobile-import-sheet__hero--review::after {
		background: linear-gradient(180deg, rgba(90, 0, 18, 0.08) 0%, rgba(65, 0, 14, 0.9) 100%);
	}

	.mobile-import-sheet__art {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mobile-import-sheet__brand {
		position: absolute;
		top: 14px;
		left: 16px;
		z-index: 2;
		width: 104px;
		height: auto;
		filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.42));
		pointer-events: none;
	}

	.mobile-import-sheet__handle {
		position: absolute;
		top: 9px;
		left: 50%;
		width: 38px;
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.68);
		transform: translateX(-50%);
	}

	.mobile-import-sheet__title {
		display: grid;
		gap: 3px;
	}

	.mobile-import-sheet__title h2,
	.mobile-import-sheet__title p {
		margin: 0;
	}

	.mobile-import-sheet__title h2 {
		font-size: 22px;
		font-weight: 850;
		line-height: 1.08;
		letter-spacing: -0.02em;
	}

	.mobile-import-sheet__title p {
		color: rgba(255, 255, 255, 0.78);
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-import-sheet__hero > button {
		position: absolute;
		top: 14px;
		right: 14px;
		display: grid;
		width: 42px;
		height: 42px;
		place-items: center;
		border-radius: 50%;
		background: rgba(3, 5, 8, 0.78);
		color: #fff;
		cursor: pointer;
		backdrop-filter: blur(6px);
	}

	.mobile-import-sheet__hero > button :global(svg),
	.mobile-import-sheet__hero > button :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-import-sheet__body {
		display: grid;
		align-content: start;
		gap: 10px;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 12px 14px calc(14px + env(safe-area-inset-bottom));
	}

	.mobile-import-sheet__list {
		display: grid;
		gap: 8px;
	}

	.mobile-import-sheet__list article {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		align-items: center;
		gap: 11px;
		min-height: 70px;
		border: 1px solid #e0e5eb;
		border-radius: 13px;
		background: #fff;
		padding: 9px 11px;
	}

	.mobile-import-sheet__number,
	.mobile-import-sheet__check {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border-radius: 11px;
		background: #090b0e;
		color: #fff;
		font-size: 12px;
		font-weight: 850;
		line-height: 1;
	}

	.mobile-import-sheet__check :global(svg),
	.mobile-import-sheet__check :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-import-sheet__list article > span:last-child {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.mobile-import-sheet__list strong {
		font-size: 15px;
		font-weight: 850;
		line-height: 1.15;
	}

	.mobile-import-sheet__list small {
		color: #626d79;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-import-sheet__call {
		display: inline-flex;
		min-height: 52px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 12px;
		background: var(--sa-red);
		color: #fff !important;
		font-size: 14px;
		font-weight: 850;
	}

	.mobile-import-sheet__call :global(svg),
	.mobile-import-sheet__call :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	@keyframes mobile-import-sheet-in {
		from {
			opacity: 0.94;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-import-sheet[open] {
			animation: none;
			transition: none;
		}
	}

	.mobile-contact-map {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
		overflow: hidden;
		border-radius: 8px;
		background: #f4f6f9;
		padding: 12px;
	}

	.mobile-contact-map__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-map__head > div {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.mobile-contact-map__head a {
		display: inline-flex;
		min-height: var(--sa-mobile-hero-cta-h);
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 999px;
		background: #fff;
		padding: 0 12px;
		color: var(--sa-blue) !important;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		white-space: nowrap;
	}

	.mobile-contact-map iframe {
		display: block;
		overflow: hidden;
		border-radius: 8px;
		background: #dbe3ec;
	}

	@media (max-width: 430px) {
		.mobile-contact-app main:not(.mobile-contact-main--sheet) {
			gap: 8px;
		}

		.mobile-contact-section,
		.mobile-contact-form-section {
			gap: 8px;
		}

		.mobile-contact-cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.mobile-contact-card,
		.mobile-contact-card:not(a) {
			grid-template-columns: minmax(0, 1fr);
			min-height: 88px;
			align-content: center;
			gap: 6px;
			padding: 9px 10px;
		}

		.mobile-contact-card__icon {
			width: 36px;
			height: 36px;
		}

		.mobile-contact-form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 4px;
		}

		.mobile-contact-form > label:nth-of-type(3),
		.mobile-contact-form > button,
		.mobile-contact-form > .mobile-contact-error {
			grid-column: 1 / -1;
		}

		.mobile-contact-form label {
			padding: 6px 11px;
		}

		.mobile-contact-form input,
		.mobile-contact-form textarea {
			min-height: 36px;
		}
	}

	@media (max-width: 991px) {
		.mobile-contact-app main:not(.mobile-contact-main--sheet) .mobile-contact-form-section {
			order: -1;
		}

		.mobile-contact-app {
			display: block;
		}
	}
</style>
