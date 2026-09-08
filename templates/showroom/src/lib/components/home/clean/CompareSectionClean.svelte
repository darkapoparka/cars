<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { HomeFiveComparePair, HomeFiveCompareVehicle } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	// Clean Svelte 5 + Tailwind v4 rebuild of the homepage "Compare selected vehicles"
	// strip — dark-green band header + two pair cards (left VS right), each vehicle a
	// flat card linking to its PDP. No Auxero classes, no swiper, no.
	// The pair is a 2-row grid (images row 1, info row 2) so the VS badge centers on
	// the image band, matching the live section.
	let {
		pairs,
		copy
	}: {
		pairs: HomeFiveComparePair[];
		copy: HomePageCopy;
	} = $props();
</script>

{#snippet vehicleCol(vehicle: HomeFiveCompareVehicle, side: 'left' | 'right')}
	<a
		class={['cmp-vehicle group/veh text-bc-ink', side === 'left' ? 'cmp-left' : 'cmp-right']}
		href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
	>
		<span class="cmp-image rounded-bc-md bg-bc-surface-soft transition-colors">
			<img
				src={vehicle.image}
				alt={vehicle.title}
				width="320"
				height="200"
				loading="lazy"
				decoding="async"
			/>
		</span>
		<span class="cmp-content">
			<span class="text-[13px] leading-[18px] font-bold text-bc-muted uppercase">
				{vehicle.brand}
			</span>
			<span class="line-clamp-2 text-[15px] leading-[21px] font-semibold text-bc-ink-soft">
				{vehicle.title}
			</span>
			<span class="mt-0.5 text-[20px] leading-[26px] font-extrabold text-bc-accent-contrast">
				{vehicle.priceLabel}
			</span>
		</span>
	</a>
{/snippet}

{#if pairs.length}
	<section class="bg-bc-bg py-16 font-bc-body" aria-label={copy.compareTitle}>
		<div class="bc-container">
			<!-- Dark-green band header -->
			<div
				class="mb-[42px] flex items-center justify-between gap-4 overflow-hidden rounded-bc-md px-7 py-6 ring-1 ring-white/10 ring-inset"
				style="background: linear-gradient(135deg, #2a0c0c 0%, #151518 58%, #17171a 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);"
			>
				<h2 class="text-bc-h3 font-semibold text-white md:text-[34px] md:leading-[40px]">
					{copy.compareTitle}
				</h2>
				<a
					href={resolve('/compare')}
					class="inline-flex h-11 shrink-0 items-center gap-2 rounded-bc-pill bg-bc-accent px-6 text-sm font-semibold text-bc-accent-contrast transition-colors hover:bg-bc-hover-accent hover:text-white"
				>
					{copy.commonCta}
					<ArrowRight class="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} aria-hidden="true" />
				</a>
			</div>

			<div class="grid gap-[30px] md:grid-cols-2">
				{#each pairs as pair (`${pair.left.slug}:${pair.right.slug}`)}
					<div class="cmp-pair rounded-bc-md border border-bc-border bg-white">
						{@render vehicleCol(pair.left, 'left')}
						<div class="cmp-vs" aria-hidden="true">VS</div>
						{@render vehicleCol(pair.right, 'right')}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		grid-template-rows: auto auto;
		gap: 18px;
		min-height: 286px;
		padding: 22px;
	}

	/* The vehicle anchor is layout-transparent so its image + content land directly
	   in the pair grid (image row 1, content row 2) — this centers VS on the images. */
	.cmp-vehicle {
		display: contents;
	}

	.cmp-image {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		padding: 12px;
	}

	.cmp-image img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* Calm hover: tint the image plate only (no transform). */
	.cmp-vehicle:hover .cmp-image,
	.cmp-vehicle:focus-visible .cmp-image {
		background: #fff1f1;
	}

	.cmp-content {
		display: grid;
		gap: 4px;
		justify-items: center;
		min-width: 0;
		text-align: center;
	}

	.cmp-left .cmp-image {
		grid-column: 1;
		grid-row: 1;
	}
	.cmp-left .cmp-content {
		grid-column: 1;
		grid-row: 2;
	}
	.cmp-right .cmp-image {
		grid-column: 3;
		grid-row: 1;
	}
	.cmp-right .cmp-content {
		grid-column: 3;
		grid-row: 2;
	}

	.cmp-vs {
		grid-column: 2;
		grid-row: 1;
		align-self: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent-bright-soft);
		color: var(--bc-accent-contrast);
		font-size: 14px;
		font-weight: 700;
	}

	@media (max-width: 767px) {
		.cmp-pair {
			grid-template-rows: auto;
			min-height: 0;
			padding: 16px 14px;
		}

		.cmp-vs {
			width: 36px;
			height: 36px;
			font-size: var(--bc-text-micro);
		}
	}
</style>
