<script lang="ts">
	import { page } from '$app/state';
	import { assetHref } from '$lib/utils/assets';
	import { linkHref as resolve } from '$lib/utils/links';
	import { site } from '$lib/config/site';
	import { sellValuationCopy } from '$lib/content/sell-valuation';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
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
					sizes="(max-width: 767px) min(calc(40vw - 30.4px), 144px), 1px"
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
					{copy.processTitle}
				</h2>
				<p class="sell-valuation__description">{copy.processDescription}</p>
			</div>
		</div>
	</div>
	<div class="sell-valuation__guide">
		<ol aria-label={copy.howTitle}>
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
		<div class="sell-valuation__contact">
			<p>{copy.questions}</p>
			<a href={resolve(site.contact.phoneHref)}>
				<span><PhoneCall size={14} aria-hidden="true" />{copy.callAction}</span>
			</a>
		</div>
	</div>
</section>

<style>
	.sell-valuation {
		display: grid;
		overflow: hidden;
		width: 100%;
		max-width: 28rem;
		margin-inline: auto;
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.sell-valuation__card {
		overflow: hidden;
		padding: var(--bc-space-3) var(--bc-space-3) 0;
	}
	.sell-valuation__banner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) min(40%, 144px);
		gap: var(--bc-space-2);
		padding: var(--bc-space-3);
		border-radius: var(--bc-radius-card);
		background: var(--bc-ink);
	}
	.sell-valuation__content {
		display: grid;
		grid-column: 1;
		grid-row: 1;
		gap: 4px;
		align-content: center;
		justify-items: start;
		min-width: 0;
	}
	.sell-valuation .sell-valuation__title {
		color: var(--bc-white);
		font: var(--bc-weight-heading) 20px/24px var(--bc-font-body);
		letter-spacing: -0.03em;
	}
	.sell-valuation .sell-valuation__title:lang(bg) {
		font-size: clamp(18px, 5vw, 20px);
	}
	.sell-valuation picture {
		position: relative;
		display: block;
		grid-column: 2;
		grid-row: 1;
		overflow: hidden;
		min-width: 0;
		min-height: 76px;
		border-radius: var(--bc-radius-md);
	}
	.sell-valuation img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: right center;
	}
	.sell-valuation h2 {
		margin: 0;
		font: var(--bc-weight-heading) 18px/22px var(--bc-font-heading);
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
		font-size: 14px;
		line-height: 18px;
	}
	.sell-valuation__contact a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		color: var(--bc-white);
		font: var(--bc-weight-control) 14px/20px var(--bc-font-body);
		text-decoration: none;
		white-space: nowrap;
	}
	.sell-valuation__contact a > span {
		display: inline-flex;
		min-height: 32px;
		padding: 0 var(--bc-space-3);
		align-items: center;
		gap: 6px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
	}
	.sell-valuation__contact a:hover > span {
		background: var(--bc-ink-soft);
	}
	.sell-valuation__contact a:focus-visible > span {
		outline: 2px solid var(--bc-ink);
		outline-offset: 3px;
	}
	.sell-valuation__guide {
		display: grid;
		padding: var(--bc-space-4);
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
		min-width: 0;
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
	.sell-valuation__contact {
		display: flex;
		margin-top: var(--bc-space-3);
		align-items: center;
		gap: var(--bc-space-2);
	}
</style>
