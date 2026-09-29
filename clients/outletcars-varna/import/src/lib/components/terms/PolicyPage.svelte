<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import Action from '$lib/components/common/Action.svelte';
	let {
		policy
	}: {
		policy: {
			title: string;
			intro: string;
			sections: { id: string; title: string; body: string[] }[];
		};
	} = $props();
</script>

<main id="main-content" class="site-container policy-page">
	<h1>{policy.title}</h1>
	<p class="policy-intro">{policy.intro}</p>
	{#each policy.sections as section (section.id)}
		<section id={section.id}>
			<h2>{section.title.replace(/^\d+\.\s*/, '')}</h2>
			{#each section.body as paragraph (paragraph)}<p>{paragraph}</p>{/each}
		</section>
	{/each}
	<Action href="/contact" variant="secondary">{nt('ui137')}</Action>
</main>

<style>
	.policy-page {
		max-width: var(--bc-container-narrow);
		padding-block: var(--bc-section-sm);
	}
	h1 {
		font: var(--bc-weight-heading) var(--bc-text-h2)/var(--bc-leading-h2) var(--bc-font-heading);
		margin: 0;
	}
	.policy-intro {
		font-size: var(--bc-text-body-lg);
	}
	section {
		margin-block: var(--bc-space-8);
		scroll-margin-top: var(--bc-space-8);
	}
	h2 {
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
		margin: 0 0 var(--bc-space-3);
	}
	p {
		color: var(--bc-copy);
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
	}
</style>
