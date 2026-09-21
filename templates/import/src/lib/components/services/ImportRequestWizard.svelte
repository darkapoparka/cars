<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { optionLabel } from '$lib/i18n/options';
	import { contentText } from '$lib/content/localized';
	const ct = (value: string) => contentText(page.data.locale === 'en' ? 'en' : 'bg', value);
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { submitIntake } from '$lib/browser/submit-intake';
	import { receiptMessage, type InquiryReceipt } from '$lib/domain/inquiry';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Link2 from '@lucide/svelte/icons/link-2';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import { browser } from '$app/environment';
	import {
		readSessionDraft,
		saveSessionDraft,
		clearSessionDraft
	} from '$lib/browser/session-draft';
	import { site } from '$lib/config/site';
	import { onMount, tick } from 'svelte';
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
		embedded?: boolean;
		initialIntent: ImportIntent;
		initialVehicle?: string;
		initialCriteria?: ImportCriteria;
		onclose: () => void;
	};

	let {
		embedded = false,
		initialIntent,
		initialVehicle = '',
		initialCriteria = emptyImportCriteria,
		onclose
	}: Props = $props();

	const stepLabels = $derived([nt('ui167'), nt('ui238'), nt('ui137')] as const);
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
	let receipt = $state<InquiryReceipt | null>(null);
	let submitting = $state(false);
	let submitError = $state('');
	let validationMessage = $state('');
	let draftReady = $state(false);
	let wizardRoot = $state<HTMLDivElement | null>(null);
	const draftKey = $derived('template:import:v2:' + site.identity.origin + ':' + initialIntent);
	const historyId = `daynight-import-wizard-${Math.random().toString(36).slice(2)}`;
	let historyEntryActive = false;
	let closeAfterHistory = false;
	const requestCriteria = $derived({
		origin,
		make,
		model,
		minYear,
		maxPrice: budget,
		fuel,
		transmission
	});
	const criteriaSummary = $derived(
		importCriteriaSummary(requestCriteria, page.data.locale === 'en' ? 'en' : 'bg')
	);

	const clearDraft = () => {
		clearSessionDraft(draftKey);
	};

	const requestClose = () => {
		if (!browser || embedded || !historyEntryActive) {
			onclose();
			return;
		}
		closeAfterHistory = true;
		historyEntryActive = false;
		history.back();
	};

	const handleHistoryBack = () => {
		if (closeAfterHistory) {
			closeAfterHistory = false;
			onclose();
			return;
		}
		if (!historyEntryActive) return;
		historyEntryActive = false;
		validationMessage = '';
		if (!submitted && step > 0) {
			step -= 1;
			queueMicrotask(() => {
				pushState('', { ...page.state, __daynightWizard: historyId });
				historyEntryActive = true;
			});
			return;
		}
		onclose();
	};

	onMount(() => {
		if (!browser) return;
		try {
			clearSessionDraft('daynight-import-request-draft-v1');
			const draft = readSessionDraft(draftKey);
			if (!draft) return;
			if (draft.intent === 'listing' || draft.intent === 'source') intent = draft.intent;
			if (typeof draft.step === 'number' && draft.step >= 0 && draft.step <= 2) step = draft.step;
			if (typeof draft.vehicle === 'string') vehicle = draft.vehicle;
			if (typeof draft.make === 'string') make = draft.make;
			if (typeof draft.model === 'string') model = draft.model;
			if (typeof draft.budget === 'string') budget = draft.budget;
			if (typeof draft.origin === 'string') origin = draft.origin;
			if (typeof draft.minYear === 'string') minYear = draft.minYear;
			if (typeof draft.fuel === 'string') fuel = draft.fuel;
			if (typeof draft.transmission === 'string') transmission = draft.transmission;
			if (typeof draft.timeframe === 'string') timeframe = draft.timeframe;
			if (typeof draft.notes === 'string') notes = draft.notes;
			if (typeof draft.name === 'string') name = draft.name;
			if (typeof draft.phone === 'string') phone = draft.phone;
			if (typeof draft.email === 'string') email = draft.email;
		} catch {
			clearDraft();
		} finally {
			draftReady = true;
		}
	});

	onMount(() => {
		if (embedded) return;
		pushState('', { ...page.state, __daynightWizard: historyId });
		historyEntryActive = true;
		window.addEventListener('popstate', handleHistoryBack);
		return () => window.removeEventListener('popstate', handleHistoryBack);
	});

	$effect(() => {
		if (!browser || !draftReady || submitted) return;
		saveSessionDraft(draftKey, {
			step,
			intent,
			vehicle,
			make,
			model,
			budget,
			origin,
			minYear,
			fuel,
			transmission,
			timeframe
		});
	});

	let canContinue = $derived(
		step === 0
			? intent === 'listing'
				? vehicle.trim().length > 3
				: Boolean(origin) || make.trim().length > 1 || model.trim().length > 1
			: step === 2
				? name.trim().length >= 2 && phone.trim().length >= 6
				: true
	);

	const focusFirstInvalid = async () => {
		let selector: string;
		if (step === 0 && intent === 'listing') {
			validationMessage = nt('ui243');
			selector = '#import-wizard-vehicle';
		} else if (step === 0) {
			validationMessage = nt('ui244');
			selector = '#import-wizard-make';
		} else if (name.trim().length < 2) {
			validationMessage = nt('ui245');
			selector = '#import-wizard-name';
		} else {
			validationMessage = nt('ui191');
			selector = '#import-wizard-phone';
		}
		await tick();
		wizardRoot?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: false });
	};

	const goBack = () => {
		validationMessage = '';
		if (step > 0) step -= 1;
	};

	const goNext = async () => {
		if (submitting) return;
		if (!canContinue) {
			await focusFirstInvalid();
			return;
		}
		validationMessage = '';
		if (step < stepLabels.length - 1) {
			step += 1;
			return;
		}
		submitting = true;
		submitError = '';
		try {
			receipt = await submitIntake('/api/inquiries', {
				name,
				phone,
				email,
				source: 'import-request',
				routePath: 'import',
				vehicle: intent === 'listing' ? vehicle : [make, model].filter(Boolean).join(' '),
				message: [nt('ui214'), criteriaSummary, `Срок: ${timeframe}`, notes]
					.filter(Boolean)
					.join('\n')
			});
			clearDraft();
			submitted = true;
		} catch {
			submitError = nt('ui246');
		} finally {
			submitting = false;
		}
	};
</script>

<div class="bc-import-wizard" class:bc-import-wizard--embedded={embedded} bind:this={wizardRoot}>
	{#if submitted}
		<div class="bc-import-wizard__success" role="status">
			<span><Check size={25} strokeWidth={2.4} aria-hidden="true" /></span>
			<h2>{nt('ui215')}</h2>
			<p>
				{receipt ? receiptMessage(receipt, page.data.locale === 'en') : ''}
			</p>
			<button type="button" onclick={requestClose}>{nt('ui33')}</button>
		</div>
	{:else}
		<header class="bc-import-wizard__header">
			<div>
				<p>{nt('ui165')} {step + 1} {nt('ui216')} {stepLabels.length}</p>
				<h2>{stepLabels[step]}</h2>
			</div>
			<button type="button" aria-label={nt('ui33')} onclick={requestClose}>
				<X size={20} strokeWidth={2.3} aria-hidden="true" />
			</button>
		</header>

		<div
			class="bc-import-wizard__progress"
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={3}
			aria-valuenow={step + 1}
			aria-label={`${nt('ui165')} ${step + 1} ${nt('ui216')} 3`}
		>
			{#each stepLabels as label, index (label)}
				<span class:done={index <= step}></span>
			{/each}
		</div>

		<div class="bc-import-wizard__body">
			{#if step === 0}
				<div class="bc-import-wizard__intro">
					<h3>{nt('ui217')}</h3>
					<p>{nt('ui218')}</p>
				</div>

				{#if !embedded}<div class="bc-import-wizard__intent" aria-label={nt('ui219')}>
						<button
							type="button"
							class:active={intent === 'listing'}
							aria-pressed={intent === 'listing'}
							onclick={() => (intent = 'listing')}
						>
							<Link2 size={17} strokeWidth={2.2} aria-hidden="true" />
							{nt('ui220')}
						</button>
						<button
							type="button"
							class:active={intent === 'source'}
							aria-pressed={intent === 'source'}
							onclick={() => (intent = 'source')}
						>
							<Search size={17} strokeWidth={2.2} aria-hidden="true" />
							{nt('ui221')}
						</button>
					</div>{/if}

				<div class="bc-import-wizard__fields">
					{#if intent === 'listing'}
						<label class="bc-import-wizard__field--wide" for="import-wizard-vehicle">
							<span>{nt('ui222')}</span>
							<input
								id="import-wizard-vehicle"
								type="text"
								placeholder={nt('ui223')}
								required
								bind:value={vehicle}
							/>
						</label>
					{/if}
					<fieldset class="bc-import-wizard__field--wide">
						<legend>{nt('ui224')}</legend>
						<div class="bc-import-wizard__country-grid">
							{#each importCountries as country (country.value)}
								<button
									type="button"
									class:active={origin === country.value}
									aria-pressed={origin === country.value}
									onclick={() => (origin = country.value)}
								>
									<img
										src={assetHref(country.flagSrc)}
										alt=""
										aria-hidden="true"
										width="24"
										height="18"
									/><strong
										>{optionLabel(country.label, page.data.locale === 'en' ? 'en' : 'bg')}</strong
									>
								</button>
							{/each}
						</div>
					</fieldset>
					{#if intent === 'source'}
						<label for="import-wizard-make">
							<span>{nt('ui171')}</span>
							<input
								id="import-wizard-make"
								type="text"
								placeholder={nt('ui225')}
								bind:value={make}
							/>
						</label>
						<label for="import-wizard-model">
							<span>{nt('ui172')}</span>
							<input
								id="import-wizard-model"
								type="text"
								placeholder={nt('ui226')}
								bind:value={model}
							/>
						</label>
					{/if}
				</div>
			{:else if step === 1}
				<div class="bc-import-wizard__intro">
					<h3>{nt('ui227')}</h3>
					<p>{nt('ui228')}</p>
				</div>
				<div class="bc-import-wizard__fields">
					<label for="import-wizard-year">
						<span>{nt('ui130')}</span>
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
						<span>{nt('ui229')}</span>
						<input
							id="import-wizard-budget"
							type="text"
							inputmode="numeric"
							placeholder="EUR"
							bind:value={budget}
						/>
					</label>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>{nt('ui230')}</legend>
						<div class="bc-import-wizard__chips">
							{#each timeframeOptions as option (option)}
								<button
									type="button"
									class:active={timeframe === option}
									aria-pressed={timeframe === option}
									onclick={() => (timeframe = option)}
									>{optionLabel(option, page.data.locale === 'en' ? 'en' : 'bg')}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>{nt('ui61')}</legend>
						<div class="bc-import-wizard__chips">
							{#each importFuels as option (option)}
								<button
									type="button"
									class:active={fuel === option}
									aria-pressed={fuel === option}
									onclick={() => (fuel = fuel === option ? '' : option)}
									>{optionLabel(option, page.data.locale === 'en' ? 'en' : 'bg')}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-import-wizard__field--wide">
						<legend>{nt('ui231')}</legend>
						<div class="bc-import-wizard__chips">
							{#each importTransmissions as option (option)}
								<button
									type="button"
									class:active={transmission === option}
									aria-pressed={transmission === option}
									onclick={() => (transmission = transmission === option ? '' : option)}
									>{optionLabel(option, page.data.locale === 'en' ? 'en' : 'bg')}</button
								>
							{/each}
						</div>
					</fieldset>
					<label class="bc-import-wizard__field--wide" for="import-wizard-notes">
						<span>{nt('ui232')}</span>
						<textarea id="import-wizard-notes" rows="4" placeholder={nt('ui233')} bind:value={notes}
						></textarea>
					</label>
				</div>
			{:else}
				<div class="bc-import-wizard__intro">
					<h3>{nt('ui41')}</h3>
					<p>{nt('ui234')}</p>
					{#if criteriaSummary}<p class="bc-import-wizard__summary">{criteriaSummary}</p>{/if}
				</div>
				<div class="bc-import-wizard__fields">
					<label class="bc-import-wizard__field--wide" for="import-wizard-phone">
						<span>{nt('ui178')}</span>
						<input
							id="import-wizard-phone"
							type="tel"
							inputmode="tel"
							autocomplete="tel"
							placeholder={nt('ui235')}
							required
							bind:value={phone}
						/>
					</label>
					<label for="import-wizard-name">
						<span>{nt('ui236')}</span>
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
						<span>{nt('ui22')}</span>
						<input
							id="import-wizard-email"
							type="email"
							inputmode="email"
							autocomplete="email"
							bind:value={email}
						/>
					</label>
				</div>
				<p class="bc-import-wizard__promise">{ct(templateInquiryCopy.notice)}</p>
			{/if}
		</div>

		{#if validationMessage}<p class="bc-import-wizard__error" role="alert">
				{validationMessage}
			</p>{/if}
		{#if submitError}<p class="bc-import-wizard__error" role="alert">{submitError}</p>{/if}
		<footer class="bc-import-wizard__nav" aria-busy={submitting}>
			{#if step > 0}
				<button type="button" class="bc-import-wizard__back" onclick={goBack} disabled={submitting}>
					<ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
					{nt('ui183')}
				</button>
			{/if}
			<button type="button" class="bc-import-wizard__next" disabled={submitting} onclick={goNext}>
				{submitting ? nt('ui184') : step < stepLabels.length - 1 ? nt('ui185') : nt('ui237')}
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
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		min-height: 0;
		color: var(--bc-ink);
	}

	.bc-import-wizard__header {
		justify-content: space-between;
	}

	.bc-import-wizard__header > div {
		display: grid;
	}

	.bc-import-wizard__header h2,
	.bc-import-wizard__header p {
		margin: 0;
	}

	.bc-import-wizard__header h2 {
		letter-spacing: -0.02em;
	}

	.bc-import-wizard__header > button {
		display: flex;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		cursor: pointer;
		padding: 0;
	}

	.bc-import-wizard__progress {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bc-import-wizard__progress span {
		border-radius: 999px;
	}

	.bc-import-wizard__progress span.done {
		background: var(--bc-accent);
	}

	.bc-import-wizard__body {
		display: grid;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
	}
	.bc-import-wizard__body::-webkit-scrollbar {
		display: none;
	}

	.bc-import-wizard__intro {
		display: grid;
	}

	.bc-import-wizard__intro h3,
	.bc-import-wizard__intro p {
		margin: 0;
	}

	.bc-import-wizard__intro h3 {
		letter-spacing: -0.015em;
	}

	.bc-import-wizard__intro p {
		max-width: 52ch;
		color: var(--bc-muted);
	}

	.bc-import-wizard__intent {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bc-import-wizard__intent button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		color: var(--bc-ink);
		cursor: pointer;
	}

	.bc-import-wizard__intent button.active {
		border-color: var(--bc-accent);
	}

	.bc-import-wizard__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
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
		box-shadow: none;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		outline: 0;
	}

	.bc-import-wizard__fields textarea {
		resize: vertical;
	}

	.bc-import-wizard__fields input::placeholder,
	.bc-import-wizard__fields textarea::placeholder {
		color: var(--bc-muted);
		opacity: 1;
	}

	.bc-import-wizard__fields input:focus-visible:focus-visible,
	.bc-import-wizard__fields textarea:focus-visible {
		border-color: var(--bc-accent);
		background: var(--bc-white);
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.bc-import-wizard__country-grid button {
		place-items: center;
		color: var(--bc-ink);
		cursor: pointer;
	}
	.bc-import-wizard__country-grid button > img {
		display: block;
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
	}

	.bc-import-wizard__chips {
		display: flex;
		flex-wrap: wrap;
	}
	.bc-import-wizard__chips button {
		display: inline-flex;
		align-items: center;
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
	}
	.bc-import-wizard__chips button.active {
		border-color: var(--bc-accent);
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
		padding-top: var(--bc-space-3);
	}

	.bc-import-wizard__back,
	.bc-import-wizard__next {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		cursor: pointer;
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-action);
		line-height: var(--bc-leading-cta);
	}

	.bc-import-wizard__back {
		flex: 0 0 auto;
		color: var(--bc-ink);
		padding: 0 13px;
	}

	.bc-import-wizard__next {
		flex: 1 1 auto;
		border: 0;
		color: var(--bc-white);
		padding: 0 16px;
	}

	.bc-import-wizard__next:disabled {
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
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-action);
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
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
	}
	.bc-import-wizard__fields input {
		height: 44px;
		padding: 0 11px;
	}
	.bc-import-wizard__fields textarea {
		min-height: 70px;
		padding: 9px 11px;
	}
	.bc-import-wizard__fields input:focus,
	.bc-import-wizard__fields textarea:focus {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--bc-accent) 48%, transparent);
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

	.bc-import-wizard--embedded {
		height: auto;
		min-height: 0;
		background: var(--bc-surface-raised);
		padding: 0;
	}
	.bc-import-wizard--embedded .bc-import-wizard__header {
		display: block;
		padding: 0 0 var(--bc-space-4);
		background: transparent;
	}
	.bc-import-wizard--embedded .bc-import-wizard__header > div {
		text-align: left;
	}
	.bc-import-wizard--embedded .bc-import-wizard__header h2 {
		font-size: var(--bc-text-h4);
	}
	.bc-import-wizard--embedded .bc-import-wizard__header > button,
	.bc-import-wizard--embedded .bc-import-wizard__header::after {
		display: none;
	}
	.bc-import-wizard--embedded .bc-import-wizard__progress {
		padding: 0;
	}
	.bc-import-wizard--embedded .bc-import-wizard__body {
		padding: var(--bc-space-5) 0;
		background: transparent;
		overflow: visible;
		gap: var(--bc-space-4);
	}
	.bc-import-wizard--embedded .bc-import-wizard__country-grid,
	.bc-import-wizard--embedded .bc-import-wizard__chips {
		flex-wrap: wrap;
		overflow: visible;
	}
	.bc-import-wizard--embedded .bc-import-wizard__fields {
		gap: var(--bc-form-gap);
	}
	.bc-import-wizard--embedded .bc-import-wizard__fields input,
	.bc-import-wizard--embedded .bc-import-wizard__fields textarea {
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-control);
	}
	.bc-import-wizard--embedded .bc-import-wizard__nav {
		padding: var(--bc-space-4) 0 0;
		background: transparent;
	}
	.bc-import-wizard--embedded .bc-import-wizard__next {
		background: var(--bc-accent);
	}
	.bc-import-wizard--embedded .bc-import-wizard__success {
		min-height: 320px;
		align-content: center;
	}
</style>
