<script lang="ts">
	import { optionLabel } from '$lib/i18n/options';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { submitIntake } from '$lib/browser/submit-intake';
	import { receiptMessage, type InquiryReceipt } from '$lib/domain/inquiry';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { browser } from '$app/environment';
	import {
		readSessionDraft,
		saveSessionDraft,
		clearSessionDraft
	} from '$lib/browser/session-draft';
	import { site } from '$lib/config/site';
	import { onMount, tick } from 'svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import MobileIntakeChoiceField from '$lib/components/common/MobileIntakeChoiceField.svelte';
	import MobileIntakeChoiceList from '$lib/components/common/MobileIntakeChoiceList.svelte';
	import { mobileIntakeCopy } from '$lib/content/mobile-intake';
	import {
		emptyVehicleIntakeOptions,
		type VehicleIntakeOptions
	} from '$lib/domain/vehicle-intake-options';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import { publicPageCopy } from '$lib/content/desktop-copy';

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
		embedded = false,
		mobile = false,
		intakeOptions = emptyVehicleIntakeOptions,
		dialog = false,
		open = $bindable(false),
		onCloseAutoFocus,
		onclose
	}: {
		initial?: WizardInitial;
		manualEntry?: boolean;
		embedded?: boolean;
		mobile?: boolean;
		intakeOptions?: VehicleIntakeOptions;
		dialog?: boolean;
		open?: boolean;
		onCloseAutoFocus?: (event: Event) => void;
		onclose?: () => void;
	} = $props();
	// svelte-ignore state_referenced_locally
	let dialogManualEntry = $state(manualEntry);
	const isManualEntry = $derived(dialog ? dialogManualEntry : manualEntry);

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
	let receipt = $state<InquiryReceipt | null>(null);
	let submitting = $state(false);
	let submitError = $state('');
	let validationMessage = $state('');
	let draftReady = $state(false);
	let bodyElement = $state<HTMLElement>();
	let wizardRoot = $state<HTMLDivElement | null>(null);
	const copy = $derived(publicPageCopy[page.data.locale === 'en' ? 'en' : 'bg'].sell);
	// Each dialog entry owns its draft even if the identification mode changes inside it.
	// svelte-ignore state_referenced_locally
	const dialogDraftKey = `template:sell:v2:${site.identity.origin}:dialog:${manualEntry ? 'manual' : 'vin'}:${initial?.vin ?? ''}`;
	const draftKey = () =>
		dialog
			? dialogDraftKey
			: `template:sell:v2:${site.identity.origin}:${manualEntry ? 'manual' : 'vin'}`;
	const historyId = `daynight-sell-wizard-${Math.random().toString(36).slice(2)}`;
	let historyEntryActive = false;
	let closeAfterHistory = false;

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

	let activeChoice = $state<'make' | 'model' | null>(null);
	let choiceHistoryActive = false;
	let choiceScrollTop = 0;
	const locale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const intakeCopy = $derived(mobileIntakeCopy[locale]);
	const choiceOptions = $derived(
		(activeChoice === 'make'
			? intakeOptions.makes
			: Object.hasOwn(intakeOptions.modelsByMake, make)
				? intakeOptions.modelsByMake[make]
				: []
		).map((value) => ({ value, label: value }))
	);
	async function restoreChoice() {
		const field = activeChoice;
		activeChoice = null;
		await tick();
		bodyElement?.scrollTo({ top: choiceScrollTop, behavior: 'auto' });
		wizardRoot?.querySelector<HTMLElement>('#sell-mobile-' + field)?.focus({ preventScroll: true });
	}
	function openChoice(field: 'make' | 'model') {
		choiceScrollTop = bodyElement?.scrollTop ?? 0;
		pushState('', { ...page.state, __daynightWizard: historyId });
		choiceHistoryActive = true;
		activeChoice = field;
	}
	function closeChoice() {
		if (choiceHistoryActive) history.back();
		else void restoreChoice();
	}
	function selectChoice(value: string) {
		if (activeChoice === 'make' && make !== value) {
			make = value;
			model = '';
		} else if (activeChoice === 'model') model = value;
		validationMessage = '';
		closeChoice();
	}
	const clearDraft = () => {
		clearSessionDraft(draftKey());
	};

	const requestClose = () => {
		if (!browser || embedded || !historyEntryActive) {
			onclose?.();
			return;
		}
		closeAfterHistory = true;
		historyEntryActive = false;
		history.back();
	};

	const handleHistoryBack = () => {
		if (choiceHistoryActive) {
			choiceHistoryActive = false;
			void restoreChoice();
			return;
		}
		if (closeAfterHistory) {
			closeAfterHistory = false;
			onclose?.();
			return;
		}
		if (!historyEntryActive) return;
		historyEntryActive = false;
		validationMessage = '';
		if (!submitted && step > 0) {
			step = 0;
			queueMicrotask(() => {
				pushState('', { ...page.state, __daynightWizard: historyId });
				historyEntryActive = true;
			});
			return;
		}
		onclose?.();
	};

	onMount(() => {
		if (!browser) return;
		try {
			clearSessionDraft('daynight-sell-car-draft-v1-manual');
			clearSessionDraft('daynight-sell-car-draft-v1-vin');
			const draft = readSessionDraft(draftKey());
			if (!draft) return;
			if (draft.step === 0 || draft.step === 1) step = draft.step;
			if (dialog && typeof draft.manualEntry === 'boolean') dialogManualEntry = draft.manualEntry;
			if (typeof draft.vin === 'string') vin = draft.vin;
			if (typeof draft.make === 'string') make = draft.make;
			if (typeof draft.model === 'string') model = draft.model;
			if (typeof draft.year === 'string') year = draft.year;
			if (typeof draft.mileage === 'string') mileage = draft.mileage;
			if (typeof draft.phone === 'string') phone = draft.phone;
			if (typeof draft.price === 'string') price = draft.price;
			if (typeof draft.location === 'string') location = draft.location;
			if (typeof draft.notes === 'string') notes = draft.notes;
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
		saveSessionDraft(draftKey(), {
			step,
			vin,
			make,
			model,
			year,
			mileage,
			price,
			...(dialog ? { manualEntry: dialogManualEntry } : {})
		});
	});

	const vehicleTitle = $derived(
		[make.trim(), model.trim(), year.trim()].filter(Boolean).join(' · ') ||
			vin.trim() ||
			nt('ui167')
	);
	const canContinue = $derived(
		step === 0
			? (!(dialog && isManualEntry) && vin.trim().length >= 5) ||
					(make.trim().length > 1 && model.trim().length > 1)
			: phone.trim().length >= 6
	);
	const scrollTop = () =>
		bodyElement?.scrollTo({
			top: 0,
			behavior:
				browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
		});

	const focusFirstInvalid = async () => {
		let selector: string;
		if (step === 0) {
			validationMessage = isManualEntry ? nt('ui189') : nt('ui190');
			selector = isManualEntry
				? make.trim().length < 2
					? mobile
						? '#sell-mobile-make'
						: '.sell-brand-rail button'
					: mobile
						? '#sell-mobile-model'
						: '#sell-flow-model'
				: '#sell-flow-vin';
		} else {
			validationMessage = nt('ui191');
			selector = '#sell-flow-phone';
		}
		await tick();
		wizardRoot?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: false });
	};

	function focusDialogStep() {
		if (!dialog) return;
		wizardRoot?.closest<HTMLElement>('[role="dialog"]')?.focus({ preventScroll: true });
	}

	function goBack() {
		validationMessage = '';
		if (step === 1) {
			step = 0;
			submitError = '';
			scrollTop();
			void tick().then(() => focusDialogStep());
		}
	}

	async function goNext() {
		if (submitting) return;
		if (!canContinue) {
			await focusFirstInvalid();
			return;
		}
		validationMessage = '';
		if (step === 0) {
			step = 1;
			submitError = '';
			scrollTop();
			await tick();
			focusDialogStep();
			return;
		}

		submitting = true;
		submitError = '';
		try {
			receipt = await submitIntake('/api/inventory/submissions', {
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
			});
			clearDraft();
			submitted = true;
		} catch {
			submitError = nt('ui192');
		} finally {
			submitting = false;
		}
	}
</script>

{#snippet navigationActions()}
	{#if step === 1}
		<button
			type="button"
			class="sell-flow__back"
			data-intake-back
			onclick={goBack}
			disabled={submitting}
		>
			<ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
			<span>{nt('ui183')}</span>
		</button>
	{/if}
	<button
		type="button"
		class="sell-flow__next"
		data-intake-next
		onclick={goNext}
		disabled={submitting}
	>
		<span>{submitting ? nt('ui184') : step === 0 ? nt('ui185') : nt('ui186')}</span>
		<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
	</button>
{/snippet}

{#snippet dialogFooter()}
	<div class="sell-flow__footer sell-flow__footer--dialog" aria-busy={submitting}>
		{#if submitted}
			<button type="button" class="sell-flow__next" onclick={requestClose}>{nt('ui33')}</button>
		{:else}
			{@render navigationActions()}
		{/if}
	</div>
{/snippet}

{#snippet wizardContent()}
	<div
		class="sell-flow"
		class:sell-flow--embedded={embedded}
		class:sell-flow--selecting={mobile && activeChoice !== null}
		class:sell-flow--dialog={dialog}
		class:desktop-intake={embedded}
		bind:this={wizardRoot}
	>
		{#if submitted}
			<section class="sell-flow__success" role="status">
				<span class="sell-flow__success-icon"><Check size={25} strokeWidth={2.5} /></span>
				<h2>{nt('ui164')}</h2>
				<p>{receipt ? receiptMessage(receipt, page.data.locale === 'en') : ''}</p>
				{#if !dialog}<button type="button" onclick={requestClose}>{nt('ui49')}</button>{/if}
			</section>
		{:else if mobile && activeChoice}
			<MobileIntakeChoiceList
				title={activeChoice === 'make' ? intakeCopy.selectMake : intakeCopy.selectModel}
				options={choiceOptions}
				value={activeChoice === 'make' ? make : model}
				{locale}
				backLabel={nt('ui183')}
				searchLabel={activeChoice === 'make' ? intakeCopy.searchMake : intakeCopy.searchModel}
				allowCustom
				maxLength={activeChoice === 'make' ? 60 : 80}
				onback={closeChoice}
				onselect={selectChoice}
			/>
		{:else}
			{#if !dialog}<header class="sell-flow__header" data-intake-header>
					<button
						type="button"
						class="sell-flow__close"
						aria-label={nt('ui33')}
						onclick={requestClose}
					>
						<X size={21} strokeWidth={2.3} />
					</button>
					<div>
						<span>{nt('ui165')} {step + 1} {nt('ui166')}</span>
						<h2>{step === 0 ? nt('ui167') : nt('ui137')}</h2>
					</div>
					<span class="sell-flow__header-spacer" aria-hidden="true"></span>
				</header>{/if}

			<div
				class="sell-flow__progress"
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={2}
				aria-valuenow={step + 1}
				aria-label={`${nt('ui165')} ${step + 1} ${nt('ui166')}`}
			>
				<span style={`width:${step === 0 ? '50%' : '100%'}`}></span>
			</div>
			<div class="sell-flow__body" bind:this={bodyElement}>
				{#if step === 0}
					{#if dialog}
						<ModeTabs
							value={isManualEntry ? 'manual' : 'vin'}
							surface="light"
							appearance="segmented"
							label={copy.identification}
							idPrefix="dialog-sell-mode"
							options={[
								{ value: 'vin', label: copy.vin, panelId: 'dialog-sell-intake' },
								{ value: 'manual', label: copy.makeModel, panelId: 'dialog-sell-intake' }
							]}
							onchange={(mode) => {
								dialogManualEntry = mode === 'manual';
								validationMessage = '';
							}}
						/>
					{/if}
					<section
						class="sell-flow__section"
						id={dialog ? 'dialog-sell-intake' : undefined}
						role={dialog ? 'tabpanel' : undefined}
						aria-labelledby={dialog
							? `dialog-sell-mode-${isManualEntry ? 'manual' : 'vin'}`
							: 'sell-flow-car-title'}
					>
						<div class="sell-flow__intro" data-intake-intro>
							<h3 id="sell-flow-car-title">{nt('ui168')}</h3>
							<p>
								{isManualEntry ? nt('ui169') : nt('ui170')}
							</p>
						</div>

						{#if !isManualEntry}
							<label data-intake-field class="sell-field sell-field--wide">
								<span>VIN</span>
								<input
									id="sell-flow-vin"
									bind:value={vin}
									type="text"
									placeholder="WBA..."
									autocomplete="off"
								/>
							</label>
						{/if}

						{#if mobile}
							<MobileIntakeChoiceField
								id="sell-mobile-make"
								label={nt('ui171')}
								value={make}
								placeholder={intakeCopy.selectMake}
								onopen={() => openChoice('make')}
							/>
							<MobileIntakeChoiceField
								id="sell-mobile-model"
								label={nt('ui172')}
								value={model}
								placeholder={make ? intakeCopy.selectModel : intakeCopy.makeFirst}
								disabled={!make.trim()}
								onopen={() => openChoice('model')}
							/>
							<div class="sell-field-grid">
								<label data-intake-field class="sell-field"
									><span>{nt('ui173')}</span><input
										bind:value={year}
										type="text"
										inputmode="numeric"
										maxlength="4"
										placeholder="2021"
									/></label
								>
								<label data-intake-field class="sell-field"
									><span>{nt('ui75')}</span><input
										bind:value={mileage}
										type="text"
										inputmode="numeric"
										placeholder={nt('ui174')}
									/></label
								>
							</div>
						{:else}
							<fieldset class="sell-fieldset" data-intake-field>
								<legend>{nt('ui171')}</legend>
								<div class="sell-brand-rail" data-intake-choices>
									{#each makeOptions as option (option)}
										<button
											type="button"
											class:active={make === option}
											aria-pressed={make === option}
											onclick={() => (make = option)}
										>
											{optionLabel(option, page.data.locale === 'en' ? 'en' : 'bg')}
										</button>
									{/each}
								</div>
							</fieldset>
							<div class="sell-field-grid">
								<label data-intake-field class="sell-field">
									<span>{nt('ui172')}</span>
									<input
										id="sell-flow-model"
										bind:value={model}
										type="text"
										placeholder="X5"
										autocomplete="off"
									/>
								</label>
								<label data-intake-field class="sell-field">
									<span>{nt('ui173')}</span>
									<input
										bind:value={year}
										type="text"
										inputmode="numeric"
										maxlength="4"
										placeholder="2021"
									/>
								</label>
							</div>

							<label data-intake-field class="sell-field sell-field--wide">
								<span>{nt('ui75')}</span>
								<input
									bind:value={mileage}
									type="text"
									inputmode="numeric"
									placeholder={nt('ui174')}
								/>
							</label>
						{/if}
					</section>
				{:else}
					<section class="sell-flow__section" aria-labelledby="sell-flow-contact-title">
						<div class="sell-flow__intro" data-intake-intro>
							<h3 id="sell-flow-contact-title">{nt('ui175')}</h3>
							<p>{nt('ui176')}</p>
						</div>
						<div class="sell-summary">
							<span>{nt('ui167')}</span>
							<strong>{vehicleTitle}</strong>
							<button type="button" onclick={goBack}>{nt('ui177')}</button>
						</div>

						<label data-intake-field class="sell-field sell-field--wide">
							<span>{nt('ui178')}</span>
							<input
								id="sell-flow-phone"
								bind:value={phone}
								type="tel"
								inputmode="tel"
								autocomplete="tel"
								placeholder="08..."
								required
							/>
						</label>

						<div class="sell-field-grid">
							<label data-intake-field class="sell-field">
								<span>{nt('ui179')}</span>
								<input bind:value={price} type="text" inputmode="numeric" placeholder="EUR" />
							</label>
							<label data-intake-field class="sell-field">
								<span>{nt('ui180')}</span>
								<input bind:value={location} type="text" autocomplete="address-level2" />
							</label>
						</div>
						<label data-intake-field class="sell-field sell-field--wide sell-field--notes">
							<span>{nt('ui181')}</span>
							<textarea bind:value={notes} rows="3" placeholder={nt('ui182')}></textarea>
						</label>

						{#if submitError}<p class="sell-flow__error" role="alert">{submitError}</p>{/if}
					</section>
				{/if}
			</div>

			{#if validationMessage}<p class="sell-flow__error sell-flow__error--validation" role="alert">
					{validationMessage}
				</p>{/if}

			{#if !dialog}<footer class="sell-flow__footer">
					{@render navigationActions()}
				</footer>{/if}
		{/if}
	</div>
{/snippet}

{#if dialog}
	<Modal
		bind:open
		title={copy.title}
		description={submitted
			? undefined
			: `${nt('ui165')} ${step + 1} ${nt('ui166')} · ${step === 0 ? nt('ui167') : nt('ui137')}`}
		class="desktop-sell-request"
		{onCloseAutoFocus}
		footer={dialogFooter}
	>
		{@render wizardContent()}
	</Modal>
{:else}
	{@render wizardContent()}
{/if}

<style>
	.sell-flow.sell-flow--selecting {
		display: block;
	}
	.sell-flow {
		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		height: 100%;
		min-height: 0;
		color: var(--bc-ink);
	}
	.sell-flow__error--validation {
		margin: 0 var(--bc-mobile-gutter) var(--bc-space-2);
	}

	.sell-flow__header {
		display: grid;
		align-items: center;
	}
	.sell-flow__header > div {
		display: grid;
		text-align: center;
	}
	.sell-flow__header h2 {
		margin: 0;
	}
	.sell-flow__header span {
		font-weight: 600;
	}
	.sell-flow__close {
		display: grid;
		place-items: center;
		border: 0;
		padding: 0;
		cursor: pointer;
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
		scrollbar-width: none;
	}
	.sell-flow__body::-webkit-scrollbar {
		display: none;
	}
	.sell-flow__section {
		display: grid;
	}
	.sell-flow__intro {
		display: grid;
	}
	.sell-flow__intro h3,
	.sell-flow__intro p {
		margin: 0;
	}
	.sell-flow__intro p {
		color: var(--bc-muted);
	}
	.sell-field,
	.sell-fieldset {
		display: grid;
		min-width: 0;
		margin: 0;
		border: 0;
		padding: 0;
	}
	.sell-field > span,
	.sell-fieldset legend {
		color: var(--bc-copy);
		padding: 0;
	}
	.sell-field input,
	.sell-field textarea {
		width: 100%;
		min-width: 0;
		box-shadow: none;
		color: var(--bc-ink);
		font-family: inherit;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		outline: 0;
	}
	.sell-field textarea {
		resize: none;
	}
	.sell-field input::placeholder,
	.sell-field textarea::placeholder {
		color: #8b95a1;
		opacity: 1;
	}
	.sell-field input:focus,
	.sell-field textarea:focus {
		border-color: var(--bc-accent);
	}
	.sell-field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.sell-brand-rail {
		display: flex;
		overflow-x: auto;
		padding: 1px 0 3px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.sell-brand-rail::-webkit-scrollbar {
		display: none;
	}
	.sell-brand-rail button {
		flex: 0 0 auto;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		cursor: pointer;
		white-space: nowrap;
		line-height: var(--bc-leading-control);
	}
	.sell-brand-rail button.active {
		border-color: var(--bc-accent);
	}
	.sell-summary {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 2px 12px;
		padding: 8px 12px 10px;
	}
	.sell-summary span {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}
	.sell-summary strong {
		grid-column: 1 / -1;
		grid-row: 2;
		min-width: 0;
		overflow-wrap: anywhere;
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}
	.sell-summary button {
		grid-column: 2;
		grid-row: 1;
		min-height: var(--bc-control-height-standard);
		border: 0;
		border-radius: 9px;
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
	}
	.sell-flow__footer > .sell-flow__next:only-child {
		grid-column: 1 / -1;
	}
	.sell-flow__back,
	.sell-flow__next {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-action);
		cursor: pointer;
		line-height: var(--bc-leading-cta);
	}
	.sell-flow__back {
		border: 0;
		color: var(--bc-ink);
		padding: 0 13px;
	}
	.sell-flow__next {
		border: 0;
		color: #fff;
		padding: 0 16px;
	}
	.sell-flow__next:disabled {
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
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-action);
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
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
	}
	.sell-field input {
		height: var(--bc-control-height-standard);
		padding: 0 11px;
	}
	.sell-field textarea {
		min-height: 70px;
		padding: 9px 11px;
	}
	.sell-field input:focus,
	.sell-field textarea:focus {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--bc-accent) 48%, transparent);
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

	.sell-flow--embedded {
		height: auto;
		min-height: 500px;
		background: var(--bc-surface-raised);
	}
	.sell-flow--embedded .sell-flow__header {
		display: block;
		padding: 0 0 var(--bc-space-4);
		background: transparent;
	}
	.sell-flow--embedded .sell-flow__header > div {
		text-align: left;
	}
	.sell-flow--embedded .sell-flow__header h2 {
		font-size: var(--bc-text-h4);
	}
	.sell-flow--embedded .sell-flow__close,
	.sell-flow--embedded .sell-flow__header-spacer {
		display: none;
	}
	.sell-flow--embedded .sell-flow__progress {
		margin: 0;
	}
	.sell-flow--embedded .sell-flow__body {
		padding: var(--bc-space-5) 0;
		background: transparent;
		overflow: visible;
	}
	.sell-flow--embedded .sell-flow__section,
	.sell-flow--embedded .sell-field-grid {
		gap: var(--bc-form-gap);
	}
	.sell-flow--embedded .sell-field input,
	.sell-flow--embedded .sell-field textarea {
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-control);
	}
	.sell-flow--embedded .sell-flow__footer {
		padding: var(--bc-space-4) 0 0;
		background: transparent;
	}
	.sell-flow--embedded .sell-flow__success {
		min-height: 320px;
		padding: 0;
	}
	@media (max-width: 767.98px) {
		.sell-flow__back,
		.sell-flow__next {
			min-width: 0;
		}
		.sell-flow__back > span,
		.sell-flow__next > span {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.sell-flow__back :global(svg),
		.sell-flow__next :global(svg) {
			flex: 0 0 auto;
		}
	}
	@media (max-width: 359.98px) {
		.sell-flow__back {
			width: var(--bc-control-height-standard);
			padding-inline: 0;
		}
		.sell-flow__back > span {
			position: absolute;
			width: 1px;
			height: 1px;
			clip-path: inset(50%);
		}
	}
	@media (min-width: 768px) {
		.sell-flow--dialog {
			min-height: 0;
			height: auto;
			grid-template-rows: auto auto;
			background: transparent;
		}
		.sell-flow--dialog .sell-flow__progress {
			padding: 0;
		}
		.sell-flow--dialog .sell-flow__body {
			display: grid;
			gap: var(--bc-space-5);
			padding: var(--bc-space-5) 0 0;
			overflow: visible;
		}
		.sell-flow--dialog .sell-flow__intro {
			gap: var(--bc-space-1);
		}
		.sell-flow--dialog .sell-flow__intro h3 {
			font-size: var(--bc-desktop-card-heading);
			line-height: var(--bc-leading-h4);
		}
		.sell-flow--dialog .sell-flow__intro p,
		.sell-flow--dialog .sell-summary :is(span, strong) {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
		.sell-flow--dialog .sell-field,
		.sell-flow--dialog .sell-fieldset {
			gap: var(--bc-space-2);
		}
		.sell-flow--dialog .sell-field > span,
		.sell-flow--dialog .sell-fieldset legend {
			font-size: var(--bc-text-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-body);
		}
		.sell-flow--dialog .sell-field :is(input, textarea),
		.sell-flow--dialog .sell-brand-rail button {
			border: 1px solid transparent;
			border-radius: var(--bc-radius-md);
			background: var(--bc-desktop-control-surface);
			padding-inline: var(--bc-space-3);
			font-size: var(--bc-text-control);
		}
		.sell-flow--dialog .sell-field input,
		.sell-flow--dialog .sell-brand-rail button,
		.sell-flow__footer--dialog button {
			min-height: var(--bc-control-height-primary);
		}
		.sell-flow--dialog .sell-brand-rail {
			flex-wrap: wrap;
			gap: var(--bc-space-2);
			overflow: visible;
			padding: 0;
		}
		.sell-flow--dialog .sell-brand-rail button.active {
			background: var(--bc-accent);
			color: var(--bc-white);
		}
		.sell-flow--dialog .sell-field textarea {
			padding-block: var(--bc-space-3);
		}
		.sell-flow--dialog .sell-flow__success {
			min-height: 240px;
		}
		.sell-flow__footer--dialog {
			display: flex;
			justify-content: flex-end;
			gap: var(--bc-space-3);
			border: 0;
			background: transparent;
			padding: 0;
		}
		.sell-flow__footer--dialog button {
			min-width: 104px;
			border-radius: var(--bc-radius-md);
			font-size: var(--bc-text-control);
		}
		.sell-flow__footer--dialog .sell-flow__back {
			background: var(--bc-desktop-control-surface);
		}
		.sell-flow__footer--dialog button:focus-visible {
			outline: 2px solid var(--bc-accent);
			outline-offset: 2px;
		}
		.sell-flow__footer--dialog button:hover:not(:disabled) {
			background: var(--bc-control-hover);
			color: var(--bc-ink);
		}
		.sell-flow__footer--dialog .sell-flow__next:hover:not(:disabled) {
			background: var(--bc-accent-hover);
			color: var(--bc-white);
		}
	}
</style>
