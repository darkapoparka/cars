<script lang="ts">
	import { ArrowRight, Check, ChevronLeft, Link2, Search, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { templateInquiryCopy } from '$lib/data/template-settings';
	import {
		emptyImportCriteria,
		importCountries,
		importCriteriaSummary,
		importFuels,
		importTransmissions,
		type ImportCriteria
	} from '$lib/data/import-criteria';

	type ImportIntent = 'listing' | 'source';

	type Props = {
		initialIntent: ImportIntent;
		initialVehicle?: string;
		initialCriteria?: ImportCriteria;
		onclose: () => void;
	};

	let {
		initialIntent,
		initialVehicle = '',
		initialCriteria = emptyImportCriteria,
		onclose
	}: Props = $props();

	const stepLabels = ['Автомобил', 'Изисквания', 'Контакт'] as const;
	const timeframeOptions = ['Без значение', 'До 1 месец', 'До 3 месеца', 'До 6 месеца'];

	// The keyed parent recreates the wizard for each new intake session.
	// svelte-ignore state_referenced_locally
	let step = $state(initialIntent === 'listing' && initialVehicle.trim() ? 1 : 0);
	// svelte-ignore state_referenced_locally
	let intent = $state<ImportIntent>(initialIntent);
	// svelte-ignore state_referenced_locally
	let vehicle = $state(initialVehicle);
	// svelte-ignore state_referenced_locally
	let make = $state(initialCriteria.make);
	// svelte-ignore state_referenced_locally
	let model = $state(initialCriteria.model);
	// svelte-ignore state_referenced_locally
	let budget = $state(initialCriteria.maxPrice);
	// svelte-ignore state_referenced_locally
	let origin = $state(initialCriteria.origin);
	// svelte-ignore state_referenced_locally
	let minYear = $state(initialCriteria.minYear);
	// svelte-ignore state_referenced_locally
	let fuel = $state(initialCriteria.fuel);
	// svelte-ignore state_referenced_locally
	let transmission = $state(initialCriteria.transmission);
	let timeframe = $state('Без значение');
	let notes = $state('');
	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let submitted = $state(false);
	let submitting = $state(false);
	let submitError = $state('');
	const requestCriteria = $derived({
		origin,
		make,
		model,
		minYear,
		maxPrice: budget,
		fuel,
		transmission
	});
	const criteriaSummary = $derived(importCriteriaSummary(requestCriteria));

	let canContinue = $derived(
		step === 0
			? intent === 'listing'
				? vehicle.trim().length > 3
				: Boolean(origin) || make.trim().length > 1 || model.trim().length > 1
			: step === 2
				? name.trim().length >= 2 && phone.trim().length >= 6
				: true
	);

	const goBack = () => {
		if (step > 0) step -= 1;
	};

	const goNext = async () => {
		if (!canContinue || submitting) return;
		if (step < stepLabels.length - 1) {
			step += 1;
			return;
		}
		submitting = true;
		submitError = '';
		try {
			const response = await fetch(resolve('/api/inquiries'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					phone,
					email,
					source: 'import-request',
					routePath: 'import',
					vehicle: intent === 'listing' ? vehicle : [make, model].filter(Boolean).join(' '),
					message: ['Заявка за внос', criteriaSummary, `Срок: ${timeframe}`, notes]
						.filter(Boolean)
						.join('\n')
				})
			});
			const result = await response.json();
			if (!response.ok || !result.ok || !result.data?.inquiry?.id)
				throw new Error('Inquiry was not saved');
			submitted = true;
		} catch {
			submitError = 'Заявката не е изпратена. Данните са запазени във формата — опитай отново.';
		} finally {
			submitting = false;
		}
	};
</script>

<div class="bc-import-wizard">
	{#if submitted}
		<div class="bc-import-wizard__success" role="status">
			<span><Check size={25} strokeWidth={2.4} aria-hidden="true" /></span>
			<h2>Заявката е получена</h2>
			<p>
				{templateInquiryCopy.success}
			</p>
			<button type="button" onclick={onclose}>Затвори</button>
		</div>
	{:else}
		<header class="bc-import-wizard__header">
			<div>
				<p>Етап {step + 1} от {stepLabels.length}</p>
				<h2>{stepLabels[step]}</h2>
			</div>
			<button type="button" aria-label="Затвори" onclick={onclose}>
				<X size={20} strokeWidth={2.3} aria-hidden="true" />
			</button>
		</header>

		<div class="bc-import-wizard__progress" aria-label={`Стъпка ${step + 1} от 3`}>
			{#each stepLabels as label, index (label)}
				<span class:done={index <= step}></span>
			{/each}
		</div>

		<div class="bc-import-wizard__body">
			{#if step === 0}
				<div class="bc-import-wizard__intro">
					<h3>Кой автомобил да проверим?</h3>
					<p>Изпрати готова обява или опиши автомобила, който търсиш.</p>
				</div>

				<div class="bc-import-wizard__intent" aria-label="Начин на заявка">
					<button
						type="button"
						class:active={intent === 'listing'}
						aria-pressed={intent === 'listing'}
						onclick={() => (intent = 'listing')}
					>
						<Link2 size={17} strokeWidth={2.2} aria-hidden="true" />
						Имам обява или VIN
					</button>
					<button
						type="button"
						class:active={intent === 'source'}
						aria-pressed={intent === 'source'}
						onclick={() => (intent = 'source')}
					>
						<Search size={17} strokeWidth={2.2} aria-hidden="true" />
						Търся автомобил
					</button>
				</div>

				<div class="bc-import-wizard__fields">
					{#if intent === 'listing'}
						<label class="bc-import-wizard__field--wide" for="import-wizard-vehicle">
							<span>Линк към обява или VIN *</span>
							<input
								id="import-wizard-vehicle"
								type="text"
								placeholder="mobile.de, AutoScout24 или VIN"
								required
								bind:value={vehicle}
							/>
						</label>
					{/if}
					<fieldset class="bc-import-wizard__field--wide">
						<legend>Пазар за покупка</legend>
						<div class="bc-import-wizard__country-grid">
							{#each importCountries as country (country.value)}
								<button
									type="button"
									class:active={origin === country.value}
									aria-pressed={origin === country.value}
									onclick={() => (origin = country.value)}
								>
									<img
										src={country.flagSrc}
										alt=""
										aria-hidden="true"
										width="24"
										height="18"
									/><strong>{country.label}</strong>
								</button>
							{/each}
						</div>
					</fieldset>
					{#if intent === 'source'}
						<label for="import-wizard-make">
							<span>Марка</span>
							<input
								id="import-wizard-make"
								type="text"
								placeholder="Напр. BMW"
								bind:value={make}
							/>
						</label>
						<label for="import-wizard-model">
							<span>Модел</span>
							<input
								id="import-wizard-model"
								type="text"
								placeholder="Напр. X5"
								bind:value={model}
							/>
						</label>
					{/if}
				</div>
			{:else if step === 1}
				<div class="bc-import-wizard__intro">
					<h3>Какво е важно за теб?</h3>
					<p>Бюджетът и срокът помагат да върнем реалистична следваща стъпка.</p>
				</div>
				<div class="bc-import-wizard__fields">
					<label for="import-wizard-year">
						<span>Година от</span>
						<input
							id="import-wizard-year"
							type="text"
							inputmode="numeric"
							maxlength="4"
							placeholder="2021"
							bind:value={minYear}
						/>
					</label>
					<label for="import-wizard-budget">
						<span>Бюджет до</span>
						<input
							id="import-wizard-budget"
							type="text"
							inputmode="numeric"
							placeholder="EUR"
							bind:value={budget}
						/>
					</label>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>Желан срок</legend>
						<div class="bc-import-wizard__chips">
							{#each timeframeOptions as option (option)}
								<button
									type="button"
									class:active={timeframe === option}
									aria-pressed={timeframe === option}
									onclick={() => (timeframe = option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>Гориво</legend>
						<div class="bc-import-wizard__chips">
							{#each importFuels as option (option)}
								<button
									type="button"
									class:active={fuel === option}
									aria-pressed={fuel === option}
									onclick={() => (fuel = fuel === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>Скорости</legend>
						<div class="bc-import-wizard__chips">
							{#each importTransmissions as option (option)}
								<button
									type="button"
									class:active={transmission === option}
									aria-pressed={transmission === option}
									onclick={() => (transmission = transmission === option ? '' : option)}
									>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<label class="bc-import-wizard__field--wide" for="import-wizard-notes">
						<span>Предпочитания</span>
						<textarea
							id="import-wizard-notes"
							rows="4"
							placeholder="Двигател, година, оборудване или друго важно"
							bind:value={notes}
						></textarea>
					</label>
				</div>
			{:else}
				<div class="bc-import-wizard__intro">
					<h3>Данни за контакт</h3>
					<p>Името и телефонът са необходими. Имейлът е по желание.</p>
					{#if criteriaSummary}<p class="bc-import-wizard__summary">{criteriaSummary}</p>{/if}
				</div>
				<div class="bc-import-wizard__fields">
					<label class="bc-import-wizard__field--wide" for="import-wizard-phone">
						<span>Телефон *</span>
						<input
							id="import-wizard-phone"
							type="tel"
							inputmode="tel"
							autocomplete="tel"
							placeholder="Вашият телефон"
							required
							bind:value={phone}
						/>
					</label>
					<label for="import-wizard-name">
						<span>Име *</span>
						<input
							id="import-wizard-name"
							type="text"
							autocomplete="name"
							required
							minlength="2"
							bind:value={name}
						/>
					</label>
					<label for="import-wizard-email">
						<span>Имейл</span>
						<input
							id="import-wizard-email"
							type="email"
							inputmode="email"
							autocomplete="email"
							bind:value={email}
						/>
					</label>
				</div>
				<p class="bc-import-wizard__promise">{templateInquiryCopy.notice}</p>
			{/if}
		</div>

		{#if submitError}<p class="bc-import-wizard__error" role="alert">{submitError}</p>{/if}
		<footer class="bc-import-wizard__nav" aria-busy={submitting}>
			{#if step > 0}
				<button type="button" class="bc-import-wizard__back" onclick={goBack} disabled={submitting}>
					<ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
					Назад
				</button>
			{/if}
			<button
				type="button"
				class="bc-import-wizard__next"
				disabled={!canContinue || submitting}
				onclick={goNext}
			>
				{submitting ? 'Изпращане…' : step < stepLabels.length - 1 ? 'Продължи' : 'Изпрати заявката'}
				<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
			</button>
		</footer>
	{/if}
</div>

<style>
	.bc-import-wizard__error {
		color: var(--bc-accent-hover);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		margin: 0;
		font-weight: var(--bc-weight-body);
	}
	.bc-import-wizard__intro .bc-import-wizard__summary {
		margin-top: 8px;
		color: var(--bc-ink);
		overflow-wrap: anywhere;
	}
	.bc-import-wizard {
		display: grid;
		grid-template-rows: max-content max-content minmax(0, 1fr) max-content;
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		min-height: 0;
		gap: var(--bc-space-3);
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		padding: max(var(--bc-space-3), env(safe-area-inset-top)) var(--bc-mobile-gutter)
			max(var(--bc-space-3), env(safe-area-inset-bottom));
	}

	.bc-import-wizard__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.bc-import-wizard__header > div {
		display: grid;
		gap: 2px;
	}

	.bc-import-wizard__header h2,
	.bc-import-wizard__header p {
		margin: 0;
	}

	.bc-import-wizard__header h2 {
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		letter-spacing: -0.02em;
		line-height: var(--bc-mobile-section-title-leading);
	}

	.bc-import-wizard__header p {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}

	.bc-import-wizard__header > button {
		display: flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface-soft);
		color: var(--bc-ink);
		cursor: pointer;
		padding: 0;
	}

	.bc-import-wizard__progress {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6px;
	}

	.bc-import-wizard__progress span {
		height: 5px;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.bc-import-wizard__progress span.done {
		background: var(--bc-accent);
	}

	.bc-import-wizard__body {
		display: grid;
		min-height: 0;
		gap: var(--bc-space-4);
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: var(--bc-space-1) 1px var(--bc-space-6);
		scrollbar-width: none;
	}
	.bc-import-wizard__body::-webkit-scrollbar {
		display: none;
	}

	.bc-import-wizard__intro {
		display: grid;
		gap: 4px;
	}

	.bc-import-wizard__intro h3,
	.bc-import-wizard__intro p {
		margin: 0;
	}

	.bc-import-wizard__intro h3 {
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		letter-spacing: -0.015em;
		line-height: var(--bc-mobile-section-title-leading);
	}

	.bc-import-wizard__intro p {
		max-width: 52ch;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.bc-import-wizard__intent {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.bc-import-wizard__intent button {
		display: flex;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		padding: 0 9px;
	}

	.bc-import-wizard__intent button.active {
		border-color: var(--bc-accent);
		background: rgba(196, 1, 1, 0.08);
		color: var(--bc-accent-hover);
	}

	.bc-import-wizard__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px 9px;
	}

	.bc-import-wizard__fields label {
		display: grid;
		min-width: 0;
		gap: 6px;
	}

	.bc-import-wizard__field--wide {
		grid-column: 1 / -1;
	}

	.bc-import-wizard__fields span {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
	}

	.bc-import-wizard__fields input,
	.bc-import-wizard__fields textarea {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-white) !important;
		box-shadow: none !important;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		outline: 0;
	}

	.bc-import-wizard__fields input {
		height: 48px !important;
		padding: 0 12px !important;
	}

	.bc-import-wizard__fields textarea {
		min-height: 100px;
		resize: vertical;
		padding: 11px 12px !important;
	}

	.bc-import-wizard__fields input::placeholder,
	.bc-import-wizard__fields textarea::placeholder {
		color: var(--bc-muted);
		opacity: 1;
	}

	.bc-import-wizard__fields input:focus-visible:focus-visible,
	.bc-import-wizard__fields textarea:focus-visible {
		border-color: var(--bc-accent) !important;
		background: var(--bc-white) !important;
	}

	.bc-import-wizard__fields fieldset {
		display: grid;
		min-width: 0;
		gap: var(--bc-space-2);
		margin: 0;
		border: 0;
		padding: 0;
	}
	.bc-import-wizard__fields legend {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		padding: 0;
	}
	.bc-import-wizard__country-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}
	.bc-import-wizard__country-grid button {
		display: grid;
		min-height: 64px;
		place-items: center;
		gap: var(--bc-space-1);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
		padding: var(--bc-space-2);
	}
	.bc-import-wizard__country-grid button > img {
		display: block;
		width: 24px;
		height: 18px;
		border-radius: 3px;
		object-fit: cover;
	}
	.bc-import-wizard__country-grid button strong {
		font-size: var(--bc-text-control);
		line-height: var(--bc-leading-control);
		font-weight: var(--bc-weight-control);
	}
	.bc-import-wizard__country-grid button.active {
		border-color: var(--bc-accent);
		background: color-mix(in srgb, var(--bc-accent) 9%, var(--bc-white));
		color: var(--bc-accent-hover);
	}

	.bc-import-wizard__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.bc-import-wizard__chips button {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		padding: 0 var(--bc-space-3);
		line-height: var(--bc-leading-control);
	}
	.bc-import-wizard__chips button.active {
		border-color: var(--bc-accent);
		background: color-mix(in srgb, var(--bc-accent) 9%, var(--bc-white));
		color: var(--bc-accent-hover);
	}

	.bc-import-wizard__promise {
		margin: -4px 0 0;
		color: var(--bc-accent-hover);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}

	.bc-import-wizard__nav {
		display: flex;
		gap: var(--bc-space-2);
		border-top: 1px solid var(--bc-border);
		background: var(--bc-bg-strong);
		padding-top: var(--bc-space-3);
	}

	.bc-import-wizard__back,
	.bc-import-wizard__next {
		display: inline-flex;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: var(--bc-radius-control);
		cursor: pointer;
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-cta);
	}

	.bc-import-wizard__back {
		flex: 0 0 auto;
		border: 1px solid var(--bc-border);
		background: var(--bc-white);
		color: var(--bc-ink);
		padding: 0 13px;
	}

	.bc-import-wizard__next {
		flex: 1 1 auto;
		border: 0;
		background: var(--bc-ink);
		color: var(--bc-white);
		padding: 0 16px;
	}

	.bc-import-wizard__next:disabled {
		background: var(--bc-border);
		color: var(--bc-muted);
		cursor: not-allowed;
	}

	.bc-import-wizard__success {
		display: grid;
		gap: 10px;
		justify-items: start;
		padding-top: 8px;
	}

	.bc-import-wizard__success > span {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(196, 1, 1, 0.1);
		color: var(--bc-accent-hover);
	}

	.bc-import-wizard__success h2,
	.bc-import-wizard__success p {
		margin: 0;
	}

	.bc-import-wizard__success h2 {
		font-size: 22px;
		font-weight: 700;
		line-height: 27px;
	}

	.bc-import-wizard__success p {
		max-width: 52ch;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.bc-import-wizard__success button {
		display: flex;
		width: 100%;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		margin-top: 4px;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-ink);
		color: var(--bc-white);
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
	}

	.bc-import-wizard__nav :global(svg),
	.bc-import-wizard__header button :global(svg),
	.bc-import-wizard__intent :global(svg),
	.bc-import-wizard__success :global(svg) {
		color: currentColor;
		stroke: currentColor;
	}

	/* overlay-polish-v2: full-screen, compact import flow */
	.bc-import-wizard {
		gap: 0;
		background: var(--bc-bg-strong);
		padding: 0;
		grid-template-rows: max-content max-content minmax(0, 1fr) max-content;
	}
	.bc-import-wizard__header {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) 40px;
		align-items: center;
		gap: 8px;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		padding: max(8px, env(safe-area-inset-top)) var(--bc-mobile-gutter) 7px;
	}
	.bc-import-wizard__header > div {
		grid-column: 2;
		grid-row: 1;
		gap: 1px;
		text-align: center;
	}
	.bc-import-wizard__header > button {
		grid-column: 1;
		grid-row: 1;
		width: 40px;
		height: 40px;
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.bc-import-wizard__header::after {
		content: '';
		grid-column: 3;
		grid-row: 1;
		width: 40px;
		height: 40px;
	}
	.bc-import-wizard__header h2 {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.bc-import-wizard__header p {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		line-height: var(--bc-mobile-meta-leading);
		font-weight: var(--bc-weight-body);
	}
	.bc-import-wizard__progress {
		gap: 4px;
		padding: 0 var(--bc-mobile-gutter) 8px;
	}
	.bc-import-wizard__progress span {
		height: 3px;
		background: var(--bc-border);
	}

	.bc-import-wizard__body {
		gap: 10px;
		align-content: start;
		grid-auto-rows: max-content;
		background: var(--bc-bg-strong);
		padding: 8px var(--bc-mobile-gutter) 18px;
	}
	.bc-import-wizard__intro {
		gap: 2px;
	}
	.bc-import-wizard__intro h3 {
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: var(--bc-weight-heading);
	}
	.bc-import-wizard__intro p {
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		font-weight: var(--bc-weight-body);
	}
	.bc-import-wizard__intent {
		gap: 6px;
	}
	.bc-import-wizard__intent button {
		min-height: 42px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		font-size: var(--bc-text-control);
		padding: 0 10px;
		line-height: var(--bc-leading-control);
		font-weight: var(--bc-weight-control);
	}
	.bc-import-wizard__intent button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.bc-import-wizard__fields {
		gap: 10px 8px;
	}
	.bc-import-wizard__fields label,
	.bc-import-wizard__fields fieldset {
		gap: 5px;
	}
	.bc-import-wizard__fields span,
	.bc-import-wizard__fields legend {
		font-size: var(--bc-mobile-label);
		line-height: var(--bc-mobile-label-leading);
		font-weight: var(--bc-weight-heading);
	}
	.bc-import-wizard__fields input,
	.bc-import-wizard__fields textarea {
		border: 0 !important;
		border-radius: 10px !important;
		background: var(--bc-white) !important;
	}
	.bc-import-wizard__fields input {
		height: 44px !important;
		padding: 0 11px !important;
	}
	.bc-import-wizard__fields textarea {
		min-height: 70px;
		padding: 9px 11px !important;
	}
	.bc-import-wizard__fields input:focus,
	.bc-import-wizard__fields textarea:focus {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--bc-accent) 48%, transparent) !important;
	}

	.bc-import-wizard__country-grid {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding: 1px 0 3px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.bc-import-wizard__country-grid::-webkit-scrollbar {
		display: none;
	}
	.bc-import-wizard__country-grid button {
		display: inline-flex;
		min-height: 40px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		padding: 0 12px;
	}
	.bc-import-wizard__country-grid button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.bc-import-wizard__country-grid button > img {
		width: 20px;
		height: 14px;
	}
	.bc-import-wizard__chips {
		gap: 6px;
	}
	.bc-import-wizard__chips button {
		min-height: 38px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		padding: 0 12px;
	}
	.bc-import-wizard__chips button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.bc-import-wizard__nav {
		gap: 8px;
		border-top: 1px solid var(--bc-border);
		background: var(--bc-bg-strong);
		padding: 9px var(--bc-mobile-gutter) calc(9px + env(safe-area-inset-bottom));
	}
	.bc-import-wizard__back,
	.bc-import-wizard__next {
		min-height: 46px;
		border-radius: 11px;
	}
	.bc-import-wizard__back {
		border: 0;
		background: var(--bc-white);
	}
	.bc-import-wizard__next {
		background: var(--bc-accent);
	}
	.bc-import-wizard__next:disabled {
		background: var(--bc-border);
		color: var(--bc-muted);
	}
</style>
