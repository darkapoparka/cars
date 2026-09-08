<script lang="ts">
	// Native 1:1 rebuild of the localized /faq (faqs.html) main content: breadcrumb
	// + heading + the three grouped FAQ accordions. The Q&A pairs come from the
	// typed daynight-faq.ts data (the exact strings the template pipeline produced),
	// rendered keyed. Class names and copy are kept verbatim; the look that used to
	// come from StorefrontTemplateContent's :global stylesheet is now reproduced as
	// a SELF-CONTAINED scoped style block below (Svelte scopes it to this
	// component's own markup — no legacy template CSS is needed).
	//
	// The accordion is a NATIVE Svelte accordion: open/close is driven by local
	// $state (no template JS). Single-open behaviour mirrors the template — opening
	// an item closes the others, clicking the open item collapses it. The initial
	// state matches the baseline screenshot: the first item ("Какви са стъпките за
	// покупка?") is open, every other item is collapsed. Content visibility is
	// class-driven (`.flat-toggle.active .toggle-content`) so no inline styles are
	// needed and the markup stays static/server-renderable.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import { daynightFaqGroups } from '$lib/data/daynight-faq';

	// First group's first item starts open, matching the baseline `active` toggle.
	let openId = $state<string | null>(daynightFaqGroups[0]?.items[0]?.id ?? null);

	function toggleItem(id: string) {
		openId = openId === id ? null : id;
	}
</script>

<div class="faq-page">
	<!-- breadcrumb -->
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li>
					<a href={resolve('/')}>Начало</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Още</span>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Често задавани въпроси</span>
				</li>
			</ul>
		</div>
	</section>
	<!-- breadcrumb -->

	<section class="bg-white pb-84">
		{#each daynightFaqGroups as group, groupIndex (group.id)}
			<div class={group.containerClass}>
				{#if groupIndex === 0}
					<h1>Често задавани въпроси</h1>
					<div class="tf-spacing-style3"></div>
				{/if}
				<p class={group.headingClass}>{group.heading}</p>
				<div class="max-width-850 mx-auto w-full">
					<div
						class="flat-accordion max-width-930 wow fadeIn flex flex-col gap-18"
						data-wow-delay=".3s"
						data-daynight-native-accordion
					>
						{#each group.items as item, itemIndex (item.id)}
							{@const open = openId === item.id}
							<div class={[item.toggleClass, { active: open }]}>
								<button
									type="button"
									class={['toggle-title', { active: open }]}
									aria-expanded={open}
								aria-controls={`faq-answer-${group.id}-${itemIndex}`}
									onclick={() => toggleItem(item.id)}
								>
									<p class="h5 title">{item.question}</p>
									<span class="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M20 15L12 7L4 15"
												stroke="#1C1C1C"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</span>
								</button>
								<div id={`faq-answer-${group.id}-${itemIndex}`} class="toggle-content">
									{#each item.answer as paragraph (paragraph.text)}
										<p class={paragraph.class}>{paragraph.text}</p>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</section>
</div>

<style>
	/* Self-contained scoped styles for /faq. These reproduce the exact rules the
	   legacy StorefrontTemplateContent :global stylesheet (and app.css's .mb-60)
	   provided for the verbatim class strings in daynight-faq.ts. Svelte scopes them
	   to this component's markup, so no :global wrapper is required. Brand colours
	   route through tokens (--sa-*); template neutrals stay literal for an exact
	   visual match. */
	.faq-page,
	.faq-page * {
		box-sizing: border-box;
	}

	/* The legacy look came from app.css's universal `* { color: #1C1C1C }` reset, so
	   default text is the template neutral #1c1c1c (NOT --sa-ink #0f1417). Kept as a
	   literal for an exact baseline match; elements with their own colour (h1,
	   answers, breadcrumb spans) override it below. */
	.faq-page {
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		letter-spacing: 0;
	}

	.faq-page a {
		color: inherit;
		text-decoration: none;
	}

	.faq-page svg {
		display: block;
		max-width: 100%;
	}

	.faq-page p,
	.faq-page h1,
	.faq-page ul {
		margin-top: 0;
	}

	/* Layout containers. The legacy `.container` was a blend of app.css
	   (`max-width:1440px; padding:0 15px`) and StorefrontTemplateContent
	   (`width:min(100% - 48px, 1320px)`). The explicit `max-width:1440px` is also
	   required to defeat Tailwind's built-in `.container` utility (max-width:1280px
	   at xl), which storefront.css would otherwise clamp this element to. */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.background-light {
		background: #f5f7fb;
	}

	.bg-white {
		background: #fff;
	}

	.max-width-850 {
		max-width: 850px;
	}

	.max-width-930 {
		max-width: 930px;
	}

	/* Spacing utilities */
	.pb-84 {
		padding-bottom: 84px;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-18 {
		margin-bottom: 18px;
	}

	.mb-20 {
		margin-bottom: 20px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	/* NOTE: the markup carries `mb-60` on the first two group containers, but in the
	   legacy baseline app.css's universal `* { margin: 0 }` reset zeroed it out
	   (verified: computed margin-bottom was 0). The class is therefore intentionally
	   NOT styled here so the group spacing matches the committed baseline. */

	.mx-auto {
		margin-right: auto;
		margin-left: auto;
	}

	.w-full {
		width: 100%;
	}

	.tf-spacing-style3 {
		height: 34px;
	}

	/* Flex utilities */
	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.gap-18 {
		gap: 18px;
	}

	/* Text utilities */
	.capitalize {
		text-transform: none;
	}

	.text-center {
		text-align: center;
	}

	.text-secondary {
		color: #667085;
	}

	/* `.line-height-28` is declared BEFORE `.h7` to preserve the template's source
	   order: at equal specificity the later `.h7` rule wins on line-height (1.6),
	   matching the committed baseline. */
	.line-height-28 {
		line-height: 28px;
	}

	/* Typography scale */
	.h3 {
		font-size: clamp(24px, 2.4vw, 32px);
		font-weight: 700;
		line-height: 1.16;
	}

	.h5 {
		font-size: 18px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	/* app.css applied `font-weight: 600` to the whole `.h4…h7,h1…h6` group, and
	   StorefrontTemplateContent's `.h7` declared no weight — so the legacy answer
	   text rendered at 600 (verified via matched-rule inspection of the baseline).
	   Reproduce it here or the answers wrap to fewer lines and the page shrinks. */
	.h7 {
		font-size: 18px;
		font-weight: 500;
		line-height: var(--sa-leading-body);
	}

	.faq-page h1 {
		margin-bottom: 0;
		color: #111827;
		font-size: clamp(36px, 4vw, 56px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
		text-align: center;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		list-style: none;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.72;
	}

	/* Accordion — the legacy look was a BLEND of app.css (`.flat-accordion …`,
	   higher specificity) and StorefrontTemplateContent's scoped rules. These
	   declarations reproduce the effective *computed* result of that cascade so the
	   item heights/spacing match the baseline 1:1. */
	.flat-accordion {
		width: 100%;
	}

	/* app.css supplied the outer padding (20px 28px); StorefrontTemplateContent won
	   the border/radius/background/shadow at equal specificity. */
	.flat-toggle {
		overflow: hidden;
		padding: 20px 28px;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
	}

	/* StorefrontTemplateContent's flex layout won the cascade in the legacy blend
	   (verified by measuring the committed baseline: padding resolved to 20px 24px,
	   NOT app.css's padding-right:40px, and text-transform was none). `position:
	   relative` is kept so the absolutely-positioned icon anchors here. */
	.toggle-title {
		position: relative;
		display: flex;
		min-height: 72px;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px;
		cursor: pointer;
		width: 100%;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
	}

	.toggle-title:focus-visible {
		border-radius: 8px;
		outline: 3px solid color-mix(in srgb, var(--sa-red) 28%, transparent);
		outline-offset: 2px;
	}

	.toggle-title .title {
		margin: 0;
	}

	/* StorefrontTemplateContent's pill chrome (display:grid won at source order)
	   plus app.css's absolute positioning + default 180° rotation (icon points
	   down). The `.active` rotation also resolved to 180° in the legacy cascade, so
	   every chevron points down — matching the committed baseline. */
	.toggle-title .icon {
		position: absolute;
		top: 2px;
		right: 0;
		display: grid;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		background: #f4f6fa;
		transform: rotate(180deg);
		transition: all 0.3s ease;
	}

	.toggle-title.active .icon {
		transform: rotate(180deg);
	}

	/* app.css's `margin-top:6px` survived; StorefrontTemplateContent's horizontal
	   padding survived (app.css declared none). */
	.toggle-content {
		display: none;
		margin-top: 6px;
		padding: 0 24px 24px;
	}

	/* The template's app.css hides `.toggle-content` by default and only rotates
	   the icon for `.toggle-title.active`; it has NO rule that reveals an open
	   item's content (the template did that imperatively via inline display). This
	   native accordion is class-driven instead, so reveal the open item's content
	   purely from the `active` class our Svelte state owns. */
	.flat-accordion .flat-toggle.active .toggle-content {
		display: block;
	}

	/* The legacy WOW entrance animation is neutralized — markup keeps the `wow`
	   class verbatim but it must render immediately and statically. */
	.wow {
		visibility: visible;
		animation-name: none;
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-84 {
			padding-bottom: 56px;
		}

		.toggle-title {
			min-height: 64px;
			padding: 18px;
		}

		.toggle-content {
			padding: 0 18px 18px;
		}
	}
</style>
