<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight, Star } from '@lucide/svelte';

	let { reviews, copy }: { reviews: HomeFiveReview[]; copy: HomePageCopy } = $props();

	// /reviews is a static route (no query string) — resolve() is safe and matches the
	// clean-component idiom. (The "plain href" rule applies only to query-string links.)
	const reviewsHref = resolve('/reviews');

	// English copy ("Client Reviews") vs Bulgarian — drives the stars aria-label only.
	const isEnglish = $derived(copy.reviewsTitle === 'Client Reviews');
	const starsLabel = $derived(isEnglish ? '5 out of 5 stars' : '5 от 5 звезди');

	// Fixed 5-star row; render real <svg> stars (not a glyph string) so they tint cleanly.
	const stars = [0, 1, 2, 3, 4];
</script>

{#if reviews.length}
	<section class="bg-bc-bg py-8 md:py-16">
		<div class="bc-container">
			<!-- Dark-green band header: title left, "Виж всички" CTA pill right.
			     Raw hex gradient — sampled from the Auxero band, no token exists for it. -->
			<div
				class="mb-8 flex items-center justify-between gap-4 overflow-hidden rounded-bc-section px-6 py-6 ring-1 ring-white/10 ring-inset md:mb-9 md:px-7"
				style="background: linear-gradient(135deg, #2a0c0c 0%, #151518 58%, #17171a 100%);"
			>
				<h2 class="text-xl leading-tight font-semibold text-white md:text-2xl">
					{copy.reviewsTitle}
				</h2>
				<a
					href={reviewsHref}
					class="bc-calm-hover inline-flex h-11 shrink-0 items-center gap-2 rounded-bc-pill bg-bc-accent px-5 text-sm font-semibold text-bc-accent-contrast hover:bg-bc-accent-hover"
				>
					{copy.commonCta}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</a>
			</div>

			<!--
				Desktop (1440px): static 3-column grid.
				Narrower: horizontal scroll-snap rail (no JS carousel). Cards keep a fixed
				basis on the rail; on the grid they auto-size.
			-->
			<ul
				class="grid snap-x snap-mandatory [scrollbar-width:none] auto-cols-[minmax(280px,1fr)] grid-flow-col gap-5 overflow-x-auto pb-1 md:snap-none md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible"
			>
				{#each reviews as review (review.name)}
					<li
						class="flex min-h-[280px] snap-start flex-col rounded-bc-md border border-bc-border bg-bc-surface-soft p-6"
					>
						<!-- 5-star rating row -->
						<div class="mb-4 flex gap-1" role="img" aria-label={starsLabel}>
							{#each stars as star (star)}
								<!-- Brand accent green (#a51717) is bc-accent — fill + stroke it. -->
								<Star class="h-[18px] w-[18px] fill-bc-accent text-bc-accent" aria-hidden="true" />
							{/each}
						</div>

						<!-- Review text -->
						<p class="mb-5 text-[0.9375rem] leading-relaxed text-bc-ink-soft">{review.text}</p>

						<!-- Footer: avatar + name + role, pinned to the bottom -->
						<div class="mt-auto flex items-center gap-3">
							<img
								class="h-12 w-12 shrink-0 rounded-full object-cover"
								src={review.avatar}
								alt={review.name}
								width="48"
								height="48"
								loading="lazy"
								decoding="async"
							/>
							<div class="min-w-0">
								<p class="truncate text-base font-semibold text-bc-ink">{review.name}</p>
								<p class="truncate text-xs text-bc-muted">{review.role}</p>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}
