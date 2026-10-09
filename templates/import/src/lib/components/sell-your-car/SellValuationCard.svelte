<script lang="ts">
	import { page } from '$app/state';
	import { assetHref } from '$lib/utils/assets';
	import { sellValuationCopy } from '$lib/content/sell-valuation';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let { onstart, open = false }: { onstart: () => void; open?: boolean } = $props();
	const locale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const copy = $derived(sellValuationCopy[locale]);
	const banner = '/assets/daynight/services/sell-commerce';
</script>

<section class="sell-valuation" aria-labelledby="sell-valuation-title">
	<div class="sell-valuation__card">
		<div class="sell-valuation__banner">
			<picture>
				<source
					media="(max-width: 767px)"
					srcset={`${assetHref(`${banner}-small.webp`)} 360w, ${assetHref(`${banner}.webp`)} 720w, ${assetHref(`${banner}-large.webp`)} 1080w`}
					sizes="(max-width: 767px) calc(100vw - 28px), 1px"
					type="image/webp"
				/>
				<img
					src={assetHref('/assets/vehicle-placeholder.svg')}
					alt=""
					width="720"
					height="405"
					decoding="async"
					loading="eager"
					fetchpriority="high"
				/>
			</picture>
			<div class="sell-valuation__content">
				<h2 id="sell-valuation-title" class="sell-valuation__title" lang={locale}>
					{copy.sellTitle}
				</h2>
				<p class="sell-valuation__description">{copy.sellDescription}</p>
				<button
					type="button"
					aria-haspopup="dialog"
					aria-expanded={open}
					aria-describedby="sell-valuation-note"
					onclick={onstart}
				>
					{copy.sellAction}<ArrowRight size={14} aria-hidden="true" />
				</button>
			</div>
		</div>
		<small id="sell-valuation-note" class="sr-only">{copy.sellNote}</small>
	</div>
	<div class="sell-valuation__guide">
		<h2>{copy.howTitle}</h2>
		<ol>
			{#each copy.sellSteps as step, index (step.title)}
				<li>
					<span aria-hidden="true">{index + 1}</span>
					<div>
						<h3>{step.title}</h3>
						<p>{step.text}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.sell-valuation {
		display: grid;
		gap: var(--bc-space-3);
	}
	.sell-valuation__card {
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.sell-valuation__banner {
		position: relative;
		background: var(--bc-ink);
	}
	.sell-valuation__content {
		position: absolute;
		z-index: 1;
		top: var(--bc-space-4);
		left: var(--bc-space-4);
		display: grid;
		gap: 4px;
		justify-items: start;
		max-width: calc(100% - 32px);
	}
	.sell-valuation .sell-valuation__title {
		color: var(--bc-white);
		font: var(--bc-weight-heading) clamp(22px, 6.2vw, 26px)/1.15 var(--bc-font-body);
		letter-spacing: -0.03em;
		white-space: nowrap;
	}
	.sell-valuation picture {
		display: block;
	}
	.sell-valuation img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
	}
	.sell-valuation h2 {
		margin: 0;
		font: var(--bc-weight-heading) 20px/24px var(--bc-font-heading);
	}
	.sell-valuation p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
	}
	.sell-valuation .sell-valuation__description {
		max-width: 180px;
		color: rgb(255 255 255 / 0.76);
		font-size: 13px;
		line-height: 18px;
	}
	.sell-valuation button {
		display: flex;
		min-height: 44px;
		margin: 0;
		padding: 0;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--bc-white);
		font: var(--bc-weight-control) 14px/20px var(--bc-font-body);
		cursor: pointer;
	}
	.sell-valuation button:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.sell-valuation button:focus-visible {
		outline: 2px solid var(--bc-white);
		outline-offset: 3px;
	}
	.sell-valuation__guide {
		display: grid;
		gap: var(--bc-space-4);
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.sell-valuation ol {
		display: grid;
		gap: var(--bc-space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.sell-valuation li {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr);
		align-items: start;
		gap: var(--bc-space-3);
	}
	.sell-valuation li > span {
		display: grid;
		width: 28px;
		height: 28px;
		place-items: center;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-control);
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: var(--bc-weight-heading);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.sell-valuation h3 {
		margin: 0 0 4px;
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}
	.sell-valuation__guide p {
		font-size: var(--bc-mobile-label);
		line-height: var(--bc-mobile-label-leading);
	}
</style>
