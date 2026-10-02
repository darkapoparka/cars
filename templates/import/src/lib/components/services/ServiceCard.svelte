<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	import { imageDelivery } from '$lib/utils/image-delivery';
	import type { AuxeroSupportService } from '$lib/content/services';
	import { serviceArtwork, type ServiceDetail } from '$lib/content/service-directory';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		service,
		detail,
		english = false,
		priority = false
	}: {
		service: AuxeroSupportService;
		detail: ServiceDetail;
		english?: boolean;
		priority?: boolean;
	} = $props();
	const mobileImage = $derived(imageDelivery(service.image));
</script>

<article class="service-card">
	<a href={linkHref(detail.href)}>
		<picture>
			<source media="(min-width: 768px)" srcset={assetHref(serviceArtwork[service.id])} />
			{#if mobileImage.srcset}<source
					media="(max-width: 767.98px)"
					srcset={mobileImage.srcset}
					sizes="320px"
				/>{/if}
			<img
				src={assetHref(service.image)}
				alt=""
				width="900"
				height="500"
				loading={priority ? 'eager' : 'lazy'}
				decoding="async"
			/>
		</picture>
		<div class="service-card__body">
			<div class="service-card__heading">
				<span class="service-card__context service-card__mobile-copy">{detail.mobileContext}</span>
				<h2>
					<span class="service-card__mobile-copy">{detail.mobileTitle ?? service.title}</span><span
						class="service-card__desktop-copy"
						title={service.title}>{service.title}</span
					>
				</h2>
			</div>
			<p>
				<span class="service-card__mobile-copy">{detail.mobileSummary}</span><span
					class="service-card__desktop-copy">{detail.summary}</span
				>
			</p>
			<span class="service-card__cta"
				><span class="site-desktop-only">{detail.action}</span><span class="site-mobile-only"
					>{english ? 'Learn more' : 'Виж повече'}</span
				><ArrowRight size={18} aria-hidden="true" /></span
			>
		</div>
	</a>
</article>

<style>
	picture {
		display: contents;
	}
	source {
		display: none;
	}
	.service-card__desktop-copy {
		display: none;
	}
	.service-card__heading {
		display: contents;
	}
	.service-card {
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
	}
	.service-card > a {
		height: 100%;
		display: flex;
		flex-direction: column;
		color: var(--bc-ink);
		text-decoration: none;
	}
	.service-card img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1.8;
		object-fit: cover;
	}
	.service-card__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--bc-space-4);
		padding: var(--bc-space-6);
		text-align: center;
	}
	.service-card h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
	}
	p {
		margin: 0 0 var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	.service-card__cta {
		display: inline-flex;
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-standard);
		padding: 0 var(--bc-space-4);
		margin-top: auto;
		border-radius: var(--bc-radius-control);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-heading);
	}
	a:hover .service-card__cta {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}
	@media (min-width: 768px) {
		.service-card {
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-card);
			background: var(--bc-card-bg);
			transition:
				border-color var(--bc-motion-fast),
				box-shadow var(--bc-motion-fast);
		}
		.service-card:hover,
		.service-card:focus-within {
			border-color: var(--bc-border-strong);
			box-shadow: var(--bc-shadow-card);
		}
		.service-card__mobile-copy {
			display: none;
		}
		.service-card__desktop-copy {
			display: inline;
		}
		.service-card img {
			aspect-ratio: 16 / 9;
		}
		.service-card__body {
			align-items: start;
			gap: var(--bc-space-2);
			padding: var(--bc-space-4);
			text-align: left;
		}
		.service-card h2 {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-h6);
			line-height: var(--bc-leading-h4);
		}
		p {
			margin: 0;
			font-size: var(--bc-text-body);
			min-height: calc(2em * var(--bc-leading-body));
		}
		.service-card__cta {
			min-height: var(--bc-control-height-compact);
			align-self: start;
			padding: 0;
			background: transparent;
			color: var(--bc-accent);
			border-radius: 0;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-action);
		}
		a:hover .service-card__cta {
			background: transparent;
			color: var(--bc-accent-hover);
		}
	}
	@media (max-width: 767.98px) {
		.service-card > a {
			display: grid;
			grid-template-columns: clamp(30%, calc(100% - 13rem), 36%) minmax(0, 1fr);
			align-items: stretch;
		}
		.service-card img {
			min-height: 160px;
			height: 100%;
			aspect-ratio: auto;
			object-fit: cover;
		}
		.service-card {
			background: var(--bc-white);
			border: 1px solid var(--bc-border);
		}
		.service-card__body {
			align-items: stretch;
			text-align: left;
			padding: var(--bc-space-3);
			gap: var(--bc-space-2);
		}
		.service-card h2 {
			font-size: var(--bc-text-entry);
			line-height: 1.3;
		}
		.service-card__heading {
			display: flex;
			flex-direction: column;
			gap: var(--bc-space-1);
		}
		.service-card__context {
			color: var(--bc-copy);
			font-size: var(--bc-text-meta);
			line-height: var(--bc-leading-meta);
		}
		.service-card p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
			margin: 0;
		}
		.service-card__cta {
			align-self: start;
			justify-content: center;
			margin-top: 0;
			min-height: var(--bc-control-height-compact);
			padding: 0 var(--bc-space-3);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
			color: var(--bc-ink);
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-action);
		}
		a:hover .service-card__cta {
			background: var(--bc-control-hover);
			color: var(--bc-ink);
		}
		.service-card__cta :global(svg) {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
		}
	}
	@container service-list (width < 16rem) {
		.service-card > a {
			grid-template-columns: 1fr;
		}
		.service-card img {
			min-height: 0;
			height: auto;
			aspect-ratio: 16 / 9;
		}
		.service-card h2 {
			overflow-wrap: anywhere;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.service-card {
			transition: none;
		}
	}
</style>
