<script lang="ts">
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';

	let {
		title,
		styles,
		scriptSrcs = [],
		description,
		ogImage,
		ogType = 'website'
	}: {
		title: string;
		// Optional inline head <style> block. Native storefront routes ship zero
		// legacy CSS, so they omit this; only the legacy-template catch-all
		// ([...templatePath] via RawTemplatePage) still passes an inline style block.
		styles?: string;
		scriptSrcs?: string[];
		description?: string;
		ogImage?: string;
		ogType?: string;
	} = $props();
</script>

<RouteSeo {title} {description} {ogImage} {ogType} />

<svelte:head>
	{#if styles}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted template style block extracted server-side -->
		{@html styles}
	{/if}
	{#each scriptSrcs as src (src)}
		<script defer {src}></script>
	{/each}
</svelte:head>
