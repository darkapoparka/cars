<script lang="ts">
	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import {
		ArrowRight,
		X,
		Phone,
		Plus,
		ClipboardPen,
		Camera,
		BadgeEuro,
		KeyRound
	} from '@lucide/svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import { desktopSellFaqItems, desktopSellProcessSteps } from './desktop-sell-page-data';

	type SellRequestHref = '/sell-your-car/request' | `/sell-your-car/request?${string}`;
	type IntakeMode = 'plate' | 'vin';
	type SellSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const phoneHref: `tel:${string}` = `tel:${daynightSite.phone}`;
	const processIcons = [ClipboardPen, Camera, BadgeEuro, KeyRound];

	let valuationDialog: HTMLDialogElement | undefined = $state();
	let modalOpen = $state(false);
	function handleModalKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab' || !valuationDialog) return;
		const controls = Array.from(
			valuationDialog.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([tabindex="-1"]), a[href]'
			)
		).filter((control) => control.getClientRects().length > 0);
		const first = controls[0];
		const last = controls.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}
	function openValuation(event: MouseEvent) {
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			!valuationDialog
		)
			return;
		event.preventDefault();
		valuationDialog.showModal();
		modalOpen = true;
	}
	$effect(() => {
		if (!modalOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	let intakeMode = $state<IntakeMode>('plate');
	let plate = $state('');
	let vin = $state('');
	const initialParam = (name: string) =>
		browser ? (page.url.searchParams.get(name)?.trim() ?? '') : '';
	let make = $state(initialParam('make'));
	let model = $state(initialParam('model'));
	let year = $state('');
	let mileage = $state('');
	let phone = $state('');
	let companyWebsite = $state('');
	let sellSubmitState = $state<SellSubmitState>('idle');
	let sellSubmitMessage = $state('');

	const sellErrorMessage = `Не успяхме да изпратим заявката. Моля, опитайте отново или се свържете по телефон на ${daynightSite.phoneLabel}.`;

	const leadPath = $derived.by((): SellRequestHref => {
		const params = new SvelteURLSearchParams();

		if (intakeMode === 'plate' && plate.trim()) params.set('plate', plate.trim().toUpperCase());
		if (intakeMode === 'vin' && vin.trim()) params.set('vin', vin.trim().toUpperCase());
		if (make.trim()) params.set('make', make.trim());
		if (model.trim()) params.set('model', model.trim());
		if (year.trim()) params.set('year', year.trim());
		if (mileage.trim()) params.set('mileage', mileage.trim());
		if (phone.trim()) params.set('phone', phone.trim());

		const qs = params.toString();
		return qs ? `/sell-your-car/request?${qs}` : '/sell-your-car/request';
	});

	function buildNotes() {
		return [
			['Рег. номер', plate.trim().toUpperCase()],
			['VIN', vin.trim().toUpperCase()],
			['Марка', make.trim()],
			['Модел', model.trim()],
			['Година', year.trim()],
			['Километри', mileage.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => `${label}: ${value}`)
			.join('\n');
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (sellSubmitState === 'submitting') return;

		const contactValue = phone.trim();
		if (!contactValue) {
			sellSubmitState = 'error';
			sellSubmitMessage = 'Моля, въведете телефон, за да Ви изпратим оценка и следваща стъпка.';
			return;
		}

		sellSubmitState = 'submitting';
		sellSubmitMessage = '';

		const result = await submitLead({
			customerName: 'Заявка за оценка от сайта',
			contact: contactValue,
			email: null,
			phone: contactValue,
			source: 'sell-your-car-desktop',
			message: buildNotes(),
			companyWebsite
		});

		if (result.ok) {
			sellSubmitState = 'success';
			sellSubmitMessage = 'Заявката е изпратена. Екипът ще Ви изпрати оценка и следваща стъпка.';
			return;
		}

		sellSubmitState = 'error';
		sellSubmitMessage = result.error || sellErrorMessage;
	}
</script>

<main id="main-content" tabindex="-1" class="desktop-sell" aria-label="Продай или замени автомобил">
	<DesktopYellowRouteHero
		sectionId="sell-intake"
		headingId="daynight-sell-title"
		title="Продай автомобила си"
		panel="light"
		compact
	>
		<div class="sell-intake-card">
			<p>Продажба или бартер? Изпрати данните за автомобила и ще се свържем с теб за оценка.</p>
			<a
				class="sell-action desktop-primary-action"
				href={resolve(leadPath)}
				onclick={openValuation}
				aria-haspopup="dialog">Заяви оценка <ArrowRight size={18} /></a
			>
		</div>
	</DesktopYellowRouteHero>
	<dialog
		class="sell-modal"
		bind:this={valuationDialog}
		aria-labelledby="sell-modal-title"
		onclose={() => (modalOpen = false)}
		onkeydown={handleModalKeydown}
	>
		<div class="sell-modal__heading">
			<h2 id="sell-modal-title">Заявка за оценка</h2>
			<button
				class="sell-modal__close"
				type="button"
				aria-label="Затвори"
				onclick={() => valuationDialog?.close()}><X size={22} /></button
			>
		</div>
		<form
			id="sell-intake-form"
			class="desktop-sell-form"
			action={resolve(leadPath)}
			method="get"
			onsubmit={handleSubmit}
		>
			<div class="desktop-sell-form__top">
				<div class="desktop-sell-form__mode">
					<div class="desktop-sell-form__switch" aria-label="Начин на въвеждане">
						<button
							type="button"
							class={[intakeMode === 'plate' && 'active']}
							aria-pressed={intakeMode === 'plate'}
							onclick={() => (intakeMode = 'plate')}
						>
							Рег. номер
						</button>
						<button
							type="button"
							class={[intakeMode === 'vin' && 'active']}
							aria-pressed={intakeMode === 'vin'}
							onclick={() => (intakeMode = 'vin')}
						>
							VIN
						</button>
					</div>
				</div>
			</div>

			<div class="desktop-sell-form__grid">
				<label class="desktop-sell-field desktop-sell-field--wide">
					<span>{intakeMode === 'plate' ? 'Регистрационен номер' : 'VIN номер'}</span>
					{#if intakeMode === 'plate'}
						<input
							name="plate"
							type="text"
							bind:value={plate}
							placeholder="PB 1234 AB"
							autocomplete="off"
						/>
					{:else}
						<input
							name="vin"
							type="text"
							bind:value={vin}
							placeholder="17 символа VIN"
							autocomplete="off"
						/>
					{/if}
				</label>
				<label class="desktop-sell-field">
					<span>Марка</span>
					<input name="make" type="text" bind:value={make} placeholder="BMW" autocomplete="off" />
				</label>
				<label class="desktop-sell-field">
					<span>Модел</span>
					<input
						name="model"
						type="text"
						bind:value={model}
						placeholder="320d"
						autocomplete="off"
					/>
				</label>
				<label class="desktop-sell-field">
					<span>Година</span>
					<input name="year" type="text" inputmode="numeric" bind:value={year} placeholder="2019" />
				</label>
				<label class="desktop-sell-field">
					<span>Километри</span>
					<input
						name="mileage"
						type="text"
						inputmode="numeric"
						bind:value={mileage}
						placeholder="112000"
					/>
				</label>
				<label class="desktop-sell-field desktop-sell-field--wide">
					<span>Телефон за връзка *</span>
					<input
						name="phone"
						type="tel"
						bind:value={phone}
						placeholder={daynightSite.phoneLabel}
						autocomplete="tel"
						required
					/>
				</label>

				<label class="desktop-sell-honeypot" aria-hidden="true">
					<span>Компания</span>
					<input type="text" tabindex="-1" autocomplete="off" bind:value={companyWebsite} />
				</label>
			</div>

			{#if sellSubmitMessage}
				<p
					class="desktop-sell-form__message"
					data-state={sellSubmitState}
					role={sellSubmitState === 'error' ? 'alert' : 'status'}
					aria-live="polite"
				>
					{sellSubmitMessage}
				</p>
			{/if}
			<div class="desktop-sell-form__footer">
				<button
					class="desktop-sell-form__submit sa-cta sa-cta-primary"
					type="submit"
					disabled={sellSubmitState === 'submitting'}
				>
					<span>{sellSubmitState === 'submitting' ? 'Изпращаме...' : 'Изпрати за оценка'}</span>
				</button>
			</div>
		</form>
	</dialog>

	<section class="sell-process sell-section" aria-labelledby="sell-process-title">
		<div class="sell-container">
			<h2 id="sell-process-title" class="sell-section-title">Как работи</h2>
			<ol class="sell-steps">
				{#each desktopSellProcessSteps as step, index (step.title)}
					{@const StepIcon = processIcons[index]}
					<li class="sell-step">
						<div class="sell-step__marker" aria-hidden="true">
							<StepIcon size={32} strokeWidth={1.8} />
						</div>
						<h3>{step.title}</h3>
						<p>{step.copy}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="sell-benefits" aria-labelledby="sell-benefits-title">
		<div class="sell-container sell-benefits__layout">
			<div class="sell-benefits__content">
				<h2 id="sell-benefits-title">Продажба<br />или бартер.</h2>
				<p class="sell-benefits__copy">
					Продай автомобила си или го замени с модел от нашата наличност. Оценяваме състоянието му и
					ти съдействаме с документите.
				</p>
				<div class="sell-benefits__actions">
					<DesktopBrowseLink
						href={resolve('/inventory')}
						label="Избери следващия автомобил"
						tone="dark"
					/>
				</div>
			</div>
			<img
				class="sell-benefits__image"
				src={resolve(
					'/inventory/21776348634522888-1.webp'
				)}
				alt=""
				width="1400"
				height="933"
				loading="lazy"
			/>
		</div>
	</section>

	<section class="sell-faq sell-section" aria-labelledby="sell-faq-title">
		<div class="sell-container sell-faq__content">
			<h2 id="sell-faq-title" class="sell-section-title">Често задавани въпроси</h2>
			<div class="sell-faq__items">
				{#each desktopSellFaqItems as item (item.question)}
					<details name="sell-faq">
						<summary><span>{item.question}</span><Plus size={20} strokeWidth={2} /></summary>
						<p>{item.answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="sell-final" aria-labelledby="sell-final-title">
		<div class="sell-container sell-final__layout">
			<h2 id="sell-final-title" class="sell-section-title">Твоята следваща стъпка</h2>
			<div class="sell-final__actions">
				<a
					class="sell-action desktop-primary-action"
					href={resolve(leadPath)}
					onclick={openValuation}
					aria-haspopup="dialog">Заяви оценка <ArrowRight size={18} /></a
				>
				<a class="sell-phone" href={phoneHref}><Phone size={18} />{daynightSite.phoneLabel}</a>
			</div>
		</div>
	</section>
</main>

<style>
	.sell-intake-card {
		padding: 24px 32px;
		text-align: center;
	}
	.desktop-sell .sell-intake-card p {
		margin: 0 auto 20px;
		max-width: 52ch;
		color: var(--sa-ink);
		font: 400 18px/1.5 var(--sa-font);
	}
	.sell-modal {
		width: min(640px, calc(100vw - 48px));
		max-height: calc(100dvh - 64px);
		margin: auto;
		padding: 24px;
		border: 0;
		border-radius: 16px;
		background: #fff;
		color: var(--sa-ink);
		overflow: auto;
	}
	.sell-modal::backdrop {
		background: rgb(0 0 0 / 55%);
	}
	.sell-modal__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 18px;
	}
	.desktop-sell .sell-modal__heading h2 {
		font: 700 28px/1.2 var(--sa-font);
		letter-spacing: -0.025em;
		margin: 0;
	}
	.sell-modal__close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex: none;
		border: 0;
		border-radius: 50%;
		background: #f5f5f5;
		color: var(--sa-ink);
		cursor: pointer;
	}
	.sell-modal__close:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}

	.desktop-sell {
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		letter-spacing: 0;
	}
	.desktop-sell :global(svg),
	.desktop-sell :global(svg *) {
		stroke: currentColor !important;
	}
	.desktop-sell a {
		text-decoration: none;
	}
	#sell-intake-form {
		scroll-margin-top: 128px;
	}
	.desktop-sell-form {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		border: 0;
		border-radius: var(--sa-r-xs);
		background: #fff;
		box-shadow: none;
		padding: 0;
		text-align: left;
	}

	.desktop-sell-form__top {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 20px;
	}

	.desktop-sell-form__mode {
		display: grid;
		width: 220px;
		gap: 7px;
	}

	.desktop-sell-form__switch {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		width: 100%;
		border: 1px solid #d7dee7;
		border-radius: var(--sa-r-xs);
		background: #f7f8fa;
		padding: 4px;
	}

	.desktop-sell-form__switch button {
		min-height: 32px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #59616c;
		cursor: pointer;
		font-size: var(--sa-text-body-sm);
		font-weight: var(--sa-weight-label);
		letter-spacing: var(--sa-tracking-tight);
	}

	.desktop-sell-form__switch button.active {
		background: var(--sa-surface);
		color: var(--sa-ink);
		box-shadow: none;
	}

	.desktop-sell-form__switch button:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 2px;
	}

	.desktop-sell-form__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.desktop-sell-field {
		display: grid;
		gap: 4px;
		min-width: 0;
		border: 1px solid #d7dee7;
		border-radius: var(--sa-r-xs);
		background: #f7f8fa;
		padding: 8px 12px;
	}

	.desktop-sell-field--wide,
	.desktop-sell-field:nth-child(2),
	.desktop-sell-field:nth-child(3) {
		grid-column: auto;
	}

	.desktop-sell-honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.desktop-sell-field span {
		color: #677283;
		font-size: 12px;
		font-weight: var(--sa-weight-label);
		letter-spacing: 0;
		line-height: var(--sa-leading-tight);
		text-transform: none;
	}

	.desktop-sell-field input {
		width: 100%;
		min-width: 0;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--sa-ink) !important;
		font-size: 16px;
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-snug);
		outline: 0 !important;
		padding: 0 !important;
	}

	.desktop-sell-field input::placeholder {
		color: var(--sa-faint);
	}

	.desktop-sell-field:focus-within {
		border-color: var(--desktop-action);
		box-shadow: none;
		outline: 2px solid var(--desktop-focus);
		outline-offset: 2px;
	}

	.desktop-sell-form__footer {
		grid-column: 1;
		align-items: stretch;
		display: flex;
		justify-content: flex-end;
	}

	.desktop-sell-form__submit {
		min-width: 0;
		width: 220px;
		height: 48px;
		border: 0;
		--sa-cta-gap: 10px;
		--sa-cta-font-size: var(--sa-text-desktop-action-sm);
		--sa-cta-height: 44px;
	}

	.desktop-sell-form__message {
		margin: -4px 0 0;
		border-radius: 10px;
		background: #fff1f1;
		padding: 11px 13px;
		color: #b42318;
		font-size: var(--sa-text-desktop-dense);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-body-sm);
	}

	.desktop-sell-form__message[data-state='success'] {
		background: #ecfdf3;
		color: #027a48;
	}

	.sell-container {
		box-sizing: border-box;
		width: calc(100% - 96px);
		max-width: 1280px;
		margin-inline: auto;
	}
	.sell-section {
		padding-block: 64px;
	}
	.desktop-sell .sell-section-title {
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-section-title);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.025em;
		margin: 0;
		text-wrap: balance;
	}
	.sell-process .sell-section-title,
	.sell-faq .sell-section-title {
		text-align: center;
		margin-bottom: 36px;
	}
	.sell-steps {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 28px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.sell-step {
		min-width: 0;
		text-align: center;
		background: #f3f4f5;
		border-radius: 16px;
		padding: 24px 20px;
	}
	.sell-step__marker {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		margin: 0 auto 18px;
		border-radius: 16px;
		color: var(--desktop-action);
	}
	.desktop-sell .sell-step h3 {
		margin: 0 0 10px;
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-card-title);
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: var(--sa-tracking-tight);
	}
	.desktop-sell .sell-step p {
		color: var(--sa-ink);
		margin: 0 auto;
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-dense);
		font-weight: 400;
		line-height: 1.5;
		max-width: 26ch;
	}
	.sell-benefits {
		padding-block: 8px 24px;
	}
	.sell-benefits__layout {
		position: relative;
		overflow: hidden;
		min-height: 340px;
		border-radius: 16px;
		background: var(--sa-yellow);
		padding: 44px 48px;
		display: flex;
		align-items: center;
	}
	.sell-benefits__content {
		position: relative;
		z-index: 1;
		width: 54%;
	}
	.desktop-sell .sell-benefits h2 {
		font-family: var(--sa-font);
		font-size: clamp(40px, 3.4vw, 56px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.04em;
		margin: 0 0 16px;
		color: var(--sa-ink);
	}
	.sell-benefits__actions {
		display: flex;
		align-items: center;
		gap: 22px;
		flex-wrap: wrap;
	}
	.desktop-sell .sell-benefits__copy {
		font: 400 18px/1.5 var(--sa-font);
		color: var(--sa-ink);
		max-width: 440px;
		margin: 0 0 24px;
	}
	.sell-benefits__image {
		position: absolute;
		width: 53%;
		max-width: none;
		height: auto;
		right: -48px;
		bottom: -26px;
		pointer-events: none;
	}
	.sell-faq__content {
		max-width: 900px;
	}
	.sell-faq__items {
		display: grid;
		gap: 10px;
	}
	.sell-faq details {
		background: #f7f7f5;
		border-radius: 8px;
		padding-inline: 24px;
	}
	.sell-faq summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		min-height: 68px;
		cursor: pointer;
		list-style: none;
		padding: 18px 0;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-body);
		font-weight: 600;
		line-height: 1.4;
	}
	.sell-faq summary::-webkit-details-marker {
		display: none;
	}
	.sell-faq summary :global(svg) {
		flex: none;
	}
	.sell-faq details[open] summary :global(svg) {
		transform: rotate(45deg);
	}
	.desktop-sell .sell-faq details p {
		max-width: 760px;
		margin: 0;
		padding: 0 40px 22px 0;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.6;
	}
	.sell-faq summary:hover {
		color: var(--desktop-action);
	}
	.sell-final {
		background: var(--sa-yellow);
		padding-block: 36px;
	}
	.sell-final__layout {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
	}
	.desktop-sell .sell-final .sell-section-title {
		font-size: 30px;
	}
	.sell-final__actions {
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.sell-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		min-height: 48px;
		padding: 0 22px;
		background: var(--sa-red);
		border-radius: 8px;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		white-space: nowrap;
	}
	.sell-action:hover {
		background: var(--sa-red-strong);
	}
	.sell-phone {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: var(--sa-ink);
		font-size: 16px;
		font-weight: 600;
		white-space: nowrap;
	}
	.desktop-sell :is(a, summary):focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 5px;
	}
	@media (max-width: 1199px) {
		.sell-container {
			width: calc(100% - 64px);
		}
		.sell-benefits__layout {
			padding-inline: 32px;
		}
		.sell-steps {
			gap: 20px;
		}
		.sell-final__actions {
			gap: 16px;
		}
	}
	@media (max-width: 991px) {
		.desktop-sell {
			display: none;
		}
	}
</style>
