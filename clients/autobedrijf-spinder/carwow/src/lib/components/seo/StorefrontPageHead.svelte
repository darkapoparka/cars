<script lang="ts">
	import RouteSeo from './RouteSeo.svelte';

	let {
		title,
		scriptSrcs = [],
		description,
		ogImage,
		ogType = 'website'
	}: {
		title: string;
		scriptSrcs?: readonly string[];
		description?: string;
		ogImage?: string;
		ogType?: string;
	} = $props();
</script>

<RouteSeo {title} {description} {ogImage} {ogType} />

<svelte:head>
	{#each scriptSrcs as src (src)}
		<script defer {src}></script>
	{/each}
</svelte:head>
