<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	// Clean Svelte 5 + Tailwind v4 rebuild of the homepage "Browse" section.
	// Two sub-blocks, each = a dark band header (title + red CTA pill) over a
	// static CSS grid of flat cards. The legacy component used swiper rails, but on
	// desktop those render as static grids (see baseline 03/04.png) — so swiper is
	// dropped entirely in favour of plain CSS grid.
	//   (a) Browse by brand — 6-col grid of contained logo + name + count cards,
	//       with a final "all brands" tile (card.allTile) carrying an arrow glyph.
	//   (b) Browse by type  — 4-col grid of car-cutout + label cards, last = View all.
	// Flat card language: 1px border-bc-border, white surface, rounded-bc-md (8px),
	// no shadow, no hover transform — hover only shifts colour/bg/border.
	let {
		brandCards,
		typeCards,
		copy
	}: {
		brandCards: HomeFiveBrandCard[];
		typeCards: HomeFiveTypeCard[];
		copy: HomePageCopy;
	} = $props();

	// Stocked brands route to filtered inventory; import-on-request brands carry an
	// explicit href. Either way the data provides a local path.
	const brandPath = (card: HomeFiveBrandCard) =>
		card.href ?? `/inventory?brand=${encodeURIComponent(card.query)}`;
</script>

{#snippet bandHeader(title: string, cta: string, ctaHref: string)}
	<div
		class="mb-6 flex items-center justify-between gap-4 rounded-bc-section px-6 py-6 ring-1 ring-white/10 sm:px-7"
		style="background: linear-gradient(135deg, #2a0c0c 0%, #151518 58%, #17171a 100%);"
	>
		<!-- Bespoke dark neutral band with a restrained red undertone. -->
		<h2 class="m-0 text-[clamp(20px,1.8vw,26px)] leading-tight font-semibold text-white">
			{title}
		</h2>
		<a
			href={resolve(ctaHref as `/${string}`)}
			class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-bc-pill bg-bc-accent px-[18px] text-sm leading-none font-semibold whitespace-nowrap text-bc-accent-contrast transition-colors hover:bg-white hover:text-bc-accent focus-visible:bg-white focus-visible:text-bc-accent"
		>
			{cta}
			<ArrowRight class="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} aria-hidden="true" />
		</a>
	</div>
{/snippet}

<section class="bg-bc-bg py-16 font-bc-body" aria-label={copy.brandTitle}>
	<div class="bc-container">
		<!-- (a) Browse by brand -->
		<div class="mb-12">
			{@render bandHeader(copy.brandTitle, copy.brandCta, '/inventory')}

			<div
				class="grid grid-cols-2 gap-x-[18px] gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-[30px] lg:gap-y-[22px]"
			>
				{#each brandCards as card (card.query)}
					<a
						href={resolve(brandPath(card) as `/${string}`)}
						class="flex min-h-[148px] flex-col items-center justify-center rounded-bc-md border border-bc-border bg-bc-surface px-3 py-4 text-center transition-colors hover:border-[#a51717] hover:bg-[#fff1f1] focus-visible:border-[#a51717] focus-visible:bg-[#fff1f1] lg:min-h-[168px]"
					>
						<!-- Red-tint hover keeps the clean route aligned with the ELIQ palette. -->
						<span
							class="mb-2.5 grid h-[60px] w-[100px] place-items-center lg:h-[82px] lg:w-[112px]"
						>
							{#if card.allTile}
								<span
									class="grid h-[46px] w-[46px] place-items-center rounded-full border-[1.5px] border-bc-ink text-bc-ink"
									aria-hidden="true"
								>
									<ArrowRight class="h-5 w-5" strokeWidth={2} />
								</span>
							{:else}
								<img
									class="h-[60px] w-full object-contain lg:h-[80px]"
									src={card.image}
									alt=""
									width="112"
									height="80"
									loading="lazy"
									decoding="async"
								/>
							{/if}
						</span>
						<span
							class="max-w-full truncate text-[15px] leading-snug font-semibold text-bc-ink lg:text-base"
						>
							{card.name}
						</span>
						<!-- count colour darkened to clear contrast over the white card -->
						<span class="mt-0.5 text-xs leading-tight font-medium text-bc-muted lg:text-sm">
							{card.count}
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- (b) Browse by type -->
		<div>
			{@render bandHeader(copy.typeTitle, copy.typeCta, '/inventory?view=4')}

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-6 lg:gap-y-[22px]">
				{#each typeCards as card (card.image)}
					<a
						href={resolve(card.href as `/${string}`)}
						class="group flex min-h-[150px] flex-col items-center justify-end rounded-bc-md border border-bc-border bg-bc-surface px-2.5 pt-2 pb-3.5 text-center transition-colors hover:border-[#a51717] hover:bg-[#fff1f1] focus-visible:border-[#a51717] focus-visible:bg-[#fff1f1] lg:min-h-[218px]"
					>
						<span class="flex h-[88px] w-full items-end justify-center lg:h-[150px]">
							<img
								class="max-h-[84px] w-[94%] max-w-[94%] object-contain lg:max-h-[146px]"
								src={card.image}
								alt={card.label}
								width="360"
								height="220"
								loading="lazy"
								decoding="async"
							/>
						</span>
						<span
							class="mt-3 block leading-tight font-semibold whitespace-nowrap text-bc-ink lg:text-xl"
						>
							{card.label}
						</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
