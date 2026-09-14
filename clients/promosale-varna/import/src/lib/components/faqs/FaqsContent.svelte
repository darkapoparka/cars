<script lang="ts">
	import type { AuxeroFaq, AuxeroFaqGroup } from '$lib/auxero/faqs';
	import FaqAccordion from './FaqAccordion.svelte';

	let {
		featured,
		groups
	}: {
		featured: AuxeroFaq[];
		groups: AuxeroFaqGroup[];
	} = $props();
</script>

<section class="pb-84" data-daynight-faqs>
	<div class="container mb-60">
		<h1 class="h2">Често задавани въпроси</h1>
		<div class="tf-spacing-style3"></div>
		<p class="h3 mb-20 text-center capitalize">Съдействие от Promosale Varna</p>
		<div class="max-width-850 mx-auto w-full">
			<FaqAccordion items={featured} forceWhite />
		</div>
	</div>
	{#each groups as group (group.title)}
		<div class="container mb-60">
			<p class="h3 mb-20 text-center capitalize">{group.title}</p>
			<div class="max-width-850 mx-auto w-full">
				<FaqAccordion items={group.items} forceWhite />
			</div>
		</div>
	{/each}
</section>

<style>
	[data-daynight-faqs] {
		background: var(--bc-bg);
	}
</style>
