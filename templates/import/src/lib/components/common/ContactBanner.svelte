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
	<img
		src={assetHref('/assets/daynight/banners/home-consultation-v2.webp')}
		alt=""
		width="1536"
		height="512"
		loading="lazy"
	/>
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
		place-items: center;
		min-height: 300px;
		overflow: hidden;
		border-radius: var(--bc-radius-section);
		background: var(--bc-mobile-dark);
		color: var(--bc-white);
		padding: var(--bc-space-8);
		text-align: center;
	}
	.contact-banner > img {
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
		background: rgb(9 10 11 / 0.72);
	}
	.contact-banner__copy {
		max-width: 65ch;
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
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
	}
	@media (max-width: 575px) {
		.contact-banner {
			padding: var(--bc-space-6) var(--bc-space-4);
		}
	}
</style>
