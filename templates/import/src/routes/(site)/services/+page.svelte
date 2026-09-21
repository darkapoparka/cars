<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { linkHref } from '$lib/utils/links';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const hrefFor = (href: string) =>
		linkHref((href === '/services' ? '/contact' : href) + (english ? '?lang=en' : ''));
</script>

<svelte:head
	><title>{english ? 'Services' : 'Услуги'} — {data.site.identity.name}</title><meta
		name="description"
		content={english
			? 'Vehicle sourcing, sales and preparation services.'
			: 'Внос, продажба и подготовка на автомобил.'}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		title={english ? 'Services for your car' : 'Услуги за твоя автомобил'}
		image="/assets/daynight/services/premium-cars-banner-generated.webp"
		align="center"
	/>
	<section class="site-section site-container services-grid">
		{#each data.services as service, index (service.title)}
			<article class="service-card">
				<a href={linkHref(hrefFor(service.href))}>
					<img
						src={assetHref(service.image)}
						alt=""
						width="900"
						height="500"
						loading={index < 3 ? 'eager' : 'lazy'}
						decoding="async"
					/>
					<div class="service-card__body">
						<h2>{service.title}</h2>
						<p>{service.description}</p>
						<span class="service-card__cta"
							>{english ? 'Learn more' : 'Виж повече'}<ArrowRight
								size={18}
								aria-hidden="true"
							/></span
						>
					</div>
				</a>
			</article>
		{/each}
	</section>
	<section class="site-section site-container"><ContactBanner {english} /></section>
</main>

<style>
	.services-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-6);
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
	h2 {
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
	@media (max-width: 1023px) {
		.services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.services-grid {
			grid-template-columns: 1fr;
		}
		.service-card__body {
			padding: var(--bc-space-5);
		}
		p {
			font-size: var(--bc-text-body);
		}
	}
</style>
