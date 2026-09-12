<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';
	import type { AuxeroReviewCard, AuxeroReviewsPageData } from '$lib/auxero/reviews';

	// Clean /reviews — 1:1 with the original themed page: soft-fill cards (.bc-card--soft
	// = var(--bc-surface), which separates from the off-white page — NOT white-on-white),
	// the green star-6.svg chips, text, avatar + name + role. Pagination "1" + Facebook.
	let {
		cards,
		reviewsPage,
		header,
		footer
	}: {
		cards: AuxeroReviewCard[];
		reviewsPage: AuxeroReviewsPageData;
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
	} = $props();

	const starIcons = ['s1', 's2', 's3', 's4', 's5'];
</script>

<CleanSiteHeader {header} pathname="/reviews" />

<main class="bg-bc-bg font-bc-body">
	<div class="bc-container py-10 md:py-14">
		<h1 class="text-[clamp(1.85rem,3.6vw,2.5rem)] leading-tight font-semibold text-bc-ink">
			{reviewsPage.title}
		</h1>

		<!-- Testimonial grid -->
		<div class="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
			{#each cards as card (card.id)}
				<article class="bc-card bc-card--soft bc-calm-hover flex flex-col p-6 md:p-7">
					<div
						class="mb-5 flex items-center gap-1.5"
						role="img"
						aria-label={`${card.stars} от 5 звезди`}
					>
						{#each starIcons.slice(0, card.stars) as star (star)}
							<img src="/assets/icons/star-6.svg" alt="" width="18" height="18" />
						{/each}
					</div>

					<p class="mb-6 flex-1 text-[1.0625rem] leading-[1.7] text-bc-ink-soft">{card.text}</p>

					<div class="flex items-center gap-3 border-t border-bc-border pt-5">
						<img
							src={card.avatar}
							alt={card.name}
							width="48"
							height="48"
							loading="lazy"
							decoding="async"
							class="h-12 w-12 shrink-0 rounded-full object-cover"
						/>
						<div class="min-w-0">
							<p class="font-semibold text-bc-ink">{card.name}</p>
							<p class="text-sm text-bc-muted">{card.role}</p>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Pagination: active page + Facebook -->
		<nav class="mt-9 flex items-center gap-3" aria-label="Страници с отзиви">
			<span
				aria-current="page"
				class="grid h-11 min-w-11 place-items-center rounded-bc-md bg-bc-accent px-4 font-semibold text-bc-accent-contrast tabular-nums"
			>
				{reviewsPage.pageLabel}
			</span>
			<a
				href={reviewsPage.facebookHref}
				target="_blank"
				rel="noreferrer"
				class="bc-calm-hover inline-flex h-11 items-center gap-2 rounded-bc-md border border-bc-border bg-white px-5 font-semibold text-bc-ink hover:text-bc-accent-contrast bc-press"
			>
				{reviewsPage.facebookLabel}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</nav>
	</div>
</main>

<CleanSiteFooter {footer} />
