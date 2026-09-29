<script lang="ts">
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
</script>

<svelte:head
	><title
		>{english ? 'Frequently asked questions' : 'Често задавани въпроси'} — {data.site.identity
			.name}</title
	><meta
		name="description"
		content={pageDescriptions.faqs[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={english ? 'Frequently asked questions' : 'Често задавани въпроси'} />
	<div class="site-container faq-page">
		{#each data.groups as group (group.title)}<section class="site-stack">
				<h2 class="site-heading">{group.title}</h2>
				<div class="faq-group">
					{#each group.items as item (item.question)}<details>
							<summary>{item.question}<span aria-hidden="true">+</span></summary>
							<p>{item.answer}</p>
						</details>{/each}
				</div>
			</section>{/each}
		<Action href="/contact" variant="secondary"
			>{english ? 'Ask a question' : 'Задай въпрос'}</Action
		>
	</div>
</main>

<style>
	.faq-page {
		max-width: var(--bc-container-narrow);
		display: grid;
		gap: var(--bc-space-8);
		padding-block: var(--bc-section-sm);
	}
	.faq-group {
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	details + details {
		border-top: 1px solid var(--bc-border);
	}
	summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--bc-space-4);
		padding: var(--bc-space-5);
		cursor: pointer;
		font: var(--bc-weight-heading) var(--bc-text-body-lg)/1.4 var(--bc-font-heading);
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary span {
		font-size: var(--bc-text-h4);
	}
	details[open] summary span {
		transform: rotate(45deg);
	}
	p {
		margin: 0;
		padding: 0 var(--bc-space-5) var(--bc-space-5);
		color: var(--bc-copy);
		line-height: var(--bc-leading-prose);
	}
	@media (min-width: 768px) {
		.faq-page > :global(.site-action) {
			justify-self: center;
		}
		summary {
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-entry);
		}
		p {
			font-size: var(--bc-text-prose);
		}
	}
</style>
