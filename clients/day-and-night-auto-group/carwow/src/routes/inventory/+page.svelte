<script lang="ts">
	import InventoryPageShell from '$lib/components/inventory/desktop/InventoryPageShell.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<InventoryPageShell page={data.page} />
