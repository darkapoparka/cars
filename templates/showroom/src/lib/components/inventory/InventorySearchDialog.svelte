<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { ChevronDown, Search, X } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilterOption
	} from '$lib/auxero/inventory-desktop';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';

	let {
		desktop,
		modelOptionsByBrand,
		search,
		onSearch,
		children
	}: {
		desktop: AuxeroInventoryDesktopData;
		modelOptionsByBrand: InventoryMobileData['modelOptionsByBrand'];
		search: string;
		onSearch: (params: URLSearchParams) => Promise<void>;
		children: Snippet<[(trigger: HTMLElement) => void]>;
	} = $props();

	let open = $state(false);
	let query = $state('');
	let values = $state<Record<string, string[]>>({});
	let cleared = $state(false);
	let submitting = $state(false);
	let error = $state('');
	let input: HTMLInputElement | undefined;
	let trigger: HTMLElement;
	const id = $props.id();
	const aliases: Record<string, string[]> = {
		brand: ['brand'],
		model: ['model'],
		bodyType: ['body', 'bodyType', 'bodystyle'],
		condition: ['condition'],
		minPrice: ['minPrice', 'priceFrom'],
		priceTo: ['maxPrice', 'priceTo', 'price'],
		minYear: ['minYear', 'yearFrom'],
		maxYear: ['maxYear', 'yearTo'],
		mileageTo: ['maxMileage', 'mileageTo'],
		fuel: ['fuel', 'FuelType'],
		transmission: ['transmission', 'Transmission', 'gearbox'],
		sourceId: ['sourceId', 'source', 'stockNumber', 'vin'],
		feature: ['feature', 'features', 'extra', 'equipment']
	};
	const remainingFilterKeys = ['location', 'city', 'area', 'minMileage', 'mileageFrom', 'status'];
	const numericOptions = (items: number[]): AuxeroInventoryFilterOption[] =>
		items.map((value) => ({ label: value.toLocaleString('bg-BG'), value: String(value) }));
	const conditionOptions: AuxeroInventoryFilterOption[] = [
		{ label: 'Употребяван', value: 'Used' },
		{ label: 'Проверен', value: 'Certified' },
		{ label: 'Нов', value: 'New' }
	];
	const extraOptions = [
		{ label: '4x4', value: 'xDrive,4MATIC,quattro' },
		{ label: '360° камера', value: '360' },
		{ label: 'Панорамен покрив', value: 'PANO' },
		{ label: 'Навигация', value: 'NAVI' },
		{ label: 'LED светлини', value: 'LED' },
		{ label: 'B&O аудио', value: 'B&O' },
		{ label: 'AMG пакет', value: 'AMG' },
		{ label: 'Facelift', value: 'FACELIFT' }
	];
	const desktopFilter = (name: string) => desktop.filters.find((filter) => filter.name === name);
	const models = $derived.by(() => {
		const brands = values.brand ?? [];
		const options = brands.length
			? brands.flatMap((brand) => modelOptionsByBrand[brand] ?? [])
			: (modelOptionsByBrand[''] ?? []);
		return options.filter(
			(option, index) =>
				options.findIndex((candidate) => candidate.value === option.value) === index
		);
	});
	const hasDraftFilters = $derived(
		query.trim().length > 0 || Object.values(values).some((selected) => selected.length > 0)
	);
	const fields = $derived([
		{ name: 'brand', label: 'Марка', options: desktopFilter('brand')?.options ?? [] },
		{ name: 'model', label: 'Модел', options: models },
		{ name: 'bodyType', label: 'Купе', options: desktopFilter('bodyType')?.options ?? [] },
		{ name: 'condition', label: 'Състояние', options: conditionOptions },
		{
			name: 'minPrice',
			label: 'Цена от',
			options: numericOptions([10000, 20000, 30000, 50000, 80000])
		},
		{
			name: 'priceTo',
			label: 'Цена до',
			options: desktopFilter('priceTo')?.options ?? []
		},
		{
			name: 'minYear',
			label: 'Година от',
			options: numericOptions([2010, 2015, 2018, 2020, 2022, 2024])
		},
		{
			name: 'maxYear',
			label: 'Година до',
			options: numericOptions([2015, 2018, 2020, 2022, 2024, 2026])
		},
		{
			name: 'mileageTo',
			label: 'Пробег до',
			options: desktopFilter('mileageTo')?.options ?? []
		},
		{ name: 'fuel', label: 'Гориво', options: desktopFilter('fuel')?.options ?? [] },
		{
			name: 'transmission',
			label: 'Скорости',
			options: desktopFilter('transmission')?.options ?? []
		},
		{ name: 'sourceId', label: 'Номер на обява', options: [] }
	]);

	function openSearch(source: HTMLElement) {
		trigger = source;
		values = Object.fromEntries(
			desktop.filters.map((filter) => [filter.name, [...filter.selectedValues]])
		);
		const params = new URLSearchParams(search);
		for (const [name, keys] of Object.entries(aliases)) {
			const selected = keys
				.flatMap((key) => params.getAll(key))
				.flatMap((value) => value.split(','));
			if (selected.length) values[name] = [...new Set(selected.map((value) => value.trim()))];
		}
		query = values.model?.length ? '' : desktop.searchValue;
		cleared = false;
		error = '';
		open = true;
	}

	function setSingleValue(name: string, value: string) {
		values[name] = value ? [value] : [];
		if (name === 'brand') values.model = [];
		if (name === 'model') query = '';
	}

	function toggleExtra(value: string, checked: boolean) {
		const tokens = value.split(',');
		const current = values.feature ?? [];
		values.feature = checked
			? [...new Set([...current, ...tokens])]
			: current.filter((item) => !tokens.includes(item));
	}

	function clear() {
		query = '';
		values = {};
		cleared = true;
		error = '';
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;
		const params = new SvelteURLSearchParams(search);
		for (const key of [...Object.values(aliases).flat(), 'q', 'query', 'keyword', 'page']) {
			params.delete(key);
		}
		if (cleared) for (const key of remainingFilterKeys) params.delete(key);
		for (const [name, selected] of Object.entries(values)) {
			const key = name === 'priceTo' ? 'priceTo' : name === 'mileageTo' ? 'mileageTo' : name;
			if (selected.length) params.set(key, selected.join(','));
		}
		if (query.trim()) {
			params.set('q', query.trim());
			params.delete('model');
		}
		submitting = true;
		error = '';
		try {
			await onSearch(params);
			open = false;
		} catch {
			error = 'Търсенето не успя. Опитай отново.';
		} finally {
			submitting = false;
		}
	}
</script>

<Dialog.Root bind:open>
	{@render children(openSearch)}
	<Dialog.Content
		class="eliqauto-inventory-search-dialog"
		overlayClass="eliqauto-inventory-search-overlay"
		showCloseButton={false}
		onOpenAutoFocus={(event) => {
			event.preventDefault();
			input?.focus();
		}}
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			trigger?.focus({ preventScroll: true });
		}}
	>
		<div class="heading">
			<Dialog.Title class="search-title">Търсене на автомобили</Dialog.Title>
			<Dialog.Close class="search-close" aria-label="Затвори търсенето"
				><X size={22} /></Dialog.Close
			>
		</div>
		<Dialog.Description class="search-description"
			>Избери марка, модел и филтри. Промените се прилагат с „Покажи автомобилите“.</Dialog.Description
		>
		<form onsubmit={submit} aria-busy={submitting}>
			<div class="query-field">
				<Search size={20} aria-hidden="true" />
				<input
					{@attach (element) => {
						input = element;
						return () => {
							input = undefined;
						};
					}}
					bind:value={query}
					oninput={() => {
						values.model = [];
					}}
					type="search"
					aria-label="Марка или модел"
					placeholder="Марка или модел"
					autocomplete="off"
				/>
			</div>
			<div class="filter-grid">
				{#each fields as field (field.name)}
					<label class="select-field">
						<span class="sr-label">{field.label}</span>
						{#if field.name === 'sourceId'}
							<input
								type="text"
								value={values.sourceId?.[0] ?? ''}
								oninput={(event) => setSingleValue('sourceId', event.currentTarget.value)}
								placeholder={field.label}
								aria-label={field.label}
							/>
						{:else}
							<select
								value={values[field.name]?.[0] ?? ''}
								onchange={(event) => setSingleValue(field.name, event.currentTarget.value)}
								aria-label={field.label}
							>
								<option value="">{field.label}</option>
								{#each field.options as option (option.value)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							<ChevronDown class="select-chevron" size={18} aria-hidden="true" />
						{/if}
					</label>
				{/each}
			</div>
			<fieldset class="extras">
				<legend>Екстри</legend>
				<div class="extras-grid">
					{#each extraOptions as option (option.value)}
						{@const tokens = option.value.split(',')}
						<label for={`${id}-${encodeURIComponent(option.value)}`}>
							<input
								id={`${id}-${encodeURIComponent(option.value)}`}
								type="checkbox"
								checked={tokens.some((token) => (values.feature ?? []).includes(token))}
								onchange={(event) => toggleExtra(option.value, event.currentTarget.checked)}
							/>
							<span>{option.label}</span>
						</label>
					{/each}
				</div>
			</fieldset>
			{#if error}<p class="error" role="alert">{error}</p>{/if}
			<div class="actions">
				{#if hasDraftFilters}
					<button type="button" class="clear" onclick={clear} disabled={submitting}
						>Изчисти филтрите</button
					>
				{/if}
				<button type="submit" class="submit" disabled={submitting}
					>{submitting ? 'Търсене…' : 'Покажи автомобилите'}<Search
						size={18}
						aria-hidden="true"
					/></button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global(.eliqauto-inventory-search-overlay) {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgb(12 12 13 / 0.66);
	}
	:global(.eliqauto-inventory-search-dialog) {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 201;
		display: block;
		width: min(1200px, calc(100vw - 24px));
		max-width: none;
		max-height: calc(100dvh - 20px);
		overflow-y: auto;
		padding: 28px;
		border: 0;
		border-radius: 18px;
		background: #fff;
		color: var(--bc-ink);
		box-shadow: none;
		font-family: var(--bc-font-body);
		transform: translate(-50%, -50%);
		translate: none;
		animation: none;
	}
	:global(.eliqauto-inventory-search-dialog .search-description),
	.sr-label {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 24px;
	}
	:global(.eliqauto-inventory-search-dialog .search-title) {
		margin: 0;
		font-size: 24px;
		font-weight: 600;
		line-height: 1.3;
	}
	:global(.eliqauto-inventory-search-dialog .search-close) {
		display: grid;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		place-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 50%;
		background: #f3f4f6;
		color: var(--bc-ink);
	}
	form {
		display: grid;
		gap: 18px;
	}
	.query-field {
		display: flex;
		min-height: 60px;
		align-items: center;
		gap: 12px;
		padding: 0 20px;
		border: 1px solid var(--bc-border-strong);
		border-radius: 12px;
		color: #626873;
	}
	.query-field input,
	.select-field input,
	.select-field select {
		width: 100%;
		height: 58px;
		margin: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--bc-ink);
		font: inherit;
		font-size: 16px;
		box-shadow: none !important;
		border-radius: 0 !important;
		padding: 0 !important;
	}
	.query-field input {
		flex: 1;
		width: 0;
		min-width: 0;
	}
	.query-field input::placeholder,
	.select-field input::placeholder {
		color: #646a75;
		opacity: 1;
	}
	.query-field:focus-within,
	.select-field:focus-within {
		border-color: var(--bc-ink);
		outline: 0;
		box-shadow: 0 0 0 1px var(--bc-ink);
	}
	.filter-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}
	.select-field {
		position: relative;
		min-width: 0;
		padding: 0 16px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #f4f5f6;
	}
	.select-field select {
		padding-right: 30px !important;
		cursor: pointer;
	}
	.select-field :global(.select-chevron) {
		position: absolute;
		top: 50%;
		right: 16px;
		pointer-events: none;
		transform: translateY(-50%);
	}
	.extras {
		min-width: 0;
		margin: 0;
		padding: 20px;
		border: 0;
		border-radius: 14px;
		background: #f4f5f6;
	}
	.extras legend {
		float: left;
		width: 100%;
		margin-bottom: 16px;
		padding: 0;
		font-size: 18px;
		font-weight: 600;
	}
	.extras-grid {
		clear: both;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}
	.extras label {
		display: flex;
		min-height: 48px;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: #fff;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
		cursor: pointer;
	}
	.extras input {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		margin: 0;
		accent-color: var(--bc-ink);
	}
	.extras label:has(:checked) {
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: #fff;
	}
	.extras label:has(:checked) span,
	.extras label:hover span {
		color: #fff;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 6px;
	}
	.actions button {
		min-height: 52px;
		padding: 0 24px;
		border: 1px solid transparent;
		border-radius: 999px;
		background: transparent;
		color: var(--bc-ink);
		font: inherit;
		font-size: 16px;
		font-weight: 650;
	}
	.actions .clear {
		margin-right: auto;
		border-radius: 10px;
	}
	.actions .submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: var(--bc-accent);
		color: #fff;
	}
	.actions button:hover,
	:global(.eliqauto-inventory-search-dialog .search-close:hover),
	.extras label:hover {
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: #fff;
	}
	button:disabled {
		cursor: wait;
		opacity: 0.6;
	}
	button:focus-visible,
	.extras label:has(:focus-visible),
	:global(.eliqauto-inventory-search-dialog .search-close:focus-visible) {
		outline: 2px solid var(--bc-ink);
		outline-offset: 3px;
	}
	.error {
		margin: 0;
		color: var(--bc-danger);
	}
	@media (max-width: 900px) {
		.filter-grid,
		.extras-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 600px) {
		:global(.eliqauto-inventory-search-dialog) {
			width: calc(100vw - 20px);
			padding: 20px;
		}
		.filter-grid,
		.extras-grid {
			grid-template-columns: 1fr;
		}
		.actions {
			flex-wrap: wrap;
		}
		.actions .clear,
		.actions .submit {
			width: 100%;
			margin: 0;
		}
	}
</style>
