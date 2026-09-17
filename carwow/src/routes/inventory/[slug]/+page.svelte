<script lang="ts">
	import DetailPageShell from '$lib/components/detail/desktop/DetailPageShell.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<DetailPageShell page={data.page} />
