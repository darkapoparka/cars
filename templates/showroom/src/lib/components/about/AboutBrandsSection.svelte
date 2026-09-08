<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutBrandCard } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	let { brands }: { brands: AuxeroAboutBrandCard[] } = $props();
</script>

<section class="about-brands" aria-label="Автомобилни марки">
	<div class="container">
		<AboutSectionHeader
			heading="Марки, с които работим"
			description="Разгледайте наличните автомобили или се свържете с нас за внос по вашите предпочитания."
		/>
		<div class="about-brands__grid">
			{#each brands as brand (brand.name)}
				<a href={resolve(brand.href as '/')} class="about-brand">
					<img src={brand.image} alt="" width="64" height="64" loading="lazy" />
					<span class="about-brand__name">{brand.name}</span><span class="about-brand__count"
						>{brand.count}</span
					>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.about-brands {
		padding-block: 36px;
	}
	.about-brands__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
	}
	.about-brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 0;
		min-height: 156px;
		padding: 20px 12px;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		background: #f5f5f6;
		color: var(--bc-ink);
		text-align: center;
	}
	.about-brand img {
		display: block;
		width: 60px;
		height: 52px;
		object-fit: contain;
		margin-bottom: 12px;
	}
	.about-brand__name {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.4;
	}
	.about-brand__count {
		margin-top: 4px;
		color: #62626b;
		font-size: 14px;
		line-height: 1.5;
	}
	.about-brand:hover {
		border-color: var(--bc-accent);
		background: #fff;
	}
	.about-brand:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.about-brands {
			padding-block: 28px;
		}
		.about-brands__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}
		.about-brand {
			min-height: 132px;
			padding: 16px 8px;
		}
		.about-brand img {
			width: 48px;
			height: 40px;
			margin-bottom: 8px;
		}
		.about-brand__name {
			font-size: 14px;
		}
		.about-brand__count {
			font-size: 13px;
		}
	}
</style>
