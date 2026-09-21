<script lang="ts">
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ReviewCard from '$lib/components/reviews/ReviewCard.svelte';
	import { daynightContact } from '$lib/config/dealer';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
</script>

<svelte:head
	><title>{english ? 'Customer reviews' : 'Клиентски отзиви'} — {data.site.identity.name}</title
	><meta
		name="description"
		content={pageDescriptions.reviews[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={english ? 'Customer reviews' : 'Клиентски отзиви'} />
	<div class="site-section site-container site-stack">
		{#if data.sample}<p class="site-form-note">
				{english
					? 'Sample review content for this template preview.'
					: 'Примерно съдържание за отзиви в демонстрацията.'}
			</p>{/if}
		<div class="reviews-grid">
			{#each data.reviews as review (review.id)}<ReviewCard {review} />{/each}
		</div>
		<Action href={daynightContact.reviewsHref} variant="secondary" target="_blank" rel="noreferrer"
			>{english ? 'Reviews on Facebook' : 'Отзиви във Facebook'}</Action
		>
	</div>
</main>

<style>
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
