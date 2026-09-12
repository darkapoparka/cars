<script lang="ts">
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';
	import MobilePromoCard from '$lib/components/shared/MobilePromoCard.svelte';
	import { CircleCheck, ChevronLeft, ChevronRight, Phone, X } from '@lucide/svelte';
	import { tick, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';

	type SellSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { initialPath = '/sell-your-car' }: { initialPath?: string } = $props();

	// Prefill from the request query params so the form keeps its values when the
	// visitor comes back from the confirmation step (or lands on a shared link).
	const initialParam = (key: string) =>
		browser ? (appPage.url.searchParams.get(key)?.trim() ?? '') : '';

	let plate = $state(initialParam('plate'));
	let vin = $state(initialParam('vin'));
	let make = $state(initialParam('make'));
	let model = $state(initialParam('model'));
	let year = $state(initialParam('year'));
	let mileage = $state(initialParam('mileage'));
	let phone = $state(initialParam('phone'));
	let companyWebsite = $state(''); // honeypot — only bots fill this; dropped server-side
	let sellSubmitState = $state<SellSubmitState>('idle');
	let sellSubmitMessage = $state('');
	let detailsExpanded = $state(
		untrack(() => initialPath.endsWith('/request')) ||
			(browser &&
				['plate', 'vin', 'make', 'model', 'year', 'mileage', 'phone'].some((key) =>
					initialParam(key)
				))
	);
	let detailsDialog: HTMLDialogElement | undefined = $state();
	let infoDialog: HTMLDialogElement | undefined = $state();
	let activeInfo = $state<'process' | 'benefits' | null>(null);
	let formStep = $state<1 | 2>(1);

	// Confirmation is an outcome of the validated API response, never a URL state.
	// Reloads and direct/shared request links start the existing intake again.
	const isRequestStep = $derived(sellSubmitState === 'success');

	const submittedFields = $derived.by(() => {
		const labels: [string, string][] = [
			[plate, 'Рег. номер'],
			[vin, 'VIN'],
			[make, 'Make'],
			[model, 'Model'],
			[year, 'Year'],
			[mileage, 'Километри'],
			[phone, 'Phone']
		];
		return labels
			.map(([value, label]) => ({ label, value: value.trim() }))
			.filter((field) => field.value);
	});

	const phoneHref = `tel:${daynightSite.phone}`;
	const sellErrorMessage = `Не успяхме да изпратим заявката. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;
	const quickContext = $derived(
		plate.trim() ? `Рег. номер ${plate.trim().toUpperCase()}` : 'Без регистрационен номер'
	);

	$effect(() => {
		if (detailsExpanded && !isRequestStep && detailsDialog && !detailsDialog.open) {
			detailsDialog.showModal();
			detailsDialog.querySelector<HTMLInputElement>('[data-autofocus]')?.focus();
		}
	});

	async function revealDetails() {
		formStep = 1;
		detailsExpanded = true;
		await tick();
		if (detailsDialog && !detailsDialog.open) {
			detailsDialog.showModal();
			detailsDialog.querySelector<HTMLInputElement>('[data-autofocus]')?.focus();
		}
	}

	function closeDetails() {
		detailsExpanded = false;
		if (detailsDialog?.open) detailsDialog.close();
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
	}

	async function goToContactStep() {
		formStep = 2;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
		await tick();
		detailsDialog?.querySelector<HTMLInputElement>('[data-contact-autofocus]')?.focus();
	}

	async function goToVehicleStep() {
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
		await tick();
		detailsDialog?.querySelector<HTMLInputElement>('[data-autofocus]')?.focus();
	}

	async function openInfo(kind: 'process' | 'benefits') {
		activeInfo = kind;
		await tick();
		if (infoDialog && !infoDialog.open) infoDialog.showModal();
	}

	function closeInfo() {
		if (infoDialog?.open) infoDialog.close();
		activeInfo = null;
	}

	function handleSheetBackdrop(event: MouseEvent, close: () => void) {
		if (event.target === event.currentTarget) close();
	}

	function handleQuickStart(event: SubmitEvent) {
		event.preventDefault();
		void revealDetails();
	}

	function buildNotes() {
		return [
			['Рег. номер', plate.trim().toUpperCase()],
			['VIN', vin.trim().toUpperCase()],
			['Make', make.trim()],
			['Model', model.trim()],
			['Year', year.trim()],
			['Километри', mileage.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => `${label}: ${value}`)
			.join('\n');
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (formStep === 1) {
			await goToContactStep();
			return;
		}

		if (sellSubmitState === 'submitting') {
			return;
		}

		const contactValue = phone.trim();

		if (!contactValue) {
			sellSubmitState = 'error';
			sellSubmitMessage = 'Моля, въведете телефон, за да Ви изпратим оценка и следваща стъпка.';
			return;
		}

		sellSubmitState = 'submitting';
		sellSubmitMessage = '';

		const result = await submitLead({
			customerName: 'Мобилна заявка за оценка',
			contact: contactValue,
			email: null,
			phone: contactValue,
			source: 'sell-your-car-mobile',
			message: buildNotes(),
			companyWebsite
		});

		if (result.ok) {
			sellSubmitState = 'success';
			sellSubmitMessage = '';
			detailsExpanded = false;
			if (detailsDialog?.open) detailsDialog.close();
			await tick();
			document.getElementById('ms-confirm-title')?.focus();
			return;
		}

		sellSubmitState = 'error';
		sellSubmitMessage = result.error || sellErrorMessage;
	}

	const steps = [
		{
			title: 'Въвеждате данните',
			copy: 'Рег. номер или марка, модел, година и километри.'
		},
		{
			title: 'Изпращате снимки',
			copy: 'Проверяваме състояние, история и реални пазарни цени.'
		},
		{
			title: 'Получавате вариант',
			copy: 'Изкупуване, бартер към налична кола или оглед.'
		}
	];
</script>

<div class="mobile-sell">
	<header class="ms-hero">
		<img
			class="ms-hero__bg"
			src={resolve('/assets/images/sell/trade-in-promo-v1.webp')}
			alt=""
			aria-hidden="true"
		/>
		<MobileHeroBar />

		<div class="ms-hero__copy">
			<h1>Продай или замени автомобила си</h1>
			<p>Започнете с номера — под минута.</p>
		</div>

		{#if !isRequestStep}
			<form class="ms-quick-start" onsubmit={handleQuickStart} aria-label="Начало на заявката">
				<label>
					<span>Регистрационен номер</span>
					<input type="text" bind:value={plate} placeholder="СА 1234 АВ" autocomplete="off" />
				</label>
				<button type="submit" aria-label="Continue">
					<ChevronRight size={22} strokeWidth={2.7} aria-hidden="true" />
				</button>
			</form>
			<div class="ms-quick-meta">
				<p>Номерът се добавя само към заявката.</p>
				<button type="button" onclick={() => revealDetails()}>Нямам номер</button>
			</div>
		{/if}
	</header>

	<main id="main-content" tabindex="-1" class={{ 'ms-main--sheet': !isRequestStep }}>
		{#if isRequestStep}
			<section class="ms-panel ms-panel--form" aria-labelledby="ms-confirm-title">
				<div class="ms-section-head">
					<div>
						<span>Готово</span>
						<h2 id="ms-confirm-title" tabindex="-1">Получихме данните</h2>
					</div>
					<CircleCheck size={26} strokeWidth={2.2} aria-hidden="true" />
				</div>

				<div class="ms-confirm-card">
					<p>
						Ще се свържем с Вас до един работен ден с оценка и следващи стъпки. Ако бързате, обадете
						се направо.
					</p>
					{#if submittedFields.length}
						<dl class="ms-confirm-summary" aria-label="Изпратени данни">
							{#each submittedFields as field (field.label)}
								<div>
									<dt>{field.label}</dt>
									<dd>{field.value}</dd>
								</div>
							{/each}
						</dl>
					{/if}
				</div>

				<a class="ms-primary-action" href={phoneHref}>
					<Phone size={17} strokeWidth={2.45} aria-hidden="true" />
					<span>Обади се сега</span>
				</a>
				<button
					class="ms-secondary-action"
					type="button"
					onclick={() => {
						sellSubmitState = 'idle';
						void revealDetails();
					}}
				>
					<span>Нова заявка</span>
				</button>
			</section>
		{/if}

		{#if !isRequestStep}
			<nav class="ms-disclosures" aria-label="Повече за услугата">
				<MobilePromoCard
					title="Как работи"
					description="Три ясни стъпки до конкретна оценка."
					label="Виж стъпките"
					image="/assets/images/home-promos/leasing-calculator-cutout-v7.webp"
					onclick={() => openInfo('process')}
				/>
				<MobilePromoCard
					title="Защо Day Night"
					description="Кристиян и екипът Ви дават ясен следващ вариант."
					label="Виж предимствата"
					image="/assets/images/home-promos/phone-portrait-generated-v7.webp"
					tone="yellow"
					portrait
					onclick={() => openInfo('benefits')}
				/>
			</nav>
		{/if}
	</main>

	{#if !isRequestStep}
		<dialog
			bind:this={detailsDialog}
			class="ms-sheet ms-sheet--form"
			aria-labelledby="ms-form-title"
			onclick={(event) => handleSheetBackdrop(event, closeDetails)}
			onclose={() => {
				detailsExpanded = false;
				formStep = 1;
			}}
		>
			<form class="ms-sheet__surface" onsubmit={handleSubmit}>
				<header class="ms-sheet__head">
					<div>
						<h2 id="ms-form-title">Оценка на автомобила</h2>
						<p>Стъпка {formStep} от 2 · {formStep === 1 ? 'Vehicle' : 'Контакт'}</p>
					</div>
					<button type="button" class="ms-sheet__close" onclick={closeDetails} aria-label="Close">
						<X size={20} strokeWidth={2.45} />
					</button>
				</header>
				<div
					class="ms-wizard-progress"
					role="progressbar"
					aria-label="Напредък на заявката"
					aria-valuemin="1"
					aria-valuemax="2"
					aria-valuenow={formStep}
				>
					<span class:active={formStep >= 1}></span>
					<span class:active={formStep >= 2}></span>
				</div>

				<div class="ms-sheet__scroll">
					{#if formStep === 1}
						<section class="ms-wizard-step" aria-labelledby="ms-vehicle-step-title">
							<div class="ms-wizard-step__intro">
								<span>Vehicle</span>
								<h3 id="ms-vehicle-step-title">Кой автомобил продавате?</h3>
								<p>{quickContext}. Добавете само данните, които знаете.</p>
							</div>
							<div class="ms-form-grid">
								<label class="ms-field">
									<span>Make</span>
									<input
										data-autofocus
										type="text"
										bind:value={make}
										placeholder="BMW"
										autocomplete="off"
									/>
								</label>
								<label class="ms-field">
									<span>Model</span>
									<input type="text" bind:value={model} placeholder="320d" autocomplete="off" />
								</label>
								<label class="ms-field">
									<span>Year</span>
									<input type="text" inputmode="numeric" bind:value={year} placeholder="2019" />
								</label>
								<label class="ms-field">
									<span>Километри</span>
									<input
										type="text"
										inputmode="numeric"
										bind:value={mileage}
										placeholder="112 000"
									/>
								</label>
								<label class="ms-field ms-field--wide ms-field--vin">
									<span>VIN (по желание)</span>
									<input
										type="text"
										bind:value={vin}
										placeholder="WBA..."
										autocomplete="off"
										aria-label="VIN номер, по желание"
									/>
								</label>
							</div>
						</section>
					{:else}
						<section class="ms-wizard-step" aria-labelledby="ms-contact-step-title">
							<div class="ms-wizard-step__intro">
								<span>Контакт</span>
								<h3 id="ms-contact-step-title">Къде да изпратим оценката?</h3>
								<p>Ще се свържем до един работен ден. Без нежелани съобщения.</p>
							</div>
							<div
								class="ms-vehicle-summary"
								role="group"
								aria-label="Въведени данни за автомобила"
							>
								<div>
									<span>Vehicle</span>
									<strong>{[make, model].filter(Boolean).join(' ') || quickContext}</strong>
									<small
										>{[year, mileage && `${mileage} км`].filter(Boolean).join(' · ') ||
											'Данните могат да се допълнят по телефона'}</small
									>
								</div>
								<button type="button" onclick={goToVehicleStep}>Edit</button>
							</div>
							<label class="ms-field ms-field--phone">
								<span>Phone</span>
								<input
									data-contact-autofocus
									type="tel"
									bind:value={phone}
									placeholder={daynightSite.phoneLabel}
									autocomplete="tel"
									required
								/>
							</label>
						</section>
					{/if}

					<label class="ms-honeypot" aria-hidden="true">
						<span>Company</span>
						<input type="text" tabindex="-1" autocomplete="off" bind:value={companyWebsite} />
					</label>

					{#if sellSubmitMessage}
						<p class="ms-form-message" data-state={sellSubmitState}>{sellSubmitMessage}</p>
					{/if}
				</div>

				<footer class="ms-sheet__footer">
					{#if formStep === 2}
						<button type="button" class="ms-wizard-back" onclick={goToVehicleStep}>
							<ChevronLeft size={17} strokeWidth={2.5} />
							<span>Назад към автомобила</span>
						</button>
					{/if}
					<button
						class="ms-primary-action"
						type="submit"
						disabled={sellSubmitState === 'submitting'}
					>
						<span>
							{formStep === 1
								? 'Към контакт'
								: sellSubmitState === 'submitting'
									? 'Изпращаме...'
									: 'Изпрати за оценка'}
						</span>
						<ChevronRight size={20} strokeWidth={2.6} />
					</button>
					{#if formStep === 2}
						<a href={phoneHref}>Или се обадете на {daynightSite.phoneLabel}</a>
					{/if}
				</footer>
			</form>
		</dialog>

		<dialog
			bind:this={infoDialog}
			class="ms-sheet ms-sheet--info"
			aria-labelledby="ms-info-title"
			onclick={(event) => handleSheetBackdrop(event, closeInfo)}
			onclose={() => (activeInfo = null)}
		>
			<div class="ms-sheet__surface">
				<header class="ms-info-hero">
					<img
						src={resolve(
							activeInfo === 'process'
								? '/assets/images/sell/process-disclosure-list-v1.webp'
								: '/assets/images/sell/kristian-trust-disclosure-list-v1.webp'
						)}
						alt=""
						aria-hidden="true"
					/>
					<div class="ms-info-hero__handle" aria-hidden="true"></div>
					<div class="ms-info-hero__title">
						<h2 id="ms-info-title">
							{activeInfo === 'process' ? 'Как работи' : 'Защо Day Night'}
						</h2>
						<p>
							{activeInfo === 'process'
								? 'От заявката до конкретен вариант'
								: 'Ясни следващи стъпки за Вашия автомобил'}
						</p>
					</div>
					<button type="button" class="ms-sheet__close" onclick={closeInfo} aria-label="Close">
						<X size={20} strokeWidth={2.45} aria-hidden="true" />
					</button>
				</header>

				<div class="ms-sheet__scroll">
					{#if activeInfo === 'process'}
						<div class="ms-process-list">
							{#each steps as step, index (step.title)}
								<article class="ms-step">
									<span class="ms-step__number">0{index + 1}</span>
									<span class="ms-step__copy">
										<strong>{step.title}</strong>
										<small>{step.copy}</small>
									</span>
								</article>
							{/each}
						</div>
					{:else}
						<div class="ms-benefit-list">
							<article>
								<span class="ms-benefit-list__icon"
									><CircleCheck size={20} strokeWidth={2.35} /></span
								>
								<span
									><strong>Ясна оценка</strong><small>Цена според данните и състоянието.</small
									></span
								>
							</article>
							<article>
								<span class="ms-benefit-list__icon"
									><CircleCheck size={20} strokeWidth={2.35} /></span
								>
								<span
									><strong>Изкупуване или бартер</strong><small
										>Избирате подходящия за Вас вариант.</small
									></span
								>
							</article>
							<article>
								<span class="ms-benefit-list__icon"
									><CircleCheck size={20} strokeWidth={2.35} /></span
								>
								<span
									><strong>Оглед при нужда</strong><small>Уговаряме удобна следваща стъпка.</small
									></span
								>
							</article>
						</div>
					{/if}
					<a class="ms-info-call" href={phoneHref}>
						<Phone size={18} strokeWidth={2.45} aria-hidden="true" />
						<span>Обади се на {daynightSite.phoneLabel}</span>
					</a>
				</div>
			</div>
		</dialog>
	{/if}
</div>

<style>
	.mobile-sell {
		--ms-canvas: #fff;
		--ms-surface: #eef1f6;
		--ms-surface-strong: #e7eaee;
		--ms-line: #dfe5ec;
		--ms-blue: var(--sa-red, #d50032);

		display: none;
		min-height: 100svh;
		background: var(--ms-canvas);
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-sell a {
		color: inherit;
		text-decoration: none;
	}

	.ms-hero {
		position: relative;
		display: grid;
		gap: 12px;
		overflow: hidden;
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 18px;
		background: #05070a;
		color: #fff;
		isolation: isolate;
	}

	.ms-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgba(3, 5, 8, 0.7) 0%, rgba(3, 5, 8, 0.92) 72%),
			linear-gradient(90deg, rgba(213, 0, 50, 0.13), transparent 46%);
		content: '';
	}

	.ms-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		object-fit: cover;
		object-position: center;
	}

	.ms-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 318px;
	}

	.ms-hero__copy h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		line-height: 1.2;
		letter-spacing: 0;
	}

	.ms-hero__copy p {
		margin: 0;
		color: rgba(255, 255, 255, 0.86);
		font-size: var(--sa-text-sm);
		font-weight: 600;
		line-height: 1.3;
	}

	.ms-quick-start {
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

	.ms-quick-start:focus-within {
		box-shadow:
			0 0 0 2px rgba(224, 0, 50, 0.78),
			0 12px 32px rgba(0, 0, 0, 0.24);
	}

	.ms-quick-start label {
		display: grid;
		flex: 1 1 auto;
		gap: 2px;
		min-width: 0;
		min-height: 48px;
		align-content: center;
		padding: 3px 0 2px;
	}

	.ms-quick-start label span {
		color: #65707e;
		font-size: 10px;
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.ms-quick-start input {
		width: 100%;
		min-width: 0;
		appearance: none;
		border: 0;
		background: transparent;
		color: #111827;
		font: 800 17px/1.2 var(--sa-font);
		letter-spacing: 0.035em;
		outline: 0;
		padding: 0;
		text-transform: uppercase;
	}

	.ms-quick-start input::placeholder {
		color: #626d7a;
		opacity: 1;
	}

	.ms-quick-start button {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		appearance: none;
		border: 0;
		border-radius: 50%;
		background: #050505;
		box-shadow: 0 5px 14px rgba(3, 5, 8, 0.22);
		color: #fff !important;
		cursor: pointer;
		transition: transform 0.16s ease-out;
	}

	.ms-quick-start button :global(svg),
	.ms-quick-start button :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.ms-quick-start button:active {
		transform: scale(0.94);
	}

	.ms-quick-meta {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 12px;
	}

	.ms-quick-meta p {
		margin: 0;
		color: rgba(255, 255, 255, 0.68);
		font-size: 10px;
		font-weight: 650;
		line-height: 1.3;
	}

	.ms-quick-meta button {
		display: inline-flex;
		min-height: 44px;
		flex: 0 0 auto;
		align-items: center;
		appearance: none;
		border: 0;
		background: transparent;
		color: #fff;
		cursor: pointer;
		font: 800 11px/1.2 var(--sa-font);
		padding: 0 2px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.mobile-sell main {
		display: grid;
		gap: 12px;
		padding: 12px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-sell main.ms-main--sheet {
		position: relative;
		z-index: 2;
		margin-top: -14px;
		border-radius: 22px 22px 0 0;
		background: var(--ms-canvas);
		padding-top: 26px;
	}

	.ms-panel {
		display: grid;
		gap: var(--sa-mobile-section-gap);
		scroll-margin-top: 12px;
	}

	.ms-panel--form {
		position: relative;
		z-index: 3;
		margin-top: -30px;
		border-radius: 16px;
		background: #fff;
		padding: 17px 14px 14px;
		box-shadow: 0 18px 42px rgba(8, 12, 18, 0.2);
	}

	.ms-section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
	}

	.ms-section-head > div {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.ms-section-head span {
		color: var(--ms-blue);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.ms-section-head h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-xl);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: 0;
	}

	.ms-section-head :global(svg) {
		flex: 0 0 auto;
		color: var(--ms-blue);
	}

	.ms-confirm-card {
		display: grid;
		gap: var(--sa-mobile-gap-md);
		border-radius: 11px;
		background: var(--ms-surface);
		padding: 14px var(--sa-mobile-gutter);
	}

	.ms-confirm-card p {
		margin: 0;
		color: #424f5e;
		font-size: var(--sa-text-sm);
		font-weight: 600;
		line-height: 1.35;
	}

	.ms-confirm-summary {
		display: grid;
		margin: 0;
		gap: 7px;
	}

	.ms-confirm-summary > div {
		display: flex;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
		border-top: 1px solid var(--ms-line);
		padding-top: 7px;
	}

	.ms-confirm-summary dt {
		color: #74808c;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.3;
		text-transform: uppercase;
	}

	.ms-confirm-summary dd {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: 700;
		line-height: 1.3;
		overflow-wrap: anywhere;
		text-align: right;
	}

	.ms-form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sa-mobile-gap-sm);
	}

	.ms-wizard-step {
		display: grid;
		align-content: start;
		gap: 18px;
	}

	.ms-wizard-step__intro {
		display: grid;
		gap: 5px;
	}

	.ms-wizard-step__intro > span {
		color: var(--ms-blue);
		font-size: var(--sa-text-xs);
		font-weight: 850;
		line-height: 1;
		text-transform: uppercase;
	}

	.ms-wizard-step__intro h3 {
		margin: 0;
		color: var(--sa-ink);
		font-size: 24px;
		font-weight: 850;
		line-height: 1.08;
		letter-spacing: -0.02em;
	}

	.ms-wizard-step__intro p {
		margin: 0;
		color: #5b6673;
		font-size: var(--sa-text-sm);
		font-weight: 650;
		line-height: 1.35;
	}

	.ms-field {
		display: grid;
		align-content: center;
		gap: 4px;
		min-width: 0;
		min-height: 62px;
		border: 1px solid var(--ms-line);
		border-radius: 12px;
		background: var(--ms-surface);
		padding: 7px 10px 6px;
	}

	.ms-field--wide {
		grid-column: 1 / -1;
	}

	.ms-honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.ms-field span {
		color: #56616e;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.ms-field input {
		width: 100%;
		min-width: 0;
		min-height: 30px;
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

	.ms-field input::placeholder {
		color: #626d7a;
	}

	.ms-field--vin input {
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.ms-field--phone {
		min-height: 74px;
	}

	.ms-field--phone input {
		font-size: 18px !important;
	}

	.ms-vehicle-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 1px solid var(--ms-line);
		border-radius: 14px;
		background: var(--ms-surface);
		padding: 13px 12px;
	}

	.ms-vehicle-summary > div {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.ms-vehicle-summary span,
	.ms-vehicle-summary small {
		color: #4f5b68;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.25;
	}

	.ms-vehicle-summary strong {
		font-size: var(--sa-text-base);
		font-weight: 850;
		line-height: 1.2;
	}

	.ms-vehicle-summary button,
	.ms-wizard-back {
		appearance: none;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		cursor: pointer;
		font: 800 var(--sa-text-xs) / 1.2 var(--sa-font);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.ms-primary-action,
	.ms-secondary-action {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 11px;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	button.ms-primary-action {
		appearance: none;
		-webkit-appearance: none;
		border: 0;
		cursor: pointer;
		font-family: inherit;
	}

	button.ms-primary-action:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.ms-primary-action {
		gap: var(--sa-mobile-gap-xs);
		background: var(--ms-blue);
		color: #fff !important;
	}

	.ms-primary-action span,
	.ms-primary-action :global(svg),
	.ms-primary-action :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
		font-weight: 800;
	}

	.ms-secondary-action {
		background: var(--ms-surface);
		color: var(--sa-ink) !important;
	}

	.ms-form-message {
		margin: -2px 0 0;
		border-radius: 10px;
		background: #fff1f1;
		color: #b42318;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1.35;
		padding: 10px 12px;
	}

	.ms-secondary-action :global(svg),
	.ms-secondary-action :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.ms-disclosures {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 10px;
	}

	.ms-step__copy,
	.ms-benefit-list article > span {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.ms-sheet {
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

	.ms-sheet::backdrop {
		background: rgba(3, 5, 8, 0.7);
		backdrop-filter: blur(2px);
	}

	.ms-sheet[open] {
		animation: ms-sheet-in 0.24s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.ms-sheet__surface {
		display: grid;
		max-height: min(91svh, 760px);
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		overflow: hidden;
		border-radius: 20px 20px 0 0;
		background: #fff;
		box-shadow: 0 -18px 48px rgba(3, 5, 8, 0.28);
	}

	.ms-sheet--info .ms-sheet__surface {
		max-height: min(82svh, 680px);
		grid-template-rows: auto minmax(0, 1fr);
		border-radius: 24px 24px 0 0;
		background: #f1f3f6;
	}

	.ms-info-hero {
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

	.ms-info-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(180deg, rgba(3, 5, 8, 0.16) 0%, rgba(3, 5, 8, 0.95) 100%);
		content: '';
	}

	.ms-info-hero > img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ms-info-hero__handle {
		position: absolute;
		top: 9px;
		left: 50%;
		width: 38px;
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.68);
		transform: translateX(-50%);
	}

	.ms-info-hero__title {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.ms-info-hero__title h2,
	.ms-info-hero__title p {
		margin: 0;
	}

	.ms-info-hero__title h2 {
		color: #fff;
		font-size: 22px;
		font-weight: 850;
		line-height: 1.08;
		letter-spacing: -0.02em;
	}

	.ms-info-hero__title p {
		color: rgba(255, 255, 255, 0.78);
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.ms-info-hero .ms-sheet__close {
		position: absolute;
		top: 14px;
		right: 14px;
		width: 42px;
		height: 42px;
		background: rgba(3, 5, 8, 0.78);
		backdrop-filter: blur(6px);
	}

	.ms-info-hero .ms-sheet__close :global(svg),
	.ms-info-hero .ms-sheet__close :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.ms-sheet--form {
		height: 100dvh;
		margin: 0 auto;
	}

	.ms-sheet--form .ms-sheet__surface {
		height: 100%;
		max-height: none;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		border-radius: 0;
		box-shadow: none;
	}

	.ms-sheet__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		border-bottom: 1px solid var(--ms-line);
		padding: 8px 14px 12px 16px;
	}

	.ms-sheet--form .ms-sheet__head {
		padding: calc(12px + env(safe-area-inset-top)) 14px 12px 16px;
	}

	.ms-wizard-progress {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 5px;
		padding: 0 16px 13px;
	}

	.ms-wizard-progress span {
		height: 4px;
		border-radius: 999px;
		background: #d9dee5;
	}

	.ms-wizard-progress span.active {
		background: var(--ms-blue);
	}

	.ms-sheet__head > div {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.ms-sheet__head h2 {
		margin: 0;
		font-size: 21px;
		font-weight: 850;
		line-height: 1.1;
		letter-spacing: -0.015em;
	}

	.ms-sheet__head p {
		margin: 0;
		color: #5b6673;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.3;
	}

	.ms-sheet__close {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 auto;
		place-items: center;
		appearance: none;
		border: 0;
		border-radius: 50%;
		background: #080a0d;
		color: #fff;
		cursor: pointer;
	}

	.ms-sheet__close:focus-visible {
		outline: 2px solid var(--ms-blue);
		outline-offset: 2px;
	}

	.ms-sheet__scroll {
		display: grid;
		align-content: start;
		gap: 12px;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 14px;
	}

	.ms-sheet--info .ms-sheet__scroll {
		gap: 10px;
		background: #f1f3f6;
		padding: 12px 14px calc(14px + env(safe-area-inset-bottom));
	}

	.ms-sheet__footer {
		display: grid;
		gap: 5px;
		border-top: 1px solid var(--ms-line);
		background: #fff;
		padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
	}

	.ms-sheet--form .ms-sheet__footer {
		padding-bottom: calc(12px + env(safe-area-inset-bottom));
	}

	.ms-wizard-back {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		justify-self: center;
	}

	.ms-sheet__footer > a {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		justify-content: center;
		color: #4d5967;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.ms-process-list {
		display: grid;
		gap: 8px;
	}

	.ms-step {
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

	.ms-step__number {
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

	.ms-step__copy strong {
		color: var(--sa-ink);
		font-size: 15px;
		font-weight: 850;
		line-height: 1.15;
	}

	.ms-step__copy small {
		color: #5f6b78;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.ms-benefit-list {
		display: grid;
		gap: 8px;
	}

	.ms-benefit-list article {
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

	.ms-benefit-list__icon {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border-radius: 11px;
		background: #090b0e;
		color: #fff;
	}

	.ms-benefit-list__icon :global(svg),
	.ms-benefit-list__icon :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.ms-benefit-list strong {
		font-size: 15px;
		font-weight: 850;
		line-height: 1.15;
	}

	.ms-benefit-list small {
		color: #5f6b78;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.3;
	}

	.ms-info-call {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 12px;
		background: var(--ms-blue);
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.ms-info-call :global(svg),
	.ms-info-call :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	@keyframes ms-sheet-in {
		from {
			opacity: 0.94;
			transform: translateY(26px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ms-sheet[open] {
			animation: none;
		}
	}

	.mobile-sell :global(svg),
	.mobile-sell :global(svg *) {
		stroke: currentColor !important;
	}

	@media (max-width: 991px) {
		.mobile-sell {
			display: block;
		}
	}
</style>
