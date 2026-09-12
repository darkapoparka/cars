<script lang="ts">
	// Native 1:1 rebuild of the localized /reviews (clients-reviews.html) main
	// content: breadcrumb + heading + the testimonial grid. The grid is driven by
	// the same daynight-reviews.ts data the template pipeline used, so each card's
	// name/label/text/avatar matches the committed visual baseline (owner decision
	// R2: review CONTENT/wording is kept verbatim — only styling/structure here).
	//
	// The look that used to come from app.css + StorefrontTemplateContent's :global
	// stylesheet is now reproduced as a SELF-CONTAINED scoped style block below
	// (Svelte scopes it to this component's own markup — no legacy template CSS is
	// needed). Brand colours route through tokens (--sa-*); template neutrals stay
	// literal for an exact baseline match. The breadcrumb labels are written in
	// their final (runtime-localized) Bulgarian form — "Начало"/"Още" — to match
	// the rendered DOM, exactly like /faq and /terms. The legacy /assets chevron
	// img is replaced with @lucide/svelte's ChevronRight, like FaqContent.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import { daynightReviews, daynightReviewDisclosure, reviewGuidance } from '$lib/data/daynight-reviews';
</script>

<div class="reviews-page">
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
					<span>Отзиви от клиенти</span>
				</li>
			</ul>
		</div>
	</section>
	<!-- breadcrumb -->

	<!-- New Cars -->
	<section class="pb-100">
		<div class="container">
			<h1>Отзиви от клиенти</h1>
			<p class="review-disclosure">{daynightReviewDisclosure}</p>
			<div class="tf-spacing-style3"></div>

			<div class="lg-grid-cols-2 md-grid-cols-1 mb-40 grid grid-cols-3 gap-x-30 gap-y-38">
				{#each (daynightReviews.length ? daynightReviews : reviewGuidance) as review (review.id)}
					<div class="testimonior-box">
						<div
							class="mb-16 flex items-center gap-4"
							aria-label={review.rating > 0 ? `${review.rating} от 5` : 'Информация, не клиентски отзив'}
						>
							{#each Array.from({ length: review.rating }, (_, i) => i) as star (star)}
								<img src="/assets/icons/star-6.svg" alt="" />
							{/each}
						</div>
						<p class="testimonior-box--desc mb-16">
							{review.text}
						</p>
						<div class="testimonior-box--user">
							<img class="testimonior--img" src={review.avatar} alt="" />
							<div class="testimonior-box--user-content">
								<p class="h5 title">{review.name}</p>
								<p class="desc">{review.label}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
	<!-- New Cars -->
</div>

<style>
	.review-disclosure {
		color: var(--sa-muted);
		margin-top: 12px;
		text-align: center;
	}
	/* Self-contained scoped styles for /reviews. These reproduce the exact rules the
	   legacy app.css + StorefrontTemplateContent :global stylesheet provided for the
	   verbatim class strings used above, confirmed against getComputedStyle at
	   1440px. Svelte scopes them to this component's markup, so no :global wrapper is
	   required. Brand colours route through tokens (--sa-*); template neutrals stay
	   literal for an exact visual match. */
	.reviews-page,
	.reviews-page * {
		box-sizing: border-box;
	}

	/* The legacy look came from app.css's universal `* { color: #1C1C1C }` reset, so
	   default text is the template neutral #1c1c1c (NOT --sa-ink #0f1417). Kept as a
	   literal for an exact baseline match; elements with their own colour (h2,
	   card desc/label, breadcrumb spans) override it below. */
	.reviews-page {
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		letter-spacing: 0;
	}

	.reviews-page a {
		color: inherit;
		text-decoration: none;
	}

	.reviews-page img {
		display: block;
		max-width: 100%;
	}

	.reviews-page p,
	.reviews-page h1,
	.reviews-page ul {
		margin-top: 0;
	}

	/* Layout container. The legacy `.container` was a blend of app.css
	   (`max-width:1440px; padding:0 15px`) and StorefrontTemplateContent
	   (`width:min(100% - 48px, 1320px)`). The explicit `max-width:1440px` is also
	   required to defeat Tailwind's built-in `.container` utility (max-width:1280px
	   at xl), which storefront.css would otherwise clamp this element to. Both the
	   breadcrumb and the cards container render at width 1320px / max 1440px
	   (verified via getComputedStyle). */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.background-light {
		background: #f5f7fb;
	}

	/* Spacing utilities */
	.pb-100 {
		padding-bottom: 100px;
	}

	.mb-16 {
		margin-bottom: 16px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.tf-spacing-style3 {
		height: 34px;
	}

	/* Flex / grid utilities */
	.flex {
		display: flex;
	}

	.items-center {
		align-items: center;
	}

	.gap-4 {
		gap: 4px;
	}

	.grid {
		display: grid;
	}

	.grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.gap-y-38 {
		row-gap: 38px;
	}

	.gap-x-30 {
		column-gap: 30px;
	}

	/* Heading — app.css + StorefrontTemplateContent both supply the h2 styling; the
	   effective computed result at 1440px is colour #111827, the clamp font size,
	   weight 700, line-height 1.08. */
	.reviews-page h1 {
		margin-bottom: 0;
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
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
		line-height: 22px;
		list-style: none;
	}

	/* app.css's universal `*` reset dropped a/span back to font-weight 400 in the
	   legacy baseline (the bold 700 lives on the .breadcrumb ul only). The a/span
	   line-height 22px comes from app.css's `.breadcrumb a, .breadcrumb span`. */
	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
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

	/* Testimonial card — app.css owned the inner content rules, StorefrontTemplateContent
	   owned the card chrome (border/radius/shadow). These reproduce the effective
	   computed result of that cascade so the card heights/spacing match 1:1. */
	.testimonior-box {
		padding: 24px;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: none;
	}

	/* app.css supplied `font-size: 18px`; StorefrontTemplateContent (loaded after, equal
	   specificity) supplied `line-height: 1.65` and `color: #374151` — verified the
	   18px / 1.65 blend via matched-rule inspection of the baseline. */
	.testimonior-box--desc {
		color: #374151;
		font-size: 18px;
		line-height: 1.65;
	}

	.testimonior-box--user {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.testimonior--img {
		width: 58px;
		height: 58px;
		border-radius: 999px;
		object-fit: cover;
	}

	/* app.css's `.testimonior-box ... .testimonior-box--user-content { margin-left:
	   12px }` (3-class, high specificity) won the cascade over the parent's flex gap
	   alone — so the name/label block sits flex-gap(14px) + margin(12px) = 26px right
	   of the avatar (verified x=182 against the baseline). */
	.testimonior-box--user-content {
		margin-left: 12px;
	}

	.testimonior-box--user-content p {
		margin: 0;
	}

	/* Card star icons — the legacy star-6.svg renders at its natural 24px. */
	.testimonior-box .flex img {
		width: 24px;
		height: 24px;
	}

	/* Card name. */
	.h5 {
		font-size: 18px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	/* Card label. The baseline label line-height was 26px (app.css's body/`*`
	   default — its `.desc` rule sets no line-height), verified against the
	   baseline; without it the label collapses to 14px*1.5=21px and the card
	   shrinks. Colour #667085 from StorefrontTemplateContent's `.desc`. */
	.desc {
		color: #667085;
		font-size: 14px;
		line-height: 26px;
	}

	@media (max-width: 1100px) {
		.lg-grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-100 {
			padding-bottom: 56px;
		}

		.md-grid-cols-1,
		.grid-cols-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
