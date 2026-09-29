<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import SearchField from '$lib/components/common/SearchField.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { linkHref } from '$lib/utils/links';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	let query = $derived(data.serviceQuery);
	const matching = $derived(
		data.services.filter((service) => {
			const detail = data.directory.details[service.id];
			return [service.title, service.description, ...detail.includes]
				.join(' ')
				.toLocaleLowerCase()
				.includes(query.trim().toLocaleLowerCase());
		})
	);
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
		desktopImage="/assets/daynight/banners/services-desktop-v2.webp"
		align="center"
		desktopDescription={data.directory.description}
	>
		{#snippet desktopActions()}
			<form class="service-search" role="search" method="GET">
				<SearchField bind:value={query} label={data.directory.search} controls="service-results" />
			</form>
		{/snippet}
		{#snippet desktopSecondaryActions()}
			<div class="service-quick-filters" role="group" aria-label={data.directory.quickLabel}>
				{#each data.directory.quickFilters as filter (filter.query)}
					<Action
						variant="glass"
						size="compact"
						aria-pressed={query === filter.query}
						onclick={() => (query = filter.query)}>{filter.label}</Action
					>
				{/each}
			</div>
		{/snippet}
	</PageIntro>
	<div class="site-container service-results-heading site-desktop-only">
		<h2>{data.directory.title}</h2>
		<span role="status">{matching.length} {data.directory.count}</span>
		{#if query}<Action variant="quiet" onclick={() => (query = '')}>{data.directory.clear}</Action
			>{/if}
	</div>
	<section
		class="site-section site-container services-grid"
		id="service-results"
		aria-label={data.directory.title}
	>
		{#each matching as service, index (service.id)}
			{@const detail = data.directory.details[service.id]}
			<article class="service-card">
				<a href={linkHref(detail.href)}>
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
						<ul class="service-card__includes site-desktop-only">
							{#each detail.includes as item (item)}<li>
									<Check size={18} aria-hidden="true" />{item}
								</li>{/each}
						</ul>
						<span class="service-card__cta"
							><span class="site-desktop-only">{detail.action}</span><span class="site-mobile-only"
								>{english ? 'Learn more' : 'Виж повече'}</span
							><ArrowRight size={18} aria-hidden="true" /></span
						>
					</div>
				</a>
			</article>
		{/each}
		{#if !matching.length}<div class="service-empty">
				<p>{data.directory.empty}</p>
				<Action variant="secondary" onclick={() => (query = '')}>{data.directory.clear}</Action>
			</div>{/if}
	</section>
	<section class="site-section site-container"><ContactBanner {english} /></section>
</main>

<style>
	.service-quick-filters {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.service-quick-filters :global(.site-action) {
		border-radius: var(--bc-radius-pill);
		padding-inline: var(--bc-space-4);
	}
	.service-search {
		width: 100%;
		max-width: 640px;
	}
	.service-results-heading {
		align-items: center;
		gap: var(--bc-space-4);
		padding-top: var(--bc-space-8);
	}
	.service-results-heading > span {
		color: var(--bc-copy);
		margin-left: auto;
		font-size: var(--bc-text-control);
	}
	.service-card__includes {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--bc-space-4);
		color: var(--bc-copy);
	}
	.service-card__includes li {
		display: flex;
		align-items: start;
		gap: var(--bc-space-2);
	}
	.service-card__includes :global(svg) {
		flex: none;
		margin-top: 3px;
		color: var(--bc-accent);
	}
	.service-empty {
		grid-column: 1 / -1;
		padding-block: var(--bc-space-8);
		text-align: center;
	}
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
	@media (min-width: 768px) {
		.service-results-heading {
			display: flex;
		}
		.services-grid {
			padding-top: var(--bc-space-6);
		}
		.service-card {
			border-radius: var(--bc-radius-card);
			background: var(--bc-surface);
		}
		.service-card__body {
			gap: var(--bc-space-3);
			align-items: start;
			text-align: left;
		}
		.service-card__includes {
			display: grid;
			gap: var(--bc-space-2);
		}
		.service-card__cta {
			min-height: var(--bc-control-height-standard);
			padding: var(--bc-space-2) var(--bc-space-4);
			border-radius: var(--bc-radius-md);
			background: var(--bc-ink);
			color: var(--bc-white);
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-action);
		}
		a:hover .service-card__cta {
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
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
