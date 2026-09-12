<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { SlidersHorizontal, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import {
		emptyImportCriteria,
		importCountries,
		importCriteriaFromParams,
		importCriteriaSummary,
		importCriteriaUrl,
		importFuels,
		importMakes,
		importTransmissions
	} from '$lib/data/import-criteria';
	const criteria = $derived(importCriteriaFromParams(page.url.searchParams));
	const activeCount = $derived(Object.values(criteria).filter(Boolean).length);
	const summary = $derived(importCriteriaSummary(criteria));
	let open = $state(false);
	let draft = $state({ ...emptyImportCriteria });
	const years = Array.from({ length: 37 }, (_, index) => String(new Date().getFullYear() - index));
	const openFilters = () => {
		draft = { ...criteria };
		open = true;
	};
	const apply = async (event: SubmitEvent) => {
		event.preventDefault();
		await goto(resolve(importCriteriaUrl(page.url, draft) as '/import'), {
			noScroll: true,
			keepFocus: true
		});
		open = false;
	};
</script>

<div class="import-browse">
	<div class="import-browse__toolbar">
		<button
			class="import-browse__filter"
			type="button"
			onclick={openFilters}
			aria-label={activeCount ? `Филтри за внос, ${activeCount} избрани` : 'Филтри за внос'}
			aria-haspopup="dialog"
		>
			<SlidersHorizontal size={18} aria-hidden="true" />
			{#if activeCount}<span aria-hidden="true">{activeCount}</span>{/if}
		</button>
		<nav class="import-browse__countries" aria-label="Държава за внос">
			{#each importCountries as country (country.value)}
				<a
					href={resolve(
						importCriteriaUrl(page.url, { ...criteria, origin: country.value }) as '/import'
					)}
					aria-current={criteria.origin === country.value ? 'true' : undefined}
					data-sveltekit-noscroll
				>
					{country.label}
				</a>
			{/each}
		</nav>
	</div>
	{#if summary}
		<div class="import-browse__selection">
			<p class="import-browse__summary" aria-live="polite">{summary}</p>
			{#if activeCount}
				<a
					class="import-browse__clear"
					href={resolve(importCriteriaUrl(page.url, emptyImportCriteria) as '/import')}
					data-sveltekit-noscroll>Изчисти</a
				>
			{/if}
		</div>
	{/if}
	<p class="import-browse__availability" role="status">Няма публикувани оферти за внос.</p>
</div>

<Drawer.Root bind:open direction="bottom" fixed>
	<Drawer.Overlay class="import-filters-backdrop" />
	<Drawer.Content class="import-filters-sheet">
		<Drawer.Handle class="import-filters-handle" />
		<div class="import-filters-heading">
			<Drawer.Title class="import-filters-title">Филтри за внос</Drawer.Title>
			<Drawer.Close class="import-filters-close" aria-label="Затвори филтрите"
				><X size={22} aria-hidden="true" /></Drawer.Close
			>
		</div>
		<Drawer.Description class="import-filters-description"
			>Избери какъв автомобил търсиш и откъде.</Drawer.Description
		>
		<form onsubmit={apply}>
			<div class="import-filters-fields">
				<label class="wide" for="import-filter-origin"
					>Държава<select id="import-filter-origin" bind:value={draft.origin}
						>{#each importCountries as country (country.value)}<option value={country.value}
								>{country.value ? country.label : 'Без значение'}</option
							>{/each}</select
					></label
				>
				<label for="import-filter-make"
					>Марка<input
						id="import-filter-make"
						list="import-makes"
						placeholder="Всички марки"
						maxlength="60"
						bind:value={draft.make}
					/></label
				>
				<datalist id="import-makes"
					>{#each importMakes as make (make)}<option value={make}></option>{/each}</datalist
				>
				<label for="import-filter-model"
					>Модел<input
						id="import-filter-model"
						placeholder="Всички модели"
						maxlength="80"
						bind:value={draft.model}
					/></label
				>
				<label for="import-filter-year"
					>Година от<select id="import-filter-year" bind:value={draft.minYear}
						><option value="">Без значение</option>{#each years as year (year)}<option value={year}
								>{year}</option
							>{/each}</select
					></label
				>
				<label for="import-filter-budget"
					>Бюджет до (€)<input
						id="import-filter-budget"
						inputmode="numeric"
						pattern="[0-9]*"
						maxlength="8"
						placeholder="Без ограничение"
						bind:value={draft.maxPrice}
					/></label
				>
				<label for="import-filter-fuel"
					>Гориво<select id="import-filter-fuel" bind:value={draft.fuel}
						><option value="">Всички</option>{#each importFuels as fuel (fuel)}<option value={fuel}
								>{fuel}</option
							>{/each}</select
					></label
				>
				<label for="import-filter-transmission"
					>Скорости<select id="import-filter-transmission" bind:value={draft.transmission}
						><option value="">Всички</option
						>{#each importTransmissions as transmission (transmission)}<option value={transmission}
								>{transmission}</option
							>{/each}</select
					></label
				>
			</div>
			<footer>
				<button type="button" class="reset" onclick={() => (draft = { ...emptyImportCriteria })}
					>Изчисти</button
				><button class="apply" type="submit">Приложи филтрите</button>
			</footer>
		</form>
	</Drawer.Content>
</Drawer.Root>

<style>
	.import-browse {
		margin-bottom: 12px;
	}
	.import-browse__countries {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		min-width: 0;
		padding: 2px;
		scrollbar-width: none;
	}
	.import-browse__countries::-webkit-scrollbar {
		display: none;
	}
	.import-browse__countries a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
		min-height: 44px;
		padding: 0 16px;
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-raised);
		color: #17191c;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}
	.import-browse__countries a[aria-current] {
		background: var(--bc-accent);
		color: #ffffff;
	}
	.import-browse__toolbar {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.import-browse__filter {
		position: relative;
		display: grid;
		place-items: center;
		flex: 0 0 44px;
		min-height: 44px;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-raised);
		color: #17191c;
		padding: 0 12px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.import-browse__filter span {
		position: absolute;
		top: -3px;
		right: -3px;
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--bc-accent);
		color: #ffffff;
		font-size: 12px;
	}
	.import-browse__clear {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		color: #555b63;
		text-decoration: underline;
		font-size: 13px;
	}
	.import-browse__selection {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 8px;
	}
	.import-browse__summary {
		flex: 1;
		margin: 0;
		color: #17191c;
		font-size: 14px;
		line-height: 20px;
		overflow-wrap: anywhere;
	}
	.import-browse__availability {
		margin: 12px 0 0;
		color: #555b63;
		font-size: 13px;
		line-height: 19px;
	}
	.import-browse a:focus-visible,
	.import-browse button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	:global(.import-filters-backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		background: rgb(0 0 0 / 0.5);
	}
	:global(.import-filters-sheet) {
		position: fixed;
		inset: auto 0 0;
		z-index: 1201;
		max-height: calc(100dvh - 24px);
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 12px 16px max(20px, env(safe-area-inset-bottom));
		background: var(--bc-bg);
		color: #17191c;
		border-radius: 20px 20px 0 0;
		box-shadow: none;
		outline: none;
	}
	:global(.import-filters-handle) {
		width: 40px;
		height: 4px;
		margin: 0 auto 12px;
		border-radius: 999px;
		background: var(--bc-border-strong);
	}
	.import-filters-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	:global(.import-filters-title) {
		margin: 0;
		font-size: 23px;
		line-height: 28px;
		font-weight: 700;
	}
	:global(.import-filters-close) {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface);
		color: #17191c;
		cursor: pointer;
	}
	:global(.import-filters-description) {
		margin: 4px 0 20px;
		color: #555b63;
		font-size: 14px;
		line-height: 20px;
	}
	.import-filters-fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px 12px;
	}
	label {
		display: grid;
		gap: 6px;
		min-width: 0;
		color: #34383d;
		font-size: 13px;
		font-weight: 600;
	}
	.wide {
		grid-column: 1 / -1;
	}
	input,
	select {
		width: 100%;
		min-width: 0;
		height: 48px !important;
		padding: 0 12px !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-surface-soft) !important;
		color: #17191c;
		font-size: 16px;
		box-shadow: none !important;
	}
	input::placeholder {
		color: #626973;
	}
	input:focus-visible,
	select:focus-visible,
	footer button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	footer {
		position: sticky;
		bottom: -20px;
		display: flex;
		gap: 12px;
		margin-top: 20px;
		padding: 12px 0;
		background: var(--bc-bg);
	}
	footer button {
		min-height: 48px;
		border-radius: 999px;
		padding: 0 16px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.reset {
		border: 1px solid var(--bc-border);
		background: #ffffff;
		color: #17191c;
	}
	.apply {
		flex: 1;
		border: 0;
		background: var(--bc-accent);
		color: #ffffff;
	}
</style>
