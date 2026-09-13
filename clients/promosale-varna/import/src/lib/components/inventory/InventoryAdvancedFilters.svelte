<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Search, SlidersHorizontal, X } from '@lucide/svelte';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilterOption
	} from '$lib/auxero/inventory-desktop';
	import type { Attachment } from 'svelte/attachments';

	let {
		desktop,
		onclose,
		initialValues,
		onchange
	}: {
		desktop: Pick<AuxeroInventoryDesktopData, 'filters'>;
		onclose: () => void;
		initialValues?: Record<string, string>;
		onchange?: (values: Record<string, string>) => void;
	} = $props();

	function closeDialog() {
		onchange?.({ ...draft });
		onclose();
	}
	// Inventory edits apply on submit; Home also retains the draft on dismissal.
	let draft = $state<Record<string, string>>({});
	const queryField = $derived(initialValues || draft.keyword !== undefined ? 'keyword' : 'q');
	let models = $state<AuxeroInventoryFilterOption[]>([]);
	let featureOptions = $state<AuxeroInventoryFilterOption[]>([]);
	let count = $state<number | null>(null);
	let loading = $state(true);
	let submitting = $state(false);
	let submitError = $state('');
	let dialog: HTMLDialogElement;
	let controller: AbortController | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	const fieldOrder = [
		'brand',
		'model',
		'bodyType',
		'fuel',
		'minPrice',
		'priceTo',
		'minYear',
		'maxYear',
		'mileageTo',
		'transmission'
	];
	const numberLabels: Record<string, string> = {
		minPrice: 'Цена от (EUR)',
		minYear: 'Година от',
		maxYear: 'Година до'
	};
	const fields = $derived(
		fieldOrder.map((name) => {
			const filter = desktop.filters.find((f) => f.name === name);
			return filter ?? { name, label: numberLabels[name], options: [] };
		})
	);
	const features = $derived(featureOptions);
	const selectedFeatures = $derived((draft.feature ?? '').split(',').filter(Boolean));
	const optionList = (name: string, options: AuxeroInventoryFilterOption[]) =>
		name === 'model' ? models : options;
	const queryString = () =>
		new URLSearchParams(
			Object.entries(draft).filter(([, value]) => value && value.toLowerCase() !== 'all')
		).toString();

	async function refreshCount() {
		const request = new AbortController();
		controller = request;
		try {
			const response = await fetch(`${resolve('/api/inventory/count')}?${queryString()}`, {
				signal: request.signal
			});
			if (!response.ok) throw new Error('Count unavailable');
			const result = await response.json();
			if (request.signal.aborted) return;
			count = result.count;
			models = result.models;
			featureOptions = result.features;
		} catch {
			if (!request.signal.aborted) count = null;
		} finally {
			if (!request.signal.aborted) loading = false;
		}
	}
	function scheduleCount() {
		controller?.abort();
		clearTimeout(timer);
		loading = true;
		count = null;
		timer = setTimeout(() => void refreshCount(), 200);
	}
	function setField(name: string, value: string) {
		draft[name] = value;
		if (name === 'model') draft.q = '';
		if (name === 'q') draft.model = '';
		if (name === 'brand') {
			draft.model = '';
			models = [];
		}
		delete draft.page;
		submitError = '';
		scheduleCount();
	}
	function toggleFeature(value: string, checked: boolean) {
		setField(
			'feature',
			(checked ? [...selectedFeatures, value] : selectedFeatures.filter((f) => f !== value)).join(
				','
			)
		);
	}
	function clearFilters() {
		draft = Object.fromEntries(
			Object.entries(draft).filter(([name]) => ['view', 'layout', 'sort', 'lang'].includes(name))
		);
		scheduleCount();
	}
	async function apply(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		submitError = '';
		try {
			await goto(resolve(`/inventory?${queryString()}` as `/inventory${string}`), {
				noScroll: true
			});
			dialog.close();
		} catch {
			submitError = 'Не успяхме да заредим автомобилите. Опитайте отново.';
		} finally {
			submitting = false;
		}
	}
	const mountDialog: Attachment<HTMLDialogElement> = (element) =>
		untrack(() => {
			draft = Object.fromEntries(page.url.searchParams);
			for (const filter of desktop.filters) {
				if (filter.name !== 'model') draft[filter.name] = filter.selectedValues.join(',');
			}
			for (const alias of [
				'maxPrice',
				'price',
				'maxMileage',
				'features',
				'extra',
				'equipment',
				'body',
				'bodystyle',
				'FuelType',
				'Transmission',
				'gearbox'
			])
				delete draft[alias];
			if (initialValues) draft = { ...initialValues };
			models = desktop.filters.find((f) => f.name === 'model')?.options ?? [];
			featureOptions = desktop.filters.find((f) => f.name === 'feature')?.options ?? [];
			dialog = element;
			element.showModal();
			const previousOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			void refreshCount();
			return () => {
				controller?.abort();
				clearTimeout(timer);
				document.body.style.overflow = previousOverflow;
			};
		});
</script>

<dialog
	class="inventory-advanced"
	aria-labelledby="inventory-advanced-title"
	{@attach mountDialog}
	onclose={closeDialog}
>
	<form onsubmit={apply}>
		<header>
			<h2 id="inventory-advanced-title">
				<SlidersHorizontal size={22} aria-hidden="true" />Търсене на автомобили
			</h2>
			<button
				class="close"
				type="button"
				onclick={() => dialog.close()}
				aria-label="Затвори филтрите"><X size={22} /></button
			>
		</header>
		<div class="fields-body">
			<label class="query"
				><Search size={20} aria-hidden="true" /><input
					aria-label="Търсене в разширените филтри"
					type="search"
					placeholder="Марка, модел или ключова дума"
					value={draft[queryField] ?? ''}
					oninput={(event) => setField(queryField, event.currentTarget.value)}
				/></label
			>
			<div class="fields">
				{#each fields as field (field.name)}
					<label class="field"
						><span
							>{field.name === 'priceTo'
								? 'Цена до (EUR)'
								: field.name === 'mileageTo'
									? 'Пробег до'
									: field.label}</span
						>
						{#if numberLabels[field.name]}
							<input
								name={field.name}
								type="number"
								min={field.name === 'minPrice' ? '0' : '1900'}
								max={field.name === 'minPrice' ? undefined : '2100'}
								placeholder={field.name === 'maxYear' ? 'Без максимум' : 'Без минимум'}
								value={draft[field.name] ?? ''}
								oninput={(event) => setField(field.name, event.currentTarget.value)}
							/>
						{:else}
							<select
								name={field.name}
								value={draft[field.name] ?? ''}
								onchange={(event) => setField(field.name, event.currentTarget.value)}
							>
								<option value="">Всички</option>
								{#if draft[field.name] && !optionList(field.name, field.options).some((option) => option.value === draft[field.name])}<option
										value={draft[field.name]}>{draft[field.name]}</option
									>{/if}
								{#each optionList(field.name, field.options) as option (option.value)}{#if option.value}<option
											value={option.value}>{option.label}</option
										>{/if}{/each}
							</select>
						{/if}</label
					>
				{/each}
			</div>
			<fieldset>
				<legend>Екстри</legend>
				<div class="features">
					{#each features.slice(0, 8) as feature (feature.value)}<label
							><input
								type="checkbox"
								value={feature.value}
								checked={selectedFeatures.includes(feature.value)}
								onchange={(event) => toggleFeature(feature.value, event.currentTarget.checked)}
							/>{feature.label}</label
						>{/each}
				</div>
				{#if features.length > 8}<details>
						<summary>Още екстри ({features.length - 8})</summary>
						<div class="features">
							{#each features.slice(8) as feature (feature.value)}<label
									><input
										type="checkbox"
										value={feature.value}
										checked={selectedFeatures.includes(feature.value)}
										onchange={(event) => toggleFeature(feature.value, event.currentTarget.checked)}
									/>{feature.label}</label
								>{/each}
						</div>
					</details>{/if}
			</fieldset>
		</div>
		<footer>
			<button class="clear" type="button" onclick={clearFilters}>Изчисти всички</button>
			<div class="apply-area">
				{#if submitError}<p role="alert">{submitError}</p>{/if}<button
					class="apply"
					type="submit"
					disabled={submitting}
					aria-live="polite"
					>{submitting
						? 'Зареждане…'
						: loading
							? 'Покажи автомобили'
							: count === null
								? 'Покажи автомобили'
								: `Покажи ${count} ${count === 1 ? 'автомобил' : 'автомобила'}`}<Search
						size={18}
						aria-hidden="true"
					/></button
				>
			</div>
		</footer>
	</form>
</dialog>

<style>
	.inventory-advanced .query input {
		border: 0;
		box-shadow: none;
		border-radius: 0;
		padding: 0;
	}
	.inventory-advanced .field select {
		appearance: auto;
		box-shadow: none;
	}
	.inventory-advanced .field input {
		box-shadow: none;
	}
	details {
		margin-top: 14px;
	}
	summary {
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
		padding-block: 10px;
	}

	.inventory-advanced {
		width: min(1080px, calc(100vw - 64px));
		max-height: calc(100dvh - 64px);
		margin: auto;
		padding: 0;
		border: 1px solid var(--bc-border);
		border-radius: 20px;
		background: #fff;
		color: var(--bc-ink);
		box-shadow: 0 24px 80px #0004;
		font-family: var(--bc-font-body);
	}
	.inventory-advanced::backdrop {
		background: #10121680;
	}
	form {
		display: flex;
		flex-direction: column;
		max-height: calc(100dvh - 66px);
	}
	header,
	footer {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 24px 28px;
	}
	header {
		border-bottom: 1px solid var(--bc-border);
	}
	h2 {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 0;
		font-size: 25px;
		line-height: 32px;
	}
	button,
	input,
	select {
		font: inherit;
	}
	button {
		cursor: pointer;
	}
	.close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--bc-border);
		border-radius: 50%;
		background: #f4f5f6;
	}
	.fields-body {
		padding: 24px 28px;
		overflow: auto;
	}
	.query {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid #aeb5be;
		border-radius: 10px;
		padding: 0 16px;
		margin-bottom: 24px;
	}
	.query input {
		width: 100%;
		height: 50px;
		border: 0;
		background: transparent;
		outline: none;
	}
	.query:focus-within {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.fields {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 18px 16px;
	}
	.field {
		display: grid;
		gap: 7px;
		min-width: 0;
	}
	.field span {
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
	}
	.field select,
	.field input {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		height: 48px;
		border: 1px solid #c5cbd2;
		border-radius: 9px;
		background: #f5f6f7;
		color: var(--bc-ink);
		padding: 0 12px;
		font-size: var(--bc-text-control);
		line-height: var(--bc-leading-control);
		font-weight: var(--bc-weight-control);
	}
	fieldset {
		min-width: 0;
		margin: 24px 0 0;
		padding: 18px;
		border: 0;
		border-radius: 14px;
		background: #f5f6f7;
	}
	legend {
		margin-bottom: 12px;
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}
	.features {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}
	.features label {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 46px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		padding: 8px 12px;
		font-size: var(--bc-text-control);
		background: white;
		cursor: pointer;
		line-height: var(--bc-leading-control);
		font-weight: var(--bc-weight-control);
	}
	.features input {
		width: 17px;
		height: 17px;
		accent-color: var(--bc-accent);
	}
	.features label:has(:checked) {
		border-color: var(--bc-accent);
		background: var(--bc-accent-soft);
	}
	footer {
		border-top: 1px solid var(--bc-border);
	}
	.clear {
		border: 0;
		background: transparent;
		min-height: 48px;
		padding: 0;
		color: var(--bc-muted);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.apply {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-width: 230px;
		min-height: 50px;
		padding: 0 24px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #fff;
		font-weight: 650;
	}
	.apply:disabled {
		opacity: 0.65;
		cursor: wait;
	}
	.apply-area p {
		font-size: 14px;
		color: var(--bc-accent);
	}
	button:focus-visible,
	select:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.query input:focus-visible {
		outline: none;
	}
	@media (max-width: 999px) {
		.fields {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.features {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
