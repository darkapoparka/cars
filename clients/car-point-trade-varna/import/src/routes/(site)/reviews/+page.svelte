<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ReviewCard from '$lib/components/reviews/ReviewCard.svelte';
	import { daynightContact } from '$lib/config/dealer';
	let { data }: PageProps = $props();
	const copy = $derived(publicPageCopy[data.locale].reviews);
</script>

<svelte:head
	><title>{copy.title} — {data.site.identity.name}</title><meta
		name="description"
		content={pageDescriptions.reviews[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={copy.title} />
	<div class="site-section site-container site-stack reviews-page">
		{#if data.sample}<p class="site-form-note">
				{copy.sampleDisclosure}
			</p>{/if}
		<div class="reviews-grid">
			{#each data.reviews as review (review.id)}<ReviewCard
					{review}
					english={data.locale === 'en'}
				/>{/each}
		</div>
		<Action href={daynightContact.reviewsHref} variant="secondary" target="_blank" rel="noreferrer"
			>{copy.facebook}</Action
		>
	</div>
</main>

<style>
	@media (min-width: 768px) {
		.reviews-page > :global(.site-action) {
			justify-self: center;
		}
	}
	.reviews-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	@media (max-width: 1023px) {
		.reviews-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.reviews-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
