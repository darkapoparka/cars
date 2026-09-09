<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import { daynightAssets } from '$lib/data/daynight';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	// Clean Svelte 5 + Tailwind v4 rebuild of the "Съвети от OUTLETCARS.BG — Варна" news band:
	//   • Dark-green band header (title left, green "Виж всички" pill right). The title
	//     reproduces the live composition — when copy.newsTitle contains "daynight",
	//     the brand word is swapped for the OUTLETCARS.BG — Варна wordmark image (a <picture> that
	//     serves the light logo on mobile, dark-template logo on desktop), and the
	//     remaining text renders as a plain span. Otherwise the title prints verbatim.
	//   • Three overlay cards: cover photo fills the card, a dark gradient sits on top,
	//     and the category pill / meta / title / "Прочети повече" pill stack over it.
	//     This matches the live HomeFiveNewsSection + the baseline screenshots (the
	//     section's real card language is overlay-on-photo, not bare white cards).
	// Tokens are used everywhere a bc token exists; the band gradient and the green/ink
	// overlay values that have no exact bc token are kept as commented raw hex.
	let { posts, copy }: { posts: HomeFiveNewsPost[]; copy: HomePageCopy } = $props();

	const cards = $derived(posts.slice(0, 3));

	// Mirror the live header composition: split the brand word out of the title so the
	// wordmark logo can stand in for it, and remember whether the brand leads the phrase
	// ("OUTLETCARS.BG — Варна notes" → logo first) or trails it ("Съвети от OUTLETCARS.BG — Варна" → logo last).
	const brandedNewsTitle = $derived(/daynight/i.test(copy.newsTitle));
	const brandFirstNewsTitle = $derived(copy.newsTitle.toLowerCase().startsWith('daynight'));
	const newsTitleWithoutBrand = $derived(copy.newsTitle.replace(/daynight/i, '').trim());
</script>

{#if cards.length}
	<section class="bg-bc-bg py-16 font-bc-body" aria-label={copy.newsTitle}>
		<div class="bc-container">
			<!-- Dark-green band header — gradient + overlay inks have no bc token (raw hex) -->
			<div
				class="mb-10 flex items-center justify-between gap-6 overflow-hidden rounded-bc-section px-7 py-6 ring-1 ring-white/10 ring-inset"
				style="background: linear-gradient(135deg, #1C1C1C 0%, #1C1C1C 58%, #1C1C1C 100%);"
			>
				<h2 class="inline-flex flex-wrap items-center gap-3.5 text-bc-h3 font-semibold text-white">
					{#if brandedNewsTitle}
						{#if brandFirstNewsTitle}
							<picture class="inline-flex w-[clamp(198px,18vw,286px)] leading-none">
								<source media="(max-width: 767px)" srcset={daynightAssets.logoLight} />
								<img
									class="block h-auto w-full"
									src={daynightAssets.logoDark}
									alt="OUTLETCARS.BG — Варна"
									width="220"
									height="58"
									loading="lazy"
									decoding="async"
								/>
							</picture>
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
						{:else}
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
							<picture class="inline-flex w-[clamp(198px,18vw,286px)] leading-none">
								<source media="(max-width: 767px)" srcset={daynightAssets.logoLight} />
								<img
									class="block h-auto w-full"
									src={daynightAssets.logoDark}
									alt="OUTLETCARS.BG — Варна"
									width="220"
									height="58"
									loading="lazy"
									decoding="async"
								/>
							</picture>
						{/if}
					{:else}
						{copy.newsTitle}
					{/if}
				</h2>

				<a
					href={resolve('/blog')}
					class="inline-flex h-11 shrink-0 items-center gap-2 rounded-bc-pill bg-bc-accent px-5 text-sm leading-none font-semibold whitespace-nowrap text-bc-accent-contrast transition-colors hover:bg-bc-hover-accent hover:text-white focus-visible:bg-bc-hover-accent focus-visible:text-white"
				>
					{copy.commonCta}
					<ArrowRight class="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} aria-hidden="true" />
				</a>
			</div>

			<!-- Three overlay cards -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each cards as post (post.slug)}
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group relative isolate flex aspect-[3/2] flex-col overflow-hidden rounded-bc-card border border-bc-border text-white"
					>
						<img
							class="absolute inset-0 -z-0 h-full w-full object-cover"
							src={post.image}
							alt={post.title}
							width="760"
							height="500"
							loading="lazy"
							decoding="async"
						/>
						<!-- Bottom-up scrim so the meta/title/cta stay legible — raw ink, no token -->
						<span
							class="pointer-events-none absolute inset-0 z-[1]"
							style="background: linear-gradient(180deg, rgba(13, 20, 12, 0) 16%, rgba(13, 20, 12, 0.62) 44%, rgba(13, 20, 12, 0.97) 78%);"
							aria-hidden="true"
						></span>

						<span
							class="absolute top-[18px] left-[18px] z-[2] inline-flex rounded-bc-pill border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm"
						>
							{post.category}
						</span>

						<span class="relative z-[2] mt-auto flex flex-col gap-[7px] px-[22px] pt-5 pb-5">
							<span class="flex items-center gap-2 text-[13px] font-semibold text-white">
								<span>{copy.byline}</span>
								<span aria-hidden="true">·</span>
								<span>{post.date}</span>
							</span>
							<span class="line-clamp-2 text-lg leading-tight font-bold text-white">
								{post.title}
							</span>
							<span
								class="mt-1 inline-flex w-fit items-center gap-2 rounded-bc-pill bg-bc-accent-bright-soft py-[7px] pr-2 pl-3.5 text-sm font-bold text-bc-accent-contrast transition-colors group-hover:bg-white group-focus-visible:bg-white"
							>
								{copy.readMore}
								<!-- Inner ink disc keeps the arrow readable on the bright pill (raw hex) -->
								<span
									class="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1C1C1C] text-white"
									aria-hidden="true"
								>
									<ArrowRight class="h-3.5 w-3.5" strokeWidth={2.7} />
								</span>
							</span>
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
