<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	// Clean /terms — sections as filled cards with a green accent edge + green number
	// chip (real substance, not bare text between grey dividers), on the project's flat
	// card language. Sticky sidebar TOC; the section in view is highlighted in both.
	let {
		title,
		sections,
		header,
		footer
	}: {
		title: string;
		sections: AuxeroTermsSection[];
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
	} = $props();

	const stripLeadingNumber = (value: string) => value.replace(/^\s*\d+\.\s*/, '');
	const pad = (n: number) => String(n).padStart(2, '0');

	let active = $state('');
	const activeId = $derived(active || (sections[0]?.id ?? ''));

	$effect(() => {
		const els = sections
			.map((s) => document.getElementById(s.id))
			.filter((el): el is HTMLElement => el !== null);
		if (els.length === 0) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) active = entry.target.id;
			},
			{ rootMargin: '-150px 0px -65% 0px', threshold: 0 }
		);
		for (const el of els) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<CleanSiteHeader {header} pathname="/terms" />

<main class="bg-bc-bg font-bc-body">
	<div class="bc-container py-10 md:py-14">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-2 text-sm text-bc-muted" aria-label="Навигация">
			<a
				href={resolve('/')}
				class="inline-flex min-h-8 items-center transition-colors hover:text-bc-ink">Начало</a
			>
			<span aria-hidden="true">/</span>
			<span class="text-bc-ink">Общи условия</span>
		</nav>

		<h1 class="mt-5 text-[clamp(1.85rem,3.6vw,2.5rem)] leading-tight font-semibold text-bc-ink">
			{title}
		</h1>
		<p class="mt-3 max-w-[640px] text-[1.0625rem] leading-relaxed text-bc-muted">
			Кратко и ясно: как Promosale Varna представя информация, организира огледи и обработва
			запитвания.
		</p>

		<div
			class="mt-10 grid min-w-0 grid-cols-1 gap-10 md:mt-12 md:grid-cols-[300px_minmax(0,1fr)] md:gap-16"
		>
			<!-- Sticky TOC -->
			<aside class="min-w-0 md:sticky md:top-[150px] md:self-start">
				<p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-bc-muted uppercase">
					Съдържание
				</p>
				<nav class="flex flex-col" aria-label="Съдържание">
					{#each sections as section (section.id)}
						<a
							href={resolve(`/terms#${section.id}`)}
							onclick={() => (active = section.id)}
							aria-current={activeId === section.id ? 'true' : undefined}
							class={[
								'bc-press border-l-[3px] py-2.5 pl-4 text-[15px] leading-snug font-semibold transition-colors',
								activeId === section.id
									? 'border-bc-accent text-bc-ink'
									: 'border-transparent text-bc-muted hover:text-bc-ink'
							]}
						>
							{section.title}
						</a>
					{/each}
				</nav>
			</aside>

			<!-- Section cards -->
			<div class="flex min-w-0 flex-col gap-5">
				{#each sections as section, i (section.id)}
					<section
						id={section.id}
						class={[
							'scroll-mt-[140px] rounded-bc-md border border-l-[4px] border-bc-border border-l-bc-accent p-6 transition-colors md:p-8',
							activeId === section.id ? 'bg-bc-accent-soft/40' : 'bg-white'
						]}
					>
						<div class="flex items-center gap-4">
							<span
								class="grid h-11 w-11 shrink-0 place-items-center rounded-bc-md bg-bc-accent text-lg font-bold text-bc-accent-contrast tabular-nums"
							>
								{pad(i + 1)}
							</span>
							<h2 class="text-xl leading-tight font-semibold text-bc-ink md:text-2xl">
								{stripLeadingNumber(section.title)}
							</h2>
						</div>
						<div class="mt-5 space-y-4">
							{#each section.body as paragraph (paragraph)}
								<p class="text-[1.0625rem] leading-[1.75] text-bc-ink-soft">{paragraph}</p>
							{/each}
						</div>
					</section>
				{/each}

				<!-- Contact CTA card -->
				<div
					class="flex flex-col items-start justify-between gap-5 rounded-bc-md border border-bc-border bg-bc-accent-soft/50 p-6 sm:flex-row sm:items-center md:p-8"
				>
					<div>
						<p class="text-lg font-semibold text-bc-ink">Имаш въпрос относно условията?</p>
						<p class="mt-1 text-bc-ink-soft">Пиши ни или се обади — отговаряме бързо.</p>
					</div>
					<a
						href={resolve('/contact')}
						class="bc-calm-hover bc-press inline-flex h-12 shrink-0 items-center gap-2 rounded-bc-md bg-bc-accent px-7 font-semibold text-bc-accent-contrast hover:bg-bc-accent-contrast hover:text-white"
					>
						Свържи се <ArrowRight class="h-4 w-4" />
					</a>
				</div>
			</div>
		</div>
	</div>
</main>

<CleanSiteFooter {footer} />
