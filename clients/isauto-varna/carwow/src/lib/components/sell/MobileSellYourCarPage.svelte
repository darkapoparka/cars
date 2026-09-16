<script lang="ts">
	import { CircleCheck, Phone } from '@lucide/svelte';
	import { untrack, onDestroy } from 'svelte';
	import {
		validateSellVehicle,
		validateLeadContact,
		type LeadIssue
	} from '$lib/utils/lead-validation';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { submitLead } from '$lib/client/lead-submit';
	import MobileLeadSteps from '$lib/components/shared/mobile/MobileLeadSteps.svelte';
	import MobileLeadInfo from '$lib/components/shared/mobile/MobileLeadInfo.svelte';
	import MobileLeadForm from '$lib/components/shared/mobile/MobileLeadForm.svelte';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileLeadHero from '$lib/components/shared/mobile/MobileLeadHero.svelte';
	import MobileLeadContactCard from '$lib/components/shared/mobile/MobileLeadContactCard.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	type SellSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { initialPath = '/sell-your-car' }: { initialPath?: string } = $props();

	const initialParam = (key: string) =>
		browser ? (appPage.url.searchParams.get(key)?.trim() ?? '') : '';

	let plate = $state(initialParam('plate'));
	let vin = $state(initialParam('vin'));
	let make = $state(initialParam('make'));
	let model = $state(initialParam('model'));
	let year = $state(initialParam('year'));
	let mileage = $state(initialParam('mileage'));
	let phone = $state(initialParam('phone'));
	let quickValue = $state(initialParam('plate') || initialParam('vin'));
	let companyWebsite = $state('');
	let formOpen = $state(
		untrack(() => initialPath.endsWith('/request')) ||
			(browser && ['plate', 'vin', 'make', 'model', 'year', 'mileage', 'phone'].some(initialParam))
	);
	let infoOpen = $state(false);
	let formStep = $state<1 | 2>(1);
	let sellSubmitState = $state<SellSubmitState>('idle');
	let sellSubmitMessage = $state('');
	let issue = $state<LeadIssue | null>(null);
	let submissionController: AbortController | undefined;
	onDestroy(() => submissionController?.abort());

	const phoneHref = daynightSite.phoneHref;
	const sellErrorMessage = `Не успяхме да изпратим заявката. Опитайте отново или се обадете на ${daynightSite.phoneLabel}.`;
	const vehicleTitle = $derived(
		[make.trim(), model.trim()].filter(Boolean).join(' ') ||
			plate.trim().toUpperCase() ||
			vin.trim().toUpperCase() ||
			'Автомобил'
	);
	const vehicleMeta = $derived(
		[year.trim(), mileage.trim() && `${mileage.trim()} км`].filter(Boolean).join(' · ')
	);
	const submittedFields = $derived.by(() =>
		[
			['Рег. номер', plate.trim().toUpperCase()],
			['VIN', vin.trim().toUpperCase()],
			['Автомобил', [make.trim(), model.trim()].filter(Boolean).join(' ')],
			['Година', year.trim()],
			['Километри', mileage.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => ({ label, value }))
	);

	function applyQuickIdentifier() {
		const raw = quickValue.trim().toUpperCase();
		if (!raw) return;
		const compact = raw.replace(/[\s-]/g, '');
		if (compact.length === 17) {
			vin = compact;
		} else {
			plate = raw;
		}
	}

	function openForm(applyQuick = true) {
		issue = null;
		if (applyQuick) applyQuickIdentifier();
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
		formOpen = true;
	}

	function openManualForm() {
		plate = '';
		vin = '';
		openForm(false);
	}

	function closeForm() {
		submissionController?.abort();
		if (sellSubmitState === 'submitting') sellSubmitState = 'idle';
		issue = null;
		formOpen = false;
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
	}

	function goBack() {
		issue = null;
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
	}

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
		issue =
			formStep === 1
				? validateSellVehicle({ plate, vin, make, model, year, mileage })
				: validateLeadContact(phone, true);
		if (issue) {
			sellSubmitState = 'error';
			sellSubmitMessage = issue.message;
			const field = (event.currentTarget as HTMLFormElement).elements.namedItem(issue.field);
			if (field instanceof HTMLElement) field.focus();
			return;
		}
		if (formStep === 1) {
			sellSubmitState = 'idle';
			sellSubmitMessage = '';
			formStep = 2;
			return;
		}
		const contactValue = phone.trim();
		const controller = new AbortController();
		submissionController = controller;

		sellSubmitState = 'submitting';
		sellSubmitMessage = '';
		const result = await submitLead(
			{
				customerName: 'Мобилна заявка за оценка',
				contact: contactValue,
				email: null,
				phone: contactValue,
				source: 'sell-your-car-mobile',
				message: buildNotes(),
				companyWebsite
			},
			{ signal: controller.signal }
		);
		if (controller.signal.aborted) return;

		if (result.ok) {
			sellSubmitState = 'success';
			formOpen = false;
			formStep = 1;
			return;
		}

		sellSubmitState = 'error';
		sellSubmitMessage = result.error || sellErrorMessage;
	}

	function startAnother() {
		plate = '';
		vin = '';
		make = '';
		model = '';
		year = '';
		mileage = '';
		phone = '';
		quickValue = '';
		companyWebsite = '';
		sellSubmitState = 'idle';
		sellSubmitMessage = '';
		openForm();
	}
</script>

<div class="mobile-sell">
	<MobileLeadHero
		kind="sell"
		title="Продай автомобила"
		bind:value={quickValue}
		onSubmit={openForm}
		onManual={openManualForm}
		onInfo={() => (infoOpen = true)}
	/>

	<main id="main-content" tabindex="-1" class="mobile-lead-main">
		{#if sellSubmitState === 'success'}
			<section class="sell-success" aria-labelledby="sell-success-title">
				<span class="sell-success__icon"><CircleCheck size={22} strokeWidth={2.3} /></span>
				<div>
					<h2 id="sell-success-title">Заявката е изпратена</h2>
					<p>Ще се свържем с Вас за оценката и следващата стъпка.</p>
				</div>
				{#if submittedFields.length}
					<dl>
						{#each submittedFields as field (field.label)}
							<div>
								<dt>{field.label}</dt>
								<dd>{field.value}</dd>
							</div>
						{/each}
					</dl>
				{/if}
				<div class="sell-success__actions">
					<a href={phoneHref}><Phone size={17} strokeWidth={2.3} /> Обади се</a>
					<button type="button" onclick={startAnother}>Нова заявка</button>
				</div>
			</section>
		{:else}
			<MobileLeadContactCard
				{phoneHref}
				title="Предпочиташ разговор?"
				copy="Ще помогнем с оценката и следващите стъпки."
				image={resolve('/assets/images/home-promos/phone-portrait-generated-v7.webp')}
			/>
			<MobileLeadSteps kind="sell" onOpen={() => (infoOpen = true)} />
		{/if}
	</main>

	<MobileFullSheet bind:open={formOpen} labelledBy="sell-sheet-title" onClose={closeForm}>
		<MobileLeadForm
			titleId="sell-sheet-title"
			step={formStep}
			busy={sellSubmitState === 'submitting'}
			errorMessage={sellSubmitMessage}
			submitLabel="Изпрати за оценка"
			onSubmit={handleSubmit}
			onBack={goBack}
			onClose={closeForm}
		>
			{#if formStep === 1}
				<section class="lead-fields" aria-label="Данни за автомобила">
					<div class="lead-field-grid">
						<label class="lead-field">
							<span>Марка</span>
							<input
								name="make"
								aria-invalid={issue?.field === 'make' ? true : undefined}
								aria-describedby={issue?.field === 'make' ? 'sell-sheet-title-error' : undefined}
								bind:value={make}
								type="text"
								placeholder="BMW"
								autocomplete="off"
							/>
						</label>
						<label class="lead-field">
							<span>Модел</span>
							<input
								name="model"
								aria-invalid={issue?.field === 'model' ? true : undefined}
								aria-describedby={issue?.field === 'model' ? 'sell-sheet-title-error' : undefined}
								bind:value={model}
								type="text"
								placeholder="X5"
								autocomplete="off"
							/>
						</label>
					</div>
					<div class="lead-field-grid">
						<label class="lead-field">
							<span>Година</span>
							<input
								name="year"
								aria-invalid={issue?.field === 'year' ? true : undefined}
								aria-describedby={issue?.field === 'year' ? 'sell-sheet-title-error' : undefined}
								bind:value={year}
								type="text"
								inputmode="numeric"
								placeholder="2020"
							/>
						</label>
						<label class="lead-field">
							<span>Километри</span>
							<input
								name="mileage"
								aria-invalid={issue?.field === 'mileage' ? true : undefined}
								aria-describedby={issue?.field === 'mileage' ? 'sell-sheet-title-error' : undefined}
								bind:value={mileage}
								type="text"
								inputmode="numeric"
								placeholder="120 000"
							/>
						</label>
					</div>
					<label class="lead-field">
						<span>Регистрационен номер <small>по желание</small></span>
						<input
							name="plate"
							aria-invalid={issue?.field === 'plate' ? true : undefined}
							aria-describedby={issue?.field === 'plate' ? 'sell-sheet-title-error' : undefined}
							bind:value={plate}
							type="text"
							placeholder="CB 1234 AB"
							autocomplete="off"
						/>
					</label>
					<label class="lead-field">
						<span>VIN <small>по желание</small></span>
						<input
							name="vin"
							aria-invalid={issue?.field === 'vin' ? true : undefined}
							aria-describedby={issue?.field === 'vin' ? 'sell-sheet-title-error' : undefined}
							bind:value={vin}
							type="text"
							placeholder="WBA..."
							autocomplete="off"
						/>
					</label>
				</section>
			{:else}
				<section class="lead-fields" aria-label="Контакт">
					<div class="lead-summary">
						<div>
							<span>Автомобил</span><strong>{vehicleTitle}</strong>{#if vehicleMeta}<small
									>{vehicleMeta}</small
								>{/if}
						</div>
						<button type="button" onclick={goBack}>Редактирай</button>
					</div>
					<label class="lead-field">
						<span>Телефон</span>
						<input
							name="contact"
							aria-invalid={issue?.field === 'contact' ? true : undefined}
							aria-describedby={issue?.field === 'contact' ? 'sell-sheet-title-error' : undefined}
							bind:value={phone}
							type="tel"
							inputmode="tel"
							placeholder="08..."
							autocomplete="tel"
							required
						/>
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
		labelledBy="sell-info-title"
		onClose={() => (infoOpen = false)}
	>
		<MobileLeadInfo titleId="sell-info-title" kind="sell" onClose={() => (infoOpen = false)} />
	</MobileFullSheet>
</div>

<style>
	.mobile-sell {
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
		gap: 12px;
		margin-top: calc(-1 * var(--sa-mobile-panel-overlap));
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: var(--sa-surface);
		padding: 18px var(--sa-mobile-gutter) calc(86px + env(safe-area-inset-bottom));
		box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.18);
	}

	.sell-success {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		gap: 11px;
		border: 1px solid var(--sa-line-strong);
		border-radius: var(--sa-r-md);
		background: #fff;
		padding: 14px;
	}

	.sell-success__icon {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-red);
	}

	.sell-success h2,
	.sell-success p {
		margin: 0;
	}
	.sell-success h2 {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-heading);
	}
	.sell-success p {
		margin-top: 4px;
		color: var(--sa-muted);
		font-size: var(--sa-type-body);
		line-height: var(--sa-mobile-leading-meta);
	}
	.sell-success dl {
		grid-column: 1 / -1;
		display: grid;
		gap: 1px;
		margin: 2px 0 0;
		overflow: hidden;
		border-radius: 10px;
		background: var(--sa-line);
	}
	.sell-success dl div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		background: var(--sa-fill);
		padding: 8px 10px;
	}
	.sell-success dt {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-micro);
	}
	.sell-success dd {
		margin: 0;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		text-align: right;
	}
	.sell-success__actions {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.sell-success__actions a,
	.sell-success__actions button {
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
	.sell-success__actions a {
		background: var(--sa-red);
		color: #fff;
	}
	.sell-success__actions button {
		background: var(--sa-fill);
		color: var(--sa-ink);
	}

	@media (max-width: 991px) {
		.mobile-sell {
			display: flex;
			flex-direction: column;
		}
	}
</style>
