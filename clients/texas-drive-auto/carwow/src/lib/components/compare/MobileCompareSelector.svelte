<script lang="ts">
	import { Search, X, Check, Plus } from '@lucide/svelte';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import type { Car } from '$lib/data/daynight-vehicles';
	import { MAX_COMPARE_VEHICLES } from '$lib/utils/garage';
	import { getGarageContext } from '$lib/state/garage.svelte';
	let { onClose, catalogue }: { onClose: () => void; catalogue: Car[] } = $props();
	const garage = getGarageContext();
	let open = $state(true);
	let selected = $state([...garage.compare]);
	let query = $state('');
	const results = $derived(
		catalogue.filter((car) =>
			`${car.shortTitle} ${car.year} ${car.fuel}`
				.toLocaleLowerCase()
				.includes(query.trim().toLocaleLowerCase())
		)
	);
	function toggle(slug: string) {
		selected = selected.includes(slug)
			? selected.filter((item) => item !== slug)
			: selected.length < MAX_COMPARE_VEHICLES
				? [...selected, slug]
				: selected;
	}
	function apply() {
		for (const slug of [...garage.compare])
			if (!selected.includes(slug)) garage.toggleCompare(slug);
		for (const slug of selected) if (!garage.compare.includes(slug)) garage.toggleCompare(slug);
		onClose();
	}
</script>

<MobileFullSheet bind:open labelledBy="compare-selector-title" {onClose}>
	<div class="selector">
		<header>
			<h2 id="compare-selector-title">Избери автомобили</h2>
			<button class="close" onclick={onClose} aria-label="Затвори избора"><X size={22} /></button>
		</header>
		<div class="search">
			<Search size={20} /><input
				type="search"
				aria-label="Търси автомобили за сравнение"
				placeholder="Марка, модел или година"
				bind:value={query}
			/>
		</div>
		<p class="status" role="status">
			{selected.length} от {MAX_COMPARE_VEHICLES} избрани · {selected.length ===
			MAX_COMPARE_VEHICLES
				? 'Премахнете един, за да добавите друг.'
				: `Изберете до ${MAX_COMPARE_VEHICLES} автомобила.`}
		</p>
		<div class="results">
			{#each results as car (car.slug)}
				<button
					class="vehicle"
					class:selected={selected.includes(car.slug)}
					aria-pressed={selected.includes(car.slug)}
					disabled={selected.length === MAX_COMPARE_VEHICLES && !selected.includes(car.slug)}
					onclick={() => toggle(car.slug)}
				>
					<img src={car.image} alt="" loading="lazy" />
					<span class="details"
						><strong>{car.shortTitle}</strong><small>{car.year} · {car.fuel}</small><b
							>{car.priceEur}</b
						></span
					>
					<span class="mark" aria-hidden="true"
						>{#if selected.includes(car.slug)}<Check size={18} />{:else}<Plus
								size={18}
							/>{/if}</span
					>
				</button>
			{:else}<p class="no-results">
					Няма автомобили за „{query}“. Опитайте друга марка или модел.
				</p>{/each}
		</div>
		<footer>
			<button class="done" onclick={apply}
				>Готово · {selected.length} / {MAX_COMPARE_VEHICLES}</button
			>
		</footer>
	</div>
</MobileFullSheet>

<style>
	.selector {
		display: grid;
		grid-template-rows: auto auto auto minmax(0, 1fr) auto;
		min-height: 0;
		height: 100%;
		background: var(--sa-surface, #fff);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: calc(10px + env(safe-area-inset-top)) 16px 8px;
	}
	h2 {
		margin: 0;
		font-size: var(--sa-text-xl);
		line-height: 1.25;
		color: var(--sa-ink);
	}
	button,
	input {
		font: inherit;
	}
	.close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
	}
	.search {
		margin: 0 16px;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 12px;
		border: 1px solid var(--sa-line);
		border-radius: 8px;
		background: var(--sa-fill);
	}
	input {
		width: 100%;
		min-width: 0;
		height: 48px;
		border: 0;
		background: transparent;
		outline: none;
		font-size: var(--sa-text-base);
		color: var(--sa-ink);
	}
	.search:focus-within {
		outline: 2px solid var(--sa-red);
	}
	.status {
		margin: 12px 16px;
		font-size: var(--sa-text-caption);
		line-height: 1.4;
		color: var(--sa-ink-soft);
	}
	.results {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 16px 16px;
	}
	.vehicle {
		display: grid;
		grid-template-columns: 88px minmax(0, 1fr) 24px;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 0;
		text-align: left;
		border: 0;
		border-bottom: 1px solid var(--sa-line);
		background: transparent;
		color: var(--sa-ink);
	}
	.vehicle img {
		width: 88px;
		height: 72px;
		object-fit: cover;
		border-radius: 6px;
	}
	.details {
		display: grid;
		gap: 4px;
	}
	strong,
	b {
		font-size: var(--sa-text-caption);
		line-height: 1.35;
	}
	small {
		font-size: var(--sa-text-caption);
		color: var(--sa-ink-soft);
	}
	.mark {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border: 1px solid var(--sa-line);
		border-radius: 50%;
	}
	.selected .mark {
		background: var(--sa-red);
		border-color: var(--sa-red);
		color: white;
	}
	.vehicle:disabled {
		opacity: 0.45;
	}
	footer {
		padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--sa-line);
	}
	.done {
		width: 100%;
		min-height: 48px;
		border: 0;
		border-radius: 8px;
		background: var(--sa-red);
		color: white;
		font-weight: var(--sa-weight-semibold);
	}
	button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	.no-results {
		font-size: var(--sa-text-caption);
		line-height: 1.5;
		color: var(--sa-ink-soft);
	}

	/* Mobile typography contract */
	.selector h2 {
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}
	.selector input {
		font-size: var(--sa-mobile-type-input);
		font-weight: var(--sa-weight-regular);
	}
	.selector .status {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}
	.selector strong,
	.selector b {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-mobile-leading-meta);
	}
	.selector small {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-medium);
	}
	.selector .done {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
	}
	.selector .no-results {
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-body);
	}
</style>
