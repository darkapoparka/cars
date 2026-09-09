<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutBrandCard } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { brands }: { brands: AuxeroAboutBrandCard[] } = $props();
</script>

<section class="daynight-about-brands">
	<div class="container">
		<AboutSectionHeader
			heading="Марки, с които работим"
			description="Налични автомобили и търсене по заявка от Европа според бюджет, модел и срок."
		/>

		<div class="daynight-about-brands__grid">
			{#each brands as brand, index (brand.name)}
				<a
					href={resolve(brand.href as '/')}
					class="daynight-about-brand-card out-brand-2 wow fadeInUp"
					data-wow-delay={`0.${(index % 4) + 1}s`}
				>
					<span class="daynight-about-brand-card__logo-frame">
						<img class="out-brand--img" src={brand.image} alt="" />
					</span>
					<p class="h5">{brand.name}</p>
					<p class="text-muted text-sm">{brand.count}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.daynight-about-brands {
		background: var(--bc-bg);
		padding: 42px 0 54px;
	}

	.daynight-about-brands__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.daynight-about-brand-card {
		min-height: 138px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface) !important;
		box-shadow: none !important;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}

	.daynight-about-brand-card__logo-frame {
		display: grid;
		height: 62px;
		margin-bottom: 10px;
		place-items: center;
		width: 92px;
	}

	.daynight-about-brand-card__logo-frame :global(.out-brand--img) {
		display: block;
		height: 56px !important;
		margin: 0 !important;
		max-height: 56px;
		max-width: 92px;
		object-fit: contain;
		width: 92px !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-about-brand-card:hover {
			border-color: #cbd8c1;
			background: var(--bc-surface-hover) !important;
			box-shadow: none !important;
		}
	}

	.daynight-about-brand-card :global(.text-muted) {
		color: #5a6356 !important;
	}

	@media (max-width: 1199px) {
		.daynight-about-brands__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.daynight-about-brands {
			padding: 38px 0 50px;
		}

		.daynight-about-brands :global(.title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}

		.daynight-about-brands__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
