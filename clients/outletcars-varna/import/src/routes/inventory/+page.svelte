<script lang="ts">
	import InventoryTemplatePage from '$lib/components/inventory/InventoryTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<InventoryTemplatePage
	cards={data.cards}
	copy={data.copy}
	desktop={data.desktop}
	mobile={data.mobile}
	pageDocument={data.pageDocument}
	seoTitle={data.seoTitle}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
/>
