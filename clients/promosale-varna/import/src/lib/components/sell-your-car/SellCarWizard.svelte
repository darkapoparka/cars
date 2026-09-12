<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { ArrowRight, Camera, Check, ChevronLeft, X } from '@lucide/svelte';

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

	const stepLabels = ['Автомобил', 'Състояние', 'Екстри', 'Снимки', 'Контакт'];
	const makeOptions = [
		'BMW',
		'Mercedes-Benz',
		'Audi',
		'Volkswagen',
		'Toyota',
		'Volvo',
		'Ford',
		'Porsche',
		'Honda',
		'Друга'
	];
	const bodyOptions = ['Седан', 'Комби', 'SUV', 'Хечбек', 'Купе', 'Кабрио', 'Ван'];
	const fuelOptions = ['Бензин', 'Дизел', 'Хибрид', 'Електрически', 'Газ/Бензин'];
	const gearboxOptions = ['Автомат', 'Ръчни'];
	const conditionOptions = ['Отлично', 'Много добро', 'Добро', 'За ремонт'];
	const accidentOptions = ['Без щети', 'Козметични щети', 'Има удар'];
	const runningOptions = ['В движение', 'Има проблем', 'Не е в движение'];
	const serviceOptions = ['Пълна история', 'Частична история', 'Няма история'];
	const inspectionOptions = ['Валиден преглед', 'Изтекъл преглед', 'Нерегистриран'];
	const keyOptions = ['1 ключ', '2 ключа', '3+ ключа'];
	const comfortFeatures = [
		'Климатроник',
		'Кожен салон',
		'Подгрев на седалки',
		'Ел. седалки',
		'Панорамен покрив',
		'Безключов достъп'
	];
	const technologyFeatures = [
		'Навигация',
		'Парктроник',
		'Камера',
		'Адаптивен круиз',
		'LED / Ксенон',
		'4x4',
		'Теглич'
	];
	const colorOptions = [
		'Черен',
		'Бял',
		'Сив',
		'Сребърен',
		'Син',
		'Червен',
		'Зелен',
		'Кафяв',
		'Друг'
	];
	const financeOptions = ['Без финансиране', 'Има кредит / лизинг'];
	const timeOptions = ['9:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00'];
	const yearOptions = Array.from({ length: 37 }, (_, index) => String(2026 - index));

	let step = $state(0);
	let submitted = $state(false);
	let bodyElement = $state<HTMLElement>();

	// The detailed flow owns editable copies of the values supplied by the quick entry point.
	// svelte-ignore state_referenced_locally
	let vin = $state(initial?.vin ?? '');
	// svelte-ignore state_referenced_locally
	let make = $state(initial?.make ?? '');
	// svelte-ignore state_referenced_locally
	let model = $state(initial?.model ?? '');
	// svelte-ignore state_referenced_locally
	let year = $state(initial?.year ?? '');
	let bodyType = $state('');
	let fuel = $state('');
	let gearbox = $state('');
	let engine = $state('');
	let power = $state('');
	// svelte-ignore state_referenced_locally
	let mileage = $state(initial?.mileage ?? '');
	let condition = $state('');
	let accidents = $state('');
	let runningCondition = $state('');
	let serviceHistory = $state('');
	let inspection = $state('');
	let keys = $state('');
	let color = $state('');
	let selectedFeatures = $state<string[]>([]);
	// svelte-ignore state_referenced_locally
	let price = $state(initial?.price ?? '');
	// svelte-ignore state_referenced_locally
	let phone = $state(initial?.phone ?? '');
	let location = $state('Варна');
	let contactTime = $state('');
	let financeStatus = $state('');
	let notes = $state('');

	type PhotoSlot = { key: string; label: string; url: string | null };
	const photoSlots = $state<PhotoSlot[]>([
		{ key: 'front', label: 'Отпред', url: null },
		{ key: 'rear', label: 'Отзад', url: null },
		{ key: 'side', label: 'Отстрани', url: null },
		{ key: 'interior', label: 'Интериор', url: null },
		{ key: 'dash', label: 'Табло', url: null },
		{ key: 'damage', label: 'Забележки', url: null }
	]);

	const photoCount = $derived(photoSlots.filter((slot) => slot.url).length);
	const carSummary = $derived(
		[make, model, year].filter(Boolean).join(' · ') || 'Данните ще бъдат потвърдени по VIN'
	);
	const conditionSummary = $derived(
		[condition, accidents, serviceHistory].filter(Boolean).join(' · ') || 'Не е посочено'
	);
	const canContinue = $derived.by(() => {
		if (step === 0) {
			return (
				vin.trim().length >= 5 || (manualEntry && make.trim().length > 1 && model.trim().length > 1)
			);
		}
		if (step === 1) return mileage.trim().length >= 2;
		if (step === 4) return phone.trim().length >= 6;
		return true;
	});

	const toggleFeature = (feature: string) => {
		if (selectedFeatures.includes(feature)) {
			selectedFeatures = selectedFeatures.filter((item) => item !== feature);
			return;
		}

		selectedFeatures = [...selectedFeatures, feature];
	};

	const setPhoto = (slot: PhotoSlot, files: FileList | null) => {
		const file = files?.[0];
		if (!file) return;
		if (slot.url) URL.revokeObjectURL(slot.url);
		slot.url = URL.createObjectURL(file);
	};

	const clearPhoto = (slot: PhotoSlot) => {
		if (!slot.url) return;
		URL.revokeObjectURL(slot.url);
		slot.url = null;
	};

	const showStep = (nextStep: number) => {
		step = nextStep;
		bodyElement?.scrollTo({ top: 0, behavior: 'smooth' });
		bodyElement
			?.closest<HTMLElement>('.daynight-sell-wizard-drawer__sheet')
			?.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const goBack = () => {
		if (step > 0) showStep(step - 1);
	};

	const goNext = () => {
		if (!canContinue) return;
		if (step < stepLabels.length - 1) {
			showStep(step + 1);
			return;
		}

		submitted = true;
		if (browser) {
			try {
				localStorage.setItem(
					'daynight:sell-wizard',
					JSON.stringify({
						accidents,
						bodyType,
						color,
						condition,
						contactTime,
						engine,
						financeStatus,
						fuel,
						gearbox,
						inspection,
						keys,
						location,
						make,
						mileage,
						model,
						notes,
						phone,
						photoCount,
						power,
						price,
						runningCondition,
						selectedFeatures,
						serviceHistory,
						submittedAt: new Date().toISOString(),
						vin,
						year
					})
				);
			} catch {
				/* Prototype storage only. */
			}
		}
	};

	onDestroy(() => {
		photoSlots.forEach((slot) => {
			if (slot.url) URL.revokeObjectURL(slot.url);
		});
	});
</script>

<div class="bc-sell-wizard">
	<header class="bc-sell-wizard__header">
		<h2>Оценка на автомобила</h2>
		{#if onclose}
			<button type="button" aria-label="Затвори" onclick={onclose}>
				<X size={20} strokeWidth={2.3} aria-hidden="true" />
			</button>
		{/if}
	</header>

	{#if submitted}
		<div class="bc-sell-wizard__success">
			<span aria-hidden="true"><Check size={26} strokeWidth={2.6} /></span>
			<h3>Заявката е приета</h3>
			<p>
				Екипът ще прегледа данните и снимките и ще се свърже до 24 ч с конкретна оценка и следващ
				ход.
			</p>
			<button type="button" onclick={() => onclose?.()}>Готово</button>
		</div>
	{:else}
		<div class="bc-sell-wizard__progress" aria-hidden="true">
			{#each stepLabels as label, index (label)}
				<span class:done={index <= step}></span>
			{/each}
		</div>
		<p class="bc-sell-wizard__step-label">
			Стъпка {step + 1} от {stepLabels.length} · <strong>{stepLabels[step]}</strong>
		</p>

		<div class="bc-sell-wizard__body" bind:this={bodyElement}>
			{#if step === 0}
				<div class="bc-sell-wizard__intro">
					<h3>Кой автомобил продавате?</h3>
					<p>
						{manualEntry
							? 'Въведете марка и модел. VIN може да добавите по-късно.'
							: 'VIN е попълнен от началния екран. Допълнете данните, които разпознавате.'}
					</p>
				</div>
				<div class="bc-sell-wizard__fields">
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-vin">
						<span>{manualEntry ? 'VIN номер (по желание)' : 'VIN номер *'}</span>
						<input
							id="sell-wizard-vin"
							type="text"
							placeholder="Например WBA..."
							autocomplete="off"
							required={!manualEntry}
							bind:value={vin}
						/>
					</label>
					<label for="sell-wizard-make">
						<span>Марка</span>
						<select id="sell-wizard-make" bind:value={make}>
							<option value="">Избери</option>
							{#each makeOptions as option (option)}<option value={option}>{option}</option>{/each}
						</select>
					</label>
					<label for="sell-wizard-model">
						<span>Модел</span>
						<input
							id="sell-wizard-model"
							type="text"
							placeholder="Например X5"
							bind:value={model}
						/>
					</label>
					<label for="sell-wizard-year">
						<span>Година</span>
						<select id="sell-wizard-year" bind:value={year}>
							<option value="">Избери</option>
							{#each yearOptions as option (option)}<option value={option}>{option}</option>{/each}
						</select>
					</label>
					<label for="sell-wizard-fuel">
						<span>Гориво</span>
						<select id="sell-wizard-fuel" bind:value={fuel}>
							<option value="">Избери</option>
							{#each fuelOptions as option (option)}<option value={option}>{option}</option>{/each}
						</select>
					</label>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Скорости</legend>
						<div class="bc-sell-wizard__chips">
							{#each gearboxOptions as option (option)}
								<button
									type="button"
									class:active={gearbox === option}
									aria-pressed={gearbox === option}
									onclick={() => (gearbox = gearbox === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Купе</legend>
						<div class="bc-sell-wizard__chips">
							{#each bodyOptions as option (option)}
								<button
									type="button"
									class:active={bodyType === option}
									aria-pressed={bodyType === option}
									onclick={() => (bodyType = bodyType === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<label for="sell-wizard-engine">
						<span>Двигател</span>
						<input
							id="sell-wizard-engine"
							type="text"
							placeholder="Напр. 2.0"
							bind:value={engine}
						/>
					</label>
					<label for="sell-wizard-power">
						<span>Мощност</span>
						<input
							id="sell-wizard-power"
							type="text"
							inputmode="numeric"
							placeholder="к.с."
							bind:value={power}
						/>
					</label>
				</div>
			{:else if step === 1}
				<div class="bc-sell-wizard__intro">
					<h3>Състояние и история</h3>
					<p>Точните данни помагат за реалистична оценка още преди огледа.</p>
				</div>
				<div class="bc-sell-wizard__fields">
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-mileage">
						<span>Пробег в километри *</span>
						<input
							id="sell-wizard-mileage"
							type="text"
							inputmode="numeric"
							placeholder="Например 125 000"
							required
							bind:value={mileage}
						/>
					</label>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Общо състояние</legend>
						<div class="bc-sell-wizard__chips">
							{#each conditionOptions as option (option)}
								<button
									type="button"
									class:active={condition === option}
									aria-pressed={condition === option}
									onclick={() => (condition = condition === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Удари и забележки</legend>
						<div class="bc-sell-wizard__chips">
							{#each accidentOptions as option (option)}
								<button
									type="button"
									class:active={accidents === option}
									aria-pressed={accidents === option}
									onclick={() => (accidents = accidents === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Автомобилът е</legend>
						<div class="bc-sell-wizard__chips">
							{#each runningOptions as option (option)}
								<button
									type="button"
									class:active={runningCondition === option}
									aria-pressed={runningCondition === option}
									onclick={() => (runningCondition = runningCondition === option ? '' : option)}
									>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<label for="sell-wizard-service">
						<span>Сервизна история</span>
						<select id="sell-wizard-service" bind:value={serviceHistory}>
							<option value="">Избери</option>
							{#each serviceOptions as option (option)}<option value={option}>{option}</option
								>{/each}
						</select>
					</label>
					<label for="sell-wizard-inspection">
						<span>Регистрация / преглед</span>
						<select id="sell-wizard-inspection" bind:value={inspection}>
							<option value="">Избери</option>
							{#each inspectionOptions as option (option)}<option value={option}>{option}</option
								>{/each}
						</select>
					</label>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Налични ключове</legend>
						<div class="bc-sell-wizard__chips">
							{#each keyOptions as option (option)}
								<button
									type="button"
									class:active={keys === option}
									aria-pressed={keys === option}
									onclick={() => (keys = keys === option ? '' : option)}>{option}</button
								>
							{/each}
						</div>
					</fieldset>
				</div>
			{:else if step === 2}
				<div class="bc-sell-wizard__intro">
					<h3>Оборудване</h3>
					<p>Изберете само наличното. Стъпката е по желание.</p>
				</div>
				<div class="bc-sell-wizard__fields">
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-color">
						<span>Цвят</span>
						<select id="sell-wizard-color" bind:value={color}>
							<option value="">Избери цвят</option>
							{#each colorOptions as option (option)}<option value={option}>{option}</option>{/each}
						</select>
					</label>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Комфорт</legend>
						<div class="bc-sell-wizard__chips">
							{#each comfortFeatures as feature (feature)}
								<button
									type="button"
									class:active={selectedFeatures.includes(feature)}
									aria-pressed={selectedFeatures.includes(feature)}
									onclick={() => toggleFeature(feature)}>{feature}</button
								>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Технологии и практичност</legend>
						<div class="bc-sell-wizard__chips">
							{#each technologyFeatures as feature (feature)}
								<button
									type="button"
									class:active={selectedFeatures.includes(feature)}
									aria-pressed={selectedFeatures.includes(feature)}
									onclick={() => toggleFeature(feature)}>{feature}</button
								>
							{/each}
						</div>
					</fieldset>
				</div>
			{:else if step === 3}
				<div class="bc-sell-wizard__intro">
					<h3>Снимки за по-точна оценка</h3>
					<p>Добавете ясни кадри на автомобила и отделно снимайте важните забележки.</p>
				</div>
				<div class="bc-sell-wizard__photos">
					{#each photoSlots as slot (slot.key)}
						{#if slot.url}
							<div class="bc-sell-wizard__photo bc-sell-wizard__photo--filled">
								<img src={slot.url} alt={slot.label} />
								<button
									type="button"
									aria-label={`Премахни снимка: ${slot.label}`}
									onclick={() => clearPhoto(slot)}
									><X size={14} strokeWidth={2.5} aria-hidden="true" /></button
								>
								<span>{slot.label}</span>
							</div>
						{:else}
							<label class="bc-sell-wizard__photo">
								<input
									type="file"
									accept="image/*"
									onchange={(event) => setPhoto(slot, event.currentTarget.files)}
								/>
								<Camera size={20} strokeWidth={2} aria-hidden="true" />
								<span>{slot.label}</span>
							</label>
						{/if}
					{/each}
				</div>
				<p class="bc-sell-wizard__hint">
					{photoCount ? `${photoCount} снимки добавени` : 'Можете да продължите и без снимки.'}
				</p>
			{:else}
				<div class="bc-sell-wizard__intro">
					<h3>Оферта и контакт</h3>
					<p>Последна проверка преди екипът да поеме заявката.</p>
				</div>
				<div class="bc-sell-wizard__fields">
					<label for="sell-wizard-price">
						<span>Очаквана цена</span>
						<input
							id="sell-wizard-price"
							type="text"
							inputmode="numeric"
							placeholder="Цена в EUR"
							bind:value={price}
						/>
					</label>
					<label for="sell-wizard-location">
						<span>Град</span>
						<input
							id="sell-wizard-location"
							type="text"
							autocomplete="address-level2"
							bind:value={location}
						/>
					</label>
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-phone">
						<span>Телефон за контакт *</span>
						<input
							id="sell-wizard-phone"
							type="tel"
							inputmode="tel"
							autocomplete="tel"
							placeholder="Вашият телефон"
							required
							bind:value={phone}
						/>
					</label>
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-time">
						<span>Удобно време за обаждане</span>
						<select id="sell-wizard-time" bind:value={contactTime}>
							<option value="">Без значение</option>
							{#each timeOptions as option (option)}<option value={option}>{option}</option>{/each}
						</select>
					</label>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Финансиране</legend>
						<div class="bc-sell-wizard__chips">
							{#each financeOptions as option (option)}
								<button
									type="button"
									class:active={financeStatus === option}
									aria-pressed={financeStatus === option}
									onclick={() => (financeStatus = financeStatus === option ? '' : option)}
									>{option}</button
								>
							{/each}
						</div>
					</fieldset>
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-notes">
						<span>Допълнителна информация</span>
						<textarea
							id="sell-wizard-notes"
							rows="3"
							placeholder="Скорошни ремонти, документи или важни забележки"
							bind:value={notes}
						></textarea>
					</label>
				</div>
				<dl class="bc-sell-wizard__summary">
					<div>
						<dt>Автомобил</dt>
						<dd>{carSummary}</dd>
					</div>
					<div>
						<dt>Пробег</dt>
						<dd>{mileage.trim() ? `${mileage.trim()} км` : '—'}</dd>
					</div>
					<div>
						<dt>Състояние</dt>
						<dd>{conditionSummary}</dd>
					</div>
					<div>
						<dt>Екстри</dt>
						<dd>{selectedFeatures.length || 'Не са избрани'}</dd>
					</div>
					<div>
						<dt>Снимки</dt>
						<dd>{photoCount ? `${photoCount} добавени` : 'Без снимки'}</dd>
					</div>
				</dl>
				<p class="bc-sell-wizard__promise">Отговор до 24 ч · Без задължение за продажба</p>
			{/if}
		</div>

		<footer class="bc-sell-wizard__nav">
			{#if step > 0}
				<button type="button" class="bc-sell-wizard__back" onclick={goBack}
					><ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />Назад</button
				>
			{/if}
			<button type="button" class="bc-sell-wizard__next" disabled={!canContinue} onclick={goNext}>
				{step < stepLabels.length - 1 ? 'Продължи' : 'Изпрати за оценка'}
				<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
			</button>
		</footer>
	{/if}
</div>

<style>
	.bc-sell-wizard {
		display: grid;
		align-content: start;
		height: auto;
		min-height: 100%;
		gap: 12px;
		color: #111111;
	}
	.bc-sell-wizard__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.bc-sell-wizard__header h2 {
		margin: 0;
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 27px;
	}
	.bc-sell-wizard__header button {
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
	.bc-sell-wizard__progress {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 5px;
	}
	.bc-sell-wizard__progress span {
		height: 5px;
		border-radius: 999px;
		background: var(--bc-border);
	}
	.bc-sell-wizard__progress span.done {
		background: var(--bc-accent);
	}
	.bc-sell-wizard__step-label {
		margin: -4px 0 0;
		color: #59636f;
		font-size: 13px;
		font-weight: 500;
		line-height: 17px;
	}
	.bc-sell-wizard__step-label strong {
		color: #111111;
		font-weight: 700;
	}
	.bc-sell-wizard__body {
		display: grid;
		min-height: 0;
		gap: 14px;
		overflow: visible;
		padding: 2px 1px 8px;
	}
	.bc-sell-wizard__intro {
		display: grid;
		gap: 4px;
	}
	.bc-sell-wizard__intro h3,
	.bc-sell-wizard__intro p {
		margin: 0;
	}
	.bc-sell-wizard__intro h3 {
		font-size: 19px;
		font-weight: 700;
		line-height: 24px;
	}
	.bc-sell-wizard__intro p {
		max-width: 54ch;
		color: #59636f;
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}
	.bc-sell-wizard__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px 9px;
	}
	.bc-sell-wizard__fields label,
	.bc-sell-wizard__fields fieldset {
		display: grid;
		min-width: 0;
		gap: 6px;
		margin: 0;
		border: 0;
		padding: 0;
	}
	.bc-sell-wizard__field--wide {
		grid-column: 1 / -1;
	}
	.bc-sell-wizard__fields span,
	.bc-sell-wizard__fields legend {
		color: #4f5d57;
		font-size: 12px;
		font-weight: 700;
		line-height: 15px;
		padding: 0;
	}
	.bc-sell-wizard__fields input,
	.bc-sell-wizard__fields select,
	.bc-sell-wizard__fields textarea {
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
	.bc-sell-wizard__fields input,
	.bc-sell-wizard__fields select {
		height: 48px !important;
		padding: 0 12px !important;
	}
	.bc-sell-wizard__fields textarea {
		min-height: 86px;
		resize: vertical;
		padding: 11px 12px !important;
	}
	.bc-sell-wizard__fields select {
		appearance: auto;
	}
	.bc-sell-wizard__fields input::placeholder,
	.bc-sell-wizard__fields textarea::placeholder {
		color: #7c8794;
		opacity: 1;
	}
	.bc-sell-wizard__fields input:focus-visible,
	.bc-sell-wizard__fields select:focus-visible,
	.bc-sell-wizard__fields textarea:focus-visible {
		border-color: var(--bc-accent) !important;
		background: #ffffff !important;
	}
	.bc-sell-wizard__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}
	.bc-sell-wizard__chips button {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		font-size: 13.5px;
		font-weight: 600;
		line-height: 17px;
		padding: 0 14px;
	}
	.bc-sell-wizard__chips button.active {
		border-color: var(--bc-accent);
		background: rgba(196, 1, 1, 0.08);
		color: #9f1117;
		font-weight: 700;
	}
	.bc-sell-wizard__photos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.bc-sell-wizard__photo {
		position: relative;
		display: grid;
		gap: 5px;
		aspect-ratio: 1;
		align-content: center;
		justify-items: center;
		overflow: hidden;
		margin: 0;
		border: 1px dashed #bfc8d1;
		border-radius: 12px;
		background: var(--bc-surface-soft);
		color: #59636f;
		cursor: pointer;
	}
	.bc-sell-wizard__photo input {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.bc-sell-wizard__photo span {
		font-size: 12px;
		font-weight: 600;
		line-height: 15px;
	}
	.bc-sell-wizard__photo :global(svg) {
		color: #626d7c;
		stroke: #626d7c;
	}
	.bc-sell-wizard__photo--filled {
		display: block;
		border-style: solid;
		cursor: default;
	}
	.bc-sell-wizard__photo--filled img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.bc-sell-wizard__photo--filled span {
		position: absolute;
		bottom: 5px;
		left: 5px;
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.78);
		color: #ffffff;
		font-size: 10.5px;
		line-height: 14px;
		padding: 2px 8px;
	}
	.bc-sell-wizard__photo--filled button {
		position: absolute;
		top: 5px;
		right: 5px;
		display: flex;
		width: 30px;
		height: 30px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}
	.bc-sell-wizard__hint {
		margin: -4px 0 0;
		color: #59636f;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}
	.bc-sell-wizard__summary {
		display: grid;
		gap: 0;
		margin: 0;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
	}
	.bc-sell-wizard__summary div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 12px;
	}
	.bc-sell-wizard__summary div + div {
		border-top: 1px solid #edf0f2;
	}
	.bc-sell-wizard__summary dt {
		color: #59636f;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 17px;
		white-space: nowrap;
	}
	.bc-sell-wizard__summary dd {
		margin: 0;
		color: #111111;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
		overflow-wrap: anywhere;
		text-align: right;
	}
	.bc-sell-wizard__promise {
		margin: 0;
		color: #9f1117;
		font-size: 12px;
		font-weight: 700;
		line-height: 17px;
	}
	.bc-sell-wizard__nav {
		display: flex;
		gap: 8px;
		padding-top: 0;
	}
	.bc-sell-wizard__back,
	.bc-sell-wizard__next {
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
	.bc-sell-wizard__back {
		flex: 0 0 auto;
		border: 1px solid var(--bc-border);
		background: #ffffff;
		color: #111111;
		padding: 0 14px;
	}
	.bc-sell-wizard__next {
		flex: 1 1 auto;
		border: 0;
		background: #1c1c1c;
		color: #ffffff;
		padding: 0 16px;
	}
	.bc-sell-wizard__next:disabled {
		background: #d4d9de;
		color: #67727e;
		cursor: not-allowed;
	}
	.bc-sell-wizard__nav :global(svg),
	.bc-sell-wizard__header button :global(svg) {
		color: currentColor;
		stroke: currentColor;
	}
	.bc-sell-wizard__success {
		display: grid;
		gap: 10px;
		justify-items: start;
		padding: 8px 0 2px;
	}
	.bc-sell-wizard__success > span {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(196, 1, 1, 0.1);
		color: #9f1117;
	}
	.bc-sell-wizard__success h3,
	.bc-sell-wizard__success p {
		margin: 0;
	}
	.bc-sell-wizard__success h3 {
		font-size: 21px;
		font-weight: 700;
		line-height: 26px;
	}
	.bc-sell-wizard__success p {
		max-width: 52ch;
		color: #59636f;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
	}
	.bc-sell-wizard__success button {
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

	@media (min-width: 768px) {
		.bc-sell-wizard__body {
			max-height: 560px;
			overflow-y: auto;
			scrollbar-width: none;
		}
		.bc-sell-wizard__body::-webkit-scrollbar {
			display: none;
		}
	}
</style>
