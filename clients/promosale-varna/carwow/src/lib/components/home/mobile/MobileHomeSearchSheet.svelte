<script lang="ts">
	import { Check, ChevronLeft, ChevronRight, Search, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { HomeMobileData } from '$lib/types/home';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import { HomeSearchState } from './home-search.svelte';
	import {
		bodyChipIconFor,
		bodyLabel,
		brandLogos,
		brandMark,
		type BodyChipIcon
	} from './mobile-home-data';

	let { data, open = $bindable(false) }: { data: HomeMobileData; open?: boolean } = $props();
	const search = new HomeSearchState(() => data);
	const popularBrands = $derived(data.brands.slice(0, 6));
	const bodyChips = $derived(data.bodyTypes.slice(0, 6));
	function closeSearch() {
		open = false;
		search.backToMain();
	}
	function submitSearch() {
		const href = search.searchHref;
		closeSearch();
		void goto(resolve(href));
	}
</script>

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

<MobileFullSheet bind:open labelledBy="mh-search-title" onClose={search.backToMain}>
	<div class="mh-search-sheet mh-sheet-scope">
		{#if search.searchView === 'main'}
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
						bind:value={search.query}
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
								onclick={() => search.openFacet('brand')}
							>
								Всички {data.brands.length}
								<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
							</button>
						{/if}
					</div>
					<div class="mh-chips">
						{#each popularBrands as brand (brand)}
							{@const logo = brandLogos[brand]}
							{@const isSelected = search.selectedBrands.includes(brand)}
							<button
								type="button"
								class={`mh-chip mh-chip--brand${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleBrand(brand)}
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
						{#if search.allModelOptions.length > search.modelChips.length}
							<button
								type="button"
								class="mh-search-sheet__all"
								onclick={() => search.openFacet('model')}
							>
								Всички {search.allModelOptions.length}
								<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
							</button>
						{/if}
					</div>
					<div class="mh-chips mh-chips--models">
						{#each search.modelChips as option (option.model)}
							{@const isSelected = search.selectedModels.includes(option.model)}
							<button
								type="button"
								class={`mh-chip mh-chip--model${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleModel(option.model)}
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
								onclick={() => search.openFacet('body')}
							>
								Всички {data.bodyTypes.length}
								<ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
							</button>
						{/if}
					</div>
					<div class="mh-chips">
						{#each bodyChips as body (body)}
							{@const isSelected = search.selectedBodies.includes(body)}
							<button
								type="button"
								class={`mh-chip mh-chip--body${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleBody(body)}
							>
								{@render bodyTypeChipIcon(bodyChipIconFor(body))}
								<span>{bodyLabel(body)}</span>
							</button>
						{/each}
					</div>
				</div>
				<label class="mh-search-sheet__group">
					<span>Бюджет</span>
					<select class="mh-price-select" bind:value={search.searchPrice}>
						<option value="">Всички цени</option>
						{#each data.budgetTiles.filter((tile) => tile.value !== 'all') as tile (tile.value)}
							<option value={tile.value}>{tile.label}</option>
						{/each}
					</select>
				</label>
			</div>

			<a class="mh-search-sheet__go" href={resolve(search.searchHref)}>Виж автомобилите →</a>
		{:else}
			<header>
				<div class="mh-facet-head">
					<button
						type="button"
						class="mh-facet-back"
						aria-label="Назад"
						onclick={search.backToMain}
					>
						<ChevronLeft size={20} strokeWidth={2.5} />
					</button>
					<div>
						<span>Избери</span>
						<strong id="mh-search-title">{search.facetTitle}</strong>
					</div>
				</div>
				<button type="button" aria-label="Затвори" onclick={closeSearch}>
					<X size={19} strokeWidth={2.5} />
				</button>
			</header>

			<div class="mh-search-sheet__body">
				{#if search.searchView === 'brand' || search.searchView === 'model'}
					<label class="mh-search-sheet__field">
						<Search size={19} strokeWidth={2.3} aria-hidden="true" />
						<input
							type="search"
							bind:value={search.facetQuery}
							placeholder={search.searchView === 'brand' ? 'Търси марка' : 'Търси модел'}
							autocomplete="off"
							aria-label={search.searchView === 'brand' ? 'Търси марка' : 'Търси модел'}
						/>
					</label>
				{/if}

				<div class="mh-facet-list">
					{#if search.searchView === 'brand'}
						{#each search.facetBrandList as brand (brand)}
							{@const logo = brandLogos[brand]}
							{@const isSelected = search.selectedBrands.includes(brand)}
							<button
								type="button"
								class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleBrand(brand)}
							>
								<span class="mh-facet-row__label">
									{#if logo}
										<span class="mh-facet-row__logo" aria-hidden="true">
											<img src={logo} alt="" loading="lazy" />
										</span>
									{:else}
										<span class="mh-facet-row__mark" aria-hidden="true">{brandMark(brand)}</span>
									{/if}
									<span>{brand}</span>
								</span>
								{#if isSelected}
									<Check size={18} strokeWidth={2.6} aria-hidden="true" />
								{/if}
							</button>
						{/each}
						{#if !search.facetBrandList.length}
							<p class="mh-facet-empty">Няма марки по това търсене.</p>
						{/if}
					{:else if search.searchView === 'model'}
						{#each search.facetModelList as option (option.model)}
							{@const isSelected = search.selectedModels.includes(option.model)}
							<button
								type="button"
								class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleModel(option.model)}
							>
								<span class="mh-facet-row__label"><span>{option.model}</span></span>
								{#if isSelected}
									<Check size={18} strokeWidth={2.6} aria-hidden="true" />
								{:else}
									<small>{option.count}</small>
								{/if}
							</button>
						{/each}
						{#if !search.facetModelList.length}
							<p class="mh-facet-empty">Няма модели по това търсене.</p>
						{/if}
					{:else}
						{#each data.bodyTypes as body (body)}
							{@const isSelected = search.selectedBodies.includes(body)}
							<button
								type="button"
								class={`mh-facet-row${isSelected ? ' is-active' : ''}`}
								aria-pressed={isSelected}
								onclick={() => search.toggleBody(body)}
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

			<button class="mh-search-sheet__go" type="button" onclick={search.backToMain}>Готово →</button
			>
		{/if}
	</div>
</MobileFullSheet>
