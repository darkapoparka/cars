<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';

	type SectionCtaHref = '/blog' | '/compare' | '/inventory' | '/inventory?view=4' | '/reviews';

	let { href, label }: { href: SectionCtaHref; label: string } = $props();
</script>

<a href={resolve(href)} class="eliqauto-section-cta">
	<span class="eliqauto-section-cta__label">{label}</span>
	<ArrowRight class="eliqauto-section-cta__arrow" size={18} strokeWidth={2.25} aria-hidden="true" />
</a>

<style>
	.eliqauto-section-cta {
		align-items: center;
		display: inline-flex;
		min-height: 52px;
		justify-content: center;
		gap: 9px;
		padding: 0 24px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-md);
		background: var(--bc-accent);
		color: var(--bc-white);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-semibold);
		line-height: var(--bc-leading-control);
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color var(--bc-motion-hover),
			border-color var(--bc-motion-hover),
			transform 120ms ease;
	}

	.eliqauto-section-cta__label {
		color: inherit;
	}

	.eliqauto-section-cta:hover {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-white);
	}

	.eliqauto-section-cta:focus-visible {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-white);
		outline: 2px solid rgb(165 23 23 / 0.42);
		outline-offset: 3px;
	}

	.eliqauto-section-cta:active {
		transform: translateY(1px);
	}

	.eliqauto-section-cta :global(.eliqauto-section-cta__arrow) {
		flex: 0 0 auto;
		color: currentColor;
		stroke: currentColor;
		transition: transform 160ms ease;
	}

	.eliqauto-section-cta:hover :global(.eliqauto-section-cta__arrow),
	.eliqauto-section-cta:focus-visible :global(.eliqauto-section-cta__arrow) {
		transform: translateX(3px);
	}

	@media (min-width: 768px) {
		:global(
				#main-content
					:is(
						.eliqauto-newest-heading,
						.eliqauto-newest-footer-cta,
						.eliqauto-section-banner,
						.eliqauto-home-compare__header,
						.eliqauto-reviews-banner,
						.eliqauto-news-banner
					)
			)
			.eliqauto-section-cta {
			position: relative;
			min-height: 40px;
			flex: 0 0 auto;
			padding: 0 16px;
			gap: 8px;
			border: 1px solid #18181b;
			border-radius: 8px;
			background: #ffffff;
			color: #18181b;
			font-size: 16px;
			font-weight: 600;
			line-height: 20px;
			transition:
				background-color var(--bc-motion-hover),
				color var(--bc-motion-hover);

			.eliqauto-section-cta__label {
				font: inherit;
			}

			/* Keep a 44px hit area around the compact visible button. */
			&::before {
				position: absolute;
				inset: -3px 0;
				content: '';
			}

			&:hover,
			&:focus-visible {
				border-color: #18181b;
				background: #18181b;
				color: #ffffff;
				text-decoration: none;
			}

			&:focus-visible {
				outline: 2px solid var(--bc-accent);
				outline-offset: 4px;
			}

			&:active {
				transform: none;
			}

			:global(.eliqauto-section-cta__arrow) {
				transform: none;
				transition: none;
			}
		}
	}
</style>
