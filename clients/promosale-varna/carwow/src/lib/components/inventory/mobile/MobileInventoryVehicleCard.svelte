<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/state';
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
		onclick={(event) => {
			if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
				return;
			event.preventDefault();
			replaceState('', { ...page.state, inventoryScrollY: window.scrollY });
			void goto(resolve('/inventory/[slug]', { slug: vehicle.slug }), {
				state: { inventoryReturn: page.url.pathname + page.url.search }
			});
		}}
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
				<h2>{vehicle.shortTitle}</h2>
				<div class="mobile-inventory-card__price">
					<span class="mobile-inventory-card__price-stack">
						<strong>{vehicle.priceEur}</strong>
						{#if vehicle.monthly !== 'Финансиране по запитване'}<span>{vehicle.monthly}</span>{/if}
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
