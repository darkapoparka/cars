<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	type WizardInitial = {
		make?: string;
		model?: string;
		year?: string;
		mileage?: string;
		phone?: string;
		price?: string;
		vin?: string;
	};

	let {
		initial,
		manualEntry = false,
		onclose
	}: {
		initial?: WizardInitial;
		manualEntry?: boolean;
		onclose?: () => void;
	} = $props();

	const makeOptions = [
		'BMW',
		'Mercedes-Benz',
		'Audi',
		'Volkswagen',
		'Toyota',
		'Volvo',
		'Porsche',
		'Друга'
	];
	let step = $state<0 | 1>(0);
	let submitted = $state(false);
	let submitting = $state(false);
	let submitError = $state('');
	let bodyElement = $state<HTMLElement>();

	// svelte-ignore state_referenced_locally
	let vin = $state(initial?.vin ?? '');
	// svelte-ignore state_referenced_locally
	let make = $state(initial?.make ?? '');
	// svelte-ignore state_referenced_locally
	let model = $state(initial?.model ?? '');
	// svelte-ignore state_referenced_locally
	let year = $state(initial?.year ?? '');
	// svelte-ignore state_referenced_locally
	let mileage = $state(initial?.mileage ?? '');
	// svelte-ignore state_referenced_locally
	let phone = $state(initial?.phone ?? '');
	// svelte-ignore state_referenced_locally
	let price = $state(initial?.price ?? '');
	let location = $state('София');
	let notes = $state('');

	const vehicleTitle = $derived(
		[make.trim(), model.trim(), year.trim()].filter(Boolean).join(' · ') ||
			vin.trim() ||
			'Автомобил'
	);
	const canContinue = $derived(
		step === 0
			? vin.trim().length >= 5 || (make.trim().length > 1 && model.trim().length > 1)
			: phone.trim().length >= 6
	);
	const scrollTop = () => bodyElement?.scrollTo({ top: 0, behavior: 'smooth' });

	function goBack() {
		if (step === 1) {
			step = 0;
			submitError = '';
			scrollTop();
		}
	}

	async function goNext() {
		if (!canContinue || submitting) return;
		if (step === 0) {
			step = 1;
			submitError = '';
			scrollTop();
			return;
		}

		submitting = true;
		submitError = '';
		try {
			const response = await fetch(resolve('/api/inventory/submissions'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					source: 'sell-your-car',
					routePath: '/sell-your-car',
					vin: vin.trim(),
					title: vehicleTitle,
					mileage: mileage.trim(),
					expectedPrice: price.trim(),
					phone: phone.trim(),
					message: [location.trim() && `Град: ${location.trim()}`, notes.trim()]
						.filter(Boolean)
						.join('\n')
				})
			});
			const result = await response.json();
			if (!response.ok || !result.ok || !result.data?.submission?.id)
				throw new Error('submission-failed');
			submitted = true;
		} catch {
			submitError = 'Заявката не е изпратена. Опитай отново или се свържи по телефона.';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="sell-flow">
	{#if submitted}
		<section class="sell-flow__success" role="status">
			<span class="sell-flow__success-icon"><Check size={25} strokeWidth={2.5} /></span>
			<h2>Заявката е приета</h2>
			<p>Демо заявката е запазена временно. Не е изпратено съобщение до търговец.</p>
			<button type="button" onclick={() => onclose?.()}>Готово</button>
		</section>
	{:else}
		<header class="sell-flow__header">
			<button type="button" class="sell-flow__close" aria-label="Затвори" onclick={onclose}>
				<X size={21} strokeWidth={2.3} />
			</button>
			<div>
				<span>Етап {step + 1} от 2</span>
				<h2>{step === 0 ? 'Автомобил' : 'Контакт'}</h2>
			</div>
			<span class="sell-flow__header-spacer" aria-hidden="true"></span>
		</header>

		<div class="sell-flow__progress" aria-label={`Стъпка ${step + 1} от 2`}>
			<span style={`width:${step === 0 ? '50%' : '100%'}`}></span>
		</div>
		<div class="sell-flow__body" bind:this={bodyElement}>
			{#if step === 0}
				<section class="sell-flow__section" aria-labelledby="sell-flow-car-title">
					<div class="sell-flow__intro">
						<h3 id="sell-flow-car-title">Кой автомобил продавате?</h3>
						<p>
							{manualEntry
								? 'Марка и модел са достатъчни за начало.'
								: 'Провери VIN и добави основните данни.'}
						</p>
					</div>

					{#if !manualEntry}
						<label class="sell-field sell-field--wide">
							<span>VIN</span>
							<input bind:value={vin} type="text" placeholder="WBA..." autocomplete="off" />
						</label>
					{/if}

					<fieldset class="sell-fieldset">
						<legend>Марка</legend>
						<div class="sell-brand-rail">
							{#each makeOptions as option (option)}
								<button
									type="button"
									class:active={make === option}
									aria-pressed={make === option}
									onclick={() => (make = option)}
								>
									{option}
								</button>
							{/each}
						</div>
					</fieldset>
					<div class="sell-field-grid">
						<label class="sell-field">
							<span>Модел</span>
							<input bind:value={model} type="text" placeholder="X5" autocomplete="off" />
						</label>
						<label class="sell-field">
							<span>Година</span>
							<input
								bind:value={year}
								type="text"
								inputmode="numeric"
								maxlength="4"
								placeholder="2021"
							/>
						</label>
					</div>

					<label class="sell-field sell-field--wide">
						<span>Пробег</span>
						<input bind:value={mileage} type="text" inputmode="numeric" placeholder="120 000 км" />
					</label>
				</section>
			{:else}
				<section class="sell-flow__section" aria-labelledby="sell-flow-contact-title">
					<div class="sell-flow__intro">
						<h3 id="sell-flow-contact-title">Къде да изпратим оценката?</h3>
						<p>Само телефонът е задължителен.</p>
					</div>
					<div class="sell-summary">
						<span>Автомобил</span>
						<strong>{vehicleTitle}</strong>
						<button type="button" onclick={goBack}>Редактирай</button>
					</div>

					<label class="sell-field sell-field--wide">
						<span>Телефон *</span>
						<input
							bind:value={phone}
							type="tel"
							inputmode="tel"
							autocomplete="tel"
							placeholder="08..."
							required
						/>
					</label>

					<div class="sell-field-grid">
						<label class="sell-field">
							<span>Очаквана цена</span>
							<input bind:value={price} type="text" inputmode="numeric" placeholder="EUR" />
						</label>
						<label class="sell-field">
							<span>Град</span>
							<input bind:value={location} type="text" autocomplete="address-level2" />
						</label>
					</div>
					<label class="sell-field sell-field--wide sell-field--notes">
						<span>Бележка (по желание)</span>
						<textarea bind:value={notes} rows="3" placeholder="Състояние, ремонти или друго важно"
						></textarea>
					</label>

					{#if submitError}<p class="sell-flow__error" role="alert">{submitError}</p>{/if}
				</section>
			{/if}
		</div>

		<footer class="sell-flow__footer">
			{#if step === 1}
				<button type="button" class="sell-flow__back" onclick={goBack} disabled={submitting}>
					<ArrowLeft size={18} strokeWidth={2.4} /> Назад
				</button>
			{/if}
			<button
				type="button"
				class="sell-flow__next"
				onclick={goNext}
				disabled={!canContinue || submitting}
			>
				{submitting ? 'Изпращане…' : step === 0 ? 'Продължи' : 'Изпрати за оценка'}
				<ArrowRight size={18} strokeWidth={2.4} />
			</button>
		</footer>
	{/if}
</div>

<style>
	.sell-flow {
		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		height: 100%;
		min-height: 0;
		background: #f3f5f7;
		color: var(--bc-ink);
	}
	.sell-flow__header {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr) 44px;
		align-items: center;
		gap: 10px;
		padding: 12px 14px 9px;
		background: #08090b;
		color: #fff;
	}
	.sell-flow__header > div {
		display: grid;
		gap: 2px;
		text-align: center;
	}
	.sell-flow__header h2 {
		margin: 0;
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}
	.sell-flow__header span {
		color: rgba(255, 255, 255, 0.68);
		font-size: 12px;
		font-weight: 600;
	}
	.sell-flow__close {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		padding: 0;
		cursor: pointer;
	}
	.sell-flow__progress {
		height: 3px;
		background: #24272b;
	}
	.sell-flow__progress span {
		display: block;
		height: 100%;
		background: var(--bc-accent);
		transition: width 180ms ease;
	}
	.sell-flow__body {
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 14px var(--bc-mobile-gutter) 20px;
		scrollbar-width: none;
	}
	.sell-flow__body::-webkit-scrollbar {
		display: none;
	}
	.sell-flow__section {
		display: grid;
		gap: 12px;
	}
	.sell-flow__intro {
		display: grid;
		gap: 3px;
	}
	.sell-flow__intro h3,
	.sell-flow__intro p {
		margin: 0;
	}
	.sell-flow__intro h3 {
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}
	.sell-flow__intro p {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}
	.sell-field,
	.sell-fieldset {
		display: grid;
		min-width: 0;
		gap: 5px;
		margin: 0;
		border: 0;
		padding: 0;
	}
	.sell-field > span,
	.sell-fieldset legend {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		padding: 0;
	}
	.sell-field input,
	.sell-field textarea {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--bc-border) !important;
		border-radius: 12px !important;
		background: #fff !important;
		box-shadow: none !important;
		color: var(--bc-ink);
		font-family: inherit;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		outline: 0;
	}
	.sell-field input {
		height: 48px;
		padding: 0 12px !important;
	}
	.sell-field textarea {
		min-height: 78px;
		resize: none;
		padding: 10px 12px !important;
	}
	.sell-field input::placeholder,
	.sell-field textarea::placeholder {
		color: #8b95a1;
		opacity: 1;
	}
	.sell-field input:focus,
	.sell-field textarea:focus {
		border-color: var(--bc-accent) !important;
	}
	.sell-field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.sell-brand-rail {
		display: flex;
		gap: 7px;
		overflow-x: auto;
		padding: 1px 0 3px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.sell-brand-rail::-webkit-scrollbar {
		display: none;
	}
	.sell-brand-rail button {
		min-height: 40px;
		flex: 0 0 auto;
		border: 1px solid var(--bc-border);
		border-radius: 11px;
		background: #fff;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		padding: 0 13px;
		cursor: pointer;
		white-space: nowrap;
		line-height: var(--bc-leading-control);
	}
	.sell-brand-rail button.active {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: #fff;
	}
	.sell-summary {
		position: relative;
		display: grid;
		gap: 2px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #fff;
		padding: 10px 88px 10px 12px;
	}
	.sell-summary span {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}
	.sell-summary strong {
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}
	.sell-summary button {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		min-height: 36px;
		border: 0;
		border-radius: 9px;
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		padding: 0 10px;
		cursor: pointer;
		line-height: var(--bc-mobile-label-leading);
	}
	.sell-flow__error {
		margin: 0;
		border-radius: 10px;
		background: #fff0f1;
		color: #9f1016;
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
		padding: 9px 10px;
	}
	.sell-flow__footer {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 8px;
		border-top: 1px solid var(--bc-border);
		background: #fff;
		padding: 10px var(--bc-mobile-gutter) calc(10px + env(safe-area-inset-bottom));
	}
	.sell-flow__footer > .sell-flow__next:only-child {
		grid-column: 1 / -1;
	}
	.sell-flow__back,
	.sell-flow__next {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 12px;
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-heading);
		cursor: pointer;
		line-height: var(--bc-leading-cta);
	}
	.sell-flow__back {
		border: 0;
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		padding: 0 13px;
	}
	.sell-flow__next {
		border: 0;
		background: var(--bc-accent);
		color: #fff;
		padding: 0 16px;
	}
	.sell-flow__next:disabled {
		background: #cfd4da;
		color: #7a8490;
		cursor: not-allowed;
	}
	.sell-flow__success {
		display: grid;
		height: 100%;
		place-content: center;
		justify-items: center;
		gap: 10px;
		padding: 24px;
		text-align: center;
	}
	.sell-flow__success-icon {
		display: grid;
		width: 52px;
		height: 52px;
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--bc-accent);
	}
	.sell-flow__success h2,
	.sell-flow__success p {
		margin: 0;
	}
	.sell-flow__success h2 {
		font-size: 22px;
		font-weight: var(--bc-weight-heading);
	}
	.sell-flow__success p {
		max-width: 30ch;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		font-weight: var(--bc-weight-body);
	}
	.sell-flow__success button {
		min-width: 160px;
		min-height: 46px;
		margin-top: 4px;
		border: 0;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #fff;
		font-size: 14px;
		font-weight: var(--bc-weight-heading);
		cursor: pointer;
	}
	.sell-flow button:focus-visible,
	.sell-flow input:focus-visible,
	.sell-flow textarea:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	/* overlay-polish-v2: full-screen, storefront-consistent sell flow */
	.sell-flow {
		background: var(--bc-bg-strong);
	}
	.sell-flow__header {
		grid-template-columns: 40px minmax(0, 1fr) 40px;
		gap: 8px;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		padding: max(8px, env(safe-area-inset-top)) var(--bc-mobile-gutter) 7px;
	}
	.sell-flow__header > div {
		gap: 1px;
	}
	.sell-flow__header h2 {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.sell-flow__header span {
		color: var(--bc-muted);
		font-size: 11px;
		line-height: 1.2;
	}
	.sell-flow__header-spacer {
		width: 40px;
		height: 40px;
	}
	.sell-flow__close {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--bc-surface);
		color: var(--bc-ink);
	}
	.sell-flow__progress {
		height: 3px;
		margin: 0 var(--bc-mobile-gutter) 8px;
		border-radius: 999px;
		background: var(--bc-border);
		overflow: hidden;
	}

	.sell-flow__body {
		background: var(--bc-bg-strong);
		padding: 8px var(--bc-mobile-gutter) 18px;
	}
	.sell-flow__section {
		gap: 10px;
	}
	.sell-flow__intro {
		gap: 2px;
	}
	.sell-flow__intro h3 {
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.sell-flow__intro p {
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		font-weight: var(--bc-weight-body);
	}
	.sell-field,
	.sell-fieldset {
		gap: 5px;
	}
	.sell-field > span,
	.sell-fieldset legend {
		font-size: var(--bc-mobile-label);
		line-height: var(--bc-mobile-label-leading);
		font-weight: var(--bc-weight-heading);
	}
	.sell-field input,
	.sell-field textarea {
		border: 0 !important;
		border-radius: 10px !important;
		background: var(--bc-white) !important;
	}
	.sell-field input {
		height: 44px;
		padding: 0 11px !important;
	}
	.sell-field textarea {
		min-height: 70px;
		padding: 9px 11px !important;
	}
	.sell-field input:focus,
	.sell-field textarea:focus {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--bc-accent) 48%, transparent) !important;
	}
	.sell-brand-rail {
		gap: 6px;
	}
	.sell-brand-rail button {
		min-height: 38px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		padding: 0 12px;
	}
	.sell-brand-rail button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	.sell-summary {
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
	}
	.sell-summary button {
		background: var(--bc-surface-hover);
	}
	.sell-flow__footer {
		border-top: 1px solid var(--bc-border);
		background: var(--bc-bg-strong);
		padding: 9px var(--bc-mobile-gutter) calc(9px + env(safe-area-inset-bottom));
	}
	.sell-flow__back,
	.sell-flow__next {
		min-height: 46px;
		border-radius: 11px;
	}
	.sell-flow__back {
		background: var(--bc-white);
	}
	.sell-flow__next {
		background: var(--bc-accent);
	}
	.sell-flow__next:disabled {
		background: var(--bc-border);
		color: var(--bc-muted);
	}
</style>
