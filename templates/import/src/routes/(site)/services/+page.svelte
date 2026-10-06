<script lang="ts">
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import ServiceCard from '$lib/components/services/ServiceCard.svelte';
	import DesktopServiceFinder from '$lib/components/services/DesktopServiceFinder.svelte';
	import MobileSearchControl from '$lib/components/common/MobileSearchControl.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import DesktopSearchControl from '$lib/components/common/DesktopSearchControl.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import DesktopServiceRequestDialog from '$lib/components/services/DesktopServiceRequestDialog.svelte';
	import type { ServiceRequestKind } from '$lib/domain/service-request';

	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const desktop = new MediaQuery('(min-width: 768px)', false);
	let requestOpen = $state(false);
	let requestKind = $state<ServiceRequestKind>('vin-check');
	let requestEntry = $state<{ kind: ServiceRequestKind; reference: string; sequence: number }>();
	let requestSequence = 0;
	let requestTrigger: HTMLElement | null = null;
	function openRequest(
		kind: ServiceRequestKind,
		event: MouseEvent | SubmitEvent,
		reference?: string
	) {
		if (
			!desktop.current ||
			event.defaultPrevented ||
			(event instanceof MouseEvent &&
				(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey))
		)
			return;
		event.preventDefault();
		requestTrigger =
			event instanceof SubmitEvent
				? ((event.submitter as HTMLElement | null) ??
					(event.currentTarget as HTMLFormElement).querySelector('button[type="submit"]'))
				: (event.currentTarget as HTMLElement);
		requestKind = kind;
		if (reference !== undefined) requestEntry = { kind, reference, sequence: ++requestSequence };
		requestOpen = true;
	}
	function restoreRequestFocus(event: Event) {
		event.preventDefault();
		if (desktop.current && requestTrigger?.isConnected)
			requestTrigger.focus({ preventScroll: true });
	}
	$effect(() => {
		if (!desktop.current) requestOpen = false;
	});
	let query = $derived(data.serviceQuery);
	let task = $derived(data.serviceTask);
	const normalizedQuery = $derived(query.trim().toLocaleLowerCase());
	const matching = $derived(
		data.services.filter((service) => {
			const detail = data.directory.details[service.id];
			return [
				service.title,
				service.description,
				detail.summary,
				detail.mobileContext,
				detail.mobileTitle,
				detail.mobileSummary,
				...detail.includes
			]
				.join(' ')
				.toLocaleLowerCase()
				.includes(normalizedQuery);
		})
	);
	const countLabel = $derived(
		matching.length === 1 ? data.directory.countSingular : data.directory.count
	);
</script>

<svelte:head
	><title>{data.directory.pageTitle} — {data.site.identity.name}</title><meta
		name="description"
		content={english
			? 'Vehicle sourcing, sales and preparation services.'
			: 'Внос, продажба и подготовка на автомобил.'}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		title={data.directory.titleDesktop}
		mobileTitle={data.directory.pageTitle}
		mobileAlign="center"
		image="/assets/daynight/services/premium-cars-banner-generated.webp"
		vehicleArtwork
		artworkPanelWidth="var(--bc-desktop-service-search-width)"
	>
		{#snippet mobileActions()}<form role="search" method="GET">
				<MobileSearchControl
					bind:value={query}
					label={data.directory.search}
					controls="service-results"
				/>
			</form>{/snippet}
		{#snippet desktopActions()}
			<DesktopServiceFinder bind:task locale={data.locale} onrequest={openRequest} />
		{/snippet}
	</PageIntro>
	<div class="site-mobile-only">
		<div class="site-container service-mobile-tools">
			<div class="service-mobile-filters" role="group" aria-label={data.directory.quickLabel}>
				{#each data.directory.quickFilters as filter (filter.query)}
					<Action
						variant={normalizedQuery === filter.query.toLocaleLowerCase() ? 'strong' : 'secondary'}
						size="compact"
						aria-pressed={normalizedQuery === filter.query.toLocaleLowerCase()}
						aria-controls="service-results"
						onclick={() => (query = filter.query)}>{filter.label}</Action
					>
				{/each}
			</div>
			<span class="sr-only" role="status">{matching.length} {countLabel}</span>
		</div>
	</div>
	<div class="site-container service-results-heading site-desktop-only">
		<h2 class="site-heading">{data.directory.title}</h2>
		<div class="service-catalogue-search">
			<form role="search" method="GET">
				<input type="hidden" name="service" value={task} />
				<DesktopSearchControl
					bind:value={query}
					name="q"
					label={data.directory.search}
					placeholder={`${data.directory.search} (${data.services.length})`}
					actionLabel={data.directory.searchAction}
					controls="service-results"
				/>
			</form>
			{#if query}<button class="service-search-clear" type="button" onclick={() => (query = '')}
					>{data.directory.clear}</button
				>{/if}
			<span class="sr-only" role="status">{matching.length} {countLabel}</span>
		</div>
	</div>
	<section
		class="site-section site-container services-grid"
		id="service-results"
		aria-label={data.directory.title}
	>
		{#each matching as service, index (service.id)}
			{@const detail = data.directory.details[service.id]}
			<ServiceCard
				{service}
				{detail}
				{english}
				priority={index < 3}
				desktop={desktop.current}
				onrequest={openRequest}
			/>
		{/each}
		{#if !matching.length}<div class="service-empty site-empty-state">
				<p>{data.directory.empty}</p>
				<Action variant="secondary" onclick={() => (query = '')}>{data.directory.clear}</Action>
			</div>{/if}
	</section>
	<section class="site-section site-container"><ContactBanner {english} /></section>
</main>
{#if desktop.current}
	<DesktopServiceRequestDialog
		bind:open={requestOpen}
		kind={requestKind}
		entry={requestEntry}
		onCloseAutoFocus={restoreRequestFocus}
	/>
{/if}

<style>
	.service-results-heading {
		align-items: center;
		gap: var(--bc-space-4);
		padding-top: var(--bc-space-6);
	}
	.service-empty {
		grid-column: 1 / -1;
		padding-block: var(--bc-space-8);
		text-align: center;
	}
	.service-empty p {
		margin: 0 0 var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	.services-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-6);
	}
	@media (max-width: 1023px) {
		.services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 768px) {
		.service-catalogue-search {
			position: relative;
			width: min(380px, 48%);
			margin-left: auto;
		}
		.service-search-clear {
			position: absolute;
			right: 0;
			top: calc(100% + 4px);
			min-height: 28px;
			padding: 0;
			border: 0;
			background: transparent;
			color: var(--bc-copy);
			font: inherit;
			font-size: var(--bc-text-label);
			text-decoration: underline;
			text-underline-offset: 3px;
			cursor: pointer;
		}
		.service-search-clear:hover {
			color: var(--bc-ink);
		}
		.service-empty p {
			margin: 0;
		}
		.service-results-heading {
			display: flex;
		}
		.services-grid {
			padding-top: var(--bc-space-4);
			gap: var(--bc-space-5);
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.services-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.service-mobile-tools {
			position: relative;
			margin-top: calc(-1 * var(--bc-space-6));
			padding-top: var(--bc-space-2);
		}
		.service-mobile-filters {
			display: flex;
			flex-wrap: nowrap;
			gap: var(--bc-space-2);
			overflow-x: auto;
			margin-inline: calc(-1 * var(--bc-mobile-gutter));
			padding: var(--bc-space-1) var(--bc-mobile-gutter);
			scroll-padding-inline: var(--bc-mobile-gutter);
			scrollbar-width: none;
		}
		.service-mobile-filters :global(.site-action) {
			flex: 0 0 auto;
			border-radius: var(--bc-radius-control);
			padding-inline: var(--bc-space-3);
			font-size: var(--bc-mobile-label);
			white-space: nowrap;
		}
		.service-mobile-filters :global(.site-action.secondary) {
			background: var(--bc-white);
		}
		.services-grid {
			grid-template-columns: 1fr;
			container: service-list / inline-size;
		}
		.service-empty p {
			font-size: var(--bc-text-body);
		}
	}
</style>
