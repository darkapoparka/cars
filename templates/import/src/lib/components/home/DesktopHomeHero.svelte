<script lang="ts">
	import type {
		HomeFiveHeroData,
		HomeFiveHeroActionMode,
		HomeFiveHeroSelect
	} from '$lib/auxero/home-five';
	import Search from '@lucide/svelte/icons/search';
	import CarFront from '@lucide/svelte/icons/car-front';
	import HandCoins from '@lucide/svelte/icons/hand-coins';
	import Tag from '@lucide/svelte/icons/tag';
	import Ship from '@lucide/svelte/icons/ship';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import Banknote from '@lucide/svelte/icons/banknote';
	import Gauge from '@lucide/svelte/icons/gauge';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import VehicleSearchDialog from '$lib/components/inventory/VehicleSearchDialog.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import HeroFilterDialog from './HeroFilterDialog.svelte';
	import DesktopSearchControl from '$lib/components/common/DesktopSearchControl.svelte';
	import DesktopDiscoveryPanel from '$lib/components/common/DesktopDiscoveryPanel.svelte';
	import { linkHref } from '$lib/utils/links';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import { homeHeroModes, desktopHomeCopy } from '$lib/content/home-discovery';
	let {
		hero,
		english = false,
		discoveryLinks
	}: {
		hero: HomeFiveHeroData;
		english?: boolean;
		discoveryLinks: { label: string; href: string }[];
	} = $props();
	const copy = $derived(desktopHomeCopy[english ? 'en' : 'bg']);
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

{#snippet searchFilters()}
	{#if brandFilter}<HeroFilterDialog
			select={{ ...brandFilter, title: copy.make }}
			bind:selected={() => brandSelection, updateBrandSelection}
			mode="multi"
			variant="grid"
			searchable
			compact
			prominent
			icon={LayoutGrid}
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
			icon={CarFront}
			isEnglish={english}
			dialogTitle={copy.chooseModel}
		/>{/if}
	{#if priceFilter}<HeroFilterDialog
			select={{ ...priceFilter, title: copy.price }}
			bind:selected={priceSelection}
			mode="single"
			compact
			prominent
			icon={Banknote}
			isEnglish={english}
		/>{/if}
	<HeroFilterDialog
		select={{ ...mileageFilter, title: copy.mileage }}
		bind:selected={mileageSelection}
		mode="single"
		compact
		prominent
		icon={Gauge}
		isEnglish={english}
	/>
{/snippet}
<PageIntro {title} titleId="home-title" class="home-hero" vehicleArtwork>
	{#snippet desktopActions()}
		<DesktopDiscoveryPanel class="home-hero__box">
			{#snippet header()}
				<ModeTabs
					surface="dark"
					appearance="segmented"
					value={mode}
					onchange={(value) => (modeOverride = value as HomeFiveHeroActionMode | 'finance')}
					idPrefix="home-mode"
					label={copy.chooseService}
					options={[
						{
							value: 'buy',
							label: copy.buy,
							icon: CarFront,
							panelId: 'home-entry'
						},
						{
							value: 'finance',
							label: copy.finance,
							icon: HandCoins,
							panelId: 'home-entry'
						},
						{ value: 'sell', label: copy.sell, icon: Tag, panelId: 'home-entry' },
						{
							value: 'import',
							label: copy.import,
							icon: Ship,
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
						actionLabel={copy.searchAction}
						href={searchHref}
						expanded={searchOpen}
						onopen={() => (searchOpen = true)}
					/>
					<div class="home-hero__filters">{@render searchFilters()}</div>
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
				{:else}
					<form class="home-hero__intent" action={linkHref(action)}>
						{#if english}<input type="hidden" name="lang" value="en" />{/if}
						<div class="home-hero__intent-row">
							<label class="home-hero__intent-field" for="home-query">
								<Search size={21} aria-hidden="true" /><span class="sr-only"
									>{mode === 'import' ? 'LINK / VIN' : 'VIN'}</span
								>
								<input
									id="home-query"
									type="search"
									name={mode === 'import' ? 'vehicle' : 'vin'}
									placeholder={mode === 'import' ? 'LINK / VIN' : 'VIN'}
								/>
							</label>
							<Action type="submit" size="primary">{copy.continue}</Action>
						</div>
						<a class="home-hero__intent-link" href={linkHref(localized(action))}
							>{mode === 'import' ? copy.withoutListing : copy.manualCar}</a
						>
					</form>
				{/if}
			</div>
		</DesktopDiscoveryPanel>
	{/snippet}
	{#snippet desktopSecondaryActions()}
		<nav class="home-quick-links" aria-label={copy.quickSearch}>
			{#each discoveryLinks as link (link.href)}<Action
					href={link.href}
					variant="glass"
					size="compact">{link.label}</Action
				>{/each}
		</nav>
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
		min-height: calc(var(--bc-desktop-discovery-panel-height) - 2 * var(--bc-space-5));
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
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--bc-space-3);
	}
	.home-hero__intent-field {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-width: 0;
		min-height: var(--bc-control-height-primary);
		padding: 0 var(--bc-space-4);
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: var(--bc-text-search-trigger);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-search);
		text-align: left;
	}
	.home-hero__intent-field input {
		flex: 1;
		min-width: 0;
		min-height: var(--bc-control-height-primary);
		padding: 0;
		background: transparent;
		border: 0;
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
	}
	.home-hero__intent-field:focus-within {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.home-hero__intent-field input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	.home-hero__intent {
		display: grid;
		gap: var(--bc-space-3);
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
	.home-quick-links {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.home-quick-links :global(.site-action) {
		border-radius: var(--bc-radius-pill);
	}
	@media (max-width: 900px) {
		.home-hero__filters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
