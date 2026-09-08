<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Calendar, Cog, Fuel, Gauge, Heart, Images } from '@lucide/svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { VehicleCardCopy } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';

	// Clean Svelte 5 + Tailwind v4 vehicle card for the home "Newest Vehicles" grid.
	// Flat card language: 1px border, white bg, rounded, no shadow, no hover transform —
	// hover only shifts border/bg colors. Reproduces the live HomeFiveVehicleCard:
	// status (mileage) badge + photo-count badge over the photo, favorite heart,
	// brand kicker, title, year/fuel/transmission spec chips, price + monthly + finance
	// link, and a "View details" outline CTA that fills brand-green on hover.
	let { vehicle, copy }: { vehicle: HomeFiveVehicleCardData; copy: VehicleCardCopy } = $props();

	const garage = getGarageContext();
	const isSaved = $derived(garage.isFavorite(vehicle.slug));

	// Curated cutout art (from /megamenu/, *-cutout) sits on a soft media plate with
	// padding via object-contain; real listing photos bleed edge-to-edge via object-cover.
	const isCutout = $derived(
		vehicle.image.includes('cutout') || vehicle.image.includes('/megamenu/')
	);

	function toggleFavorite(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		garage.toggleFavorite(vehicle.slug);
	}
</script>

<article
	class="group/card flex h-full flex-col overflow-hidden rounded-bc-card border border-bc-border bg-white transition-colors hover:border-bc-accent"
>
	<!-- Media: badges over the photo + favorite heart -->
	<div class="relative">
		<a
			href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
			class="block"
			aria-label={vehicle.title}
		>
			<div class="aspect-[3/2] w-full overflow-hidden bg-bc-surface-soft">
				<img
					src={vehicle.image}
					alt={vehicle.title}
					width="660"
					height="440"
					loading="lazy"
					decoding="async"
					class={['h-full w-full', isCutout ? 'object-contain p-4' : 'object-cover']}
				/>
			</div>
		</a>

		<!-- Status badge (mileage) — top-left -->
		<span
			class="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-bc-pill bg-bc-accent px-2.5 py-1 text-xs font-bold text-bc-accent-contrast"
		>
			<Gauge size={13} strokeWidth={2.1} aria-hidden="true" />
			{vehicle.mileageLabel}
		</span>

		<!-- Photo-count badge — bottom-left over the image -->
		<span
			class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-bc-pill bg-bc-ink/75 px-2.5 py-1 text-xs font-semibold text-white"
			aria-label={`${vehicle.photoCount} ${copy.photosAlt}`}
		>
			<Images size={13} strokeWidth={2.1} aria-hidden="true" />
			{vehicle.photoCount}
		</span>

		<!-- Favorite heart — top-right -->
		<button
			type="button"
			onclick={toggleFavorite}
			aria-label={`${copy.savePrefix} ${vehicle.title}`}
			aria-pressed={isSaved}
			class={[
				'absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-bc-border bg-white/90 backdrop-blur-sm transition-colors hover:border-bc-accent hover:text-bc-accent',
				isSaved ? 'text-bc-accent' : 'text-bc-ink-soft'
			]}
		>
			<Heart
				size={17}
				strokeWidth={2}
				fill={isSaved ? 'currentColor' : 'none'}
				aria-hidden="true"
			/>
		</button>
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col p-4">
		<!-- Brand kicker -->
		<a
			href={resolve(`/inventory?brand=${encodeURIComponent(vehicle.brand)}` as '/')}
			class="inline-flex min-h-6 items-center text-[11px] font-bold tracking-[0.14em] text-bc-muted uppercase transition-colors hover:text-bc-accent"
		>
			{vehicle.brand}
		</a>

		<!-- Title -->
		<h3 class="mt-1 truncate text-base leading-snug font-semibold text-bc-ink">
			<a
				href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
				title={vehicle.title}
				class="transition-colors hover:text-bc-accent"
			>
				{vehicle.title}
			</a>
		</h3>

		<!-- Spec chips: year / fuel / transmission -->
		<ul class="mt-3 flex flex-wrap gap-1.5">
			<li
				class="inline-flex items-center gap-1.5 rounded-bc-md border border-bc-border bg-bc-surface-soft px-2.5 py-1 text-xs text-bc-ink-soft"
				aria-label={`${copy.yearAlt}: ${vehicle.year}`}
			>
				<Calendar size={13} strokeWidth={1.9} class="text-bc-muted" aria-hidden="true" />
				<span>{vehicle.year}</span>
			</li>
			<li
				class="inline-flex items-center gap-1.5 rounded-bc-md border border-bc-border bg-bc-surface-soft px-2.5 py-1 text-xs text-bc-ink-soft"
				aria-label={`${copy.fuelAlt}: ${vehicle.fuel}`}
			>
				<Fuel size={13} strokeWidth={1.9} class="text-bc-muted" aria-hidden="true" />
				<span>{vehicle.fuel}</span>
			</li>
			<li
				class="inline-flex items-center gap-1.5 rounded-bc-md border border-bc-border bg-bc-surface-soft px-2.5 py-1 text-xs text-bc-ink-soft"
				aria-label={`${copy.transmissionAlt}: ${vehicle.transmission}`}
			>
				<Cog size={13} strokeWidth={1.9} class="text-bc-muted" aria-hidden="true" />
				<span>{vehicle.transmission}</span>
			</li>
		</ul>

		<!-- Price block — pinned to the bottom -->
		<div class="mt-auto flex items-end justify-between gap-3 pt-4">
			<span class="text-[1.375rem] leading-7 font-semibold whitespace-nowrap text-bc-ink">
				{vehicle.priceLabel}
			</span>
			<span class="flex flex-col items-end gap-0.5 text-right">
				<span class="text-sm whitespace-nowrap text-bc-ink-soft">{vehicle.monthlyLabel}</span>
				<a
					href={resolve('/financing')}
					class="inline-flex min-h-7 items-center text-xs whitespace-nowrap text-bc-muted underline transition-colors hover:text-bc-accent"
				>
					{copy.finance}
				</a>
			</span>
		</div>

		<!-- Actions -->
		<div class="mt-4">
			<a
				href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
				class="flex min-h-11 w-full items-center justify-center gap-2 rounded-bc-md border border-bc-border bg-white px-4 text-[15px] font-bold text-bc-accent-contrast transition-colors hover:border-bc-accent hover:bg-bc-accent"
			>
				<span>{copy.viewDetails}</span>
				<ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
			</a>
		</div>
	</div>
</article>
