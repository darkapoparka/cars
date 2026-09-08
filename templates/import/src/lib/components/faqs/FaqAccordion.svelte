<script lang="ts">
	import type { AuxeroFaq } from '$lib/auxero/faqs';
	import FaqAccordionItem from './FaqAccordionItem.svelte';

	let {
		forceWhite = false,
		items
	}: {
		forceWhite?: boolean;
		items: AuxeroFaq[];
	} = $props();
</script>

<div class="flat-accordion max-width-930 wow fadeIn flex flex-col gap-18" data-wow-delay=".3s">
	{#each items as faq, index (faq.question)}
		<FaqAccordionItem {faq} {forceWhite} open={index === 0} />
	{/each}
</div>
