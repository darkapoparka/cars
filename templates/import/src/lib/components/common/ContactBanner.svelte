<script lang="ts">
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { assetHref } from '$lib/utils/assets';
	import { site } from '$lib/config/site';
	import Action from './Action.svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import MapPin from '@lucide/svelte/icons/map-pin';
	let { english = false, title }: { english?: boolean; title?: string } = $props();
</script>

<section class="contact-banner">
	<picture>
		<source
			media="(min-width: 768px)"
			srcset={assetHref('/assets/daynight/banners/commerce-visit-desktop-v2.webp')}
		/>
		<img
			src={assetHref('/assets/daynight/banners/commerce-visit.webp')}
			srcset={`${assetHref('/assets/daynight/banners/commerce-visit-small.webp')} 360w, ${assetHref('/assets/daynight/banners/commerce-visit.webp')} 720w, ${assetHref('/assets/daynight/banners/commerce-visit-large.webp')} 1080w`}
			sizes="(max-width: 767px) calc(100vw - 28px), 1080px"
			alt=""
			width="720"
			height="405"
			loading="lazy"
		/>
	</picture>
	<div class="contact-banner__copy">
		<h2>{title ?? (english ? 'Let’s discuss your car' : 'Нека обсъдим твоя автомобил')}</h2>
		<p>
			{dealerCopy[english ? 'en' : 'bg'].address}<br />{dealerCopy[english ? 'en' : 'bg']
				.appointment}
		</p>
		<div class="contact-banner__actions">
			<Action href={site.contact.phoneHref}
				><Phone size={20} aria-hidden="true" />{site.contact.phone}</Action
			>
			<Action href={site.contact.mapHref} variant="secondary" target="_blank" rel="noreferrer"
				><MapPin size={20} aria-hidden="true" />{english ? 'Directions' : 'Как да стигнеш'}</Action
			>
		</div>
	</div>
</section>

<style>
	.contact-banner {
		position: relative;
		isolation: isolate;
		display: grid;
		align-items: center;
		min-height: 300px;
		overflow: hidden;
		border-radius: var(--bc-radius-section);
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
		padding: var(--bc-space-8);
		text-align: left;
	}
	.contact-banner picture {
		display: contents;
	}
	.contact-banner source {
		display: none;
	}
	.contact-banner img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.contact-banner::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(90deg, rgb(9 10 11 / 0.4), transparent 85%);
	}
	.contact-banner__copy {
		max-width: 58%;
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-desktop-section-title)/1.2 var(--bc-font-heading);
	}
	p {
		margin: var(--bc-space-4) 0 var(--bc-space-6);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	.contact-banner__actions {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
	}
	@media (max-width: 575px) {
		.contact-banner {
			padding: var(--bc-space-6) var(--bc-space-4);
		}
		.contact-banner__copy {
			max-width: 100%;
		}
		.contact-banner::after {
			background: rgb(9 10 11 / 0.62);
		}
	}
</style>
