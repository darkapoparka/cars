<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import '$lib/styles/desktop-discovery.css';
	import Search from '@lucide/svelte/icons/search';
	import { resolve } from '$app/paths';
	import type { HomeDesktopVehicle } from '$lib/types/home';
	import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/body-scroll-lock';
	import { mileageMatches, normalize, priceMatches } from '$lib/utils/daynight-quick-filter-dom';
	import { onDestroy, onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import HomeQuickFilterModalStyles from '../HomeQuickFilterModalStyles.svelte';
	import {
		getDesktopHomeHeroQuickFields,
		getDesktopHomeHeroVehicleFilterData,
		type DesktopHomeQuickField,
		type DesktopHomeQuickFieldName
	} from './desktop-home-inventory-data';

	let {
		vehicles,
		layout = 'bar',
		showCondition = true,
		showSearchCopy = true,
		showKeywordSearch = false
	}: {
		vehicles: HomeDesktopVehicle[];
		layout?: 'bar' | 'box';
		showCondition?: boolean;
		showSearchCopy?: boolean;
		showKeywordSearch?: boolean;
	} = $props();

	const compactQuickLabels: Partial<Record<DesktopHomeQuickFieldName, Record<string, string>>> = {
		price: {
			'under-10000': '≤ 10k EUR',
			'under-20000': '≤ 20k EUR',
			'under-30000': '≤ 30k EUR',
			'under-50000': '≤ 50k EUR',
			'over-50000': '> 50k EUR'
		},
		mileage: {
			'under-100000': '≤ 100k км',
			'under-150000': '≤ 150k км',
			'under-200000': '≤ 200k км',
			'over-200000': '> 200k км'
		}
	};

	const quickFields = $derived(getDesktopHomeHeroQuickFields(vehicles));
	const heroVehicleFilterData = $derived(getDesktopHomeHeroVehicleFilterData(vehicles));

	let activeCondition = $state<'all' | 'new' | 'used'>('all');
	let keywordQuery = $state('');
	type HeroIntent = 'buy' | 'sell' | 'import';
	const intents = [
		{ value: 'buy', label: i18n.t('copy.f6c6952d4d23') },
		{ value: 'sell', label: i18n.t('copy.6510e880c790') },
		{ value: 'import', label: i18n.t('copy.995bfafd0b63') }
	] as const;
	let activeIntent = $state<HeroIntent>('buy');
	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});
	let sellMake = $state('');
	let sellModel = $state('');
	let importSourceUrl = $state('');
	const formAction = $derived(
		activeIntent === 'sell'
			? resolve('/sell-your-car')
			: activeIntent === 'import'
				? resolve('/contact')
				: resolve('/inventory')
	);

	function selectIntent(intent: HeroIntent) {
		closeQuickField();
		activeIntent = intent;
	}

	function handleIntentKeydown(event: KeyboardEvent, index: number) {
		let next: number;
		if (event.key === 'ArrowRight') next = (index + 1) % intents.length;
		else if (event.key === 'ArrowLeft') next = (index + intents.length - 1) % intents.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = intents.length - 1;
		else return;
		event.preventDefault();
		selectIntent(intents[next].value);
		const button = event.currentTarget as HTMLButtonElement;
		button.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	}
	let selectedQuickValues = $state<Record<DesktopHomeQuickFieldName, string>>({
		brand: '',
		model: '',
		mileage: '',
		price: ''
	});
	let activeQuickFieldName = $state<DesktopHomeQuickFieldName | null>(null);
	let quickFilterQuery = $state('');
	let isQuickFieldScrollLocked = false;
	let quickDialog: HTMLDialogElement | undefined;

	const activeQuickField = $derived(
		quickFields.find((field) => field.name === activeQuickFieldName)
	);
	const activeQuickValue = $derived(
		activeQuickFieldName ? selectedQuickValues[activeQuickFieldName] : ''
	);
	const activeQuickFieldUsesSearch = $derived(
		Boolean(
			activeQuickField &&
			(['brand', 'model'] as DesktopHomeQuickFieldName[]).includes(activeQuickField.name)
		)
	);
	const matchingVehicleCount = $derived.by(() => {
		const brand = normalize(selectedQuickValues.brand);
		const model = normalize(selectedQuickValues.model);
		const query = normalize(keywordQuery);
		const condition = activeCondition === 'all' ? '' : activeCondition;

		return heroVehicleFilterData.filter(
			(data) =>
				(!brand || data.brand === brand) &&
				(!model || data.model === model || data.haystack.includes(model)) &&
				(!query || data.haystack.includes(query)) &&
				priceMatches(data.price, selectedQuickValues.price) &&
				mileageMatches(data.mileage, selectedQuickValues.mileage) &&
				(!condition || data.condition === condition)
		).length;
	});

	const filteredQuickOptions = $derived.by(() => {
		if (!activeQuickField) {
			return [];
		}

		const resetOption = activeQuickField.options[0];
		const query = quickFilterQuery.trim().toLocaleLowerCase('bg-BG');
		const matches = activeQuickField.options
			.slice(1)
			.filter((option) => option.label.toLocaleLowerCase('bg-BG').includes(query));

		return resetOption ? [resetOption, ...matches] : matches;
	});

	function setActiveCondition(condition: 'all' | 'new' | 'used') {
		activeCondition = condition;
	}

	function quickOptionLabel(field: DesktopHomeQuickField, value: string) {
		const option = field.options.find((item) => item.value === value);
		return option?.label || value;
	}

	function quickDisplayLabel(field: DesktopHomeQuickField) {
		const value = selectedQuickValues[field.name];
		if (!value) {
			return field.placeholder;
		}

		return compactQuickLabels[field.name]?.[value] || quickOptionLabel(field, value);
	}

	function quickFullLabel(field: DesktopHomeQuickField) {
		const value = selectedQuickValues[field.name];
		return value ? quickOptionLabel(field, value) : field.placeholder;
	}

	function lockQuickFieldScroll() {
		if (isQuickFieldScrollLocked) {
			return;
		}

		lockBodyScroll();
		isQuickFieldScrollLocked = true;
	}

	function unlockQuickFieldScroll() {
		if (!isQuickFieldScrollLocked) {
			return;
		}

		unlockBodyScroll();
		isQuickFieldScrollLocked = false;
	}

	function openQuickField(field: DesktopHomeQuickField, event: MouseEvent) {
		if (event.currentTarget instanceof HTMLElement)
			event.currentTarget.focus({ preventScroll: true });
		activeQuickFieldName = field.name;
		quickFilterQuery = '';
		lockQuickFieldScroll();
	}

	function closeQuickField() {
		quickDialog?.close();
		activeQuickFieldName = null;
		quickFilterQuery = '';
		unlockQuickFieldScroll();
	}

	function pickQuickValue(value: string) {
		if (!activeQuickFieldName) {
			return;
		}

		selectedQuickValues[activeQuickFieldName] = value;
		closeQuickField();
	}

	const showQuickDialog: Attachment<HTMLDialogElement> = (node) => {
		quickDialog = node;
		node.showModal();
		const focusTarget = activeQuickFieldUsesSearch
			? node.querySelector<HTMLInputElement>('input')
			: node.querySelector<HTMLButtonElement>('[aria-selected="true"]');
		focusTarget?.focus();
		return () => {
			node.close();
			if (quickDialog === node) quickDialog = undefined;
		};
	};

	function keepQuickDialogFocus(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;
		const dialog = event.currentTarget as HTMLDialogElement;
		const controls = [...dialog.querySelectorAll<HTMLElement>('button, input')].filter(
			(element) => element.getClientRects().length && !element.hasAttribute('disabled')
		);
		const first = controls[0];
		const last = controls.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}

	onDestroy(unlockQuickFieldScroll);
</script>

<HomeQuickFilterModalStyles />

<form action={i18n.href(formAction)} method="get" class:hero-intent={showKeywordSearch}>
	{#if activeIntent === 'buy'}
		{#if activeCondition !== 'all'}
			<input {@attach i18n.validation} type="hidden" name="condition" value={activeCondition} />
		{/if}
		{#each quickFields as field (field.name)}
			{#if selectedQuickValues[field.name]}
				<input
					{@attach i18n.validation}
					type="hidden"
					name={field.name}
					value={selectedQuickValues[field.name]}
				/>
			{/if}
		{/each}
	{/if}
	{#if showKeywordSearch}
		<div class="hero-intent__tabs" role="tablist" aria-label={i18n.t('copy.5a80de742e54')}>
			{#each intents as intent, index (intent.value)}
				<button
					type="button"
					role="tab"
					disabled={!hydrated}
					id={`hero-intent-${intent.value}`}
					aria-selected={activeIntent === intent.value}
					aria-controls="hero-intent-panel"
					tabindex={activeIntent === intent.value ? 0 : -1}
					onclick={() => selectIntent(intent.value)}
					onkeydown={(event) => handleIntentKeydown(event, index)}>{i18n.text(intent.label)}</button
				>
			{/each}
		</div>
		<div
			id="hero-intent-panel"
			class="hero-intent__panel"
			role="tabpanel"
			aria-labelledby={`hero-intent-${activeIntent}`}
		>
			{#if activeIntent === 'buy'}
				<label class="hero-intent__label hero-intent__label--search" for="hero-buy-query"
					>{i18n.t('copy.d028fe65890c')}</label
				>
				<div class="hero-intent__row hero-intent__row--search">
					<input
						{@attach i18n.validation}
						id="hero-buy-query"
						class="hero-intent__input"
						type="search"
						name="q"
						autocomplete="off"
						placeholder={i18n.t('copy.df071062a573')}
						bind:value={keywordQuery}
					/>
					<button
						class="hero-intent__submit"
						type="submit"
						aria-label={i18n.t('pattern.bcc5755f99f8', { v0: matchingVehicleCount })}
						title={i18n.t('copy.255bbb6ac445')}
					>
						<Search size={20} strokeWidth={2} aria-hidden="true" />
					</button>
				</div>
				<div class="hero-intent__quick-fields">
					{#each quickFields as field (field.name)}
						<button
							type="button"
							class="hero-intent__filter"
							disabled={!hydrated}
							class:is-selected={!!selectedQuickValues[field.name]}
							aria-label={`${i18n.text(field.label)}: ${i18n.spec(quickFullLabel(field))}`}
							aria-haspopup="dialog"
							aria-expanded={activeQuickFieldName === field.name}
							title={i18n.spec(quickFullLabel(field))}
							onclick={(event) => openQuickField(field, event)}
						>
							<span>{i18n.spec(quickDisplayLabel(field))}</span>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
								><path
									d="m6 9 6 6 6-6"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						</button>
					{/each}
				</div>
			{:else if activeIntent === 'sell'}
				<div class="hero-intent__row hero-intent__row--sell">
					<label class="hero-intent__label" for="hero-sell-make"
						>{i18n.t('copy.b7fccee005ae')}
						<input
							{@attach i18n.validation}
							id="hero-sell-make"
							class="hero-intent__input"
							type="text"
							name="make"
							placeholder={i18n.t('copy.f72bd5b65622')}
							required
							maxlength="80"
							bind:value={sellMake}
						/>
					</label>
					<label class="hero-intent__label" for="hero-sell-model"
						>{i18n.t('copy.37858c8efede')}
						<input
							{@attach i18n.validation}
							id="hero-sell-model"
							class="hero-intent__input"
							type="text"
							name="model"
							placeholder={i18n.t('copy.d9e466f57c5b')}
							required
							maxlength="120"
							bind:value={sellModel}
						/>
					</label>
					<button class="hero-intent__submit" type="submit">{i18n.t('copy.ffe5cca7d0b3')}</button>
				</div>
				<p class="hero-intent__hint">
					{i18n.t('copy.f8c37cf7bd53')}
				</p>
			{:else}
				<input {@attach i18n.validation} type="hidden" name="intent" value="import" />
				<label class="hero-intent__label" for="hero-import-url">{i18n.t('copy.26bf9a0a41c0')}</label
				>
				<div class="hero-intent__row">
					<input
						{@attach i18n.validation}
						id="hero-import-url"
						class="hero-intent__input"
						type="url"
						name="sourceUrl"
						placeholder={i18n.t('copy.18fff8d4789c')}
						required
						pattern="https?://.+"
						maxlength="2000"
						aria-describedby="hero-import-hint"
						bind:value={importSourceUrl}
					/>
					<button class="hero-intent__submit" type="submit">{i18n.t('copy.ffe5cca7d0b3')}</button>
				</div>
				<p id="hero-import-hint" class="hero-intent__hint">
					{i18n.t('copy.a5fb78b0cbac')}
				</p>
			{/if}
		</div>
	{:else}
		<div
			class={[
				'daynight-home-hero__filters',
				layout === 'box' && 'daynight-home-hero__filters--box'
			]}
			data-daynight-hero-search-box=""
		>
			{#if showSearchCopy || showCondition}
				<div class="daynight-home-hero__search-intro">
					{#if showSearchCopy}
						<div class="daynight-home-hero__search-copy">
							<strong>{i18n.t('copy.d8a207965cec')}</strong>
							<span>({matchingVehicleCount})</span>
						</div>
					{/if}
					{#if showCondition}
						<div
							class="daynight-home-hero__condition"
							role="group"
							aria-label={i18n.t('copy.ae5f681d8d20')}
						>
							<div class="daynight-home-hero__condition-inner">
								<button
									type="button"
									class={[
										'daynight-home-hero__condition-option',
										activeCondition === 'all' && 'active'
									]}
									data-vehicle-condition="all"
									aria-pressed={activeCondition === 'all'}
									onclick={() => setActiveCondition('all')}>{i18n.t('copy.117d98cb652c')}</button
								>
								<button
									type="button"
									class={[
										'daynight-home-hero__condition-option',
										activeCondition === 'new' && 'active'
									]}
									data-vehicle-condition="new"
									aria-pressed={activeCondition === 'new'}
									onclick={() => setActiveCondition('new')}>{i18n.t('copy.fd848e5e894f')}</button
								>
								<button
									type="button"
									class={[
										'daynight-home-hero__condition-option',
										activeCondition === 'used' && 'active'
									]}
									data-vehicle-condition="used"
									aria-pressed={activeCondition === 'used'}
									onclick={() => setActiveCondition('used')}>{i18n.t('copy.9536d595d99b')}</button
								>
							</div>
						</div>
					{/if}
				</div>
			{/if}
			{@render quickFieldsAndSubmit(true)}
		</div>
	{/if}
</form>

{#snippet quickFieldsAndSubmit(includeSubmit: boolean)}
	{#each quickFields as field (field.name)}
		<div
			class={`daynight-home-hero__field daynight-inventory-quick-field daynight-inventory-quick-field--${field.name}`}
		>
			<div
				class={[
					'daynight-home-hero__select filter-select-dropdown bg-white',
					selectedQuickValues[field.name] && 'is-selected'
				]}
				data-name={field.label}
				data-placeholder={field.placeholder}
				data-daynight-quick-dropdown=""
			>
				<button
					type="button"
					class="filter-select-dropdown__text"
					aria-label={`${i18n.text(field.label)}: ${i18n.spec(quickFullLabel(field))}`}
					aria-haspopup="dialog"
					aria-expanded={activeQuickFieldName === field.name}
					title={i18n.spec(quickFullLabel(field))}
					onclick={(event) => openQuickField(field, event)}
				>
					<span data-daynight-quick-value="">{i18n.spec(quickDisplayLabel(field))}</span>
				</button>
			</div>
		</div>
	{/each}
	{#if includeSubmit}
		{@render submitButton(false)}
	{/if}
{/snippet}

{#snippet submitButton(iconOnly: boolean)}
	<button
		type="submit"
		class={['daynight-home-hero__submit', iconOnly && 'daynight-home-hero__submit--icon']}
		aria-label={i18n.t('pattern.f17ae026f58f', {
			v0: matchingVehicleCount,
			v1: matchingVehicleCount === 1 ? i18n.t('copy.841d8c2e64c6') : i18n.t('copy.afc67636f9b8')
		})}
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
			<path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<span
			>{matchingVehicleCount === 1
				? i18n.t('copy.9f6e0a12c44c')
				: i18n.t('pattern.d06c313b4917', { v0: matchingVehicleCount })}</span
		>
	</button>
{/snippet}

{#if activeQuickField}
	<dialog
		class="daynight-hero-filter-sheet hero-intent-dialog"
		aria-label={i18n.text(activeQuickField.label)}
		onkeydown={keepQuickDialogFocus}
		oncancel={(event) => {
			event.preventDefault();
			closeQuickField();
		}}
		{@attach showQuickDialog}
	>
		<button
			type="button"
			class="daynight-hero-filter-sheet__backdrop"
			aria-label={i18n.t('copy.1ef1a425356f')}
			onclick={closeQuickField}
		></button>
		<div class="daynight-hero-filter-sheet__sheet">
			<div class="daynight-hero-filter-sheet__head">
				<h3 class="daynight-hero-filter-sheet__title">{i18n.text(activeQuickField.label)}</h3>
				<button
					type="button"
					class="daynight-hero-filter-sheet__close"
					aria-label={i18n.t('copy.1ef1a425356f')}
					onclick={closeQuickField}>✕</button
				>
			</div>
			<div class="daynight-hero-filter-sheet__searchwrap" hidden={!activeQuickFieldUsesSearch}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
					><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path
						d="M20 20l-3.2-3.2"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/></svg
				>
				<input
					{@attach i18n.validation}
					type="text"
					class="daynight-hero-filter-sheet__search"
					autocomplete="off"
					placeholder={i18n.t('pattern.b73b60b23e89', {
						v0: i18n.text(activeQuickField.label).toLocaleLowerCase(i18n.locale)
					})}
					aria-label={i18n.t('pattern.13a9318d4e85', {
						v0: i18n.text(activeQuickField.label).toLocaleLowerCase(i18n.locale)
					})}
					bind:value={quickFilterQuery}
				/>
			</div>
			<div class="daynight-hero-filter-sheet__list" role="listbox">
				{#each filteredQuickOptions as option (option.value)}
					<button
						type="button"
						role="option"
						class={[
							'daynight-hero-filter-sheet__row',
							!option.value && 'daynight-hero-filter-sheet__row--reset',
							option.value === activeQuickValue && 'is-selected'
						]}
						aria-selected={option.value === activeQuickValue}
						onclick={() => pickQuickValue(option.value)}
					>
						<span>{i18n.text(option.label)}</span>
						<span class="daynight-hero-filter-sheet__tick" aria-hidden="true">✓</span>
					</button>
				{/each}
				{#if filteredQuickOptions.length === 1 && quickFilterQuery.trim()}
					<p class="daynight-hero-filter-sheet__empty">
						{i18n.t('copy.41846409e36e')}{quickFilterQuery}“
					</p>
				{/if}
			</div>
		</div>
	</dialog>
{/if}

<style>
	.hero-intent-dialog {
		background: transparent;
		border: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
	}
	.hero-intent-dialog::backdrop {
		background: transparent;
	}
	.hero-intent__label--search {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	/* The task panel owns its controls; legacy hero selectors do not style it. */
	.hero-intent {
		background: var(--discovery-panel);
		border-radius: 12px;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		padding: 14px 18px 18px;
		text-align: left;
		width: 100%;
	}
	.hero-intent__tabs {
		display: flex;
		justify-content: center;
		border: 0;
		gap: 4px;
		margin: 0 auto 12px;
		width: fit-content;
		padding: 3px;
		background: var(--discovery-muted-surface);
		border-radius: 8px;
	}
	.hero-intent__tabs button {
		background: transparent;
		border: 0;
		border-bottom: 0;
		border-radius: 7px;
		color: #59616c;
		cursor: pointer;
		font: inherit;
		font-size: var(--sa-text-hero-tab);
		font-weight: var(--sa-button-font-weight);
		min-height: 44px;
		padding: 0 18px;
	}
	.hero-intent__tabs button:hover {
		background: var(--discovery-light-hover);
		color: var(--sa-ink);
	}
	.hero-intent button:disabled {
		cursor: wait;
		opacity: 0.6;
	}
	.hero-intent__tabs button[aria-selected='true'] {
		background: #171b1e;
		color: #fff;
	}
	.hero-intent__tabs button[aria-selected='true']:hover {
		background: var(--discovery-action-hover);
	}
	.hero-intent__panel {
		min-height: 112px;
	}
	.hero-intent__label {
		color: var(--sa-ink);
		display: grid;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-medium);
		gap: 8px;
		line-height: 20px;
		margin: 0 0 8px;
		min-width: 0;
	}
	.hero-intent__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 112px;
		align-items: end;
		gap: 12px;
	}
	.hero-intent__row--sell {
		grid-template-columns: repeat(2, minmax(0, 1fr)) 112px;
	}
	.hero-intent__row--sell .hero-intent__label {
		margin: 0;
	}
	.hero-intent .hero-intent__input {
		background: #fff;
		border: 1px solid var(--discovery-control-border);
		border-radius: 8px;
		box-shadow: none;
		color: var(--sa-ink);
		font: inherit;
		font-size: var(--sa-text-base);
		height: 46px;
		line-height: 24px;
		margin: 0;
		min-width: 0;
		padding: 0 14px;
		width: 100%;
	}
	.hero-intent .hero-intent__input::placeholder {
		color: var(--discovery-muted);
		opacity: 1;
	}
	.hero-intent__submit {
		align-items: center;
		background: var(--discovery-action);
		border: 0;
		border-radius: 8px;
		color: #fff;
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
		gap: 8px;
		height: 46px;
		justify-content: center;
		padding: 0 16px;
	}
	.hero-intent__submit:hover {
		background: var(--discovery-action-hover);
	}
	.hero-intent__row--search {
		display: flex;
		align-items: center;
		gap: 4px;
		height: var(--discovery-search-height);
		padding: 4px;
		border: 1px solid var(--discovery-control-border);
		border-radius: var(--discovery-control-radius);
		background: #fff;
	}
	.hero-intent__row--search:focus-within {
		border-color: var(--discovery-action);
		outline: 2px solid var(--discovery-action);
		outline-offset: -1px;
	}
	.hero-intent .hero-intent__row--search .hero-intent__input {
		flex: 1;
		height: var(--discovery-search-action-size);
		border: 0;
		padding: 0 9px;
		outline: none;
		box-shadow: none;
	}
	.hero-intent__row--search .hero-intent__submit {
		flex: none;
		width: var(--discovery-search-action-size);
		height: var(--discovery-search-action-size);
		padding: 0;
		border-radius: 5px;
	}
	@media (pointer: coarse) {
		.hero-intent__tabs button {
			min-height: 44px;
		}
	}
	.hero-intent__quick-fields {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 12px;
	}
	.hero-intent__filter {
		align-items: center;
		background: var(--discovery-filter-background);
		border: 1px solid var(--discovery-filter-border);
		border-radius: 8px;
		color: var(--discovery-filter-foreground);
		cursor: pointer;
		display: flex;
		font: inherit;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		gap: 8px;
		justify-content: space-between;
		min-height: 46px;
		min-width: 0;
		padding: 8px 12px;
	}
	.hero-intent__filter span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.hero-intent__filter svg {
		flex: none;
	}
	/* The storefront's legacy span/SVG colors must inherit the control color. */
	.hero-intent__filter :is(span, svg),
	.hero-intent__submit :global(svg),
	.hero-intent__submit :global(svg *),
	.hero-intent svg :is(path, circle) {
		color: inherit !important;
	}
	.hero-intent__filter:hover {
		background: var(--discovery-filter-hover);
		border-color: var(--discovery-filter-hover);
	}
	.hero-intent__filter.is-selected {
		color: #fff;
		background: var(--discovery-action);
		border-color: var(--discovery-action);
	}
	.hero-intent__filter.is-selected:hover {
		background: var(--discovery-action-hover);
		border-color: var(--discovery-action-hover);
	}
	.hero-intent__hint {
		color: #59616c;
		font-size: var(--sa-text-caption);
		line-height: 20px;
		margin: 12px 0 0;
	}
	.hero-intent :is(button, input):focus-visible {
		outline: 2px solid var(--discovery-action);
		outline-offset: 3px;
	}
</style>
