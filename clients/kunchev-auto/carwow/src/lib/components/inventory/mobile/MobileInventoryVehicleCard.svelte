<script lang="ts">
	import { resolve } from '$app/paths';
	import DayNightSpecIcon from '$lib/components/shared/icons/DayNightSpecIcon.svelte';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import { shortFuel } from '$lib/utils/format';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';

	let { vehicle }: { vehicle: InventoryListVehicle } = $props();
</script>

<article class="mobile-inventory-card">
	<a
		class="mobile-inventory-card__link"
		href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
		aria-label={`Виж ${vehicle.shortTitle} ${vehicle.year}`}
	>
		<div class="mobile-inventory-card__media">
			<img
				src={vehicle.image}
				alt={vehicle.shortTitle}
				loading="lazy"
				decoding="async"
				data-daynight-image-fallback
				use:daynightImageFallback
			/>
			<span>{vehicle.badges[0] ?? 'Наличен'}</span>
		</div>
		<div class="mobile-inventory-card__body">
			<div class="mobile-inventory-card__title">
				<h3>{vehicle.shortTitle}</h3>
				<div class="mobile-inventory-card__price">
					<span class="mobile-inventory-card__price-stack">
						<strong>{vehicle.priceEur}</strong>
						<span>{vehicle.monthly}</span>
					</span>
					<span class="mobile-inventory-card__arrow" aria-hidden="true">
						<svg viewBox="0 0 20 20" fill="none">
							<path
								d="M4.25 10H15.25"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
							<path
								d="M10.75 5.5L15.25 10L10.75 14.5"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</div>
			</div>
			<p>{vehicle.conditionLine}</p>
			<ul aria-label="Основни данни">
				<li>
					<DayNightSpecIcon name="mileage" size={15} />
					{vehicle.mileage}
				</li>
				<li>
					<DayNightSpecIcon name="year" size={15} />
					{vehicle.year}
				</li>
				<li>
					<DayNightSpecIcon name="fuel" size={15} />
					{shortFuel(vehicle.fuel)}
				</li>
				<li>
					<DayNightSpecIcon name="transmission" size={15} />
					{vehicle.transmission}
				</li>
			</ul>
		</div>
	</a>
</article>
