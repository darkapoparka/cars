<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let { copy }: { copy: HomePageCopy } = $props();
	const isEnglish = $derived(copy.featuredTitle === 'Newest Vehicles');
</script>

<section class="eliqauto-sell-banner" aria-labelledby="home-sell-title">
	<div class="container">
		<a class="eliqauto-sell-banner__inner" href={resolve('/sell-your-car')}>
			<div class="eliqauto-sell-banner__copy">
				<h2 id="home-sell-title">{isEnglish ? 'Sell your car' : 'Продай автомобила си'}</h2>
				<ArrowRight size={28} strokeWidth={2} aria-hidden="true" />
			</div>
			<img
				class="eliqauto-sell-banner__car"
				src="/assets/eliqauto/hero/home-hero-runway-car-white-v1.webp"
				alt=""
				width="1600"
				height="900"
				loading="lazy"
				decoding="async"
			/>
		</a>
	</div>
</section>

<style>
	.eliqauto-sell-banner {
		display: none;
	}

	@media (min-width: 768px) {
		.eliqauto-sell-banner {
			display: block;
			padding-block: 16px;
		}

		.eliqauto-sell-banner__inner {
			position: relative;
			isolation: isolate;
			display: flex;
			min-height: 234px;
			align-items: center;
			overflow: hidden;
			padding: 30px 34px;
			border-radius: 8px;
			background: #181414;
			color: #ffffff;
			text-decoration: none;
			transition: background-color var(--bc-motion-hover);
		}

		.eliqauto-sell-banner__copy {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			max-width: 56%;
			gap: 16px;
			color: inherit;
		}

		.eliqauto-sell-banner h2 {
			margin: 0;
			color: inherit;
			font-family: var(--bc-font-body);
			font-size: clamp(28px, 2.4vw, 34px);
			font-weight: 700;
			line-height: 1.1;
			letter-spacing: -0.015em;
		}

		.eliqauto-sell-banner__car {
			position: absolute;
			z-index: 0;
			right: -32px;
			top: 50%;
			transform: translateY(-62%);
			width: min(58%, 740px);
			max-width: none;
			height: auto;
			pointer-events: none;
		}

		.eliqauto-sell-banner__inner:hover {
			background: #241e1e;
			color: #ffffff;
		}

		.eliqauto-sell-banner__inner:focus-visible {
			outline: 2px solid var(--bc-accent);
			outline-offset: 4px;
		}
	}
</style>
