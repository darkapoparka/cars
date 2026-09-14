<script lang="ts">
	import PolicyTemplatePage from '$lib/components/terms/PolicyTemplatePage.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<PolicyTemplatePage {data} />
