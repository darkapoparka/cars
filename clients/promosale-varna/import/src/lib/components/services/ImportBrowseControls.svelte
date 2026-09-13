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
					<img
						class="import-browse__flag"
						src={country.flagSrc}
						alt=""
						aria-hidden="true"
						width="24"
						height="18"
					/>
					<span>{country.label}</span>
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
				<fieldset class="wide import-filters-choice">
					<legend>Държава</legend>
					<div class="import-filters-country-grid">
						{#each importCountries as country (country.value)}
							<button
								type="button"
								class:active={draft.origin === country.value}
								aria-pressed={draft.origin === country.value}
								onclick={() => (draft.origin = country.value)}
							>
								<img
									src={country.flagSrc}
									alt=""
									aria-hidden="true"
									width="24"
									height="18"
								/><strong>{country.label}</strong>
							</button>
						{/each}
					</div>
				</fieldset>
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
					>Година от<input
						id="import-filter-year"
						inputmode="numeric"
						maxlength="4"
						placeholder="Напр. 2021"
						bind:value={draft.minYear}
					/></label
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
				<fieldset class="wide import-filters-choice">
					<legend>Гориво</legend>
					<div class="import-filters-chips">
						{#each importFuels as fuel (fuel)}<button
								type="button"
								class:active={draft.fuel === fuel}
								aria-pressed={draft.fuel === fuel}
								onclick={() => (draft.fuel = draft.fuel === fuel ? '' : fuel)}>{fuel}</button
							>{/each}
					</div>
				</fieldset>
				<fieldset class="wide import-filters-choice">
					<legend>Скорости</legend>
					<div class="import-filters-chips">
						{#each importTransmissions as transmission (transmission)}<button
								type="button"
								class:active={draft.transmission === transmission}
								aria-pressed={draft.transmission === transmission}
								onclick={() =>
									(draft.transmission = draft.transmission === transmission ? '' : transmission)}
								>{transmission}</button
							>{/each}
					</div>
				</fieldset>
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
		margin-bottom: 10px;
	}
	.import-browse__countries {
		display: flex;
		gap: var(--bc-space-2);
		overflow-x: auto;
		min-width: 0;
		padding: 2px;
		scrollbar-width: none;
	}
	.import-browse__flag {
		display: block;
		width: 24px;
		height: 18px;
		flex: 0 0 24px;
		border-radius: 3px;
		object-fit: cover;
	}
	.import-filters-choice {
		display: grid;
		gap: var(--bc-space-2);
		margin: 0;
		border: 0;
		padding: 0;
	}
	.import-filters-choice legend {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: 600;
		padding: 0;
	}
	.import-filters-country-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}
	.import-filters-country-grid button {
		display: grid;
		min-height: 62px;
		place-items: center;
		gap: var(--bc-space-1);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
		padding: var(--bc-space-2);
	}
	.import-filters-country-grid button > img {
		display: block;
		width: 24px;
		height: 18px;
		border-radius: 3px;
		object-fit: cover;
	}
	.import-filters-country-grid button strong {
		font-size: var(--bc-mobile-meta);
		line-height: var(--bc-mobile-meta-leading);
	}
	.import-filters-country-grid button.active {
		border-color: var(--bc-accent);
		background: color-mix(in srgb, var(--bc-accent) 9%, var(--bc-white));
		color: var(--bc-accent-hover);
	}
	.import-filters-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.import-filters-chips button {
		min-height: var(--bc-control-height-standard);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-mobile-label);
		font-weight: 650;
		padding: 0 var(--bc-space-3);
	}
	.import-filters-chips button.active {
		border-color: var(--bc-accent);
		background: color-mix(in srgb, var(--bc-accent) 9%, var(--bc-white));
		color: var(--bc-accent-hover);
	}

	.import-browse__countries::-webkit-scrollbar {
		display: none;
	}
	.import-browse__countries a {
		display: inline-flex;
		align-items: center;
		gap: var(--bc-space-2);
		flex-shrink: 0;
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-4);
		border-radius: var(--bc-radius-control);
		border: 1px solid var(--bc-border);
		background: var(--bc-surface-soft);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-body);
		font-weight: 600;
		white-space: nowrap;
	}
	.import-browse__countries a[aria-current] {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.import-browse__toolbar {
		display: flex;
		gap: var(--bc-space-2);
		align-items: center;
	}
	.import-browse__filter {
		position: relative;
		display: grid;
		place-items: center;
		flex: 0 0 var(--bc-control-height-standard);
		min-height: var(--bc-control-height-standard);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface-soft);
		color: var(--bc-ink);
		padding: 0 var(--bc-space-3);
		font-size: var(--bc-mobile-body);
		font-weight: 600;
		cursor: pointer;
	}
	.import-browse__filter span {
		position: absolute;
		top: -3px;
		right: -3px;
		display: grid;
		place-items: center;
		width: var(--bc-space-5);
		height: var(--bc-space-5);
		border-radius: 50%;
		background: var(--bc-accent);
		color: var(--bc-white);
		font-size: var(--bc-mobile-meta);
	}
	.import-browse__clear {
		display: inline-flex;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		color: var(--bc-copy);
		text-decoration: none !important;
		font-size: var(--bc-mobile-label);
	}
	.import-browse__selection {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		margin-top: var(--bc-space-2);
	}
	.import-browse__summary {
		flex: 1;
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-space-5);
		overflow-wrap: anywhere;
	}
	.import-browse a {
		text-decoration: none !important;
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
		padding: var(--bc-space-3) var(--bc-space-4) max(var(--bc-space-5), env(safe-area-inset-bottom));
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		box-shadow: none;
		outline: none;
	}
	:global(.import-filters-handle) {
		width: 40px;
		height: 4px;
		margin: 0 auto var(--bc-space-3);
		border-radius: var(--bc-radius-control);
		background: var(--bc-border-strong);
	}
	.import-filters-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}
	:global(.import-filters-title) {
		margin: 0;
		font-size: var(--bc-mobile-section-title);
		line-height: var(--bc-mobile-section-title-leading);
		font-weight: 700;
	}
	:global(.import-filters-close) {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		border: 0;
		border-radius: 50%;
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		cursor: pointer;
	}
	:global(.import-filters-description) {
		margin: var(--bc-space-1) 0 var(--bc-space-5);
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-space-5);
	}
	.import-filters-fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-4) var(--bc-space-3);
	}
	label {
		display: grid;
		gap: var(--bc-space-2);
		min-width: 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: 600;
	}
	.wide {
		grid-column: 1 / -1;
	}
	input {
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-primary) !important;
		padding: 0 var(--bc-space-3) !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-white) !important;
		color: var(--bc-ink);
		font-size: var(--bc-text-body);
		box-shadow: none !important;
	}
	input::placeholder {
		color: var(--bc-muted);
	}
	input:focus-visible,
	footer button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	footer {
		position: sticky;
		bottom: calc(-1 * var(--bc-space-5));
		display: flex;
		gap: var(--bc-space-3);
		margin-top: var(--bc-space-5);
		padding: var(--bc-space-3) 0;
		background: var(--bc-bg-strong);
	}
	footer button {
		min-height: var(--bc-control-height-primary);
		border-radius: var(--bc-radius-control);
		padding: 0 var(--bc-space-4);
		font-size: var(--bc-mobile-body);
		font-weight: 600;
		cursor: pointer;
	}
	.reset {
		border: 1px solid var(--bc-border);
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.apply {
		flex: 1;
		border: 0;
		background: var(--bc-accent);
		color: var(--bc-white);
	}
</style>
