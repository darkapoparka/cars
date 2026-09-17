<script lang="ts">
	import { resolve } from '$app/paths';
	import { leadInfoContent } from '$lib/data/lead-content';
	import MobileLeadImageBanner from './MobileLeadImageBanner.svelte';
	let { kind, onOpen }: { kind: keyof typeof leadInfoContent; onOpen: () => void } = $props();
	const content = $derived(leadInfoContent[kind]);
</script>

<section aria-label={content.title}>
	<MobileLeadImageBanner
		title="Как работи"
		action="Виж стъпките"
		image={resolve('/assets/images/home-promos/gclass-urus-pair-v4.webp')}
		{onOpen}
	/>
</section>
