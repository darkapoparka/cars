<script lang="ts">
	import RawTemplatePage from '$lib/components/template/RawTemplatePage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RawTemplatePage page={data.page} />
