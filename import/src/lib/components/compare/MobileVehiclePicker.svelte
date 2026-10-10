<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import type { VehicleCardSummary } from '$lib/domain/vehicle-card';
	import { vehicleImageDelivery } from '$lib/utils/vehicle-images';
	import { imageFallback } from '$lib/browser/image-fallback';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import SearchField from '$lib/components/common/SearchField.svelte';
	let {
		open = $bindable(false),
		cars,
		english,
		onselect,
		onclose
	}: {
		open?: boolean;
		cars: VehicleCardSummary[];
		english: boolean;
		onselect: (slug: string) => void;
		onclose?: () => void;
	} = $props();
	let query = $state('');
	const results = $derived(
		cars.filter((car) =>
			[car.title, car.brand, car.year]
				.join(' ')
				.toLocaleLowerCase()
				.includes(query.trim().toLocaleLowerCase())
		)
	);
</script>

<MobileSheet bind:open title={english ? 'Choose a car' : 'Избери автомобил'} {onclose}>
	<div class="vehicle-picker">
		<SearchField
			bind:value={query}
			label={english ? 'Search cars to compare' : 'Търси автомобил за сравнение'}
			placeholder={english ? 'Make, model or year' : 'Марка, модел или година'}
			controls="compare-picker-results"
		/>
		<p class="vehicle-picker__count" role="status">
			{results.length}
			{english
				? results.length === 1
					? 'car'
					: 'cars'
				: results.length === 1
					? 'автомобил'
					: 'автомобила'}
		</p>
		<div id="compare-picker-results" class="vehicle-picker__results">
			{#each results as car (car.slug)}
				{@const image = vehicleImageDelivery(car.image)}
				<button
					type="button"
					class="vehicle-picker__car"
					onclick={() => onselect(car.slug)}
					aria-label={(english ? 'Add ' : 'Добави ') + car.title}
				>
					<img
						use:imageFallback
						src={image.src}
						srcset={image.srcset}
						sizes="112px"
						alt=""
						width="168"
						height="112"
						loading="lazy"
						decoding="async"
					/>
					<span class="vehicle-picker__body"
						><strong>{car.title}</strong><span>{car.year} · {car.mileageLabel}</span><b
							>{car.priceLabel}</b
						></span
					>
					<Plus size={20} aria-hidden="true" />
				</button>
			{:else}<div class="vehicle-picker__empty">
					<p>{english ? 'No matching cars' : 'Няма намерени автомобили'}</p>
					<button type="button" onclick={() => (query = '')}
						>{english ? 'Clear search' : 'Изчисти търсенето'}</button
					>
				</div>{/each}
		</div>
	</div>
</MobileSheet>

<style>
	.vehicle-picker {
		display: grid;
		gap: var(--bc-space-3);
		min-width: 0;
	}
	.vehicle-picker__count {
		margin: 0;
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	.vehicle-picker__results {
		display: grid;
		gap: var(--bc-space-2);
	}
	.vehicle-picker__car {
		display: grid;
		grid-template-columns: minmax(76px, 30%) minmax(0, 1fr) 20px;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: 112px;
		padding: var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
		color: var(--bc-ink);
		text-align: left;
		font: inherit;
	}
	.vehicle-picker__car img {
		display: block;
		width: 100%;
		aspect-ratio: 1.5;
		height: auto;
		border-radius: var(--bc-radius-md);
		object-fit: cover;
	}
	.vehicle-picker__body {
		min-width: 0;
		display: grid;
		gap: var(--bc-space-1);
	}
	.vehicle-picker__body strong {
		font: var(--bc-weight-heading) var(--bc-text-control)/1.2 var(--bc-font-heading);
		overflow-wrap: anywhere;
	}
	.vehicle-picker__body > span {
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
	}
	.vehicle-picker__body b {
		font-size: var(--bc-text-body);
		font-weight: var(--bc-weight-heading);
	}
	.vehicle-picker__empty {
		display: grid;
		gap: var(--bc-space-2);
		padding-block: var(--bc-space-4);
	}
	.vehicle-picker__empty p {
		margin: 0;
	}
	.vehicle-picker__empty button {
		min-height: var(--bc-control-height-primary);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: inherit;
	}
</style>
