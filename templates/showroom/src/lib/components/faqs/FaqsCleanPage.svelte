<script lang="ts">
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import type { AuxeroFaq, AuxeroFaqGroup } from '$lib/auxero/faqs';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';

	// Clean /faqs — centered single column + centered group titles (matches the original
	// layout), but rows are clearly interactive: native <details> with a green chevron chip
	// that rotates, hover + open highlight, and the first row open so it reads as an
	// accordion, not plain text. Works with or without JS (<details> is native).
	let {
		featured,
		groups,
		header,
		footer
	}: {
		featured: AuxeroFaq[];
		groups: AuxeroFaqGroup[];
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
	} = $props();
</script>

{#snippet faqList(items: AuxeroFaq[])}
	<div class="mx-auto flex w-full max-w-[860px] flex-col gap-3">
		{#each items as faq, i (faq.question)}
			<details
				open={i === 0}
				class="faq-item group rounded-bc-md border border-bc-border bg-white transition-colors open:border-bc-accent/55 open:bg-bc-accent-soft/30 hover:border-bc-accent/45"
			>
				<summary
					class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none [&::-webkit-details-marker]:hidden"
				>
					<span class="text-[1.0625rem] font-semibold text-bc-ink">{faq.question}</span>
					<span
						class="faq-chevron grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bc-accent-soft text-bc-accent transition-transform duration-200"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M6 9L12 15L18 9"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</summary>
				<div class="border-t border-bc-border px-5 pt-4 pb-5">
					<p class="leading-[1.75] text-bc-ink-soft">{faq.answer}</p>
				</div>
			</details>
		{/each}
	</div>
{/snippet}

<CleanSiteHeader {header} pathname="/faqs" />

<main class="bg-bc-bg font-bc-body">
	<div class="bc-container py-12 md:py-16">
		<h1 class="text-[clamp(2.5rem,4vw,3.25rem)] leading-tight font-semibold text-bc-ink">
			Често задавани въпроси
		</h1>

		<section class="mt-10 md:mt-12">
			<h2 class="mb-7 text-center text-2xl leading-tight font-semibold text-bc-ink md:text-4xl">
				Съдействие от Eliqauto
			</h2>
			{@render faqList(featured)}
		</section>

		{#each groups as group (group.title)}
			<section class="mt-12 md:mt-14">
				<h2 class="mb-7 text-center text-2xl leading-tight font-semibold text-bc-ink md:text-4xl">
					{group.title}
				</h2>
				{@render faqList(group.items)}
			</section>
		{/each}
	</div>
</main>

<CleanSiteFooter {footer} />

<style>
	/* Rotate the chevron when its <details> is open (guaranteed, no JS). */
	.faq-item[open] .faq-chevron {
		transform: rotate(180deg);
	}
</style>
