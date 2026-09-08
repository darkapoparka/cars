<script lang="ts">
	import {
		ArrowRight,
		Check,
		ChevronLeft,
		ChevronRight,
		Search,
		SlidersHorizontal,
		X
	} from '@lucide/svelte';

	type WizardInitial = {
		mileage?: string;
		phone?: string;
		price?: string;
		vin?: string;
	};
	type VehiclePicker =
		| 'make'
		| 'model'
		| 'year'
		| 'bodyType'
		| 'fuel'
		| 'gearbox'
		| 'contactTime'
		| null;

	let {
		detailed = false,
		initial,
		onclose
	}: {
		detailed?: boolean;
		initial?: WizardInitial;
		onclose?: () => void;
	} = $props();

	const stepLabels = ['Автомобил', 'Състояние', 'Контакт'];
	const makeOptions = [
		'Audi',
		'BMW',
		'Ford',
		'Honda',
		'Hyundai',
		'Mazda',
		'Mercedes-Benz',
		'Opel',
		'Porsche',
		'Skoda',
		'Tesla',
		'Toyota',
		'Volkswagen',
		'Volvo',
		'Друга'
	];
	const modelOptionsByMake: Record<string, readonly string[]> = {
		Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
		BMW: ['Серия 1', 'Серия 3', 'Серия 5', 'Серия 7', 'X1', 'X3', 'X5', 'X6', 'X7', 'i4', 'iX'],
		Ford: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Mustang', 'Transit'],
		Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'e:Ny1'],
		Hyundai: ['i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq 5'],
		Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-5', 'CX-60', 'MX-5'],
		'Mercedes-Benz': [
			'A-Class',
			'C-Class',
			'E-Class',
			'S-Class',
			'CLA',
			'GLA',
			'GLC',
			'GLE',
			'GLS'
		],
		Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Zafira'],
		Porsche: ['Cayenne', 'Macan', 'Panamera', 'Taycan', '911', '718 Boxster'],
		Skoda: ['Fabia', 'Octavia', 'Superb', 'Scala', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'],
		Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
		Toyota: ['Yaris', 'Corolla', 'Camry', 'C-HR', 'RAV4', 'Land Cruiser', 'Prius'],
		Volkswagen: ['Polo', 'Golf', 'Passat', 'Arteon', 'T-Roc', 'Tiguan', 'Touareg', 'ID.4'],
		Volvo: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'EX30']
	};
	const bodyOptions = ['SUV', 'Седан', 'Комби', 'Хечбек', 'Купе', 'Кабрио', 'Ван / пикап'];
	const fuelOptions = [
		'Бензин',
		'Дизел',
		'Газ / бензин',
		'Хибрид',
		'Plug-in хибрид',
		'Електрически'
	];
	const gearboxOptions = ['Автоматик', 'Ръчни'];
	const conditionOptions = ['Отлично', 'Много добро', 'За ремонт'];
	const accidentOptions = ['Без щети', 'Има щети'];
	const serviceHistoryOptions = ['Пълна история', 'Частична история', 'Без история'];
	const registrationOptions = ['Регистриран в България', 'Нов внос'];
	const timeOptions = ['9:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00'];
	const yearOptions = Array.from({ length: 19 }, (_, index) => String(2026 - index));
	const equipmentGroups = [
		{
			title: 'Задвижване и управление',
			options: [
				'4x4',
				'Адаптивно окачване',
				'Въздушно окачване',
				'Спортен пакет',
				'Режими на шофиране',
				'Теглич'
			]
		},
		{
			title: 'Комфорт',
			options: [
				'Климатроник',
				'Кожен салон',
				'Ел. седалки',
				'Памет на седалките',
				'Подгрев на седалките',
				'Вентилация на седалките',
				'Подгрев на волана',
				'Шибидах',
				'Панорамен покрив',
				'Ел. багажник',
				'Безключов достъп'
			]
		},
		{
			title: 'Асистенти и сигурност',
			options: [
				'Адаптивен круиз контрол',
				'Асистент за лента',
				'Мъртва зона',
				'Парктроник',
				'Камера за заден ход',
				'360° камера',
				'Автоматично паркиране',
				'Разпознаване на знаци',
				'Старт-стоп система'
			]
		},
		{
			title: 'Светлини и видимост',
			options: [
				'LED фарове',
				'Матрични фарове',
				'Ксенонови фарове',
				'Адаптивни фарове',
				'Автоматични светлини',
				'Автоматични чистачки'
			]
		},
		{
			title: 'Мултимедия',
			options: [
				'Навигация',
				'Apple CarPlay',
				'Android Auto',
				'Bluetooth',
				'Дигитално табло',
				'Head-up дисплей',
				'Премиум аудио',
				'Мултифункционален волан'
			]
		}
	] as const;

	let step = $state(0);
	let submitted = $state(false);
	let isSubmitting = $state(false);
	let submitError = $state('');
	let extrasOpen = $state(false);
	let extrasQuery = $state('');
	let vehiclePicker = $state<VehiclePicker>(null);
	let vehiclePickerQuery = $state('');

	/* The wizard deliberately snapshots the fast-form values at mount —
	   it owns its own editable copies from then on. */
	// svelte-ignore state_referenced_locally
	let vin = $state(initial?.vin ?? '');
	// svelte-ignore state_referenced_locally
	let mileage = $state(initial?.mileage ?? '');
	// svelte-ignore state_referenced_locally
	let price = $state(initial?.price ?? '');
	let make = $state('');
	let model = $state('');
	let modification = $state('');
	let bodyType = $state('');
	let year = $state('');
	let fuel = $state('');
	let gearbox = $state('');
	let condition = $state('');
	let accidents = $state('');
	let serviceHistory = $state('');
	let registration = $state('');
	let selectedExtras = $state<string[]>([]);
	// svelte-ignore state_referenced_locally
	let phone = $state(initial?.phone ?? '');
	let contactTime = $state('');
	let city = $state('');
	let notes = $state('');

	const canContinue = $derived(
		step === 0
			? detailed
				? Boolean(make && model.trim() && year && fuel && gearbox && mileage.trim())
				: vin.trim().length >= 5 || Boolean(year && fuel)
			: step === 2
				? phone.trim().length >= 6
				: true
	);
	const carSummary = $derived(
		[make, model.trim(), year, fuel, gearbox].filter(Boolean).join(' · ') ||
			(vin.trim() ? 'По VIN/рег. номер' : 'По телефона')
	);
	const extrasSummary = $derived(
		selectedExtras.length > 0
			? `${selectedExtras.length} избрани · ${selectedExtras.slice(0, 2).join(', ')}`
			: 'Не са избрани екстри'
	);
	const filteredEquipmentGroups = $derived.by(() => {
		const query = extrasQuery.trim().toLocaleLowerCase('bg-BG');
		if (!query) return equipmentGroups;

		return equipmentGroups
			.map((group) => ({
				...group,
				options: group.options.filter((option) => option.toLocaleLowerCase('bg-BG').includes(query))
			}))
			.filter((group) => group.options.length > 0);
	});
	const vehiclePickerOptions = $derived.by(() => {
		if (!vehiclePicker) return [];
		const options =
			vehiclePicker === 'make'
				? makeOptions
				: vehiclePicker === 'model'
					? (modelOptionsByMake[make] ?? [])
					: vehiclePicker === 'year'
						? yearOptions
						: vehiclePicker === 'bodyType'
							? bodyOptions
							: vehiclePicker === 'fuel'
								? fuelOptions
								: vehiclePicker === 'gearbox'
									? gearboxOptions
									: timeOptions;
		const query = vehiclePickerQuery.trim().toLocaleLowerCase('bg-BG');
		if (!query) return options;
		return options.filter((option) => option.toLocaleLowerCase('bg-BG').includes(query));
	});
	const customVehicleValue = $derived(vehiclePickerQuery.trim());
	const vehiclePickerValue = $derived.by(() => {
		if (vehiclePicker === 'make') return make;
		if (vehiclePicker === 'model') return model;
		if (vehiclePicker === 'year') return year;
		if (vehiclePicker === 'bodyType') return bodyType;
		if (vehiclePicker === 'fuel') return fuel;
		if (vehiclePicker === 'gearbox') return gearbox;
		if (vehiclePicker === 'contactTime') return contactTime;
		return '';
	});
	const vehiclePickerTitle = $derived.by(() => {
		if (vehiclePicker === 'make') return 'Избери марка';
		if (vehiclePicker === 'model') return `Избери модел на ${make}`;
		if (vehiclePicker === 'year') return 'Избери година';
		if (vehiclePicker === 'bodyType') return 'Избери тип купе';
		if (vehiclePicker === 'fuel') return 'Избери гориво';
		if (vehiclePicker === 'gearbox') return 'Избери скоростна кутия';
		if (vehiclePicker === 'contactTime') return 'Удобно време за обаждане';
		return '';
	});
	const vehiclePickerSearchable = $derived(
		vehiclePicker === 'make' || vehiclePicker === 'model' || vehiclePicker === 'year'
	);
	const vehiclePickerAllowsCustom = $derived(vehiclePicker === 'make' || vehiclePicker === 'model');

	const toggleExtra = (option: string) => {
		selectedExtras = selectedExtras.includes(option)
			? selectedExtras.filter((item) => item !== option)
			: [...selectedExtras, option];
	};

	const openVehiclePicker = (picker: Exclude<VehiclePicker, null>) => {
		vehiclePicker = picker === 'model' && !make ? 'make' : picker;
		vehiclePickerQuery = '';
	};

	const selectVehicleValue = (value: string) => {
		if (vehiclePicker === 'make') {
			if (make !== value) model = '';
			make = value;
		} else if (vehiclePicker === 'model') {
			model = value;
		} else if (vehiclePicker === 'year') {
			year = value;
		} else if (vehiclePicker === 'bodyType') {
			bodyType = value;
		} else if (vehiclePicker === 'fuel') {
			fuel = value;
		} else if (vehiclePicker === 'gearbox') {
			gearbox = value;
		} else if (vehiclePicker === 'contactTime') {
			contactTime = value;
		}
		vehiclePicker = null;
		vehiclePickerQuery = '';
	};

	const goBack = () => {
		if (step > 0) step -= 1;
	};

	const friendlyError = (message: unknown) => {
		if (message === 'Phone or email is required') return 'Моля въведете телефон.';
		return 'Не успяхме да изпратим заявката. Опитайте отново или се обадете.';
	};

	const submitInquiry = async () => {
		const formData = new FormData();
		formData.set('name', phone.trim() || vin.trim() || 'Заявка за продажба');
		formData.set('phone', phone.trim());
		formData.set('vin', vin.trim());
		formData.set(
			'message',
			[
				vin.trim() ? `VIN / рег. номер: ${vin.trim()}` : '',
				make ? `Марка: ${make}` : '',
				model.trim() ? `Модел: ${model.trim()}` : '',
				modification.trim() ? `Модификация: ${modification.trim()}` : '',
				bodyType ? `Купе: ${bodyType}` : '',
				year ? `Година: ${year}` : '',
				fuel ? `Гориво: ${fuel}` : '',
				gearbox ? `Скорости: ${gearbox}` : '',
				mileage.trim() ? `Пробег: ${mileage.trim()} км` : '',
				price.trim() ? `Очаквана цена: ${price.trim()} EUR` : '',
				condition ? `Състояние: ${condition}` : '',
				accidents ? `Щети: ${accidents}` : '',
				serviceHistory ? `Сервизна история: ${serviceHistory}` : '',
				registration ? `Регистрация: ${registration}` : '',
				selectedExtras.length ? `Екстри: ${selectedExtras.join(', ')}` : '',
				city.trim() ? `Град: ${city.trim()}` : '',
				contactTime ? `Удобно време: ${contactTime}` : '',
				notes.trim() ? `Бележки: ${notes.trim()}` : ''
			]
				.filter(Boolean)
				.join(' | ')
		);
		formData.set('source', 'eliqauto-sell-wizard');
		formData.set('routePath', window.location.pathname);

		const response = await fetch('/api/inquiries', { body: formData, method: 'POST' });
		const result: unknown = await response.json().catch(() => undefined);

		if (!response.ok) {
			const message =
				result && typeof result === 'object' && 'message' in result ? result.message : undefined;
			throw new Error(friendlyError(message));
		}
	};

	const goNext = async () => {
		if (!canContinue || isSubmitting) return;
		if (step < 2) {
			step += 1;
			submitError = '';
			return;
		}

		isSubmitting = true;
		submitError = '';
		try {
			await submitInquiry();
			submitted = true;
		} catch (error) {
			submitError = error instanceof Error ? error.message : friendlyError(undefined);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<div class="bc-sell-wizard">
	{#if vehiclePicker}
		<section class="bc-sell-wizard__vehicle-picker" aria-labelledby="sell-wizard-picker-title">
			<div class="bc-sell-wizard__vehicle-picker-top">
				<header class="bc-sell-wizard__vehicle-picker-header">
					<button
						type="button"
						class="bc-sell-wizard__vehicle-picker-back"
						aria-label="Назад към заявката"
						onclick={() => (vehiclePicker = null)}
					>
						<ChevronLeft size={21} strokeWidth={2.2} aria-hidden="true" />
					</button>
					<div>
						<h2 id="sell-wizard-picker-title">{vehiclePickerTitle}</h2>
						<p>
							{vehiclePicker === 'make'
								? 'Търси или избери от списъка.'
								: vehiclePicker === 'model'
									? 'Търси или въведи точния модел.'
									: vehiclePicker === 'year'
										? 'Търси или избери от списъка.'
										: 'Избери една от опциите.'}
						</p>
					</div>
				</header>

				{#if vehiclePickerSearchable}
					<label class="bc-sell-wizard__picker-search" for="sell-wizard-vehicle-search">
						<Search size={18} strokeWidth={2.2} aria-hidden="true" />
						<input
							id="sell-wizard-vehicle-search"
							type="search"
							inputmode={vehiclePicker === 'year' ? 'numeric' : 'search'}
							placeholder={vehiclePicker === 'make'
								? 'Търси марка...'
								: vehiclePicker === 'model'
									? 'Търси модел...'
									: 'Търси година...'}
							autocomplete="off"
							bind:value={vehiclePickerQuery}
						/>
					</label>
				{/if}
			</div>

			<div class="bc-sell-wizard__picker-results" aria-label="Резултати">
				{#if vehiclePicker === 'bodyType' || vehiclePicker === 'contactTime'}
					<button
						type="button"
						class:active={!vehiclePickerValue}
						aria-pressed={!vehiclePickerValue}
						onclick={() => selectVehicleValue('')}
					>
						<span>{vehiclePicker === 'contactTime' ? 'Без значение' : 'Не е посочено'}</span>
						{#if !vehiclePickerValue}
							<Check size={18} strokeWidth={2.5} aria-hidden="true" />
						{/if}
					</button>
				{/if}
				{#each vehiclePickerOptions as option (option)}
					<button
						type="button"
						class:active={vehiclePickerValue === option}
						aria-pressed={vehiclePickerValue === option}
						onclick={() => selectVehicleValue(option)}
					>
						<span>{option}</span>
						{#if vehiclePickerValue === option}
							<Check size={18} strokeWidth={2.5} aria-hidden="true" />
						{/if}
					</button>
				{:else}
					{#if !customVehicleValue}
						<p class="bc-sell-wizard__picker-empty">
							Започни да пишеш и използвай точната стойност.
						</p>
					{/if}
				{/each}
				{#if vehiclePickerAllowsCustom && customVehicleValue && vehiclePickerOptions.length === 0}
					<button
						type="button"
						class="bc-sell-wizard__picker-custom"
						onclick={() => selectVehicleValue(customVehicleValue)}
					>
						<span>
							<strong>Използвай „{customVehicleValue}“</strong>
							<small>{vehiclePicker === 'make' ? 'Друга марка' : `Модел на ${make}`}</small>
						</span>
						<ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
					</button>
				{/if}
			</div>
		</section>
	{:else if extrasOpen}
		<section class="bc-sell-wizard__extras" aria-labelledby="sell-wizard-extras-title">
			<header class="bc-sell-wizard__extras-header">
				<div class="bc-sell-wizard__extras-header-copy">
					<h2 id="sell-wizard-extras-title">Екстри</h2>
					<div class="bc-sell-wizard__extras-meta">
						<p aria-live="polite">
							{selectedExtras.length === 0
								? 'Избери оборудването на автомобила.'
								: `${selectedExtras.length} избрани`}
						</p>
						{#if selectedExtras.length > 0}
							<button type="button" onclick={() => (selectedExtras = [])}>Изчисти</button>
						{/if}
					</div>
				</div>
				<button
					type="button"
					class="bc-sell-wizard__extras-header-done"
					onclick={() => (extrasOpen = false)}
				>
					Готово
				</button>
			</header>

			<label class="bc-sell-wizard__extras-search" for="sell-wizard-extras-search">
				<Search size={18} strokeWidth={2.2} aria-hidden="true" />
				<input
					id="sell-wizard-extras-search"
					type="search"
					placeholder="Търси екстра..."
					autocomplete="off"
					bind:value={extrasQuery}
				/>
			</label>

			<div class="bc-sell-wizard__extras-groups">
				{#each filteredEquipmentGroups as group (group.title)}
					<fieldset>
						<legend>{group.title}</legend>
						<div class="bc-sell-wizard__extras-options">
							{#each group.options as option (option)}
								<button
									type="button"
									class:active={selectedExtras.includes(option)}
									aria-pressed={selectedExtras.includes(option)}
									onclick={() => toggleExtra(option)}
								>
									{#if selectedExtras.includes(option)}
										<Check size={15} strokeWidth={2.7} aria-hidden="true" />
									{/if}
									{option}
								</button>
							{/each}
						</div>
					</fieldset>
				{:else}
					<p class="bc-sell-wizard__extras-empty">Няма екстри, които съвпадат с търсенето.</p>
				{/each}
			</div>
		</section>
	{:else}
		<div class="bc-sell-wizard__header">
			<h2>Продай автомобил</h2>
			{#if onclose}
				<button type="button" aria-label="Затвори" onclick={onclose}>
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</button>
			{/if}
		</div>

		{#if submitted}
			<div class="bc-sell-wizard__success">
				<span aria-hidden="true"><Check size={26} strokeWidth={2.6} /></span>
				<h3>Заявката е приета</h3>
				<p>Екипът преглежда данните и се обажда до 24 ч с конкретна оферта и следващ ход.</p>
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

			{#if step === 0}
				<div class="bc-sell-wizard__fields">
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-vin">
						<span>VIN или регистрационен номер <small>по желание</small></span>
						<input
							id="sell-wizard-vin"
							type="text"
							placeholder="CA 1234 AB или WBA..."
							autocomplete="off"
							bind:value={vin}
						/>
					</label>
					{#if detailed}
						<p class="bc-sell-wizard__hint bc-sell-wizard__field--wide">
							Основните данни са нужни за реална оценка, дори когато имаш VIN.
						</p>
						<div class="bc-sell-wizard__picker-field">
							<span>Марка</span>
							<button
								id="sell-wizard-make"
								type="button"
								aria-label={make ? `Марка: ${make}. Промени` : 'Избери марка'}
								onclick={() => openVehiclePicker('make')}
							>
								<strong class:placeholder={!make}>{make || 'Избери марка'}</strong>
								<Search size={17} strokeWidth={2.15} aria-hidden="true" />
							</button>
						</div>
						<div class="bc-sell-wizard__picker-field">
							<span>Модел</span>
							<button
								id="sell-wizard-model"
								type="button"
								aria-label={model
									? `Модел: ${model}. Промени`
									: make
										? 'Избери модел'
										: 'Избери първо марка'}
								onclick={() => openVehiclePicker('model')}
							>
								<strong class:placeholder={!model}
									>{model || (make ? 'Избери модел' : 'Първо марка')}</strong
								>
								<Search size={17} strokeWidth={2.15} aria-hidden="true" />
							</button>
						</div>
						<div class="bc-sell-wizard__picker-field">
							<span>Година</span>
							<button
								id="sell-wizard-year"
								type="button"
								aria-label={year ? `Година: ${year}. Промени` : 'Избери година'}
								onclick={() => openVehiclePicker('year')}
							>
								<strong class:placeholder={!year}>{year || 'Избери година'}</strong>
								<ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</div>
						<div class="bc-sell-wizard__picker-field">
							<span>Купе</span>
							<button
								id="sell-wizard-body"
								type="button"
								aria-label={bodyType ? `Купе: ${bodyType}. Промени` : 'Избери тип купе'}
								onclick={() => openVehiclePicker('bodyType')}
							>
								<strong class:placeholder={!bodyType}>{bodyType || 'Избери купе'}</strong>
								<ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</div>
						<div class="bc-sell-wizard__picker-field">
							<span>Гориво</span>
							<button
								id="sell-wizard-fuel"
								type="button"
								aria-label={fuel ? `Гориво: ${fuel}. Промени` : 'Избери гориво'}
								onclick={() => openVehiclePicker('fuel')}
							>
								<strong class:placeholder={!fuel}>{fuel || 'Избери гориво'}</strong>
								<ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</div>
						<div class="bc-sell-wizard__picker-field">
							<span>Скорости</span>
							<button
								id="sell-wizard-gearbox"
								type="button"
								aria-label={gearbox ? `Скорости: ${gearbox}. Промени` : 'Избери скоростна кутия'}
								onclick={() => openVehiclePicker('gearbox')}
							>
								<strong class:placeholder={!gearbox}>{gearbox || 'Избери скорости'}</strong>
								<ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</div>
						<label for="sell-wizard-mileage">
							<span>Пробег</span>
							<input
								id="sell-wizard-mileage"
								type="text"
								inputmode="numeric"
								placeholder="Пробег в км"
								required
								bind:value={mileage}
							/>
						</label>
						<label for="sell-wizard-modification">
							<span>Двигател / версия <small>по желание</small></span>
							<input
								id="sell-wizard-modification"
								type="text"
								placeholder="3.0 TDI, 245 к.с."
								autocomplete="off"
								bind:value={modification}
							/>
						</label>
					{:else}
						<p class="bc-sell-wizard__hint bc-sell-wizard__field--wide">
							Нямаш VIN или номер? Избери поне година и гориво.
						</p>
						<label for="sell-wizard-mileage">
							<span>Пробег</span>
							<input
								id="sell-wizard-mileage"
								type="text"
								inputmode="numeric"
								placeholder="Пробег в км"
								bind:value={mileage}
							/>
						</label>
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
						<label for="sell-wizard-year">
							<span>Година</span>
							<select id="sell-wizard-year" bind:value={year}>
								<option value="">Избери</option>
								{#each yearOptions as option (option)}
									<option value={option}>{option}</option>
								{/each}
							</select>
						</label>
						<label for="sell-wizard-fuel">
							<span>Гориво</span>
							<select id="sell-wizard-fuel" bind:value={fuel}>
								<option value="">Избери</option>
								{#each fuelOptions as option (option)}
									<option value={option}>{option}</option>
								{/each}
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
										onclick={() => (gearbox = gearbox === option ? '' : option)}
									>
										{option}
									</button>
								{/each}
							</div>
						</fieldset>
					{/if}
				</div>
			{:else if step === 1}
				<div class="bc-sell-wizard__fields">
					{#if detailed}
						<label class="bc-sell-wizard__field--wide" for="sell-wizard-price">
							<span>Очаквана цена <small>по желание</small></span>
							<input
								id="sell-wizard-price"
								type="text"
								inputmode="numeric"
								placeholder="Цена в EUR"
								bind:value={price}
							/>
						</label>
					{/if}
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Общо състояние</legend>
						<div class="bc-sell-wizard__chips">
							{#each conditionOptions as option (option)}
								<button
									type="button"
									class:active={condition === option}
									aria-pressed={condition === option}
									onclick={() => (condition = condition === option ? '' : option)}
								>
									{option}
								</button>
							{/each}
						</div>
					</fieldset>
					<fieldset class="bc-sell-wizard__field--wide">
						<legend>Удари и щети</legend>
						<div class="bc-sell-wizard__chips">
							{#each accidentOptions as option (option)}
								<button
									type="button"
									class:active={accidents === option}
									aria-pressed={accidents === option}
									onclick={() => (accidents = accidents === option ? '' : option)}
								>
									{option}
								</button>
							{/each}
						</div>
					</fieldset>
					{#if detailed}
						<fieldset class="bc-sell-wizard__field--wide">
							<legend>Сервизна история</legend>
							<div class="bc-sell-wizard__chips">
								{#each serviceHistoryOptions as option (option)}
									<button
										type="button"
										class:active={serviceHistory === option}
										aria-pressed={serviceHistory === option}
										onclick={() => (serviceHistory = serviceHistory === option ? '' : option)}
									>
										{option}
									</button>
								{/each}
							</div>
						</fieldset>
						<fieldset class="bc-sell-wizard__field--wide">
							<legend>Статус</legend>
							<div class="bc-sell-wizard__chips">
								{#each registrationOptions as option (option)}
									<button
										type="button"
										class:active={registration === option}
										aria-pressed={registration === option}
										onclick={() => (registration = registration === option ? '' : option)}
									>
										{option}
									</button>
								{/each}
							</div>
						</fieldset>
						<button
							type="button"
							class="bc-sell-wizard__extras-trigger bc-sell-wizard__field--wide"
							onclick={() => (extrasOpen = true)}
						>
							<span class="bc-sell-wizard__extras-trigger-icon" aria-hidden="true">
								<SlidersHorizontal size={19} strokeWidth={2.25} />
							</span>
							<span>
								<strong>Екстри и оборудване</strong>
								<small>{extrasSummary}</small>
							</span>
							<ArrowRight size={19} strokeWidth={2.35} aria-hidden="true" />
						</button>
					{/if}
				</div>
				<p class="bc-sell-wizard__hint">Избери само това, което описва автомобила реално.</p>
			{:else}
				<div class="bc-sell-wizard__fields">
					<label class="bc-sell-wizard__field--wide" for="sell-wizard-phone">
						<span>Телефон за контакт</span>
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
					{#if detailed}
						<label for="sell-wizard-city">
							<span>Град</span>
							<input
								id="sell-wizard-city"
								type="text"
								placeholder="Вашият град"
								autocomplete="address-level2"
								bind:value={city}
							/>
						</label>
					{/if}
					{#if detailed}
						<div class="bc-sell-wizard__picker-field">
							<span>Удобно време за обаждане</span>
							<button
								id="sell-wizard-time"
								type="button"
								aria-label={contactTime
									? `Удобно време: ${contactTime}. Промени`
									: 'Избери удобно време за обаждане'}
								onclick={() => openVehiclePicker('contactTime')}
							>
								<strong class:placeholder={!contactTime}>{contactTime || 'Без значение'}</strong>
								<ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</div>
					{:else}
						<label class="bc-sell-wizard__field--wide" for="sell-wizard-time">
							<span>Удобно време за обаждане</span>
							<select id="sell-wizard-time" bind:value={contactTime}>
								<option value="">Без значение</option>
								{#each timeOptions as option (option)}
									<option value={option}>{option}</option>
								{/each}
							</select>
						</label>
					{/if}
					{#if detailed}
						<label class="bc-sell-wizard__field--wide" for="sell-wizard-notes">
							<span>Допълнителна информация <small>по желание</small></span>
							<textarea
								id="sell-wizard-notes"
								rows="3"
								placeholder="Обслужване, ремонти, гуми или друго важно..."
								bind:value={notes}
							></textarea>
						</label>
					{/if}
				</div>
				<dl class="bc-sell-wizard__summary">
					<div>
						<dt>VIN / номер</dt>
						<dd>{vin.trim() || '—'}</dd>
					</div>
					<div>
						<dt>Автомобил</dt>
						<dd>{carSummary}</dd>
					</div>
					<div>
						<dt>Пробег и цена</dt>
						<dd>
							{[
								mileage.trim() ? `${mileage.trim()} км` : '',
								price.trim() ? `${price.trim()} EUR` : ''
							]
								.filter(Boolean)
								.join(' · ') || '—'}
						</dd>
					</div>
					<div>
						<dt>Състояние</dt>
						<dd>{[condition, accidents].filter(Boolean).join(' · ') || '—'}</dd>
					</div>
					{#if detailed}
						<div>
							<dt>Екстри</dt>
							<dd>{selectedExtras.length ? `${selectedExtras.length} избрани` : '—'}</dd>
						</div>
					{/if}
				</dl>
				<p class="bc-sell-wizard__promise">Отговор до 24 ч</p>
			{/if}

			{#if submitError}
				<p class="bc-sell-wizard__error" role="alert">{submitError}</p>
			{/if}

			<footer class="bc-sell-wizard__nav">
				{#if step > 0}
					<button type="button" class="bc-sell-wizard__back" onclick={goBack}>
						<ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
						Назад
					</button>
				{/if}
				<button
					type="button"
					class="bc-sell-wizard__next"
					disabled={!canContinue || isSubmitting}
					onclick={goNext}
				>
					{isSubmitting ? 'Изпращане...' : step < 2 ? 'Продължи' : 'Изпрати заявка'}
					<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
				</button>
			</footer>
		{/if}
	{/if}
</div>

<style>
	.bc-sell-wizard {
		display: grid;
		gap: 14px;
		align-content: start;
		min-width: 0;
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
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 25px;
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

	.bc-sell-wizard__vehicle-picker {
		display: grid;
		gap: 12px;
		height: max-content;
		min-height: 0;
		background: #ffffff;
	}

	.bc-sell-wizard__vehicle-picker-top {
		position: sticky;
		top: 0;
		z-index: 3;
		display: grid;
		gap: 10px;
		background: #ffffff;
		padding-bottom: 2px;
	}

	.bc-sell-wizard__vehicle-picker-header {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
	}

	.bc-sell-wizard__vehicle-picker-back {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #f0f1f3;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bc-sell-wizard__vehicle-picker-header > div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bc-sell-wizard__vehicle-picker-header h2,
	.bc-sell-wizard__vehicle-picker-header p {
		margin: 0;
		letter-spacing: 0;
	}

	.bc-sell-wizard__vehicle-picker-header h2 {
		overflow: hidden;
		color: #111111;
		font-size: 20px;
		font-weight: 750;
		line-height: 25px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bc-sell-wizard__vehicle-picker-header p {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 550;
		line-height: 17px;
	}

	.bc-sell-wizard__picker-results {
		display: grid;
		gap: 6px;
	}

	.bc-sell-wizard__picker-results > button {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 0;
		border-radius: 12px;
		background: #f4f5f7;
		color: #111111;
		cursor: pointer;
		font-size: 16px;
		font-weight: 650;
		line-height: 21px;
		padding: 10px 14px;
		text-align: left;
	}

	.bc-sell-wizard__picker-results > button.active {
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
	}

	.bc-sell-wizard__picker-results > button:focus-visible,
	.bc-sell-wizard__vehicle-picker-back:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.bc-sell-wizard__picker-results .bc-sell-wizard__picker-custom {
		border: 1px solid rgba(165, 23, 23, 0.2);
		background: #ffffff;
		color: var(--bc-accent);
	}

	.bc-sell-wizard__picker-custom span {
		display: grid;
		gap: 1px;
	}

	.bc-sell-wizard__picker-custom strong,
	.bc-sell-wizard__picker-custom small {
		font: inherit;
	}

	.bc-sell-wizard__picker-custom small {
		color: var(--bc-muted);
		font-size: var(--bc-text-micro);
		font-weight: 550;
		line-height: 16px;
	}

	.bc-sell-wizard__picker-empty {
		margin: 0;
		border-radius: 12px;
		background: #f4f5f7;
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
		padding: 16px;
	}

	.bc-sell-wizard__extras {
		display: grid;
		gap: 14px;
		height: max-content;
		min-height: 0;
		background: #ffffff;
	}

	.bc-sell-wizard__extras-header {
		position: sticky;
		top: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		background: #ffffff;
		padding-bottom: 2px;
	}

	.bc-sell-wizard__extras-header-copy {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.bc-sell-wizard__extras-header h2,
	.bc-sell-wizard__extras-header p {
		margin: 0;
		letter-spacing: 0;
	}

	.bc-sell-wizard__extras-header h2 {
		color: #111111;
		font-size: 22px;
		font-weight: 750;
		line-height: 27px;
	}

	.bc-sell-wizard__extras-header p {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 600;
		line-height: 17px;
	}

	.bc-sell-wizard__extras-meta {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bc-sell-wizard__extras-meta button {
		border: 0;
		background: transparent;
		color: var(--bc-accent);
		cursor: pointer;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 16px;
		padding: 0;
	}

	.bc-sell-wizard__extras-header-done {
		min-height: 44px;
		flex: 0 0 auto;
		border: 0;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		padding: 0 17px;
	}

	.bc-sell-wizard__extras-search,
	.bc-sell-wizard__picker-search {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		align-items: center;
		gap: 8px;
		min-height: 48px;
		border: 1px solid var(--bc-border);
		border-radius: 14px;
		background: #f4f5f7;
		color: var(--bc-muted);
		padding: 0 13px;
	}

	.bc-sell-wizard__extras-search:focus-within,
	.bc-sell-wizard__picker-search:focus-within {
		border-color: var(--bc-accent);
		background: #ffffff;
	}

	.bc-sell-wizard__extras-search input,
	.bc-sell-wizard__picker-search input {
		appearance: none;
		width: 100%;
		height: 46px;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		outline: 0;
		padding: 0;
	}

	.bc-sell-wizard__extras-search input::placeholder,
	.bc-sell-wizard__picker-search input::placeholder {
		color: #7b8491;
		opacity: 1;
	}

	.bc-sell-wizard__extras-search input:focus-visible,
	.bc-sell-wizard__picker-search input:focus-visible {
		outline: 0;
	}

	.bc-sell-wizard__extras-groups {
		display: grid;
		gap: 18px;
	}

	.bc-sell-wizard__extras-groups fieldset {
		display: grid;
		gap: 9px;
		margin: 0;
		border: 0;
		padding: 0;
	}

	.bc-sell-wizard__extras-groups legend {
		color: #111111;
		font-size: 14px;
		font-weight: 750;
		line-height: 18px;
		padding: 0;
	}

	.bc-sell-wizard__extras-options {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.bc-sell-wizard__extras-options button {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		gap: 5px;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		font-size: 13px;
		font-weight: 600;
		line-height: 17px;
		padding: 0 12px;
	}

	.bc-sell-wizard__extras-options button.active {
		border-color: rgba(165, 23, 23, 0.25);
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
		font-weight: 700;
	}

	.bc-sell-wizard__extras-empty {
		margin: 0;
		border-radius: 14px;
		background: #f4f5f7;
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
		padding: 16px;
	}

	.bc-sell-wizard__progress {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6px;
	}

	.bc-sell-wizard__progress span {
		height: 5px;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.bc-sell-wizard__progress span.done {
		background: #a51717;
	}

	.bc-sell-wizard__step-label {
		margin: -6px 0 0;
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 500;
		line-height: 17px;
	}

	.bc-sell-wizard__step-label strong {
		color: #111111;
		font-weight: 700;
	}

	.bc-sell-wizard__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px 8px;
	}

	.bc-sell-wizard__fields label,
	.bc-sell-wizard__fields fieldset,
	.bc-sell-wizard__picker-field {
		display: grid;
		gap: 6px;
		min-width: 0;
		margin: 0;
		border: 0;
		padding: 0;
	}

	.bc-sell-wizard__field--wide {
		grid-column: 1 / -1;
	}

	.bc-sell-wizard__fields span,
	.bc-sell-wizard__fields legend,
	.bc-sell-wizard__picker-field > span {
		color: var(--bc-muted);
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 15px;
		padding: 0;
	}

	.bc-sell-wizard__fields span small {
		color: #8a929d;
		font: inherit;
		font-weight: 500;
	}

	.bc-sell-wizard__fields input,
	.bc-sell-wizard__fields select,
	.bc-sell-wizard__fields textarea {
		display: block;
		width: 100%;
		height: 46px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #f4f5f7;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		outline: 0;
		padding: 0 12px;
	}

	.bc-sell-wizard__fields textarea {
		height: auto;
		min-height: 82px;
		resize: vertical;
		padding-block: 11px;
	}

	.bc-sell-wizard__fields select {
		appearance: auto;
	}

	.bc-sell-wizard__fields input::placeholder,
	.bc-sell-wizard__fields textarea::placeholder {
		color: #8f9892;
		opacity: 1;
	}

	.bc-sell-wizard__fields input:focus-visible,
	.bc-sell-wizard__fields select:focus-visible,
	.bc-sell-wizard__fields textarea:focus-visible {
		border-color: #a51717;
		background: #ffffff;
	}

	.bc-sell-wizard__picker-field > button {
		display: grid;
		width: 100%;
		height: 46px;
		grid-template-columns: minmax(0, 1fr) 18px;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #f4f5f7;
		color: #111111;
		cursor: pointer;
		padding: 0 12px;
		text-align: left;
	}

	.bc-sell-wizard__picker-field > button strong {
		overflow: hidden;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bc-sell-wizard__picker-field > button strong.placeholder {
		color: #7b8491;
		font-weight: 550;
	}

	.bc-sell-wizard__picker-field > button :global(svg) {
		color: var(--bc-muted);
	}

	.bc-sell-wizard__picker-field > button:focus-visible {
		border-color: var(--bc-accent);
		outline: 2px solid rgba(165, 23, 23, 0.16);
		outline-offset: 1px;
		background: #ffffff;
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
		border-color: transparent;
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
		font-weight: 700;
	}

	.bc-sell-wizard__extras-trigger {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 20px;
		align-items: center;
		gap: 10px;
		min-height: 66px;
		border: 1px solid var(--bc-border);
		border-radius: 14px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 10px 12px;
		text-align: left;
	}

	.bc-sell-wizard__extras-trigger-icon {
		display: flex;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: var(--bc-accent-bright-soft);
		color: var(--bc-accent);
	}

	.bc-sell-wizard__extras-trigger > span:nth-child(2) {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bc-sell-wizard__extras-trigger strong,
	.bc-sell-wizard__extras-trigger small {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bc-sell-wizard__extras-trigger strong {
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
	}

	.bc-sell-wizard__extras-trigger small {
		color: var(--bc-muted);
		font-size: var(--bc-text-micro);
		font-weight: 550;
		line-height: 16px;
	}

	.bc-sell-wizard__hint {
		margin: -4px 0 0;
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}

	.bc-sell-wizard__summary {
		display: grid;
		gap: 0;
		margin: 0;
		border: 0;
		border-radius: 12px;
		background: #f4f5f7;
		overflow: hidden;
		padding-block: 5px;
	}

	.bc-sell-wizard__summary div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 7px 12px;
	}

	.bc-sell-wizard__summary div + div {
		border-top: 0;
	}

	.bc-sell-wizard__summary dt {
		color: var(--bc-muted);
		font-size: 12.5px;
		font-weight: 600;
		line-height: 17px;
		white-space: nowrap;
	}

	.bc-sell-wizard__summary dd {
		margin: 0;
		color: #111111;
		font-size: 13.5px;
		font-weight: 700;
		line-height: 18px;
		overflow-wrap: anywhere;
		text-align: right;
	}

	.bc-sell-wizard__promise {
		width: fit-content;
		margin: 0;
		border-radius: 999px;
		background: rgba(165, 23, 23, 0.12);
		color: var(--bc-accent);
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 17px;
		padding: 6px 11px;
	}

	.bc-sell-wizard__error {
		margin: 0;
		border-radius: 12px;
		background: var(--bc-accent-bright-soft);
		color: var(--bc-accent-hover);
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
		padding: 10px 12px;
	}

	.bc-sell-wizard__nav {
		display: flex;
		gap: 8px;
	}

	.bc-sell-wizard__back {
		display: inline-flex;
		min-height: 48px;
		flex: 0 0 auto;
		align-items: center;
		gap: 5px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #f0f1f3;
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		padding: 0 14px;
	}

	.bc-sell-wizard__next {
		display: flex;
		min-height: 48px;
		flex: 1 1 auto;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
		padding: 0 16px;
	}

	.bc-sell-wizard__next:disabled {
		background: var(--bc-surface-hover);
		color: #71717a;
		cursor: not-allowed;
	}

	.bc-sell-wizard__nav :global(svg),
	.bc-sell-wizard__header button :global(svg),
	.bc-sell-wizard__extras :global(svg) {
		color: currentColor;
		stroke: currentColor;
	}

	.bc-sell-wizard button:focus-visible,
	.bc-sell-wizard input:focus-visible,
	.bc-sell-wizard select:focus-visible,
	.bc-sell-wizard textarea:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.bc-sell-wizard .bc-sell-wizard__extras-search input:focus-visible,
	.bc-sell-wizard .bc-sell-wizard__picker-search input:focus-visible {
		outline: 0;
		box-shadow: none;
	}

	.bc-sell-wizard__success {
		display: grid;
		gap: 10px;
		justify-items: start;
		padding: 6px 0 2px;
	}

	.bc-sell-wizard__success span {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
	}

	.bc-sell-wizard__success span :global(svg) {
		color: #2a0c0c;
		stroke: #2a0c0c;
	}

	.bc-sell-wizard__success h3 {
		margin: 2px 0 0;
		color: #111111;
		font-size: 19px;
		font-weight: 700;
		line-height: 24px;
	}

	.bc-sell-wizard__success p {
		margin: 0;
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 500;
		line-height: 19px;
	}

	.bc-sell-wizard__success button {
		display: flex;
		min-height: 48px;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 4px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
	}
</style>
