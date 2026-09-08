<script lang="ts">
	import {
		ArrowRight,
		Check,
		ChevronLeft,
		ChevronRight,
		MapPinned,
		MapPin,
		Navigation,
		Phone,
		PhoneCall,
		GitCompare,
		Heart,
		Search,
		Settings2,
		X
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { shortFuel } from '$lib/utils/format';
	import type { HomeMobileData } from '$lib/types/home';
	import MobileDrawer from '$lib/components/shared/mobile/MobileDrawer.svelte';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileBottomDock from './MobileBottomDock.svelte';
	import {
		enhanceDayNightImageFallbacks,
		daynightImageFallback
	} from '$lib/utils/daynight-image-fallback';
	import { onMount } from 'svelte';
	import { getOptionalGarageContext } from '$lib/state/garage.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import {
		bodyChipIconFor,
		bodyLabel,
		bodyPhoto,
		brandLogos,
		brandMark,
		footerSocialLinks,
		type BodyChipIcon,
		type FooterSocialIcon
	} from './mobile-home-data';

	let {
		data,
		heroToggle = 'underline',
		heroBox = false
	}: {
		data: HomeMobileData;
		heroToggle?: 'underline' | 'segmented';
		heroBox?: boolean;
	} = $props();

	const inventoryPath = '/inventory' as const;
	const importRequestPath = '/contact' as const;
	const inventoryHref = resolve(inventoryPath);
	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const mapHref = daynightSite.mapUrl;

	type InventoryHref = typeof inventoryPath | `${typeof inventoryPath}?${string}`;
	type ImportLeadHref = typeof importRequestPath | `${typeof importRequestPath}?${string}`;

	const bodyTiles = $derived(data.bodyTiles.slice(0, 6));
	const budgetTiles = $derived(data.budgetTiles.slice(0, 6));
	const mobileBrandCatalog = [
		{ brand: 'BMW', label: 'BMW' },
		{ brand: 'Mercedes-Benz', label: 'Mercedes' },
		{ brand: 'Audi', label: 'Audi' },
		{ brand: 'Porsche', label: 'Porsche' },
		{ brand: 'Mazda', label: 'Mazda' },
		{ brand: 'Honda', label: 'Honda' },
		{ brand: 'Toyota', label: 'Toyota' },
		{ brand: 'Volvo', label: 'Volvo' },
		{ brand: 'Ford', label: 'Ford' },
		{ brand: 'Hyundai', label: 'Hyundai' },
		{ brand: 'Tesla', label: 'Tesla' }
	] as const;
	const brandTiles = $derived.by(() => {
		const countByBrand = new Map(data.brandTiles.map((tile) => [tile.brand, tile.count]));

		return mobileBrandCatalog.map((tile) => ({
			...tile,
			count: countByBrand.get(tile.brand) ?? 0
		}));
	});
	const featuredCars = $derived(data.featuredCars.slice(0, 4));
	const total = $derived(data.total);
	const garage = getOptionalGarageContext();

	const popularBrands = $derived(data.brands.slice(0, 6));
	const bodyChips = $derived(data.bodyTypes.slice(0, 6));

	type HeroMode = 'buy' | 'import';
	type QuickFilterIcon = 'car-line' | typeof Settings2;
	type QuickFilter = {
		label: string;
		icon: QuickFilterIcon;
		href: InventoryHref;
	};

	let heroMode = $state<HeroMode>('buy');
	let searchOpen = $state(false);
	let locationOpen = $state(false);
	let query = $state('');
	// The buy overlay stacks: 'main' (quick chips) → a facet drill-in with the
	// full searchable brand/model/body list. facetQuery is the in-facet search.
	let searchView = $state<'main' | 'brand' | 'model' | 'body'>('main');
	let facetQuery = $state('');
	let selectedBrands = $state<string[]>([]);
	let selectedModels = $state<string[]>([]);
	let selectedBodies = $state<string[]>([]);
	let importQuery = $state('');
	let importMake = $state('');
	let importModel = $state('');
	let importYear = $state('');
	let importBudget = $state('');
	let importSourceUrl = $state('');
	let importPhone = $state('');

	onMount(() => enhanceDayNightImageFallbacks());

	const modelChips = $derived.by(() => {
		const matchingModels = data.modelOptions.filter(
			(option) =>
				!selectedBrands.length || option.brands.some((brand) => selectedBrands.includes(brand))
		);
		const selected = matchingModels.filter((option) => selectedModels.includes(option.model));
		const remaining = matchingModels.filter((option) => !selectedModels.includes(option.model));

		return [...selected, ...remaining].slice(0, selectedBrands.length ? 10 : 8);
	});

	// Full lists for the facet drill-in (everything, not just the popular chips).
	const facetNormalize = (value: string) => value.toLocaleLowerCase('bg-BG').trim();

	const allModelOptions = $derived(
		data.modelOptions.filter(
			(option) =>
				!selectedBrands.length || option.brands.some((brand) => selectedBrands.includes(brand))
		)
	);

	const facetBrandList = $derived.by(() => {
		const needle = facetNormalize(facetQuery);
		const list = needle
			? data.brands.filter((brand) => facetNormalize(brand).includes(needle))
			: data.brands;
		return [...list].sort(
			(left, right) =>
				Number(selectedBrands.includes(right)) - Number(selectedBrands.includes(left))
		);
	});

	const facetModelList = $derived.by(() => {
		const needle = facetNormalize(facetQuery);
		const list = needle
			? allModelOptions.filter((option) => facetNormalize(option.model).includes(needle))
			: allModelOptions;
		return [...list].sort(
			(left, right) =>
				Number(selectedModels.includes(right.model)) - Number(selectedModels.includes(left.model))
		);
	});

	const facetTitle = $derived(
		searchView === 'brand' ? 'Марка' : searchView === 'model' ? 'Модел' : 'Каросерия'
	);

	function openFacet(view: 'brand' | 'model' | 'body') {
		searchView = view;
		facetQuery = '';
	}

	function backToMain() {
		searchView = 'main';
		facetQuery = '';
	}

	function resetSearchSheet() {
		backToMain();
	}

	function openSearch() {
		resetSearchSheet();
		searchOpen = true;
	}

	function closeSearch() {
		searchOpen = false;
		resetSearchSheet();
	}

	function submitSearch() {
		closeSearch();
		void goto(resolve(searchHref));
	}

	const searchHref = $derived.by((): InventoryHref => {
		const params = new SvelteURLSearchParams();
		if (query.trim()) params.set('q', query.trim());
		appendParams(params, 'brand', selectedBrands);
		appendParams(params, 'model', selectedModels);
		appendParams(params, 'body', selectedBodies);
		const qs = params.toString();
		return qs ? `${inventoryPath}?${qs}` : inventoryPath;
	});

	const importLeadHref = $derived.by((): ImportLeadHref => {
		const params = new SvelteURLSearchParams();
		params.set('intent', 'import');
		if (importQuery.trim()) params.set('q', importQuery.trim());
		if (importMake.trim()) params.set('make', importMake.trim());
		if (importModel.trim()) params.set('model', importModel.trim());
		if (importYear.trim()) params.set('year', importYear.trim());
		if (importBudget.trim()) params.set('budget', importBudget.trim());
		if (importSourceUrl.trim()) params.set('sourceUrl', importSourceUrl.trim());
		if (importPhone.trim()) params.set('phone', importPhone.trim());
		const qs = params.toString();
		return `${importRequestPath}?${qs}`;
	});

	const brandHref = (brand: string): InventoryHref =>
		`${inventoryPath}?brand=${encodeURIComponent(brand)}`;
	const bodyHref = (body: string): InventoryHref =>
		`${inventoryPath}?body=${encodeURIComponent(body)}`;
	const budgetHref = (budget: string): InventoryHref =>
		`${inventoryPath}?price=${encodeURIComponent(budget)}`;
	const budgetCardHref = (budget: string) =>
		budget === 'all' ? inventoryPath : budgetHref(budget);
	const brandCountLabel = (count: number) =>
		count > 0 ? `${count} ${count === 1 ? 'автомобил' : 'автомобила'}` : 'Внос по заявка';
	function appendParams(params: URLSearchParams, name: string, values: string[]) {
		for (const value of values) {
			if (value) params.append(name, value);
		}
	}

	function toggleValue(values: string[], value: string) {
		return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
	}

	function pruneModelsForBrands() {
		if (!selectedBrands.length || !selectedModels.length) return;

		const validModels = new Set(
			data.modelOptions
				.filter((option) => option.brands.some((brand) => selectedBrands.includes(brand)))
				.map((option) => option.model)
		);
		selectedModels = selectedModels.filter((model) => validModels.has(model));
	}

	function toggleBrand(brand: string) {
		selectedBrands = toggleValue(selectedBrands, brand);
		pruneModelsForBrands();
	}

	function toggleModel(model: string) {
		selectedModels = toggleValue(selectedModels, model);
	}

	function toggleBody(body: string) {
		selectedBodies = toggleValue(selectedBodies, body);
	}

	const quickFilters: QuickFilter[] = [
		{
			label: 'Електрически',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Електрически')}`
		},
		{
			label: 'Дизел',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Дизел')}`
		},
		{
			label: 'Бензин',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Бензин')}`
		},
		{
			label: 'Автоматик',
			icon: Settings2,
			href: `${inventoryPath}?transmission=${encodeURIComponent('Автоматик')}`
		}
	];
</script>

{#snippet quickCarIcon()}
	<svg
		class="mh-quick__car-icon"
		aria-hidden="true"
		width="32"
		height="16"
		viewBox="0 0 76 36"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M13 23H8.5C6.6 23 5 21.4 5 19.5V17.6C5 15.9 6.2 14.4 7.9 14.1L17.7 12.3L24.2 6.7C25.5 5.6 27.1 5 28.8 5H45.5C47.7 5 49.8 6 51.1 7.8L55.3 13.4L66.3 15.8C69 16.4 71 18.8 71 21.6V23H64"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M25 23H52" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
		<path
			d="M22.5 28.5C25.54 28.5 28 26.04 28 23C28 19.96 25.54 17.5 22.5 17.5C19.46 17.5 17 19.96 17 23C17 26.04 19.46 28.5 22.5 28.5Z"
			stroke="currentColor"
			stroke-width="3"
		/>
		<path
			d="M58.5 28.5C61.54 28.5 64 26.04 64 23C64 19.96 61.54 17.5 58.5 17.5C55.46 17.5 53 19.96 53 23C53 26.04 55.46 28.5 58.5 28.5Z"
			stroke="currentColor"
			stroke-width="3"
		/>
		<path d="M25 13H48" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet bodyTypeChipIcon(kind: BodyChipIcon)}
	<svg
		class="mh-chip__body-icon"
		aria-hidden="true"
		width="41"
		height="18"
		viewBox="0 0 41 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{#if kind === 'sedan'}
			<path
				d="M8.886 17.277a3.226 3.226 0 1 0 0-6.452 3.226 3.226 0 0 0 0 6.452Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M31.468 17.277a3.226 3.226 0 1 0 0-6.452 3.226 3.226 0 0 0 0 6.452Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12.113 14.05h16.13M34.694 14.048H40.5V9.532c-2.968-2.064-6.452-3.225-10.064-3.225h-.904L25.79 1.532A2.64 2.64 0 0 0 23.726.5H10.694c-.258 0-.646.129-.904.258L5.661 4.371H3.081c-.775 0-1.291.516-1.291 1.29v3.872L.5 10.823v1.935l5.161 1.29"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M29.531 6.306H12.112l-2.581-1.29v-1.29L13.402.5M17.922.5v5.806"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else if kind === 'suv'}
			<path
				d="M29.662 14.694H11.984M35.855 14.694h1.419l3.226-1.29V8.242L30.177 5.661l-3.613-3.612A5.12 5.12 0 0 0 22.952.5H7.597C4.758 1.79 2.306 3.984 1.016 6.952L.5 8.242v4.516l4.516 1.936h.774"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10.823.5 8.242 4.371l1.29 1.29h20.646M8.886 17.274a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451ZM32.757 17.274a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.596.5 4.37 5.661H1.789M19.211 5.661V.5"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else if kind === 'wagon'}
			<path
				d="M10.824 17.274a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451ZM33.402 17.274a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.597 14.048H1.79L.5 12.758V5.661h12.903V.5h10.71c.645 0 1.161.258 1.548.516l5.807 4.645 7.87 1.162c.646.129 1.162.645 1.162 1.29v4.645c0 .774-.516 1.29-1.29 1.29h-2.581M30.176 14.048H14.047M21.145.5v5.661"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else if kind === 'hatchback'}
			<path
				d="M7.597 17.037a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451ZM32.113 17.037a3.226 3.226 0 1 0 0-6.451 3.226 3.226 0 0 0 0 6.451Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.629.908v3.871M30.824 6.07l-20-.646-3.871-1.29 2.581-3.226M4.371 13.812.5 13.167V9.94l1.29-1.29-.645-1.936 4.516-5.16L4.371.908 14.565.522C20.5.264 26.306 2.328 30.823 6.07c0 0 6.193.645 9.677 3.226v5.16h-5.161M10.824 13.812h18.065"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else if kind === 'coupe'}
			<path
				d="M9.53 14.694a3.226 3.226 0 1 0 0-6.452 3.226 3.226 0 0 0 0 6.452ZM32.757 14.694a3.226 3.226 0 1 0 0-6.452 3.226 3.226 0 0 0 0 6.452Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.306 11.468.5 10.178V6.952l1.29-.645L.5 4.37S5.92.5 12.113.5h11.484c.516 0 1.032.129 1.419.387l5.161 3.484s6.323.387 10.323 1.29l-.645 1.29.645 1.29v2.581l-4.516.645M12.758 11.468h16.774M30.178 4.371H10.823l-2.58-.645A8.047 8.047 0 0 1 11.726.887L12.758.5"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else}
			<path
				d="M8.1 17a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM32.2 17a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M11.2 14h18M35.3 14h3.4c.7 0 1.3-.6 1.3-1.3V7.4c0-.6-.4-1.1-1-1.2L30.6 5 26 1.2C25.6.8 25.1.6 24.5.6H8.9C7.7.6 6.6 1.1 5.8 2L1.5 6.8v5.5L5 14M14.2.8v5.4h16.4"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}
	</svg>
{/snippet}

<div class="mobile-home" aria-label="Day Night Auto — начало">
	<header class="mh-hero">
		<div class="mh-hero__bar">
			<a class="mh-hero__brand" href={resolve('/')} aria-label="Day Night Auto home">
				<img
					class="mh-hero__logo"
					src={resolve('/brand/daynight-logo-generated.png')}
					alt={daynightSite.shortName}
				/>
			</a>
			<div class="mh-hero__bar-actions">
				<button
					class="mh-hero__bar-action"
					type="button"
					aria-label="Локация: Индустриална зона, София"
					onclick={() => (locationOpen = true)}
				>
					<MapPinned size={19} strokeWidth={2.2} aria-hidden="true" />
				</button>
				<a
					class="mh-hero__bar-action mh-hero__bar-action--call"
					href={phoneHref}
					aria-label="Обади се на Day Night Auto"
				>
					<Phone size={19} strokeWidth={2.35} aria-hidden="true" />
				</a>
			</div>
		</div>

		<h1 class="mh-hero__title">Day Night Auto</h1>

		<div class={`mh-hero__box${heroBox ? ' mh-hero__box--card' : ''}`}>
			<div
				class={`mh-hero__modes${heroToggle === 'segmented' ? ' mh-hero__modes--segmented' : ''}`}
				aria-label="Избери действие"
			>
				<button
					type="button"
					class={heroMode === 'buy' ? 'is-active' : ''}
					aria-pressed={heroMode === 'buy'}
					onclick={() => (heroMode = 'buy')}
				>
					Купи
				</button>
				<button
					type="button"
					class={heroMode === 'import' ? 'is-active' : ''}
					aria-pressed={heroMode === 'import'}
					onclick={() => (heroMode = 'import')}
				>
					Внос
				</button>
			</div>
			<button class="mh-hero__search" type="button" onclick={openSearch}>
				<span class="mh-hero__search-label">
					{heroMode === 'buy' ? 'Търси марка, модел, цена…' : 'Какъв автомобил търсиш?'}
				</span>
				<span class="mh-hero__search-go" aria-hidden="true">
					{#if heroMode === 'buy'}
						<Search size={20} strokeWidth={2.5} />
					{:else}
						<ChevronRight size={22} strokeWidth={2.7} />
					{/if}
				</span>
			</button>
			{#if heroMode === 'buy'}
				<a class="mh-hero__all" href={inventoryHref}>
					<span>Всички {total} коли</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</a>
			{:else}
				<button class="mh-hero__all" type="button" onclick={openSearch}>
					<span>Заяви внос</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</button>
			{/if}
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<nav class="mh-quick" aria-label="Бързи филтри">
			{#each quickFilters as item (item.label)}
				<a class="mh-quick__pill" href={resolve(item.href)}>
					{#if item.icon === 'car-line'}
						{@render quickCarIcon()}
					{:else}
						{@const Icon = item.icon}
						<Icon size={16} strokeWidth={2.2} aria-hidden="true" />
					{/if}
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<section class="mh-section mh-section--budget" aria-labelledby="mh-budget-title">
			<div class="mh-section__head">
				<h2 id="mh-budget-title">По цена</h2>
				<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
			</div>
			<div class="mh-budget-grid">
				{#each budgetTiles as tile (tile.value)}
					<a
						class={`mh-budget-card${tile.variant === 'open' ? ' mh-budget-card--open' : ''}`}
						href={resolve(budgetCardHref(tile.value))}
					>
						<span class="mh-budget-card__media">
							<img
								src={tile.image}
								alt=""
								loading="lazy"
								decoding="async"
								data-daynight-image-fallback
								use:daynightImageFallback
							/>
						</span>
						<span class="mh-budget-card__copy">
							<strong>{tile.label}</strong>
							<span>{tile.caption ?? `${tile.count} коли`}</span>
						</span>
					</a>
				{/each}
			</div>
		</section>

		<section class="mh-section mh-section--featured" aria-labelledby="mh-featured-title">
			<div class="mh-section__head">
				<h2 id="mh-featured-title">Избрани</h2>
				<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
			</div>
			<div class="mh-carlist">
				{#each featuredCars as car (car.slug)}
					{@const isFavorite = garage.isFavorite(car.slug)}
					{@const isCompared = garage.isCompared(car.slug)}
					<article class="mh-car">
						<a class="mh-car__link" href={resolve('/inventory/[slug]', { slug: car.slug })}>
							<span class="mh-car__media">
								<img
									src={car.image}
									alt={car.shortTitle}
									loading="lazy"
									decoding="async"
									data-daynight-image-fallback
									use:daynightImageFallback
								/>
								{#if car.badges[0]}
									<span class="mh-car__badge">{car.badges[0]}</span>
								{/if}
							</span>
							<span class="mh-car__copy">
								<span class="mh-car__brand">{car.brand}</span>
								<strong class="mh-car__title">{car.model}</strong>
								<span class="mh-car__meta">{car.year} · {shortFuel(car.fuel)} · {car.mileage}</span>
							</span>
							<span class="mh-car__foot">
								<span class="mh-car__price">{car.priceEur}</span>
								<span class="mh-car__go" aria-hidden="true">
									<ChevronRight size={18} strokeWidth={3} />
								</span>
							</span>
						</a>
						<div class="mh-car__tools" aria-label="Действия за автомобила">
							<button
								type="button"
								class:is-active={isCompared}
								aria-pressed={isCompared}
								aria-label={isCompared
									? `Премахни ${car.shortTitle} от сравнение`
									: `Добави ${car.shortTitle} за сравнение`}
								onclick={() => garage.toggleCompare(car.slug)}
							>
								<GitCompare size={17} strokeWidth={2.25} />
							</button>
							<button
								type="button"
								class:is-active={isFavorite}
								aria-pressed={isFavorite}
								aria-label={isFavorite
									? `Премахни ${car.shortTitle} от любими`
									: `Добави ${car.shortTitle} в любими`}
								onclick={() => garage.toggleFavorite(car.slug)}
							>
								<Heart size={17} strokeWidth={2.25} />
							</button>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="mh-section mh-section--brands" aria-labelledby="mh-brand-title">
			<div class="mh-section__head">
				<h2 id="mh-brand-title">Марки</h2>
				<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
			</div>
			<div class="mh-brand-grid">
				{#each brandTiles as tile (tile.brand)}
					<a class="mh-brandcard" data-brand={tile.brand} href={resolve(brandHref(tile.brand))}>
						<span class="mh-brandcard__icon">
							{#if brandLogos[tile.brand]}
								<img
									class="mh-brandcard__logo"
									src={brandLogos[tile.brand]}
									alt=""
									loading="lazy"
								/>
							{:else}
								<span class="mh-brandcard__mark" aria-hidden="true">{brandMark(tile.brand)}</span>
							{/if}
						</span>
						<span class="mh-brandcard__copy">
							<span class="mh-brandcard__name">{tile.label}</span>
							<span class="mh-brandcard__count">{brandCountLabel(tile.count)}</span>
						</span>
					</a>
				{/each}
				<a class="mh-brandcard mh-brandcard--all" href={inventoryHref}>
					<span class="mh-brandcard__all-icon" aria-hidden="true">
						<ArrowRight size={22} strokeWidth={2} />
					</span>
					<span class="mh-brandcard__name">Всички марки</span>
				</a>
			</div>
		</section>

		<section class="mh-section" aria-labelledby="mh-type-title">
			<div class="mh-section__head">
				<h2 id="mh-type-title">По тип</h2>
				<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
			</div>
			<div class="mh-rail mh-rail--cat">
				{#each bodyTiles as tile (tile.body)}
					<a class="mh-cat" href={resolve(bodyHref(tile.body))}>
						<span class="mh-cat__media">
							<img class="mh-cat__image" src={bodyPhoto(tile.body)} alt="" loading="lazy" />
						</span>
						<span class="mh-cat__foot">
							<span class="mh-cat__label">{bodyLabel(tile.body)}</span>
							<span class="mh-cat__count">{tile.count} коли</span>
						</span>
					</a>
				{/each}
			</div>
		</section>

		<section class="mh-cta-wrap" aria-label="Призив за действие">
			<div class="mh-cta">
				<div class="mh-cta__copy">
					<strong>{total} обяви · Оглед в София</strong>
					<span>Финансиране · бартер · съдействие с документите</span>
				</div>
				<div class="mh-cta__actions">
					<a class="is-browse" href={inventoryHref}>Всички автомобили</a>
					<a class="is-call" href={phoneHref}>Обади се</a>
				</div>
			</div>
			<div class="mh-trust">
				<span>Проверени коли</span>
				<span>В София</span>
				<span>Гаранция</span>
			</div>
		</section>
	</main>

	<footer class="mh-footer">
		<div class="mh-footer__brand">
			<img
				class="mh-footer__logo"
				src={resolve('/brand/daynight-logo-generated.png')}
				alt={daynightSite.name}
			/>
			<p>
				Автокъща в София с подбрани употребявани автомобили. Съдействие за документи, регистрация,
				финансиране и доставка.
			</p>
		</div>
		<nav class="mh-footer__social" aria-label="Социални канали и обяви">
			{#snippet footerSocialIcon(icon: FooterSocialIcon)}
				{#if icon === 'facebook'}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path
							d="M11.4 18.75V10.63H14.13L14.54 7.46H11.4V5.43C11.4 4.51 11.66 3.88 12.98 3.88H14.66V1.04C14.36 1 13.36 0.92 12.2 0.92C9.78 0.92 8.13 2.39 8.13 5.11V7.46H5.39V10.63H8.13V18.75H11.4Z"
							stroke="currentColor"
							stroke-width="1.2"
							stroke-linejoin="round"
						/>
					</svg>
				{:else if icon === 'instagram'}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<rect
							x="2.5"
							y="2.5"
							width="15"
							height="15"
							rx="4.5"
							stroke="currentColor"
							stroke-width="1.4"
						/>
						<circle cx="10" cy="10" r="3.35" stroke="currentColor" stroke-width="1.4" />
						<circle cx="14.2" cy="5.8" r="0.9" fill="currentColor" />
					</svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M5 17H3.8C3.36 17 3 16.64 3 16.2V13.28C3 12.41 3.56 11.64 4.39 11.37L6.25 10.77L8 6.85C8.33 6.13 9.04 5.66 9.83 5.66H14.17C14.96 5.66 15.67 6.13 16 6.85L17.75 10.77L19.61 11.37C20.44 11.64 21 12.41 21 13.28V16.2C21 16.64 20.64 17 20.2 17H19"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M6.25 10.75H17.75"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M8.5 17C8.5 18.1 7.6 19 6.5 19C5.4 19 4.5 18.1 4.5 17C4.5 15.9 5.4 15 6.5 15C7.6 15 8.5 15.9 8.5 17Z"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M19.5 17C19.5 18.1 18.6 19 17.5 19C16.4 19 15.5 18.1 15.5 17C15.5 15.9 16.4 15 17.5 15C18.6 15 19.5 15.9 19.5 17Z"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			{/snippet}

			{#each footerSocialLinks as item (item.label)}
				{#if item.external}
					<a
						class="mh-footer__social-link"
						href={item.href}
						target="_blank"
						rel="external noopener noreferrer"
						title={item.title}
						aria-label={item.title}
					>
						{@render footerSocialIcon(item.icon)}
					</a>
				{:else}
					<a
						class="mh-footer__social-link"
						href={resolve(item.href)}
						title={item.title}
						aria-label={item.title}
					>
						{@render footerSocialIcon(item.icon)}
					</a>
				{/if}
			{/each}
		</nav>
		<div class="mh-footer__contact">
			<a class="mh-footer__phone" href={phoneHref}>
				<strong>{daynightSite.phoneLabel}</strong>
				<span>Обаждане / Viber</span>
			</a>
			<a class="mh-footer__loc" href={mapHref} target="_blank" rel="external noopener noreferrer">
				{daynightSite.location}
			</a>
		</div>
		<span class="mh-footer__copy">© 2026 Day Night Auto София. Всички права запазени.</span>
	</footer>

	<MobileBottomDock />

	<MobileFullSheet
		bind:open={searchOpen}
		labelledBy={heroMode === 'import' ? 'mh-import-title' : 'mh-search-title'}
		onClose={resetSearchSheet}
	>
		{#if heroMode === 'buy'}
			<div class="mh-search-sheet">
				{#if searchView === 'main'}
					<header>
						<div>
							<span>Търсене</span>
							<strong id="mh-search-title">Намери автомобил</strong>
						</div>
						<button type="button" aria-label="Затвори" onclick={closeSearch}>
							<X size={19} strokeWidth={2.5} />
						</button>
					</header>

					<div class="mh-search-sheet__body">
						<label class="mh-search-sheet__field">
							<Search size={19} strokeWidth={2.3} aria-hidden="true" />
							<input
								type="search"
								bind:value={query}
								placeholder="Търси марка, модел…"
								autocomplete="off"
								aria-label="Търсене"
								enterkeyhint="search"
								onkeydown={(event) => {
									if (event.key !== 'Enter') return;
									event.preventDefault();
									submitSearch();
								}}
							/>
						</label>

						<div class="mh-search-sheet__group">
							<div class="mh-search-sheet__group-head">
								<span>Марка</span>
								{#if data.brands.length > popularBrands.length}
									<button
										type="button"
										class="mh-search-sheet__all"
										onclick={() => openFacet('brand')}
									>
										Всички {data.brands.length}
										<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
									</button>
								{/if}
							</div>
							<div class="mh-chips">
								{#each popularBrands as brand (brand)}
									{@const logo = brandLogos[brand]}
									{@const isSelected = selectedBrands.includes(brand)}
									<button
										type="button"
										class={`mh-chip mh-chip--brand${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleBrand(brand)}
									>
										{#if logo}
											<span class="mh-chip__logo" aria-hidden="true">
												<img src={logo} alt="" loading="lazy" />
											</span>
										{:else}
											<span class="mh-chip__mark" aria-hidden="true">{brandMark(brand)}</span>
										{/if}
										<span>{brand}</span>
									</button>
								{/each}
							</div>
						</div>

						<div class="mh-search-sheet__group">
							<div class="mh-search-sheet__group-head">
								<span>Модел</span>
								{#if allModelOptions.length > modelChips.length}
									<button
										type="button"
										class="mh-search-sheet__all"
										onclick={() => openFacet('model')}
									>
										Всички {allModelOptions.length}
										<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
									</button>
								{/if}
							</div>
							<div class="mh-chips mh-chips--models">
								{#each modelChips as option (option.model)}
									{@const isSelected = selectedModels.includes(option.model)}
									<button
										type="button"
										class={`mh-chip mh-chip--model${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleModel(option.model)}
									>
										<span>{option.model}</span>
									</button>
								{/each}
							</div>
						</div>

						<div class="mh-search-sheet__group">
							<div class="mh-search-sheet__group-head">
								<span>Каросерия</span>
								{#if data.bodyTypes.length > bodyChips.length}
									<button
										type="button"
										class="mh-search-sheet__all"
										onclick={() => openFacet('body')}
									>
										Всички {data.bodyTypes.length}
										<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
									</button>
								{/if}
							</div>
							<div class="mh-chips">
								{#each bodyChips as body (body)}
									{@const isSelected = selectedBodies.includes(body)}
									<button
										type="button"
										class={`mh-chip mh-chip--body${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleBody(body)}
									>
										{@render bodyTypeChipIcon(bodyChipIconFor(body))}
										<span>{bodyLabel(body)}</span>
									</button>
								{/each}
							</div>
						</div>
					</div>

					<a class="mh-search-sheet__go" href={resolve(searchHref)}>Виж автомобилите →</a>
				{:else}
					<header>
						<div class="mh-facet-head">
							<button type="button" class="mh-facet-back" aria-label="Назад" onclick={backToMain}>
								<ChevronLeft size={20} strokeWidth={2.5} />
							</button>
							<div>
								<span>Избери</span>
								<strong id="mh-search-title">{facetTitle}</strong>
							</div>
						</div>
						<button type="button" aria-label="Затвори" onclick={closeSearch}>
							<X size={19} strokeWidth={2.5} />
						</button>
					</header>

					<div class="mh-search-sheet__body">
						{#if searchView === 'brand' || searchView === 'model'}
							<label class="mh-search-sheet__field">
								<Search size={19} strokeWidth={2.3} aria-hidden="true" />
								<input
									type="search"
									bind:value={facetQuery}
									placeholder={searchView === 'brand' ? 'Търси марка' : 'Търси модел'}
									autocomplete="off"
									aria-label={searchView === 'brand' ? 'Търси марка' : 'Търси модел'}
								/>
							</label>
						{/if}

						<div class="mh-facet-list">
							{#if searchView === 'brand'}
								{#each facetBrandList as brand (brand)}
									{@const logo = brandLogos[brand]}
									{@const isSelected = selectedBrands.includes(brand)}
									<button
										type="button"
										class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleBrand(brand)}
									>
										<span class="mh-facet-row__label">
											{#if logo}
												<span class="mh-facet-row__logo" aria-hidden="true">
													<img src={logo} alt="" loading="lazy" />
												</span>
											{:else}
												<span class="mh-facet-row__mark" aria-hidden="true">{brandMark(brand)}</span
												>
											{/if}
											<span>{brand}</span>
										</span>
										{#if isSelected}
											<Check size={18} strokeWidth={2.6} aria-hidden="true" />
										{/if}
									</button>
								{/each}
								{#if !facetBrandList.length}
									<p class="mh-facet-empty">Няма марки по това търсене.</p>
								{/if}
							{:else if searchView === 'model'}
								{#each facetModelList as option (option.model)}
									{@const isSelected = selectedModels.includes(option.model)}
									<button
										type="button"
										class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleModel(option.model)}
									>
										<span class="mh-facet-row__label"><span>{option.model}</span></span>
										{#if isSelected}
											<Check size={18} strokeWidth={2.6} aria-hidden="true" />
										{:else}
											<small>{option.count}</small>
										{/if}
									</button>
								{/each}
								{#if !facetModelList.length}
									<p class="mh-facet-empty">Няма модели по това търсене.</p>
								{/if}
							{:else}
								{#each data.bodyTypes as body (body)}
									{@const isSelected = selectedBodies.includes(body)}
									<button
										type="button"
										class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
										aria-pressed={isSelected}
										onclick={() => toggleBody(body)}
									>
										<span class="mh-facet-row__label">
											{@render bodyTypeChipIcon(bodyChipIconFor(body))}
											<span>{bodyLabel(body)}</span>
										</span>
										{#if isSelected}
											<Check size={18} strokeWidth={2.6} aria-hidden="true" />
										{/if}
									</button>
								{/each}
							{/if}
						</div>
					</div>

					<button class="mh-search-sheet__go" type="button" onclick={backToMain}>Готово →</button>
				{/if}
			</div>
		{:else}
			<div class="mh-search-sheet mh-search-sheet--sell">
				<header>
					<div>
						<span>Внос по поръчка</span>
						<strong id="mh-import-title">Внос на автомобил</strong>
					</div>
					<button type="button" aria-label="Затвори" onclick={closeSearch}>
						<X size={19} strokeWidth={2.5} />
					</button>
				</header>

				<div class="mh-search-sheet__body">
					<div class="mh-sell-grid">
						<label class="mh-sell-field mh-sell-field--wide">
							<span>Какво търсите</span>
							<input
								type="text"
								bind:value={importQuery}
								placeholder="BMW X5, дизел, до 2020..."
								autocomplete="off"
								aria-label="Търсен автомобил за внос"
							/>
						</label>
						<label class="mh-sell-field">
							<span>Марка</span>
							<input type="text" bind:value={importMake} placeholder="BMW" autocomplete="off" />
						</label>
						<label class="mh-sell-field">
							<span>Модел</span>
							<input type="text" bind:value={importModel} placeholder="X5" autocomplete="off" />
						</label>
						<label class="mh-sell-field">
							<span>Година от</span>
							<input
								type="text"
								inputmode="numeric"
								bind:value={importYear}
								placeholder="2019"
								autocomplete="off"
							/>
						</label>
						<label class="mh-sell-field">
							<span>Бюджет</span>
							<input
								type="text"
								inputmode="numeric"
								bind:value={importBudget}
								placeholder="30 000 EUR"
								autocomplete="off"
							/>
						</label>
						<label class="mh-sell-field mh-sell-field--wide">
							<span>Телефон</span>
							<input
								type="tel"
								bind:value={importPhone}
								placeholder={daynightSite.phoneLabel}
								autocomplete="tel"
							/>
						</label>
						<label class="mh-sell-field mh-sell-field--wide">
							<span>Линк към обява</span>
							<input
								type="text"
								inputmode="url"
								bind:value={importSourceUrl}
								placeholder="mobile.de, autoscout24..."
								autocomplete="url"
							/>
						</label>
					</div>

					<p class="mh-import-note">
						Оставете насока за марка, модел и бюджет. Екипът ще Ви изпрати варианти за внос и
						следващи стъпки.
					</p>
				</div>

				<a class="mh-search-sheet__go" href={resolve(importLeadHref)}>Изпрати заявка →</a>
				<a class="mh-search-sheet__ghost" href={phoneHref}>
					<PhoneCall size={17} strokeWidth={2.45} aria-hidden="true" />
					<span>Обади се</span>
				</a>
			</div>
		{/if}
	</MobileFullSheet>

	<MobileDrawer bind:open={locationOpen} labelledBy="mh-location-title">
		<div class="mh-location-sheet">
			<header>
				<div>
					<span>Локация</span>
					<strong id="mh-location-title">Индустриална зона, София</strong>
				</div>
				<button type="button" aria-label="Затвори" onclick={() => (locationOpen = false)}>
					<X size={19} strokeWidth={2.5} />
				</button>
			</header>

			<div class="mh-location-sheet__map" aria-hidden="true">
				<span class="mh-location-sheet__pin">
					<MapPin size={24} strokeWidth={2.5} />
				</span>
				<span>София</span>
				<strong>гр. София, Студентски град, ул. Атанас Манчев 18</strong>
			</div>

			<p>{daynightSite.location}</p>

			<div class="mh-location-sheet__actions">
				<a class="is-primary" href={mapHref} target="_blank" rel="external noreferrer">
					<Navigation size={16} strokeWidth={2.4} aria-hidden="true" />
					Отвори карта
				</a>
				<a href={phoneHref}>Обади се</a>
			</div>
		</div>
	</MobileDrawer>
</div>

<style>
	.mobile-home {
		--mh-gutter: var(--sa-mobile-gutter-wide);

		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-home a {
		color: inherit;
		text-decoration: none;
	}

	.mobile-home main {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 18px;
		margin-top: -14px;
		border-radius: 22px 22px 0 0;
		background: #fff;
		padding-top: 16px;
		padding-bottom: 12px;
	}

	/* Hero — blue brand block with one direct search action */
	.mh-hero {
		display: grid;
		gap: 8px;
		padding: calc(env(safe-area-inset-top) + 12px) var(--mh-gutter) 24px;
		background: var(--sa-blue);
		color: #fff;
	}

	.mh-hero__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.mh-hero__bar-actions {
		display: flex;
		flex: 0 0 auto;
		gap: 8px;
	}

	.mh-hero__bar-action {
		display: inline-grid;
		box-sizing: border-box;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.34);
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		color: #fff !important;
		cursor: pointer;
		line-height: 0;
	}

	.mh-hero__bar-action :global(svg),
	.mh-hero__bar-action :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.mh-hero__brand {
		display: inline-flex;
		min-width: 0;
		align-items: center;
		color: #fff !important;
	}

	.mh-hero__logo {
		display: block;
		width: 170px;
		height: auto;
		object-fit: contain;
		object-position: left center;
		transform: translateZ(0);
	}

	.mh-hero__title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.mh-hero__box {
		display: grid;
		gap: 9px;
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0;
		box-shadow: none;
	}

	/* Card variant (/home1-box A/B): the whole buy box becomes a white card on the
	   blue hero (like the white-card reference layout). The toggle/search/link can't keep
	   their white-on-blue treatments inside a white card — flip to grey-fill. */
	.mh-hero__box--card {
		gap: 10px;
		border-radius: 18px;
		background: #fff;
		padding: 10px;
		box-shadow: 0 16px 36px rgba(0, 38, 92, 0.22);
	}

	.mh-hero__box--card .mh-hero__modes--segmented {
		background: var(--sa-fill);
	}

	.mh-hero__box--card .mh-hero__modes--segmented button {
		color: var(--sa-muted);
	}

	.mh-hero__box--card .mh-hero__modes--segmented button.is-active {
		background: var(--sa-blue);
		color: #fff;
		box-shadow: none;
	}

	.mh-hero__box--card .mh-hero__search {
		border: 1px solid var(--sa-line);
		background: var(--sa-fill);
		box-shadow: none;
	}

	.mh-hero__box--card .mh-hero__all {
		background: var(--sa-fill);
		color: var(--sa-blue-strong) !important;
	}

	/* Two focused journeys belong here; selling stays in the persistent bottom dock. */
	.mh-hero__modes {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-self: center;
		align-items: end;
		width: 100%;
		border-bottom: 1px solid rgba(255, 255, 255, 0.24);
		padding: 0;
	}

	.mh-hero__modes button {
		position: relative;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 42px;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		color: var(--mh-hero-tab-color, rgba(255, 255, 255, 0.7));
		font: var(--sa-weight-semibold) 16px / 1.2 var(--sa-font);
		padding: 5px 8px 7px;
		cursor: pointer;
		transition: color 0.18s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.mh-hero__modes button:hover {
		color: #fff;
	}

	.mh-hero__modes button:focus-visible {
		border-radius: 6px 6px 0 0;
		outline: 2px solid rgba(255, 255, 255, 0.76);
		outline-offset: -3px;
	}

	.mh-hero__modes button.is-active {
		color: var(--mh-hero-tab-active, #fff);
		font-weight: var(--sa-weight-strong);
	}

	.mh-hero__modes button.is-active::after {
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		width: auto;
		height: 3px;
		border-radius: 3px 3px 0 0;
		background: var(--sa-red, #d50032);
		content: '';
	}

	/* Segmented-control variant (/home1 A/B for the CEO): a white active pill on a
	   translucent track instead of the underline. Same markup, role-by-class. */
	.mh-hero__modes--segmented {
		display: grid;
		width: 100%;
		grid-auto-columns: minmax(0, 1fr);
		grid-auto-flow: column;
		align-items: stretch;
		gap: 4px;
		border-bottom: 0;
		border-radius: var(--sa-r-pill);
		background: rgba(255, 255, 255, 0.16);
		/* 3px track + 38px segments = 44px total — a touch SHORTER than the 48px
		   search below it, so the toggle reads as secondary to the search. */
		padding: 3px;
	}

	/* Plain (non-card) segmented toggle: a touch narrower than the full-width
	   search but CENTERED with equal halves — not shrunk-to-content/left-aligned
	   (that read squished). The card variant keeps it full-width. */
	.mh-hero__box:not(.mh-hero__box--card) .mh-hero__modes--segmented {
		justify-self: center;
		width: 86%;
	}

	.mh-hero__modes--segmented button {
		width: 100%;
		min-height: 38px;
		border-radius: var(--sa-r-pill);
		padding: 2px 8px;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.mh-hero__modes--segmented button.is-active {
		background: #fff;
		color: var(--sa-blue-strong);
		box-shadow: 0 2px 8px rgba(0, 30, 80, 0.16);
	}

	.mh-hero__modes--segmented button.is-active::after {
		display: none;
	}

	.mh-hero__search {
		display: inline-flex;
		width: 100%;
		min-height: var(--sa-mobile-search-h);
		align-items: center;
		box-sizing: border-box;
		gap: 12px;
		border: 0;
		border-radius: var(--sa-r-pill);
		background: #fff;
		padding: 4px 4px 4px 17px;
		color: var(--sa-muted);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		text-align: left;
		cursor: pointer;
		box-shadow: 0 12px 32px rgba(0, 45, 110, 0.18);
	}

	.mh-hero__search-label {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-hero__search-go {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-blue);
		color: #fff !important;
	}

	.mh-hero__search-go :global(svg),
	.mh-hero__search-go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mh-hero__all {
		display: inline-flex;
		justify-self: center;
		/* 44px standard tap target (was 40px hero-cta height) — the pill is a real
		   nav control to the full inventory, so it earns the larger hit area. */
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: 2px;
		border: 0;
		border-radius: var(--sa-r-pill);
		background: rgba(255, 255, 255, 0.94);
		padding: 0 8px 0 11px;
		color: var(--sa-blue-strong) !important;
		font-family: var(--sa-font);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-none);
		cursor: pointer;
		box-shadow: none;
		margin-top: -1px;
		transition:
			background-color 120ms ease-out,
			color 120ms ease-out;
	}

	.mh-hero__all :global(svg),
	.mh-hero__all :global(svg *) {
		width: 12px;
		height: 12px;
		color: var(--sa-blue-strong) !important;
		stroke: var(--sa-blue-strong) !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.mh-hero__all:hover {
			background: var(--sa-red);
			color: #fff !important;
		}

		.mh-hero__all:hover :global(svg),
		.mh-hero__all:hover :global(svg *) {
			color: #fff !important;
			stroke: #fff !important;
		}
	}

	.mh-hero__all:active,
	.mh-hero__all:focus-visible {
		background: var(--sa-red);
		color: #fff !important;
	}

	.mh-hero__all:active :global(svg),
	.mh-hero__all:active :global(svg *),
	.mh-hero__all:focus-visible :global(svg),
	.mh-hero__all:focus-visible :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	/* Secondary quick filters */
	.mh-quick {
		display: flex;
		margin-top: 0;
		margin-inline: var(--mh-gutter);
		gap: var(--sa-mobile-gap-sm);
		overflow-x: auto;
		padding: 0 0 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.mh-quick::-webkit-scrollbar {
		display: none;
	}

	.mh-quick__pill {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: var(--sa-pill-gap);
		min-height: var(--sa-mobile-pill-h);
		border: 0;
		border-radius: var(--sa-pill-radius);
		background: var(--sa-fill);
		padding: 0 var(--sa-pill-pad-x);
		color: var(--sa-ink);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-pill-weight);
		line-height: 1;
		white-space: nowrap;
	}

	.mh-quick__pill :global(svg) {
		flex: 0 0 auto;
		color: var(--sa-blue) !important;
	}

	.mh-quick__car-icon {
		display: block;
		width: 30px;
		height: 15px;
		flex: 0 0 auto;
		color: var(--sa-blue);
	}

	/* Sections */
	.mh-section {
		display: grid;
		gap: 8px;
	}

	.mh-section--brands {
		gap: 8px;
	}

	.mh-section--budget {
		gap: 8px;
	}

	.mh-section__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 0 16px;
	}

	.mh-section__head h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-leading-tight);
		letter-spacing: var(--sa-tracking-tight);
	}

	.mh-section__head a {
		display: inline-flex;
		flex: 0 0 auto;
		min-height: 44px;
		margin-block: -7px;
		align-items: center;
		gap: 2px;
		color: var(--sa-blue-strong) !important;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
	}

	.mh-section__head a :global(svg) {
		width: 13px;
		height: 13px;
	}

	.mh-budget-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		padding: 0 16px;
	}

	.mh-budget-card {
		position: relative;
		display: grid;
		grid-template-rows: 120px minmax(0, 1fr);
		height: 184px;
		overflow: hidden;
		border: 1px solid #e0e5ec;
		border-radius: 8px;
		background: #e7eaee;
		color: var(--sa-ink) !important;
		box-shadow: none;
	}

	.mh-budget-card--open {
		border-color: #e0e5ec;
		background: #e7eaee;
	}

	.mh-budget-card__media {
		position: relative;
		display: grid;
		min-height: 120px;
		place-items: end center;
		overflow: hidden;
		padding: 15px 0 0;
	}

	.mh-budget-card__media::after {
		position: absolute;
		right: 18px;
		bottom: 11px;
		left: 18px;
		height: 14px;
		border-radius: 50%;
		background: rgba(34, 45, 58, 0.12);
		filter: blur(5px);
		content: '';
	}

	.mh-budget-card__media img {
		position: relative;
		z-index: 1;
		display: block;
		width: 150%;
		max-width: none;
		height: 86px;
		object-fit: contain;
		object-position: center bottom;
		transform: translateX(18%);
	}

	.mh-budget-card__media :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		width: 100%;
		padding: 14px;
		background: #f1f4f9;
		object-fit: contain;
		transform: none;
	}

	.mh-budget-card--open .mh-budget-card__media img {
		width: 116%;
		height: 94px;
		transform: translateX(0);
	}

	.mh-budget-card__copy {
		display: grid;
		align-content: start;
		gap: 4px;
		min-width: 0;
		padding: 4px 14px 14px;
	}

	.mh-budget-card__copy strong {
		overflow: hidden;
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-budget-card__copy span {
		overflow: hidden;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-rail--cat {
		grid-auto-columns: min(234px, calc(100vw - 96px));
	}

	/* Horizontal rails */
	.mh-rail {
		display: grid;
		grid-auto-flow: column;
		gap: 8px;
		overflow-x: auto;
		padding: 0 16px 4px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.mh-rail::-webkit-scrollbar {
		display: none;
	}

	.mh-carlist {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(264px, calc(100vw - 82px));
		gap: 8px;
		overflow-x: auto;
		padding: 0 16px 4px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.mh-carlist::-webkit-scrollbar {
		display: none;
	}

	/* Category cards: vehicle body artwork on one soft-grey surface */
	.mh-cat {
		display: grid;
		grid-template-rows: minmax(0, 1fr) 42px;
		aspect-ratio: 234 / 148;
		overflow: hidden;
		border: 1px solid #e2e7ee;
		border-radius: 8px;
		background: #eef1f6;
		box-shadow: none;
	}

	.mh-cat__media {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: 0;
		place-items: center;
		background: transparent;
		padding: 8px 12px 0;
	}

	.mh-cat__image {
		position: relative;
		z-index: 1;
		display: block;
		width: auto;
		max-width: 100%;
		height: 74px;
		max-height: 100%;
		filter: drop-shadow(0 7px 8px rgba(15, 20, 27, 0.13));
		object-fit: contain;
		object-position: center;
	}

	.mh-cat__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 0 12px 11px;
	}

	.mh-cat__label {
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.1;
	}

	.mh-cat__count {
		color: #4f5966;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		white-space: nowrap;
	}

	/* Brand cards */
	.mh-brand-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding: 0 16px 4px;
	}

	.mh-brandcard {
		display: grid;
		min-height: 116px;
		align-items: center;
		justify-items: center;
		align-content: center;
		gap: 4px;
		overflow: hidden;
		border: 1px solid #dce1e8;
		border-radius: 8px;
		background: #f1f3f5;
		padding: 10px 6px 9px;
		box-shadow: none;
		text-align: center;
	}

	.mh-brandcard__icon,
	.mh-brandcard__mark {
		flex: 0 0 auto;
	}

	.mh-brandcard__icon {
		display: grid;
		width: 58px;
		height: 48px;
		flex: 0 0 48px;
		place-items: center;
	}

	.mh-brandcard__logo {
		display: block;
		max-width: 48px;
		max-height: 42px;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.mh-brandcard[data-brand='Audi'] .mh-brandcard__logo,
	.mh-brandcard[data-brand='Ford'] .mh-brandcard__logo,
	.mh-brandcard[data-brand='Hyundai'] .mh-brandcard__logo {
		max-width: 56px;
	}

	.mh-brandcard[data-brand='Tesla'] .mh-brandcard__logo {
		max-height: 40px;
	}

	.mh-brandcard__mark {
		display: grid;
		width: 58px;
		height: 48px;
		place-items: center;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-strong);
		line-height: 1;
	}

	.mh-brandcard__copy {
		display: grid;
		min-width: 0;
		justify-items: center;
		gap: 2px;
	}

	.mh-brandcard__name {
		max-width: 100%;
		color: var(--sa-ink);
		font-size: 14px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.15;
	}

	.mh-brandcard__count {
		color: #687180;
		font-size: 12px;
		font-weight: var(--sa-weight-medium);
		line-height: 1.2;
		white-space: nowrap;
	}

	.mh-brandcard--all {
		grid-template-rows: 48px auto;
	}

	.mh-brandcard__all-icon {
		display: grid;
		width: 42px;
		height: 42px;
		place-items: center;
		border: 1px solid #161b22;
		border-radius: 50%;
		color: #161b22;
	}

	/* Car card — real inventory rail */
	.mh-car {
		position: relative;
		display: grid;
		grid-template-rows: 136px minmax(68px, auto) 42px;
		overflow: hidden;
		border: 1px solid #e2e7ee;
		border-radius: 8px;
		background: #e7eaee;
		box-shadow: none;
	}

	.mh-car__link {
		display: contents;
		color: inherit;
		text-decoration: none;
	}

	.mh-car__copy {
		display: grid;
		align-content: start;
		gap: 4px;
		min-width: 0;
		padding: 11px 13px 4px;
	}

	.mh-car__brand {
		overflow: hidden;
		color: #4f5966;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: var(--sa-tracking-wide);
		line-height: 1;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.mh-car__media {
		position: relative;
		min-height: 136px;
		overflow: hidden;
		background: #eef1f6;
	}

	.mh-car__media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mh-car__media :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		padding: 18px;
		background: #f1f4f9;
		object-fit: contain;
	}

	.mh-car__badge {
		position: absolute;
		top: 7px;
		left: 7px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-blue);
		padding: 4px 7px;
		color: #fff;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: var(--sa-tracking-wide);
		line-height: 1;
		text-transform: uppercase;
	}

	.mh-car__tools {
		position: absolute;
		top: 7px;
		right: 7px;
		display: grid;
		gap: 4px;
		z-index: 2;
	}

	.mh-car__tools button {
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-radius: 50%;
		background: rgba(15, 23, 42, 0.76);
		padding: 0;
		color: #fff;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.mh-car__tools button.is-active {
		background: var(--sa-red);
		color: #fff;
	}

	.mh-car__tools button:focus-visible {
		outline: 3px solid rgba(47, 122, 255, 0.42);
		outline-offset: 2px;
	}

	.mh-car__tools button :global(svg) {
		display: block;
		color: currentColor;
		stroke: currentColor;
	}

	.mh-car__tools button.is-active:last-child :global(svg) {
		fill: currentColor;
	}

	.mh-car__title {
		display: block;
		overflow: hidden;
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.08;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__meta {
		overflow: hidden;
		color: #4f5966;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 0 13px 13px;
	}

	.mh-car__price {
		display: inline-flex;
		max-width: calc(100% - 40px);
		min-height: var(--sa-mobile-section-action-h);
		align-items: center;
		border-radius: 6px;
		background: #fff;
		padding: 0 9px;
		overflow: hidden;
		color: var(--sa-price);
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-strong);
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__go {
		display: grid;
		width: var(--sa-mobile-card-action);
		height: var(--sa-mobile-card-action);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		background: var(--sa-ink);
		color: #fff;
	}

	.mh-car__go :global(svg) {
		width: 16px;
		height: 16px;
		color: #fff !important;
	}

	.mh-car__go :global(path) {
		stroke: #fff !important;
	}

	/* CTA + trust */
	.mh-cta-wrap {
		display: grid;
		gap: 10px;
		padding: 0 var(--sa-mobile-gutter);
	}

	.mh-cta {
		display: grid;
		gap: 12px;
		border-radius: var(--sa-r-lg);
		background: var(--sa-fill);
		padding: 16px;
	}

	.mh-cta__copy {
		display: grid;
		gap: 4px;
	}

	.mh-cta__copy strong {
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
	}

	.mh-cta__copy span {
		color: #4f5966;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-cta__actions {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 9px;
	}

	.mh-cta__actions a {
		display: inline-flex;
		min-width: 0;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		border-radius: var(--sa-r-sm);
		padding: 0 10px;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-shadow: none;
		transition:
			background-color 120ms ease-out,
			color 120ms ease-out;
	}

	.mh-cta__actions .is-browse {
		background: var(--sa-blue);
		color: #fff !important;
	}

	.mh-cta__actions .is-call {
		background: var(--sa-red);
		color: #fff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.mh-cta__actions .is-browse:hover {
			background: var(--sa-blue-strong);
		}

		.mh-cta__actions .is-call:hover {
			background: #b90f1f;
		}
	}

	.mh-cta__actions .is-browse:active,
	.mh-cta__actions .is-browse:focus-visible {
		background: var(--sa-blue-strong);
	}

	.mh-cta__actions .is-call:active,
	.mh-cta__actions .is-call:focus-visible {
		background: #b90f1f;
	}

	.mh-trust {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 7px;
	}

	.mh-trust span {
		display: inline-flex;
		min-height: 30px;
		align-items: center;
		border-radius: var(--sa-r-pill);
		background: var(--sa-fill);
		padding: 0 13px;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	/* Footer */
	.mh-footer {
		display: grid;
		justify-items: stretch;
		gap: 16px;
		margin-top: 14px;
		border: 0;
		border-radius: 20px 20px 0 0;
		background: #171b1e;
		color: #fff;
		padding: 24px 18px calc(28px + 62px + env(safe-area-inset-bottom));
	}

	.mh-footer__brand {
		display: grid;
		justify-items: start;
		gap: 10px;
	}

	.mh-footer__logo {
		width: 142px;
		height: auto;
		object-fit: contain;
	}

	.mh-footer p {
		margin: 0;
		color: #c5c9ce;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: 1.5;
	}

	.mh-footer__social {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
	}

	.mh-footer__social-link {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 1px solid #4b5156;
		border-radius: 50%;
		background: transparent;
		color: #fff !important;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.mh-footer__social-link:focus-visible,
	.mh-footer__social-link:hover {
		border-color: var(--sa-yellow);
		background: var(--sa-yellow);
		color: #171b1e !important;
	}

	.mh-footer__contact {
		display: grid;
		gap: 8px;
	}

	.mh-footer__phone {
		display: grid;
		gap: 2px;
		justify-items: start;
		color: #fff !important;
	}

	.mh-footer__phone strong {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-strong);
		line-height: 1.1;
	}

	.mh-footer__phone span {
		color: #c5c9ce;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-footer__loc {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		color: #c5c9ce !important;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		line-height: 1.45;
	}

	.mh-footer__copy {
		max-width: calc(100% - 64px);
		color: #c5c9ce;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-footer__social-link svg,
	.mh-footer__social-link svg * {
		color: inherit !important;
		stroke: currentColor !important;
	}
	.mh-footer__phone strong {
		color: #fff;
	}
	.mh-footer a:focus-visible {
		outline: 2px solid var(--sa-yellow);
		outline-offset: 3px;
	}

	/* Search drawer */
	.mh-search-sheet,
	.mh-location-sheet {
		--mh-sheet-font: var(--sa-font);

		display: grid;
		gap: 15px;
		color: var(--sa-ink);
		font-family: var(--mh-sheet-font);
		font-size: var(--sa-text-sm);
		line-height: 1.2;
	}

	.mh-search-sheet--sell {
		gap: 12px;
	}

	/* The search/sell sheet fills a full-screen overlay (MobileFullSheet), NOT a
	   bottom drawer: header / internally-scrolling __body / footer CTA. The
	   overlay panel already equals the visible viewport (sized to
	   visualViewport.height), so the input sits at the top and nothing ever has
	   to be lifted onto the keyboard — no gap, no per-OS inset math. */
	.mh-search-sheet {
		min-height: 0;
		height: 100%;
		grid-template-rows: auto minmax(0, 1fr) auto;
		overflow: hidden;
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter)
			calc(14px + env(safe-area-inset-bottom));
	}

	.mh-search-sheet__body {
		display: grid;
		min-height: 0;
		/* Pack rows at their natural height — without this, grid's default
		   align-content:stretch grows the field + chip groups to fill the tall
		   1fr body, ballooning the search field. */
		align-content: start;
		gap: 15px;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
		padding-bottom: 2px;
	}

	.mh-search-sheet--sell .mh-search-sheet__body {
		gap: 12px;
	}

	.mh-search-sheet__body::-webkit-scrollbar {
		display: none;
	}

	.mh-search-sheet :where(a, button, input, small, span, strong),
	.mh-location-sheet :where(a, button, input, small, span, strong) {
		font-family: var(--mh-sheet-font);
	}

	.mh-search-sheet header,
	.mh-location-sheet header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.mh-search-sheet header div,
	.mh-location-sheet header div {
		display: grid;
		gap: 3px;
	}

	.mh-search-sheet header span,
	.mh-location-sheet header span {
		color: var(--sa-blue);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-leading-snug);
		letter-spacing: 0;
		text-transform: none;
	}

	.mh-search-sheet header strong,
	.mh-location-sheet header strong {
		color: var(--sa-ink);
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-weight-strong);
		line-height: 1.15;
	}

	.mh-search-sheet--sell header strong {
		font-size: var(--sa-text-xl);
		line-height: var(--sa-leading-tight);
	}

	.mh-search-sheet header button,
	.mh-location-sheet header button {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border: 1px solid var(--sa-line);
		border-radius: 50%;
		background: var(--sa-bg);
		color: var(--sa-ink);
	}

	.mh-search-sheet__field {
		position: sticky;
		top: 0;
		z-index: 3;
		display: flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		gap: 10px;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
		box-shadow: 0 8px 10px -8px rgba(15, 23, 42, 0.16);
		overflow: hidden;
		padding: 0 14px;
	}

	.mh-search-sheet__field :global(svg) {
		flex: 0 0 auto;
		color: var(--sa-muted);
	}

	.mh-search-sheet__field input,
	.mh-search-sheet__field input[type='search'] {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		min-width: 0;
		height: var(--sa-mobile-action-h);
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--sa-ink);
		font: inherit;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		outline: 0 !important;
		padding: 0 !important;
	}

	.mh-search-sheet__field input::-webkit-search-cancel-button,
	.mh-search-sheet__field input::-webkit-search-decoration,
	.mh-search-sheet__field input::-webkit-search-results-button,
	.mh-search-sheet__field input::-webkit-search-results-decoration {
		display: none;
		appearance: none;
		-webkit-appearance: none;
	}

	.mh-search-sheet__group {
		display: grid;
		gap: 9px;
	}

	.mh-search-sheet__group-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.mh-search-sheet__group-head > span {
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		letter-spacing: var(--sa-tracking-wide);
		text-transform: uppercase;
	}

	.mh-search-sheet__all {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 1px;
		border: 0;
		background: transparent;
		padding: 0;
		color: var(--sa-blue-strong);
		font-family: var(--mh-sheet-font);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		cursor: pointer;
	}

	.mh-search-sheet__all :global(svg) {
		width: 13px;
		height: 13px;
	}

	/* Facet drill-in (full searchable brand/model/body list) */
	.mh-search-sheet header .mh-facet-head {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 10px;
	}

	.mh-facet-list {
		display: grid;
		gap: 7px;
	}

	.mh-facet-row {
		display: flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
		padding: 0 14px;
		color: var(--sa-ink);
		font-family: var(--mh-sheet-font);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		text-align: left;
		cursor: pointer;
	}

	.mh-facet-row.is-active {
		border-color: var(--sa-blue);
		background: rgba(176, 0, 0, 0.08);
		color: var(--sa-blue-strong);
	}

	.mh-facet-row :global(svg) {
		flex: 0 0 auto;
		color: var(--sa-blue);
	}

	.mh-facet-row__label {
		display: inline-flex;
		min-width: 0;
		align-items: center;
		gap: 10px;
		overflow: hidden;
	}

	.mh-facet-row__label > span:last-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-facet-row small {
		flex: 0 0 auto;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
	}

	.mh-facet-row__logo,
	.mh-facet-row__mark {
		display: grid;
		width: 26px;
		height: 26px;
		flex: 0 0 26px;
		place-items: center;
		border-radius: 7px;
		background: #fff;
	}

	.mh-facet-row__logo img {
		max-width: 18px;
		max-height: 18px;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.mh-facet-row__mark {
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-strong);
	}

	.mh-facet-empty {
		margin: 0;
		padding: 12px 4px;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-sm);
	}

	.mh-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.mh-chips--models {
		max-height: 91px;
		overflow-y: auto;
		padding-right: 2px;
		scrollbar-width: none;
	}

	.mh-chips--models::-webkit-scrollbar {
		display: none;
	}

	.mh-chip {
		display: inline-flex;
		min-width: var(--sa-mobile-pill-h);
		min-height: var(--sa-mobile-pill-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-pill-gap);
		border: 1px solid #dfe6ef;
		border-radius: var(--sa-pill-radius);
		background: #f2f5f9;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
		padding: 0 var(--sa-pill-pad-x);
		color: var(--sa-ink-soft);
		font-family: var(--mh-sheet-font);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-pill-weight);
		line-height: 1;
		cursor: pointer;
		transition:
			background 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease,
			box-shadow 0.16s ease;
	}

	.mh-chip > span {
		color: inherit;
		font: inherit;
		line-height: 1;
	}

	.mh-chip__logo,
	.mh-chip__mark,
	.mh-chip__body-icon {
		flex: 0 0 auto;
	}

	.mh-chip__logo,
	.mh-chip__mark {
		display: grid;
		width: 22px;
		height: 22px;
		place-items: center;
		border: 1px solid rgba(202, 212, 225, 0.84);
		border-radius: 50%;
		background: #fff;
		color: #334155;
		overflow: hidden;
	}

	.mh-chip__logo img {
		display: block;
		width: 17px;
		height: 17px;
		object-fit: contain;
	}

	.mh-chip__mark {
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-strong);
		letter-spacing: 0;
	}

	.mh-chip__body-icon {
		width: 27px;
		height: 13px;
		color: currentColor;
		opacity: 0.78;
	}

	.mh-chip.is-active {
		border-color: var(--sa-blue);
		background: var(--sa-blue);
		box-shadow: 0 8px 18px rgba(176, 0, 0, 0.22);
		color: #fff;
	}

	.mh-chip.is-active .mh-chip__logo,
	.mh-chip.is-active .mh-chip__mark {
		border-color: rgba(255, 255, 255, 0.42);
		background: #fff;
		color: var(--sa-blue);
	}

	.mh-search-sheet__go {
		position: sticky;
		z-index: 2;
		bottom: 0;
		display: inline-flex;
		box-sizing: border-box;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		appearance: none;
		border: 0;
		border-radius: var(--sa-r-md);
		background: var(--sa-blue);
		box-shadow: 0 -8px 16px rgba(255, 255, 255, 0.88);
		color: #fff !important;
		font-family: var(--mh-sheet-font);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-button);
		letter-spacing: 0;
		padding: 0 18px;
		text-decoration: none;
		cursor: pointer;
		-webkit-font-smoothing: antialiased;
	}

	.mh-search-sheet__ghost {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
		color: var(--sa-ink) !important;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		letter-spacing: 0;
		padding: 0 18px;
		text-decoration: none;
		-webkit-font-smoothing: antialiased;
	}

	.mh-search-sheet__ghost :global(svg),
	.mh-search-sheet__ghost :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.mh-location-sheet__map {
		position: relative;
		display: grid;
		min-height: 122px;
		align-content: end;
		gap: 4px;
		overflow: hidden;
		border: 1px solid #dbe4f0;
		border-radius: 16px;
		background:
			linear-gradient(135deg, rgba(176, 0, 0, 0.18), rgba(255, 255, 255, 0.1)),
			linear-gradient(90deg, rgba(176, 0, 0, 0.08) 1px, transparent 1px),
			linear-gradient(0deg, rgba(176, 0, 0, 0.08) 1px, transparent 1px), #eef4fb;
		background-size:
			auto,
			34px 34px,
			34px 34px,
			auto;
		padding: 18px;
		color: var(--sa-ink);
	}

	.mh-location-sheet__map > span:not(.mh-location-sheet__pin) {
		color: var(--sa-blue);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: var(--sa-tracking-wide);
		text-transform: uppercase;
	}

	.mh-location-sheet__map strong {
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-weight-strong);
		line-height: 1.08;
	}

	.mh-location-sheet__pin {
		position: absolute;
		top: 18px;
		right: 18px;
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border-radius: 50%;
		background: var(--sa-blue);
		color: #fff !important;
		box-shadow: 0 12px 24px rgba(176, 0, 0, 0.24);
	}

	.mh-location-sheet__pin :global(svg),
	.mh-location-sheet__pin :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mh-location-sheet p {
		margin: 0;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: 1.38;
	}

	.mh-location-sheet__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mh-location-sheet__actions a {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
		color: var(--sa-ink) !important;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-semibold);
		box-shadow: none;
		transition:
			background-color 120ms ease-out,
			color 120ms ease-out;
	}

	.mh-location-sheet__actions a.is-primary {
		background: var(--sa-blue);
		color: #fff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.mh-location-sheet__actions a:hover {
			background: var(--sa-red);
			color: #fff !important;
		}

		.mh-location-sheet__actions a.is-primary:hover {
			background: var(--sa-blue-strong);
		}
	}

	.mh-location-sheet__actions a:active,
	.mh-location-sheet__actions a:focus-visible {
		background: var(--sa-red);
		color: #fff !important;
	}

	.mh-location-sheet__actions a.is-primary:active,
	.mh-location-sheet__actions a.is-primary:focus-visible {
		background: var(--sa-blue-strong);
	}

	.mh-location-sheet__actions a.is-primary :global(svg),
	.mh-location-sheet__actions a.is-primary :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mh-sell-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mh-sell-field {
		display: grid;
		box-sizing: border-box;
		gap: 3px;
		min-width: 0;
		min-height: 54px;
		border: 1px solid #dfe6ef;
		border-radius: var(--sa-r-sm);
		background: #f2f5f9;
		box-shadow: none;
		padding: 7px 11px 6px;
		transition:
			border-color 0.16s ease,
			background-color 0.16s ease,
			outline-color 0.16s ease;
	}

	.mh-sell-field:focus-within {
		border-color: var(--sa-blue);
		background: #fff;
		outline: 2px solid rgba(23, 100, 216, 0.16);
		outline-offset: 0;
	}

	.mh-sell-field--wide {
		grid-column: 1 / -1;
	}

	.mh-sell-field span {
		color: var(--sa-muted);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-leading-snug);
		letter-spacing: 0;
		text-transform: none;
	}

	.mh-sell-field input {
		/* Bulletproof reset (mirrors .mh-search-sheet__field input): appearance:none
		   kills the native text-input chrome, and !important stops the legacy app.css
		   global input/focus rules from leaking a square border + focus outline inside
		   the rounded field — the doubled-square artifact. The grey-fill container and
		   its :focus-within ring are the only visible treatment. */
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		min-width: 0;
		height: auto;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		padding: 0;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-base) / 1.2 var(--sa-font);
		outline: 0 !important;
	}

	.mh-sell-field input::placeholder {
		color: #9aa3af;
		font-weight: var(--sa-weight-medium);
	}

	.mh-sell-upload {
		display: grid;
		box-sizing: border-box;
		grid-template-columns: 30px minmax(0, 1fr) auto;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		gap: 7px;
		border: 1px solid #dfe6ef;
		border-radius: var(--sa-r-sm);
		background: #f2f5f9;
		box-shadow: none;
		padding: 5px 10px 5px 6px;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		text-align: left;
		cursor: pointer;
	}

	.mh-sell-upload span {
		display: grid;
		width: var(--sa-mobile-mini-action);
		height: var(--sa-mobile-mini-action);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue) !important;
	}

	.mh-sell-upload span :global(svg),
	.mh-sell-upload span :global(svg *) {
		color: var(--sa-blue) !important;
		stroke: var(--sa-blue) !important;
	}

	.mh-sell-upload strong {
		min-width: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-semibold);
	}

	.mh-sell-upload small {
		display: none;
		color: var(--sa-muted);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-import-note {
		margin: 0;
		border: 1px solid #dfe6ef;
		border-radius: var(--sa-r-sm);
		background: #f2f5f9;
		padding: 10px 12px;
		color: #475467;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-leading-body-sm);
	}

	.mobile-home :global(svg),
	.mobile-home :global(svg *) {
		stroke: currentColor !important;
	}

	.mh-car__go :global(svg),
	.mh-car__go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	@media (max-width: 991px) {
		.mobile-home {
			display: block;
		}
	}

	@media (max-width: 360px) {
		.mobile-home {
			--mh-gutter: 16px;
		}

		.mh-hero__box {
			gap: 9px;
		}

		.mh-hero__modes button {
			font-size: var(--sa-text-sm);
		}

		.mh-hero__search {
			min-height: var(--sa-mobile-search-h);
		}

		.mh-hero__search-go {
			width: var(--sa-mobile-pill-h);
			height: var(--sa-mobile-pill-h);
		}

		.mh-brand-grid {
			gap: 8px;
			padding-right: 12px;
			padding-left: 12px;
		}

		.mh-brandcard {
			min-height: 112px;
			gap: 3px;
			padding: 8px 4px;
		}

		.mh-brandcard__name {
			font-size: 13px;
		}

		.mh-cta-wrap {
			padding-right: 12px;
			padding-left: 12px;
		}

		.mh-cta {
			padding: 14px;
		}

		.mh-cta__actions {
			gap: 8px;
		}

		.mh-cta__actions a {
			font-size: var(--sa-text-xs);
		}
	}

	@media (max-width: 370px) and (max-height: 780px) {
		.mh-search-sheet {
			gap: 12px;
		}

		.mh-search-sheet__group {
			gap: 7px;
		}

		.mh-chip {
			min-height: var(--sa-mobile-hero-cta-h);
			padding-right: 11px;
			padding-left: 11px;
			font-size: var(--sa-text-sm);
		}

		.mh-chips {
			gap: 6px;
		}
	}
</style>
