<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { HomeMobileVehicle } from '$lib/types/home';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';
	import { shortFuel } from '$lib/utils/format';
	let {
		vehicles,
		onSelect
	}: {
		vehicles: HomeMobileVehicle[];
		onSelect: (car: HomeMobileVehicle) => void;
	} = $props();
</script>

{#if vehicles.length}
	<section class="import-examples" aria-label="Примерни автомобили">
		<div class="import-examples__grid">
			{#each vehicles as car (car.slug)}
				<button
					class="import-example"
					type="button"
					onclick={() => onSelect(car)}
					aria-label={`Потърси подобен ${car.shortTitle}`}
				>
					<span class="import-example__media">
						<img
							src={car.image}
							alt={car.shortTitle}
							loading="lazy"
							decoding="async"
							use:daynightImageFallback
						/>
						<span class="import-example__badge">Пример</span>
					</span>
					<span class="import-example__body">
						<span class="import-example__brand">{car.brand}</span>
						<strong class="import-example__title">{car.model}</strong>
						<span class="import-example__meta">{car.year} · {shortFuel(car.fuel)}</span>
					</span>
					<span class="import-example__foot">
						<span class="import-example__price">{car.priceEur}</span>
						<span class="import-example__go" aria-hidden="true"
							><ChevronRight size={16} strokeWidth={3} /></span
						>
					</span>
				</button>
			{/each}
		</div>
	</section>
{/if}

<style>
	.import-examples {
		display: grid;
		gap: 10px;
		padding: 0 0 12px;
	}
	.import-examples__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px 10px;
	}
	.import-example {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 0;
		border: 0;
		border-radius: 8px;
		padding: 0;
		background: #e7eaee;
		color: var(--sa-ink);
		text-align: left;
		cursor: pointer;
	}
	.import-example__media {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}
	.import-example__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: var(--sa-fill);
	}
	.import-example__badge {
		position: absolute;
		top: 7px;
		left: 7px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-ink);
		padding: 4px 7px;
		color: #fff;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		text-transform: uppercase;
	}
	.import-example__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
		padding: 10px 10px 6px;
		width: 100%;
	}
	.import-example__brand {
		color: #4f5966;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		text-transform: uppercase;
	}
	.import-example__title {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-heading);
		line-height: 1.3;
		overflow-wrap: anywhere;
	}
	.import-example__meta {
		color: #4f5966;
		font-size: var(--sa-text-caption);
		line-height: 1.3;
	}
	.import-example__foot {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		margin-top: auto;
		padding: 0 10px 10px;
	}
	.import-example__price {
		border-radius: 6px;
		background: #fff;
		padding: 4px 6px;
		color: var(--sa-price);
		font-size: var(--sa-text-base);
		line-height: 1.3;
		font-weight: var(--sa-weight-strong);
		white-space: nowrap;
	}
	.import-example__go {
		display: grid;
		width: 28px;
		height: 28px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-ink);
		color: #fff;
	}
	.import-example__go :global(svg),
	.import-example__go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}
	@media (max-width: 359px) {
		.import-example__body {
			padding-inline: 8px;
		}
		.import-example__foot {
			padding-inline: 8px;
			gap: 4px;
		}
		.import-example__price {
			font-size: var(--sa-text-base);
			padding-inline: 5px;
		}
	}
	.import-example:active {
		background: var(--sa-fill);
	}
	.import-example:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
</style>
