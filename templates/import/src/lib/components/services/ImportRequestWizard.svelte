<script lang="ts">
	import { ArrowRight, Check, ChevronLeft, Link2, Search, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
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
	const years = Array.from({ length: 37 }, (_, index) => String(new Date().getFullYear() - index));

	let canContinue = $derived(
		step === 0
			? intent === 'listing'
				? vehicle.trim().length > 3
				: Boolean(origin) || make.trim().length > 1 || model.trim().length > 1
			: step === 2
				? phone.trim().length >= 6
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
				Запазихме данните за Day Night Auto. Екипът ще прегледа заявката и ще се свърже с теб до 24
				часа.
			</p>
			<button type="button" onclick={onclose}>Затвори</button>
		</div>
	{:else}
		<header class="bc-import-wizard__header">
			<div>
				<h2>Заявка за внос</h2>
				<p><strong>{step + 1}</strong> от {stepLabels.length} · {stepLabels[step]}</p>
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
					<label class="bc-import-wizard__field--wide" for="import-wizard-origin"
						><span>Държава</span><select id="import-wizard-origin" bind:value={origin}
							>{#each importCountries as country (country.value)}<option value={country.value}
									>{country.value ? country.label : 'Без значение'}</option
								>{/each}</select
						></label
					>
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
					{:else}
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
					<label for="import-wizard-year"
						><span>Година от</span><select id="import-wizard-year" bind:value={minYear}
							><option value="">Без значение</option>{#each years as year (year)}<option
									value={year}>{year}</option
								>{/each}</select
						></label
					>
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
					<label for="import-wizard-timeframe">
						<span>Желан срок</span>
						<select id="import-wizard-timeframe" bind:value={timeframe}>
							{#each timeframeOptions as option (option)}<option value={option}>{option}</option
								>{/each}
						</select>
					</label>
					<label for="import-wizard-fuel"
						><span>Гориво</span><select id="import-wizard-fuel" bind:value={fuel}
							><option value="">Всички</option>{#each importFuels as option (option)}<option
									value={option}>{option}</option
								>{/each}</select
						></label
					>
					<label for="import-wizard-transmission"
						><span>Скорости</span><select id="import-wizard-transmission" bind:value={transmission}
							><option value="">Всички</option>{#each importTransmissions as option (option)}<option
									value={option}>{option}</option
								>{/each}</select
						></label
					>
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
					<h3>Къде да изпратим проверката?</h3>
					<p>Телефонът е необходим. Името и имейлът са по желание.</p>
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
						<span>Име</span>
						<input id="import-wizard-name" type="text" autocomplete="name" bind:value={name} />
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
				<p class="bc-import-wizard__promise">Отговор до 24 ч · Без ангажимент</p>
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
		color: #9f1117;
		font-size: 14px;
		line-height: 20px;
		margin: 0;
	}
	.bc-import-wizard__intro .bc-import-wizard__summary {
		margin-top: 8px;
		color: #17191c;
		overflow-wrap: anywhere;
	}
	.bc-import-wizard {
		display: grid;
		min-height: 100%;
		align-content: start;
		gap: 14px;
		color: #111111;
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
		font-size: 23px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 28px;
	}

	.bc-import-wizard__header p {
		color: #59636f;
		font-size: 13px;
		font-weight: 500;
		line-height: 17px;
	}

	.bc-import-wizard__header p strong {
		color: #111111;
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
		color: #111111;
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
		gap: 16px;
		padding: 2px 1px 8px;
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
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 25px;
	}

	.bc-import-wizard__intro p {
		max-width: 52ch;
		color: #59636f;
		font-size: 13.5px;
		font-weight: 500;
		line-height: 19px;
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
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		font-size: 13px;
		font-weight: 650;
		line-height: 17px;
		padding: 0 9px;
	}

	.bc-import-wizard__intent button.active {
		border-color: var(--bc-accent);
		background: rgba(196, 1, 1, 0.08);
		color: #9f1117;
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
		color: #4f5d57;
		font-size: 12px;
		font-weight: 700;
		line-height: 15px;
	}

	.bc-import-wizard__fields input,
	.bc-import-wizard__fields select,
	.bc-import-wizard__fields textarea {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-surface-soft) !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		outline: 0;
	}

	.bc-import-wizard__fields input,
	.bc-import-wizard__fields select {
		height: 48px !important;
		padding: 0 12px !important;
	}

	.bc-import-wizard__fields textarea {
		min-height: 100px;
		resize: vertical;
		padding: 11px 12px !important;
	}

	.bc-import-wizard__fields select {
		appearance: auto;
	}

	.bc-import-wizard__fields input::placeholder,
	.bc-import-wizard__fields textarea::placeholder {
		color: #7c8794;
		opacity: 1;
	}

	.bc-import-wizard__fields input:focus-visible,
	.bc-import-wizard__fields select:focus-visible,
	.bc-import-wizard__fields textarea:focus-visible {
		border-color: var(--bc-accent) !important;
		background: #ffffff !important;
	}

	.bc-import-wizard__promise {
		margin: -4px 0 0;
		color: #9f1117;
		font-size: 12px;
		font-weight: 700;
		line-height: 17px;
	}

	.bc-import-wizard__nav {
		display: flex;
		gap: 8px;
		padding-top: 0;
	}

	.bc-import-wizard__back,
	.bc-import-wizard__next {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: var(--bc-radius-control);
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bc-import-wizard__back {
		flex: 0 0 auto;
		border: 1px solid var(--bc-border);
		background: #ffffff;
		color: #111111;
		padding: 0 13px;
	}

	.bc-import-wizard__next {
		flex: 1 1 auto;
		border: 0;
		background: #1c1c1c;
		color: #ffffff;
		padding: 0 16px;
	}

	.bc-import-wizard__next:disabled {
		background: #d4d9de;
		color: #67727e;
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
		color: #9f1117;
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
		color: #59636f;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
	}

	.bc-import-wizard__success button {
		display: flex;
		width: 100%;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		margin-top: 4px;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: #1c1c1c;
		color: #ffffff;
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
</style>
