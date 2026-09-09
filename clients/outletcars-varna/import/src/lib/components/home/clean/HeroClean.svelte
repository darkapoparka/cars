<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeroAction, HomeFiveHeroData } from '$lib/auxero/home-five';
	import { ChevronDown, Search } from '@lucide/svelte';

	// Clean Svelte 5 + Tailwind v4 rebuild of the OUTLETCARS.BG — Варна homepage hero, migrating
	// off the legacy Auxero theme + swiper. Premium dark-green band (no photo wash, so
	// nothing competes with the cutout cars) with:
	//   • a centred white heading + one-line muted subtitle (from the active text slide)
	//   • two cutout cars flanking the heading, anchored to the SECTION edges
	//   • a mode segmented control (Buy / Import / Sell) over a dark glass search card
	//   • buy   → native <select> filter row (brand/model/bodyType/maxPrice) GET → /inventory
	//   • import/sell → single text input + submit + secondary link
	// The site header is absolutely positioned over this band, so the band pads the
	// top to clear it (≈146px desktop = 50px topbar + 95px nav; ≈64px mobile).
	let { hero }: { hero: HomeFiveHeroData } = $props();

	// Active tab/mode. `modeOverride` is the user's tab choice (null until they click);
	// `mode` derives the live value, defaulting to the data's activeMode. Keeping the
	// override separate avoids seeding $state from a prop (state_referenced_locally).
	let modeOverride = $state<HomeFiveHeroAction['mode'] | null>(null);
	const mode = $derived(modeOverride ?? hero.activeMode);

	const activeAction = $derived(
		hero.actions.find((action) => action.mode === mode) ?? hero.actions[0]
	);

	// Heading/subtitle follow the active mode. The data may reorder textSlides (active
	// mode first when activeMode !== 'buy'), so match by each slide's ctaHref → mode
	// (/inventory→buy, /services→import, /sell-your-car→sell) rather than by index.
	const slideCtaForMode = {
		buy: '/inventory',
		import: '/services',
		sell: '/sell-your-car'
	} as const;
	const activeSlide = $derived(
		hero.textSlides.find((slide) => slide.ctaHref === slideCtaForMode[mode])
	);
	const heading = $derived(activeSlide?.heading ?? hero.heading);
	const subtitle = $derived(activeSlide?.subtitle ?? '');

	// Buy submit label = prefix + total + suffix (e.g. "Покажи 42 автомобила").
	const buySubmitLabel = $derived(
		`${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`.trim()
	);

	// Flanking cutouts — same curated images the themed hero and mega-menu use.
	const cutoutLeft = '/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp';
	const cutoutRight = '/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp';
</script>

<!--
	Dark-green hero band — pure layered gradient (no photo), so the cutout cars are the
	only imagery. Layers (top → bottom): edge vignette for depth, soft spotlight behind
	the heading, green floor glow, dark-green base. Raw hex values have no bc-* token, so
	they live inline + commented.
-->
<section
	class="relative isolate overflow-hidden bg-[#0a0f08] pt-[64px] pb-12 font-bc-body text-white md:pt-[146px] md:pb-16"
	style="background-image:
		radial-gradient(120% 120% at 50% 38%, transparent 52%, rgb(0 0 0 / 0.42) 100%),
		radial-gradient(60% 48% at 50% 30%, rgb(255 255 255 / 0.06) 0%, transparent 62%),
		radial-gradient(86% 64% at 50% 122%, rgb(227 6 47 / 0.22) 0%, transparent 60%),
		linear-gradient(158deg, #0a0f08 0%, #131f11 48%, #1e2e17 100%);"
>
	<!--
		Cutout cars flank the heading, anchored to the SECTION edges (not the inner
		container) so they hug the sides and frame the content at any width — and ride
		just under the header so they line up with the heading. Hidden < lg.
	-->
	<img
		class="pointer-events-none absolute top-[150px] left-0 hidden w-[clamp(230px,25vw,470px)] object-contain [filter:drop-shadow(0_30px_26px_rgb(0_0_0/0.42))] select-none lg:block xl:left-[clamp(0px,3.5vw,80px)]"
		src={cutoutLeft}
		alt=""
		width="820"
		height="420"
		loading="eager"
		decoding="async"
		fetchpriority="high"
		aria-hidden="true"
	/>
	<img
		class="pointer-events-none absolute top-[150px] right-0 hidden w-[clamp(230px,25vw,470px)] -scale-x-100 object-contain [filter:drop-shadow(0_30px_26px_rgb(0_0_0/0.42))] select-none lg:block xl:right-[clamp(0px,3.5vw,80px)]"
		src={cutoutRight}
		alt=""
		width="820"
		height="420"
		loading="eager"
		decoding="async"
		aria-hidden="true"
	/>

	<div class="bc-container relative">
		<!-- ===== Centred heading + one-line subtitle ===== -->
		<div class="relative z-[1] mx-auto max-w-[820px] text-center">
			<h1
				class="text-[clamp(38px,4vw,62px)] leading-[1.06] font-semibold tracking-tight text-white [text-shadow:0_4px_22px_rgb(0_0_0/0.4)]"
			>
				{heading}
			</h1>
			{#if subtitle}
				<p
					class="mx-auto mt-3.5 max-w-[720px] text-[clamp(15px,1.2vw,18px)] leading-[1.5] font-medium text-white/85 [text-shadow:0_2px_12px_rgb(0_0_0/0.34)]"
				>
					{subtitle}
				</p>
			{/if}
		</div>

		<!-- ===== Search card ===== -->
		<div class="relative z-[1] mx-auto mt-7 w-full max-w-[1140px] md:mt-9">
			<!-- Mode segmented control: Buy / Import / Sell (one track, active segment filled) -->
			<div class="mb-4 flex justify-center">
				<div
					role="tablist"
					aria-label={hero.heading}
					class="inline-flex items-center gap-1 rounded-bc-pill border border-white/15 bg-white/10 p-1 [backdrop-filter:blur(8px)]"
				>
					{#each hero.actions as action (action.mode)}
						{@const selected = action.mode === mode}
						<button
							type="button"
							role="tab"
							aria-selected={selected}
							onclick={() => (modeOverride = action.mode)}
							class={[
								'flex h-10 items-center rounded-bc-pill px-7 text-[15px] font-semibold transition-colors',
								selected
									? 'bg-bc-accent text-bc-accent-contrast shadow-[0_2px_8px_rgb(0_0_0/0.18)]'
									: 'text-white/75 hover:text-white'
							]}
						>
							{action.label}
						</button>
					{/each}
				</div>
			</div>

			<!--
				Dark glass panel — translucent dark-green + blur + hairline, so the white
				fields pop. One <form> per mode keeps the GET contract clean: only the
				visible fields submit, so query params never leak between modes.
			-->
			{#if mode === 'buy'}
				<!-- BUY: GET /inventory?brand=&q=&bodyType=&maxPrice= -->
				<form
					method="get"
					action={activeAction.actionHref}
					class="rounded-bc-lg border border-white/20 bg-white/[0.08] p-3 shadow-[0_30px_80px_rgb(0_0_0/0.5)] ring-1 ring-white/10 [backdrop-filter:blur(20px)] ring-inset md:p-4"
				>
					<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]">
						{#each hero.primaryFilters as filter (filter.id)}
							<label
								class="group relative flex min-h-[64px] flex-col justify-center rounded-bc-sm border border-black/[0.06] bg-white px-4 py-2 text-left transition-shadow focus-within:ring-2 focus-within:ring-bc-accent/40"
							>
								<span
									class="truncate text-[11px] leading-[1.15] font-medium tracking-wide text-[#5f5f5f] uppercase"
								>
									{filter.title}
								</span>
								<select
									name={filter.name}
									class="mt-0.5 h-[24px] w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[16px] font-semibold text-bc-ink outline-none"
								>
									<option value="">{filter.defaultLabel}</option>
									{#each filter.options as option (option.value)}
										<option value={option.value}>
											{option.shortLabel ?? option.label}{option.countLabel
												? ` (${option.countLabel})`
												: ''}
										</option>
									{/each}
								</select>
								<ChevronDown
									class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#5f5f5f]"
									strokeWidth={2}
									aria-hidden="true"
								/>
							</label>
						{/each}

						<button
							type="submit"
							class="flex min-h-[64px] items-center justify-center gap-2 rounded-bc-sm bg-bc-accent px-8 text-[16px] font-semibold whitespace-nowrap text-bc-accent-contrast transition-colors hover:bg-bc-accent-hover"
						>
							<Search class="size-5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
							{buySubmitLabel}
						</button>
					</div>
				</form>
			{:else}
				<!-- IMPORT / SELL: single field + submit + secondary link -->
				<form
					method="get"
					action={activeAction.actionHref}
					class="rounded-bc-lg border border-white/20 bg-white/[0.08] p-3 shadow-[0_30px_80px_rgb(0_0_0/0.5)] ring-1 ring-white/10 [backdrop-filter:blur(20px)] ring-inset md:p-4"
				>
					<div class="flex flex-col gap-2 lg:flex-row lg:items-stretch">
						<label
							class="flex min-h-[64px] flex-1 flex-col justify-center rounded-bc-sm border border-black/[0.06] bg-white px-[18px] py-2 text-left focus-within:ring-2 focus-within:ring-bc-accent/40"
						>
							<span
								class="text-[11px] leading-[1.15] font-bold tracking-wide text-[#5f5f5f] uppercase"
							>
								{activeAction.drawerTitle}
							</span>
							<input
								name={activeAction.inputName}
								type="search"
								placeholder={activeAction.placeholder}
								autocomplete="off"
								required
								class="mt-0.5 h-[24px] w-full bg-transparent text-[16px] font-bold text-bc-ink outline-none placeholder:font-medium placeholder:text-[#858585]"
							/>
						</label>
						<button
							type="submit"
							class="flex min-h-[64px] items-center justify-center gap-2 rounded-bc-sm bg-bc-accent px-8 text-[16px] font-semibold whitespace-nowrap text-bc-accent-contrast transition-colors hover:bg-bc-accent-hover lg:min-w-[210px]"
						>
							<Search class="size-5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
							{activeAction.submitLabel}
						</button>
					</div>
					<p class="mt-2.5 px-1 text-[13px] leading-[1.45] font-medium text-white/65">
						{activeAction.helper}
						<a
							href={resolve(activeAction.secondaryHref)}
							class="font-semibold text-bc-accent-bright-soft underline-offset-4 transition-colors hover:text-white hover:underline"
						>
							{activeAction.secondaryLabel}
						</a>
					</p>
				</form>
			{/if}
		</div>
	</div>
</section>
