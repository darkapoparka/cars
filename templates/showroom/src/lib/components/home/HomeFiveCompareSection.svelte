<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveComparePair, HomeFiveCompareVehicle } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let {
		copy,
		pairs
	}: {
		copy: HomePageCopy;
		pairs: HomeFiveComparePair[];
	} = $props();

	const featuredPairs = $derived(pairs.slice(0, 2));
</script>

{#if featuredPairs.length}
	<section class="eliqauto-home-compare py-100">
		<div class="container">
			<header class="eliqauto-home-compare__header">
				<h2>{copy.compareTitle}</h2>
				<HomeSectionCta href="/compare" label={copy.commonCta} />
			</header>

			<div class="eliqauto-home-compare__pairs">
				{#each featuredPairs as pair (`${pair.left.slug}:${pair.right.slug}`)}
					<div class="eliqauto-home-compare__pair">
						{@render vehicleCard(pair.left)}
						<span class="eliqauto-home-compare__versus" aria-hidden="true">VS</span>
						{@render vehicleCard(pair.right)}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#snippet vehicleCard(vehicle: HomeFiveCompareVehicle)}
	<a
		class="eliqauto-home-compare__vehicle"
		href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
	>
		<span class="eliqauto-home-compare__photo">
			<img
				src={vehicle.image}
				alt=""
				width="640"
				height="400"
				loading="lazy"
				decoding="async"
			/>
		</span>
		<span class="eliqauto-home-compare__body">
			<span class="eliqauto-home-compare__brand">{vehicle.brand}</span>
			<span class="eliqauto-home-compare__title">{vehicle.title}</span>
			<span class="eliqauto-home-compare__meta">
				{vehicle.stats.map((stat) => stat.value).join(' · ')}
			</span>
			<span class="eliqauto-home-compare__price">{vehicle.priceLabel}</span>
		</span>
	</a>
{/snippet}

<style>
	.eliqauto-home-compare {
		background: var(--bc-bg);
		padding-block: 68px;
	}

	.eliqauto-home-compare__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin: 0 0 22px;
		border: 1px solid #2e2e34;
		border-radius: 8px;
		background: #18181b;
		min-height: 104px;
		padding: 28px 32px;
	}

	.eliqauto-home-compare__header h2 {
		max-width: 800px;
		margin: 0;
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: 40px;
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.eliqauto-home-compare :global(.eliqauto-section-cta) {
		flex: 0 0 auto;
		min-height: 46px;
		padding-inline: 20px;
	}

	.eliqauto-home-compare__pairs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.eliqauto-home-compare__pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: stretch;
		gap: 8px;
		padding: 12px;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		background: #ffffff;
	}

	.eliqauto-home-compare__versus {
		display: inline-flex;
		align-self: center;
		width: var(--bc-touch);
		height: var(--bc-touch);
		align-items: center;
		justify-content: center;
		border: 1px solid #e4e4e7;
		border-radius: 50%;
		background: #f4f4f5;
		color: #18181b;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-micro);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.eliqauto-home-compare__vehicle {
		display: grid;
		min-width: 0;
		color: #18181b;
		text-decoration: none;
	}

	.eliqauto-home-compare__vehicle:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	.eliqauto-home-compare__photo {
		display: block;
		overflow: hidden;
		aspect-ratio: 16 / 10;
		border-radius: 8px;
		background: #f4f4f5;
	}

	.eliqauto-home-compare__photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.eliqauto-home-compare__body {
		display: grid;
		gap: 2px;
		padding: 10px 4px 4px;
	}

	.eliqauto-home-compare__brand {
		color: #52525b;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-micro);
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: 1.3;
		text-transform: uppercase;
	}

	.eliqauto-home-compare__title {
		display: -webkit-box;
		overflow: hidden;
		color: #18181b;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.28;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.eliqauto-home-compare__meta {
		overflow: hidden;
		margin-top: 4px;
		color: #52525b;
		font-size: var(--bc-text-caption);
		font-weight: 500;
		line-height: 1.35;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.eliqauto-home-compare__price {
		margin-top: 6px;
		color: #18181b;
		font-family: var(--bc-font-body);
		font-size: 18px;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.2;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 1199px) {
		.eliqauto-home-compare__pairs {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 991px) {
		.eliqauto-home-compare__header {
			padding: 20px 22px;
		}

		.eliqauto-home-compare__header h2 {
			font-size: 26px;
		}
	}

	@media (max-width: 767px) {
		.eliqauto-home-compare {
			display: none;
		}
	}
</style>
