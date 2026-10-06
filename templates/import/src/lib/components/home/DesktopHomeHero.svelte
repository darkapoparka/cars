<script lang="ts">
	import type {
		HomeFiveHeroData,
		HomeFiveHeroActionMode,
		HomeFiveHeroSelect
	} from '$lib/auxero/home-five';
	import HandCoins from '@lucide/svelte/icons/hand-coins';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { tick } from 'svelte';
	import DesktopImportEntry from '$lib/components/services/DesktopImportEntry.svelte';
	import { importEntryComplete, type ImportIntent } from '$lib/domain/import-entry';
	import { importEntryCopy } from '$lib/content/import-entry';
	import VehicleSearchDialog from '$lib/components/inventory/VehicleSearchDialog.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import HeroFilterDialog from './HeroFilterDialog.svelte';
	import DesktopHomeFilter from './DesktopHomeFilter.svelte';
	import DesktopSearchControl from '$lib/components/common/DesktopSearchControl.svelte';
	import DesktopDiscoveryPanel from '$lib/components/common/DesktopDiscoveryPanel.svelte';
	import { linkHref } from '$lib/utils/links';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import { homeHeroModes, desktopHomeCopy, homeModeArtwork } from '$lib/content/home-discovery';
	let {
		hero,
		english = false
	}: {
		hero: HomeFiveHeroData;
		english?: boolean;
	} = $props();
	const copy = $derived(desktopHomeCopy[english ? 'en' : 'bg']);
	let importIntent = $state<ImportIntent>('listing');
	let importVehicle = $state('');
	let importMake = $state('');
	let importModel = $state('');
	let importType = $state('');
	let importError = $state('');
	let importForm = $state<HTMLFormElement>();
	function setImportIntent(intent: ImportIntent) {
		importIntent = intent;
		importError = '';
	}
	async function continueImport(event: SubmitEvent) {
		if (
			importEntryComplete(importIntent, importVehicle, {
				make: importMake,
				model: importModel,
				origin: ''
			})
		) {
			importError = '';
			return;
		}
		event.preventDefault();
		const entryCopy = importEntryCopy[english ? 'en' : 'bg'];
		importError = importIntent === 'listing' ? entryCopy.invalidListing : entryCopy.missingCriteria;
		await tick();
		importForm?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
	}
	let modeOverride = $state<HomeFiveHeroActionMode | 'finance' | null>(null);
	const mode = $derived(modeOverride ?? hero.activeMode);
	let brandSelection = $state<string[]>([]);
	let modelSelection = $state<string[]>([]);
	let priceSelection = $state<string[]>([]);
	let mileageSelection = $state<string[]>([]);
	const brandFilter = $derived(hero.primaryFilters.find((filter) => filter.name === 'brand'));
	const modelFilter = $derived(hero.primaryFilters.find((filter) => filter.name === 'q'));
	const priceFilter = $derived(hero.primaryFilters.find((filter) => filter.name === 'maxPrice'));
	const modelOptions = $derived(
		(modelFilter?.options ?? []).filter(
			(option) => !brandSelection.length || (option.brand && brandSelection.includes(option.brand))
		)
	);
	const mileageSource = $derived(
		hero.inventorySearch?.desktop.filters.find((filter) =>
			['mileageTo', 'maxMileage'].includes(filter.name)
		)
	);
	const mileageFilter: HomeFiveHeroSelect = $derived({
		id: 'desktop-home-mileage',
		name: 'maxMileage',
		title: copy.mileageUpTo,
		defaultLabel: copy.anyMileage,
		options:
			mileageSource?.options.map((option) => ({ value: option.value, label: option.label })) ?? []
	});
	function updateBrandSelection(next: string[]) {
		brandSelection = next;
		modelSelection = modelSelection.filter((value) =>
			(modelFilter?.options ?? []).some(
				(option) =>
					option.value === value && (!next.length || (option.brand && next.includes(option.brand)))
			)
		);
	}
	const title = $derived(homeHeroModes[mode].title[english ? 'en' : 'bg']);
	const action = $derived(homeHeroModes[mode].action);

	let searchOpen = $state(false);
	let keyword = $state('');
	const localized = (href: string) =>
		href + (english ? (href.includes('?') ? '&' : '?') + 'lang=en' : '');
	const searchParams = $derived.by(() => {
		const params = new SvelteURLSearchParams();
		for (const value of brandSelection) params.append('brand', value);
		for (const value of modelSelection) params.append('q', value);
		for (const value of priceSelection) params.append('maxPrice', value);
		for (const value of mileageSelection) params.append('maxMileage', value);
		return params.toString();
	});
	const searchHref = $derived.by(() => {
		const params = new SvelteURLSearchParams(searchParams);
		if (keyword.trim()) params.set('keyword', keyword.trim());
		if (english) params.set('lang', 'en');
		return '/inventory' + (params.size ? '?' + params.toString() : '');
	});
	function clearSelection() {
		brandSelection = [];
		modelSelection = [];
		priceSelection = [];
		mileageSelection = [];
	}
</script>

{#snippet searchFilters(anchored = false)}
	{#if anchored}
		{#if brandFilter}<DesktopHomeFilter
				select={{ ...brandFilter, title: copy.make }}
				bind:selected={() => brandSelection, updateBrandSelection}
				searchable
				searchPlaceholder={copy.searchMakes}
				title={copy.chooseMake}
				{english}
			/>{/if}
		{#if modelFilter}<DesktopHomeFilter
				select={{ ...modelFilter, title: copy.model }}
				bind:selected={modelSelection}
				options={modelOptions}
				searchable
				searchPlaceholder={copy.searchModels}
				title={copy.chooseModel}
				{english}
			/>{/if}
		{#if priceFilter}<DesktopHomeFilter
				select={{ ...priceFilter, title: copy.price }}
				bind:selected={priceSelection}
				mode="single"
				{english}
			/>{/if}
		<DesktopHomeFilter
			select={{ ...mileageFilter, title: copy.mileage }}
			bind:selected={mileageSelection}
			mode="single"
			{english}
		/>
	{:else}
		{#if brandFilter}<HeroFilterDialog
				select={{ ...brandFilter, title: copy.make }}
				bind:selected={() => brandSelection, updateBrandSelection}
				mode="multi"
				variant="grid"
				searchable
				compact
				prominent
				isEnglish={english}
				dialogTitle={copy.chooseMake}
			/>{/if}
		{#if modelFilter}<HeroFilterDialog
				select={{ ...modelFilter, title: copy.model }}
				bind:selected={modelSelection}
				options={modelOptions}
				mode="multi"
				searchable
				compact
				prominent
				isEnglish={english}
				dialogTitle={copy.chooseModel}
			/>{/if}
		{#if priceFilter}<HeroFilterDialog
				select={{ ...priceFilter, title: copy.price }}
				bind:selected={priceSelection}
				mode="single"
				compact
				prominent
				isEnglish={english}
			/>{/if}
		<HeroFilterDialog
			select={{ ...mileageFilter, title: copy.mileage }}
			bind:selected={mileageSelection}
			mode="single"
			compact
			prominent
			isEnglish={english}
		/>
	{/if}
{/snippet}
<PageIntro {title} titleId="home-title" class="home-hero" vehicleArtwork>
	{#snippet desktopActions()}
		<DesktopDiscoveryPanel class="home-hero__box" compactHeader>
			{#snippet header()}
				<ModeTabs
					surface="light"
					appearance="segmented"
					value={mode}
					onchange={(value) => (modeOverride = value as HomeFiveHeroActionMode | 'finance')}
					idPrefix="home-mode"
					label={copy.chooseService}
					options={[
						{
							value: 'buy',
							label: copy.buy,
							artwork: homeModeArtwork.buy,
							panelId: 'home-entry'
						},
						{
							value: 'finance',
							label: copy.finance,
							artwork: homeModeArtwork.finance,
							panelId: 'home-entry'
						},
						{
							value: 'sell',
							label: copy.sell,
							artwork: homeModeArtwork.sell,
							panelId: 'home-entry'
						},
						{
							value: 'import',
							label: copy.import,
							artwork: homeModeArtwork.import,
							panelId: 'home-entry'
						}
					]}
				/>
			{/snippet}
			<div
				class="home-hero__panel"
				id="home-entry"
				role="tabpanel"
				tabindex="0"
				aria-labelledby={'home-mode-' + mode}
			>
				{#if mode === 'buy'}
					<DesktopSearchControl
						id="home-query"
						class="home-hero__search"
						value={keyword}
						label={copy.search}
						placeholder={copy.searchPlaceholder}
						actionLabel={copy.searchAction}
						href={searchHref}
						expanded={searchOpen}
						onopen={() => (searchOpen = true)}
					/>
					<div class="home-hero__filters">{@render searchFilters(true)}</div>
					<noscript><a href={linkHref(localized('/inventory'))}>{copy.browseAll}</a></noscript>
				{:else if mode === 'finance'}
					<div class="home-hero__finance">
						<p>
							{copy.financeDescription}
						</p>
						<div class="home-hero__intent-actions">
							<Action href={localized('/financing')} size="primary"
								><HandCoins size={20} aria-hidden="true" />{copy.calculatePayment}</Action
							>
							<Action variant="secondary" aria-haspopup="dialog" onclick={() => (searchOpen = true)}
								>{copy.chooseCar}</Action
							>
						</div>
					</div>
				{:else if mode === 'import'}
					<form action={linkHref('/import')} bind:this={importForm} onsubmit={continueImport}>
						{#if english}<input type="hidden" name="lang" value="en" />{/if}
						<input type="hidden" name="intent" value={importIntent} />
						<input type="hidden" name="step" value="details" />
						<DesktopImportEntry
							intent={importIntent}
							bind:vehicle={importVehicle}
							bind:make={importMake}
							bind:model={importModel}
							bind:bodyType={importType}
							locale={english ? 'en' : 'bg'}
							countries={false}
							fieldIds={{ vehicle: 'home-query' }}
							error={importError}
							onIntentChange={setImportIntent}
						/>
					</form>
				{:else}
					<form class="home-hero__intent" action={linkHref(action)}>
						{#if english}<input type="hidden" name="lang" value="en" />{/if}
						<div class="home-hero__intent-row">
							<label class="home-hero__intent-field" for="home-query">
								<span class="sr-only">VIN</span>
								<input id="home-query" type="search" name="vin" placeholder="VIN" />
							</label>
							<Action type="submit" size="compact" variant="strong">{copy.continue}</Action>
						</div>
						<a class="home-hero__intent-link" href={linkHref(localized(action))}>{copy.manualCar}</a
						>
					</form>
				{/if}
			</div>
		</DesktopDiscoveryPanel>
	{/snippet}
</PageIntro>
<VehicleSearchDialog
	bind:open={searchOpen}
	bind:keyword
	{searchParams}
	{english}
	filters={searchFilters}
	onclear={clearSelection}
/>

<style>
	.home-hero__panel {
		display: grid;
		align-content: center;
		gap: var(--bc-space-4);
		min-height: calc(
			var(--bc-desktop-discovery-panel-height) - 2 *
				var(--desktop-discovery-inset, var(--bc-space-5))
		);
	}
	.home-hero__panel:focus-visible {
		outline-offset: 4px !important;
	}
	.home-hero__filters {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.home-hero__intent-row {
		--action-height: var(--bc-control-height-compact);
		--action-text: var(--bc-text-body);
		--action-strong-border: transparent;
		display: flex;
		align-items: center;
		gap: var(--bc-space-1);
		min-height: var(--bc-desktop-search-height);
		padding: var(--bc-space-1);
		border: 1px solid transparent;
		border-radius: var(--bc-desktop-control-radius);
		background: var(--bc-control);
	}
	.home-hero__intent-row:hover {
		background: var(--bc-control-hover);
	}
	.home-hero__intent-row :global(.site-action) {
		padding-inline: var(--bc-space-3);
	}
	.home-hero__intent-row:has(input:focus-visible) {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.home-hero__intent-field {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		min-height: calc(var(--bc-desktop-search-height) - 2 * var(--bc-space-1) - 2px);
		padding: 0 var(--bc-space-3);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-ink);
		font-size: var(--bc-text-entry);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		text-align: left;
	}
	.home-hero__intent-field input {
		flex: 1;
		min-width: 0;
		min-height: calc(var(--bc-desktop-search-height) - 2 * var(--bc-space-1) - 2px);
		padding: 0;
		background: transparent;
		border: 0;
		color: var(--bc-ink);
		font: inherit;
	}
	.home-hero__intent-field input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	.home-hero__intent {
		display: grid;
		gap: var(--bc-space-4);
	}
	.home-hero__intent-link {
		justify-self: center;
		display: inline-flex;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		color: var(--desktop-discovery-copy, var(--bc-copy));
		font-size: var(--bc-text-filter);
		text-underline-offset: 4px;
	}
	.home-hero__finance {
		display: grid;
		gap: var(--bc-space-4);
		justify-items: center;
		text-align: center;
	}
	.home-hero__finance p {
		margin: 0;
		font-size: var(--bc-text-body-lg);
		color: var(--desktop-discovery-copy, var(--bc-copy));
	}
	.home-hero__intent-actions {
		display: flex;
		gap: var(--bc-space-3);
		flex-wrap: wrap;
		justify-content: center;
	}
	@media (min-width: 768px) {
		:global(.home-hero__box) {
			--mode-tab-font-size: var(--bc-text-body);
		}
		.home-hero__panel {
			min-height: 0;
			align-content: start;
		}
	}
	@media (max-width: 900px) {
		.home-hero__filters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
