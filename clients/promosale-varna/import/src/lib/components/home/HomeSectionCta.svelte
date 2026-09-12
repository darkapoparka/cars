<script lang="ts">
	import { resolve } from '$app/paths';

	type SectionCtaHref = '/blog' | '/compare' | '/inventory' | '/inventory?view=4' | '/reviews';

	let { href, label }: { href: SectionCtaHref; label: string } = $props();
</script>

<a href={resolve(href)} class="btn btn-large daynight-section-cta">
	<span class="daynight-section-cta__label">{label}</span>
	<svg
		class="daynight-section-cta__arrow"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M5 12h14M13 6l6 6-6 6"
			stroke="currentColor"
			stroke-width="2.25"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</a>

<style>
	.daynight-section-cta {
		border-color: #ffffff !important;
		background-color: #ffffff !important;
		min-height: 58px;
		gap: 12px;
		padding-inline: 28px !important;
		color: #111111 !important;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-cta) !important;
		font-weight: 600 !important;
		letter-spacing: -0.01em;
		line-height: var(--bc-leading-cta) !important;
	}

	.daynight-section-cta:hover,
	.daynight-section-cta:focus-visible {
		border-color: #e7e7e7 !important;
		background: #e7e7e7 !important;
		background-color: #e7e7e7 !important;
		color: #111111 !important;
		transform: none !important;
	}

	.daynight-section-cta:focus-visible {
		outline: 3px solid rgba(255, 255, 255, 0.36);
		outline-offset: 3px;
	}

	.daynight-section-cta__label {
		color: inherit !important;
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
	}

	.daynight-section-cta::before,
	.daynight-section-cta::after {
		display: none !important;
	}

	.daynight-section-cta svg.daynight-section-cta__arrow {
		display: block !important;
		flex: 0 0 auto;
		width: 24px !important;
		height: 24px !important;
		color: inherit !important;
		stroke: currentColor !important;
	}

	.daynight-section-cta__arrow path {
		color: inherit !important;
		stroke: currentColor !important;
	}

	@media (min-width: 768px) {
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-section-cta {
			min-height: 40px !important;
			height: 40px !important;
			padding: 0 14px !important;
			border-radius: var(--bc-radius-control) !important;
			gap: 8px !important;
			font-size: 15px !important;
		}
		:global(html body.auxero-template-home-05-html #wrapper)
			.daynight-section-cta
			svg.daynight-section-cta__arrow {
			width: 18px !important;
			height: 18px !important;
		}
	}
</style>
