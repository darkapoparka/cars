<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
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
	import { linkHref } from '$lib/utils/links';
	let { hero, english = false }: { hero: HomeFiveHeroData; english?: boolean } = $props();
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
		title: english ? 'Mileage up to' : 'Пробег до',
		defaultLabel: english ? 'Any mileage' : 'Без ограничение',
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
	const title = $derived(
		mode === 'finance'
			? english
				? 'Finance a car'
				: 'Автомобил на лизинг'
			: mode === 'import'
				? english
					? 'Import a car'
					: 'Внеси автомобил'
				: mode === 'sell'
					? english
						? 'Sell your car'
						: 'Продай автомобил'
					: english
						? 'Buy a car'
						: 'Купи автомобил'
	);
	const action = $derived(
		mode === 'import' ? '/import' : mode === 'sell' ? '/sell-your-car' : '/inventory'
	);

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
	function clearSelection() {
		brandSelection = [];
		modelSelection = [];
		priceSelection = [];
		mileageSelection = [];
	}
</script>

{#snippet searchFilters()}
	{#if brandFilter}<HeroFilterDialog
			select={{ ...brandFilter, title: english ? 'Make' : 'Марка' }}
			bind:selected={() => brandSelection, updateBrandSelection}
			mode="multi"
			variant="grid"
			searchable
			compact
			icon={LayoutGrid}
			isEnglish={english}
			dialogTitle={english ? 'Choose make' : 'Избери марка'}
		/>{/if}
	{#if modelFilter}<HeroFilterDialog
			select={{ ...modelFilter, title: english ? 'Model' : 'Модел' }}
			bind:selected={modelSelection}
			options={modelOptions}
			mode="multi"
			searchable
			compact
			icon={CarFront}
			isEnglish={english}
			dialogTitle={english ? 'Choose model' : 'Избери модел'}
		/>{/if}
	{#if priceFilter}<HeroFilterDialog
			select={{ ...priceFilter, title: english ? 'Price' : 'Цена' }}
			bind:selected={priceSelection}
			mode="single"
			compact
			icon={Banknote}
			isEnglish={english}
		/>{/if}
	<HeroFilterDialog
		select={{ ...mileageFilter, title: english ? 'Mileage' : 'Пробег' }}
		bind:selected={mileageSelection}
		mode="single"
		compact
		icon={Gauge}
		isEnglish={english}
	/>
{/snippet}
<section class="home-hero" aria-labelledby="home-title">
	<div class="site-container">
		<div class="home-hero__heading">
			<img
				src={assetHref('/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp')}
				alt=""
				width="420"
				height="220"
			/>
			<h1 id="home-title">{title}</h1>
			<img
				src={assetHref('/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp')}
				alt=""
				width="420"
				height="220"
			/>
		</div>
		<div class="home-hero__box">
			<ModeTabs
				surface="dark"
				appearance="attached"
				value={mode}
				onchange={(value) => (modeOverride = value as HomeFiveHeroActionMode | 'finance')}
				idPrefix="home-mode"
				label={english ? 'Choose a service' : 'Избери услуга'}
				options={[
					{ value: 'buy', label: english ? 'Buy' : 'Купи', icon: CarFront, panelId: 'home-entry' },
					{
						value: 'finance',
						label: english ? 'Finance' : 'Лизинг',
						icon: HandCoins,
						panelId: 'home-entry'
					},
					{ value: 'sell', label: english ? 'Sell' : 'Продай', icon: Tag, panelId: 'home-entry' },
					{ value: 'import', label: english ? 'Import' : 'Внос', icon: Ship, panelId: 'home-entry' }
				]}
			/>
			<div
				class="home-hero__panel"
				id="home-entry"
				role="tabpanel"
				tabindex="0"
				aria-labelledby={'home-mode-' + mode}
			>
				{#if mode === 'buy'}
					<div class="home-hero__filters">{@render searchFilters()}</div>
					<div class="home-hero__search">
						<button
							id="home-query"
							class="home-hero__search-trigger"
							type="button"
							aria-haspopup="dialog"
							aria-expanded={searchOpen}
							onclick={() => (searchOpen = true)}
							><Search size={21} aria-hidden="true" />
							<span
								>{keyword ||
									(english ? 'Make, model or keyword' : 'Марка, модел или ключова дума')}</span
							>
						</button>
						<Action
							size="primary"
							aria-haspopup="dialog"
							aria-expanded={searchOpen}
							onclick={() => (searchOpen = true)}
						>
							<Search size={19} aria-hidden="true" />{english ? 'Search' : 'Търси'}
						</Action>
					</div>
					<noscript
						><a href={linkHref(localized('/inventory'))}
							>{english ? 'Browse all cars' : 'Разгледай всички автомобили'}</a
						></noscript
					>
				{:else if mode === 'finance'}
					<div class="home-hero__finance">
						<p>
							{english
								? 'Calculate a monthly payment for your next car.'
								: 'Изчисли месечна вноска за следващия си автомобил.'}
						</p>
						<div class="home-hero__intent-actions">
							<Action href={localized('/financing')} size="primary"
								><HandCoins size={20} aria-hidden="true" />{english
									? 'Calculate payment'
									: 'Изчисли вноска'}</Action
							>
							<Action variant="secondary" aria-haspopup="dialog" onclick={() => (searchOpen = true)}
								>{english ? 'Choose a car' : 'Избери автомобил'}</Action
							>
						</div>
					</div>
				{:else}
					<form class="home-hero__intent" action={linkHref(action)}>
						{#if english}<input type="hidden" name="lang" value="en" />{/if}
						<div class="home-hero__search">
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
							<Action type="submit" size="primary">{english ? 'Continue' : 'Продължи'}</Action>
						</div>
						<a class="home-hero__intent-link" href={linkHref(localized(action))}
							>{mode === 'import'
								? english
									? 'Find a car without a listing'
									: 'Нямам линк — търся автомобил'
								: english
									? 'Enter make and model instead'
									: 'Въведи марка и модел вместо VIN'}</a
						>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
<VehicleSearchDialog
	bind:open={searchOpen}
	bind:keyword
	{searchParams}
	{english}
	filters={searchFilters}
	onclear={clearSelection}
/>

<style>
	.home-hero {
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
		padding: var(--bc-space-6) 0 var(--bc-space-8);
	}
	.home-hero__heading {
		display: grid;
		grid-template-columns: 260px minmax(0, 1fr) 260px;
		align-items: center;
		gap: var(--bc-space-5);
		padding-bottom: var(--bc-space-6);
	}
	.home-hero__heading img {
		width: 100%;
		height: 130px;
		object-fit: contain;
	}
	h1 {
		margin: 0;
		font: var(--bc-weight-heading) clamp(2.5rem, 4vw, 3.5rem)/1.1 var(--bc-font-heading);
		text-align: center;
	}
	.home-hero__box {
		max-width: 1100px;
		margin-inline: auto;
	}
	.home-hero__box :global(.mobile-mode-tabs) {
		margin-inline: var(--bc-space-6);
	}
	.home-hero__panel {
		display: grid;
		align-content: center;
		gap: var(--bc-space-4);
		min-height: 156px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		padding: var(--bc-space-5);
		color: var(--bc-ink);
		background: var(--bc-surface-raised);
	}
	.home-hero__panel:focus-visible {
		outline-offset: 4px !important;
	}
	.home-hero__filters {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.home-hero__search {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--bc-space-3);
	}
	.home-hero__search-trigger,
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
		color: var(--bc-copy);
		font-size: var(--bc-text-filter);
		font-weight: var(--bc-weight-control);
		text-align: left;
	}
	.home-hero__search-trigger span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.home-hero__search-trigger:hover {
		background: var(--bc-surface);
		border-color: var(--bc-muted);
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
		color: var(--bc-copy);
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
		color: var(--bc-copy);
	}
	.home-hero__intent-actions {
		display: flex;
		gap: var(--bc-space-3);
		flex-wrap: wrap;
		justify-content: center;
	}
	@media (max-width: 1100px) {
		.home-hero__heading {
			grid-template-columns: 180px minmax(0, 1fr) 180px;
		}
	}
	@media (max-width: 900px) {
		.home-hero__filters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
