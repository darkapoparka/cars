<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		validateImportVehicle,
		validateLeadContact,
		type LeadIssue
	} from '$lib/utils/lead-validation';
	import { CircleCheck, Globe2, Phone } from '@lucide/svelte';
	import { page as appPage } from '$app/state';
	import { submitImportRequest } from '$lib/client/import-request-submit';
	import MobileLeadInfo from '$lib/components/shared/mobile/MobileLeadInfo.svelte';
	import { importOrigins, DEFAULT_IMPORT_ORIGIN } from '$lib/data/lead-content';
	import MobileLeadForm from '$lib/components/shared/mobile/MobileLeadForm.svelte';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileLeadHero from '$lib/components/shared/mobile/MobileLeadHero.svelte';
	import MobileLeadContactCard from '$lib/components/shared/mobile/MobileLeadContactCard.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { HomeMobileVehicle } from '$lib/types/home';
	import MobileImportExamples from './MobileImportExamples.svelte';
	import {
		buildImportNotes,
		parseBudgetAmount,
		parseYearValue,
		readImportIntent
	} from '$lib/utils/import-intent';

	type ImportSubmitState = 'idle' | 'submitting' | 'success' | 'error';
	let { vehicles = [] }: { vehicles?: HomeMobileVehicle[] } = $props();

	const initial = readImportIntent(appPage.url.searchParams);
	const initialQuery = initial.query || [initial.make, initial.model].filter(Boolean).join(' ');

	let sourceUrl = $state(initial.sourceUrl);
	let importQuery = $state(initialQuery);
	let importMake = $state(initial.make);
	let importModel = $state(initial.model);
	let importYear = $state(initial.year);
	let importBudget = $state(initial.budget);
	let contact = $state(initial.phone);
	let message = $state('');
	let quickValue = $state(initial.sourceUrl);
	let quickVin = $state('');
	let quickMode = $state<'primary' | 'secondary'>('primary');
	let companyWebsite = $state('');
	let formOpen = $state(
		Boolean(
			initial.sourceUrl ||
			initial.query ||
			initial.make ||
			initial.model ||
			initial.year ||
			initial.budget ||
			initial.phone
		)
	);
	let infoOpen = $state(false);
	let formStep = $state<1 | 2>(1);
	let submitState = $state<ImportSubmitState>('idle');
	let submitMessage = $state('');
	let issue = $state<LeadIssue | null>(null);
	let submissionController: AbortController | undefined;
	onDestroy(() => submissionController?.abort());
	let selectedOrigin = $state<string>(DEFAULT_IMPORT_ORIGIN);

	const originOptions = importOrigins;
	const selectedOriginLabel = $derived(
		originOptions.find((option) => option.code === selectedOrigin)?.label ?? 'Всички'
	);
	const originSearchLabel = $derived(
		selectedOrigin === DEFAULT_IMPORT_ORIGIN
			? 'Търсене без предпочитана държава'
			: `Търсене от ${selectedOriginLabel}`
	);

	const phoneHref = daynightSite.phoneHref;
	const requestTitle = $derived(
		importQuery.trim() ||
			[importMake.trim(), importModel.trim()].filter(Boolean).join(' ') ||
			'Заявка за внос'
	);
	const requestMeta = $derived(
		[
			importYear.trim() && `след ${importYear.trim()}`,
			importBudget.trim() && `до ${importBudget.trim()} €`
		]
			.filter(Boolean)
			.join(' · ')
	);

	function applyQuickValue() {
		const value = (quickMode === 'secondary' ? quickVin : quickValue).trim();
		if (!value) return;
		if (quickMode === 'primary') {
			sourceUrl = value;
			importQuery = '';
			importMake = '';
			importModel = '';
		} else {
			sourceUrl = '';
			if (value !== importQuery.trim()) {
				importMake = '';
				importModel = '';
			}
			importQuery = value;
		}
	}

	function openForm(applyQuick = true) {
		issue = null;
		if (applyQuick) applyQuickValue();
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
		formOpen = true;
	}

	function openManualForm() {
		openForm(false);
	}

	function chooseExample(car: HomeMobileVehicle) {
		sourceUrl = '';
		importQuery = `${car.brand} ${car.model}`;
		importMake = car.brand;
		importModel = car.model;
		importYear = String(car.year);
		// A sample stock price is not an import quote or the customer's budget.
		importBudget = '';
		openManualForm();
	}

	function closeForm() {
		submissionController?.abort();
		if (submitState === 'submitting') submitState = 'idle';
		issue = null;
		formOpen = false;
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
	}

	function goBack() {
		issue = null;
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (submitState === 'submitting') return;
		issue =
			formStep === 1
				? validateImportVehicle({
						sourceUrl,
						query: importQuery,
						year: importYear,
						budget: importBudget
					})
				: validateLeadContact(contact);
		if (issue) {
			submitState = 'error';
			submitMessage = issue.message;
			const field = (event.currentTarget as HTMLFormElement).elements.namedItem(issue.field);
			if (field instanceof HTMLElement) field.focus();
			return;
		}
		if (formStep === 1) {
			submitState = 'idle';
			submitMessage = '';
			formStep = 2;
			return;
		}
		const contactValue = contact.trim();
		const controller = new AbortController();
		submissionController = controller;

		const email = contactValue.includes('@') ? contactValue : null;
		const phone = email ? null : contactValue;
		submitState = 'submitting';
		submitMessage = '';

		const result = await submitImportRequest(
			{
				customerName: 'Заявка за внос от сайта',
				contact: contactValue,
				email,
				phone,
				originCountry: selectedOrigin,
				destinationCountry: daynightSite.countryCode,
				desiredMake: importMake.trim() || null,
				desiredModel: importModel.trim() || null,
				desiredYearMin: parseYearValue(importYear),
				desiredYearMax: null,
				budgetMin: null,
				budgetMax: parseBudgetAmount(importBudget),
				fuel: null,
				transmission: null,
				notes: [
					`Произход: ${selectedOriginLabel}`,
					buildImportNotes(
						{
							...initial,
							isImport: true,
							query: importQuery.trim(),
							make: importMake.trim(),
							model: importModel.trim(),
							year: importYear.trim(),
							budget: importBudget.trim(),
							sourceUrl: sourceUrl.trim(),
							phone: contactValue
						},
						message
					)
				]
					.filter(Boolean)
					.join('\n'),
				companyWebsite
			},
			{ signal: controller.signal }
		);
		if (controller.signal.aborted) return;

		if (result.ok) {
			submitState = 'success';
			formOpen = false;
			formStep = 1;
			return;
		}

		submitState = 'error';
		submitMessage = result.error;
	}

	function startAnother() {
		sourceUrl = '';
		importQuery = '';
		importMake = '';
		importModel = '';
		importYear = '';
		importBudget = '';
		contact = '';
		message = '';
		quickValue = '';
		quickVin = '';
		companyWebsite = '';
		submitState = 'idle';
		submitMessage = '';
		openForm();
	}
</script>

<div class="mobile-import">
	<MobileLeadHero
		kind="import"
		title="Внос на автомобил"
		bind:value={quickValue}
		bind:vinValue={quickVin}
		bind:mode={quickMode}
		onSubmit={openForm}
		onManual={openManualForm}
		onInfo={() => (infoOpen = true)}
	/>

	<main id="main-content" tabindex="-1" class="mobile-lead-main">
		{#if submitState === 'success'}
			<section class="import-success" aria-labelledby="import-success-title">
				<span class="import-success__icon"><CircleCheck size={22} strokeWidth={2.3} /></span>
				<div>
					<h2 id="import-success-title">Заявката е изпратена</h2>
					<p>Ще се свържем с Вас с конкретни варианти и следваща стъпка.</p>
				</div>
				<div class="import-success__actions">
					<a href={phoneHref}><Phone size={17} strokeWidth={2.3} /> Обади се</a>
					<button type="button" onclick={startAnother}>Нова заявка</button>
				</div>
			</section>
		{:else}
			<nav class="import-origins" aria-label="Произход на автомобила">
				{#each originOptions as option (option.code)}
					<button
						type="button"
						class:active={selectedOrigin === option.code}
						onclick={() => (selectedOrigin = option.code)}
						aria-pressed={selectedOrigin === option.code}
					>
						{#if option.code === 'XX'}
							<Globe2 size={17} strokeWidth={2.2} aria-hidden="true" />
						{:else}
							<span
								class={`import-origin-flag import-origin-flag--${option.code.toLowerCase()}`}
								aria-hidden="true"
							></span>
						{/if}
						<span>{option.label}</span>
					</button>
				{/each}
			</nav>
			<MobileImportExamples {vehicles} onSelect={chooseExample} />
			<MobileLeadContactCard
				{phoneHref}
				title="Искаш съдействие?"
				copy="Ще помогнем с избора, проверката и вноса."
			/>
		{/if}
	</main>

	<MobileFullSheet bind:open={formOpen} labelledBy="import-sheet-title" onClose={closeForm}>
		<MobileLeadForm
			titleId="import-sheet-title"
			step={formStep}
			busy={submitState === 'submitting'}
			errorMessage={submitMessage}
			submitLabel="Изпрати заявка"
			onSubmit={handleSubmit}
			onBack={goBack}
			onClose={closeForm}
		>
			<p class="import-origin-summary import-origin-summary--form">{originSearchLabel}</p>
			{#if formStep === 1}
				<section class="lead-fields" aria-label="Автомобил за внос">
					<label class="lead-field">
						<span>Линк към обява <small>по желание</small></span>
						<input
							name="sourceUrl"
							aria-invalid={issue?.field === 'sourceUrl' ? true : undefined}
							aria-describedby={issue?.field === 'sourceUrl'
								? 'import-sheet-title-error'
								: undefined}
							bind:value={sourceUrl}
							type="url"
							inputmode="url"
							placeholder="https://..."
							autocomplete="url"
						/>
					</label>
					<label class="lead-field">
						<span>Какъв автомобил търсите</span>
						<input
							name="query"
							aria-invalid={issue?.field === 'query' ? true : undefined}
							aria-describedby={issue?.field === 'query' ? 'import-sheet-title-error' : undefined}
							bind:value={importQuery}
							oninput={() => {
								importMake = '';
								importModel = '';
							}}
							type="text"
							placeholder="BMW X5, дизел..."
							autocomplete="off"
							required={!sourceUrl.trim()}
						/>
					</label>
					<div class="lead-field-grid">
						<label class="lead-field">
							<span>Година от</span>
							<input
								name="year"
								aria-invalid={issue?.field === 'year' ? true : undefined}
								aria-describedby={issue?.field === 'year' ? 'import-sheet-title-error' : undefined}
								bind:value={importYear}
								type="text"
								inputmode="numeric"
								placeholder="2020"
							/>
						</label>
						<label class="lead-field">
							<span>Бюджет €</span>
							<input
								name="budget"
								aria-invalid={issue?.field === 'budget' ? true : undefined}
								aria-describedby={issue?.field === 'budget'
									? 'import-sheet-title-error'
									: undefined}
								bind:value={importBudget}
								type="text"
								inputmode="numeric"
								placeholder="40 000"
							/>
						</label>
					</div>
				</section>
			{:else}
				<section class="lead-fields" aria-label="Контакт">
					<div class="lead-summary">
						<div>
							<span>Търсене</span><strong>{requestTitle}</strong>{#if requestMeta}<small
									>{requestMeta}</small
								>{/if}
						</div>
						<button type="button" onclick={goBack}>Редактирай</button>
					</div>
					<label class="lead-field">
						<span>Телефон или имейл</span>
						<input
							name="contact"
							aria-invalid={issue?.field === 'contact' ? true : undefined}
							aria-describedby={issue?.field === 'contact' ? 'import-sheet-title-error' : undefined}
							bind:value={contact}
							type="text"
							placeholder="08... или email"
							autocomplete="email"
							required
						/>
					</label>
					<label class="lead-field lead-field--textarea">
						<span>Бележка <small>по желание</small></span>
						<textarea
							name="message"
							aria-invalid={issue?.field === 'message' ? true : undefined}
							aria-describedby={issue?.field === 'message' ? 'import-sheet-title-error' : undefined}
							bind:value={message}
							rows="3"
							placeholder="Оборудване, гориво, други условия..."
						></textarea>
					</label>
				</section>
			{/if}

			<label class="honeypot" aria-hidden="true">
				<span>Компания</span><input
					bind:value={companyWebsite}
					type="text"
					tabindex="-1"
					autocomplete="off"
				/>
			</label>
		</MobileLeadForm>
	</MobileFullSheet>

	<MobileFullSheet
		presentation="content"
		draggable
		bind:open={infoOpen}
		labelledBy="import-info-title"
		onClose={() => (infoOpen = false)}
	>
		<MobileLeadInfo titleId="import-info-title" kind="import" onClose={() => (infoOpen = false)} />
	</MobileFullSheet>
</div>

<style>
	.import-origin-summary {
		margin: 0;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-caption);
		line-height: 1.35;
	}
	.import-origin-summary--form {
		margin-bottom: 16px;
		color: var(--sa-ink);
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-import {
		display: none;
		min-height: 100svh;
		background: var(--sa-bg);
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}

	.mobile-lead-main {
		position: relative;
		z-index: 2;
		display: grid;
		flex: 1;
		align-content: start;
		gap: 10px;
		margin-top: calc(-1 * var(--sa-mobile-panel-overlap));
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: var(--sa-surface);
		padding: 18px var(--sa-mobile-gutter) calc(86px + env(safe-area-inset-bottom));
		box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.18);
	}

	.import-origins {
		display: flex;
		gap: 7px;
		overflow-x: auto;
		margin-inline: -2px;
		padding: 0 2px 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.import-origins::-webkit-scrollbar {
		display: none;
	}
	.import-origins button {
		display: inline-flex;
		min-height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 0;
		border-radius: var(--sa-pill-radius);
		background: var(--sa-fill);
		color: #25303b;
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		padding: 0 13px;
		cursor: pointer;
		white-space: nowrap;
		-webkit-tap-highlight-color: transparent;
	}
	.import-origins button.active {
		border-color: var(--sa-red);
		background: var(--sa-red);
		color: #fff;
		box-shadow: none;
	}
	.import-origins button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	.import-origin-flag {
		position: relative;
		display: inline-block;
		width: 20px;
		height: 14px;
		flex: 0 0 auto;
		overflow: hidden;
		border: 1px solid rgba(15, 20, 23, 0.12);
		border-radius: 2px;
		box-sizing: border-box;
	}
	.import-origin-flag--de {
		background: linear-gradient(#111 0 33.33%, #d71f2b 33.33% 66.66%, #f3ca20 66.66%);
	}
	.import-origin-flag--eu {
		background: #1748a0;
	}
	.import-origin-flag--eu::after {
		content: '•';
		position: absolute;
		inset: 0;
		color: #ffd43b;
		font-size: var(--sa-text-caption);
		line-height: 11px;
		text-align: center;
	}
	.import-origin-flag--us {
		background: repeating-linear-gradient(to bottom, #b22234 0 1.8px, #fff 1.8px 3.6px);
	}
	.import-origin-flag--us::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 8px;
		height: 7px;
		background: #3c3b6e;
	}
	.import-origin-flag--jp {
		background: #fff;
	}
	.import-origin-flag--jp::after {
		content: '';
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #bc002d;
		top: 3px;
		left: 6px;
	}
	.import-origin-flag--cn {
		background: #de2910;
	}
	.import-origin-flag--cn::after {
		content: '★';
		position: absolute;
		top: -2px;
		left: 2px;
		color: #ffde00;
		font-size: var(--sa-text-xs);
	}

	.import-success {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		gap: 11px;
		border: 1px solid var(--sa-line-strong);
		border-radius: var(--sa-r-md);
		background: #fff;
		padding: 14px;
	}
	.import-success__icon {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-red);
	}
	.import-success h2,
	.import-success p {
		margin: 0;
	}
	.import-success h2 {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-heading);
	}
	.import-success p {
		margin-top: 4px;
		color: var(--sa-muted);
		font-size: var(--sa-type-body);
		line-height: var(--sa-mobile-leading-meta);
	}
	.import-success__actions {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.import-success__actions a,
	.import-success__actions button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 10px;
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		text-decoration: none;
		cursor: pointer;
	}
	.import-success__actions a {
		background: var(--sa-red);
		color: #fff;
	}
	.import-success__actions button {
		background: var(--sa-fill);
		color: var(--sa-ink);
	}

	@media (max-width: 991px) {
		.mobile-import {
			display: flex;
			flex-direction: column;
		}
	}
</style>
