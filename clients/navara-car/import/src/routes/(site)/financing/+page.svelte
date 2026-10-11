<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import FinanceEstimator from '$lib/components/financing/FinanceEstimator.svelte';
	import Action from '$lib/components/common/Action.svelte';
	let { data }: PageProps = $props();
	const copy = $derived(publicPageCopy[data.locale].financing);
	const english = $derived(data.locale === 'en');
	const title = $derived(copy.title);
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={copy.description}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		{title}
		image="/assets/daynight/services/evaluate-link-service.webp"
		vehicleArtwork
		compact
		artworkPanelWidth="var(--bc-desktop-action-panel-width)"
		description={copy.heroDescription}
	/>
	<section class="site-section site-container finance-page">
		<div class="finance-page__calculator">
			{#key data.initialPrice}<FinanceEstimator
					initialPrice={data.initialPrice}
					{english}
					inquiryHref={'/contact?service=financing' +
						(data.vehicleSlug ? '&vehicle=' + encodeURIComponent(data.vehicleSlug) : '') +
						(english ? '&lang=en' : '')}
				/>{/key}
		</div>
		<section class="finance-process site-stack">
			<h2 class="site-heading">
				{data.vehicleTitle ?? copy.process}
			</h2>
			<ProcessSteps steps={copy.steps} horizontal />
			<Action href={'/inventory' + (english ? '?lang=en' : '')} variant="strong"
				>{copy.browse}</Action
			>
		</section>
	</section>
</main>

<style>
	.finance-page {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--bc-section-sm);
	}
	.finance-page__calculator {
		width: min(100%, 860px);
		margin-inline: auto;
	}
	.finance-process > h2 {
		text-align: center;
	}
	.finance-process > :global(.site-action) {
		justify-self: center;
	}
</style>
